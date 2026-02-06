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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import type { Employee } from '@/domains/models/Employee';
import type { CreatePerfoDataDTO } from '@/domains/dto/perfoData.dto';

interface ModalAddPerformanceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employees: Employee[];
  workflowId: string;
  userId: string;
}

export function ModalAddPerformance({ 
  open, 
  onOpenChange, 
  onSuccess, 
  employees,
  workflowId, 
  userId 
}: ModalAddPerformanceProps) {
  const [perfoForm, setPerfoForm] = useState({ 
    employeeId: '', 
    score: '', 
    tache: '', 
    periode: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!perfoForm.employeeId) {
      newErrors.employeeId = 'L\'employé est requis';
    }
    
    if (!perfoForm.score || parseFloat(perfoForm.score) < 0 || parseFloat(perfoForm.score) > 100) {
      newErrors.score = 'Le score doit être entre 0 et 100';
    }
    
    if (!perfoForm.periode) {
      newErrors.periode = 'La période est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const newPerfoData: CreatePerfoDataDTO = {
        employeeId: perfoForm.employeeId,
        score: parseFloat(perfoForm.score),
        tache: perfoForm.tache || undefined,
        periode: perfoForm.periode,
        workflowId,
      };

      await PerfoDataRepoAPI.create(newPerfoData);
      
      console.log("Performance créée avec succès");
      setPerfoForm({ employeeId: '', score: '', tache: '', periode: '' });
      setErrors({});
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de la performance:", error);
      alert("Une erreur est survenue lors de la création de la performance.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une performance</DialogTitle>
          <DialogDescription>
            Enregistrez les données de performance
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">
              Employé <span className="text-red-500">*</span>
            </Label>
            <Select
              value={perfoForm.employeeId}
              onValueChange={(value) => setPerfoForm({ ...perfoForm, employeeId: value })}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.employeeId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionnez un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.nom} - {employee.matricule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-sm text-red-500">{errors.employeeId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tache">Tâche</Label>
            <Input
              id="tache"
              value={perfoForm.tache}
              onChange={(e) => setPerfoForm({ ...perfoForm, tache: e.target.value })}
              placeholder="Ex: Développement API"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="score">
              Score (0-100) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              value={perfoForm.score}
              onChange={(e) => setPerfoForm({ ...perfoForm, score: e.target.value })}
              placeholder="85"
              className={errors.score ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.score && (
              <p className="text-sm text-red-500">{errors.score}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="periode">
              Période <span className="text-red-500">*</span>
            </Label>
            <Input
              id="periode"
              type="date"
              value={perfoForm.periode}
              onChange={(e) => setPerfoForm({ ...perfoForm, periode: e.target.value })}
              className={errors.periode ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.periode && (
              <p className="text-sm text-red-500">{errors.periode}</p>
            )}
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