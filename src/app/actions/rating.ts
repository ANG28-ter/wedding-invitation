"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitRating(invitationId: string, newRating: number) {
  if (newRating < 1 || newRating > 5) {
    throw new Error("Rating harus antara 1 dan 5");
  }

  try {
    // Jalankan dalam transaction agar data sinkron
    const updated = await prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: { id: invitationId },
        select: { rating: true, ratingCount: true },
      });

      if (!invitation) {
        throw new Error("Undangan tidak ditemukan");
      }

      // Hitung rata-rata rating baru
      const totalScore = invitation.rating * invitation.ratingCount;
      const newTotalScore = totalScore + newRating;
      const newRatingCount = invitation.ratingCount + 1;
      const newAverageRating = newTotalScore / newRatingCount;

      return tx.invitation.update({
        where: { id: invitationId },
        data: {
          rating: newAverageRating,
          ratingCount: newRatingCount,
        },
      });
    });

    revalidatePath("/portofolio");
    return { success: true, newRating: updated.rating, newRatingCount: updated.ratingCount };
  } catch (error) {
    console.error("Gagal submit rating:", error);
    return { success: false, error: "Gagal menyimpan rating" };
  }
}
