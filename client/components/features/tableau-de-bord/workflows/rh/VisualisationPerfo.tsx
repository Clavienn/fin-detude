"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, Target, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useParams } from 'next/navigation';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import type { Employee } from '@/domains/models/Employee';
import type { PerfoData } from '@/domains/models/PerfoData';

const VisualisationPerfo = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [perfos, setPerfos] = useState<PerfoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      if (!workflowId) return;

      try {
        setLoading(true);
        const [employeesData, perfosData] = await Promise.all([
          EmployeeRepoAPI.getByWorkflow(workflowId),
          PerfoDataRepoAPI.getByWorkflow(workflowId)
        ]);
        setEmployees(employeesData);
        setPerfos(perfosData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workflowId]);

  // Helper pour obtenir l'ID de l'employé
  const getEmployeeId = (perfo: PerfoData): string => {
    return typeof perfo.employeeId === 'string' ? perfo.employeeId : perfo.employeeId?._id || '';
  };

  // Filtrer les performances selon l'employé sélectionné
  const filteredPerfos = selectedEmployee === 'all' 
    ? perfos 
    : perfos.filter(p => getEmployeeId(p) === selectedEmployee);

  // Calculs des statistiques
  const avgScore = filteredPerfos.length > 0 
    ? filteredPerfos.reduce((sum, p) => sum + p.score, 0) / filteredPerfos.length 
    : 0;

  const maxScore = filteredPerfos.length > 0 
    ? Math.max(...filteredPerfos.map(p => p.score)) 
    : 0;

  const minScore = filteredPerfos.length > 0 
    ? Math.min(...filteredPerfos.map(p => p.score)) 
    : 0;

  const excellentCount = filteredPerfos.filter(p => p.score >= 90).length;

  // Données pour le graphique d'évolution par période
  const evolutionData = filteredPerfos.reduce((acc: any[], perfo) => {
    const existing = acc.find(item => item.periode === perfo.periode);
    if (existing) {
      existing.scores.push(perfo.score);
      existing.avgScore = existing.scores.reduce((a: number, b: number) => a + b, 0) / existing.scores.length;
    } else {
      acc.push({ 
        periode: perfo.periode, 
        scores: [perfo.score],
        avgScore: perfo.score 
      });
    }
    return acc;
  }, []).sort((a, b) => a.periode.localeCompare(b.periode));

  // Données pour le classement des employés
  const employeeScores = employees.map(emp => {
    const empPerfos = perfos.filter(p => getEmployeeId(p) === emp._id);
    const avgEmpScore = empPerfos.length > 0 
      ? empPerfos.reduce((sum, p) => sum + p.score, 0) / empPerfos.length 
      : 0;
    return {
      nom: emp.nom,
      score: avgEmpScore,
      count: empPerfos.length,
      _id: emp._id
    };
  }).filter(e => e.count > 0).sort((a, b) => b.score - a.score);

  // Données pour la répartition des niveaux
  const niveauxData = [
    { name: 'Excellent (90-100)', value: filteredPerfos.filter(p => p.score >= 90).length, color: '#10b981' },
    { name: 'Bon (75-89)', value: filteredPerfos.filter(p => p.score >= 75 && p.score < 90).length, color: '#3b82f6' },
    { name: 'Moyen (60-74)', value: filteredPerfos.filter(p => p.score >= 60 && p.score < 75).length, color: '#f59e0b' },
    { name: 'Faible (0-59)', value: filteredPerfos.filter(p => p.score < 60).length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Données pour le radar des compétences
  const competencesData = filteredPerfos.reduce((acc: any[], perfo) => {
    if (perfo.tache) {
      const existing = acc.find(item => item.tache === perfo.tache);
      if (existing) {
        existing.scores.push(perfo.score);
        existing.avgScore = existing.scores.reduce((a: number, b: number) => a + b, 0) / existing.scores.length;
      } else {
        acc.push({ 
          tache: perfo.tache, 
          scores: [perfo.score],
          avgScore: perfo.score 
        });
      }
    }
    return acc;
  }, []).slice(0, 6);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (perfos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-24">
          <TrendingUp className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">Aucune donnée disponible</p>
          <p className="text-sm text-gray-500">Commencez par ajouter des performances pour voir les statistiques</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tableau de Bord des Performances</CardTitle>
              <CardDescription>Visualisation et analyse des données</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEmployee !== 'all' && (
                <button
                  onClick={() => setSelectedEmployee('all')}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score Moyen</p>
                <h3 className="text-3xl font-bold mt-2">{avgScore.toFixed(1)}</h3>
                <Badge variant="outline" className="mt-2">
                  Sur {filteredPerfos.length} évaluations
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meilleur Score</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">{maxScore}</h3>
                <Badge variant="outline" className="mt-2 bg-green-50">
                  Excellence
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
                <h3 className="text-3xl font-bold mt-2">{employeeScores.length}</h3>
                <Badge variant="outline" className="mt-2">
                  {excellentCount} excellents
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Écart</p>
                <h3 className="text-3xl font-bold mt-2">{(maxScore - minScore).toFixed(0)}</h3>
                <Badge variant="outline" className="mt-2">
                  Max - Min
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des scores */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Scores</CardTitle>
            <CardDescription>Performance moyenne par période</CardDescription>
          </CardHeader>
          <CardContent>
            {evolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Score moyen"
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Répartition des niveaux */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Niveaux</CardTitle>
            <CardDescription>Distribution des performances</CardDescription>
          </CardHeader>
          <CardContent>
            {niveauxData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={niveauxData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {niveauxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Classement des employés */}
        <Card>
          <CardHeader>
            <CardTitle>Classement des Employés</CardTitle>
            <CardDescription>Score moyen par employé</CardDescription>
          </CardHeader>
          <CardContent>
            {employeeScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeeScores} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="nom" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="score" 
                    fill="#10b981" 
                    name="Score moyen"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Radar des compétences */}
        {competencesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analyse par Tâche</CardTitle>
              <CardDescription>Scores moyens par type de tâche</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={competencesData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="tache" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar 
                    name="Score moyen" 
                    dataKey="avgScore" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Performers */}
      {employeeScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Les {Math.min(5, employeeScores.length)} meilleurs employés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeeScores.slice(0, 5).map((emp, index) => (
                <div 
                  key={emp._id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{emp.nom}</p>
                      <p className="text-sm text-gray-600">{emp.count} évaluation{emp.count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{emp.score.toFixed(1)}</p>
                    <Badge variant={emp.score >= 90 ? 'default' : 'secondary'} className={emp.score >= 90 ? 'bg-green-600' : ''}>
                      {emp.score >= 90 ? 'Excellent' : emp.score >= 75 ? 'Bon' : 'Moyen'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualisationPerfo;