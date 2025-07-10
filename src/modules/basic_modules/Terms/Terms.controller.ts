import httpStatus from "http-status";

import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import AppError from "../../../errors/AppError";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import {
  createTermsInDB,
  getAllTermsFromDB,
  updateTermsInDB,
} from "./Terms.service";

const sanitizeOptions = {
  allowedTags: [
    "b",
    "i",
    "em",
    "strong",
    "a",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "code",
    "pre",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target"],
    img: ["src", "alt"],
  },
  allowedIframeHostnames: ["www.youtube.com"],
};

export const createTerms = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format.",
    );
  }

  const { description } = req.body;
  const sanitizedContent = sanitizeHtml(description, sanitizeOptions);
  if (!description) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Description is required!",
    );
  }

  const result = await createTermsInDB({ sanitizedContent });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Terms created successfully.",
    data: result,
  });
});

export const getAllTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllTermsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms retrieved successfully.",
    data: result,
  });
});

export const updateTerms = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "No token provided or invalid format.",
    );
  }

  // Sanitize the description field
  const { description } = req.body;

  if (!description) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Description is required.",
    );
  }

  const sanitizedDescription = sanitizeHtml(description, sanitizeOptions);

  // Assume you're updating the terms based on the sanitized description
  const result = await updateTermsInDB(sanitizedDescription);

  if (!result) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update terms.",
    );
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms updated successfully.",
    data: result,
  });
});
