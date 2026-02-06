import { Request, Response } from 'express';
import { PerfoData } from '../models/PerfoEmp_Data';
import { AuthRequest } from '../middlewares/verifyToken';

/* =========================
   CREATE PERFORMANCE DATA
========================= */
export const createPerfoData = async (req: AuthRequest, res: Response) => {
  try {
    const { workflowId, employeeId, score, tache, periode } = req.body;

    const perfoData = await PerfoData.create({
      workflowId,
      employeeId,
      score,
      tache,
      periode,
    });

    res.status(201).json(perfoData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating performance data', error });
  }
};

/* =========================
   GET ALL PERFORMANCE DATA
========================= */
export const getPerfoData = async (req: Request, res: Response) => {
  try {
    const data = await PerfoData.find()
      .populate('workflowId', 'nom')
      .populate('employeeId', 'nom matricule');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data', error });
  }
};

/* =========================
   GET PERFORMANCE DATA BY WORKFLOW
========================= */
export const getPerfoDataByWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    const data = await PerfoData.find({ workflowId })
      .populate('employeeId', 'nom matricule');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data by workflow', error });
  }
};

/* =========================
   UPDATE PERFORMANCE DATA
========================= */
export const updatePerfoData = async (req: Request, res: Response) => {
  try {
    const perfoData = await PerfoData.findById(req.params.id);
    if (!perfoData) {
      return res.status(404).json({ message: 'Performance data not found' });
    }

    const updated = await PerfoData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating performance data', error });
  }
};

/* =========================
   DELETE PERFORMANCE DATA
========================= */
export const deletePerfoData = async (req: Request, res: Response) => {
  try {
    const perfoData = await PerfoData.findById(req.params.id);
    if (!perfoData) {
      return res.status(404).json({ message: 'Performance data not found' });
    }

    await perfoData.deleteOne();
    res.status(200).json({ message: 'Performance data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting performance data', error });
  }
};
