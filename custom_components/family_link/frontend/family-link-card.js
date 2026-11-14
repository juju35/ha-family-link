var FAMILY_LINK_CARD_VERSION = '1.0.0';

// ── i18n ──────────────────────────────────────────────────────────────────────
var FamilyLinkI18n = {
  en: {
    status_tracked: 'Tracked',
    status_attention: 'Attention',
    status_locked: 'Locked',
    status_not_tracked: 'Not tracked',
    devices: '{n} devices',
    device_one: '1 device',
    all: 'All',
    no_entity: 'No child found. Set up the Family Link integration, or set “entity” to a child’s status sensor.',
    unavailable: 'Family Link data is unavailable for now.',
    stale: 'Family Link unreachable: data of the last update',
    left: 'left',
    left_of: 'left of {limit}',
    used_today: 'used today',
    no_limit: 'no daily limit',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Screen time',
    top_apps: 'Top apps today',
    no_usage: 'No screen time yet today',
    app_limit: '{n} max',
    always_allowed: 'Always allowed',
    blocked: 'Blocked',
    location: 'Location',
    unknown_place: 'Somewhere',
    not_located: 'Not located',
    blocked_apps: 'Blocked apps',
    battery: 'Battery',
    bedtime: 'Bedtime',
    schooltime: 'School time',
    in: 'in {d}',
    until: 'until {t}',
    at: 'at {t}',
    none: '—',
    ago_now: 'just now',
    ago_min: '{n} min ago',
    ago_h: '{n} h ago',
    ago_d: '{n} d ago',
    locked_parent: 'Locked by a parent',
    locked_bedtime: 'Bedtime · until {t}',
    locked_school: 'School time · until {t}',
    locked_limit: 'Daily limit reached',
    break_title: 'Time for a break',
    break_hint: 'Calls and allowed apps still work',
    bonus_running: '+{n} min bonus',
    bonus_left: '{n} min left',
    bonus_until: 'until {t}',
    revoke: 'Revoke',
    revoke_confirm: 'Revoke the +{n} min bonus of {device}?',
    add: 'Add',
    add_minutes: 'Add {n} min',
    less: 'Less',
    more: 'More',
    lock: 'Lock',
    unlock: 'Unlock',
    ring: 'Ring',
    ringing: 'Ringing…',
    locate: 'Locate',
    emergency: 'Emergency',
    actions_for: 'Actions apply to {device}',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    show_full: 'Show the full card',
    show_compact: 'Back to the compact view',
    done: 'Done',
    failed: 'Failed: {error}',
    // Location popup
    today: 'Today',
    h24: '24 h',
    d7: '7 days',
    points: '{n} points',
    km: '{n} km',
    update_location: 'Update location',
    open_history: 'Open history',
    accuracy: '±{n} m',
    no_trace: 'No position recorded over this period',
    loading: 'Loading…',
    // Emergency popup
    emergency_title: 'Emergency · {name}',
    message: 'Message',
    quick_call: 'Call me back',
    quick_home: 'Come home',
    quick_where: 'Where are you?',
    opt_ring: 'Ring the device',
    opt_ring_hint: 'Family Link · even on silent',
    opt_notify: 'Critical notification with the message',
    opt_notify_hint: 'Home Assistant app · {service}',
    opt_locate: 'Ask for a fresh location',
    opt_locate_hint: 'Family Link · uses battery',
    send_emergency: 'Send emergency',
    emergency_sent: 'Emergency sent',
    editor: {
      entity: 'Child (status sensor)',
      title: 'Title',
      device: 'Device shown first',
      device_type: 'Device drawing',
      type_auto: 'Automatic',
      type_phone: 'Phone',
      type_tablet: 'Tablet',
      show_scene: 'Show the animated device',
      show_top_apps: 'Show the top apps',
      show_actions: 'Show the actions',
      show_location: 'Show the location',
      trace_hours: 'Route shown by default (hours)',
      language: 'Language',
      lang_auto: 'Automatic',
    },
  },
  fr: {
    status_tracked: 'Suivi',
    status_attention: 'Attention',
    status_locked: 'Verrouillé',
    status_not_tracked: 'Non suivi',
    devices: '{n} appareils',
    device_one: '1 appareil',
    all: 'Tous',
    no_entity: 'Aucun enfant trouvé. Configurez l’intégration Family Link, ou renseignez « entity » avec le capteur de statut d’un enfant.',
    unavailable: 'Les données Family Link sont indisponibles pour le moment.',
    stale: 'Family Link injoignable : données de la dernière mise à jour',
    left: 'restantes',
    left_of: 'restantes sur {limit}',
    used_today: 'utilisées aujourd’hui',
    no_limit: 'pas de limite quotidienne',
    min: '{n} min',
    h: '{h} h',
    hmin: '{h} h {m}',
    screen_time: 'Temps d’écran',
    top_apps: 'Applis les plus utilisées',
    no_usage: 'Pas encore de temps d’écran aujourd’hui',
    app_limit: '{n} max',
    always_allowed: 'Toujours autorisée',
    blocked: 'Bloquée',
    location: 'Position',
    unknown_place: 'Quelque part',
    not_located: 'Non localisé',
    blocked_apps: 'Applis bloquées',
    battery: 'Batterie',
    bedtime: 'Coucher',
    schooltime: 'École',
    in: 'dans {d}',
    until: 'jusqu’à {t}',
    at: 'à {t}',
    none: '—',
    ago_now: 'à l’instant',
    ago_min: 'il y a {n} min',
    ago_h: 'il y a {n} h',
    ago_d: 'il y a {n} j',
    locked_parent: 'Verrouillé par un parent',
    locked_bedtime: 'Coucher · jusqu’à {t}',
    locked_school: 'École · jusqu’à {t}',
    locked_limit: 'Limite du jour atteinte',
    break_title: 'C’est l’heure d’une pause',
    break_hint: 'Les appels et applis autorisées fonctionnent',
    bonus_running: 'Bonus +{n} min',
    bonus_left: 'encore {n} min',
    bonus_until: 'jusqu’à {t}',
    revoke: 'Révoquer',
    revoke_confirm: 'Révoquer le bonus de +{n} min de {device} ?',
    add: 'Ajouter',
    add_minutes: 'Ajouter {n} min',
    less: 'Moins',
    more: 'Plus',
    lock: 'Verrouiller',
    unlock: 'Déverrouiller',
    ring: 'Faire sonner',
    ringing: 'Sonnerie…',
    locate: 'Localiser',
    emergency: 'Urgence',
    actions_for: 'Les actions s’appliquent à {device}',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    close: 'Fermer',
    show_full: 'Afficher la carte complète',
    show_compact: 'Revenir à la vue compacte',
    done: 'C’est fait',
    failed: 'Échec : {error}',
    today: 'Aujourd’hui',
    h24: '24 h',
    d7: '7 jours',
    points: '{n} points',
    km: '{n} km',
    update_location: 'Actualiser la position',
    open_history: 'Ouvrir l’historique',
    accuracy: '±{n} m',
    no_trace: 'Aucune position enregistrée sur cette période',
    loading: 'Chargement…',
    emergency_title: 'Urgence · {name}',
    message: 'Message',
    quick_call: 'Rappelle-moi',
    quick_home: 'Rentre à la maison',
    quick_where: 'Où es-tu ?',
    opt_ring: 'Faire sonner l’appareil',
    opt_ring_hint: 'Family Link · même en silencieux',
    opt_notify: 'Notification critique avec le message',
    opt_notify_hint: 'Appli Home Assistant · {service}',
    opt_locate: 'Demander une position récente',
    opt_locate_hint: 'Family Link · consomme la batterie',
    send_emergency: 'Envoyer l’urgence',
    emergency_sent: 'Urgence envoyée',
    editor: {
      entity: 'Enfant (capteur de statut)',
      title: 'Titre',
      device: 'Appareil affiché en premier',
      device_type: 'Dessin de l’appareil',
      type_auto: 'Automatique',
      type_phone: 'Téléphone',
      type_tablet: 'Tablette',
      show_scene: 'Afficher l’appareil animé',
      show_top_apps: 'Afficher les applis les plus utilisées',
      show_actions: 'Afficher les actions',
      show_location: 'Afficher la position',
      trace_hours: 'Trajet affiché par défaut (heures)',
      language: 'Langue',
      lang_auto: 'Automatique',
    },
  },
};

var FL_DEFAULTS = {
  show_scene: true,
  show_top_apps: true,
  show_actions: true,
  show_location: true,
  device_type: 'auto',
  trace_hours: 24,
  bonus_presets: [15, 30, 60],
};

var FL_STATUS = {
  tracked: { color: '#34a853', tint: 'rgba(52,168,83,.18)' },
  attention: { color: '#f9ab00', tint: 'rgba(249,171,0,.18)' },
  locked: { color: '#ea4335', tint: 'rgba(234,67,53,.16)' },
  not_tracked: { color: '#9aa0a6', tint: 'rgba(154,160,166,.18)' },
};
var FL_SEVERITY = { tracked: 0, attention: 1, locked: 2, not_tracked: 3 };
var FL_APP_COLORS = ['#e8453c', '#4caf50', '#4285f4', '#f9ab00', '#a142f4', '#24c1e0', '#ff7043', '#8d6e63'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function flLang(hass, config) {
  var lang = String(config?.language || (hass && (hass.locale?.language || hass.language)) || navigator.language || 'en');
  if (FamilyLinkI18n[lang]) return lang;
  lang = lang.split('-')[0];
  return FamilyLinkI18n[lang] ? lang : 'en';
}

function flTr(t, key, vars) {
  var text = t[key] ?? FamilyLinkI18n.en[key] ?? key;
  Object.keys(vars || {}).forEach((k) => {
    text = text.split(`{${k}}`).join(vars[k]);
  });
  return text;
}

function flEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function flDuration(minutes, t) {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return t.none;
  var m = Math.max(0, Math.round(minutes));
  if (m < 60) return flTr(t, 'min', { n: m });
  var h = Math.floor(m / 60);
  var rest = m % 60;
  return rest ? flTr(t, 'hmin', { h: h, m: String(rest).padStart(2, '0') }) : flTr(t, 'h', { h: h });
}

function flAgo(iso, t, now) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  var minutes = Math.max(0, Math.round((now - ms) / 60000));
  if (minutes < 1) return t.ago_now;
  if (minutes < 60) return flTr(t, 'ago_min', { n: minutes });
  if (minutes < 48 * 60) return flTr(t, 'ago_h', { n: Math.round(minutes / 60) });
  return flTr(t, 'ago_d', { n: Math.round(minutes / 1440) });
}

function flClock(iso, hass) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  try {
    return new Date(ms).toLocaleTimeString(hass?.locale?.language || undefined, { hour: '2-digit', minute: '2-digit' });
  } catch (_err) {
    return new Date(ms).toTimeString().slice(0, 5);
  }
}

function flIsChild(state) {
  return !!state?.attributes?.family_link;
}

function flInDialog(ev) {
  return ev.composedPath().some((el) => el?.tagName && /^(HA-DIALOG|HA-MORE-INFO-DIALOG|MWC-DIALOG|HA-MD-DIALOG)$/.test(el.tagName));
}

function flKm(points) {
  var total = 0;
  for (var i = 1; i < points.length; i++) {
    var a = points[i - 1];
    var b = points[i];
    var rad = Math.PI / 180;
    var dLat = (b[0] - a[0]) * rad;
    var dLon = (b[1] - a[1]) * rad;
    var h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
    total += 12742 * Math.asin(Math.sqrt(h));
  }
  return total;
}

// Stroke icons, 24×24, drawn like the Material Design Icons line set
var FL_ICON_PATHS = {
  kite: '<path d="M12 2.2 3.4 9.8 12 21.4 20.6 9.8z"/><path d="M3.4 9.8h17.2M12 9.8v5.4M6.4 14l5.6 1.2 5.6-1.2"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  gift: '<circle cx="12" cy="13" r="8"/><path d="M12 9.5v7M8.5 13h7M9 2h6"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  collapse: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/>',
  tablet: '<rect x="2" y="5" width="20" height="14" rx="2"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  block: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  offline: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.4-1.8M2 8.8a15 15 0 0 1 4.2-2.7M22 8.8A15 15 0 0 0 11 5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
};

function flIcon(name, cls) {
  return `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${FL_ICON_PATHS[name] || ''}</svg>`;
}

