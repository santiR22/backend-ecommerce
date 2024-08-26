// 5:32:28
import blogCategory from "../models/blogCategory.model.js";
import asyncHandler from "express-async-handler";
import { validateMongoId } from "../utils/validateMongoId.js";

export const get_categories = asyncHandler(async (req, res) => {
  try {
    const categories = await blogCategory.find();
    res.json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

export const get_category = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await blogCategory.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

export const create_category = asyncHandler(async (req, res) => {
  try {
    const new_category = await blogCategory.create(req.body);
    res.json(new_category);
  } catch (error) {
    throw new Error(error);
  }
});

export const update_category = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updated_category = await blogCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updated_category);
  } catch (error) {
    throw new Error(error);
  }
});

export const delete_category = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deleted_category = await blogCategory.findByIdAndDelete(id);
    res.json(deleted_category);
  } catch (error) {
    throw new Error(error);
  }
});
