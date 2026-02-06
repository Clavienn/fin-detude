import { Schema, model, Document, Types } from 'mongoose';

export interface ILog extends Document {
  userId: Types.ObjectId;
  workflowId: Types.ObjectId;
  action: string;
}

const LogSchema = new Schema<ILog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

export const Log = model<ILog>('Log', LogSchema);
