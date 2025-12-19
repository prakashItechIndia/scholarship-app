/**
 * Schema.org JSON-LD structured data generators
 */

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    contactType: string;
    email: string;
    telephone?: string;
  };
  sameAs?: string[];
}

/**
 * Generate Organization schema
 */
export const generateOrganizationSchema = (
  data: OrganizationSchema,
): Record<string, unknown> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: data.contactPoint.contactType,
        email: data.contactPoint.email,
        ...(data.contactPoint.telephone && {
          telephone: data.contactPoint.telephone,
        }),
      },
    }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
};

/**
 * Generate WebSite schema
 */
export const generateWebSiteSchema = (
  name: string,
  url: string,
): Record<string, unknown> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };
};

