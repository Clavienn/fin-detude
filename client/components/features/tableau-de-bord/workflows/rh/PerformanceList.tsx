"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ModalAddPerformance } from './modal/perfo/ModalAdd';
import { ModalUpdatePerformance } from './modal/perfo/ModalUpdate';
import { ModalDeletePerformance } from './modal/perfo/ModalDelete';
import { PerfoDataRepoAPI } from '@/infrastructures/repository/PerfoDataRepoAPI';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import { useParams } from 'next/navigation';
import type { PerfoData } from '@/domains/models/PerfoData';
import type { Employee } from '@/domains/models/Employee';

const PerformanceList = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [perfos, setPerfos] = useState<PerfoData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPerfo, setSelectedPerfo] = useState<PerfoData | null>(null);
  const [filterEmployee, setFilterEmployee] = useState<string>('all');

  const loadData = async () => {
    if (!workflowId) return;

    try {
      setLoading(true);
      const [perfosData, employeesData] = await Promise.all([
        PerfoDataRepoAPI.getByWorkflow(workflowId),
        EmployeeRepoAPI.getByWorkflow(workflowId)
      ]);
      setPerfos(perfosData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      alert("Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [workflowId]);

  const handleAddSuccess = () => {
    loadData();
    setIsAddOpen(false);
  };

  const handleUpdateSuccess = () => {
    loadData();
    setIsUpdateOpen(false);
    setSelectedPerfo(null);
  };

  const handleDeleteSuccess = () => {
    loadData();
    setIsDeleteOpen(false);
    setSelectedPerfo(null);
  };

  const openUpdateModal = (perfo: PerfoData) => {
    setSelectedPerfo(perfo);
    setIsUpdateOpen(true);
  };

  const openDeleteModal = (perfo: PerfoData) => {
    setSelectedPerfo(perfo);
    setIsDeleteOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Bon';
    if (score >= 60) return 'Moyen';
    return 'Faible';
  };

  const getEmployeeId = (perfo: PerfoData): string => {
    return typeof perfo.employeeId === 'string' ? perfo.employeeId : perfo.employeeId?._id || '';
  };

  const getEmployeeName = (perfo: PerfoData): string => {
    if (typeof perfo.employeeId === 'object' && perfo.employeeId?.nom) {
      return perfo.employeeId.nom;
    }
    const employee = employees.find(e => e._id === perfo.employeeId);
    return employee?.nom || '-';
  };

  const filteredPerfos = filterEmployee === 'all' 
    ? perfos 
    : perfos.filter(p => getEmployeeId(p) === filterEmployee);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Données de Performance
                </CardTitle>
                <CardDescription>Consultez et gérez les performances</CardDescription>
              </div>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Performance
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrer par employé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterEmployee !== 'all' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFilterEmployee('all')}
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPerfos.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {filterEmployee === 'all' 
                  ? 'Aucune donnée de performance pour le moment' 
                  : 'Aucune performance pour cet employé'}
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une performance
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {filteredPerfos.length} performance{filteredPerfos.length > 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Score moyen: {(filteredPerfos.reduce((sum, p) => sum + p.score, 0) / filteredPerfos.length).toFixed(1)}
                </Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Tâche</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPerfos.map((perfo) => (
                    <TableRow key={perfo._id} className="hover:bg-gray-50">
                      <TableCell className="font-semibold">
                        {getEmployeeName(perfo)}
                      </TableCell>
                      <TableCell>
                        {perfo.tache ? (
                          <span className="text-gray-700">{perfo.tache}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{perfo.periode}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg font-bold text-lg ${getScoreColor(perfo.score)}`}>
                          {perfo.score}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={perfo.score >= 90 ? 'default' : 'secondary'}
                          className={perfo.score >= 90 ? 'bg-green-600' : ''}
                        >
                          {getScoreBadge(perfo.score)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openUpdateModal(perfo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(perfo)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {workflowId && (
        <ModalAddPerformance 
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSuccess={handleAddSuccess}
          employees={employees}
          workflowId={workflowId}
          userId="" // À remplir avec l'userId du contexte
        />
      )}

      {selectedPerfo && (
        <>
          <ModalUpdatePerformance 
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            onSuccess={handleUpdateSuccess}
            perfoData={selectedPerfo}
            employees={employees}
          />

          <ModalDeletePerformance 
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onSuccess={handleDeleteSuccess}
            perfoData={selectedPerfo}
          />
        </>
      )}
    </>
  );
};

export default PerformanceList;