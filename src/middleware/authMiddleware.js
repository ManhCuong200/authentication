import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  // Lấy token từ header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return errorResponse(res, "Bạn chưa đăng nhập", 401, "NOT_AUTHORIZED");
  }

  try {
    // Verify Access Token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Lấy user từ DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, "Token không hợp lệ", 401, "TOKEN_INVALID");
    }

    req.user = user;
    next(); // Quan trọng!
  } catch (err) {
    // Kiểm tra lỗi hết hạn token
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "ACCESS_TOKEN_EXPIRED", 401, "TOKEN_EXPIRED");
    }

    return errorResponse(res, "Token không hợp lệ", 401, "TOKEN_INVALID");
  }
};
