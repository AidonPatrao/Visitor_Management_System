import prisma from '../db/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const adminLogin = async (req, res) => {
    const { email, password , role} = req.body
    
    const findUser = await prisma.users.findUnique({
        where: {
            email: email
        }
    })
    
    if(!findUser){
        return res.status(401).json({message : "You are unauthorized to login as an admin/operator"})
    }

    const ifCorrectPassword = await bcrypt.compare(password,findUser.password)

    if(!ifCorrectPassword){
        return res.status(401).json({message : "incorrect password"})
    }

    if(findUser.role !== role) {
        return res.status(403).json("Unauthorized access, u are not an admin!!")
    }

    const token = jwt.sign({id:findUser.userId,role:findUser.role},process.env.JWT_SECRET,{expiresIn:'60m'})

    res.cookie("token",token)

    res.status(200).json({name:findUser.userName,
        email:findUser.email,
        role:findUser.role,
        createdAt:findUser.createdAt,
        updatedAt:findUser.updatedAt
    })


}

const operatorLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const findUser = await prisma.users.findUnique({
      where: { email: email }
    });

    if (!findUser) {
      return res.status(401).json({ message: "You are unauthorized to login as an admin/operator" });
    }
  
    //check to prevent deactivated users from logging in 
    if (!findUser.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated." });
    }

    const ifCorrectPassword = await bcrypt.compare(password, findUser.password);

    if (!ifCorrectPassword) {
      return res.status(401).json({ message: "incorrect password" });
    }

    if (findUser.role !== role) {
      return res.status(403).json("Unauthorized access, u are not an operator!!");
    }

    const token = jwt.sign({ id: findUser.userId, role: findUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token);

    return res.status(200).json({
      name: findUser.userName,
      email: findUser.email,
      role: findUser.role,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req,res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}





export default { adminLogin ,operatorLogin,logout}

