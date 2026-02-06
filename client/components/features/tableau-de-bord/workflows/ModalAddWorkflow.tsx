"use client"

import React, { useState, useEffect } from 'react'
import { WorkflowRepoAPI } from '@/infrastructures/repository/WorkflowRepoAPI'
import { CategorieRepoAPI } from '@/infrastructures/repository/CatRepoAPI'
import type { CreateWorkflowDTO } from "@/domains/dto/workflow.dto"
import type { Categorie } from "@/domains/models/Categorie"
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
import { Loader2, GitBranch, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModalCreateWorkflowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ModalCreateWorkflow({ open, onOpenChange, onSuccess }: ModalCreateWorkflowProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string>("")
  const [categories, setCategories] = useState<Categorie[]>([])
  const [formData, setFormData] = useState<CreateWorkflowDTO>({
    nom: '',
    description: '',
    actif: true,
    categorieId: '',
  })

  useEffect(() => {
    if (open) {
      loadSelectData()
    }
  }, [open])

  const loadSelectData = async () => {
    try {
      setLoadingData(true)
      const [categoriesData] = await Promise.all([
        CategorieRepoAPI.getAll(),
      ])
      setCategories(categoriesData)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      setError("Impossible de charger les catégories et utilisateurs")
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (field: keyof CreateWorkflowDTO, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.nom || !formData.categorieId) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)
      
      await WorkflowRepoAPI.create(formData)
      
      setFormData({
        nom: '',
        description: '',
        actif: true,
        categorieId: '',
      })
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de créer le workflow")
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
            <GitBranch className="h-5 w-5" />
            Créer un Workflow
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
                <Label htmlFor="nom" className="text-sm">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nom"
                  placeholder="Nom du workflow"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  disabled={loading}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description du workflow..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={loading}
                  className="min-h-[80px] resize-none"
                />
              </div>
              
                <div className="space-y-1.5">
                  <Label htmlFor="categorieId" className="text-sm">
                    Catégorie <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.categorieId} 
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
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="actif" className="text-sm font-medium">
                    Statut du workflow
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {formData.actif ? 'Le workflow est actif' : 'Le workflow est inactif'}
                  </p>
                </div>
                <Switch
                  id="actif"
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
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}