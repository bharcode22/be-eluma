/*
  Warnings:

  - Added the required column `Additional_id` to the `Parking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdditionalDetails" DROP CONSTRAINT "AdditionalDetails_parking_id_fkey";

-- AlterTable
ALTER TABLE "Parking" ADD COLUMN     "Additional_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_Additional_id_fkey" FOREIGN KEY ("Additional_id") REFERENCES "AdditionalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
