// ── family-link-mini-card ────────────────────────────────────────────────────
import { FL_STATUS } from "./i18n-helpers.js";
import { flDuration, flEsc, flIcon, flInDialog, flWatchOutside } from "./helpers.js";
import { FamilyLinkCard } from "./card.js";

export class FamilyLinkMiniCard extends FamilyLinkCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onOutsideMini = flWatchOutside(
      (ev) => this._zoomed && !this._popup && !ev.composedPath().includes(this) && !flInDialog(ev),
      () => this._setZoom(false)
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this._onOutsideMini.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._onOutsideMini.off();
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
      if (this._config.illustration !== false) return `${this._banner(a, null, t, state, title, sub, this._detailButton(t))}${stale}<div class="mini-tiles">${tiles}</div>`;
      return `<div class="compact-row"><div class="badge" style="--c:${s.color};--tint:${s.tint}">${flIcon('kite')}</div><div class="mini-txt">${this._titles(a, t, status, title, sub)}</div>${this._detailButton(t)}</div>${stale}<div class="mini-tiles">${tiles}</div>`;
    }
    var line;
    if (!device) line = t.unavailable;
    else if (device.restricted) line = this._restrictedText(device, t);
    else if (device.remaining !== null && device.remaining !== undefined) line = `${flDuration(device.remaining, t)} ${t.left}`;
    else line = `${flDuration(device.used, t)} ${t.used_today}`;
    var parts = [line, place].filter(Boolean).join(' · ');
    var unlock = device?.locked ? `<button class="btn green" data-action="unlock">${flEsc(t.unlock)}</button>` : '';
    if (this._config.illustration !== false) return `${this._banner(a, device, t, state, title, parts, this._detailButton(t))}${stale}${unlock ? `<div class="mini-actions">${unlock}</div>` : ''}`;
    return `<div class="compact-row">${this._miniDevice(device, t, true)}<div class="mini-txt">${this._titles(a, t, status, title, parts, device?.restricted ? `color:${s.color}` : '')}</div>${unlock}${this._detailButton(t)}</div>${stale}`;
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
