"use client"

import React, { useState } from 'react'
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import type { User } from "@/domains/models/User"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteUserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onSuccess: () => void
}

export function DeleteUser({ open, onOpenChange, user, onSuccess }: DeleteUserProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleDelete = async () => {
    setError("")
    try {
      setLoading(true)
      await UserRepoAPI.delete(user._id)
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de supprimer l'utilisateur")
      setLoading(false)
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
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 rounded-lg border border-muted bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">Nom:</span>
            <span className="text-sm font-semibold">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">Email:</span>
            <span className="text-sm font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">Rôle:</span>
            <span className="text-sm font-semibold capitalize">{user.role}</span>
          </div>
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
            Toutes les données associées à cet utilisateur seront définitivement perdues.
          </p>
        </div>

        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel disabled={loading}>
            Annuler
          </AlertDialogCancel>
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