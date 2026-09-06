import prisma from "../db/prisma.js";


export const getVisitorConfigs = async (req, res) => {
  try {
    const vehicleTypes = await prisma.lookupVehicleTypes.findMany({
      orderBy: { vehicleTypeId: "asc" },
    });

    const memberCounts = await prisma.lookupMemberCounts.findMany({
      orderBy: { memberCountId: "asc" },
    });

    return res.status(200).json({
      success: true,
      vehicleTypes,
      memberCounts,
    });
  } catch (error) {
    console.error("Error fetching visitor configs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch configurations.",
    });
  }
};


export const createVehicleType = async (req, res) => {
  try {
    const { vehicleType } = req.body;

    if (!vehicleType || !vehicleType.trim()) {
      return res.status(400).json({ message: "Vehicle type is required." });
    }

    const newType = await prisma.lookupVehicleTypes.create({
      data: { vehicleType: vehicleType.trim() },
    });

    return res.status(201).json(newType);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Vehicle type already exists." });
    }
    console.error("Error creating vehicle type:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const deleteVehicleType = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lookupVehicleTypes.delete({
      where: { vehicleTypeId: Number(id) },
    });

    return res.status(200).json({ message: "Vehicle type deleted successfully." });
  } catch (error) {
    console.error("Error deleting vehicle type:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const createMemberCount = async (req, res) => {
  try {
    const { memberCount } = req.body;

    if (!memberCount || !memberCount.trim()) {
      return res.status(400).json({ message: "Member count value is required." });
    }

    const newCount = await prisma.lookupMemberCounts.create({
      data: { memberCount: memberCount.trim() },
    });

    return res.status(201).json(newCount);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Member count option already exists." });
    }
    console.error("Error creating member count:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const deleteMemberCount = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lookupMemberCounts.delete({
      where: { memberCountId: Number(id) },
    });

    return res.status(200).json({ message: "Member count option deleted successfully." });
  } catch (error) {
    console.error("Error deleting member count:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};