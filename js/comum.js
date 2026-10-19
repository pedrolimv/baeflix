/* Baeflix — utilitários compartilhados entre as telas */
(function () {
  'use strict';
  const D = window.BAEFLIX || {};

  /* ---------- armazenamento ---------- */
  const PFX = 'baeflix_';
  let ok = true;
  try { localStorage.setItem(PFX + 't', '1'); localStorage.removeItem(PFX + 't'); } catch (e) { ok = false; }
  const mem = {};
  const store = {
    ok,
    get(k, d) {
      try { const v = ok ? localStorage.getItem(PFX + k) : mem[k]; return v == null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set(k, v) { const s = JSON.stringify(v); try { if (ok) localStorage.setItem(PFX + k, s); else mem[k] = s; } catch (e) {} },
    del(k) { try { if (ok) localStorage.removeItem(PFX + k); else delete mem[k]; } catch (e) {} }
  };

  /* ---------- normaliza caminhos padrão ---------- */
  (D.videos || []).forEach(v => {
    if (v.capa === undefined) v.capa = `imagens/capas/${v.id}.jpg`;
    if (v.poster === undefined) v.poster = `imagens/posters/${v.id}.jpg`;
    if (v.episodios && v.episodios.length) {
      v.episodios.forEach((e, i) => {
        if (e.capa === undefined) e.capa = `imagens/capas/${v.id}-ep${i + 1}.jpg`;
        if (e.video === undefined) e.video = `videos/${v.id}-ep${i + 1}.mp4`;
      });
      if (v.video === undefined) v.video = null;
    } else if (v.video === undefined) v.video = `videos/${v.id}.mp4`;
  });
  (D.emBreve || []).forEach(v => {
    if (v.capa === undefined) v.capa = `imagens/capas/${v.id}.jpg`;
    if (v.poster === undefined) v.poster = `imagens/posters/${v.id}.jpg`;
    v.video = null; v.emBreve = true;
  });
  (D.videos || []).concat(D.emBreve || []).forEach(v => {
    if (!v.ano && /^\d{4}-\d{2}-\d{2}$/.test(v.data || '')) v.ano = +v.data.slice(0, 4);
    if (v.emBreve) v.estreia = /^\d{4}-\d{2}-\d{2}$/.test(v.data || '') ? 'Estreia ' + dataCurta(v.data) : (v.data || 'Em breve');
  });

  /* ---------- SHA-256 (login sem deixar email, celular e senha legíveis) ---------- */
  function sha256(msg) {
    const K = [], H = [];
    let n = 2, c = 0;
    while (c < 64) {
      let primo = true;
      for (let i = 2; i * i <= n; i++) if (n % i === 0) { primo = false; break; }
      if (primo) {
        if (c < 8) H[c] = (Math.pow(n, 1 / 2) * 2 ** 32) | 0;
        K[c++] = (Math.pow(n, 1 / 3) * 2 ** 32) | 0;
      }
      n++;
    }
    const b = Array.from(new TextEncoder().encode(msg));
    const bits = b.length * 8;
    b.push(0x80);
    while (b.length % 64 !== 56) b.push(0);
    for (let i = 7; i >= 0; i--) b.push(i > 3 ? 0 : (bits >>> (i * 8)) & 255);
    const r = (x, s) => (x >>> s) | (x << (32 - s));
    for (let o = 0; o < b.length; o += 64) {
      const w = [];
      for (let i = 0; i < 16; i++) w[i] = (b[o + i * 4] << 24) | (b[o + i * 4 + 1] << 16) | (b[o + i * 4 + 2] << 8) | b[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [a, bb, cc, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & bb) ^ (a & cc) ^ (bb & cc))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = bb; bb = a; a = (t1 + t2) | 0;
      }
      [a, bb, cc, d, e, f, g, h].forEach((v, i) => { H[i] = (H[i] + v) | 0; });
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }

  /* ---------- texto ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function hash(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  /* ---------- datas ---------- */
  function parseData(s) { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); }
  function dataLonga(s) { return parseData(s).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function dataCurta(s) { return parseData(s).toLocaleDateString('pt-BR'); }
  function juntos() {
    const ini = parseData(D.inicioNamoro || '2022-10-22');
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const dias = Math.max(0, Math.round((hoje - ini) / 864e5));
    return { dias, anos: Math.max(1, Math.round(dias / 365.25)) };
  }

  /* ---------- ícones ---------- */
  const S = d => `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
  const P = {
    play: '<path fill="currentColor" d="M5 2.69a1 1 0 0 1 1.52-.85l15.43 9.31a1 1 0 0 1 0 1.7L6.52 22.16A1 1 0 0 1 5 21.31V2.69Z"/>',
    info: S('<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6"/>') + '<circle cx="12" cy="7.4" r="1.3" fill="currentColor"/>',
    search: S('<circle cx="10.5" cy="10.5" r="7"/><path d="m15.8 15.8 5.7 5.7"/>'),
    bell: S('<path d="M12 3a6 6 0 0 0-6 6v4.2l-1.6 3c-.3.6.1 1.3.8 1.3h13.6c.7 0 1.1-.7.8-1.3l-1.6-3V9a6 6 0 0 0-6-6Z"/><path d="M9.5 20.5a2.7 2.7 0 0 0 5 0"/>'),
    caret: '<path fill="currentColor" d="M5 8.5h14l-7 8z"/>',
    plus: S('<path d="M12 4.5v15M4.5 12h15"/>'),
    check: S('<path d="m4.5 12.5 5 5 10-11"/>'),
    thumb: S('<path d="M7 10.5V20H4.5a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1H7Zm0 0 3.8-7c1.6 0 2.8 1.4 2.5 3L12.8 9.5h5.7c1.3 0 2.2 1.2 1.9 2.5l-1.6 6.5A2 2 0 0 1 16.9 20H7"/>'),
    thumbFill: '<path fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M7 10.5V20H4.5a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1H7Zm0 0 3.8-7c1.6 0 2.8 1.4 2.5 3L12.8 9.5h5.7c1.3 0 2.2 1.2 1.9 2.5l-1.6 6.5A2 2 0 0 1 16.9 20H7"/>',
    chevDown: S('<path d="m5 9 7 7 7-7"/>'),
    chevL: S('<path d="m15 4-8 8 8 8"/>'),
    chevR: S('<path d="m9 4 8 8-8 8"/>'),
    volOff: '<path fill="currentColor" d="M11 4.5 6.5 8.5H3v7h3.5l4.5 4z"/>' + S('<path d="m15.5 9.5 5 5m0-5-5 5"/>'),
    volOn: '<path fill="currentColor" d="M11 4.5 6.5 8.5H3v7h3.5l4.5 4z"/>' + S('<path d="M15 8.5a5 5 0 0 1 0 7M17.8 5.5a9 9 0 0 1 0 13"/>'),
    close: S('<path d="m6 6 12 12M18 6 6 18"/>'),
    pencil: S('<path d="M15.5 4.5l4 4-11 11h-4v-4z"/>'),
    back: S('<path d="M20 12H5m6-7-7 7 7 7"/>'),
    lang: S('<path d="M3 5.5h9M7.5 3.5v2M5 5.5c.6 3 2.6 5.5 5.5 7M10 5.5c-.8 3.5-3 6.2-6.5 7.8M12.5 20.5 16.5 11l4 9.5M13.7 17.6h5.6"/>'),
    eye: S('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: S('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>'),
    err: S('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>'),
    heart: '<path fill="currentColor" d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.8 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.4 0 5.6 3.3 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z"/>',
    user: S('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.4-6.5 8-6.5s7 2 8 6.5"/>'),
    pause: '<path fill="currentColor" d="M5 3h4.5v18H5zM14.5 3H19v18h-4.5z"/>',
    rew10: '<path fill="currentColor" d="M11.5 3.2V1L6.8 4.8l4.7 3.8V6.2a7.8 7.8 0 1 1-7.3 7.8H2.2a9.8 9.8 0 1 0 9.3-10.8Z"/><text x="12.3" y="17.6" text-anchor="middle" font-family="Arial,sans-serif" font-size="7.2" font-weight="700" fill="currentColor">10</text>',
    fwd10: '<path fill="currentColor" d="M12.5 3.2V1l4.7 3.8-4.7 3.8V6.2a7.8 7.8 0 1 0 7.3 7.8h2a9.8 9.8 0 1 1-9.3-10.8Z"/><text x="11.7" y="17.6" text-anchor="middle" font-family="Arial,sans-serif" font-size="7.2" font-weight="700" fill="currentColor">10</text>',
    volMid: '<path fill="currentColor" d="M11 4.5 6.5 8.5H3v7h3.5l4.5 4z"/>' + S('<path d="M15 8.5a5 5 0 0 1 0 7"/>'),
    full: S('<path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/>'),
    fullExit: S('<path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/>'),
    speed: S('<path d="M4.2 17.5a9 9 0 1 1 15.6 0"/><path d="m12 13 4-5"/>') + '<circle cx="12" cy="13" r="1.8" fill="currentColor"/>',
    next: '<path fill="currentColor" d="M3 3.7a1 1 0 0 1 1.5-.9l11.8 8.3a1 1 0 0 1 0 1.7L4.5 21.2A1 1 0 0 1 3 20.3V3.7ZM18 3h3v18h-3z"/>',
    replay: S('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3 4v4.5h4.5"/>'),
    help: S('<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.4"/>') + '<circle cx="12" cy="17.2" r="1.2" fill="currentColor"/>'
  };
  const icon = (n, cls = '') => `<svg viewBox="0 0 24 24" class="ic-svg ${cls}" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- logo (imagens/logo/baeflix.svg) ---------- */
  function montarLogos(root = document) {
    root.querySelectorAll('[data-logo]').forEach(el => {
      if (el.querySelector('img')) return;
      el.innerHTML = '<img src="imagens/logo/baeflix.svg" alt="Baeflix" draggable="false">';
      el.setAttribute('aria-label', 'Baeflix');
    });
  }

  /* ---------- capas ---------- */
  const PALETAS = [
    ['#3a0d12', '#b81d24'], ['#0f2027', '#2c6f86'], ['#1d1047', '#6a5acd'], ['#42275a', '#a0577d'],
    ['#1f1c2c', '#7d78a3'], ['#4b134f', '#c94b4b'], ['#093028', '#2f8f68'], ['#3e1e04', '#c97b25'],
    ['#141e30', '#35577d'], ['#5c0f2e', '#e0567a']
  ];
  function gradiente(seed) {
    const [a, b] = PALETAS[hash(seed) % PALETAS.length];
    return `radial-gradient(120% 95% at 78% 18%, ${b} 0%, ${a} 55%, #070707 100%)`;
  }
  function fonteVideo(it) {
    if (!it) return null;
    if (it.video) return it.video;
    const e = (it.episodios || []).find(x => x.video);
    return e ? e.video : null;
  }
  function frame(v) {
    return `<video class="m-img" src="${esc(v)}#t=2" preload="metadata" muted playsinline tabindex="-1" onerror="this.remove()"></video>`;
  }
  function midia(it, { poster = false, video = true } = {}) {
    const src = poster ? (it.poster || it.capa) : it.capa;
    const vid = video ? fonteVideo(it) : null;
    let h = `<div class="m-fb" style="background:${gradiente(it.id || it.titulo)}"></div>`;
    if (src) h += `<img class="m-img" src="${esc(src)}" alt="" loading="lazy"${vid ? ` data-v="${esc(vid)}"` : ''} onerror="Baeflix._imgErr(this)">`;
    else if (vid) h += frame(vid);
    return h;
  }
  function _imgErr(img) {
    const v = img.getAttribute('data-v');
    if (v) img.insertAdjacentHTML('afterend', frame(v));
    img.remove();
  }
  function tArt(it, cls = '') {
    if (it.mostrarTitulo === false) return '';
    const s = it.estiloTitulo != null ? it.estiloTitulo : hash(it.id || it.titulo) % 5;
    return `<div class="t-art ts${s} ${cls}">${esc(it.titulo)}</div>`;
  }

  const RC = { L: '#00a54f', 10: '#0091d2', 12: '#f7c600', 14: '#f58220', 16: '#e2001a', 18: '#1d1d1b' };
  function rating(c) {
    c = String(c || 'L');
    return `<span class="rating" style="background:${RC[c] || '#555'};color:${c === '12' ? '#000' : '#fff'}">${esc(c)}</span>`;
  }

  /* ---------- perfis / sessão ---------- */
  function avatarStyle(p) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${p.cor || '#e50914'}"/><rect x="27" y="30" width="10" height="17" rx="1" fill="#fff"/><rect x="63" y="30" width="10" height="17" rx="1" fill="#fff"/><path d="M22 60 Q50 86 78 60" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
    const data = 'data:image/svg+xml,' + encodeURIComponent(svg);
    return `background-image:${p.avatar ? `url('${esc(p.avatar)}'),` : ''}url('${data}')`;
  }
  const logado = () => store.get('logado', false) === true;
  function perfilAtual() {
    const id = store.get('perfil', null);
    return (D.perfis || []).find(p => p.id === id) || null;
  }
  function sair() { store.del('logado'); store.del('perfil'); location.href = 'index.html'; }

  /* ---------- toast e diálogo ---------- */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('on'), 2800);
  }
  function dialogo(html) {
    const ov = document.createElement('div');
    ov.className = 'dlg-ov';
    ov.innerHTML = `<div class="dlg" role="dialog" aria-modal="true"><button class="dlg-x" aria-label="Fechar">${icon('close')}</button>${html}</div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('on'));
    const k = e => { if (e.key === 'Escape') close(); };
    function close() { ov.classList.remove('on'); setTimeout(() => ov.remove(), 250); document.removeEventListener('keydown', k); }
    document.addEventListener('keydown', k);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('.dlg-x,[data-close]')) close(); });
    return close;
  }

  window.Baeflix = {
    store, esc, norm, icon, sha256, montarLogos, midia, _imgErr, tArt, gradiente, fonteVideo, rating,
    avatarStyle, logado, perfilAtual, sair, toast, dialogo, dataLonga, dataCurta, juntos
  };
  document.addEventListener('DOMContentLoaded', () => montarLogos());
})();
