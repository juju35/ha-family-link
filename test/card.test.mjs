// Unit tests for the card logic: the card file is evaluated with stubs, no browser needed.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../custom_components/family_link/frontend/family-link-card.js', import.meta.url), 'utf8');
const defined = {};
const context = {
  HTMLElement: class {
    setAttribute() {}
    toggleAttribute() {}
  },
  customElements: { get: (name) => defined[name], define: (name, cls) => (defined[name] = cls) },
  window: {},
  navigator: { language: 'en' },
  document: { addEventListener() {}, removeEventListener() {} },
  setInterval: () => 1,
  clearInterval() {},
  setTimeout: () => 1,
  clearTimeout() {},
  console: { info() {}, log: console.log },
};
vm.createContext(context);
vm.runInContext(
  `${source}\nthis.fl = { flEsc, flLang, flTr, flDuration, flAgo, flKm, FamilyLinkCard, FamilyLinkMiniCard, FamilyLinkI18n, flEditorSchema, FL_DEFAULTS };`,
  context,
);
const { flEsc, flLang, flTr, flDuration, flAgo, flKm, FamilyLinkCard, FamilyLinkMiniCard, FamilyLinkI18n, flEditorSchema } = context.fl;
const en = FamilyLinkI18n.en;
// Values made in the vm context come from another realm: compare plain copies.
const plain = (value) => JSON.parse(JSON.stringify(value));

test('elements are registered with their editor and picker entries', () => {
  assert.ok(defined['family-link-card']);
  assert.ok(defined['family-link-mini-card']);
  assert.ok(defined['family-link-card-editor']);
  assert.deepEqual(
    plain(context.window.customCards.map((c) => c.type)),
    ['family-link-card', 'family-link-mini-card'],
  );
});

test('every language has every key of English', () => {
  const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
  const reference = keys(en).sort();
  for (const [lang, table] of Object.entries(FamilyLinkI18n)) assert.deepEqual(keys(table).sort(), reference, lang);
});

test('escaping and translation placeholders', () => {
  assert.equal(flEsc('<b a="1">&</b>'), '&lt;b a=&quot;1&quot;&gt;&amp;&lt;/b&gt;');
  assert.equal(flTr(en, 'bonus_running', { n: 30 }), '+30 min bonus');
  assert.equal(flTr(en, 'missing_key'), 'missing_key');
});

test('language resolution', () => {
  assert.equal(flLang({ locale: { language: 'fr' } }, {}), 'fr');
  assert.equal(flLang({ locale: { language: 'fr-CA' } }, {}), 'fr');
  assert.equal(flLang({ locale: { language: 'xx' } }, {}), 'en');
  assert.equal(flLang({ locale: { language: 'fr' } }, { language: 'en' }), 'en');
});

test('durations', () => {
  assert.equal(flDuration(18, en), '18 min');
  assert.equal(flDuration(102, en), '1 h 42');
  assert.equal(flDuration(120, en), '2 h');
  assert.equal(flDuration(65, en), '1 h 05');
  assert.equal(flDuration(null, en), '—');
});

test('relative times', () => {
  const now = Date.parse('2026-11-14T17:00:00Z');
  assert.equal(flAgo('2026-11-14T16:59:40Z', en, now), 'just now');
  assert.equal(flAgo('2026-11-14T16:55:00Z', en, now), '5 min ago');
  assert.equal(flAgo('2026-11-14T14:00:00Z', en, now), '3 h ago');
  assert.equal(flAgo('nope', en, now), '');
});

test('route length', () => {
  const km = flKm([
    [48.1, -1.68],
    [48.11, -1.68],
  ]);
  assert.ok(km > 1.0 && km < 1.2, String(km));
  assert.equal(flKm([[48, -1]]), 0);
});

const device = (id, extra = {}) => ({ id, name: id, kind: 'phone', status: 'tracked', used: 10, remaining: null, top_apps: [], ...extra });

test('the device shown: configured, clicked, else the one needing most attention', () => {
  const card = new FamilyLinkCard();
  card.setConfig({ entity: 'sensor.alex_status' });
  const attrs = { devices: [device('a', { used: 50 }), device('b', { status: 'locked' }), device('c', { status: 'attention' })] };
  assert.equal(card._device(attrs).id, 'b');
  card._selected = 'c';
  assert.equal(card._device(attrs).id, 'c');
  card._selected = 'all';
  assert.equal(card._device(attrs), null);
  card._selected = 'A';
  assert.equal(card._device(attrs).id, 'a');
});

test('device drawing follows the option, else the device kind', () => {
  const card = new FamilyLinkCard();
  card.setConfig({});
  assert.equal(card._kind({ kind: 'tablet' }), 'tablet');
  assert.equal(card._kind({ kind: 'computer' }), 'tablet');
  assert.equal(card._kind({ kind: 'phone' }), 'phone');
  card.setConfig({ device_type: 'phone' });
  assert.equal(card._kind({ kind: 'tablet' }), 'phone');
});

test('child sensors are found by attribute or entity registry', () => {
  const hass = {
    states: {
      'sensor.alex_status': { attributes: { family_link: true } },
      'sensor.sam_status': { attributes: {} },
      'sensor.other': { attributes: {} },
    },
    entities: { 'sensor.sam_status': { platform: 'family_link', translation_key: 'status' } },
  };
  assert.deepEqual(plain(FamilyLinkCard._findEntities(hass)), ['sensor.alex_status', 'sensor.sam_status']);
  assert.deepEqual(plain(FamilyLinkCard.getStubConfig(hass)), { entity: 'sensor.alex_status' });
});

