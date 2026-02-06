"use client"

import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI'
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI'
import React, { useEffect, useState } from 'react'
import type { Workflow } from "@/domains/models/Workflow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Loader2, CheckCircle2, XCircle, Calendar, TrendingUp, TrendingDown, DollarSign, Package, Target, Users, BarChart3, Eye } from "lucide-react"
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts'

const STAT_CONFIGS = {
  vente: [
    { key: 'totalCA', icon: DollarSign, label: 'CA Total', format: (v: number) => `${(v/1000).toFixed(1)}K`, color: 'blue' },
    { key: 'totalQte', icon: Package, label: 'Quantité', format: (v: number) => v, color: 'purple' },
    { key: 'trend', icon: null, label: 'Tendance', format: (v: number) => `${v>=0?'+':''}${(v/1000).toFixed(1)}K`, color: 'green' }
  ],
  perf: [
    { key: 'scoreMoyen', icon: Target, label: 'Score', format: (v: number) => `${v}/100`, color: 'blue' },
    { key: 'topPerformers', icon: Users, label: 'Top', format: (v: number) => v, color: 'yellow' },
    { key: 'trend', icon: null, label: 'Évolution', format: (v: number) => `${v>=0?'+':''}${v}`, color: 'green' }
  ]
}

function WorkflowMiniChart({ workflow }: { workflow: Workflow }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const catCode = workflow.categorieId?.code
        
        if (catCode === 'VENTE') {
          const ventes = await VenteRepoAPI.getByWorkflow(workflow._id)
          
          // Adapter la structure des données (qte + produitId.pu au lieu de quantite + prixUnitaire)
          const totalCA = ventes.reduce((s, v) => {
            const qte = v.qte || v.quantite || 0
            const pu = v.produitId?.pu || v.prixUnitaire || 0
            return s + (qte * pu)
          }, 0)
          
          const totalQte = ventes.reduce((s, v) => s + (v.qte || v.quantite || 0), 0)
          
          const byMonth = ventes.reduce((acc: any, v: any) => {
            // Utiliser createdAt si dateVente n'existe pas
            const dateStr = v.dateVente || v.createdAt
            if (!dateStr) return acc
            
            const m = new Date(dateStr).toLocaleDateString('fr', { month: 'short', year: 'numeric' })
            if (!acc[m]) acc[m] = { mois: m, total: 0 }
            
            const qte = v.qte || v.quantite || 0
            const pu = v.produitId?.pu || v.prixUnitaire || 0
            acc[m].total += qte * pu
            return acc
          }, {})
          
          const chart = Object.values(byMonth).slice(-6)
          const trend = chart.length >= 2 ? (chart[chart.length-1] as any).total - (chart[chart.length-2] as any).total : 0

          setData({ type: 'vente', stats: { totalCA, totalQte, nbVentes: ventes.length, trend }, chart })
        } 
        else if (catCode === 'PERFO_EMP') {
          const perfs = await PerfoDataRepoAPI.getByWorkflow(workflow._id)
          const scoreMoyen = Math.round(perfs.reduce((s, p) => s + p.score, 0) / (perfs.length || 1))
          const topPerformers = perfs.filter(p => p.score >= 80).length
          
          const byPeriod = perfs.reduce((acc: any, p: any) => {
            if (!acc[p.periode]) acc[p.periode] = { periode: p.periode, score: 0, count: 0 }
            acc[p.periode].score += p.score
            acc[p.periode].count += 1
            return acc
          }, {})
          const chart = Object.values(byPeriod).map((p: any) => ({
            periode: p.periode, score: Math.round(p.score / p.count)
          })).slice(-6)
          const trend = chart.length >= 2 ? (chart[chart.length-1] as any).score - (chart[chart.length-2] as any).score : 0

          setData({ type: 'perf', stats: { scoreMoyen, topPerformers, totalEval: perfs.length, trend }, chart })
        }
      } catch (err) {
        console.error("Erreur chargement données:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [workflow._id])

  if (loading) return <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!data?.chart?.length) return <div className="flex flex-col items-center justify-center h-32 text-muted-foreground"><BarChart3 className="h-8 w-8 mb-2 opacity-50" /><p className="text-xs">Aucune donnée</p></div>

  const configs = data.type === 'vente' ? STAT_CONFIGS.vente : STAT_CONFIGS.perf

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {configs.map((cfg, i) => {
          const val = data.stats[cfg.key]
          const Icon = cfg.icon || (val >= 0 ? TrendingUp : TrendingDown)
          const isPositive = cfg.key === 'trend' ? val >= 0 : true
          
          return (
            <div key={i} className={`bg-gradient-to-br ${
              cfg.color === 'blue' ? 'from-blue-50 to-blue-100' :
              cfg.color === 'purple' ? 'from-purple-50 to-purple-100' :
              cfg.color === 'yellow' ? 'from-yellow-50 to-yellow-100' :
              isPositive ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'
            } p-3 rounded-lg`}>
              <div className="flex items-center gap-1 mb-1">
                <Icon className={`h-3 w-3 ${
                  cfg.color === 'blue' ? 'text-blue-600' :
                  cfg.color === 'purple' ? 'text-purple-600' :
                  cfg.color === 'yellow' ? 'text-yellow-600' :
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className={`text-xs font-medium ${
                  cfg.color === 'blue' ? 'text-blue-900' :
                  cfg.color === 'purple' ? 'text-purple-900' :
                  cfg.color === 'yellow' ? 'text-yellow-900' :
                  isPositive ? 'text-green-900' : 'text-red-900'
                }`}>{cfg.label}</span>
              </div>
              <p className={`text-lg font-bold ${
                cfg.color === 'blue' ? 'text-blue-600' :
                cfg.color === 'purple' ? 'text-purple-600' :
                cfg.color === 'yellow' ? 'text-yellow-600' :
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>{cfg.format(val)}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
        <ResponsiveContainer width="100%" height={80}>
          {data.type === 'vente' ? (
            <BarChart data={data.chart}>
              <Tooltip formatter={(v: any) => `${(v/1000).toFixed(1)}K Ar`} contentStyle={{ fontSize: '12px' }} />
              <Bar dataKey="total" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          ) : (
            <LineChart data={data.chart}>
              <Tooltip formatter={(v: any) => `${v}/100`} contentStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
        <p className="text-xs text-center text-muted-foreground mt-2">
          {data.type === 'vente' ? 'Évolution du CA' : 'Évolution des scores'}
        </p>
      </div>
    </div>
  )
}

export default function PipelineETL() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await WorkflowRepoAPI.getByUser()
        setWorkflows(data)
        const actifs = data.filter(w => w.actif).length
        setStats({
          total: data.length,
          actifs,
          inactifs: data.length - actifs,
          ventes: data.filter(w => w.categorieId?.code === 'VENTE').length,
          perfs: data.filter(w => w.categorieId?.code === 'PERFO_EMP').length
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const getCatLabel = (cat: any) => cat?.code === 'VENTE' ? 'Vente' : cat?.code === 'PERFO_EMP' ? 'Performance Employé' : 'N/A'
  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric'}) : 'N/A'

  const globalCards = [
    { icon: GitBranch, val: stats?.total, label: 'Total Workflows', color: 'from-blue-500 to-blue-600' },
    { icon: CheckCircle2, val: stats?.actifs, label: 'Actifs', color: 'from-green-500 to-green-600' },
    { icon: XCircle, val: stats?.inactifs, label: 'Inactifs', color: 'from-gray-500 to-gray-600' },
    { icon: DollarSign, val: stats?.ventes, label: 'Ventes', color: 'from-purple-500 to-purple-600' },
    { icon: Target, val: stats?.perfs, label: 'Performance', color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de Bord ETL
          </h1>
          <p className="text-muted-foreground mt-2">Vue d'ensemble de vos pipelines de données</p>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {globalCards.map((card, i) => (
                <Card key={i} className={`shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br ${card.color} text-white border-0`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <card.icon className="h-5 w-5 opacity-80" />
                      <span className="text-2xl font-bold">{card.val}</span>
                    </div>
                    <p className="text-sm opacity-90">{card.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : !workflows.length ? (
          <Card className="shadow-lg border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <GitBranch className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Aucun workflow trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {workflows.map(w => (
              <Card key={w._id} className="shadow-lg hover:shadow-2xl transition-all border-0 overflow-hidden group">
                <div className="bg-gray-600 rounded p-4 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1 line-clamp-1">{w.nom}</CardTitle>
                      <p className="text-sm opacity-90 line-clamp-2">{w.description || <span className="italic">Aucune description</span>}</p>
                    </div>
                    <Badge className={`${w.actif ? 'bg-green-500' : 'bg-white/20 border-white/40'} text-white border-0 gap-1 ml-2`}>
                      {w.actif ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {w.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge className="bg-white/20 text-white border-0">{getCatLabel(w.categorieId)}</Badge>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <Calendar className="h-3 w-3" />
                      {fmtDate(w.createdAt)}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <WorkflowMiniChart workflow={w} />
                </CardContent>

                <CardFooter className="flex gap-2 pt-4 border-t bg-gray-50">
                  <Link href={`/tableau-de-bord/pipelines/${w._id}`} className="flex-1">
                    <Button className="w-full bg-blue-700 hover:bg-blue-500">
                      <BarChart3 className="h-4 w-4 mr-2" />Détails
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}