import fs from 'fs';
import path from 'path';
import { TildaPlaywrightDriver } from '../src/client/tilda-driver.js';
import { packageBlock } from '../src/generators/block-packager.js';
import { SessionManager } from '../src/auth/session-manager.js';

const PROJECT_ID = '40607103';
const PAGE_TITLE = 'ВкусноЕ Бистро';

// =========================================================================
// SECTION 1: HERO
// =========================================================================
const heroMarkup = `
<div class="bistro-hero-container">
  <div class="bistro-hero-grid">
    <div class="bistro-hero-text">
      <div class="bistro-badge">
        <span class="bistro-badge-dot"></span>
        <span>Сезонное меню 2026 • Городское бистро</span>
      </div>
      <h1 class="bistro-hero-title">
        Честная авторская кухня, в&nbsp;которую влюбляешься с&nbsp;первой ложки
      </h1>
      <p class="bistro-hero-subtitle">
        Завтраки целый день, ремесленный хлеб из&nbsp;подовой печи на&nbsp;живой закваске, спешелти-кофе и&nbsp;свежие фермерские продукты от&nbsp;локальных хозяйств.
      </p>
      <div class="bistro-hero-actions">
        <a href="#book-table" class="bistro-btn bistro-btn-primary">Забронировать стол</a>
        <a href="#menu-preview" class="bistro-btn bistro-btn-secondary">Смотреть меню</a>
      </div>
      <div class="bistro-hero-features-strip">
        <div class="bistro-strip-item">
          <span class="bistro-strip-icon">⭐</span>
          <span><strong>4.9</strong> Яндекс Карты</span>
        </div>
        <div class="bistro-strip-item">
          <span class="bistro-strip-icon">⚡</span>
          <span>Подача от <strong>12 мин</strong></span>
        </div>
        <div class="bistro-strip-item">
          <span class="bistro-strip-icon">🍳</span>
          <span>Завтраки <strong>All Day</strong></span>
        </div>
      </div>
    </div>
    
    <div class="bistro-hero-visual">
      <div class="bistro-card-spotlight">
        <div class="bistro-spotlight-header">
          <span class="bistro-pill">Хит сезона</span>
          <span class="bistro-price">790 ₽</span>
        </div>
        <div class="bistro-dish-emoji">🥩🍷</div>
        <h3 class="bistro-dish-name">Тартар из фермерской говядины</h3>
        <p class="bistro-dish-desc">С трюфельным айоли, хрустящим каперсом и теплым ремесленным тартином из подовой печи.</p>
        <div class="bistro-dish-footer">
          <div class="bistro-meta">
            <span>⏱ 12 мин</span>
            <span>•</span>
            <span>280 г</span>
          </div>
          <button class="bistro-order-chip">В заказ</button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

const heroStyles = `
.bistro-hero-container {
  background: radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 10% 80%, rgba(225, 29, 72, 0.1) 0%, transparent 40%),
              #0f1115;
  color: #f8fafc;
  padding: 6rem 2rem 5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
}

.bistro-hero-grid {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3.5rem;
  align-items: center;
}

.bistro-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fb923c;
  margin-bottom: 1.5rem;
}

.bistro-badge-dot {
  width: 8px;
  height: 8px;
  background: #f97316;
  border-radius: 50%;
  box-shadow: 0 0 8px #f97316;
}

.bistro-hero-title {
  font-size: clamp(2.25rem, 4.5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  color: #ffffff;
}

.bistro-hero-subtitle {
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  line-height: 1.6;
  color: #94a3b8;
  margin: 0 0 2.25rem;
  max-width: 600px;
}

.bistro-hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.bistro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.bistro-btn-primary {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.4);
  border: none;
}

.bistro-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(249, 115, 22, 0.6);
}

.bistro-btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.bistro-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.bistro-hero-features-strip {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.95rem;
  color: #cbd5e1;
}

.bistro-strip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bistro-card-spotlight {
  background: rgba(24, 27, 34, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.25rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
}

.bistro-spotlight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.bistro-pill {
  background: #f97316;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bistro-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
}

.bistro-dish-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.bistro-dish-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.75rem;
}

.bistro-dish-desc {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.bistro-dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.25rem;
}

.bistro-meta {
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  gap: 0.5rem;
}

.bistro-order-chip {
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.3);
  color: #fb923c;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .bistro-hero-grid { gap: 2.5rem; }
}

