/**
 * FEMME SCULPT: Luxury Wellness & Mindful Pilates Landing Templates (14 Screens)
 * Design Aesthetic: "Quiet luxury", warm milky-beige palette (#F7F4EE), Cormorant Garamond serif + Manrope sans.
 */

export const FEMME_TEMPLATES = {
  // 1. HEADER (Фиксированная стеклянная навигация, логотип-антиква, RU|EN, CTA в Telegram)
  header: `
<header class="fixed top-0 left-0 right-0 z-50 bg-[#F7F4EE]/90 backdrop-blur-md border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif] transition-all duration-300">
  <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
    <!-- Logo -->
    <a href="#" class="flex flex-col text-left group">
      <span class="font-['Cormorant_Garamond',serif] text-2xl font-bold tracking-tight text-[#1E1D1B] group-hover:opacity-80 transition-opacity">FEMME SCULPT</span>
      <span class="text-[9px] uppercase tracking-[0.25em] text-[#6E6B65] -mt-1">Pilates & Mindful Core</span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#1E1D1B]">
      <a href="#about" class="hover:text-[#C25E38] transition-colors">О программе</a>
      <a href="#benefits" class="hover:text-[#C25E38] transition-colors">Преимущества</a>
      <a href="#syllabus" class="hover:text-[#C25E38] transition-colors">План курса</a>
      <a href="#pricing" class="hover:text-[#C25E38] transition-colors">Тарифы</a>
      <a href="#author" class="hover:text-[#C25E38] transition-colors">Об авторе</a>
      <a href="#faq" class="hover:text-[#C25E38] transition-colors">FAQ</a>
    </nav>

    <!-- Language & CTA Button -->
    <div class="flex items-center gap-4 sm:gap-6">
      <!-- Language Switcher -->
      <div class="text-xs font-semibold tracking-wider text-[#6E6B65] flex items-center gap-1.5 border border-[#1E1D1B]/10 px-2.5 py-1 rounded-full bg-white/50">
        <span class="text-[#1E1D1B] cursor-default font-bold">RU</span>
        <span class="opacity-30">|</span>
        <a href="#lang-en" title="English version coming soon" class="hover:text-[#1E1D1B] transition-colors opacity-60">EN</a>
      </div>

      <!-- Telegram Bot CTA -->
      <a href="https://t.me/femmesculpt_bot?start=header" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#242320] hover:bg-[#383733] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
        <span>Записаться в боте</span>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
      </a>
    </div>
  </div>
</header>
`,

  // 2. HERO (Первый экран: оффер, антиква с курсивом, медиа-превью тренера, CTA)
  hero: `
<section class="relative w-full pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#F7F4EE] overflow-hidden font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
      <!-- Left Column: Copy & Offer -->
      <div class="lg:col-span-7 flex flex-col items-start text-left">
        <!-- Eyebrow Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] border border-[#1E1D1B]/10 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1E1D1B] mb-8">
          <span class="w-1.5 h-1.5 rounded-full bg-[#C25E38]"></span>
          FEMME SCULPT | CORE & ABS
        </div>

        <!-- H1 Headline (Cormorant Garamond + Terracotta Italic) -->
        <h1 class="font-['Cormorant_Garamond',serif] text-4xl sm:text-6xl lg:text-[64px] font-normal leading-[1.12] text-[#1E1D1B] mb-6 tracking-tight">
          Глубокий контакт с телом, <span class="italic font-medium text-[#C25E38]">королевская осанка</span> и сильный кор
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg text-[#6E6B65] leading-relaxed max-w-xl mb-10 font-light">
          Авторская система тренировок по 20–30 минут в день. Бережный пилатес и функциональная сила без изнуряющего кардио, боли в суставах и срывов.
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <a href="https://t.me/femmesculpt_bot?start=hero" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 h-13 px-8 rounded-full bg-[#242320] hover:bg-[#383733] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            <span>Начать в Telegram</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="#syllabus" class="w-full sm:w-auto inline-flex items-center justify-center h-13 px-7 rounded-full bg-white/80 hover:bg-white text-[#1E1D1B] border border-[#1E1D1B]/12 text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer shadow-sm">
            Смотреть программу ↓
          </a>
        </div>

        <!-- Trust Mini-Proof -->
        <div class="flex items-center gap-6 mt-12 pt-8 border-t border-[#1E1D1B]/10 w-full">
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1E1D1B]">1 500+</div>
            <div class="text-xs text-[#6E6B65]">выпускниц курса</div>
          </div>
          <div class="w-px h-8 bg-[#1E1D1B]/10"></div>
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1E1D1B]">20 мин</div>
            <div class="text-xs text-[#6E6B65]">в день в своем ритме</div>
          </div>
          <div class="w-px h-8 bg-[#1E1D1B]/10"></div>
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1E1D1B]">100%</div>
            <div class="text-xs text-[#6E6B65]">забота о суставах</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Editorial Media Portrait Frame -->
      <div class="lg:col-span-5 relative flex justify-center">
        <div class="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-[#1E1D1B]/10 shadow-xl bg-[#EFE9DF]">
          <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85" alt="Femme Sculpt Pilates" class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#1E1D1B]/50 via-transparent to-transparent"></div>
          
          <!-- Floating Badge Overlay -->
          <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[11px] uppercase tracking-wider text-[#6E6B65]">Формат практики</span>
              <span class="text-sm font-bold text-[#1E1D1B] font-['Cormorant_Garamond',serif] text-base">Мягкий контроль & глубина</span>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-[#C25E38]/10 text-[#C25E38] font-semibold">Дома / В зале</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 3. ABOUT PROGRAM (Философия, синтез пилатеса и функциональной силы, выноска-цитата)
  about: `
<section id="about" class="w-full py-24 sm:py-32 bg-white border-y border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-left mb-6">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38]">ФИЛОСОФИЯ / 01</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <!-- Left Column: Manifesto -->
      <div class="lg:col-span-7">
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] leading-[1.2] mb-8">
          Синтез классического пилатеса и <span class="italic font-medium">осознанной биомеханики</span>
        </h2>
        <div class="space-y-6 text-[#6E6B65] text-base sm:text-lg leading-relaxed font-light">
          <p>
            Большинство тренировок пресса строятся на компрессии: бесконечные скручивания, планки через напряжение в шее и перегруженная поясница. В результате живот «вываливается», а спина устает еще сильнее.
          </p>
          <p>
            Программа <strong class="text-[#1E1D1B] font-semibold">Femme Sculpt</strong> переворачивает этот подход. Мы начинаем изнутри: возвращаем подвижность грудному отделу, настраиваем диафрагмальное дыхание и подключаем поперечную мышцу живота и мышцы тазового дна.
          </p>
          <p>
            Это не просто упражнения на коврике — это инвестиция в ваше самочувствие, красивую походку и ощущение собранности тела в любом возрасте.
          </p>
        </div>
      </div>

      <!-- Right Column: Editorial Quote Callout Box -->
      <div class="lg:col-span-5">
        <div class="p-8 sm:p-10 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 relative flex flex-col justify-between">
          <div class="font-['Cormorant_Garamond',serif] text-6xl text-[#C25E38]/30 leading-none mb-4">“</div>
          <blockquote class="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl italic text-[#1E1D1B] leading-snug mb-8">
            Кор — это внутренний центр тела. Когда этот центр стабилен и спокоен, каждое движение становится легким и грациозным.
          </blockquote>
          <div class="pt-6 border-t border-[#1E1D1B]/10 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#1E1D1B]">Главный принцип курса</span>
            <span class="text-xs text-[#6E6B65]">0% давления / 100% точности</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 4. BENEFITS (Преимущества программы: 6 карточек с тонкой нумерацией)
  benefits: `
<section id="benefits" class="w-full py-24 sm:py-32 bg-[#F7F4EE] font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
      <div>
        <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ПОДХОД ПРОГРАММЫ / 02</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
          Почему это работает лучше изнуряющего кардио
        </h2>
      </div>
      <p class="text-sm text-[#6E6B65] max-w-xs font-light">
        Выверенная последовательность уроков от простого к глубокому контролю.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 01 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm hover:border-[#C25E38]/40 transition-all duration-300 group">
        <div>
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">(01)</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1E1D1B] mb-3">Осознанность каждого движения</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Учимся чувствовать каждую связку мышц. Вы прекращаете выполнять движения механически и подключаете нервно-мышечный контроль.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/6 text-[11px] uppercase tracking-widest text-[#6E6B65]">Нейромышечный фокус</div>
      </div>

      <!-- Card 02 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm hover:border-[#C25E38]/40 transition-all duration-300 group">
        <div>
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">(02)</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1E1D1B] mb-3">Бережная забота о суставах</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Никаких ударных прыжков и компрессии коленей и позвоночника. Мягкие оси вращения и вытяжение вдоль продольной оси тела.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/6 text-[11px] uppercase tracking-widest text-[#6E6B65]">Безопасность 360°</div>
      </div>

      <!-- Card 03 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm hover:border-[#C25E38]/40 transition-all duration-300 group">
        <div>
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">(03)</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1E1D1B] mb-3">20–30 минут в день</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Оптимальный тайминг, который легко встраивается в любой график. Регулярность важнее многочасового изнурения раз в неделю.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/6 text-[11px] uppercase tracking-widest text-[#6E6B65]">Легкая привычка</div>
      </div>

      <!-- Card 04 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm hover:border-[#C25E38]/40 transition-all duration-300 group">
        <div>
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">(04)</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1E1D1B] mb-3">Дыхание и глубокий кор</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Синхронизация вдоха и выдоха с движением диафрагмы формирует подтянутый плоский живот без выпячивания и отеков.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/6 text-[11px] uppercase tracking-widest text-[#6E6B65]">Внутренний корсет</div>
      </div>

      <!-- Card 05 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm hover:border-[#C25E38]/40 transition-all duration-300 group">
        <div>
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">(05)</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1E1D1B] mb-3">Эстетика длинных линий</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Мы не растим объемные мышцы — мы формируем подтянутый силуэт балерины: длинная шея, раскрытые плечи и тонкая талия.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/6 text-[11px] uppercase tracking-widest text-[#6E6B65]">Грация и осанка</div>
      </div>

      <!-- Card 06 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm hover:border-[#C25E38]/40 transition-all duration-300 group">
        <div>
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-4 group-hover:translate-x-1 transition-transform">(06)</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-semibold text-[#1E1D1B] mb-3">Доступ через Telegram-бот</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Все уроки, чек-листы и напоминания доступны в один клик прямо в мессенджере. Никаких сложных паролей и забытых логинов.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/6 text-[11px] uppercase tracking-widest text-[#6E6B65]">Всегда под рукой</div>
      </div>
    </div>
  </div>
</section>
`,

  // 5. AUDIENCE / CONTRAST (Двухколоночный блок: «Вам подойдет» vs «Не ваш формат»)
  audience: `
<section class="w-full py-24 sm:py-32 bg-white border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ДИАГНОСТИКА / 03</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
        Для кого создан курс Femme Sculpt
      </h2>
      <p class="text-sm text-[#6E6B65] mt-4 font-light">
        Честный ориентир, который поможет понять, подходит ли вам наша методика.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      <!-- Column A: Подходит (Белая карточка, тонкие стрелки) -->
      <div class="p-8 sm:p-10 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/10 flex flex-col justify-between">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#1E1D1B] uppercase tracking-wider mb-6 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            Вам точно подойдет курс, если:
          </div>
          <ul class="space-y-5 text-sm sm:text-base text-[#1E1D1B]">
            <li class="flex items-start gap-3.5">
              <span class="text-[#C25E38] font-bold text-lg leading-none mt-0.5">&rarr;</span>
              <span>Вы чувствуете зажимы в шее, скованность в плечах и усталость в пояснице после рабочего дня.</span>
            </li>
            <li class="flex items-start gap-3.5">
              <span class="text-[#C25E38] font-bold text-lg leading-none mt-0.5">&rarr;</span>
              <span>Хотите плоский подтянутый живот, но стандартные упражнения на пресс вызывают боль в шее или выпячивание.</span>
            </li>
            <li class="flex items-start gap-3.5">
              <span class="text-[#C25E38] font-bold text-lg leading-none mt-0.5">&rarr;</span>
              <span>Устали от тренажерного зала, тяжелых весов и постоянного чувства истощения после тренировок.</span>
            </li>
            <li class="flex items-start gap-3.5">
              <span class="text-[#C25E38] font-bold text-lg leading-none mt-0.5">&rarr;</span>
              <span>Ищете понятную систему коротких домашних занятий с бережным контролем дыхания и техники.</span>
            </li>
          </ul>
        </div>
        <div class="mt-8 pt-6 border-t border-[#1E1D1B]/10 text-xs text-[#6E6B65] italic font-['Cormorant_Garamond',serif] text-base">
          Результат: подтянутость, легкость в теле и расправленные плечи уже со второй недели.
        </div>
      </div>

      <!-- Column B: Не подходит (Песочная карточка, деликатные ограничения) -->
      <div class="p-8 sm:p-10 rounded-3xl bg-[#EFE9DF]/60 border border-[#1E1D1B]/10 flex flex-col justify-between">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-[#6E6B65] uppercase tracking-wider mb-6">
            <span class="w-2 h-2 rounded-full bg-amber-600/70"></span>
            Возможно, это не ваш формат, если:
          </div>
          <ul class="space-y-5 text-sm sm:text-base text-[#6E6B65]">
            <li class="flex items-start gap-3.5">
              <span class="text-[#6E6B65] font-light text-base leading-none mt-0.5">—</span>
              <span>Вы ищете интенсивный кроссфит или сушку на износ с поднятием максимальных весов.</span>
            </li>
            <li class="flex items-start gap-3.5">
              <span class="text-[#6E6B65] font-light text-base leading-none mt-0.5">—</span>
              <span>Ожидаете результат «минус 10 кг за 3 дня» без постепенной адаптации биомеханики тела.</span>
            </li>
            <li class="flex items-start gap-3.5">
              <span class="text-[#6E6B65] font-light text-base leading-none mt-0.5">—</span>
              <span>Ищете исключительно медитативную пассивную растяжку без укрепления постуральных мышц.</span>
            </li>
            <li class="flex items-start gap-3.5">
              <span class="text-[#6E6B65] font-light text-base leading-none mt-0.5">—</span>
              <span>Имеются острые воспалительные процессы или недавние операции без разрешения врача.</span>
            </li>
          </ul>
        </div>
        <div class="mt-8 pt-6 border-t border-[#1E1D1B]/10 text-xs text-[#6E6B65] italic font-['Cormorant_Garamond',serif] text-base">
          Мы честно ценим ваше здоровье и время, поэтому ставим бережность превыше рекордов.
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 6. METRICS (Что входит в курс: 4 крупные антикварные цифры)
  metrics: `
<section class="w-full py-20 bg-[#F7F4EE] border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-left mb-12">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38]">НАПОЛНЕНИЕ КУРСА / 04</span>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      <!-- Metric 1 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 shadow-sm flex flex-col items-start">
        <div class="font-['Cormorant_Garamond',serif] text-5xl sm:text-6xl font-bold text-[#1E1D1B] mb-2 leading-none">10</div>
        <div class="text-sm font-semibold text-[#1E1D1B] mb-1">Практических тренировок</div>
        <div class="text-xs text-[#6E6B65] font-light">по 20–30 минут в Full HD качестве</div>
      </div>

      <!-- Metric 2 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 shadow-sm flex flex-col items-start">
        <div class="font-['Cormorant_Garamond',serif] text-5xl sm:text-6xl font-bold text-[#C25E38] mb-2 leading-none">03</div>
        <div class="text-sm font-semibold text-[#1E1D1B] mb-1">Видео-лекции по технике</div>
        <div class="text-xs text-[#6E6B65] font-light">биомеханика таза, диафрагма и корсет</div>
      </div>

      <!-- Metric 3 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 shadow-sm flex flex-col items-start">
        <div class="font-['Cormorant_Garamond',serif] text-5xl sm:text-6xl font-bold text-[#1E1D1B] mb-2 leading-none">21</div>
        <div class="text-sm font-semibold text-[#1E1D1B] mb-1">День трек-плана</div>
        <div class="text-xs text-[#6E6B65] font-light">структурированная программа прогресса</div>
      </div>

      <!-- Metric 4 -->
      <div class="p-8 rounded-2xl bg-white border border-[#1E1D1B]/8 shadow-sm flex flex-col items-start">
        <div class="font-['Cormorant_Garamond',serif] text-5xl sm:text-6xl font-bold text-[#1E1D1B] mb-2 leading-none">24/7</div>
        <div class="text-sm font-semibold text-[#1E1D1B] mb-1">Чат с поддержкой</div>
        <div class="text-xs text-[#6E6B65] font-light">ответы на вопросы и разбор техники</div>
      </div>
    </div>
  </div>
