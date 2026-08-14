import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { ScientificLabel } from '@/components/shared/ScientificLabel';
import { ArrowLeft, Dna } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center py-24 px-6 text-center bg-[#06080a] text-[#f3f4f1] relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        <ScientificLabel label="TELEMETRY // ERROR 404" accent="amber" pulse={true} className="mx-auto" />

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 inline-block">
          <Dna size={48} />
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl font-light tracking-tight text-[#f3f4f1]">
          Sequence Not Found
        </h1>

        <p className="font-sans text-sm text-[#8e959e] leading-relaxed">
          The requested genomic target coordinate or page sequence does not exist within the Atelier Genomics database.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" size="md" icon={<ArrowLeft size={16} />}>
              Return to Primary Platform
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
