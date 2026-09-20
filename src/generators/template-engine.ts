import { TEMPLATES } from '../templates/html-templates.js';
import { getIcon, ICONS } from '../templates/icons.js';

export class TemplateEngine {
  static renderHero(data: any, bgImage: string): string {
    return TEMPLATES.hero
      .replace('{{BG_IMAGE}}', bgImage)
      .replace('{{BADGE}}', data.badge || 'ИНЖЕНЕРНЫЙ ЦЕНТР')
      .replace('{{TITLE}}', data.title || '')
      .replace('{{SUBTITLE}}', data.descr || data.subtitle || '')
      .replace('{{BTN1_TEXT}}', data.btn1?.text || data.btn_text || 'Выбрать профиль')
      .replace('{{BTN1_HREF}}', data.btn1?.href || data.btn_href || '#features')
      .replace('{{BTN2_TEXT}}', data.btn2?.text || data.btn2_text || 'Условия приема')
      .replace('{{BTN2_HREF}}', data.btn2?.href || data.btn2_href || '#pricing');
  }

  static renderBento(data: any): string {
    const cards = (data.items || []).map((item: any) => {
      return TEMPLATES.bentoCard
        .replace('{{ICON_SVG}}', getIcon(item.title))
        .replace('{{TITLE}}', item.title || '')
        .replace('{{DESCR}}', item.descr || '');
    }).join('\n');

    return TEMPLATES.bentoContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Оснащение полигонов')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{CARDS}}', cards);
  }

  static renderMetrics(data: any): string {
    const items = (data.items || []).map((item: any) => {
      return TEMPLATES.metricItem
        .replace('{{VALUE}}', item.num || item.title || '')
        .replace('{{LABEL}}', item.descr || '');
    }).join('\n');

    return TEMPLATES.metricsContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Показатели')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{ITEMS}}', items);
  }

  static renderPricing(data: any): string {
    const plans = (data.plans || []).map((plan: any) => {
      const isFeatured = plan.is_featured;
      const borderClass = isFeatured ? 'border-2 border-[#0070D5] shadow-md bg-white' : 'border border-slate-200';
      const badge = isFeatured 
        ? '<span class="px-2.5 py-0.5 rounded-[4px] bg-blue-50 text-[#0070D5] text-xs font-semibold uppercase">Выбор года</span>' 
        : '';
      const btnStyle = isFeatured 
        ? 'bg-[#0070D5] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20' 
        : 'bg-slate-200 hover:bg-slate-300 text-slate-800';

      const featuresList = (plan.features || []).map((f: string) => `
        <li class="flex items-start gap-3 text-sm text-slate-700">
          <span class="mt-0.5 flex-shrink-0">${ICONS.check}</span>
          <span>${f}</span>
        </li>
      `).join('');

      return TEMPLATES.pricingCard
        .replace('{{PLAN_NAME}}', plan.name || '')
        .replace('{{BORDER_CLASS}}', borderClass)
        .replace('{{FEATURED_BADGE}}', badge)
        .replace('{{PRICE}}', plan.price || '0 ₽')
        .replace('{{PERIOD}}', plan.period || '')
        .replace('{{FEATURES_LIST}}', featuresList)
        .replace('{{BTN_STYLE}}', btnStyle)
        .replace('{{BTN_TEXT}}', plan.btn_text || 'Подать заявку');
    }).join('\n');

    return TEMPLATES.pricingContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Формы обучения')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{PLANS}}', plans);
  }

  static renderContact(data: any): string {
    return TEMPLATES.contactSection
      .replace('{{TITLE}}', data.title || 'Запись на ознакомительный визит')
      .replace('{{DESCR}}', data.descr || '')
      .replace('{{BTN_TEXT}}', data.btn_text || 'Записаться на визит');
  }
}
