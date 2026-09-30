/* Contact page form — submits to Web3Forms (same inbox as the Byte widget,
   hi@eevsec.com). Static site, no backend. Inline validation + loading state
   + inline success/failure (no redirect). Honeypot via Web3Forms `botcheck`. */
(() => {
  'use strict';
  const form = document.getElementById('contactForm');
  if (!form) return;

  const name    = document.getElementById('cformName');
  const email   = document.getElementById('cformEmail');
  const topic   = document.getElementById('cformTopic');
  const message = document.getElementById('cformMsg');
  const subject = document.getElementById('cformSubject');
  const submit  = document.getElementById('cformSubmit');
  const status  = document.getElementById('cformStatus');
  const bot     = document.getElementById('cformBot');

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // inline email validation on blur
  email.addEventListener('blur', () => {
    if (email.value && !validEmail(email.value)) email.classList.add('is-invalid');
  });
  email.addEventListener('input', () => email.classList.remove('is-invalid'));

  function setStatus(msg, kind) {
    status.hidden = false;
    status.textContent = msg;
    status.className = 'cform__status' + (kind ? ' cform__status--' + kind : '');
  }

  function mailtoUrl() {
    const body = [
      `Name: ${name.value.trim()}`,
      `Organisation: ${document.getElementById('cformCompany').value.trim() || 'Not provided'}`,
      `Work email: ${email.value.trim()}`,
      `Organisation type: ${topic.value}`,
      '',
      message.value.trim()
    ].join('\n');
    return `mailto:hi@eevsec.com?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`;
  }

  function showMailFallback(detail) {
    status.hidden = false;
    status.className = 'cform__status cform__status--err';
    status.replaceChildren(document.createTextNode(detail + ' '));
    const link = document.createElement('a');
    link.href = mailtoUrl();
    link.textContent = 'Open an email draft';
    link.className = 'cform__fallback';
    status.append(link);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (bot && bot.checked) return;                 // honeypot tripped — silently drop

    if (!name.value.trim()) { setStatus('Please add your name.', 'err'); name.focus(); return; }
    const company = document.getElementById('cformCompany');
    if (!company.value.trim()) { setStatus('Please add your organisation.', 'err'); company.focus(); return; }
    if (!validEmail(email.value)) { setStatus('Please enter a valid email address.', 'err'); email.classList.add('is-invalid'); email.focus(); return; }
    if (!topic.value) { setStatus('Please choose an organisation type.', 'err'); topic.focus(); return; }
    if (!message.value.trim()) { setStatus('Please add a short message.', 'err'); message.focus(); return; }
    const captcha = form.querySelector('textarea[name="h-captcha-response"]');
    if (!captcha || !captcha.value) {
      setStatus('Please complete the hCaptcha check before sending.', 'err');
      return;
    }

    // route intent into the email subject line
    subject.value = '[' + topic.value + '] KAVACH demo request';

    submit.dataset.state = 'loading';
    submit.disabled = true;
    setStatus('Sending…', '');

    try {
      const payload = Object.fromEntries(new FormData(form));
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        form.reset();
        setStatus("Sent. We'll reply to your email, usually within one business day.", 'ok');
        if (window.track) window.track('contact_message_sent', { topic: topic.value });
      } else {
        showMailFallback(data.message ? `Online delivery failed: ${data.message}` : 'Online delivery failed.');
      }
    } catch (err) {
      showMailFallback('The online form is unavailable here.');
    } finally {
      delete submit.dataset.state;
      submit.disabled = false;
    }
  });
})();
