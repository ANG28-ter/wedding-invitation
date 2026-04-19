import { z } from "zod";

export const GiftAccountCreateSchema = z.object({
    bankName: z.string().min(1, "Bank name is required").max(100),
    accountNumber: z.string().min(1, "Account number is required").max(50),
    accountHolder: z.string().min(1, "Account holder name is required").max(100),
    qrCodeUrl: z.string().url().optional().nullable(),
    order: z.number().int().default(0),
});

export const GiftAccountUpdateSchema = GiftAccountCreateSchema.partial();

export type GiftAccountCreateInput = z.infer<typeof GiftAccountCreateSchema>;
export type GiftAccountUpdateInput = z.infer<typeof GiftAccountUpdateSchema>;
