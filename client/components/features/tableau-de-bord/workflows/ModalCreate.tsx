import React, { useState } from 'react';
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

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Données statiques pour les catégories
const categories = [
  { _id: 'cat1', nom: 'Marketing' },
  { _id: 'cat2', nom: 'Ventes' },
  { _id: 'cat3', nom: 'Support' },
  { _id: 'cat4', nom: 'Finance' },
  { _id: 'cat5', nom: 'RH' },
];

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorieId: '',
    categorieName: '',
    actif: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      nom: '',
      description: '',
      categorieId: '',
      categorieName: '',
      actif: true,
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau workflow</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau workflow d&apos;automatisation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">
                Nom du workflow <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nom"
                placeholder="Ex: Workflow Marketing"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className={errors.nom ? 'border-red-500' : ''}
              />
              {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorieId">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'objectif de ce workflow..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="actif" className="cursor-pointer">
                Workflow actif
              </Label>
              <Switch
                id="actif"
                checked={formData.actif}
                onCheckedChange={(checked) => handleChange('actif', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">Créer le workflow</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreate;