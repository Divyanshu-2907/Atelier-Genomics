import { HeroSection } from '@/components/hero/HeroSection';
import { InnovationSection } from '@/components/innovation/InnovationSection';
import { ResearchSection } from '@/components/research/ResearchSection';
import { CapabilitiesSection } from '@/components/capabilities/CapabilitiesSection';
import { ImpactSection } from '@/components/impact/ImpactSection';
import { CtaSection } from '@/components/cta/CtaSection';
import { Footer } from '@/components/shared/Footer';

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col bg-[#06080a] text-[#f3f4f1]">
      <HeroSection />
      <InnovationSection />
      <ResearchSection />
      <CapabilitiesSection />
      <ImpactSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
