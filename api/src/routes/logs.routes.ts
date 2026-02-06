import { Router } from 'express';
import { createLog, getLogs, getLogsByWorkflow } from '../controllers/LogController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/', verifyToken, createLog);
router.get('/', verifyToken, getLogs);
router.get('/workflow/:workflowId', verifyToken, getLogsByWorkflow);

export default router;
