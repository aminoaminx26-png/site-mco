/**
 * MC Oran — HTML5 Canvas API Statistics Charts
 */
export function renderSeasonCharts() {
  drawBarChart('chart-goals', [
    { label: 'أهداف مسجلة', value: 42, color: '#C8102E' },
    { label: 'أهداف مستقبلة', value: 21, color: '#52525B' },
    { label: 'تسديدات/مباراة', value: 14, color: '#D4AF37' },
    { label: 'شباك نظيفة', value: 12, color: '#22C55E' }
  ]);

  drawDonutChart('chart-results', [
    { label: 'انتصارات (15)', value: 15, color: '#C8102E' },
    { label: 'تعادلات (7)', value: 7, color: '#D4AF37' },
    { label: 'هزائم (4)', value: 4, color: '#3F3F46' }
  ]);

  drawBarChart('chart-possession', [
    { label: 'الاستحواذ %', value: 58, color: '#C8102E' },
    { label: 'دقة التمرير %', value: 84, color: '#FFFFFF' },
    { label: 'الالتحامات %', value: 62, color: '#D4AF37' }
  ]);
}

function drawBarChart(canvasId, items) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const maxVal = Math.max(...items.map((i) => i.value), 10);
  const pad = 36;
  const barW = (w - pad * 2) / items.length - 18;

  items.forEach((item, idx) => {
    const barH = ((item.value / maxVal) * (h - 75));
    const x = pad + idx * (barW + 18);
    const y = h - 38 - barH;

    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 6);
    ctx.fill();

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary') || '#fff';
    ctx.font = 'bold 13px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(item.value), x + barW / 2, y - 8);

    ctx.fillStyle = '#A1A1AA';
    ctx.font = '11px Cairo, sans-serif';
    ctx.fillText(item.label, x + barW / 2, h - 14);
  });
}

function drawDonutChart(canvasId, slices) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const total = slices.reduce((s, i) => s + i.value, 0);
  const cx = w / 2 - 45;
  const cy = h / 2;
  const r = Math.min(cx, cy) - 16;
  let start = -Math.PI / 2;

  slices.forEach((slice, idx) => {
    const angle = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.arc(cx, cy, r * 0.56, start + angle, start, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    start += angle;

    // Legend
    ctx.fillStyle = slice.color;
    ctx.fillRect(w - 115, 45 + idx * 28, 12, 12);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary') || '#fff';
    ctx.font = '12px Cairo, sans-serif';
    ctx.textAlign = 'start';
    ctx.fillText(slice.label, w - 96, 55 + idx * 28);
  });
}
