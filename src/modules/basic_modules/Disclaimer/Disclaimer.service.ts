import { disclaimerModel } from "./Disclaimer.model";


type AboutData = {
  sanitizedContent: string;
};

export const createDisclaimerDB = async (aboutData: AboutData) => {
  const newAbout = new disclaimerModel({ description: aboutData.sanitizedContent });
  const savedAbout = await newAbout.save();
  return savedAbout;
};

export const getAllDisclaimerFromDB = async () => {
  const about = await disclaimerModel.find().sort({ createdAt: -1 });
  return about;
};

export const updateDisclaimerDB = async (newData: string) => {
  const updatedAbout = await disclaimerModel.findOneAndUpdate(
    {},
    { description: newData },
    { new: true, upsert: true },
  );

  return updatedAbout;
};
