import { Schema, model, Document, Types } from 'mongoose';

export interface IEmployee extends Document {
  userId: Types.ObjectId;
  workflowId: Types.ObjectId;

  matricule: string;
  nom: string;
  poste?: string;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    
    matricule: { type: String, required: true },
    nom: { type: String, required: true },
    poste: { type: String },
  },
  { timestamps: true }
);

export const Employee = model<IEmployee>('Employee', EmployeeSchema);
