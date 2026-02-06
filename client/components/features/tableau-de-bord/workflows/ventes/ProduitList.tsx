"use client"

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import type { Produit } from '@/domains/models/Produit';
import { useParams } from 'next/navigation';
import ModalAddProduit from './Modal/produit/ModalAdd';
import ModalUpdateProduit from './Modal/produit/ModalUpdate';
import ModalDeleteProduit from './Modal/produit/ModalDelete';
import ModalImportExcel from './Modal/produit/ModalImportExcel';

const ListProduit = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const loadProduits = async () => {
    setIsLoading(true);
    try {
      const response = await ProduitRepoAPI.getByWorkflow(workflowId);
      setProduits(response);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProduits();
  }, []);

  const handleEdit = (produit: Produit) => {
    setSelectedProduit(produit);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (produit: Produit) => {
    setSelectedProduit(produit);
    setIsDeleteModalOpen(true);
  };

  const handleAddSuccess = (newProduit: Produit) => {
    setProduits([...produits, newProduit]);
    setIsAddModalOpen(false);
  };

  const handleUpdateSuccess = (updatedProduit: Produit) => {
    setProduits(produits.map(p => p._id === updatedProduit._id ? updatedProduit : p));
    setIsUpdateModalOpen(false);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    setProduits(produits.filter(p => p._id !== deletedId));
    setIsDeleteModalOpen(false);
  };

  const handleImportSuccess = () => {
    loadProduits();
    setIsImportModalOpen(false);
  };

  const produitsActifs = produits.filter(p => p.actif).length;
  const totalValue = produits.reduce((sum, p) => sum + p.pu, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Liste des Produits
                </CardTitle>
                <CardDescription>Gérez les produits de ce workflow</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer Excel
                </Button>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Produit
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : produits.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun produit pour le moment</p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le premier produit
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Total: {produits.length} produit{produits.length > 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {produitsActifs} actif{produitsActifs > 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-sm bg-blue-50">
                  Valeur totale: {totalValue.toFixed(2)} €
                </Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Prix Unitaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produits.map((produit) => (
                    <TableRow key={produit._id} className="hover:bg-gray-50">
                      <TableCell className="font-semibold">{produit.nom}</TableCell>
                      <TableCell>
                        {produit.reference ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {produit.reference}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {produit.pu.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge variant={produit.actif ? 'default' : 'secondary'}>
                          {produit.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(produit)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(produit)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      <ModalAddProduit
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        workflowId={workflowId}
      />

      <ModalUpdateProduit
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        produit={selectedProduit}
      />

      <ModalDeleteProduit
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        produit={selectedProduit}
      />

      <ModalImportExcel
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
        workflowId={workflowId}
      />
    </>
  );
};

export default ListProduit;