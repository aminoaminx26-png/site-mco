/**
 * MC Oran (مولودية وهران) — Main Application Engine (ES2025)
 */
import { I18N } from './i18n.js';
import { loadData, saveData } from './data.js';
import { renderSeasonCharts } from './charts.js';

const state = {
  lang: localStorage.getItem('mco_lang') || 'ar',
  theme: localStorage.getItem('mco_theme') || 'dark',
  cart: JSON.parse(localStorage.getItem('mco_cart') || '[]'),
  data: loadData(),
  route: 'home',
  selectedPlayerId: null,
  selectedSeats: [],
  deferredPrompt: null
};

const root = document.getElementById('app-root');

/* ==========================================================================
   Initialization
   ========================================================================== */
function init() {
  applyTheme(state.theme);
  applyLang(state.lang);
  bindGlobalEvents();
  registerPWA();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
}

function registerPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
      btn.classList.remove('hidden');
      btn.onclick = async () => {
        state.deferredPrompt.prompt();
        await state.deferredPrompt.userChoice;
        state.deferredPrompt = null;
        btn.classList.add('hidden');
      };
    }
  });
}

/* ==========================================================================
   Theme & Language
   ========================================================================== */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('mco_theme', theme);
}

function applyLang(lang) {
  state.lang = lang;
  localStorage.setItem('mco_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const dict = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
}

function t(key) {
  return I18N[state.lang][key] || key;
}

/* ==========================================================================
   Routing
   ========================================================================== */
function handleRoute() {
  const hash = location.hash.replace('#', '') || 'home';
  if (hash.startsWith('player-')) {
    state.route = 'player';
    state.selectedPlayerId = Number(hash.split('-')[1]);
  } else {
    state.route = hash;
  }

  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === state.route);
  });

  renderRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeDrawers();
}

function renderRoute() {
  const views = {
    home: renderHome,
    news: renderNewsPage,
    players: renderPlayersPage,
    player: renderPlayerProfile,
    staff: renderStaffPage,
    matches: renderMatchesPage,
    results: renderResultsPage,
    table: renderTablePage,
    statistics: renderStatisticsPage,
    history: renderHistoryPage,
    legends: renderLegendsPage,
    gallery: renderGalleryPage,
    videos: renderVideosPage,
    shop: renderShopPage,
    tickets: renderTicketsPage,
    fans: renderFansPage,
    sponsors: renderSponsorsPage,
    contact: renderContactPage,
    faq: renderFaqPage,
    privacy: renderPrivacyPage,
    terms: renderTermsPage,
    admin: renderAdminPage
  };

  const viewFn = views[state.route] || renderHome;
  root.innerHTML = viewFn();
  initScrollReveal();
  initCounters();
  if (state.route === 'statistics') renderSeasonCharts();
  if (state.route === 'home') startHeroPhraseRotation();
}

/* ==========================================================================
   Page Renderers
   ========================================================================== */
