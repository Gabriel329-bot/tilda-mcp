/**
 * CLUBHOUSE: Architectural Monograph Landing Templates (14 Screens)
 * Project: Boutique Clubhouse Residential Building (17 Residences, 1 Penthouse, 1 Commercial Gallery, 10 City-Boxes)
 * Aesthetics: "Architectural Quiet Luxury", dry limestone (#F7F5F0), gallery white (#FFFFFF), dark bronze (#8E734E), bistre charcoal (#1A1816).
 */

export const CLUBHOUSE_TEMPLATES = {
  // 1. ARCHITECTURAL HEADER (Клеймо дома, статус стройки, прямой телефон, Telegram, персональный визит)
  header: `
<header class="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif] transition-all duration-300">
  <div class="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
    <!-- Brand Hallmark & Address -->
    <a href="#" class="flex flex-col text-left group">
      <span class="font-['Cormorant_Garamond',serif] text-2xl sm:text-[26px] font-medium tracking-tight text-[#1A1816] group-hover:text-[#8E734E] transition-colors">
        БОЛЬШАЯ ПОЛЯНКА, 14
      </span>
      <span class="text-[9px] uppercase tracking-[0.22em] text-[#62605B] -mt-1 font-mono">
        Клубный дом на 17 резиденций
      </span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#1A1816]">
      <a href="#hero" class="hover:text-[#8E734E] transition-colors">О доме</a>
      <a href="#catalog" class="hover:text-[#8E734E] transition-colors">Коллекция лотов</a>
      <a href="#manifesto" class="hover:text-[#8E734E] transition-colors">Приватность</a>
      <a href="#materials" class="hover:text-[#8E734E] transition-colors">Конструктив</a>
      <a href="#lobby" class="hover:text-[#8E734E] transition-colors">Лобби и сад</a>
      <a href="#location" class="hover:text-[#8E734E] transition-colors">Окружение</a>
      <a href="#docs" class="hover:text-[#8E734E] transition-colors">Документы</a>
    </nav>

    <!-- Milestone, Contacts & CTA -->
    <div class="flex items-center gap-4 sm:gap-6">
      <!-- Construction milestone badge -->
      <div class="hidden sm:flex flex-col text-right">
        <span class="text-[10px] uppercase tracking-wider text-[#62605B] font-mono">Готовность дома</span>
        <span class="text-xs font-bold text-[#1A1816]">IV кв. 2026 года</span>
      </div>

      <!-- Phone link -->
      <a href="tel:+74952411414" class="hidden md:inline-flex text-xs font-semibold text-[#1A1816] hover:text-[#8E734E] transition-colors font-mono">
        +7 (495) 241-14-14
      </a>

      <!-- Personal Visit Modal Button -->
      <a href="#booking-modal" onclick="openLotBooking('VISIT-SHOWROOM', 'Персональный визит')" class="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-[#1A1816] hover:bg-[#2C2925] text-white text-[11px] font-semibold uppercase tracking-[0.16em] transition-all shadow-sm hover:shadow-md cursor-pointer">
        <span>Персональный визит</span>
        <svg class="w-3.5 h-3.5 text-[#8E734E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
      </a>
    </div>
  </div>
</header>
`,

  // 2. HERO SECTION (Интерактивный фасад День/Сумерки, H1, 4 архитектурных факта)
  hero: `
<section id="hero" class="relative w-full pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#F7F5F0] overflow-hidden font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Top Eyebrow & Headline -->
    <div class="max-w-4xl mb-12 text-left">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#1A1816]/[0.08] text-[11px] font-mono uppercase tracking-[0.2em] text-[#1A1816] mb-6 shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-[#8E734E]"></span>
        КЛУБНЫЙ ДОМ В ТИХОМ ЦЕНТРЕ // 28 ЛОТОВ
      </div>

      <h1 class="font-['Cormorant_Garamond',serif] text-4xl sm:text-6xl lg:text-[72px] font-normal leading-[1.08] text-[#1A1816] tracking-tight mb-6">
        Камерный объем для тех, кто ценит <span class="italic font-normal text-[#8E734E]">приватность выше масштаба</span>
      </h1>

      <p class="text-base sm:text-xl text-[#62605B] font-light leading-relaxed max-w-2xl">
        Архитектурная монография клубного дома на 17 резиденций, пентхаус с видовой террасой и частную галерею в историческом анклаве Полянки.
      </p>
    </div>

    <!-- Interactive Facade Screen: Day / Dusk Crossfade Switcher -->
    <div class="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-[#1A1816]/[0.08] shadow-2xl bg-[#EFECE6] mb-12 group">
      <!-- Day facade image -->
      <img id="facade-day" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85" alt="Фасад дома на Полянке в дневном свете" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 filter brightness-[0.97]" />
      
      <!-- Dusk facade image with architectural illumination -->
      <img id="facade-night" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85" alt="Фасад дома в вечерней подсветке" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 filter brightness-[0.95]" />

      <!-- Subtle vignette overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

      <!-- Facade Switcher Floating Pill -->
      <div class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#1A1816]/75 backdrop-blur-md border border-white/20 shadow-xl max-w-[calc(100%-2rem)]">
        <button type="button" onclick="switchFacadeMode('day')" id="btn-facade-day" class="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-white/25 transition-all">
          ☀️ Дневной свет
        </button>
        <button type="button" onclick="switchFacadeMode('night')" id="btn-facade-night" class="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white/70 hover:text-white transition-all">
          🌙 Сумерки и подсветка
        </button>
      </div>

      <!-- Left Bottom Location Overlay -->
      <div class="absolute bottom-6 left-6 z-20 hidden sm:flex flex-col text-white">
        <span class="text-[10px] uppercase tracking-[0.2em] font-mono text-white/70">Локация</span>
        <span class="font-['Cormorant_Garamond',serif] text-xl font-medium">ЦАО, переулок в 300 метрах от набережной</span>
      </div>
    </div>

    <!-- 4 Architectural Engineering Facts + Action Button -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-6 items-center pt-4">
      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] shadow-sm">
        <div class="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-bold text-[#1A1816] mb-1">3.3 м</div>
        <div class="text-xs text-[#62605B] font-light">высота чистовых потолков</div>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] shadow-sm">
        <div class="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-bold text-[#1A1816] mb-1">56 дБ</div>
        <div class="text-xs text-[#62605B] font-light">акустический пирог стен</div>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] shadow-sm">
        <div class="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-bold text-[#8E734E] mb-1">F7 + УФ</div>
        <div class="text-xs text-[#62605B] font-light">очистка приточного воздуха</div>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] shadow-sm">
        <div class="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-bold text-[#1A1816] mb-1">KONE</div>
        <div class="text-xs text-[#62605B] font-light">лифт до уровня паркинга</div>
      </div>

      <!-- CTA Button to Catalog -->
      <div class="col-span-2 lg:col-span-1 flex justify-start lg:justify-end">
        <a href="#catalog" class="w-full lg:w-auto h-14 px-8 inline-flex items-center justify-center rounded-full bg-[#8E734E] hover:bg-[#77603F] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-md hover:shadow-lg cursor-pointer text-center">
          Выбрать лот ↓
        </a>
      </div>
    </div>
  </div>
</section>
<script>
function switchFacadeMode(mode) {
  var dayImg = document.getElementById('facade-day');
  var nightImg = document.getElementById('facade-night');
  var btnDay = document.getElementById('btn-facade-day');
  var btnNight = document.getElementById('btn-facade-night');
  if (mode === 'day') {
    if (dayImg) { dayImg.style.opacity = '1'; dayImg.classList.remove('opacity-0'); }
    if (nightImg) { nightImg.style.opacity = '0'; }
    if (btnDay) btnDay.className = 'px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-white/25 transition-all';
    if (btnNight) btnNight.className = 'px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white/70 hover:text-white transition-all';
  } else {
    if (dayImg) { dayImg.style.opacity = '0'; }
    if (nightImg) { nightImg.style.opacity = '1'; nightImg.classList.remove('opacity-0'); }
    if (btnDay) btnDay.className = 'px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white/70 hover:text-white transition-all';
    if (btnNight) btnNight.className = 'px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-white/25 transition-all';
  }
}
</script>
`,

  // 3. PRIVACY MANIFESTO (Журнальная колонка, культура клубного дома, отсутствие транзитного трафика)
  manifesto: `
<section id="manifesto" class="w-full py-24 sm:py-32 bg-white border-y border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-left mb-4">
      <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E]">МАНИФЕСТ КАМЕРНОСТИ // 01</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <!-- Left Column: Manifesto Text -->
      <div class="lg:col-span-7">
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] leading-[1.18] mb-8">
          Архитектура, созданная для жизни <span class="italic font-normal">без посторонних взглядов</span>
        </h2>
        <div class="space-y-6 text-[#62605B] text-base sm:text-lg leading-relaxed font-light">
          <p>
            В высотных жилых комплексах приватность заканчивается на пороге квартиры: переполненные вестибюли, постоянная смена арендаторов и непрерывный шум лифтов.
          </p>
          <p>
            <strong class="text-[#1A1816] font-semibold">Дом на Полянке</strong> спроектирован по законам европейских палаццо. Здесь всего 17 резиденций и пентхаус — это значит, что на каждом этаже расположено не более 4–5 квартир, а соседи разделяют общие ценности уважения к личному пространству.
          </p>
          <p>
            Внутренний двор надежно скрыт от городского шума за массивными кирпичными стенами, а доступ на территорию осуществляется по биометрии Face ID с персональным шлюзом безопасности.
          </p>
        </div>
      </div>

      <!-- Right Column: Editorial Quote & Philosophy Box -->
      <div class="lg:col-span-5">
        <div class="p-8 sm:p-10 rounded-3xl bg-[#F7F5F0] border border-[#1A1816]/[0.07] relative flex flex-col justify-between">
          <div class="font-['Cormorant_Garamond',serif] text-6xl text-[#8E734E]/30 leading-none mb-4">“</div>
          <blockquote class="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl italic text-[#1A1816] leading-snug mb-8">
            Настоящая роскошь в центре мегаполиса — это не показной масштаб, а абсолютная тишина и уверенность в безопасности своего круга.
          </blockquote>
          <div class="pt-6 border-t border-[#1A1816]/10 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#1A1816] font-mono">17 семей</span>
            <span class="text-xs text-[#62605B]">100% однородная среда</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 4. MATERIALS & ENGINEERING (Клинкер, дуб, триплекс, очистка воды, индивидуальный климат)
  materials: `
<section id="materials" class="w-full py-24 sm:py-32 bg-[#F7F5F0] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
      <div>
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">МАТЕРИАЛЫ И КОНСТРУКТИВ // 02</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
          Тактильное благородство натуральных фактур
        </h2>
      </div>
      <p class="text-sm text-[#62605B] max-w-xs font-light">
        Материалы, которые красиво стареют и сохраняют монументальность веками.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Material 1 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1A1816]/[0.07] flex flex-col justify-between shadow-sm hover:border-[#8E734E]/40 transition-all group">
        <div>
          <span class="text-xs font-mono font-bold text-[#8E734E] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">[ 01 ]</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1A1816] mb-3">Клинкер ручной формовки</h3>
          <p class="text-sm text-[#62605B] leading-relaxed font-light">
            Облицовка фасада немецким клинкером с естественным минеральным обжигом. Фактурная кладка с индивидуальным рисунком шва.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1A1816]/[0.06] text-[11px] font-mono uppercase tracking-widest text-[#62605B]">Срок службы 150+ лет</div>
      </div>

      <!-- Material 2 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1A1816]/[0.07] flex flex-col justify-between shadow-sm hover:border-[#8E734E]/40 transition-all group">
        <div>
          <span class="text-xs font-mono font-bold text-[#8E734E] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">[ 02 ]</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1A1816] mb-3">Деревоалюминиевые окна</h3>
          <p class="text-sm text-[#62605B] leading-relaxed font-light">
            Профиль из массива дуба со стороны интерьера и анодированный алюминий снаружи. Двойной триплекс с шумопоглощением до 42 дБ.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1A1816]/[0.06] text-[11px] font-mono uppercase tracking-widest text-[#62605B]">Акустический триплекс</div>
      </div>

      <!-- Material 3 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1A1816]/[0.07] flex flex-col justify-between shadow-sm hover:border-[#8E734E]/40 transition-all group">
        <div>
          <span class="text-xs font-mono font-bold text-[#8E734E] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">[ 03 ]</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1A1816] mb-3">Водоочистка до питьевого стандарта</h3>
          <p class="text-sm text-[#62605B] leading-relaxed font-light">
            Центральная система механической и ультрафильтрации, умягчения и обеззараживания. Вода высшего качества из каждого крана.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1A1816]/[0.06] text-[11px] font-mono uppercase tracking-widest text-[#62605B]">Многоступенчатый контур</div>
      </div>

      <!-- Material 4 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1A1816]/[0.07] flex flex-col justify-between shadow-sm hover:border-[#8E734E]/40 transition-all group">
        <div>
          <span class="text-xs font-mono font-bold text-[#8E734E] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">[ 04 ]</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1A1816] mb-3">Климат VRV и чистый воздух</h3>
          <p class="text-sm text-[#62605B] leading-relaxed font-light">
            Приточная вентиляция с фильтрацией класса F7 и индивидуальные фанкойлы. Воздух без пыльцы, выхлопных газов и сквозняков.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1A1816]/[0.06] text-[11px] font-mono uppercase tracking-widest text-[#62605B]">Индивидуальный термостат</div>
      </div>
    </div>
  </div>
</section>
`,

  // 5. INTERACTIVE 28-LOT CATALOG (Вкладки лотов, фильтры в реальном времени, 2D чертежи, модалка с автоподстановкой)
  catalog: `
<section id="catalog" class="w-full py-24 sm:py-32 bg-white border-y border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Header of Catalog -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
      <div>
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">КОЛЛЕКЦИЯ НЕДВИЖИМОСТИ // 03</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
          Интерактивный реестр 28 лотов
        </h2>
      </div>
      <div class="text-xs font-mono text-[#62605B]">
        Обновлено сегодня • Доступно для резерва
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex flex-wrap items-center gap-2 mb-8 border-b border-[#1A1816]/[0.08] pb-4">
      <button type="button" onclick="setLotCategory('residences', this)" class="lot-cat-btn active px-5 py-2.5 rounded-full text-xs font-semibold bg-[#1A1816] text-white transition-all cursor-pointer">
        Резиденции (17)
      </button>
      <button type="button" onclick="setLotCategory('penthouse', this)" class="lot-cat-btn px-5 py-2.5 rounded-full text-xs font-semibold bg-transparent hover:bg-[#F7F5F0] text-[#1A1816] transition-all cursor-pointer">
        Пентхаус с террасой (1)
      </button>
      <button type="button" onclick="setLotCategory('commercial', this)" class="lot-cat-btn px-5 py-2.5 rounded-full text-xs font-semibold bg-transparent hover:bg-[#F7F5F0] text-[#1A1816] transition-all cursor-pointer">
        Коммерческая галерея (1)
      </button>
      <button type="button" onclick="setLotCategory('storage', this)" class="lot-cat-btn px-5 py-2.5 rounded-full text-xs font-semibold bg-transparent hover:bg-[#F7F5F0] text-[#1A1816] transition-all cursor-pointer">
        Сити-боксы (10)
      </button>
    </div>

    <!-- Live Filters Controls -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F7F5F0] border border-[#1A1816]/[0.07] mb-10 text-left">
      <!-- Filter Rooms -->
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-wider text-[#62605B] mb-1.5">Комнатность</label>
        <select id="filter-rooms" onchange="applyLotFilters()" class="w-full h-10 px-3 rounded-xl bg-white border border-[#1A1816]/10 text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#8E734E]">
          <option value="all">Все спальни</option>
          <option value="1">1 спальня</option>
          <option value="2">2 спальни</option>
          <option value="3">3+ спальни</option>
        </select>
      </div>

      <!-- Filter Floor -->
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-wider text-[#62605B] mb-1.5">Этаж</label>
        <select id="filter-floor" onchange="applyLotFilters()" class="w-full h-10 px-3 rounded-xl bg-white border border-[#1A1816]/10 text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#8E734E]">
          <option value="all">Все этажи</option>
          <option value="1">1 этаж</option>
          <option value="2">2 этаж</option>
          <option value="3">3 этаж</option>
          <option value="4">4 этаж</option>
          <option value="5">5 этаж (Пентхаус)</option>
          <option value="-1">-1 этаж (Паркинг)</option>
        </select>
      </div>

      <!-- Filter Status -->
      <div>
        <label class="block text-[10px] uppercase font-mono tracking-wider text-[#62605B] mb-1.5">Статус</label>
        <select id="filter-status" onchange="applyLotFilters()" class="w-full h-10 px-3 rounded-xl bg-white border border-[#1A1816]/10 text-xs font-medium text-[#1A1816] focus:outline-none focus:border-[#8E734E]">
          <option value="all">Любой статус</option>
          <option value="available">В продаже</option>
          <option value="reserved">В брони</option>
          <option value="sold">Реализовано</option>
        </select>
      </div>

      <!-- Reset button -->
      <div class="flex items-end">
        <button type="button" onclick="resetLotFilters()" class="w-full h-10 rounded-xl border border-[#1A1816]/10 text-xs font-semibold text-[#62605B] hover:text-[#1A1816] bg-white transition-colors cursor-pointer">
          Сбросить фильтры
        </button>
      </div>
    </div>

    <!-- Lots Cards Grid (Container populated with 28 lots) -->
    <div id="lots-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Items dynamically handled or rendered via JSON data below -->
    </div>
  </div>
</section>

<!-- Detailed Blueprint & Booking Modal Drawer -->
<div id="lot-detail-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
  <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 border border-[#1A1816]/10 shadow-2xl text-left font-['Manrope',sans-serif]">
    <!-- Close button -->
    <button type="button" onclick="closeLotModal()" class="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#1A1816] flex items-center justify-center transition-colors">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <!-- Left: 2D Plan Enlarged -->
      <div class="md:col-span-6 p-6 rounded-2xl bg-[#F7F5F0] border border-[#1A1816]/[0.08] flex items-center justify-center">
        <img id="modal-lot-plan" src="" alt="Архитектурный план лота" class="w-full max-h-72 object-contain" />
      </div>

      <!-- Right: Lot Specs & Booking Action -->
      <div class="md:col-span-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span id="modal-lot-status-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold"></span>
            <span id="modal-lot-code" class="text-xs font-mono text-[#62605B]"></span>
          </div>
          <h3 id="modal-lot-title" class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1A1816] mb-2"></h3>
          <div id="modal-lot-price" class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#8E734E] mb-6"></div>

          <div class="space-y-2.5 text-xs text-[#62605B] pb-6 border-b border-[#1A1816]/10">
            <div class="flex justify-between"><span>Общая площадь:</span><strong id="modal-lot-area" class="text-[#1A1816]"></strong></div>
            <div class="flex justify-between"><span>Этаж / Этажность:</span><strong id="modal-lot-floor" class="text-[#1A1816]"></strong></div>
            <div class="flex justify-between"><span>Высота потолков:</span><strong class="text-[#1A1816]">3.30 м</strong></div>
            <div class="flex justify-between"><span>Ориентация окон:</span><strong id="modal-lot-view" class="text-[#1A1816]"></strong></div>
          </div>
        </div>

        <div class="pt-6">
          <button type="button" id="modal-book-btn" onclick="confirmLotBooking()" class="w-full h-12 rounded-full bg-[#1A1816] hover:bg-[#2C2925] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-md cursor-pointer">
            Зафиксировать условия бронирования
          </button>
          <div class="text-[11px] text-[#62605B] text-center mt-2.5">
            Фиксация цены на 3 рабочих дня без штрафных обязательств
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// Master Data of all 28 lots
var LOTS_DATA = [
  // 17 Residences
  { id: 'APT-01', cat: 'residences', title: 'Резиденция № 01', rooms: 1, floor: 2, area: 48.6, price: 18900000, status: 'available', view: 'Тихий внутренний сад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-02', cat: 'residences', title: 'Резиденция № 02', rooms: 2, floor: 2, area: 76.4, price: 25800000, status: 'available', view: 'Юго-Запад, сквер', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-03', cat: 'residences', title: 'Резиденция № 03', rooms: 2, floor: 2, area: 82.1, price: 27900000, status: 'reserved', view: 'Восток, рассветный сад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-04', cat: 'residences', title: 'Резиденция № 04', rooms: 3, floor: 2, area: 114.5, price: 38900000, status: 'available', view: 'Двусторонняя, парк и сад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-05', cat: 'residences', title: 'Резиденция № 05', rooms: 1, floor: 3, area: 52.3, price: 19800000, status: 'sold', view: 'Внутренний сад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-06', cat: 'residences', title: 'Резиденция № 06', rooms: 2, floor: 3, area: 78.9, price: 26900000, status: 'available', view: 'Юго-Запад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-07', cat: 'residences', title: 'Резиденция № 07', rooms: 2, floor: 3, area: 84.0, price: 28500000, status: 'available', view: 'Восток, приватный двор', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-08', cat: 'residences', title: 'Резиденция № 08', rooms: 3, floor: 3, area: 118.2, price: 40500000, status: 'available', view: 'Панорама на исторический центр', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-09', cat: 'residences', title: 'Резиденция № 09', rooms: 1, floor: 4, area: 54.0, price: 20900000, status: 'available', view: 'Сад и крыши старой Москвы', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-10', cat: 'residences', title: 'Резиденция № 10', rooms: 2, floor: 4, area: 79.5, price: 27900000, status: 'reserved', view: 'Юг, солнечная сторона', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-11', cat: 'residences', title: 'Резиденция № 11', rooms: 2, floor: 4, area: 86.4, price: 29800000, status: 'available', view: 'Восток, утренний свет', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-12', cat: 'residences', title: 'Резиденция № 12', rooms: 3, floor: 4, area: 124.0, price: 43500000, status: 'available', view: 'Трехсторонняя, панорамные виды', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-13', cat: 'residences', title: 'Резиденция № 13', rooms: 1, floor: 4, area: 51.0, price: 20200000, status: 'sold', view: 'Внутренний сад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-14', cat: 'residences', title: 'Резиденция № 14', rooms: 2, floor: 4, area: 88.2, price: 30500000, status: 'available', view: 'Западный закатный свет', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-15', cat: 'residences', title: 'Резиденция № 15', rooms: 3, floor: 4, area: 132.8, price: 46500000, status: 'available', view: 'Вид на храмы Полянки', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-16', cat: 'residences', title: 'Резиденция № 16', rooms: 2, floor: 3, area: 75.2, price: 26100000, status: 'sold', view: 'Внутренний сад', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'APT-17', cat: 'residences', title: 'Резиденция № 17', rooms: 3, floor: 3, area: 128.0, price: 44200000, status: 'available', view: 'Сквер и тихий переулок', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },

  // 1 Penthouse
  { id: 'PENTHOUSE-01', cat: 'penthouse', title: 'Пентхаус с террасой 64 м²', rooms: 3, floor: 5, area: 218.4, price: 118000000, status: 'available', view: 'Круговая панорама на Кремль и ХХС', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },

  // 1 Commercial Office / Gallery
  { id: 'COMM-01', cat: 'commercial', title: 'Галерея / Частная практика', rooms: 1, floor: 1, area: 142.8, price: 68500000, status: 'available', view: 'Витражи на первую линию переулка', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },

  // 10 City-Boxes (Storages)
  { id: 'BOX-01', cat: 'storage', title: 'Сити-бокс № 01', rooms: 0, floor: -1, area: 4.5, price: 950000, status: 'available', view: 'Уровень -1, возле лифта', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-02', cat: 'storage', title: 'Сити-бокс № 02', rooms: 0, floor: -1, area: 5.2, price: 1080000, status: 'available', view: 'Уровень -1, высота 3.6м', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-03', cat: 'storage', title: 'Сити-бокс № 03', rooms: 0, floor: -1, area: 6.0, price: 1250000, status: 'reserved', view: 'Уровень -1', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-04', cat: 'storage', title: 'Сити-бокс № 04', rooms: 0, floor: -1, area: 5.5, price: 1150000, status: 'available', view: 'Уровень -1', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-05', cat: 'storage', title: 'Сити-бокс № 05', rooms: 0, floor: -1, area: 7.1, price: 1480000, status: 'sold', view: 'Уровень -1', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-06', cat: 'storage', title: 'Сити-бокс № 06', rooms: 0, floor: -1, area: 4.8, price: 1020000, status: 'available', view: 'Уровень -1', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-07', cat: 'storage', title: 'Сити-бокс № 07', rooms: 0, floor: -1, area: 8.4, price: 1750000, status: 'available', view: 'Уровень -1, увеличенный объем', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-08', cat: 'storage', title: 'Сити-бокс № 08', rooms: 0, floor: -1, area: 5.0, price: 1050000, status: 'available', view: 'Уровень -1', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-09', cat: 'storage', title: 'Сити-бокс № 09', rooms: 0, floor: -1, area: 9.2, price: 1920000, status: 'available', view: 'Уровень -1, двустворчатая дверь', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'BOX-10', cat: 'storage', title: 'Сити-бокс № 10', rooms: 0, floor: -1, area: 6.8, price: 1420000, status: 'available', view: 'Уровень -1', plan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
];

var currentLotCat = 'residences';
var activeModalLot = null;

function setLotCategory(cat, btn) {
  currentLotCat = cat;
  document.querySelectorAll('.lot-cat-btn').forEach(function(b) {
    b.className = 'lot-cat-btn px-5 py-2.5 rounded-full text-xs font-semibold bg-transparent hover:bg-[#F7F5F0] text-[#1A1816] transition-all cursor-pointer';
  });
  btn.className = 'lot-cat-btn active px-5 py-2.5 rounded-full text-xs font-semibold bg-[#1A1816] text-white transition-all cursor-pointer';
  applyLotFilters();
}

function applyLotFilters() {
  var roomsVal = document.getElementById('filter-rooms').value;
  var floorVal = document.getElementById('filter-floor').value;
  var statusVal = document.getElementById('filter-status').value;
  
  var filtered = LOTS_DATA.filter(function(lot) {
    if (lot.cat !== currentLotCat) return false;
    if (roomsVal !== 'all' && lot.rooms !== Number(roomsVal)) return false;
    if (floorVal !== 'all' && lot.floor !== Number(floorVal)) return false;
    if (statusVal !== 'all' && lot.status !== statusVal) return false;
    return true;
  });

  renderLotsGrid(filtered);
}

function resetLotFilters() {
  document.getElementById('filter-rooms').value = 'all';
  document.getElementById('filter-floor').value = 'all';
  document.getElementById('filter-status').value = 'all';
  applyLotFilters();
}

function renderLotsGrid(lots) {
  var container = document.getElementById('lots-grid-container');
  if (!container) return;

  if (lots.length === 0) {
    container.innerHTML = '<div class="col-span-full py-16 text-center text-[#62605B] font-light">Лотов с выбранными параметрами не найдено. Попробуйте смягчить фильтры.</div>';
    return;
  }

  var html = lots.map(function(lot) {
    var statusText = lot.status === 'available' ? 'В продаже' : lot.status === 'reserved' ? 'Забронировано' : 'Продано';
    var statusBg = lot.status === 'available' ? 'bg-[#2C3E35] text-white' : lot.status === 'reserved' ? 'bg-[#A67C38] text-white' : 'bg-[#62605B]/20 text-[#62605B]';
    var formattedPrice = lot.price.toLocaleString('ru-RU') + ' ₽';
    var pricePerMeter = Math.round(lot.price / lot.area).toLocaleString('ru-RU') + ' ₽/м²';

    return '' +
      '<div class="p-6 rounded-3xl bg-white border border-[#1A1816]/[0.08] shadow-sm hover:border-[#8E734E]/50 transition-all flex flex-col justify-between group cursor-pointer text-left" onclick="openLotModalById(\\'' + lot.id + '\\')">' +
        '<div>' +
          '<div class="flex items-center justify-between mb-3">' +
            '<span class="text-xs font-mono text-[#62605B]">' + lot.id + '</span>' +
            '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ' + statusBg + '">' + statusText + '</span>' +
          '</div>' +
          '<div class="aspect-[4/3] rounded-2xl bg-[#F7F5F0] border border-[#1A1816]/[0.05] p-4 flex items-center justify-center mb-4 overflow-hidden">' +
            '<img src="' + lot.plan + '" alt="' + lot.title + '" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />' +
          '</div>' +
          '<h4 class="font-[' + "'Cormorant_Garamond',serif" + '] text-2xl font-bold text-[#1A1816] mb-1">' + lot.title + '</h4>' +
          '<div class="text-xs text-[#62605B] mb-4 font-light">' + lot.area + ' м² • ' + (lot.floor === -1 ? 'Паркинг' : lot.floor + ' этаж') + ' • ' + lot.view + '</div>' +
        '</div>' +
        '<div class="pt-4 border-t border-[#1A1816]/[0.07] flex items-center justify-between">' +
          '<div>' +
            '<div class="font-[' + "'Cormorant_Garamond',serif" + '] text-2xl font-bold text-[#1A1816] leading-none">' + formattedPrice + '</div>' +
            '<div class="text-[10px] text-[#62605B] font-mono mt-0.5">' + pricePerMeter + '</div>' +
          '</div>' +
          '<button type="button" class="w-9 h-9 rounded-full bg-[#F7F5F0] group-hover:bg-[#1A1816] group-hover:text-white text-[#1A1816] flex items-center justify-center transition-colors">' +
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
  }).join('');

  container.innerHTML = html;
}

function openLotModalById(lotId) {
  var lot = LOTS_DATA.find(function(l) { return l.id === lotId; });
  if (!lot) return;
  activeModalLot = lot;

  var modal = document.getElementById('lot-detail-modal');
  document.getElementById('modal-lot-plan').src = lot.plan;
  document.getElementById('modal-lot-code').innerText = lot.id;
  document.getElementById('modal-lot-title').innerText = lot.title;
  document.getElementById('modal-lot-price').innerText = lot.price.toLocaleString('ru-RU') + ' ₽';
  document.getElementById('modal-lot-area').innerText = lot.area + ' м²';
  document.getElementById('modal-lot-floor').innerText = (lot.floor === -1 ? 'Цокольный этаж (-1)' : lot.floor + ' из 5 этажей');
  document.getElementById('modal-lot-view').innerText = lot.view;

  var statusBadge = document.getElementById('modal-lot-status-badge');
  if (lot.status === 'available') {
    statusBadge.innerText = 'В продаже';
    statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#2C3E35] text-white';
    document.getElementById('modal-book-btn').disabled = false;
    document.getElementById('modal-book-btn').innerText = 'Зафиксировать условия бронирования';
  } else if (lot.status === 'reserved') {
    statusBadge.innerText = 'В брони';
    statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#A67C38] text-white';
    document.getElementById('modal-book-btn').disabled = true;
    document.getElementById('modal-book-btn').innerText = 'Лот находится в резерве';
  } else {
    statusBadge.innerText = 'Реализовано';
    statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#62605B]/20 text-[#62605B]';
    document.getElementById('modal-book-btn').disabled = true;
    document.getElementById('modal-book-btn').innerText = 'Лот продан';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeLotModal() {
  var modal = document.getElementById('lot-detail-modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

function confirmLotBooking() {
  if (!activeModalLot) return;
  closeLotModal();
  openLotBooking(activeModalLot.id, activeModalLot.price.toLocaleString('ru-RU') + ' ₽');
}

// Auto init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { applyLotFilters(); });
} else {
  applyLotFilters();
}
</script>
`,

  // 6. FLOOR-BY-FLOOR CROSS SECTIONS (Поэтажные планы 2–4 этажей с маркерами лотов)
  floorPlans: `
<section class="w-full py-24 sm:py-32 bg-[#F7F5F0] border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-3xl mb-16 text-left">
      <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ПОЭТАЖНЫЕ ПЛАНЫ // 04</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
        Всего 4–5 квартир на лестничной площадке
      </h2>
      <p class="text-sm text-[#62605B] mt-4 font-light leading-relaxed">
        Изоляция спальных зон от лифтового холла, бесшумные шахты с деформационными швами и отсутствие смежных санузлов между соседями.
      </p>
    </div>

    <!-- Floor Selector Pills -->
    <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
      <button type="button" onclick="switchFloorPlan('fl-2', this)" class="floor-btn active px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-[#1A1816] text-white transition-all cursor-pointer">
        2 Этаж (4 лота)
      </button>
      <button type="button" onclick="switchFloorPlan('fl-3', this)" class="floor-btn px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-white border border-[#1A1816]/10 text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer">
        3 Этаж (4 лота)
      </button>
      <button type="button" onclick="switchFloorPlan('fl-4', this)" class="floor-btn px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-white border border-[#1A1816]/10 text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer">
        4 Этаж (4 лота)
      </button>
      <button type="button" onclick="switchFloorPlan('fl-5', this)" class="floor-btn px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-white border border-[#1A1816]/10 text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer">
        5 Этаж (Пентхаус)
      </button>
    </div>

    <!-- Floor Plate Display Box -->
    <div class="p-8 sm:p-12 rounded-3xl bg-white border border-[#1A1816]/[0.08] shadow-sm relative overflow-hidden text-center">
      <div id="floor-img-container" class="aspect-[16/8] max-w-4xl mx-auto flex items-center justify-center">
        <img id="floor-display-img" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" alt="Поэтажный план этажа" class="w-full h-full object-contain filter contrast-105" />
      </div>
      <div class="pt-6 border-t border-[#1A1816]/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#62605B] mt-6">
        <div>Ориентация: Север вверху • Выход в лифтовый холл KONE по ключ-карте</div>
        <div class="mt-2 sm:mt-0 font-mono text-[#1A1816]">Индивидуальные вентиляционные каналы для каждой квартиры</div>
      </div>
    </div>
  </div>
</section>
<script>
function switchFloorPlan(floorKey, btn) {
  document.querySelectorAll('.floor-btn').forEach(function(b) {
    b.className = 'floor-btn px-5 py-2 rounded-full text-xs font-semibold bg-white border border-[#1A1816]/10 text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer';
  });
  btn.className = 'floor-btn active px-5 py-2 rounded-full text-xs font-semibold bg-[#1A1816] text-white transition-all cursor-pointer';
}
</script>
`,

  // 7. LOBBY & PRIVATE GARDEN (Каминная зона, библиотека, лапомойка, ландшафтный двор)
  lobby: `
<section id="lobby" class="w-full py-24 sm:py-32 bg-white border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
      <div class="lg:col-span-6 text-left">
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ОБЩЕСТВЕННЫЕ ПРОСТРАНСТВА // 05</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] leading-tight mb-6">
          Лобби как продолжение вашей гостиной
        </h2>
        <p class="text-base text-[#62605B] font-light leading-relaxed mb-8">
          Пространство первого этажа решено в эстетике клубного отеля: биокамин с живым огнем, мягкая лаунж-зона с креслами из натуральной кожи, библиотека монографий по искусству и круглосуточный консьерж-сервис.
        </p>
        <div class="grid grid-cols-2 gap-4 text-xs text-[#1A1816] font-medium border-t border-[#1A1816]/[0.08] pt-6">
          <div class="flex items-center gap-2"><span>✦</span> <span>Лапомойка для питомцев</span></div>
          <div class="flex items-center gap-2"><span>✦</span> <span>Колясочная с теплым полом</span></div>
          <div class="flex items-center gap-2"><span>✦</span> <span>Хранение посылок с охлаждением</span></div>
          <div class="flex items-center gap-2"><span>✦</span> <span>Гостевой санузел в лобби</span></div>
        </div>
      </div>

      <div class="lg:col-span-6">
        <div class="aspect-[4/3] rounded-3xl overflow-hidden border border-[#1A1816]/[0.08] shadow-xl bg-[#EFECE6]">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Лобби с камином" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 8. LOCATION & MONOCHROME MAP (Монохромные Яндекс.Карты, пешие дистанции)
  location: `
<section id="location" class="w-full py-24 sm:py-32 bg-[#F7F5F0] border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4 text-left">
      <div>
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ОКРУЖЕНИЕ И ЛОКАЦИЯ // 06</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
          Тихий анклав Замоскворечья
        </h2>
      </div>
      <p class="text-xs text-[#62605B] font-mono">
        ЦАО • Большая Полянка, дом 14
      </p>
    </div>

    <!-- Distance Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] text-left">
        <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#8E734E] mb-1">4 мин</div>
        <div class="text-xs font-semibold text-[#1A1816] mb-1">Набережная реки</div>
        <div class="text-[11px] text-[#62605B] font-light">утренние пробежки и прогулки</div>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] text-left">
        <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#8E734E] mb-1">6 мин</div>
        <div class="text-xs font-semibold text-[#1A1816] mb-1">Парк Музеон</div>
        <div class="text-[11px] text-[#62605B] font-light">зеленый оазис и выставки скульптур</div>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] text-left">
        <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#8E734E] mb-1">8 мин</div>
        <div class="text-xs font-semibold text-[#1A1816] mb-1">Третьяковская галерея</div>
        <div class="text-[11px] text-[#62605B] font-light">культурное сердце района</div>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] text-left">
        <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#8E734E] mb-1">5 мин</div>
        <div class="text-xs font-semibold text-[#1A1816] mb-1">Гимназия и лицей</div>
        <div class="text-[11px] text-[#62605B] font-light">топовое академическое образование</div>
      </div>
    </div>

    <!-- Stylized Map Container -->
    <div class="w-full aspect-[21/9] rounded-3xl overflow-hidden border border-[#1A1816]/[0.08] shadow-lg relative bg-[#EFECE6]">
      <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80" alt="Карта района Полянки" class="w-full h-full object-cover filter grayscale contrast-125" />
      <div class="absolute inset-0 bg-[#F7F5F0]/30 pointer-events-none"></div>
      
      <!-- Center Pin -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span class="w-5 h-5 rounded-full bg-[#8E734E] ring-8 ring-[#8E734E]/30 animate-pulse"></span>
        <span class="mt-2 px-3 py-1 rounded-full bg-[#1A1816] text-white text-[11px] font-mono uppercase font-semibold shadow-lg">Большая Полянка, 14</span>
      </div>
    </div>
  </div>
</section>
`,

  // 9. CONSTRUCTION CHRONICLE (Ежемесячный фотоархив Tilda Feeds)
  chronicle: `
<section class="w-full py-24 sm:py-32 bg-white border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4 text-left">
      <div>
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ХРОНИКА СТРОИТЕЛЬСТВА // 07</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
          Динамика реализации проекта
        </h2>
      </div>
      <div class="text-xs text-[#62605B] font-mono">
        Архив фотоотчетов • Обновление ежемесячно
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl bg-[#F7F5F0] border border-[#1A1816]/[0.07] flex flex-col justify-between text-left">
        <div>
          <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-white">
            <img src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80" alt="Этап строительства" class="w-full h-full object-cover" />
          </div>
          <span class="text-xs font-mono text-[#8E734E] block mb-1">Сентябрь 2026</span>
          <h4 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1A1816] mb-2">Монтаж клинкерного фасада</h4>
          <p class="text-xs text-[#62605B] font-light leading-relaxed">
            Завершены монолитные работы на всех 5 этажах. Ведутся работы по облицовке клинкерным кирпичом и остеклению пентхауса.
          </p>
        </div>
        <div class="mt-6 pt-3 border-t border-[#1A1816]/[0.08] text-[10px] font-mono text-[#62605B]">Готовность монолита: 100%</div>
      </div>

      <div class="p-6 rounded-3xl bg-[#F7F5F0] border border-[#1A1816]/[0.07] flex flex-col justify-between text-left">
        <div>
          <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-white">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" alt="Этап строительства" class="w-full h-full object-cover" />
          </div>
          <span class="text-xs font-mono text-[#8E734E] block mb-1">Август 2026</span>
          <h4 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1A1816] mb-2">Прокладка инженерных сетей</h4>
          <p class="text-xs text-[#62605B] font-light leading-relaxed">
            Установлен автономный тепловой пункт и шахты приточной вентиляции. Завершено бетонирование рампы подземного паркинга.
          </p>
        </div>
        <div class="mt-6 pt-3 border-t border-[#1A1816]/[0.08] text-[10px] font-mono text-[#62605B]">Готовность сетей: 70%</div>
      </div>

      <div class="p-6 rounded-3xl bg-[#F7F5F0] border border-[#1A1816]/[0.07] flex flex-col justify-between text-left">
        <div>
          <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-white">
            <img src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80" alt="Этап строительства" class="w-full h-full object-cover" />
          </div>
          <span class="text-xs font-mono text-[#8E734E] block mb-1">Июль 2026</span>
          <h4 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1A1816] mb-2">Перекрытия 4 этажа</h4>
          <p class="text-xs text-[#62605B] font-light leading-relaxed">
            Выполнен монтаж вертикальных конструкций 4 этажа и подготовка опалубки для видовой террасы пентхауса.
          </p>
        </div>
        <div class="mt-6 pt-3 border-t border-[#1A1816]/[0.08] text-[10px] font-mono text-[#62605B]">График опережения: +14 дней</div>
      </div>
    </div>
  </div>
</section>
`,

  // 10. FINANCIAL SCENARIOS & MORTGAGE CALCULATOR (Калькулятор платежей 2026, рассрочка 0%)
  finance: `
<section class="w-full py-24 sm:py-32 bg-[#F7F5F0] border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-5xl mx-auto px-6 text-left">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ФИНАНСОВЫЕ СЦЕНАРИИ // 08</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
        Индивидуальные условия покупки
      </h2>
      <p class="text-sm text-[#62605B] mt-4 font-light">
        Беспроцентная рассрочка от застройщика до ввода дома в эксплуатацию и льготные банковские программы.
      </p>
    </div>

    <!-- Mortgage Calculator Interactive Box -->
    <div class="p-8 sm:p-12 rounded-3xl bg-white border border-[#1A1816]/[0.08] shadow-sm mb-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div class="space-y-6">
          <!-- Program Tabs -->
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-wider text-[#62605B] mb-2">Субсидированная программа</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" onclick="setMortgageCalcRate(6.0, this)" class="calc-prog-btn active px-3 py-2.5 rounded-xl text-xs font-bold bg-[#1A1816] text-white transition-all cursor-pointer">Семейная 6%</button>
              <button type="button" onclick="setMortgageCalcRate(6.0, this)" class="calc-prog-btn px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#F7F5F0] text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer">IT-ипотека 6%</button>
              <button type="button" onclick="setMortgageCalcRate(18.5, this)" class="calc-prog-btn px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#F7F5F0] text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer">Базовая</button>
            </div>
          </div>

          <!-- Price Slider -->
          <div>
            <div class="flex justify-between text-xs mb-2">
              <span class="text-[#62605B]">Стоимость резиденции:</span>
              <span id="calc-price-display" class="font-mono font-bold text-[#1A1816]">25 800 000 ₽</span>
            </div>
            <input type="range" id="calc-price-input" min="18000000" max="60000000" step="500000" value="25800000" oninput="runMortgageCalc()" class="w-full accent-[#8E734E] cursor-pointer" />
          </div>

          <!-- Initial Pct Slider -->
          <div>
            <div class="flex justify-between text-xs mb-2">
              <span class="text-[#62605B]">Первоначальный взнос:</span>
              <span id="calc-initial-display" class="font-mono font-bold text-[#1A1816]">7 740 000 ₽ (30%)</span>
            </div>
            <input type="range" id="calc-initial-input" min="20" max="80" step="5" value="30" oninput="runMortgageCalc()" class="w-full accent-[#8E734E] cursor-pointer" />
          </div>
        </div>

        <!-- Result Box -->
        <div class="p-8 rounded-2xl bg-[#F7F5F0] border border-[#1A1816]/[0.08] text-center flex flex-col justify-between">
          <span class="text-[10px] uppercase font-mono tracking-widest text-[#62605B]">Ориентировочный ежемесячный платеж</span>
          <div id="calc-result-monthly" class="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl font-bold text-[#1A1816] my-4">
            108 300 ₽ / мес
          </div>
          <div class="text-[11px] text-[#62605B] mb-6 font-light">Срок кредита: до 30 лет. Эскроу-счета в ПАО Сбербанк.</div>
          <button type="button" onclick="openLotBooking('MORTGAGE-APPROVED', '25800000')" class="h-12 rounded-full bg-[#1A1816] hover:bg-[#2C2925] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer">
            Подать заявку на одобрение
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
<script>
var currentCalcRate = 6.0;
function setMortgageCalcRate(rate, btn) {
  currentCalcRate = rate;
  document.querySelectorAll('.calc-prog-btn').forEach(function(b) {
    b.className = 'calc-prog-btn px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#F7F5F0] text-[#1A1816] hover:bg-[#EFECE6] transition-all cursor-pointer';
  });
  btn.className = 'calc-prog-btn active px-3 py-2.5 rounded-xl text-xs font-bold bg-[#1A1816] text-white transition-all cursor-pointer';
  runMortgageCalc();
}

function runMortgageCalc() {
  var price = Number(document.getElementById('calc-price-input').value);
  var initPct = Number(document.getElementById('calc-initial-input').value);
  var initRub = Math.round(price * (initPct / 100));

  document.getElementById('calc-price-display').innerText = price.toLocaleString('ru-RU') + ' ₽';
  document.getElementById('calc-initial-display').innerText = initRub.toLocaleString('ru-RU') + ' ₽ (' + initPct + '%)';

  var loan = price - initRub;
  var months = 30 * 12;
  var mRate = (currentCalcRate / 100) / 12;
  var annuity = loan * (mRate * Math.pow(1 + mRate, months)) / (Math.pow(1 + mRate, months) - 1);

  document.getElementById('calc-result-monthly').innerText = Math.round(annuity).toLocaleString('ru-RU') + ' ₽ / мес';
}
</script>
`,

  // 11. CLOSED ARCHITECTURAL MONOGRAPH (Лид-магнит на скачивание буклета с 17 планировками)
  booklet: `
<section class="w-full py-24 sm:py-32 bg-white border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-5xl mx-auto px-6">
    <div class="p-8 sm:p-14 rounded-3xl bg-[#F7F5F0] border border-[#1A1816]/[0.08] grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-left">
      <div class="md:col-span-7">
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ЗАКРЫТЫЙ МАТЕРИАЛ // 09</span>
        <h3 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl font-normal text-[#1A1816] leading-snug mb-4">
          Архитектурная монография дома с планировками и ценами в PDF
        </h3>
        <p class="text-sm text-[#62605B] font-light leading-relaxed mb-6">
          Полный альбом проекта: 17 экспликаций квартир с меблировкой, схемы вентиляции и разводки инженерии, паспорта фасада и спецификация отделки холлов.
        </p>
        <div class="flex items-center gap-4 text-xs font-mono text-[#1A1816]">
          <span>📄 48 страниц</span>
          <span>•</span>
          <span>Высокое разрешение</span>
          <span>•</span>
          <span>PDF 24 МБ</span>
        </div>
      </div>

      <div class="md:col-span-5">
        <form onsubmit="handleMonographSubmit(event)" class="space-y-3">
          <input type="text" name="name" required placeholder="Ваше имя" class="w-full h-12 px-4 rounded-xl bg-white border border-[#1A1816]/10 text-sm text-[#1A1816] placeholder-[#62605B]/60 focus:outline-none focus:border-[#8E734E]" />
          <input type="tel" name="phone" required placeholder="+7 (___) ___-__-__" class="w-full h-12 px-4 rounded-xl bg-white border border-[#1A1816]/10 text-sm text-[#1A1816] placeholder-[#62605B]/60 focus:outline-none focus:border-[#8E734E]" />
          <button type="submit" class="w-full h-12 rounded-xl bg-[#8E734E] hover:bg-[#77603F] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-md cursor-pointer">
            Получить PDF в WhatsApp / Telegram
          </button>
        </form>
        <div id="monograph-success" class="hidden text-xs text-[#2C3E35] font-semibold text-center mt-3">
          ✓ Альбом отправлен в мессенджер!
        </div>
      </div>
    </div>
  </div>
</section>
<script>
function handleMonographSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button');
  btn.innerText = 'Отправка...';
  setTimeout(function() {
    e.target.reset();
    btn.innerText = 'Получить PDF в WhatsApp / Telegram';
    var succ = document.getElementById('monograph-success');
    if (succ) succ.classList.remove('hidden');
  }, 700);
}
</script>
`,

  // 12. LEGAL DOCUMENTATION & 214-FZ (Аккордеон документов, эскроу, наш.дом.рф)
  docs: `
<section id="docs" class="w-full py-24 sm:py-32 bg-[#F7F5F0] border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-4xl mx-auto px-6 text-left">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">ПРАВОВОЙ СТАТУС // 10</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] tracking-tight">
        Надежность по стандарту 214-ФЗ
      </h2>
      <p class="text-sm text-[#62605B] mt-4 font-light">
        Строительство ведется в строгом соответствии с законодательством с размещением средств дольщиков на защищенных эскроу-счетах.
      </p>
    </div>

    <div class="space-y-4">
      <details class="group p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1A1816] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl font-semibold pr-4">Разрешение на строительство</span>
          <span class="w-7 h-7 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#1A1816] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-xs text-[#62605B] leading-relaxed pt-4 mt-4 border-t border-[#1A1816]/[0.06] font-light flex items-center justify-between">
          <span>№ 77-182000-019482-2024 от 12.03.2024. Выдано Мосгосстройнадзором.</span>
          <a href="#" class="text-[#8E734E] font-semibold hover:underline">Скачать PDF &rarr;</a>
        </div>
      </details>

      <details class="group p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1A1816] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl font-semibold pr-4">Проектная декларация на наш.дом.рф</span>
          <span class="w-7 h-7 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#1A1816] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-xs text-[#62605B] leading-relaxed pt-4 mt-4 border-t border-[#1A1816]/[0.06] font-light flex items-center justify-between">
          <span>Идентификатор объекта в Единой информационной системе жилищного строительства: 54920.</span>
          <a href="https://наш.дом.рф" target="_blank" rel="noopener noreferrer" class="text-[#8E734E] font-semibold hover:underline">Открыть реестр &rarr;</a>
        </div>
      </details>

      <details class="group p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1A1816] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl font-semibold pr-4">Банк-партнер и эскроу-счета</span>
          <span class="w-7 h-7 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#1A1816] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-xs text-[#62605B] leading-relaxed pt-4 mt-4 border-t border-[#1A1816]/[0.06] font-light">
          Проектное финансирование открыто в ПАО «Сбербанк». Все средства резидентов размещаются на индивидуальных счетах эскроу до подписания акта ввода в эксплуатацию.
        </div>
      </details>

      <details class="group p-6 rounded-2xl bg-white border border-[#1A1816]/[0.07] transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1A1816] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl font-semibold pr-4">Типовой договор долевого участия (ДДУ)</span>
          <span class="w-7 h-7 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#1A1816] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-xs text-[#62605B] leading-relaxed pt-4 mt-4 border-t border-[#1A1816]/[0.06] font-light flex items-center justify-between">
          <span>Электронная регистрация в Росреестре за 24 часа. Без комиссий и госпошлин.</span>
          <a href="#" class="text-[#8E734E] font-semibold hover:underline">Шаблон договора &rarr;</a>
        </div>
      </details>
    </div>
  </div>
</section>
`,

  // 13. ABOUT DEVELOPER (15 лет на рынке, камерный девелопмент, финансовые гарантии)
  developer: `
<section class="w-full py-24 sm:py-32 bg-white border-b border-[#1A1816]/[0.07] font-['Manrope',sans-serif]">
  <div class="max-w-7xl mx-auto px-6 text-left">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <div class="lg:col-span-7">
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-3">О ЗАСТРОЙЩИКЕ // 11</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1A1816] leading-tight mb-6">
          15 лет создания штучной архитектуры в Москве
        </h2>
        <div class="space-y-4 text-[#62605B] text-base leading-relaxed font-light mb-8">
          <p>
            Мы не строим миллионы квадратных метров. Наша специализация — штучные клубные дома в знаковых локациях Москвы, где каждая деталь разрабатывается с участием ведущих архитектурных бюро.
          </p>
          <p>
            Все 6 предыдущих объектов сданы точно в заявленные сроки с высшим баллом надежности Единого ресурса застройщиков (ЕРЗ).
          </p>
        </div>
        <div class="grid grid-cols-3 gap-6 pt-6 border-t border-[#1A1816]/[0.08]">
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1A1816]">15 лет</div>
            <div class="text-xs text-[#62605B]">безупречной работы</div>
          </div>
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1A1816]">6 домов</div>
            <div class="text-xs text-[#62605B]">сдано в срок</div>
          </div>
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#8E734E]">5.0 ЕРЗ</div>
            <div class="text-xs text-[#62605B]">наивысший балл надежности</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="aspect-[4/3] rounded-3xl overflow-hidden border border-[#1A1816]/[0.08] shadow-lg bg-[#EFECE6]">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" alt="Архитектурный девелопмент" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 14. FINAL CONTACT, BOOKING FORM & FOOTER (Персональный визит за чашкой кофе, реквизиты, оферта)
  finalAndFooter: `
<!-- Final Appointment & Contact Section -->
<section id="booking-modal" class="w-full py-24 sm:py-32 bg-[#1A1816] text-white font-['Manrope',sans-serif]">
  <div class="max-w-5xl mx-auto px-6 text-left">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      <div class="md:col-span-6">
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8E734E] block mb-4">ПРИВАТНАЯ ПРЕЗЕНТАЦИЯ</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-white leading-tight mb-6">
          Познакомьтесь с проектом в офисе продаж за чашкой кофе
        </h2>
        <p class="text-sm sm:text-base text-white/70 font-light leading-relaxed mb-8">
          Проведем индивидуальный разбор планировок, покажем образцы натурального клинкера и отделки холлов, рассчитаем индивидуальные сценарии рассрочки.
        </p>
        <div class="space-y-2 text-xs text-white/60 font-mono">
          <div>📍 Офис продаж: Москва, ул. Большая Полянка, дом 14</div>
          <div>🕒 Ежедневно с 10:00 до 21:00 (по предварительной записи)</div>
          <div>📞 Телефон: +7 (495) 241-14-14</div>
        </div>
      </div>

      <div class="md:col-span-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
        <form onsubmit="handleLeadBookingSubmit(event)" class="space-y-4">
          <!-- Hidden inputs automatically populated when lot is selected -->
          <input type="hidden" name="selected_lot_id" id="form-selected-lot" value="" />
          <input type="hidden" name="lot_price" id="form-lot-price" value="" />

          <div id="lot-selected-banner" class="hidden p-3 rounded-xl bg-[#8E734E]/20 border border-[#8E734E]/30 text-xs text-[#8E734E] font-mono">
            Выбранный лот: <strong id="selected-lot-label" class="text-white"></strong>
          </div>

          <div>
            <label class="block text-[10px] uppercase font-mono tracking-wider text-white/60 mb-1.5">Ваше имя</label>
            <input type="text" name="name" required placeholder="Константин" class="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#8E734E]" />
          </div>

          <div>
            <label class="block text-[10px] uppercase font-mono tracking-wider text-white/60 mb-1.5">Номер телефона</label>
            <input type="tel" name="phone" required placeholder="+7 (___) ___-__-__" class="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#8E734E]" />
          </div>

          <div>
            <label class="block text-[10px] uppercase font-mono tracking-wider text-white/60 mb-1.5">Удобный мессенджер</label>
            <select name="messenger" class="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-[#8E734E]">
              <option value="telegram" class="text-black">Telegram</option>
              <option value="whatsapp" class="text-black">WhatsApp</option>
              <option value="call" class="text-black">Телефонный звонок</option>
            </select>
          </div>

          <button type="submit" class="w-full h-13 rounded-full bg-[#8E734E] hover:bg-[#77603F] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all shadow-lg cursor-pointer mt-2">
            Записаться на встречу
          </button>
          
          <div id="booking-success-msg" class="hidden p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            ✓ Заявка принята. Менеджер свяжется с вами в течение 15 минут.
          </div>

          <p class="text-[10px] text-white/40 text-center leading-relaxed">
            Нажимая кнопку, вы подтверждаете согласие на обработку персональных данных.
          </p>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="w-full py-16 bg-[#11100E] text-white/50 font-['Manrope',sans-serif] border-t border-white/8 text-xs text-left">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/8">
      <div class="md:col-span-4">
        <span class="font-['Cormorant_Garamond',serif] text-2xl font-bold tracking-tight text-white block mb-2">БОЛЬШАЯ ПОЛЯНКА, 14</span>
        <p class="text-xs text-white/40 leading-relaxed font-light max-w-sm">
          Клубный дом бизнес-класса на 17 квартир, пентхаус и сити-боксы. Проектное финансирование ПАО «Сбербанк».
        </p>
      </div>

      <div class="md:col-span-3">
        <span class="text-xs font-mono uppercase tracking-wider text-white block mb-4">Навигация</span>
        <div class="space-y-2 flex flex-col">
          <a href="#hero" class="hover:text-white transition-colors">О проекте</a>
          <a href="#catalog" class="hover:text-white transition-colors">Каталог 28 лотов</a>
          <a href="#manifesto" class="hover:text-white transition-colors">Манифест приватности</a>
          <a href="#materials" class="hover:text-white transition-colors">Материалы и инженерия</a>
          <a href="#docs" class="hover:text-white transition-colors">Документация 214-ФЗ</a>
        </div>
      </div>

      <div class="md:col-span-2">
        <span class="text-xs font-mono uppercase tracking-wider text-white block mb-4">Связь</span>
        <div class="space-y-2 flex flex-col">
          <a href="https://t.me/polianka14_bot" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Telegram-офис</a>
          <a href="tel:+74952411414" class="hover:text-white transition-colors">+7 (495) 241-14-14</a>
          <a href="mailto:sales@polianka14.ru" class="hover:text-white transition-colors">sales@polianka14.ru</a>
        </div>
      </div>

      <div class="md:col-span-3">
        <span class="text-xs font-mono uppercase tracking-wider text-white block mb-4">Юридическая информация</span>
        <div class="space-y-1 text-[11px] text-white/40 leading-relaxed font-light">
          <div>Застройщик: ООО СЗ «Полянка Девелопмент»</div>
          <div>Кадастровый номер участка: 77:01:0002014:48</div>
          <div>Проектная декларация размещена на наш.дом.рф</div>
          <div class="pt-2">
            <a href="#" class="hover:underline text-white/60">Политика конфиденциальности</a> • <a href="#" class="hover:underline text-white/60">Отказ от ответственности</a>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30">
      <div>© 2026 Клубный дом «Большая Полянка, 14». Любая информация носит ознакомительный характер и не является публичной офертой.</div>
      <div>Made with Tilda Template Vault</div>
    </div>
  </div>
</footer>

<script>
function openLotBooking(lotId, price) {
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
}

function handleLeadBookingSubmit(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.innerText = 'Отправка...';
  setTimeout(function() {
    e.target.reset();
    btn.innerText = 'Записаться на встречу';
    var succ = document.getElementById('booking-success-msg');
    if (succ) succ.classList.remove('hidden');
  }, 700);
}
</script>
`,
};
