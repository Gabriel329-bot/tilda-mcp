export const TEMPLATES = {
  // 1. HERO BLOCK (Гарантированно белый текст, HD-фон ЦОД, оверлей 80%, pill-кнопка)
  hero: `
<div class="relative w-full min-h-[90vh] flex items-center justify-center bg-black overflow-hidden font-['Open_Sans',sans-serif]">
  <img src="{{BG_IMAGE}}" alt="Background" class="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90" />
  <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
  
  <div class="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center flex flex-col items-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0070D5] text-xs font-semibold tracking-wider uppercase mb-8">
      <span class="w-2 h-2 rounded-full bg-[#0070D5] animate-pulse"></span>
      {{BADGE}}
    </div>
    
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl">
      {{TITLE}}
    </h1>
    
    <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
      {{SUBTITLE}}
    </p>
    
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a href="{{BTN1_HREF}}" class="inline-flex items-center justify-center px-8 h-12 rounded-[1408px] bg-[#0070D5] hover:bg-blue-600 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer">
        {{BTN1_TEXT}}
      </a>
      <a href="{{BTN2_HREF}}" class="inline-flex items-center justify-center px-8 h-12 rounded-[1408px] bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-sm transition-all duration-200 backdrop-blur-sm cursor-pointer">
        {{BTN2_TEXT}}
      </a>
    </div>
  </div>
</div>
`,

  // 2. BENTO FEATURES GRID (Белый контейнер, мягкие подложки #F8FAFC, 4px углы, SVG иконки, hover-эффект)
  bentoContainer: `
<section id="features" class="w-full py-24 bg-white font-['Open_Sans',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">{{SECTION_TITLE}}</h2>
      <p class="text-base sm:text-lg text-slate-500">{{SECTION_DESCR}}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {{CARDS}}
    </div>
  </div>
</section>
`,

  bentoCard: `
<div class="group relative flex flex-col justify-between p-7 rounded-[4px] bg-[#F8FAFC] border border-slate-200/80 hover:border-[#0070D5]/50 transition-all duration-200">
  <div>
    <div class="w-12 h-12 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-[#0070D5] mb-6 group-hover:scale-105 transition-transform duration-200 shadow-sm">
      {{ICON_SVG}}
    </div>
    <h3 class="text-lg font-semibold text-slate-900 mb-2 leading-snug">{{TITLE}}</h3>
    <p class="text-sm text-slate-600 leading-relaxed">{{DESCR}}</p>
  </div>
  <div class="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-[#0070D5] group-hover:translate-x-1 transition-transform">
    Подробнее <span class="ml-1">&rarr;</span>
  </div>
</div>
`,

  // 3. METRICS SECTION (Монохромные черные цифры, никаких синих заголовков)
  metricsContainer: `
<section id="metrics" class="w-full py-20 bg-slate-50 border-y border-slate-200/60 font-['Open_Sans',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">{{SECTION_TITLE}}</h2>
      <p class="text-sm sm:text-base text-slate-500">{{SECTION_DESCR}}</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {{ITEMS}}
    </div>
  </div>
</section>
`,

  metricItem: `
<div class="p-6 rounded-[4px] bg-white border border-slate-200/80 text-center shadow-sm">
  <div class="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-2">{{VALUE}}</div>
  <div class="text-xs sm:text-sm font-medium text-slate-500 leading-snug">{{LABEL}}</div>
</div>
`,

  // 4. PRICING MONOLITH (Чистые цены, иконки галочек, Pill-кнопки)
  pricingContainer: `
<section id="pricing" class="w-full py-24 bg-white font-['Open_Sans',sans-serif]">
  <div class="max-w-5xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">{{SECTION_TITLE}}</h2>
      <p class="text-base text-slate-500">{{SECTION_DESCR}}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {{PLANS}}
    </div>
  </div>
</section>
`,

  pricingCard: `
<div class="flex flex-col justify-between p-8 sm:p-10 rounded-[4px] bg-[#F8FAFC] border {{BORDER_CLASS}}">
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-slate-900">{{PLAN_NAME}}</h3>
      {{FEATURED_BADGE}}
    </div>
    <div class="mb-8">
      <span class="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">{{PRICE}}</span>
      <span class="text-xs sm:text-sm text-slate-500 ml-2 font-normal">/ {{PERIOD}}</span>
    </div>
    <ul class="space-y-3.5 mb-8">
      {{FEATURES_LIST}}
    </ul>
  </div>
  <a href="#form" class="w-full inline-flex items-center justify-center h-12 rounded-[1408px] {{BTN_STYLE}} font-medium text-sm transition-all duration-200 cursor-pointer">
    {{BTN_TEXT}}
  </a>
</div>
`,

  // 5. CONTACT / FORM SECTION (Премиальная темная подложка, маска телефона, валидация и async отправка)
  contactSection: `
<style>html { scroll-behavior: smooth; }</style>
<script src="https://unpkg.com/imask" onload="initLeadPhoneMask()"></script>
<section id="form" class="w-full py-24 bg-black text-white font-['Open_Sans',sans-serif] border-t border-white/10">
  <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-[#0070D5] text-xs font-semibold uppercase tracking-wider mb-6">
        Приемная комиссия
      </div>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
        {{TITLE}}
      </h2>
      <p class="text-slate-400 text-base leading-relaxed mb-8">
        {{DESCR}}
      </p>
      <div class="space-y-4 text-sm text-slate-300">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#0070D5]">📍</span>
          <span>г. Москва, ул. Большая Спасская, д. 15</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#0070D5]">📞</span>
          <span>+7 (495) 123-45-67</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#0070D5]">✉️</span>
          <span>priem@kc54.ru</span>
        </div>
      </div>
    </div>

    <div id="lead-form-container" class="p-8 rounded-[4px] bg-[#111111] border border-white/10">
      <form id="lead-form" onsubmit="handleLeadSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1.5">Ваше имя</label>
          <input type="text" name="name" required placeholder="Константин" class="w-full h-11 px-4 rounded-[4px] bg-[#1A1A1A] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#0070D5] transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1.5">Номер телефона</label>
          <input type="tel" id="lead-phone" name="phone" required placeholder="+7 (___) ___-__-__" class="w-full h-11 px-4 rounded-[4px] bg-[#1A1A1A] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#0070D5] transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1.5">Email для обратной связи</label>
          <input type="email" name="email" required placeholder="name@domain.com" class="w-full h-11 px-4 rounded-[4px] bg-[#1A1A1A] border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#0070D5] transition-colors" />
        </div>
        <button type="submit" class="w-full h-12 mt-2 rounded-[1408px] bg-[#0070D5] hover:bg-blue-600 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer">
          {{BTN_TEXT}}
        </button>
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
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeadPhoneMask);
} else {
  initLeadPhoneMask();
}

async function handleLeadSubmit(event) {
  event.preventDefault();
  var form = event.target;
  var btn = form.querySelector('button[type="submit"]');
  var originalBtnText = btn.innerHTML;
  btn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Отправка...';
  btn.disabled = true;

  try {
    var webhook = '{{WEBHOOK_URL}}';
    if (webhook && webhook !== '{{WEBHOOK_URL}}' && webhook.startsWith('http')) {
      var formData = new FormData(form);
      var payload = Object.fromEntries(formData.entries());
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await new Promise(function(r) { setTimeout(r, 800); });
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
            Менеджер приемной комиссии свяжется с вами в ближайшее время по указанному номеру телефона.
          </p>
          <button type="button" onclick="location.reload()" class="inline-flex items-center justify-center px-6 h-11 rounded-[1408px] bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all duration-200 border border-white/10 cursor-pointer">
            Отправить еще одну
          </button>
        </div>
      \`;
    }
  } catch (err) {
    console.error('Lead submit error:', err);
    btn.innerHTML = originalBtnText;
    btn.disabled = false;
    alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте снова.');
  }
}
</script>
`,

  // 6. FAQ ACCORDION (Интерактивный нативный аккордеон с SVG-стрелками и плавной анимацией)
  faqContainer: `
<section id="faq" class="w-full py-20 bg-white font-['Open_Sans',sans-serif] border-t border-slate-200/60">
  <div class="max-w-4xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-bold text-slate-900 tracking-tight mb-3">{{SECTION_TITLE}}</h2>
      <p class="text-base text-slate-500">{{SECTION_DESCR}}</p>
    </div>
    <div class="space-y-4">
      {{ITEMS}}
    </div>
  </div>
</section>
`,

  faqItem: `
<details class="group mb-4 rounded-[4px] bg-[#F8FAFC] border border-slate-200/80 p-5 transition-all">
  <summary class="flex justify-between items-center font-semibold text-slate-900 cursor-pointer list-none select-none">
    <span class="text-base text-slate-900 pr-4">{{QUESTION}}</span>
    <span class="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#0070D5] transition-transform duration-200 group-open:rotate-180">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </span>
  </summary>
  <div class="text-sm text-slate-600 mt-3 leading-relaxed border-t border-slate-200/50 pt-3">
    {{ANSWER}}
  </div>
</details>
`
};
