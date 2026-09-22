import { CLUBHOUSE_TEMPLATES } from '../templates/clubhouse-templates.js';
import { TildaHttpClient } from '../client/tilda-http-client.js';

export interface ClubhouseDeployResult {
  page_id: string;
  published_url: string;
  title: string;
  blocks_count: number;
}

/**
 * Builds Block 0: Base Head, Tailwind Configuration, Google Fonts, and Schema.org Layer
 */
export function buildClubhouseBaseHead(): string {
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';

  return `
<!-- ======================================================= -->
<!-- Clubhouse Monograph: Base Head, Fonts & Script Foundation -->
<!-- ======================================================= -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          serif: ['"Cormorant Garamond"', 'serif'],
          sans: ['"Manrope"', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'monospace'],
        },
        colors: {
          ch: {
            bg: '#F7F5F0',
            card: '#FFFFFF',
            bronze: '#8E734E',
            bronzeDark: '#77603F',
            charcoal: '#1A1816',
            quartz: '#62605B',
            line: 'rgba(26, 24, 22, 0.07)',
          }
        }
      }
    }
  }
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontUrl}" rel="stylesheet">
<style>
  :root {
    --ch-bg: #F7F5F0;
    --ch-text: #1A1816;
    --ch-bronze: #8E734E;
    --ch-quartz: #62605B;
  }
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body, #allrecords {
    background-color: #F7F5F0 !important;
    color: #1A1816 !important;
    font-family: 'Manrope', sans-serif !important;
  }
  h1, h2, h3, .font-serif {
    font-family: 'Cormorant Garamond', serif !important;
  }
  /* Custom Range Slider Thumb */
  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #8E734E;
    cursor: pointer;
    border: 2px solid #FFFFFF;
    box-shadow: 0 1px 4px rgba(26, 24, 22, 0.25);
    margin-top: -6px;
  }
  input[type=range]::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #8E734E;
    cursor: pointer;
    border: 2px solid #FFFFFF;
    box-shadow: 0 1px 4px rgba(26, 24, 22, 0.25);
  }
  /* Native Details Accordion Clean Arrow */
  details > summary::-webkit-details-marker {
    display: none;
  }
  details > summary {
    list-style: none;
  }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  "name": "Клубный дом «Большая Полянка, 14»",
  "description": "Архитектурная монография клубного дома на 17 резиденций, пентхаус с террасой, частную галерею и 10 сити-боксов на Большой Полянке в ЦАО Москвы.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Большая Полянка, 14",
    "addressLocality": "Москва",
    "postalCode": "119180",
    "addressCountry": "RU"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Консьерж-сервис 24/7",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Закрытый двор-сад с ландшафтным дизайном",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Каминная зона и библиотека в лобби",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Глубокая очистка воды до питьевого стандарта",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Подземный паркинг и сити-боксы",
      "value": true
    }
  ],
  "numberOfAccommodationUnits": 28,
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "RUB",
    "lowPrice": "4200000",
    "highPrice": "245000000",
    "offerCount": 28
  }
}
</script>
<script>
// Safe early reservation bridge
window.openLotBooking = window.openLotBooking || function(lotId, price) {
  var lotInput = document.getElementById('form-selected-lot');
  var priceInput = document.getElementById('form-lot-price');
  var banner = document.getElementById('lot-selected-banner');
  var label = document.getElementById('selected-lot-label');
  
  if (lotInput) lotInput.value = lotId;
  if (priceInput) priceInput.value = price;
  if (banner && label) {
    label.innerText = lotId + (price ? ' (' + price + ')' : '');
    banner.classList.remove('hidden');
  }

  var bookingSection = document.getElementById('booking-modal');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
`.trim();
}

/**
 * Assembles all 14 screens into a single monolithic HTML document (for local preview and QA)
 */
