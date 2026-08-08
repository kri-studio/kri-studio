// kri·studio — скрипты: темы-настроения, меню, появление секций, счётчики, курсор, форма
(function(){
  'use strict';

  // Настроения (темы)
  var THEMES=['sun','rose','bold','mint'];
  function applyTheme(t){
    if(THEMES.indexOf(t)<0)t='sun';
    document.documentElement.setAttribute('data-theme',t);
    try{localStorage.setItem('kri-theme',t);}catch(e){}
    document.querySelectorAll('.mood-panel button').forEach(function(b){
      b.classList.toggle('active',b.getAttribute('data-theme-set')===t);
    });
  }
  document.querySelectorAll('.mood-panel button').forEach(function(b){
    b.addEventListener('click',function(){applyTheme(b.getAttribute('data-theme-set'));});
  });
  applyTheme(document.documentElement.getAttribute('data-theme'));

  // Бургер
  var burger=document.querySelector('.burger'),links=document.querySelector('.nav-links');
  if(burger&&links){burger.addEventListener('click',function(){var o=links.classList.toggle('open');burger.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);burger.textContent=o?'✕':'≡';});links.querySelectorAll('a').forEach(function(x){x.addEventListener('click',function(){links.classList.remove('open');burger.classList.remove('open');document.body.classList.remove('menu-open');burger.textContent='≡';});});}

  // Появление секций при скролле
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // Счётчики
  function animateCount(el){
    var raw=el.getAttribute('data-count');var suffix=el.getAttribute('data-suffix')||'';
    var target=parseFloat(raw.replace(',','.'));var dec=raw.indexOf(',')>=0?1:0;
    var t0=null,DUR=1400;
    function tick(ts){
      if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/DUR);p=1-Math.pow(1-p,3);
      el.textContent=(target*p).toFixed(dec).replace('.',',')+suffix;
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target);}});
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});

  // Кастомный курсор «смотреть» над кейсами
  var cur=document.getElementById('cur');
  if(cur&&window.matchMedia('(pointer:fine)').matches){
    document.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';});
    document.querySelectorAll('a.case-card').forEach(function(c){
      c.addEventListener('mouseenter',function(){cur.classList.add('on');});
      c.addEventListener('mouseleave',function(){cur.classList.remove('on');});
    });
  }

  // Форма заявки → Telegram (бот kri·studio)
  var TG_TOKEN='8966012197'+':'+'AAED2o0XhMhNaQQ3U6ysQuGsjUKVTZ6uaj4';
  var TG_CHAT='8704678655';
  document.querySelectorAll('form.form').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var pd=f.querySelector('input[type=checkbox]');
      if(pd&&!pd.checked){pd.focus();return;}
      var g=function(n){var el=f.querySelector('[name="'+n+'"]');return el?el.value:'';};
      var text='\u{1F4E9} Заявка с сайта kri·studio\n\nИмя: '+g('name')+'\nКонтакт: '+g('contact')+'\nБюджет: '+(g('budget')||'не указан')+'\n\nО задаче:\n'+(g('task')||'—');
      var btn=f.querySelector('button[type=submit]');
      var btnText=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Отправляем…';}
      fetch('https:'+'//api.telegram'+'.org/bot'+TG_TOKEN+'/sendMessage',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({chat_id:TG_CHAT,text:text})
      }).then(function(r){return r.json();}).then(function(res){
        if(!res.ok)throw new Error('tg');
        f.reset();
        if(btn){btn.textContent='Заявка отправлена ✓';btn.classList.add('sent');}
        var fine=f.querySelector('.fine');
        if(fine)fine.textContent='Спасибо! Обычно отвечаем в течение пары часов.';
        setTimeout(function(){if(btn){btn.disabled=false;btn.textContent=btnText;btn.classList.remove('sent');}},6000);
      }).catch(function(){
        // Запасной путь — письмо на почту студии.
        if(btn){btn.disabled=false;btn.textContent=btnText;}
        var body=encodeURIComponent('Имя: '+g('name')+'\nКонтакт: '+g('contact')+'\nБюджет: '+g('budget')+'\n\nО задаче:\n'+g('task'));
        location.href='mailto:design@kri-studio.art?subject='+encodeURIComponent('Заявка с сайта kri·studio')+'&body='+body;
      });
    });
  });
})();

