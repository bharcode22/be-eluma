/*
  Warnings:

  - The `allow_path` column on the `AdditionalDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `construction_nearby` column on the `AdditionalDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `additional_id` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `parking_type` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `additional_id` on the `View` table. All the data in the column will be lost.
  - You are about to drop the column `view_type` on the `View` table. All the data in the column will be lost.
  - Added the required column `parking_id` to the `AdditionalDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Additional_id` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Parking" DROP CONSTRAINT "Parking_additional_id_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_additional_id_fkey";

-- AlterTable
ALTER TABLE "AdditionalDetails" ADD COLUMN     "parking_id" UUID NOT NULL,
DROP COLUMN "allow_path",
ADD COLUMN     "allow_path" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "construction_nearby",
ADD COLUMN     "construction_nearby" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Parking" DROP COLUMN "additional_id",
DROP COLUMN "parking_type",
ADD COLUMN     "bike_parking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "both_car_and_bike" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "car_parking" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "View" DROP COLUMN "additional_id",
DROP COLUMN "view_type",
ADD COLUMN     "Additional_id" UUID NOT NULL,
ADD COLUMN     "beach_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "garden_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jungle_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "montain_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ocean_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pool_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rice_field" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sunrise_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sunset_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "volcano_view" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "AdditionalDetails" ADD CONSTRAINT "AdditionalDetails_parking_id_fkey" FOREIGN KEY ("parking_id") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_Additional_id_fkey" FOREIGN KEY ("Additional_id") REFERENCES "AdditionalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
