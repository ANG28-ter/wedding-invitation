-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startTime" TEXT;
