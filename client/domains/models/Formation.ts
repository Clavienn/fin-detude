export interface Formation {
  _id?: string;

  titre: string;
  description?: string;

  participantsPrevus?: number;
  participantsReels?: number;
  tauxReussite?: number;

  dateDebut?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* ===== DATANOVA ===== */

export interface FormationAnalyse {
  totalFormations: number;
  participantsPrevusTotal: number;
  participantsReelsTotal: number;
  tauxReussiteMoyen: number;
  tauxParticipation: number;
}

export interface FormationPrediction {
  tauxParticipationPrevu: number;
  interpretation: string;
}
