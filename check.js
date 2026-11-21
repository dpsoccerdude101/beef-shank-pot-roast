
(function(){
  "use strict";
  var cut = "k", mode = "c";

  var T = {
    k: { braise:"2&frac12; hours", veg:"1&frac12; to 2 hours", total:"4 to 4&frac12; hours", probe:"3&frac12; hours", timer:252, salt:"2&frac12; tsp", yld:"3.2&ndash;3.5 lb", serve:"Serves 8" },
    m: { braise:"2 hours", veg:"1&frac12; hours", total:"3&frac12; hours", probe:"3 hours", timer:210, salt:"2 tsp", yld:"3.4 lb", serve:"Serves 6" }
  };

  var $ = function(id){ return document.getElementById(id); };
  var ing = Array.prototype.slice.call(document.querySelectorAll("ul.ing input[type=checkbox]"));

  function applyCut(){
    var t = T[cut];
    $("stepbraise").innerHTML = t.braise;
    $("stepveg").innerHTML = t.veg;
    $("steptotal").innerHTML = t.total;
    $("probeat").innerHTML = t.probe;
    $("chipsalt").innerHTML = t.salt;
    $("chipyield").innerHTML = t.yld;
    $("yield").innerHTML = t.serve;
    $("k1").setAttribute("aria-pressed", cut === "k" ? "true" : "false");
    $("k2").setAttribute("aria-pressed", cut === "m" ? "true" : "false");
    resetTimer();
  }

  function applyMode(){
    var fan = mode === "v";
    $("ebtemp").innerHTML = fan ? "275&deg;F" : "300&deg;F";
    $("steptemp").innerHTML = fan ? "275&deg;F" : "300&deg;F";
    $("convnote").hidden = !fan;
    $("m1").setAttribute("aria-pressed", fan ? "false" : "true");
    $("m2").setAttribute("aria-pressed", fan ? "true" : "false");
  }

  function applyQuantities(){
    Array.prototype.forEach.call(document.querySelectorAll(".qty[data-a]"), function(el){
      var v = cut === "k" ? el.getAttribute("data-a") : el.getAttribute("data-b");
      if (v) el.innerHTML = v;
    });
  }

  function progress(){
    var n = ing.filter(function(i){ return i.checked; }).length;
    var txt = n + " of " + ing.length + " gathered";
    $("count").textContent = txt;
    $("dockstat").textContent = txt;
    $("barfill").style.width = (n / ing.length * 100) + "%";
  }

  // ---- timer ----
  var endAt = 0, raf = 0;
  function fmt(ms){
    var s = Math.max(0, Math.round(ms / 1000));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ":" + String(m).padStart(2,"0") : String(m)) + ":" + String(sec).padStart(2,"0");
  }
  function tick(){
    var left = endAt - Date.now();
    if (left <= 0){
      $("clock").textContent = "00:00";
      $("state").textContent = "Time is up. Check the shank with a fork now.";
      endAt = 0; raf = 0;
      if (navigator.vibrate) navigator.vibrate([200,120,200]);
      return;
    }
    $("clock").textContent = fmt(left);
    raf = requestAnimationFrame(tick);
  }
  function resetTimer(){
    endAt = 0;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    $("clock").textContent = fmt(T[cut].timer * 1000);
    $("state").textContent = "Start it the moment the pot goes in the oven.";
  }
  function startTimer(){
    if (endAt) return;
    var left = T[cut].timer * 1000;
    if (/^\d+:\d\d$/.test($("clock").textContent) && $("state").textContent.indexOf("Start it") === -1){
      // resuming after reset value untouched, keep full duration
    }
    endAt = Date.now() + left;
    $("state").textContent = "Braising. The first stretch has no vegetables in the pot.";
    raf = requestAnimationFrame(tick);
  }

  // ---- wire ----
  $("k1").addEventListener("click", function(){ cut = "k"; applyCut(); applyQuantities(); });
  $("k2").addEventListener("click", function(){ cut = "m"; applyCut(); applyQuantities(); });
  $("m1").addEventListener("click", function(){ mode = "c"; applyMode(); });
  $("m2").addEventListener("click", function(){ mode = "v"; applyMode(); });
  ing.forEach(function(i){ i.addEventListener("change", progress); });
  $("tstart").addEventListener("click", startTimer);
  $("treset").addEventListener("click", resetTimer);
  $("reset").addEventListener("click", function(){
    ing.forEach(function(i){ i.checked = false; });
    progress();
    window.scrollTo({ top:0, behavior:"smooth" });
  });

  applyCut();
  applyQuantities();
  applyMode();
  progress();
})();
