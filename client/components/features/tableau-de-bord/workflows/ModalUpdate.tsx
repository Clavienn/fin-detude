import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Workflow {
  _id: string;
  nom: string;
  description?: string;
  actif: boolean;
  categorieId: string;
  categorieName: string;
}

interface ModalUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  workflow: Workflow;
}

// Données statiques pour les catégories
const categories = [
  { _id: 'cat1', nom: 'Marketing' },
  { _id: 'cat2', nom: 'Ventes' },
  { _id: 'cat3', nom: 'Support' },
  { _id: 'cat4', nom: 'Finance' },
  { _id: 'cat5', nom: 'RH' },
];

const ModalUpdate: React.FC<ModalUpdateProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workflow,
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorieId: '',
    categorieName: '',
    actif: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workflow) {
      setFormData({
        nom: workflow.nom,
        description: workflow.description || '',
        categorieId: workflow.categorieId,
        categorieName: workflow.categorieName,
        actif: workflow.actif,
      });
    }
  }, [workflow]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleCategorieChange = (value: string) => {
    const selectedCategorie = categories.find((cat) => cat._id === value);
    setFormData({
      ...formData,
      categorieId: value,
      categorieName: selectedCategorie?.nom || '',
    });
    if (errors.categorieId) {
      setErrors({ ...errors, categorieId: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.categorieId) {
      newErrors.categorieId = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le workflow</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre workflow d&apos;automatisation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom-update">
                Nom du workflow <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nom-update"
                placeholder="Ex: Workflow Marketing"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className={errors.nom ? 'border-red-500' : ''}
              />
              {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorieId-update">
                Catégorie <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categorieId}
                onValueChange={handleCategorieChange}
              >
                <SelectTrigger className={errors.categorieId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categorieId && (
                <p className="text-sm text-red-500">{errors.categorieId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description-update">Description</Label>
              <Textarea
                id="description-update"
                placeholder="Décrivez l'objectif de ce workflow..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="actif-update" className="cursor-pointer">
                Workflow actif
              </Label>
              <Switch
                id="actif-update"
                checked={formData.actif}
                onCheckedChange={(checked) => handleChange('actif', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdate;