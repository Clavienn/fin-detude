import { Router } from 'express';
import {
  createVente,
  getVentes,
  getVentesByWorkflow,
  updateVente,
  deleteVente,
} from '../controllers/SalesController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// CRUD Vente
router.post('/', verifyToken, createVente);
router.get('/', verifyToken, getVentes);
router.get('/workflow/:workflowId', verifyToken, getVentesByWorkflow);
router.put('/:id', verifyToken, updateVente);
router.delete('/:id', verifyToken, deleteVente);

export default router;
