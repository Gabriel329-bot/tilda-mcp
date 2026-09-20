import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { ROOT_DIR } from '../config.js';
import { TemplateEngine } from './template-engine.js';
import { MediaOrchestrator } from './media-orchestrator.js';
import { SeoOrchestrator } from './seo-orchestrator.js';
import { ThemeTokens, getThemeTokens } from '../templates/theme-tokens.js';
import { getPresetCss, StylePresetName } from '../styles/presets.js';

export interface PreviewLandingOptions {
  landingTitle?: string;
  title?: string;
  style_preset?: StylePresetName | string;
  custom_css?: string;
  outputPath?: string;
  sections: {
    header?: {
      logo_text: string;
      btn_text?: string;
      btn_href?: string;
      menu_items?: Array<{ title: string; href: string }>;
    };
    hero: any;
    marquee?: { items?: string[] };
    features: any;
    timeline?: any;
    metrics: any;
    calculator?: any;
    pricing?: any;
    testimonials?: {
      title: string;
      descr?: string;
      items: Array<{
        name: string;
        role?: string;
        text: string;
        rating?: number;
        avatar_url?: string;
      }>;
    };
    faq?: any;
    form?: any;
    cro?: any;
    footer?: any;
    custom_css?: string;
  };
}

export interface PreviewBuildResult {
  filePath: string;
  previewUrl: string;
  html: string;
  sectionsCount: number;
}

/**
 * Compiles a full studio landing page into a standalone monolithic HTML file
 * for instant browser preview without consuming Tilda API calls or quotas.
 */
