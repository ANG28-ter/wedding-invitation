"use client";

import { useEffect, useState } from "react";

export default function DateText({
  iso,
  withTime = true,
}: {
  iso: string;
  withTime?: boolean;
}) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    try {
      const d = new Date(iso);
      setFormatted(d.toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      }));
    } catch (e) {
      setFormatted("-");
    }
  }, [iso, withTime]);

  // Render empty placeholder on server/initial client to ensure matching HTML
  if (!formatted) return <span className="opacity-0">Loading...</span>;

  return (
    <span>
      {formatted}
    </span>
  );
}
