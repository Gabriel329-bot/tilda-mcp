import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { TildaHttpClient } from './driver/tilda-http-client.js';
import { performance } from 'perf_hooks';
import { STYLE_PRESETS, StylePresetName, DARK_PRESET_CSS, DJI_PRESET_CSS, getPresetCss } from './styles/presets.js';

import {
  packageHeroSection,
  packageFeaturesSection,
  packageMetricsSection,
  packagePricingSection,
  packageContactSection,
  packageFaqSection,
  packageFooterSection,
} from './builder/block-packager.js';

// Initialize MCP Server
const server = new McpServer({
  name: 'tilda-mcp',
  version: '1.0.0',
});

// Niche presets for Hero background images
export const NICHE_PRESETS: Record<string, string> = {
  interior: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
  auto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
  it: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
  tech: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
  telecom: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80',
  food: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
};

// Semantic mapping: section name -> candidate Tilda block template IDs
export const SECTION_TPL_MAP: Record<string, string[]> = {
  header: ['2083', '1272', '133'],
  hero: ['131', '205', '204', '18'],
  features: ['131', '491'],
  metrics: ['131', '1050'],
  pricing: ['131', '776', '1072', '301', '142'],
  testimonials: ['533', '605', '441'],
  faq: ['131', '585', '746'],
  form: ['131', '678'],
  footer: ['131', '144'],
  custom_css: ['131'],
};

/**
 * Runs an array of asynchronous tasks in batches of specified size.
 */
async function runInBatches<T>(tasks: (() => Promise<T>)[], batchSize = 3): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((fn) => fn()));
    results.push(...batchResults);
  }
  return results;
}

