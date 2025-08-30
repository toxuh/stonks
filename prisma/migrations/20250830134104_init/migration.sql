-- CreateTable
CREATE TABLE "public"."PriceTick" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DECIMAL(18,6) NOT NULL,
    "volume" DECIMAL(18,6),
    "ts" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceTick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceTick_symbol_ts_idx" ON "public"."PriceTick"("symbol", "ts");
