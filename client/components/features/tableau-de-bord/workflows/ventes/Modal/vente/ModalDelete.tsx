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
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import type { Vente } from '@/domains/models/Vente';

interface ModalDeleteVenteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  vente: Vente;
}

export function ModalDeleteVente({ 
  open, 
  onOpenChange, 
  onSuccess, 
  vente 
}: ModalDeleteVenteProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await VenteRepoAPI.delete(vente._id);
      
      console.log("Vente supprimée avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la vente:", error);
      alert("Une erreur est survenue lors de la suppression de la vente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getProduitName = () => {
    if (typeof vente.produitId === 'object' && vente.produitId?.nom) {
      return vente.produitId.nom;
    }
    return 'cette vente';
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la vente</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer la vente de <strong>{getProduitName()}</strong> ({vente.qte} unité{vente.qte > 1 ? 's' : ''}) ?
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