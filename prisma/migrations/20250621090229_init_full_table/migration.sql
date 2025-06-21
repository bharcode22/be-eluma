/*
  Warnings:

  - You are about to drop the column `tyepe_id` on the `Properties` table. All the data in the column will be lost.
  - You are about to drop the column `property_id` on the `PropertyType` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `Properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Properties" DROP CONSTRAINT "Properties_tyepe_id_fkey";

-- AlterTable
ALTER TABLE "Properties" DROP COLUMN "tyepe_id",
ADD COLUMN     "type_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "PropertyType" DROP COLUMN "property_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Properties" ADD CONSTRAINT "Properties_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
