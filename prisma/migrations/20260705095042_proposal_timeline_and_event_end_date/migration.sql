-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "deliverables" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "terms" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "timeline" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "lineItems" SET DEFAULT '[]',
ALTER COLUMN "total" SET DEFAULT 0;
