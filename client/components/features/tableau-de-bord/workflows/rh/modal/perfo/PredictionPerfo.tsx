"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, User, Target, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import { useParams } from 'next/navigation';
import type { PerfoData } from '@/domains/models/PerfoData';
import type { Employee } from '@/domains/models/Employee';

const PredictionPerfo = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [perfos, setPerfos] = useState<PerfoData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [predictionPeriod, setPredictionPeriod] = useState<string>('3'); // mois

  useEffect(() => {
    const loadData = async () => {
      if (!workflowId) return;

      try {
        const [perfosData, employeesData] = await Promise.all([
          PerfoDataRepoAPI.getByWorkflow(workflowId),
          EmployeeRepoAPI.getByWorkflow(workflowId)
        ]);
        setPerfos(perfosData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };

    loadData();
  }, [workflowId]);

  const getEmployeeId = (perfo: PerfoData): string => {
    return typeof perfo.employeeId === 'string' ? perfo.employeeId : perfo.employeeId?._id || '';
  };

  const getEmployeeName = (perfo: PerfoData): string => {
    if (typeof perfo.employeeId === 'object' && perfo.employeeId?.nom) {
      return perfo.employeeId.nom;
    }
    const employee = employees.find(e => e._id === getEmployeeId(perfo));
    return employee?.nom || 'Employé inconnu';
  };

  // Filtrer les performances
  const filteredPerfos = selectedEmployee === 'all' 
    ? perfos 
    : perfos.filter(p => getEmployeeId(p) === selectedEmployee);

  // Trier par période (date)
  const sortedPerfos = [...filteredPerfos].sort((a, b) => 
    a.periode.localeCompare(b.periode)
  );

  // Calculer la tendance (régression linéaire simple)
  const calculateTrend = (data: PerfoData[]) => {
    if (data.length < 2) return 0;

    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    data.forEach((perfo, index) => {
      const x = index;
      const y = perfo.score;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    // Pente de la droite de régression: m = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  };

  // Générer les prédictions
  const generatePredictions = () => {
    if (sortedPerfos.length < 2) return [];

    const trend = calculateTrend(sortedPerfos);
    const lastScore = sortedPerfos[sortedPerfos.length - 1].score;
    const lastPeriod = sortedPerfos[sortedPerfos.length - 1].periode;
    
    const predictions = [];
    const monthsToPredict = parseInt(predictionPeriod);

    // Ajouter les données historiques
    const historicalData = sortedPerfos.map(p => ({
      periode: p.periode,
      score: p.score,
      type: 'historique'
    }));

    // Générer les prédictions futures
    for (let i = 1; i <= monthsToPredict; i++) {
      const predictedScore = Math.min(100, Math.max(0, lastScore + (trend * i)));
      
      // Générer la période future
      const [year, month] = lastPeriod.split('-').map(Number);
      const futureDate = new Date(year, month - 1 + i);
      const futurePeriod = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;

      predictions.push({
        periode: futurePeriod,
        score: parseFloat(predictedScore.toFixed(1)),
        scorePrediction: parseFloat(predictedScore.toFixed(1)),
        type: 'prédiction'
      });
    }

    return [...historicalData, ...predictions];
  };

  const chartData = generatePredictions();
  const trend = calculateTrend(sortedPerfos);
  const currentAverage = sortedPerfos.length > 0 
    ? sortedPerfos.reduce((sum, p) => sum + p.score, 0) / sortedPerfos.length 
    : 0;

  // Prédiction finale (dans X mois)
  const finalPrediction = chartData.length > 0 
    ? chartData[chartData.length - 1].scorePrediction || chartData[chartData.length - 1].score 
    : 0;

  const getTrendIcon = () => {
    if (trend > 0.5) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend < -0.5) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getTrendText = () => {
    if (trend > 0.5) return 'En amélioration';
    if (trend < -0.5) return 'En baisse';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (trend > 0.5) return 'bg-green-100 text-green-700 border-green-200';
    if (trend < -0.5) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRecommendation = () => {
    if (finalPrediction >= 90) {
      return {
        type: 'success',
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Excellent parcours prévu',
        message: 'La performance devrait rester excellente. Continuez sur cette lancée !'
      };
    } else if (finalPrediction >= 75) {
      return {
        type: 'info',
        icon: <Target className="w-5 h-5" />,
        title: 'Bonne trajectoire',
        message: 'Performance satisfaisante prévue. Quelques améliorations possibles pour atteindre l\'excellence.'
      };
    } else if (finalPrediction >= 60) {
      return {
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Attention requise',
        message: 'La performance pourrait stagner. Envisagez un plan d\'amélioration.'
      };
    } else {
      return {
        type: 'error',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Intervention recommandée',
        message: 'Performance faible prévue. Un accompagnement est nécessaire.'
      };
    }
  };

  const recommendation = getRecommendation();

  if (sortedPerfos.length < 2) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Données insuffisantes
            </h3>
            <p className="text-gray-600">
              Au moins 2 évaluations de performance sont nécessaires pour générer des prédictions.
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
                <User className="w-4 h-4" />
                Employé
              </label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés (moyenne)</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.nom}
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
            <div className="text-sm text-gray-600 mb-1">Score Actuel Moyen</div>
            <div className="text-3xl font-bold text-blue-600">
              {currentAverage.toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Prédiction dans {predictionPeriod} mois</div>
            <div className="text-3xl font-bold text-purple-600">
              {finalPrediction.toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Tendance</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getTrendColor()}>
                <span className="flex items-center gap-1">
                  {getTrendIcon()}
                  {getTrendText()}
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 mb-1">Variation Prévue</div>
            <div className={`text-3xl font-bold ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {trend > 0 ? '+' : ''}{(finalPrediction - currentAverage).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de prédiction */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution et Prédiction des Performances</CardTitle>
          <CardDescription>
            Historique et projection basée sur la régression linéaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHistorique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="periode" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.periode}</p>
                        <p className={`text-sm ${data.type === 'prédiction' ? 'text-purple-600' : 'text-blue-600'}`}>
                          Score: {data.scorePrediction || data.score}
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
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorHistorique)"
                name="Historique"
              />
              <Area
                type="monotone"
                dataKey="scorePrediction"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#colorPrediction)"
                name="Prédiction"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommandation */}
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

      {/* Détails de l'analyse */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse Détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Nombre d'évaluations analysées</span>
              <span className="font-semibold">{sortedPerfos.length}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Score minimum historique</span>
              <span className="font-semibold">{Math.min(...sortedPerfos.map(p => p.score))}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Score maximum historique</span>
              <span className="font-semibold">{Math.max(...sortedPerfos.map(p => p.score))}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Pente de tendance (par mois)</span>
              <span className="font-semibold">{trend.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
              <span className="text-blue-900 font-medium">Score prédit à {predictionPeriod} mois</span>
              <span className="font-bold text-blue-600">{finalPrediction.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionPerfo;