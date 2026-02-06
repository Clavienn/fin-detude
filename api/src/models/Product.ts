import { Schema, model, Document, Types } from 'mongoose';

export interface IProduit extends Document {
  userId: Types.ObjectId;
  workflowId: Types.ObjectId;
  nom: string;
  pu: number;
  reference?: string;
  actif: boolean;
}

const ProduitSchema = new Schema<IProduit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    nom: { type: String, required: true },
    pu: { type: Number, required: true },
    reference: { type: String },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Produit = model<IProduit>('Produit', ProduitSchema);
