import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingPortfolio from "@/components/landing/LandingPortfolio";
import LandingStats from "@/components/landing/LandingStats";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingThemes from "@/components/landing/LandingThemes";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingContact from "@/components/landing/LandingContact";
import LandingFooter from "@/components/landing/LandingFooter";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch real stats from database
  const invitationsCount = await prisma.invitation.count();
  const guestbookCount = await prisma.guestbook.count();
  const mediaCount = await prisma.mediaItem.count();
  const rsvpAggregate = await prisma.rsvp.aggregate({ _sum: { pax: true } });

  // Add 100 or some base number to make it look active, or just real raw numbers
  const statsData = {
    invitations: invitationsCount,
    media: mediaCount,
    messages: guestbookCount,
    rsvps: rsvpAggregate._sum.pax || 0,
  };

  return (
    <main className="min-h-screen bg-[#20150f] text-white selection:bg-[rgb(var(--color-primary))] selection:text-black">
      <LandingHeader />
      <LandingHero />
      <LandingPortfolio invitationsCount={statsData.invitations} />
      <LandingStats data={statsData} />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingThemes />
      <LandingPricing />
      <LandingFAQ />
      <LandingContact />
      <LandingFooter />
    </main>
  );
}
