import { Invitation, Event, MediaItem, SocialLink, Story, GiftAccount } from "@prisma/client";

export interface TemplateProps {
    data: Invitation & {
        events: Event[];
        stories: Story[];
        mediaItems: MediaItem[];
        socialLinks: SocialLink[];
        giftAccounts: GiftAccount[];
    };
}
