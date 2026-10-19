/* Baeflix — tela Início / catálogo, detalhes e player */
(function () {
  'use strict';
  const D = window.BAEFLIX, B = window.Baeflix, I = B.icon, esc = B.esc;

  if (B.store.ok && !B.logado()) { location.replace('login.html'); return; }
  const perfil = B.perfilAtual() || (!B.store.ok ? D.perfis[0] : null);
  if (!perfil) { location.replace('perfis.html'); return; }

  const $ = s => document.querySelector(s);
  const videos = D.videos;
  const emBreve = D.emBreve || [];
  const byId = {};
  videos.concat(emBreve).forEach(v => { byId[v.id] = v; });
  const { dias, anos } = B.juntos();
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const nav = $('#nav'), heroEl = $('#hero'), rowsEl = $('#rows'), grade = $('#grade');
  const hc = $('#hoverCard'), modal = $('#modal'), player = $('#player');

  /* ---------------- estado por perfil ---------------- */
  const kLista = 'lista_' + perfil.id, kLikes = 'likes_' + perfil.id, kProg = 'prog_' + perfil.id;
  const lista = () => B.store.get(kLista, []);
  const likes = () => B.store.get(kLikes, []);
  const progAll = () => B.store.get(kProg, {});

  function toggleLista(id) {
    let l = lista();
    const tem = l.includes(id);
    l = tem ? l.filter(x => x !== id) : [id, ...l];
    B.store.set(kLista, l);
    B.toast(tem ? 'Removido da Minha lista' : 'Adicionado à Minha lista ❤');
    syncBtns();
    if (view === 'lista') render();
  }
  function toggleLike(id) {
    let l = likes();
    const tem = l.includes(id);
    l = tem ? l.filter(x => x !== id) : [...l, id];
    B.store.set(kLikes, l);
    if (!tem) B.toast('Que bom que você amou! ❤');
    syncBtns();
  }
  const btnLista = (id, cls = '') => `<button class="hc-btn ${cls}" data-act="list" data-id="${esc(id)}" aria-label="Minha lista">${I(lista().includes(id) ? 'check' : 'plus')}</button>`;
  const btnLike = (id, cls = '') => `<button class="hc-btn ${cls}" data-act="like" data-id="${esc(id)}" aria-label="Gostei">${I(likes().includes(id) ? 'thumbFill' : 'thumb')}</button>`;
  function syncBtns() {
    const l = lista(), k = likes();
    document.querySelectorAll('[data-act="list"]').forEach(b => { b.innerHTML = I(l.includes(b.dataset.id) ? 'check' : 'plus'); });
    document.querySelectorAll('[data-act="like"]').forEach(b => { b.innerHTML = I(k.includes(b.dataset.id) ? 'thumbFill' : 'thumb'); });
  }

  function salvarProg(id, ep, t, d) {
    const all = progAll();
    if (!d || t / d > 0.95) delete all[id];
    else all[id] = { ep, t, d, ts: Date.now() };
    B.store.set(kProg, all);
  }
  function pct(id) {
    const p = progAll()[id];
    return p && p.d ? Math.min(100, Math.max(3, (p.t / p.d) * 100)) : 0;
  }
  function continuar() {
    const all = progAll();
    return Object.keys(all)
      .filter(id => byId[id] && all[id].d && all[id].t / all[id].d > 0.01)
      .sort((a, b) => all[b].ts - all[a].ts)
      .map(id => byId[id]);
  }

  /* ---------------- textos auxiliares ---------------- */
  const tipoNome = it => (it.tipo === 'serie' ? 'Série' : 'Filme');
  const duracao = it => (it.emBreve ? it.estreia : it.episodios && it.episodios.length ? `${it.episodios.length} episódio${it.episodios.length > 1 ? 's' : ''}` : it.duracao || '');
  const elenco = it => it.elenco || D.elenco || D.perfis.map(p => p.nome).join(', ');
  const generos = it => (it.generos || []).join(', ');
  const clima = it => (it.clima || ['Romântico', 'Fofo', 'Inesquecível']).join(', ');
  const tags = it => (it.clima || (it.generos || []).concat(['Romântico'])).slice(0, 3);

  /* ---------------- navbar ---------------- */
  $('#searchBtn').innerHTML = I('search');
  $('#bellIc').innerHTML = I('bell');
  $('#profCaret').innerHTML = I('caret');
  $('#navCaret').innerHTML = I('caret');
  $('#profAvatar').setAttribute('style', B.avatarStyle(perfil));
  $('#copy').textContent = `© ${String(D.inicioNamoro).slice(0, 4)}-${new Date().getFullYear()} Baeflix, Inc. Feito com amor por ${D.autor}.`;

  addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 10); hideHover(); }, { passive: true });

  function fecharMenus(exceto) { document.querySelectorAll('.menu.open').forEach(m => { if (m !== exceto) m.classList.remove('open'); }); }
  document.querySelectorAll('.menu').forEach(menu => {
    let t;
    menu.querySelector('[data-toggle]').addEventListener('click', e => {
      e.stopPropagation();
      const abrir = !menu.classList.contains('open');
      fecharMenus(menu);
      menu.classList.toggle('open', abrir);
      if (abrir) menu.dispatchEvent(new Event('abriu'));
    });
    if (canHover) {
      menu.addEventListener('mouseenter', () => { clearTimeout(t); fecharMenus(menu); if (!menu.classList.contains('open')) { menu.classList.add('open'); menu.dispatchEvent(new Event('abriu')); } });
      menu.addEventListener('mouseleave', () => { t = setTimeout(() => menu.classList.remove('open'), 300); });
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.menu')) fecharMenus();
    if (!e.target.closest('#navLinks, #navBrowse')) $('#navLinks').classList.remove('open');
  });

  // notificações
  const dest = byId[(D.destaque || {}).id] || videos[0];
  $('#bellDrop').innerHTML = `
    <div class="notif" data-more="${esc(dest.id)}">
      <div class="notif-thumb">${B.midia(dest, { video: false })}</div>
      <div>
        <b>Novidade: ${anos} anos de namoro ❤</b>
        <p>Hoje faz ${dias.toLocaleString('pt-BR')} dias que a gente está junto. Assista à nova temporada.</p>
        <small>Desde ${B.dataLonga(D.inicioNamoro)}</small>
      </div>
    </div>`;
  if (B.store.get('notif_' + perfil.id, false)) $('#bellBadge').hidden = true;
  $('#bellMenu').addEventListener('abriu', () => { $('#bellBadge').hidden = true; B.store.set('notif_' + perfil.id, true); });

  // menu do perfil
  $('#profDrop').innerHTML =
    D.perfis.filter(p => p.id !== perfil.id).map(p =>
      `<button class="dd-item" data-perfil="${esc(p.id)}"><span class="avatar xs" style="${B.avatarStyle(p)}"></span><span>${esc(p.nome)}</span></button>`).join('') +
    `<button class="dd-item" data-go="perfis">${I('pencil')}<span>Gerenciar perfis</span></button>
     <button class="dd-item" data-msg="Sua conta: plano Premium Vitalício, pago em beijos ❤">${I('user')}<span>Conta</span></button>
     <button class="dd-item" data-msg="Precisa de ajuda? Me chama que eu vou correndo ❤">${I('help')}<span>Central de Ajuda</span></button>
     <div class="dd-sep"></div>
     <button class="dd-item dd-center" data-go="sair"><span>Sair da Baeflix</span></button>`;
  $('#profDrop').addEventListener('click', e => {
    const b = e.target.closest('.dd-item');
    if (!b) return;
    if (b.dataset.perfil) { B.store.set('perfil', b.dataset.perfil); location.href = 'inicio.html'; }
    else if (b.dataset.go === 'perfis') location.href = 'perfis.html';
    else if (b.dataset.go === 'sair') B.sair();
    else if (b.dataset.msg) B.toast(b.dataset.msg);
  });

  // links da navegação
  const VIEWS = { inicio: 'Início', series: 'Séries', filmes: 'Filmes', jogos: 'Jogos', bombando: 'Bombando', lista: 'Minha Baeflix', idiomas: 'Navegar por idiomas' };
  let view = 'inicio';
  $('#navLinks').addEventListener('click', e => {
    const a = e.target.closest('a[data-view]');
    if (!a) return;
    $('#navLinks').classList.remove('open');
    const v = a.dataset.view;
    if (v === 'jogos') return B.toast('Nosso jogo favorito: ver quem ama mais (eu ganho) ❤');
    if (v === 'idiomas') return B.toast('Aqui só se fala a língua do amor ❤');
    limparBusca();
    if (location.hash.slice(1) === v || (v === 'inicio' && !location.hash)) { render(); scrollTo(0, 0); }
    else location.hash = v === 'inicio' ? '' : v;
  });
  $('#navBrowse').addEventListener('click', e => { e.stopPropagation(); $('#navLinks').classList.toggle('open'); });
  $('#navClose').innerHTML = I('close');
  $('#navClose').addEventListener('click', () => $('#navLinks').classList.remove('open'));
  $('#navLinks').addEventListener('click', e => { if (e.target === $('#navLinks')) $('#navLinks').classList.remove('open'); });
  const viewDoHash = () => { const h = location.hash.slice(1); return VIEWS[h] && h !== 'jogos' && h !== 'idiomas' ? h : 'inicio'; };
  addEventListener('hashchange', () => { view = viewDoHash(); render(); scrollTo(0, 0); });

  // busca
  const search = $('#search'), sInput = $('#searchInput');
  $('#searchBtn').addEventListener('click', () => { search.classList.add('open'); sInput.focus(); });
  sInput.addEventListener('blur', () => { if (!sInput.value) search.classList.remove('open'); });
  let sT;
  sInput.addEventListener('input', () => { clearTimeout(sT); sT = setTimeout(() => (sInput.value.trim() ? renderBusca(sInput.value.trim()) : render()), 200); });
  sInput.addEventListener('keydown', e => { if (e.key === 'Escape') { limparBusca(); render(); sInput.blur(); } });
  function limparBusca() { sInput.value = ''; search.classList.remove('open'); }

  $('#footLinks').addEventListener('click', e => { if (e.target.tagName === 'A') B.toast('A resposta para tudo é: eu te amo ❤'); });
  $('#svc').addEventListener('click', () => B.toast('Código do serviço: TE-AMO-4EVER'));

  /* ---------------- hero ---------------- */
  let heroVid = null;
  function tituloHTML(t, logo) {
    if (logo) return `<img src="${esc(logo)}" alt="${esc(t)}">`;
    return esc(t).replace(/\[([^\]]+)\]/g, '<span class="box">$1</span>').replace(/\|/g, '<br>');
  }
  function renderHero(it, cfg) {
    cfg = cfg || {};
    // fundo = imagem sem título → o título é escrito separado, como o logo da Netflix
    const fundo = cfg.imagem || it.fundo;
    // sem fundo, a capa real já tem o título desenhado: o banner usa a imagem e não escreve por cima
    const arte = !fundo && it.mostrarTitulo === false && !cfg.logo && !cfg.tituloHero;
    const vid = cfg.video || (arte || fundo ? null : B.fonteVideo(it));
    const meta = cfg.meta || [tipoNome(it), (it.generos || [])[0], it.ano, duracao(it)].filter(Boolean);
    const chips = (cfg.chips || ['Há {anos} anos no Top 1 do meu coração', 'Achamos que você vai amar isto!']).map(c => c.replace('{anos}', anos).replace('{dias}', dias));
    const base = fundo ? Object.assign({}, it, { capa: fundo }) : it;
    const mob = fundo ? it.fundoMobile : it.poster;
    heroEl.classList.toggle('arte', arte);
    heroEl.classList.toggle('fundo', !!fundo);
    heroEl.innerHTML = `
      <div class="hero-media">${B.midia(base, { video: false })}${mob ? `<img class="hero-mob" src="${esc(mob)}" alt="" onerror="this.remove()">` : ''}${vid ? `<video class="hero-video" muted loop playsinline preload="auto" src="${esc(vid)}"></video>` : ''}</div>
      <div class="hero-shade"></div>
      <img class="hero-b" src="imagens/logo/baeflix-b.svg" alt="" aria-hidden="true">
      ${vid ? `<button class="hero-mute" id="heroMute" aria-label="Ativar som" hidden>${I('volOff')}</button>` : ''}
      <div class="hero-info">
        ${arte ? `<h1 class="sr-only">${esc(it.titulo)}</h1>` : `<h1 class="hero-title${cfg.estiloTitulo ? ' tl-' + esc(cfg.estiloTitulo) : ''}">${tituloHTML(cfg.tituloHero || it.titulo, cfg.logo)}</h1>`}
        <div class="hero-meta">${meta.map(m => `<span>${esc(m)}</span>`).join('<span class="dot">•</span>')}<span class="dot">•</span>${B.rating(it.classificacao)}</div>
        ${it.descricao ? `<p class="hero-desc">${esc(it.descricao)}</p>` : ''}
        <div class="hero-btns">
          <button class="btn-play" data-play="${esc(it.id)}">${I('play')}Assistir</button>
          <button class="btn-play btn-more" data-more="${esc(it.id)}">Mais informações</button>
        </div>
      </div>
      <div class="hero-chips">
        ${chips[0] ? `<span class="chip"><span class="t10"><small>TOP</small>10</span>${esc(chips[0])}</span>` : ''}
        ${chips[1] ? `<span class="chip">${I('thumb')}${esc(chips[1])}</span>` : ''}
      </div>`;
    heroVid = heroEl.querySelector('.hero-video');
    if (heroVid) {
      const mute = $('#heroMute');
      heroVid.addEventListener('error', () => { heroVid.remove(); heroVid = null; mute.remove(); });
      heroVid.addEventListener('playing', () => { heroVid.classList.add('on'); mute.hidden = false; });
      setTimeout(() => retomarHero(), 1200);
      mute.addEventListener('click', () => {
        heroVid.muted = !heroVid.muted;
        mute.innerHTML = I(heroVid.muted ? 'volOff' : 'volOn');
        mute.setAttribute('aria-label', heroVid.muted ? 'Ativar som' : 'Desativar som');
      });
    }
  }
  let heroVisivel = true;
  new IntersectionObserver(es => { heroVisivel = es[0].isIntersecting; heroVisivel ? retomarHero() : pausarHero(); }, { threshold: 0.35 }).observe(heroEl);
  function pausarHero() { if (heroVid) heroVid.pause(); }
  function retomarHero() {
    if (!heroVid || !heroVisivel || !modal.hidden || !player.hidden || heroEl.hidden) return;
    const p = heroVid.play();
    if (p && p.catch) p.catch(() => {});
  }

  /* ---------------- fileiras ---------------- */
  const pad = () => parseFloat(getComputedStyle(rowsEl.querySelector('.row-track') || document.body).paddingLeft) || 60;

  function card(it, opt = {}) {
    const p = opt.progress ? pct(it.id) : 0;
    return `<div class="card" data-id="${esc(it.id)}" tabindex="0" role="button" aria-label="${esc(it.titulo)}">
      <div class="card-media">${B.midia(it)}${B.tArt(it)}
        ${it.top10 ? '<span class="b-top10 t10"><small>TOP</small>10</span>' : ''}
        ${it.emBreve ? `<span class="b-new soon">${esc(it.estreia || 'Em breve')}</span>` : it.novidade ? '<span class="b-new">Novidade</span>' : ''}
      </div>
      ${p ? `<div class="prog"><i style="width:${p}%"></i></div>` : ''}
    </div>`;
  }
  function cardTop(it, n) {
    return `<div class="card top10${n >= 10 ? ' n10' : ''}" data-id="${esc(it.id)}" tabindex="0" role="button" aria-label="${n}. ${esc(it.titulo)}">
      <span class="rank" aria-hidden="true">${n}</span>
      <div class="card-media">${B.midia(it, { poster: true })}${B.tArt(it)}${it.novidade ? '<span class="b-new">Novidade</span>' : ''}</div>
    </div>`;
  }

  const atualizadores = [];
  function row(titulo, itens, opt = {}) {
    if (!itens.length) return;
    const sec = document.createElement('section');
    sec.className = 'row';
    sec.innerHTML = `<h2 class="row-title">${esc(titulo)}</h2>
      <div class="row-wrap">
        <button class="row-arrow l" aria-label="Anteriores">${I('chevL')}</button>
        <div class="row-track">${itens.map((it, i) => (opt.top10 ? cardTop(it, i + 1) : card(it, opt))).join('')}</div>
        <button class="row-arrow r" aria-label="Próximos">${I('chevR')}</button>
      </div>`;
    rowsEl.appendChild(sec);
    const tr = sec.querySelector('.row-track'), l = sec.querySelector('.l'), r = sec.querySelector('.r');
    const upd = () => { l.hidden = tr.scrollLeft < 5; r.hidden = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 5; };
    tr.addEventListener('scroll', upd, { passive: true });
    requestAnimationFrame(upd);
    atualizadores.push(upd);
    const passo = () => tr.clientWidth - pad() * 2 + 8;
    l.addEventListener('click', () => { hideHover(); tr.scrollBy({ left: -passo(), behavior: 'smooth' }); });
    r.addEventListener('click', () => { hideHover(); tr.scrollBy({ left: passo(), behavior: 'smooth' }); });
  }
  addEventListener('resize', () => atualizadores.forEach(f => f()));

  function renderRows(tipo) {
    rowsEl.innerHTML = '';
    rowsEl.className = 'rows';
    atualizadores.length = 0;
    const f = it => !tipo || it.tipo === tipo;

    row(`Continuar assistindo como ${perfil.nome}`, continuar().filter(f), { progress: true });
    row('Minha lista', lista().map(id => byId[id]).filter(Boolean).filter(f));
    (D.categorias || []).forEach(c => {
      let its = (c.itens || []).map(id => byId[id]).filter(Boolean).filter(f);
      if (c.top10) its = its.slice(0, 10);
      row(c.titulo, its, c);
    });
    if (D.linhasPorAno) {
      const anosSet = [...new Set(videos.filter(f).map(v => v.ano).filter(Boolean))].sort();
      anosSet.forEach(a => row((D.titulosAnos || {})[a] || `Nosso ${a}`, videos.filter(v => v.ano === a && f(v))));
    }
    if (!rowsEl.children.length) rowsEl.innerHTML = '<p class="row-empty">Nada por aqui ainda… adicione vídeos no arquivo dados.js ❤</p>';
  }

  /* ---------------- views ---------------- */
  function marcarNav() {
    document.querySelectorAll('#navLinks a').forEach(a => a.classList.toggle('active', a.dataset.view === view));
    $('#navLabel').textContent = view === 'inicio' ? 'Navegar' : VIEWS[view];
    document.title = `${VIEWS[view]} - Baeflix`;
  }
  function mostrar(hero, rows, gr) { heroEl.hidden = !hero; rowsEl.hidden = !rows; grade.hidden = !gr; if (!hero) pausarHero(); }

  function render() {
    hideHover();
    marcarNav();
    if (view === 'inicio') {
      mostrar(true, true, false);
      renderHero(dest, D.destaque);
      renderRows();
    } else if (view === 'series' || view === 'filmes') {
      const tipo = view === 'series' ? 'serie' : 'filme';
      const its = videos.filter(v => v.tipo === tipo);
      const h = its.find(v => v.top10) || its[0];
      mostrar(!!h, true, false);
      if (h) renderHero(h, h.id === dest.id ? D.destaque : null);
      renderRows(tipo);
      if (!h) { rowsEl.classList.add('no-hero'); }
    } else if (view === 'bombando') {
      mostrar(false, true, false);
      rowsEl.innerHTML = '';
      rowsEl.className = 'rows no-hero';
      atualizadores.length = 0;
      rowsEl.insertAdjacentHTML('beforeend', '<h1 class="page-title">Bombando</h1>');
      row('Novidades na Baeflix', videos.filter(v => v.novidade));
      row('Top 10 do nosso namoro hoje', videos.filter(v => v.top10).slice(0, 10), { top10: true });
      row('Em breve', emBreve);
      row('Mais recentes', videos.slice().sort((a, b) => String(b.data).localeCompare(String(a.data))));
    } else if (view === 'lista') {
      const its = lista().map(id => byId[id]).filter(Boolean);
      renderGrade('Minha lista', its, 'Você ainda não adicionou nenhum título à sua lista. Clique no + de qualquer vídeo ❤');
    }
  }
  function renderGrade(titulo, its, vazio, sub) {
    hideHover();
    mostrar(false, false, true);
    grade.innerHTML = `<h1>${sub ? `<small>${esc(sub)}</small>` : ''}${esc(titulo)}</h1>` +
      (its.length ? `<div class="grade-list">${its.map(it => card(it)).join('')}</div>` : `<p class="empty">${esc(vazio)}</p>`);
  }
  function renderBusca(q) {
    const n = B.norm(q);
    const its = videos.concat(emBreve).filter(v =>
      [v.titulo, v.descricao, generos(v), elenco(v), v.ano, (v.clima || []).join(' '), (v.episodios || []).map(e => e.titulo).join(' ')]
        .some(x => B.norm(x).includes(n)));
    renderGrade(`"${q}"`, its, `Sua busca por "${q}" não encontrou resultados. Mas você sempre me encontra ❤`, 'Explore títulos relacionados a:');
  }

  /* ---------------- card flutuante (hover) ---------------- */
  let hvT, pvT, hvAlvo = null;
  if (canHover) {
    document.addEventListener('mouseover', e => {
      if (hc.contains(e.target)) return;
      const c = e.target.closest('.card');
      if (c === hvAlvo) return;
      clearTimeout(hvT);
      hvAlvo = c;
      if (c) hvT = setTimeout(() => showHover(c), 480);
      else if (hc.classList.contains('on')) hideHover();
    });
    hc.addEventListener('mouseleave', () => hideHover());
  }
  function showHover(c) {
    const it = byId[c.dataset.id];
    if (!it || !modal.hidden || !player.hidden) return;
    const r = c.getBoundingClientRect();
    if (!r.width) return;
    const w = Math.max(r.width * 1.5, 300), mh = (w * 9) / 16;
    const margem = Math.min(pad(), 40) * 0.5;
    let left = r.left + r.width / 2 - w / 2, ox = 'center';
    if (left < margem) { left = r.left; ox = 'left'; }
    else if (left + w > innerWidth - margem) { left = r.right - w; ox = 'right'; }
    const top = r.top + r.height / 2 - mh / 2;
    const s = r.width / w;
    hc._s = s;
    const p = pct(it.id), pr = progAll()[it.id];
    hc.innerHTML = `
      <div class="hc-media" data-more="${esc(it.id)}">${B.midia(it)}${B.tArt(it)}</div>
      <div class="hc-body">
        <div class="hc-btns">
          ${it.emBreve ? `<button class="hc-btn play" data-act="remind" aria-label="Lembrar-me">${I('bell')}</button>` : `<button class="hc-btn play" data-play="${esc(it.id)}" aria-label="Assistir">${I('play')}</button>`}
          ${btnLista(it.id)}${btnLike(it.id)}
          <button class="hc-btn more" data-more="${esc(it.id)}" aria-label="Mais informações">${I('chevDown')}</button>
        </div>
        ${p ? `<div class="hc-prog"><div class="prog"><i style="width:${p}%"></i></div><span>${pr && pr.ep != null ? `Ep. ${pr.ep + 1}` : ''}</span></div>` : ''}
        <div class="hc-meta"><span class="match">100% amor</span>${B.rating(it.classificacao)}<span>${esc(duracao(it))}</span><span class="hd">HD</span></div>
        <div class="hc-tags">${tags(it).map(esc).join('<i>•</i>')}</div>
      </div>`;
    hc.style.cssText = `left:${left + scrollX}px;top:${top + scrollY}px;width:${w}px;--tb:${w}px;transform-origin:${ox} ${mh / 2}px;transform:scale(${s})`;
    hc.dataset.id = it.id;
    void hc.offsetWidth;
    hc.classList.add('on');
    hc.style.transform = 'scale(1)';
    // prévia do vídeo
    const vid = B.fonteVideo(it);
    clearTimeout(pvT);
    if (vid && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pvT = setTimeout(() => {
        const m = hc.querySelector('.hc-media');
        if (!m || hc.dataset.id !== it.id) return;
        const v = document.createElement('video');
        Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, src: vid });
        v.className = 'prev';
        v.addEventListener('playing', () => v.classList.add('on'));
        v.addEventListener('error', () => v.remove());
        m.appendChild(v);
      }, 900);
    }
  }
  function hideHover() {
    clearTimeout(hvT); clearTimeout(pvT);
    hvAlvo = null;
    if (!hc.classList.contains('on')) return;
    hc.classList.remove('on');
    hc.style.transform = `scale(${hc._s || 0.67})`;
    const v = hc.querySelector('video.prev');
    if (v) v.pause();
    setTimeout(() => { if (!hc.classList.contains('on')) hc.innerHTML = ''; }, 260);
  }

  /* ---------------- cliques gerais ---------------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-play],[data-more],[data-act],.card,.sim');
    if (!t) return;
    if (t.dataset.play) { tocar(byId[t.dataset.play], t.dataset.ep != null ? +t.dataset.ep : undefined); return; }
    if (t.dataset.more) { fecharMenus(); abrirDetalhes(byId[t.dataset.more]); return; }
    if (t.dataset.act === 'list') return toggleLista(t.dataset.id);
    if (t.dataset.act === 'like') return toggleLike(t.dataset.id);
    if (t.dataset.act === 'remind') return B.toast('Vamos te lembrar! Essa estreia vai ser com você ❤');
    if (t.dataset.id) abrirDetalhes(byId[t.dataset.id]);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!player.hidden) fecharPlayer();
      else if (!modal.hidden) fecharDetalhes();
      return;
    }
    if (!player.hidden) return;
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('card')) {
      e.preventDefault();
      abrirDetalhes(byId[e.target.dataset.id]);
    }
  });

  /* ---------------- modal de detalhes ---------------- */
  function semelhantes(it) {
    const g = new Set(it.generos || []);
    return videos.filter(v => v.id !== it.id)
      .map(v => ({ v, s: (v.generos || []).filter(x => g.has(x)).length * 10 - Math.abs((v.ano || 0) - (it.ano || 0)) }))
      .sort((a, b) => b.s - a.s).slice(0, 6).map(x => x.v);
  }
  function simCard(s) {
    return `<div class="sim" data-id="${esc(s.id)}">
      <div class="sim-media">${B.midia(s)}${B.tArt(s)}<span class="sim-dur">${esc(duracao(s))}</span></div>
      <div class="sim-body">
        <div class="sim-row">
          <div><span class="match">100% amor</span><div>${B.rating(s.classificacao)}<span class="hd">HD</span><span>${esc(s.ano || '')}</span></div></div>
          ${btnLista(s.id)}
        </div>
        <p class="sim-desc">${esc(s.descricao || '')}</p>
      </div>
    </div>`;
  }
  function abrirDetalhes(it) {
    if (!it) return;
    hideHover(); pausarHero();
    const eps = it.episodios || [];
    const pr = progAll()[it.id];
    const vid = B.fonteVideo(it);
    modal.innerHTML = `
      <div class="det" role="dialog" aria-modal="true" aria-label="${esc(it.titulo)}">
        <button class="det-close" aria-label="Fechar">${I('close')}</button>
        <div class="det-media">${B.midia(it)}
          <div class="det-head">${B.tArt(it)}
            <div class="det-btns">
              ${it.emBreve
                ? `<button class="btn-play sq" data-act="remind">${I('bell')}Lembrar-me</button>`
                : `<button class="btn-play sq" data-play="${esc(it.id)}"${pr && pr.ep != null ? ` data-ep="${pr.ep}"` : ''}>${I('play')}${pr ? 'Continuar' : 'Assistir'}</button>`}
              ${btnLista(it.id, 'lg')}${btnLike(it.id, 'lg')}
            </div>
          </div>
        </div>
        <div class="det-body">
          <div>
            <div class="det-meta"><span class="match">100% amor</span><span>${esc(it.ano || '')}</span><span>${esc(duracao(it))}</span><span class="hd">HD</span></div>
            <div class="det-meta2">${B.rating(it.classificacao)}<span>${esc(clima(it))}</span></div>
            <p class="det-desc">${esc(it.descricao || '')}</p>
          </div>
          <div class="det-right">
            <p><span>Elenco: </span>${esc(elenco(it))}</p>
            <p><span>Gêneros: </span>${esc(generos(it))}</p>
            <p><span>Este título é: </span>${esc(clima(it))}</p>
          </div>
        </div>
        ${eps.length ? `
        <div class="det-sec">
          <div class="det-sec-head"><h3>Episódios</h3><span>${esc(it.temporada || 'Temporada 1')}</span></div>
          <div class="eps">${eps.map((ep, i) => `
            <div class="ep${pr && pr.ep === i ? ' cur' : ''}" data-play="${esc(it.id)}" data-ep="${i}">
              <div class="ep-n">${i + 1}</div>
              <div class="ep-thumb">${B.midia(Object.assign({ id: it.id + '-' + i }, ep))}<span class="pl"><span>${I('play')}</span></span></div>
              <div class="ep-info"><div class="ep-top"><span>${esc(ep.titulo)}</span><span>${esc(ep.duracao || '')}</span></div><p class="ep-desc">${esc(ep.descricao || '')}</p></div>
            </div>`).join('')}
          </div>
        </div>` : ''}
        <div class="det-sec"><h3>Títulos semelhantes</h3><div class="sim-grid">${semelhantes(it).map(simCard).join('')}</div></div>
        <div class="det-sec det-about">
          <h3>Sobre <b>${esc(it.titulo)}</b></h3>
          <p><span>Criação: </span>${esc(D.autor)}</p>
          <p><span>Elenco: </span>${esc(elenco(it))}</p>
          <p><span>Gêneros: </span>${esc(generos(it))}</p>
          <p><span>Este título é: </span>${esc(clima(it))}</p>
          ${/^\d{4}-\d{2}-\d{2}$/.test(it.data || '') ? `<p><span>${it.emBreve ? 'Estreia' : 'Data de lançamento'}: </span>${esc(B.dataLonga(it.data))}</p>` : ''}
          <p><span>Classificação etária: </span>${B.rating(it.classificacao)} Feito para assistir juntinhos</p>
        </div>
      </div>`;
    if (vid && canHover && it.mostrarTitulo !== false) {
      const m = modal.querySelector('.det-media');
      const v = document.createElement('video');
      Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, src: vid });
      v.className = 'prev';
      v.addEventListener('playing', () => v.classList.add('on'));
      v.addEventListener('error', () => v.remove());
      m.insertBefore(v, m.querySelector('.det-head'));
    }
    modal.hidden = false;
    modal.scrollTop = 0;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => modal.classList.add('on'));
  }
  function fecharDetalhes() {
    modal.classList.remove('on');
    const v = modal.querySelector('video');
    if (v) v.pause();
    setTimeout(() => {
      modal.hidden = true; modal.innerHTML = '';
      if (player.hidden) document.body.classList.remove('no-scroll');
      retomarHero();
    }, 250);
  }
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.det-close')) fecharDetalhes(); });

  /* ---------------- player ---------------- */
  const fmt = s => {
    s = Math.max(0, Math.floor(s || 0));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = String(s % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`;
  };
  const VEL = [0.5, 0.75, 1, 1.25, 1.5];
  let idleT, pauseT, fimT, pl = null; // pl = estado do player aberto

  function proximoFilme(it) {
    const lista = videos.filter(v => B.fonteVideo(v));
    const i = lista.findIndex(v => v.id === it.id);
    return lista.length > 1 ? lista[(i + 1) % lista.length] : null;
  }

  function tocar(it, epIdx) {
    if (!it) return;
    if (it.emBreve) return B.toast('Esse capítulo ainda está sendo escrito… ❤');
    hideHover(); pausarHero();
    const mv = modal.querySelector('video');
    if (mv) mv.pause();
    limparTimers();
    const eps = it.episodios || [];
    const pr = progAll()[it.id];
    if (eps.length && epIdx == null) epIdx = pr && pr.ep != null ? pr.ep : 0;
    const ep = eps.length ? eps[epIdx] : null;
    const src = ep ? ep.video : it.video;
    const temProx = !!(ep && epIdx < eps.length - 1);
    const prox = temProx ? null : proximoFilme(it);
    const vol = B.store.get('volume', 1), mudo = B.store.get('mudo', false);

    player.innerHTML = `
      ${src ? `<video playsinline preload="auto" src="${esc(src)}"></video>` : ''}
      <div class="pl-loading"><div class="ring"></div></div>
      <div class="pl-flash"></div>
      <div class="pl-watching">
        <small>Você está assistindo</small>
        <h2>${esc(it.titulo)}</h2>
        <p class="pl-w-meta">${[it.ano, duracao(it)].filter(Boolean).map(esc).join(' · ')} ${B.rating(it.classificacao)}</p>
        ${ep ? `<p class="pl-w-ep">Ep. ${epIdx + 1}: ${esc(ep.titulo)}</p>` : ''}
        <p class="pl-w-desc">${esc((ep && ep.descricao) || it.descricao || '')}</p>
      </div>
      <div class="pl-top"><button class="pl-btn pl-back" data-a="sair" aria-label="Voltar à navegação">${I('back')}</button></div>
      <div class="pl-bottom">
        <div class="pl-bar-row">
          <div class="pl-bar" role="slider" aria-label="Progresso" tabindex="-1">
            <div class="pl-buf"></div><div class="pl-fill"></div><div class="pl-knob"></div><div class="pl-tip">0:00</div>
          </div>
          <span class="pl-rem">0:00</span>
        </div>
        <div class="pl-ctrls">
          <div class="pl-side">
            <button class="pl-btn" data-a="play" aria-label="Reproduzir">${I('play')}</button>
            <button class="pl-btn" data-a="rew" aria-label="Voltar 10 segundos">${I('rew10')}</button>
            <button class="pl-btn" data-a="fwd" aria-label="Avançar 10 segundos">${I('fwd10')}</button>
            <div class="pl-pop-wrap pl-vol">
              <button class="pl-btn" data-a="mute" aria-label="Volume">${I('volOn')}</button>
              <div class="pl-pop"><div class="pl-vtrack"><div class="pl-vfill"></div><div class="pl-vknob"></div></div></div>
            </div>
          </div>
          <div class="pl-name"><b>${esc(it.titulo)}</b>${ep ? `<span>Ep. ${epIdx + 1} ${esc(ep.titulo)}</span>` : ''}</div>
          <div class="pl-side r">
            ${temProx ? `<button class="pl-btn" data-a="next" aria-label="Próximo episódio">${I('next')}</button>` : ''}
            <div class="pl-pop-wrap pl-speed">
              <button class="pl-btn" data-a="speedmenu" aria-label="Velocidade de reprodução">${I('speed')}</button>
              <div class="pl-pop">
                <h4>Velocidade de reprodução</h4>
                <div class="pl-speeds">${VEL.map(s => `<button data-vel="${s}"><i></i><span>${s === 1 ? '1x (Normal)' : String(s).replace('.', ',') + 'x'}</span></button>`).join('')}</div>
              </div>
            </div>
            <button class="pl-btn" data-a="full" aria-label="Tela cheia">${I('full')}</button>
          </div>
        </div>
      </div>
      <div class="pl-end" hidden>
        <div class="pl-end-l">
          <small>Fim ❤</small>
          <h2>${esc(it.titulo)}</h2>
          <p>Obrigado por assistir. Cada segundo foi feito pensando em você.</p>
          <div class="pl-end-btns">
            <button class="btn-play sq" data-a="replay">${I('replay')}Assistir de novo</button>
            <button class="btn-play sq btn-more" data-a="sair">Voltar à navegação</button>
          </div>
        </div>
        ${prox ? `
        <button class="pl-nextcard" data-a="prox">
          <div class="pl-nc-media">${B.midia(prox, { video: false })}${B.tArt(prox)}<span class="pl-nc-play">${I('play')}</span></div>
          <div class="pl-nc-txt"><small>A seguir em <b class="pl-count">10</b>s</small><b>${esc(prox.titulo)}</b></div>
        </button>` : ''}
      </div>
      <div class="pl-msg" hidden>
        ${I('heart')}
        <h2>Esse vídeo ainda não chegou aqui</h2>
        <p>Coloque o arquivo em <code>${esc(src || 'videos/' + it.id + '.mp4')}</code> e recarregue a página.</p>
        <button class="btn-play sq" data-a="sair">Voltar</button>
      </div>`;
    player.hidden = false;
    player.className = 'player paused';
    document.body.classList.add('no-scroll');
    if (!document.fullscreenElement && player.requestFullscreen) player.requestFullscreen().catch(() => {});

    const v = player.querySelector('video');
    pl = { it, epIdx, ep, temProx, prox, v };
    const $p = s => player.querySelector(s);
    const bar = $p('.pl-bar'), fill = $p('.pl-fill'), knob = $p('.pl-knob'), buf = $p('.pl-buf'), tip = $p('.pl-tip'), rem = $p('.pl-rem');

    if (!v) { falhaPlayer(); return; }
    v.volume = vol; v.muted = mudo;
    v.addEventListener('error', falhaPlayer);
    v.addEventListener('loadedmetadata', () => {
      if (pr && (pr.ep == null ? null : pr.ep) === (ep ? epIdx : null) && pr.t > 3 && pr.t < v.duration * 0.95) {
        v.currentTime = pr.t;
        B.toast(`Continuando de ${fmt(pr.t)}`);
      }
      atualizarTempo();
    });
    const p = v.play();
    if (p && p.catch) p.catch(() => mostrarControles());

    let ultimo = 0;
    const salvar = () => { if (v.duration) salvarProg(it.id, ep ? epIdx : null, v.currentTime, v.duration); };
    function atualizarTempo() {
      const d = v.duration || 0, t = v.currentTime || 0, pc = d ? (t / d) * 100 : 0;
      fill.style.width = pc + '%';
      knob.style.left = pc + '%';
      rem.textContent = fmt(d - t);
      if (v.buffered.length && d) buf.style.width = (v.buffered.end(v.buffered.length - 1) / d) * 100 + '%';
    }
    v.addEventListener('timeupdate', () => {
      atualizarTempo();
      if (Date.now() - ultimo > 2000) { ultimo = Date.now(); salvar(); }
    });
    v.addEventListener('progress', atualizarTempo);
    v.addEventListener('play', () => { player.classList.remove('paused', 'watching'); setIcon('play', 'pause', 'Pausar'); clearTimeout(pauseT); mostrarControles(); });
    v.addEventListener('pause', () => {
      player.classList.add('paused'); setIcon('play', 'play', 'Reproduzir'); salvar(); mostrarControles();
      clearTimeout(pauseT);
      if (!v.ended) pauseT = setTimeout(() => player.classList.add('watching'), 5000);
    });
    v.addEventListener('waiting', () => player.classList.add('loading'));
    ['playing', 'canplay', 'seeked'].forEach(ev => v.addEventListener(ev, () => player.classList.remove('loading')));
    v.addEventListener('volumechange', atualizarVolume);
    v.addEventListener('ratechange', atualizarVel);
    v.addEventListener('ended', () => {
      if (temProx) { salvarProg(it.id, epIdx + 1, 2, 100); tocar(it, epIdx + 1); return; }
      salvarProg(it.id, null, 1, 1);
      mostrarFim();
    });
    player.classList.add('loading');

    // barra de progresso (clicar e arrastar)
    const posBar = e => { const r = bar.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };
    bar.addEventListener('pointermove', e => {
      const f = posBar(e);
      tip.textContent = fmt(f * (v.duration || 0));
      tip.style.left = f * 100 + '%';
    });
    bar.addEventListener('pointerdown', e => {
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      player.classList.add('scrubbing');
      const seek = ev => { if (v.duration) { v.currentTime = posBar(ev) * v.duration; atualizarTempo(); } };
      seek(e);
      const mv2 = ev => seek(ev);
      const up = () => { player.classList.remove('scrubbing'); bar.removeEventListener('pointermove', mv2); bar.removeEventListener('pointerup', up); salvar(); };
      bar.addEventListener('pointermove', mv2);
      bar.addEventListener('pointerup', up);
    });

    // volume (barra vertical)
    const vt = $p('.pl-vtrack');
    vt.addEventListener('pointerdown', e => {
      e.preventDefault();
      vt.setPointerCapture(e.pointerId);
      const set = ev => { const r = vt.getBoundingClientRect(); v.volume = Math.min(1, Math.max(0, (r.bottom - ev.clientY) / r.height)); v.muted = v.volume === 0; };
      set(e);
      const up = () => { vt.removeEventListener('pointermove', set); vt.removeEventListener('pointerup', up); };
      vt.addEventListener('pointermove', set);
      vt.addEventListener('pointerup', up);
    });
    atualizarVolume(); atualizarVel();
    mostrarControles();
  }

  function setIcon(a, nome, label) {
    const b = player.querySelector(`[data-a="${a}"]`);
    if (b) { b.innerHTML = I(nome); b.setAttribute('aria-label', label); }
  }
  function atualizarVolume() {
    if (!pl || !pl.v) return;
    const v = pl.v, n = v.muted ? 0 : v.volume;
    setIcon('mute', n === 0 ? 'volOff' : n < 0.5 ? 'volMid' : 'volOn', n === 0 ? 'Ativar som' : 'Desativar som');
    const f = player.querySelector('.pl-vfill'), k = player.querySelector('.pl-vknob');
    if (f) { f.style.height = n * 100 + '%'; k.style.bottom = n * 100 + '%'; }
    B.store.set('volume', v.volume); B.store.set('mudo', v.muted);
  }
  function atualizarVel() {
    if (!pl || !pl.v) return;
    player.querySelectorAll('[data-vel]').forEach(b => b.classList.toggle('on', +b.dataset.vel === pl.v.playbackRate));
  }
  function flash(nome) {
    const f = player.querySelector('.pl-flash');
    if (!f) return;
    f.innerHTML = I(nome);
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  }
  function falhaPlayer() {
    if (pl && pl.v) { pl.v.remove(); pl.v = null; }
    player.classList.remove('loading', 'paused');
    player.classList.add('erro');
    player.querySelector('.pl-msg').hidden = false;
  }
  function mostrarFim() {
    player.classList.add('fim');
    player.classList.remove('watching');
    const end = player.querySelector('.pl-end');
    end.hidden = false;
    if (document.fullscreenElement) {} // continua em tela cheia, como na Netflix
    const c = player.querySelector('.pl-count');
    if (c && pl.prox) {
      let n = 10;
      fimT = setInterval(() => { n--; c.textContent = n; if (n <= 0) { clearInterval(fimT); tocar(pl.prox); } }, 1000);
    }
  }
  function limparTimers() { clearTimeout(idleT); clearTimeout(pauseT); clearInterval(fimT); }
  function mostrarControles() {
    if (!pl) return;
    player.classList.remove('idle', 'watching');
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      if (pl && pl.v && !pl.v.paused && !player.querySelector('.pl-pop-wrap.open') && !player.classList.contains('scrubbing')) player.classList.add('idle');
    }, 3000);
    if (pl.v && pl.v.paused && !pl.v.ended) { clearTimeout(pauseT); pauseT = setTimeout(() => player.classList.add('watching'), 5000); }
  }
  function alternarPlay() {
    if (!pl || !pl.v) return;
    if (pl.v.paused) { pl.v.play(); flash('play'); } else { pl.v.pause(); flash('pause'); }
  }
  function pular(s) {
    if (!pl || !pl.v || !pl.v.duration) return;
    pl.v.currentTime = Math.min(pl.v.duration - 0.1, Math.max(0, pl.v.currentTime + s));
    flash(s < 0 ? 'rew10' : 'fwd10');
  }
  function telaCheia() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
    else if (pl && pl.v && pl.v.webkitEnterFullscreen) pl.v.webkitEnterFullscreen();
  }
  document.addEventListener('fullscreenchange', () => { if (!player.hidden) setIcon('full', document.fullscreenElement ? 'fullExit' : 'full', document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia'); });

  player.addEventListener('mousemove', mostrarControles);
  player.addEventListener('touchstart', mostrarControles, { passive: true });
  player.addEventListener('click', e => {
    if (!pl) return;
    const a = e.target.closest('[data-a]');
    const vel = e.target.closest('[data-vel]');
    if (vel) { pl.v.playbackRate = +vel.dataset.vel; return; }
    if (a) {
      const k = a.dataset.a;
      if (k === 'sair') fecharPlayer();
      else if (k === 'play') alternarPlay();
      else if (k === 'rew') pular(-10);
      else if (k === 'fwd') pular(10);
      else if (k === 'mute') { pl.v.muted = !pl.v.muted; if (!pl.v.muted && pl.v.volume === 0) pl.v.volume = 0.5; }
      else if (k === 'full') telaCheia();
      else if (k === 'next') tocar(pl.it, pl.epIdx + 1);
      else if (k === 'speedmenu') a.parentElement.classList.toggle('open');
      else if (k === 'replay') { clearInterval(fimT); tocar(pl.it, pl.epIdx); }
      else if (k === 'prox') { clearInterval(fimT); tocar(pl.prox); }
      return;
    }
    if (e.target.closest('.pl-bottom, .pl-top, .pl-end, .pl-msg')) return;
    player.querySelectorAll('.pl-pop-wrap.open').forEach(w => w.classList.remove('open'));
    if (player.classList.contains('watching')) { player.classList.remove('watching'); return; }
    alternarPlay();
  });
  player.addEventListener('dblclick', e => {
    if (e.target.closest('.pl-bottom, .pl-top, .pl-end, .pl-msg')) return;
    telaCheia();
    alternarPlay(); // desfaz o play/pause do segundo clique
  });
  if (canHover) {
    player.addEventListener('mouseover', e => { const w = e.target.closest('.pl-vol'); if (w) w.classList.add('open'); });
    player.addEventListener('mouseout', e => { const w = e.target.closest('.pl-vol'); if (w && !w.contains(e.relatedTarget)) w.classList.remove('open'); });
  }
  document.addEventListener('keydown', e => {
    if (player.hidden || !pl || !pl.v) return;
    const k = e.key.toLowerCase();
    const acoes = {
      ' ': alternarPlay, k: alternarPlay, arrowleft: () => pular(-10), arrowright: () => pular(10), j: () => pular(-10), l: () => pular(10),
      arrowup: () => { pl.v.muted = false; pl.v.volume = Math.min(1, pl.v.volume + 0.1); },
      arrowdown: () => { pl.v.volume = Math.max(0, pl.v.volume - 0.1); },
      m: () => { pl.v.muted = !pl.v.muted; }, f: telaCheia
    };
    if (acoes[k]) { e.preventDefault(); acoes[k](); mostrarControles(); }
  });

  function fecharPlayer() {
    if (pl && pl.v) {
      const v = pl.v;
      if (v.duration && !v.ended) salvarProg(pl.it.id, pl.ep ? pl.epIdx : null, v.currentTime, v.duration);
      v.pause(); v.removeAttribute('src'); v.load();
    }
    pl = null;
    player.hidden = true; player.innerHTML = ''; player.className = 'player';
    limparTimers();
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    if (modal.hidden) {
      document.body.classList.remove('no-scroll');
      if (['inicio', 'series', 'filmes'].includes(view) && !sInput.value) {
        const y = scrollY;
        renderRows(view === 'inicio' ? null : view === 'series' ? 'serie' : 'filme');
        scrollTo(0, y);
      }
      retomarHero();
    } else {
      // atualiza o botão "Continuar" do modal aberto
      const id = modal.querySelector('[data-play]') && modal.querySelector('[data-play]').dataset.play;
      if (id) abrirDetalhes(byId[id]);
    }
  }

  /* ---------------- início ---------------- */
  view = viewDoHash();
  render();
})();
