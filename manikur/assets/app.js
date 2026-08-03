(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ WebGL liquid background (raw WebGL, no libs) ============ */
  var canvas = document.getElementById("gl");
  if (canvas && !reduceMotion) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (gl) {
      var vsrc = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
      var fsrc = [
        "precision mediump float;",
        "uniform vec2 r;uniform float t;",
        "float n(vec2 p){return sin(p.x)*sin(p.y);}",
        "float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.04+vec2(1.7,9.2);a*=.5;}return s;}",
        "void main(){",
        "vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;",
        "float f1=fbm(uv*2.4+vec2(t*.12,-t*.09));",
        "float f2=fbm(uv*3.1-vec2(t*.08,t*.11)+f1);",
        "vec3 bg=vec3(.051,.043,.063);",
        "vec3 pink=vec3(1.,.18,.576);",
        "vec3 acid=vec3(.784,1.,.18);",
        "vec3 purp=vec3(.616,.361,1.);",
        "vec3 col=bg;",
        "col=mix(col,purp*.5,smoothstep(.15,.75,f1));",
        "col=mix(col,pink*.55,smoothstep(.35,.95,f2));",
        "col=mix(col,acid*.4,smoothstep(.55,1.,f1*f2*2.2));",
        "float vig=1.-dot(uv,uv)*.55;",
        "gl_FragColor=vec4(col*vig,1.);}"
      ].join("\n");
      function sh(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        return s;
      }
      var prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vsrc));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fsrc));
      gl.linkProgram(prog); gl.useProgram(prog);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var uR = gl.getUniformLocation(prog, "r");
      var uT = gl.getUniformLocation(prog, "t");
      function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
        canvas.width = Math.max(2, Math.floor(innerWidth * dpr));
        canvas.height = Math.max(2, Math.floor(innerHeight * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();
      window.addEventListener("resize", resize);
      (function loop(ts) {
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, (ts || 0) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(loop);
      })(0);
    }
  }

  /* ============ 3D tilt cards ============ */
  if (!reduceMotion && window.matchMedia("(hover:hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var rect = null;
      el.addEventListener("mouseenter", function () { rect = el.getBoundingClientRect(); });
      el.addEventListener("mousemove", function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = "perspective(800px) rotateY(" + (x * 14) + "deg) rotateX(" + (-y * 14) + "deg) scale(1.03)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
        rect = null;
      });
    });
  }

  /* ============ Reveal on scroll ============ */
  var revealEls = document.querySelectorAll(".reveal3d");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============ Counters ============ */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) { el.textContent = target; return; }
    el.textContent = "0";
    var start = null, dur = 1100;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ============ Custom cursor ============ */
  var cursor = document.getElementById("cursor");
  if (cursor && !reduceMotion && window.matchMedia("(hover:hover)").matches) {
    var cx = -100, cy = -100, tx = -100, ty = -100;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add("is-on");
    });
    (function follow() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll("a, button, [data-hover]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-grow"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-grow"); });
    });
  }

  /* ============ Mobile menu ============ */
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
