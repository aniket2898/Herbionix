// Custom cursor
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!reduceMotion){
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('.hover-target').forEach(el => {
      el.addEventListener('mouseover', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseout', () => cursorRing.classList.remove('hover'));
    });
  }

  // Panel open/close
  const panels = document.querySelectorAll('[data-panel]');
  const body = document.body;

  function openPanel(id){
    panels.forEach(p => p.classList.toggle('open', p.id === 'panel-' + id));
    body.classList.add('panel-open');
  }
  function closePanels(){
    panels.forEach(p => p.classList.remove('open'));
    body.classList.remove('panel-open');
  }

  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', () => openPanel(el.getAttribute('data-open')));
  });
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closePanels);
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closePanels();
  });

  // Contact form (front-end only demo)
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const success = form.querySelector('.form-success');
      success.style.display = 'block';
      form.querySelectorAll('input, textarea').forEach(el => el.value = '');
    });
  });


  // Ingredient science: expand / collapse
  document.querySelectorAll('[data-ing-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ing-card');
      const detail = card.querySelector('.ing-detail');
      const willOpen = detail.hidden;
      detail.hidden = !willOpen;
      card.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
      btn.querySelector('.lbl').textContent = willOpen ? 'Hide Ingredient Science' : 'Explore Ingredient Science';
    });
  });
