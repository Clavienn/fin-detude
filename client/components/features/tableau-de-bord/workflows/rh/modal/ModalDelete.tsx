"use client"

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import type { Employee } from '@/domains/models/Employee';

interface ModalDeleteEmployeeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employee: Employee;
}

export function ModalDeleteEmployee({ 
  open, 
  onOpenChange, 
  onSuccess, 
  employee 
}: ModalDeleteEmployeeProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await EmployeeRepoAPI.delete(employee._id);
      
      console.log("Employé supprimé avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      alert("Une erreur est survenue lors de la suppression de l'employé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l&apos;employé</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer <strong>{employee.nom}</strong> (Matricule: {employee.matricule}) ?
            Cette action est irréversible et supprimera également toutes les données de performance associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}