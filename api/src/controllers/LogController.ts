import { Request, Response } from 'express';
import { Log } from '../models/Logs';
import { AuthRequest } from '../middlewares/verifyToken';


export const createLog = async (req: AuthRequest, res: Response) => {
  try {
    const { workflowId, action } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const log = await Log.create({
      userId: req.user.userId,
      workflowId,
      action,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Error creating log', error });
  }
};


export const getLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Log.find()
      .populate('userId', 'nom email')
      .populate('workflowId', 'nom')
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error });
  }
};

/* =========================
   GET LOGS BY WORKFLOW
========================= */
export const getLogsByWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    const logs = await Log.find({ workflowId })
      .populate('userId', 'nom email')
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs by workflow', error });
  }
};
