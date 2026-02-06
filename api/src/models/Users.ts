import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  tel: string;
  role: 'ADMIN' | 'USER';
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tel: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
