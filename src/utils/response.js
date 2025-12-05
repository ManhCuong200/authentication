// src/utils/response.js

// Dùng khi xử lý thành công (Mặc định status 200)
export const successResponse = (res, message = "Operation successful", data = null) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

// Dùng khi có lỗi (Mặc định status 400 - Bad Request)
export const errorResponse = (res, message = "Something went wrong", status = 400, errorCode = "INTERNAL_SERVER_ERROR") => {
  return res.status(status).json({
    success: false,
    message,
    errorCode
  });
};