// ── family-link-card ─────────────────────────────────────────────────────────
class FamilyLinkCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement('family-link-card-editor');
  }

  static getStubConfig(hass) {
    var found = FamilyLinkCard._findEntities(hass);
    return found.length ? { entity: found[0] } : {};
  }

  static _findEntities(hass) {
    if (!hass?.states) return [];
    var found = Object.keys(hass.states).filter((id) => id.startsWith('sensor.') && flIsChild(hass.states[id]));
    Object.keys(hass.entities || {}).forEach((id) => {
      var e = hass.entities[id];
      if (e.platform === 'family_link' && e.translation_key === 'status' && hass.states[id] && found.indexOf(id) === -1) found.push(id);
    });
    return found.sort();
  }

  constructor() {
    super();
    this._selected = null;
    this._popup = null; // { type: 'location' | 'emergency' | 'confirm', ... }
    this._busy = {};
    this._ringing = {};
    this._custom = 45;
    this._toast = null;
  }

  setConfig(config) {
    this._config = Object.assign({}, FL_DEFAULTS, config || {});
    if (this._config.device && !this._selected) this._selected = this._config.device;
    this._lastState = null;
    if (this._hass) this._render();
  }

  set hass(hass) {
    var first = !this._hass;
    this._hass = hass;
    var state = hass.states[this._entityId()];
    if (state !== this._lastState) {
      this._lastState = state;
      this._render();
    } else if (first) {
      this._render();
    }
    if (this._map) this._map.hass = hass;
  }

  connectedCallback() {
    this._onOutside =
      this._onOutside ||
      ((ev) => {
        if (!this._popup || flInDialog(ev)) return;
        if (ev.composedPath().includes(this)) return;
        this._closePopup();
      });
    document.addEventListener('click', this._onOutside, true);
    if (!this._timer) this._timer = setInterval(() => this._tick(), 30000);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutside, true);
    clearInterval(this._timer);
    this._timer = null;
    // Leaving the page closes a popup without running it
    if (this._popup) this._closePopup(true);
  }

  getCardSize() {
    return 9;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  _entityId() {
    var c = this._config || {};
    if (c.entity) return c.entity;
    if (!this._auto || !this._hass?.states[this._auto]) this._auto = FamilyLinkCard._findEntities(this._hass)[0];
    return this._auto;
  }

  _t() {
    return FamilyLinkI18n[flLang(this._hass, this._config)];
  }

  _state() {
    return this._hass?.states[this._entityId()];
  }

  _attrs() {
    return this._state()?.attributes || {};
  }

  // The device shown: the configured or clicked one, else the one needing most attention, else the first
  _device(attrs) {
    var devices = attrs.devices || [];
    if (this._selected === 'all' && devices.length > 1) return null;
    var wanted = this._selected;
    var found = devices.find((d) => d.id === wanted || (wanted && String(d.name).toLowerCase() === String(wanted).toLowerCase()));
    if (found) return found;
    return devices.slice().sort((a, b) => (FL_SEVERITY[b.status] || 0) - (FL_SEVERITY[a.status] || 0) || (b.used || 0) - (a.used || 0))[0] || null;
  }

  _kind(device) {
    var type = this._config.device_type;
    if (type === 'phone' || type === 'tablet') return type;
    return device && device.kind !== 'phone' ? 'tablet' : 'phone';
  }

  _ensureShell() {
    if (this._root) return;
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `<style>${FamilyLinkCard._styles()}</style><ha-card><div class="main"></div><div class="layer"></div><div class="toast" role="status" aria-live="polite"></div></ha-card>`;
    var card = this._root.querySelector('ha-card');
    card.addEventListener('click', this._onClick.bind(this));
    card.addEventListener('input', this._onInput.bind(this));
  }

  _render() {
    if (!this._config || !this._hass) return;
    this._ensureShell();
    var t = this._t();
    var state = this._state();
    var main = this._root.querySelector('.main');
    if (!state) {
      main.innerHTML = `<div class="empty">${flIcon('kite')}<span>${flEsc(t.no_entity)}</span></div>`;
      return;
    }
    var a = state.attributes || {};
    if (state.state === 'unavailable' || !a.family_link) {
      main.innerHTML = `${this._header(a, null, t, state)}<div class="empty">${flIcon('offline')}<span>${flEsc(t.unavailable)}</span></div>`;
      return;
    }
    main.innerHTML = this._compact() ? this._renderCompact(a, t, state) : this._renderFull(a, t, state);
    if (this._popup) this._renderPopup();
  }

  _compact() {
    return false;
  }

  _tick() {
    if (!this._root) return;
    var t = this._t();
    var now = Date.now();
    this._root.querySelectorAll('[data-ago]').forEach((el) => {
      el.textContent = flAgo(el.getAttribute('data-ago'), t, now);
    });
  }

  // ── Header ────────────────────────────────────────────────────────────────

  _status(_a, device, state) {
    if (device) return device.status;
    return state?.state in FL_STATUS ? state.state : 'not_tracked';
  }

  _header(a, device, t, state, extra) {
    var status = this._status(a, device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var devices = a.devices || [];
    var sub = devices.length === 1 ? t.device_one : flTr(t, 'devices', { n: devices.length });
    if (device && devices.length > 1) sub = `${device.name} · ${sub}`;
    else if (device) sub = device.name;
    var title = this._config.title || a.child_name || t.none;
    return `<div class="header">
      <div class="badge" style="--c:${s.color};--tint:${s.tint}">${flIcon('kite')}</div>
      <div class="titles"><div class="title">${flEsc(title)}</div><div class="sub">${flEsc(sub)}</div></div>
      <div class="pill" style="--c:${s.color};--tint:${s.tint}">${flEsc(t[`status_${status}`] || status)}</div>
      ${extra || ''}
    </div>`;
  }

  _chips(a, device, t) {
    var devices = a.devices || [];
    if (devices.length < 2) return '';
    var all = !device;
    var chips = devices
      .map((d) => {
        var s = FL_STATUS[d.status] || FL_STATUS.not_tracked;
        var sel = device && device.id === d.id;
        var sub = d.restricted ? this._restrictedShort(d, t) : d.remaining !== null && d.remaining !== undefined ? `${flDuration(d.used, t)} · ${flDuration(d.remaining, t)} ${t.left}` : flDuration(d.used, t);
        return `<button class="chip ${sel ? 'sel' : ''}" data-action="select" data-device="${flEsc(d.id)}" aria-pressed="${sel}">
          <span class="chip-ic" style="--c:${s.color}">${flIcon(this._kind(d) === 'tablet' ? 'tablet' : 'phone')}<i></i></span>
          <span class="chip-txt"><b>${flEsc(d.name)}</b><small style="${d.restricted ? `color:${s.color}` : ''}">${flEsc(sub)}</small></span>
        </button>`;
      })
      .join('');
    var total = devices.reduce((sum, d) => sum + (d.used || 0), 0);
    return `<div class="chips" role="group">${chips}<button class="chip all ${all ? 'sel' : ''}" data-action="select" data-device="all" aria-pressed="${all}"><span class="chip-txt"><b>${flEsc(t.all)}</b><small>${flEsc(flDuration(a.total_minutes ?? total, t))}</small></span></button></div>`;
  }

  _restrictedShort(d, t) {
    if (d.restricted === 'bedtime') return t.bedtime;
    if (d.restricted === 'schooltime') return t.schooltime;
    if (d.restricted === 'limit') return t.locked_limit;
    return t.status_locked;
  }

  _restrictedText(d, t) {
    if (!d) return '';
    if (d.restricted === 'bedtime') return flTr(t, 'locked_bedtime', { t: flClock(d.bedtime?.end, this._hass) });
    if (d.restricted === 'schooltime') return flTr(t, 'locked_school', { t: flClock(d.schooltime?.end, this._hass) });
    if (d.restricted === 'limit') return t.locked_limit;
    return t.locked_parent;
  }

  // ── Full card ─────────────────────────────────────────────────────────────

  _renderFull(a, t, state) {
    var device = this._device(a);
    var c = this._config;
    var html = this._header(a, device, t, state, this._detailButton ? this._detailButton(t) : '');
    if (a.stale) html += `<div class="note">${flIcon('offline')}<span>${flEsc(t.stale)}</span></div>`;
    html += this._chips(a, device, t);
    if (c.show_scene) html += this._scene(a, device, t);
    html += this._tiles(a, device, t);
    if (c.show_top_apps) html += this._topApps(device ? device.top_apps : a.top_apps, t);
    if (c.show_actions && device) html += this._actions(a, device, t);
    return html;
  }

  _scene(a, device, t) {
    var kind = this._kind(device || (a.devices || [])[0]);
    var restricted = device ? device.restricted : null;
    var status = this._status(a, device, this._state());
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var used = device ? device.used : a.total_minutes;
    var remaining = device ? device.remaining : null;
    var limit = device ? (device.bonus ? null : device.limit) : null;
    var week = (a.week || []).slice(-6);
    var maxWeek = Math.max(1, ...week.map((w) => w.minutes || 0));
    var bars = week
      .map((w, i) => `<i class="bar ${i === week.length - 1 ? 'today' : ''}" style="height:${Math.max(6, Math.round(((w.minutes || 0) / maxWeek) * 100))}%;animation-delay:${i * 0.08}s"></i>`)
      .join('');
    var apps = (device ? device.top_apps : a.top_apps) || [];
    var tiles = [];
    for (var i = 0; i < 6; i++) {
      var app = apps[i];
      if (!app) {
        tiles.push('<span class="app empty-app"></span>');
      } else if (app.blocked) {
        tiles.push(`<span class="app blocked-app" title="${flEsc(app.title)}">${flIcon('block')}</span>`);
      } else {
        var inner = app.icon ? `<img src="${flEsc(app.icon)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : flEsc(String(app.title || '?').charAt(0));
        tiles.push(`<span class="app" style="--app:${FL_APP_COLORS[i % FL_APP_COLORS.length]};animation-delay:${i * 0.3}s" title="${flEsc(app.title)}">${inner}</span>`);
      }
    }
    var big = remaining !== null && remaining !== undefined ? flDuration(remaining, t) : flDuration(used, t);
    var small = remaining !== null && remaining !== undefined ? (limit ? flTr(t, 'left_of', { limit: flDuration(limit, t) }) : t.left) : t.used_today;
    var screen = `<div class="screen-top"></div>
      <div class="screen-label">${flEsc(t.screen_time)}</div>
      <div class="week">${bars}</div>
      <div class="screen-big">${flEsc(big)}</div><div class="screen-small">${flEsc(small)}</div>
      <div class="apps">${tiles.join('')}</div>
      <div class="scan"></div>`;
    var lockLayer = restricted
      ? `<div class="dim"></div><div class="lockmsg"><div class="lockring">${flIcon(restricted === 'bedtime' ? 'moon' : restricted === 'schooltime' ? 'school' : 'lock')}</div><b>${flEsc(t.break_title)}</b><small>${flEsc(this._restrictedText(device, t))}</small><small class="hint">${flEsc(t.break_hint)}</small></div>`
      : '';
    var protectedNow = status === 'tracked' || status === 'attention';
    var loc = a.location;
    var mapTile = this._config.show_location
      ? `<button class="maptile ${loc?.fresh ? 'fresh' : 'old'}" data-action="location" aria-label="${flEsc(t.location)}"><span class="grid"></span>${loc ? '<span class="ping"></span><span class="dot"></span>' : flIcon('pin', 'nopin')}</button>`
      : '';
    return `<div class="scene ${kind}" style="--c:${s.color};--tint:${s.tint}">
      ${protectedNow ? '<span class="wave"></span><span class="wave w2"></span>' : ''}
      <div class="device ${kind} ${restricted ? 'locked' : ''}">${screen}${lockLayer}</div>
      <span class="shield ${protectedNow ? '' : 'off'}">${flIcon(restricted ? 'lock' : protectedNow ? 'shield' : 'offline')}</span>
      ${mapTile}
    </div>`;
  }

  _nextWindow(device, t) {
    if (!device) return null;
    var now = Date.now();
    var items = [];
    [['bedtime', 'moon'], ['schooltime', 'school']].forEach(([key, icon]) => {
      var w = device[key];
      if (!w) return;
      var start = Date.parse(w.start);
      var end = Date.parse(w.end);
      if (w.active) items.push({ label: t[key], value: flTr(t, 'until', { t: flClock(w.end, this._hass) }), icon: icon, at: end });
      else if (start > now) items.push({ label: t[key], value: flTr(t, 'in', { d: flDuration((start - now) / 60000, t) }), icon: icon, at: start });
    });
    items.sort((x, y) => x.at - y.at);
    return items[0] || null;
  }

  _tiles(a, device, t) {
    var loc = a.location;
    var place = loc ? loc.place || loc.address || t.unknown_place : t.not_located;
    var next = this._nextWindow(device, t);
    var tiles = [];
    if (this._config.show_location) {
      tiles.push(`<button class="tile clickable" data-action="location"><small>${flEsc(t.location)}</small><b>${flEsc(place)}</b>${loc?.time ? `<em data-ago="${flEsc(loc.time)}">${flEsc(flAgo(loc.time, t, Date.now()))}</em>` : ''}</button>`);
    }
    tiles.push(`<div class="tile"><small>${flEsc(t.blocked_apps)}</small><b>${flEsc(a.blocked_apps ?? 0)}</b></div>`);
    if (next) tiles.push(`<div class="tile"><small>${flEsc(next.label)}</small><b>${flEsc(next.value)}</b></div>`);
    else if (loc?.battery !== null && loc?.battery !== undefined) tiles.push(`<div class="tile"><small>${flEsc(t.battery)}</small><b>${flEsc(loc.battery)} %</b></div>`);
    return `<div class="tiles">${tiles.join('')}</div>`;
  }

  _topApps(apps, t) {
    apps = (apps || []).slice(0, 4);
    if (!apps.length) return `<div class="section"><div class="label">${flEsc(t.top_apps)}</div><div class="muted">${flEsc(t.no_usage)}</div></div>`;
    var max = Math.max(1, ...apps.map((x) => x.minutes || 0));
    var rows = apps
      .map((app, i) => {
        var color = FL_APP_COLORS[i % FL_APP_COLORS.length];
        var icon = app.icon ? `<img src="${flEsc(app.icon)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : flEsc(String(app.title || '?').charAt(0));
        var tag = app.blocked
          ? `<span class="tag red">${flEsc(t.blocked)}</span>`
          : app.always_allowed
            ? `<span class="tag green">${flEsc(t.always_allowed)}</span>`
            : app.limit
              ? `<span class="tag amber">${flEsc(flTr(t, 'app_limit', { n: flDuration(app.limit, t) }))}</span>`
              : '';
        return `<div class="app-row"><span class="app-ic" style="--app:${color}">${icon}</span>
          <div class="app-main"><div class="app-line"><span>${flEsc(app.title)}</span><span class="muted">${flEsc(flDuration(app.minutes, t))}</span></div>
          <div class="track"><i class="fill" style="width:${Math.round(((app.minutes || 0) / max) * 100)}%;background:${color};animation-delay:${0.15 + i * 0.15}s"></i></div></div>${tag}</div>`;
      })
      .join('');
    return `<div class="section"><div class="label">${flEsc(t.top_apps)}</div>${rows}</div>`;
  }

  _actions(a, device, t) {
    var presets = Array.isArray(this._config.bonus_presets) ? this._config.bonus_presets : FL_DEFAULTS.bonus_presets;
    var html = '';
    if (device.bonus_id && device.bonus) {
      var left = device.bonus_remaining ?? device.bonus;
      var ratio = Math.max(0, Math.min(1, left / Math.max(1, device.bonus)));
      var until = new Date(Date.now() + left * 60000).toISOString();
      html += `<div class="bonus"><span class="shine"></span>
        <span class="bonus-ring"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" class="ring-bg"/><circle cx="16" cy="16" r="14" class="ring-fg" style="stroke-dashoffset:${(88 * (1 - ratio)).toFixed(1)}"/></svg>${flIcon('gift')}</span>
        <div class="bonus-txt"><b>${flEsc(flTr(t, 'bonus_running', { n: device.bonus }))}</b><small>${flEsc(flTr(t, 'bonus_left', { n: left }))} · ${flEsc(flTr(t, 'bonus_until', { t: flClock(until, this._hass) }))}</small></div>
        <button class="btn red" data-action="revoke" ${this._busy.revoke ? 'disabled' : ''}>${flEsc(t.revoke)}</button></div>`;
    }
    html += `<div class="addrow"><span class="label inline">${flEsc(t.add)}</span>
      ${presets.map((m) => `<button class="pchip" data-action="bonus" data-minutes="${Number(m)}" aria-label="${flEsc(flTr(t, 'add_minutes', { n: m }))}" ${this._busy.bonus ? 'disabled' : ''}>+${Number(m)}</button>`).join('')}
      <span class="stepper"><button data-action="step" data-step="-15" aria-label="${flEsc(t.less)}">−</button><button class="stepval" data-action="bonus" data-minutes="custom" aria-label="${flEsc(flTr(t, 'add_minutes', { n: this._custom }))}">${this._custom}'</button><button data-action="step" data-step="15" aria-label="${flEsc(t.more)}">+</button></span></div>`;
    var locked = device.locked;
    var ringing = this._ringing[device.id] && this._ringing[device.id] > Date.now();
    html += `<div class="grid2">
      <button class="act" data-action="${locked ? 'unlock' : 'lock'}" ${this._busy.lock ? 'disabled' : ''}><span class="${locked ? 'green' : 'red'}">${flIcon(locked ? 'unlock' : 'lock')}</span>${flEsc(locked ? t.unlock : t.lock)}</button>
      <button class="act ${ringing ? 'ringing' : ''}" data-action="ring" ${device.can_ring === false ? 'disabled' : ''}><span class="blue bellwrap">${ringing ? '<i class="bellwave"></i>' : ''}${flIcon('bell', ringing ? 'swing' : '')}</span>${flEsc(ringing ? t.ringing : t.ring)}</button>
      <button class="act" data-action="location"><span class="blue">${flIcon('pin')}</span>${flEsc(t.locate)}</button>
      <button class="act sos" data-action="emergency"><span class="red">${flIcon('alert')}</span>${flEsc(t.emergency)}</button>
    </div>`;
    if ((a.devices || []).length > 1) html += `<div class="foot">${flEsc(flTr(t, 'actions_for', { device: device.name }))}</div>`;
    return `<div class="section actions">${html}</div>`;
  }

  // ── Events ────────────────────────────────────────────────────────────────

  _onInput(ev) {
    if (ev.target?.id === 'sos-msg' && this._popup?.type === 'emergency') this._popup.message = ev.target.value;
  }

  _onClick(ev) {
    var el = ev.target.closest?.('[data-action]');
    if (!el || el.disabled) return;
    var action = el.getAttribute('data-action');
    var a = this._attrs();
    var device = this._device(a);
    ev.stopPropagation();
    switch (action) {
      case 'detail':
        this._toggleDetail?.(ev);
        break;
      case 'select':
        this._selected = el.getAttribute('data-device');
        this._render();
        break;
      case 'step':
        this._custom = Math.max(5, Math.min(240, this._custom + Number(el.getAttribute('data-step'))));
        this._render();
        break;
      case 'bonus': {
        var raw = el.getAttribute('data-minutes');
        var minutes = raw === 'custom' ? this._custom : Number(raw);
        if (device && minutes > 0) this._call('add_bonus', { child: a.child_id, device: device.id, minutes: minutes }, 'bonus');
        break;
      }
      case 'revoke':
        if (device) this._openPopup({ type: 'confirm', action: 'revoke', device: device.id, bonus: device.bonus });
        break;
      case 'lock':
      case 'unlock':
        if (device) this._call(action, { child: a.child_id, device: device.id }, 'lock');
        break;
      case 'ring':
        if (device) {
          this._ringing[device.id] = Date.now() + 20000;
          setTimeout(() => this._render(), 20500);
          this._call('ring', { child: a.child_id, device: device.id }, 'ring');
        }
        break;
      case 'location':
        this._openPopup({ type: 'location', hours: Number(this._config.trace_hours) || 24 });
        break;
      case 'emergency':
        this._openPopup({ type: 'emergency', device: device?.id, message: '', ring: true, notify: !!a.notify_service, locate: false });
        break;
      case 'close':
        this._closePopup();
        break;
      case 'confirm-yes':
        if (this._popup?.action === 'revoke') this._call('revoke_bonus', { child: a.child_id, device: this._popup.device }, 'revoke');
        this._closePopup();
        break;
      case 'period':
        if (this._popup) {
          this._popup.hours = Number(el.getAttribute('data-hours'));
          this._popup.trace = null;
          this._popup.cursor = null;
          this._renderPopup();
        }
        break;
      case 'refresh-location':
        this._popup && (this._popup.refreshing = true);
        this._renderPopup();
        this._call('refresh_location', { child: a.child_id }, 'location').finally(() => {
          if (this._popup) {
            this._popup.refreshing = false;
            this._popup.trace = null;
            this._renderPopup();
          }
        });
        break;
      case 'history':
        this._moreInfo(a.tracker);
        break;
      case 'quick':
        if (this._popup) {
          this._popup.message = el.getAttribute('data-text');
          this._renderPopup();
        }
        break;
      case 'toggle':
        if (this._popup) {
          var key = el.getAttribute('data-key');
          this._popup[key] = !this._popup[key];
          this._renderPopup();
        }
        break;
      case 'send-emergency':
        this._sendEmergency(a);
        break;
      default:
        break;
    }
  }

  async _call(service, data, busyKey) {
    var t = this._t();
    this._busy[busyKey] = true;
    this._render();
    try {
      await this._hass.callService('family_link', service, data);
      this._showToast(t.done);
    } catch (err) {
      this._showToast(flTr(t, 'failed', { error: err?.message || err }), true);
    } finally {
      this._busy[busyKey] = false;
      this._render();
    }
  }

  async _sendEmergency(a) {
    var p = this._popup;
    var t = this._t();
    if (!p || p.sending) return;
    p.sending = true;
    this._renderPopup();
    var data = { child: a.child_id, message: p.message || '', ring: !!p.ring, refresh_location: !!p.locate };
    if (p.device) data.device = p.device;
    if (!p.notify) data.message = '';
    try {
      await this._hass.callService('family_link', 'emergency', data);
      this._closePopup();
      this._showToast(t.emergency_sent);
    } catch (err) {
      p.sending = false;
      this._renderPopup();
      this._showToast(flTr(t, 'failed', { error: err?.message || err }), true);
    }
  }

  _showToast(text, error) {
    var el = this._root?.querySelector('.toast');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('error', !!error);
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entityId }, bubbles: true, composed: true }));
  }

  // ── Popups (top of the card) ──────────────────────────────────────────────

  _openPopup(popup) {
    this._popup = popup;
    this._renderPopup();
  }

  _closePopup(silent) {
    this._popup = null;
    this._map = null;
    var layer = this._root?.querySelector('.layer');
    if (layer) layer.innerHTML = '';
    this._root?.querySelector('ha-card')?.classList.remove('has-popup');
    void silent;
  }

  _renderPopup() {
    var layer = this._root?.querySelector('.layer');
    if (!layer || !this._popup) return;
    var t = this._t();
    var a = this._attrs();
    var p = this._popup;
    this._root.querySelector('ha-card').classList.add('has-popup');
    if (p.type === 'confirm') {
      var dev = (a.devices || []).find((d) => d.id === p.device);
      layer.innerHTML = `<div class="popup" role="dialog"><div class="pop-head"><span class="pop-ic red">${flIcon('gift')}</span><b>${flEsc(flTr(t, 'revoke_confirm', { n: p.bonus, device: dev?.name || '' }))}</b></div>
        <div class="pop-btns"><button class="btn" data-action="close">${flEsc(t.cancel)}</button><button class="btn red" data-action="confirm-yes">${flEsc(t.revoke)}</button></div></div>`;
      return;
    }
    if (p.type === 'emergency') {
      layer.innerHTML = this._emergencyPopup(a, t, p);
      var area = layer.querySelector('#sos-msg');
      if (area && document.activeElement !== this && !p.focused) {
        p.focused = true;
        setTimeout(() => area.focus({ preventScroll: true }), 50);
      }
      return;
    }
    if (p.type === 'location') this._locationPopup(layer, a, t, p);
  }

  _emergencyPopup(a, t, p) {
    var dev = (a.devices || []).find((d) => d.id === p.device);
    var loc = a.location;
    var sub = [dev?.name, loc?.place, loc?.battery !== null && loc?.battery !== undefined ? `${loc.battery} %` : null].filter(Boolean).join(' · ');
    var check = (key, label, hint) =>
      `<button class="opt" data-action="toggle" data-key="${key}" role="checkbox" aria-checked="${!!p[key]}"><span class="box ${p[key] ? 'on' : ''}"></span><span><b>${flEsc(label)}</b><small>${flEsc(hint)}</small></span></button>`;
    return `<div class="popup sos-pop" role="dialog" aria-label="${flEsc(t.emergency)}">
      <div class="pop-head"><span class="pop-ic red pulse">${flIcon('alert')}</span><div class="pop-titles"><b>${flEsc(flTr(t, 'emergency_title', { name: a.child_name || '' }))}</b><small>${flEsc(sub)}</small></div><button class="icon-btn" data-action="close" aria-label="${flEsc(t.close)}">${flIcon('close')}</button></div>
      ${
        a.notify_service
          ? `<label class="lbl" for="sos-msg">${flEsc(t.message)}</label><textarea id="sos-msg" rows="3">${flEsc(p.message || '')}</textarea>
      <div class="quick">${[t.quick_call, t.quick_home, t.quick_where].map((q) => `<button class="qchip" data-action="quick" data-text="${flEsc(q)}">${flEsc(q)}</button>`).join('')}</div>`
          : ''
      }
      <div class="opts">${dev ? check('ring', t.opt_ring, t.opt_ring_hint) : ''}${a.notify_service ? check('notify', t.opt_notify, flTr(t, 'opt_notify_hint', { service: a.notify_service })) : ''}${check('locate', t.opt_locate, t.opt_locate_hint)}</div>
      <button class="btn red big" data-action="send-emergency" ${p.sending ? 'disabled' : ''}>${flEsc(t.send_emergency)}</button>
    </div>`;
  }

  _locationPopup(layer, a, t, p) {
    var loc = a.location;
    var title = `${a.child_name || ''} · ${loc ? loc.place || loc.address || t.unknown_place : t.not_located}`;
    var sub = loc
      ? [loc.time ? flAgo(loc.time, t, Date.now()) : null, loc.device, loc.battery !== null && loc.battery !== undefined ? `${loc.battery} %` : null, loc.accuracy ? flTr(t, 'accuracy', { n: loc.accuracy }) : null].filter(Boolean).join(' · ')
      : '';
    var trace = p.trace;
    var stats = trace ? `${flTr(t, 'km', { n: flKm(trace.map((x) => x.point)).toFixed(1) })} · ${flTr(t, 'points', { n: trace.length })}` : t.loading;
    var periods = [
      [this._todayHours(), t.today],
      [24, t.h24],
      [168, t.d7],
    ];
    var shell = layer.querySelector('.loc-pop');
    if (!shell) {
      layer.innerHTML = `<div class="popup loc-pop" role="dialog" aria-label="${flEsc(t.location)}">
        <div class="pop-head"><span class="pop-ic blue">${flIcon('pin')}</span><div class="pop-titles"><b class="loc-title"></b><small class="loc-sub"></small></div><button class="icon-btn" data-action="close" aria-label="${flEsc(t.close)}">${flIcon('close')}</button></div>
        <div class="periods" role="group"></div>
        <div class="mapbox"><div class="map-msg"></div></div>
        <div class="replay"><span class="r-start"></span><input type="range" min="0" max="1000" value="1000" aria-label="time"><span class="r-end"></span></div>
        <div class="pop-btns"><button class="btn blue" data-action="refresh-location"></button><button class="btn" data-action="history"></button></div>
      </div>`;
      shell = layer.querySelector('.loc-pop');
      shell.querySelector('input[type=range]').addEventListener('input', (ev) => {
        if (!this._popup) return;
        this._popup.cursor = Number(ev.target.value) / 1000;
        this._updateTrace();
      });
    }
    shell.querySelector('.loc-title').textContent = title;
    shell.querySelector('.loc-sub').textContent = sub;
    shell.querySelector('.periods').innerHTML =
      periods.map(([hours, label]) => `<button class="pchip ${Math.round(p.hours) === Math.round(hours) || (label === t.today && p.today) ? 'sel' : ''}" data-action="period" data-hours="${hours}">${flEsc(label)}</button>`).join('') +
      `<span class="stats">${flEsc(stats)}</span>`;
    shell.querySelector('[data-action=refresh-location]').innerHTML = `${flIcon('refresh', p.refreshing ? 'spin' : '')}${flEsc(t.update_location)}`;
    shell.querySelector('[data-action=history]').innerHTML = `${flIcon('history')}${flEsc(t.open_history)}`;
    this._ensureMap(shell, a, t);
    if (!trace && !p.loading) this._loadTrace(a);
    else this._updateTrace();
  }

  _todayHours() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(1, (now - midnight) / 3600000);
  }

  _ensureMap(shell, a, _t) {
    var box = shell.querySelector('.mapbox');
    if (this._map && box.contains(this._map)) return;
    var create = () => {
      if (this._popup?.type !== 'location') return;
      var map = document.createElement('ha-map');
      map.hass = this._hass;
      map.entities = a.tracker ? [{ entity_id: a.tracker, color: FL_STATUS.tracked.color }] : [];
      map.autoFit = true;
      map.fitZones = false;
      map.zoom = 14;
      map.darkMode = !!this._hass.themes?.darkMode;
      map.renderPassive = false;
      this._map = map;
      box.appendChild(map);
      this._updateTrace();
    };
    if (customElements.get('ha-map')) {
      create();
      return;
    }
    // The map element ships with the Map card: load it once through the card helpers
    window
      .loadCardHelpers?.()
      .then((helpers) => helpers.createCardElement({ type: 'map', entities: a.tracker ? [a.tracker] : [] }))
      .then(() => customElements.whenDefined('ha-map'))
      .then(create)
      .catch(() => {});
  }

  async _loadTrace(a) {
    var p = this._popup;
    if (!p || !a.tracker) {
      if (p) p.trace = [];
      return;
    }
    p.loading = true;
    var end = new Date();
    var start = new Date(end.getTime() - p.hours * 3600000);
    try {
      var result = await this._hass.callWS({
        type: 'history/history_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [a.tracker],
        minimal_response: false,
        no_attributes: false,
        significant_changes_only: false,
      });
      var rows = result?.[a.tracker] || [];
      var points = [];
      var last = null;
      rows.forEach((row) => {
        var attrs = row.a || row.attributes || {};
        var lat = Number(attrs.latitude);
        var lon = Number(attrs.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
        if (last && last[0] === lat && last[1] === lon) return;
        last = [lat, lon];
        var ts = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated || row.last_changed);
        points.push({ point: [lat, lon], timestamp: new Date(ts) });
      });
      if (this._popup === p) p.trace = points;
    } catch (_err) {
      if (this._popup === p) p.trace = [];
    }
    p.loading = false;
    if (this._popup === p) this._renderPopup();
  }

  _updateTrace() {
    var p = this._popup;
    var shell = this._root?.querySelector('.loc-pop');
    if (!p || !shell) return;
    var trace = p.trace || [];
    var msg = shell.querySelector('.map-msg');
    var t = this._t();
    msg.textContent = p.trace === null || p.trace === undefined ? t.loading : trace.length ? '' : t.no_trace;
    msg.style.display = msg.textContent ? '' : 'none';
    var replay = shell.querySelector('.replay');
    replay.style.display = trace.length > 1 ? '' : 'none';
    var cut = trace;
    if (trace.length > 1) {
      var first = trace[0].timestamp.getTime();
      var lastTs = trace[trace.length - 1].timestamp.getTime();
      var at = first + (lastTs - first) * (p.cursor ?? 1);
      cut = trace.filter((x) => x.timestamp.getTime() <= at);
      shell.querySelector('.r-start').textContent = flClock(new Date(first).toISOString(), this._hass);
      shell.querySelector('.r-end').textContent = flClock(new Date(at).toISOString(), this._hass);
    }
    if (this._map) {
      this._map.paths = cut.length > 1 ? [{ points: cut, color: '#4285f4', gradualOpacity: 0.8, fullDatetime: p.hours > 24 }] : [];
    }
  }

  static _styles() {
    return `
      :host { display: block; }
      ha-card { position: relative; padding: 16px; overflow: hidden; display: flex; flex-direction: column; gap: 14px; color: var(--primary-text-color); }
      .main { display: flex; flex-direction: column; gap: 14px; }
      .ic { width: 20px; height: 20px; flex: none; }
      .header { display: flex; align-items: center; gap: 12px; }
      .badge { width: 40px; height: 40px; border-radius: 50%; background: var(--tint); color: var(--c); display: flex; align-items: center; justify-content: center; flex: none; transition: background .4s, color .4s; }
      .badge .ic { width: 24px; height: 24px; }
      .titles { flex: 1; min-width: 0; }
      .title { font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pill { padding: 4px 10px; border-radius: 999px; background: var(--tint); color: var(--c); font-size: 12px; font-weight: 500; white-space: nowrap; }
      .zoom, .icon-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; color: var(--secondary-text-color); display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; align-self: flex-start; }
      .zoom .ic, .icon-btn .ic { width: 18px; height: 18px; }
      .empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; text-align: center; color: var(--secondary-text-color); font-size: 13px; }
      .empty .ic { width: 32px; height: 32px; }
      .note { display: flex; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 10px; background: rgba(249,171,0,.12); color: var(--warning-color, #f9ab00); font-size: 12px; }
      .note .ic { width: 16px; height: 16px; }
      .muted { color: var(--secondary-text-color); font-size: 12px; }
      .label { font-size: 12px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .6px; }
      .label.inline { text-transform: none; letter-spacing: 0; margin-right: 2px; }
      button { font: inherit; color: inherit; }
      button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }

      /* Device chips */
      .chips { display: flex; gap: 6px; }
      .chip { flex: 1; min-width: 0; min-height: 44px; padding: 6px 10px; border-radius: 12px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.06); display: flex; align-items: center; gap: 8px; cursor: pointer; text-align: left; }
      .chip.all { flex: none; }
      .chip.sel { border-color: rgba(52,168,83,.6); background: rgba(52,168,83,.10); }
      .chip-ic { position: relative; display: flex; color: var(--secondary-text-color); }
      .chip.sel .chip-ic { color: var(--primary-text-color); }
      .chip-ic .ic { width: 16px; height: 16px; }
      .chip-ic i { position: absolute; right: -3px; bottom: -2px; width: 7px; height: 7px; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 2px var(--card-background-color, #1c1f26); }
      .chip-txt { min-width: 0; display: flex; flex-direction: column; }
      .chip-txt b { font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .chip-txt small { font-size: 10px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      /* Scene */
      .scene { position: relative; height: 290px; display: flex; align-items: center; justify-content: center; }
      .scene.tablet { height: 230px; }
      .wave { position: absolute; width: 170px; height: 170px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; animation: fl-wave 2.4s ease-out infinite; }
      .wave.w2 { animation-delay: 1.2s; }
      .device { position: relative; background: #0b0d11; border: 3px solid #3c4049; box-shadow: 0 16px 40px rgba(0,0,0,.45); box-sizing: border-box; overflow: hidden; color: #e3e3e3; display: flex; flex-direction: column; gap: 6px; }
      .device.phone { width: 132px; height: 260px; border-radius: 24px; padding: 10px 8px; animation: fl-float 4s ease-in-out infinite; }
      .device.tablet { width: 300px; height: 196px; border-radius: 20px; padding: 12px 16px; animation: fl-float-t 4.4s ease-in-out infinite; display: grid; grid-template-columns: 1fr 1.2fr; grid-template-rows: auto auto 1fr auto; column-gap: 14px; }
      .screen-top { width: 36px; height: 5px; border-radius: 3px; background: #2a2e37; align-self: center; flex: none; }
      .tablet .screen-top { display: none; }
      .screen-label { font-size: 9px; color: #9aa0a6; text-align: center; }
      .week { display: flex; align-items: flex-end; justify-content: center; gap: 4px; height: 64px; flex: none; }
      .week .bar { width: 10px; border-radius: 3px; background: #3c4049; transform-origin: bottom; animation: fl-rise 1.4s cubic-bezier(.2,.8,.2,1) both; }
      .week .bar.today { background: var(--c); }
      .screen-big { font-size: 19px; font-weight: 700; text-align: center; line-height: 1.1; }
      .screen-small { font-size: 9px; color: #9aa0a6; text-align: center; margin-top: -4px; }
      .apps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; padding: 2px 6px; }
      .tablet .screen-label { grid-column: 1; grid-row: 1; text-align: left; }
      .tablet .week { grid-column: 1; grid-row: 2 / 4; height: auto; justify-content: flex-start; }
      .tablet .screen-big { grid-column: 2; grid-row: 1; text-align: left; }
      .tablet .screen-small { grid-column: 2; grid-row: 2; text-align: left; margin: 0; }
      .tablet .apps { grid-column: 2; grid-row: 3 / 5; align-content: end; }
      .app { height: 26px; border-radius: 8px; background: var(--app); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; overflow: hidden; animation: fl-bob 2.2s ease-in-out infinite; }
      .app img { width: 100%; height: 100%; object-fit: cover; }
      .empty-app { background: #2a2e37; animation: none; }
      .blocked-app { background: #2a2e37; color: #f28b82; animation: none; }
      .blocked-app .ic { width: 12px; height: 12px; }
      .scan { position: absolute; left: 0; right: 0; top: 0; height: 60px; background: linear-gradient(180deg, transparent, rgba(129,201,149,.10), transparent); animation: fl-scan 3.2s linear infinite; pointer-events: none; }
      .device.locked .scan { display: none; }
      .device.locked > :not(.dim):not(.lockmsg) { opacity: .12; filter: grayscale(1); }
      .dim { position: absolute; inset: 0; background: rgba(11,13,17,.9); animation: fl-dim 3s ease-in-out infinite; }
      .lockmsg { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; text-align: center; padding: 8px; animation: fl-drop .9s cubic-bezier(.2,.8,.2,1) both; }
      .lockring { width: 56px; height: 56px; border-radius: 50%; background: rgba(242,139,130,.16); border: 2px solid rgba(242,139,130,.5); color: #f28b82; display: flex; align-items: center; justify-content: center; }
      .lockring .ic { width: 28px; height: 28px; }
      .lockmsg b { font-size: 12px; }
      .lockmsg small { font-size: 10px; color: #c4c7cc; }
      .lockmsg .hint { color: #9aa0a6; font-size: 9px; }
      .phone .lockmsg .hint { display: none; }
      .shackle { animation: fl-shackle 2.6s ease-in-out infinite; }
      .shield { position: absolute; right: calc(50% - 110px); top: 22px; width: 44px; height: 44px; border-radius: 50%; background: var(--card-background-color, #1c1f26); border: 2px solid var(--c); color: var(--c); display: flex; align-items: center; justify-content: center; animation: fl-pulse 2.4s ease-in-out infinite; }
      .tablet .shield { right: calc(50% - 186px); top: 0; }
      .shield.off { animation: none; }
      .maptile { position: absolute; left: calc(50% - 128px); bottom: 26px; width: 58px; height: 58px; border-radius: 14px; background: var(--secondary-background-color, #232730); border: 1px solid var(--divider-color, rgba(127,127,127,.2)); overflow: hidden; cursor: pointer; padding: 0; }
      .tablet .maptile { left: calc(50% - 196px); bottom: 0; }
      .maptile .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(127,127,127,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(127,127,127,.12) 1px, transparent 1px); background-size: 12px 12px; }
      .maptile .dot { position: absolute; left: 25px; top: 25px; width: 8px; height: 8px; border-radius: 50%; background: #4285f4; box-shadow: 0 0 0 2px var(--secondary-background-color, #232730); }
      .maptile .ping { position: absolute; left: 22px; top: 22px; width: 14px; height: 14px; border-radius: 50%; background: rgba(66,133,244,.55); animation: fl-ping 2s ease-out infinite; }
      .maptile.old .dot { background: #9aa0a6; }
      .maptile.old .ping { display: none; }
      .maptile .nopin { position: absolute; left: 19px; top: 19px; color: var(--secondary-text-color); }

      /* Tiles, apps */
      .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); grid-auto-flow: column; gap: 8px; }
      .tile { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 2px; min-width: 0; border: none; text-align: left; }
      .tile.clickable { cursor: pointer; }
      .tile small { font-size: 11px; color: var(--secondary-text-color); }
      .tile b { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tile em { font-style: normal; font-size: 11px; color: var(--secondary-text-color); }
      .section { display: flex; flex-direction: column; gap: 8px; }
      .app-row { display: flex; align-items: center; gap: 8px; }
      .app-ic { width: 22px; height: 22px; flex: none; border-radius: 6px; background: var(--app); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .app-ic img { width: 100%; height: 100%; object-fit: cover; }
      .app-main { flex: 1; min-width: 0; }
      .app-line { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; }
      .app-line span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .track { height: 5px; border-radius: 3px; background: rgba(127,127,127,.18); margin-top: 4px; overflow: hidden; }
      .fill { display: block; height: 5px; border-radius: 3px; transform-origin: left; animation: fl-grow 1.1s cubic-bezier(.2,.8,.2,1) both; }
      .tag { font-size: 10px; padding: 2px 6px; border-radius: 999px; white-space: nowrap; }
      .tag.amber { color: #f9ab00; background: rgba(249,171,0,.12); }
      .tag.green { color: #34a853; background: rgba(52,168,83,.12); }
      .tag.red { color: #ea4335; background: rgba(234,67,53,.12); }

      /* Actions */
      .bonus { position: relative; overflow: hidden; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(52,168,83,.4); background: rgba(52,168,83,.08); }
      .shine { position: absolute; top: 0; bottom: 0; left: 0; width: 30%; background: linear-gradient(90deg, transparent, rgba(52,168,83,.12), transparent); animation: fl-shine 2.6s ease-in-out infinite; pointer-events: none; }
      .bonus-ring { position: relative; width: 36px; height: 36px; flex: none; color: #34a853; }
      .bonus-ring svg { width: 36px; height: 36px; transform: rotate(-90deg); }
      .bonus-ring .ring-bg { fill: none; stroke: rgba(127,127,127,.25); stroke-width: 3; }
      .bonus-ring .ring-fg { fill: none; stroke: #34a853; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 88; transition: stroke-dashoffset 1s; }
      .bonus-ring .ic { position: absolute; left: 10px; top: 10px; width: 16px; height: 16px; }
      .bonus-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .bonus-txt b { font-size: 13px; font-weight: 500; }
      .bonus-txt small { font-size: 12px; color: #34a853; }
      .btn { min-height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.08); cursor: pointer; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
      .btn.red { color: #ea4335; border-color: rgba(234,67,53,.4); background: rgba(234,67,53,.07); }
      .btn.blue { color: #4285f4; }
      .btn.big { min-height: 48px; font-size: 15px; font-weight: 700; width: 100%; }
      .btn:disabled, .act:disabled, .pchip:disabled { opacity: .5; cursor: default; }
      .addrow { display: flex; gap: 6px; align-items: center; }
      .pchip { flex: 1; min-height: 40px; border-radius: 999px; border: 1px solid rgba(52,168,83,.4); background: rgba(52,168,83,.08); color: #34a853; font-size: 13px; font-weight: 500; cursor: pointer; }
      .stepper { display: flex; align-items: center; border-radius: 999px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.05); }
      .stepper button { width: 32px; height: 40px; border: none; background: transparent; color: var(--secondary-text-color); font-size: 16px; cursor: pointer; }
      .stepper .stepval { width: auto; min-width: 40px; color: #34a853; font-size: 13px; font-weight: 500; }
      .grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .act { min-height: 56px; border-radius: 14px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: rgba(127,127,127,.07); font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
      .act.ringing { border-color: rgba(66,133,244,.45); background: rgba(66,133,244,.09); }
      .act.sos { color: #ea4335; border-color: rgba(234,67,53,.55); background: rgba(234,67,53,.07); font-weight: 700; animation: fl-sos 2s ease-out infinite; }
      .red { color: #ea4335; } .green { color: #34a853; } .blue { color: #4285f4; }
      .bellwrap { position: relative; display: flex; }
      .bellwave { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid rgba(66,133,244,.5); animation: fl-wave-s 1.8s ease-out infinite; }
      .swing { transform-origin: 50% 10%; animation: fl-bell 1.8s ease-in-out infinite; }
      .foot { font-size: 11px; color: var(--secondary-text-color); text-align: center; }

      /* Popups: at the top of the card */
      .layer { position: absolute; left: 0; right: 0; top: 0; z-index: 5; pointer-events: none; }
      .popup { pointer-events: auto; margin: 10px; background: var(--card-background-color, #20242c); border: 1px solid var(--divider-color, rgba(127,127,127,.25)); border-radius: 16px; padding: 14px; box-shadow: 0 18px 50px rgba(0,0,0,.45); display: flex; flex-direction: column; gap: 12px; animation: fl-in .3s ease-out both; }
      .sos-pop { border-color: rgba(234,67,53,.4); }
      .pop-head { display: flex; align-items: center; gap: 10px; }
      .pop-head > b { flex: 1; font-size: 14px; font-weight: 500; }
      .pop-ic { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none; }
      .pop-ic.red { background: rgba(234,67,53,.14); }
      .pop-ic.blue { background: rgba(66,133,244,.14); }
      .pop-ic.pulse { animation: fl-sos 2s ease-out infinite; }
      .pop-titles { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .pop-titles b { font-size: 15px; font-weight: 500; }
      .pop-titles small { font-size: 12px; color: var(--secondary-text-color); }
      .pop-btns { display: flex; gap: 8px; }
      .pop-btns .btn { flex: 1; min-height: 44px; }
      .lbl { font-size: 12px; color: var(--secondary-text-color); }
      textarea { resize: none; border-radius: 12px; border: 1px solid var(--divider-color, rgba(127,127,127,.3)); background: var(--secondary-background-color, rgba(127,127,127,.06)); color: var(--primary-text-color); padding: 10px; font: inherit; font-size: 14px; }
      .quick { display: flex; gap: 6px; flex-wrap: wrap; }
      .qchip { min-height: 32px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); background: transparent; color: var(--secondary-text-color); font-size: 12px; cursor: pointer; }
      .opts { display: flex; flex-direction: column; gap: 4px; padding: 6px; border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.06)); }
      .opt { display: flex; align-items: center; gap: 10px; padding: 6px; border: none; background: transparent; text-align: left; cursor: pointer; }
      .opt b { display: block; font-size: 13px; font-weight: 500; }
      .opt small { display: block; font-size: 11px; color: var(--secondary-text-color); }
      .box { width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--secondary-text-color); flex: none; box-sizing: border-box; }
      .box.on { border-color: #4285f4; background: #4285f4 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center/14px no-repeat; }
      .periods { display: flex; gap: 6px; align-items: center; }
      .periods .pchip { flex: none; min-height: 32px; padding: 0 12px; color: var(--secondary-text-color); border-color: var(--divider-color, rgba(127,127,127,.25)); background: transparent; }
      .periods .pchip.sel { color: #4285f4; border-color: rgba(66,133,244,.55); background: rgba(66,133,244,.12); }
      .stats { margin-left: auto; font-size: 11px; color: var(--secondary-text-color); }
      .mapbox { position: relative; height: 300px; border-radius: 12px; overflow: hidden; background: var(--secondary-background-color, #1a1d23); }
      .mapbox ha-map { position: absolute; inset: 0; height: 100%; }
      .map-msg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--secondary-text-color); z-index: 1; pointer-events: none; }
      .replay { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--secondary-text-color); }
      .replay input { flex: 1; accent-color: #4285f4; }
      .spin { animation: fl-spin 1.2s linear infinite; }
      .toast { position: absolute; left: 50%; bottom: 12px; transform: translate(-50%, 20px); opacity: 0; padding: 8px 14px; border-radius: 999px; background: rgba(32,33,36,.92); color: #fff; font-size: 12px; pointer-events: none; transition: opacity .25s, transform .25s; z-index: 6; }
      .toast.show { opacity: 1; transform: translate(-50%, 0); }
      .toast.error { background: rgba(234,67,53,.95); }

      /* Mini card */
      .compact-row { display: flex; align-items: center; gap: 12px; }
      .mini-dev { position: relative; flex: none; display: flex; align-items: center; justify-content: center; }
      .mini-phone { width: 30px; height: 54px; border-radius: 8px; background: #0b0d11; border: 2px solid #3c4049; overflow: hidden; display: flex; align-items: flex-end; animation: fl-float 4s ease-in-out infinite; }
      .mini-tablet { width: 58px; height: 40px; border-radius: 8px; background: #0b0d11; border: 2px solid #3c4049; overflow: hidden; display: flex; align-items: flex-end; animation: fl-float-t 4.4s ease-in-out infinite; position: relative; }
      .mini-fill { width: 100%; background: linear-gradient(180deg, var(--c), color-mix(in srgb, var(--c) 35%, transparent)); transform-origin: bottom; animation: fl-rise 1.4s cubic-bezier(.2,.8,.2,1) both; }
      .mini-lock { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #f28b82; }
      .mini-lock .ic { width: 16px; height: 16px; }
      .mini-wave { position: absolute; width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--c); opacity: 0; animation: fl-wave 2.4s ease-out infinite; }
      .mini-shield { position: absolute; right: -6px; top: 0; width: 18px; height: 18px; border-radius: 50%; background: var(--card-background-color, #1c1f26); color: var(--c); display: flex; align-items: center; justify-content: center; }
      .mini-shield .ic { width: 13px; height: 13px; }
      .mini-txt { flex: 1; min-width: 0; }
      .mini-txt .title { font-size: 15px; }
      .mini-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .mini-tile { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: 12px; padding: 8px; display: flex; align-items: center; gap: 10px; border: none; cursor: pointer; text-align: left; min-width: 0; }
      .mini-tile .mini-phone { width: 18px; height: 32px; border-radius: 5px; }
      .mini-tile .mini-tablet { width: 34px; height: 24px; border-radius: 5px; }
      .mini-tile b { display: block; font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .mini-tile small { display: block; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      @keyframes fl-float { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(-3deg); } }
      @keyframes fl-float-t { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      @keyframes fl-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes fl-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes fl-wave { 0% { transform: scale(.6); opacity: .55; } 100% { transform: scale(1.9); opacity: 0; } }
      @keyframes fl-wave-s { 0% { transform: scale(.7); opacity: .8; } 100% { transform: scale(1.6); opacity: 0; } }
      @keyframes fl-ping { 0% { transform: scale(.4); opacity: .8; } 100% { transform: scale(2.6); opacity: 0; } }
      @keyframes fl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      @keyframes fl-scan { from { transform: translateY(-100%); } to { transform: translateY(460%); } }
      @keyframes fl-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @keyframes fl-dim { 0%,100% { opacity: .92; } 50% { opacity: 1; } }
      @keyframes fl-drop { 0% { transform: translateY(-30px); opacity: 0; } 60% { transform: translateY(4px); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes fl-shackle { 0%,30% { transform: translateY(-5px); } 45%,100% { transform: translateY(0); } }
      @keyframes fl-shine { from { transform: translateX(-100%); } to { transform: translateX(400%); } }
      @keyframes fl-bell { 0%,60%,100% { transform: rotate(0); } 10%,30%,50% { transform: rotate(14deg); } 20%,40% { transform: rotate(-14deg); } }
      @keyframes fl-sos { 0%,100% { box-shadow: 0 0 0 0 rgba(234,67,53,.4); } 50% { box-shadow: 0 0 0 6px rgba(234,67,53,0); } }
      @keyframes fl-in { from { transform: translateY(-8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes fl-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
    `;
  }
}

