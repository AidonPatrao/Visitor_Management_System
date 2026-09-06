import prisma from "../db/prisma.js";

// 1. GET ACTIVE DEPARTMENTS
export const getActiveDepartments = async (req, res) => {
  try {
    const departments = await prisma.departments.findMany({
      where: { isActive: true },
      select: { departmentId: true, departmentName: true },
      orderBy: { departmentName: "asc" },
    });

    return res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching active departments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET ACTIVE PROJECTS
export const getActiveProjects = async (req, res) => {
  try {
    const projects = await prisma.projects.findMany({
      where: { isActive: true },
      select: { projectId: true, projectName: true, departmentId: true },
      orderBy: { projectName: "asc" },
    });

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching active projects:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET ACTIVE EMPLOYEES
export const getActiveEmployees = async (req, res) => {
  try {
    const employees = await prisma.employees.findMany({
      where: { isActive: true },
      select: { employeeId: true, employeeName: true, departmentId: true },
      orderBy: { employeeName: "asc" },
    });

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching active employees:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET VEHICLE TYPES (No isActive field in schema)
export const getActiveVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await prisma.lookupVehicleTypes.findMany({
      select: { vehicleTypeId: true, vehicleType: true },
      orderBy: { vehicleType: "asc" },
    });

    return res.status(200).json({ success: true, vehicleTypes });
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET MEMBER COUNTS (No isActive field in schema)
export const getActiveMemberCounts = async (req, res) => {
  try {
    const memberCounts = await prisma.lookupMemberCounts.findMany({
      select: { memberCountId: true, memberCount: true },
      orderBy: { memberCount: "asc" },
    });

    return res.status(200).json({ success: true, memberCounts });
  } catch (error) {
    console.error("Error fetching member counts:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. CREATE VISITOR RECORD
export const createVisitorRecord = async (req, res) => {
  try {
    const {
      visitorName,
      phone,
      email,
      address,
      company,
      visitingReason,
      departmentId,
      projectId,
      employeeId,
      vehicleType,
      vehicleNumber,
      additionalMembersCount,
      additionalMembersNames,
      photoUrl,
      createdBy, // Should be operator's email to satisfy foreign key
    } = req.body;

    // Schema Validation: Fields marked non-nullable in schema
    if (!visitorName || !phone || !departmentId || !projectId || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Visitor Name, Phone, Department, Project, and Employee are required.",
      });
    }

    const newVisitor = await prisma.visitors.create({
      data: {
        visitorName,
        phone,
        email: email || "",
        address: address || "N/A",
        company: company || "N/A",
        photoUrl: photoUrl || "https://via.placeholder.com/150",
        visitingReason: visitingReason || "Official",
        additionalMembersCount: Number(additionalMembersCount || 0),
        additionalMembersNames: additionalMembersNames || null,
        vehicleNumber: vehicleNumber || "N/A",
        vehicleType: vehicleType || "N/A",
        departmentId: Number(departmentId),
        projectId: Number(projectId),
        employeeId: Number(employeeId),
        createdBy: createdBy || req.user?.email || "operator@system.com", // Valid user email
      },
      include: {
        department: true,
        project: true,
        employee: true,
        createdByOperator: {
          select: { userName: true, email: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Visitor record created successfully.",
      visitor: newVisitor,
    });
  } catch (error) {
    console.error("Error creating visitor record:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to record visitor entry.",
    });
  }
};