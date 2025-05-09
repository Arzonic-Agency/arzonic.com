export const countries = {
  denmark: { name: "Denmark" },
  sweden: { name: "Sweden" },
  norway: { name: "Norway" },
  finland: { name: "Finland" },
  germany: { name: "Germany" },
  netherlands: { name: "Netherlands" },
  belgium: { name: "Belgium" },
  france: { name: "France" },
  spain: { name: "Spain" },
  italy: { name: "Italy" },
  austria: { name: "Austria" },
  ireland: { name: "Ireland" },
  portugal: { name: "Portugal" },
  switzerland: { name: "Switzerland" },
  estonia: { name: "Estonia" },
  latvia: { name: "Latvia" },
  lithuania: { name: "Lithuania" },
  czechia: { name: "Czech Republic" },
  hungary: { name: "Hungary" },
  poland: { name: "Poland" },
} as const;

export type CountryKey = keyof typeof countries;
export type ExtendedCountryKey = CountryKey | "default";

const baseSEO = {
  "custom-websites": {
    title: "Custom Websites for Modern Brands",
    description:
      "We build lightning-fast, modern websites tailored to your market.",
  },
  "web-applications": {
    title: "Web Applications That Scale",
    description:
      "Custom web apps focused on performance, UX and business growth.",
  },
  "3d-visualization": {
    title: "High-End 3D Visualization",
    description:
      "Architectural renders and product visuals that bring your ideas to life.",
  },
  "design-animation": {
    title: "Design & Animation That Captivates",
    description:
      "We craft visuals and motion graphics that engage and elevate your brand.",
  },
} as const;

export const solutionSEO: {
  [slug: string]: {
    [country in ExtendedCountryKey]: {
      title: string;
      description: string;
    };
  };
} = Object.fromEntries(
  Object.entries(baseSEO).map(([slug, seo]) => {
    const countryEntries = Object.entries(countries).map(
      ([countryKey, { name }]) => [
        countryKey,
        {
          title: `${seo.title} in ${name} | Arzonic`,
          description: `${seo.description} Available now in ${name}.`,
        },
      ]
    );

    return [
      slug,
      {
        default: {
          title: `${seo.title} | Arzonic`,
          description: seo.description,
        },
        ...Object.fromEntries(countryEntries),
      },
    ];
  })
);
