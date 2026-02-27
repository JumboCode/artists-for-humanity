-- DropForeignKey
ALTER TABLE "public"."Artwork" DROP CONSTRAINT "Artwork_user_id_fkey";

-- AlterTable
ALTER TABLE "Artwork" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
