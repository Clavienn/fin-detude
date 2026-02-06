"use client"

import React, { useState, useEffect } from 'react'
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import type { User } from "@/domains/models/User"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Edit, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModalUpdateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onSuccess: () => void
}

export function ModalUpdate({ open, onOpenChange, user, onSuccess }: ModalUpdateProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    tel: '',
    role: 'USER'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role
      })
      setError("")
    }
  }, [user])

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.name || !formData.email) {
      setError("Le nom et l'email sont obligatoires")
      return
    }

    try {
      setLoading(true)
      await UserRepoAPI.update(user._id, formData)
      
      onSuccess()
    } catch (error: any) {
      setError(error?.response?.data?.message || "Impossible de modifier l'utilisateur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-5 w-5" />
            Modifier l'Utilisateur
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
              <Label htmlFor="update-name" className="text-sm">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="update-name"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={loading}
                className="h-9"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="update-email" className="text-sm">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={loading}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="update-tel" className="text-sm">
                  Téléphone
                </Label>
                <Input
                  id="update-tel"
                  type="tel"
                  placeholder="+261 34 00 00 00"
                  value={formData.tel}
                  onChange={(e) => handleChange('tel', e.target.value)}
                  disabled={loading}
                  className="h-9"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="update-role" className="text-sm">
                Rôle
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleChange('role', value)}
                disabled={loading}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="moderator">Modérateur</SelectItem>
                </SelectContent>
              </Select>
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
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}