</section>
`,

  // 7. SYLLABUS / ROADMAP (Программа по 3 неделям)
  syllabus: `
<section id="syllabus" class="w-full py-24 sm:py-32 bg-white border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="max-w-2xl mb-16 text-left">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ПРОГРАММА ТРЕНИРОВОК / 05</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
        Три недели пошаговой трансформации
      </h2>
      <p class="text-sm text-[#6E6B65] mt-4 font-light">
        Продуманная траектория: от пробуждения глубоких стабилизаторов до формирования грациозной осанки.
      </p>
    </div>

    <div class="space-y-6">
      <!-- Week 01 -->
      <div class="p-8 sm:p-10 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C25E38]/30 transition-all">
        <div class="md:w-1/3">
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-1">Неделя 01</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#1E1D1B]">Пробуждение и включение центра</h3>
        </div>
        <div class="md:w-2/3 space-y-2 text-sm text-[#6E6B65] font-light border-t md:border-t-0 md:border-l border-[#1E1D1B]/10 pt-4 md:pt-0 md:pl-8">
          <p>• Диафрагмальное 3D-дыхание и нейтральное выравнивание позвоночника.</p>
          <p>• Активация поперечной мышцы живота и мягкий тонус тазового дна.</p>
          <p>• Снятие зажимов с поясницы и мобилизация грудной клетки.</p>
          <div class="text-xs font-semibold text-[#1E1D1B] pt-2">Результат: уходит напряжение с поясницы, живот перестает выпячиваться к вечеру.</div>
        </div>
      </div>

      <!-- Week 02 -->
      <div class="p-8 sm:p-10 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C25E38]/30 transition-all">
        <div class="md:w-1/3">
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-1">Неделя 02</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#1E1D1B]">Прогрессия и глубина контроля</h3>
        </div>
        <div class="md:w-2/3 space-y-2 text-sm text-[#6E6B65] font-light border-t md:border-t-0 md:border-l border-[#1E1D1B]/10 pt-4 md:pt-0 md:pl-8">
          <p>• Подключение диагональных миофасциальных цепочек (косые мышцы кора).</p>
          <p>• Стабилизация таза при односторонней нагрузке на ноги и ягодицы.</p>
          <p>• Укрепление лопаток и мышц, поддерживающих грудной отдел.</p>
          <div class="text-xs font-semibold text-[#1E1D1B] pt-2">Результат: расправленные плечи, уменьшение объемов талии на 1.5–3 см.</div>
        </div>
      </div>

      <!-- Week 03 -->
      <div class="p-8 sm:p-10 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C25E38]/30 transition-all">
        <div class="md:w-1/3">
          <span class="text-xs font-mono font-bold text-[#C25E38] uppercase tracking-wider block mb-1">Неделя 03</span>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#1E1D1B]">Скульптурирование и интеграция</h3>
        </div>
        <div class="md:w-2/3 space-y-2 text-sm text-[#6E6B65] font-light border-t md:border-t-0 md:border-l border-[#1E1D1B]/10 pt-4 md:pt-0 md:pl-8">
          <p>• Плавные динамические связки движений: сила через удлинение мышц.</p>
          <p>• Комплексные функциональные упражнения с контролем центра.</p>
          <p>• Интеграция правильных паттернов шага и сидения в повседневную жизнь.</p>
          <div class="text-xs font-semibold text-[#1E1D1B] pt-2">Результат: привычка держать осанку естественно, ощущение подтянутости всего тела.</div>
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 8. VIDEO PREVIEW (Стилизованный мокап смартфона / плеера с постером и Play)
  video: `
<section class="w-full py-24 sm:py-32 bg-[#F7F4EE] border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">АТМОСФЕРА ТРЕНИРОВОК / 06</span>
    <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight mb-4">
      Почувствуйте ритм и эстетику уроков
    </h2>
    <p class="text-sm text-[#6E6B65] max-w-xl mx-auto mb-12 font-light">
      Каждая тренировка записана в профессиональной студии со спокойным музыкальным сопровождением и детальными голосовыми подсказками.
    </p>

    <!-- Video Mockup Frame (16:9 responsive container) -->
    <div class="relative w-full aspect-video rounded-3xl overflow-hidden border border-[#1E1D1B]/10 shadow-2xl bg-[#EFE9DF] group cursor-pointer">
      <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1600&q=85" alt="Video Preview Workout" class="w-full h-full object-cover filter brightness-90 group-hover:scale-102 transition-transform duration-500" />
      <div class="absolute inset-0 bg-[#1E1D1B]/20 group-hover:bg-[#1E1D1B]/10 transition-colors"></div>

      <!-- Center Play Button with Glowing Wave -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative flex items-center justify-center">
          <span class="absolute w-20 h-20 rounded-full bg-white/30 animate-ping"></span>
          <button type="button" aria-label="Play video preview" onclick="alert('Видео-превью доступно в Telegram-боте курса');" class="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white text-[#1E1D1B] flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 ml-1 text-[#242320]" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>
      </div>

      <!-- Bottom Overlay Bar -->
      <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 flex items-center justify-between text-left">
        <div>
          <span class="text-[10px] uppercase tracking-wider text-[#6E6B65]">Фрагмент урока 02</span>
          <h4 class="text-sm font-bold text-[#1E1D1B] font-['Cormorant_Garamond',serif] sm:text-base">Включение поперечной мышцы и дыхание диафрагмой</h4>
        </div>
        <span class="text-xs font-mono text-[#6E6B65] bg-white/70 px-2.5 py-1 rounded-full border border-black/5">03:45 min</span>
      </div>
    </div>
  </div>
</section>
`,

  // 9. HOW IT WORKS (3 простых шага: Telegram-бот -> Доступ -> Тренировки)
  howItWorks: `
<section class="w-full py-24 sm:py-32 bg-white border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ПРОЦЕСС / 07</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
        Как устроено обучение: 3 простых шага
      </h2>
      <p class="text-sm text-[#6E6B65] mt-4 font-light">
        Без сложных регистраций. Все материалы и общение структурированы в удобном Telegram-боте.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      <!-- Step 1 -->
      <div class="p-8 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 flex flex-col justify-between relative shadow-sm">
        <div>
          <div class="font-['Cormorant_Garamond',serif] text-5xl font-bold text-[#C25E38] mb-4 leading-none">01</div>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1E1D1B] mb-3">Переход в Telegram-бот</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Нажимаете кнопку на сайте, выбираете подходящий тариф и подтверждаете участие. Бот моментально присылает приветственный гайд.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/8 text-xs font-semibold text-[#1E1D1B]">Мгновенное подключение</div>
      </div>

      <!-- Step 2 -->
      <div class="p-8 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 flex flex-col justify-between relative shadow-sm">
        <div>
          <div class="font-['Cormorant_Garamond',serif] text-5xl font-bold text-[#C25E38] mb-4 leading-none">02</div>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1E1D1B] mb-3">Доступ к урокам и трекеру</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Получаете персональное меню со всеми тренировками, лекциями и интерактивным трекером привычек. Видео открываются прямо в мессенджере.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/8 text-xs font-semibold text-[#1E1D1B]">Без лишних приложений</div>
      </div>

      <!-- Step 3 -->
      <div class="p-8 rounded-3xl bg-[#F7F4EE] border border-[#1E1D1B]/8 flex flex-col justify-between relative shadow-sm">
        <div>
          <div class="font-['Cormorant_Garamond',serif] text-5xl font-bold text-[#C25E38] mb-4 leading-none">03</div>
          <h3 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1E1D1B] mb-3">Практика в своем ритме</h3>
          <p class="text-sm text-[#6E6B65] leading-relaxed font-light">
            Занимаетесь 20–30 минут дома или на отдыхе. В тарифе с обратной связью отправляете видео выполнения на проверку автору.
          </p>
        </div>
        <div class="mt-8 pt-4 border-t border-[#1E1D1B]/8 text-xs font-semibold text-[#1E1D1B]">Видимый результат уже через 14 дней</div>
      </div>
    </div>
  </div>
</section>
`,

  // 10. PRICING (Тарифные планы: «Базовый» и «С заботой», диплинки в Telegram)
  pricing: `
<section id="pricing" class="w-full py-24 sm:py-32 bg-[#F7F4EE] border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-5xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ИНВЕСТИЦИЯ В СЕБЯ / 08</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
        Выберите комфортный формат участия
      </h2>
      <p class="text-sm text-[#6E6B65] mt-4 font-light">
        Прозрачная стоимость без скрытых платежей. Доступ к материалам сохраняется навсегда.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      <!-- Plan 1: Базовый -->
      <div class="p-8 sm:p-10 rounded-3xl bg-white border border-[#1E1D1B]/10 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1E1D1B]">Тариф «Базовый»</h3>
            <span class="text-xs px-3 py-1 rounded-full bg-[#EFE9DF] text-[#1E1D1B] font-semibold">Самостоятельно</span>
          </div>
          <p class="text-sm text-[#6E6B65] mb-8 font-light">
            Для тех, кто привык двигаться в индивидуальном темпе и хочет получить готовую проверенную систему.
          </p>
          <div class="mb-8">
            <span class="font-['Cormorant_Garamond',serif] text-5xl font-bold text-[#1E1D1B]">4 900 ₽</span>
            <span class="text-xs text-[#6E6B65] ml-2">единоразово / бессрочно</span>
          </div>
          <ul class="space-y-4 mb-8 text-sm text-[#1E1D1B]">
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>10 полноценных тренировок Full HD (по 20–30 мин)</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>3 обучающие лекции по дыханию и биомеханике таза</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>Интерактивный трекер привычек в Telegram-боте</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>Гайд по эргономике рабочего места и снятию зажимов</span>
            </li>
            <li class="flex items-start gap-3 opacity-40 line-through">
              <span>—</span>
              <span>Индивидуальный видео-разбор техники от автора</span>
            </li>
          </ul>
        </div>
        <a href="https://t.me/femmesculpt_bot?start=tariff_base" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center h-13 rounded-full bg-[#242320] hover:bg-[#383733] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm cursor-pointer">
          Выбрать тариф «Базовый»
        </a>
      </div>

      <!-- Plan 2: С заботой (Рекомендуем) -->
      <div class="p-8 sm:p-10 rounded-3xl bg-[#EFE9DF]/80 border-2 border-[#242320] flex flex-col justify-between shadow-xl relative">
        <div class="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-[#242320] text-white text-[11px] font-semibold uppercase tracking-wider">
          Выбор автора • Рекомендуем
        </div>
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1E1D1B]">Тариф «С заботой»</h3>
            <span class="text-xs px-3 py-1 rounded-full bg-[#C25E38]/15 text-[#C25E38] font-bold">Обратная связь</span>
          </div>
          <p class="text-sm text-[#6E6B65] mb-8 font-light">
            Максимальный эффект под личным присмотром: проверка точности движений и поддержка в закрытом чате.
          </p>
          <div class="mb-8">
            <span class="font-['Cormorant_Garamond',serif] text-5xl font-bold text-[#1E1D1B]">8 900 ₽</span>
            <span class="text-xs text-[#6E6B65] ml-2">единоразово / бессрочно</span>
          </div>
          <ul class="space-y-4 mb-8 text-sm text-[#1E1D1B]">
            <li class="flex items-start gap-3 font-medium">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>Всё, что входит в тариф «Базовый»</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span><strong>Личный видео-разбор техники:</strong> присылайте видео выполнения упражнений на коррекцию</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>Доступ в закрытый клубный чат с автором курса</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>Еженедельные сессии вопросов и ответов (Q&A)</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-[#C25E38] font-bold">✓</span>
              <span>Персональные рекомендации по модификации движений</span>
            </li>
          </ul>
        </div>
        <a href="https://t.me/femmesculpt_bot?start=tariff_care" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center h-13 rounded-full bg-[#C25E38] hover:bg-[#A94F2E] text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md cursor-pointer">
          Записаться «С заботой»
        </a>
      </div>
    </div>

    <!-- Payment Trust Disclaimer -->
    <div class="mt-12 text-center text-xs text-[#6E6B65] max-w-lg mx-auto font-light">
      Безопасная оплата картами РФ и зарубежными картами через официального платежного провайдера. Возможна беспроцентная рассрочка.
    </div>
  </div>
</section>
`,

  // 11. ABOUT AUTHOR (Журнальная портретная раскладка: фото, философия, сертификация Polestar)
  author: `
<section id="author" class="w-full py-24 sm:py-32 bg-white border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <!-- Portrait Column -->
      <div class="lg:col-span-5 relative">
        <div class="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-[#1E1D1B]/10 shadow-xl bg-[#EFE9DF]">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85" alt="Автор курса Femme Sculpt" class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
        </div>
      </div>

      <!-- Bio & Creds Column -->
      <div class="lg:col-span-7 flex flex-col items-start text-left">
        <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ПРЕПОДАВАТЕЛЬ / 09</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] leading-tight mb-4">
          Александра Миронова
        </h2>
        <div class="text-sm font-semibold text-[#6E6B65] uppercase tracking-wider mb-8">
          Сертифицированный тренер Polestar Pilates • Специалист по движению и осанке
        </div>

        <div class="space-y-5 text-[#6E6B65] text-base leading-relaxed font-light mb-10">
          <p>
            «Более 8 лет я помогаю женщинам восстанавливать диалог со своим телом. Мой подход основан на бережной биомеханике: мы не боремся с телом, а учимся слышать его сигналы и возвращать естественную подвижность».
          </p>
          <p>
            Прошла международную сертификацию Polestar Pilates (Mat & Comprehensive), анатомические курсы Томаса Майерса (Анатомические поезда) и специализацию по восстановлению после родов.
          </p>
        </div>

        <!-- Creds Grid -->
        <div class="grid grid-cols-3 gap-6 w-full pt-8 border-t border-[#1E1D1B]/10">
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1E1D1B]">8+</div>
            <div class="text-xs text-[#6E6B65]">лет практики</div>
          </div>
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1E1D1B]">1 500+</div>
            <div class="text-xs text-[#6E6B65]">клиентов</div>
          </div>
          <div>
            <div class="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#1E1D1B]">Polestar</div>
            <div class="text-xs text-[#6E6B65]">USA Certified</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 12. REVIEWS & TESTIMONIALS (Карточки с цитатами, результатами на талии/осанке)
  reviews: `
