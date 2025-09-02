/*
  Adjusted to add updatedAt with a default for existing rows.
*/
-- AlterTable
ALTER TABLE "public"."Ticker" ADD COLUMN     "country" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dividendYield" DECIMAL(20,6),
ADD COLUMN     "enrichmentSource" TEXT,
ADD COLUMN     "exchange" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "ipoDate" TIMESTAMP(3),
ADD COLUMN     "lastEnrichedAt" TIMESTAMP(3),
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "marketCap" DECIMAL(20,2),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "peRatio" DECIMAL(20,6),
ADD COLUMN     "sector" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "website" TEXT;
