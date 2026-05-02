import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Masuk ke dashboard admin AkaDev Invitation.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
