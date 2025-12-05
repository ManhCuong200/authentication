// src/utils/response.js

// 🟢 Success response — CHO PHÉP custom statusCode
export const successResponse = (
  res,
  message = "Operation successful",
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// 🔴 Error response — CHO PHÉP custom statusCode
export const errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 400,
  errorCode = "INTERNAL_SERVER_ERROR"
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
};
