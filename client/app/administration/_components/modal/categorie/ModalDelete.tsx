"use client"

import React, { useState } from 'react'
import { CategorieRepoAPI } from '@/infrastructures/repository/CatRepoAPI'
import type { Categorie } from "@/domains/models/Categorie"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DeleteCategorieProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categorie: Categorie
  onSuccess: () => void
}

export function DeleteCategorie({ open, onOpenChange, categorie, onSuccess }: DeleteCategorieProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleDelete = async () => {
    setError("")
    try {
      setLoading(true)
      await CategorieRepoAPI.delete(categorie._id)
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de supprimer la catégorie")
      setLoading(false)
    }
  }

  const getCodeLabel = (code: string) => {
    switch (code) {
      case 'VENTE':
        return 'Vente'
      case 'PERFO_EMP':
        return 'Performance Employé'
      default:
        return code
    }
  }

  const getCodeBadgeVariant = (code: string) => {
    switch (code) {
      case 'VENTE':
        return 'default'
      case 'PERFO_EMP':
        return 'secondary'
      default:
        return 'outline'
    }
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
            Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 rounded-lg border border-muted bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Code:</span>
            <Badge variant={getCodeBadgeVariant(categorie.code)}>
              {getCodeLabel(categorie.code)}
            </Badge>
          </div>
          {categorie.description && (
            <div className="pt-2 border-t">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Description:</span>
              <p className="text-sm">{categorie.description}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive mt-4">
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
            Toutes les données associées à cette catégorie seront définitivement perdues.
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