export function buildClubhouseMonolithicHtml(): string {
  const head = buildClubhouseBaseHead();
  const {
    header,
    hero,
    manifesto,
    materials,
    catalog,
    floorPlans,
    lobby,
    location,
    chronicle,
    finance,
    booklet,
    docs,
    developer,
    finalAndFooter,
  } = CLUBHOUSE_TEMPLATES;

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Большая Полянка, 14 — Клубный дом на 17 резиденций</title>
  <meta name="description" content="Архитектурная монография клубного дома на 17 резиденций, пентхаус с видовой террасой, частную галерею и 10 сити-боксов на Большой Полянке в ЦАО Москвы.">
  ${head}
</head>
<body class="bg-[#F7F5F0] text-[#1A1816] overflow-x-hidden min-h-screen">
  ${header}
  <main>
    ${hero}
    ${manifesto}
    ${materials}
    ${catalog}
    ${floorPlans}
    ${lobby}
    ${location}
    ${chronicle}
    ${finance}
    ${booklet}
    ${docs}
    ${developer}
    ${finalAndFooter}
  </main>
</body>
</html>
`.trim();
}

/**
 * Returns the 15 T123 block payloads (Block 0 + 14 content sections) for Tilda
 */
export function getClubhouseTildaBlocks(): { name: string; code: string }[] {
  return [
    { name: 'Base Head & Styles (Block 0)', code: buildClubhouseBaseHead() },
    { name: '01. Architectural Header', code: CLUBHOUSE_TEMPLATES.header },
    { name: '02. Hero & Facade Switcher', code: CLUBHOUSE_TEMPLATES.hero },
    { name: '03. Privacy Manifesto', code: CLUBHOUSE_TEMPLATES.manifesto },
    { name: '04. Materials & Engineering', code: CLUBHOUSE_TEMPLATES.materials },
    { name: '05. Interactive 28-Lot Catalog', code: CLUBHOUSE_TEMPLATES.catalog },
    { name: '06. Floor-by-Floor Cross-Sections', code: CLUBHOUSE_TEMPLATES.floorPlans },
    { name: '07. Lobby & Courtyard Garden', code: CLUBHOUSE_TEMPLATES.lobby },
    { name: '08. Monochromatic Location Map', code: CLUBHOUSE_TEMPLATES.location },
    { name: '09. Construction Chronicle', code: CLUBHOUSE_TEMPLATES.chronicle },
    { name: '10. Mortgage Calculator & Scenarios', code: CLUBHOUSE_TEMPLATES.finance },
    { name: '11. Architectural Monograph Booklet', code: CLUBHOUSE_TEMPLATES.booklet },
    { name: '12. Legal Documentation 214-FZ', code: CLUBHOUSE_TEMPLATES.docs },
    { name: '13. About Developer', code: CLUBHOUSE_TEMPLATES.developer },
    { name: '14. Booking Form & Legal Footer', code: CLUBHOUSE_TEMPLATES.finalAndFooter },
  ];
}

/**
 * Deploys the complete 14-screen Clubhouse landing page directly to a Tilda project
 */
export async function deployClubhouseLanding(
  client: TildaHttpClient,
  projectId: string,
  pageTitle = 'Большая Полянка, 14 — Клубный дом на 17 резиденций'
): Promise<ClubhouseDeployResult> {
  await client.init();
  await client.checkAuth();

  console.log(`[ClubhouseBuilder] Creating page "${pageTitle}" in project ${projectId}...`);
  const pageId = await client.createPage(projectId, pageTitle);

  try {
    await client.initSession(pageId);
    const blocks = getClubhouseTildaBlocks();

    console.log(`[ClubhouseBuilder] Uploading ${blocks.length} T123 blocks to page ${pageId}...`);
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      console.log(`  -> [${i + 1}/${blocks.length}] Adding block "${b.name}"...`);
      const recordId = await client.addBlock(pageId, '131'); // T123 HTML Embed
      await client.updateBlock(pageId, recordId, { code: b.code });
      // Minor pause to ensure Tilda session stability
      await new Promise((res) => setTimeout(res, 200));
    }

    console.log(`[ClubhouseBuilder] Publishing page ${pageId}...`);
    const publishRes = await client.publishPage(pageId);

    const publishedUrl =
      publishRes?.publishedUrl ||
      `https://polish-clumsy-carp.tilda.ws/page${pageId}.html`;

    console.log(`[ClubhouseBuilder] Successfully deployed: ${publishedUrl}`);

    return {
      page_id: pageId,
      published_url: publishedUrl,
      title: pageTitle,
      blocks_count: blocks.length,
    };
  } catch (err) {
    console.error(`[ClubhouseBuilder] Deployment error on page ${pageId}, rolling back...`, err);
    await client.deletePage(pageId);
    throw err;
  }
}
