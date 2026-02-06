"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Package, Target, Sparkles, AlertCircle, Euro } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import { useParams } from 'next/navigation';
import type { Vente } from '@/domains/models/Vente';
import type { Produit } from '@/domains/models/Produit';

interface VenteParPeriode {
  periode: string;
  quantite: number;
  ca: number;
}

const VentePrediction = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [ventes, setVentes] = useState<Vente[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<string>('all');
  const [predictionPeriod, setPredictionPeriod] = useState<string>('3');

  useEffect(() => {
    const loadData = async () => {
      if (!workflowId) return;

      try {
        const [ventesData, produitsData] = await Promise.all([
          VenteRepoAPI.getByWorkflow(workflowId),
          ProduitRepoAPI.getByWorkflow(workflowId)
        ]);
        setVentes(ventesData);
        setProduits(produitsData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };

    loadData();
  }, [workflowId]);

  const getProduitId = (vente: Vente): string => {
    return typeof vente.produitId === 'string' ? vente.produitId : vente.produitId?._id || '';
  };

  const getProduitPU = (vente: Vente): number => {
    if (typeof vente.produitId === 'object' && vente.produitId?.pu) {
      return vente.produitId.pu;
    }
    const produitId = getProduitId(vente);
    const produit = produits.find(p => p._id === produitId);
    return produit?.pu || 0;
  };

  // Filtrer les ventes
  const filteredVentes = selectedProduit === 'all' 
    ? ventes 
    : ventes.filter(v => getProduitId(v) === selectedProduit);

  // Grouper par mois
  const groupByMonth = (ventes: Vente[]): VenteParPeriode[] => {
    const grouped = new Map<string, { quantite: number; ca: number }>();

    ventes.forEach(vente => {
      if (!vente.createdAt) return;
      
      const date = new Date(vente.createdAt);
      const periode = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const pu = getProduitPU(vente);
      const ca = pu * vente.qte;

      if (grouped.has(periode)) {
        const existing = grouped.get(periode)!;
        existing.quantite += vente.qte;
        existing.ca += ca;
      } else {
        grouped.set(periode, { quantite: vente.qte, ca });
      }
    });

    return Array.from(grouped.entries())
      .map(([periode, data]) => ({ periode, ...data }))
      .sort((a, b) => a.periode.localeCompare(b.periode));
  };

  const historicalData = groupByMonth(filteredVentes);

  // Calculer la tendance (régression linéaire)
  const calculateTrend = (data: VenteParPeriode[], metric: 'quantite' | 'ca') => {
    if (data.length < 2) return 0;

    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    data.forEach((item, index) => {
      const x = index;
      const y = item[metric];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  };

  // Générer les prédictions
  const generatePredictions = () => {
    if (historicalData.length < 2) return [];

    const trendQte = calculateTrend(historicalData, 'quantite');
    const trendCA = calculateTrend(historicalData, 'ca');
    const lastData = historicalData[historicalData.length - 1];
    
    const predictions = [];
    const monthsToPredict = parseInt(predictionPeriod);

    // Ajouter les données historiques
    const historical = historicalData.map(d => ({
      periode: d.periode,
      quantite: d.quantite,
      ca: d.ca,
      type: 'historique'
    }));

    // Générer les prédictions futures
    for (let i = 1; i <= monthsToPredict; i++) {
      const predictedQte = Math.max(0, lastData.quantite + (trendQte * i));
      const predictedCA = Math.max(0, lastData.ca + (trendCA * i));
      
      const [year, month] = lastData.periode.split('-').map(Number);
      const futureDate = new Date(year, month - 1 + i);
      const futurePeriod = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;

      predictions.push({
        periode: futurePeriod,
        quantitePrediction: parseFloat(predictedQte.toFixed(0)),
        caPrediction: parseFloat(predictedCA.toFixed(2)),
        type: 'prédiction'
      });
    }

    return [...historical, ...predictions];
  };

  const chartData = generatePredictions();
  const trendCA = calculateTrend(historicalData, 'ca');
  
  const currentAvgQte = historicalData.length > 0 
    ? historicalData.reduce((sum, d) => sum + d.quantite, 0) / historicalData.length 
    : 0;
  
  const currentAvgCA = historicalData.length > 0 
    ? historicalData.reduce((sum, d) => sum + d.ca, 0) / historicalData.length 
    : 0;

  const finalPrediction = chartData.length > 0 && chartData[chartData.length - 1].type === 'prédiction'
    ? chartData[chartData.length - 1]
    : null;

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend < -0.5) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getTrendText = (trend: number) => {
    if (trend > 0.5) return 'En croissance';
    if (trend < -0.5) return 'En baisse';
    return 'Stable';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0.5) return 'bg-green-100 text-green-700 border-green-200';
    if (trend < -0.5) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRecommendation = () => {
    if (!finalPrediction) return null;

    const caVariation = ((finalPrediction.caPrediction! - currentAvgCA) / currentAvgCA) * 100;

    if (caVariation >= 20) {
      return {
        type: 'success',
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Forte croissance prévue',
        message: `Le chiffre d'affaires devrait augmenter de ${caVariation.toFixed(1)}%. Excellente dynamique commerciale !`
      };
    } else if (caVariation >= 5) {
      return {
        type: 'info',
        icon: <Target className="w-5 h-5" />,
        title: 'Croissance modérée',
        message: `Progression attendue de ${caVariation.toFixed(1)}%. Continuez vos efforts commerciaux.`
      };
    } else if (caVariation >= -5) {
      return {
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Stagnation',
        message: 'Les ventes devraient stagner. Envisagez de nouvelles actions commerciales.'
      };
    } else {
      return {
        type: 'error',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Baisse attendue',
        message: `Diminution prévue de ${Math.abs(caVariation).toFixed(1)}%. Action urgente requise.`
      };
    }
  };

  const recommendation = getRecommendation();

  if (historicalData.length < 2) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Données insuffisantes
            </h3>
            <p className="text-gray-600">
              Au moins 2 mois de ventes sont nécessaires pour générer des prédictions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Paramètres de Prédiction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produit
              </label>
              <Select value={selectedProduit} onValueChange={setSelectedProduit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les produits</SelectItem>
                  {produits.map((prod) => (
                    <SelectItem key={prod._id} value={prod._id}>
                      {prod.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Horizon de prédiction
              </label>
              <Select value={predictionPeriod} onValueChange={setPredictionPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 mois</SelectItem>
                  <SelectItem value="3">3 mois</SelectItem>
                  <SelectItem value="6">6 mois</SelectItem>
                  <SelectItem value="12">1 an</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">CA Moyen Mensuel</div>
            <div className="text-3xl font-bold text-blue-600">
              {currentAvgCA.toFixed(0)} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">CA Prédit ({predictionPeriod} mois)</div>
            <div className="text-3xl font-bold text-purple-600">
              {finalPrediction?.caPrediction?.toFixed(0) || 0} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Tendance CA</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getTrendColor(trendCA)}>
                <span className="flex items-center gap-1">
                  {getTrendIcon(trendCA)}
                  {getTrendText(trendCA)}
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Variation Prévue</div>
            <div className={`text-3xl font-bold ${trendCA > 0 ? 'text-green-600' : trendCA < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {trendCA > 0 ? '+' : ''}{finalPrediction ? (finalPrediction.caPrediction! - currentAvgCA).toFixed(0) : 0} €
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de prédiction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="w-5 h-5" />
              Chiffre d'Affaires
            </CardTitle>
            <CardDescription>
              Historique et projection du CA mensuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCAPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="periode" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.periode}</p>
                          <p className={`text-sm ${data.type === 'prédiction' ? 'text-purple-600' : 'text-blue-600'}`}>
                            CA: {(data.caPrediction || data.ca)?.toFixed(2)} €
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{data.type}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="ca"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorCA)"
                  name="CA Historique"
                />
                <Area
                  type="monotone"
                  dataKey="caPrediction"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorCAPred)"
                  name="CA Prédit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quantités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Quantités Vendues
            </CardTitle>
            <CardDescription>
              Historique et projection des volumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorQte" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQtePred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="periode" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.periode}</p>
                          <p className={`text-sm ${data.type === 'prédiction' ? 'text-amber-600' : 'text-green-600'}`}>
                            Qté: {data.quantitePrediction || data.quantite}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{data.type}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="quantite"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorQte)"
                  name="Qté Historique"
                />
                <Area
                  type="monotone"
                  dataKey="quantitePrediction"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorQtePred)"
                  name="Qté Prédite"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommandation */}
      {recommendation && (
        <Alert className={
          recommendation.type === 'success' ? 'border-green-500 bg-green-50' :
          recommendation.type === 'info' ? 'border-blue-500 bg-blue-50' :
          recommendation.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
          'border-red-500 bg-red-50'
        }>
          <div className="flex items-start gap-3">
            <div className={
              recommendation.type === 'success' ? 'text-green-600' :
              recommendation.type === 'info' ? 'text-blue-600' :
              recommendation.type === 'warning' ? 'text-yellow-600' :
              'text-red-600'
            }>
              {recommendation.icon}
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">{recommendation.title}</h4>
              <AlertDescription>{recommendation.message}</AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Détails de l'analyse */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse Détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Nombre de mois analysés</span>
              <span className="font-semibold">{historicalData.length}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Quantité moyenne mensuelle</span>
              <span className="font-semibold">{currentAvgQte.toFixed(0)} unités</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">CA minimum historique</span>
              <span className="font-semibold">{Math.min(...historicalData.map(d => d.ca)).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">CA maximum historique</span>
              <span className="font-semibold">{Math.max(...historicalData.map(d => d.ca)).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Pente de tendance CA (par mois)</span>
              <span className="font-semibold">{trendCA.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
              <span className="text-blue-900 font-medium">CA prédit à {predictionPeriod} mois</span>
              <span className="font-bold text-blue-600">{finalPrediction?.caPrediction?.toFixed(2) || 0} €</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VentePrediction;