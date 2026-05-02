import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Panel administrasi AkaDev Invitation.",
  robots: "noindex, nofollow", // Admin pages should not be indexed
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
