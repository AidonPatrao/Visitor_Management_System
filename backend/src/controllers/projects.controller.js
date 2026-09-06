import prisma from "../db/prisma.js";

export const getProjects = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const whereClause = departmentId 
      ? { departmentId: Number(departmentId) } 
      : {};

    const projects = await prisma.projects.findMany({
      where: whereClause,
      include: {
        department: true, 
      },
      orderBy: {
        projectName: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
};


export const createProject = async (req, res) => {
  try {
    const { projectName, departmentId } = req.body;

    if (!projectName || !departmentId) {
      return res.status(400).json({
        message: "Project name and Department selection are required."
      });
    }

    // Check if project already exists under the same department
    const existingProject = await prisma.projects.findFirst({
      where: {
        projectName,
        departmentId: Number(departmentId)
      }
    });

    if (existingProject) {
      return res.status(409).json({
        message: "Project already exists in this department."
      });
    }

    const project = await prisma.projects.create({
      data: {
        projectName,
        departmentId: Number(departmentId)
      },
      include: {
        department: true // Include department details in the newly created response
      }
    });

    return res.status(201).json(project);

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: "Internal server error."
    });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, departmentId } = req.body;

    const project = await prisma.projects.findUnique({
      where: { projectId: Number(id) }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const updatedProject = await prisma.projects.update({
      where: { projectId: Number(id) },
      data: {
        projectName,
        ...(departmentId && { departmentId: Number(departmentId) })
      },
      include: {
        department: true
      }
    });

    return res.status(200).json(updatedProject);

  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const deactivateProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projects.update({
      where: { projectId: Number(id) },
      data: { isActive: false }
    });
    return res.status(200).json({ message: "Project deactivated successfully." });
  } catch (error) {
    console.error("Error deactivating project:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const activateProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projects.update({
      where: { projectId: Number(id) },
      data: { isActive: true }
    });
    return res.status(200).json({ message: "Project activated successfully." });
  } catch (error) {
    console.error("Error activating project:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};