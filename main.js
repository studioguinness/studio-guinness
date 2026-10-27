'use strict';
const data = window.PORTFOLIO;
const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};
const externalLink = (url, label, className='') => {
  const a = make('a',className,label); a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
  a.setAttribute('aria-label',`${label}（新しいタブ）`); return a;
};

// Players make no YouTube requests until a visitor chooses to play.
const players = new Set();
function videoPlayer(film, poster, featured=false) {
  const title = film.title || `VIDEO ID: ${film.youtubeId}`;
  const frame = make('div','video-player');
  const slot = make('div','video-slot');
  const reset = make('button','video-reset','サムネイルに戻す'); reset.type='button'; reset.hidden=true;
  const player = { reset: () => showPoster(false) };
  function showPoster(focus) {
    const button = make('button','video-trigger'); button.type='button';
    button.setAttribute('aria-label',`${title} をこのページで再生`);
    if (poster) {
      const img=make('img'); img.src=poster; img.alt=''; img.width=1920; img.height=1080;
      img.loading=featured?'eager':'lazy'; img.decoding='async'; if(featured)img.fetchPriority='high';
      img.addEventListener('error',()=>{img.remove();button.classList.add('poster-missing');},{once:true});
      button.append(img);
    }
    const play=make('span','play','▶'); play.setAttribute('aria-hidden','true');
    button.append(play); button.addEventListener('click',playVideo);
    slot.replaceChildren(button); reset.hidden=true; players.delete(player);
    if(focus)button.focus({preventScroll:true});
  }
  function playVideo() {
    for(const other of [...players])other.reset();
    const iframe=make('iframe'); iframe.title=`${title} — YouTube動画プレーヤー`;
    iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(film.youtubeId)}?autoplay=1&playsinline=1&rel=0`;
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
    iframe.allowFullscreen=true; iframe.referrerPolicy='strict-origin-when-cross-origin';
    slot.replaceChildren(iframe); reset.hidden=false; players.add(player); iframe.focus({preventScroll:true});
  }
  reset.addEventListener('click',()=>showPoster(true));
  frame.append(slot,reset); showPoster(false); return frame;
}
for(const anchor of document.querySelectorAll('[data-video]')) {
  const film=data.videos.find(v=>v.youtubeId===anchor.dataset.video);
  if(film)anchor.replaceWith(videoPlayer(film,anchor.querySelector('img')?.getAttribute('src')||film.poster,anchor.classList.contains('hero-film')));
}
const filmList=document.getElementById('six-films');
data.videos.filter(v=>v.project==='six').forEach((film,index)=>{
  const card=make('article','film-card');
  const header=make('div','film-card-caption');
  const title=make('h4','',film.title||`VIDEO ID: ${film.youtubeId}`);
  const count=make('span','film-index',String(index+1).padStart(2,'0')); header.append(count,title);
  card.append(videoPlayer(film,film.poster),header,externalLink(`https://youtu.be/${film.youtubeId}`,'YouTubeで見る ↗','video-external'));
  filmList.append(card);
});

