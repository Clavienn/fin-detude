import React from 'react';
import { 
  BarChart3, Database, Brain, TrendingUp, Shield, Zap, 
  FileSpreadsheet, Eye, Settings, ChevronRight, ArrowRight,
  CheckCircle2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "ETL Automatisé",
      description: "Extraction, transformation et chargement automatique de vos données depuis multiples sources",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Analyse IA",
      description: "Détection d'anomalies et prédictions de tendances grâce à l'intelligence artificielle",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Tableaux de bord dynamiques",
      description: "Visualisations interactives et personnalisables de vos indicateurs clés",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité renforcée",
      description: "Authentification JWT et gestion granulaire des droits d'accès",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Temps réel",
      description: "Synchronisation automatique et alertes instantanées sur vos KPIs",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8" />,
      title: "Multi-sources",
      description: "Connectez vos fichiers Excel, CSV, API, ERP et CRM en quelques clics",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const domains = [
    { 
      name: "Ventes & Commerce", 
      description: "Analysez vos performances commerciales, suivez vos ventes et optimisez votre stratégie",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      name: "Finances & Créances", 
      description: "Gérez vos flux financiers, suivez vos créances et optimisez votre trésorerie",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500" 
    },
    { 
      name: "Formation du personnel", 
      description: "Pilotez vos programmes de formation et évaluez les compétences acquises",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500" 
    },
    { 
      name: "Ressources Humaines", 
      description: "Optimisez la gestion de vos talents et analysez les indicateurs RH clés",
      icon: <Settings className="w-6 h-6" />,
      color: "from-orange-500 to-red-500" 
    }
  ];

  const processSteps = [
    { 
      step: "01", 
      title: "Connectez vos sources", 
      description: "Importez vos fichiers ou connectez vos API en quelques clics. Support Excel, CSV, bases de données, ERP et CRM.",
      icon: <Settings className="w-10 h-10" /> 
    },
    { 
      step: "02", 
      title: "Automatisez le traitement", 
      description: "Le pipeline ETL nettoie, valide et structure vos données automatiquement sans intervention manuelle.",
      icon: <Zap className="w-10 h-10" /> 
    },
    { 
      step: "03", 
      title: "Visualisez et décidez", 
      description: "Accédez à vos tableaux de bord personnalisés et analyses IA en temps réel pour prendre les meilleures décisions.",
      icon: <TrendingUp className="w-10 h-10" /> 
    }
  ];

  const stats = [
    { value: "100%", label: "Automatisé", description: "Aucune intervention manuelle" },
    { value: "< 5min", label: "Configuration", description: "Mise en place rapide" },
    { value: "Multi", label: "Sources", description: "Toutes vos données centralisées" },
    { value: "IA", label: "Prédictions", description: "Analyses intelligentes" }
  ];

  const benefits = [
    "Réduction de 80% du temps de traitement des données",
    "Visualisations en temps réel de vos KPIs",
    "Détection automatique des anomalies",
    "Prédictions fiables basées sur l'IA",
    "Sécurité et traçabilité complètes",
    "Support multi-utilisateurs avec gestion des droits"
  ];

  const faqs = [
    {
      question: "Quelles sont les sources de données supportées ?",
      answer: "DataNova supporte une grande variété de sources : fichiers Excel et CSV, bases de données (PostgreSQL, MySQL, MongoDB), APIs REST, systèmes ERP et CRM. Nous pouvons également créer des connecteurs personnalisés selon vos besoins."
    },
    {
      question: "Comment fonctionne le processus ETL automatisé ?",
      answer: "Notre pipeline ETL extrait automatiquement vos données, les nettoie (doublons, valeurs manquantes), les transforme selon vos règles métier, et les charge dans un Data Warehouse décisionnel. Tout est automatisé et configurable via une interface intuitive."
    },
    {
      question: "Puis-je personnaliser mes tableaux de bord ?",
      answer: "Absolument ! Vous pouvez créer des tableaux de bord entièrement personnalisés avec les indicateurs qui vous intéressent, choisir les types de visualisations (graphiques, tableaux, cartes), et configurer des filtres et des alertes personnalisées."
    },
    {
      question: "Quelle est la sécurité des données ?",
      answer: "La sécurité est notre priorité. Nous utilisons l'authentification JWT, le chiffrement des données en transit et au repos, une gestion granulaire des droits d'accès, et respectons les normes RGPD. Vos données sont hébergées sur des serveurs sécurisés."
    },
    {
      question: "Comment fonctionne l'analyse IA ?",
      answer: "Notre module IA utilise des algorithmes avancés de machine learning pour détecter automatiquement les anomalies dans vos données et prédire les tendances futures. Les modèles sont entraînés sur vos données historiques et s'améliorent continuellement."
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              DATANOVA
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transformez vos données en
              <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                décisions stratégiques
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Plateforme intelligente d&apos;automatisation ETL et de visualisation décisionnelle 
              pour piloter votre entreprise avec précision et efficacité
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 h-12">
                Démarrer maintenant
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                <Eye className="mr-2 w-5 h-5" />
                Voir la démo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <Card key={idx} className="border-2">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="font-semibold mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Fonctionnalités</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d&apos;outils pour transformer vos données en insights actionnables
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="domains" className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Domaines métiers</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Solutions adaptées à vos besoins
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analysez tous les aspects de votre entreprise depuis une seule plateforme
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((domain, idx) => (
              <Card key={idx} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${domain.color}`}></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${domain.color} flex items-center justify-center text-white`}>
                      {domain.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                  </div>
                  <CardTitle className="text-2xl mt-4">{domain.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {domain.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Comment ça fonctionne</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple, rapide, efficace
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trois étapes pour transformer vos données en décisions stratégiques
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((item, idx) => (
              <Card key={idx} className="relative border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl font-bold text-muted-foreground/20">
                      {item.step}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Avantages</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pourquoi choisir DataNova ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Une plateforme complète qui simplifie votre prise de décision 
                et booste vos performances opérationnelles
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Technologies utilisées</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="frontend" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value="frontend" className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">Next.js</span>
                      <Badge>React Framework</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">Tailwind CSS</span>
                      <Badge>Styling</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">Grafana / Superset</span>
                      <Badge>Visualisation</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="backend" className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">FastAPI</span>
                      <Badge>Python API</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">Node.js</span>
                      <Badge>Runtime</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">Express.js</span>
                      <Badge>API Framework</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="data" className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">MongoDB</span>
                      <Badge>Data Lake</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">PostgreSQL</span>
                      <Badge>Data Warehouse</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <span className="font-medium">Pandas</span>
                      <Badge>ETL Processing</Badge>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tout ce que vous devez savoir sur DataNova
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Prêt à transformer vos données ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Rejoignez les entreprises qui pilotent leur croissance avec DataNova
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 h-12">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                  Contacter un expert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;