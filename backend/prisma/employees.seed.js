import prisma from '../src/db/prisma.js'

export const employeeSeed = async () => {
  await prisma.employees.createMany({
    data: [
      // QA
      { employeeName: "Aarav Sharma", departmentId: 1 },
      { employeeName: "Priya Nair", departmentId: 1 },
      { employeeName: "Rohan D'Souza", departmentId: 1 },

      // HR
      { employeeName: "Neha Verma", departmentId: 2 },
      { employeeName: "Karan Mehta", departmentId: 2 },
      { employeeName: "Ananya Rao", departmentId: 2 },

      // Finance
      { employeeName: "Vikram Iyer", departmentId: 3 },
      { employeeName: "Sneha Kulkarni", departmentId: 3 },
      { employeeName: "Rahul Patil", departmentId: 3 },

      // Maintenance
      { employeeName: "Suresh Kumar", departmentId: 7 },
      { employeeName: "Mahesh Gowda", departmentId: 7 },
      { employeeName: "Ramesh Shetty", departmentId: 7 }
    ],
    skipDuplicates: true
  })
}

employeeSeed()