import { Router } from 'express';
import {
  createCategorie,
  getCategories,
  getCategorieById,
  deleteCategorie,
} from '../controllers/CategoryController';

const router = Router();

router.post('/', createCategorie);
router.get('/', getCategories);
router.get('/:id', getCategorieById);
router.delete('/:id', deleteCategorie);

export default router;
