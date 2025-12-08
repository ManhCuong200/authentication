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

export const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

// export const updateUser = async (userId, data) => {
//   const user = await User.findById(userId);
// console.log("user SERRVICE: ", user)
//   if (!user) throw new Error("USER_NOT_FOUND");
//   console.log(user._id.toString())
//   console.log("data",data._id.toString())
//   // check this user is Authorization
//   // if(user._id.toString() !== id) throw new Error("NOT_AUTHORIZATION");
  
//   if (data._id && data._id.toString() !== userId) {
//   throw new Error("NOT_AUTHORIZATION");
// }

//   // if (password) {
//   //   user.password = password;
//   // }
//   user._id = data._id || user._id;
//   user.name = data.name || user.name;
//   user.role = data.role || user.role;

//   await user.save();

//   return {
//     id: user._id,
//     name: user.name,
//     role: user.role,
//   };
// };

export const updateUser = async (targetId, data, actingId, actingRole) => {
  const user = await User.findById(targetId);
  if (!user) throw new Error("USER_NOT_FOUND");
console.log(targetId)
  // User thường chỉ được sửa chính mình
  if (actingRole !== "admin" && actingId !== targetId) {
    throw new Error("NOT_AUTHORIZATION");
  }

  if (data.name) user.name = data.name;
  if (data.role && actingRole === "admin") user.role = data.role;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    role: user.role,
  };
};
