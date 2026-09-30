/* /services — scroll choreography for the device mock-up.

   The device DOLLIES toward the viewer: the stage carries a CSS perspective
   and the laptop is pushed along Z (with a slight rotateX flattening out), so
   it genuinely travels closer rather than just getting bigger. It settles when
   the WHOLE device is contained in the viewport — nothing cropped. No tilt.

   Then it dissolves from the TOP DOWN: a linear-gradient mask, three times the
   element's height, whose POSITION is swept. Only mask-position changes, so
   there is no per-frame blur to rasterise (the previous version animated
   filter: blur() up to 26px across a full-viewport image, which is what made
   it stutter).

   Scroll input is critically damped — a target/current lerp inside a
   continuous rAF loop — so wheel steps and trackpad momentum come out smooth
   instead of landing as discrete jumps. */
(() => {
  'use strict';

  const stage  = document.getElementById('svcStage');
  const pin    = stage && stage.querySelector('.svc-stage__pin');
  const lap    = document.getElementById('svcLap');
  const copy   = stage && stage.querySelector('.svc-hero__copy');
  const mist   = stage && stage.querySelector('.svc-mist');
  const glow   = stage && stage.querySelector('.svc-hero__glow');
  const reveal = document.getElementById('svcReveal');
  const after  = document.querySelector('.svc-page > .page');
  if (!stage || !pin || !lap || !copy) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  /* A split-screen desktop window can still be wider than a phone, but not
     wide enough for the pinned two-column choreography to keep both the copy
     and the device visible. Treat it like the compact layout instead. */
  const small   = window.matchMedia('(max-width: 1200px)');

  /* Lid (screen + bezel) as a fraction of media/tenable-dashboard.png,
     measured from the alpha channel: 62,26 -> 1470,954 of 1535x1024. */
  const ORIGIN_X = 0.49902, ORIGIN_Y = 0.47852;   // lid centre
  /* Whole-laptop bounds within media/tenable-dashboard.png, from the alpha
     channel: 18,26 -> 1516,1022 of 1535x1024. The dolly CONTAINS this box, so
     the entire device stays on screen — nothing is ever cropped. */
  const FULL_W = 0.97590, FULL_H = 0.97266;
  const FIT = 0.93;        // breathing room around the device
  /* perspective() is applied as part of THIS element's transform: a
     `perspective` property on an ancestor only reaches its direct children,
     and .svc-lap is a grandchild of the pin. */
  const PERSP = 1600;

  const P_FILL = 0.50, P_HOLD = 0.62;
  const GAP = 72;          // breathing room kept between the cards and what follows
  const MASK_SOLID = 100, MASK_GONE = -70;        // mask-position-y sweep

  /* entrance animation fills forwards, which would outrank inline styles */
  function takeOver() {
    if (!lap.classList.contains('svc-appear')) return;
    lap.classList.remove('svc-appear');
    lap.style.animation = 'none';
  }
  lap.addEventListener('animationend', takeOver, { once: true });
  setTimeout(takeOver, 2000);

  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const ease  = (t) => 1 - Math.pow(1 - t, 3);
  /* smoothstep: eases in AND out, so the haze creeps in gently instead of
     snapping away the moment the dissolve starts (easeOut front-loads it) */
  const smooth = (t) => t * t * (3 - 2 * t);
  const lerp  = (a, b, t) => a + (b - a) * t;

  let geo = null;
  function measure() {
    const lr = lap.getBoundingClientRect(), pr = pin.getBoundingClientRect();
    if (!lr.width || !lr.height) { geo = null; return; }
    const scale = Math.min(
      window.innerWidth  * FIT / (lr.width  * FULL_W),
      window.innerHeight * FIT / (lr.height * FULL_H)
    );
    geo = {
      scale,
      dx: pr.width  / 2 - ((lr.left - pr.left) + lr.width  * ORIGIN_X),
      dy: pr.height / 2 - ((lr.top  - pr.top)  + lr.height * ORIGIN_Y),
    };
  }

  function render(p) {
    if (!geo) return;

    const g = ease(clamp(p / P_FILL, 0, 1));
    const s = lerp(1, geo.scale, g);
    /* express the zoom as real Z travel under the stage's perspective */
    const z = PERSP * (1 - 1 / s);

    /* The translate happens in 3D and is then magnified by the perspective
       projection (P / (P - z) == s), so pre-divide by s to land on target. */
    const tx = (geo.dx * g) / s, ty = (geo.dy * g) / s;

    /* dissolve: sweep the mask down from the top */
    const d = clamp((p - P_HOLD) / (1 - P_HOLD), 0, 1);
    const de = smooth(d);
    const my = lerp(MASK_SOLID, MASK_GONE, de);
    lap.style.webkitMaskPosition = `0% ${my.toFixed(2)}%`;
    lap.style.maskPosition       = `0% ${my.toFixed(2)}%`;
    /* safety net for anything that ignores mask-image; keyed to the same easing */
    lap.style.opacity            = String(1 - clamp((de - 0.88) / 0.12, 0, 1));

    const c = ease(clamp(p / 0.30, 0, 1));
    copy.style.opacity   = String(1 - c);
    copy.style.transform = `translate3d(0, ${(-44 * c).toFixed(1)}px, 0)`;

    /* as it dissolves it drifts upward and swells a touch — vapour rising,
       not a picture being wiped. Both are transforms, so this costs nothing. */
    const drift = -70 * de, swell = 1 + 0.07 * de;
    lap.style.transform =
      `perspective(${PERSP}px) translate3d(${tx.toFixed(2)}px, ${(ty + drift).toFixed(2)}px, ${z.toFixed(1)}px) scale(${swell.toFixed(4)})`;

    if (glow) glow.style.opacity = String(clamp(1 - p / P_FILL, 0, 1));
    if (mist) {
      mist.style.opacity   = String(Math.sin(clamp(d, 0, 1) * Math.PI) * 0.95);
      mist.style.transform = `translate3d(0, ${(-14 + 46 * de).toFixed(1)}%, 0)`;
    }

    /* the next section's heading is already sitting behind the device, so the
       mist clears onto copy rather than onto an empty screen */
    if (reveal) {
      const r = ease(clamp((p - 0.72) / 0.24, 0, 1));
      reveal.style.opacity   = String(r);
      reveal.style.transform = `translate3d(0, ${(30 * (1 - r)).toFixed(1)}px, 0)`;
    }
  }

  function progress() {
    const run = stage.offsetHeight - window.innerHeight;
    return run > 0 ? clamp(-stage.getBoundingClientRect().top / run, 0, 1) : 0;
  }

  let cur = 0, raf = 0, inView = false;
  function loop() {
    raf = 0;
    takeOver();
    const t = progress();
    cur = lerp(cur, t, 0.14);                       // critical damping
    if (Math.abs(t - cur) < 0.0004) cur = t;
    render(cur);
    if (inView || Math.abs(t - cur) >= 0.0004) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) kick(); },
                                      { rootMargin: '20% 0px' });

  function reset() {
    for (const el of [lap, copy, reveal, mist, glow]) {
      if (!el) continue;
      el.style.transform = ''; el.style.opacity = ''; el.style.filter = '';
    }
    lap.style.webkitMaskPosition = ''; lap.style.maskPosition = '';
    if (after) after.style.marginTop = '';
  }

  let on = false;
  function enable() {
    if (on) return;
    on = true;
    document.documentElement.classList.add('is-scrolly');
    measure(); cur = progress(); render(cur);
    io.observe(stage);
    window.addEventListener('scroll', kick, { passive: true });
  }
  function disable() {
    if (!on) return;
    on = false;
    document.documentElement.classList.remove('is-scrolly');
    io.unobserve(stage);
    window.removeEventListener('scroll', kick);
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    reset();
  }
  /* the revealed block has to fit the pinned viewport, or the cards get
     clipped — on anything shorter, fall back to the plain static page */
  /* Pick the widest layout that still fits the pin, so the block sits as close
     to full-height as it can without any card being clipped: try 2 columns,
     fall back to 3 (shorter), and only give up on pinning if neither fits.
     Measured with .is-scrolly applied — the static layout has different rules. */
  function revealFits() {
    if (!reveal) return true;
    const inner = reveal.querySelector('.svc-reveal__in');
    if (!inner) return true;
    const root = document.documentElement;
    const had  = root.classList.contains('is-scrolly');
    if (!had) root.classList.add('is-scrolly');
    const was = reveal.style.opacity;
    reveal.style.opacity = '0';

    /* against the block's CONTENT box — the viewport height alone ignores the
       reveal's own top/bottom padding and lets a too-tall layout through */
    const cs = getComputedStyle(reveal);
    const avail = reveal.clientHeight
                - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 8;
    reveal.classList.remove('svc-reveal--tight');
    let h = inner.scrollHeight;
    if (h > avail) {
      reveal.classList.add('svc-reveal--tight');
      h = inner.scrollHeight;
    }

    /* Whatever height the block does not use is dead pin — the next section
       cannot begin until the full 100vh stage has scrolled past. Pull it up by
       that amount (less one normal section gap) so the page stays continuous.
       It is still off-screen during the dolly, so nothing overlaps. */
    if (after) {
      const slack = Math.max(0, avail - h - GAP);
      after.style.marginTop = slack ? `-${Math.round(slack)}px` : '';
    }

    reveal.style.opacity = was;
    if (!had) root.classList.remove('is-scrolly');
    return h <= avail;
  }

  function sync() {
    if (reduced.matches || small.matches || !revealFits()) disable();
    else { enable(); measure(); render(cur); }
  }

  /* while pinned, #what-we-build lives inside the stage, so a plain anchor
     jump would land on the hero and replay the whole thing — send it to the
     end of the stage, where the cards are actually on screen */
  document.querySelectorAll('a[href="#what-we-build"]').forEach(a => {
    a.addEventListener('click', (e) => {
      if (!on) return;
      e.preventDefault();
      const top = stage.getBoundingClientRect().top + window.scrollY;
      /* 'instant', not 'auto': the site sets scroll-behavior: smooth on <html>,
         and 'auto' defers to that — which travels the whole stage and replays
         the dolly on the way past. 'instant' lands on the cards directly. */
      window.scrollTo({ top: top + (stage.offsetHeight - window.innerHeight), behavior: 'instant' });
    });
  });

  sync();
  window.addEventListener('resize', () => { if (on) { measure(); kick(); } sync(); }, { passive: true });
  reduced.addEventListener('change', sync);
  small.addEventListener('change', sync);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (on) { measure(); kick(); } });
})();
