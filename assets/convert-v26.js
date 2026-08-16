/* kri·studio v26: конверсионный слой — кнопка Telegram перед формой, поле «Что нужно», плашка доверия, sticky-CTA на мобильных, экран «Спасибо» после УСПЕШНОЙ отправки (сигнал .sent из app.js) */
(function(){
  'use strict';
  function init(){
    try{
      var css='.form .tg-btn{display:flex;align-items:center;justify-content:center;gap:9px;background:#2aabee;color:#fff;font-weight:700;font-size:15px;padding:14px 20px;border-radius:40px;text-decoration:none;margin-bottom:10px;box-shadow:0 10px 22px rgba(42,171,238,.35);transition:transform .2s ease}.form .tg-btn:hover{transform:translateY(-2px)}.form .or-sep{text-align:center;color:var(--muted,#8a8a8a);font-size:13px;margin-bottom:14px}.sticky-cta{position:fixed;left:0;right:0;bottom:0;z-index:90;display:none;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.94);backdrop-filter:blur(8px);box-shadow:0 -8px 26px rgba(0,0,0,.14)}html[data-theme="bold"] .sticky-cta{background:rgba(29,24,32,.94)}.sticky-cta a{flex:1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;padding:12px 10px;border-radius:30px;text-decoration:none}.sticky-cta .sc-tg{background:#2aabee;color:#fff}.sticky-cta .sc-brief{background:var(--acc,#ff5a1f);color:#fff}.sticky-cta.hid{display:none!important}@media(max-width:760px){.sticky-cta{display:flex}}.brief-thanks{display:none;text-align:center;padding:34px 24px;border-radius:22px;background:var(--card,#fff);box-shadow:0 20px 50px rgba(0,0,0,.10)}html[data-theme="bold"] .brief-thanks{background:rgba(255,255,255,.06)}.brief-thanks.on{display:block;animation:briefIn .45s ease}@keyframes briefIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}.brief-thanks .bt-ic{width:66px;height:66px;margin:0 auto 16px;border-radius:50%;background:rgba(42,171,238,.14);display:flex;align-items:center;justify-content:center}.brief-thanks h3{font-size:24px;margin:0 0 10px}.brief-thanks p{color:var(--muted,#8a8a8a);margin:0 auto 22px;max-width:380px;line-height:1.5}.brief-thanks .bt-tg{display:inline-flex;align-items:center;gap:9px;background:#2aabee;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:40px;text-decoration:none;box-shadow:0 10px 22px rgba(42,171,238,.35);transition:transform .2s ease}.brief-thanks .bt-tg:hover{transform:translateY(-2px)}.brief-thanks .bt-alt{display:inline-block;margin-top:16px;color:var(--muted,#8a8a8a);font-size:14px}';
      var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

      var f=document.querySelector('#brief form.form');
      if(f){
        var tg=document.createElement('a');
        tg.className='tg-btn';tg.href='https://t.me/kri_studio';tg.target='_blank';tg.rel='noopener';
        tg.textContent='Написать в Telegram — быстрее';
        var sep=document.createElement('div');sep.className='or-sep';sep.textContent='или заполните форму — ответ в течение дня';
        f.insertBefore(sep,f.firstChild);f.insertBefore(tg,sep);
        if(!f.querySelector('[name="need"]')){
          var lab=document.createElement('label');lab.textContent='Что нужно';
          var sel=document.createElement('select');sel.name='need';
          ['Пока не знаю — нужна консультация','Логотип / фирменный стиль','Упаковка / этикетка','Карточки WB и Ozon','Сайт / лендинг','Соцсети','Полиграфия / меню','Иллюстрация / 3D','Другое'].forEach(function(t){var o=document.createElement('option');o.textContent=t;sel.appendChild(o);});
          var taskLab=null;f.querySelectorAll('label').forEach(function(l){if(l.textContent==='О задаче')taskLab=l;});
          if(taskLab){f.insertBefore(lab,taskLab);f.insertBefore(sel,taskLab);}
        }
        var fine=f.querySelector('.fine');
        if(fine)fine.textContent='Ответ в течение дня · Договор · Оплата с чеком · Правки 24–48 ч';

        var thanks=document.createElement('div');
        thanks.className='brief-thanks';
        thanks.innerHTML='<div class="bt-ic"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M9.04 15.31 8.9 19.1c.4 0 .58-.17.8-.38l1.92-1.84 3.98 2.92c.73.4 1.25.19 1.45-.68L20.9 5.6c.26-1.08-.39-1.5-1.1-1.24L3.4 10.66c-1.06.41-1.05 1-.18 1.27l4.2 1.31 9.74-6.14c.46-.3.88-.14.53.16l-8.65 8.05z" fill="#2aabee"/></svg></div><h3>Спасибо! Заявка получена</h3><p>Уже беру вашу задачу в работу и отвечу в течение дня. Хотите быстрее? Напишите мне в Telegram прямо сейчас — обсудим детали в переписке.</p><a class="bt-tg" href="https://t.me/kri_studio" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9.04 15.31 8.9 19.1c.4 0 .58-.17.8-.38l1.92-1.84 3.98 2.92c.73.4 1.25.19 1.45-.68L20.9 5.6c.26-1.08-.39-1.5-1.1-1.24L3.4 10.66c-1.06.41-1.05 1-.18 1.27l4.2 1.31 9.74-6.14c.46-.3.88-.14.53.16l-8.65 8.05z" fill="#fff"/></svg>Написать в Telegram</a><a class="bt-alt" href="/projects/">А пока посмотреть работы →</a>';
        f.parentNode.insertBefore(thanks,f.nextSibling);
        /* Экран «Спасибо» показываем ТОЛЬКО при успешной отправке: app.js на успехе вешает класс .sent на кнопку отправки. */
        var sb=f.querySelector('button[type=submit]');
        if(sb&&'MutationObserver'in window){
          var shown=false;
          new MutationObserver(function(){
            if(!shown&&sb.classList.contains('sent')){
              shown=true;
              f.style.display='none';
              thanks.classList.add('on');
              try{thanks.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
            }
          }).observe(sb,{attributes:true,attributeFilter:['class']});
        }
      }
      var bar=document.createElement('div');bar.className='sticky-cta';bar.id='stickyCta';
      bar.innerHTML='<a class="sc-tg" href="https://t.me/kri_studio" target="_blank" rel="noopener">Telegram</a><a class="sc-brief" href="#brief">Оставить заявку</a>';
      document.body.appendChild(bar);
      var b=document.getElementById('brief');
      if(b&&'IntersectionObserver'in window){
        new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){bar.classList.toggle('hid',es[i].isIntersecting)}},{threshold:.12}).observe(b);
      }
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
