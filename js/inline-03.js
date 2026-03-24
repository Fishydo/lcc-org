// ══ PiP Player ════════════════════════════════════════════════════════
  (() => {
    let pipWin = null;

    function getCSSVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function buildPiPStyles(pw) {
      const primary = getCSSVar('--color-primary') || '#00bcd4';
      const accent  = getCSSVar('--color-accent')  || '#2196f3';
      const cardBg  = getCSSVar('--card-bg')        || 'rgba(255,255,255,0.05)';
      const glassBg = getCSSVar('--glass-bg')       || 'rgba(255,255,255,0.08)';
      const glassBorder = getCSSVar('--glass-border') || 'rgba(255,255,255,0.2)';
      const textLight = getCSSVar('--text-light')   || '#f0f8ff';
      const textMuted = getCSSVar('--text-muted')   || '#cfd9ff';

      const s = pw.document.createElement('style');
      s.textContent = `
        *{margin:0;padding:0;box-sizing:border-box;user-select:none;}
        body{
          font-family:'Segoe UI','Inter',system-ui,sans-serif;
          background:#0d1b2a;
          color:${textLight};
          overflow:hidden;
          height:100vh;
        }
        .pip-wrap{
          width:100%;height:100vh;
          display:flex;flex-direction:column;
          background:radial-gradient(circle at 20% 20%,rgba(33,150,243,.18),transparent 50%),
                      radial-gradient(circle at 80% 80%,rgba(0,188,212,.14),transparent 40%),
                      #0d1b2a;
        }
        .pip-body{
          flex:1;display:flex;align-items:center;gap:12px;
          padding:14px 14px 8px;
        }
        .pip-art{
          width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0;
          background:${glassBg};border:1px solid ${glassBorder};
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;font-size:1.6rem;
        }
        .pip-art img{width:100%;height:100%;object-fit:cover;border-radius:10px;}
        .pip-info{flex:1;min-width:0;}
        .pip-track{
          font-size:.85rem;font-weight:700;color:${textLight};
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .pip-artist{
          font-size:.73rem;color:${textMuted};margin-top:2px;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .pip-prog-wrap{padding:0 14px 6px;}
        .pip-prog-bar{
          width:100%;height:3px;
          background:rgba(255,255,255,.12);
          border-radius:999px;cursor:pointer;position:relative;overflow:visible;
        }
        .pip-prog-fill{
          height:100%;border-radius:999px;
          background:linear-gradient(90deg,${primary},${accent});
          width:0%;transition:width .1s linear;pointer-events:none;
        }
        .pip-time{
          display:flex;justify-content:space-between;
          margin-top:5px;font-size:.68rem;color:${textMuted};
        }
        .pip-ctrls{
          display:flex;align-items:center;justify-content:center;
          gap:4px;padding:0 14px 14px;
        }
        .pip-btn{
          background:none;border:none;color:${textMuted};
          font-size:1rem;padding:7px 10px;border-radius:10px;
          cursor:pointer;transition:color .15s,background .15s,transform .15s;
          line-height:1;display:inline-flex;align-items:center;justify-content:center;
        }
        .pip-btn:hover{color:${textLight};background:rgba(255,255,255,.08);}
        .pip-play{
          width:44px;height:44px;border-radius:50%;padding:0;
          background:linear-gradient(135deg,${primary},${accent});
          color:#0b1020;font-size:0;position:relative;
          box-shadow:0 6px 20px rgba(0,0,0,.35);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;border:none;
          transition:transform .2s,box-shadow .2s;
        }
        .pip-play::after{
          content:'';display:block;
          border-style:solid;border-width:8px 0 8px 14px;
          border-color:transparent transparent transparent #0b1020;
          margin-left:3px;
        }
        .pip-play.playing::after{display:none;}
        .pip-play.playing::before{
          content:'';display:block;
          width:14px;height:16px;
          border-left:4px solid #0b1020;
          border-right:4px solid #0b1020;
          box-sizing:border-box;
        }
        .pip-play:hover{transform:scale(1.08);box-shadow:0 10px 28px rgba(0,0,0,.45);}
        .pip-shuf.active,.pip-rep.active{color:${primary};}
        .pip-vol-row{display:flex;align-items:center;gap:8px;padding:0 14px 10px;}
        .pip-vol-bar{
          flex:1;height:3px;background:rgba(255,255,255,.12);
          border-radius:999px;cursor:pointer;
        }
        .pip-vol-fill{
          height:100%;border-radius:999px;background:${primary};width:80%;
        }
      `;
      pw.document.head.appendChild(s);
    }

    function buildPiPUI(pw, state) {
      const ae = window.LCCAudioEngine;
      const vol = ae.state.volume;
      const track = state.currentTrack || {};
      const artUrl = (track.artworkUrl100||'').replace('100x100','300x300');
      const pct = state.duration>0 ? (state.currentTime/state.duration*100).toFixed(1) : 0;
      const fmt = s => isNaN(s)?'0:00':`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

      pw.document.body.innerHTML = `
        <div class="pip-wrap">
          <div class="pip-body">
            <div class="pip-art" id="pip-art">
              ${artUrl ? `<img src="${artUrl}" id="pip-art-img" alt="">` : '♪'}
            </div>
            <div class="pip-info">
              <div class="pip-track" id="pip-track">${track.trackName||'No track'}</div>
              <div class="pip-artist" id="pip-artist">${track.artistName||'—'}</div>
            </div>
          </div>
          <div class="pip-prog-wrap">
            <div class="pip-prog-bar" id="pip-prog-bar">
              <div class="pip-prog-fill" id="pip-prog-fill" style="width:${pct}%"></div>
            </div>
            <div class="pip-time">
              <span id="pip-curr">${fmt(state.currentTime)}</span>
              <span id="pip-dur">${fmt(state.duration)}</span>
            </div>
          </div>
          <div class="pip-ctrls">
            <button class="pip-btn pip-shuf${state.shuffleMode?' active':''}" id="pip-shuf" title="Shuffle">⇌</button>
            <button class="pip-btn" id="pip-prev" title="Prev">⏮</button>
            <button class="pip-play${state.isPlaying?' playing':''}" id="pip-play" title="Play/Pause"></button>
            <button class="pip-btn" id="pip-next" title="Next">⏭</button>
            <button class="pip-btn pip-rep" id="pip-rep" title="Repeat">↻</button>
          </div>
          <div class="pip-vol-row">
            <span class="pip-btn" id="pip-mute" style="padding:4px 6px;font-size:.8rem;">🔊</span>
            <div class="pip-vol-bar" id="pip-vol-bar">
              <div class="pip-vol-fill" id="pip-vol-fill" style="width:${vol}%"></div>
            </div>
          </div>
        </div>`;

      // Wire controls — all calls go back to main window's engine
      pw.document.getElementById('pip-play').onclick  = () => ae.state.isPlaying ? ae.pause() : ae.play();
      pw.document.getElementById('pip-prev').onclick  = () => ae.prev();
      pw.document.getElementById('pip-next').onclick  = () => ae.next();
      pw.document.getElementById('pip-shuf').onclick  = () => { ae.toggleShuffle(); pw.document.getElementById('pip-shuf').classList.toggle('active', ae.state.shuffleMode); };
      pw.document.getElementById('pip-rep').onclick   = () => pw.document.getElementById('pip-rep').classList.toggle('active');
      pw.document.getElementById('pip-mute').onclick  = () => {
        const btn = pw.document.getElementById('pip-mute');
        const muted = btn.textContent === '🔇';
        ae.setVolume(muted ? (ae.state.volume || 80) : 0);
        btn.textContent = muted ? '🔊' : '🔇';
      };
      pw.document.getElementById('pip-prog-bar').onclick = e => {
        if (!ae.state.duration) return;
        const r = pw.document.getElementById('pip-prog-bar').getBoundingClientRect();
        ae.seek(((e.clientX-r.left)/r.width)*ae.state.duration);
      };
      pw.document.getElementById('pip-vol-bar').onclick = e => {
        const r = pw.document.getElementById('pip-vol-bar').getBoundingClientRect();
        const v = Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100);
        ae.setVolume(v);
        const f = pw.document.getElementById('pip-vol-fill');
        if (f) f.style.width = v+'%';
      };
    }

    function updatePiP(pw, d) {
      if (!pw || !d) return;
      const doc = pw.document;
      const fmt = s => isNaN(s)?'0:00':`${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

      const trackEl  = doc.getElementById('pip-track');
      const artistEl = doc.getElementById('pip-artist');
      const artEl    = doc.getElementById('pip-art');
      const fillEl   = doc.getElementById('pip-prog-fill');
      const currEl   = doc.getElementById('pip-curr');
      const durEl    = doc.getElementById('pip-dur');
      const playEl   = doc.getElementById('pip-play');
      const shufEl   = doc.getElementById('pip-shuf');
      const volEl    = doc.getElementById('pip-vol-fill');

      if (d.currentTrack) {
        if (trackEl)  trackEl.textContent  = d.currentTrack.trackName  || 'Unknown';
        if (artistEl) artistEl.textContent = d.currentTrack.artistName || '—';
        const artUrl = (d.currentTrack.artworkUrl100||'').replace('100x100','300x300');
        if (artEl && artUrl) {
          const existing = artEl.querySelector('img');
          if (existing) { if (existing.src !== artUrl) existing.src = artUrl; }
          else artEl.innerHTML = `<img src="${artUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
        }
      }
      if (playEl) playEl.classList.toggle('playing', !!d.isPlaying);
      if (shufEl) shufEl.classList.toggle('active', !!d.shuffleMode);
      if (d.duration>0) {
        if (fillEl) fillEl.style.width = ((d.currentTime/d.duration)*100).toFixed(1)+'%';
        if (currEl) currEl.textContent = fmt(d.currentTime);
        if (durEl)  durEl.textContent  = fmt(d.duration);
      }
      if (volEl) volEl.style.width = window.LCCAudioEngine.state.volume + '%';
    }

    async function openPiP() {
      if (pipWin) { try { pipWin.close(); } catch(e){} pipWin = null; updatePipBtn(false); return; }
      if (!window.documentPictureInPicture) {
        alert('Picture-in-Picture is not supported in this browser.\nPlease use Chrome 116+ or Edge 116+.');
        return;
      }
      try {
        pipWin = await documentPictureInPicture.requestWindow({ width: 340, height: 200 });
        buildPiPStyles(pipWin);
        buildPiPUI(pipWin, window.LCCAudioEngine.state);

        // Forward audio updates into the PiP window
        const handler = e => updatePiP(pipWin, e.detail);
        window.addEventListener('phantom-audio-update', handler);

        pipWin.addEventListener('pagehide', () => {
          window.removeEventListener('phantom-audio-update', handler);
          pipWin = null;
          updatePipBtn(false);
        });

        updatePipBtn(true);
      } catch(err) {
        console.error('[PiP]', err);
      }
    }

    function updatePipBtn(active) {
      const btn = document.getElementById('mp-pip-btn');
      if (btn) btn.classList.toggle('active', active);
    }

    document.getElementById('mp-pip-btn').addEventListener('click', openPiP);

    // Also expose for potential music-page button
    window._lccOpenPiP = openPiP;
  })();
