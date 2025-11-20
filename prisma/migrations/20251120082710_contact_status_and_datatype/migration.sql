-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'active',
ALTER COLUMN "number" SET DATA TYPE TEXT;
