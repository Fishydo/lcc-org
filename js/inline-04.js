// ══ Mini Player ════════════════════════════════════════════════════════
  (() => {
    const mp      = document.getElementById('lcc-miniplayer');
    const mpArt   = document.getElementById('mp-art');
    const mpTrack = document.getElementById('mp-track');
    const mpArtist= document.getElementById('mp-artist');
    const mpPlay  = document.getElementById('mp-playpause');
    const mpPrev  = document.getElementById('mp-prev');
    const mpNext  = document.getElementById('mp-next');
    const mpFill  = document.getElementById('mp-prog-fill');
    const mpBar   = document.getElementById('mp-prog-bar');
    const mpDrag  = document.getElementById('mp-drag-handle');

    let dismissed = false;

    function isMPEnabled(){ try{ return localStorage.getItem('lcc_miniplayer')!=='0'; }catch(e){ return true; } }

    function show(){ if(!dismissed&&isMPEnabled()){ mp.classList.add('visible'); } }
    function hide(){ mp.classList.remove('visible'); }

    window._mpGoMusic = () => {
      if(window._lccRenderPage) window._lccRenderPage('music');
    };

    window.addEventListener('phantom-audio-update', e => {
      const d = e.detail;
      if(!d||!d.currentTrack) return;
      dismissed = false;
      mpTrack.textContent  = d.currentTrack.trackName  || 'Unknown';
      mpArtist.textContent = d.currentTrack.artistName || '—';
      const art = (d.currentTrack.artworkUrl100||'').replace('100x100','300x300');
      if(art) mpArt.src = art;
      mpPlay.textContent = d.isPlaying ? '⏸' : '▶';
      if(d.duration>0) mpFill.style.width = ((d.currentTime/d.duration)*100)+'%';
      show();
    });

    mpPlay.onclick  = () => { const ae=window.LCCAudioEngine; ae.state.isPlaying?ae.pause():ae.play(); };
    mpPrev.onclick  = () => window.LCCAudioEngine.prev();
    mpNext.onclick  = () => window.LCCAudioEngine.next();

    mpBar.addEventListener('click', e => {
      const ae=window.LCCAudioEngine;
      if(!ae.state.duration) return;
      const r=mpBar.getBoundingClientRect();
      ae.seek(((e.clientX-r.left)/r.width)*ae.state.duration);
    });

    const pos = JSON.parse(localStorage.getItem('lcc_mp_pos')||'null');
    if(pos){ mp.style.bottom='auto'; mp.style.right='auto'; mp.style.top=pos.top+'px'; mp.style.left=pos.left+'px'; }

    let drag=false, sx,sy,sl,st;
    mpDrag.addEventListener('mousedown', e=>{
      drag=true; const r=mp.getBoundingClientRect();
      sx=e.clientX; sy=e.clientY; sl=r.left; st=r.top;
      mp.style.transition='none'; e.preventDefault();
    });
    window.addEventListener('mousemove', e=>{
      if(!drag) return;
      let l=sl+(e.clientX-sx), t=st+(e.clientY-sy);
      l=Math.max(0,Math.min(l,innerWidth-mp.offsetWidth));
      t=Math.max(0,Math.min(t,innerHeight-mp.offsetHeight));
      mp.style.bottom='auto'; mp.style.right='auto'; mp.style.left=l+'px'; mp.style.top=t+'px';
    });
    window.addEventListener('mouseup', ()=>{
      if(!drag) return; drag=false; mp.style.transition='';
      const r=mp.getBoundingClientRect();
      localStorage.setItem('lcc_mp_pos',JSON.stringify({left:r.left,top:r.top}));
    });
  })();
