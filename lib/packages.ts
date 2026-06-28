export interface Package {
  name: string;
  price: string;
  blurb: string;
  features: string[];
}

export const weddingPackages: Package[] = [
  {
    name: "Half day",
    price: "₹45,000",
    blurb: "Ceremony and portraits.",
    features: ["Up to 5 hours", "1 photographer", "150+ edited images", "Online gallery"],
  },
  {
    name: "Full day",
    price: "₹85,000",
    blurb: "Getting ready to reception.",
    features: ["Up to 10 hours", "2 photographers", "400+ edited images", "Online gallery", "Highlight album"],
  },
  {
    name: "The whole celebration",
    price: "₹1,40,000",
    blurb: "Multi-event coverage.",
    features: ["2 days", "2–3 photographers", "700+ edited images", "Premium album", "Print credit"],
  },
];

export const babyShowerPackages: Package[] = [
  {
    name: "The gathering",
    price: "₹18,000",
    blurb: "The essentials, beautifully kept.",
    features: ["Up to 2 hours", "1 photographer", "80+ edited images", "Online gallery"],
  },
  {
    name: "The celebration",
    price: "₹32,000",
    blurb: "Fuller coverage with details.",
    features: ["Up to 4 hours", "1 photographer", "180+ edited images", "Online gallery", "Mini album"],
  },
];
