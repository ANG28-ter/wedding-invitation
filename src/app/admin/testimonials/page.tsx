import { prisma } from "@/lib/prisma";
import TestimonialClient from "./TestimonialClient";
import { cookies } from "next/headers";
import { Metadata } from "next";

// Prevent static generation since this relies on fresh DB data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Kelola Testimoni",
  description: "Review dan moderasi testimoni dari klien undangan.",
};

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      role: true,
      message: true,
      rating: true,
      isApproved: true,
      createdAt: true,
      invitation: {
        select: { slug: true }
      }
    },
  });

  return <TestimonialClient initialData={testimonials} />;
}
