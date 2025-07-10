import mongoose, { Schema } from 'mongoose';
import { TPurchasePlan } from './purchasePlan.interface';


const purchasePlanSchema: Schema = new Schema<TPurchasePlan>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        subscriptionId: { type: String, required: true, unique: true },
        planName: { type: String, enum: ["unlimited_plan", "standard_plan", "basic_plan"], required: true },
        planPrice: { type: Number, required: false },
        discount: { type: Number, required: false },
        expiryDate: { type: Number, required: false },
        jobpost: { type: Schema.Types.Mixed, required: false },
        numberOfEmployees: {
            minEmployees: { type: Number, required: false },
            maxEmployees: { type: Number, required: false },
        },
        unlimited_text: { type: Boolean, required: true },
        add_logo_images: { type: Boolean, required: true },
        avg_viewed_1000: { type: Boolean, required: true },
        multi_categories: { type: Boolean, required: true },
        schedule_dates: { type: Boolean, required: false },
        unlimited_postings: { type: Boolean, required: false },
        fill_multiple_positions: { type: Boolean, required: false },
        continuous_posting: { type: Boolean, required: false },
        multi_user_access: { type: Boolean, required: false },
        popular_choice: { type: Boolean, required: false },
        cost_effective: { type: Boolean, required: false },
        no_time_limit: { type: Boolean, required: false },

        autoRenewal: { type: Boolean, default: false },
        expiryDateTimestamp: { type: Date, default: null },
        isVisible: { type: Boolean, default: true },

        unlimitedPlanIndex: { type: Number, required: false },

    },
    { timestamps: true }
);


export const purchasePlanModel = mongoose.model<TPurchasePlan>("PurchasePlanModel", purchasePlanSchema);