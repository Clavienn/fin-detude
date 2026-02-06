import { Router } from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeesByWorkflow,
  updateEmployee,
  deleteEmployee,
} from '../controllers/EmployeeController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();


router.post('/', verifyToken, createEmployee);
router.get('/', verifyToken, getEmployees);
router.get('/workflow/:workflowId', verifyToken, getEmployeesByWorkflow);
router.put('/:id', verifyToken, updateEmployee);
router.delete('/:id', verifyToken, deleteEmployee);

export default router;
