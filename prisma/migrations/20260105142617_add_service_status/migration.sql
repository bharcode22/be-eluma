-- CreateEnum
CREATE TYPE "serviceStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "status" "serviceStatus" NOT NULL DEFAULT 'active';
