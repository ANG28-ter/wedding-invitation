import { TemplateProps } from "./types";

export default function JawaKuno({ data }: TemplateProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-stone-900 text-amber-100">
            <h1 className="text-3xl font-bold">Tema: Jawa Kuno</h1>
            <p className="mt-4">Template untuk {data.groomName} & {data.brideName} sedang dalam pengembangan.</p>
        </div>
    );
}