test('mini card starts compact and switches to the full card', () => {
  const mini = new FamilyLinkMiniCard();
  mini.setConfig({});
  mini._render = () => {};
  assert.equal(mini._compact(), true);
  assert.equal(mini.getCardSize(), 2);
  mini._setZoom(true);
  assert.equal(mini._compact(), false);
  assert.ok(mini.getCardSize() > 2);
});

test('next restriction', () => {
  const card = new FamilyLinkCard();
  card.setConfig({});
  card._hass = { locale: { language: 'en' } };
  const soon = new Date(Date.now() + 90 * 60000).toISOString();
  const later = new Date(Date.now() + 600 * 60000).toISOString();
  const next = card._nextWindow(device('a', { bedtime: { start: soon, end: later, active: false } }), en);
  assert.equal(next.label, 'Bedtime');
  assert.equal(next.value, 'in 1 h 30');
  assert.equal(card._nextWindow(device('a'), en), null);
});

test('editor schema lists the devices of the child', () => {
  const schema = flEditorSchema(en.editor, [{ id: 'p', name: 'Pixel 8' }]);
  const deviceField = schema[2].schema[0];
  assert.equal(deviceField.name, 'device');
  assert.deepEqual(
    plain(deviceField.selector.select.options.map((o) => o.value)),
    ['', 'p'],
  );
});

test('emergency without a picked device rings every device of the child', () => {
  const card = new FamilyLinkCard();
  const a = { child_name: 'Alex', devices: [device('Pixel'), device('Tab')], location: null, notify_service: null };
  const all = card._emergencyPopup(a, en, { type: 'emergency', ring: true });
  assert.ok(all.includes('data-key="ring"'));
  assert.ok(all.includes('Pixel, Tab'));
  const one = card._emergencyPopup(a, en, { type: 'emergency', device: 'Tab', ring: true });
  assert.ok(one.includes('data-key="ring"') && !one.includes('Pixel, Tab'));
  const none = card._emergencyPopup({ ...a, devices: [] }, en, { type: 'emergency', ring: true });
  assert.ok(!none.includes('data-key="ring"'));
});

test('school mode row: off, on by Pronote with the end of the school day and the blocked apps', () => {
  const card = new FamilyLinkCard();
  card._busy = {};
  assert.equal(card._schoolRow({}, en), '');
  const off = card._schoolRow({ school_mode: { active: false, pronote: 'sensor.x' } }, en);
  assert.ok(off.includes('aria-checked="false"') && off.includes('Pronote'));
  const on = card._schoolRow({ school_mode: { active: true, source: 'pronote', until: '2026-11-16T16:30:00+01:00', blocked: 12 } }, en);
  assert.ok(on.includes('class="switch on"') && on.includes('12 apps blocked') && on.includes('Pronote'));
});

test('the banner turns to night with the dark theme alone, the sun left aside', () => {
  const night = vm.runInContext('flIsNight', context);
  const hass = (sun, darkMode) => ({ states: sun ? { 'sun.sun': { state: sun } } : {}, themes: { darkMode } });
  assert.equal(night(hass('below_horizon', false), {}), false);
  assert.equal(night(hass('below_horizon', true), {}), true);
  assert.equal(night(hass('above_horizon', true), {}), true);
  assert.equal(night(hass('above_horizon', false), {}), false);
  assert.equal(night(hass('unavailable', true), {}), true);
  assert.equal(night(hass(null, false), {}), false);
  assert.equal(night(hass('above_horizon', true), { illustration_theme: 'day' }), false);
  assert.equal(night(hass('below_horizon', true), { illustration_theme: 'day' }), false);
  assert.equal(night(hass('above_horizon', false), { illustration_theme: 'night' }), true);
});

test('the status pill is placed by measure: beside the whole title, else under the subtitle, else its dot alone', () => {
  const css = FamilyLinkCard._styles();
  // No fixed width or share of the title block decides where the pill goes
  assert.doesNotMatch(css, /@container fl-titles|\.title-row > \.pill \{[^}]*max-width/);
  assert.match(css, /\.titles\.below \.title-row > \.pill \{ display: none; \}/);
  assert.match(css, /\.titles\.below \.pill-line \{ display: flex;/);
  assert.match(css, /\.titles\.dot-only \.pill \.pt \{ display: none; \}/);
  // Its dot alone on a card of 200 px or less
  assert.match(css, /@container fl-card \(max-width: 200px\) \{ \.pill \{ padding: 4px; \} \.pill \.pt \{ display: none; \} \}/);
  // Measured: the whole title, the room on its row, the line under the subtitle and the banner's floor
  const fit = FamilyLinkCard.prototype._fitPill.toString();
  for (const part of ['flTextWidth(name)', "classList.add('below')", "classList.add('dot-only')", "querySelector('.ground')", 'tx.scrollWidth <= tx.clientWidth'])
    assert.ok(fit.includes(part), `_fitPill measures ${part}`);
  // The subtitle keeps one line, its whole text in its tooltip
  const card = Object.create(FamilyLinkCard.prototype);
  const html = card._titles({}, en, 'tracked', 'Alex', 'Pixel 8 · 42 min left', '');
  assert.match(html, /<div class="sub" title="Pixel 8 · 42 min left">Pixel 8 · 42 min left<\/div>/);
  assert.match(html, /<div class="pill-line"><span class="pill"/);
});
