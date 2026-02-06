"use client"

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import type { CreateEmployeeDTO } from '@/domains/dto/employee.dto';

interface ModalAddEmployeeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  workflowId: string;
}

export function ModalAddEmployee({ 
  open, 
  onOpenChange, 
  onSuccess, 
  workflowId, 
}: ModalAddEmployeeProps) {
  const [employeeForm, setEmployeeForm] = useState({ 
    matricule: '', 
    nom: '', 
    poste: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!employeeForm.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }
    
    if (!employeeForm.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const newEmployeeData: CreateEmployeeDTO = {
        matricule: employeeForm.matricule,
        nom: employeeForm.nom,
        poste: employeeForm.poste || undefined,
        workflowId,
      };

      await EmployeeRepoAPI.create(newEmployeeData);
      
      console.log("Employé créé avec succès");
      setEmployeeForm({ matricule: '', nom: '', poste: '' });
      setErrors({});
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'employé:", error);
      alert("Une erreur est survenue lors de la création de l'employé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un employé</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l&apos;employé
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="matricule">
              Matricule <span className="text-red-500">*</span>
            </Label>
            <Input
              id="matricule"
              value={employeeForm.matricule}
              onChange={(e) => setEmployeeForm({ ...employeeForm, matricule: e.target.value })}
              placeholder="Ex: EMP001"
              className={errors.matricule ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.matricule && (
              <p className="text-sm text-red-500">{errors.matricule}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">
              Nom complet <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom"
              value={employeeForm.nom}
              onChange={(e) => setEmployeeForm({ ...employeeForm, nom: e.target.value })}
              placeholder="Ex: Jean Dupont"
              className={errors.nom ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.nom && (
              <p className="text-sm text-red-500">{errors.nom}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="poste">Poste</Label>
            <Input
              id="poste"
              value={employeeForm.poste}
              onChange={(e) => setEmployeeForm({ ...employeeForm, poste: e.target.value })}
              placeholder="Ex: Développeur Senior"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}