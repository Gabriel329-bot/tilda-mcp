export const TEMPLATES = {
  // 1. HERO BLOCK (Гарантированно белый текст, HD-фон ЦОД, оверлей 80%, кнопка с темой)
  hero: `
<div class="relative w-full min-h-[90vh] flex items-center justify-center bg-black overflow-hidden {{THEME_FONT}}">
  <img src="{{BG_IMAGE}}" alt="Background" class="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90" />
  <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
  
  <div class="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[{{THEME_ACCENT}}]/10 border border-[{{THEME_ACCENT}}]/20 text-[{{THEME_ACCENT}}] text-xs font-semibold tracking-wider uppercase mb-8">
      <span class="w-2 h-2 rounded-full bg-[{{THEME_ACCENT}}] animate-pulse"></span>
      {{BADGE}}
    </div>
    
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl">
      {{TITLE}}
    </h1>
    
    <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
      {{SUBTITLE}}
    </p>
    
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a href="{{BTN1_HREF}}" onclick="if(typeof trackEvent==='function')trackEvent('cta_click',{button:'hero_primary'});" class="inline-flex items-center justify-center px-8 h-12 {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-sm transition-all duration-200 shadow-lg cursor-pointer">
        {{BTN1_TEXT}}
      </a>
      <a href="{{BTN2_HREF}}" class="inline-flex items-center justify-center px-8 h-12 {{THEME_RADIUS_BTN}} bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-sm transition-all duration-200 backdrop-blur-sm cursor-pointer">
        {{BTN2_TEXT}}
      </a>
    </div>
  </div>
</div>
`,

  // 1b. HERO LIGHT BLOCK (Студийный светлый фон, угольный заголовок, белые пилюли и кнопки)
  heroLight: `
<div class="relative w-full min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-white via-[#F5F5F7] to-[#F5F5F7] overflow-hidden {{THEME_FONT}} border-b border-black/[0.06]">
  <div class="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center flex flex-col items-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 {{THEME_RADIUS_BTN}} bg-white/80 border border-black/[0.08] shadow-sm text-[{{THEME_ACCENT}}] text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-md">
      <span class="w-2 h-2 rounded-full bg-[{{THEME_ACCENT}}] animate-pulse"></span>
      {{BADGE}}
    </div>
    
    <h1 class="text-5xl sm:text-7xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-[1.08] max-w-4xl">
      {{TITLE}}
    </h1>
    
    <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed font-normal">
      {{SUBTITLE}}
    </p>
    
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a href="{{BTN1_HREF}}" onclick="if(typeof trackEvent==='function')trackEvent('cta_click',{button:'hero_primary'});" class="inline-flex items-center justify-center px-8 h-12 {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
        {{BTN1_TEXT}}
      </a>
      <a href="{{BTN2_HREF}}" class="inline-flex items-center justify-center px-8 h-12 {{THEME_RADIUS_BTN}} bg-white hover:bg-slate-50 text-slate-900 border border-black/[0.1] shadow-sm font-medium text-sm transition-all duration-200 cursor-pointer">
        {{BTN2_TEXT}}
      </a>
    </div>
  </div>
</div>
`,

  // 2. BENTO FEATURES GRID (Подложка страницы, мягкие подложки карточек, настраиваемый радиус, SVG иконки, hover-эффект)
  bentoContainer: `
<section id="features" class="w-full py-24 {{THEME_BG_PAGE}} {{THEME_FONT}}">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold {{THEME_TEXT_PRIMARY}} tracking-tight mb-4">{{SECTION_TITLE}}</h2>
      <p class="text-base sm:text-lg {{THEME_TEXT_SECONDARY}}">{{SECTION_DESCR}}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {{CARDS}}
    </div>
  </div>
</section>
`,

  bentoCard: `
<div class="group relative flex flex-col justify-between p-7 {{THEME_RADIUS_CARD}} {{THEME_BG_CARD}} border {{THEME_BORDER}} hover:border-[{{THEME_ACCENT}}]/50 transition-all duration-200 shadow-sm">
  <div>
    <div class="w-12 h-12 {{THEME_RADIUS_CARD}} bg-[{{THEME_ACCENT}}]/10 border border-[{{THEME_ACCENT}}]/20 flex items-center justify-center text-[{{THEME_ACCENT}}] mb-6 group-hover:scale-105 transition-transform duration-200 shadow-sm">
      {{ICON_SVG}}
    </div>
    <h3 class="text-lg font-semibold {{THEME_TEXT_PRIMARY}} mb-2 leading-snug">{{TITLE}}</h3>
    <p class="text-sm {{THEME_TEXT_SECONDARY}} leading-relaxed">{{DESCR}}</p>
  </div>
  <div class="mt-6 pt-4 border-t {{THEME_BORDER}} flex items-center text-xs font-semibold text-[{{THEME_ACCENT}}] group-hover:translate-x-1 transition-transform">
    Подробнее <span class="ml-1">&rarr;</span>
  </div>
</div>
`,

  // 3. METRICS SECTION (Монохромные черные цифры, никаких синих заголовков)
  metricsContainer: `
<section id="metrics" class="w-full py-20 {{THEME_BG_PAGE}} border-y {{THEME_BORDER}} {{THEME_FONT}}">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-2xl sm:text-3xl font-bold {{THEME_TEXT_PRIMARY}} tracking-tight mb-2">{{SECTION_TITLE}}</h2>
      <p class="text-sm sm:text-base {{THEME_TEXT_SECONDARY}}">{{SECTION_DESCR}}</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {{ITEMS}}
    </div>
  </div>
</section>
`,

  metricItem: `
<div class="p-6 {{THEME_RADIUS_CARD}} {{THEME_BG_CARD}} border {{THEME_BORDER}} text-center shadow-sm">
  <div class="text-4xl sm:text-5xl font-extrabold {{THEME_TEXT_PRIMARY}} tracking-tight mb-2">{{VALUE}}</div>
  <div class="text-xs sm:text-sm font-medium {{THEME_TEXT_SECONDARY}} leading-snug">{{LABEL}}</div>
</div>
`,

  // 4. PRICING MONOLITH (Чистые цены, иконки галочек, динамические кнопки, переключатель периода)
  pricingContainer: `
<section id="pricing" class="w-full py-24 {{THEME_BG_PAGE}} {{THEME_FONT}}">
  <div class="max-w-5xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold {{THEME_TEXT_PRIMARY}} tracking-tight mb-4">{{SECTION_TITLE}}</h2>
      <p class="text-base {{THEME_TEXT_SECONDARY}}">{{SECTION_DESCR}}</p>
    </div>

    <div class="flex items-center justify-center gap-3 mb-12">
      <span class="text-sm font-medium {{THEME_TEXT_SECONDARY}}">Ежемесячно</span>
      <button type="button" onclick="toggleBillingPeriod()" id="billing-toggle-btn" class="w-12 h-6 flex items-center {{TOGGLE_TRACK_BG}} rounded-full p-1 duration-200 cursor-pointer border {{THEME_BORDER}}">
        <div id="billing-toggle-knob" class="bg-white w-4 h-4 rounded-full shadow-md transform duration-200"></div>
      </button>
      <span class="text-sm font-medium {{THEME_TEXT_PRIMARY}} flex items-center gap-1.5">
        Ежегодно <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">-20%</span>
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {{PLANS}}
    </div>
  </div>
  <script>
  function toggleBillingPeriod() {
    window.__billingIsYearly = !window.__billingIsYearly;
    var isYear = window.__billingIsYearly;
    var btn = document.getElementById('billing-toggle-btn');
    var knob = document.getElementById('billing-toggle-knob');
    if (btn && knob) {
      if (isYear) {
        btn.classList.remove('bg-slate-200', 'bg-white/10');
        btn.classList.add('bg-[{{THEME_ACCENT}}]');
        knob.classList.add('translate-x-6');
      } else {
        btn.classList.add('{{TOGGLE_TRACK_BG}}');
        btn.classList.remove('bg-[{{THEME_ACCENT}}]');
        knob.classList.remove('translate-x-6');
      }
    }
    var priceElements = document.querySelectorAll('.pricing-card-price');
    var periodElements = document.querySelectorAll('.pricing-card-period');
    priceElements.forEach(function(el) {
      var m = el.getAttribute('data-month');
      var y = el.getAttribute('data-year');
      if (isYear && y) {
        el.textContent = y;
      } else if (m) {
        el.textContent = m;
      }
    });
    periodElements.forEach(function(el) {
      el.textContent = isYear ? '/ год (-20%)' : '/ месяц';
    });
    if (typeof trackEvent === 'function') {
      trackEvent('billing_toggle', { period: isYear ? 'annual' : 'monthly' });
    }
  }
  </script>
</section>
`,

  pricingCard: `
<div class="flex flex-col justify-between p-8 sm:p-10 {{THEME_RADIUS_CARD}} {{CARD_BG_CLASS}} {{BORDER_CLASS}}">
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold {{PLAN_TITLE_CLASS}}">{{PLAN_NAME}}</h3>
      {{FEATURED_BADGE}}
    </div>
    <div class="mb-8">
      <span class="pricing-card-price text-4xl sm:text-5xl font-extrabold {{PRICE_CLASS}} tracking-tight" data-month="{{PRICE_MONTH}}" data-year="{{PRICE_YEAR}}">{{PRICE}}</span>
      <span class="pricing-card-period text-xs sm:text-sm {{PERIOD_CLASS}} ml-2 font-normal">/ {{PERIOD}}</span>
    </div>
    <ul class="space-y-3.5 mb-8">
      {{FEATURES_LIST}}
    </ul>
  </div>
  <a href="{{BTN_HREF}}" onclick="if(typeof trackEvent==='function')trackEvent('cta_click',{button:'pricing_plan'});" class="w-full inline-flex items-center justify-center h-12 {{THEME_RADIUS_BTN}} {{BTN_STYLE}} font-medium text-sm transition-all duration-200 cursor-pointer">
    {{BTN_TEXT}}
  </a>
</div>
`,

  // 5. CONTACT / FORM SECTION (Премиальная темная подложка, маска телефона, валидация и async отправка)
  contactSection: `
<style>html { scroll-behavior: smooth; }</style>
<script src="https://unpkg.com/imask" onload="initLeadPhoneMask()"></script>
<section id="form" class="w-full py-24 bg-black text-white {{THEME_FONT}} border-t border-white/10">
  <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[{{THEME_ACCENT}}]/10 text-[{{THEME_ACCENT}}] text-xs font-semibold uppercase tracking-wider mb-6">
        {{BADGE}}
      </div>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
        {{TITLE}}
      </h2>
      <p class="text-slate-400 text-base leading-relaxed mb-8">
        {{DESCR}}
      </p>
      <div class="space-y-4 text-sm text-slate-300">
        {{CONTACTS_LIST}}
      </div>
    </div>

    <div id="lead-form-container" class="p-8 {{THEME_RADIUS_CARD}} bg-[#111111] border border-white/10">
      <form id="lead-form" onsubmit="handleLeadSubmit(event)" class="space-y-4">
        <input type="text" name="_hp_company" style="display:none !important;" tabindex="-1" autocomplete="off" />
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1.5">Ваше имя</label>
          <input type="text" name="name" autocomplete="name" required placeholder="Константин" class="w-full h-11 px-4 {{THEME_RADIUS_CARD}} bg-[#1A1A1A] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[{{THEME_ACCENT}}] transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1.5">Номер телефона</label>
          <input type="tel" id="lead-phone" name="phone" autocomplete="tel" inputmode="tel" required placeholder="+7 (___) ___-__-__" class="w-full h-11 px-4 {{THEME_RADIUS_CARD}} bg-[#1A1A1A] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[{{THEME_ACCENT}}] transition-colors" />
          <p id="phone-error" class="hidden text-rose-500 text-xs mt-1.5 font-medium">Пожалуйста, укажите корректный номер телефона (11 цифр)</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1.5">Email для обратной связи</label>
          <input type="email" name="email" autocomplete="email" required placeholder="name@domain.com" class="w-full h-11 px-4 {{THEME_RADIUS_CARD}} bg-[#1A1A1A] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[{{THEME_ACCENT}}] transition-colors" />
        </div>
        <button type="submit" class="w-full h-12 mt-2 {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-sm transition-all duration-200 shadow-lg cursor-pointer">
          {{BTN_TEXT}}
        </button>
        <div id="lead-form-error" class="hidden text-rose-500 text-xs mt-3 text-center font-medium bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-lg"></div>
        <p class="text-[11px] text-slate-500 text-center mt-3">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </form>
    </div>
  </div>
</section>
<script>
function initLeadPhoneMask() {
  var phoneEl = document.getElementById('lead-phone');
  if (phoneEl && typeof IMask !== 'undefined') {
    IMask(phoneEl, { mask: '+{7} (000) 000-00-00' });
  }
  if (phoneEl) {
    phoneEl.addEventListener('input', function() {
      phoneEl.classList.remove('border-rose-500', 'ring-2', 'ring-rose-500/20');
      var err = document.getElementById('phone-error');
      if (err) err.classList.add('hidden');
    });
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeadPhoneMask);
} else {
  initLeadPhoneMask();
}

async function handleLeadSubmit(event) {
  event.preventDefault();
  var form = event.target;

  // Honeypot anti-spam check: silent drop
  var hp = form.querySelector('input[name="_hp_company"]');
  if (hp && hp.value) {
    var container = document.getElementById('lead-form-container');
    if (container) {
      container.innerHTML = \`
        <div class="py-8 px-4 text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2 tracking-tight">Заявка принята!</h3>
          <p class="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
            {{FORM_SUCCESS_TEXT}}
          </p>
        </div>
      \`;
    }
    return;
  }

  // Clear previous general error
  var generalErr = document.getElementById('lead-form-error');
  if (generalErr) generalErr.classList.add('hidden');

  // Strict 11-digit phone check
  var phoneEl = document.getElementById('lead-phone');
  if (phoneEl) {
    var phoneDigits = phoneEl.value.replace(/\\D/g, '');
    if (phoneDigits.length !== 11) {
      phoneEl.classList.add('border-rose-500', 'ring-2', 'ring-rose-500/20');
      var phoneErr = document.getElementById('phone-error');
      if (phoneErr) phoneErr.classList.remove('hidden');
      phoneEl.focus();
      return;
    }
  }

  var btn = form.querySelector('button[type="submit"]');
  var originalBtnText = btn.innerHTML;
  btn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Отправка...';
  btn.disabled = true;

  try {
    var formData = new FormData(form);
    formData.delete('_hp_company');
    var payload = Object.fromEntries(formData.entries());

    var webhook = '{{WEBHOOK_URL}}';
    var tgBotToken = '{{TG_BOT_TOKEN}}';
    var tgChatId = '{{TG_CHAT_ID}}';

    if (webhook && webhook !== '{{WEBHOOK_URL}}' && webhook.startsWith('http')) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else if (tgBotToken && tgBotToken !== '{{TG_BOT_TOKEN}}' && tgChatId && tgChatId !== '{{TG_CHAT_ID}}') {
      var name = payload.name || 'Не указано';
      var phone = payload.phone || 'Не указан';
      var email = payload.email || 'Не указан';
      var text = '🔥 <b>Новая заявка с сайта:</b>\\n\\n' +
        '👤 <b>Имя:</b> ' + name + '\\n' +
        '📞 <b>Телефон:</b> ' + phone + '\\n' +
        '✉️ <b>Email:</b> ' + email;
      await fetch('https://api.telegram.org/bot' + tgBotToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
    } else {
      // Offline fallback buffer in localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          var leads = JSON.parse(localStorage.getItem('tilda_offline_leads') || '[]');
          payload._saved_at = new Date().toISOString();
          leads.push(payload);
          localStorage.setItem('tilda_offline_leads', JSON.stringify(leads));
        }
      } catch (storageErr) {
        console.warn('LocalStorage leads buffer error:', storageErr);
      }
      await new Promise(function(r) { setTimeout(r, 600); });
    }

    if (typeof trackEvent === 'function') {
      trackEvent('lead_submit', { form: 'main_contact' });
    }

    var container = document.getElementById('lead-form-container');
    if (container) {
      container.innerHTML = \`
        <div class="py-8 px-4 text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2 tracking-tight">Заявка принята!</h3>
          <p class="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
            {{FORM_SUCCESS_TEXT}}
          </p>
          <button type="button" onclick="location.reload()" class="inline-flex items-center justify-center px-6 h-11 {{THEME_RADIUS_BTN}} bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all duration-200 border border-white/10 cursor-pointer">
            Отправить еще одну
          </button>
        </div>
      \`;
    }
  } catch (err) {
    console.error('Lead submit error:', err);
    btn.innerHTML = originalBtnText;
    btn.disabled = false;
    var errorEl = document.getElementById('lead-form-error');
    if (errorEl) {
      errorEl.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте снова.';
      errorEl.classList.remove('hidden');
    }
  }
}
</script>
`,

  // 5b. CONTACT / FORM SECTION LIGHT (Светлая подложка, белоснежная карточка, аккуратные инпуты)
  contactSectionLight: `
<style>html { scroll-behavior: smooth; }</style>
<script src="https://unpkg.com/imask" onload="initLeadPhoneMask()"></script>
<section id="form" class="w-full py-24 bg-[#F5F5F7] text-slate-900 {{THEME_FONT}} border-t border-black/[0.06]">
  <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 {{THEME_RADIUS_BTN}} bg-white border border-black/[0.08] shadow-sm text-[{{THEME_ACCENT}}] text-xs font-semibold uppercase tracking-wider mb-6">
        {{BADGE}}
      </div>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[#1D1D1F]">
        {{TITLE}}
      </h2>
      <p class="text-slate-600 text-base leading-relaxed mb-8">
        {{DESCR}}
      </p>
      <div class="space-y-4 text-sm text-slate-700">
        {{CONTACTS_LIST}}
      </div>
    </div>

    <div id="lead-form-container" class="p-8 {{THEME_RADIUS_CARD}} bg-white border border-black/[0.08] shadow-sm">
      <form id="lead-form" onsubmit="handleLeadSubmit(event)" class="space-y-4">
        <input type="text" name="_hp_company" style="display:none !important;" tabindex="-1" autocomplete="off" />
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Ваше имя</label>
          <input type="text" name="name" autocomplete="name" required placeholder="Константин" class="w-full h-11 px-4 {{THEME_RADIUS_CARD}} bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-[{{THEME_ACCENT}}] transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Номер телефона</label>
          <input type="tel" id="lead-phone" name="phone" autocomplete="tel" inputmode="tel" required placeholder="+7 (___) ___-__-__" class="w-full h-11 px-4 {{THEME_RADIUS_CARD}} bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-[{{THEME_ACCENT}}] transition-colors" />
          <p id="phone-error" class="hidden text-rose-500 text-xs mt-1.5 font-medium">Пожалуйста, укажите корректный номер телефона (11 цифр)</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1.5">Email для обратной связи</label>
          <input type="email" name="email" autocomplete="email" required placeholder="name@domain.com" class="w-full h-11 px-4 {{THEME_RADIUS_CARD}} bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-[{{THEME_ACCENT}}] transition-colors" />
        </div>
        <button type="submit" class="w-full h-12 mt-2 {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
          {{BTN_TEXT}}
        </button>
        <div id="lead-form-error" class="hidden text-rose-500 text-xs mt-3 text-center font-medium bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-lg"></div>
        <p class="text-[11px] text-slate-400 text-center mt-3">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </form>
    </div>
  </div>
</section>
<script>
function initLeadPhoneMask() {
  var phoneEl = document.getElementById('lead-phone');
  if (phoneEl && typeof IMask !== 'undefined') {
    IMask(phoneEl, { mask: '+{7} (000) 000-00-00' });
  }
  if (phoneEl) {
    phoneEl.addEventListener('input', function() {
      phoneEl.classList.remove('border-rose-500', 'ring-2', 'ring-rose-500/20');
      var err = document.getElementById('phone-error');
      if (err) err.classList.add('hidden');
    });
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeadPhoneMask);
} else {
  initLeadPhoneMask();
}

async function handleLeadSubmit(event) {
  event.preventDefault();
  var form = event.target;

  // Honeypot anti-spam check: silent drop
  var hp = form.querySelector('input[name="_hp_company"]');
  if (hp && hp.value) {
    var container = document.getElementById('lead-form-container');
    if (container) {
      container.innerHTML = \`
        <div class="py-8 px-4 text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="text-2xl font-bold text-[#1D1D1F] mb-2 tracking-tight">Заявка принята!</h3>
          <p class="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
            {{FORM_SUCCESS_TEXT}}
          </p>
        </div>
      \`;
    }
    return;
  }

  // Clear previous general error
  var generalErr = document.getElementById('lead-form-error');
  if (generalErr) generalErr.classList.add('hidden');

  // Strict 11-digit phone check
  var phoneEl = document.getElementById('lead-phone');
  if (phoneEl) {
    var phoneDigits = phoneEl.value.replace(/\\D/g, '');
    if (phoneDigits.length !== 11) {
      phoneEl.classList.add('border-rose-500', 'ring-2', 'ring-rose-500/20');
      var phoneErr = document.getElementById('phone-error');
      if (phoneErr) phoneErr.classList.remove('hidden');
      phoneEl.focus();
      return;
    }
  }

  var btn = form.querySelector('button[type="submit"]');
  var originalBtnText = btn.innerHTML;
  btn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Отправка...';
  btn.disabled = true;

  try {
    var formData = new FormData(form);
    formData.delete('_hp_company');
    var payload = Object.fromEntries(formData.entries());

    var webhook = '{{WEBHOOK_URL}}';
    var tgBotToken = '{{TG_BOT_TOKEN}}';
    var tgChatId = '{{TG_CHAT_ID}}';

    if (webhook && webhook !== '{{WEBHOOK_URL}}' && webhook.startsWith('http')) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else if (tgBotToken && tgBotToken !== '{{TG_BOT_TOKEN}}' && tgChatId && tgChatId !== '{{TG_CHAT_ID}}') {
      var name = payload.name || 'Не указано';
      var phone = payload.phone || 'Не указан';
      var email = payload.email || 'Не указан';
      var text = '🔥 <b>Новая заявка с сайта:</b>\\n\\n' +
        '👤 <b>Имя:</b> ' + name + '\\n' +
        '📞 <b>Телефон:</b> ' + phone + '\\n' +
        '✉️ <b>Email:</b> ' + email;
      await fetch('https://api.telegram.org/bot' + tgBotToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
    } else {
      // Offline fallback buffer in localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          var leads = JSON.parse(localStorage.getItem('tilda_offline_leads') || '[]');
          payload._saved_at = new Date().toISOString();
          leads.push(payload);
          localStorage.setItem('tilda_offline_leads', JSON.stringify(leads));
        }
      } catch (storageErr) {
        console.warn('LocalStorage leads buffer error:', storageErr);
      }
      await new Promise(function(r) { setTimeout(r, 600); });
    }

    if (typeof trackEvent === 'function') {
      trackEvent('lead_submit', { form: 'main_contact' });
    }

    var container = document.getElementById('lead-form-container');
    if (container) {
      container.innerHTML = \`
        <div class="py-8 px-4 text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="text-2xl font-bold text-[#1D1D1F] mb-2 tracking-tight">Заявка принята!</h3>
          <p class="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
            {{FORM_SUCCESS_TEXT}}
          </p>
          <button type="button" onclick="location.reload()" class="inline-flex items-center justify-center px-6 h-11 {{THEME_RADIUS_BTN}} bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-all duration-200 border border-slate-200 cursor-pointer">
            Отправить еще одну
          </button>
        </div>
      \`;
    }
  } catch (err) {
    console.error('Lead submit error:', err);
    btn.innerHTML = originalBtnText;
    btn.disabled = false;
    var errorEl = document.getElementById('lead-form-error');
    if (errorEl) {
      errorEl.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте снова.';
      errorEl.classList.remove('hidden');
    }
  }
}
</script>
`,

  // 6. FAQ ACCORDION (Интерактивный нативный аккордеон с SVG-стрелками и плавной анимацией)
  faqContainer: `
<section id="faq" class="w-full py-20 {{THEME_BG_PAGE}} {{THEME_FONT}} border-t {{THEME_BORDER}}">
  <div class="max-w-4xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-bold {{THEME_TEXT_PRIMARY}} tracking-tight mb-3">{{SECTION_TITLE}}</h2>
      <p class="text-base {{THEME_TEXT_SECONDARY}}">{{SECTION_DESCR}}</p>
    </div>
    <div class="space-y-4">
      {{ITEMS}}
    </div>
  </div>
</section>
`,

  faqItem: `
<details class="group mb-4 {{THEME_RADIUS_CARD}} {{THEME_BG_CARD}} border {{THEME_BORDER}} p-5 transition-all">
  <summary class="flex justify-between items-center font-semibold {{THEME_TEXT_PRIMARY}} cursor-pointer list-none select-none">
    <span class="text-base {{THEME_TEXT_PRIMARY}} font-medium pr-4">{{QUESTION}}</span>
    <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[{{THEME_ACCENT}}]/10 border border-[{{THEME_ACCENT}}]/20 flex items-center justify-center text-[{{THEME_ACCENT}}] transition-transform duration-200 group-open:rotate-180">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </span>
  </summary>
  <div class="text-sm {{THEME_TEXT_SECONDARY}} mt-3 leading-relaxed border-t {{THEME_BORDER}} pt-3">
    {{ANSWER}}
  </div>
</details>
`,

  // 7. FOOTER SECTION (Премиальный темный подвал, моноширинная версия, копирайт)
  footerSection: `
<footer class="w-full py-12 bg-[#0B0F17] text-slate-400 {{THEME_FONT}} border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-3">
      <span class="text-lg font-bold tracking-tight text-white">{{PROJECT_NAME}}</span>
      <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">v2.4</span>
    </div>
    
    <div class="text-xs text-slate-500 text-center sm:text-right">
      © {{YEAR}} {{PROJECT_NAME}}. Все права защищены. High-performance infrastructure.
    </div>
  </div>
</footer>
`,

  // 7b. FOOTER SECTION LIGHT (Светлый подвал, угольный логотип, мягкая подложка)
  footerSectionLight: `
<footer class="w-full py-12 bg-[#ECECEE] text-slate-600 {{THEME_FONT}} border-t border-black/[0.06]">
  <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-3">
      <span class="text-lg font-bold tracking-tight text-[#1D1D1F]">{{PROJECT_NAME}}</span>
      <span class="text-xs px-2 py-0.5 rounded bg-white border border-black/[0.08] text-slate-600 font-mono shadow-sm">v2.4</span>
    </div>
    
    <div class="text-xs text-slate-500 text-center sm:text-right">
      © {{YEAR}} {{PROJECT_NAME}}. Все права защищены. High-performance platform.
    </div>
  </div>
</footer>
`,

  // 8. MARQUEE / SOCIAL PROOF (Бегущая строка партнеров и технологий)
  marqueeSection: `
<section class="w-full py-10 {{THEME_BG_PAGE}} border-y {{THEME_BORDER}} overflow-hidden {{THEME_FONT}}">
  <div class="max-w-7xl mx-auto px-6 mb-4 text-center">
    <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Технологические партнеры и стек</p>
  </div>
  <div class="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
    <div class="flex w-max animate-[marquee_25s_linear_infinite] gap-12 text-slate-400 text-sm font-semibold tracking-wide uppercase">
      {{ITEMS}}
      {{ITEMS}}
    </div>
  </div>
  <style>
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  </style>
</section>
`,

  // 9. TIMELINE / ROADMAP (Этапы работы / Шаги внедрения)
  timelineSection: `
<section id="timeline" class="w-full py-24 {{THEME_BG_PAGE}} {{THEME_FONT}}">
  <div class="max-w-5xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight {{THEME_TEXT_PRIMARY}} mb-4">{{TITLE}}</h2>
      <p class="{{THEME_TEXT_SECONDARY}} text-base">{{DESCR}}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
      {{STEPS}}
    </div>
  </div>
</section>
`,

  timelineStep: `
<div class="relative flex flex-col p-6 {{THEME_RADIUS_CARD}} {{THEME_BG_CARD}} border {{THEME_BORDER}} shadow-sm">
  <div class="text-3xl font-extrabold text-[{{THEME_ACCENT}}] opacity-30 font-mono mb-3">{{STEP_NUM}}</div>
  <h3 class="text-lg font-bold {{THEME_TEXT_PRIMARY}} mb-2">{{STEP_TITLE}}</h3>
  <p class="text-xs sm:text-sm {{THEME_TEXT_SECONDARY}} leading-relaxed">{{STEP_DESCR}}</p>
</div>
`,

  // 10. INTERACTIVE CALCULATOR (Конфигуратор и расчет стоимости)
  calculatorSection: `
<section id="calculator" class="w-full py-24 {{THEME_BG_PAGE}} border-t {{THEME_BORDER}} {{THEME_FONT}}">
  <div class="max-w-4xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight {{THEME_TEXT_PRIMARY}} mb-4">{{TITLE}}</h2>
      <p class="{{THEME_TEXT_SECONDARY}} text-base">{{DESCR}}</p>
    </div>
    <div class="p-8 sm:p-10 {{THEME_RADIUS_CARD}} {{THEME_BG_CARD}} border {{THEME_BORDER}} shadow-sm">
      <div class="space-y-6 mb-8">
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium {{THEME_TEXT_PRIMARY}}">{{CALC_INPUT_LABEL}}:</span>
            <span id="calc-val-display" class="text-lg font-bold text-[{{THEME_ACCENT}}]">{{CALC_DEFAULT}} {{CALC_UNIT_LABEL}}</span>
          </div>
          <input id="calc-slider" type="range" min="{{CALC_MIN}}" max="{{CALC_MAX}}" step="{{CALC_STEP}}" value="{{CALC_DEFAULT}}" class="w-full accent-[{{THEME_ACCENT}}] cursor-pointer" oninput="updateCalculator(this.value)" />
        </div>
      </div>
      <div class="pt-6 border-t {{THEME_BORDER}} flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div class="text-xs {{THEME_TEXT_SECONDARY}}">Ориентировочная стоимость:</div>
          <div id="calc-total" class="text-3xl sm:text-4xl font-extrabold {{THEME_TEXT_PRIMARY}}">{{CALC_INITIAL_TOTAL}} ₽ <span class="text-sm font-normal {{THEME_TEXT_SECONDARY}}">/ мес</span></div>
        </div>
        <a href="#form" onclick="if(typeof trackEvent==='function')trackEvent('cta_click',{button:'calc_primary'});" class="h-12 px-8 inline-flex items-center justify-center {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-sm transition-all shadow-md cursor-pointer">
          {{CALC_BTN_TEXT}}
        </a>
      </div>
    </div>
  </div>
  <script>
    var calcDebounceTimer = null;
    function updateCalculator(val) {
      var disp = document.getElementById('calc-val-display');
      if (disp) disp.innerText = val + ' {{CALC_UNIT_LABEL}}';
      var base = {{CALC_BASE_PRICE}};
      var total = Number(val) * base;
      var totalElem = document.getElementById('calc-total');
      if (totalElem) totalElem.innerHTML = total.toLocaleString('ru-RU') + ' ₽ <span class="text-sm font-normal {{THEME_TEXT_SECONDARY}}">/ мес</span>';

      clearTimeout(calcDebounceTimer);
      calcDebounceTimer = setTimeout(function() {
        if (typeof trackEvent === 'function') {
          trackEvent('calc_interact', { value: Number(val) });
        }
      }, 500);
    }
  </script>
</section>
`,

  // 11. GLOBAL CRO OVERLAYS (Sticky Bar, Social Proof Toast, Cookie Banner)
  croOverlays: `
<style>@media (max-width: 639px) { body { padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important; } }</style>
<!-- Sticky Mobile CTA Bar -->
<div id="sticky-mobile-cta" style="padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));" class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden flex items-center justify-between shadow-lg">
  <div class="flex flex-col pr-3">
    <span class="text-xs font-semibold text-slate-900 leading-tight">{{STICKY_CTA_TITLE}}</span>
    <span class="text-[10px] text-slate-500">{{STICKY_CTA_SUBTITLE}}</span>
  </div>
  <a href="#form" onclick="if(typeof trackEvent==='function')trackEvent('cta_click',{button:'sticky_mobile_cta'});" class="h-9 px-5 inline-flex items-center justify-center {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-xs shadow-md whitespace-nowrap">
    {{STICKY_CTA_BTN}}
  </a>
</div>

<!-- Social Proof Toast -->
<div id="social-proof-toast" class="fixed bottom-5 left-5 z-40 max-w-sm rounded-lg bg-slate-900 text-white p-3.5 shadow-xl border border-white/10 text-xs hidden sm:flex items-center gap-3 transition-opacity duration-300">
  <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold">✓</div>
  <div class="flex-1">
    <p class="font-medium text-slate-200" id="toast-message">{{SOCIAL_PROOF_MSG}}</p>
    <p class="text-[10px] text-slate-400" id="toast-time">Только что</p>
  </div>
  <button type="button" onclick="document.getElementById('social-proof-toast').remove()" class="text-slate-400 hover:text-white p-1 text-sm leading-none cursor-pointer">&times;</button>
</div>

<!-- Cookie Consent Banner -->
<div id="cookie-consent-banner" class="fixed bottom-20 sm:bottom-4 right-4 z-40 max-w-md bg-white border border-slate-200 rounded-xl p-4 shadow-xl text-xs text-slate-600 hidden items-center justify-between gap-4">
  <p class="leading-normal">Мы используем файлы cookie для персонализации сервиса и аналитики.</p>
  <button type="button" onclick="acceptCookies()" class="px-4 py-2 {{THEME_RADIUS_BTN}} bg-slate-900 hover:bg-black text-white text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer">
    Принять
  </button>
</div>

<script>
function acceptCookies() {
  if (typeof localStorage !== 'undefined') localStorage.setItem('cookie_consent', 'accepted');
  var b = document.getElementById('cookie-consent-banner');
  if (b) b.remove();
}
(function() {
  if (typeof localStorage !== 'undefined' && !localStorage.getItem('cookie_consent')) {
    var b = document.getElementById('cookie-consent-banner');
    if (b) {
      b.classList.remove('hidden');
      b.classList.add('flex');
    }
  }
  var toast = document.getElementById('social-proof-toast');
  if (toast) {
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { if (toast && toast.parentNode) toast.remove(); }, 500);
    }, 8000);
  }
})();
</script>
`
};
