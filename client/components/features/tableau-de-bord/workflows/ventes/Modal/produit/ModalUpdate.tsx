"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import type { Produit } from '@/domains/models/Produit';

interface ModalUpdateProduitProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (produit: Produit) => void;
  produit: Produit | null;
}

const ModalUpdateProduit: React.FC<ModalUpdateProduitProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  produit 
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    pu: '',
    reference: '',
    actif: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (produit) {
      setFormData({
        nom: produit.nom,
        pu: produit.pu.toString(),
        reference: produit.reference || '',
        actif: produit.actif
      });
      setErrors({});
    }
  }, [produit]);

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
    if (!validate() || !produit) return;

    setIsLoading(true);

    try {
      const updatedData: Partial<Produit> = {
        nom: formData.nom,
        pu: parseFloat(formData.pu),
        reference: formData.reference || undefined,
        actif: formData.actif,
      };

      const updatedProduit = await ProduitRepoAPI.update(produit._id, updatedData);
      onSuccess(updatedProduit);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      alert("Une erreur est survenue lors de la mise à jour du produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Modifiez les informations du produit
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nom-update">
              Nom du produit <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom-update"
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
            <Label htmlFor="reference-update">Référence</Label>
            <Input
              id="reference-update"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Ex: MBP-001"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pu-update">
              Prix Unitaire (€) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pu-update"
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
            <Label htmlFor="actif-update" className="cursor-pointer">
              Produit actif
            </Label>
            <Switch
              id="actif-update"
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
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateProduit;