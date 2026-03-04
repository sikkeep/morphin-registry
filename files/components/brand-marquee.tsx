"use client";

import {
  Activity,
  BarChart3,
  BrainCircuit,
  Layers,
  LineChart,
  Radio,
  TrendingUp,
  Workflow,
} from "lucide-react";

const brands = [
  { name: "Datavora", icon: Activity },
  { name: "Synalytix", icon: Workflow },
  { name: "Optivise AI", icon: BrainCircuit },
  { name: "Nexora Labs", icon: Layers },
  { name: "MetricFlow", icon: LineChart },
  { name: "AuriSense", icon: Radio },
  { name: "Quantiva", icon: TrendingUp },
  { name: "InsightHQ", icon: BarChart3 },
];

export function BrandMarquee() {
  return (
    <section className="overflow-hidden py-12 md:py-16">
      <div className="brand-marquee-track flex w-max items-center gap-12 motion-reduce:animate-none md:gap-16">
        {brands.map((brand) => (
          <div
            key={`a-${brand.name}`}
            className="flex shrink-0 items-center gap-2"
          >
            <brand.icon className="h-5 w-5 text-neutral-600" />
            <span className="text-base font-medium text-neutral-600 whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
        {brands.map((brand) => (
          <div
            key={`b-${brand.name}`}
            className="flex shrink-0 items-center gap-2"
          >
            <brand.icon className="h-5 w-5 text-neutral-600" />
            <span className="text-base font-medium text-neutral-600 whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
