/*
  Warnings:

  - You are about to drop the column `parking_id` on the `AdditionalDetails` table. All the data in the column will be lost.
  - You are about to drop the column `Additional_id` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `Additional_id` on the `View` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[property_id]` on the table `AdditionalDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[additional_details_id]` on the table `Parking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[additional_details_id]` on the table `View` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `additional_details_id` to the `Parking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `additional_details_id` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Parking" DROP CONSTRAINT "Parking_Additional_id_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_Additional_id_fkey";

-- AlterTable
ALTER TABLE "AdditionalDetails" DROP COLUMN "parking_id";

-- AlterTable
ALTER TABLE "Parking" DROP COLUMN "Additional_id",
ADD COLUMN     "additional_details_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "View" DROP COLUMN "Additional_id",
ADD COLUMN     "additional_details_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalDetails_property_id_key" ON "AdditionalDetails"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "Parking_additional_details_id_key" ON "Parking"("additional_details_id");

-- CreateIndex
CREATE UNIQUE INDEX "View_additional_details_id_key" ON "View"("additional_details_id");

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_additional_details_id_fkey" FOREIGN KEY ("additional_details_id") REFERENCES "AdditionalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_additional_details_id_fkey" FOREIGN KEY ("additional_details_id") REFERENCES "AdditionalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
