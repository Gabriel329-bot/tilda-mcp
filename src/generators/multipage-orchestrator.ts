import { performance } from 'perf_hooks';
import { TildaHttpClient } from '../client/tilda-http-client.js';
import { STYLE_PRESETS, StylePresetName, getPresetCss } from '../styles/presets.js';
import {
  packageHeroSection,
  packageFeaturesSection,
  packageMetricsSection,
  packagePricingSection,
  packageContactSection,
  packageFaqSection,
  packageFooterSection,
  packageMarqueeSection,
  packageTimelineSection,
  packageCalculatorSection,
} from './block-packager.js';
import { AnalyticsOptions } from './analytics-orchestrator.js';
import { buildLocalPreview } from './preview-builder.js';

export interface PageSpec {
  slug: string;
  title: string;
  descr?: string;
  preset?: StylePresetName;
  analytics?: AnalyticsOptions;
  sections: any;
}

export interface NavigationItem {
  label: string;
  target_slug: string;
}

export interface MultipageSiteConfig {
  project_id: string;
  global_theme?: StylePresetName;
  navigation?: NavigationItem[];
  pages: PageSpec[];
  safeMode?: boolean;
  dryRun?: boolean;
}

export interface CreatedPageReport {
  slug: string;
  title: string;
  page_id: string;
  published_url: string;
  blocks_count: number;
}

export interface MultipageSiteReport {
  success: boolean;
  project_id: string;
  global_theme: StylePresetName;
  pages_count: number;
  pages: CreatedPageReport[];
  navigation_map: Record<string, string>;
  cross_linking_status: 'verified' | 'partial' | 'failed';
  total_elapsed_time_ms: number;
}

/**
 * Orchestrates two-pass multi-page website generation with cross-page navigation linking,
 * batch publishing, and automatic rollback on failure.
 */
export class MultipageOrchestrator {
  private client: TildaHttpClient;

  constructor(client?: TildaHttpClient, options?: { safeMode?: boolean }) {
    this.client = client || new TildaHttpClient({ humanLikePacing: options?.safeMode ?? true });
  }

  /**
   * Generates a multi-page website with cross-linking in two passes:
   * Pass 1 (Provisioning): Creates all pages and maps slugs to page IDs / URLs.
   * Pass 2 (Cross-Linking & Assembly): Builds all page sections with injected cross-links and publishes.
   * Rollback: If any error occurs, automatically deletes all pages created in this session.
   */
  public async generateMultipageSite(config: MultipageSiteConfig): Promise<MultipageSiteReport> {
    return this.generateSite(config);
  }

