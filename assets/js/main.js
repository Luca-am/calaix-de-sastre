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
