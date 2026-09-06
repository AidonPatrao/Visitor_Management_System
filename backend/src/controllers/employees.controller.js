import prisma from "../db/prisma.js";

// 1. GET ALL EMPLOYEES (Includes related Department details)
export const getEmployees = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const whereClause = departmentId 
      ? { departmentId: Number(departmentId) } 
      : {};

    const employees = await prisma.employees.findMany({
      where: whereClause,
      include: {
        department: true, // Includes department details for each employee
      },
      orderBy: {
        employeeName: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees.",
    });
  }
};


export const createEmployee = async (req, res) => {
  try {
    const { employeeName, departmentId } = req.body;

    if (!employeeName || !departmentId) {
      return res.status(400).json({
        message: "Employee name and Department selection are required."
      });
    }

    const employee = await prisma.employees.create({
      data: {
        employeeName,
        departmentId: Number(departmentId)
      },
      include: {
        department: true // Return complete department details
      }
    });

    return res.status(201).json(employee);

  } catch (error) {
    console.error("Error creating employee:", error);
    return res.status(500).json({
      message: "Internal server error."
    });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, departmentId } = req.body;

    const employee = await prisma.employees.findUnique({
      where: { employeeId: Number(id) }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const updatedEmployee = await prisma.employees.update({
      where: { employeeId: Number(id) },
      data: {
        employeeName,
        ...(departmentId && { departmentId: Number(departmentId) })
      },
      include: {
        department: true
      }
    });

    return res.status(200).json(updatedEmployee);

  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employees.update({
      where: { employeeId: Number(id) },
      data: { isActive: false }
    });
    return res.status(200).json({ message: "Employee deactivated successfully." });
  } catch (error) {
    console.error("Error deactivating employee:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const activateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employees.update({
      where: { employeeId: Number(id) },
      data: { isActive: true }
    });
    return res.status(200).json({ message: "Employee activated successfully." });
  } catch (error) {
    console.error("Error activating employee:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};