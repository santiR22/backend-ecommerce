import prodCategory from "../models/prodCategory.model.js";
import asyncHandler from "express-async-handler";
import { validateMongoId } from "../utils/validateMongoId.js";

export const get_categories = asyncHandler(async (req, res) => {
  try {
    const categories = await prodCategory.find();
    res.json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

export const get_category = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prodCategory.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

export const create_category = asyncHandler(async (req, res) => {
  try {
    const new_category = await prodCategory.create(req.body);
    res.json(new_category);
  } catch (error) {
    throw new Error(error);
  }
});

export const update_category = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updated_category = await prodCategory.findByIdAndUpdate(
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
    const deleted_category = await prodCategory.findByIdAndDelete(id);
    res.json(deleted_category);
  } catch (error) {
    throw new Error(error);
  }
});
