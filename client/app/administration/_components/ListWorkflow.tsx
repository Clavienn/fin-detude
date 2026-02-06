"use client"

import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import React, { useEffect, useState } from 'react'
import type { Workflow } from "@/domains/models/Workflow"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, GitBranch, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { ModalCreateWorkflow } from './modal/workflow/ModalAdd'
import { ModalUpdateWorkflow } from './modal/workflow/ModalUpdate'
import { DeleteWorkflow } from './modal/workflow/ModalDelete'
import Link from 'next/link'


function UserNameCell({ userId }: { userId: any }) {
  const [userName, setUserName] = useState<string>('Chargement...')

  useEffect(() => {
    const fetchUserName = async () => {
      // Si c'est déjà un objet avec name
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
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null)

  const listWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowRepoAPI.getAll()
      setWorkflows(data)
    } catch (error) {
      console.error("Erreur lors du chargement des workflows:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listWorkflows()
  }, [])

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

  const formatDate = (date?: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Gestion des Workflows</CardTitle>
              <CardDescription className="mt-2">
                Gérez tous les workflows de votre système
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              size="lg"
              className="gap-2"
            >
              <GitBranch className="h-5 w-5" />
              Nouveau Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Nom</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Catégorie</TableHead>
                    <TableHead className="font-semibold">Utilisateur</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Créé le</TableHead>
                    <TableHead className="font-semibold">Gestionnaire</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun workflow trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    workflows.map((workflow) => (
                      <TableRow key={workflow._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{workflow.nom}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {workflow.description || (
                            <span className="text-muted-foreground italic">Aucune description</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getCategorieLabel(workflow.categorieId)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {/* ✅ Utiliser le composant qui gère l'async */}
                          <UserNameCell userId={workflow.userId} />
                        </TableCell>
                        <TableCell>
                          {workflow.actif ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Actif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Inactif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(workflow.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/administration/workflows/${workflow._id}`}>Gerer</Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUpdateModal(workflow)}
                              className="gap-1.5"
                            >
                              <Pencil className="h-4 w-4" />
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setWorkflowToDelete(workflow)}
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  )
}

export default ListWorkflow