import { Schema, model, Document, Types } from 'mongoose';

export interface IVente extends Document {
  workflowId: Types.ObjectId;
  produitId?: Types.ObjectId;
  qte: number;
  sourceType: 'WEBFORM' | 'EXCEL' | 'GOOGLE';
}

const VenteSchema = new Schema<IVente>(
  {
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    produitId: { type: Schema.Types.ObjectId, ref: 'Produit' },
    qte: { type: Number, required: true },
    
    sourceType: {
      type: String,
      enum: ['WEBFORM', 'EXCEL', 'GOOGLE'],
      required: true,
      default: "WEBFORM"
    },
  },
  { timestamps: true }
);

export const Vente = model<IVente>('Vente', VenteSchema);
