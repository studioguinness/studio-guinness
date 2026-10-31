'use strict';
// A single player shared by all tracks. Audio is loaded only on user interaction.
(() => {
 const libraries={music:data.music||[],voice:data.voices||[]},host=document.getElementById('music-library');if(!libraries.music.length||!host)return;
 let mode='music',tracks=libraries.music,buttons=[];
 const tabs=make('div','audio-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','MUSIC / VOICE');
 const panels={},tabButtons={};
 for(const key of ['music','voice']){
  const b=make('button','audio-tab',key.toUpperCase()),panel=make('div','audio-panel');b.type='button';b.id=`audio-tab-${key}`;b.setAttribute('role','tab');b.setAttribute('aria-controls',`audio-panel-${key}`);panel.id=`audio-panel-${key}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',b.id);
  b.addEventListener('click',()=>switchLibrary(key));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const target=e.key==='Home'?'music':e.key==='End'?'voice':key==='music'?'voice':'music';switchLibrary(target);tabButtons[target].focus();});
  tabs.append(b);tabButtons[key]=b;panels[key]=panel;
 }
 host.append(tabs,panels.music,panels.voice);
 const audio=make('audio');audio.preload='none';musicAudio=audio;
 const deck=make('div','music-deck'),backdrop=make('img','music-backdrop'),content=make('div','music-content');
 backdrop.alt='';backdrop.loading='lazy';backdrop.width=1200;backdrop.height=1200;
 const current=make('div','music-current'),cover=make('img','music-cover'),info=make('div','music-info');
 cover.width=600;cover.height=600;cover.loading='lazy';
 const label=make('p','music-label','SELECTED TRACK'),title=make('h3','music-track-title'),artist=make('p','music-artist','STUDIO GUINNESS'),status=make('p','music-status');
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const timeline=make('div','music-timeline'),seek=make('input','music-seek'),times=make('div','music-times'),elapsed=make('span','','0:00'),duration=make('span');
 seek.type='range';seek.min='0';seek.step='.1';seek.value='0';seek.disabled=true;seek.setAttribute('aria-label','再生位置');times.append(elapsed,duration);timeline.append(seek,times);
 const icons={play:'<path d="m9 5 12 7-12 7Z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5v14M16 5v14" stroke-width="4"/>',prev:'<path d="M5 5v14m15-14L8 12l12 7Z"/>',next:'<path d="M19 5v14M4 5l12 7-12 7Z"/>',shuffle:'<path d="M3 6h3c5 0 6 12 11 12h4m-4-4 4 4-4 4M3 18h3c2 0 3-2 4-4m4-4c1-3 2-4 4-4h3m-4-4 4 4-4 4"/>',repeat:'<path d="M18 3l4 4-4 4M3 11V9a2 2 0 0 1 2-2h17M6 21l-4-4 4-4m15 0v2a2 2 0 0 1-2 2H2"/>'};
 const icon=(b,n)=>{b.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]}</svg>`;};
 function control(n,text,cls=''){const b=make('button','music-control '+cls);b.type='button';b.setAttribute('aria-label',text);b.title=text;icon(b,n);return b;}
 const controls=make('div','music-controls'),shuffle=control('shuffle','シャッフル','music-toggle'),previous=control('prev','前の曲'),play=control('play','再生','music-play'),next=control('next','次の曲'),repeat=control('repeat','1曲リピート','music-toggle');
 shuffle.setAttribute('aria-pressed','false');repeat.setAttribute('aria-pressed','false');controls.append(shuffle,previous,play,next,repeat);
 const volumeLabel=make('label','music-volume'),volume=make('input');volume.type='range';volume.min='0';volume.max='1';volume.step='.05';volume.value='1';volume.setAttribute('aria-label','音量');volumeLabel.append(make('span','','音量'),volume);
 info.append(label,title,artist,timeline,controls,volumeLabel,status);current.append(cover,info);
 const listHeader=make('div','music-list-heading'),list=make('ol','music-track-list');list.setAttribute('aria-label','曲を選んで再生');const listTitle=make('h4'),listCount=make('span');listHeader.append(listTitle,listCount);
 const format=s=>{const n=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};
 function renderList(){list.replaceChildren();buttons=tracks.map((track,i)=>{
   const li=make('li'),b=make('button','music-track'),im=make('img','track-thumbnail');b.type='button';b.setAttribute('aria-label',`${track.title} を再生`);im.src=track.thumbnail||track.cover;im.alt='';im.width=48;im.height=48;im.loading='lazy';
   b.append(make('span','track-number',String(i+1).padStart(2,'0')),im,make('span','track-title',track.title),make('span','track-duration',format(track.duration)));
   b.addEventListener('click',()=>{select(i);start();});li.append(b);list.append(li);return b;
 });
 }
 const kicker=make('p','music-kicker');content.append(kicker,current,listHeader,list);deck.append(backdrop,content);host.append(audio);
 let index=0,shuffleOn=false,request=0;
 const selected={music:0,voice:0};
 function switchLibrary(key){
  if(key===mode&&deck.parentElement)return;
  selected[mode]=index;request++;audio.pause();mode=key;tracks=libraries[key];
  for(const name of ['music','voice']){const active=name===key;tabButtons[name].setAttribute('aria-selected',String(active));tabButtons[name].tabIndex=active?0:-1;panels[name].hidden=!active;}
  panels[key].append(deck);kicker.textContent=key==='music'?'STUDIO GUINNESS / ORIGINAL MUSIC':'THE SIX MAIDS / 一言自己紹介';listTitle.textContent=key==='music'?'TRACK LIST':'VOICE LIST';listCount.textContent=`${tracks.length} ${key==='music'?'TRACKS':'VOICES'}`;list.setAttribute('aria-label',key==='music'?'曲を選んで再生':'自己紹介を選んで再生');
  previous.setAttribute('aria-label',key==='music'?'前の曲':'前のボイス');next.setAttribute('aria-label',key==='music'?'次の曲':'次のボイス');previous.title=previous.getAttribute('aria-label');next.title=next.getAttribute('aria-label');repeat.setAttribute('aria-label',key==='music'?'1曲リピート':'1ボイスリピート');repeat.title=repeat.getAttribute('aria-label');
  shuffleOn=false;shuffle.setAttribute('aria-pressed','false');shuffle.hidden=key==='voice';audio.loop=false;repeat.setAttribute('aria-pressed','false');renderList();select(selected[key]);
 }
 function metadata(){
  if(!('mediaSession' in navigator)||typeof MediaMetadata==='undefined')return;
  const t=tracks[index];navigator.mediaSession.metadata=new MediaMetadata({title:t.title,artist:t.artist,album:mode==='music'?'STUDIO GUINNESS / MUSIC':'THE SIX MAIDS / VOICE',artwork:(data.mediaArtwork||[]).map(a=>({...a,src:new URL(a.src,document.baseURI).href}))});
 }
 function position(){if('mediaSession' in navigator&&navigator.mediaSession.setPositionState&&Number.isFinite(audio.duration)&&audio.duration>0){try{navigator.mediaSession.setPositionState({duration:audio.duration,playbackRate:audio.playbackRate,position:Math.min(audio.currentTime,audio.duration)});}catch(_){}}}
 function pause(){request++;audio.pause();status.textContent='';}
 function syncPlay(){const p=!audio.paused;icon(play,p?'pause':'play');play.setAttribute('aria-label',p?'一時停止':'再生');play.title=p?'一時停止':'再生';label.textContent=p?'NOW PLAYING':mode==='music'?'SELECTED TRACK':'SELECTED VOICE';if('mediaSession' in navigator)navigator.mediaSession.playbackState=p?'playing':'paused';}
 function select(i){request++;audio.pause();audio.removeAttribute('src');audio.load();if('mediaSession' in navigator){navigator.mediaSession.metadata=null;try{navigator.mediaSession.setPositionState?.();}catch(_){}}index=i;const t=tracks[i];cover.src=t.cover;cover.alt=t.title+' — ジャケット';backdrop.src=t.cover;title.textContent=t.title;artist.textContent=t.artist;elapsed.textContent='0:00';duration.textContent=format(t.duration);seek.value='0';seek.max=String(t.duration);seek.disabled=true;seek.setAttribute('aria-valuetext',`0:00 / ${format(t.duration)}`);status.textContent='';buttons.forEach((b,n)=>{if(n===i)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});syncPlay();}
 async function start(){const token=++request;for(const p of [...players])p.reset();if(!audio.getAttribute('src'))audio.src=tracks[index].src;metadata();status.textContent='読み込み中…';try{await audio.play();if(token===request)status.textContent='';}catch(e){if(token===request&&e.name!=='AbortError')status.textContent='再生できませんでした。通信を確認して、もう一度再生を押してください。';}}
 function step(d){let i=(index+d+tracks.length)%tracks.length;if(shuffleOn)i=(index+1+Math.floor(Math.random()*(tracks.length-1)))%tracks.length;select(i);start();}
 play.addEventListener('click',()=>{if(audio.paused)start();else pause()});
 previous.addEventListener('click',()=>{if(audio.currentTime>3)audio.currentTime=0;else step(-1);});next.addEventListener('click',()=>step(1));
 shuffle.addEventListener('click',()=>{shuffleOn=!shuffleOn;shuffle.setAttribute('aria-pressed',String(shuffleOn));});repeat.addEventListener('click',()=>{audio.loop=!audio.loop;repeat.setAttribute('aria-pressed',String(audio.loop));});
 volume.addEventListener('input',()=>{audio.volume=Number(volume.value);});seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(seek.value);});
 audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)){seek.max=String(audio.duration);duration.textContent=format(audio.duration);seek.disabled=false;position();}});
 audio.addEventListener('timeupdate',()=>{seek.value=String(audio.currentTime);elapsed.textContent=format(audio.currentTime);seek.setAttribute('aria-valuetext',`${format(audio.currentTime)} / ${duration.textContent}`);position();});
 audio.addEventListener('play',syncPlay);audio.addEventListener('pause',syncPlay);audio.addEventListener('waiting',()=>{status.textContent='読み込み中…';});audio.addEventListener('playing',()=>{status.textContent='';});
 audio.addEventListener('error',()=>{if(audio.getAttribute('src'))status.textContent='音源を読み込めませんでした。通信を確認して、もう一度再生を押してください。';});
 audio.addEventListener('ended',()=>{if(mode==='music'&&(shuffleOn||index<tracks.length-1))step(1);else{syncPlay();status.textContent=mode==='voice'?'自己紹介の再生が終わりました。':'全曲の再生が終わりました。';}});
 if('mediaSession' in navigator){
  const actions={play:()=>start(),pause,stop:()=>{pause();audio.currentTime=0;position();},previoustrack:()=>step(-1),nexttrack:()=>step(1),seekto:e=>{if(Number.isFinite(audio.duration)){audio.currentTime=Math.max(0,Math.min(e.seekTime,audio.duration));position();}},seekbackward:e=>{audio.currentTime=Math.max(0,audio.currentTime-(e.seekOffset||10));position();},seekforward:e=>{if(Number.isFinite(audio.duration)){audio.currentTime=Math.min(audio.duration,audio.currentTime+(e.seekOffset||10));position();}}};
  for(const [action,handler] of Object.entries(actions)){try{navigator.mediaSession.setActionHandler(action,handler);}catch(_){}}
 }
 switchLibrary('music');
})();
