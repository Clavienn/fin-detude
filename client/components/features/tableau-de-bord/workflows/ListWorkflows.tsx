"use client"

import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import React, { useEffect, useState } from 'react'
import type { Workflow } from "@/domains/models/Workflow"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, GitBranch, Loader2, CheckCircle2, XCircle, Calendar, User, ArrowRight, Sparkles, TrendingUp, Filter, Search } from "lucide-react"
import { ModalCreateWorkflow } from './ModalAddWorkflow'
import { ModalUpdateWorkflow } from '@/app/administration/_components/modal/workflow/ModalUpdate'
import { DeleteWorkflow } from '@/app/administration/_components/modal/workflow/ModalDelete'
import Link from 'next/link'
import { Input } from "@/components/ui/input"

function UserNameCell({ userId }: { userId: any }) {
  const [userName, setUserName] = useState<string>('Chargement...')

  useEffect(() => {
    const fetchUserName = async () => {
      if (typeof userId === 'object' && userId?.name) {
        setUserName(userId.name)
        return
      }
      
      if (typeof userId === 'string') {
        try {
          const user = await UserRepoAPI.getById(userId)
          setUserName(user?.name || 'N/A')
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error)
          setUserName('Erreur')
        }
      } else {
        setUserName('N/A')
      }
    }

    fetchUserName()
  }, [userId])

  return <span>{userName}</span>
}

function ListWorkflow() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const listWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowRepoAPI.getByUser()
      setWorkflows(data)
      setFilteredWorkflows(data)
    } catch (error) {
      console.error("Erreur lors du chargement des workflows:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listWorkflows()
  }, [])

  useEffect(() => {
    let result = workflows

    // Filtrer par statut
    if (filterStatus === 'active') {
      result = result.filter(w => w.actif)
    } else if (filterStatus === 'inactive') {
      result = result.filter(w => !w.actif)
    }

    // Filtrer par recherche
    if (searchQuery) {
      result = result.filter(w => 
        w.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredWorkflows(result)
  }, [searchQuery, filterStatus, workflows])

  const handleCreateSuccess = () => {
    listWorkflows()
    setIsCreateOpen(false)
  }

  const handleUpdateSuccess = () => {
    listWorkflows()
    setIsUpdateOpen(false)
    setSelectedWorkflow(null)
  }

  const handleDeleteSuccess = () => {
    listWorkflows()
    setWorkflowToDelete(null)
  }

  const openUpdateModal = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setIsUpdateOpen(true)
  }

  const getCategorieLabel = (categorieId: any) => {
    if (typeof categorieId === 'object' && categorieId?.code) {
      return categorieId.code === 'VENTE' ? 'Vente' : 'Performance Employé'
    }
    return 'N/A'
  }

  const getCategorieColor = (categorieId: any) => {
    if (typeof categorieId === 'object' && categorieId?.code) {
      return categorieId.code === 'VENTE' 
        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
        : 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
    return 'bg-gradient-to-br from-gray-500 to-gray-600'
  }

  const formatDate = (date?: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const activeCount = workflows.filter(w => w.actif).length
  const inactiveCount = workflows.filter(w => !w.actif).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Header */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-5 blur-3xl"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-black rounded-xl">
                    <GitBranch className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold ">
                      Mes Workflows
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Orchestrez vos processus métier en toute simplicité
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {workflows.length} workflows au total
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-900">
                      {activeCount} actifs
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <XCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      {inactiveCount} inactifs
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setIsCreateOpen(true)} 
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Créer un Workflow
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un workflow..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Tous
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Actifs
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Inactifs
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <Loader2 className="relative h-16 w-16 animate-spin text-blue-600" />
            </div>
            <p className="mt-6 text-lg font-medium text-gray-600">Chargement de vos workflows...</p>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
                <div className="relative p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                  <GitBranch className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Aucun workflow trouvé' 
                  : 'Créez votre premier workflow'}
              </p>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                {searchQuery || filterStatus !== 'all'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez à automatiser vos processus métier dès maintenant'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button 
                  onClick={() => setIsCreateOpen(true)} 
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Créer mon premier workflow
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow, index) => (
              <Card 
                key={workflow._id} 
                className="group shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden relative"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Gradient Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${getCategorieColor(workflow.categorieId)}`}></div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2 truncate group-hover:text-blue-600 transition-colors">
                        {workflow.nom}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {workflow.description || (
                          <span className="italic text-gray-400">Aucune description</span>
                        )}
                      </CardDescription>
                    </div>
                    {workflow.actif ? (
                      <Badge className="gap-1 ml-2 bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 ml-2 bg-gray-50 text-gray-600 border-gray-300">
                        <XCircle className="h-3 w-3" />
                        Inactif
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Categorie Badge with Icon */}
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getCategorieColor(workflow.categorieId)} shadow-md`}>
                      <GitBranch className="h-4 w-4 text-white" />
                    </div>
                    <Badge variant="secondary" className="font-medium text-sm px-3 py-1">
                      {getCategorieLabel(workflow.categorieId)}
                    </Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4 text-gray-400" />
                      <UserNameCell userId={workflow.userId} />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Créé le {formatDate(workflow.createdAt)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 pt-4 border-t bg-gray-50/50">
                  <Link href={`/tableau-de-bord/workflows/${workflow._id}`} className="flex-1">
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group/btn"
                    >
                      Gérer
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openUpdateModal(workflow)}
                    className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWorkflowToDelete(workflow)}
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ModalCreateWorkflow 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      {selectedWorkflow && (
        <ModalUpdateWorkflow 
          open={isUpdateOpen} 
          onOpenChange={setIsUpdateOpen}
          workflow={selectedWorkflow}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {workflowToDelete && (
        <DeleteWorkflow 
          open={!!workflowToDelete}
          onOpenChange={(open: boolean) => !open && setWorkflowToDelete(null)}
          workflow={workflowToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ListWorkflow