-- CreateTable
CREATE TABLE "Genral_area" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "area" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Genral_area_pkey" PRIMARY KEY ("id")
);
