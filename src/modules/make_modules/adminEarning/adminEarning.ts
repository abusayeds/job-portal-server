import { model, Schema, Document } from 'mongoose';

interface IAdminEarning extends Document {
    userId: Schema.Types.ObjectId;
    subscriptionId: Schema.Types.ObjectId;
    amount: number;
}


const adminEarningSchema = new Schema<IAdminEarning>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        subscriptionId: { type: Schema.Types.ObjectId, required: true, ref: 'PurchasePlanModel' },
        amount: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);


export const adminEarningModel = model<IAdminEarning>('adminEarnings', adminEarningSchema);
