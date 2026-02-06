"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, ShoppingCart, ChartBarBig, Loader2, Sparkles } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProduitList from './ventes/ProduitList';
import VenteList from './ventes/VenteList';
import VisualisationVente from './ventes/VisualisationVente';
import VentePrediction from './ventes/Modal/vente/VentePrediction';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI';
import type { Produit } from '@/domains/models/Produit';
import type { Vente } from '@/domains/models/Vente';
import type { Workflow } from '@/domains/models/Workflow';

const GestionVente = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!workflowId) return;

    try {
      setLoading(true);
      
      const [workflowData, produitsData, ventesData] = await Promise.all([
        WorkflowRepoAPI.getById(workflowId),
        ProduitRepoAPI.getByWorkflow(workflowId),
        VenteRepoAPI.getByWorkflow(workflowId)
      ]);

      setWorkflow(workflowData);
      setProduits(produitsData);
      setVentes(ventesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      alert("Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [workflowId]);

  const getProduitPU = (vente: Vente) => {
    if (typeof vente.produitId === 'object' && vente.produitId?.pu) {
      return vente.produitId.pu;
    }
    const produitId = typeof vente.produitId === 'string' ? vente.produitId : vente.produitId?._id;
    const produit = produits.find(p => p._id === produitId);
    return produit?.pu || 0;
  };

  const totalVentes = ventes.reduce((sum, v) => {
    const pu = getProduitPU(v);
    return sum + (pu * v.qte);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux workflows
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {workflow?.nom || 'Gestion Ventes'}
            </h1>
            <p className="text-gray-600 mt-1">Gestion des produits et ventes</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2 bg-green-50 text-green-700 border-green-200">
            <ShoppingCart className="w-4 h-4 mr-2" />
            CA Total: {totalVentes.toFixed(2)} €
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="produits" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="produits" className="gap-2">
            <Package className="w-4 h-4" />
            Produits ({produits.length})
          </TabsTrigger>
          <TabsTrigger value="ventes" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Ventes ({ventes.length})
          </TabsTrigger>
          <TabsTrigger value="visualisation" className="gap-2">
            <ChartBarBig className="w-4 h-4" />
            Visualisation
          </TabsTrigger>
          <TabsTrigger value="prediction" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Prédiction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="produits" className="mt-6">
          <ProduitList />
        </TabsContent>

        <TabsContent value="ventes" className="mt-6">
          <VenteList />
        </TabsContent>

        <TabsContent value="visualisation" className="mt-6">
          <VisualisationVente />
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <VentePrediction />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default GestionVente;