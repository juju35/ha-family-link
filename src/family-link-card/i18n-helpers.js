// ── i18n ──────────────────────────────────────────────────────────────────────

export var FL_DEFAULTS = {
  show_scene: true,
  show_top_apps: true,
  show_actions: true,
  show_location: true,
  device_type: 'auto',
  trace_hours: 24,
  bonus_presets: [15, 30, 60],
  illustration: true,
  illustration_theme: 'auto',
};

export var FL_STATUS = {
  tracked: { color: '#34a853', tint: 'rgba(52,168,83,.18)' },
  attention: { color: '#f9ab00', tint: 'rgba(249,171,0,.18)' },
  locked: { color: '#ea4335', tint: 'rgba(234,67,53,.16)' },
  not_tracked: { color: '#9aa0a6', tint: 'rgba(154,160,166,.18)' },
};
export var FL_SEVERITY = { tracked: 0, attention: 1, locked: 2, not_tracked: 3 };
export var FL_APP_COLORS = ['#e8453c', '#4caf50', '#4285f4', '#f9ab00', '#a142f4', '#24c1e0', '#ff7043', '#8d6e63'];
