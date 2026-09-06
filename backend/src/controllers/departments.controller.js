import prisma from "../db/prisma.js";

export const getDepartment = async (req, res) => {
  try {
    const departments = await prisma.departments.findMany({
      orderBy: {
        departmentName: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments.",
    });
  }
};

export const createDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;

        if (!departmentName) {
            return res.status(400).json({
                message: "Department name is required."
            });
        }

        const existingDepartment = await prisma.departments.findUnique({
            where: {
                departmentName
            }
        });

        if (existingDepartment) {
            return res.status(409).json({
                message: "Department already exists."
            });
        }

        const department = await prisma.departments.create({
            data: {
                departmentName
            }
        });

        return res.status(201).json(department);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { departmentName } = req.body;

        const department = await prisma.departments.findUnique({
            where: {
                departmentId: Number(id)
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found."
            });
        }

        const updatedDepartment = await prisma.departments.update({
            where: {
                departmentId: Number(id)
            },
            data: {
                departmentName
            }
        });

        return res.status(200).json(updatedDepartment);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const deactivateDepartment = async (req, res) => {
    try {

        const { id } = req.params;

        const department = await prisma.departments.findUnique({
            where: {
                departmentId: Number(id)
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found."
            });
        }

        await prisma.departments.update({
            where: {
                departmentId: Number(id)
            },
            data: {
                isActive: false
            }
        });

        return res.status(200).json({
            message: "Department deactivated successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const activateDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await prisma.departments.findUnique({
            where: {
                departmentId: Number(id)
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found."
            });
        }

        await prisma.departments.update({
            where: {
                departmentId: Number(id)
            },
            data: {
                isActive: true
            }
        });

        return res.status(200).json({
            message: "Department activated successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};