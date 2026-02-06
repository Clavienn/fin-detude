"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingCart, DollarSign, Award, TrendingDown, Loader2 } from 'lucide-react';
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
  AreaChart,
  Area,
} from 'recharts';
import { useParams } from 'next/navigation';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import type { Produit } from '@/domains/models/Produit';
import type { Vente } from '@/domains/models/Vente';

const VisualisationVente = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [produits, setProduits] = useState<Produit[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!workflowId) return;

      try {
        setLoading(true);
        const [produitsData, ventesData] = await Promise.all([
          ProduitRepoAPI.getByWorkflow(workflowId),
          VenteRepoAPI.getByWorkflow(workflowId)
        ]);
        setProduits(produitsData);
        setVentes(ventesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [workflowId]);

  // Helper pour obtenir l'ID du produit
  const getProduitId = (vente: Vente): string => {
    return typeof vente.produitId === 'string' ? vente.produitId : vente.produitId?._id || '';
  };

  // Helper pour obtenir le PU du produit
  const getProduitPU = (vente: Vente): number => {
    if (typeof vente.produitId === 'object' && vente.produitId?.pu) {
      return vente.produitId.pu;
    }
    const produitId = getProduitId(vente);
    const produit = produits.find(p => p._id === produitId);
    return produit?.pu || 0;
  };

  // Calculs des KPIs
  const totalCA = ventes.reduce((sum, v) => {
    const pu = getProduitPU(v);
    return sum + (pu * v.qte);
  }, 0);

  const totalQte = ventes.reduce((sum, v) => sum + v.qte, 0);
  const panierMoyen = ventes.length > 0 ? totalCA / ventes.length : 0;

  // Données ventes par produit
  const ventesProduit = produits.map(prod => {
    const venteProd = ventes.filter(v => getProduitId(v) === prod._id);
    const qte = venteProd.reduce((sum, v) => sum + v.qte, 0);
    const ca = qte * prod.pu;
    return {
      nom: prod.nom,
      quantite: qte,
      ca: ca,
      nbVentes: venteProd.length
    };
  }).filter(item => item.quantite > 0)
    .sort((a, b) => b.ca - a.ca);

  // Données par source
  const sourcesData = [
    { name: 'Formulaire Web', value: ventes.filter(v => v.sourceType === 'WEBFORM').length, color: '#3b82f6' },
    { name: 'Excel', value: ventes.filter(v => v.sourceType === 'EXCEL').length, color: '#10b981' },
    { name: 'Google Sheets', value: ventes.filter(v => v.sourceType === 'GOOGLE').length, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  // CA par source
  const caParSource = [
    { 
      source: 'Web', 
      ca: ventes.filter(v => v.sourceType === 'WEBFORM').reduce((sum, v) => {
        const pu = getProduitPU(v);
        return sum + (pu * v.qte);
      }, 0)
    },
    { 
      source: 'Excel', 
      ca: ventes.filter(v => v.sourceType === 'EXCEL').reduce((sum, v) => {
        const pu = getProduitPU(v);
        return sum + (pu * v.qte);
      }, 0)
    },
    { 
      source: 'Google', 
      ca: ventes.filter(v => v.sourceType === 'GOOGLE').reduce((sum, v) => {
        const pu = getProduitPU(v);
        return sum + (pu * v.qte);
      }, 0)
    },
  ].filter(item => item.ca > 0);

  // Évolution temporelle
  const evolutionData = ventes.reduce((acc: any[], vente) => {
    const date = vente.createdAt ? new Date(vente.createdAt).toLocaleDateString('fr-FR') : 'N/A';
    const existing = acc.find(item => item.date === date);
    const pu = getProduitPU(vente);
    const ca = pu * vente.qte;
    
    if (existing) {
      existing.ca += ca;
      existing.quantite += vente.qte;
      existing.nbVentes += 1;
    } else {
      acc.push({ 
        date: date, 
        ca: ca,
        quantite: vente.qte,
        nbVentes: 1
      });
    }
    return acc;
  }, []).sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('');
    const dateB = b.date.split('/').reverse().join('');
    return dateA.localeCompare(dateB);
  });

  const meilleurProduit = ventesProduit.length > 0 ? ventesProduit[0] : null;
  const pireProduit = ventesProduit.length > 0 ? ventesProduit[ventesProduit.length - 1] : null;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (ventes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-24">
          <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">Aucune donnée disponible</p>
          <p className="text-sm text-gray-500">Commencez par ajouter des ventes pour voir les statistiques</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Tableau de Bord des Ventes</CardTitle>
          <CardDescription>Analyse et visualisation des performances commerciales</CardDescription>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chiffre d&apos;Affaires</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">{totalCA.toFixed(2)} €</h3>
                <Badge variant="outline" className="mt-2 bg-green-50">
                  {ventes.length} vente{ventes.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unités Vendues</p>
                <h3 className="text-3xl font-bold mt-2">{totalQte}</h3>
                <Badge variant="outline" className="mt-2">
                  Sur {produits.length} produit{produits.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Panier Moyen</p>
                <h3 className="text-3xl font-bold mt-2 text-purple-600">{panierMoyen.toFixed(2)} €</h3>
                <Badge variant="outline" className="mt-2">
                  Par transaction
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits Actifs</p>
                <h3 className="text-3xl font-bold mt-2">{produits.filter(p => p.actif).length}</h3>
                <Badge variant="outline" className="mt-2">
                  Catalogue
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution CA */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du Chiffre d&apos;Affaires</CardTitle>
            <CardDescription>CA par date</CardDescription>
          </CardHeader>
          <CardContent>
            {evolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="ca" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                    name="CA (€)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ventes par source */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Source</CardTitle>
            <CardDescription>Nombre de ventes par canal</CardDescription>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top produits par CA */}
        <Card>
          <CardHeader>
            <CardTitle>Performances par Produit</CardTitle>
            <CardDescription>CA généré par produit</CardDescription>
          </CardHeader>
          <CardContent>
            {ventesProduit.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventesProduit} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nom" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ca" fill="#3b82f6" name="CA (€)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>

        {/* CA par source */}
        <Card>
          <CardHeader>
            <CardTitle>CA par Source</CardTitle>
            <CardDescription>Chiffre d&apos;affaires par canal</CardDescription>
          </CardHeader>
          <CardContent>
            {caParSource.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={caParSource}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ca" fill="#10b981" name="CA (€)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top et Flop produits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produit */}
        {meilleurProduit && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Award className="w-5 h-5" />
                Meilleur Produit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-green-900">{meilleurProduit.nom}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">CA Généré</p>
                    <p className="text-xl font-bold text-green-600">{meilleurProduit.ca.toFixed(2)} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantité</p>
                    <p className="text-xl font-bold">{meilleurProduit.quantite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ventes</p>
                    <p className="text-xl font-bold">{meilleurProduit.nbVentes}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flop Produit */}
        {pireProduit && ventesProduit.length > 1 && (
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <TrendingDown className="w-5 h-5" />
                Produit à Booster
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-orange-900">{pireProduit.nom}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">CA Généré</p>
                    <p className="text-xl font-bold text-orange-600">{pireProduit.ca.toFixed(2)} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantité</p>
                    <p className="text-xl font-bold">{pireProduit.quantite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ventes</p>
                    <p className="text-xl font-bold">{pireProduit.nbVentes}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par Produit</CardTitle>
          <CardDescription>Analyse complète des performances</CardDescription>
        </CardHeader>
        <CardContent>
          {ventesProduit.length > 0 ? (
            <div className="space-y-4">
              {ventesProduit.map((item, index) => (
                <div 
                  key={index}
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
                      <p className="font-semibold text-lg">{item.nom}</p>
                      <p className="text-sm text-gray-600">{item.quantite} unité{item.quantite > 1 ? 's' : ''} vendues</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{item.ca.toFixed(2)} €</p>
                    <Badge variant="outline">{item.nbVentes} transaction{item.nbVentes > 1 ? 's' : ''}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualisationVente;