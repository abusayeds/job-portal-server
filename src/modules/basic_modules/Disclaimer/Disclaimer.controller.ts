import httpStatus from "http-status";




import sanitizeHtml from "sanitize-html";

import { Request, Response } from "express";
import AppError from "../../../errors/AppError";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { createDisclaimerDB, getAllDisclaimerFromDB, updateDisclaimerDB } from "./Disclaimer.service";



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



export const createDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided or invalid format.');
  }

  const { description } = req.body;
  const sanitizedContent = sanitizeHtml(description, sanitizeOptions);
  if (!description) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Description is required!');
  }

  const result = await createDisclaimerDB({ sanitizedContent });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "About created successfully.",
    data: result,
  });
});

export const getAllDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllDisclaimerFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "About retrieved successfully.",
    data: result,
  });
});

export const updateDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided or invalid format.');

  }

  const { description } = req.body;

  if (!description) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Description is required..');

  }

  const sanitizedDescription = sanitizeHtml(description, sanitizeOptions);

  const result = await updateDisclaimerDB(sanitizedDescription);

  if (!result) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update terms.');

  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "About updated successfully.",
    data: result,
  });
});
