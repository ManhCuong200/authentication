import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

  return { accessToken, refreshToken };
};

export const registerUser = async ({ email, password, name, role }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("EMAIL_EXIST");

  const newUser = await User.create({ email, password, name, role });

  const tokens = generateTokens(newUser._id);

  await User.findByIdAndUpdate(newUser._id, {
    refreshToken: tokens.refreshToken,
  });

  return {
    tokens,
    user: {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("INVALID_CREDENTIALS");

  const tokens = generateTokens(user._id);

  await User.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
  });

  return {
    tokens,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

export const refreshTokenProcess = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie) throw new Error("NO_REFRESH_TOKEN");

  let decoded;
  try {
    decoded = jwt.verify(refreshTokenFromCookie, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("REFRESH_TOKEN_INVALID");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== refreshTokenFromCookie)
    throw new Error("REFRESH_TOKEN_NOT_MATCH");

  const newAccessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );

  return { accessToken: newAccessToken };
};

export const getMe = async (user) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
