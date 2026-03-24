// ══ AudioEngine ═══════════════════════════════════════════════════════
  class LCCAudioEngine {
    constructor() {
      this.player = null; this.audio = null; this.playerReady = false; this.queue = [];
      this.state = {
        isPlaying:false, currentTime:0, duration:0,
        volume: parseInt(localStorage.getItem('arcora_last_volume')||'80'),
        source:'youtube', currentTrack:null,
        playlist:[], originalPlaylist:[], index:-1,
        radioMode:false, shuffleMode:false, isReady:false, timestamp:Date.now()
      };
      this.storageKey = 'lcc_player_state';
    }
    async init() {
      this._loadState();
      if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const t = document.createElement('script');
        t.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(t);
      }
      this._bindEvents();
      await this._waitForYT();
      this._initPlayer();
      this._checkAutoResume();
      this._notifyUI();
      window.dispatchEvent(new CustomEvent('phantom-audio-ready'));
    }
    _bindEvents() {
      const old = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if(old) old(); this._initPlayer(); };
      window.addEventListener('beforeunload', () => this.saveState());
      setInterval(() => this.saveState(), 2000);
    }
    _waitForYT() {
      return new Promise(r => {
        if (window.YT && window.YT.Player) return r();
        let n=0, iv=setInterval(()=>{ n++; if((window.YT&&window.YT.Player)||n>100){clearInterval(iv);r();} },100);
      });
    }
    _initPlayer() {
      if (this.player||!window.YT||!window.YT.Player||!document.getElementById('audio-engine-container')) return;
      try {
        this.player = new YT.Player('audio-engine-container',{
          height:'1',width:'1',videoId:'',
          playerVars:{autoplay:1,controls:0,disablekb:1,origin:window.location.origin},
          events:{
            onReady: () => { this.playerReady=true; this.state.isReady=true; this.player.setVolume(this.state.volume); this._processQueue(); this._notifyUI(); },
            onStateChange: e => this._onYTState(e),
            onError: e => console.warn('[AE] YT error',e.data)
          }
        });
      } catch(e){ console.error('[AE] init fail',e); }
    }
    _processQueue(){ while(this.queue.length) (this.queue.shift())(); }
    _onYTState(e){
      if(e.data===YT.PlayerState.PLAYING){ this.state.isPlaying=true; this.state.isReady=true; if(this.audio) this.audio.pause(); this._startTimer(); }
      else if(e.data===YT.PlayerState.PAUSED){ this.state.isPlaying=false; }
      else if(e.data===YT.PlayerState.ENDED){ this.state.isPlaying=false; this._onEnd(); }
      this._notifyUI();
    }
    _startTimer(){
      if(this._timer) clearInterval(this._timer);
      this._timer = setInterval(()=>{
        try{
          if(this.state.source==='youtube'&&this.player&&typeof this.player.getCurrentTime==='function'){
            this.state.currentTime=this.player.getCurrentTime()||0;
            this.state.duration=this.player.getDuration()||0;
          }
        }catch(e){}
        this._notifyUI();
      },250);
    }
    _onEnd(){
      if(this.state.playlist.length>1) this.next();
      else if(this.state.radioMode) this._startRadio();
    }
    play(track, playlist=[]){
      if(!track){
        if(!this.state.currentTrack) return;
        if(this.player){
          const reload=()=>{
            if(this.state.currentTrack.videoId) this._loadVideo(this.state.currentTrack.videoId);
            else this._searchAndPlay(`${this.state.currentTrack.trackName} ${this.state.currentTrack.artistName} audio`);
          };
          if(!this.playerReady||!this.player.getPlayerState) this.queue.push(reload);
          else { const s=this.player.getPlayerState(); (s===-1||s===5||s===0||s===undefined)?reload():this.player.playVideo(); }
        }
        this.state.isPlaying=true; this._notifyUI(); return;
      }
      const same = this.state.currentTrack&&this.state.currentTrack.trackName===track.trackName&&this.state.currentTrack.artistName===track.artistName;
      if(same){ if(!this.state.isPlaying) this.play(); return; }
      if(playlist.length>0){ this.state.originalPlaylist=[...playlist]; this.state.playlist=[...playlist]; this.state.index=playlist.findIndex(t=>t.trackName===track.trackName); }
      else { this.state.playlist=[track]; this.state.originalPlaylist=[track]; this.state.index=0; }
      this.state.currentTrack=track; this._startTimer();
      this.state.source='youtube'; this.state.isReady=this.playerReady;
      if(track.videoId) this._loadVideo(track.videoId);
      else this._searchAndPlay(`${track.trackName} ${track.artistName} audio`);
      this.saveState();
    }
    pause(){
      this.state.isPlaying=false;
      if(this.player&&this.player.pauseVideo) this.player.pauseVideo();
      this.saveState(); this._notifyUI();
    }
    next(){
      if(this.state.playlist.length>0){
        this.state.index=(this.state.index+1)%this.state.playlist.length;
        this.play(this.state.playlist[this.state.index]);
      }
    }
    prev(){
      if(this.state.playlist.length>0){
        this.state.index=(this.state.index-1+this.state.playlist.length)%this.state.playlist.length;
        this.play(this.state.playlist[this.state.index]);
      }
    }
    seek(t){
      this.state.currentTime=t;
      if(this.player&&this.player.seekTo) this.player.seekTo(t,true);
      this._notifyUI();
    }
    setVolume(v){
      this.state.volume=v;
      if(this.player&&this.player.setVolume) this.player.setVolume(v);
      localStorage.setItem('arcora_last_volume',v);
    }
    toggleShuffle(){ this.state.shuffleMode=!this.state.shuffleMode; this.saveState(); this._notifyUI(); }
    async _startRadio(){
      if(!this.state.currentTrack) return;
      try{
        const r=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(this.state.currentTrack.artistName)}&media=music&limit=10`);
        const d=await r.json();
        if(d.results?.length){
          const newT=d.results.filter(t=>t.trackName.toLowerCase()!==this.state.currentTrack.trackName.toLowerCase())
            .map(t=>({trackName:t.trackName,artistName:t.artistName,artworkUrl100:t.artworkUrl100,previewUrl:t.previewUrl}));
          this.state.playlist.push(...newT);
          if(!this.state.isPlaying) this.next();
          this._notifyUI();
        }
      }catch(e){}
    }
    async _searchAndPlay(query){
      const cache=JSON.parse(localStorage.getItem('arcora_video_cache')||'{}');
      if(cache[query]) return this._loadVideo(cache[query]);
      const keys=["AIzaSyBMhadsGk2S2B9bP46EycgI2y8yCWLLdAs","AIzaSyCOeLUcSlLDWAbKDUc-LUx8hdsenY-97rU","AIzaSyC3Z3jpYx5bw9M_Hih4sxF8iuiYZ4m3Qis","AIzaSyCWl9hmr-a0dVHKeUmUP5P7boAWJ3h48fs"];
      const key=keys[Math.floor(Math.random()*keys.length)];
      try{
        const r=await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${key}&maxResults=1`);
        const d=await r.json();
        if(d.items?.[0]?.id?.videoId){ const id=d.items[0].id.videoId; cache[query]=id; localStorage.setItem('arcora_video_cache',JSON.stringify(cache)); this._loadVideo(id); }
      }catch(e){ console.error('[AE] search fail',e); }
    }
    _loadVideo(id){
      if(this.state.currentTrack) this.state.currentTrack.videoId=id;
      if(this.playerReady&&this.player.loadVideoById) this.player.loadVideoById(id);
      else this.queue.push(()=>this.player.loadVideoById(id));
    }
    _loadState(){
      try{
        const s=JSON.parse(localStorage.getItem(this.storageKey)||'null');
        if(s&&Date.now()-(s.timestamp||0)<7200000) Object.assign(this.state,s);
      }catch(e){}
    }
    saveState(){
      localStorage.setItem(this.storageKey,JSON.stringify({
        currentTrack:this.state.currentTrack, currentTime:this.state.currentTime,
        duration:this.state.duration, isPlaying:this.state.isPlaying,
        source:this.state.source, playlist:this.state.playlist,
        originalPlaylist:this.state.originalPlaylist, index:this.state.index,
        radioMode:this.state.radioMode, shuffleMode:this.state.shuffleMode, timestamp:Date.now()
      }));
    }
    _checkAutoResume(){
      const was=this.state.isPlaying; this.state.isPlaying=false;
      if(was&&this.state.currentTrack&&(Date.now()-(this.state.timestamp||0)<15000)){
        setTimeout(()=>this.play(this.state.currentTrack),600);
      }
    }
    _notifyUI(){ window.dispatchEvent(new CustomEvent('phantom-audio-update',{detail:this.state})); }
  }
  window.LCCAudioEngine = new LCCAudioEngine();
  window.LCCAudioEngine.init();
