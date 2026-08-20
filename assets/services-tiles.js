// v28: блок плиток «Подробно об услугах» на странице /services/
(function(){
  'use strict';
  function init(){
    try{
      if(location.pathname !== '/services/' && location.pathname !== '/services/index.html') return;
      if(document.getElementById('serviceLandingTiles')) return;

      var calc = document.querySelector('.calc-cta');
      var packNote = document.querySelector('.pack-note');
      var anchor = calc || packNote;
      if(!anchor || !anchor.parentNode) return;

      var css = document.createElement('style');
      css.id = 'serviceLandingTilesCss';
      css.textContent = ''+
        '.service-landing{margin:52px 0 10px;padding:34px;border:1px solid var(--line);border-radius:30px;background:linear-gradient(135deg,var(--card),var(--tint));box-shadow:var(--shadow-sm)}'+
        '.service-landing__top{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:24px}'+
        '.service-landing__eyebrow{font-family:var(--dis);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin-bottom:10px}'+
        '.service-landing h3{font-family:var(--dis);font-size:clamp(24px,3vw,38px);line-height:1.08;margin:0;letter-spacing:-.02em}'+
        '.service-landing__lead{max-width:520px;color:var(--muted);font-size:15.5px;line-height:1.55;margin:0}'+
        '.service-landing__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}'+
        '.service-tile{position:relative;overflow:hidden;min-height:210px;border:1px solid var(--line);border-radius:22px;background:var(--card);padding:20px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow-sm);transition:transform .25s,box-shadow .25s,border-color .25s}'+
        '.service-tile:hover{transform:translateY(-5px);box-shadow:var(--shadow);border-color:var(--acc)}'+
        '.service-tile:before{content:"";position:absolute;right:-44px;top:-44px;width:132px;height:132px;border-radius:50%;background:radial-gradient(circle,var(--soft),transparent 70%);opacity:.9;pointer-events:none}'+
        '.service-tile__icon{width:44px;height:44px;border-radius:15px;background:var(--tint);color:var(--acc);display:grid;place-items:center;font-size:22px;margin-bottom:18px;position:relative}'+
        '.service-tile h4{font-family:var(--dis);font-size:17px;line-height:1.16;margin:0 0 10px;position:relative}'+
        '.service-tile p{color:var(--muted);font-size:14px;line-height:1.48;margin:0 0 18px;position:relative}'+
        '.service-tile__bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--line);padding-top:14px;position:relative}'+
        '.service-tile__price{font-family:var(--dis);font-weight:800;color:var(--acc);font-size:14px;white-space:nowrap}'+
        '.service-tile__go{font-size:13px;font-weight:800;color:var(--ink)}'+
        '.service-tile--main{grid-column:span 2;background:linear-gradient(135deg,var(--acc),var(--accD));color:#fff;border-color:transparent}'+
        '.service-tile--main:before{background:radial-gradient(circle,rgba(255,255,255,.34),transparent 70%)}'+
        '.service-tile--main .service-tile__icon{background:rgba(255,255,255,.18);color:#fff}'+
        '.service-tile--main p,.service-tile--main .service-tile__price,.service-tile--main .service-tile__go{color:#fff}'+
        '.service-tile--main .service-tile__bottom{border-color:rgba(255,255,255,.28)}'+
        '@media(max-width:1080px){.service-landing__grid{grid-template-columns:repeat(2,1fr)}.service-tile--main{grid-column:span 2}}'+
        '@media(max-width:640px){.service-landing{padding:24px 18px;border-radius:24px;margin:36px 0 4px}.service-landing__top{display:block}.service-landing__lead{margin-top:12px}.service-landing__grid{grid-template-columns:1fr}.service-tile--main{grid-column:auto}.service-tile{min-height:190px}}';
      document.head.appendChild(css);

      var box = document.createElement('section');
      box.className = 'service-landing reveal';
      box.id = 'serviceLandingTiles';
      box.innerHTML = ''+
        '<div class="service-landing__top">'+
          '<div><div class="service-landing__eyebrow">Подробно об услугах</div><h3>Выберите направление — и посмотрите, что входит</h3></div>'+
          '<p class="service-landing__lead">Прайс ниже даёт быстрый ориентир по бюджету, а отдельные страницы показывают процесс, сроки, примеры работ, FAQ и заявку под конкретную задачу.</p>'+
        '</div>'+
        '<div class="service-landing__grid">'+
          tile('/uslugi/dizayn-sayta/','✦','Дизайн сайта','Лендинг, сайт услуг, магазин или редизайн — от структуры до адаптива и запуска.','от 80 000 ₽',true)+
          tile('/uslugi/firmennyy-stil/','◐','Фирменный стиль','Логотип, цвета, типографика, носители и понятные правила для команды.','от 90 000 ₽')+
          tile('/uslugi/brendbuk/','▣','Брендбук','Документ с правилами бренда: от смыслов и логотипа до носителей и шаблонов.','от 220 000 ₽')+
          tile('/uslugi/logotip/','◆','Логотип','2–3 концепта, векторные файлы, версии для печати, сайта и соцсетей.','от 25 000 ₽')+
          tile('/uslugi/kartochki-wb-ozon/','▤','Карточки WB/Ozon','Продающая инфографика и единый стиль линейки для маркетплейсов.','от 20 000 ₽')+
          tile('/uslugi/upakovka/','⬡','Упаковка','Концепция, дизайн всех сторон, подготовка к печати и визуализация.','от 60 000 ₽')+
          tile('/uslugi/prezentacii/','▰','Презентации','Структура, дизайн слайдов, инфографика и финальный PDF/PPTX.','от 30 000 ₽')+
        '</div>';

      anchor.parentNode.insertBefore(box, anchor);
      setTimeout(function(){ box.classList.add('in'); }, 60);
    }catch(e){}
  }
  function tile(href, icon, title, text, price, main){
    return '<a class="service-tile'+(main?' service-tile--main':'')+'" href="'+href+'">'+
      '<div><div class="service-tile__icon">'+icon+'</div><h4>'+title+'</h4><p>'+text+'</p></div>'+
      '<div class="service-tile__bottom"><span class="service-tile__price">'+price+'</span><span class="service-tile__go">Подробнее →</span></div>'+
    '</a>';
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
