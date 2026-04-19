import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const invitations = await prisma.invitation.findMany();
  console.log(JSON.stringify(invitations.map(i => ({ slug: i.slug, musicUrl: i.musicUrl })), null, 2));
}

main().finally(() => prisma.$disconnect());
