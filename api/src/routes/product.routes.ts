import { Router } from 'express';
import {
  createProduit,
  getProduits,
  getProduitsByWorkflow,
  updateProduit,
  deleteProduit,
} from '../controllers/ProduitController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/', verifyToken, createProduit);
router.get('/', verifyToken, getProduits);
router.get('/workflow/:workflowId', verifyToken, getProduitsByWorkflow);
router.put('/:id', verifyToken, updateProduit);
router.delete('/:id', verifyToken, deleteProduit);

export default router;
