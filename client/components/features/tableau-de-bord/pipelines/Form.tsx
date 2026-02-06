"use client"

import React, { useState } from 'react';
import { Send, CheckCircle, TrendingUp, Users, Calendar, Package, Hash, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// ===== TYPES =====
interface PerfoDataForm {
  workflowId: string;
  employeeId: string;
  score: number;
  tache: string;
  periode: string;
}

interface VenteForm {
  workflowId: string;
  produitId: string;
  qte: number;
  sourceType: 'WEBFORM';
}

interface SalesDataForm {
  workflowId: string;
  totalVente: number;
  periode: string;
}

// ===== DONNÉES DE RÉFÉRENCE =====
const workflows = [
  { id: 'wf-perfo-1', name: 'Performance Équipe Support', type: 'PERFO_EMP' },
  { id: 'wf-perfo-2', name: 'Évaluation Développeurs', type: 'PERFO_EMP' },
  { id: 'wf-vente-1', name: 'Ventes Boutique Paris', type: 'VENTE' },
  { id: 'wf-vente-2', name: 'Ventes E-commerce', type: 'VENTE' },
];

const employees = [
  { id: 'emp-1', workflowId: 'wf-perfo-1', matricule: 'EMP001', nom: 'Jean Dupont' },
  { id: 'emp-2', workflowId: 'wf-perfo-1', matricule: 'EMP002', nom: 'Marie Martin' },
  { id: 'emp-3', workflowId: 'wf-perfo-2', matricule: 'DEV001', nom: 'Pierre Durand' },
  { id: 'emp-4', workflowId: 'wf-perfo-2', matricule: 'DEV002', nom: 'Sophie Bernard' },
];

const produits = [
  { id: 'prod-1', workflowId: 'wf-vente-1', nom: 'Laptop Pro', pu: 1299.99, ref: 'LAP-001' },
  { id: 'prod-2', workflowId: 'wf-vente-1', nom: 'Souris Sans Fil', pu: 29.99, ref: 'SOU-001' },
  { id: 'prod-3', workflowId: 'wf-vente-2', nom: 'Clavier Mécanique', pu: 149.99, ref: 'CLA-001' },
  { id: 'prod-4', workflowId: 'wf-vente-2', nom: 'Écran 27"', pu: 399.99, ref: 'ECR-001' },
];

const WebFormsSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('perfo');
  const [submitted, setSubmitted] = useState<string | null>(null);

  // ===== FORM 1: PERFORMANCE EMPLOYÉ =====
  const [perfoForm, setPerfoForm] = useState<PerfoDataForm>({
    workflowId: '',
    employeeId: '',
    score: 0,
    tache: '',
    periode: '',
  });

  // ===== FORM 2: VENTE =====
  const [venteForm, setVenteForm] = useState<VenteForm>({
    workflowId: '',
    produitId: '',
    qte: 0,
    sourceType: 'WEBFORM',
  });

  // ===== FORM 3: DONNÉES VENTES GLOBALES =====
  const [salesDataForm, setSalesDataForm] = useState<SalesDataForm>({
    workflowId: '',
    totalVente: 0,
    periode: '',
  });

  // ===== HANDLERS =====
  const handlePerfoSubmit = () => {
    if (!perfoForm.workflowId || !perfoForm.employeeId || !perfoForm.periode) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    console.log('PerfoData submitted:', perfoForm);
    setSubmitted('perfo');
    setTimeout(() => {
      setSubmitted(null);
      setPerfoForm({ workflowId: '', employeeId: '', score: 0, tache: '', periode: '' });
    }, 3000);
  };

  const handleVenteSubmit = () => {
    if (!venteForm.workflowId || !venteForm.produitId || venteForm.qte <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    console.log('Vente submitted:', venteForm);
    setSubmitted('vente');
    setTimeout(() => {
      setSubmitted(null);
      setVenteForm({ workflowId: '', produitId: '', qte: 0, sourceType: 'WEBFORM' });
    }, 3000);
  };

  const handleSalesDataSubmit = () => {
    if (!salesDataForm.workflowId || !salesDataForm.periode || salesDataForm.totalVente <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    console.log('SalesData submitted:', salesDataForm);
    setSubmitted('salesdata');
    setTimeout(() => {
      setSubmitted(null);
      setSalesDataForm({ workflowId: '', totalVente: 0, periode: '' });
    }, 3000);
  };

  // ===== FILTRES =====
  const perfoWorkflows = workflows.filter(w => w.type === 'PERFO_EMP');
  const venteWorkflows = workflows.filter(w => w.type === 'VENTE');
  const filteredEmployees = employees.filter(e => e.workflowId === perfoForm.workflowId);
  const filteredProduits = produits.filter(p => p.workflowId === venteForm.workflowId);
  const selectedProduit = produits.find(p => p.id === venteForm.produitId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Formulaires Web</h1>
          <p className="text-gray-600">Saisie de données pour vos workflows d'analyse</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfo" className="gap-2">
              <Users className="w-4 h-4" />
              Performance Employé
            </TabsTrigger>
            <TabsTrigger value="vente" className="gap-2">
              <Package className="w-4 h-4" />
              Vente Produit
            </TabsTrigger>
            <TabsTrigger value="salesdata" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Données Ventes
            </TabsTrigger>
          </TabsList>

          {/* ===== FORMULAIRE 1: PERFORMANCE EMPLOYÉ ===== */}
          <TabsContent value="perfo">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl">Évaluation Performance Employé</CardTitle>
                    <CardDescription className="text-purple-100">
                      Collection: <strong>PerfoEmp_Data</strong>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted === 'perfo' ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Données enregistrées !</h3>
                    <p className="text-gray-600">L'évaluation a été ajoutée au dataset d'analyse</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Workflow */}
                    <div>
                      <Label htmlFor="perfo-workflow" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Workflow de Performance *
                      </Label>
                      <Select
                        value={perfoForm.workflowId}
                        onValueChange={(value) =>
                          setPerfoForm({ ...perfoForm, workflowId: value, employeeId: '' })
                        }
                      >
                        <SelectTrigger id="perfo-workflow">
                          <SelectValue placeholder="Sélectionnez un workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          {perfoWorkflows.map((wf) => (
                            <SelectItem key={wf.id} value={wf.id}>
                              {wf.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Employé */}
                    <div>
                      <Label htmlFor="perfo-employee" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Employé *
                      </Label>
                      <Select
                        value={perfoForm.employeeId}
                        onValueChange={(value) => setPerfoForm({ ...perfoForm, employeeId: value })}
                        disabled={!perfoForm.workflowId}
                      >
                        <SelectTrigger id="perfo-employee">
                          <SelectValue placeholder="Sélectionnez un employé" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredEmployees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.matricule} - {emp.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {perfoForm.workflowId && filteredEmployees.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          Aucun employé dans ce workflow
                        </p>
                      )}
                    </div>

                    {/* Score */}
                    <div>
                      <Label htmlFor="perfo-score" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Score de Performance (0-100) *
                      </Label>
                      <Input
                        id="perfo-score"
                        type="number"
                        min="0"
                        max="100"
                        value={perfoForm.score || ''}
                        onChange={(e) =>
                          setPerfoForm({ ...perfoForm, score: parseInt(e.target.value) || 0 })
                        }
                        placeholder="85"
                      />
                      <div className="flex gap-2 mt-2">
                        <Badge variant={perfoForm.score >= 80 ? 'default' : 'secondary'}>
                          {perfoForm.score >= 80 ? 'Excellent' : perfoForm.score >= 60 ? 'Bon' : perfoForm.score > 0 ? 'À améliorer' : '-'}
                        </Badge>
                      </div>
                    </div>

                    {/* Tâche */}
                    <div>
                      <Label htmlFor="perfo-tache">Tâche / Projet (optionnel)</Label>
                      <Textarea
                        id="perfo-tache"
                        value={perfoForm.tache}
                        onChange={(e) => setPerfoForm({ ...perfoForm, tache: e.target.value })}
                        placeholder="Ex: Gestion tickets support Q1"
                        rows={3}
                      />
                    </div>

                    {/* Période */}
                    <div>
                      <Label htmlFor="perfo-periode" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Période *
                      </Label>
                      <Input
                        id="perfo-periode"
                        type="text"
                        value={perfoForm.periode}
                        onChange={(e) => setPerfoForm({ ...perfoForm, periode: e.target.value })}
                        placeholder="2024-01 ou 2024-Q1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: YYYY-MM (mensuel) ou YYYY-QX (trimestriel)
                      </p>
                    </div>

                    <Button onClick={handlePerfoSubmit} className="w-full gap-2" size="lg">
                      <Send className="w-4 h-4" />
                      Enregistrer l'Évaluation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== FORMULAIRE 2: VENTE ===== */}
          <TabsContent value="vente">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl">Enregistrement de Vente</CardTitle>
                    <CardDescription className="text-green-100">
                      Collection: <strong>Vente</strong>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted === 'vente' ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Vente enregistrée !</h3>
                    <p className="text-gray-600">La transaction a été ajoutée au workflow</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Workflow */}
                    <div>
                      <Label htmlFor="vente-workflow" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Workflow de Ventes *
                      </Label>
                      <Select
                        value={venteForm.workflowId}
                        onValueChange={(value) =>
                          setVenteForm({ ...venteForm, workflowId: value, produitId: '' })
                        }
                      >
                        <SelectTrigger id="vente-workflow">
                          <SelectValue placeholder="Sélectionnez un workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          {venteWorkflows.map((wf) => (
                            <SelectItem key={wf.id} value={wf.id}>
                              {wf.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Produit */}
                    <div>
                      <Label htmlFor="vente-produit" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Produit *
                      </Label>
                      <Select
                        value={venteForm.produitId}
                        onValueChange={(value) => setVenteForm({ ...venteForm, produitId: value })}
                        disabled={!venteForm.workflowId}
                      >
                        <SelectTrigger id="vente-produit">
                          <SelectValue placeholder="Sélectionnez un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredProduits.map((prod) => (
                            <SelectItem key={prod.id} value={prod.id}>
                              {prod.nom} - {prod.pu.toFixed(2)}€ ({prod.ref})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {venteForm.workflowId && filteredProduits.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          Aucun produit dans ce workflow
                        </p>
                      )}
                    </div>

                    {/* Quantité */}
                    <div>
                      <Label htmlFor="vente-qte" className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Quantité *
                      </Label>
                      <Input
                        id="vente-qte"
                        type="number"
                        min="1"
                        value={venteForm.qte || ''}
                        onChange={(e) =>
                          setVenteForm({ ...venteForm, qte: parseInt(e.target.value) || 0 })
                        }
                        placeholder="1"
                      />
                    </div>

                    {/* Calcul Total */}
                    {selectedProduit && venteForm.qte > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Total de la vente:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {(selectedProduit.pu * venteForm.qte).toFixed(2)} €
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {venteForm.qte} × {selectedProduit.pu.toFixed(2)}€
                        </p>
                      </div>
                    )}

                    {/* Source Type (fixe à WEBFORM) */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Source:</strong> WEBFORM (automatique)
                      </p>
                    </div>

                    <Button onClick={handleVenteSubmit} className="w-full gap-2" size="lg">
                      <Send className="w-4 h-4" />
                      Enregistrer la Vente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== FORMULAIRE 3: DONNÉES VENTES GLOBALES ===== */}
          <TabsContent value="salesdata">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl">Données Ventes Agrégées</CardTitle>
                    <CardDescription className="text-orange-100">
                      Collection: <strong>Sales_Data</strong> (Dataset d'analyse)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted === 'salesdata' ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Données ajoutées !</h3>
                    <p className="text-gray-600">Le dataset d'analyse a été mis à jour</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Info importante */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> Ce formulaire est utilisé pour enregistrer des données
                        de ventes agrégées (totaux par période). Pour enregistrer des ventes individuelles,
                        utilisez le formulaire "Vente Produit".
                      </p>
                    </div>

                    {/* Workflow */}
                    <div>
                      <Label htmlFor="salesdata-workflow" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Workflow de Ventes *
                      </Label>
                      <Select
                        value={salesDataForm.workflowId}
                        onValueChange={(value) =>
                          setSalesDataForm({ ...salesDataForm, workflowId: value })
                        }
                      >
                        <SelectTrigger id="salesdata-workflow">
                          <SelectValue placeholder="Sélectionnez un workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          {venteWorkflows.map((wf) => (
                            <SelectItem key={wf.id} value={wf.id}>
                              {wf.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Total Vente */}
                    <div>
                      <Label htmlFor="salesdata-total" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Total des Ventes (€) *
                      </Label>
                      <Input
                        id="salesdata-total"
                        type="number"
                        step="0.01"
                        min="0"
                        value={salesDataForm.totalVente || ''}
                        onChange={(e) =>
                          setSalesDataForm({
                            ...salesDataForm,
                            totalVente: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="15000.00"
                      />
                      {salesDataForm.totalVente > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Montant: <strong>{salesDataForm.totalVente.toFixed(2)} €</strong>
                        </p>
                      )}
                    </div>

                    {/* Période */}
                    <div>
                      <Label htmlFor="salesdata-periode" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Période *
                      </Label>
                      <Input
                        id="salesdata-periode"
                        type="text"
                        value={salesDataForm.periode}
                        onChange={(e) =>
                          setSalesDataForm({ ...salesDataForm, periode: e.target.value })
                        }
                        placeholder="2024-01 ou 2024-Q1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: YYYY-MM (mensuel) ou YYYY-QX (trimestriel)
                      </p>
                    </div>

                    <Button onClick={handleSalesDataSubmit} className="w-full gap-2" size="lg">
                      <Send className="w-4 h-4" />
                      Enregistrer les Données
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FOOTER INFO */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 À propos des formulaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Badge className="mb-2">PerfoEmp_Data</Badge>
              <p className="text-gray-600">
                Dataset pour analyser les performances individuelles des employés par période
              </p>
            </div>
            <div>
              <Badge className="mb-2">Vente</Badge>
              <p className="text-gray-600">
                Enregistrement détaillé de chaque transaction de vente produit par produit
              </p>
            </div>
            <div>
              <Badge className="mb-2">Sales_Data</Badge>
              <p className="text-gray-600">
                Dataset agrégé des ventes totales par période pour analyses BI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebFormsSystem;