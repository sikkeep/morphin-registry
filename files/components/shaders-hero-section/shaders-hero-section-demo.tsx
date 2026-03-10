import {
  Header,
  HeroContent,
  PulsingCircle,
  ShaderBackground,
} from "@/components/shaders-hero-section";

export default function ShadersHeroSectionDemo() {
  return (
    <ShaderBackground>
      <Header />
      <HeroContent />
      <PulsingCircle />
    </ShaderBackground>
  );
}
