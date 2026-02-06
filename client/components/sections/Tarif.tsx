"use client"
import React, { useState } from 'react';
import { Check, X, Zap, TrendingUp, Crown, Sparkles, Calculator, FileText, DollarSign, Users, GraduationCap, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const subscriptionPlans = [
    {
      name: "Starter",
      icon: Zap,
      color: "from-blue-500 to-cyan-600",
      price: {
        monthly: "250,000",
        yearly: "2,500,000"
      },
      description: "Idéal pour les petites entreprises qui débutent avec l'analyse de données",
      features: [
        { text: "2 domaines métiers au choix", included: true },
        { text: "5 analyses par mois", included: true },
        { text: "ETL automatisé basique", included: true },
        { text: "Rapports mensuels", included: true },
        { text: "Support par email", included: true },
        { text: "Analyses IA avancées", included: false },
        { text: "API Access", included: false },
        { text: "Support prioritaire", included: false }
      ],
      highlight: false
    },
    {
      name: "Professional",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      price: {
        monthly: "750,000",
        yearly: "7,500,000"
      },
      description: "Pour les entreprises en croissance nécessitant des analyses approfondies",
      features: [
        { text: "Tous les domaines métiers", included: true },
        { text: "Analyses illimitées", included: true },
        { text: "ETL automatisé avancé", included: true },
        { text: "Rapports temps réel", included: true },
        { text: "Analyses IA avancées", included: true },
        { text: "API Access", included: true },
        { text: "Support prioritaire 24/7", included: true },
        { text: "Formation personnalisée", included: false }
      ],
      highlight: true,
      badge: "Populaire"
    },
    {
      name: "Enterprise",
      icon: Crown,
      color: "from-amber-500 to-orange-600",
      price: {
        monthly: "Sur mesure",
        yearly: "Sur mesure"
      },
      description: "Solution complète pour les grandes entreprises avec besoins spécifiques",
      features: [
        { text: "Tous les domaines métiers", included: true },
        { text: "Analyses illimitées", included: true },
        { text: "ETL sur mesure", included: true },
        { text: "Dashboards personnalisés", included: true },
        { text: "IA personnalisée", included: true },
        { text: "API Access illimité", included: true },
        { text: "Support dédié 24/7", included: true },
        { text: "Formation et consulting", included: true }
      ],
      highlight: false
    }
  ];

  const perAnalysisPricing = [
    {
      domain: "Ventes & Commerce",
      icon: ShoppingCart,
      color: "bg-emerald-500",
      analyses: [
        { name: "Analyse des Actifs", price: "45,000" },
        { name: "Analyse des Passifs", price: "45,000" },
        { name: "Prévisions de Ventes", price: "65,000" },
        { name: "Analyse des Canaux", price: "55,000" }
      ]
    },
    {
      domain: "Finances & Créances",
      icon: DollarSign,
      color: "bg-blue-500",
      analyses: [
        { name: "Analyse du Poste Client (DSO)", price: "50,000" },
        { name: "Scoring de Risque Client", price: "70,000" },
        { name: "Prévisions de Trésorerie", price: "60,000" },
        { name: "Analyse des Retards", price: "45,000" }
      ]
    },
    {
      domain: "Formation du Personnel",
      icon: GraduationCap,
      color: "bg-purple-500",
      analyses: [
        { name: "Efficacité des Formations", price: "55,000" },
        { name: "Besoins en Compétences", price: "50,000" },
        { name: "Progression Individuelle", price: "40,000" },
        { name: "ROI Formation", price: "65,000" }
      ]
    },
    {
      domain: "Ressources Humaines",
      icon: Users,
      color: "bg-orange-500",
      analyses: [
        { name: "Analyse des Salaires", price: "55,000" },
        { name: "Gestion Trésorerie RH", price: "60,000" },
        { name: "Engagement Employé", price: "50,000" },
        { name: "Gestion des Talents", price: "70,000" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12">
      <div className="container mt-9 mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
            Tarification
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tarifs DATANOVA
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Choisissez la formule qui correspond à vos besoins. Abonnement flexible ou paiement à l'analyse.
          </p>
        </div>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Abonnements
            </TabsTrigger>
            <TabsTrigger value="payperuse" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Par Analyse
            </TabsTrigger>
          </TabsList>

          {/* Subscription Plans */}
          <TabsContent value="subscription" className="space-y-8">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-indigo-600' : 'text-slate-500'}`}>
                Mensuel
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-indigo-600 rounded-full transition-colors"
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${billingPeriod === 'yearly' ? 'translate-x-7' : ''}`} />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-indigo-600' : 'text-slate-500'}`}>
                Annuel
              </span>
              {billingPeriod === 'yearly' && (
                <Badge className="bg-green-100 text-green-700">
                  Économisez 17%
                </Badge>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan, idx) => (
                <Card 
                  key={idx}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    plan.highlight 
                      ? 'border-4 border-purple-500 shadow-2xl scale-105' 
                      : 'border-2 hover:shadow-xl'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-purple-500 text-white">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className={`bg-gradient-to-r ${plan.color} text-white pb-8`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                        <plan.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                          {plan.price[billingPeriod]}
                        </span>
                        {plan.price[billingPeriod] !== "Sur mesure" && (
                          <>
                            <span className="text-xl">MGA</span>
                            <span className="text-white/80">
                              /{billingPeriod === 'monthly' ? 'mois' : 'an'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-white/90">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-8 pb-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-3">
                          {feature.included ? (
                            <div className="p-1 bg-green-100 rounded-full flex-shrink-0">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="p-1 bg-slate-100 rounded-full flex-shrink-0">
                              <X className="h-4 w-4 text-slate-400" />
                            </div>
                          )}
                          <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                      {plan.price[billingPeriod] === "Sur mesure" ? "Nous contacter" : "Commencer"}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">
                    Tous les abonnements incluent :
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-2 text-slate-600">
                    <li>• ETL automatisé</li>
                    <li>• Dashboards interactifs</li>
                    <li>• Exports de données</li>
                    <li>• Mises à jour régulières</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pay Per Use */}
          <TabsContent value="payperuse" className="space-y-8">
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Tarification à l'Analyse
              </h3>
              <p className="text-slate-600">
                Payez uniquement pour les analyses dont vous avez besoin. Pas d'engagement, flexibilité totale.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {perAnalysisPricing.map((domain, idx) => (
                <Card key={idx} className="border-2 hover:shadow-xl transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 ${domain.color} bg-opacity-10 rounded-lg`}>
                        <domain.icon className={`h-5 w-5 ${domain.color.replace('bg-', 'text-')}`} />
                      </div>
                      <CardTitle className="text-xl">{domain.domain}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {domain.analyses.map((analysis, analysisIdx) => (
                        <div 
                          key={analysisIdx}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 font-medium">{analysis.name}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-indigo-600">
                              {analysis.price}
                            </span>
                            <span className="text-xs text-slate-500">MGA</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pack Discount */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">
                    Économisez avec nos Packs d'Analyses
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-bold text-lg mb-1">Pack 5 Analyses</p>
                      <p className="text-2xl font-bold">250,000 MGA</p>
                      <p className="text-sm text-white/80">Au lieu de 275,000 MGA</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-bold text-lg mb-1">Pack 10 Analyses</p>
                      <p className="text-2xl font-bold">475,000 MGA</p>
                      <p className="text-sm text-white/80">Au lieu de 550,000 MGA</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-bold text-lg mb-1">Pack 20 Analyses</p>
                      <p className="text-2xl font-bold">850,000 MGA</p>
                      <p className="text-sm text-white/80">Au lieu de 1,100,000 MGA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Besoin d'aide pour choisir ?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Notre équipe est là pour vous conseiller sur la formule la plus adaptée à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100 transition">
              Parler à un expert
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}