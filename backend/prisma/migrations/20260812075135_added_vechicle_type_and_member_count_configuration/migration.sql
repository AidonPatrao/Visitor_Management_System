-- CreateTable
CREATE TABLE "LookupVehicleTypes" (
    "vehicleTypeId" SERIAL NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LookupVehicleTypes_pkey" PRIMARY KEY ("vehicleTypeId")
);

-- CreateTable
CREATE TABLE "LookupMemberCounts" (
    "memberCountId" SERIAL NOT NULL,
    "memberCount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LookupMemberCounts_pkey" PRIMARY KEY ("memberCountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LookupVehicleTypes_vehicleType_key" ON "LookupVehicleTypes"("vehicleType");

-- CreateIndex
CREATE UNIQUE INDEX "LookupMemberCounts_memberCount_key" ON "LookupMemberCounts"("memberCount");
