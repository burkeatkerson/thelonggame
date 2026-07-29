/**
 * The four pillars — the site's primary axis, mirroring the book
 * ("The Long Game: the 20-year roadmap to building wealth through scalable
 * real estate investing strategies").
 *
 * Mindset is the operating system. Capital strategies turn effort into
 * chunks of cash. Cashflow strategies turn capital into income streams.
 * Wealth strategies turn income and reputation into scalable, generational
 * holdings. Each earlier pillar exists to fund the next.
 *
 * Every section is declared up front, sized for years of content — a
 * section with no articles yet shows as "being built", so the whole map is
 * visible from day one.
 */

export type PillarSlug = "mindset" | "capital" | "cashflow" | "wealth";

export type Section = {
  slug: string;
  name: string;
  dek: string;
};

export type Pillar = {
  slug: PillarSlug;
  name: string;
  short: string;
  /** the one-line framing on hubs and the home page */
  tagline: string;
  dek: string;
  /** which years of the roadmap this pillar dominates */
  years: string;
  order: number;
  sections: Section[];
};

export const PILLARS: Pillar[] = [
  {
    slug: "mindset",
    name: "Building Mindset",
    short: "Mindset",
    tagline: "The operating system",
    dek: "The twenty-year frame, the psychology of holding, and the first principles of how deals actually make money. Every strategy on this site fails in the hands of an investor who skips this pillar.",
    years: "Always on — heaviest Y1–2",
    order: 1,
    sections: [
      {
        slug: "long-game-thinking",
        name: "Long-game thinking",
        dek: "Why twenty years is the only edge nobody is competing for, and how to hold a position that long in a this-quarter world.",
      },
      {
        slug: "first-principles",
        name: "First principles",
        dek: "The five ways a property pays you — cashflow, appreciation, amortization, tax, leverage — and how every strategy is a different mix of them.",
      },
      {
        slug: "investor-psychology",
        name: "Investor psychology",
        dek: "Fear at the closing table, greed at the top of the cycle, boredom in the middle years. The behavioral failure modes and their defenses.",
      },
      {
        slug: "goals-and-thesis",
        name: "Goals & your thesis",
        dek: "Writing the one-page twenty-year thesis, setting stage gates, and knowing which game you are playing at any moment.",
      },
      {
        slug: "cycles-and-risk",
        name: "Market cycles & risk",
        dek: "Rates, cycles, leverage discipline and reserves — surviving the three crashes you will invest through.",
      },
      {
        slug: "education-and-network",
        name: "Education & network",
        dek: "Mentors, partners, lenders and your first team. The people-compounding that precedes the money-compounding.",
      },
    ],
  },
  {
    slug: "capital",
    name: "Building Capital",
    short: "Capital",
    tagline: "Turn effort into chunks of cash",
    dek: "Active strategies that convert work, skill and nerve into lump sums: flips, wholesaling, value-add recycling, development. High effort, taxed hard, capped by your hours — and the fastest honest way to build a base worth deploying.",
    years: "Heaviest Y1–5",
    order: 2,
    sections: [
      {
        slug: "earning-your-first-capital",
        name: "Earning your first capital",
        dek: "W-2 optimization, side income, savings rate and clean bank statements — the unglamorous runway every strategy below stands on.",
      },
      {
        slug: "fix-and-flip",
        name: "Fix & flip",
        dek: "Buying broken, renovating on a budget, selling at retail. Deal analysis, rehab management, and why flip profits are fuel, not the destination.",
      },
      {
        slug: "wholesaling",
        name: "Wholesaling",
        dek: "Finding deals other investors will pay for. Marketing, negotiation, assignment contracts — capital built from hustle instead of savings.",
      },
      {
        slug: "brrrr-and-value-add",
        name: "BRRRR & value-add",
        dek: "Buy, rehab, rent, refinance, repeat — recycling one pile of capital through multiple doors without selling anything.",
      },
      {
        slug: "new-construction",
        name: "New construction & development",
        dek: "Infill builds, small development, land. Bigger checks, longer timelines, and the leap from renovator to developer.",
      },
      {
        slug: "creative-acquisitions",
        name: "Creative acquisitions",
        dek: "Seller financing, subject-to, options and lease-options — controlling property with structure instead of cash.",
      },
    ],
  },
  {
    slug: "cashflow",
    name: "Building Cashflow",
    short: "Cashflow",
    tagline: "Turn capital into income streams",
    dek: "Strategies that convert a capital base into monthly income that arrives whether you worked or not: rentals, small multifamily, short-term stays, lending. The bridge between working for money and money working.",
    years: "Heaviest Y3–10",
    order: 3,
    sections: [
      {
        slug: "house-hacking",
        name: "House hacking",
        dek: "Living in the deal — the lowest-risk first door there is, and the financing order that keeps your next two purchases possible.",
      },
      {
        slug: "single-family-rentals",
        name: "Single-family rentals",
        dek: "The boring backbone: buying, underwriting and holding SFRs that clear their debt service at honest numbers.",
      },
      {
        slug: "small-multifamily",
        name: "Small multifamily",
        dek: "Duplex to fourplex and up to the five-unit line where everything changes: lending, insurance, and your weekends.",
      },
      {
        slug: "short-and-mid-term-rentals",
        name: "Short & mid-term rentals",
        dek: "STR and MTR as an income multiplier — hospitality operations, regulation risk, and when the extra yield stops being worth the extra job.",
      },
      {
        slug: "lending-and-notes",
        name: "Lending & notes",
        dek: "Being the bank: hard money lending, note investing, and earning real estate returns without owning a toilet.",
      },
      {
        slug: "operations",
        name: "Operations & management",
        dek: "Property managers, systems, and the written numbers that turn a pile of doors into a business that runs without heroics.",
      },
    ],
  },
  {
    slug: "wealth",
    name: "Building Wealth",
    short: "Wealth",
    tagline: "Make it scalable and generational",
    dek: "The strategies the first three pillars exist to fund: other people's capital, commercial assets, the tax architecture of holding, and a portfolio that transfers. This is where cashflow becomes life-changing, generational wealth.",
    years: "Heaviest Y10–20",
    order: 4,
    sections: [
      {
        slug: "raising-capital",
        name: "Raising capital & syndication",
        dek: "From partnerships to your first LP raise: securities rules, waterfalls, investor reporting, and reputation as the asset.",
      },
      {
        slug: "large-multifamily",
        name: "Large multifamily",
        dek: "Apartment communities bought on cap rate and operated by teams — where scale starts working for you instead of on you.",
      },
      {
        slug: "commercial",
        name: "Commercial",
        dek: "Office, retail, industrial and triple-net: trading tenant turnover for lease term, and underwriting credit instead of carpets.",
      },
      {
        slug: "tax-strategy",
        name: "Tax strategy",
        dek: "Depreciation, cost segregation, 1031 chains and the step-up in basis — shelter while you hold, defer when you trade, step up when you transfer.",
      },
      {
        slug: "portfolio-architecture",
        name: "Portfolio architecture",
        dek: "Entities, debt structure at scale, insurance and asset protection — engineering the machine so no single failure reaches the whole.",
      },
      {
        slug: "legacy",
        name: "Legacy & transfer",
        dek: "Estate structure, heirs who understand the machine, and deciding what never gets sold. The point of the whole sequence.",
      },
    ],
  },
];

export function pillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

export function isPillarSlug(value: string): value is PillarSlug {
  return PILLARS.some((p) => p.slug === value);
}

export function sectionOf(pillar: PillarSlug, sectionSlug: string): Section | undefined {
  return pillarBySlug(pillar)?.sections.find((s) => s.slug === sectionSlug);
}
