"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Loader2, Upload } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { ModalAddEmployee } from './modal/ModalAdd';
import { ModalUpdateEmployee } from './modal/ModalUpdate';
import { ModalDeleteEmployee } from './modal/ModalDelete';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import { useParams } from 'next/navigation';
import type { Employee } from '@/domains/models/Employee';
import ModalImportEmployee from './modal/ModalImportEmp';

const EmployeeList = () => {
  const params = useParams<{ id: string }>();
  const workflowId = params?.id;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const loadEmployees = async () => {
    if (!workflowId) return;

    try {
      setLoading(true);
      const employeesData = await EmployeeRepoAPI.getByWorkflow(workflowId);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      alert("Une erreur est survenue lors du chargement des employés.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [workflowId]);

  const handleAddSuccess = () => {
    loadEmployees();
    setIsAddOpen(false);
  };

  const handleUpdateSuccess = () => {
    loadEmployees();
    setIsUpdateOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteSuccess = () => {
    loadEmployees();
    setIsDeleteOpen(false);
    setSelectedEmployee(null);
  };

  const openUpdateModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsUpdateOpen(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

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
                  <Users className="w-5 h-5" />
                  Liste des Employés
                </CardTitle>
                <CardDescription>Gérez les employés de ce workflow</CardDescription>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer Excel
                </Button>
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Employé
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun employé pour le moment</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le premier employé
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Total: {employees.length} employé{employees.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{employee.matricule}</TableCell>
                      <TableCell className="font-semibold">{employee.nom}</TableCell>
                      <TableCell>
                        {employee.poste ? (
                          <Badge variant="outline">{employee.poste}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openUpdateModal(employee)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(employee)}
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

      {/* Modal Add Employee */}
      {workflowId && (
        <ModalAddEmployee 
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSuccess={handleAddSuccess}
          workflowId={workflowId}
        />
      )}

      {/* Modal Import Employee */}
      {workflowId && (
        <ModalImportEmployee
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            loadEmployees();
            setIsImportModalOpen(false);
          }}
          workflowId={workflowId}
        />
      )}

      {/* Modals Update & Delete Employee */}
      {selectedEmployee && (
        <>
          <ModalUpdateEmployee 
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            onSuccess={handleUpdateSuccess}
            employee={selectedEmployee}
          />

          <ModalDeleteEmployee 
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onSuccess={handleDeleteSuccess}
            employee={selectedEmployee}
          />
        </>
      )}
    </>
  );
};

export default EmployeeList;