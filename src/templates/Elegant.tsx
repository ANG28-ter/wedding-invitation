import { TemplateProps } from "./types";

export default function Elegant({ data }: TemplateProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 text-slate-800">
            <h1 className="text-3xl font-light tracking-widest uppercase">Elegant Theme</h1>
            <p className="mt-4 font-serif italic text-xl">Coming Soon for {data.groomName} & {data.brideName}</p>
        </div>
    );
}
