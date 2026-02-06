"use client"

import React, { useState, useEffect } from 'react'
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import type { Workflow } from "@/domains/models/Workflow"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DeleteWorkflowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: Workflow
  onSuccess: () => void
}

// ✅ Composant pour afficher le nom d'utilisateur
function UserNameDisplay({ userId }: { userId: any }) {
  const [userName, setUserName] = useState<string>('Chargement...')

  useEffect(() => {
    const fetchUserName = async () => {
      // Si c'est déjà un objet avec name
      if (typeof userId === 'object' && userId?.name) {
        setUserName(userId.name)
        return
      }
      
      // Si c'est un ID string, faire l'appel API
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

  return <span className="text-sm font-semibold">{userName}</span>
}

export function DeleteWorkflow({ open, onOpenChange, workflow, onSuccess }: DeleteWorkflowProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleDelete = async () => {
    setError("")
    try {
      setLoading(true)
      await WorkflowRepoAPI.delete(workflow._id)
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de supprimer le workflow")
      setLoading(false)
    }
  }

  const getCategorieLabel = (categorieId: any) => {
    if (typeof categorieId === 'object' && categorieId?.code) {
      return categorieId.code === 'VENTE' ? 'Vente' : 'Performance Employé'
    }
    return 'N/A'
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl">
              Confirmer la suppression
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2">
            Êtes-vous sûr de vouloir supprimer ce workflow ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 rounded-lg border border-muted bg-muted/50 p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Nom:</span>
            <span className="text-sm font-semibold text-right">{workflow.nom}</span>
          </div>
          
          {workflow.description && (
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">Description:</span>
              <span className="text-sm text-right max-w-[60%]">{workflow.description}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Catégorie:</span>
            <Badge variant="secondary">
              {getCategorieLabel(workflow.categorieId)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Utilisateur:</span>
            {/* ✅ Utiliser le composant pour afficher le nom */}
            <UserNameDisplay userId={workflow.userId} />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Statut:</span>
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
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <p className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Erreur
            </p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          <p className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Attention
          </p>
          <p className="mt-1 text-xs">
            Toutes les données associées à ce workflow seront définitivement perdues.
          </p>
        </div>

        <AlertDialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Supprimer définitivement
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}