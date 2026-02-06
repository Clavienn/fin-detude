"use client"
import React from 'react';
import { Workflow, Brain, BarChart3, Shield, Zap, FileText, Users, Cloud, GitBranch, Search, Bell, Lock, FileCheck, TrendingUp, Boxes, Settings, Sparkles, Database, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeaturesPage() {
  const features = [
    {
      id: "etl-automatise",
      icon: Workflow,
      title: "ETL Automatisé",
      category: "Gestion des Données",
      color: "bg-blue-500",
      description: "Pipelines d'extraction, transformation et chargement entièrement automatisés avec planification avancée",
      actions: [
        "Créer et configurer des workflows ETL",
        "Planifier des tâches récurrentes",
        "Surveiller l'exécution en temps réel",
        "Gérer les erreurs et les reprises automatiques"
      ]
    },
    {
      id: "integration-multi-sources",
      icon: Cloud,
      title: "Intégration Multi-sources",
      category: "Gestion des Données",
      color: "bg-blue-500",
      description: "Connectez facilement vos bases de données, APIs, fichiers et services cloud",
      actions: [
        "Connecter des sources de données variées",
        "Synchroniser en temps réel",
        "Mapper automatiquement les schémas",
        "Gérer les credentials de manière sécurisée"
      ]
    },
    {
      id: "qualite-donnees",
      icon: FileCheck,
      title: "Qualité des Données",
      category: "Gestion des Données",
      color: "bg-blue-500",
      description: "Validation, nettoyage et enrichissement automatique de vos données",
      actions: [
        "Définir des règles de validation",
        "Détecter et supprimer les doublons",
        "Corriger automatiquement les erreurs",
        "Enrichir les données avec des sources externes"
      ]
    },
    {
      id: "versioning-donnees",
      icon: GitBranch,
      title: "Versioning des Données",
      category: "Gestion des Données",
      color: "bg-blue-500",
      description: "Historique complet et traçabilité de toutes les modifications",
      actions: [
        "Consulter l'historique complet",
        "Restaurer des versions antérieures",
        "Comparer les changements entre versions",
        "Auditer tous les accès et modifications"
      ]
    },
    {
      id: "analyse-ia",
      icon: Brain,
      title: "Analyse IA Avancée",
      category: "Intelligence Artificielle",
      color: "bg-purple-500",
      description: "Machine learning et deep learning pour des insights prédictifs",
      actions: [
        "Créer des modèles d'apprentissage",
        "Entraîner l'IA sur vos données",
        "Faire des prédictions en temps réel",
        "Optimiser les performances des modèles"
      ]
    },
    {
      id: "detection-anomalies",
      icon: TrendingUp,
      title: "Détection d'Anomalies",
      category: "Intelligence Artificielle",
      color: "bg-purple-500",
      description: "Identification automatique des patterns anormaux et alertes en temps réel",
      actions: [
        "Configurer les seuils de détection",
        "Recevoir des alertes instantanées",
        "Analyser les causes racines",
        "Créer des rapports d'incidents"
      ]
    },
    {
      id: "analyse-exploratoire",
      icon: Search,
      title: "Analyse Exploratoire",
      category: "Intelligence Artificielle",
      color: "bg-purple-500",
      description: "Outils puissants pour explorer et comprendre vos données",
      actions: [
        "Explorer visuellement les datasets",
        "Créer des segments personnalisés",
        "Analyser les corrélations",
        "Générer des insights automatiques"
      ]
    },
    {
      id: "recommandations-intelligentes",
      icon: Sparkles,
      title: "Recommandations Intelligentes",
      category: "Intelligence Artificielle",
      color: "bg-purple-500",
      description: "Suggestions automatiques basées sur l'IA pour optimiser vos processus",
      actions: [
        "Obtenir des recommandations personnalisées",
        "Appliquer les suggestions d'optimisation",
        "Mesurer l'impact des changements",
        "Affiner les algorithmes de recommandation"
      ]
    },
    {
      id: "tableaux-bord",
      icon: BarChart3,
      title: "Tableaux de Bord Interactifs",
      category: "Visualisation",
      color: "bg-green-500",
      description: "Créez des dashboards dynamiques avec drag-and-drop",
      actions: [
        "Créer des dashboards personnalisés",
        "Personnaliser les widgets et graphiques",
        "Partager les vues avec l'équipe",
        "Exporter les rapports en PDF/Excel"
      ]
    },
    {
      id: "rapports-automatises",
      icon: FileText,
      title: "Rapports Automatisés",
      category: "Visualisation",
      color: "bg-green-500",
      description: "Génération et distribution automatique de rapports personnalisés",
      actions: [
        "Créer des templates de rapports",
        "Planifier les envois automatiques",
        "Personnaliser le contenu dynamique",
        "Gérer les listes de destinataires"
      ]
    },
    {
      id: "visualisations-temps-reel",
      icon: Zap,
      title: "Visualisations en Temps Réel",
      category: "Visualisation",
      color: "bg-green-500",
      description: "Graphiques et métriques mis à jour en temps réel",
      actions: [
        "Connecter des flux de données en direct",
        "Configurer les intervalles de rafraîchissement",
        "Définir des KPIs critiques",
        "Créer des alertes visuelles"
      ]
    },
    {
      id: "bibliotheque-visualisations",
      icon: Boxes,
      title: "Bibliothèque de Visualisations",
      category: "Visualisation",
      color: "bg-green-500",
      description: "Plus de 50 types de graphiques et visualisations personnalisables",
      actions: [
        "Choisir parmi 50+ types de graphiques",
        "Personnaliser les styles et couleurs",
        "Appliquer des filtres dynamiques",
        "Créer et sauvegarder des templates"
      ]
    },
  ];

  const categories = [
    { name: "Gestion des Données", color: "bg-blue-500" },
    { name: "Intelligence Artificielle", color: "bg-purple-500" },
    { name: "Visualisation", color: "bg-green-500" },
    { name: "Collaboration & Sécurité", color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            Toutes les Fonctionnalités
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Actions Disponibles sur DATANOVA
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Découvrez toutes les actions que vous pouvez effectuer sur notre plateforme. Chaque fonctionnalité possède un ID unique pour une navigation facile.
          </p>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
              <div className={`h-3 w-3 rounded-full ${cat.color}`} />
              <span className="text-sm font-medium text-slate-700">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => (
            <Card 
              key={feature.id} 
              id={feature.id}
              className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 scroll-mt-24"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                      <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="mb-3 text-xs">
                        {feature.category}
                      </Badge>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                    <LinkIcon className="h-3 w-3" />
                    #{feature.id}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Actions disponibles :
                  </p>
                  <div className="space-y-2">
                    {feature.actions.map((action, actionIdx) => (
                      <div 
                        key={actionIdx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                      >
                        <div className={`h-2 w-2 rounded-full ${feature.color} mt-1.5 flex-shrink-0`} />
                        <span className="text-sm text-slate-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-16 p-6 bg-white rounded-xl shadow-lg border-2">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Navigation Rapide</h3>
          <p className="text-sm text-slate-600 mb-4">
            Utilisez les ID ci-dessous pour accéder directement à une fonctionnalité spécifique dans l&apos;URL : 
            <code className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs">#id-fonctionnalite</code>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature) => (
              <a 
                key={feature.id}
                 id={feature.id}
                href={`#${feature.id}`}
                className="px-3 py-2 text-xs font-mono bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded transition-colors text-slate-700 hover:text-blue-700"
              >
                #{feature.id}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}