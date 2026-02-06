import { Router } from 'express';
import {
  createWorkflow,
  getMyWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  getAllWorkflows,
} from '../controllers/WorkFlowsController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/', verifyToken, createWorkflow);
router.get("/all", getAllWorkflows)
router.get('/', verifyToken, getMyWorkflows);
router.get('/:id', verifyToken, getWorkflowById);
router.put('/:id', verifyToken, updateWorkflow);
router.delete('/:id', verifyToken, deleteWorkflow);

export default router;
