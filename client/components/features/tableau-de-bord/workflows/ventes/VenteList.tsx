"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ShoppingCart, Filter, Calendar, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ModalAddVente } from './Modal/vente/ModalAdd';
import { ModalUpdateVente } from './Modal/vente/ModalUpdate';
import { ModalDeleteVente } from './Modal/vente/ModalDelete';
import type { Produit } from '@/domains/models/Produit';
import type { Vente } from '@/domains/models/Vente';
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import { useParams } from 'next/navigation';

const VenteList = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;  
  
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVente, setSelectedVente] = useState<Vente | null>(null);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterProduit, setFilterProduit] = useState<string>('all');

  const loadVentes = async () => {
    if (!workflowId) return;
    
    try {
      setLoading(true);
      const [ventesData, produitsData] = await Promise.all([
        VenteRepoAPI.getByWorkflow(workflowId),
        ProduitRepoAPI.getByWorkflow(workflowId)
      ]);
      setVentes(ventesData);
      setProduits(produitsData);
    } catch (error) {
      console.error("Erreur lors du chargement des ventes:", error);
      alert("Une erreur est survenue lors du chargement des ventes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVentes();
  }, [workflowId]);

  const onRefresh = () => {
    loadVentes();
  };

  const handleAddSuccess = () => {
    onRefresh();
    setIsAddOpen(false);
  };

  const handleUpdateSuccess = () => {
    onRefresh();
    setIsUpdateOpen(false);
    setSelectedVente(null);
  };

  const handleDeleteSuccess = () => {
    onRefresh();
    setIsDeleteOpen(false);
    setSelectedVente(null);
  };

  const openUpdateModal = (vente: Vente) => {
    setSelectedVente(vente);
    setIsUpdateOpen(true);
  };

  const openDeleteModal = (vente: Vente) => {
    setSelectedVente(vente);
    setIsDeleteOpen(true);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'WEBFORM': return 'bg-blue-100 text-blue-700';
      case 'EXCEL': return 'bg-green-100 text-green-700';
      case 'GOOGLE': return 'bg-orange-100 text-orange-700';
      default: return '';
    }
  };

  const filteredVentes = ventes.filter(v => {
    const produitId = typeof v.produitId === 'string' ? v.produitId : v.produitId?._id;
    const sourceMatch = filterSource === 'all' || v.sourceType === filterSource;
    const produitMatch = filterProduit === 'all' || produitId === filterProduit;
    return sourceMatch && produitMatch;
  });

  const totalCA = filteredVentes.reduce((sum, v) => {
    const produitId = typeof v.produitId === 'string' ? v.produitId : v.produitId?._id;
    const produit = produits.find(p => p._id === produitId);
    return sum + (produit ? produit.pu * v.qte : 0);
  }, 0);

  const totalQte = filteredVentes.reduce((sum, v) => sum + v.qte, 0);

  const getProduitName = (vente: Vente) => {
    if (typeof vente.produitId === 'object' && vente.produitId?.nom) {
      return vente.produitId.nom;
    }
    const produit = produits.find(p => p._id === vente.produitId);
    return produit?.nom || '-';
  };

  const getProduitPU = (vente: Vente) => {
    if (typeof vente.produitId === 'object' && vente.produitId?.pu) {
      return vente.produitId.pu;
    }
    const produitId = typeof vente.produitId === 'string' ? vente.produitId : vente.produitId?._id;
    const produit = produits.find(p => p._id === produitId);
    return produit?.pu || 0;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Liste des Ventes
                </CardTitle>
                <CardDescription>Consultez et gérez les ventes</CardDescription>
              </div>

              <div className='flex gap-2'>
                {/* <Button onClick={()=>console.log("Hello") } variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer Excel Vente
                </Button> */}
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Vente
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sources</SelectItem>
                  <SelectItem value="WEBFORM">Formulaire Web</SelectItem>
                  <SelectItem value="EXCEL">Excel</SelectItem>
                  <SelectItem value="GOOGLE">Google Sheets</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProduit} onValueChange={setFilterProduit}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les produits</SelectItem>
                  {produits.map((produit) => (
                    <SelectItem key={produit._id} value={produit._id}>
                      {produit.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterSource !== 'all' || filterProduit !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setFilterSource('all');
                    setFilterProduit('all');
                  }}
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVentes.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {ventes.length === 0 
                  ? 'Aucune vente pour le moment' 
                  : 'Aucune vente correspondant aux filtres'}
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Enregistrer une vente
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  {filteredVentes.length} vente{filteredVentes.length > 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {totalQte} unité{totalQte > 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
                  CA: {totalCA.toFixed(2)} €
                </Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVentes.map((vente) => {
                    const montant = getProduitPU(vente) * vente.qte;
                    
                    return (
                      <TableRow key={vente._id} className="hover:bg-gray-50">
                        <TableCell className="font-semibold">
                          {getProduitName(vente)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {vente.qte}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getSourceBadgeColor(vente.sourceType)}>
                            {vente.sourceType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {vente.createdAt ? new Date(vente.createdAt).toLocaleDateString('fr-FR') : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-green-600 text-lg">
                          {montant.toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openUpdateModal(vente)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteModal(vente)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {workflowId && (
        <ModalAddVente 
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSuccess={handleAddSuccess}
          produits={produits}
          workflowId={workflowId}
          userId="" // À remplir avec l'userId du contexte
        />
      )}

      {selectedVente && (
        <>
          <ModalUpdateVente 
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            onSuccess={handleUpdateSuccess}
            vente={selectedVente}
            produits={produits}
          />

          <ModalDeleteVente 
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onSuccess={handleDeleteSuccess}
            vente={selectedVente}
          />
        </>
      )}
    </>
  );
};

export default VenteList;