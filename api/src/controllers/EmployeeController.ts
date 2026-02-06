import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { AuthRequest } from '../middlewares/verifyToken';

/* =========================
   CREATE EMPLOYEE
========================= */
export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { workflowId, matricule, nom, poste } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const employee = await Employee.create({
      userId: req.user.userId,
      workflowId,
      matricule,
      nom,
      poste,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error });
  }
};

/* =========================
   GET ALL EMPLOYEES
========================= */
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate('workflowId', 'nom')
      .populate('userId', 'name email');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

/* =========================
   GET EMPLOYEES BY WORKFLOW
========================= */
export const getEmployeesByWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    const employees = await Employee.find({ workflowId })
      .populate('userId', 'name email');

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by workflow', error });
  }
};

/* =========================
   UPDATE EMPLOYEE
========================= */
export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Only owner or admin can update
    if (employee.userId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

/* =========================
   DELETE EMPLOYEE
========================= */
export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Only owner or admin can delete
    if (employee.userId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await employee.deleteOne();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};
