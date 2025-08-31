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