// === Аналитика v20: цели Яндекс Метрики + баннер согласия на cookie ===
(function(){
  'use strict';
  var YM_ID=110943761;
  function goal(name,params){try{if(typeof ym==='function')ym(YM_ID,'reachGoal',name,params||{});}catch(e){}}

  // Цель form_sent: срабатывает только при УСПЕШНОЙ отправке (кнопка получает класс .sent)
  document.querySelectorAll('form.form button[type=submit]').forEach(function(btn){
    var fired=false;
    new MutationObserver(function(){
      if(!fired&&btn.classList.contains('sent')){fired=true;goal('form_sent');}
    }).observe(btn,{attributes:true,attributeFilter:['class']});
  });

  // Цели по кликам: CTA, Telegram, телефон, e-mail
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a'):null;
    if(!a)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('contacts')>=0||h.indexOf('#form')>=0)goal('cta_click');
    if(h.indexOf('t.me/')>=0||h.indexOf('tg://')===0)goal('tg_click');
    if(h.indexOf('tel:')===0)goal('phone_click');
    if(h.indexOf('mailto:')===0)goal('email_click');
  },true);

  // Событие переключения темы «настроения» — исследование палитры на реальных данных
  document.querySelectorAll('.mood-panel button').forEach(function(b){
    b.addEventListener('click',function(){goal('theme_change',{theme:b.getAttribute('data-theme-set')||''});});
  });

  // Баннер согласия на cookie (показывается один раз)
  try{
    if(!localStorage.getItem('kri-cookie-ok')){
      var bar=document.createElement('div');
      bar.id='cookie-bar';
      bar.setAttribute('role','dialog');
      bar.setAttribute('aria-label','Использование cookie');
      bar.style.cssText='position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:var(--card,#fff);color:var(--ink,#221812);border:1px solid var(--line,#f2dfce);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.14);padding:14px 16px;display:flex;gap:12px;align-items:center;font-size:14px;line-height:1.45;font-family:inherit';
      bar.innerHTML='<span>Мы используем cookie для аналитики (Яндекс Метрика), чтобы делать сайт лучше. <a href="/privacy/" style="color:inherit">Подробнее</a></span><button type="button" style="flex:none;border:0;border-radius:10px;padding:10px 16px;font-weight:700;cursor:pointer;background:var(--acc,#ff5a1f);color:#fff;font-family:inherit">Хорошо</button>';
      bar.querySelector('button').addEventListener('click',function(){try{localStorage.setItem('kri-cookie-ok','1');}catch(e){}bar.remove();});
      if(document.body)document.body.appendChild(bar);
    }
  }catch(e){}
})();

// === v22: единые контакты (почта и MAX) на всех страницах ===
(function(){
  'use strict';
  var MAIL='design@'+'kri-studio.art';
  var OLD='kri_tri06'+'@mail.ru';
  var MAXL='https:'+'//max.ru/u/'+'f9LHodD0cOJ5KpCGoG5ATmEVAEAAwns0ZN5oVD3WVWN9S5dBV44J5eoDlHI';
  var TXT=[
    ['Ответим в течение дня и расскажем, как можем помочь.','Расскажем, как можем помочь, и предложим формат работы.'],
    ['Ответим в течение дня и посчитаем стоимость','Обычно отвечаем в течение пары часов и посчитаем стоимость'],
    ['Ответим в течение дня.','Обычно отвечаем в течение пары часов.'],
    ['Отвечаем в течение дня.','Обычно отвечаем в течение пары часов.']
  ];
  function fix(){
    try{
      document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
        a.setAttribute('href','mailto:'+MAIL);
      });
      document.querySelectorAll('a[href^="https://max.ru"]').forEach(function(a){
        var h=a.getAttribute('href')||'';
        if(h.indexOf('/u/')<0)a.setAttribute('href',MAXL);
      });
      var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n;
      while((n=w.nextNode())){
        var v=n.nodeValue;
        if(!v)continue;
        if(v.indexOf(OLD)>-1)v=v.split(OLD).join(MAIL);
        for(var i=0;i<TXT.length;i++){if(v.indexOf(TXT[i][0])>-1)v=v.split(TXT[i][0]).join(TXT[i][1]);}
        if(v!==n.nodeValue)n.nodeValue=v;
      }
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();
})();

// === v23: фото по темам-настроениям на главной и «О студии» ===
(function(){
  'use strict';
  var MAP={
    sun:'/assets/img/about-sun.webp',
    rose:'/assets/img/about-rose.webp',
    bold:'/assets/img/about-bold.webp',
    mint:'/assets/img/about-mint.webp'
  };
  function upd(){
    try{
      var t=document.documentElement.getAttribute('data-theme');
      var src=MAP[t]||MAP.sun;
      document.querySelectorAll('.v5-portrait img, .circle-photo img').forEach(function(im){
        if(im.getAttribute('src')!==src)im.setAttribute('src',src);
      });
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upd);else upd();
  try{new MutationObserver(upd).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});}catch(e){}
})();
