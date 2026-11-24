// ── family-link-card-editor ──────────────────────────────────────────────────
import { FAMILY_LINK_CARD_VERSION, pickerDefine } from "./card-picker.js";
import { FL_DEFAULTS } from "./i18n-helpers.js";
import { flLang } from "./helpers.js";
import { FamilyLinkCard } from "./card.js";
import { FamilyLinkMiniCard } from "./mini-card.js";
import { FamilyLinkI18n } from "./i18n/strings.js";

export var FL_LANGUAGES = [
  ['en', 'English'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['sr', 'Српски'],
  ['sr-Latn', 'Srpski (latinica)'],
  ['it', 'Italiano'],
  ['nl', 'Nederlands'],
  ['pt', 'Português (Portugal)'],
  ['pl', 'Polski'],
  ['ro', 'Română'],
  ['da', 'Dansk'],
  ['sv', 'Svenska'],
  ['bg', 'Български'],
  ['ru', 'Русский'],
  ['uk', 'Українська'],
  ['hu', 'Magyar'],
  ['sk', 'Slovenčina'],
  ['cs', 'Čeština'],
  ['sl', 'Slovenščina'],
  ['lv', 'Latviešu'],
  ['el', 'Ελληνικά'],
];

// children: the status sensors of the children (one per child); the entity picker offers only those, not the screen
// time, apps or other sensors of the integration (a selector cannot filter on the translation key).
export function flEditorSchema(t, devices, children) {
  var entity = children && children.length
    ? { include_entities: children }
    : { filter: { domain: 'sensor', integration: 'family_link' } };
  return [
    { name: 'entity', selector: { entity: entity } },
    { name: 'title', selector: { text: {} } },
    {
      type: 'grid',
      name: '',
      schema: [
        {
          name: 'device',
          selector: { select: { mode: 'dropdown', options: [{ value: '', label: t.type_auto }].concat(devices.map((d) => ({ value: d.id, label: d.name }))) } },
        },
        {
          name: 'device_type',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'auto', label: t.type_auto },
                { value: 'phone', label: t.type_phone },
                { value: 'tablet', label: t.type_tablet },
              ],
            },
          },
        },
      ],
    },
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'show_scene', selector: { boolean: {} } },
        { name: 'show_top_apps', selector: { boolean: {} } },
        { name: 'show_actions', selector: { boolean: {} } },
        { name: 'show_location', selector: { boolean: {} } },
        { name: 'illustration', selector: { boolean: {} } },
        {
          name: 'illustration_theme',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'auto', label: t.theme_auto },
                { value: 'day', label: t.theme_day },
                { value: 'night', label: t.theme_night },
              ],
            },
          },
        },
      ],
    },
    { name: 'trace_hours', selector: { number: { min: 1, max: 168, mode: 'box' } } },
    {
      name: 'language',
      selector: { select: { mode: 'dropdown', options: [{ value: '', label: t.lang_auto }].concat(FL_LANGUAGES.map((l) => ({ value: l[0], label: l[1] }))) } },
    },
  ];
}

export class FamilyLinkCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', this._valueChanged.bind(this));
      this.appendChild(this._form);
    }
    var children = FamilyLinkCard._findEntities(this._hass);
    var entity = this._config.entity || children[0];
    var devices = this._hass.states[entity]?.attributes?.devices || [];
    var lang = flLang(this._hass, this._config);
    var key = `${lang}|${devices.map((d) => d.id).join(',')}|${children.join(',')}`;
    if (key !== this._key) {
      this._key = key;
      var t = FamilyLinkI18n[lang].editor;
      this._form.schema = flEditorSchema(t, devices, children);
      this._form.computeLabel = (field) => t[field.name] || field.name;
    }
    this._form.hass = this._hass;
    // A new data object re-renders the whole form: handed over only when the config changed, not on every state change
    if (this._dataFor !== this._config) {
      this._dataFor = this._config;
      this._form.data = Object.assign({}, FL_DEFAULTS, this._config);
    }
  }

  _valueChanged(ev) {
    var value = Object.assign({}, ev.detail.value);
    Object.keys(FL_DEFAULTS).forEach((key) => {
      if (JSON.stringify(value[key]) === JSON.stringify(FL_DEFAULTS[key])) delete value[key];
    });
    ['title', 'language', 'device'].forEach((key) => {
      if (!value[key]) delete value[key];
    });
    this._config = value;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('family-link-card-editor')) pickerDefine('family-link-card-editor', FamilyLinkCardEditor);
if (!customElements.get('family-link-card')) {
  pickerDefine('family-link-card', FamilyLinkCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'family-link-card',
    name: 'Family Link',
    description: 'Your child’s phone or tablet: screen time, top apps, bonus, lock, ring, location route and emergency.',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-family-link',
  });
}
if (!customElements.get('family-link-mini-card')) {
  pickerDefine('family-link-mini-card', FamilyLinkMiniCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'family-link-mini-card',
    name: 'Family Link (mini)',
    description: 'Compact view of a child’s devices, with a button to open the full card.',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-family-link',
  });
}
console.info(`%c FAMILY-LINK-CARD %c ${FAMILY_LINK_CARD_VERSION} `, 'color:#fff;background:#34a853;font-weight:700', 'color:#34a853;background:#fff');
