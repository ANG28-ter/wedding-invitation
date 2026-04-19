import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JawaModern from "@/templates/JawaModern";
import JawaKuno from "@/templates/JawaKuno";
import Elegant from "@/templates/Elegant";
import DesktopSideImage from "@/components/DesktopSideImage";

// Force dynamic rendering - no cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: Promise<{ slug: string }> };

export default async function InvitationPage({ params }: Params) {
  const { slug } = await params;

  // Fetch invitation with all related data including stories
  const invitation = await prisma.invitation.findUnique({
    where: { slug: decodeURIComponent(slug).toLowerCase().trim() },
    include: {
      events: {
        orderBy: { date: "asc" },
      },
      stories: {
        orderBy: { order: "asc" },
      },
      mediaItems: {
        orderBy: { order: "asc" },
      },
      socialLinks: {
        orderBy: { order: "asc" },
      },
      giftAccounts: {
        orderBy: { order: "asc" },
      },
      rsvps: false, // Not needed for public view
      guestbooks: false, // Loaded client-side
    },
  });

  if (!invitation) notFound();

  // Template Dispatcher based on theme
  const themeKey = invitation.theme?.toLowerCase().trim();

  let TemplateComponent;
  if (themeKey === "jawa-kuno") {
    TemplateComponent = JawaKuno;
  } else if (themeKey === "elegant") {
    TemplateComponent = Elegant;
  } else {
    TemplateComponent = JawaModern;
  }

  return (
    <div className="invitation-container">
      <DesktopSideImage
        image={invitation.coverImage}
        groomImage={invitation.groomPhotoUrl}
        brideImage={invitation.bridePhotoUrl}
      />
      <div className="mobile-viewport">
        <TemplateComponent data={invitation} />
      </div>
    </div>
  );
}
