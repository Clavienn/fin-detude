"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingUp, BarChart3, Loader2, Sparkles } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeeList from './rh/EmployeeList';
import PerformanceList from './rh/PerformanceList';
import VisualisationPerfo from './rh/VisualisationPerfo';
import PredictionPerfo from './rh/modal/perfo/PredictionPerfo';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI';
import type { Employee } from '@/domains/models/Employee';
import type { PerfoData } from '@/domains/models/PerfoData';
import type { Workflow } from '@/domains/models/Workflow';

const GestionEmployees = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [perfos, setPerfos] = useState<PerfoData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!workflowId) return;

    try {
      setLoading(true);

      const [workflowData, employeesData, perfosData] = await Promise.all([
        WorkflowRepoAPI.getById(workflowId),
        EmployeeRepoAPI.getByWorkflow(workflowId),
        PerfoDataRepoAPI.getByWorkflow(workflowId)
      ]);

      setWorkflow(workflowData);
      setEmployees(employeesData);
      setPerfos(perfosData);
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

  // Calcul de la moyenne des scores
  const averageScore = perfos.length > 0
    ? (perfos.reduce((sum, p) => sum + p.score, 0) / perfos.length).toFixed(1)
    : '0';

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
              {workflow?.nom || 'Gestion RH'}
            </h1>
            <p className="text-gray-600 mt-1">Gestion des employés et performances</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 border-blue-200">
              <Users className="w-4 h-4 mr-2" />
              {employees.length} Employé{employees.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-green-50 border-green-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Score Moyen: {averageScore}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="employees" className="gap-2">
            <Users className="w-4 h-4" />
            Employés ({employees.length})
          </TabsTrigger>
          <TabsTrigger value="performances" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Performances ({perfos.length})
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

        <TabsContent value="employees" className="mt-6">
          <EmployeeList />
        </TabsContent>

        <TabsContent value="performances" className="mt-6">
          <PerformanceList />
        </TabsContent>

        <TabsContent value="visualisation" className="mt-6">
          <VisualisationPerfo />
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <PredictionPerfo />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default GestionEmployees;