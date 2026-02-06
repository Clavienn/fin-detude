"use client"

import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import type { Produit } from '@/domains/models/Produit';

interface ModalDeleteProduitProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
  produit: Produit | null;
}

const ModalDeleteProduit: React.FC<ModalDeleteProduitProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  produit 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!produit) return;

    setIsLoading(true);

    try {
      await ProduitRepoAPI.delete(produit._id);
      onSuccess(produit._id);
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      alert("Une erreur est survenue lors de la suppression du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer <strong>{produit?.nom}</strong> ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Annuler
          </AlertDialogCancel>
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
};

export default ModalDeleteProduit;