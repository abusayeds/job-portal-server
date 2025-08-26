/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export type Ttraining = {
    employeId: Types.ObjectId,
    companyName: string,
    title: string,
    image: string,
    date: Date | any
    category: string,
    format: "online" | "in_person",
    duration: string,
    learning_credits: string
    Instructor: string,
    address: string,
    time: string[]
    description: string
}