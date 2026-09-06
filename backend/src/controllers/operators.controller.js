import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";

// 1. GET ALL OPERATOR USERS
export const getOperators = async (req, res) => {
  try {
    const operators = await prisma.users.findMany({
      where: {
        role: "OPERATOR",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        userId: true,
        userName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      operators,
    });
  } catch (error) {
    console.error("Error fetching operators:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch operators.",
    });
  }
};

// 2. CREATE OPERATOR (Password Hashed with bcrypt)
export const createOperator = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An operator with this email already exists.",
      });
    }

    // Hash the password with 10 salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const operator = await prisma.users.create({
      data: {
        userName: userName || email.split("@")[0],
        email,
        password: hashedPassword, // Store the hashed password!
        role: "OPERATOR",
        isActive: true,
      },
      select: {
        userId: true,
        userName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(201).json(operator);
  } catch (error) {
    console.error("Error creating operator:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// 3. DEACTIVATE OPERATOR
export const deactivateOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = isNaN(id) ? id : Number(id);

    await prisma.users.update({
      where: { userId: parsedId },
      data: { isActive: false },
    });

    return res.status(200).json({
      message: "Operator deactivated successfully.",
    });
  } catch (error) {
    console.error("Error deactivating operator:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// 4. ACTIVATE OPERATOR
export const activateOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = isNaN(id) ? id : Number(id);

    await prisma.users.update({
      where: { userId: parsedId },
      data: { isActive: true },
    });

    return res.status(200).json({
      message: "Operator activated successfully.",
    });
  } catch (error) {
    console.error("Error activating operator:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};