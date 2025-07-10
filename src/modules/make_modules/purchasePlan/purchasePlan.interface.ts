import { Types } from "mongoose";

export type TPurchasePlan = {
    userId: Types.ObjectId;
    subscriptionId: string
    planName: 'unlimited_plan' | 'standard_plan' | 'basic_plan';
    planPrice: number;
    discount: number;
    expiryDate: number;
    jobpost: number | string;
    numberOfEmployees: Array<{
        minEmployees: number;
        maxEmployees: number;
        price: number;
    }>;

    unlimited_text: boolean;
    add_logo_images: boolean;
    avg_viewed_1000: boolean;
    multi_categories: boolean;
    schedule_dates: boolean;
    unlimited_postings: boolean;
    fill_multiple_positions: boolean;
    continuous_posting: boolean;
    multi_user_access: boolean;
    popular_choice: boolean;
    cost_effective: boolean;
    no_time_limit: boolean;

    autoRenewal: boolean;
    expiryDateTimestamp: Date;
    isVisible: boolean;

    unlimitedPlanIndex: number
};
