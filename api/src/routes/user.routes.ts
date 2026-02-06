import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} from '../controllers/UserController';
import { verifyToken } from '../middlewares/verifyToken';
import { roleControl } from '../middlewares/roleControle';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);

router.get('/', getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken,
    // roleControl(['ADMIN']),
   deleteUser);

export default router;
