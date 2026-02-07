"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
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
import type { Formation, FormationAnalyse } from '@/domains/models/Formation';

interface VisualisationFormationProps {
  formations: Formation[];
  analyse: FormationAnalyse | null;
}

const VisualisationFormation: React.FC<VisualisationFormationProps> = ({ formations, analyse }) => {
  // Données pour le graphique en barres - Participants
  const participantsData = formations.map(f => ({
    titre: f.titre.length > 20 ? f.titre.substring(0, 20) + '...' : f.titre,
    prevus: f.participantsPrevus || 0,
    reels: f.participantsReels || 0,
  }));

  // Données pour le graphique en ligne - Taux de réussite
  const reussiteData = formations.map(f => ({
    titre: f.titre.length > 20 ? f.titre.substring(0, 20) + '...' : f.titre,
    taux: f.tauxReussite || 0,
  }));

  // Données pour le graphique en donut - Participation globale
  const participationRate = analyse?.tauxParticipation || 0;
  const participationData = [
    { name: 'Participation', value: participationRate, color: '#22c55e' },
    { name: 'Absence', value: 100 - participationRate, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Formations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyse?.totalFormations || 0}</div>
            <p className="text-xs text-muted-foreground">Formations enregistrées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants prévus</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyse?.participantsPrevusTotal || 0}</div>
            <p className="text-xs text-muted-foreground">Total attendu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux participation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyse?.tauxParticipation?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analyse?.participantsReelsTotal || 0} participants réels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux réussite moyen</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyse?.tauxReussiteMoyen?.toFixed(1) || 0}%
            </div>
            <Badge 
              variant="outline" 
              className={
                (analyse?.tauxReussiteMoyen || 0) >= 70 
                  ? "bg-green-100 text-green-700" 
                  : "bg-orange-100 text-orange-700"
              }
            >
              {(analyse?.tauxReussiteMoyen || 0) >= 70 ? 'Bon niveau' : 'À améliorer'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {formations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique en barres - Participants */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Participants par formation</CardTitle>
              <CardDescription>Comparaison prévus vs réels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={participantsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="titre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="prevus" fill="#3b82f6" name="Participants prévus" />
                  <Bar dataKey="reels" fill="#22c55e" name="Participants réels" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique en donut - Participation globale */}
          <Card>
            <CardHeader>
              <CardTitle>Participation globale</CardTitle>
              <CardDescription>Taux de présence</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique en ligne - Taux de réussite */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Taux de réussite</CardTitle>
              <CardDescription>Performance par formation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={reussiteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="titre" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="taux" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    name="Taux de réussite (%)"
                    dot={{ r: 6 }}
                    fill="#a855f7"
                    fillOpacity={0.1}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Aucune donnée à visualiser</p>
            <p className="text-sm">Ajoutez des formations pour voir les graphiques</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualisationFormation;