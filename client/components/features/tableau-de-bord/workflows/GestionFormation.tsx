"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, TrendingUp, BarChart3, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormationList from './rh/FormList';
import VisualisationFormation from './rh/VisualFormation';
import PredictionFormation from './rh/PredictionFormation';
import { FormationRepoAPI } from '@/infrastructures/repository/FormationRepoAPI';
import type { Formation, FormationAnalyse } from '@/domains/models/Formation';

const GestionFormation = () => {
  const router = useRouter();

  const [formations, setFormations] = useState<Formation[]>([]);
  const [analyse, setAnalyse] = useState<FormationAnalyse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [formationsData, analyseData] = await Promise.all([
        FormationRepoAPI.getAll(),
        FormationRepoAPI.analyse()
      ]);

      setFormations(formationsData);
      setAnalyse(analyseData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      alert("Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          Retour
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Formations
            </h1>
            <p className="text-gray-600 mt-1">Suivi et analyse des formations</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 border-blue-200">
              <BookOpen className="w-4 h-4 mr-2" />
              {analyse?.totalFormations || 0} Formation{(analyse?.totalFormations || 0) > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-green-50 border-green-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Taux Participation: {analyse?.tauxParticipation?.toFixed(1) || 0}%
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-purple-50 border-purple-200">
              Réussite: {analyse?.tauxReussiteMoyen?.toFixed(1) || 0}%
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="formations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="formations" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Formations ({formations.length})
          </TabsTrigger>
          <TabsTrigger value="visualisation" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Visualisation
          </TabsTrigger>
          <TabsTrigger value="prediction" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Prédiction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formations" className="mt-6">
          <FormationList formations={formations} onUpdate={loadData} />
        </TabsContent>

        <TabsContent value="visualisation" className="mt-6">
          <VisualisationFormation formations={formations} analyse={analyse} />
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <PredictionFormation />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default GestionFormation;