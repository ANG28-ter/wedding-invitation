"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitTestimonial(data: { name: string; invitationId?: string; role?: string; message: string; rating: number }) {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating harus antara 1 dan 5");
  }
  if (!data.name || !data.message) {
    throw new Error("Nama dan pesan tidak boleh kosong");
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        invitationId: data.invitationId,
        role: data.role,
        message: data.message,
        rating: data.rating,
        isApproved: false, // Membutuhkan persetujuan admin
      },
    });

    revalidatePath("/portofolio");
    return { success: true, testimonial };
  } catch (error: any) {
    console.error("Error submit testimoni:", error);
    return { success: false, error: "Terjadi kesalahan internal server" };
  }
}

export async function toggleTestimonialApproval(id: string, isApproved: boolean) {
  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: { isApproved },
    });
    revalidatePath("/portofolio");
    revalidatePath("/admin/testimonials");
    return { success: true, testimonial: updated };
  } catch (error: any) {
    console.error("Error toggle testimoni:", error);
    return { success: false, error: "Gagal merubah status" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    revalidatePath("/portofolio");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error delete testimoni:", error);
    return { success: false, error: "Gagal menghapus testimoni" };
  }
}
