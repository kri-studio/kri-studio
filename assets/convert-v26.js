/* kri·studio v26: конверсионный слой — кнопка Telegram перед формой, поле «Что нужно», плашка доверия, sticky-CTA на мобильных */
(function(){
  'use strict';
  function init(){
    try{
      var css='.form .tg-btn{display:flex;align-items:center;justify-content:center;gap:9px;background:#2aabee;color:#fff;font-weight:700;font-size:15px;padding:14px 20px;border-radius:40px;text-decoration:none;margin-bottom:10px;box-shadow:0 10px 22px rgba(42,171,238,.35);transition:transform .2s ease}.form .tg-btn:hover{transform:translateY(-2px)}.form .or-sep{text-align:center;color:var(--muted,#8a8a8a);font-size:13px;margin-bottom:14px}.sticky-cta{position:fixed;left:0;right:0;bottom:0;z-index:90;display:none;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.94);backdrop-filter:blur(8px);box-shadow:0 -8px 26px rgba(0,0,0,.14)}html[data-theme="bold"] .sticky-cta{background:rgba(29,24,32,.94)}.sticky-cta a{flex:1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;padding:12px 10px;border-radius:30px;text-decoration:none}.sticky-cta .sc-tg{background:#2aabee;color:#fff}.sticky-cta .sc-brief{background:var(--acc,#ff5a1f);color:#fff}.sticky-cta.hid{display:none!important}@media(max-width:760px){.sticky-cta{display:flex}}';
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
