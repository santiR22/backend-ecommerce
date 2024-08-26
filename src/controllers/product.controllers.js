import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const productFound = await Product.findById(id);
    res.json(productFound);
  } catch (error) {
    throw new Error(error);
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  try {
    //filtering...
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let query_string = JSON.stringify(queryObj);
    query_string = query_string.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Product.find(JSON.parse(query_string));

    //sorting...
    if (req.query.sort) {
      const sort_by = req.query.sort.split(",").join(" ");
      query = query.sort(sort_by);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields...
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination...
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const product_count = await Product.countDocuments();
      if (skip >= product_count) throw new Error("This page doesn't exists");
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPRoduct = await Product.findOneAndDelete(id);
    res.json(deletedPRoduct);
  } catch (error) {
    throw new Error(error);
  }
});
