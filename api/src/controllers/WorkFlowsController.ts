import { Request, Response } from 'express';
import { Workflow } from '../models/Workflows';
import { Categorie } from '../models/Category';
import { AuthRequest } from '../middlewares/verifyToken';




export const createWorkflow = async (req: AuthRequest, res: Response) => {

  try {
    const { nom, description, categorieId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Vérifier la catégorie
    const categorie = await Categorie.findById(categorieId);
    if (!categorie) {
      return res.status(400).json({ message: 'Invalid categorie' });
    }

    const workflow = await Workflow.create({
      userId: req.user.userId,
      categorieId: categorie._id,
      nom,
      description,
    });

    res.status(201).json(workflow);
  } catch (error) {    
    res.status(500).json({ message: 'Error creating workflow xd', error });
  }
};


export const getAllWorkflows = async (req: any, res: Response) => {
  try {
    const query: any = {};

    const workflows = await Workflow.find(query)
      .populate("categorieId", "code description")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des workflows",
    });
  }
}


export const getMyWorkflows = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const workflows = await Workflow.find({ userId: req.user.userId })
      .populate('categorieId', 'code description')
      .sort({ createdAt: -1 });

    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workflows', error });
  }
};



export const getWorkflowById = async (req: AuthRequest, res: Response) => {
  try {
    const workflow = await Workflow.findById(req.params.id)
      .populate('categorieId', 'code description');

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workflow', error });
  }
};



export const updateWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (workflow.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await Workflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workflow', error });
  }
};



export const deleteWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (
      req.user?.role !== 'ADMIN' &&
      workflow.userId.toString() !== req.user?.userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await workflow.deleteOne();

    res.status(200).json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workflow', error });
  }
};
