"use client";

import { RiCheckLine, RiInformationLine } from "@remixicon/react";
import { useState, type ReactNode } from "react";
import NumberFlow from "@number-flow/react";

import { Box, Box2 } from "iconsax-reactjs";

import { Button } from "@/components/ui/button";

import {
  PRICING_PAGE_PLANS,
  PRICING_FEATURE_GROUPS,
  type PlanFeatureValue,
} from "./pricing-plans";

type TPricing = "YEARLY" | "MONTHLY";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function PlanIcon({ planId }: { planId: string }) {
  const icons: Record<string, ReactNode> = {
    free: <Box2 size={24} variant="Broken" color="currentColor" />,
    business: <Box size={24} variant="Broken" color="currentColor" />,
    enterprise: <Box size={24} variant="TwoTone" color="currentColor" />,
  };
  return (
    <span className="flex size-8 items-center justify-center rounded-md bg-white/10 text-base">
      {icons[planId] ?? "📦"}
    </span>
  );
}

function FeatureCell({ value }: { value: PlanFeatureValue }) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (value === true) {
    return (
      <span className="flex justify-center">
        <RiCheckLine className="size-4 text-foreground" />
      </span>
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

function Pricing() {
  const [subscriptionType, setSubscriptionType] = useState<TPricing>("YEARLY");
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const isMonthly = subscriptionType === "MONTHLY";

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
            Choose a plan that&apos;s right for you
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Try our basic plan risk free for 30 days. Switch plans or cancel any
            time.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-lg border border-border bg-muted p-1 text-sm sm:mb-8">
          <button
            onClick={() => setSubscriptionType("YEARLY")}
            className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
              !isMonthly
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual pricing
          </button>
          <button
            onClick={() => setSubscriptionType("MONTHLY")}
            className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
              isMonthly
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly pricing
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-3">
          {PRICING_PAGE_PLANS.map((plan) => {
            const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div
                key={plan.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {plan.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <PlanIcon planId={plan.id} />
                </div>

                <div className="mb-5 flex items-end gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    <NumberFlow
                      value={Number(currencyFormatter.format(price))}
                      prefix="$"
                    />
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    per month
                  </span>
                </div>

                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="hidden rounded-xl border border-border md:block">
          <div className="grid grid-cols-[1fr_repeat(3,_140px)] border-b border-border px-5 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Features
            </span>
            {PRICING_PAGE_PLANS.map((plan) => (
              <span
                key={plan.id}
                className="text-center text-sm font-medium text-muted-foreground"
              >
                {plan.name}
              </span>
            ))}
          </div>
          {PRICING_FEATURE_GROUPS.map((group, gi) => (
            <div key={group.group}>
              <div className="bg-muted/40 px-5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </span>
              </div>

              {group.features.map((feature, fi) => (
                <div key={feature.label}>
                  <div className="grid grid-cols-[1fr_repeat(3,_140px)] items-center px-5 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      {feature.label}
                      {feature.tooltip && (
                        <RiInformationLine className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    {feature.values.map((val, vi) => (
                      <div key={vi} className="flex justify-center text-sm">
                        <FeatureCell value={val} />
                      </div>
                    ))}
                  </div>
                  {fi < group.features.length - 1 && (
                    <div className="mx-5 h-px bg-border" />
                  )}
                </div>
              ))}

              {gi < PRICING_FEATURE_GROUPS.length - 1 && (
                <div className="h-px bg-border" />
              )}
            </div>
          ))}
          <div className="h-px bg-border" />
          <div className="grid grid-cols-[1fr_repeat(3,_140px)] items-center px-5 py-4">
            <span />
            {PRICING_PAGE_PLANS.map((plan) => (
              <div key={plan.id} className="flex justify-center">
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  size="sm"
                  className="w-28"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border md:hidden">
          <div className="flex border-b border-border">
            {PRICING_PAGE_PLANS.map((plan, i) => (
              <button
                key={plan.id}
                onClick={() => setActivePlanIndex(i)}
                className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                  activePlanIndex === i
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {plan.name}
              </button>
            ))}
          </div>

          {PRICING_FEATURE_GROUPS.map((group, gi) => (
            <div key={group.group}>
              <div className="bg-muted/40 px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </span>
              </div>

              {group.features.map((feature, fi) => (
                <div key={feature.label}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      {feature.label}
                      {feature.tooltip && (
                        <RiInformationLine className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-sm">
                      <FeatureCell value={feature.values[activePlanIndex]} />
                    </div>
                  </div>
                  {fi < group.features.length - 1 && (
                    <div className="mx-4 h-px bg-border" />
                  )}
                </div>
              ))}

              {gi < PRICING_FEATURE_GROUPS.length - 1 && (
                <div className="h-px bg-border" />
              )}
            </div>
          ))}

          <div className="h-px bg-border" />
          <div className="px-4 py-4">
            <Button
              variant={
                PRICING_PAGE_PLANS[activePlanIndex].featured
                  ? "default"
                  : "outline"
              }
              size="lg"
              className="w-full"
            >
              {PRICING_PAGE_PLANS[activePlanIndex].cta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
