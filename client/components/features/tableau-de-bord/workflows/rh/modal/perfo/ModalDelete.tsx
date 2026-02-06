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
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import type { PerfoData } from '@/domains/models/PerfoData';

interface ModalDeletePerformanceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  perfoData: PerfoData;
}

export function ModalDeletePerformance({ 
  open, 
  onOpenChange, 
  onSuccess, 
  perfoData 
}: ModalDeletePerformanceProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await PerfoDataRepoAPI.delete(perfoData._id);
      
      console.log("Performance supprimée avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la performance:", error);
      alert("Une erreur est survenue lors de la suppression de la performance.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = () => {
    if (typeof perfoData.employeeId === 'object' && perfoData.employeeId?.nom) {
      return perfoData.employeeId.nom;
    }
    return 'cet employé';
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la performance</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette donnée de performance pour <strong>{getEmployeeName()}</strong> (Score: {perfoData.score}, Période: {perfoData.periode}) ?
            Cette action est irréversible.
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