"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, TrendingUp, TrendingDown, RefreshCw, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FormationRepoAPI } from '@/infrastructures/repository/FormationRepoAPI';
import type { FormationPrediction } from '@/domains/models/Formation';

const PredictionFormation = () => {
  const [prediction, setPrediction] = useState<FormationPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FormationRepoAPI.predictParticipation();
      setPrediction(data);
    } catch (err: any) {
      console.error("Erreur lors de la prédiction:", err);
      setError(err.message || "Une erreur est survenue lors de la prédiction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrediction();
  }, []);

  const getPredictionStatus = () => {
    if (!prediction) return null;
    
    const rate = prediction.tauxParticipationPrevu;
    if (rate >= 80) return { color: 'green', label: 'Excellent', icon: CheckCircle2 };
    if (rate >= 70) return { color: 'blue', label: 'Bon', icon: TrendingUp };
    if (rate >= 50) return { color: 'yellow', label: 'Moyen', icon: AlertCircle };
    return { color: 'red', label: 'Faible', icon: TrendingDown };
  };

  const status = getPredictionStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Prédiction de Participation
              </CardTitle>
              <CardDescription className="mt-2">
                Analyse prédictive basée sur l'historique des formations
              </CardDescription>
            </div>
            <Button onClick={loadPrediction} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : prediction ? (
            <div className="space-y-6">
              {/* Résultat principal */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg border border-purple-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Taux de participation prévu</p>
                  <div className="text-6xl font-bold text-purple-600 mb-4">
                    {prediction.tauxParticipationPrevu}%
                  </div>
                  {status && (
                    <Badge 
                      variant="outline" 
                      className={`text-lg px-4 py-2 ${
                        status.color === 'green' ? 'bg-green-100 text-green-700 border-green-300' :
                        status.color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                        'bg-red-100 text-red-700 border-red-300'
                      }`}
                    >
                      {React.createElement(status.icon, { className: "w-5 h-5 mr-2 inline" })}
                      {status.label}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Interprétation */}
              <Card className="border-2 border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg">Interprétation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className={
                    prediction.tauxParticipationPrevu >= 70 
                      ? "bg-green-50 border-green-200" 
                      : "bg-orange-50 border-orange-200"
                  }>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-semibold">
                      {prediction.interpretation}
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      {prediction.tauxParticipationPrevu >= 70 ? (
                        <span>
                          Les formations précédentes montrent un bon engagement des participants. 
                          Continuez sur cette lancée en maintenant la qualité et la pertinence des contenus.
                        </span>
                      ) : (
                        <span>
                          Le taux de participation historique suggère des points d'amélioration possibles : 
                          communication, planning, contenu, ou accessibilité des formations.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Recommandations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    Recommandations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {prediction.tauxParticipationPrevu >= 70 ? (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Maintenez la qualité actuelle de vos formations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Capitalisez sur les retours positifs pour attirer de nouveaux participants</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Envisagez d'augmenter la capacité d'accueil pour répondre à la demande</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Améliorez la communication autour des formations (objectifs, bénéfices)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Revoyez les horaires et dates pour mieux s'adapter aux disponibilités</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Collectez des feedbacks pour identifier les freins à la participation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Proposez des formats variés (présentiel, distanciel, hybride)</span>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Méthodologie */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-700">Méthodologie</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p>
                    Cette prédiction est calculée sur la base du taux de participation moyen 
                    de l'ensemble de vos formations précédentes (ratio participants réels / participants prévus). 
                    Elle constitue un indicateur tendanciel pour anticiper la participation future.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucune prédiction disponible</p>
              <p className="text-sm">Veuillez actualiser les données</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionFormation;