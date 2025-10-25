// Toggle filtres senzills per Articles
document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const k = btn.getAttribute('data-filter');
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    document.querySelectorAll('[data-kind]').forEach(item=>{
      item.style.display = (k==='all' || item.getAttribute('data-kind')===k)?'block':'none';
    });
  });
});

// Carousel controls for Bibliografia
document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const viewport = carousel.querySelector('[data-carousel-track]');
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  if(!viewport || (!prev && !next)) return;

  const getStep = ()=>{
    const first = viewport.querySelector(':scope > *');
    if(!first) return viewport.clientWidth;
    const style = getComputedStyle(viewport);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const update = ()=>{
    const maxScroll = viewport.scrollWidth - viewport.clientWidth - 1;
    const current = viewport.scrollLeft;
    if(prev){prev.disabled = current <= 0;}
    if(next){next.disabled = current >= maxScroll;}
  };

  const scrollByDir = dir=>{
    viewport.scrollBy({left: dir * getStep(), behavior:'smooth'});
  };

  prev?.addEventListener('click',()=>scrollByDir(-1));
  next?.addEventListener('click',()=>scrollByDir(1));
  viewport.addEventListener('scroll',()=>requestAnimationFrame(update));
  window.addEventListener('resize',update,{passive:true});
  update();
});

// Cite buttons for Articles (APA only)
const citeButtons = document.querySelectorAll('.cite-btn[data-citation]');
if(citeButtons.length){
  const copyText = async text=>{
    if(navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly','');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  };

  const showFeedback = (btn, message)=>{
    const original = btn.dataset.originalLabel || btn.textContent;
    btn.dataset.originalLabel = original;
    btn.textContent = message;
    setTimeout(()=>{ btn.textContent = btn.dataset.originalLabel; }, 2000);
  };

  citeButtons.forEach(btn=>{
    const url = btn.dataset.url ? new URL(btn.dataset.url, window.location.href).href : window.location.href;
    const citation = (btn.dataset.citation || '').replace('{url}', url);
    btn.dataset.citationFormatted = citation;
    btn.title = citation;
    btn.addEventListener('click',async ()=>{
      const textToCopy = btn.dataset.citationFormatted || citation;
      try{
        const ok = await copyText(textToCopy);
        if(ok){
          showFeedback(btn, 'Cita copiada!');
        }else{
          alert(textToCopy);
        }
      }catch(_err){
        alert(textToCopy);
      }
    });
  });
}
