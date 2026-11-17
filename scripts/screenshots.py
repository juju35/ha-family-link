"""Render the Family Link cards with mock data in headless Chromium and save the README screenshots.

Usage: python scripts/screenshots.py [--out screenshots] [--chrome /path/to/chrome]
Mock data only (neutral first names), dark and light themes.
"""

from __future__ import annotations

import argparse
import asyncio
import io
import json
from datetime import UTC, datetime, timedelta
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
CARD = ROOT / "custom_components" / "family_link" / "frontend" / "family-link-card.js"
NOW = datetime(2026, 11, 14, 17, 44, tzinfo=UTC)


def iso(delta_minutes: float) -> str:
    return (NOW + timedelta(minutes=delta_minutes)).isoformat()


def apps(*items):
    colors = []
    for title, minutes, extra in items:
        colors.append(
            {
                "package": title.lower(),
                "title": title,
                "minutes": minutes,
                "icon": None,
                "limit": None,
                "blocked": False,
                "always_allowed": False,
                **extra,
            }
        )
    return colors


PHONE = {
    "id": "phone-1",
    "name": "Pixel 8",
    "model": "Pixel 8",
    "kind": "phone",
    "status": "attention",
    "locked": False,
    "restricted": None,
    "used": 102,
    "remaining": 18,
    "limit": 120,
    "bonus": 0,
    "bonus_remaining": None,
    "bonus_id": None,
    "bedtime": {"start": iso(196), "end": iso(196 + 600), "active": False},
    "schooltime": None,
    "last_activity": iso(-2),
    "can_ring": True,
    "top_apps": apps(("YouTube", 48, {"limit": 60}), ("Minecraft", 31, {}), ("Chrome", 14, {})),
}
TABLET = {
    **PHONE,
    "id": "tablet-1",
    "name": "Tab A9",
    "model": "Galaxy Tab A9",
    "kind": "tablet",
    "status": "locked",
    "locked": True,
    "restricted": "locked",
    "used": 50,
    "remaining": None,
    "limit": None,
    "top_apps": apps(("Netflix", 65, {}), ("YouTube Kids", 38, {}), ("Duolingo", 17, {"always_allowed": True})),
}


def child(devices, **extra):
    attrs = {
        "family_link": True,
        "child_id": "1",
        "child_name": "Alex",
        "photo": None,
        "total_minutes": sum(d["used"] for d in devices),
        "week": [
            {"date": f"d{i}", "minutes": m}
            for i, m in enumerate([95, 130, 80, 150, 110, 70, sum(d["used"] for d in devices)])
        ],
        "top_apps": apps(
            ("YouTube", 48, {"limit": 60}), ("Netflix", 65, {}), ("Minecraft", 31, {}), ("YouTube Kids", 38, {})
        ),
        "blocked_apps": 3,
        "school_mode": {"active": False, "source": None, "until": None, "blocked": 0, "pronote": "sensor.pronote_alex"},
        "devices": devices,
        "location": {
            "latitude": 48.11,
            "longitude": -1.68,
            "accuracy": 12,
            "place": "Home",
            "address": None,
            "time": iso(-5),
            "fresh": True,
            "battery": 64,
            "device": "Pixel 8",
        },
        "tracker": "device_tracker.alex",
        "notify_service": "notify.mobile_app_pixel_8",
        "stale": False,
        "errors": [],
        "updated": iso(0),
    }
    attrs.update(extra)
    worst = max((d["status"] for d in devices), key=["tracked", "attention", "locked", "not_tracked"].index)
    return {"entity_id": "sensor.alex_status", "state": worst, "attributes": attrs}


