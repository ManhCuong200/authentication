import * as projectService from '../services/projectService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const create = async (req, res) => {
  try {
    const newProject = await projectService.createProject(req.body, req.user.id);
    return successResponse(res, 'Tạo dự án thành công', newProject, 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const updated = await projectService.updateProject(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    return successResponse(res, 'Cập nhật thành công', updated);
  } catch (err) {
    if (err.message === 'FORBIDDEN')
      return errorResponse(res, 'Bạn không có quyền sửa dự án này', 403, 'FORBIDDEN');
    if (err.message === 'PROJECT_NOT_FOUND')
      return errorResponse(res, 'Không tìm thấy dự án', 404, 'PROJECT_NOT_FOUND');
    return errorResponse(res, 'Lỗi server', 500, err.message);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = await projectService.deleteProject(
      req.params.id,
      req.user.id,
      req.user.role
    );
    return successResponse(res, 'Xoá dự án thành công', deleted);
  } catch (err) {
    if (err.message === 'FORBIDDEN')
      return errorResponse(res, 'Bạn không có quyền xoá dự án này', 403, 'FORBIDDEN');
    if (err.message === 'PROJECT_NOT_FOUND')
      return errorResponse(res, 'Không tìm thấy dự án', 404, 'PROJECT_NOT_FOUND');
    return errorResponse(res, 'Lỗi server', 500, err.message);
  }
};

export const getAll = async (req, res) => {
  try {
    const list = await projectService.getAllProjects(req.user.id, req.user.role);
    return successResponse(res, 'Lấy danh sách dự án thành công', list);
  } catch (err) {
    return errorResponse(res, 'Lỗi server', 500, err.message);
  }
};
