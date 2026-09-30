(() => {
  'use strict';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const items = document.querySelectorAll('.kv-enter');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    items.forEach((item) => observer.observe(item));
    document.documentElement.classList.add('kv-motion');

    // "Introducing KAVACH" types itself out; the answer and the explain section wait for html.kv-typed.
    const title = document.querySelector('.kv-risk__bridge h2');
    const explain = document.getElementById('kavach');
    if (title && explain) {
      title.setAttribute('aria-label', title.textContent);
      const chars = [];
      (function split(node) {
        for (const child of [...node.childNodes]) {
          if (child.nodeType !== Node.TEXT_NODE) { split(child); continue; }
          child.replaceWith(...[...child.textContent].map((ch) => {
            const span = document.createElement('span');
            span.className = 'kv-type';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = ch;
            chars.push(span);
            return span;
          }));
        }
      })(title);
      const done = () => document.documentElement.classList.add('kv-typed');
      const typer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        typer.disconnect();
        // Landed past the title (nav jump, fast scroll): show it whole instead of making them wait.
        if (title.getBoundingClientRect().bottom < 0) { chars.forEach((c) => c.classList.add('on')); done(); return; }
        chars.forEach((span, i) => setTimeout(() => {
          chars[i - 1]?.classList.remove('caret');
          span.classList.add('on', 'caret');
          if (i === chars.length - 1) setTimeout(() => { span.classList.remove('caret'); done(); }, 650);
        }, 350 + i * 75));
      }, { rootMargin: '0px 0px -15% 0px' });
      typer.observe(title);
      typer.observe(explain);
    }
  }

  const clues = {
    photo: { title: 'A clue in the uniform', text: 'Clothing can reveal that someone serves, even when a post never says so.', result: 'Affiliation clue' },
    caption: { title: 'A clue on the wall', text: 'A visible calendar or caption can point to dates that were meant to stay private.', result: 'Timing clue' },
    routine: { title: 'A clue by the door', text: 'A packed travel bag can suggest an upcoming departure. Repeated posts can reveal a routine.', result: 'Movement clue' }
  };
  const tabs = [...document.querySelectorAll('[data-clue]')];
  const panel = document.getElementById('cluePanel');
  const clueCard = panel?.closest('.kv-clues');
  function selectClue(key, announce = false) {
    const clue = clues[key];
    if (!clue || !panel) return;
    const activeTab = tabs.find((tab) => tab.dataset.clue === key);
    const step = String(tabs.indexOf(activeTab) + 1).padStart(2, '0');
    tabs.forEach((tab) => {
      const active = tab === activeTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', activeTab.id);
    panel.setAttribute('aria-live', announce ? 'polite' : 'off');
    panel.dataset.step = step;
    document.getElementById('clueCount').textContent = `${step} / 03`;
    document.getElementById('clueTitle').textContent = clue.title;
    document.getElementById('clueText').textContent = clue.text;
    document.getElementById('clueResult').textContent = clue.result;
    if (!reducedMotion) {
      panel.classList.remove('is-changing');
      void panel.offsetWidth;
      panel.classList.add('is-changing');
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { selectClue(tab.dataset.clue, true); syncClueCycle(); });
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      selectClue(next.dataset.clue, true);
      syncClueCycle();
    });
  });

  let clueTimer;
  let clueVisible = !('IntersectionObserver' in window);
  let pointerOverClues = false;
  function syncClueCycle() {
    clearTimeout(clueTimer);
    if (!clueCard) return;
    clueCard.classList.remove('is-playing');
    if (reducedMotion || !clueVisible || document.hidden || pointerOverClues || clueCard.matches(':focus-within')) return;
    void clueCard.offsetWidth;
    clueCard.classList.add('is-playing');
    clueTimer = setTimeout(() => {
      const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
      selectClue(tabs[(current + 1) % tabs.length].dataset.clue);
      syncClueCycle();
    }, 5600);
  }
  if (clueCard && !reducedMotion) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        clueVisible = entry.intersectionRatio >= 0.35;
        syncClueCycle();
      }, { threshold: [0, 0.35] }).observe(clueCard);
    }
    clueCard.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      pointerOverClues = true;
      syncClueCycle();
    });
    clueCard.addEventListener('pointerleave', () => { pointerOverClues = false; syncClueCycle(); });
    clueCard.addEventListener('focusin', syncClueCycle);
    clueCard.addEventListener('focusout', () => setTimeout(syncClueCycle, 0));
    document.addEventListener('visibilitychange', syncClueCycle);
    syncClueCycle();
  }

  const choices = [...document.querySelectorAll('[data-choice]')];
  const feedback = document.getElementById('missionFeedback');
  choices.forEach((choice) => choice.addEventListener('click', () => {
    const safe = choice.dataset.choice === 'check';
    choices.forEach((button) => { button.disabled = true; });
    feedback.classList.toggle('is-risk', !safe);
    document.getElementById('missionFeedbackTitle').textContent = safe ? 'Good call. Verify the request.' : 'That could hand over sensitive details.';
    document.getElementById('missionFeedbackText').textContent = safe ? 'Use a trusted contact or known channel before sharing travel details. KAVACH builds that habit through practice.' : 'A message can impersonate someone you trust. Pause, verify the sender, and keep travel details private.';
    feedback.hidden = false;
  }));
  document.getElementById('missionReset')?.addEventListener('click', () => {
    choices.forEach((button) => { button.disabled = false; });
    feedback.hidden = true;
    choices[0]?.focus();
  });
})();
