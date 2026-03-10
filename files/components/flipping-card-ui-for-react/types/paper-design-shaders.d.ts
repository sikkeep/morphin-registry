declare module "@paper-design/shaders-react" {
  import type React from "react";

  interface ShaderBaseProps {
    className?: string;
    style?: React.CSSProperties;
  }

  interface MeshGradientProps extends ShaderBaseProps {
    colors?: string[];
    speed?: number;
    backgroundColor?: string;
    wireframe?: string;
    [key: string]: unknown;
  }

  interface PulsingBorderProps extends ShaderBaseProps {
    colors?: string[];
    colorBack?: string;
    speed?: number;
    roundness?: number;
    thickness?: number;
    softness?: number;
    intensity?: number;
    spotsPerColor?: number;
    spotSize?: number;
    pulse?: number;
    smoke?: number;
    smokeSize?: number;
    scale?: number;
    rotation?: number;
    frame?: number;
    [key: string]: unknown;
  }

  interface DitheringProps extends ShaderBaseProps {
    colorBack?: string;
    colorFront?: string;
    shape?: string;
    type?: string;
    speed?: number;
    minPixelRatio?: number;
    [key: string]: unknown;
  }

  export const MeshGradient: React.FC<MeshGradientProps>;
  export const PulsingBorder: React.FC<PulsingBorderProps>;
  export const Dithering: React.FC<DitheringProps>;
}
