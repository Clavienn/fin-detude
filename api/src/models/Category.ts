import { Schema, model, Document } from 'mongoose';

export interface ICategorie extends Document {
  code: 'VENTE' | 'PERFO_EMP' | 'FORMATION';
  description?: string;
}

const CategorieSchema = new Schema<ICategorie>({
  code: { type: String, enum: ['VENTE', 'PERFO_EMP','FORMATION'], required: true },
  description: { type: String },
});

export const Categorie = model<ICategorie>('Categorie', CategorieSchema);
