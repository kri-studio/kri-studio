// Счётчики статистики в hero-блоке v5
(function(){
  function animNum(el){
    var raw=el.textContent.trim();
    var m=raw.match(/^(\d+)(?:([.,])(\d+))?/);
    if(!m)return;
    var suffix=raw.slice(m[0].length);
    var dec=m[3]?m[3].length:0;
    var sep=m[2]||',';
    var target=parseFloat(m[1]+(m[3]?'.'+m[3]:''));
    var t0=performance.now(),D=1400;
    function frame(t){
      var p=Math.min((t-t0)/D,1);
      var e=1-Math.pow(1-p,3);
      var v=(target*e).toFixed(dec);
      if(dec)v=v.replace('.',sep);
      el.textContent=v+suffix;
      if(p<1)requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if(!window.matchMedia||!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var statIO=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){statIO.unobserve(e.target);animNum(e.target);}});
    },{threshold:.6});
    document.querySelectorAll('.hero-v5 .v5-stat b').forEach(function(el){statIO.observe(el);});
  }
})();
