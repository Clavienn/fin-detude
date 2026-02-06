"use client"

import React, { useState } from 'react'
import { CategorieRepoAPI } from '@/infrastructures/repository/CatRepoAPI'
import type { Categorie } from "@/domains/models/Categorie"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, FolderPlus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModalCreateCategorieProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ModalCreateCategorie({ open, onOpenChange, onSuccess }: ModalCreateCategorieProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState<Omit<Categorie, "_id">>({
    code: "VENTE",
    description: ''
  })

  const handleChange = (field: keyof Omit<Categorie, "_id">, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.code) {
      setError("Le code est obligatoire")
      return
    }

    try {
      setLoading(true)
      await CategorieRepoAPI.create(formData)
      
      setFormData({
        code: "VENTE",
        description: ''
      })
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de créer la catégorie")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderPlus className="h-5 w-5" />
            Créer une Catégorie
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-sm">
                Code <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.code} 
                onValueChange={(value) => handleChange('code', value as "VENTE" | "PERFO_EMP")}
                disabled={loading}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner un code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENTE">Vente</SelectItem>
                  <SelectItem value="PERFO_EMP">Performance Employé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Description de la catégorie..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={loading}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Facultatif - Ajoutez une description pour mieux identifier cette catégorie
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2 pt-2 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 w-full sm:w-auto">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}