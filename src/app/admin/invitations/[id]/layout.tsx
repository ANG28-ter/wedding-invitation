import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { id },
    select: { groomName: true, brideName: true },
  });
  if (!invitation) return { title: "Detail Undangan" };
  return {
    title: `${invitation.groomName} & ${invitation.brideName}`,
    description: `Kelola undangan digital ${invitation.groomName} & ${invitation.brideName}.`,
  };
}

export default function InvitationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
