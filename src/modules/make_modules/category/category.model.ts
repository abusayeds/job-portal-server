import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';



const categorySchema = new Schema<TCategory>({
    catagoryType: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    jobPostCount: { type: Number, required: true, default: 0 }
});

export const categoryModel = model<TCategory>('Category', categorySchema);