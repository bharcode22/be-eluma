/*
  Warnings:

  - You are about to drop the column `fasilities_name` on the `Facilities` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Facilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Facilities" DROP COLUMN "fasilities_name",
DROP COLUMN "status",
ADD COLUMN     "air_conditioning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "beach_access" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "celling_fan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "coffee_maker" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "drying_machine" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fridge" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "game_console" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gym" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kettle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "microwave" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "private_entrance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refrigenerator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "security" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "toaster" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "washing_machine" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wifi" BOOLEAN DEFAULT false,
ADD COLUMN     "workspace_area" BOOLEAN NOT NULL DEFAULT false;
