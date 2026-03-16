export type PlanFeatureValue = boolean | string | null;

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  cta: string;
  featured?: boolean;
};

export type FeatureRow = {
  label: string;
  tooltip?: string;
  values: [PlanFeatureValue, PlanFeatureValue, PlanFeatureValue];
};

export type FeatureGroup = {
  group: string;
  features: FeatureRow[];
};

export const PRICING_PAGE_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free trial",
    description: "Best for small teams and freelancers.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Start free trial",
  },
  {
    id: "business",
    name: "Business plan",
    description: "Best for growing teams.",
    monthlyPrice: 25,
    yearlyPrice: 20,
    cta: "Get started",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise plan",
    description: "Best for large organizations.",
    monthlyPrice: 50,
    yearlyPrice: 40,
    cta: "Get started",
  },
];

export const PRICING_FEATURE_GROUPS: FeatureGroup[] = [
  {
    group: "Basic features",
    features: [
      {
        label: "Basic features",
        tooltip: "Core platform features",
        values: [true, true, true],
      },
      {
        label: "Users",
        tooltip: "Number of team members",
        values: ["10", "20", "Unlimited"],
      },
      {
        label: "Individual data",
        tooltip: "Storage per user",
        values: ["20GB", "40GB", "Unlimited"],
      },
      {
        label: "Support",
        tooltip: "Customer support access",
        values: [true, true, true],
      },
      {
        label: "Automated workflows",
        tooltip: "Workflow automation tools",
        values: [null, true, true],
      },
      {
        label: "200+ integrations",
        tooltip: "Third-party integrations",
        values: [null, true, true],
      },
    ],
  },
  {
    group: "Reporting and analytics",
    features: [
      {
        label: "Analytics",
        tooltip: "Data analytics tools",
        values: ["Basic", "Advanced", "Advanced"],
      },
      {
        label: "Export reports",
        tooltip: "Export data to CSV/PDF",
        values: [true, true, true],
      },
      {
        label: "Scheduled reports",
        tooltip: "Automated report delivery",
        values: [true, true, true],
      },
      {
        label: "API accesss",
        tooltip: "REST API access",
        values: [null, true, true],
      },
      {
        label: "Advanced reports",
        tooltip: "Custom report builder",
        values: [null, true, true],
      },
      {
        label: "Saved reports",
        tooltip: "Save and reuse reports",
        values: [null, true, true],
      },
      {
        label: "Customer properties",
        tooltip: "Custom customer attributes",
        values: [null, null, true],
      },
      {
        label: "Custom fields",
        tooltip: "Custom data fields",
        values: [null, null, true],
      },
    ],
  },
  {
    group: "User access",
    features: [
      {
        label: "SSO/SAML authentication",
        tooltip: "Single sign-on support",
        values: [true, true, true],
      },
      {
        label: "Advanced permissions",
        tooltip: "Role-based access control",
        values: [null, true, true],
      },
      {
        label: "Audit log",
        tooltip: "Activity audit trail",
        values: [null, null, true],
      },
      {
        label: "Data history",
        tooltip: "Historical data access",
        values: [null, null, true],
      },
    ],
  },
];
