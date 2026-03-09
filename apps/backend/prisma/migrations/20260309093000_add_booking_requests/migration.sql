CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "petName" TEXT NOT NULL,
    "petBreed" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3) NOT NULL,
    "preferredPeriod" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "ownerPhone" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);
