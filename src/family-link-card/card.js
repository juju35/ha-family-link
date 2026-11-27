// ── family-link-card ─────────────────────────────────────────────────────────
import { FL_APP_COLORS, FL_DEFAULTS, FL_SEVERITY, FL_STATUS } from "./i18n-helpers.js";
import { flAgo, flClock, flDuration, flEsc, flIcon, flInDialog, flIsChild, flKm, flLang, flSchoolTag, flTextWidth, flTr, flWatchOutside } from "./helpers.js";
import { flIsNight, flSceneSvg } from "./illustrated-header.js";
import { FamilyLinkI18n } from "./i18n/strings.js";

export var flUid = 0;

export class FamilyLinkCard extends HTMLElement {
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
    this._uid = ++flUid;
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
    // The night picture follows the dark theme
    var night = this._config && this._config.illustration !== false ? flIsNight(hass, this._config) : null;
    if (state !== this._lastState || night !== this._lastNight) {
      this._lastState = state;
      this._lastNight = night;
      this._render();
    } else if (first) {
      this._render();
    }
    if (this._map) this._map.hass = hass;
  }

  connectedCallback() {
    this._onOutside =
      this._onOutside ||
      flWatchOutside(
        (ev) => !!this._popup && !flInDialog(ev) && !ev.composedPath().includes(this),
        () => this._closePopup()
      );
    this._onOutside.on();
    if (!this._timer) this._timer = setInterval(() => this._tick(), 30000);
    if (!this._fitObserver && typeof ResizeObserver === 'function') this._fitObserver = new ResizeObserver(() => this._fitPill());
    this._fitObserver?.observe(this);
    document.fonts?.ready?.then(() => this._fitPill());
  }

  disconnectedCallback() {
    this._onOutside?.off();
    clearTimeout(this._ringTimer);
    this._ringTimer = null;
    this._fitObserver?.disconnect();
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
    this._fitPill();
  }

  // The status pill, measured after each render and on a new width (in every language): it sits on the title's row,
  // right after the title, only when the whole title and the pill's whole label fit there; otherwise it takes a line
  // of its own under the subtitle (.below), the title whole on its row (cut only when it does not fit alone). When the
  // lines do not fit in the banner above the floor, or the label does not fit its line, the pill shows its dot alone
  // (.dot-only): beside the title when the whole title leaves it room, else under the subtitle.
  _fitPill() {
    for (const t of this._root?.querySelectorAll?.('.titles') || []) {
      const row = t.querySelector('.title-row');
      const pill = row?.querySelector(':scope > .pill');
      if (!pill?.getBoundingClientRect) continue;
      t.classList.remove('below', 'dot-only');
      const name = row.querySelector('.title');
      const tag = name.querySelector('.school-tag');
      const tagW = tag ? tag.getBoundingClientRect().width + (parseFloat(getComputedStyle(tag).marginLeft) || 0) : 0;
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const room = row.getBoundingClientRect().width;
      const title = Math.max(name.scrollWidth, flTextWidth(name) + tagW) + gap;
      if (title + pill.getBoundingClientRect().width <= room) continue;
      t.classList.add('below');
      const line = t.querySelector('.pill-line > .pill');
      const banner = t.closest('.banner');
      const floor = banner ? banner.querySelector('.ground').getBoundingClientRect().top : Infinity;
      const box = t.getBoundingClientRect();
      const tx = line?.querySelector('.pt');
      const whole = !tx || (tx.scrollWidth <= tx.clientWidth + 0.5 && line.getBoundingClientRect().right <= box.right + 0.5);
      if (whole && box.bottom <= floor + 0.5 && (!banner || box.top >= banner.getBoundingClientRect().top - 0.5)) continue;
      t.classList.add('dot-only');
      if (title + (line || pill).getBoundingClientRect().width <= room) t.classList.remove('below');
    }
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

  // The status line on the banner's sky: what the shown device is at (time left, lock, bedtime…)
  _statusLine(a, device, t, status) {
    var devices = a.devices || [];
    if (!device) return devices.length > 1 ? `${flDuration(a.total_minutes, t)} ${t.used_today} · ${flTr(t, 'devices', { n: devices.length })}` : t[`status_${status}`] || status;
    var line;
    if (device.restricted) line = this._restrictedShort(device, t);
    else if (status === 'not_tracked') line = t.status_not_tracked;
    else if (device.remaining !== null && device.remaining !== undefined) line = `${flDuration(device.remaining, t)} ${t.left}`;
    else line = `${flDuration(device.used, t)} ${t.used_today}`;
    return devices.length > 1 ? `${device.name} · ${line}` : line;
  }

  // The banner's picture state for a device (or the worst one when all devices are shown)
  _sceneState(a, device, status) {
    var d = device || (a.devices || []).slice().sort((x, y) => (FL_SEVERITY[y.status] || 0) - (FL_SEVERITY[x.status] || 0))[0];
    var ratio = null;
    if (d && d.remaining !== null && d.remaining !== undefined) {
      var cap = d.limit ? d.limit + (d.bonus || 0) : (d.used || 0) + d.remaining;
      ratio = cap > 0 ? d.remaining / cap : 0;
    }
    return { kind: this._kind(d), status: status, restricted: d ? d.restricted : null, ratio: ratio };
  }

  // The status pill: a dot and the status, in the round icon's colour.
  _pill(status, t) {
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var label = flEsc(t[`status_${status}`] || status);
    return `<span class="pill" style="--c:${s.color};--tint:${s.tint}" title="${label}" aria-label="${label}"><span class="dot"></span><span class="pt">${label}</span></span>`;
  }

  // The title, then the status pill right after it; `sub` under them (left out when it only repeats the status). Where
  // the pill goes is measured (_fitPill): beside the whole title, else on a line of its own under the subtitle (the
  // copy in .pill-line), else its dot alone (its text stays in its title and aria-label).
  _titles(a, t, status, title, sub, subStyle) {
    var pill = this._pill(status, t);
    var label = t[`status_${status}`] || status;
    var text = String(sub || '')
      .split(' · ')
      .filter((part) => part && part !== label)
      .join(' · ');
    var line = text ? `<div class="sub" title="${flEsc(text)}"${subStyle ? ` style="${subStyle}"` : ''}>${flEsc(text)}</div>` : '';
    return `<div class="titles"><div class="title-row"><div class="title">${flEsc(title)}${flSchoolTag(a, t)}</div>${pill}</div>${line}<div class="pill-line">${pill}</div></div>`;
  }

  // The illustrated header: the round status icon, the title and `sub` on the left, the picture on the right
  _banner(a, device, t, state, title, sub, extra) {
    var status = this._status(a, device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var label = t[`status_${status}`] || status;
    var night = flIsNight(this._hass, this._config);
    return `<div class="banner${night ? ' night' : ''}">
      ${flSceneSvg(this._uid, this._sceneState(a, device, status))}<div class="ground" aria-hidden="true"></div>
      <div class="htext"><div class="badge" style="--c:${s.color}" title="${flEsc(label)}" role="img" aria-label="${flEsc(label)}">${flIcon('kite')}</div>
      ${this._titles(a, t, status, title, sub)}</div>
      ${extra || ''}
    </div>`;
  }

  _header(a, device, t, state, extra) {
    var status = this._status(a, device, state);
    var s = FL_STATUS[status] || FL_STATUS.not_tracked;
    var devices = a.devices || [];
    if (this._config.illustration !== false) {
      var name = this._config.title || a.child_name || t.none;
      var line = state && state.state !== 'unavailable' && a.family_link ? this._statusLine(a, device, t, status) : t[`status_${status}`] || status;
      return this._banner(a, device, t, state, name, line, extra);
    }
    var sub = devices.length === 1 ? t.device_one : flTr(t, 'devices', { n: devices.length });
    if (device && devices.length > 1) sub = `${device.name} · ${sub}`;
    else if (device) sub = device.name;
    var title = this._config.title || a.child_name || t.none;
    return `<div class="header">
      <div class="badge" style="--c:${s.color};--tint:${s.tint}">${flIcon('kite')}</div>
      ${this._titles(a, t, status, title, sub)}
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
    html += this._schoolRow(a, t);
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

  // School mode of the child: every app blocked but the essential ones, by hand or by the Pronote timetable
  _schoolRow(a, t) {
    var sm = a.school_mode;
    if (!sm) return '';
    var on = !!sm.active;
    var sub = on
      ? [
          sm.source === 'pronote' ? 'Pronote' : null,
          sm.until ? flTr(t, 'until', { t: flClock(sm.until, this._hass) }) : null,
          sm.blocked ? flTr(t, 'school_blocked', { n: sm.blocked }) : null,
        ]
          .filter(Boolean)
          .join(' · ')
      : sm.pronote
        ? 'Pronote'
        : '';
    return `<div class="school ${on ? 'on' : ''}"><span class="school-ic">${flIcon('school', on ? 'bob' : '')}</span>
      <div class="school-txt"><b>${flEsc(t.school_mode)}</b>${sub ? `<small>${flEsc(sub)}</small>` : ''}</div>
      <button class="switch ${on ? 'on' : ''}" role="switch" aria-checked="${on}" aria-label="${flEsc(t.school_mode)}" data-action="school" ${this._busy.school ? 'disabled' : ''}><i></i></button></div>`;
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
          clearTimeout(this._ringTimer);
          this._ringTimer = setTimeout(() => this._render(), 20500);
          this._call('ring', { child: a.child_id, device: device.id }, 'ring');
        }
        break;
      case 'location':
        this._openPopup({ type: 'location', hours: Number(this._config.trace_hours) || 24 });
        break;
      case 'school':
        this._call('school_mode', { child: a.child_id, enable: !a.school_mode?.active }, 'school');
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
    var devices = a.devices || [];
    var dev = devices.find((d) => d.id === p.device);
    var loc = a.location;
    // No device picked: every device of the child rings
    var targets = dev ? dev.name : devices.map((d) => d.name).join(', ');
    var sub = [targets, loc?.place, loc?.battery !== null && loc?.battery !== undefined ? `${loc.battery} %` : null].filter(Boolean).join(' · ');
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
      <div class="opts">${devices.length ? check('ring', t.opt_ring, t.opt_ring_hint) : ''}${a.notify_service ? check('notify', t.opt_notify, flTr(t, 'opt_notify_hint', { service: a.notify_service })) : ''}${check('locate', t.opt_locate, t.opt_locate_hint)}</div>
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
      ha-card { container: fl-card / inline-size; position: relative; padding: 16px; overflow: hidden; display: flex; flex-direction: column; gap: 14px; color: var(--primary-text-color); }
      .main { display: flex; flex-direction: column; gap: 14px; }
      .ic { width: 20px; height: 20px; flex: none; }
      .header { display: flex; align-items: center; gap: 12px; }
      .badge { width: 40px; height: 40px; border-radius: 50%; background: var(--tint); color: var(--c); display: flex; align-items: center; justify-content: center; flex: none; transition: background .4s, color .4s; }
      .badge .ic { width: 24px; height: 24px; }
      .titles { flex: 1; min-width: 0; }
      /* The title line: the title, then the status pill when the whole title and the pill's whole label fit there
         (measured, see _fitPill). Otherwise the pill takes a line of its own under the subtitle (its copy in
         .pill-line), the subtitle on one line; when that does not fit in the banner above the floor, or on a card of
         200 px or less, only its dot stays (its text in its title and aria-label). */
      .title-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .title-row > .title { flex: 0 1 auto; min-width: 0; }
      .title-row > .pill { flex: none; }
      .pill-line { display: none; }
      .titles.below .title-row > .pill { display: none; }
      .titles.below .pill-line { display: flex; min-width: 0; margin-top: 3px; }
      .pill-line > .pill { max-width: 100%; }
      .titles.dot-only .pill { padding: 4px; } .titles.dot-only .pill .pt { display: none; }
      @container fl-card (max-width: 200px) { .pill { padding: 4px; } .pill .pt { display: none; } }
      .title { font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pill { display: inline-flex; align-items: center; gap: 4px; min-width: 0; box-sizing: border-box; overflow: hidden; padding: 1px 8px; border-radius: 12px;
              background: var(--tint); color: color-mix(in srgb, var(--c) 55%, var(--primary-text-color)); font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }
      .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; }
      .pill .pt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
      .banner .pill { background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
      .banner.night .pill { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
      /* Illustrated header: 90 px, edge to edge, the text on the wall at left, the picture at right, a 10 px parquet strip */
      .banner { position: relative; height: 90px; margin: -16px -16px 0; overflow: hidden; flex: none; container-type: inline-size; background: #fdf3e7; color: #0d2a45; --muted: #3b5b78; }
      .banner.night { background: #2a2a36; color: #fff; --muted: rgba(255,255,255,.78); }
      .banner .fl-scene { position: absolute; right: 0; bottom: 10px; height: 80px; width: min(200px, 66%); }
      .banner .ground { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: repeating-linear-gradient(90deg, #c99a6b 0 38px, #b98a5c 38px 40px); box-shadow: inset 0 2px 0 #a97c50; }
      .banner.night .ground { background: repeating-linear-gradient(90deg, #4a3a2c 0 38px, #3e3024 38px 40px); box-shadow: inset 0 2px 0 #5c4836; }
      .banner .htext { position: absolute; left: 0; top: 0; bottom: 10px; right: calc(min(200px, 66%) * .5 + 4px); display: flex; align-items: center; gap: 10px; padding: 0 8px 0 14px; min-width: 0; }
      .banner .badge { position: relative; background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 30%, transparent); }
      .banner.night .badge { background: rgba(255,255,255,.12); }
      .banner .title { font-size: 16px; }
      .banner .sub { font-size: 13px; color: var(--muted); }
      .banner .zoom { color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
      .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
      .banner .zoom:hover { background: rgba(255,255,255,.75); }
      .banner.night .zoom:hover { background: rgba(255,255,255,.22); }
      .banner .school-tag { color: inherit; }
      @container (max-width: 260px) { .fl-scene { display: none; } .htext { right: 36px !important; } }
      .fl-shelf { fill: #e5484d; opacity: .7; }
      .night .fl-shelf { fill: #3c4558; opacity: 1; }
      .fl-box rect { fill: #2f80ed; }
      .fl-box .fl-box-lid { fill: #fff; opacity: .6; }
      .night .fl-box rect { fill: #3a6fc4; }
      .night .fl-box .fl-box-lid { opacity: .35; }
      .fl-dev { fill: #22262b; }
      .night .fl-dev { fill: #15171c; stroke: #4a5266; stroke-width: .6; }
      .fl-notch { fill: #3a3f47; }
      .fl-screen { fill: #86b9de; }
      .night .fl-screen { fill: #3d5a8a; }
      .fl-screen.off { fill: #1a1d22; }
      .fl-screen.dead { fill: #4a4f57; }
      .fl-device.dim { opacity: .8; }
      .fl-tile { opacity: .95; animation: fl-bob 2.2s ease-in-out infinite; }
      .fl-track { fill: rgba(255,255,255,.45); }
      .fl-bar { fill: #fff; }
      .fl-scan { fill: rgba(255,255,255,.22); animation: fl-sscan 3.2s linear infinite; }
      .fl-lock { fill: #f5b400; }
      .fl-shackle { fill: none; stroke: #f5b400; stroke-width: 1.2; animation: fl-shackle 2.6s ease-in-out infinite; }
      .fl-moon { fill: #c9d4ff; animation: fl-glow 3s ease-in-out infinite; }
      .fl-cap path { fill: #f5b400; stroke: #f5b400; }
      .fl-offline { fill: none; stroke: #9aa0a6; stroke-width: 1.2; }
      .fl-glass { fill: none; stroke: #5f6b7a; stroke-width: 1.2; }
      .night .fl-glass { stroke: #9aa3ae; }
      .fl-sand { fill: #f5b400; }
      .fl-grain { stroke: #f5b400; stroke-width: .9; stroke-dasharray: 1.2 1.6; animation: fl-grain .6s linear infinite; }
      .mini-actions { display: flex; justify-content: flex-end; }
      ha-card:has(.main > .banner:only-child) { padding-bottom: 0; }
      .icon-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; color: var(--secondary-text-color); display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; align-self: flex-start; }
      .icon-btn .ic { width: 18px; height: 18px; }
      /* The mini card's detail button: 24 px round, in the top right corner of the card (of the banner). */
      .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; width: 24px; height: 24px; padding: 0; border-radius: 50%; border: none; cursor: pointer;
              display: grid; place-items: center; color: var(--secondary-text-color); background: transparent; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }
      .zoom .ic { width: 16px; height: 16px; }
      .header:has(> .zoom), .compact-row:has(> .zoom) { padding-right: 14px; }
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
      .tile { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 2px; min-width: 0; border: none; text-align: left; }
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
      .school-tag { display: inline-flex; vertical-align: -3px; margin-left: 6px; color: #4285f4; }
      .school-tag .ic { width: 16px; height: 16px; }
      .school { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; border: 1px solid var(--divider-color, rgba(127,127,127,.25)); transition: border-color .3s, background .3s; }
      .school.on { border-color: rgba(66,133,244,.5); background: rgba(66,133,244,.08); }
      .school-ic { width: 36px; height: 36px; flex: none; border-radius: 50%; display: grid; place-items: center; color: #4285f4; background: rgba(66,133,244,.12); }
      .school-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .school-txt small { color: var(--secondary-text-color); font-size: 12px; }
      .switch { position: relative; width: 42px; height: 24px; flex: none; border-radius: 12px; border: 1.5px solid var(--secondary-text-color); background: transparent; color: var(--secondary-text-color); cursor: pointer; padding: 0; transition: border-color .2s, color .2s; }
      .switch i { position: absolute; top: 3px; left: 3px; width: 15px; height: 15px; border-radius: 50%; background: currentColor; transition: transform .25s cubic-bezier(.3,1.4,.6,1); }
      .switch.on { color: #4285f4; border-color: #4285f4; }
      .switch.on i { transform: translateX(18px); }
      .ic.bob { animation: fl-bob 2.4s ease-in-out infinite; }
      @keyframes fl-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px) rotate(-4deg); } }
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
      @keyframes fl-sscan { from { transform: translateY(0); } to { transform: translateY(48px); } }
      @keyframes fl-grain { to { stroke-dashoffset: -2.8; } }
      @keyframes fl-glow { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
    `;
  }
}
