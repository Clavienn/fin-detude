"use client"
import React from 'react';
import { ShoppingCart, DollarSign, GraduationCap, Users, Target, TrendingUp, BarChart3, CheckCircle, AlertCircle, Zap, Award, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DomainsPage() {
  const domains = [
    {
      id: "sales",
      icon: ShoppingCart,
      title: "Ventes & Commerce",
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-green-600",
      description: "Optimisez vos performances commerciales avec une analyse approfondie de vos données de vente",
      analyses: [
        {
          name: "Analyse des Actifs",
          description: "Suivi détaillé des actifs circulants et immobilisés de l'entreprise",
          metrics: ["Stocks", "Créances clients", "Trésorerie", "Immobilisations"]
        },
        {
          name: "Analyse des Passifs",
          description: "Gestion des dettes et obligations financières de l'entreprise",
          metrics: ["Dettes fournisseurs", "Emprunts", "Capitaux propres", "Provisions"]
        },
        {
          name: "Prévisions de Ventes",
          description: "Projections basées sur l'historique et les tendances saisonnières",
          metrics: ["Prévisions mensuelles", "Tendances produits", "Saisonnalité", "Croissance attendue"]
        },
        {
          name: "Analyse des Canaux de Distribution",
          description: "Performance comparée des différents canaux de vente",
          metrics: ["ROI par canal", "Coût d'acquisition", "Taux de rétention", "Cross-selling"]
        }
      ],
      objectives: [
        "Augmenter le chiffre d'affaires de 20-30%",
        "Améliorer le taux de conversion de 15%",
        "Identifier les produits à fort potentiel",
        "Optimiser la stratégie de pricing"
      ],
      results: [
        "Visibilité complète sur les performances commerciales",
        "Décisions basées sur des données précises",
        "Identification rapide des opportunités de croissance",
        "Réduction des stocks dormants de 25%"
      ]
    },
    {
      id: "finance",
      icon: DollarSign,
      title: "Finances & Créances",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-indigo-600",
      description: "Maîtrisez votre trésorerie et optimisez la gestion de vos créances clients",
      analyses: [
        {
          name: "Analyse du Poste Client (DSO)",
          description: "Suivi des délais de paiement et des créances en cours",
          metrics: ["DSO moyen", "Créances échues", "Taux de recouvrement", "Aging des créances"]
        },
        {
          name: "Scoring de Risque Client",
          description: "Évaluation du risque de défaut de paiement par client",
          metrics: ["Score de crédit", "Historique de paiement", "Incidents de paiement", "Limite de crédit"]
        },
        {
          name: "Prévisions de Trésorerie",
          description: "Anticipation des flux de trésorerie futurs",
          metrics: ["Cash flow prévisionnel", "Encaissements attendus", "Décaissements planifiés", "Position de trésorerie"]
        },
        {
          name: "Analyse des Retards de Paiement",
          description: "Identification des patterns et causes de retards",
          metrics: ["Montants en retard", "Durée moyenne de retard", "Clients à risque", "Impact financier"]
        }
      ],
      objectives: [
        "Réduire le DSO de 10-15 jours",
        "Diminuer les créances irrécouvrables de 30%",
        "Améliorer la prévision de trésorerie",
        "Automatiser le recouvrement"
      ],
      results: [
        "Amélioration de la trésorerie disponible",
        "Réduction des risques d'impayés",
        "Relances automatisées et ciblées",
        "Visibilité en temps réel sur la situation financière"
      ]
    },
    {
      id: "training",
      icon: GraduationCap,
      title: "Formation du Personnel",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-pink-600",
      description: "Maximisez l'efficacité de vos programmes de formation et développez les compétences",
      analyses: [
        {
          name: "Évaluation de l'Efficacité des Formations",
          description: "Mesure de l'impact des formations sur les performances",
          metrics: ["Taux de complétion", "Scores d'évaluation", "ROI formation", "Amélioration des performances"]
        },
        {
          name: "Analyse des Besoins en Compétences",
          description: "Identification des gaps de compétences par département",
          metrics: ["Compétences manquantes", "Écarts de performance", "Priorités formation", "Budget requis"]
        },
        {
          name: "Suivi de la Progression Individuelle",
          description: "Monitoring du parcours d'apprentissage de chaque employé",
          metrics: ["Heures de formation", "Certifications obtenues", "Compétences acquises", "Objectifs atteints"]
        },
        {
          name: "Analyse du Retour sur Investissement",
          description: "Mesure de l'impact financier des programmes de formation",
          metrics: ["Coût par formation", "Productivité post-formation", "Rétention des talents", "ROI global"]
        }
      ],
      objectives: [
        "Augmenter le taux de complétion à 90%",
        "Améliorer l'engagement des apprenants de 40%",
        "Réduire les coûts de formation de 20%",
        "Accélérer la montée en compétence"
      ],
      results: [
        "Personnalisation des parcours de formation",
        "Amélioration de 35% de la productivité",
        "Réduction du turnover de 25%",
        "Identification précise des besoins en formation"
      ]
    },
    {
      id: "hr",
      icon: Users,
      title: "Ressources Humaines",
      color: "bg-orange-500",
      gradient: "from-orange-500 to-red-600",
      description: "Optimisez la gestion des talents et améliorez l'engagement de vos équipes",
      analyses: [
        {
          name: "Analyse des Salaires",
          description: "Suivi détaillé de la masse salariale et des rémunérations",
          metrics: ["Masse salariale totale", "Salaires moyens", "Évolution des salaires", "Charges sociales"]
        },
        {
          name: "Gestion de la Trésorerie RH",
          description: "Optimisation des flux financiers liés aux ressources humaines",
          metrics: ["Prévisions paie", "Budget RH", "Coûts de recrutement", "Avantages sociaux"]
        },
        {
          name: "Analyse de l'Engagement Employé",
          description: "Mesure du niveau de satisfaction et d'engagement des équipes",
          metrics: ["eNPS", "Taux d'engagement", "Satisfaction au travail", "Climat social"]
        },
        {
          name: "Gestion des Talents et Succession",
          description: "Identification des hauts potentiels et planification de la relève",
          metrics: ["High performers", "Potentiel d'évolution", "Plans de succession", "Pipeline de talents"]
        }
      ],
      objectives: [
        "Réduire le turnover de 30%",
        "Améliorer l'engagement de 25 points",
        "Identifier 100% des hauts potentiels",
        "Optimiser les processus de recrutement"
      ],
      results: [
        "Prédiction des départs avec 85% de précision",
        "Réduction des coûts de recrutement de 40%",
        "Amélioration du climat social",
        "Plans de succession efficaces pour tous les postes clés"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mt-9 mb-12">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
            Domaines Métiers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analyses Métiers DATANOVA
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Découvrez comment DATANOVA transforme vos données métiers en insights actionnables. Chaque domaine bénéficie d'analyses spécialisées pour atteindre vos objectifs.
          </p>
        </div>

        {/* Domains Grid */}
        <div className="space-y-8">
          {domains.map((domain) => (
            <Card 
              key={domain.id} 
              id={domain.id}
              className="overflow-hidden border-2 hover:shadow-2xl transition-all duration-300 scroll-mt-24"
            >
              {/* Domain Header */}
              <div className={`bg-gradient-to-r ${domain.gradient} p-8 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                      <domain.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-3">{domain.title}</h2>
                      <p className="text-white/90 text-lg">{domain.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    #{domain.id}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-8">
                <Tabs defaultValue="analyses" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="analyses" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analyses
                    </TabsTrigger>
                    <TabsTrigger value="objectives" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Objectifs
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Résultats
                    </TabsTrigger>
                  </TabsList>

                  {/* Analyses Tab */}
                  <TabsContent value="analyses" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {domain.analyses.map((analysis, idx) => (
                        <Card key={idx} className="border-2 hover:border-indigo-200 transition-colors">
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${domain.color} bg-opacity-10`}>
                                <FileText className={`h-5 w-5 ${domain.color.replace('bg-', 'text-')}`} />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">{analysis.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {analysis.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                                Métriques clés
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {analysis.metrics.map((metric, metricIdx) => (
                                  <Badge 
                                    key={metricIdx} 
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {metric}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Objectives Tab */}
                  <TabsContent value="objectives">
                    <div className="grid gap-4 md:grid-cols-2">
                      {domain.objectives.map((objective, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100"
                        >
                          <div className="p-2 bg-blue-500 rounded-full flex-shrink-0">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-800 font-medium">{objective}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">
                            Objectifs personnalisables
                          </p>
                          <p className="text-sm text-amber-800">
                            Ces objectifs sont des exemples. DATANOVA s'adapte à vos propres KPIs et objectifs métiers spécifiques.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Results Tab */}
                  <TabsContent value="results">
                    <div className="space-y-4">
                      {domain.results.map((result, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-100 hover:border-emerald-300 transition-colors"
                        >
                          <div className="p-2 bg-emerald-500 rounded-full flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-800 font-medium text-lg">{result}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg mb-2">
                            ROI Moyen : 250-400% sur 12 mois
                          </p>
                          <p className="text-white/90">
                            Les clients DATANOVA dans le domaine {domain.title} constatent un retour sur investissement significatif dès la première année d'utilisation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-16 p-6 bg-white rounded-xl shadow-lg border-2">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Navigation Rapide par Domaine</h3>
          <p className="text-sm text-slate-600 mb-4">
            Accédez directement à un domaine spécifique 
            {/* <code className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs"></code> */}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {domains.map((domain) => (
              <a 
                key={domain.id}
                href={`#${domain.id}`}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all hover:scale-105 ${domain.color} bg-opacity-10 hover:bg-opacity-20 border-transparent hover:border-current`}
              >
                <domain.icon className={`h-4 w-4 ${domain.color.replace('bg-', 'text-')}`} />
                <span className="text-sm font-medium text-slate-700">#{domain.id}</span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Votre domaine métier nécessite une analyse spécifique ?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            DATANOVA s'adapte à tous les secteurs d'activité. Contactez-nous pour une démonstration personnalisée de nos capacités d'analyse sur votre métier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100 transition">
              Demander une démo
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
              Contactez-nous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}