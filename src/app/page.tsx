import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[rgb(var(--color-secondary))] p-8 text-[rgb(var(--color-foreground))]">
      <div className="rounded-2xl bg-[rgb(var(--color-primary))] p-10 text-[rgb(var(--color-secondary))]">
        <h1 className="text-3xl font-semibold">Jawa Modern</h1>
        <p className="mt-2 opacity-80">Primary Maroon · Secondary Ivory</p>
        <div className="mt-6 h-px bg-[rgb(var(--color-gold))]" />
      </div>
    </main>
  );
}
