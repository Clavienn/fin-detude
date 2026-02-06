"use client"

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  ArrowUpRight,
  Clock,
  Loader2,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import type { Workflow as WorkflowType } from '@/domains/models/Workflow';
import type { Produit } from '@/domains/models/Produit';
import type { Vente } from '@/domains/models/Vente';
import type { Employee } from '@/domains/models/Employee';
import type { PerfoData } from '@/domains/models/PerfoData';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // États pour les données
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [perfos, setPerfos] = useState<PerfoData[]>([]);

  // Helper pour extraire l'ID d'un objet ou string
  const extractId = (value: string | { _id?: string } | undefined): string => {
    if (!value) return '';
    return typeof value === 'string' ? value : (value._id || '');
  };

  // Chargement des données
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        
        // 1. Charger d'abord les workflows de l'utilisateur
        const workflowsData = await WorkflowRepoAPI.getByUser();
        setWorkflows(workflowsData);
        
        // 2. Créer un Set des IDs de workflows de l'utilisateur pour un filtrage rapide
        const userWorkflowIds = new Set(workflowsData.map(w => w._id));
        
        // 3. Charger toutes les autres données en parallèle
        const [produitsData, ventesData, employeesData, perfosData] = await Promise.all([
          ProduitRepoAPI.getAll(),
          VenteRepoAPI.getAll(),
          EmployeeRepoAPI.getAll(),
          PerfoDataRepoAPI.getAll()
        ]);

        // 4. Filtrer les produits par workflows de l'utilisateur
        const filteredProduits = produitsData.filter(p => 
          userWorkflowIds.has(extractId(p.workflowId))
        );
        
        // 5. Filtrer les ventes par workflows de l'utilisateur
        const filteredVentes = ventesData.filter(v => 
          userWorkflowIds.has(extractId(v.workflowId))
        );
        
        // 6. Filtrer les employés par workflows de l'utilisateur
        const filteredEmployees = employeesData.filter(e => 
          userWorkflowIds.has(extractId(e.workflowId))
        );
        
        // 7. Filtrer les performances par workflows de l'utilisateur
        const filteredPerfos = perfosData.filter(p => 
          userWorkflowIds.has(extractId(p.workflowId))
        );

        setProduits(filteredProduits);
        setVentes(filteredVentes);
        setEmployees(filteredEmployees);
        setPerfos(filteredPerfos);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Helper pour obtenir le PU d'une vente
  const getVentePU = (vente: Vente): number => {
    if (typeof vente.produitId === 'object' && vente.produitId?.pu) {
      return vente.produitId.pu;
    }
    const produitId = extractId(vente.produitId);
    const produit = produits.find(p => p._id === produitId);
    return produit?.pu || 0;
  };

  // Helper pour obtenir le nom d'un produit
  const getVenteProduitNom = (vente: Vente): string => {
    if (typeof vente.produitId === 'object' && vente.produitId?.nom) {
      return vente.produitId.nom;
    }
    const produitId = extractId(vente.produitId);
    const produit = produits.find(p => p._id === produitId);
    return produit?.nom || 'Produit inconnu';
  };

  // Calculs des statistiques
  const workflowsActifs = workflows.filter(w => w.actif).length;
  const totalCA = ventes.reduce((sum, v) => sum + (getVentePU(v) * v.qte), 0);
  const employeesActifs = employees.length;
  const produitsGeres = produits.length;

  // Données pour le graphique des ventes mensuelles
  const ventesParMois = ventes.reduce((acc: any[], vente) => {
    if (!vente.createdAt) return acc;
    const date = new Date(vente.createdAt);
    const mois = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    const ca = getVentePU(vente) * vente.qte;
    
    const existing = acc.find(item => item.mois === mois);
    if (existing) {
      existing.ventes += ca;
      existing.count += 1;
    } else {
      acc.push({ mois, ventes: ca, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => {
    const dateA = new Date(a.mois);
    const dateB = new Date(b.mois);
    return dateA.getTime() - dateB.getTime();
  }).slice(-6);

  // Données pour le graphique des performances
  const performanceParMois = perfos.reduce((acc: any[], perfo) => {
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
  }, []).sort((a, b) => a.periode.localeCompare(b.periode)).slice(-6);

  // Données pour le graphique circulaire des sources
  const sourcesData = [
    { name: 'Formulaire Web', value: ventes.filter(v => v.sourceType === 'WEBFORM').length, color: '#3b82f6' },
    { name: 'Excel', value: ventes.filter(v => v.sourceType === 'EXCEL').length, color: '#10b981' },
    { name: 'Google Sheets', value: ventes.filter(v => v.sourceType === 'GOOGLE').length, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  // Données pour l'activité des workflows
  const workflowsVente = workflows.filter(w => {
    const catCode = typeof w.categorieId === 'object' ? w.categorieId?.code : '';
    return catCode === 'VENTE';
  }).length;

  const workflowsRH = workflows.filter(w => {
    const catCode = typeof w.categorieId === 'object' ? w.categorieId?.code : '';
    return catCode === 'PERFO_EMP';
  }).length;

  // Top produits
  const topProduits = produits.map(prod => {
    const ventesProd = ventes.filter(v => {
      const prodId = extractId(v.produitId);
      return prodId === prod._id;
    });
    const totalVentes = ventesProd.reduce((sum, v) => sum + v.qte, 0);
    const ca = ventesProd.reduce((sum, v) => sum + (prod.pu * v.qte), 0);
    return {
      _id: prod._id,
      nom: prod.nom,
      ventes: totalVentes,
      ca: ca,
      nbTransactions: ventesProd.length
    };
  }).filter(p => p.ventes > 0).sort((a, b) => b.ca - a.ca).slice(0, 5);

  // Activités récentes (dernières ventes et performances)
  const recentActivities = [
    ...ventes.slice(-3).reverse().map((v, idx) => ({
      id: `vente-${idx}`,
      type: 'vente',
      message: `Nouvelle vente - ${getVenteProduitNom(v)} (x${v.qte})`,
      time: v.createdAt ? new Date(v.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue',
      icon: ShoppingCart
    })),
    ...perfos.slice(-2).reverse().map((p, idx) => {
      const empName = typeof p.employeeId === 'object' ? p.employeeId?.nom : 'Employé';
      return {
        id: `perfo-${idx}`,
        type: 'performance',
        message: `Performance ajoutée pour ${empName} (Score: ${p.score})`,
        time: p.periode,
        icon: TrendingUp
      };
    })
  ].slice(0, 5);

  const stats = [
    {
      title: 'Workflows Actifs',
      value: workflowsActifs.toString(),
      change: `${workflows.length} total`,
      trend: 'up' as const,
      icon: Workflow,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Chiffre d\'Affaires',
      value: `${totalCA.toFixed(2)} €`,
      change: `${ventes.length} ventes`,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Employés Actifs',
      value: employeesActifs.toString(),
      change: `${perfos.length} évaluations`,
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Produits Gérés',
      value: produitsGeres.toString(),
      change: `${produits.filter(p => p.actif).length} actifs`,
      trend: 'up' as const,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord  </h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos workflows</p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-2">
          <Activity className="w-4 h-4 mr-2" />
          Données en temps réel
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-600">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventes Mensuelles */}
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d'Affaires Mensuel</CardTitle>
            <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            {ventesParMois.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventesParMois}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                  <Legend />
                  <Bar dataKey="ventes" fill="#3b82f6" name="CA (€)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée de vente disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score de Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Score de Performance Moyen</CardTitle>
            <CardDescription>Évolution par période</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceParMois.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceParMois}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Score moyen"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée de performance disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sources de Données */}
        <Card>
          <CardHeader>
            <CardTitle>Sources de Données</CardTitle>
            <CardDescription>Répartition des ventes par source</CardDescription>
          </CardHeader>
          <CardContent>
            {sourcesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée source disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Répartition des Workflows */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Workflows</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Workflows Ventes</span>
                </div>
                <Badge variant="secondary" className="text-lg px-4">
                  {workflowsVente}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="font-medium">Workflows RH</span>
                </div>
                <Badge variant="secondary" className="text-lg px-4">
                  {workflowsRH}
                </Badge>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <Badge className="text-lg px-4">
                    {workflows.length}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Produits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Produits</CardTitle>
            <CardDescription>Performances des meilleures ventes</CardDescription>
          </CardHeader>
          <CardContent>
            {topProduits.length > 0 ? (
              <div className="space-y-4">
                {topProduits.map((produit, index) => (
                  <div key={produit._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{produit.nom}</p>
                        <p className="text-sm text-gray-600">{produit.ventes} unités vendues</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg text-green-600">{produit.ca.toFixed(2)} €</p>
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Aucune vente enregistrée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activités Récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
            <CardDescription>Dernières actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="p-2 rounded-full bg-gray-100">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Aucune activité récente
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;