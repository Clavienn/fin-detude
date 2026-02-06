"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar, Activity, Loader2, ArrowLeft, CheckCircle2, XCircle, GitBranch, Target, Award } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI'
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI'
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI'
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI'
import Link from 'next/link'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

// Fonction helper pour extraire les données de vente
const getVenteData = (v: any) => ({
  qte: v.qte || v.quantite || 0,
  pu: v.produitId?.pu || v.prixUnitaire || 0,
  date: v.dateVente || v.createdAt,
  produitId: typeof v.produitId === 'string' ? v.produitId : v.produitId?._id
})

function Visualisation({ params }: { params: { id?: string } }) {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [ventes, setVentes] = useState<any[]>([])
  const [perfoData, setPerfoData] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => { loadWorkflows() }, [])
  useEffect(() => { if (params?.id) loadWorkflowById(params.id) }, [params?.id])

  const loadWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowRepoAPI.getByUser()
      setWorkflows(data)
      if (data.length > 0 && !params?.id) loadWorkflowData(data[0])
    } catch (err) {
      console.error("Erreur chargement workflows:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadWorkflowById = async (id: string) => {
    try {
      setLoading(true)
      const workflow = await WorkflowRepoAPI.getById(id)
      await loadWorkflowData(workflow)
    } catch (err) {
      console.error("Erreur chargement workflow:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadWorkflowData = async (workflow: any) => {
    if (!workflow) return
    setSelectedWorkflow(workflow)
    setDataLoading(true)

    try {
      const catCode = workflow.categorieId?.code
      if (catCode === 'VENTE') {
        const [ventesData, produitsData] = await Promise.all([
          VenteRepoAPI.getByWorkflow(workflow._id),
          ProduitRepoAPI.getByWorkflow(workflow._id)
        ])
        setVentes(ventesData)
        setProduits(produitsData)
        setPerfoData([])
        setEmployees([])
      } else if (catCode === 'PERFO_EMP') {
        const [perfoDataData, employeesData] = await Promise.all([
          PerfoDataRepoAPI.getByWorkflow(workflow._id),
          EmployeeRepoAPI.getByWorkflow(workflow._id)
        ])
        setPerfoData(perfoDataData)
        setEmployees(employeesData)
        setVentes([])
        setProduits([])
      }
    } catch (err) {
      console.error("Erreur chargement données:", err)
    } finally {
      setDataLoading(false)
    }
  }

  const getCatLabel = (catId: any) => catId?.code === 'VENTE' ? 'Vente' : catId?.code === 'PERFO_EMP' ? 'Performance Employé' : 'N/A'
  const getUserName = (userId: any) => userId?.name || 'N/A'

  // Calculs Ventes avec structure corrigée
  const totalVentes = ventes.reduce((s, v) => {
    const { qte, pu } = getVenteData(v)
    return s + (qte * pu)
  }, 0)
  
  const quantiteTotale = ventes.reduce((s, v) => s + getVenteData(v).qte, 0)
  const produitsVendus = new Set(ventes.map(v => getVenteData(v).produitId)).size

  const ventesParMois = ventes.reduce((acc: any, v: any) => {
    const { qte, pu, date } = getVenteData(v)
    if (!date) return acc
    const mois = new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    if (!acc[mois]) acc[mois] = { mois, total: 0, quantite: 0, nombre: 0 }
    acc[mois].total += qte * pu
    acc[mois].quantite += qte
    acc[mois].nombre += 1
    return acc
  }, {})

  const ventesChartData = Object.values(ventesParMois).sort((a: any, b: any) => 
    new Date(a.mois).getTime() - new Date(b.mois).getTime()
  )

  const produitsStats = produits.map(prod => {
    const ventesCount = ventes.filter(v => getVenteData(v).produitId === prod._id)
    const quantiteVendue = ventesCount.reduce((s, v) => s + getVenteData(v).qte, 0)
    const ca = ventesCount.reduce((s, v) => {
      const { qte, pu } = getVenteData(v)
      return s + (qte * pu)
    }, 0)
    return { nom: prod.nom, quantite: quantiteVendue, ca, pu: prod.pu }
  }).filter(p => p.quantite > 0)

  // Calculs Performance
  const scoresMoyens = perfoData.reduce((s, p) => s + p.score, 0) / (perfoData.length || 1)
  const totalEmployes = employees.length
  const topPerformers = employees.filter(e => {
    const scores = perfoData.filter(p => (typeof p.employeeId === 'string' ? p.employeeId : p.employeeId?._id) === e._id)
    const avg = scores.reduce((s, sc) => s + sc.score, 0) / (scores.length || 1)
    return avg >= 80
  }).length

  const employeePerformance = employees.map(emp => {
    const scores = perfoData.filter(p => (typeof p.employeeId === 'string' ? p.employeeId : p.employeeId?._id) === emp._id)
    const avg = scores.reduce((s, sc) => s + sc.score, 0) / (scores.length || 1)
    return { nom: emp.nom, prenom: emp.prenom, score: Math.round(avg) || 0, count: scores.length }
  }).sort((a, b) => b.score - a.score)

  const perfoParPeriode = perfoData.reduce((acc: any, p: any) => {
    if (!acc[p.periode]) acc[p.periode] = { periode: p.periode, scoreMoyen: 0, count: 0 }
    acc[p.periode].scoreMoyen += p.score
    acc[p.periode].count += 1
    return acc
  }, {})

  const perfoChartData = Object.values(perfoParPeriode).map((p: any) => ({
    periode: p.periode, scoreMoyen: Math.round(p.scoreMoyen / p.count)
  }))

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>

  const isVente = selectedWorkflow?.categorieId?.code === 'VENTE'

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/tableau-de-bord/pipelines">
          <Button variant="ghost" className="gap-2 mb-4"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Visualisation Décisionnelle</h1>
        <p className="text-muted-foreground">Analyse approfondie de vos workflows</p>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />Sélectionner un Workflow</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(w => (
              <Card key={w._id} className={`cursor-pointer transition-all hover:shadow-md ${selectedWorkflow?._id === w._id ? 'ring-2 ring-primary shadow-md' : ''}`} onClick={() => loadWorkflowData(w)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{w.nom}</h3>
                    <Badge variant={w.actif ? "default" : "outline"} className="gap-1">
                      {w.actif ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {w.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <Badge variant="secondary">{getCatLabel(w.categorieId)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {!selectedWorkflow ? (
        <Card className="shadow-lg"><CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">Sélectionnez un workflow</p>
        </CardContent></Card>
      ) : dataLoading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="h-12 w-12 animate-spin" /></div>
      ) : (
        <>
          <Card className="mb-6 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedWorkflow.nom}</CardTitle>
                  <CardDescription className="text-base">{selectedWorkflow.description || "Aucune description"}</CardDescription>
                </div>
                <Badge variant={selectedWorkflow.actif ? "default" : "outline"}>{selectedWorkflow.actif ? "Actif" : "Inactif"}</Badge>
              </div>
              <div className="flex gap-4 mt-4">
                <Badge variant="secondary">{getCatLabel(selectedWorkflow.categorieId)}</Badge>
                <span className="text-sm text-muted-foreground">Créé par: {getUserName(selectedWorkflow.userId)}</span>
              </div>
            </CardHeader>
          </Card>

          {isVente ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">CA Total</CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{totalVentes.toLocaleString('fr-FR')}  €</div>
                    <p className="text-xs text-muted-foreground mt-1">{ventes.length} vente(s)</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Quantité Vendue</CardTitle>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{quantiteTotale}</div>
                    <p className="text-xs text-muted-foreground mt-1">Unités vendues</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Produits Vendus</CardTitle>
                    <Package className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{produitsVendus}</div>
                    <p className="text-xs text-muted-foreground mt-1">Sur {produits.length} produit(s)</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Prix Moyen</CardTitle>
                    <Activity className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {quantiteTotale > 0 ? Math.round(totalVentes / quantiteTotale).toLocaleString('fr-FR') : 0}  €
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Par unité</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="evolution" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="evolution">Évolution</TabsTrigger>
                  <TabsTrigger value="produits">Produits</TabsTrigger>
                  <TabsTrigger value="repartition">Répartition</TabsTrigger>
                </TabsList>

                <TabsContent value="evolution" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                      <CardDescription>Analyse mensuelle des ventes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={ventesChartData}>
                          <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mois" />
                          <YAxis />
                          <Tooltip formatter={(v: any) => `${v.toLocaleString('fr-FR')}  €`} />
                          <Legend />
                          <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" name="CA Total" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader><CardTitle>Quantités Vendues par Mois</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ventesChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mois" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="quantite" fill="#8b5cf6" name="Quantité" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="produits" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Performance par Produit</CardTitle>
                      <CardDescription>Analyse des ventes par produit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={produitsStats} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="nom" type="category" width={150} />
                          <Tooltip formatter={(v: any) => v.toLocaleString('fr-FR')} />
                          <Legend />
                          <Bar dataKey="ca" fill="#10b981" name="CA ( €)" />
                          <Bar dataKey="quantite" fill="#3b82f6" name="Quantité" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {produitsStats.map((p, i) => (
                      <Card key={i} className="shadow-md">
                        <CardHeader><CardTitle className="text-lg">{p.nom}</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Quantité vendue:</span>
                            <span className="font-semibold">{p.quantite}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">CA généré:</span>
                            <span className="font-semibold text-green-600">{p.ca.toLocaleString('fr-FR')} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Prix unitaire:</span>
                            <span className="font-semibold">{p.pu.toLocaleString('fr-FR')} €</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="repartition">
                  <Card className="shadow-lg">
                    <CardHeader><CardTitle>Répartition du CA par Produit</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie data={produitsStats} cx="50%" cy="50%" labelLine={false} 
                            label={({ nom, ca }) => `${nom}: ${((ca / totalVentes) * 100).toFixed(1)}%`}
                            outerRadius={130} dataKey="ca">
                            {produitsStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: any) => `${v.toLocaleString('fr-FR')} €`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Score Moyen</CardTitle>
                    <Target className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{Math.round(scoresMoyens)}/100</div>
                    <p className="text-xs text-muted-foreground mt-1">Tous employés</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Employés</CardTitle>
                    <Users className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{totalEmployes}</div>
                    <p className="text-xs text-muted-foreground mt-1">Employés actifs</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Top Performers</CardTitle>
                    <Award className="h-5 w-5 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">{topPerformers}</div>
                    <p className="text-xs text-muted-foreground mt-1">Score ≥ 80</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Évaluations</CardTitle>
                    <Activity className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{perfoData.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total évaluations</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="evolution" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="evolution">Évolution</TabsTrigger>
                  <TabsTrigger value="classement">Classement</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>

                <TabsContent value="evolution">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Évolution des Performances</CardTitle>
                      <CardDescription>Score moyen par période</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={perfoChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="periode" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="scoreMoyen" stroke="#3b82f6" strokeWidth={3} name="Score Moyen" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="classement" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Classement des Employés</CardTitle>
                      <CardDescription>Par score moyen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={employeePerformance} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="nom" type="category" width={150} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" fill="#3b82f6" name="Score Moyen" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employeePerformance.slice(0, 6).map((emp, i) => (
                      <Card key={i} className={`shadow-md ${i < 3 ? 'ring-2 ring-yellow-400' : ''}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{i + 1}. {emp.nom} {emp.prenom}</CardTitle>
                            {i === 0 && <Award className="h-6 w-6 text-yellow-500" />}
                            {i === 1 && <Award className="h-6 w-6 text-gray-400" />}
                            {i === 2 && <Award className="h-6 w-6 text-orange-600" />}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Score moyen:</span>
                            <Badge variant={emp.score >= 80 ? "default" : emp.score >= 60 ? "secondary" : "outline"} className="text-lg font-bold">
                              {emp.score}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Évaluations:</span>
                            <span className="font-semibold">{emp.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className={`h-2.5 rounded-full ${emp.score >= 80 ? 'bg-green-600' : emp.score >= 60 ? 'bg-blue-600' : 'bg-orange-600'}`}
                              style={{ width: `${emp.score}%` }}></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader><CardTitle>Liste Complète des Employés</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {employeePerformance.map((emp, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">{i + 1}</div>
                              <div>
                                <p className="font-semibold">{emp.nom} {emp.prenom}</p>
                                <p className="text-sm text-muted-foreground">{emp.count} évaluation(s)</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{emp.score}</div>
                                <p className="text-xs text-muted-foreground">/ 100</p>
                              </div>
                              <Badge variant={emp.score >= 80 ? "default" : emp.score >= 60 ? "secondary" : "outline"}>
                                {emp.score >= 80 ? 'Excellent' : emp.score >= 60 ? 'Bon' : 'À améliorer'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                      <CardHeader><CardTitle>Distribution des Scores</CardTitle></CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Excellent (≥80)', value: employeePerformance.filter(e => e.score >= 80).length, fill: '#10b981' },
                                { name: 'Bon (60-79)', value: employeePerformance.filter(e => e.score >= 60 && e.score < 80).length, fill: '#3b82f6' },
                                { name: 'À améliorer (<60)', value: employeePerformance.filter(e => e.score < 60).length, fill: '#f59e0b' }
                              ]}
                              cx="50%" cy="50%" labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={100} dataKey="value"
                            />
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                      <CardHeader><CardTitle>Statistiques Globales</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium">Score Maximum</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {Math.max(...employeePerformance.map(e => e.score), 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium">Score Moyen</span>
                          <span className="text-2xl font-bold text-green-600">{Math.round(scoresMoyens)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <span className="font-medium">Score Minimum</span>
                          <span className="text-2xl font-bold text-orange-600">
                            {Math.min(...employeePerformance.map(e => e.score), 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium">Taux de Réussite</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {totalEmployes > 0 ? Math.round((topPerformers / totalEmployes) * 100) : 0}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Visualisation