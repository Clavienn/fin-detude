import { Schema, model, Document, Types } from 'mongoose';

export interface IWorkflow extends Document {
  userId: Types.ObjectId;
  categorieId: Types.ObjectId;
  nom: string;
  description?: string;
  actif: boolean;
}

const WorkflowSchema = new Schema<IWorkflow>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categorieId: { type: Schema.Types.ObjectId, ref: 'Categorie', required: true },
    nom: { type: String, required: true },
    description: { type: String },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Workflow = model<IWorkflow>('Workflow', WorkflowSchema);
