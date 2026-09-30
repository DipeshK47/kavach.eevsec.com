const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

test('risk clues advance only while visible and unpaused', () => {
  const element = () => ({
    attrs: {}, listeners: {}, dataset: {}, textContent: '', offsetWidth: 100,
    classList: { add() {}, remove() {} },
    setAttribute(name, value) { this.attrs[name] = value; },
    getAttribute(name) { return this.attrs[name]; },
    addEventListener(name, handler) { this.listeners[name] = handler; },
    matches() { return false; }
  });
  const card = element();
  const panel = element();
  panel.closest = () => card;
  const tabs = ['photo', 'caption', 'routine'].map((key, index) => {
    const tab = element();
    tab.dataset.clue = key;
    tab.id = `clueTab${index}`;
    tab.attrs['aria-selected'] = String(index === 0);
    return tab;
  });
  const ids = Object.fromEntries(['cluePanel', 'clueCount', 'clueTitle', 'clueText', 'clueResult'].map((id) => [id, id === 'cluePanel' ? panel : element()]));
  const observers = [];
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
  }
  const timers = new Map();
  let timerId = 0;
  const document = {
    hidden: false,
    documentElement: { classList: { add() {} } },
    querySelectorAll(selector) { return selector === '[data-clue]' ? tabs : []; },
    querySelector() { return null; },
    getElementById(id) { return ids[id] || null; },
    addEventListener() {}
  };
  const source = readFileSync(join(__dirname, '../js/kavach.js'), 'utf8');
  vm.runInNewContext(source, {
    document, window: { IntersectionObserver }, IntersectionObserver,
    matchMedia: () => ({ matches: false }),
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }
  });

  assert.equal(timers.size, 0);
  observers.at(-1).callback([{ intersectionRatio: 0.8 }]);
  assert.equal(timers.size, 1);
  const [id, advance] = [...timers][0];
  timers.delete(id);
  advance();
  assert.equal(tabs[1].attrs['aria-selected'], 'true');
  assert.equal(ids.clueCount.textContent, '02 / 03');
  assert.equal(timers.size, 1);

  card.listeners.pointerenter({ pointerType: 'mouse' });
  assert.equal(timers.size, 0);
  card.listeners.pointerleave();
  assert.equal(timers.size, 1);
  observers.at(-1).callback([{ intersectionRatio: 0 }]);
  assert.equal(timers.size, 0);
});
