import { Metadata } from "next";
import SolutionClientWrapper from "./SolutionClientWrapper";

const seoData: Record<string, { title: string; description: string }> = {
  "web-applications": {
    title: "Web Applications",
    description:
      "We design and build modern, scalable web applications – from dashboards to custom systems, focused on performance and usability.",
  },
  "design-ux": {
    title: "Design & UX",
    description:
      "User-centered design and UX that combines clarity, aesthetics, and interaction to create intuitive digital experiences.",
  },
  "3d-visualization": {
    title: "3D Visualization",
    description:
      "Interactive 3D experiences for products, presentations, and digital platforms – designed to engage and impress.",
  },
  "systems-integrations": {
    title: "Systems & Integrations",
    description:
      "Seamless integration of diverse systems and technologies to streamline operations and enhance functionality.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!seoData[slug]) {
    return {
      title: "Solution | Arzonic",
      description: "Discover our tailored digital solutions.",
    };
  }

  return {
    title: seoData[slug].title,
    description: seoData[slug].description,
  };
}

export default function Page() {
  return <SolutionClientWrapper />;
}