// ── family-link-mini-card ────────────────────────────────────────────────────
class FamilyLinkMiniCard extends FamilyLinkCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onOutsideMini = (ev) => {
      if (this._zoomed && !this._popup && !ev.composedPath().includes(this) && !flInDialog(ev)) this._setZoom(false);
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutsideMini, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutsideMini, true);
    if (this._zoomed) {
      this._zoomed = false;
      this._render();
    }
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 4, rows: 'auto' };
  }

  _compact() {
    return !this._zoomed;
  }

  _detailButton(t) {
    var label = this._zoomed ? t.show_compact : t.show_full;
    return `<button class="zoom" data-action="detail" title="${flEsc(label)}" aria-label="${flEsc(label)}">${flIcon(this._zoomed ? 'collapse' : 'expand')}</button>`;
  }

  _toggleDetail(ev) {
    this._setZoom(!this._zoomed);
    if (!ev.detail) this._root.querySelector('.zoom')?.focus?.({ preventScroll: true });
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    if (!zoomed && this._popup) this._closePopup(true);
    this._render();
  }

  _miniDevice(d, _t, big) {
    var s = FL_STATUS[d?.status] || FL_STATUS.not_tracked;
    var kind = this._kind(d);
    var used = d?.used || 0;
    var cap = d?.limit ? d.limit + (d.bonus || 0) : d?.remaining !== null && d?.remaining !== undefined ? used + d.remaining : 240;
    var ratio = Math.max(0.06, Math.min(1, used / Math.max(1, cap)));
    var lock = d?.restricted ? `<span class="mini-lock">${flIcon('lock')}</span>` : '';
    var screen = `<span class="mini-${kind}" style="--c:${s.color}">${d?.restricted ? '' : `<span class="mini-fill" style="height:${Math.round(ratio * 100)}%"></span>`}${lock}</span>`;
    if (!big) return screen;
    var protectedNow = d && (d.status === 'tracked' || d.status === 'attention');
    return `<span class="mini-dev" style="--c:${s.color};width:48px;height:64px">${protectedNow ? '<span class="mini-wave"></span>' : ''}${screen}<span class="mini-shield">${flIcon(d?.restricted ? 'lock' : 'shield')}</span></span>`;
  }

  _renderCompact(a, t, state) {
    var devices = a.devices || [];
    var device = this._device(a) || devices[0];
    var status = this._status(a, devices.length > 1 ? null : device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var loc = a.location;
    var place = loc ? loc.place || loc.address || t.unknown_place : null;
    var title = this._config.title || a.child_name || '';
    var stale = a.stale ? `<div class="note">${flIcon('offline')}<span>${flEsc(t.stale)}</span></div>` : '';
    if (devices.length > 1) {
      var tiles = devices
        .map((d) => {
          var ds = FL_STATUS[d.status] || FL_STATUS.not_tracked;
          var line = d.restricted ? this._restrictedShort(d, t) : d.remaining !== null && d.remaining !== undefined ? `${flDuration(d.remaining, t)} ${t.left}` : flDuration(d.used, t);
          return `<button class="mini-tile" data-action="select-zoom" data-device="${flEsc(d.id)}">${this._miniDevice(d, t, false)}<span style="min-width:0"><b>${flEsc(d.name)}</b><small style="color:${d.status === 'tracked' ? 'var(--secondary-text-color)' : ds.color}">${flEsc(line)}</small></span></button>`;
        })
        .join('');
      var sub = [flDuration(a.total_minutes, t), place].filter(Boolean).join(' · ');
      return `<div class="compact-row"><div class="badge" style="--c:${s.color};--tint:${s.tint}">${flIcon('kite')}</div><div class="mini-txt"><div class="title">${flEsc(title)}</div><div class="sub">${flEsc(sub)}</div></div>${this._detailButton(t)}</div>${stale}<div class="mini-tiles">${tiles}</div>`;
    }
    var line;
    if (!device) line = t.unavailable;
    else if (device.restricted) line = this._restrictedText(device, t);
    else if (device.remaining !== null && device.remaining !== undefined) line = `${flDuration(device.remaining, t)} ${t.left}`;
    else line = `${flDuration(device.used, t)} ${t.used_today}`;
    var parts = [line, place].filter(Boolean).join(' · ');
    var unlock = device?.locked ? `<button class="btn green" data-action="unlock">${flEsc(t.unlock)}</button>` : '';
    return `<div class="compact-row">${this._miniDevice(device, t, true)}<div class="mini-txt"><div class="title">${flEsc(title)}</div><div class="sub" style="${device?.restricted ? `color:${s.color}` : ''}">${flEsc(parts)}</div></div>${unlock}${this._detailButton(t)}</div>${stale}`;
  }

  _onClick(ev) {
    var el = ev.target.closest?.('[data-action="select-zoom"]');
    if (el) {
      ev.stopPropagation();
      this._selected = el.getAttribute('data-device');
      this._setZoom(true);
      return;
    }
    super._onClick(ev);
  }
}

