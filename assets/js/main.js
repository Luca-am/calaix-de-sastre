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
