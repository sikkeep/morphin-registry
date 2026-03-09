import {
  ScrollTextMotion,
  type ScrollTextGroup,
} from "@/components/ui/scroll-text-motion";

const groups: ScrollTextGroup[] = [
  {
    items: [
      { text: "Signal", pos: "pos-4", altPos: "pos-2" },
      { text: "Vacant orbit", pos: "pos-4", altPos: "pos-2" },
      { text: "Quantum waves", pos: "pos-4", altPos: "pos-2" },
    ],
  },
  {
    items: [
      { text: "Neural glow", pos: "pos-1", altPos: "pos-3" },
      { text: "Micro distortions", pos: "pos-1", altPos: "pos-3" },
      { text: "Data streams", pos: "pos-1", altPos: "pos-3" },
      { text: "Spark", pos: "pos-1", altPos: "pos-3" },
      { text: "Cold radiance", pos: "pos-1", altPos: "pos-3" },
    ],
  },
  {
    items: [
      {
        text: "M",
        pos: "pos-1",
        altPos: "pos-2",
        xl: true,
        scrambleDuration: 2.5,
      },
    ],
  },
  {
    items: [
      {
        text: "アクセス権限がありません",
        pos: "pos-1",
        altPos: "pos-3",
        scrambleDuration: 0,
      },
      {
        text: "█",
        pos: "pos-1",
        altPos: "pos-3",
        scrambleDuration: 0,
        typingIndicator: true,
      },
    ],
  },
  {
    items: [
      { text: "Beacon", pos: "pos-2", altPos: "pos-5" },
      { text: "Synthetic veil", pos: "pos-2", altPos: "pos-5" },
      { text: "Hidden strata", pos: "pos-2", altPos: "pos-5" },
    ],
  },
  {
    items: [
      {
        text: "S",
        pos: "pos-3",
        altPos: "pos-9",
        xl: true,
        scrambleDuration: 2.5,
      },
    ],
  },
  {
    items: [
      { text: "Nebula", pos: "pos-3", altPos: "pos-2" },
      { text: "Digital scatter", pos: "pos-3", altPos: "pos-2" },
      { text: "Orbital drift", pos: "pos-3", altPos: "pos-2" },
      { text: "Photon shards", pos: "pos-3", altPos: "pos-2" },
    ],
  },
  {
    items: [
      {
        text: "操作は許可されていません",
        pos: "pos-1",
        altPos: "pos-3",
        scrambleDuration: 0,
      },
      {
        text: "█",
        pos: "pos-1",
        altPos: "pos-3",
        scrambleDuration: 0,
        typingIndicator: true,
      },
    ],
  },
  {
    items: [
      { text: "Anomaly", pos: "pos-2", altPos: "pos-4" },
      { text: "Dark offset", pos: "pos-2", altPos: "pos-4" },
      { text: "Gradual decay", pos: "pos-2", altPos: "pos-4" },
      { text: "Temporal imprint", pos: "pos-2", altPos: "pos-4" },
      { text: "Stable rupture", pos: "pos-2", altPos: "pos-4" },
      { text: "Harmonic field", pos: "pos-2", altPos: "pos-4" },
    ],
  },
  {
    items: [
      {
        text: "A",
        pos: "pos-1",
        altPos: "pos-3",
        xl: true,
        scrambleDuration: 2.5,
      },
    ],
  },
  {
    items: [
      { text: "Latent energy", pos: "pos-2", altPos: "pos-9" },
      { text: "Spectral imprint", pos: "pos-2", altPos: "pos-9" },
      { text: "Muted emission", pos: "pos-2", altPos: "pos-9" },
      { text: "Archived potential", pos: "pos-2", altPos: "pos-9" },
      { text: "Quantum impulse", pos: "pos-2", altPos: "pos-9" },
      { text: "Distributed field", pos: "pos-2", altPos: "pos-9" },
    ],
  },
  {
    items: [
      {
        text: "B",
        pos: "pos-3",
        altPos: "pos-10",
        xl: true,
        scrambleDuration: 2.5,
        flipEase: "expo.in",
      },
    ],
  },
  {
    items: [
      { text: "Flare", pos: "pos-4", altPos: "pos-3" },
      { text: "Phase transit", pos: "pos-4", altPos: "pos-3" },
      { text: "Slow orbit", pos: "pos-4", altPos: "pos-3" },
      { text: "Merged signal", pos: "pos-4", altPos: "pos-3" },
    ],
  },
  {
    items: [
      {
        text: "権限が不足しています",
        pos: "pos-1",
        altPos: "pos-3",
        scrambleDuration: 0,
      },
      {
        text: "█",
        pos: "pos-1",
        altPos: "pos-3",
        scrambleDuration: 0,
        typingIndicator: true,
      },
    ],
  },
  {
    items: [
      { text: "Latent charge", pos: "pos-3", altPos: "pos-5" },
      { text: "Nano beacon", pos: "pos-3", altPos: "pos-5" },
      { text: "Photon trail", pos: "pos-3", altPos: "pos-5" },
      { text: "Diffuse render", pos: "pos-3", altPos: "pos-5" },
    ],
  },
  {
    items: [
      {
        text: "N",
        pos: "pos-2",
        altPos: "pos-3",
        xl: true,
        scrambleDuration: 2.5,
      },
    ],
  },
  {
    items: [
      { text: "Silent current", pos: "pos-3", altPos: "pos-6" },
      { text: "Orbital marker", pos: "pos-3", altPos: "pos-6" },
      { text: "Radiant vector", pos: "pos-3", altPos: "pos-6" },
      { text: "Soft projection", pos: "pos-3", altPos: "pos-6" },
    ],
  },
  {
    items: [
      { text: "Quantum residue", pos: "pos-2", altPos: "pos-7" },
      { text: "Signal anchor", pos: "pos-2", altPos: "pos-7" },
      { text: "Luminous path", pos: "pos-2", altPos: "pos-7" },
      { text: "Ambient blur", pos: "pos-2", altPos: "pos-7" },
    ],
  },
  {
    items: [
      { text: "Dormant voltage", pos: "pos-3", altPos: "pos-8" },
      { text: "Micro relay", pos: "pos-3", altPos: "pos-8" },
      { text: "Spectral trace", pos: "pos-3", altPos: "pos-8" },
      { text: "Diffuse mapping", pos: "pos-3", altPos: "pos-8" },
      { text: "Residual energy", pos: "pos-3", altPos: "pos-8" },
      { text: "Nano transmitter", pos: "pos-3", altPos: "pos-8" },
      { text: "Photon residue", pos: "pos-3", altPos: "pos-8" },
      { text: "Soft raster", pos: "pos-3", altPos: "pos-8" },
      { text: "Stored impulse", pos: "pos-3", altPos: "pos-8" },
      { text: "Quantum locator", pos: "pos-3", altPos: "pos-8" },
      { text: "Radiant filament", pos: "pos-3", altPos: "pos-8" },
      { text: "Light diffusion", pos: "pos-3", altPos: "pos-8" },
      { text: "Static potential", pos: "pos-3", altPos: "pos-8" },
      { text: "Signal node", pos: "pos-3", altPos: "pos-8" },
      { text: "Energy wake", pos: "pos-3", altPos: "pos-8" },
      { text: "Blurred output", pos: "pos-3", altPos: "pos-8" },
      { text: "Hidden current", pos: "pos-3", altPos: "pos-8" },
      { text: "Data beacon", pos: "pos-3", altPos: "pos-8" },
      { text: "Lumen echo", pos: "pos-3", altPos: "pos-8" },
      { text: "Soft synthesis", pos: "pos-3", altPos: "pos-8" },
      { text: "Quantum latency", pos: "pos-3", altPos: "pos-8" },
      { text: "Neural marker", pos: "pos-3", altPos: "pos-8" },
      { text: "Optic trail", pos: "pos-3", altPos: "pos-8" },
      { text: "Diffuse signal", pos: "pos-3", altPos: "pos-8" },
    ],
  },
  {
    items: [
      { text: "Residual charge", pos: "pos-1", altPos: "pos-1" },
      { text: "Optical trace", pos: "pos-1", altPos: "pos-2" },
      { text: "Soft output", pos: "pos-1", altPos: "pos-4" },
      { text: "Stored voltage", pos: "pos-1", altPos: "pos-5" },
      { text: "Nano impulse", pos: "pos-1", altPos: "pos-6" },
      { text: "Diffuse field", pos: "pos-1", altPos: "pos-4" },
    ],
  },
];

export default function ScrollTextDemo() {
  return <ScrollTextMotion groups={groups} logo="Morphin.dev" />;
}
