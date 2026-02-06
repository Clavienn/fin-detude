import { Request, Response } from 'express';
import { Categorie } from '../models/Category';

/**
 * Créer une catégorie (VENTE | PERFO_EMP)
 */
export const createCategorie = async (req: Request, res: Response) => {
  try {
    const { code, description } = req.body;

    // Vérifier doublon
    const exist = await Categorie.findOne({ code });
    if (exist) {
      return res.status(400).json({
        message: 'Cette catégorie existe déjà',
      });
    }

    const categorie = await Categorie.create({
      code,
      description,
    });

    res.status(201).json(categorie);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la catégorie',
      error,
    });
  }
};

/**
 * Lister toutes les catégories
 */
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des catégories',
      error,
    });
  }
};

/**
 * Récupérer une catégorie par ID
 */
export const getCategorieById = async (req: Request, res: Response) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: 'Catégorie non trouvée',
      });
    }

    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération',
      error,
    });
  }
};

/**
 * Supprimer une catégorie
 */
export const deleteCategorie = async (req: Request, res: Response) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: 'Catégorie non trouvée',
      });
    }

    res.status(200).json({
      message: 'Catégorie supprimée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression',
      error,
    });
  }
};
