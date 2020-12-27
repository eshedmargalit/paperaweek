import { Schema, model, Document } from 'mongoose';

export interface IPaper {
  title: string;
  authors: string[];
  institutions: string[] | null;
  date: Date;
  journal: string;
  doi: string;
  url: string;
}

export interface PaperDocument extends IPaper, Document {}

const PaperSchema = new Schema(
  {
    title: String,
    authors: [{ type: String }],
    institutions: [{ type: String }],
    date: String,
    journal: String,
    doi: String,
    url: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default model<PaperDocument>('papers', PaperSchema);
