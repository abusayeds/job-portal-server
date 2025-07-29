import { RefundModel } from "./refund.model";

type RefundData = {
  sanitizedContent: string;
};

export const createRefundInDB = async (privacyData: RefundData) => {
  const newRefund = new RefundModel({
    description: privacyData.sanitizedContent,
  });
  const savedRefund = await newRefund.save();
  return savedRefund;
};

export const getAllRefundFromDB = async () => {
  const privacy = await RefundModel.find().sort({ createdAt: -1 });
  return privacy;
};

export const updateRefundInDB = async (newData: string) => {
  const updatedRefund = await RefundModel.findOneAndUpdate(
    {},
    { description: newData },
    { new: true, upsert: true },
  );

  return updatedRefund;
};
