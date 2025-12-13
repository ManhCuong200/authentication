import Project from "../models/projectModel.js";

// 1. Tạo Project (Admin chọn owner)
export const createProject = async (data, userId) => {
  return await Project.create({ ...data, owner_id: userId });
};

// 2. Cập nhật Project (User chỉ được sửa project của họ)
export const updateProject = async (projectId, data, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  // User không phải owner + không phải admin
  if (project.owner_id.toString() !== userId && userRole !== "admin") {
    throw new Error("FORBIDDEN");
  } 

  return await Project.findByIdAndUpdate(projectId, data, { new: true });
};

// 3. Xóa Project (CHỈ ADMIN)
export const deleteProject = async (projectId, userId, userRole) => {
  if (userRole !== "admin") {
    throw new Error("FORBIDDEN");
  }

  const project = await Project.findById(projectId);
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  return await Project.findByIdAndDelete(projectId);
};

// 4. Lấy danh sách dự án
export const getAllProjects = async (userId, userRole) => {
  if (userRole === "admin") {
    return await Project.find().populate("owner_id", "name email");
  }

  // User chỉ xem dự án của mình
  return await Project.find({ owner_id: userId }).populate("owner_id", "name email");
};
