import { Request, Response } from 'express';
import { Vente } from '../models/Sales';
import { AuthRequest } from '../middlewares/verifyToken';

/* =========================
   CREATE SALE
========================= */
export const createVente = async (req: AuthRequest, res: Response) => {  
  try {
    const { workflowId, produitId, qte } = req.body;

    const source = "WEBFORM"
    const vente = await Vente.create({
      workflowId,
      produitId,
      qte,
      sourceType: source
    });

    res.status(201).json(vente);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale', error });
  }
};

/* =========================
   GET ALL SALES
========================= */
export const getVentes = async (req: Request, res: Response) => {  
  try {
    const ventes = await Vente.find()
      .populate('workflowId', 'nom')
      .populate('produitId', 'nom,pu');

    res.status(200).json(ventes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error });
  }
};

/* =========================
   GET SALES BY WORKFLOW
========================= */
export const getVentesByWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    const ventes = await Vente.find({ workflowId })
      .populate('produitId', 'nom pu');

    res.status(200).json(ventes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales by workflow', error });
  }
};

/* =========================
   UPDATE SALE
========================= */
export const updateVente = async (req: Request, res: Response) => {
  try {
    const vente = await Vente.findById(req.params.id);
    if (!vente) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const updated = await Vente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sale', error });
  }
};

/* =========================
   DELETE SALE
========================= */
export const deleteVente = async (req: Request, res: Response) => {
  try {
    const vente = await Vente.findById(req.params.id);
    if (!vente) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    await vente.deleteOne();
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error });
  }
};
