import { Helmet } from "react-helmet-async";
import { useLanguage } from "../contexts/LanguageContext";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "Vibe flow";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
const DEFAULT_OG_IMAGE = "/og-image.png";

const LANGUAGES = ["pt-BR", "en-US", "es-ES"] as const;

export default function Seo({ title, description, path = "", image, type = "website", jsonLd }: SeoProps) {
  const { language } = useLanguage();
  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const fullTitle = `${title} | ${SITE_NAME}`;

  const schemaOrg = jsonLd || {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Orquestração inteligente de agentes de IA autônomos para transformar workflows empresariais.",
    url: BASE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {LANGUAGES.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={`${BASE_URL}/${lang}${path}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${path}`} />

      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
    </Helmet>
  );
}
