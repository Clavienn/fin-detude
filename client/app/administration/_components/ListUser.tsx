"use client"

import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI'
import React, { useEffect, useState } from 'react'
import type { User } from "@/domains/models/User"
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
import { Pencil, Trash2, UserPlus, Loader2 } from "lucide-react"
import { ModalCreate } from './modal/users/ModalCreate'
import { ModalUpdate } from './modal/users/ModalUpdate'
import { DeleteUser } from './modal/users/ModalDelete'

function ListUser() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const listUsers = async () => {
    try {
      setLoading(true)
      const data = await UserRepoAPI.getAll()
      console.log("DATA USER :", data)
      setUsers(data)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listUsers()
  }, [])

  const handleCreateSuccess = () => {
    listUsers()
    setIsCreateOpen(false)
  }

  const handleUpdateSuccess = () => {
    listUsers()
    setIsUpdateOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteSuccess = () => {
    listUsers()
    setUserToDelete(null)
  }

  const openUpdateModal = (user: User) => {
    setSelectedUser(user)
    setIsUpdateOpen(true)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive'
      case 'user':
        return 'default'
      case 'moderator':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Gestion des Utilisateurs</CardTitle>
              <CardDescription className="mt-2">
                Gérez tous les utilisateurs de votre plateforme
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              size="lg"
              className="gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Nouvel Utilisateur
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
                    <TableHead className="font-semibold">Nom</TableHead>
                    <TableHead className="font-semibold">Téléphone</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Rôle</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {user._id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.tel}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUpdateModal(user)}
                              className="gap-1.5"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setUserToDelete(user)}
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
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

      <ModalCreate 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      {selectedUser && (
        <ModalUpdate 
          open={isUpdateOpen} 
          onOpenChange={setIsUpdateOpen}
          user={selectedUser}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {userToDelete && (
        <DeleteUser 
          open={!!userToDelete}
          onOpenChange={(open: boolean) => !open && setUserToDelete(null)}
          user={userToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}

export default ListUser