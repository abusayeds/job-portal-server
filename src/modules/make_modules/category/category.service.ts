import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TCategory } from "./category.interface";
import { categoryModel } from "./category.model";

const createCategoryDB = async (payload: TCategory) => {
    const category = payload.catagoryType.trim();
    const isExist = await categoryModel.findOne({ catagoryType: category })
    if (isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "This catagory alredy exist ")
    }
    if (payload.logo && !payload.logo.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid logo path");
    }
    const result = await categoryModel.create(payload);
    return result;
};

const updateCategoryDB = async (id: string, updatedData: TCategory) => {
    if (updatedData.logo && !updatedData.logo.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid logo path");
    }
    const result = await categoryModel.findByIdAndUpdate(id, updatedData, { new: true });
    return result;
};

const deleteCategoryDB = async (id: string) => {
    const result = await categoryModel.findByIdAndDelete(id);
    return result;
};

const getAllCategoriesDB = async () => {
    const result = await categoryModel.find({});
    return result;
};

const getSingleCategoryDB = async (id: string) => {
    const result = await categoryModel.findById(id);
    return result;
};


const getPopularCategoryDB = async () => {
    try {
        const popularCategories = await categoryModel.find()
            .sort({ jobPostCount: -1 })
            .limit(8);

        return popularCategories;

    } catch (error) {
        throw new Error("Error fetching favorite categories");
    }
};




export const categoryService = {
    createCategoryDB,
    updateCategoryDB,
    deleteCategoryDB,
    getAllCategoriesDB,
    getSingleCategoryDB,
    getPopularCategoryDB
};
