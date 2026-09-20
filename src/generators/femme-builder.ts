import { FEMME_TEMPLATES } from '../templates/femme-templates.js';
import { TildaHttpClient } from '../client/tilda-http-client.js';

export interface FemmeDeployResult {
  page_id: string;
  published_url: string;
  title: string;
  blocks_count: number;
}

/**
 * Builds Block 0: Base Head Dependencies Layer for Femme Sculpt
 */
export function buildFemmeBaseHead(): string {
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Manrope:wght@300;400;500;600;700&display=swap';

  return `
<!-- ========================================== -->
<!-- Femme Sculpt: Base Head & Typography Layer -->
<!-- ========================================== -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          serif: ['"Cormorant Garamond"', 'serif'],
          sans: ['"Manrope"', 'sans-serif'],
        },
        colors: {
          femme: {
            bg: '#F7F4EE',
            card: '#FFFFFF',
            sand: '#EFE9DF',
            text: '#1E1D1B',
            muted: '#6E6B65',
            accent: '#242320',
            terracotta: '#C25E38',
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
    --femme-bg: #F7F4EE;
    --femme-text: #1E1D1B;
    --femme-terracotta: #C25E38;
  }
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body, #allrecords {
    background-color: #F7F4EE !important;
    color: #1E1D1B !important;
    font-family: 'Manrope', sans-serif !important;
  }
  h1, h2, h3, .font-serif {
    font-family: 'Cormorant Garamond', serif !important;
  }
  /* Details Accordion Animation */
  details > summary::-webkit-details-marker {
    display: none;
  }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Femme Sculpt | Core & Abs",
  "description": "Авторский онлайн-курс осознанного пилатеса и укрепления глубоких мышц кора. 10 тренировок, 3 недели, персональный трекер.",
  "provider": {
    "@type": "Organization",
    "name": "Femme Sculpt Pilates Studio",
    "sameAs": "https://t.me/femmesculpt_bot"
  }
}
</script>
`.trim();
}

/**
 * Assembles all 14 screens into a single monolithic HTML document (for local preview)
 */
export function buildFemmeMonolithicHtml(): string {
  const head = buildFemmeBaseHead();
  const {
    header,
    hero,
    about,
    benefits,
    audience,
    metrics,
    syllabus,
    video,
    howItWorks,
    pricing,
    author,
    reviews,
    faq,
    finalCtaAndFooter,
  } = FEMME_TEMPLATES;

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Femme Sculpt — Осознанный пилатес, королевская осанка и сильный кор</title>
  <meta name="description" content="Онлайн-курс бережного пилатеса по 20–30 минут в день. Сильный кор, здоровая поясница и грациозная осанка без изнуряющего кардио.">
  ${head}
</head>
<body class="bg-[#F7F4EE] text-[#1E1D1B] overflow-x-hidden min-h-screen">
  ${header}
  <main>
    ${hero}
    ${about}
    ${benefits}
    ${audience}
    ${metrics}
    ${syllabus}
    ${video}
    ${howItWorks}
    ${pricing}
    ${author}
    ${reviews}
    ${faq}
    ${finalCtaAndFooter}
  </main>
</body>
</html>
`.trim();
}

/**
 * Returns the 15 T123 block payloads (Block 0 + 14 content sections) for Tilda
 */
export function getFemmeTildaBlocks(): { name: string; code: string }[] {
  return [
    { name: 'Base Head & Styles (Block 0)', code: buildFemmeBaseHead() },
    { name: '01. Header Navigation', code: FEMME_TEMPLATES.header },
    { name: '02. Hero Section', code: FEMME_TEMPLATES.hero },
    { name: '03. About Program', code: FEMME_TEMPLATES.about },
    { name: '04. Program Benefits', code: FEMME_TEMPLATES.benefits },
    { name: '05. Audience & Contrast', code: FEMME_TEMPLATES.audience },
    { name: '06. Course Metrics', code: FEMME_TEMPLATES.metrics },
    { name: '07. Workout Syllabus', code: FEMME_TEMPLATES.syllabus },
    { name: '08. Video Mockup', code: FEMME_TEMPLATES.video },
    { name: '09. How It Works', code: FEMME_TEMPLATES.howItWorks },
    { name: '10. Pricing Tiers', code: FEMME_TEMPLATES.pricing },
    { name: '11. About Author', code: FEMME_TEMPLATES.author },
    { name: '12. Reviews & Results', code: FEMME_TEMPLATES.reviews },
    { name: '13. FAQ Accordion', code: FEMME_TEMPLATES.faq },
    { name: '14. Final CTA & Footer', code: FEMME_TEMPLATES.finalCtaAndFooter },
  ];
}

/**
 * Deploys the full 14-screen Femme Sculpt landing page directly to a Tilda project
 */
export async function deployFemmeCourseLanding(
  client: TildaHttpClient,
  projectId: string,
  pageTitle = 'Femme Sculpt — Осознанный пилатес и сильный кор'
): Promise<FemmeDeployResult> {
  await client.init();
  await client.checkAuth();

  console.log(`[FemmeBuilder] Creating page "${pageTitle}" in project ${projectId}...`);
  const pageId = await client.createPage(projectId, pageTitle);

  try {
    await client.initSession(pageId);
    const blocks = getFemmeTildaBlocks();

    console.log(`[FemmeBuilder] Uploading ${blocks.length} blocks to page ${pageId}...`);
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      console.log(`  -> [${i + 1}/${blocks.length}] Adding block "${b.name}"...`);
      const recordId = await client.addBlock(pageId, '131'); // T123 HTML Embed
      await client.updateBlock(pageId, recordId, { code: b.code });
    }

    console.log(`[FemmeBuilder] Publishing page ${pageId}...`);
    const publishRes = await client.publishPage(pageId);

    const publishedUrl =
      publishRes?.publishedUrl ||
      `https://polish-clumsy-carp.tilda.ws/page${pageId}.html`;

    console.log(`[FemmeBuilder] Successfully deployed: ${publishedUrl}`);

    return {
      page_id: pageId,
      published_url: publishedUrl,
      title: pageTitle,
      blocks_count: blocks.length,
    };
  } catch (err) {
    console.error(`[FemmeBuilder] Deployment error on page ${pageId}, rolling back...`, err);
    await client.deletePage(pageId);
    throw err;
  }
}
