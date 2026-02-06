"use client"

import { CategorieRepoAPI } from '@/infrastructures/repository/CatRepoAPI'
import React, { useEffect, useState } from 'react'
import type { Categorie } from "@/domains/models/Categorie"
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
import { Trash2, FolderPlus, Loader2 } from "lucide-react"
import { ModalCreateCategorie } from './modal/categorie/ModalCreate'
import { DeleteCategorie } from './modal/categorie/ModalDelete'

function ListCategorie() {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [categorieToDelete, setCategorieToDelete] = useState<Categorie | null>(null)

  const listCategories = async () => {
    try {
      setLoading(true)
      const data = await CategorieRepoAPI.getAll()
      console.log("DATA CATEGORIES :", data)
      setCategories(data)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listCategories()
  }, [])

  const handleCreateSuccess = () => {
    listCategories()
    setIsCreateOpen(false)
  }

  const handleDeleteSuccess = () => {
    listCategories()
    setCategorieToDelete(null)
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

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Gestion des Catégories</CardTitle>
              <CardDescription className="mt-2">
                Gérez toutes les catégories de votre système
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              size="lg"
              className="gap-2"
            >
              <FolderPlus className="h-5 w-5" />
              Nouvelle Catégorie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Code</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucune catégorie trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((categorie) => (
                      <TableRow key={categorie._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {categorie._id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCodeBadgeVariant(categorie.code)}>
                            {getCodeLabel(categorie.code)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          {categorie.description || (
                            <span className="text-muted-foreground italic">Aucune description</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setCategorieToDelete(categorie)}
                            className="gap-1.5"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
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

      <ModalCreateCategorie 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      {categorieToDelete && (
        <DeleteCategorie 
          open={!!categorieToDelete}
          onOpenChange={(open: boolean) => !open && setCategorieToDelete(null)}
          categorie={categorieToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}

export default ListCategorie