SCENES = {
    "card": ("family-link-card", {"entity": "sensor.alex_status", "device": "phone-1"}, child([PHONE, TABLET]), None),
    "card-tablet-locked": (
        "family-link-card",
        {"entity": "sensor.alex_status", "device": "tablet-1"},
        child([PHONE, TABLET]),
        None,
    ),
    "card-bonus": (
        "family-link-card",
        {"entity": "sensor.alex_status"},
        child([{**PHONE, "status": "tracked", "bonus": 30, "bonus_remaining": 22, "bonus_id": "b", "remaining": 22}]),
        None,
    ),
    "card-school": (
        "family-link-card",
        {"entity": "sensor.alex_status", "device": "phone-1"},
        child(
            [PHONE, TABLET],
            school_mode={"active": True, "source": "pronote", "until": iso(150), "blocked": 12, "pronote": "s"},
        ),
        None,
    ),
    "card-emergency": (
        "family-link-card",
        {"entity": "sensor.alex_status", "device": "phone-1"},
        child([PHONE, TABLET]),
        "emergency",
    ),
    "card-location": (
        "family-link-card",
        {"entity": "sensor.alex_status", "device": "phone-1"},
        child([PHONE, TABLET]),
        "location",
    ),
    "mini-card": (
        "family-link-mini-card",
        {"entity": "sensor.alex_status"},
        child([{**PHONE, "status": "tracked", "remaining": 42, "used": 78}]),
        None,
    ),
    "mini-card-devices": ("family-link-mini-card", {"entity": "sensor.alex_status"}, child([PHONE, TABLET]), None),
    # The mini card expanded by its detail button: the full card, at the full card's width.
    "mini-card-zoom": ("family-link-mini-card", {"entity": "sensor.alex_status"}, child([PHONE, TABLET]), "zoom"),
    "mini-card-locked": (
        "family-link-mini-card",
        {"entity": "sensor.alex_status"},
        child(
            [
                {
                    **TABLET,
                    "restricted": "bedtime",
                    "status": "locked",
                    "bedtime": {"start": iso(-60), "end": iso(800), "active": True},
                }
            ]
        ),
        None,
    ),
}

# One GIF per distinct animation: the phone scene, the lock dropping on the tablet, the mini card devices
GIFS = {
    "card": "anim-phone",
    "card-tablet-locked": "anim-tablet-locked",
    "card-bonus": "anim-bonus",
    "mini-card-devices": "anim-mini-devices",
}
GIF_FRAMES = 28
GIF_STEP_MS = 110

THEMES = {
    "dark": {
        "bg": "#111318",
        "card": "#1c1f26",
        "secondary": "#232730",
        "text": "#e3e3e3",
        "muted": "#9aa0a6",
        "divider": "rgba(255,255,255,.1)",
    },
    "light": {
        "bg": "#f5f6f8",
        "card": "#ffffff",
        "secondary": "#f1f3f4",
        "text": "#202124",
        "muted": "#5f6368",
        "divider": "rgba(0,0,0,.12)",
    },
}

PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:%(bg)s;font-family:Roboto,system-ui,sans-serif}
:root{--card-background-color:%(card)s;--secondary-background-color:%(secondary)s;--primary-text-color:%(text)s;--secondary-text-color:%(muted)s;--divider-color:%(divider)s;--primary-color:#03a9f4}
#wrap{width:%(width)spx;padding:16px}
ha-card{display:block;background:var(--card-background-color);border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.18)}
</style></head><body><div id="wrap"></div>
<script>
customElements.define('ha-card', class extends HTMLElement {});
customElements.define('ha-map', class extends HTMLElement {
  set paths(p) { this._p = p; this.draw(); } get paths() { return this._p; }
  connectedCallback() { this.style.display='block'; this.draw(); }
  draw() {
    var pts = [[30,240],[60,200],[110,160],[200,150],[300,110],[340,60],[320,120],[260,165],[150,175],[100,215],[60,228]];
    this.innerHTML = '<svg viewBox="0 0 416 300" width="100%%" height="100%%" preserveAspectRatio="xMidYMid slice" style="background:#1a1d23"><path d="M-10 160 C 120 150 260 175 430 140" stroke="#2b3039" stroke-width="10" fill="none"/><path d="M120 -10 C 130 90 140 200 170 310" stroke="#2b3039" stroke-width="8" fill="none"/><polyline points="' + pts.map(p=>p.join(',')).join(' ') + '" fill="none" stroke="#4285f4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="228" r="7" fill="#4285f4" stroke="#1a1d23" stroke-width="3"/></svg>';
  }
});
</script>
<script>__CARD_JS__</script>
<script>
const hass = {
  states: {'sensor.alex_status': %(state)s},
  entities: {}, locale: {language: 'en'}, language: 'en', themes: {darkMode: %(dark)s},
  callService: async () => {}, callWS: async () => ({'device_tracker.alex': [1,2,3,4,5,6].map((i) => ({lu: 1763140000 + i*600, a: {latitude: 48.10 + i*0.003, longitude: -1.70 + i*0.004}}))}),
};
const el = document.createElement('%(tag)s');
el.setConfig(%(config)s);
el.hass = hass;
document.getElementById('wrap').appendChild(el);
window.__card = el;
</script></body></html>"""


def save_png(image: Image.Image, path: Path) -> bool:
    """Write only when the pixels changed, so an identical render never makes a commit."""
    if path.exists():
        with Image.open(path) as old:
            if (
                old.size == image.size
                and ImageChops.difference(old.convert("RGBA"), image.convert("RGBA")).getbbox() is None
            ):
                return False
    image.save(path, optimize=True)
    return True


def save_gif(frames: list[Image.Image], path: Path) -> bool:
    palette = [frame.convert("RGB").quantize(colors=256, method=Image.Quantize.MEDIANCUT) for frame in frames]
    tmp = path.with_suffix(".tmp.gif")
    palette[0].save(tmp, save_all=True, append_images=palette[1:], duration=GIF_STEP_MS, loop=0, optimize=True)
    if path.exists() and path.read_bytes() == tmp.read_bytes():
        tmp.unlink()
        return False
    tmp.replace(path)
    return True


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=str(ROOT / "screenshots"))
    parser.add_argument("--chrome", default=None)
    parser.add_argument("--only", default=None)
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    js = CARD.read_text(encoding="utf-8")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=args.chrome) if args.chrome else await pw.chromium.launch()
        for name, (tag, config, state, popup) in SCENES.items():
            if args.only and args.only != name:
                continue
            for theme, colors in THEMES.items():
                width = 440 if tag == "family-link-card" or popup == "zoom" else 380
                html = PAGE % {
                    **colors,
                    "width": width,
                    "state": json.dumps(state),
                    "dark": "true" if theme == "dark" else "false",
                    "tag": tag,
                    "config": json.dumps(config),
                }
                html = html.replace("__CARD_JS__", js.replace("</script>", "<\\/script>"))
                page = await browser.new_page(device_scale_factor=2, viewport={"width": 900, "height": 1400})
                await page.set_content(html)
                await page.evaluate(f"Date.now = () => {int(NOW.timestamp() * 1000)}")
                await page.evaluate("window.__card._render()")
                if popup == "emergency":
                    await page.evaluate(
                        "window.__card._openPopup({type:'emergency', device:'phone-1', message:'Call me back right now please.', ring:true, notify:true, locate:false})"
                    )
                elif popup == "location":
                    await page.evaluate("window.__card._openPopup({type:'location', hours:24})")
                elif popup == "zoom":
                    await page.locator("#wrap .zoom").click()
                    await page.mouse.move(0, 0)
                card = await page.query_selector("#wrap")
                suffix = "" if theme == "dark" else "-light"
                if name in GIFS:
                    frames = []
                    for _ in range(GIF_FRAMES):
                        frames.append(Image.open(io.BytesIO(await card.screenshot(scale="css"))))
                        await page.wait_for_timeout(GIF_STEP_MS)
                    if save_gif(frames, out / f"{GIFS[name]}{suffix}.gif"):
                        print(f"{GIFS[name]}{suffix}.gif")
                await page.wait_for_timeout(2600)  # entrance animations done
                image = Image.open(io.BytesIO(await card.screenshot()))
                await page.close()
                if save_png(image, out / f"{name}{suffix}.png"):
                    print(f"{name}{suffix}.png")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
