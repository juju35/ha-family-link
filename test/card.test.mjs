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
