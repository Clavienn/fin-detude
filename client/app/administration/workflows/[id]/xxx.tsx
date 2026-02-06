"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import GestionVente from '@/components/features/tableau-de-bord/workflows/GestionVentes';
import GestionEmployees from '@/components/features/tableau-de-bord/workflows/GestionEmployee';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Layouts from '@/components/layouts/admin/Layouts';

// Données statiques pour simulation
const workflowsData = {
  '1': { _id: '1', nom: 'Workflow Ventes Q1', categorieCode: 'VENTE' },
  '2': { _id: '2', nom: 'Performance Équipe Dev', categorieCode: 'PERFO_EMP' },
};

export default function WorkflowDetailsPage() {
  const params = useParams();
  const workflowId = params?.id as string;

  // Récupérer le workflow (simulé)
  const workflow = workflowsData[workflowId as keyof typeof workflowsData];

  if (!workflow) {
    return (
      <Layouts>
        <div className="container mx-auto p-6 max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p>Workflow introuvable</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layouts>
    );
  }

  return (
    <Layouts>
      <div className="container mx-auto p-6 max-w-7xl">
        {workflow.categorieCode === 'VENTE' ? (
          <GestionVente workflowId={workflow._id} workflowNom={workflow.nom} />
        ) : workflow.categorieCode === 'PERFO_EMP' ? (
          <GestionEmployees workflowId={workflow._id} workflowNom={workflow.nom} />
        ) : (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <p>Catégorie de workflow non supportée</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layouts>
  );
}