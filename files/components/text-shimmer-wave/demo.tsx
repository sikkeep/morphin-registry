import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";

export default function Demo() {
  return (
    <TextShimmerWave
      className="[--base-color:#0D74CE] [--base-gradient-color:#5EB1EF]"
      duration={1}
      spread={1}
      zDistance={1}
      scaleDistance={1.1}
      rotateYDistance={20}
    >
      Loading Resources...
    </TextShimmerWave>
  );
}
