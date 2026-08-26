// kri·studio — unified site scripts (Priority 1 service pages)
(function(){
  'use strict';
  var YM_ID=110943761;
  var MAIL='design@kri-studio.art';
  var OLD='kri_tri06@mail.ru';
  var MAXL='https://max.ru/u/f9LHodD0cOJ5KpCGoG5ATmEVAEAAwns0ZN5oVD3WVWN9S5dBV44J5eoDlHI';
  var THEMES=['sun','rose','bold','mint'];
  var NAV=[['/','Главная'],['/projects/','Работы'],['/services/','Услуги и цены'],['/raschet/','Расчёт цены'],['/blog/','Блог'],['/about/','О студии'],['/contacts/','Контакты']];
  var FOOT=[['/services/','Услуги и цены'],['/raschet/','Расчёт стоимости'],['/blog/','Блог'],['/privacy/','Политика обработки ПД'],['/about/#faq','Частые вопросы'],['mailto:'+MAIL,'Почта'],['https://t.me/kri_studio','Telegram'],['https://wa.me/79055166557','WhatsApp']];

  function goal(name,params){try{if(typeof ym==='function')ym(YM_ID,'reachGoal',name,params||{});}catch(e){}}
  function normPath(p){return (p||'/').replace(/index\.html$/,'').replace(/\/+/g,'/');}
  function isActive(h){var p=normPath(location.pathname); if(h==='/')return p==='/'; return p.indexOf(h)===0;}

  // Wide layout: align utility pages with the service-page benchmark.
  try{
    if(!document.getElementById('kri-wide')){
      var s=document.createElement('style');
      s.id='kri-wide';
      s.textContent='.wrap{max-width:min(1600px,95vw)!important}.hero-v5 .v5-wrap,.v5-wrap{max-width:min(1600px,95vw)!important}.post{max-width:none!important;margin-left:0!important;margin-right:0!important}@media(min-width:1400px){.wrap,.v5-wrap{padding-left:44px!important;padding-right:44px!important}}@media(max-width:1100px){.wrap,.v5-wrap{max-width:100%!important}}html{scroll-padding-top:92px}section[id],div[id]{scroll-margin-top:92px}';
      (document.head||document.documentElement).appendChild(s);
    }
  }catch(e){}

  function applyTheme(t){
    if(THEMES.indexOf(t)<0)t='sun';
    document.documentElement.setAttribute('data-theme',t);
    try{localStorage.setItem('kri-theme',t);}catch(e){}
    document.querySelectorAll('.mood-panel button').forEach(function(b){
      var on=b.getAttribute('data-theme-set')===t;
      b.classList.toggle('active',on); b.classList.toggle('on',on);
    });
  }

  function normalizeNav(){
    var nav=document.querySelector('.nav-links');
    if(!nav)return;
    nav.innerHTML=NAV.map(function(x){return '<a href="'+x[0]+'"'+(isActive(x[0])?' class="active"':'')+'>'+x[1]+'</a>';}).join('');
  }

  function normalizeFooter(){
    var foot=document.querySelector('.foot-links');
    if(!foot)return;
    foot.innerHTML=FOOT.map(function(x){
      var ext=x[0].indexOf('http')===0?' target="_blank" rel="noopener"':'';
      return '<a href="'+x[0]+'"'+ext+'>'+x[1]+'</a>';
    }).join('');
  }

  function normalizeContacts(){
    try{
      document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){a.setAttribute('href','mailto:'+MAIL+'?subject='+encodeURIComponent('Заявка с сайта kri·studio'));});
      document.querySelectorAll('a[href^="https://max.ru"]').forEach(function(a){a.setAttribute('href',MAXL);});
      var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n;
      while((n=w.nextNode())){
        var v=n.nodeValue;if(!v)continue;
        v=v.split(OLD).join(MAIL)
          .split('Ответим в течение дня и расскажем, как можем помочь.').join('Расскажем, как можем помочь, и предложим формат работы.')
          .split('Ответим в течение дня.').join('Обычно отвечаем в течение пары часов.')
          .split('Отвечаем в течение дня.').join('Обычно отвечаем в течение пары часов.');
        if(v!==n.nodeValue)n.nodeValue=v;
      }
    }catch(e){}
  }

  function bindMenu(){
    var burger=document.querySelector('.burger'),links=document.querySelector('.nav-links');
    if(!burger||!links)return;
    burger.addEventListener('click',function(){var o=links.classList.toggle('open');burger.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);burger.textContent=o?'✕':'≡';});
    links.querySelectorAll('a').forEach(function(x){x.addEventListener('click',function(){links.classList.remove('open');burger.classList.remove('open');document.body.classList.remove('menu-open');burger.textContent='≡';});});
  }

  function bindTheme(){
    document.querySelectorAll('.mood-panel button').forEach(function(b){b.addEventListener('click',function(){var t=b.getAttribute('data-theme-set');applyTheme(t);goal('theme_change',{theme:t||''});});});
    applyTheme(document.documentElement.getAttribute('data-theme')||'sun');
  }

  function reveal(){
    var els=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    els.forEach(function(e){io.observe(e);});
    setTimeout(function(){document.documentElement.classList.add('anim-done');},1600);
  }

  function counters(){
    function animateCount(el){
      var raw=el.getAttribute('data-count')||'0',suffix=el.getAttribute('data-suffix')||'',target=parseFloat(raw.replace(',','.')),dec=raw.indexOf(',')>=0?1:0,t0=null,DUR=1400;
      function tick(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/DUR);p=1-Math.pow(1-p,3);el.textContent=(target*p).toFixed(dec).replace('.',',')+suffix;if(p<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);
    }
    if(!('IntersectionObserver' in window))return;
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target);}});},{threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});
  }

  function cursor(){
    var cur=document.getElementById('cur');
    if(cur&&window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
      document.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';});
      document.querySelectorAll('a.case-card,.wcard').forEach(function(c){c.addEventListener('mouseenter',function(){cur.classList.add('on');});c.addEventListener('mouseleave',function(){cur.classList.remove('on');});});
    }
  }

  function forms(){
    var LEAD_URL='https://cool-shadow-dc3b.kristinatrifonova903.workers.dev';
    document.querySelectorAll('form.form').forEach(function(f){
      f.addEventListener('submit',function(ev){
        ev.preventDefault();
        var pd=f.querySelector('input[type=checkbox]'); if(pd&&!pd.checked){pd.focus();return;}
        var g=function(n){var el=f.querySelector('[name="'+n+'"]');return el?el.value:'';};
        var btn=f.querySelector('button[type=submit]'),btnText=btn?btn.textContent:'';
        if(btn){btn.disabled=true;btn.textContent='Отправляем…';}
        fetch(LEAD_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:g('name'),contact:g('contact'),budget:g('budget'),task:(g('need')?'['+g('need')+'] ':'')+g('task')})})
          .then(function(r){return r.json();}).then(function(res){if(!res.ok)throw new Error('send');f.reset();if(btn){btn.textContent='Заявка отправлена ✓';btn.classList.add('sent');}var fine=f.querySelector('.fine');if(fine)fine.textContent='Спасибо! Обычно отвечаем в течение пары часов.';goal('form_sent');setTimeout(function(){if(btn){btn.disabled=false;btn.textContent=btnText;btn.classList.remove('sent');}},6000);})
          .catch(function(){if(btn){btn.disabled=false;btn.textContent=btnText;}var body=encodeURIComponent('Имя: '+g('name')+'\nКонтакт: '+g('contact')+'\nЧто нужно: '+g('need')+'\nБюджет: '+g('budget')+'\n\nО задаче:\n'+g('task'));location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Заявка с сайта kri·studio')+'&body='+body;});
      });
    });
  }

  function analytics(){
    document.addEventListener('click',function(e){
      var a=e.target&&e.target.closest?e.target.closest('a'):null;if(!a)return;var h=a.getAttribute('href')||'';
      if(h.indexOf('contacts')>=0||h.indexOf('#brief')>=0||h.indexOf('#zayavka')>=0)goal('cta_click');
      if(h.indexOf('/raschet/')>=0)goal('calc_click');
      if(h.indexOf('t.me/')>=0||h.indexOf('tg://')===0)goal('tg_click');
      if(h.indexOf('tel:')===0)goal('phone_click');
      if(h.indexOf('mailto:')===0)goal('email_click');
    },true);
  }

  function cookie(){
    try{if(localStorage.getItem('kri-cookie-ok'))return;var bar=document.createElement('div');bar.id='cookie-bar';bar.setAttribute('role','dialog');bar.setAttribute('aria-label','Использование cookie');bar.style.cssText='position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:var(--card,#fff);color:var(--ink,#221812);border:1px solid var(--line,#f2dfce);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.14);padding:14px 16px;display:flex;gap:12px;align-items:center;font-size:14px;line-height:1.45;font-family:inherit';bar.innerHTML='<span>Мы используем cookie для аналитики (Яндекс Метрика), чтобы делать сайт лучше. <a href="/privacy/" style="color:inherit">Подробнее</a></span><button type="button" style="flex:none;border:0;border-radius:10px;padding:10px 16px;font-weight:700;cursor:pointer;background:var(--acc,#ff5a1f);color:#fff;font-family:inherit">Хорошо</button>';bar.querySelector('button').addEventListener('click',function(){try{localStorage.setItem('kri-cookie-ok','1');}catch(e){}bar.remove();});document.body.appendChild(bar);}catch(e){}
  }

  function themePhotos(){
    var ABOUT={sun:'/assets/img/about-sun.webp',rose:'/assets/img/about-rose.webp',bold:'/assets/img/about-bold.webp',mint:'/assets/img/about-mint.webp'};
    var HERO={sun:'/assets/img/portrait-sun.webp',rose:'/assets/img/portrait-rose.webp',bold:'/assets/img/portrait-bold.webp',mint:'/assets/img/portrait-mint.webp'};
    function upd(){try{var t=document.documentElement.getAttribute('data-theme')||'sun';document.querySelectorAll('.circle-photo img').forEach(function(im){if(ABOUT[t])im.setAttribute('src',ABOUT[t]);});var hi=document.querySelector('.v5-portrait img');if(hi&&HERO[t])hi.setAttribute('src',HERO[t]);}catch(e){}}
    try{new MutationObserver(upd).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});}catch(e){} upd();
  }

  function init(){normalizeNav();normalizeFooter();normalizeContacts();bindMenu();bindTheme();reveal();counters();cursor();forms();analytics();cookie();themePhotos();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