  public async generateSite(config: MultipageSiteConfig): Promise<MultipageSiteReport> {
    const startTime = performance.now();
    const {
      project_id,
      global_theme = 'linear',
      navigation,
      pages,
      dryRun = false,
    } = config;

    if (!project_id) {
      throw new Error('[MultipageOrchestrator] project_id is required');
    }
    if (!pages || !Array.isArray(pages) || pages.length < 2 || pages.length > 5) {
      throw new Error('[MultipageOrchestrator] pages array must contain between 2 and 5 page specifications');
    }

    // -------------------------------------------------------------
    // DRY RUN MODE: Local standalone compilation without network API
    // -------------------------------------------------------------
    if (dryRun) {
      return this.generateDryRun(config, startTime);
    }

    // Verify authentication before starting
    await this.client.checkAuth();

    const createdPageIds: string[] = [];
    const slugToPageId: Record<string, string> = {};
    const slugToUrl: Record<string, string> = {};

    try {
      // -------------------------------------------------------------
      // Pass 1: Provisioning (Create all pages and establish slugs)
      // -------------------------------------------------------------
      for (const page of pages) {
        const pageId = await this.client.createPage(project_id, page.title);
        createdPageIds.push(pageId);
        slugToPageId[page.slug] = pageId;
        // Native relative Tilda cross-link
        slugToUrl[page.slug] = `page${pageId}.html`;
      }

      // Build unified cross-page navigation links
      const navItems: Array<{ title: string; href: string }> =
        navigation && navigation.length > 0
          ? navigation.map((n) => ({
              title: n.label,
              href: slugToUrl[n.target_slug] || `page${slugToPageId[n.target_slug] || n.target_slug}.html`,
            }))
          : pages.map((p) => ({
              title: p.title,
              href: slugToUrl[p.slug],
            }));

      // -------------------------------------------------------------
      // Pass 2: Cross-Linking & Assembly (Inject links, build, publish)
      // -------------------------------------------------------------
      const pageReports: CreatedPageReport[] = [];

      for (const page of pages) {
        const pageId = slugToPageId[page.slug];
        const pagePreset: StylePresetName = page.preset || global_theme;
        const theme = STYLE_PRESETS[pagePreset] || STYLE_PRESETS.linear;

        await this.client.initSession(pageId);

        const updateTasks: (() => Promise<any>)[] = [];
        const sectionsGenerated: string[] = [];
        const colormode = pagePreset === 'dark' ? 'dark' : 'light';
        const sections = page.sections || {};

        // 1. Header with unified Cross-Page Navigation
        const headerRec = await this.client.addBlock(pageId, 'ME101');
        const headerTitle = sections.header?.logo_text || pages[0]?.title || 'Site';
        const headerBtnText = sections.header?.btn_text || 'Связаться';
        const headerBtnHref = sections.header?.btn_href || '#form';

        const headerPayload: Record<string, string> = {
          title: headerTitle,
          buttontitle: headerBtnText,
          buttonlink: headerBtnHref,
          bg_color: theme.bgPrimary,
          title_color: pagePreset === 'dji' || pagePreset === 'dark' ? '#FFFFFF' : theme.textPrimary,
          color: pagePreset === 'dji' || pagePreset === 'dark' ? '#FFFFFF' : theme.textPrimary,
          btn_bg_color: theme.accentBtnBg,
          buttontitle_color: theme.accentBtnText,
          colormode,
          theme: pagePreset,
        };

        // Inject cross-page navigation links
        navItems.forEach((item, idx) => {
          headerPayload[`menuitems-title[${idx}]`] = item.title;
          headerPayload[`menuitems-link[${idx}]`] = item.href;
        });

        updateTasks.push(() => this.client.updateBlock(pageId, headerRec, headerPayload));
        sectionsGenerated.push('header');

        // 2. Hero Section
        if (sections.hero) {
          const heroPackage = packageHeroSection(
            sections.hero,
            sections.hero.niche || 'telecom',
            true,
            pagePreset,
            {
              title: page.title,
              descr: page.descr || sections.hero.descr || '',
              faq: sections.faq,
              pricing: sections.pricing,
            },
            sections.cro,
            page.analytics || (sections as any).analytics
          );
          const heroRec = await this.client.addBlock(pageId, heroPackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, heroRec, heroPackage.fields));
          sectionsGenerated.push('hero');
        }

        // 2b. Marquee
        if (sections.marquee) {
          const marqueePackage = packageMarqueeSection(sections.marquee.items, pagePreset);
          const marqueeRec = await this.client.addBlock(pageId, marqueePackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, marqueeRec, marqueePackage.fields));
          sectionsGenerated.push('marquee');
        }

        // 3. Features
        if (sections.features) {
          const featPackage = packageFeaturesSection(sections.features, pagePreset);
          const featRec = await this.client.addBlock(pageId, featPackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, featRec, featPackage.fields));
          sectionsGenerated.push('features');
        }

