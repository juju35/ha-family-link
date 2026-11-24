// ── Illustrated header ────────────────────────────────────────────────────────
import { FL_APP_COLORS } from "./i18n-helpers.js";

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day
// picture after sunset)
export function flIsNight(hass, config) {
  var theme = config?.illustration_theme;
  if (theme === 'night') return true;
  if (theme === 'day') return false;
  return !!hass?.themes?.darkMode;
}

// The header picture, 200 × 80, drawn from the right of the banner: a shelf in the child's room with a toy box,
// the child's phone or tablet (apps, or the lock / bedtime / school screen) and an hourglass for the time left.
// `st`: { kind: 'phone' | 'tablet', status, restricted, ratio (share of the day's time left, or null) }.
// `uid` keeps each card's clip-path apart when several cards share a page.
export function flSceneSvg(uid, st) {
  var tablet = st.kind === 'tablet';
  var active = !st.restricted && (st.status === 'tracked' || st.status === 'attention');
  var off = !st.restricted && !active;
  // Screen box in the device's local frame (device stands on the shelf at y 0)
  var sw = tablet ? 38 : 20;
  var sh = tablet ? 24 : 31;
  var sx = -sw / 2;
  var sy = tablet ? -28.5 : -36;
  var body = tablet
    ? '<rect class="fl-dev" x="-22" y="-31" width="44" height="29" rx="3.5"/><rect class="fl-dev" x="-7" y="-2.5" width="14" height="2.5" rx="1"/>'
    : '<rect class="fl-dev" x="-12.5" y="-39.5" width="25" height="39.5" rx="4.5"/><rect class="fl-notch" x="-3" y="-38.2" width="6" height="1.1" rx=".55"/>';
  var screen;
  if (active) {
    var cols = tablet ? 4 : 2;
    var tiles = [];
    for (var i = 0; i < cols * 2; i++) {
      var tx = sx + (tablet ? 4 : 3) + (i % cols) * (tablet ? 8 : 8);
      var ty = sy + 4 + Math.floor(i / cols) * 8;
      tiles.push(`<rect class="fl-tile" x="${tx}" y="${ty}" width="6" height="6" rx="1.5" style="fill:${FL_APP_COLORS[i % FL_APP_COLORS.length]};animation-delay:${(i * 0.3).toFixed(1)}s"/>`);
    }
    var ratio = st.ratio === null || st.ratio === undefined ? null : Math.max(0, Math.min(1, st.ratio));
    var bar =
      ratio === null
        ? ''
        : `<rect class="fl-track" x="${sx + 3}" y="${sy + sh - 4.5}" width="${sw - 6}" height="2" rx="1"/><rect class="fl-bar" x="${sx + 3}" y="${sy + sh - 4.5}" width="${Math.max(1.5, (sw - 6) * ratio).toFixed(1)}" height="2" rx="1"/>`;
    screen = `<rect class="fl-screen" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/><g clip-path="url(#fl-clip-${uid})">${tiles.join('')}${bar}<rect class="fl-scan" x="${sx}" y="${sy - 8}" width="${sw}" height="8"/></g>`;
  } else if (st.restricted) {
    var cx = 0;
    var cy = sy + sh / 2;
    var sign;
    if (st.restricted === 'bedtime') sign = `<path class="fl-moon" d="M${cx + 1.5} ${cy - 5}a5 5 0 1 0 3.6 8.4 4 4 0 1 1-3.6-8.4z"/>`;
    else if (st.restricted === 'schooltime')
      sign = `<g class="fl-cap" transform="translate(${cx} ${cy})"><path d="M-6 -1.5 0 -4.5 6 -1.5 0 1.5z"/><path d="M-3.5 0v2.6c2 1.4 5 1.4 7 0V0" fill="none" stroke-width="1.2"/></g>`;
    else
      sign = `<g transform="translate(${cx} ${cy})"><rect class="fl-lock" x="-4" y="-1" width="8" height="7" rx="1"/><path class="fl-shackle" d="M-2.6 -1v-2a2.6 2.6 0 0 1 5.2 0v2"/></g>`;
    screen = `<rect class="fl-screen off" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/>${sign}`;
  } else {
    var oy = sy + sh / 2;
    screen = `<rect class="fl-screen dead" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/><g class="fl-offline" transform="translate(0 ${oy})"><circle r="4.5"/><path d="M-3.2 -3.2 3.2 3.2"/></g>`;
  }
  // Hourglass: sand on top for the time left, all down once it is spent
  var top = active ? (st.ratio === null || st.ratio === undefined ? 0.6 : Math.max(0, Math.min(1, st.ratio))) : 0;
  var th = (9 * top).toFixed(1);
  var bh = (8 * (1 - top) + 1.5).toFixed(1);
  var hourglass = `<g transform="translate(176 47.5)">
      <path class="fl-glass" d="M-6 -12h12M-6 12h12M-5 -12q0 8 5 12q-5 4-5 12M5 -12q0 8-5 12q5 4 5 12"/>
      ${top > 0 ? `<path class="fl-sand" d="M${-(4 * top).toFixed(2)} ${(-1 - 9 * top).toFixed(2)}h${(8 * top).toFixed(2)}l${-(4 * top).toFixed(2)} ${th}z"/>` : ''}
      <path class="fl-sand" d="M-${(bh * 0.55).toFixed(2)} 10.5h${(bh * 1.1).toFixed(2)}l-${(bh * 0.55).toFixed(2)} -${bh}z"/>
      ${active ? '<path class="fl-grain" d="M0 0v10"/>' : ''}
    </g>`;
  var x = tablet ? 146 : 142;
  return `<svg class="fl-scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
    <defs><clipPath id="fl-clip-${uid}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="1.5"/></clipPath></defs>
    <rect class="fl-shelf" x="96" y="60" width="104" height="3"/>
    <g class="fl-box"><rect x="102" y="46" width="16" height="14" rx="2"/><rect class="fl-box-lid" x="104" y="48" width="12" height="3"/></g>
    <g class="fl-device${off ? ' dim' : ''}" transform="translate(${x} 60)">${body}${screen}</g>
    ${hourglass}
  </svg>`;
}