// A stable featured order followed by every other artwork, without duplication.
const orderedIds=[...new Set([...(data.featuredOrder||[]),...data.artworks.map(a=>a.id)])];
const artworks=orderedIds.map(id=>data.artworks.find(a=>a.id===id)).filter(Boolean);
let category='all'; let limit=20; let visible=[];
const grid=document.getElementById('art-grid');
const filters=document.getElementById('art-filters');
const status=document.getElementById('gallery-status');
const more=document.getElementById('load-more');
const categoryName=id=>data.categories.find(c=>c.id===id)?.label||id;
const filteredArt=()=>artworks.filter(a=>category==='all'||a.category===category);
for(const item of [{id:'all',label:'ALL WORKS'},...data.categories]) {
  const count=item.id==='all'?artworks.length:artworks.filter(a=>a.category===item.id).length;
  const button=make('button','category-button',`${item.label} `); button.type='button';
  const badge=make('span','filter-count',String(count).padStart(2,'0')); button.append(badge);
  button.dataset.category=item.id; button.setAttribute('aria-pressed',String(item.id===category));
  button.setAttribute('aria-controls','art-grid');
  button.addEventListener('click',()=>{
    category=item.id;limit=20;
    filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
    renderGallery();
  });
  filters.append(button);
}
function artTile(art,index){
  const figure=make('figure',`art-tile${art.width>art.height?' wide':''}`);
  const button=make('button','art-open'); button.type='button'; button.dataset.artId=art.id;
  button.setAttribute('aria-label',`${art.title} を拡大表示`);button.setAttribute('aria-haspopup','dialog');
  const img=make('img'); img.src=art.thumbnail||art.src;
  if(art.thumbnail&&art.thumbnailWidth&&art.displayWidth>art.thumbnailWidth){
    img.srcset=`${art.thumbnail} ${art.thumbnailWidth}w, ${art.src} ${art.displayWidth}w`;
    img.sizes=art.width>art.height?'(max-width:640px) calc(100vw - 36px), (max-width:1000px) calc(50vw - 40px), 640px':'(max-width:640px) calc(50vw - 25px), (max-width:1000px) calc(25vw - 28px), 310px';
  }
  img.alt=art.alt;img.width=art.width;img.height=art.height;img.loading='lazy';img.decoding='async';
  const indicator=make('span','art-expand','↗');indicator.setAttribute('aria-hidden','true');
  const fallback=make('span','art-image-error','画像を読み込めませんでした');fallback.hidden=true;
  img.addEventListener('error',()=>{img.hidden=true;fallback.hidden=false;});
  button.append(img,indicator,fallback);button.addEventListener('click',()=>openLightbox(art.id,button));
  const caption=make('figcaption');const label=make('span','art-title');
  label.append(make('span','art-category',categoryName(art.category)),document.createTextNode(art.title));
  caption.append(label,make('span','art-number',String(index+1).padStart(2,'0')));
  figure.append(button,caption);return figure;
}
function renderGallery(){
  const list=filteredArt(); visible=list.slice(0,limit);
  grid.replaceChildren(...visible.map(artTile));
  status.textContent=`${visible.length} / ${list.length} WORKS`;
  more.hidden=visible.length>=list.length;
  more.textContent=`残り${list.length-visible.length}点を表示 ↓`;
}
more.addEventListener('click',()=>{
  const previousCount=visible.length;limit=filteredArt().length;renderGallery();
  grid.querySelectorAll('.art-open')[previousCount]?.focus();
});

// Native modal dialog keeps keyboard focus inside; Escape returns to the opener.
const dialog=document.getElementById('art-lightbox');
const lightboxImage=document.getElementById('lightbox-image');
const prev=document.getElementById('lightbox-prev'); const next=document.getElementById('lightbox-next');
const close=dialog.querySelector('.lightbox-close');
let lightboxItems=[];let lightboxIndex=0;let opener=null;
function openLightbox(id,trigger){
  opener=trigger;lightboxItems=[...visible];lightboxIndex=lightboxItems.findIndex(a=>a.id===id);
  updateLightbox();dialog.showModal();document.body.classList.add('modal-open');close.focus();
}
function updateLightbox(){
  const art=lightboxItems[lightboxIndex];
  lightboxImage.src=art.src;lightboxImage.alt=art.alt;
  document.getElementById('lightbox-title').textContent=art.title;
  document.getElementById('lightbox-category').textContent=categoryName(art.category);
  document.getElementById('lightbox-position').textContent=`${lightboxIndex+1} / ${lightboxItems.length}`;
  prev.disabled=lightboxItems.length<2;next.disabled=lightboxItems.length<2;
}
function stepLightbox(offset){lightboxIndex=(lightboxIndex+offset+lightboxItems.length)%lightboxItems.length;updateLightbox();}
prev.addEventListener('click',()=>stepLightbox(-1));next.addEventListener('click',()=>stepLightbox(1));
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('keydown',event=>{
  if(event.key==='Tab'){
    const controls=[close,prev,next].filter(button=>!button.disabled);
    const first=controls[0];const last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();stepLightbox(event.key==='ArrowLeft'?-1:1);}
  if(event.key==='Home'||event.key==='End'){event.preventDefault();lightboxIndex=event.key==='Home'?0:lightboxItems.length-1;updateLightbox();}
});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lightboxImage.removeAttribute('src');if(opener?.isConnected)opener.focus({preventScroll:true});});
renderGallery();

const officialLinks=document.getElementById('official-links');
data.links.filter(link=>link.url&&/^https:\/\//.test(link.url)).forEach(link=>officialLinks.append(externalLink(link.url,`${link.label} ↗`,'text-link')));