function renderHome() {
  const nextMatch = state.data.matches.find((m) => m.type === 'upcoming') || state.data.matches[0];
  const latestResult = state.data.matches.find((m) => m.type === 'result') || state.data.matches[0];

  return `
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div>
          <p class="hero-kicker">${t('heroKicker')}</p>
          <h1 class="hero-title">${t('heroTitle')}</h1>
          <p id="hero-rotating-phrase" class="hero-subtitle">${I18N[state.lang].heroPhrases[0]}</p>
          <div class="hero-actions">
            <a href="#news" class="btn btn-primary">${t('navNews')}</a>
            <a href="#matches" class="btn btn-white">${t('navMatches')}</a>
            <a href="#tickets" class="btn btn-outline">${t('buyTickets')}</a>
          </div>
        </div>
        <div class="hero-crest-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/MC_Oran_-_logo.png" alt="MC Oran" width="140" height="165" />
          <h3 style="color:#fff;margin-top:1rem;">MC ORAN</h3>
          <p class="muted-text">Est. 14 May 1946 · Oran</p>
        </div>
      </div>
    </section>

    <!-- Achievements Counters -->
    <section class="section">
      <div class="container">
        <div class="counters-grid reveal">
          <div class="counter-box"><div class="counter-value" data-target="4">0</div><div class="muted-text">بطولات وطنية</div></div>
          <div class="counter-box"><div class="counter-value" data-target="4">0</div><div class="muted-text">كأس الجمهورية</div></div>
          <div class="counter-box"><div class="counter-value" data-target="3">0</div><div class="muted-text">ألقاب عربية وإقليمية</div></div>
          <div class="counter-box"><div class="counter-value" data-target="80">0</div><div class="muted-text">عاماً من المجد</div></div>
        </div>
      </div>
    </section>

    <!-- Next Match & Recent Result -->
    <section class="section" style="padding-top:0;">
      <div class="container grid-2">
        <div class="card glass-panel reveal">
          <div class="card-body">
            <div class="meta-line"><span>${t('nextMatch')}</span><span>·</span><span>${nextMatch.competition}</span></div>
            <div class="match-banner">
              <div class="team-side"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/MC_Oran_-_logo.png" class="team-logo-lg" alt="MCO"/><strong>${nextMatch.home}</strong></div>
              <div><div class="score-box">VS</div><div class="muted-text">${nextMatch.date} · ${nextMatch.time}</div></div>
              <div class="team-side"><div class="team-logo-lg" style="display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);border-radius:50%;font-weight:900;">CRB</div><strong>${nextMatch.away}</strong></div>
            </div>
            <p class="muted-text" style="text-align:center;">${nextMatch.stadium}</p>
          </div>
        </div>

        <div class="card glass-panel reveal">
          <div class="card-body">
            <div class="meta-line"><span>${t('recentResults')}</span><span>·</span><span>${latestResult.date}</span></div>
            <div class="match-banner">
              <div class="team-side"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/MC_Oran_-_logo.png" class="team-logo-lg" alt="MCO"/><strong>${latestResult.home}</strong></div>
              <div><div class="score-box" style="color:var(--mco-red);">${latestResult.score}</div><div class="muted-text">${latestResult.competition}</div></div>
              <div class="team-side"><div class="team-logo-lg" style="display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);border-radius:50%;font-weight:900;">ESS</div><strong>${latestResult.away}</strong></div>
            </div>
            <p class="muted-text" style="text-align:center;">${latestResult.stadium}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${t('latestNews')}</h2>
          <a href="#news" class="btn btn-sm btn-outline">${t('viewAll')}</a>
        </div>
        <div class="grid-3">
          ${state.data.news.slice(0, 3).map(newsCardHTML).join('')}
        </div>
      </div>
    </section>

    <!-- Top Players -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${t('topPlayers')}</h2>
          <a href="#players" class="btn btn-sm btn-outline">${t('viewAll')}</a>
        </div>
        <div class="grid-4">
          ${state.data.players.slice(0, 4).map(playerCardHTML).join('')}
        </div>
      </div>
    </section>

    <!-- Mini Shop -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${t('miniShop')}</h2>
          <a href="#shop" class="btn btn-sm btn-outline">${t('viewAll')}</a>
        </div>
        <div class="grid-3">
          ${state.data.products.slice(0, 3).map(productCardHTML).join('')}
        </div>
      </div>
    </section>

    <!-- Sponsors -->
    <section class="section">
      <div class="container">
        <div class="section-header"><h2 class="section-title">${t('sponsors')}</h2></div>
        <div class="grid-4">
          ${state.data.sponsors.slice(0, 4).map((s) => `<div class="neumorph-card" style="text-align:center;font-weight:900;font-size:1.2rem;">${s}</div>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function newsCardHTML(n) {
  return `
    <article class="card reveal">
      <img src="${n.image}" alt="${n.title}" class="card-img" loading="lazy" />
      <div class="card-body">
        <div class="meta-line">
          <span>${n.category}</span><span>·</span><span>${n.date}</span><span>·</span><span>${n.views} مشاهدة</span>
        </div>
        <h3 style="margin-bottom:0.6rem;font-size:1.1rem;">${n.title}</h3>
        <p class="muted-text" style="margin-bottom:1rem;">${n.summary}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="muted-text">${n.author}</span>
          <button class="btn btn-sm btn-outline" onclick="window.shareNews('${n.title.replace(/'/g, '')}')">${t('share')}</button>
        </div>
      </div>
    </article>
  `;
}

function playerCardHTML(p) {
  return `
    <article class="card reveal" style="cursor:pointer;" onclick="location.hash='player-${p.id}'">
      <div style="height:180px;background:linear-gradient(135deg,#C8102E,#111111);display:flex;align-items:center;justify-content:center;position:relative;">
        <span style="font-size:4.5rem;font-weight:900;color:rgba(255,255,255,0.22);">${p.number}</span>
        <span style="position:absolute;bottom:12px;inset-inline-start:14px;color:#fff;font-weight:800;font-size:1.1rem;">#${p.number}</span>
      </div>
      <div class="card-body">
        <div class="meta-line"><span>${p.position}</span><span>·</span><span>${p.nationality}</span></div>
        <h3 style="margin-bottom:0.4rem;">${p.name}</h3>
        <p class="muted-text">${p.appearances} مباراة · ${p.goals} هدف · ${p.assists} تمريرة</p>
      </div>
    </article>
  `;
}

function productCardHTML(p) {
  return `
    <article class="card reveal">
      <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy" />
      <div class="card-body">
        <h3 style="margin-bottom:0.4rem;font-size:1.08rem;">${p.name}</h3>
        <p class="muted-text" style="margin-bottom:1rem;">${p.desc}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--mco-red);font-size:1.1rem;">${p.price} DZD</strong>
          <button class="btn btn-sm btn-primary" onclick="window.addToCart(${p.id})">${t('addToCart')}</button>
        </div>
      </div>
    </article>
  `;
}

function renderNewsPage() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-header"><h1 class="section-title">${t('navNews')}</h1></div>
        <div class="grid-3">${state.data.news.map(newsCardHTML).join('')}</div>
      </div>
    </section>
  `;
}

function renderPlayersPage() {
  return `
    <section class="section">
      <div class="container">
        <div class="section-header"><h1 class="section-title">${t('navPlayers')}</h1></div>
        <div class="grid-4">${state.data.players.map(playerCardHTML).join('')}</div>
      </div>
    </section>
  `;
}

function renderPlayerProfile() {
  const p = state.data.players.find((x) => x.id === state.selectedPlayerId) || state.data.players[0];
  return `
    <section class="section">
      <div class="container">
        <a href="#players" class="btn btn-sm btn-outline" style="margin-bottom:1.5rem;">&larr; ${t('navPlayers')}</a>
        <div class="card glass-panel">
          <div class="card-body grid-2" style="align-items:center;">
            <div style="height:300px;border-radius:var(--radius-md);background:linear-gradient(135deg,#C8102E,#111);display:flex;align-items:center;justify-content:center;">
              <span style="font-size:7rem;font-weight:900;color:rgba(255,255,255,0.28);">#${p.number}</span>
            </div>
            <div>
              <div class="meta-line"><span>${p.position}</span><span>·</span><span>${p.nationality}</span></div>
              <h1 style="font-size:2.4rem;margin-bottom:0.75rem;">${p.name}</h1>
              <p class="muted-text" style="margin-bottom:1.5rem;">${p.bio}</p>
              <div class="grid-3" style="gap:0.75rem;">
                <div class="counter-box" style="padding:1rem;"><div class="counter-value" style="font-size:1.6rem;">${p.appearances}</div><div class="muted-text">المباريات</div></div>
                <div class="counter-box" style="padding:1rem;"><div class="counter-value" style="font-size:1.6rem;">${p.goals}</div><div class="muted-text">الأهداف</div></div>
                <div class="counter-box" style="padding:1rem;"><div class="counter-value" style="font-size:1.6rem;">${p.assists}</div><div class="muted-text">التمريرات</div></div>
              </div>
              <div class="meta-line" style="margin-top:1.25rem;">
                <span>العمر: ${p.age}</span><span>·</span><span>الطول: ${p.height}</span><span>·</span><span>الوزن: ${p.weight}</span><span>·</span><span>القدم: ${p.foot}</span><span>·</span><span>الدقائق: ${p.minutes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStaffPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navStaff')}</h1></div>
      <div class="grid-2">
        ${state.data.staff.map((s) => `
          <div class="card"><div class="card-body">
            <div class="meta-line"><span>${s.role}</span><span>·</span><span>${s.nationality}</span></div>
            <h3>${s.name}</h3>
            <p class="muted-text">الخبرة: ${s.experience}</p>
          </div></div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderMatchesPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navMatches')}</h1></div>
      <div class="grid-2">
        ${state.data.matches.map((m) => `
          <div class="card"><div class="card-body">
            <div class="meta-line"><span>${m.competition}</span><span>·</span><span>${m.date} · ${m.time}</span></div>
            <div class="match-banner" style="padding:1rem 0;">
              <strong>${m.home}</strong>
              <span class="score-box" style="font-size:1.6rem;color:var(--mco-red);">${m.score}</span>
              <strong>${m.away}</strong>
            </div>
            <p class="muted-text">الملعب: ${m.stadium} · الحكم: ${m.referee}</p>
            <p class="muted-text">التشكيلة: ${m.lineup.join(' - ')}</p>
          </div></div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderResultsPage() {
  const results = state.data.matches.filter((m) => m.type === 'result');
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navResults')}</h1></div>
      <div class="grid-2">
        ${results.map((m) => `
          <div class="card"><div class="card-body">
            <div class="meta-line"><span>${m.date}</span><span>·</span><span>${m.stadium}</span></div>
            <div class="match-banner"><strong>${m.home}</strong><span class="score-box" style="color:var(--mco-red);">${m.score}</span><strong>${m.away}</strong></div>
            <p class="muted-text">الاستحواذ: ${m.stats.possession} · التسديدات: ${m.stats.shots}</p>
          </div></div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderTablePage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navTable')}</h1></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>الفريق</th><th>لعب</th><th>فوز</th><th>تعادل</th><th>خسارة</th><th>الفارق</th><th>النقاط</th></tr></thead>
          <tbody>
            ${state.data.standings.map((r) => `
              <tr class="${r.isMco ? 'highlight-mco' : ''}">
                <td>${r.pos}</td><td>${r.team}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gd}</td><td><strong>${r.pts}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div></section>
  `;
}

function renderStatisticsPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navStats')} (Canvas API)</h1></div>
      <div class="grid-3">
        <div class="card"><div class="card-body"><h3 style="margin-bottom:1rem;">الأهداف والتسديدات</h3><canvas id="chart-goals" width="340" height="240"></canvas></div></div>
        <div class="card"><div class="card-body"><h3 style="margin-bottom:1rem;">الانتصارات والهزائم</h3><canvas id="chart-results" width="340" height="240"></canvas></div></div>
        <div class="card"><div class="card-body"><h3 style="margin-bottom:1rem;">الاستحواذ والتمريرات</h3><canvas id="chart-possession" width="340" height="240"></canvas></div></div>
      </div>
    </div></section>
  `;
}

function renderHistoryPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navHistory')}</h1></div>
      <div class="grid-2">
        ${state.data.history.map((h) => `
          <div class="card"><div class="card-body">
            <span style="color:var(--mco-red);font-weight:900;font-size:1.5rem;">${h.year}</span>
            <h3 style="margin:0.4rem 0;">${h.title}</h3>
            <p class="muted-text">${h.desc}</p>
          </div></div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderLegendsPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navLegends')}</h1></div>
      <div class="grid-3">
        ${state.data.legends.map((l) => `
          <div class="card"><div class="card-body">
            <div class="meta-line"><span>${l.era}</span></div>
            <h3 style="margin-bottom:0.5rem;">${l.name}</h3>
            <p style="color:var(--mco-red);font-weight:700;font-size:0.88rem;margin-bottom:0.5rem;">${l.honours}</p>
            <p class="muted-text">${l.bio}</p>
          </div></div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderGalleryPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navGallery')}</h1></div>
      <div class="grid-3">
        ${state.data.gallery.map((g) => `
          <div class="card">
            <img src="${g.image}" alt="${g.title}" class="card-img" loading="lazy" />
            <div class="card-body"><div class="meta-line"><span>${g.category}</span></div><h4>${g.title}</h4></div>
          </div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderVideosPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navVideos')}</h1></div>
      <div class="grid-3">
        ${state.data.videos.map((v) => `
          <div class="card">
            <div style="height:180px;background:#141418;display:flex;align-items:center;justify-content:center;color:var(--mco-red);font-size:3rem;">&#9658;</div>
            <div class="card-body">
              <div class="meta-line"><span>${v.duration}</span><span>·</span><span>${v.views} مشاهدة</span></div>
              <h4>${v.title}</h4>
            </div>
          </div>
        `).join('')}
      </div>
    </div></section>
  `;
}

function renderShopPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navShop')}</h1></div>
      <div class="grid-3">${state.data.products.map(productCardHTML).join('')}</div>
    </div></section>
  `;
}

function renderTicketsPage() {
  const seats = Array.from({ length: 24 }, (_, i) => `A${i + 1}`);
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navTickets')}</h1></div>
      <div class="card glass-panel"><div class="card-body" style="text-align:center;">
        <h3>ملعب ميلود هدفي — اختر مقاعدك</h3>
        <p class="muted-text">السعر: 1000 DZD للمقعد الواحد</p>
        <div class="stadium-map">
          ${seats.map((s, idx) => `
            <button class="seat-btn ${idx % 7 === 0 ? 'taken' : ''} ${state.selectedSeats.includes(s) ? 'selected' : ''}"
              ${idx % 7 === 0 ? 'disabled' : ''} onclick="window.toggleSeat('${s}')">${s}</button>
          `).join('')}
        </div>
        <button class="btn btn-primary" onclick="window.confirmTicketBooking()">تأكيد الحجز وإصدار QR Code (${state.selectedSeats.length})</button>
        <div id="ticket-qr-output" style="margin-top:1.5rem;"></div>
      </div></div>
    </div></section>
  `;
}

function renderFansPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navFans')}</h1></div>
      <div class="counters-grid" style="margin-bottom:2rem;">
        <div class="counter-box"><div class="counter-value" data-target="40143">0</div><div class="muted-text">سعة ملعب ميلود هدفي</div></div>
        <div class="counter-box"><div class="counter-value" data-target="98">0</div><div class="muted-text">% نسبة الحضور</div></div>
        <div class="counter-box"><div class="counter-value" data-target="12">0</div><div class="muted-text">تيفو عالمي</div></div>
        <div class="counter-box"><div class="counter-value" data-target="1946">0</div><div class="muted-text">شغف لا ينتهي</div></div>
      </div>
      <div class="card"><div class="card-body">
        <h3>أهازيج الحمراوة</h3>
        <p class="muted-text">«حمراوة يا دولة... في ميلود هدفي ديما حاضرين!»</p>
      </div></div>
    </div></section>
  `;
}

function renderSponsorsPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navSponsors')}</h1></div>
      <div class="grid-3">${state.data.sponsors.map((s) => `<div class="neumorph-card" style="text-align:center;font-weight:900;font-size:1.3rem;">${s}</div>`).join('')}</div>
    </div></section>
  `;
}

function renderContactPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navContact')}</h1></div>
      <div class="card" style="max-width:640px;"><div class="card-body">
        <form onsubmit="event.preventDefault(); window.showToast('تم إرسال رسالتك بنجاح!'); this.reset();">
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <input class="form-control" type="text" placeholder="الاسم الكامل" required />
            <input class="form-control" type="email" placeholder="البريد الإلكتروني" required />
            <textarea class="form-control" rows="4" placeholder="رسالتك لإدارة مولودية وهران" required></textarea>
            <button class="btn btn-primary" type="submit">إرسال</button>
          </div>
        </form>
      </div></div>
    </div></section>
  `;
}

function renderFaqPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navFaq')}</h1></div>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${state.data.faq.map((f) => `<div class="card"><div class="card-body"><h3>${f.q}</h3><p class="muted-text">${f.a}</p></div></div>`).join('')}
      </div>
    </div></section>
  `;
}

function renderPrivacyPage() {
  return `<section class="section"><div class="container"><div class="section-header"><h1 class="section-title">${t('navPrivacy')}</h1></div><p class="muted-text">يحترم نادي مولودية وهران خصوصية زواره ويحفظ البيانات محلياً في متصفحك فقط.</p></div></section>`;
}

function renderTermsPage() {
  return `<section class="section"><div class="container"><div class="section-header"><h1 class="section-title">${t('navTerms')}</h1></div><p class="muted-text">جميع حقوق العلامة التجارية والشعارات محفوظة لنادي مولودية وهران.</p></div></section>`;
}

function renderAdminPage() {
  return `
    <section class="section"><div class="container">
      <div class="section-header"><h1 class="section-title">${t('navAdmin')} (LocalStorage)</h1></div>
      <div class="grid-2">
        <div class="card"><div class="card-body">
          <h3 style="margin-bottom:1rem;">إضافة خبر جديد</h3>
          <form onsubmit="window.adminAddNews(event)" style="display:flex;flex-direction:column;gap:0.75rem;">
            <input id="adm-news-title" class="form-control" placeholder="عنوان الخبر" required />
            <input id="adm-news-summary" class="form-control" placeholder="وصف مختصر" required />
            <button class="btn btn-primary" type="submit">نشر الخبر</button>
          </form>
        </div></div>

        <div class="card"><div class="card-body">
          <h3 style="margin-bottom:1rem;">إضافة منتج للمتجر</h3>
          <form onsubmit="window.adminAddProduct(event)" style="display:flex;flex-direction:column;gap:0.75rem;">
            <input id="adm-prod-name" class="form-control" placeholder="اسم المنتج" required />
            <input id="adm-prod-price" class="form-control" type="number" placeholder="السعر (DZD)" required />
            <button class="btn btn-primary" type="submit">إضافة المنتج</button>
          </form>
        </div></div>
      </div>
    </div></section>
  `;
}

/* ==========================================================================
   Interactive Actions (Cart, Tickets, Search, Admin)
   ========================================================================== */
window.addToCart = (productId) => {
  const prod = state.data.products.find((p) => p.id === productId);
  if (!prod) return;
  const existing = state.cart.find((c) => c.id === productId);
  if (existing) existing.qty += 1;
  else state.cart.push({ ...prod, qty: 1 });
  saveCart();
  window.showToast(`تمت إضافة "${prod.name}" إلى السلة`);
};

window.updateCartQty = (productId, delta) => {
  const item = state.cart.find((c) => c.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter((c) => c.id !== productId);
  saveCart();
};

function saveCart() {
  localStorage.setItem('mco_cart', JSON.stringify(state.cart));
  renderCart();
}

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (countEl) countEl.textContent = String(totalQty);
  if (totalEl) totalEl.textContent = `${totalPrice} DZD`;
  if (itemsEl) {
    itemsEl.innerHTML = state.cart.length
      ? state.cart.map((i) => `
          <div class="cart-item">
            <div><strong>${i.name}</strong><div class="muted-text">${i.price} DZD</div></div>
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <button class="btn btn-sm btn-outline" onclick="window.updateCartQty(${i.id}, -1)">-</button>
              <span>${i.qty}</span>
              <button class="btn btn-sm btn-outline" onclick="window.updateCartQty(${i.id}, 1)">+</button>
            </div>
          </div>
        `).join('')
      : '<p class="muted-text">السلة فارغة حالياً.</p>';
  }
}

window.toggleSeat = (seat) => {
  if (state.selectedSeats.includes(seat)) {
    state.selectedSeats = state.selectedSeats.filter((s) => s !== seat);
  } else {
    state.selectedSeats.push(seat);
  }
  renderRoute();
};

window.confirmTicketBooking = () => {
  if (!state.selectedSeats.length) {
    window.showToast('يرجى اختيار مقعد واحد على الأقل');
    return;
  }
  const out = document.getElementById('ticket-qr-output');
  if (out) {
    out.innerHTML = `
      <div class="neumorph-card" style="display:inline-block;">
        <p style="font-weight:800;margin-bottom:0.5rem;">تم تأكيد الحجز: ${state.selectedSeats.join(', ')}</p>
        <svg width="110" height="110" viewBox="0 0 100 100" style="background:#fff;padding:6px;border-radius:6px;">
          <rect x="10" y="10" width="25" height="25" fill="#111"/><rect x="65" y="10" width="25" height="25" fill="#111"/>
          <rect x="10" y="65" width="25" height="25" fill="#111"/><rect x="42" y="42" width="16" height="16" fill="#C8102E"/>
          <rect x="65" y="65" width="25" height="25" fill="#111"/>
        </svg>
      </div>
    `;
  }
  window.showToast('تم إصدار التذكرة بنجاح!');
};

window.adminAddNews = (e) => {
  e.preventDefault();
  const title = document.getElementById('adm-news-title').value.trim();
  const summary = document.getElementById('adm-news-summary').value.trim();
  state.data.news.unshift({
    id: Date.now(),
    title,
    summary,
    content: summary,
    date: new Date().toISOString().slice(0, 10),
    author: 'الإدارة',
    category: 'عاجل',
    views: 1,
    image: '/assets/hero-stadium.jpg'
  });
  saveData(state.data);
  e.target.reset();
  window.showToast('تم نشر الخبر وحفظه في LocalStorage');
};

window.adminAddProduct = (e) => {
  e.preventDefault();
  const name = document.getElementById('adm-prod-name').value.trim();
  const price = Number(document.getElementById('adm-prod-price').value);
  state.data.products.unshift({
    id: Date.now(),
    name,
    price,
    desc: 'منتج رسمي جديد من متجر مولودية وهران',
    image: '/assets/hero-stadium.jpg'
  });
  saveData(state.data);
  e.target.reset();
  window.showToast('تمت إضافة المنتج للمتجر');
};

window.shareNews = (title) => {
  if (navigator.share) navigator.share({ title, url: location.href }).catch(() => {});
  else window.showToast('تم نسخ رابط الخبر للمشاركة');
};

window.showToast = (msg) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2800);
};

/* ==========================================================================
   Global Events, Search, Scroll Reveal & Counters
   ========================================================================== */
function bindGlobalEvents() {
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang);
      renderRoute();
    });
  });

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-drawer')?.classList.add('open');
  });
  document.getElementById('close-drawer')?.addEventListener('click', closeDrawers);

  document.getElementById('cart-trigger')?.addEventListener('click', () => {
    renderCart();
    document.getElementById('cart-drawer')?.classList.add('open');
  });
  document.getElementById('close-cart')?.addEventListener('click', closeDrawers);
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (!state.cart.length) return;
    state.cart = [];
    saveCart();
    closeDrawers();
    window.showToast('تم تأكيد طلبك بنجاح! شكراً لدعمك الحمراوة.');
  });

  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('global-search-input');
  document.getElementById('search-trigger')?.addEventListener('click', () => {
    searchModal?.classList.remove('hidden');
    searchInput?.focus();
  });
  document.getElementById('close-search')?.addEventListener('click', () => {
    searchModal?.classList.add('hidden');
  });

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const resEl = document.getElementById('search-results');
    if (!resEl) return;
    if (!q) { resEl.innerHTML = ''; return; }
    const hits = [
      ...state.data.players.filter((p) => p.name.toLowerCase().includes(q)).map((p) => ({ label: p.name, type: 'لاعب', hash: `player-${p.id}` })),
      ...state.data.news.filter((n) => n.title.toLowerCase().includes(q)).map((n) => ({ label: n.title, type: 'خبر', hash: 'news' })),
      ...state.data.products.filter((p) => p.name.toLowerCase().includes(q)).map((p) => ({ label: p.name, type: 'متجر', hash: 'shop' }))
    ];
    resEl.innerHTML = hits.length
      ? hits.map((h) => `<div class="search-result-item" onclick="location.hash='${h.hash}';document.getElementById('search-modal').classList.add('hidden');"><span>${h.label}</span><span class="muted-text">${h.type}</span></div>`).join('')
      : '<p class="muted-text">لا توجد نتائج مطابقة.</p>';
  });

  renderCart();
}

function closeDrawers() {
  document.getElementById('mobile-drawer')?.classList.remove('open');
  document.getElementById('cart-drawer')?.classList.remove('open');
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initCounters() {
  document.querySelectorAll('.counter-value[data-target]').forEach((el) => {
    const target = Number(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 35));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = String(target);
        clearInterval(timer);
      } else {
        el.textContent = String(current);
      }
    }, 28);
  });
}

let phraseInterval = null;
function startHeroPhraseRotation() {
  if (phraseInterval) clearInterval(phraseInterval);
  let idx = 0;
  phraseInterval = setInterval(() => {
    const el = document.getElementById('hero-rotating-phrase');
    if (!el) return;
    const phrases = I18N[state.lang].heroPhrases;
    idx = (idx + 1) % phrases.length;
    el.textContent = phrases[idx];
  }, 3800);
}

init();
