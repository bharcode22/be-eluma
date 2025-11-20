-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