<section class="w-full py-24 sm:py-32 bg-[#F7F4EE] border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
      <div>
        <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ИСТОРИИ И РЕЗУЛЬТАТЫ / 10</span>
        <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
          Что говорят выпускницы курса
        </h2>
      </div>
      <div class="text-xs text-[#6E6B65]">Более 300 реальных отзывов в Telegram-канале</div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Review 1 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center gap-1 text-[#C25E38] mb-4 text-xs">
            ★★★★★
          </div>
          <p class="text-sm text-[#1E1D1B] leading-relaxed mb-6 font-light italic font-['Cormorant_Garamond',serif] text-lg">
            «После вторых родов живот никак не уходил, а спина отваливалась к обеду. Всего через 2 недели практики Femme Sculpt ушли боли в пояснице, талия уменьшилась на 3 см, а в теле появилась забытая легкость!»
          </p>
        </div>
        <div class="pt-4 border-t border-[#1E1D1B]/6 flex items-center justify-between">
          <div>
            <div class="text-sm font-bold text-[#1E1D1B]">Екатерина В.</div>
            <div class="text-xs text-[#6E6B65]">32 года, архитектор</div>
          </div>
          <span class="text-[10px] px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#1E1D1B] font-semibold">Тариф «С заботой»</span>
        </div>
      </div>

      <!-- Review 2 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center gap-1 text-[#C25E38] mb-4 text-xs">
            ★★★★★
          </div>
          <p class="text-sm text-[#1E1D1B] leading-relaxed mb-6 font-light italic font-['Cormorant_Garamond',serif] text-lg">
            «Я ненавижу спортзалы, но этот формат влюбил в себя с первого урока. 20 минут утром перед работой — и ты идешь по улице с прямой спиной королевы. Дыхательные практики просто творят чудеса».
          </p>
        </div>
        <div class="pt-4 border-t border-[#1E1D1B]/6 flex items-center justify-between">
          <div>
            <div class="text-sm font-bold text-[#1E1D1B]">Анна Смирнова</div>
            <div class="text-xs text-[#6E6B65]">28 лет, проджект-менеджер</div>
          </div>
          <span class="text-[10px] px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#1E1D1B] font-semibold">Тариф «Базовый»</span>
        </div>
      </div>

      <!-- Review 3 -->
      <div class="p-8 rounded-3xl bg-white border border-[#1E1D1B]/8 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center gap-1 text-[#C25E38] mb-4 text-xs">
            ★★★★★
          </div>
          <p class="text-sm text-[#1E1D1B] leading-relaxed mb-6 font-light italic font-['Cormorant_Garamond',serif] text-lg">
            «Видео-разбор от Александры полностью перевернул моё понимание планки и работы пресса. Оказалось, я годами напрягала не те мышцы! Наконец-то исчез выпирающий животик. Огромная благодарность!»
          </p>
        </div>
        <div class="pt-4 border-t border-[#1E1D1B]/6 flex items-center justify-between">
          <div>
            <div class="text-sm font-bold text-[#1E1D1B]">Мария К.</div>
            <div class="text-xs text-[#6E6B65]">37 лет, предприниматель</div>
          </div>
          <span class="text-[10px] px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#1E1D1B] font-semibold">Тариф «С заботой»</span>
        </div>
      </div>
    </div>
  </div>
</section>
`,

  // 13. FAQ (Нативный аккордеон с ответами на ключевые вопросы)
  faq: `
<section id="faq" class="w-full py-24 sm:py-32 bg-white border-b border-[#1E1D1B]/8 font-['Manrope',sans-serif]">
  <div class="max-w-4xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-3">ВОПРОСЫ И ОТВЕТЫ / 11</span>
      <h2 class="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-normal text-[#1E1D1B] tracking-tight">
        Часто задаваемые вопросы
      </h2>
      <p class="text-sm text-[#6E6B65] mt-4 font-light">
        Всё, что важно знать перед началом тренировок.
      </p>
    </div>

    <div class="space-y-4">
      <details class="group p-6 rounded-2xl bg-[#F7F4EE] border border-[#1E1D1B]/8 transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1E1D1B] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-semibold pr-4">Нужен ли специальный инвентарь?</span>
          <span class="w-8 h-8 rounded-full bg-white border border-[#1E1D1B]/10 flex items-center justify-center text-[#1E1D1B] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-sm text-[#6E6B65] leading-relaxed pt-4 mt-4 border-t border-[#1E1D1B]/8 font-light">
          Для 90% тренировок достаточно обычного коврика для фитнеса или мягкого пледа. В паре уроков мы используем небольшую подушку или полотенце, которые найдутся в каждом доме.
        </div>
      </details>

      <details class="group p-6 rounded-2xl bg-[#F7F4EE] border border-[#1E1D1B]/8 transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1E1D1B] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-semibold pr-4">Подойдет ли курс новичкам без опыта?</span>
          <span class="w-8 h-8 rounded-full bg-white border border-[#1E1D1B]/10 flex items-center justify-center text-[#1E1D1B] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-sm text-[#6E6B65] leading-relaxed pt-4 mt-4 border-t border-[#1E1D1B]/8 font-light">
          Да, безусловно. Программа выстроена с нуля: в первых уроках мы подробно объясняем правильное положение таза, ребер и дыхание. Каждое упражнение имеет облегченные и усложненные модификации.
        </div>
      </details>

      <details class="group p-6 rounded-2xl bg-[#F7F4EE] border border-[#1E1D1B]/8 transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1E1D1B] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-semibold pr-4">Сколько длится доступ к курсу?</span>
          <span class="w-8 h-8 rounded-full bg-white border border-[#1E1D1B]/10 flex items-center justify-center text-[#1E1D1B] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-sm text-[#6E6B65] leading-relaxed pt-4 mt-4 border-t border-[#1E1D1B]/8 font-light">
          Доступ ко всем материалам, лекциям и обновлениям предоставляется бессрочно. Вы сможете возвращаться к любимым урокам в любое время и повторять программу столько раз, сколько потребуется.
        </div>
      </details>

      <details class="group p-6 rounded-2xl bg-[#F7F4EE] border border-[#1E1D1B]/8 transition-all cursor-pointer">
        <summary class="flex justify-between items-center font-medium text-[#1E1D1B] list-none select-none">
          <span class="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-semibold pr-4">Как смотреть уроки через телефон?</span>
          <span class="w-8 h-8 rounded-full bg-white border border-[#1E1D1B]/10 flex items-center justify-center text-[#1E1D1B] transition-transform duration-200 group-open:rotate-180 flex-shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </summary>
        <div class="text-sm text-[#6E6B65] leading-relaxed pt-4 mt-4 border-t border-[#1E1D1B]/8 font-light">
          После оплаты Telegram-бот отправляет ссылку на закрытый защищенный видео-канал и веб-плеер. Уроки запускаются в высоком качестве без задержек прямо с экрана смартфона или планшета.
        </div>
      </details>
    </div>
  </div>
</section>
`,

  // 14. FINAL CTA & FOOTER (Роскошный завершающий призыв, оферта, политика, реквизиты)
  finalCtaAndFooter: `
<!-- Final Editorial CTA Banner -->
<section class="w-full py-24 sm:py-32 bg-[#242320] text-white font-['Manrope',sans-serif] relative overflow-hidden">
  <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
    <span class="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C25E38] block mb-4">НАЧАЛО ВАШЕЙ ТРАНСФОРМАЦИИ</span>
    <h2 class="font-['Cormorant_Garamond',serif] text-4xl sm:text-6xl font-normal leading-[1.15] mb-6 tracking-tight text-[#F7F4EE]">
      Подарите телу свободу, силу и <span class="italic font-medium text-[#C25E38]">королевскую легкость</span>
    </h2>
    <p class="text-base sm:text-lg text-white/70 max-w-xl mx-auto mb-10 font-light">
      Присоединяйтесь к сообществу осознанных женщин. Первые ощутимые изменения уже через 7 дней регулярных практик.
    </p>
    <a href="https://t.me/femmesculpt_bot?start=final_cta" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-[#F7F4EE] hover:bg-white text-[#1E1D1B] text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl hover:shadow-2xl cursor-pointer">
      <span>Присоединиться в Telegram</span>
      <svg class="w-4 h-4 text-[#C25E38]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </a>
  </div>
</section>

<!-- Footer -->
<footer class="w-full py-16 bg-[#1A1917] text-white/60 font-['Manrope',sans-serif] border-t border-white/8 text-xs">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/8">
      <div class="md:col-span-4">
        <span class="font-['Cormorant_Garamond',serif] text-2xl font-bold tracking-tight text-white block mb-2">FEMME SCULPT</span>
        <p class="text-xs text-white/50 leading-relaxed font-light max-w-sm">
          Авторский онлайн-курс осознанного пилатеса и укрепления глубоких мышц кора. Красота осанки через уважение к телу.
        </p>
      </div>

      <div class="md:col-span-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-white block mb-4">Навигация</span>
        <div class="space-y-2.5 flex flex-col">
          <a href="#about" class="hover:text-white transition-colors">О программе</a>
          <a href="#benefits" class="hover:text-white transition-colors">Преимущества</a>
          <a href="#syllabus" class="hover:text-white transition-colors">План тренировок</a>
          <a href="#pricing" class="hover:text-white transition-colors">Тарифы</a>
          <a href="#faq" class="hover:text-white transition-colors">Вопросы и ответы</a>
        </div>
      </div>

      <div class="md:col-span-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-white block mb-4">Каналы связи</span>
        <div class="space-y-2.5 flex flex-col">
          <a href="https://t.me/femmesculpt_bot" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Telegram-бот</a>
          <a href="https://t.me/femmesculpt_channel" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Telegram-канал</a>
          <a href="mailto:support@femmesculpt.ru" class="hover:text-white transition-colors">Служба заботы</a>
        </div>
      </div>

      <div class="md:col-span-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-white block mb-4">Юридическая информация</span>
        <div class="space-y-1.5 text-[11px] text-white/40 leading-relaxed font-light">
          <div>ИП Миронова Александра Сергеевна</div>
          <div>ОГРНИП 321774600123456</div>
          <div>ИНН 772012345678</div>
          <div class="pt-2">
            <a href="#oferta" class="hover:underline text-white/60">Договор публичной оферты</a> • <a href="#privacy" class="hover:underline text-white/60">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
      <div>© 2026 FEMME SCULPT. Все права защищены. Conscious Pilates Studio.</div>
      <div class="flex items-center gap-4">
        <span>RU / EN Ready</span>
        <span>•</span>
        <span>Made with Tilda Template Vault</span>
      </div>
    </div>
  </div>
</footer>
`,
};