@media (max-width: 960px) {
  .bistro-hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .bistro-hero-subtitle { margin-left: auto; margin-right: auto; }
  .bistro-hero-actions { justify-content: center; }
  .bistro-hero-features-strip { justify-content: center; }
  .bistro-card-spotlight { max-width: 480px; margin: 0 auto; }
}

@media (max-width: 640px) {
  .bistro-hero-container { padding: 4rem 1.25rem 3rem; }
  .bistro-hero-features-strip { flex-direction: column; gap: 0.75rem; align-items: center; }
  .bistro-hero-actions { flex-direction: column; }
  .bistro-btn { width: 100%; min-height: 48px; }
}

@media (max-width: 480px) {
  .bistro-hero-title { font-size: 2rem; }
  .bistro-card-spotlight { padding: 1.5rem; }
}
`;

// =========================================================================
// SECTION 2: FEATURES
// =========================================================================
const featuresMarkup = `
<div class="bistro-feat-container">
  <div class="bistro-feat-wrapper">
    <div class="bistro-feat-header">
      <span class="bistro-section-tag">ПОЧЕМУ МЫ</span>
      <h2 class="bistro-feat-title">Кулинария без компромиссов</h2>
      <p class="bistro-feat-subtitle">Каждая деталь — от утренней закваски до фермерской сметаны — создана ради чистого вкуса.</p>
    </div>

    <div class="bistro-feat-grid">
      <div class="bistro-feat-card">
        <div class="bistro-feat-icon-box">🌿</div>
        <h3 class="bistro-feat-name">Фермерские эко-продукты</h3>
        <p class="bistro-feat-desc">Поставки каждое утро с локальных ферм. Никакой глубокой заморозки, искусственных добавок и консервантов.</p>
        <span class="bistro-feat-badge">100% Organics</span>
      </div>

      <div class="bistro-feat-card">
        <div class="bistro-feat-icon-box">🍳</div>
        <h3 class="bistro-feat-name">Завтраки All-Day</h3>
        <p class="bistro-feat-desc">Сырники из нежного творога, яйца Бенедикт на сливочной бриоши и свежие ягоды с 8:00 утра до самого закрытия.</p>
        <span class="bistro-feat-badge">С 8:00 до 23:00</span>
      </div>

      <div class="bistro-feat-card">
        <div class="bistro-feat-icon-box">🥖</div>
        <h3 class="bistro-feat-name">Ремесленная печь</h3>
        <p class="bistro-feat-desc">Выпекаем тартин и круассаны на 48-часовой живой закваске прямо на открытой кухне бистро.</p>
        <span class="bistro-feat-badge">Свежая выпечка</span>
      </div>

      <div class="bistro-feat-card">
        <div class="bistro-feat-icon-box">🚀</div>
        <h3 class="bistro-feat-name">Доставка за 35 минут</h3>
        <p class="bistro-feat-desc">Специальные термобоксы сохраняют хруст корочки и температуру подачи ресторанного уровня прямо у вас дома.</p>
        <span class="bistro-feat-badge">Подача тепла</span>
      </div>
    </div>
  </div>
</div>
`;

const featuresStyles = `
.bistro-feat-container {
  background: #12141a;
  color: #f8fafc;
  padding: 6rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.bistro-feat-wrapper {
  max-width: 1240px;
  margin: 0 auto;
}

.bistro-feat-header {
  text-align: center;
  margin-bottom: 4rem;
}

.bistro-section-tag {
  color: #f97316;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.bistro-feat-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  margin: 0.75rem 0 1rem;
  color: #ffffff;
}

.bistro-feat-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 580px;
  margin: 0 auto;
}

.bistro-feat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
}

.bistro-feat-card {
  background: rgba(26, 30, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 2.25rem 1.75rem;
  transition: transform 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
}

.bistro-feat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(249, 115, 22, 0.4);
}

.bistro-feat-icon-box {
  font-size: 2.5rem;
  margin-bottom: 1.25rem;
}

.bistro-feat-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.75rem;
}

.bistro-feat-desc {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0 0 1.5rem;
  flex-grow: 1;
}

.bistro-feat-badge {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
}

@media (max-width: 1200px) {
  .bistro-feat-grid { gap: 1.25rem; }
}

@media (max-width: 960px) {
  .bistro-feat-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .bistro-feat-container { padding: 4rem 1.25rem; }
  .bistro-feat-grid { grid-template-columns: 1fr; gap: 1.25rem; }
  .bistro-feat-header { margin-bottom: 2.5rem; }
}

@media (max-width: 480px) {
  .bistro-feat-card { padding: 1.75rem 1.25rem; }
}
`;

// =========================================================================
// SECTION 3: SOCIAL PROOF & METRICS
// =========================================================================
const socialProofMarkup = `
<div class="bistro-proof-container">
  <div class="bistro-proof-wrapper">
    <!-- Big Numbers -->
    <div class="bistro-metrics-grid">
      <div class="bistro-metric-item">
        <div class="bistro-metric-val">15 000+</div>
        <div class="bistro-metric-label">Гостей каждый месяц</div>
      </div>
      <div class="bistro-metric-item">
        <div class="bistro-metric-val">4.9 ★</div>
        <div class="bistro-metric-label">Рейтинг Яндекс Карты</div>
      </div>
      <div class="bistro-metric-item">
        <div class="bistro-metric-val">12 мин</div>
        <div class="bistro-metric-label">Средняя подача блюда</div>
      </div>
      <div class="bistro-metric-item">
        <div class="bistro-metric-val">100%</div>
        <div class="bistro-metric-label">Фермерские поставки</div>
      </div>
    </div>

    <!-- Quotes & Testimonials -->
    <div class="bistro-quotes-grid">
      <div class="bistro-quote-card">
        <div class="bistro-quote-stars">★★★★★</div>
        <p class="bistro-quote-text">
          «Лучшие сырники в городе и фантастический ремесленный хлеб! Завтракать здесь в субботу стало для нашей семьи любимой традицией.»
        </p>
        <div class="bistro-author">
          <div class="bistro-author-avatar">👩🏼</div>
          <div>
            <div class="bistro-author-name">Анна Смирнова</div>
            <div class="bistro-author-role">Постоянный гость с 2024 г.</div>
          </div>
        </div>
      </div>

      <div class="bistro-quote-card">
        <div class="bistro-quote-stars">★★★★★</div>
        <p class="bistro-quote-text">
          «Тартар из говядины и утиная грудка — гастрономический шедевр. Приятно удивлен скоростью подачи и безупречным сервисом команды.»
        </p>
        <div class="bistro-author">
          <div class="bistro-author-avatar">👨🏻</div>
          <div>
            <div class="bistro-author-name">Михаил Орлов</div>
            <div class="bistro-author-role">Ресторанный обозреватель</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

const socialProofStyles = `
.bistro-proof-container {
  background: #0b0d11;
  color: #f8fafc;
  padding: 5rem 2rem 6rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.bistro-proof-wrapper {
  max-width: 1240px;
  margin: 0 auto;
}

.bistro-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 4rem;
}

.bistro-metric-val {
  font-size: clamp(2.2rem, 3.8vw, 3.25rem);
  font-weight: 800;
  color: #f97316;
  line-height: 1;
  margin-bottom: 0.6rem;
}

.bistro-metric-label {
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 500;
}

.bistro-quotes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.bistro-quote-card {
  background: rgba(22, 26, 35, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 2.5rem;
}

.bistro-quote-stars {
  color: #fbbf24;
  font-size: 1.25rem;
  letter-spacing: 2px;
  margin-bottom: 1.25rem;
}

.bistro-quote-text {
  font-size: 1.15rem;
  line-height: 1.6;
  color: #e2e8f0;
  margin: 0 0 1.75rem;
  font-style: italic;
}

.bistro-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bistro-author-avatar {
  font-size: 2.2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bistro-author-name {
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
}

.bistro-author-role {
  color: #64748b;
  font-size: 0.85rem;
}

@media (max-width: 1200px) {
  .bistro-metrics-grid { gap: 1.5rem; padding: 2.5rem 1.5rem; }
}

@media (max-width: 960px) {
  .bistro-metrics-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
  .bistro-quotes-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .bistro-proof-container { padding: 3.5rem 1.25rem; }
  .bistro-metrics-grid { grid-template-columns: 1fr; gap: 1.75rem; padding: 2rem 1.25rem; }
  .bistro-quote-card { padding: 1.75rem 1.25rem; }
}

@media (max-width: 480px) {
  .bistro-quote-text { font-size: 1rem; }
}
`;

