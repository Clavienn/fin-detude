"use client"

import React, { useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, FileSpreadsheet, Globe, Upload, Database, Workflow, Users, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebFormsSystem from './Form';

// ===== TYPES =====
interface WorkflowItem {
  _id: string;
  nom: string;
  description?: string;
  categorieCode: 'VENTE' | 'PERFO_EMP';
  categorieName: string;
  actif: boolean;
  createdAt: string;
}

interface DataSource {
  _id: string;
  nom: string;
  type: 'webform' | 'excel' | 'googlesheet';
  workflowId: string;
  workflowName: string;
  status: 'pending' | 'active' | 'error';
  recordCount?: number;
  lastSync?: string;
  createdAt: string;
}

interface Employee {
  _id: string;
  workflowId: string;
  matricule: string;
  nom: string;
  poste?: string;
}

interface Produit {
  _id: string;
  workflowId: string;
  nom: string;
  pu: number;
  reference?: string;
  actif: boolean;
}

const PipelineManager: React.FC = () => {
  // ===== STATE WORKFLOWS =====
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    {
      _id: 'w1',
      nom: 'Analyse des Ventes Q1',
      description: 'Suivi des ventes trimestrielles',
      categorieCode: 'VENTE',
      categorieName: 'Ventes',
      actif: true,
      createdAt: '2024-01-15',
    },
    {
      _id: 'w2',
      nom: 'Performance Équipe Support',
      description: 'Évaluation mensuelle des performances',
      categorieCode: 'PERFO_EMP',
      categorieName: 'Performance Employés',
      actif: true,
      createdAt: '2024-01-20',
    },
  ]);

  // ===== STATE SOURCES DE DONNÉES =====
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      _id: 'd1',
      nom: 'Ventes Magasin Principal',
      type: 'webform',
      workflowId: 'w1',
      workflowName: 'Analyse des Ventes Q1',
      status: 'active',
      recordCount: 234,
      lastSync: '2024-01-20T10:30:00',
      createdAt: '2024-01-15',
    },
    {
      _id: 'd2',
      nom: 'Évaluations Équipe',
      type: 'excel',
      workflowId: 'w2',
      workflowName: 'Performance Équipe Support',
      status: 'active',
      recordCount: 45,
      lastSync: '2024-01-21T14:20:00',
      createdAt: '2024-01-18',
    },
  ]);

  // ===== STATE EMPLOYÉS =====
  const [employees, setEmployees] = useState<Employee[]>([
    { _id: 'e1', workflowId: 'w2', matricule: 'EMP001', nom: 'Jean Dupont', poste: 'Support' },
    { _id: 'e2', workflowId: 'w2', matricule: 'EMP002', nom: 'Marie Martin', poste: 'Support Senior' },
  ]);

  // ===== STATE PRODUITS =====
  const [produits, setProduits] = useState<Produit[]>([
    { _id: 'p1', workflowId: 'w1', nom: 'Produit A', pu: 99.99, reference: 'REF-A001', actif: true },
    { _id: 'p2', workflowId: 'w1', nom: 'Produit B', pu: 149.99, reference: 'REF-B001', actif: true },
  ]);

  // ===== STATE MODALS =====
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProduitModalOpen, setIsProduitModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');

  // ===== FORMS =====
  const [workflowForm, setWorkflowForm] = useState({
    nom: '',
    description: '',
    categorieCode: 'VENTE' as 'VENTE' | 'PERFO_EMP',
    actif: true,
  });

  const [dataSourceForm, setDataSourceForm] = useState({
    nom: '',
    type: 'webform' as 'webform' | 'excel' | 'googlesheet',
    workflowId: '',
    file: null as File | null,
    url: '',
  });

  const [employeeForm, setEmployeeForm] = useState({
    workflowId: '',
    matricule: '',
    nom: '',
    poste: '',
  });

  const [produitForm, setProduitForm] = useState({
    workflowId: '',
    nom: '',
    pu: 0,
    reference: '',
  });

  // ===== HANDLERS WORKFLOW =====
  const handleCreateWorkflow = () => {
    const categorieName = workflowForm.categorieCode === 'VENTE' ? 'Ventes' : 'Performance Employés';
    const newWorkflow: WorkflowItem = {
      _id: Date.now().toString(),
      ...workflowForm,
      categorieName,
      createdAt: new Date().toISOString(),
    };
    setWorkflows([...workflows, newWorkflow]);
    setWorkflowForm({ nom: '', description: '', categorieCode: 'VENTE', actif: true });
    setIsWorkflowModalOpen(false);
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w._id !== id));
    setDataSources(dataSources.filter((d) => d.workflowId !== id));
    setEmployees(employees.filter((e) => e.workflowId !== id));
    setProduits(produits.filter((p) => p.workflowId !== id));
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(workflows.map((w) => (w._id === id ? { ...w, actif: !w.actif } : w)));
  };

  // ===== HANDLERS DATA SOURCE =====
  const handleCreateDataSource = () => {
    const workflow = workflows.find((w) => w._id === dataSourceForm.workflowId);
    if (!workflow) return;

    const newDataSource: DataSource = {
      _id: Date.now().toString(),
      nom: dataSourceForm.nom,
      type: dataSourceForm.type,
      workflowId: workflow._id,
      workflowName: workflow.nom,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setDataSources([...dataSources, newDataSource]);
    setDataSourceForm({ nom: '', type: 'webform', workflowId: '', file: null, url: '' });
    setIsDataSourceModalOpen(false);
  };

  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter((d) => d._id !== id));
  };

  // ===== HANDLERS EMPLOYÉ =====
  const handleCreateEmployee = () => {
    const newEmployee: Employee = {
      _id: Date.now().toString(),
      ...employeeForm,
    };
    setEmployees([...employees, newEmployee]);
    setEmployeeForm({ workflowId: '', matricule: '', nom: '', poste: '' });
    setIsEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e._id !== id));
  };

  // ===== HANDLERS PRODUIT =====
  const handleCreateProduit = () => {
    const newProduit: Produit = {
      _id: Date.now().toString(),
      ...produitForm,
      actif: true,
    };
    setProduits([...produits, newProduit]);
    setProduitForm({ workflowId: '', nom: '', pu: 0, reference: '' });
    setIsProduitModalOpen(false);
  };

  const handleDeleteProduit = (id: string) => {
    setProduits(produits.filter((p) => p._id !== id));
  };

  // ===== UTILITY FUNCTIONS =====
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'webform': return <Globe className="w-4 h-4" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4" />;
      case 'googlesheet': return <Database className="w-4 h-4" />;
      default: return <Upload className="w-4 h-4" />;
    }
  };

  const getSourceLabel = (type: string) => {
    switch (type) {
      case 'webform': return 'Formulaire Web';
      case 'excel': return 'Excel';
      case 'googlesheet': return 'Google Sheets';
      default: return type;
    }
  };

  const getCategoryIcon = (code: string) => {
    return code === 'VENTE' ? <TrendingUp className="w-5 h-5" /> : <Users className="w-5 h-5" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pipeline de Données</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos workflows d'analyse : Ventes et Performance des Employés
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="datasources">Sources de Données</TabsTrigger>
        </TabsList>

        {/* ===== TAB WORKFLOWS ===== */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Workflows ({workflows.length})</h2>
            <Button onClick={() => setIsWorkflowModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => {
              const workflowSources = dataSources.filter((d) => d.workflowId === workflow._id);
              const workflowEmployees = employees.filter((e) => e.workflowId === workflow._id);
              const workflowProduits = produits.filter((p) => p.workflowId === workflow._id);
              const isPerfoEmp = workflow.categorieCode === 'PERFO_EMP';
              const isVente = workflow.categorieCode === 'VENTE';

              return (
                <Card key={workflow._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(workflow.categorieCode)}
                          <CardTitle className="text-lg">{workflow.nom}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          {workflow.description || 'Aucune description'}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleWorkflow(workflow._id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {workflow.actif ? 'Désactiver' : 'Activer'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteWorkflow(workflow._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={workflow.actif ? 'default' : 'secondary'}>
                          {workflow.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Badge variant="outline">{workflow.categorieName}</Badge>
                      </div>

                      {/* Sources de données */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-gray-600">
                          {workflowSources.length} source(s)
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDataSourceForm({ ...dataSourceForm, workflowId: workflow._id });
                            setIsDataSourceModalOpen(true);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Source
                        </Button>
                      </div>

                      {/* Actions spécifiques selon la catégorie */}
                      {isPerfoEmp && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {workflowEmployees.length} employé(s)
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEmployeeForm({ ...employeeForm, workflowId: workflow._id });
                              setIsEmployeeModalOpen(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Employé
                          </Button>
                        </div>
                      )}

                      {isVente && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {workflowProduits.length} produit(s)
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setProduitForm({ ...produitForm, workflowId: workflow._id });
                              setIsProduitModalOpen(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Produit
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {workflows.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Workflow className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Aucun workflow pour le moment</p>
              <Button onClick={() => setIsWorkflowModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer votre premier workflow
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ===== TAB SOURCES DE DONNÉES ===== */}
        <TabsContent value="datasources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sources de Données ({dataSources.length})</h2>
            <Button onClick={() => setIsDataSourceModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Source
            </Button>
          </div>

          {workflows.map((workflow) => {
            const workflowSources = dataSources.filter((d) => d.workflowId === workflow._id);
            if (workflowSources.length === 0) return null;

            return (
              <div key={workflow._id} className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  {getCategoryIcon(workflow.categorieCode)}
                  <h3 className="font-semibold text-gray-700">{workflow.nom}</h3>
                  <Badge variant="outline" className="text-xs">
                    {workflow.categorieName}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflowSources.map((source) => (
                    <Card key={source._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getSourceIcon(source.type)}
                              <CardTitle className="text-lg">{source.nom}</CardTitle>
                            </div>
                            <CardDescription className="text-sm">
                              {source.workflowName}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDeleteDataSource(source._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{getSourceLabel(source.type)}</Badge>
                            <Badge
                              variant={
                                source.status === 'active'
                                  ? 'default'
                                  : source.status === 'error'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {source.status}
                            </Badge>
                          </div>
                          {source.recordCount !== undefined && (
                            <p className="text-sm text-gray-600">
                              {source.recordCount} enregistrement(s)
                            </p>
                          )}
                          {source.lastSync && (
                            <p className="text-xs text-gray-500">
                              Sync: {new Date(source.lastSync).toLocaleString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {dataSources.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Aucune source de données</p>
              <Button onClick={() => setIsDataSourceModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une source
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== MODAL WORKFLOW ===== */}
      <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Workflow</DialogTitle>
            <DialogDescription>
              Créez un workflow pour analyser vos ventes ou la performance de vos employés
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-nom">Nom du workflow *</Label>
              <Input
                id="workflow-nom"
                value={workflowForm.nom}
                onChange={(e) => setWorkflowForm({ ...workflowForm, nom: e.target.value })}
                placeholder="Ex: Analyse Ventes T1 2024"
              />
            </div>
            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                value={workflowForm.description}
                onChange={(e) => setWorkflowForm({ ...workflowForm, description: e.target.value })}
                placeholder="Description du workflow"
              />
            </div>
            <div>
              <Label htmlFor="workflow-categorie">Catégorie d&apos;analyse *</Label>
              <Select
                value={workflowForm.categorieCode}
                onValueChange={(value: 'VENTE' | 'PERFO_EMP') =>
                  setWorkflowForm({ ...workflowForm, categorieCode: value })
                }
              >
                <SelectTrigger id="workflow-categorie">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENTE">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Ventes (Sales_Data)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PERFO_EMP">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Performance Employés (PerfoEmp_Data)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Chaque workflow génère un dataset d&apos;analyse spécifique
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWorkflowModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              disabled={!workflowForm.nom || !workflowForm.categorieCode}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== MODAL SOURCE DE DONNÉES ===== */}
      <Dialog open={isDataSourceModalOpen} onOpenChange={setIsDataSourceModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle Source de Données</DialogTitle>
            <DialogDescription>
              Connectez une source pour alimenter votre workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Workflow de destination *</Label>
              <Select
                value={dataSourceForm.workflowId}
                onValueChange={(value) =>
                  setDataSourceForm({ ...dataSourceForm, workflowId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.filter((w) => w.actif).map((wf) => (
                    <SelectItem key={wf._id} value={wf._id}>
                      {wf.nom} ({wf.categorieName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nom de la source *</Label>
              <Input
                value={dataSourceForm.nom}
                onChange={(e) => setDataSourceForm({ ...dataSourceForm, nom: e.target.value })}
                placeholder="Ex: Ventes Boutique Paris"
              />
            </div>

            <div>
              <Label>Type de source *</Label>
              <Select
                value={dataSourceForm.type}
                onValueChange={(value: any) =>
                  setDataSourceForm({ ...dataSourceForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webform">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Formulaire Web</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Fichier Excel</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="googlesheet">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>Google Sheets</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dataSourceForm.type === 'excel' && (
              <div>
                <Label>Fichier Excel *</Label>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) =>
                    setDataSourceForm({ ...dataSourceForm, file: e.target.files?.[0] || null })
                  }
                />
              </div>
            )}

            {dataSourceForm.type === 'googlesheet' && (
              <div>
                <Label>URL Google Sheets *</Label>
                <Input
                  type="url"
                  value={dataSourceForm.url}
                  onChange={(e) => setDataSourceForm({ ...dataSourceForm, url: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
              </div>
            )}

            {dataSourceForm.type === 'webform' && (
              // <div className="bg-blue-50 p-3 rounded-md">
              //   <WebFormsSystem />
              // </div>
              <p>Form</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDataSourceModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateDataSource}
              disabled={!dataSourceForm.nom || !dataSourceForm.workflowId}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== MODAL EMPLOYÉ ===== */}
      <Dialog open={isEmployeeModalOpen} onOpenChange={setIsEmployeeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel Employé</DialogTitle>
            <DialogDescription>
              Ajoutez un employé pour le suivi de performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Matricule *</Label>
              <Input
                value={employeeForm.matricule}
                onChange={(e) => setEmployeeForm({ ...employeeForm, matricule: e.target.value })}
                placeholder="EMP001"
              />
            </div>
            <div>
              <Label>Nom complet *</Label>
              <Input
                value={employeeForm.nom}
                onChange={(e) => setEmployeeForm({ ...employeeForm, nom: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <Label>Poste</Label>
              <Input
                value={employeeForm.poste}
                onChange={(e) => setEmployeeForm({ ...employeeForm, poste: e.target.value })}
                placeholder="Support Client"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmployeeModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateEmployee}
              disabled={!employeeForm.matricule || !employeeForm.nom}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== MODAL PRODUIT ===== */}
      <Dialog open={isProduitModalOpen} onOpenChange={setIsProduitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Produit</DialogTitle>
            <DialogDescription>
              Ajoutez un produit pour le suivi des ventes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom du produit *</Label>
              <Input
                value={produitForm.nom}
                onChange={(e) => setProduitForm({ ...produitForm, nom: e.target.value })}
                placeholder="Produit A"
              />
            </div>
            <div>
              <Label>Prix unitaire (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={produitForm.pu || ''}
                onChange={(e) => setProduitForm({ ...produitForm, pu: parseFloat(e.target.value) || 0 })}
                placeholder="99.99"
              />
            </div>
            <div>
              <Label>Référence</Label>
              <Input
                value={produitForm.reference}
                onChange={(e) => setProduitForm({ ...produitForm, reference: e.target.value })}
                placeholder="REF-A001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProduitModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateProduit}
              disabled={!produitForm.nom || !produitForm.pu}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineManager;