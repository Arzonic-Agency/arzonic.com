import { Metadata } from "next";
import SolutionClientWrapper from "./SolutionClientWrapper";

const seoData: Record<string, { title: string; description: string }> = {
  "custom-websites": {
    title: "Custom Websites",
    description:
      "We design and develop fast, tailored websites – optimized for conversions, performance, and visual identity.",
  },
  "web-applications": {
    title: "Web Applications",
    description:
      "From dashboards to booking platforms – we build scalable, modern web apps tailored to your business needs.",
  },
  "3d-visualization": {
    title: "3D Visualization",
    description:
      "Bring your content to life with interactive 3D – perfect for presentations, product demos, and immersive websites.",
  },
  "design-animation": {
    title: "Design & Animation",
    description:
      "We craft modern, motion-enhanced digital designs that engage users and express brand identity.",
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