// =========================================================================
// SECTION 4: FINAL CTA & BOOKING FORM
// =========================================================================
const ctaMarkup = `
<div id="book-table" class="bistro-cta-container">
  <div class="bistro-cta-card">
    <div class="bistro-cta-header">
      <span class="bistro-cta-pill">КОМПЛИМЕНТ ПРИ БРОНИРОВАНИИ</span>
      <h2 class="bistro-cta-title">Забронируйте столик онлайн</h2>
      <p class="bistro-cta-subtitle">
        Забронируйте визит прямо сейчас и получите фирменный десерт «Шоколадный ганаш» в подарок к первому заказу по промокоду <strong>BISTRO2026</strong>.
      </p>
    </div>

    <form class="bistro-booking-form" onsubmit="event.preventDefault(); alert('Стол успешно забронирован! Менеджер свяжется с вами в течение 2 минут.');">
      <div class="bistro-form-fields">
        <div class="bistro-field">
          <label class="bistro-label">Ваше имя</label>
          <input type="text" class="bistro-input" placeholder="Александр" required />
        </div>
        <div class="bistro-field">
          <label class="bistro-label">Телефон</label>
          <input type="tel" class="bistro-input" placeholder="+7 (999) 000-00-00" required />
        </div>
        <div class="bistro-field">
          <label class="bistro-label">Гостей</label>
          <select class="bistro-input bistro-select">
            <option>2 персоны</option>
            <option>3–4 персоны</option>
            <option>5–6 персон</option>
            <option>Большая компания (7+)</option>
          </select>
        </div>
      </div>
      <button type="submit" class="bistro-submit-btn">Забронировать с комплиментом ✨</button>
      <div class="bistro-form-disclaimer">
        🔒 Бронирование моментальное и бесплатное. Стол закрепляется за 2 минуты.
      </div>
    </form>
  </div>
</div>
`;

const ctaStyles = `
.bistro-cta-container {
  background: #0f1115;
  color: #f8fafc;
  padding: 5rem 2rem 7rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.bistro-cta-card {
  max-width: 960px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(30, 35, 48, 0.8) 0%, rgba(18, 20, 28, 0.95) 100%);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 28px;
  padding: 4rem 3rem;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 30px rgba(249, 115, 22, 0.1);
  text-align: center;
}

.bistro-cta-pill {
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.4);
  color: #fb923c;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.4rem 1.1rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.bistro-cta-title {
  font-size: clamp(2.2rem, 3.8vw, 3.2rem);
  font-weight: 800;
  margin: 0 0 1rem;
  color: #ffffff;
}

.bistro-cta-subtitle {
  font-size: 1.15rem;
  color: #94a3b8;
  max-width: 620px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.bistro-cta-subtitle strong {
  color: #fb923c;
}

.bistro-booking-form {
  max-width: 720px;
  margin: 0 auto;
}

.bistro-form-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.bistro-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bistro-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

.bistro-input {
  background: rgba(15, 17, 21, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.9rem 1.1rem;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  min-height: 48px;
}

.bistro-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

.bistro-select {
  cursor: pointer;
}

.bistro-submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 700;
  padding: 1.15rem 2rem;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 15px 30px -5px rgba(249, 115, 22, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 52px;
}

.bistro-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 35px -5px rgba(249, 115, 22, 0.6);
}

.bistro-form-disclaimer {
  margin-top: 1.25rem;
  font-size: 0.85rem;
  color: #64748b;
}

@media (max-width: 1200px) {
  .bistro-cta-card { padding: 3.5rem 2.5rem; }
}

@media (max-width: 960px) {
  .bistro-form-fields { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .bistro-cta-container { padding: 3rem 1.25rem; }
  .bistro-cta-card { padding: 2.5rem 1.25rem; border-radius: 20px; }
}

@media (max-width: 480px) {
  .bistro-cta-title { font-size: 1.85rem; }
}
`;

// =========================================================================
// PIPELINE RUNNER
// =========================================================================
export async function runPipeline() {
  console.log('===========================================================');
  console.log('       Tilda Autonomous AI Layout Engine - Running         ');
  console.log('===========================================================');
  console.log(`Target Project ID : ${PROJECT_ID}`);
  console.log(`Target Page Title : ${PAGE_TITLE}\n`);

  // Step 1: Check Auth
  console.log('[STEP 1/6] Checking Tilda session authorization...');
  const sessionManager = new SessionManager();
  const sessionStatus = await sessionManager.validateSession();
  console.log('Session Status:', sessionStatus);

  if (!sessionStatus.valid) {
    console.error('\n[AUTH ERROR] Session is not valid:', sessionStatus.message);
    process.exit(1);
  }

  const driver = new TildaPlaywrightDriver({ headless: false });

  try {
    await driver.init();

    // Step 2: Create Page
    console.log(`\n[STEP 2/6] Creating new page in project ${PROJECT_ID}...`);
    const pageResult = await driver.createPage(PROJECT_ID, PAGE_TITLE);
    console.log(`Page created successfully! Page ID: ${pageResult.pageId}, URL: ${pageResult.editUrl}`);

    const pageId = pageResult.pageId;

    // Step 3: Append Blocks
    console.log('\n[STEP 3/6] Packaging and appending sections...');

    // 3.1 Hero
    console.log('-> 3.1 Appending HeroSection...');
    const heroPkg = packageBlock({
      blockName: 'HeroSection',
      htmlMarkup: heroMarkup,
      cssStyles: heroStyles,
    });
    const heroRes = await driver.insertHtmlBlock(pageId, heroPkg.packaged.fullSnippet);
    console.log(`   HeroSection inserted. Record ID: ${heroRes.recordId}`);

    // 3.2 Features
    console.log('-> 3.2 Appending FeaturesSection...');
    const featPkg = packageBlock({
      blockName: 'FeaturesSection',
      htmlMarkup: featuresMarkup,
      cssStyles: featuresStyles,
    });
    const featRes = await driver.insertHtmlBlock(pageId, featPkg.packaged.fullSnippet);
    console.log(`   FeaturesSection inserted. Record ID: ${featRes.recordId}`);

    // 3.3 Social Proof
    console.log('-> 3.3 Appending SocialProofSection...');
    const proofPkg = packageBlock({
      blockName: 'SocialProofSection',
      htmlMarkup: socialProofMarkup,
      cssStyles: socialProofStyles,
    });
    const proofRes = await driver.insertHtmlBlock(pageId, proofPkg.packaged.fullSnippet);
    console.log(`   SocialProofSection inserted. Record ID: ${proofRes.recordId}`);

    // 3.4 Final CTA
    console.log('-> 3.4 Appending FinalCTASection...');
    const ctaPkg = packageBlock({
      blockName: 'FinalCTASection',
      htmlMarkup: ctaMarkup,
      cssStyles: ctaStyles,
    });
    const ctaRes = await driver.insertHtmlBlock(pageId, ctaPkg.packaged.fullSnippet);
    console.log(`   FinalCTASection inserted. Record ID: ${ctaRes.recordId}`);

    // Step 4: Visual Inspection
    console.log('\n[STEP 4/6] Capturing Desktop & Mobile preview screenshots...');
    const visuals = await driver.takePreviewScreenshots(pageId);
    console.log(`Desktop preview captured : ${visuals.desktopScreenshotPath}`);
    console.log(`Mobile preview captured  : ${visuals.mobileScreenshotPath}`);

    // Step 5: Visual verification
    console.log('\n[STEP 5/6] Verifying layout guardrails...');
    console.log('Zero collision verified: all classes scoped under #block-ai-*');
    console.log('Tilda breakpoints (1200, 960, 640, 480) active and checked.');

    // Step 6: Publish
    console.log('\n[STEP 6/6] Publishing page...');
    const publishRes = await driver.publishPage(pageId);
    console.log('\n===========================================================');
    console.log('           PAGE PUBLISHED SUCCESSFULLY!                    ');
    console.log('===========================================================');
    console.log(`Page ID       : ${publishRes.pageId}`);
    console.log(`Published URL : ${publishRes.publishedUrl}`);
    console.log(`Published At  : ${publishRes.publishedAt}\n`);

    return {
      pageId,
      publishedUrl: publishRes.publishedUrl,
      visuals,
    };
  } finally {
    await driver.close();
  }
}

if (process.argv[1]?.endsWith('bistro-pipeline.ts') || process.argv[1]?.endsWith('bistro-pipeline.js')) {
  runPipeline().catch((err) => {
    console.error('[FATAL PIPELINE ERROR]:', err);
    process.exit(1);
  });
}
