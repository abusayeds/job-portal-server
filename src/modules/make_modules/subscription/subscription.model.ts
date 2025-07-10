import mongoose, { Schema } from 'mongoose';
import { TSubscription } from './subscription.iterface';


const NumberOfEmployeesSchema = new Schema(
    {
        minEmployees: { type: Number, required: false },
        maxEmployees: { type: Number, required: false },
        price: { type: Number, required: false },
    },
);


const SubscriptionSchema: Schema = new Schema<TSubscription>(
    {
        planName: { type: String, enum: ["unlimited_plan", "standard_plan", "basic_plan"], required: true },
        planPrice: {
            type: Number, required: false,
            validate: {
                validator: function (value) {
                    return Number.isInteger(value) && value !== 0;
                },
                message: 'planPrice must be a non-zero integer',
            },
        },
        discount: {
            type: Number, required: false,
            validate: {
                validator: function (value) {
                    return Number.isInteger(value) && value !== 0;
                },
                message: 'discount must be a non-zero integer',
            },
        },
        expiryDate: { type: Number, required: false },
        jobpost: { type: Schema.Types.Mixed, required: false },
        numberOfEmployees: { type: [NumberOfEmployeesSchema], required: false },

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

        isVisible: { type: Boolean, default: true },
    },
    { timestamps: true }
);


export const subscriptionModel = mongoose.model<TSubscription>("Subscription", SubscriptionSchema);
