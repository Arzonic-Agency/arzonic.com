// Eksempel på hvordan du bruger flersproget SEO på en specifik side

import { NextSeo } from "next-seo";
import { useSeo } from "@/lib/hooks/useSeo";
import { useTranslation } from "react-i18next";

export default function ExamplePage() {
const { t } = useTranslation();

// Brug custom SEO for denne specifikke side
const seoConfig = useSeo({
title: t("about.title"), // Eksempel: "Om Os"
description: t("about.description"), // Eksempel: "Lær mere om vores team..."
keywords: t("about.keywords") // Eksempel: "team, erfaring, historie"
});

return (
<>
<NextSeo {...seoConfig} />
<div>
<h1>{t("about.title")}</h1>
{/_ Resten af din side content _/}
</div>
</>
);
}

// Alternativt kan du også bruge det direkte i layout komponenten:
// const seoConfig = useSeo();
// return <DefaultSeo {...seoConfig} />;
