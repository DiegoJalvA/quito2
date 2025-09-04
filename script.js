    (function(){
      const sentinel = document.getElementById('navSentinel');
      const navOriginal = document.getElementById('navbarOriginal');
      const navClone = document.getElementById('navbarClone');

      navClone.innerHTML = navOriginal.innerHTML;
      const menuOriginal = document.getElementById('menuOriginal');
      const menuClone = navClone.querySelector('.menu');
      menuClone.id = 'menuClone';

      const mqDesktop = window.matchMedia('(min-width: 901px)');
      const io = new IntersectionObserver(([entry])=>{
        if (mqDesktop.matches){
          navClone.classList.toggle('show', !entry.isIntersecting);
        } else {
          navClone.classList.add('show'); 
        }
      }, {threshold: 0});
      io.observe(sentinel);
      mqDesktop.addEventListener?.('change', () => {
        if (mqDesktop.matches){

        } else {
          navClone.classList.add('show'); 
        }
      });


      function scrollToHash(href){
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        const navHVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
        const navH = parseFloat(navHVar) || 60;
        const offset = 12;
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navH - offset);
        window.scrollTo({ top, behavior: 'smooth' });
      }

      function hookMenuClicks(menuEl){
        menuEl.querySelectorAll('a[href^=\"#\"]').forEach(a => {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const href = a.getAttribute('href');
            scrollToHash(href);
            setActive(href);
            setTimeout(() => centerActiveInMenu(menuEl), 250);
          });
        });
      }
      hookMenuClicks(menuOriginal);
      hookMenuClicks(menuClone);

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }


      const validIds = ['#club','#primer-equipo','#formativas','#femenino','#sedes','#tienda','#asociaturas','#incentivos','#contactos'];

      window.addEventListener('load', () => {

        if (!location.hash || location.hash.toLowerCase() === '#sedes') {
          history.replaceState(null, '', location.pathname + location.search);
          window.scrollTo(0, 0);
          setActive('#club');
        } else if (validIds.includes(location.hash.toLowerCase())) {

          setTimeout(() => scrollToHash(location.hash), 0);
        } else {

          history.replaceState(null, '', location.pathname + location.search);
          window.scrollTo(0, 0);
          setActive('#club');
        }
      });

      const allLinks = Array.from(document.querySelectorAll('#menuOriginal a, #menuClone a'));
      const ids = Array.from(new Set(allLinks.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('#'))));
      const sections = ids.map(id => document.querySelector(id)).filter(Boolean);

      function setActive(href){
        allLinks.forEach(a => a.removeAttribute('aria-current'));
        allLinks.filter(a => a.getAttribute('href') === href)
                .forEach(a => a.setAttribute('aria-current', 'page'));
      }
      if (sections.length) setActive('#' + sections[0].id);

      let ticking = false;
      function onScrollSpy(){
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const navHVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
          const navH = parseFloat(navHVar) || 60;
          const fromTop = window.scrollY + navH + 16;

          let activeIndex = 0;
          for (let i = 0; i < sections.length; i++){
            if (fromTop >= sections[i].offsetTop) activeIndex = i;
          }
          setActive('#' + sections[activeIndex].id);
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScrollSpy, {passive:true});
      onScrollSpy();

      function centerActiveInMenu(menuEl){
        const active = menuEl.querySelector('a[aria-current="page"]');
        if (!active) return;
        const rect = active.getBoundingClientRect();
        const mrect = menuEl.getBoundingClientRect();
        if (rect.left < mrect.left || rect.right > mrect.right){
          active.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
        }
      }
    })();


// ===== Formativas (tabs + datos + WhatsApp) =====
(function(){
  const tabs = document.querySelectorAll('.youth-tab');
  if (!tabs.length) return;

  // 1) Configura aquí tu número y datos
  const WHATSAPP_NUMBER = '593999999999'; // <-- CAMBIA a tu número (con país, sin +)
  const youthData = {
    U20: {
      coach: 'DT U20',
      venue: 'Complejo Norte',
      training: 'Lun–Vie, 08:00–10:00',
      next: 'vs. Academia XYZ — Sáb 16:00',
      last: '2–1 vs. Unión Juvenil',
    },
    U18: {
      coach: 'DT U18',
      venue: 'Complejo Norte',
      training: 'Lun–Vie, 08:00–09:30',
      next: 'vs. Club Juvenil — Dom 10:00',
      last: '1–1 vs. Atlético Formativo',
    },
    U16: {
      coach: 'DT U16',
      venue: 'Complejo Sur',
      training: 'Mar–Jue, 15:00–17:00',
      next: 'vs. Escuela La Cantera — Sáb 11:30',
      last: '0–2 vs. Semillero FC',
    },
    U14: { coach:'DT U14', venue:'Complejo Sur', training:'Mar–Jue, 15:00–16:30', next:'-', last:'-' },
    U12: { coach:'DT U12', venue:'Complejo Norte', training:'Lun–Mié, 16:00–17:30', next:'-', last:'-' },
    U10: { coach:'DT U10', venue:'Complejo Norte', training:'Mar–Jue, 16:00–17:00', next:'-', last:'-' },
  };

  // 2) Referencias en el DOM
  const catEl = document.getElementById('youthCat');
  const coachEl = document.getElementById('coach');
  const venueEl = document.getElementById('venue');
  const trainingEl = document.getElementById('training');
  const nextEl = document.getElementById('next');
  const lastEl = document.getElementById('last');
  const tryoutBtn = document.getElementById('tryoutBtn');

  function waLink(cat){
    const msg = `Hola, me gustaría probarme para ${cat}. ¿Qué requisitos necesito?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function render(cat){
    const d = youthData[cat] || youthData.U20;
    catEl.textContent = cat;
    coachEl.textContent = d.coach;
    venueEl.textContent = d.venue;
    trainingEl.textContent = d.training;
    nextEl.textContent = d.next;
    lastEl.textContent = d.last;
    tryoutBtn.href = waLink(cat);
  }

  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabs.forEach(b=>{ b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      render(btn.dataset.cat);
    });
  });

  // 3) Inicial
  render('U20');
})();




// ===== Sedes: selector que cambia el mapa y el enlace =====
(function(){
  const select = document.getElementById('sedeSelect');
  const iframe = document.getElementById('mapEmbed');
  const abrirBtn = document.getElementById('abrirMaps');
  if (!select || !iframe || !abrirBtn) return;

  // Define aquí tus sedes (puedes ajustar los textos/consultas)
  const sedes = {
    QuitoCentro: {
      q: 'Quito Centro Histórico',
    },
    QuitoNorte: {
      q: 'Complejo deportivo Quito norte',
    },
    QuitoSur: {
      q: 'Complejo deportivo Quito sur',
    }
  };

  function setMap(key){
    const sede = sedes[key] || sedes.QuitoCentro;
    const query = encodeURIComponent(sede.q);
    // Mapa embebido
    iframe.src = `https://www.google.com/maps?q=${query}&output=embed`;
    // Botón "Abrir en Google Maps" (pestaña nueva)
    abrirBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  // init
  setMap(select.value);
  select.addEventListener('change', ()=> setMap(select.value));
})();


// ===== Footer Year =====
document.getElementById('year').textContent = new Date().getFullYear();
