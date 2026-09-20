/**
 * SEO & Schema.org Structured Data Generator for Tilda Landing Pages.
 * Emits JSON-LD (Organization, FAQPage, Product/Offers) and OpenGraph meta tags.
 */

export interface SeoData {
  title: string;
  descr: string;
  image?: string;
  url?: string;
  faq?: {
    items: Array<{ title?: string; question?: string; descr?: string; answer?: string }>;
  };
  pricing?: {
    plans: Array<{ name: string; price?: string }>;
  };
}

export class SeoOrchestrator {
  /**
   * Generates Schema.org structured data in JSON-LD format.
   */
  static generateJsonLd(data: { title: string; descr: string; faq?: any; pricing?: any }): string {
    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.title,
        description: data.descr,
      },
    ];

    if (data.faq && Array.isArray(data.faq.items) && data.faq.items.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faq.items.map((item: any) => ({
          '@type': 'Question',
          name: item.title || item.question || '',
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.descr || item.answer || '',
          },
        })),
      });
    }

    if (data.pricing && Array.isArray(data.pricing.plans) && data.pricing.plans.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.title,
        description: data.descr,
        offers: data.pricing.plans.map((p: any) => ({
          '@type': 'Offer',
          name: p.name || 'Тариф',
          price: p.price ? p.price.replace(/[^\d]/g, '') : '0',
          priceCurrency: 'RUB',
        })),
      });
    }

    return `<script type="application/ld+json">\n${JSON.stringify(schemas, null, 2)}\n</script>`;
  }

  /**
   * Generates OpenGraph and Twitter Card meta tags.
   */
  static generateMetaTags(data: { title: string; descr: string; image?: string; url?: string }): string {
    const tags = [
      `<meta property="og:title" content="${escapeAttr(data.title)}" />`,
      `<meta property="og:description" content="${escapeAttr(data.descr)}" />`,
      data.image ? `<meta property="og:image" content="${escapeAttr(data.image)}" />` : '',
      data.url ? `<meta property="og:url" content="${escapeAttr(data.url)}" />` : '',
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeAttr(data.title)}" />`,
      `<meta name="twitter:description" content="${escapeAttr(data.descr)}" />`,
      data.image ? `<meta name="twitter:image" content="${escapeAttr(data.image)}" />` : '',
    ].filter(Boolean);
    return tags.join('\n');
  }
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
