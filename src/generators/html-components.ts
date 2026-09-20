export interface HeroCTA {
  text: string;
  href?: string;
}

export interface HeroComponentData {
  badge?: string;
  title: string;
  subtitle?: string;
  descr?: string;
  backgroundUrl?: string;
  primaryCTA?: HeroCTA;
  secondaryCTA?: HeroCTA;
  btn1?: HeroCTA;
  btn2?: HeroCTA;
}

/**
 * Generates custom, production-grade semantic HTML with inline styles for the Hero section.
 */
export function generateHeroHTML(data: HeroComponentData): string {
  const bgUrl =
    data.backgroundUrl ||
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80';

  const subtitleText = data.subtitle || data.descr || '';
  const primary = data.primaryCTA || data.btn1 || { text: 'Подать заявление', href: '#form' };
  const secondary = data.secondaryCTA || data.btn2;

  const badgeHTML = data.badge
    ? `
    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 112, 213, 0.15); border: 1px solid rgba(0, 112, 213, 0.4); color: #00F5FF; border-radius: 100px; padding: 6px 18px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #00F5FF; display: inline-block;"></span>
      <span>${escapeHTML(data.badge)}</span>
    </div>`
    : '';

  const primaryBtnHTML = `
    <a href="${escapeHTML(primary.href || '#form')}" style="border-radius: 1408px; background: #0070D5; color: #FFFFFF; text-decoration: none; padding: 16px 38px; font-weight: 600; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(0, 112, 213, 0.35); transition: all 0.2s ease-in-out; border: none; cursor: pointer;">
      ${escapeHTML(primary.text)}
    </a>`;

  const secondaryBtnHTML = secondary
    ? `
    <a href="${escapeHTML(secondary.href || '#features')}" style="border-radius: 1408px; background: transparent; color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.4); text-decoration: none; padding: 16px 38px; font-weight: 600; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; margin-left: 16px; transition: all 0.2s ease-in-out; cursor: pointer;">
      ${escapeHTML(secondary.text)}
    </a>`
    : '';

  return `
<div class="custom-hero-section hero-premium" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; text-align: center; padding: 120px 24px 80px; box-sizing: border-box; overflow: hidden; background: linear-gradient(rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.78)), url('${bgUrl}') center center / cover no-repeat; font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 1080px; margin: 0 auto; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;">
    ${badgeHTML}
    <h1 style="font-size: clamp(40px, 5vw, 64px); font-weight: 800; color: #FFFFFF; line-height: 1.15; letter-spacing: -0.03em; margin: 0 0 24px 0; max-width: 960px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
      ${escapeHTML(data.title)}
    </h1>
    ${
      subtitleText
        ? `<p style="font-size: clamp(18px, 2vw, 22px); color: #E2E8F0; line-height: 1.6; margin: 0 auto 40px auto; max-width: 760px; font-weight: 400;">
      ${escapeHTML(subtitleText)}
    </p>`
        : ''
    }
    <div style="display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; align-items: center;">
      ${primaryBtnHTML}
      ${secondaryBtnHTML}
    </div>
  </div>
</div>
`.trim();
}

function escapeHTML(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
