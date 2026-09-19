import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { TildaHttpClient } from './driver/tilda-http-client.js';
import { performance } from 'perf_hooks';
import { STYLE_PRESETS, StylePresetName } from './styles/presets.js';

// Initialize MCP Server
const server = new McpServer({
  name: 'tilda-mcp',
  version: '1.0.0',
});

// Niche presets for Hero background images
export const NICHE_PRESETS: Record<string, string> = {
  interior: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80',
  auto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
  it: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
  food: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
};

// Semantic mapping: section name -> candidate Tilda block template IDs
export const SECTION_TPL_MAP: Record<string, string[]> = {
  header: ['2083', '1272', '133'],
  hero: ['205', '204', '18'],
  features: ['491'],
  metrics: ['1050'],
  pricing: ['1072', '301'],
  testimonials: ['533', '605', '441'],
  faq: ['585', '746'],
  form: ['678'],
  footer: ['144'],
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
    landingTitle: z.string().optional().default('Landing Page').describe('Page title'),
    style_preset: z.enum(['dark', 'minimal', 'warm']).default('minimal').optional().describe('Color preset: dark, minimal, warm'),
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
        btn_text: z.string().optional(),
        btn_href: z.string().optional(),
        btn2_text: z.string().optional(),
        btn2_href: z.string().optional(),
        bg_image_url: z.string().optional().describe('Cover background image URL'),
        niche: z.enum(['interior', 'auto', 'it', 'food']).optional().describe('Niche preset for background'),
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
              question: z.string(),
              answer: z.string(),
            })
          ),
        })
        .optional(),
      form: z.object({
        title: z.string(),
        descr: z.string(),
        btn_text: z.string(),
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
      }),
      footer: z
        .object({
          title: z.string().optional(),
          descr: z.string().optional(),
        })
        .optional(),
      custom_css: z.string().optional(),
    }),
  },
  async ({ projectId, pageId, landingTitle, style_preset, safeMode, custom_css, sections }) => {
    try {
      const startTime = performance.now();
      const client = new TildaHttpClient({ humanLikePacing: safeMode });
      const presetKey: StylePresetName = (style_preset as StylePresetName) || 'minimal';
      const theme = STYLE_PRESETS[presetKey] || STYLE_PRESETS.minimal;

      // Session healthcheck: fail fast if cookies are expired
      await client.checkAuth();

      let targetPageId = pageId;
      let isNewlyCreated = false;
      if (!targetPageId) {
        if (!projectId) {
          throw new Error('Either pageId or projectId must be provided.');
        }
        targetPageId = await client.createPage(projectId, landingTitle);
        isNewlyCreated = true;
      }

      try {
      // === Begin transactional build ===
      await client.initSession(targetPageId);

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
          title_color: theme.textPrimary,
          color: theme.textPrimary,
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

      // Determine hero background image: explicit URL -> niche preset -> interior default
      const bgImg =
        sections.hero.bg_image_url ||
        (sections.hero.niche && NICHE_PRESETS[sections.hero.niche]) ||
        NICHE_PRESETS.interior;

      // 2. Hero (CR30 / CR16 - tplId 205)
      const heroRec = await client.addBlock(targetPageId, 'CR30');
      updateTasks.push(() =>
        client.updateBlock(targetPageId, heroRec, {
          title: sections.hero.title,
          descr: sections.hero.descr,
          buttontitle: sections.hero.btn_text,
          buttonlink: sections.hero.btn_href || '#form',
          buttontitle2: sections.hero.btn2_text,
          buttonlink2: sections.hero.btn2_href || '#features',
          img: bgImg,
          bgimg: bgImg,
          title_color: theme.textPrimary,
          descr_color: theme.textSecondary,
          color: theme.textPrimary,
          btn_bg_color: theme.accentBtnBg,
          buttontitle_color: theme.accentBtnText,
          colormode,
          theme: presetKey,
        })
      );
      sectionsGenerated.push('hero');

      // 3. Features (FR104 / FR205 - tplId 491) with #features anchor
      const featRec = await client.addBlock(targetPageId, 'FR104');
      updateTasks.push(() =>
        client.updateBlock(targetPageId, featRec, {
          btitle: sections.features.title,
          bdescr: sections.features.descr || '',
          rec_anchor: 'features',
          bg_color: theme.bgSecondary,
          title_color: theme.textPrimary,
          descr_color: theme.textSecondary,
          color: theme.textPrimary,
          li_title_color: theme.textPrimary,
          li_descr_color: theme.textSecondary,
          colormode,
          theme: presetKey,
          list: sections.features.items.map((item, i) => ({
            lid: String(i + 1),
            ls: String(i + 1),
            li_title: item.title,
            li_descr: item.descr,
            li_img: item.img_url || '',
          })),
        })
      );
      sectionsGenerated.push('features');

      // 4. Metrics (NM01 / FR402N - tplId 1050) with #metrics anchor
      const metrRec = await client.addBlock(targetPageId, 'NM01');
      updateTasks.push(() =>
        client.updateBlock(targetPageId, metrRec, {
          btitle: sections.metrics.title,
          rec_anchor: 'metrics',
          bg_color: theme.bgPrimary,
          title_color: theme.textPrimary,
          descr_color: theme.textSecondary,
          color: theme.textPrimary,
          li_title_color: theme.textPrimary,
          li_descr_color: theme.textSecondary,
          colormode,
          theme: presetKey,
          list: sections.metrics.items.map((item, i) => ({
            lid: String(i + 1),
            ls: String(i + 1),
            li_title: item.num || item.title,
            li_descr: item.descr,
          })),
        })
      );
      sectionsGenerated.push('metrics');

      // 5. Optional Pricing (PR01 / PL120N - tplId 1072) with #pricing anchor
      if (sections.pricing) {
        const priceRec = await client.addBlock(targetPageId, 'PR01');
        updateTasks.push(() =>
          client.updateBlock(targetPageId, priceRec, {
            btitle: sections.pricing!.title,
            bdescr: sections.pricing!.descr || '',
            rec_anchor: 'pricing',
            bg_color: theme.bgSecondary,
            title_color: theme.textPrimary,
            descr_color: theme.textSecondary,
            color: theme.textPrimary,
            li_title_color: theme.textPrimary,
            li_descr_color: theme.textSecondary,
            colormode,
            theme: presetKey,
            style_preset: presetKey,
            list: sections.pricing!.plans.map((p, i) => ({
              lid: String(i + 1),
              ls: String(i + 1),
              li_title: p.name,
              li_price: p.price,
              li_subtitle: p.period || '',
              li_descr: Array.isArray(p.features)
                ? `<ul>${p.features.map((f) => `<li>${f}</li>`).join('')}</ul>`
                : String(p.features),
              li_button: p.btn_text || 'Выбрать тариф',
              li_btn_text: p.btn_text || 'Выбрать тариф',
              li_btn_href: p.btn_href || '#form',
              li_buttonlink: p.btn_href || '#form',
              ...(p.is_featured ? { li_featured: 'y' } : {}),
            })),
          })
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
            bg_color: theme.bgPrimary,
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

      // 7. Optional FAQ Accordion (TX16N - tplId 585) with #faq anchor
      if (sections.faq) {
        const faqRec = await client.addBlock(targetPageId, 'TX16N');
        updateTasks.push(() =>
          client.updateBlock(targetPageId, faqRec, {
            btitle: sections.faq!.title,
            bdescr: sections.faq!.descr || '',
            rec_anchor: 'faq',
            bg_color: theme.bgSecondary,
            title_color: theme.textPrimary,
            descr_color: theme.textSecondary,
            color: theme.textPrimary,
            color2: theme.textSecondary,
            li_title_color: theme.textPrimary,
            li_descr_color: theme.textSecondary,
            colormode,
            theme: presetKey,
            list: sections.faq!.items.map((item, i) => ({
              lid: String(i + 1),
              ls: String(i + 1),
              li_title: item.question,
              li_descr: item.answer,
            })),
          })
        );
        sectionsGenerated.push('faq');
      }

      // 8. Form (BF204 / BF204N - tplId 678) with #form anchor
      const formRec = await client.addBlock(targetPageId, 'BF204');
      updateTasks.push(() =>
        client.updateBlock(targetPageId, formRec, {
          btitle: sections.form.title,
          bdescr: sections.form.descr,
          buttontitle: sections.form.btn_text,
          rec_anchor: 'form',
          inputs: sections.form.inputs,
          bg_color: sections.faq ? theme.bgPrimary : theme.bgSecondary,
          title_color: theme.textPrimary,
          descr_color: theme.textSecondary,
          color: theme.textPrimary,
          colormode,
          theme: presetKey,
          style_preset: presetKey,
        })
      );
      sectionsGenerated.push('form');

      // 9. Optional Footer (FT101 - tplId 144)
      if (sections.footer) {
        const footRec = await client.addBlock(targetPageId, 'FT101');
        updateTasks.push(() =>
          client.updateBlock(targetPageId, footRec, {
            title: sections.footer!.title || '',
            descr: sections.footer!.descr || '',
            bg_color: sections.faq ? theme.bgSecondary : theme.bgPrimary,
            title_color: theme.textPrimary,
            descr_color: theme.textSecondary,
            color: theme.textPrimary,
            colormode,
            theme: presetKey,
            style_preset: presetKey,
          })
        );
        sectionsGenerated.push('footer');
      }

      // 10. Auto-CSS / Custom CSS Embed (T123 - tplId 131)
      const darkNeonCss = `<style>
  /* Glassmorphism для карточек */
  .t-card__col, .t-col, .t1072__content, .t533__col {
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
  }
  /* Стилизация карточек тарифов (1072) */
  .t1072__content {
    background: rgba(16, 20, 30, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    overflow: hidden !important;
  }
  .t1072__header {
    background: rgba(22, 25, 34, 0.8) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  .t1072__featured .t1072__header {
    background: rgba(0, 245, 255, 0.15) !important;
    border-bottom: 1px solid rgba(0, 245, 255, 0.3) !important;
  }
  .t1072__featured .t-card__title {
    color: #00F5FF !important;
  }
  .t1072__footer {
    background: transparent !important;
  }
  /* Стилизация карточек отзывов (533) */
  .t533__wrapper {
    background: rgba(22, 25, 34, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 16px !important;
    padding: 30px !important;
    backdrop-filter: blur(16px) !important;
  }
  /* Неоновое свечение кнопок */
  .t-btn:not(.t-btnflex_type_button2), .t-submit {
    box-shadow: 0 0 25px rgba(0, 245, 255, 0.45) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .t-btn:hover:not(.t-btnflex_type_button2), .t-submit:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 35px rgba(0, 245, 255, 0.7) !important;
  }
  /* Стеклянные поля формы */
  .t-input {
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    color: #FFFFFF !important;
  }
  .t-input:focus {
    border-color: #00F5FF !important;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.3) !important;
  }
</style>`;

      let cssCode = custom_css || sections.custom_css;
      if (!cssCode && presetKey === 'dark') {
        cssCode = darkNeonCss;
      } else if (cssCode && presetKey === 'dark' && !cssCode.includes('backdrop-filter')) {
        cssCode = `${darkNeonCss}\n${cssCode}`;
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
    style_preset: z.enum(['dark', 'minimal', 'warm']).optional().describe('Style preset override'),
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
