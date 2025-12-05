import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return errorResponse(res, "Bạn chưa đăng nhập", 401, "NOT_AUTHORIZED");
  }

  try {
    // ✔ VERIFY ĐÚNG SECRET CỦA ACCESS TOKEN
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, "Token không hợp lệ", 401, "TOKEN_INVALID");
    }

    req.user = user;

    next();
  } catch (err) {
    return errorResponse(res, "Token không hợp lệ hoặc đã hết hạn", 401, "TOKEN_INVALID");
  }
};