// =========================================================================
// TOOL 1: tilda_fast_generate_landing (High-Level End-to-End Generator)
// =========================================================================
server.tool(
  'tilda_fast_generate_landing',
  'Generates and publishes an end-to-end responsive landing page in Tilda in <4 seconds.',
  {
    projectId: z.string().optional().describe('Tilda project ID'),
    pageId: z.string().optional().describe('Target page ID (created if omitted)'),
    landingTitle: z.string().optional().describe('Page title'),
    title: z.string().optional().describe('Alias for landingTitle'),
    style_preset: z
      .enum(['dark', 'minimal', 'warm', 'dji', 'linear', 'apple', 'light'])
      .default('minimal')
      .optional()
      .describe('Color preset: dark, minimal, warm, dji, linear, apple, light'),
    safeMode: z.boolean().optional().default(true).describe('Human-like pacing delays'),
    custom_css: z.string().optional().describe('Custom CSS/HTML for T123 embed'),
    sections: z.object({
      header: z
        .object({
          logo_text: z.string().describe('Brand/logo text'),
          menu_items: z
            .array(
              z.object({
                title: z.string(),
                href: z.string(),
              })
            )
            .optional()
            .describe('Navigation items'),
          btn_text: z.string().optional().describe('CTA text'),
          btn_href: z.string().optional().describe('CTA link'),
        })
        .optional(),
      hero: z.object({
        title: z.string(),
        descr: z.string(),
        badge: z.string().optional(),
        btn_text: z.string().optional(),
        btn_href: z.string().optional(),
        btn2_text: z.string().optional(),
        btn2_href: z.string().optional(),
        btn1: z
          .object({
            text: z.string(),
            href: z.string().optional(),
          })
          .optional(),
        btn2: z
          .object({
            text: z.string(),
            href: z.string().optional(),
          })
          .optional(),
        bg_image_url: z.string().optional().describe('Cover background image URL'),
        niche: z.string().optional().describe('Niche preset for background'),
      }),
      features: z.object({
        title: z.string(),
        descr: z.string().optional(),
        items: z
          .array(
            z.object({
              title: z.string(),
              descr: z.string(),
              img_url: z.string().optional(),
            })
          )
          .max(4),
      }),
      metrics: z.object({
        title: z.string(),
        descr: z.string().optional(),
        items: z
          .array(
            z.object({
              title: z.string().optional(),
              descr: z.string(),
              num: z.string().optional(),
            })
          )
          .max(4),
      }),
      pricing: z
        .object({
          title: z.string().describe('Pricing section title'),
          descr: z.string().optional(),
          plans: z.array(
            z.object({
              name: z.string(),
              price: z.string(),
              period: z.string().optional(),
              features: z.array(z.string()),
              btn_text: z.string().default('Выбрать тариф').optional(),
              btn_href: z.string().default('#form').optional(),
              is_featured: z.boolean().optional(),
            })
          ),
        })
        .optional(),
      testimonials: z
        .object({
          title: z.string().describe('Testimonials section title'),
          descr: z.string().optional(),
          items: z.array(
            z.object({
              name: z.string(),
              role: z.string().optional(),
              text: z.string(),
              rating: z.number().optional(),
              avatar_url: z.string().optional(),
            })
          ),
        })
        .optional(),
      faq: z
        .object({
          title: z.string().describe('FAQ section title'),
          descr: z.string().optional(),
          items: z.array(
            z.object({
              question: z.string().optional(),
              answer: z.string().optional(),
              title: z.string().optional(),
              descr: z.string().optional(),
            })
          ),
        })
        .optional(),
      form: z
        .object({
          title: z.string().optional(),
          descr: z.string().optional(),
          btn_text: z.string().optional(),
          badge: z.string().optional(),
          inputs: z
            .array(
              z.object({
                type: z.string().describe('Field type: email, text, phone, textarea'),
                title: z.string(),
                placeholder: z.string().optional(),
                required: z.boolean().optional(),
              })
            )
            .optional(),
        })
        .optional(),
      footer: z
        .object({
          title: z.string().optional(),
          descr: z.string().optional(),
          text: z.string().optional(),
        })
        .optional(),
      custom_css: z.string().optional(),
    }),
  },
  async ({ projectId, pageId, landingTitle, title, style_preset, safeMode, custom_css, sections }) => {
    try {
      const startTime = performance.now();
      const client = new TildaHttpClient({ humanLikePacing: safeMode });
      const presetKey: StylePresetName = (style_preset as StylePresetName) || 'minimal';
      const theme = STYLE_PRESETS[presetKey] || STYLE_PRESETS.minimal;

      // Session healthcheck: fail fast if cookies are expired
      await client.checkAuth();

      let targetPageId = pageId;
      let isNewlyCreated = false;
      const effectiveTitle = landingTitle || title || 'Landing Page';
      if (!targetPageId) {
        if (!projectId) {
          throw new Error('Either pageId or projectId must be provided.');
        }
        targetPageId = await client.createPage(projectId, effectiveTitle);
        isNewlyCreated = true;
      }

      try {
      // === Begin transactional build ===
      await client.initSession(targetPageId);

      // Clean existing blocks if re-generating an existing page
      if (!isNewlyCreated) {
        await client.deleteAllRecords(targetPageId);
      }

      const updateTasks: (() => Promise<any>)[] = [];
      const sectionsGenerated: string[] = [];
      const colormode = presetKey === 'dark' ? 'dark' : 'light';

      // 1. Optional Header (ME101 / ME301N - tplId 2083)
      if (sections.header) {
        const headerRec = await client.addBlock(targetPageId, 'ME101');
        const defaultMenuItems = [
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
            : defaultMenuItems;

        const headerPayload: Record<string, string> = {
          title: sections.header.logo_text,
          buttontitle: sections.header.btn_text || 'Связаться',
          buttonlink: sections.header.btn_href || '#form',
          bg_color: theme.bgPrimary,
          title_color: presetKey === 'dji' || presetKey === 'dark' ? '#FFFFFF' : theme.textPrimary,
          color: presetKey === 'dji' || presetKey === 'dark' ? '#FFFFFF' : theme.textPrimary,
          btn_bg_color: theme.accentBtnBg,
          buttontitle_color: theme.accentBtnText,
          colormode,
          theme: presetKey,
        };
        menuItems.forEach((item, idx) => {
          headerPayload[`menuitems-title[${idx}]`] = item.title;
          headerPayload[`menuitems-link[${idx}]`] = item.href;
        });

        updateTasks.push(() => client.updateBlock(targetPageId, headerRec, headerPayload));
        sectionsGenerated.push('header');
      }

      // 2. Hero Section (Template Vault: HD Cover + Tailwind CSS via T123)
      const heroPackage = packageHeroSection(
        sections.hero,
        sections.hero.niche || 'telecom',
        true,
        presetKey
      );
      const heroRec = await client.addBlock(targetPageId, heroPackage.tplId);
      updateTasks.push(() =>
        client.updateBlock(targetPageId, heroRec, heroPackage.fields)
      );
      sectionsGenerated.push('hero');

      // 3. Features (Template Vault: Bento Features Grid via T123)
      const featPackage = packageFeaturesSection(sections.features, presetKey);
      const featRec = await client.addBlock(targetPageId, featPackage.tplId);
      updateTasks.push(() =>
        client.updateBlock(targetPageId, featRec, featPackage.fields)
      );
      sectionsGenerated.push('features');

      // 4. Metrics (Template Vault: Monochromatic Metrics via T123)
      const metrPackage = packageMetricsSection(sections.metrics, presetKey);
      const metrRec = await client.addBlock(targetPageId, metrPackage.tplId);
      updateTasks.push(() =>
        client.updateBlock(targetPageId, metrRec, metrPackage.fields)
      );
      sectionsGenerated.push('metrics');

      // 5. Optional Pricing (Template Vault: Pricing Monolith via T123)
      if (sections.pricing) {
        const pricePackage = packagePricingSection(sections.pricing, presetKey);
        const priceRec = await client.addBlock(targetPageId, pricePackage.tplId);
        updateTasks.push(() =>
          client.updateBlock(targetPageId, priceRec, pricePackage.fields)
        );
        sectionsGenerated.push('pricing');
      }

      // 6. Optional Testimonials (TS101 / TS203 - tplId 533) with #reviews anchor
      if (sections.testimonials) {
        const testRec = await client.addBlock(targetPageId, 'TS101');
        updateTasks.push(() =>
          client.updateBlock(targetPageId, testRec, {
            btitle: sections.testimonials!.title,
            bdescr: sections.testimonials!.descr || '',
            rec_anchor: 'reviews',
            bg_color: presetKey === 'dji' ? '#FFFFFF' : theme.bgPrimary,
            title_color: theme.textPrimary,
            descr_color: theme.textSecondary,
            color: theme.textPrimary,
            li_title_color: theme.textPrimary,
            li_descr_color: theme.textSecondary,
            colormode,
            theme: presetKey,
            style_preset: presetKey,
            list: sections.testimonials!.items.map((t, i) => {
              const stars = t.rating
                ? '★'.repeat(Math.min(5, Math.max(1, Math.round(t.rating))))
                : '';
              const subtitleParts = [stars, t.role].filter(Boolean);
              return {
                lid: String(i + 1),
                ls: String(i + 1),
                li_title: t.name,
                li_subtitle: subtitleParts.join(' · '),
                li_descr: t.text,
                li_text: t.text,
                li_img: t.avatar_url || '',
              };
            }),
          })
        );
        sectionsGenerated.push('testimonials');
      }

      // 7. Optional FAQ Accordion (Template Vault: Interactive Accordion via T123)
      if (sections.faq) {
        const faqPackage = packageFaqSection(sections.faq, presetKey);
        const faqRec = await client.addBlock(targetPageId, faqPackage.tplId);
        updateTasks.push(() =>
          client.updateBlock(targetPageId, faqRec, faqPackage.fields)
        );
        sectionsGenerated.push('faq');
      }

      // 8. Contact / Form (Template Vault: Contact Section via T123)
      if (sections.form) {
        const formPackage = packageContactSection(
          sections.form,
          (sections.form as any).webhook_url,
          presetKey
        );
        const formRec = await client.addBlock(targetPageId, formPackage.tplId);
        updateTasks.push(() =>
          client.updateBlock(targetPageId, formRec, formPackage.fields)
        );
        sectionsGenerated.push('form');
      }

      // 9. Footer (Template Vault: Dark Studio Footer via T123)
      if (sections.footer) {
        const projectName =
          sections.footer.title ||
          sections.header?.logo_text ||
          effectiveTitle;
        const footPackage = packageFooterSection(projectName, presetKey);
        const footRec = await client.addBlock(targetPageId, footPackage.tplId);
        updateTasks.push(() =>
          client.updateBlock(targetPageId, footRec, footPackage.fields)
        );
        sectionsGenerated.push('footer');
      }

      // 10. Auto-CSS / Custom CSS Embed (T123 - tplId 131)
      let cssCode = custom_css || sections.custom_css;
      const presetCss = getPresetCss(presetKey);
      if (!cssCode && presetCss) {
        cssCode = presetCss;
      } else if (cssCode && presetCss && !cssCode.includes('t-pricing__features')) {
        cssCode = `${presetCss}\n${cssCode}`;
      }

      if (cssCode) {
        const t123Rec = await client.addBlock(targetPageId, 'T123');
        updateTasks.push(() =>
          client.updateBlock(targetPageId, t123Rec, {
            code: cssCode,
            rawcod: cssCode,
          })
        );
        sectionsGenerated.push('t123_custom_css');
      }

      // Execute block updates in batches of 3
      await runInBatches(updateTasks, 3);

      // Publish page
      const pubResult = await client.publishPage(targetPageId);
      const buildTimeMs = Math.round(performance.now() - startTime);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              page_id: targetPageId,
              url: pubResult.publishedUrl,
              blocks_count: sectionsGenerated.length,
              preset: presetKey,
              elapsed_time_ms: buildTimeMs,
            }),
          },
        ],
      };
      // === End transactional build ===
      } catch (buildErr: any) {
        // Transactional rollback: delete newly created page if build/update/publish failed
        if (isNewlyCreated && targetPageId) {
          console.warn(`[Rollback] Build failed, deleting orphaned page ${targetPageId}...`);
          try {
            await client.deletePage(targetPageId);
          } catch (rollbackErr: any) {
            console.warn(`[Rollback] Could not delete page ${targetPageId}: ${rollbackErr.message}`);
          }
        }
        throw buildErr; // rethrow to outer catch for MCP error response
      }
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Fast build error: ${err.message}`,
          },
        ],
      };
    }
  }
);

// =========================================================================
// TOOL 2: tilda_update_page_section (Targeted Section Editing)
// =========================================================================
server.tool(
  'tilda_update_page_section',
  'Updates a single section on a Tilda page and republishes it.',
  {
    pageId: z.string().describe('Target Tilda page ID'),
    section: z
      .enum([
        'header',
        'hero',
        'features',
        'metrics',
        'pricing',
        'testimonials',
        'faq',
        'form',
        'footer',
        'custom_css',
      ])
      .describe('Section name to update'),
    recordId: z.string().optional().describe('Direct record ID (auto-resolved if omitted)'),
    style_preset: z.enum(['dark', 'minimal', 'warm', 'dji', 'linear', 'apple', 'light']).optional().describe('Style preset override'),
    content: z.record(z.any()).describe('Fields to update in the section'),
    publish: z.boolean().optional().default(true).describe('Republish page after update'),
  },
  async ({ pageId, section, recordId, style_preset, content, publish }) => {
    try {
      const startTime = performance.now();
      const client = new TildaHttpClient({ humanLikePacing: false });
      await client.initSession(pageId);

      let targetRecId = recordId;
      if (!targetRecId) {
        const records = await client.getPageRecords(pageId);
        const candidateTpls = SECTION_TPL_MAP[section] || [];
        for (const r of records) {
          const rTpl = String(r.tplid);
          if (candidateTpls.includes(rTpl)) {
            const m = r.html?.match(/recordid=["'](\d+)["']/i) || r.html?.match(/id=["']rec(\d+)["']/i);
            if (m && m[1]) {
              targetRecId = m[1];
              break;
            }
          }
        }
        if (!targetRecId) {
          const anchorName = section === 'testimonials' ? 'reviews' : section;
          for (const r of records) {
            if (
              r.html &&
              (r.html.includes(`name="${anchorName}"`) || r.html.includes(`data-anchor="${anchorName}"`))
            ) {
              const m = r.html.match(/recordid=["'](\d+)["']/i) || r.html.match(/id=["']rec(\d+)["']/i);
              if (m && m[1]) {
                targetRecId = m[1];
                break;
              }
            }
          }
        }
        if (!targetRecId) {
          throw new Error(`Section "${section}" not found on page ${pageId}. Provide recordId explicitly.`);
        }
      }

      // Build fields for updateBlock
      const fields: Record<string, any> = { ...content };
      if (style_preset) {
        fields.style_preset = style_preset;
        fields.colormode = style_preset === 'dark' ? 'dark' : 'light';
        fields.theme = style_preset;
      }

      // Semantic transformations based on section type
      if (section === 'hero') {
        if (content.title) fields.title = content.title;
        if (content.descr) fields.descr = content.descr;
        if (content.btn_text) fields.buttontitle = content.btn_text;
        if (content.btn_href) fields.buttonlink = content.btn_href;
        if (content.btn2_text) fields.buttontitle2 = content.btn2_text;
        if (content.btn2_href) fields.buttonlink2 = content.btn2_href;
        if (content.bg_image_url) {
          fields.img = content.bg_image_url;
          fields.bgimg = content.bg_image_url;
        } else if (content.niche && NICHE_PRESETS[content.niche]) {
          fields.img = NICHE_PRESETS[content.niche];
          fields.bgimg = NICHE_PRESETS[content.niche];
        }
      } else if (section === 'features') {
        if (content.title) fields.btitle = content.title;
        if (content.descr) fields.bdescr = content.descr;
        if (Array.isArray(content.items)) {
          fields.list = content.items.map((item: any, i: number) => ({
            lid: String(i + 1),
            ls: String(i + 1),
            li_title: item.title,
            li_descr: item.descr,
            li_img: item.img_url || '',
          }));
        }
      } else if (section === 'metrics') {
        if (content.title) fields.btitle = content.title;
        if (Array.isArray(content.items)) {
          fields.list = content.items.map((item: any, i: number) => ({
            lid: String(i + 1),
            ls: String(i + 1),
            li_title: item.num || item.title,
            li_descr: item.descr,
          }));
        }
      } else if (section === 'pricing') {
        if (content.title) fields.btitle = content.title;
        if (content.descr) fields.bdescr = content.descr;
        if (Array.isArray(content.plans)) {
          fields.list = content.plans.map((p: any, i: number) => ({
            lid: String(i + 1),
            ls: String(i + 1),
            li_title: p.name,
            li_price: p.price,
            li_subtitle: p.period || '',
            li_descr: Array.isArray(p.features)
              ? `<ul>${p.features.map((f: any) => `<li>${f}</li>`).join('')}</ul>`
              : String(p.features),
            li_button: p.btn_text || 'Выбрать тариф',
            li_btn_text: p.btn_text || 'Выбрать тариф',
            li_btn_href: p.btn_href || '#form',
            li_buttonlink: p.btn_href || '#form',
            ...(p.is_featured ? { li_featured: 'y' } : {}),
          }));
        }
      } else if (section === 'testimonials') {
        if (content.title) fields.btitle = content.title;
        if (content.descr) fields.bdescr = content.descr;
        if (Array.isArray(content.items)) {
          fields.list = content.items.map((t: any, i: number) => {
            const stars = t.rating ? '★'.repeat(Math.min(5, Math.max(1, Math.round(t.rating)))) : '';
            const subtitleParts = [stars, t.role].filter(Boolean);
            return {
              lid: String(i + 1),
              ls: String(i + 1),
              li_title: t.name,
              li_subtitle: subtitleParts.join(' · '),
              li_descr: t.text,
              li_text: t.text,
              li_img: t.avatar_url || '',
            };
          });
        }
      } else if (section === 'faq') {
        if (content.title) fields.btitle = content.title;
        if (content.descr) fields.bdescr = content.descr;
        if (Array.isArray(content.items)) {
          fields.list = content.items.map((item: any, i: number) => ({
            lid: String(i + 1),
            ls: String(i + 1),
            li_title: item.question,
            li_descr: item.answer,
          }));
        }
      } else if (section === 'form') {
        if (content.title) fields.btitle = content.title;
        if (content.descr) fields.bdescr = content.descr;
        if (content.btn_text) fields.buttontitle = content.btn_text;
        if (content.inputs) fields.inputs = content.inputs;
      } else if (section === 'header') {
        if (content.logo_text) fields.title = content.logo_text;
        if (content.btn_text) fields.buttontitle = content.btn_text;
        if (content.btn_href) fields.buttonlink = content.btn_href;
        if (Array.isArray(content.menu_items)) {
          content.menu_items.forEach((item: any, idx: number) => {
            fields[`menuitems-title[${idx}]`] = item.title;
            fields[`menuitems-link[${idx}]`] = item.href;
          });
        }
      } else if (section === 'footer') {
        const projectName = content.projectName || content.title || content.name || 'DevTools Cloud';
        const footPkg = packageFooterSection(projectName, style_preset);
        fields.code = footPkg.fields.code;
        fields.rawcod = footPkg.fields.rawcod;
        if (content.title) fields.title = content.title;
        if (content.descr) fields.descr = content.descr;
      } else if (section === 'custom_css') {
        const cssVal = content.css || content.code || content.custom_css;
        if (cssVal) {
          fields.code = cssVal;
          fields.rawcod = cssVal;
        }
      }

      await client.updateBlock(pageId, targetRecId, fields);

      let publishedUrl: string | undefined;
      if (publish !== false) {
        const pubResult = await client.publishPage(pageId);
        publishedUrl = pubResult.publishedUrl;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              page_id: pageId,
              section,
              record_id: targetRecId,
              url: publishedUrl,
              elapsed_time_ms: Math.round(performance.now() - startTime),
            }),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Section update error: ${err.message}` }],
      };
    }
  }
);

// =========================================================================
// Server Startup
// =========================================================================
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[TildaMCP] Server running on stdio');
}

main().catch((error) => {
  console.error('[TildaMCP] Fatal server error:', error);
  process.exit(1);
});
