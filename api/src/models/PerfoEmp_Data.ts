import { Schema, model, Document, Types } from 'mongoose';

export interface IPerfoData extends Document {
  workflowId: Types.ObjectId;
  employeeId?: Types.ObjectId;

  score: number;
  tache?: string;
  periode: string;
}

const PerfoDataSchema = new Schema<IPerfoData>(
  {
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    
    score: { type: Number, required: true },
    tache: { type: String },
    periode: { type: String, required: true },
  },
  { timestamps: true }
);

export const PerfoData = model<IPerfoData>('PerfoEmp_Data', PerfoDataSchema);
