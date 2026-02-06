"use client"

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { VenteRepoAPI } from '@/infrastructures/repository/VenteRepoAPI';
import type { Vente } from '@/domains/models/Vente';
import type { Produit } from '@/domains/models/Produit';
import type { UpdateVenteDTO } from '@/domains/dto/vente.dto';

interface ModalUpdateVenteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  vente: Vente;
  produits: Produit[];
}

export function ModalUpdateVente({ 
  open, 
  onOpenChange, 
  onSuccess, 
  vente, 
  produits 
}: ModalUpdateVenteProps) {
  const [venteForm, setVenteForm] = useState({ 
    produitId: '', 
    qte: '', 
    sourceType: 'WEBFORM' as 'WEBFORM' | 'EXCEL' | 'GOOGLE' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (vente) {
      setVenteForm({
        produitId: typeof vente.produitId === 'string' ? vente.produitId : vente.produitId._id,
        qte: vente.qte.toString(),
        sourceType: vente.sourceType
      });
    }
  }, [vente]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!venteForm.produitId) {
      newErrors.produitId = 'Le produit est requis';
    }
    
    if (!venteForm.qte || parseInt(venteForm.qte) <= 0) {
      newErrors.qte = 'La quantité doit être supérieure à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const updatedData: UpdateVenteDTO = {
        produitId: venteForm.produitId,
        qte: parseInt(venteForm.qte),
      };

      await VenteRepoAPI.update(vente._id, updatedData);
      
      console.log("Vente modifiée avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la modification de la vente:", error);
      alert("Une erreur est survenue lors de la modification de la vente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier une vente</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la vente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="produitId">
              Produit <span className="text-red-500">*</span>
            </Label>
            <Select
              value={venteForm.produitId}
              onValueChange={(value) => setVenteForm({ ...venteForm, produitId: value })}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.produitId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez un produit" />
              </SelectTrigger>
              <SelectContent>
                {produits.filter(p => p.actif).map((produit) => (
                  <SelectItem key={produit._id} value={produit._id}>
                    {produit.nom} - {produit.pu.toFixed(2)} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.produitId && (
              <p className="text-sm text-red-500">{errors.produitId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="qte">
              Quantité <span className="text-red-500">*</span>
            </Label>
            <Input
              id="qte"
              type="number"
              min="1"
              value={venteForm.qte}
              onChange={(e) => setVenteForm({ ...venteForm, qte: e.target.value })}
              placeholder="1"
              className={errors.qte ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.qte && (
              <p className="text-sm text-red-500">{errors.qte}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceType">Source</Label>
            <Select
              value={venteForm.sourceType}
              onValueChange={(value: 'WEBFORM' | 'EXCEL' | 'GOOGLE') => 
                setVenteForm({ ...venteForm, sourceType: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEBFORM">Formulaire Web</SelectItem>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="GOOGLE">Google Sheets</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Modification...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}