/* Interactive visual explainers for the standalone services site. */
(() => {
  'use strict';

  const audienceData = {
    executive: {
      image: '/media/audience/executive-wide-v2.png', alt: 'Executive custom view dashboard showing exposure score, critical assets, SLA health, exposure trend, remediation progress, and priority summary.',
      label: 'EXECUTIVE', kicker: 'BOARD-READY SNAPSHOT', title: 'Exposure at a glance', lede: 'Answer the question: are we getting safer?', chart: 'Risk trend', queue: 'What changed',
      metrics: [['EXPOSURE SCORE', '68', '↓ 12% vs last month'], ['CRITICAL ASSETS', '412', '38 remediated'], ['SLA HEALTH', '86%', 'above target']],
      bars: ['52%', '64%', '58%', '76%', '70%', '88%', '80%', '94%'],
      queueItems: [['Crown-jewel assets', '12'], ['Findings past SLA', '28'], ['Coverage gaps', '07']],
      insight: 'Decision signal: remediation is moving faster than new critical exposure.'
    },
    soc: {
      image: '/media/audience/operations.png', alt: 'SOC and operations custom view dashboard showing new critical findings, SLA breaches, unowned assets, remediation velocity, and a priority queue.',
      label: 'SOC / OPERATIONS', kicker: 'QUEUE / FAST RESPONSE', title: 'The queue that matters', lede: 'Answer what changed since yesterday and what crossed SLA.', chart: 'Remediation velocity', queue: 'Priority queue',
      metrics: [['NEW CRITICAL', '24', '5 newly exploitable'], ['SLA BREACHES', '28', '12 need escalation'], ['UNOWNED ASSETS', '07', '3 critical']],
      bars: ['38%', '52%', '46%', '62%', '58%', '74%', '68%', '86%'],
      queueItems: [['Newly exploitable', '09'], ['Crossed SLA', '28'], ['No owner assigned', '07']],
      insight: 'Decision signal: 9 newly exploitable findings need triage before the next shift.'
    },
    compliance: {
      image: '/media/audience/compliance.png', alt: 'Compliance custom view dashboard showing control health, open exceptions, evidence readiness, framework coverage, and an evidence queue.',
      label: 'COMPLIANCE', kicker: 'CONTROL / EVIDENCE', title: 'Audit readiness, without the scramble', lede: 'Answer what is compliant, what is open, and where the evidence lives.', chart: 'Control health', queue: 'Evidence gaps',
      metrics: [['CONTROL HEALTH', '94%', 'above target'], ['OPEN EXCEPTIONS', '17', 'down 4 this month'], ['EVIDENCE READY', '86%', 'mapped to controls']],
      bars: ['62%', '68%', '74%', '70%', '78%', '82%', '90%', '94%'],
      queueItems: [['Missing evidence', '06'], ['Open exceptions', '17'], ['Policy drift', '03']],
      insight: 'Decision signal: evidence is mapped, exceptions are owned, and the audit trail is export-ready.'
    }
  };

  const tabButtons = [...document.querySelectorAll('[data-audience-tab]')];
  const panel = document.querySelector('#audiencePanel');
  const frame = document.querySelector('.svc-compare__frame');
  const compareHandle = document.querySelector('.svc-compare__handle');
  const compareMin = 0;
  const compareMax = 100;

  function updateAudience(name) {
    const data = audienceData[name];
    if (!data || !panel) return;

    tabButtons.forEach((button) => {
      const active = button.dataset.audienceTab === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });

    panel.classList.remove('is-switching');
    requestAnimationFrame(() => panel.classList.add('is-switching'));
    const image = panel.querySelector('[data-audience-image]');
    if (image) {
      image.src = data.image;
      image.alt = data.alt;
    }
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => updateAudience(button.dataset.audienceTab));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabButtons.length - 1;
      tabButtons[next].focus();
      updateAudience(tabButtons[next].dataset.audienceTab);
    });
  });

  function updateComparison(value) {
    if (!frame) return;
    const numeric = Math.min(compareMax, Math.max(compareMin, Number(value)));
    const position = `${numeric}%`;
    frame.style.setProperty('--compare-position', position);
    frame.style.setProperty('--compare-inverse', `${100 - numeric}%`);
    if (compareHandle) compareHandle.setAttribute('aria-valuenow', String(numeric));
  }

  if (frame && compareHandle) {
    let dragging = false;

    const updateFromPointer = (event) => {
      const bounds = frame.getBoundingClientRect();
      const value = ((event.clientX - bounds.left) / bounds.width) * 100;
      updateComparison(value);
    };

    frame.addEventListener('pointerdown', (event) => {
      dragging = true;
      frame.setPointerCapture(event.pointerId);
      updateFromPointer(event);
      event.preventDefault();
    });
    frame.addEventListener('pointermove', (event) => {
      if (dragging) updateFromPointer(event);
    });
    frame.addEventListener('pointerup', () => { dragging = false; });
    frame.addEventListener('pointercancel', () => { dragging = false; });

    compareHandle.addEventListener('keydown', (event) => {
      const current = Number(compareHandle.getAttribute('aria-valuenow')) || 50;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        updateComparison(current - 2);
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        updateComparison(current + 2);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        updateComparison(compareMin);
      }
      if (event.key === 'End') {
        event.preventDefault();
        updateComparison(compareMax);
      }
    });

    updateComparison(50);
  }
})();
