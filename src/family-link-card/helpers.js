// ── Helpers ───────────────────────────────────────────────────────────────────
import { FamilyLinkI18n } from "./i18n/strings.js";

export function flLang(hass, config) {
  var lang = String(config?.language || (hass && (hass.locale?.language || hass.language)) || navigator.language || 'en');
  if (FamilyLinkI18n[lang]) return lang;
  lang = lang.split('-')[0];
  return FamilyLinkI18n[lang] ? lang : 'en';
}

export function flTr(t, key, vars) {
  var text = t[key] ?? FamilyLinkI18n.en[key] ?? key;
  Object.keys(vars || {}).forEach((k) => {
    text = text.split(`{${k}}`).join(vars[k]);
  });
  return text;
}

export function flEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function flDuration(minutes, t) {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return t.none;
  var m = Math.max(0, Math.round(minutes));
  if (m < 60) return flTr(t, 'min', { n: m });
  var h = Math.floor(m / 60);
  var rest = m % 60;
  return rest ? flTr(t, 'hmin', { h: h, m: String(rest).padStart(2, '0') }) : flTr(t, 'h', { h: h });
}

export function flAgo(iso, t, now) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  var minutes = Math.max(0, Math.round((now - ms) / 60000));
  if (minutes < 1) return t.ago_now;
  if (minutes < 60) return flTr(t, 'ago_min', { n: minutes });
  if (minutes < 48 * 60) return flTr(t, 'ago_h', { n: Math.round(minutes / 60) });
  return flTr(t, 'ago_d', { n: Math.round(minutes / 1440) });
}

export function flClock(iso, hass) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  try {
    return new Date(ms).toLocaleTimeString(hass?.locale?.language || undefined, { hour: '2-digit', minute: '2-digit' });
  } catch (_err) {
    return new Date(ms).toTimeString().slice(0, 5);
  }
}

export function flIsChild(state) {
  return !!state?.attributes?.family_link;
}

export function flInDialog(ev) {
  return ev.composedPath().some((el) => el?.tagName && /^(HA-DIALOG|HA-MORE-INFO-DIALOG|MWC-DIALOG|HA-MD-DIALOG)$/.test(el.tagName));
}

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app) a
// tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to the
// page. It counts when the press and the release are both outside the card (a slider dragged out of the card does not
// close it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through the click
// event. `tap(ev)` (a press and a release at the same spot) is for the tests.
export function flWatchOutside(isOut, handler) {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOut(ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOut(ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOut(ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener('pointerdown', onDown, true);
      document.addEventListener('pointerup', onUp, true);
      document.addEventListener('click', onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('click', onClick, true);
    },
  };
}

export function flKm(points) {
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
export var FL_ICON_PATHS = {
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

// Small school cap after the child's name while the school mode is on
// The width of an element's whole text in its own font, in fractional pixels (scrollWidth is rounded).
export let flTextCtx;
export const flTextWidth = (el) => {
  const cs = getComputedStyle(el);
  flTextCtx ??= document.createElement('canvas').getContext?.('2d');
  if (!flTextCtx) return el.scrollWidth;
  flTextCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  return Math.max(el.scrollWidth, flTextCtx.measureText(el.textContent.trim()).width + pad);
};

export function flSchoolTag(a, t) {
  return a?.school_mode?.active ? `<span class="school-tag" title="${flEsc(t.school_mode)}" aria-label="${flEsc(t.school_mode)}">${flIcon('school')}</span>` : '';
}

export function flIcon(name, cls) {
  return `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${FL_ICON_PATHS[name] || ''}</svg>`;
}
