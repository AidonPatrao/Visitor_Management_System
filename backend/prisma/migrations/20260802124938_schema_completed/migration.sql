/*
  Warnings:

  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "name",
ADD COLUMN     "userName" TEXT;

-- CreateTable
CREATE TABLE "Departments" (
    "departmentId" SERIAL NOT NULL,
    "departmentName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("departmentId")
);

-- CreateTable
CREATE TABLE "Projects" (
    "projectId" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "Employees" (
    "employeeId" SERIAL NOT NULL,
    "employeeName" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Visitors" (
    "visitorId" SERIAL NOT NULL,
    "visitorName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "visitingReason" TEXT NOT NULL,
    "additionalMembersCount" INTEGER NOT NULL,
    "additionalMembersNames" TEXT,
    "vehicleNumber" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitors_pkey" PRIMARY KEY ("visitorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departments_departmentName_key" ON "Departments"("departmentName");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_projectName_key" ON "Projects"("projectName");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
