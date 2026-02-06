import { Schema, model, Document } from "mongoose";

export interface IFormation extends Document {
  titre: string;
  description?: string;
  participantsPrevus?: number;
  participantsReels?: number;
  tauxReussite?: number;
  dateDebut?: Date;
}

const FormationSchema = new Schema<IFormation>(
  {
    titre: { type: String, required: true },
    description: { type: String },
    participantsPrevus: { type: Number },
    participantsReels: { type: Number },

    tauxReussite: { type: Number, min: 0, max: 100 },
    dateDebut: { type: Date },
  },
  { timestamps: true }
);

export default model<IFormation>("Formation", FormationSchema);
