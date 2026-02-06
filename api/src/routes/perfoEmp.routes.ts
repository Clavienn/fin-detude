import { Router } from 'express';
import {
  createPerfoData,
  getPerfoData,
  getPerfoDataByWorkflow,
  updatePerfoData,
  deletePerfoData,
} from '../controllers/PerfoEmpController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/', verifyToken, createPerfoData);
router.get('/', verifyToken, getPerfoData);
router.get('/workflow/:workflowId', verifyToken, getPerfoDataByWorkflow);
router.put('/:id', verifyToken, updatePerfoData);
router.delete('/:id', verifyToken, deletePerfoData);

export default router;
