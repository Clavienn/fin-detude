"use client"

import React, { useState, useEffect } from 'react'
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { CategorieRepoAPI } from '@/infrastructures/repository/CatRepoAPI'
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import type { Workflow } from "@/domains/models/Workflow"
import type { Categorie } from "@/domains/models/Categorie"
import type { User } from "@/domains/models/User"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Edit, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModalUpdateWorkflowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: Workflow
  onSuccess: () => void
}

export function ModalUpdateWorkflow({ open, onOpenChange, workflow, onSuccess }: ModalUpdateWorkflowProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string>("")
  const [categories, setCategories] = useState<Categorie[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState<Partial<Workflow>>({
    nom: '',
    description: '',
    actif: true,
    categorieId: '',
    userId: ''
  })

  useEffect(() => {
    if (open && workflow) {
      const categorieId = typeof workflow.categorieId === 'object' 
        ? workflow.categorieId._id 
        : workflow.categorieId
      const userId = typeof workflow.userId === 'object' 
        ? workflow.userId._id 
        : workflow.userId

      setFormData({
        nom: workflow.nom,
        description: workflow.description,
        actif: workflow.actif,
        categorieId,
        userId
      })
      setError("")
      loadSelectData()
    }
  }, [open, workflow])

  const loadSelectData = async () => {
    try {
      setLoadingData(true)
      const [categoriesData, usersData] = await Promise.all([
        CategorieRepoAPI.getAll(),
        UserRepoAPI.getAll()
      ])
      setCategories(categoriesData)
      setUsers(usersData)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      setError("Impossible de charger les catégories et utilisateurs")
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (field: keyof Workflow, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.nom || !formData.categorieId || !formData.userId) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)
      await WorkflowRepoAPI.update(workflow._id, formData)
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de modifier le workflow")
    } finally {
      setLoading(false)
    }
  }

  const getCategorieLabel = (code: string) => {
    return code === 'VENTE' ? 'Vente' : 'Performance Employé'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-5 w-5" />
            Modifier le Workflow
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="update-nom" className="text-sm">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-nom"
                  placeholder="Nom du workflow"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  disabled={loading}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="update-description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="update-description"
                  placeholder="Description du workflow..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={loading}
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="update-categorieId" className="text-sm">
                    Catégorie <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.categorieId as string} 
                    onValueChange={(value) => handleChange('categorieId', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {getCategorieLabel(cat.code)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                  <div className="space-y-1.5">
                  <Label htmlFor="update-userId" className="text-sm">
                    Utilisateur <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="update-userId"
                    value={users.find(user => user._id === formData.userId)?.name || 'N/A'}
                    disabled
                    className="h-9 bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="update-actif" className="text-sm font-medium">
                    Statut du workflow
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {formData.actif ? 'Le workflow est actif' : 'Le workflow est inactif'}
                  </p>
                </div>
                <Switch
                  id="update-actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => handleChange('actif', checked)}
                  disabled={loading}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 pt-2 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || loadingData}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || loadingData} 
              className="gap-2 w-full sm:w-auto"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}