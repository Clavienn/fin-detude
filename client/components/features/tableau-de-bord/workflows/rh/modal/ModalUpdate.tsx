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
import { Button } from '@/components/ui/button';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import type { Employee } from '@/domains/models/Employee';
import type { UpdateEmployeeDTO } from '@/domains/dto/employee.dto';

interface ModalUpdateEmployeeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employee: Employee;
}

export function ModalUpdateEmployee({ 
  open, 
  onOpenChange, 
  onSuccess, 
  employee 
}: ModalUpdateEmployeeProps) {
  const [employeeForm, setEmployeeForm] = useState({ 
    matricule: '', 
    nom: '', 
    poste: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setEmployeeForm({
        matricule: employee.matricule,
        nom: employee.nom,
        poste: employee.poste || ''
      });
    }
  }, [employee]);

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
      const updatedData: UpdateEmployeeDTO = {
        matricule: employeeForm.matricule,
        nom: employeeForm.nom,
        poste: employeeForm.poste || undefined,
      };

      await EmployeeRepoAPI.update(employee._id, updatedData);
      
      console.log("Employé modifié avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la modification de l'employé:", error);
      alert("Une erreur est survenue lors de la modification de l'employé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier un employé</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l&apos;employé
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
            {isLoading ? 'Modification...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}