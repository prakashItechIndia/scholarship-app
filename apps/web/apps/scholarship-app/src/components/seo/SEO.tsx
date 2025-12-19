import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  twitterHandle?: string;
  locale?: string;
  schema?: Record<string, unknown>;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

const defaultSEO = {
  title: 'iCaptur SSO - Single Sign-On Authentication',
  description:
    'Secure single sign-on authentication for iCaptur products. Sign in to access your iCaptur account and manage your subscriptions.',
  keywords:
    'iCaptur, SSO, single sign-on, authentication, login, security, access management',
  siteName: 'iCaptur SSO',
  twitterHandle: '@icaptur',
  locale: 'en_US',
  type: 'website' as const,
  image: '/og-image.png',
};

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = defaultSEO.siteName,
  twitterHandle = defaultSEO.twitterHandle,
  locale = defaultSEO.locale,
  schema,
  noindex = false,
  nofollow = false,
  canonical,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | ${defaultSEO.siteName}`
    : defaultSEO.title;
  const metaDescription = description ?? defaultSEO.description;
  const metaKeywords = keywords ?? defaultSEO.keywords;
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://scholarship.icaptur.ai';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}${defaultSEO.image}`;
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${baseUrl}${canonical}`
    : fullUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="author" content="iCaptur" />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      {twitterHandle && (
        <meta name="twitter:site" content={twitterHandle} />
      )}

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#0f6cbd" />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

