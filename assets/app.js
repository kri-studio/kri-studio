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
  if(burger&&links){burger.addEventListener('click',function(){links.classList.toggle('open');});}

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
  var TG_TOKEN='8876827624:AAEg6wqxzYLEYlqEk2KwzpJYRGh1hBqYyjY';
  var TG_CHAT='2136903894';
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
      fetch('https://api.telegram.org/bot'+TG_TOKEN+'/sendMessage',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({chat_id:TG_CHAT,text:text})
      }).then(function(r){return r.json();}).then(function(res){
        if(!res.ok)throw new Error('tg');
        f.reset();
        if(btn){btn.textContent='Заявка отправлена ✓';btn.classList.add('sent');}
        var fine=f.querySelector('.fine');
        if(fine)fine.textContent='Спасибо! Ответим в течение дня.';
        setTimeout(function(){if(btn){btn.disabled=false;btn.textContent=btnText;btn.classList.remove('sent');}},6000);
      }).catch(function(){
        // Запасной путь — письмо на почту студии.
        if(btn){btn.disabled=false;btn.textContent=btnText;}
        var body=encodeURIComponent('Имя: '+g('name')+'\nКонтакт: '+g('contact')+'\nБюджет: '+g('budget')+'\n\nО задаче:\n'+g('task'));
        location.href='mailto:kri_tri06@mail.ru?subject='+encodeURIComponent('Заявка с сайта kri·studio')+'&body='+body;
      });
    });
  });
})();