export function buildLocalPreview(options: PreviewLandingOptions): PreviewBuildResult {
  const { sections } = options;
  const presetKey = (options.style_preset as StylePresetName) || 'minimal';
  const theme = getThemeTokens(presetKey);
  const presetCss = getPresetCss(presetKey as any);

  const effectiveTitle =
    options.landingTitle ||
    options.title ||
    sections.hero?.title ||
    'Landing Page Preview';
  const effectiveDescr =
    sections.hero?.descr || sections.hero?.subtitle || '';

  const media = new MediaOrchestrator();
  const heroBg =
    sections.hero?.backgroundUrl ||
    sections.hero?.bg_image_url ||
    media.resolveHeroImage(sections.hero?.niche || 'telecom');

  // 1. SEO Layer
  const seoJsonLd = SeoOrchestrator.generateJsonLd({
    title: effectiveTitle,
    descr: effectiveDescr,
    faq: sections.faq,
    pricing: sections.pricing,
  });

  const seoMeta = SeoOrchestrator.generateMetaTags({
    title: effectiveTitle,
    descr: effectiveDescr,
    image: heroBg,
    url: 'https://preview.local',
  });

  const sectionsHtml: string[] = [];

  // 2. Header (Sticky studio navbar)
  if (sections.header) {
    const defaultMenu = [
      { title: 'Преимущества', href: '#features' },
      { title: 'Цифры', href: '#metrics' },
      ...(sections.pricing ? [{ title: 'Цены', href: '#pricing' }] : []),
      ...(sections.testimonials ? [{ title: 'Отзывы', href: '#reviews' }] : []),
      ...(sections.faq ? [{ title: 'FAQ', href: '#faq' }] : []),
      { title: 'Контакты', href: '#form' },
    ];
    const menuItems =
      sections.header.menu_items && sections.header.menu_items.length > 0
        ? sections.header.menu_items
        : defaultMenu;

    const navLinks = menuItems
      .map(
        (m) =>
          `<a href="${m.href}" class="hover:text-[${theme.accent}] transition-colors duration-150">${m.title}</a>`
      )
      .join('\n');

    const headerHtml = `
<header class="sticky top-0 z-50 w-full backdrop-blur-md ${
      theme.isDark ? 'bg-[#0B0F17]/85 text-white border-white/10' : 'bg-white/85 text-slate-900 border-black/[0.06]'
    } border-b transition-all">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="#" class="font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">${sections.header.logo_text}</a>
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium ${
      theme.isDark ? 'text-slate-300' : 'text-slate-600'
    }">
      ${navLinks}
    </nav>
    <a href="${sections.header.btn_href || '#form'}" class="h-9 px-4 inline-flex items-center justify-center ${
      theme.radiusBtn
    } bg-[${theme.accent}] hover:bg-[${theme.accentHover}] text-white text-xs font-semibold shadow-sm transition-all">
      ${sections.header.btn_text || 'Связаться'}
    </a>
  </div>
</header>`.trim();

    sectionsHtml.push(headerHtml);
  }

  // 3. Hero Section
  sectionsHtml.push(TemplateEngine.renderHero(sections.hero, heroBg, theme));

  // 4. Marquee Section
  if (sections.marquee) {
    sectionsHtml.push(TemplateEngine.renderMarquee(sections.marquee.items, theme));
  }

  // 5. Bento Grid Features
  if (sections.features) {
    sectionsHtml.push(TemplateEngine.renderBento(sections.features, theme));
  }

  // 6. Timeline / How it works
  if (sections.timeline) {
    sectionsHtml.push(TemplateEngine.renderTimeline(sections.timeline, theme));
  }

  // 7. Metrics
  if (sections.metrics) {
    sectionsHtml.push(TemplateEngine.renderMetrics(sections.metrics, theme));
  }

  // 8. Calculator
  if (sections.calculator) {
    sectionsHtml.push(TemplateEngine.renderCalculator(sections.calculator, theme));
  }

  // 9. Pricing
  if (sections.pricing) {
    sectionsHtml.push(TemplateEngine.renderPricing(sections.pricing, theme));
  }

  // 10. Testimonials
  if (sections.testimonials) {
    const cards = sections.testimonials.items
      .map((t) => {
        const stars = t.rating ? '★'.repeat(Math.min(5, Math.max(1, Math.round(t.rating)))) : '★★★★★';
        return `
      <div class="p-6 ${theme.radiusCard} ${theme.bgCard} border ${theme.border} shadow-sm flex flex-col justify-between">
        <div>
          <div class="text-amber-400 text-sm mb-3 tracking-wider">${stars}</div>
          <p class="text-sm leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-600'} mb-6">"${t.text}"</p>
        </div>
        <div class="flex items-center gap-3 pt-4 border-t ${theme.border}">
          ${
            t.avatar_url
              ? `<img src="${t.avatar_url}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border ${theme.border}" />`
              : `<div class="w-10 h-10 rounded-full bg-[${theme.accent}]/10 text-[${theme.accent}] flex items-center justify-center font-bold text-sm">${t.name.charAt(0)}</div>`
          }
          <div>
            <div class="text-sm font-semibold ${theme.textPrimary}">${t.name}</div>
            ${t.role ? `<div class="text-xs ${theme.textSecondary}">${t.role}</div>` : ''}
          </div>
        </div>
      </div>`;
      })
      .join('\n');

    const testHtml = `
<section id="reviews" class="w-full py-24 ${theme.bgPage} ${theme.fontFamily} border-t ${theme.border}">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight ${theme.textPrimary} mb-4">${sections.testimonials.title}</h2>
      ${sections.testimonials.descr ? `<p class="text-base ${theme.textSecondary}">${sections.testimonials.descr}</p>` : ''}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${cards}
    </div>
  </div>
</section>`.trim();

    sectionsHtml.push(testHtml);
  }

  // 11. FAQ Accordion
  if (sections.faq) {
    sectionsHtml.push(TemplateEngine.renderFAQ(sections.faq, theme));
  }

  // 12. Contact / Lead Form
  if (sections.form) {
    sectionsHtml.push(
      TemplateEngine.renderContact(
        sections.form,
        sections.form.webhook_url,
        theme,
        sections.form.success_message
      )
    );
  }

  // 13. Footer
  if (sections.footer) {
    const projectName =
      sections.footer.title ||
      sections.header?.logo_text ||
      effectiveTitle;
    sectionsHtml.push(TemplateEngine.renderFooter(projectName, theme));
  }

  // 14. CRO Overlays
  sectionsHtml.push(TemplateEngine.renderCroOverlays(sections.cro, theme));

  // Custom CSS compilation
  const effectiveCss = [presetCss || '', options.custom_css || '', sections.custom_css || '']
    .filter(Boolean)
    .join('\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="ru" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${effectiveTitle}</title>
  ${seoMeta}
  ${seoJsonLd}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.fontImportUrl}" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/imask"></script>
  <style>
    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; }
    ${effectiveCss}
  </style>
</head>
<body class="${theme.bgPage} ${theme.fontFamily} antialiased selection:bg-[${theme.accent}] selection:text-white">
  ${sectionsHtml.join('\n\n')}
</body>
</html>`.trim();

  // Save to disk
  const targetPath = options.outputPath
    ? path.resolve(options.outputPath)
    : path.resolve(ROOT_DIR, 'preview', 'landing-preview.html');

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, fullHtml, 'utf-8');

  const previewUrl = pathToFileURL(targetPath).href;

  return {
    filePath: targetPath,
    previewUrl,
    html: fullHtml,
    sectionsCount: sectionsHtml.length,
  };
}
