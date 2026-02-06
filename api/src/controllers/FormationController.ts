import { Request, Response } from "express";
import Formation from "../models/Formation";

/**
 * Création d'une formation
 */
export const createFormation = async (req: Request, res: Response) => {
  try {
    const formation = await Formation.create(req.body);
    res.status(201).json(formation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Liste brute des formations (ETL / Dashboard)
 */
export const getFormations = async (_: Request, res: Response) => {
  try {
    const formations = await Formation.find().sort({ createdAt: -1 });
    res.status(200).json(formations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ANALYSE – KPI Formation (DATANOVA)
 */
export const analyseFormations = async (_: Request, res: Response) => {
  try {
    const result = await Formation.aggregate([
      {
        $group: {
          _id: null,
          totalFormations: { $sum: 1 },
          participantsPrevusTotal: { $sum: "$participantsPrevus" },
          participantsReelsTotal: { $sum: "$participantsReels" },
          tauxReussiteMoyen: { $avg: "$tauxReussite" },
        },
      },
      {
        $project: {
          _id: 0,
          totalFormations: 1,
          participantsPrevusTotal: 1,
          participantsReelsTotal: 1,
          tauxReussiteMoyen: { $round: ["$tauxReussiteMoyen", 2] },
          tauxParticipation: {
            $cond: [
              { $eq: ["$participantsPrevusTotal", 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      "$participantsReelsTotal",
                      "$participantsPrevusTotal",
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.status(200).json(result[0] || {});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PRÉDICTION SIMPLE – Participation future
 * (Base décisionnelle DATANOVA – sans ML lourd)
 */
export const predictParticipation = async (_: Request, res: Response) => {
  try {
    const data = await Formation.find({
      participantsPrevus: { $exists: true },
      participantsReels: { $exists: true },
    });

    if (data.length === 0) {
      return res.status(200).json({
        message: "Données insuffisantes pour la prédiction",
      });
    }

    const tauxMoyen =
      data.reduce((acc: any, f:any) => {
        if (!f.participantsPrevus || f.participantsPrevus === 0) return acc;
        return acc + f.participantsReels! / f.participantsPrevus;
      }, 0) / data.length;

    res.status(200).json({
      tauxParticipationPrevu: Math.round(tauxMoyen * 100),
      interpretation:
        tauxMoyen >= 0.7
          ? "Bonne participation attendue"
          : "Risque de faible participation",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
