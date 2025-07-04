import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
    const result = await categoryService.createCategoryDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result
    });
});

const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await categoryService.updateCategoryDB(id, updatedData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category updated successfully',
        data: result
    });
});

const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategoryDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category deleted successfully',
        data: result
    });
});

const getAllCategories = catchAsync(async (req, res) => {
    const result = await categoryService.getAllCategoriesDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Categories fetched successfully',
        data: result
    });
});

const getSingleCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.getSingleCategoryDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category fetched successfully',
        data: result
    });
});
const getPopularCategory = catchAsync(async (req, res) => {

    const result = await categoryService.getPopularCategoryDB()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category fetched successfully',
        data: result
    });
});



export const categoryController = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getSingleCategory,
    getPopularCategory
};
