"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import type { Produit } from '@/domains/models/Produit';
import type { CreateProduitDTO } from '@/domains/dto/produit.dto';

interface ModalAddProduitProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (produit: Produit) => void;
  workflowId: string;
}

const ModalAddProduit: React.FC<ModalAddProduitProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  workflowId 
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    pu: '',
    reference: '',
    actif: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({ nom: '', pu: '', reference: '', actif: true });
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.pu || parseFloat(formData.pu) <= 0) {
      newErrors.pu = 'Le prix doit être supérieur à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const newProduitData: CreateProduitDTO = {
        nom: formData.nom,
        pu: parseFloat(formData.pu),
        reference: formData.reference || undefined,
        actif: formData.actif,
        workflowId
      };

      const createdProduit = await ProduitRepoAPI.create(newProduitData);
      onSuccess(createdProduit);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
      alert("Une erreur est survenue lors de la création du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du nouveau produit
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nom">
              Nom du produit <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: MacBook Pro"
              className={errors.nom ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.nom && (
              <p className="text-sm text-red-500">{errors.nom}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Référence</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Ex: MBP-001"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pu">
              Prix Unitaire (€) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pu"
              type="number"
              step="0.01"
              min="0"
              value={formData.pu}
              onChange={(e) => setFormData({ ...formData, pu: e.target.value })}
              placeholder="2499.99"
              className={errors.pu ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.pu && (
              <p className="text-sm text-red-500">{errors.pu}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="actif" className="cursor-pointer">
              Produit actif
            </Label>
            <Switch
              id="actif"
              checked={formData.actif}
              onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddProduit;