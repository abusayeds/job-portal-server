import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TSubscription } from "./subscription.iterface";

export const updateUnlimitedPlan = (payload: TSubscription) => {

    if (payload.planName) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan name not changeable")
    }
    if (payload?.numberOfEmployees?.length > 1) {
        if (!payload.numberOfEmployees || payload.numberOfEmployees.length !== 3) {
            throw new AppError(httpStatus.BAD_REQUEST, "Exactly 3 numberOfEmployees objects are required.");
        }
        payload.numberOfEmployees.forEach(emp => {
            if (emp.minEmployees === undefined || emp.minEmployees === null) {
                throw new AppError(httpStatus.BAD_REQUEST, "minEmployees is required for each employee configuration");
            }
            if (emp.maxEmployees === undefined || emp.maxEmployees === null) {
                throw new AppError(httpStatus.BAD_REQUEST, "maxEmployees is required for each employee configuration");
            }
            if (emp.price === undefined || emp.price === null) {
                throw new AppError(httpStatus.BAD_REQUEST, "price is required for each employee configuration");
            }
            if (emp.minEmployees >= emp.maxEmployees) {
                throw new AppError(httpStatus.BAD_REQUEST, "minEmployees must be less than maxEmployees");
            }
        });
    }

    if (payload.discount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Discount is not applicable for unlimited plan.");
    }
    if (payload.planPrice) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan price is not applicable for unlimited plan.");
    }
    if (payload.unlimited_postings !== undefined && payload.unlimited_postings !== true) {
        throw new AppError(httpStatus.BAD_REQUEST, "Unlimited postings must be true for unlimited plan.");
    }
    if (payload.expiryDate !== undefined && payload.expiryDate !== 365 && payload.expiryDate !== 730) {
        throw new AppError(httpStatus.BAD_REQUEST, "Expiry date must be either 365 or 730 days for unlimited plan.");
    }
    if (payload.jobpost !== undefined && payload.jobpost !== "unlimited") {
        throw new AppError(httpStatus.BAD_REQUEST, "Job post must be 'unlimited' for unlimited plan.");
    }
    if (payload.unlimited_text !== undefined && payload.unlimited_text !== true) {
        throw new AppError(httpStatus.BAD_REQUEST, "unlimited_text must be true for unlimited plan.");
    }
    if (payload.avg_viewed_1000 !== undefined && payload.avg_viewed_1000 !== true) {
        throw new AppError(httpStatus.BAD_REQUEST, "avg_viewed_1000 must be true for unlimited plan.");
    }
    if (payload.multi_categories !== undefined && payload.multi_categories !== true) {
        throw new AppError(httpStatus.BAD_REQUEST, "multi_categories must be true for unlimited plan.");
    }
    if (payload.multi_user_access !== undefined && payload.multi_user_access !== true) {
        throw new AppError(httpStatus.BAD_REQUEST, "multi_user_access must be true for unlimited plan.");
    }
    if (payload.no_time_limit !== undefined && payload.no_time_limit !== true) {
        throw new AppError(httpStatus.BAD_REQUEST, "no_time_limit must be true for unlimited plan.");
    }
};

export const updateStandardPlan = (payload: TSubscription) => {
    if (
        payload.planPrice === undefined ||
        payload.planPrice === null ||
        typeof payload.planPrice !== "number" ||
        isNaN(payload.planPrice) ||
        !Number.isFinite(payload.planPrice) ||
        payload.planPrice <= 0
    ) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan price must be a positive number and is required for standard plan.");
    }
    if (
        payload.discount !== undefined &&
        payload.discount !== null &&
        typeof payload.discount === "number" &&
        payload.discount > 0
    ) {
        if (payload.planPrice - payload.discount < 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Discount cannot make plan price negative for standard plan.");
        }
    }
    if (payload.numberOfEmployees && payload.numberOfEmployees.length > 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "numberOfEmployees is not applicable for standard plan.");
    }
    if (payload.expiryDate) {
        throw new AppError(httpStatus.BAD_REQUEST, "Expiry date is not applicable for standard plan.");
    }
    if (!payload.jobpost || typeof payload.jobpost !== "number" || isNaN(payload.jobpost)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Job post must be a valid number for standard plan.");
    }
};

export const updateBasicPlan = (payload: TSubscription) => {


    if (!payload.planPrice) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan price is required for basic plan.");
    }
    if (payload.discount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Discount is not applicable for basic plan");
    }
    if (payload.numberOfEmployees && payload.numberOfEmployees.length > 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "numberOfEmployees is not applicable for basic plan.");
    }
    if (!payload.expiryDate || (payload.expiryDate !== 30 && payload.expiryDate !== 60)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Expiry date must be 30 or 60 days for basic plan.");
    }
    if (!payload.jobpost || typeof payload.jobpost !== "number" || isNaN(payload.jobpost)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Job post must be a valid number for basic plan.");
    }
};
