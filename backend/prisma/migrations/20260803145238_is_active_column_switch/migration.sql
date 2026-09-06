-- AlterTable
ALTER TABLE "Departments" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