// ── family-link-card-editor ──────────────────────────────────────────────────
var FL_LANGUAGES = [
  ['en', 'English'],
  ['fr', 'Français'],
];

function flEditorSchema(t, devices) {
  return [
    { name: 'entity', selector: { entity: { filter: { domain: 'sensor', integration: 'family_link' } } } },
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
      ],
    },
    { name: 'trace_hours', selector: { number: { min: 1, max: 168, mode: 'box' } } },
    {
      name: 'language',
      selector: { select: { mode: 'dropdown', options: [{ value: '', label: t.lang_auto }].concat(FL_LANGUAGES.map((l) => ({ value: l[0], label: l[1] }))) } },
    },
  ];
}

class FamilyLinkCardEditor extends HTMLElement {
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
    var entity = this._config.entity || FamilyLinkCard._findEntities(this._hass)[0];
    var devices = this._hass.states[entity]?.attributes?.devices || [];
    var lang = flLang(this._hass, this._config);
    var key = `${lang}|${devices.map((d) => d.id).join(',')}`;
    if (key !== this._key) {
      this._key = key;
      var t = FamilyLinkI18n[lang].editor;
      this._form.schema = flEditorSchema(t, devices);
      this._form.computeLabel = (field) => t[field.name] || field.name;
    }
    this._form.hass = this._hass;
    this._form.data = Object.assign({}, FL_DEFAULTS, this._config);
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

if (!customElements.get('family-link-card-editor')) customElements.define('family-link-card-editor', FamilyLinkCardEditor);
if (!customElements.get('family-link-card')) {
  customElements.define('family-link-card', FamilyLinkCard);
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
  customElements.define('family-link-mini-card', FamilyLinkMiniCard);
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
