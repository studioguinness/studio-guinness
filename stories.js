'use strict';
(() => {
  const books=window.STORIES.books;
  const library=document.getElementById('story-library'), reader=document.getElementById('story-reader'), status=document.getElementById('story-status');
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const route=(book,episode)=>`#story/${book.id}/${episode.id}`;
  let current=null, fontSize='18';
  for(const book of books){
    const card=el('section',`story-book story-book-${book.id}`);
    card.append(el('p','story-book-kicker',book.id==='six'?'A STORY OF THE SIX':'FRAGMENTS OF THE WORLD'),el('h3','story-book-title',book.title),el('p','story-book-catch',book.catchphrase));
    const contents=el('details','story-contents');contents.dataset.book=book.id;
    const summary=el('summary','',`目次を開く / ${book.episodes.length}話`);contents.append(summary);
    contents.addEventListener('toggle',()=>{summary.textContent=`目次を${contents.open?'閉じる':'開く'} / ${book.episodes.length}話`;});
    const intro=el('details','story-introduction');intro.append(el('summary','','作品紹介'));
    const introText=el('div');book.introduction.split(/\n\s*\n/).forEach(t=>introText.append(el('p','',t)));intro.append(introText);contents.append(intro);
    let chapter=null,list=null;
    book.episodes.forEach((episode,index)=>{
      if(episode.chapter!==chapter){chapter=episode.chapter;if(chapter)contents.append(el('h4','story-chapter',chapter));list=el('ol','story-toc');list.start=index+1;contents.append(list);}
      const item=el('li'),a=el('a','',episode.title);a.href=route(book,episode);a.dataset.episode=episode.id;item.append(a);list.append(item);
    });card.append(contents);library.append(card);
  }
  function showEpisode(book,index,focus){
    const episode=book.episodes[index];current={book,index};library.hidden=true;reader.hidden=false;status.textContent='';reader.replaceChildren();
    const toolbar=el('nav','reader-toolbar');toolbar.setAttribute('aria-label','読書メニュー');
    const back=el('a','reader-back','← 目次に戻る');back.href='#story';toolbar.append(back);
    const sizeLabel=el('label','reader-size','文字サイズ '),size=el('select');size.setAttribute('aria-label','本文の文字サイズ');
    for(const [value,label] of [['16','小'],['18','標準'],['21','大']]){const opt=el('option','',label);opt.value=value;size.append(opt);}
    size.value=fontSize;size.addEventListener('change',()=>{fontSize=size.value;reader.style.setProperty('--reader-font',fontSize+'px');});sizeLabel.append(size);toolbar.append(sizeLabel);
    const header=el('header','reader-heading');header.append(el('p','reader-book',book.title),el('p','reader-chapter',episode.chapter||'FRAGMENTS'));
    const title=el('h3','',episode.title);title.id='reader-title';title.tabIndex=-1;header.append(title,el('p','reader-position',`${index+1} / ${book.episodes.length}`));
    const chooserLabel=el('label','reader-chooser','各話へ移動'),chooser=el('select');chooser.setAttribute('aria-label','読む話を選択');
    book.episodes.forEach((ep,i)=>{const option=el('option','',`${String(i+1).padStart(2,'0')}  ${ep.title}`);option.value=ep.id;chooser.append(option);});
    chooser.value=episode.id;chooser.addEventListener('change',()=>{location.hash=route(book,book.episodes.find(ep=>ep.id===chooser.value));});chooserLabel.append(chooser);header.append(chooserLabel);
    const body=el('div','reader-body');
    // Author-owned HTML sanitized by scripts/import_stories.py (element allowlist).
    body.innerHTML=episode.body;
    const footer=el('nav','reader-pagination');footer.setAttribute('aria-label','前後の話へ');
    for(const [offset,label] of [[-1,'← 前の話'],[1,'次の話 →']]){
      const target=book.episodes[index+offset],a=el(target?'a':'span','reader-page');
      a.append(el('span','',label),el('span','reader-page-title',target?target.title:offset<0?'最初の話です':'ここまで公開中'));
      if(target)a.href=route(book,target);else a.setAttribute('aria-disabled','true');footer.append(a);
    }
    const bottom=el('a','outline-button reader-bottom','目次に戻る');bottom.href='#story';
    reader.append(toolbar,header,body,footer,bottom);reader.style.setProperty('--reader-font',fontSize+'px');
    if(focus)title.focus({preventScroll:true});reader.scrollIntoView({block:'start',behavior:'instant'});
  }
  function update(focus=true){
    const hash=location.hash;
    if(hash.startsWith('#story/')){
      const [,slug,id]=hash.slice(1).split('/'),book=books.find(b=>b.id===slug),index=book?.episodes.findIndex(ep=>ep.id===id)??-1;
      if(book&&index>=0){showEpisode(book,index,focus);return;}
      status.textContent='この話は見つかりませんでした。目次から選んでください。';
    }else status.textContent='';
    reader.hidden=true;library.hidden=false;
    if(current&&(hash==='#story'||hash==='#story-library')){
      const details=library.querySelector(`[data-book="${current.book.id}"]`);details.open=true;
      const link=details.querySelector(`[data-episode="${current.book.episodes[current.index].id}"]`);
      if(focus)link.focus({preventScroll:true});library.scrollIntoView({block:'start',behavior:'instant'});
    }
  }
  window.addEventListener('hashchange',()=>update());update(false);
})();
