import { Request, Response } from 'express';
import { Produit } from '../models/Product';
import { AuthRequest } from '../middlewares/verifyToken';

export const createProduit = async (req: AuthRequest, res: Response) => {
  
  try {
    const { workflowId, nom, pu, reference, actif } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const produit = await Produit.create({
      userId: req.user.userId,
      workflowId,
      nom,
      pu,
      reference,
      actif: actif ?? true,
    });

    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating produit', error });
  }
};


export const getProduits = async (req: Request, res: Response) => {
  try {
    const produits = await Produit.find()
      .populate('workflowId', 'nom')
      .populate('userId', 'name email');
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching produits', error });
  }
};



export const getProduitsByWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    const produits = await Produit.find({ workflowId })
      .populate('userId', 'name email');

    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching produits by workflow', error });
  }
};


export const updateProduit = async (req: AuthRequest, res: Response) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit not found' });
    }

    // Seul le propriétaire ou ADMIN peut modifier
    if (produit.userId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating produit', error });
  }
};

/* =========================
   DELETE PRODUIT
========================= */
export const deleteProduit = async (req: AuthRequest, res: Response) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit not found' });
    }

    // Seul le propriétaire ou ADMIN peut supprimer
    if (produit.userId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await produit.deleteOne();
    res.status(200).json({ message: 'Produit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting produit', error });
  }
};
