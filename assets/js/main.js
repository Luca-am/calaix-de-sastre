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

// Cite modal for Articles
const citeButtons = document.querySelectorAll('.cite-btn[data-cite-apa][data-cite-chicago]');
const citeModal = document.querySelector('[data-cite-modal]');
if(citeButtons.length && citeModal){
  const citeTexts = {
    apa: citeModal.querySelector('[data-cite-text="apa"]'),
    chicago: citeModal.querySelector('[data-cite-text="chicago"]')
  };
  const citeCopyButtons = citeModal.querySelectorAll('.cite-modal__copy');
  const dismissTriggers = citeModal.querySelectorAll('[data-cite-dismiss]');
  let lastFocusedButton = null;

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

  const openModal = btn=>{
    lastFocusedButton = btn;
    const baseUrl = btn.dataset.url ? new URL(btn.dataset.url, window.location.href).href : window.location.href;
    const apa = (btn.dataset.citeApa || '').replace('{url}', baseUrl);
    const chicago = (btn.dataset.citeChicago || '').replace('{url}', baseUrl);
    if(citeTexts.apa){citeTexts.apa.textContent = apa;}
    if(citeTexts.chicago){citeTexts.chicago.textContent = chicago;}
    citeCopyButtons.forEach(copyBtn=>{
      if(copyBtn.dataset.style === 'apa'){
        copyBtn.dataset.citation = apa;
      }else if(copyBtn.dataset.style === 'chicago'){
        copyBtn.dataset.citation = chicago;
      }
    });
    citeModal.hidden = false;
    citeModal.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>{
      citeCopyButtons[0]?.focus();
    });
  };

  const closeModal = ()=>{
    citeModal.hidden = true;
    citeModal.setAttribute('aria-hidden','true');
    lastFocusedButton?.focus();
  };

  citeButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      openModal(btn);
    });
  });

  citeCopyButtons.forEach(btn=>{
    btn.addEventListener('click',async ()=>{
      const text = btn.dataset.citation || '';
      if(!text) return;
      try{
        const ok = await copyText(text);
        if(ok){
          const original = btn.dataset.originalLabel || btn.textContent;
          btn.dataset.originalLabel = original;
          btn.textContent = 'Copiat!';
          setTimeout(()=>{ btn.textContent = btn.dataset.originalLabel; }, 2000);
        }else{
          alert(text);
        }
      }catch(_err){
        alert(text);
      }
    });
  });

  dismissTriggers.forEach(el=>{
    el.addEventListener('click',closeModal);
  });

  citeModal.addEventListener('click',event=>{
    if(event.target === citeModal){
      closeModal();
    }
  });

  document.addEventListener('keydown',event=>{
    if(event.key === 'Escape' && citeModal.getAttribute('aria-hidden') === 'false'){
      closeModal();
    }
  });
}
