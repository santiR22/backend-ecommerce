import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { SECRET } from "../config.js";
import { generateJwt } from "../config/generateJwt.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import { send_email } from "./email.controllers.js";

// Register...
export const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    //create a new user...
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //user already exists...
    throw new Error("User already exists");
  }
});

// Login...
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user exists or not...
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);

    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // if user exists and password is correct...
    res.json({
      token: generateJwt(findUser?._id),
    });
  } else {
    // if user does not exist or password is incorrect...
    throw new Error("Invalid credentials");
  }
});

//handle refresh token...
export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies.");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) throw new Error("No refresh token present in db or not matched.");

  jwt.verify(refreshToken, SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong with refresh token.");
    }

    const accessToken = generateJwt(user?._id);
    res.json({ accessToken });
  });
});

//logout...
export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }

  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

// Get users...
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

// Get one user...
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    const user = await User.findById(id);
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

// update user...
export const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// delete user...
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    await User.findByIdAndDelete(id);
    res.status(204).json();
  } catch (error) {
    throw new Error(error);
  }
});

//block & unblock user (only for admin)...
export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    const blocked = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ message: "user blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    const unblocked = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ message: "user unblocked" });
  } catch (error) {
    throw new Error(error);
  }
});

//change/update password...
export const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const { password } = req.body;

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updated_password = await user.save();
    res.json(updated_password);
  } else {
    res.json(user);
  }
});

//Forgot your password...?
export const forgot_password_token = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found with this email");

  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:4000/api/user/reset-password/${token}'>Click Here</>`;

    const data = {
      to: email,
      text: "Hey user!!!",
      subject: "Forgot password link",
      htm: resetURL,
    };

    send_email(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

export const reset_password = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashed_token = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashed_token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token expired. Please try again later");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  res.json(user);
});
