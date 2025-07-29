import { Document } from "mongoose";

export type IRefund = {
  description: string;
} & Document;
