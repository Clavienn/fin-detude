"use client"

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FormationRepoAPI } from '@/infrastructures/repository/FormationRepoAPI';
import type { Formation } from '@/domains/models/Formation';

interface FormationListProps {
  formations: Formation[];
  onUpdate: () => void;
}

const FormationList: React.FC<FormationListProps> = ({ formations, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFormation, setCurrentFormation] = useState<Partial<Formation>>({});

  const handleOpenDialog = (formation?: Formation) => {
    if (formation) {
      setIsEditing(true);
      setCurrentFormation(formation);
    } else {
      setIsEditing(false);
      setCurrentFormation({});
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentFormation({});
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentFormation._id) {
        // Mode édition - utiliser update
        await FormationRepoAPI.update(currentFormation._id, currentFormation);
        } else {
        // Mode création - utiliser create
        await FormationRepoAPI.create(currentFormation as Omit<Formation, '_id'>);
        }
      handleCloseDialog();
      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleChange = (field: keyof Formation, value: any) => {
    setCurrentFormation(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getParticipationRate = (formation: Formation) => {
    if (!formation.participantsPrevus || formation.participantsPrevus === 0) return 0;
    return ((formation.participantsReels || 0) / formation.participantsPrevus * 100).toFixed(1);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Liste des Formations</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Formation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucune formation enregistrée</p>
              <p className="text-sm">Cliquez sur Nouvelle Formation pour commencer</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead className="text-center">Participants prévus</TableHead>
                  <TableHead className="text-center">Participants réels</TableHead>
                  <TableHead className="text-center">Taux participation</TableHead>
                  <TableHead className="text-center">Taux réussite</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formations.map((formation) => (
                  <TableRow key={formation._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{formation.titre}</div>
                        {formation.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {formation.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(formation.dateDebut)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-50">
                        {formation.participantsPrevus || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-50">
                        {formation.participantsReels || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={
                          Number(getParticipationRate(formation)) >= 70 
                            ? "bg-green-100 text-green-700 border-green-300" 
                            : "bg-orange-100 text-orange-700 border-orange-300"
                        }
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {getParticipationRate(formation)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={
                          (formation.tauxReussite || 0) >= 70 
                            ? "bg-green-100 text-green-700 border-green-300" 
                            : "bg-red-100 text-red-700 border-red-300"
                        }
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {formation.tauxReussite || 0}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(formation)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifier la formation' : 'Nouvelle formation'}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations de la formation
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={currentFormation.titre || ''}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  required
                  placeholder="Ex: Formation React Avancé"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentFormation.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Description de la formation..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={currentFormation.dateDebut || ''}
                    onChange={(e) => handleChange('dateDebut', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="participantsPrevus">Participants prévus</Label>
                  <Input
                    id="participantsPrevus"
                    type="number"
                    min="0"
                    value={currentFormation.participantsPrevus || ''}
                    onChange={(e) => handleChange('participantsPrevus', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="participantsReels">Participants réels</Label>
                  <Input
                    id="participantsReels"
                    type="number"
                    min="0"
                    value={currentFormation.participantsReels || ''}
                    onChange={(e) => handleChange('participantsReels', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tauxReussite">Taux de réussite (%)</Label>
                  <Input
                    id="tauxReussite"
                    type="number"
                    min="0"
                    max="100"
                    value={currentFormation.tauxReussite || ''}
                    onChange={(e) => handleChange('tauxReussite', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormationList;