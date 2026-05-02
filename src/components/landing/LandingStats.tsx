"use client";

import { motion } from "framer-motion";
import { Users, Image as ImageIcon, MessageSquareHeart, UserCheck } from "lucide-react";

type StatsData = {
  invitations: number;
  media: number;
  messages: number;
  rsvps: number;
};

export default function LandingStats({ data }: { data: StatsData }) {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: `${data.invitations}+`,
      label: "Pasangan Berbahagia",
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      value: `${data.media}+`,
      label: "Momen Terabadikan",
    },
    {
      icon: <MessageSquareHeart className="w-8 h-8" />,
      value: `${data.messages}+`,
      label: "Doa & Ucapan",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      value: `${data.rsvps}+`,
      label: "Tamu Reservasi",
    },
  ];

  return (
    <section className="py-20 bg-[#1a110c] relative border-y border-[rgb(var(--color-primary))]/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4 text-[rgb(var(--color-primary))] opacity-80">
                {stat.icon}
              </div>
              <h3 className="font-heading text-3xl md:text-4xl text-white font-bold mb-2">
                {stat.value}
              </h3>
              <p className="font-sans text-sm text-white/60 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
