import 'dotenv/config'
import prisma from '../src/db/prisma.js'
import bcrypt from 'bcrypt'
     
export const seed = async () => {
  const saltRounds = 10
  const seededPassword = process.env.SEED

  if (!seededPassword) {
    console.error("Error: SEED environment variable is missing from .env!")
    return
  }

  const hashedPassword = await bcrypt.hash(seededPassword, saltRounds)

  try {
    await prisma.users.create({
      data: {
        userName: "Admin",
        email: "admin@invenger.com",
        password: hashedPassword,
        role: "ADMIN"
      }
    })
    console.log("Password seeded successfully")
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()