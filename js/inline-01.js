(() => {
    const fp = "Information on this screen can be visible to the school to help keep you secure and scholarly while you're online. Please reach out to the school for more information.";
    if ((document.body.innerText||'').includes(fp)) {
      document.body.innerHTML='<h1>Access blocked</h1><p>Not available here.</p>';
      return;
    }
  })();

  (() => {
    function hexRgb(h){h=h.replace('#','');return`${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;}

    const themeMap = {
      default: {
        label:'Default', accent:'#00bcd4', accent2:'#2196f3',
        text:'#f0f8ff', muted:'#cfd9ff',
        card:'rgba(255,255,255,0.05)', glassBg:'rgba(255,255,255,0.08)',
        glassBorder:'rgba(255,255,255,0.2)',
        background:'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(0,188,212,0.16), transparent 32%), #0d1b2a',
        shadow:'0 20px 80px rgba(0,0,0,0.35)', light:false,
        bgDark:'#0d1b2a',
        vanta:{highlight:0x00bcd4, mid:0x2196f3, low:0x0a2a40, base:0x030d18, blur:.88, speed:3.5, zoom:.30}
      },
      neon: {
        label:'Neon', accent:'#22d3ee', accent2:'#a855f7',
        text:'#e0f7ff', muted:'#c8e7ff',
        card:'rgba(255,255,255,0.07)', glassBg:'rgba(255,255,255,0.06)',
        glassBorder:'rgba(34,211,238,0.35)',
        background:'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.16), transparent 34%), radial-gradient(circle at 82% 10%, rgba(168,85,247,0.16), transparent 32%), #050814',
        shadow:'0 24px 80px rgba(34,211,238,0.28)', light:false,
        bgDark:'#050814',
        vanta:{highlight:0x22d3ee, mid:0xa855f7, low:0x150030, base:0x020407, blur:.80, speed:5.5, zoom:.25}
      },
      solar: {
        label:'Orange', accent:'#f97316', accent2:'#facc15',
        text:'#fff4e5', muted:'#ffd7a1',
        card:'rgba(255,255,255,0.08)', glassBg:'rgba(255,255,255,0.08)',
        glassBorder:'rgba(255,203,103,0.35)',
        background:'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.25), transparent 32%), radial-gradient(circle at 75% 60%, rgba(250,204,21,0.18), transparent 28%), #120900',
        shadow:'0 24px 80px rgba(249,115,22,0.35)', light:false,
        bgDark:'#120900',
        vanta:{highlight:0xf97316, mid:0xfacc15, low:0x4a1200, base:0x070200, blur:.85, speed:2.5, zoom:.35}
      },
      void: {
        label:'Purple', accent:'#94a3b8', accent2:'#c084fc',
        text:'#eef2ff', muted:'#cbd5ff',
        card:'rgba(255,255,255,0.07)', glassBg:'rgba(255,255,255,0.06)',
        glassBorder:'rgba(255,255,255,0.18)',
        background:'radial-gradient(circle at 48% 40%, rgba(120,130,255,0.14), transparent 46%), #050505',
        shadow:'0 24px 80px rgba(120,130,255,0.24)', light:false,
        bgDark:'#050505',
        vanta:{highlight:0xc084fc, mid:0x7478cc, low:0x12122a, base:0x020202, blur:.93, speed:1.5, zoom:.40}
      },
      twilight:{
        label:'Pink', accent:'#ff6fb1', accent2:'#6b9bff',
        text:'#ffe9f7', muted:'#ffd1ec',
        card:'rgba(255,255,255,0.09)', glassBg:'rgba(255,255,255,0.07)',
        glassBorder:'rgba(255,255,255,0.25)',
        background:'radial-gradient(circle at 20% 20%, rgba(255,111,177,0.2), transparent 30%), radial-gradient(circle at 80% 10%, rgba(107,155,255,0.2), transparent 28%), #0e0620',
        shadow:'0 24px 80px rgba(255,111,177,0.3)', light:false,
        bgDark:'#0e0620',
        vanta:{highlight:0xff6fb1, mid:0x6b9bff, low:0x2e0622, base:0x060110, blur:.87, speed:3.0, zoom:.28}
      },
      emerald: {
        label:'Emerald', accent:'#34d399', accent2:'#22c55e',
        text:'#e8fff3', muted:'#c9ffe3',
        card:'rgba(255,255,255,0.07)', glassBg:'rgba(255,255,255,0.07)',
        glassBorder:'rgba(52,211,153,0.3)',
        background:'radial-gradient(circle at 18% 22%, rgba(52,211,153,0.2), transparent 30%), radial-gradient(circle at 78% 16%, rgba(34,197,94,0.18), transparent 28%), #04130d',
        shadow:'0 24px 80px rgba(52,211,153,0.28)', light:false,
        bgDark:'#04130d',
        vanta:{highlight:0x34d399, mid:0x22c55e, low:0x022d14, base:0x010602, blur:.86, speed:4.0, zoom:.32}
      }
    };

    const content = document.getElementById('content'),
          nav     = document.getElementById('nav'),
          navLinks = [...document.querySelectorAll('nav a')];
    const canvas  = document.getElementById('background-canvas'),
          ctx     = canvas.getContext('2d');
    const preloader = document.getElementById('preloader'),
          cursor    = document.getElementById('cursor');
    const vantaBg      = document.getElementById('vanta-bg');
    const vantaCurtain = document.getElementById('vanta-curtain');
    const moviePlayer  = document.getElementById('movie-player'),
          movieIframe  = document.getElementById('movie-iframe'),
          movieLoading = document.getElementById('movie-loading'),
          closeBtn     = document.getElementById('close-player-btn');
    const tvModal      = document.getElementById('tv-modal'),
          tvModalTitle = document.getElementById('tv-modal-title'),
          tvSeason     = document.getElementById('tv-season'),
          tvEpisode    = document.getElementById('tv-episode'),
          tvPlayBtn    = document.getElementById('tv-play-btn'),
          tvCancelBtn  = document.getElementById('tv-cancel-btn');

    let mouseX = innerWidth/2, mouseY = innerHeight/2,
        particles = [], isLightTheme = false,
        currentTheme = 'default', typedText = '';
    let vantaInst = null, vantaOn = false, loadTimeout;
    let selectedShowId = null;

    const save = (k,v) => { try{localStorage.setItem(k,v)}catch(e){} };
    const load = (k,fb='') => { try{return localStorage.getItem(k)??fb}catch(e){return fb} };

    // ── Vanta ──────────────────────────────────────────────────────
    function initVanta(key) {
      if (vantaInst) return;
      if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') return;
      const t = themeMap[key] || themeMap.default;
      const v = t.vanta;
      vantaBg.style.display = 'block';
      document.body.style.background = 'transparent';
      vantaCurtain.style.background = t.background;
      vantaCurtain.style.display = 'block';
      vantaCurtain.style.opacity = '1';
      vantaCurtain.getBoundingClientRect();
      vantaInst = VANTA.FOG({
        el: vantaBg, THREE: THREE,
        mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200, minWidth: 200,
        highlightColor: v.highlight, midtoneColor: v.mid,
        lowlightColor: v.low, baseColor: v.base,
        blurFactor: v.blur, speed: v.speed, zoom: v.zoom
      });
      requestAnimationFrame(() => {
        vantaCurtain.style.opacity = '0';
        setTimeout(() => { vantaCurtain.style.display = 'none'; }, 2600);
      });
    }

    function updateVantaColors(key) {
      if (!vantaInst) return;
      const v = (themeMap[key] || themeMap.default).vanta;
      vantaInst.setOptions({
        highlightColor: v.highlight, midtoneColor: v.mid,
        lowlightColor: v.low, baseColor: v.base,
        blurFactor: v.blur, speed: v.speed, zoom: v.zoom
      });
    }

    function stopVanta() {
      if (vantaInst) { vantaInst.destroy(); vantaInst = null; }
      vantaBg.style.display = 'none';
      vantaCurtain.style.display = 'none';
      const t = themeMap[currentTheme] || themeMap.default;
      document.body.style.background = t.background;
    }

    function setVanta(on) {
      vantaOn = on;
      save('lcc_vanta', on ? '1' : '0');
      if (on) initVanta(currentTheme); else stopVanta();
    }

    // ── Theme ──────────────────────────────────────────────────────
    function applyTheme(key) {
      const t = themeMap[key] || themeMap.default;
      currentTheme = key;
      const r = document.documentElement.style;
      r.setProperty('--color-primary', t.accent);
      r.setProperty('--color-accent', t.accent2);
      r.setProperty('--text-light', t.text);
      r.setProperty('--text-muted', t.muted);
      r.setProperty('--card-bg', t.card);
      r.setProperty('--glass-bg', t.glassBg);
      r.setProperty('--glass-border', t.glassBorder);
      r.setProperty('--app-bg', t.background);
      r.setProperty('--shadow', t.shadow);
      r.setProperty('--bg-dark', t.bgDark);
      r.setProperty('--text-rgb', hexRgb(t.text));
      r.setProperty('--accent-rgb', hexRgb(t.accent));
      r.setProperty('--bg-dark-rgb', hexRgb(t.bgDark));
      document.body.style.background = vantaOn ? 'transparent' : t.background;
      document.body.classList.toggle('light-theme', !!t.light);
      isLightTheme = !!t.light;
      document.querySelectorAll('.theme-button').forEach(b =>
        b.classList.toggle('active', b.dataset.theme === key)
      );
      save('lcc_theme', key);
      if (vantaOn) updateVantaColors(key);
    }

    // ── Particles ──────────────────────────────────────────────────
    canvas.width = innerWidth; canvas.height = innerHeight;
    class Particle {
      constructor() {
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.size = Math.random()*3+1;
        this.sx = Math.random()*2-1;
        this.sy = Math.random()*2-1;
      }
      update() {
        this.x += this.sx; this.y += this.sy;
        if (this.size > .2) this.size -= .1;
        if (this.x<0||this.x>canvas.width) this.sx *= -1;
        if (this.y<0||this.y>canvas.height) this.sy *= -1;
        const dx = mouseX-this.x, dy = mouseY-this.y, d = Math.hypot(dx,dy);
        if (d < 100) { this.size += .2; this.sx += dx/900; this.sy += dy/900; }
      }
      draw() {
        ctx.fillStyle = isLightTheme ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.82)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
      }
    }
    function initParticles() { particles = []; for (let i=0;i<120;i++) particles.push(new Particle()); }
    function animateParticles() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        p.update(); p.draw();
        particles.forEach(p2 => {
          const d = Math.hypot(p.x-p2.x, p.y-p2.y);
          if (d < 100) {
            ctx.strokeStyle = isLightTheme ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.18)';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        });
        if (p.size <= .2) { particles.splice(particles.indexOf(p), 1); particles.push(new Particle()); }
      });
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => { if (vantaInst && vantaInst.resize) vantaInst.resize(); });
    window.addEventListener('scroll', () => content.classList.toggle('parallax', scrollY > 50));
    nav.addEventListener('mouseenter', () => nav.classList.add('active'));
    nav.addEventListener('mouseleave', () => nav.classList.remove('active'));
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 700);
      // Remove blackout if security is not active
      const bo = document.getElementById('sec-blackout');
      if (bo && load('lcc_security_on', '0') !== '1') {
        bo.classList.add('fade');
        setTimeout(() => bo.remove(), 200);
      }
    });

    // ── Player ─────────────────────────────────────────────────────
    function playMovie(id, provider) {
      const col = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim().replace('#','');
      movieIframe.src = provider === 2
        ? `https://www.vidking.net/embed/movie/${id}?color=${col}&autoPlay=true`
        : `https://vidrock.net/movie/${id}?autoplay=true&theme=${col}&download=true`;
      openPlayer();
    }

    function playTV(id, season, episode) {
      const col = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim().replace('#','');
      movieIframe.src = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=${col}&autoPlay=true&nextEpisode=true&episodeSelector=true`;
      openPlayer();
    }

    function openPlayer() {
      moviePlayer.classList.add('open');
      movieLoading.style.display = 'none';
      let ok = false;
      loadTimeout = setTimeout(() => { if (!ok) movieLoading.style.display = 'block'; }, 2000);
      movieIframe.onload = () => { ok = true; clearTimeout(loadTimeout); movieLoading.style.display = 'none'; };
    }

    function closePlayer() {
      moviePlayer.classList.remove('open');
      movieIframe.src = '';
      clearTimeout(loadTimeout);
      movieLoading.style.display = 'none';
    }
    closeBtn.addEventListener('click', closePlayer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && moviePlayer.classList.contains('open')) closePlayer(); });
    moviePlayer.addEventListener('click', e => { if (e.target === moviePlayer) closePlayer(); });

    // ── TV Modal ───────────────────────────────────────────────────
    tvCancelBtn.addEventListener('click', () => {
      tvModal.classList.remove('open');
      selectedShowId = null;
    });
    tvPlayBtn.addEventListener('click', () => {
      if (!selectedShowId) return;
      const s = Math.max(1, parseInt(tvSeason.value) || 1);
      const ep = Math.max(1, parseInt(tvEpisode.value) || 1);
      tvModal.classList.remove('open');
      playTV(selectedShowId, s, ep);
    });
    tvModal.addEventListener('click', e => {
      if (e.target === tvModal) { tvModal.classList.remove('open'); selectedShowId = null; }
    });

    // ── Security System ────────────────────────────────────────────
    const ORIGINAL_TITLE = document.title;

    function activateSecurity() {
      const overlay = document.getElementById('security-overlay');
      const iframe  = document.getElementById('security-iframe');
      const shield  = document.getElementById('security-shield');
      if (!overlay) return;
      if (iframe && !iframe.src.includes('Error_404')) {
        iframe.src = '/404.html';
        // Lift blackout once the 404 page is visible
        iframe.onload = () => {
          const bo = document.getElementById('sec-blackout');
          if (bo) bo.remove();
        };
      }
      document.title = 'Error 404 (Not Found)!!';
      overlay.classList.add('active');
      setTimeout(() => { if (shield) shield.focus(); }, 80);
    }

    // Deactivate for this session only — does NOT touch lcc_security_on
    function deactivateSecurity() {
      const overlay = document.getElementById('security-overlay');
      const iframe  = document.getElementById('security-iframe');
      if (!overlay) return;
      overlay.classList.remove('active');
      if (iframe) iframe.src = '';
      document.title = ORIGINAL_TITLE;
    }

    // Shield click always re-focuses so typing is captured
    document.addEventListener('click', e => {
      const shield = document.getElementById('security-shield');
      if (shield && e.target === shield) shield.focus();
    });

    // Anonymous keypress buffer — silently accumulate chars, unlock on exact match
    let _secBuf = '';
    document.addEventListener('keydown', e => {
      const overlay = document.getElementById('security-overlay');
      if (!overlay || !overlay.classList.contains('active')) return;
      if (e.key.length !== 1) return;
      _secBuf += e.key;
      const phrase = load('lcc_security_phrase', '');
      if (phrase && _secBuf.length > phrase.length * 3) {
        _secBuf = _secBuf.slice(-phrase.length * 3);
      }
      if ((phrase && _secBuf.endsWith(phrase)) || _secBuf.endsWith('LCC-G@MES')) {
        _secBuf = '';
        deactivateSecurity();
      }
    });

    // ── Pages ──────────────────────────────────────────────────────
    const pages = {
      home: `<section class="page"><h1>Welcome</h1><p>maybe a proxy</p></section>`,
      about: `<section class="page"><h1>Games</h1><p>Select a game to play:</p><button class="primary" data-game="2048">eagalercraft</button><button class="primary" data-game="itch">game hub</button></section>`,
      contact: `<section class="page"><h1>lcc ai</h1><div class="iframe-container"><iframe src="/ai" allowfullscreen></iframe><button class="fullscreen-button"></button></div></section>`,
      settings: `<section class="page">
        <h1>Settings</h1>
        <p>Pick a visual world. Themes apply instantly site-wide.</p>
        <div class="flex flex-wrap gap-2 mb-6" id="theme-buttons"></div>
        <div class="flex items-center justify-between max-w-md mb-4">
          <label class="toggle-label flex items-center gap-3 cursor-none select-none">
            <span class="font-medium text-base">Animated Fog</span>
            <div class="toggle-switch">
              <input type="checkbox" id="vanta-toggle" ${load('lcc_vanta','0')==='1' ? 'checked' : ''}>
              <span class="slider"></span>
            </div>
          </label>
        </div>
        <div class="flex items-center justify-between max-w-md mb-8">
          <label class="toggle-label flex items-center gap-3 cursor-none select-none">
            <span class="font-medium text-base">Mini Player</span>
            <div class="toggle-switch">
              <input type="checkbox" id="mp-toggle" ${load('lcc_miniplayer','1')==='0' ? '' : 'checked'}>
              <span class="slider"></span>
            </div>
          </label>
        </div>
        <div style="margin-top:28px;padding-top:24px;border-top:1px solid var(--glass-border)">
          <h2 style="font-size:1.15rem;margin-bottom:.3rem;color:var(--color-primary)">secure mode</h2>
          <p style="font-size:.85rem;margin-bottom:16px;color:var(--text-muted);line-height:1.55">
            When u enable this it will load into a fake 404 page every time you visit!
            and if you type ur password then it unlocks so yea.
          </p>
          <div style="display:flex;flex-direction:column;gap:14px;max-width:420px">
            <label class="toggle-label" style="display:flex;align-items:center;gap:12px;cursor:none;user-select:none;">
              <span style="font-size:.95rem;font-weight:600">Enable Security Mode</span>
              <div class="toggle-switch">
                <input type="checkbox" id="security-toggle">
                <span class="slider"></span>
              </div>
            </label>
            <input type="password" id="sec-phrase-set"
              placeholder="Type passphrase then press Enter to save…"
              style="display:none;width:100%;background:var(--card-bg);border:1px solid var(--glass-border);
                     color:var(--text-light);border-radius:10px;padding:11px 15px;
                     font-size:.95rem;outline:none;animation:none !important;transform:none !important;
                     transition:border-color .2s,box-shadow .2s;"
              autocomplete="off">
            <p id="sec-status" style="font-size:.82rem;color:var(--text-muted);margin:0;min-height:1.2em"></p>
          </div>
        </div>
      </section>`,
      apps: `<section class="page"><h1>apps,</h1><p>apps are a work in progress soon will be done by Lucas peck</p><button class="primary" data-jump="settings">settings</button><button class="primary" data-jump="movies">movies</button><button class="primary" data-jump="shows">tv shows</button><button class="primary" data-jump="youtube">youtube</button><button class="primary" data-jump="music">music</button></section>`,
      'proxy-embed': `<section class="page"><h1>Proxy</h1><div class="iframe-container"><iframe src="https://ahh-sh.pages.dev/" allowfullscreen></iframe><button class="fullscreen-button"></button></div></section>`,
      'game-2048': `<section class="page"><h1>eagalercraft 1.12.2</h1><div class="iframe-container"><iframe src="https://eagalercraftlcc.pages.dev/" allowfullscreen></iframe><button class="fullscreen-button"></button></div></section>`,
      'game-itch': `<section class="page"><h1>game hub *reload frame for menu</h1><div class="iframe-container"><iframe src="/g" allowfullscreen></iframe><button class="fullscreen-button"></button></div></section>`,

      music: `<section class="page">
        <header>
          <h1><span class="music-icon">♪</span> Music</h1>
        </header>
        <div class="music-search-box">
          <input id="music-search" placeholder="Search songs, artists..." autocomplete="off">
        </div>
        <div class="music-results" id="music-results"></div>
        <div class="music-layout">
          <div class="music-player-card">
            <div class="music-album-art" id="music-art">
              <span class="placeholder-icon">♪</span>
            </div>
            <div class="music-track-title" id="music-title">No track selected</div>
            <div class="music-track-artist" id="music-artist">Search for a song to play</div>
            <div class="music-controls">
              <button class="mc-btn" id="mc-shuffle" title="Shuffle">⇄</button>
              <button class="mc-btn" id="mc-prev" title="Previous"><span class="mc-step mc-prev-icon"></span></button>
              <button class="mc-btn mc-play" id="mc-play" title="Play"></button>
              <button class="mc-btn" id="mc-next" title="Next"><span class="mc-step mc-next-icon"></span></button>
              <button class="mc-btn" id="mc-like" title="Like">♡</button>
            </div>
            <div class="music-progress">
              <span class="music-time" id="mc-curr">0:00</span>
              <div class="music-prog-track" id="mc-prog-track">
                <div class="music-prog-fill" id="mc-prog-fill"></div>
                <div class="music-prog-thumb"></div>
              </div>
              <span class="music-time" id="mc-dur">0:00</span>
            </div>
            <div class="music-vol-row">
              <span style="color:var(--text-muted);font-size:.9rem;">🔈</span>
              <div class="music-vol-track" id="mc-vol-track"><div class="music-vol-fill" id="mc-vol-fill"></div></div>
              <span style="color:var(--text-muted);font-size:.9rem;">🔊</span>
            </div>
          </div>
          <div class="music-lyrics-card">
            <div class="music-lyrics-header">Lyrics</div>
            <div class="music-lyrics-body" id="mc-lyrics">
              <div class="lyric-line" style="color:var(--text-muted)">Play a song to see lyrics</div>
            </div>
          </div>
        </div>
        <div class="music-liked-box">
          <div class="music-liked-header">♥ Liked Songs</div>
          <div id="mc-liked-list"><div class="music-liked-empty">No liked songs yet</div></div>
        </div>
      </section>`,

      youtube: `<section class="page">
        <header>
          <h1><span class="yt-icon"></span> Watch</h1>
          <input id="yt-search" placeholder="Search YouTube..."/>
        </header>
        <div id="yt-empty" class="empty-state">
          <div class="empty-icon">🎬</div><span>Nothing found</span>
        </div>
        <div id="yt-grid" class="yt-grid"></div>
      </section>`,

      movies: `<section class="page">
        <header>
          <h1><span class="film-icon"></span> Movie Explorer</h1>
          <div class="provider-row">
            <span class="provider-label">Provider:</span>
            <select class="provider-select" id="provider-select">
              <option value="1">VidRock</option>
              <option value="2">VidKing</option>
            </select>
          </div>
          <input id="search" placeholder="Search movies..."/>
        </header>
        <div id="empty" class="empty-state">
          <div class="empty-icon">🎬</div>
          <span>No movies found</span>
        </div>
        <div id="grid" class="grid"></div>
      </section>`,

      shows: `<section class="page">
        <header>
          <h1><span class="tv-icon"><span class="screen-dot"></span></span> TV Shows</h1>
          <div class="provider-row">
            <span class="provider-label">Provider:</span>
            <select class="provider-select" id="provider-select">
              <option value="vidking">VidKing</option>
            </select>
          </div>
          <input id="search" placeholder="Search TV shows..."/>
        </header>
        <div id="empty" class="empty-state">
          <div class="empty-icon">📺</div>
          <span>No shows found</span>
        </div>
        <div id="grid" class="grid"></div>
      </section>`
    };

    function toggleFullscreen(ifr, btn) {
      if (!document.fullscreenElement) {
        ifr.requestFullscreen().then(() => btn.classList.add('fullscreen')).catch(console.error);
      } else {
        document.exitFullscreen().then(() => btn.classList.remove('fullscreen')).catch(console.error);
      }
    }

    function renderPage(page) {
      preloader.classList.remove('hidden');
      setTimeout(() => {
        content.innerHTML = pages[page] || `<section class="page"><h1>Page not found</h1></section>`;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === page));
        content.querySelectorAll('button[data-jump]').forEach(b =>
          b.addEventListener('click', () => renderPage(b.getAttribute('data-jump')))
        );
        if (page === 'about') {
          content.querySelectorAll('button[data-game]').forEach(b =>
            b.addEventListener('click', () => renderPage('game-' + b.getAttribute('data-game')))
          );
        }
        const fsBtns = content.querySelectorAll('.fullscreen-button');
        fsBtns.forEach(b => {
          const i = b.closest('.iframe-container').querySelector('iframe');
          b.addEventListener('click', () => toggleFullscreen(i, b));
        });
        document.addEventListener('fullscreenchange', () => {
          fsBtns.forEach(b => {
            const i = b.closest('.iframe-container').querySelector('iframe');
            b.classList.toggle('fullscreen', document.fullscreenElement === i);
          });
        });
        if (page === 'settings') {
          initThemeLab();
          const toggle = document.getElementById('vanta-toggle');
          if (toggle) {
            toggle.checked = (load('lcc_vanta', '0') === '1');
            toggle.addEventListener('change', () => { setVanta(toggle.checked); });
          }
          const mpToggle = document.getElementById('mp-toggle');
          if (mpToggle) {
            mpToggle.addEventListener('change', () => {
              save('lcc_miniplayer', mpToggle.checked ? '1' : '0');
              const mp = document.getElementById('lcc-miniplayer');
              if (mp) { if (!mpToggle.checked) mp.classList.remove('visible'); }
            });
          }

          // ── Security section ──────────────────────────────────
          const secToggle    = document.getElementById('security-toggle');
          const secPhraseSet = document.getElementById('sec-phrase-set');
          const secStatus    = document.getElementById('sec-status');
          if (secToggle && secPhraseSet && secStatus) {
            const isOn = load('lcc_security_on', '0') === '1';
            secToggle.checked = isOn;
            // Show input if already enabled (so user can change phrase)
            if (isOn) {
              secPhraseSet.style.display = 'block';
              secStatus.textContent = '\uD83D\uDD12 Active — will lock on every page load';
            }

            secToggle.addEventListener('change', () => {
              if (secToggle.checked) {
                // Show the input box — nothing else yet
                secPhraseSet.style.display = 'block';
                secPhraseSet.value = '';
                secPhraseSet.focus();
                secStatus.textContent = 'Type a passphrase and press Enter to activate';
                secStatus.style.color = 'var(--text-muted)';
              } else {
                // Disable security permanently
                save('lcc_security_on', '0');
                save('lcc_security_phrase', '');
                secPhraseSet.style.display = 'none';
                secPhraseSet.value = '';
                secStatus.textContent = '\uD83D\uDD13 Security mode off';
                secStatus.style.color = '';
              }
            });

            // Enter on the passphrase input → save and confirm
            secPhraseSet.addEventListener('keydown', e => {
              if (e.key !== 'Enter') return;
              const phrase = secPhraseSet.value;
              if (!phrase) {
                secStatus.textContent = '\u26A0\uFE0F Passphrase cannot be empty';
                secStatus.style.color = '#f97316';
                return;
              }
              save('lcc_security_phrase', phrase);
              save('lcc_security_on', '1');
              secPhraseSet.value = '';
              secPhraseSet.style.display = 'none';
              secStatus.textContent = '\uD83D\uDD12 Active — will lock on every page load';
              secStatus.style.color = '';
            });

            // Focus styling
            secPhraseSet.addEventListener('focus', () => {
              secPhraseSet.style.borderColor = 'var(--color-primary)';
              secPhraseSet.style.boxShadow = '0 0 14px rgba(0,188,212,.25)';
            });
            secPhraseSet.addEventListener('blur', () => {
              secPhraseSet.style.borderColor = '';
              secPhraseSet.style.boxShadow = '';
            });
          }
        }

        // ── Movies page logic ─────────────────────────────────────
        if (page === 'movies') {
          const TK = '6e0a79b37b1ee23b84288219c061924b',
                IM = 'https://image.tmdb.org/t/p/w500';
          const gr  = document.getElementById('grid'),
                si  = document.getElementById('search'),
                em  = document.getElementById('empty'),
                ps  = document.getElementById('provider-select');

          async function loadPopular() {
            gr.innerHTML = ''; em.classList.remove('show');
            try {
              const r = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TK}`);
              render((await r.json()).results);
            } catch(e) { em.classList.add('show'); }
          }
          async function doSearch(q) {
            if (!q) return loadPopular();
            gr.innerHTML = ''; em.classList.remove('show');
            try {
              const r = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TK}&query=${encodeURIComponent(q)}`);
              render((await r.json()).results);
            } catch(e) { em.classList.add('show'); }
          }
          function render(movies) {
            gr.innerHTML = '';
            const v = movies.filter(m => m.poster_path);
            if (!v.length) { em.classList.add('show'); return; }
            em.classList.remove('show');
            v.forEach((m, i) => {
              const c = document.createElement('div');
              c.className = 'movie-card';
              c.style.animationDelay = `${i * .05}s`;
              c.innerHTML = `<img src="${IM + m.poster_path}" alt="${m.title}" loading="lazy"><h3>${m.title}</h3>`;
              c.onclick = () => playMovie(m.id, parseInt(ps.value));
              gr.appendChild(c);
            });
          }
          let st;
          si.addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => doSearch(e.target.value.trim()), 300); });
          loadPopular();
        }

        // ── TV Shows page logic ───────────────────────────────────
        if (page === 'shows') {
          const TK = '6e0a79b37b1ee23b84288219c061924b',
                IM = 'https://image.tmdb.org/t/p/w500';
          const gr = document.getElementById('grid'),
                si = document.getElementById('search'),
                em = document.getElementById('empty');

          async function loadPopular() {
            gr.innerHTML = ''; em.classList.remove('show');
            try {
              const r = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${TK}`);
              render((await r.json()).results);
            } catch(e) { em.classList.add('show'); }
          }
          async function doSearch(q) {
            if (!q) return loadPopular();
            gr.innerHTML = ''; em.classList.remove('show');
            try {
              const r = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TK}&query=${encodeURIComponent(q)}`);
              render((await r.json()).results);
            } catch(e) { em.classList.add('show'); }
          }
          function render(shows) {
            gr.innerHTML = '';
            const v = shows.filter(s => s.poster_path);
            if (!v.length) { em.classList.add('show'); return; }
            em.classList.remove('show');
            v.forEach((s, i) => {
              const c = document.createElement('div');
              c.className = 'movie-card';
              c.style.animationDelay = `${i * .05}s`;
              const title = s.name || 'Untitled';
              c.innerHTML = `
                <span class="media-badge">📺</span>
                <img src="${IM + s.poster_path}" alt="${title}" loading="lazy">
                <h3>${title}</h3>
              `;
              c.onclick = () => {
                selectedShowId = s.id;
                tvModalTitle.textContent = title;
                tvSeason.value = 1;
                tvEpisode.value = 1;
                tvModal.classList.add('open');
              };
              gr.appendChild(c);
            });
          }
          let st;
          si.addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => doSearch(e.target.value.trim()), 300); });
          loadPopular();
        }

        // ── YouTube page logic ────────────────────────────────────
        if (page === 'youtube') {
          const YT_SEARCH = 'https://lcc-yt.catboxfat.workers.dev/';
          const gr = document.getElementById('yt-grid'),
                si = document.getElementById('yt-search'),
                em = document.getElementById('yt-empty');

          const sentinel = document.createElement('div');
          sentinel.id = 'yt-sentinel';
          sentinel.style.cssText = 'height:60px;width:100%;display:flex;align-items:center;justify-content:center;';
          gr.parentNode.appendChild(sentinel);

          let allVideos = [];
          let rendered  = 0;
          let loading   = false;
          let nextPageToken = null;
          let currentQuery  = 'trending';
          const BATCH = 12;

          function appendSkeletons(n = BATCH) {
            for (let i = 0; i < n; i++) {
              const sk = document.createElement('div');
              sk.className = 'yt-skel yt-skel-loading';
              sk.innerHTML = `
                <div class="skeleton skel-thumb"></div>
                <div class="skeleton skel-line"></div>
                <div class="skeleton skel-line short"></div>`;
              gr.appendChild(sk);
            }
          }

          function removeSkeletons() {
            gr.querySelectorAll('.yt-skel-loading').forEach(s => s.remove());
          }

          function makeCard(item, idx) {
            const vId   = item.id?.videoId || item.id;
            const title = item.snippet.title;
            const chan  = item.snippet.channelTitle;
            const thumb = item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '';
            const card  = document.createElement('div');
            card.className = 'yt-card';
            card.style.animationDelay = `${(idx % BATCH) * .04}s`;
            card.innerHTML = `
              <img class="yt-thumb" src="${thumb}" loading="lazy" alt="${title}"
                   onerror="this.style.background='rgba(255,255,255,.05)'">
              <div class="yt-info">
                <div class="yt-title">${title}</div>
                <div class="yt-meta">${chan}</div>
              </div>`;
            card.onclick = () => {
              movieIframe.src = `https://www.youtube-nocookie.com/embed/${vId}?autoplay=1`;
              openPlayer();
            };
            return card;
          }

          function renderBatch() {
            if (loading) return;
            const slice = allVideos.slice(rendered, rendered + BATCH);
            if (!slice.length) {
              if (nextPageToken) fetchMore();
              return;
            }
            slice.forEach((item, i) => gr.appendChild(makeCard(item, rendered + i)));
            rendered += slice.length;
          }

          async function fetchMore() {
            if (loading || !nextPageToken) return;
            loading = true;
            appendSkeletons(6);
            try {
              let url = YT_SEARCH + '?q=' + encodeURIComponent(currentQuery);
              if (nextPageToken) url += '&pageToken=' + encodeURIComponent(nextPageToken);
              const res  = await fetch(url);
              const data = await res.json();
              const items = data.data?.items || [];
              nextPageToken = data.data?.nextPageToken || null;
              removeSkeletons();
              const start = allVideos.length;
              allVideos.push(...items);
              items.forEach((item, i) => gr.appendChild(makeCard(item, start + i)));
              rendered = allVideos.length;
            } catch(_) { removeSkeletons(); }
            loading = false;
          }

          async function searchYT(query, fresh = true) {
            if (fresh) {
              loading = false;
              allVideos = []; rendered = 0; nextPageToken = null;
              currentQuery = query;
              gr.innerHTML = ''; em.classList.remove('show');
              appendSkeletons(BATCH);
            }

            const cacheKey = 'lcc_yt_' + query.toLowerCase().replace(/\s/g,'_');
            if (query === 'trending' && fresh) {
              try {
                const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
                if (cached && Date.now() - cached.ts < 172800000) {
                  removeSkeletons();
                  allVideos = cached.items;
                  nextPageToken = cached.nextPageToken || null;
                  if (!allVideos.length) { em.classList.add('show'); return; }
                  renderBatch();
                  return;
                }
              } catch(_) {}
            }

            try {
              const res  = await fetch(YT_SEARCH + '?q=' + encodeURIComponent(query));
              const data = await res.json();
              const items = data.data?.items || [];
              nextPageToken = data.data?.nextPageToken || null;
              removeSkeletons();
              if (query === 'trending' && items.length)
                localStorage.setItem(cacheKey, JSON.stringify({ts: Date.now(), items, nextPageToken}));
              if (!items.length) { em.classList.add('show'); return; }
              allVideos = items;
              renderBatch();
            } catch(e) {
              removeSkeletons();
              gr.innerHTML = '<p style="padding:24px;color:var(--text-muted)">Failed to load. Try again.</p>';
            }
          }

          const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
              if (rendered < allVideos.length) renderBatch();
              else if (nextPageToken) fetchMore();
            }
          }, { rootMargin: '200px' });
          observer.observe(sentinel);

          let ytSt;
          si.addEventListener('input', e => {
            clearTimeout(ytSt);
            const q = e.target.value.trim();
            ytSt = setTimeout(() => searchYT(q || 'trending'), 350);
          });
          si.addEventListener('keypress', e => {
            if (e.key === 'Enter') { clearTimeout(ytSt); searchYT(si.value.trim() || 'trending'); }
          });

          searchYT('trending');
        }

        // ── Music page logic ──────────────────────────────────────
        if (page === 'music') {
          const ae = window.LCCAudioEngine;
          const si  = document.getElementById('music-search'),
                res = document.getElementById('music-results'),
                art = document.getElementById('music-art'),
                ttl = document.getElementById('music-title'),
                art2= document.getElementById('music-artist'),
                playBtn = document.getElementById('mc-play'),
                prevBtn = document.getElementById('mc-prev'),
                nextBtn = document.getElementById('mc-next'),
                likeBtn = document.getElementById('mc-like'),
                shufBtn = document.getElementById('mc-shuffle'),
                prog    = document.getElementById('mc-prog-fill'),
                progTr  = document.getElementById('mc-prog-track'),
                curr    = document.getElementById('mc-curr'),
                dur     = document.getElementById('mc-dur'),
                volTr   = document.getElementById('mc-vol-track'),
                volFill = document.getElementById('mc-vol-fill'),
                lyrics  = document.getElementById('mc-lyrics');

          const fmt = s => isNaN(s)?'0:00':`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
          let favs = JSON.parse(localStorage.getItem('lcc_music_favs')||'[]');
          let lastLyricScroll = 0;

          function syncUI(d) {
            if (!d||!ttl) return;
            if (d.currentTrack) {
              ttl.textContent  = d.currentTrack.trackName  || 'Unknown';
              art2.textContent = d.currentTrack.artistName || '—';
              const url = (d.currentTrack.artworkUrl100||'').replace('100x100','600x600');
              art.innerHTML = url ? `<img src="${url}" alt="" style="width:100%;height:100%;object-fit:cover;">` : '<span class="placeholder-icon">♪</span>';
              updateLikeBtn(d.currentTrack);
            }
            playBtn.classList.toggle('paused', d.isPlaying);
            shufBtn.classList.toggle('active', d.shuffleMode);
            if(d.duration>0){
              prog.style.width = ((d.currentTime/d.duration)*100)+'%';
              curr.textContent = fmt(d.currentTime);
              dur.textContent  = fmt(d.duration);
              syncLyrics(d.currentTime);
            }
            volFill.style.width = ae.state.volume + '%';
          }

          function renderLikedBox() {
            const list = document.getElementById('mc-liked-list');
            if (!list) return;
            if (!favs.length) { list.innerHTML = '<div class="music-liked-empty">No liked songs yet</div>'; return; }
            list.innerHTML = favs.map((f,i) => `
              <div class="music-liked-item" data-i="${i}">
                <img src="${(f.artworkUrl100||'').replace('100x100','150x150')}" onerror="this.style.display='none'">
                <div class="mli-info">
                  <div class="mli-title">${f.trackName||''}</div>
                  <div class="mli-artist">${f.artistName||''}</div>
                </div>
                <button class="mli-remove" data-i="${i}" title="Remove">✕</button>
              </div>`).join('');
            list.querySelectorAll('.music-liked-item').forEach(el => {
              el.addEventListener('click', e => {
                if (e.target.classList.contains('mli-remove')) return;
                const f = favs[+el.dataset.i];
                if (f) ae.play(f, favs);
              });
            });
            list.querySelectorAll('.mli-remove').forEach(btn => {
              btn.addEventListener('click', e => {
                e.stopPropagation();
                favs.splice(+btn.dataset.i, 1);
                localStorage.setItem('lcc_music_favs', JSON.stringify(favs));
                updateLikeBtn(ae.state.currentTrack);
                renderLikedBox();
              });
            });
          }

          function updateLikeBtn(track) {
            if (!track||!likeBtn) return;
            const isLiked = favs.some(f=>f.trackName===track.trackName&&f.artistName===track.artistName);
            likeBtn.textContent = isLiked ? '♥' : '♡';
            likeBtn.classList.toggle('liked', isLiked);
          }

          playBtn.onclick = () => ae.state.isPlaying ? ae.pause() : ae.play();
          prevBtn.onclick = () => ae.prev();
          nextBtn.onclick = () => ae.next();
          shufBtn.onclick = () => ae.toggleShuffle();
          likeBtn.onclick = () => {
            if (!ae.state.currentTrack) return;
            const t = ae.state.currentTrack;
            const idx = favs.findIndex(f=>f.trackName===t.trackName&&f.artistName===t.artistName);
            if (idx>=0) favs.splice(idx,1); else favs.push(t);
            localStorage.setItem('lcc_music_favs', JSON.stringify(favs));
            updateLikeBtn(t);
            renderLikedBox();
          };

          progTr.addEventListener('click', e => {
            if (!ae.state.duration) return;
            const r = progTr.getBoundingClientRect();
            ae.seek(((e.clientX-r.left)/r.width)*ae.state.duration);
          });

          volTr.addEventListener('click', e => {
            const r = volTr.getBoundingClientRect();
            const v = Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100);
            ae.setVolume(v); volFill.style.width=v+'%';
          });

          let sT;
          si.addEventListener('input', e => {
            clearTimeout(sT);
            const q = e.target.value.trim();
            if (q.length < 2) { res.classList.remove('show'); return; }
            sT = setTimeout(() => doMusicSearch(q), 350);
          });
          si.addEventListener('keypress', e => {
            if (e.key==='Enter' && si.value.trim().length>1) { clearTimeout(sT); doMusicSearch(si.value.trim()); }
          });
          document.addEventListener('click', e => {
            if (!si.contains(e.target)&&!res.contains(e.target)) res.classList.remove('show');
          }, {once:false});

          let searchItems = [];
          async function doMusicSearch(q) {
            res.innerHTML = '<div class="music-result-item" style="color:var(--text-muted)">Searching...</div>';
            res.classList.add('show');
            try {
              const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20`);
              const d = await r.json();
              searchItems = d.results||[];
              renderResults();
            } catch(e) {
              res.innerHTML='<div class="music-result-item" style="color:var(--text-muted)">Search failed</div>';
            }
          }

          function renderResults() {
            res.innerHTML = searchItems.slice(0,20).map((item,i)=>`
              <div class="music-result-item" data-idx="${i}">
                <img src="${(item.artworkUrl100||'').replace('100x100','150x150')}" onerror="this.style.display='none'">
                <div>
                  <div class="music-result-title">${item.trackName||''}</div>
                  <div class="music-result-artist">${item.artistName||''}</div>
                </div>
              </div>`).join('');
            res.classList.add('show');
            res.querySelectorAll('.music-result-item').forEach(el => {
              el.addEventListener('click', () => {
                const item = searchItems[+el.dataset.idx];
                if (!item) return;
                const track = {trackName:item.trackName, artistName:item.artistName, artworkUrl100:item.artworkUrl100||'', previewUrl:item.previewUrl||''};
                const playlist = searchItems.map(i=>({trackName:i.trackName,artistName:i.artistName,artworkUrl100:i.artworkUrl100||'',previewUrl:i.previewUrl||''}));
                ae.play(track, playlist);
                res.classList.remove('show');
                si.value = '';
              });
            });
          }

          let lyricLines = [], lastActive = null;
          async function fetchLyrics(artist, title) {
            lyrics.innerHTML = '<div class="lyric-line" style="color:var(--text-muted)">Loading...</div>';
            lyricLines = []; lastActive = null;
            try {
              const r = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`);
              const d = await r.json();
              if (d.syncedLyrics) {
                lyricLines = parseLRC(d.syncedLyrics);
                renderLyrics();
              } else if (d.plainLyrics) {
                lyrics.innerHTML = d.plainLyrics.split('\n').map(l=>`<div class="lyric-line">${l||'&nbsp;'}</div>`).join('');
              } else {
                lyrics.innerHTML = '<div class="lyric-line" style="color:var(--text-muted)">No lyrics found</div>';
              }
            } catch(e) {
              lyrics.innerHTML = '<div class="lyric-line" style="color:var(--text-muted)">Lyrics unavailable</div>';
            }
          }
          function parseLRC(lrc) {
            const lines=[]; const rx=/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g; let m;
            while((m=rx.exec(lrc))!==null) lines.push({time:+m[1]*60+ +m[2]+ +m[3].padEnd(3,'0')/1000, text:m[4].trim()});
            return lines;
          }
          function renderLyrics() {
            lyrics.innerHTML = lyricLines.map((l,i)=>
              `<div class="lyric-line" data-t="${l.time}" data-i="${i}">${l.text||'♪'}</div>`
            ).join('');
          }
          function syncLyrics(ct) {
            if (!lyricLines.length) return;
            let ai=-1;
            lyricLines.forEach((l,i)=>{ if(ct>=l.time) ai=i; });
            if (ai<0) return;
            const els=lyrics.querySelectorAll('.lyric-line[data-t]');
            const active=els[ai];
            if (!active||active===lastActive) return;
            els.forEach((el,i)=>{ el.classList.remove('active','past'); if(i<ai) el.classList.add('past'); });
            active.classList.add('active'); lastActive=active;
            if (Date.now()-lastLyricScroll>3000) active.scrollIntoView({behavior:'smooth',block:'center'});
          }
          lyrics.addEventListener('wheel',()=>lastLyricScroll=Date.now(),{passive:true});
          lyrics.addEventListener('touchstart',()=>lastLyricScroll=Date.now(),{passive:true});

          let prevTrackName = '';
          const onAEUpdate = e => {
            const d = e.detail;
            syncUI(d);
            if (d.currentTrack && d.currentTrack.trackName !== prevTrackName) {
              prevTrackName = d.currentTrack.trackName;
              fetchLyrics(d.currentTrack.artistName, d.currentTrack.trackName);
            }
          };
          window.addEventListener('phantom-audio-update', onAEUpdate);

          const origRender = window._lccRenderPage;
          window._lccRenderPage = (pg) => {
            window.removeEventListener('phantom-audio-update', onAEUpdate);
            window._lccRenderPage = origRender;
            origRender(pg);
          };

          syncUI(ae.state);
          if (ae.state.currentTrack) {
            prevTrackName = ae.state.currentTrack.trackName;
            fetchLyrics(ae.state.currentTrack.artistName, ae.state.currentTrack.trackName);
          }
          volFill.style.width = ae.state.volume + '%';
          renderLikedBox();
        }

        preloader.classList.add('hidden');
      }, 300);
    }

    navLinks.forEach(l => l.addEventListener('click', e => {
      e.preventDefault(); typedText = ''; renderPage(l.dataset.page);
    }));

    window._lccRenderPage = renderPage;

    document.addEventListener('keydown', e => {
      if (content.innerHTML.includes('maybe a proxy')) {
        typedText += e.key.toLowerCase();
        if (typedText.includes('proxy')) { renderPage('proxy-embed'); typedText = ''; }
      } else typedText = '';
    });

    function initThemeLab() {
      const w = document.getElementById('theme-buttons');
      if (!w) return;
      w.innerHTML = '';
      Object.keys(themeMap).forEach(k => {
        const t = themeMap[k], b = document.createElement('button');
        b.className = 'theme-button';
        b.dataset.theme = k;
        b.innerHTML = `<span class="color-dot" style="background:${t.accent}"></span>${t.label}`;
        b.onclick = () => applyTheme(k);
        if (k === currentTheme) b.classList.add('active');
        w.appendChild(b);
      });
    }

    // ── Cursor ─────────────────────────────────────────────────────
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.querySelector('.dot').style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
    });
    window.addEventListener('mousedown', () => document.body.classList.add('hovered'));
    window.addEventListener('mouseup', () => document.body.classList.remove('hovered'));
    document.addEventListener('mouseover', e => {
      if (e.target.tagName === 'IFRAME' || e.target.classList.contains('fullscreen-button')) cursor.classList.add('hidden');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.tagName === 'IFRAME' || e.target.classList.contains('fullscreen-button')) cursor.classList.remove('hidden');
    });

    // ── Boot ───────────────────────────────────────────────────────
    const savedTheme = load('lcc_theme', 'default');
    applyTheme(savedTheme);
    renderPage('home');
    if (load('lcc_vanta', '0') === '1') { vantaOn = true; initVanta(savedTheme); }

    // Security boot check
    if (load('lcc_security_on', '0') === '1') {
      setTimeout(activateSecurity, 80);
    }
  })();
