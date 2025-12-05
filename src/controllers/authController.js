import * as authService from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/response.js";

const COOKIE_OPTIONS = {
  httpOnly: true,            
  secure: false,             
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

export const register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);

    if (!newUser) {
      return errorResponse(res, "Email đã tồn tại", 400, "EMAIL_EXISTS");
    }

    return successResponse(res, "Đăng ký thành công", newUser, 201);
  } catch (err) {
    return errorResponse(res, "Lỗi hệ thống", 500, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { tokens, user } = await authService.loginUser(req.body);

    if (!tokens) {
      return errorResponse(res, "Email hoặc mật khẩu không đúng", 400, "INVALID_CREDENTIALS");
    }

    // Set refresh token vào cookie
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    return successResponse(res, "Đăng nhập thành công", {
      accessToken: tokens.accessToken,
      user,
    });
  } catch (err) {
    return errorResponse(res, "Lỗi hệ thống", 500, err.message);
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      return errorResponse(res, "Không có refresh token", 401, "NO_REFRESH_TOKEN");
    }

    const tokens = await authService.refreshTokenProcess(refreshTokenFromCookie);

    return successResponse(res, "Lấy token mới thành công", {
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    return errorResponse(res, "Refresh token không hợp lệ", 401, err.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const data = await authService.getMe(req.user);
    return successResponse(res, "Lấy thông tin thành công", data);
  } catch (err) {
    return errorResponse(res, "Lỗi hệ thống", 500, err.message);
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user) {
      await authService.logoutUser(req.user.id);
    }

    res.clearCookie("refreshToken");

    return successResponse(res, "Đăng xuất thành công");
  } catch (err) {
    return errorResponse(res, "Lỗi hệ thống", 500, err.message);
  }
};