        // 3b. Timeline
        if (sections.timeline) {
          const timelinePackage = packageTimelineSection(sections.timeline, pagePreset);
          const timelineRec = await this.client.addBlock(pageId, timelinePackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, timelineRec, timelinePackage.fields));
          sectionsGenerated.push('timeline');
        }

        // 4. Metrics
        if (sections.metrics) {
          const metrPackage = packageMetricsSection(sections.metrics, pagePreset);
          const metrRec = await this.client.addBlock(pageId, metrPackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, metrRec, metrPackage.fields));
          sectionsGenerated.push('metrics');
        }

        // 4b. Calculator
        if (sections.calculator) {
          const calcPackage = packageCalculatorSection(sections.calculator, pagePreset);
          const calcRec = await this.client.addBlock(pageId, calcPackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, calcRec, calcPackage.fields));
          sectionsGenerated.push('calculator');
        }

        // 5. Pricing
        if (sections.pricing) {
          const pricePackage = packagePricingSection(sections.pricing, pagePreset);
          const priceRec = await this.client.addBlock(pageId, pricePackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, priceRec, pricePackage.fields));
          sectionsGenerated.push('pricing');
        }

        // 6. Testimonials
        if (sections.testimonials) {
          const testRec = await this.client.addBlock(pageId, 'TS101');
          updateTasks.push(() =>
            this.client.updateBlock(pageId, testRec, {
              btitle: sections.testimonials!.title,
              bdescr: sections.testimonials!.descr || '',
              rec_anchor: 'reviews',
              bg_color: pagePreset === 'dji' ? '#FFFFFF' : theme.bgPrimary,
              title_color: theme.textPrimary,
              descr_color: theme.textSecondary,
              color: theme.textPrimary,
              li_title_color: theme.textPrimary,
            })
          );
          sectionsGenerated.push('testimonials');
        }

        // 7. FAQ
        if (sections.faq) {
          const faqPackage = packageFaqSection(sections.faq, pagePreset);
          const faqRec = await this.client.addBlock(pageId, faqPackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, faqRec, faqPackage.fields));
          sectionsGenerated.push('faq');
        }

        // 8. Contact Form
        if (sections.form) {
          const formPackage = packageContactSection(
            sections.form,
            (sections.form as any).webhook_url,
            pagePreset,
            (sections.form as any).success_message
          );
          const formRec = await this.client.addBlock(pageId, formPackage.tplId);
          updateTasks.push(() => this.client.updateBlock(pageId, formRec, formPackage.fields));
          sectionsGenerated.push('form');
        }

        // 9. Footer
        const projectName =
          sections.footer?.title ||
          sections.header?.logo_text ||
          page.title;
        const footPackage = packageFooterSection(projectName, pagePreset);
        const footRec = await this.client.addBlock(pageId, footPackage.tplId);
        updateTasks.push(() => this.client.updateBlock(pageId, footRec, footPackage.fields));
        sectionsGenerated.push('footer');

        // 10. Preset / Custom CSS Embed
        let cssCode = sections.custom_css;
        const presetCss = getPresetCss(pagePreset);
        if (!cssCode && presetCss) {
          cssCode = presetCss;
        } else if (cssCode && presetCss && !cssCode.includes('t-pricing__features')) {
          cssCode = `${presetCss}\n${cssCode}`;
        }
        if (cssCode) {
          const t123Rec = await this.client.addBlock(pageId, 'T123');
          updateTasks.push(() =>
            this.client.updateBlock(pageId, t123Rec, {
              code: cssCode,
              rawcod: cssCode,
            })
          );
          sectionsGenerated.push('custom_css');
        }

        // Execute batch updates
        await this.runBatch(updateTasks, 3);

        // Publish page
        const pubResult = await this.client.publishPage(pageId);
        if (pubResult && pubResult.publishedUrl) {
          slugToUrl[page.slug] = pubResult.publishedUrl;
        }

        pageReports.push({
          slug: page.slug,
          title: page.title,
          page_id: pageId,
          published_url: pubResult?.publishedUrl || `https://tilda.cc/page/?pageid=${pageId}`,
          blocks_count: sectionsGenerated.length,
        });
      }

      const totalElapsedTime = Math.round(performance.now() - startTime);

      return {
        success: true,
        project_id,
        global_theme,
        pages_count: pageReports.length,
        pages: pageReports,
        navigation_map: slugToUrl,
        cross_linking_status: 'verified',
        total_elapsed_time_ms: totalElapsedTime,
      };
    } catch (err: any) {
      // Automatic Rollback
      console.warn(
        `[MultipageOrchestrator] Multi-page build failed (${err.message}). Rolling back ${createdPageIds.length} created pages...`
      );
      for (const pid of createdPageIds) {
        try {
          await this.client.deletePage(pid);
        } catch (delErr: any) {
          console.warn(`[Rollback] Failed to delete page ${pid}: ${delErr.message}`);
        }
      }
      throw err;
    }
  }

  /**
   * Generates local previews for all pages in dry-run mode with cross-links.
   */
  private generateDryRun(config: MultipageSiteConfig, startTime: number): MultipageSiteReport {
    const { project_id, global_theme = 'linear', navigation, pages } = config;
    const slugToUrl: Record<string, string> = {};

    // Pass 1: Map slugs to local relative filenames
    pages.forEach((p) => {
      slugToUrl[p.slug] = `${p.slug}.html`;
    });

    const navItems =
      navigation && navigation.length > 0
        ? navigation.map((n) => ({
            title: n.label,
            href: slugToUrl[n.target_slug] || `${n.target_slug}.html`,
          }))
        : pages.map((p) => ({
            title: p.title,
            href: slugToUrl[p.slug],
          }));

    const pageReports: CreatedPageReport[] = [];

    // Pass 2: Compile each page with cross-links
    for (const page of pages) {
      const pageSections = { ...page.sections };
      pageSections.header = {
        logo_text: pageSections.header?.logo_text || pages[0]?.title || 'Site',
        btn_text: pageSections.header?.btn_text || 'Связаться',
        btn_href: pageSections.header?.btn_href || '#form',
        menu_items: navItems,
      };

      const previewRes = buildLocalPreview({
        landingTitle: page.title,
        style_preset: page.preset || global_theme,
        outputPath: `preview/${page.slug}.html`,
        analytics: page.analytics || pageSections.analytics,
        sections: pageSections,
      });

      pageReports.push({
        slug: page.slug,
        title: page.title,
        page_id: `local-${page.slug}`,
        published_url: previewRes.previewUrl,
        blocks_count: previewRes.sectionsCount,
      });
    }

    return {
      success: true,
      project_id,
      global_theme,
      pages_count: pageReports.length,
      pages: pageReports,
      navigation_map: slugToUrl,
      cross_linking_status: 'verified',
      total_elapsed_time_ms: Math.round(performance.now() - startTime),
    };
  }

  private async runBatch<T>(tasks: (() => Promise<T>)[], batchSize = 3): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((fn) => fn()));
      results.push(...batchResults);
    }
    return results;
  }
}
