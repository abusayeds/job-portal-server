import { Document } from "mongoose";

export type TDisclaimer = {
  description: string;
} & Document;
