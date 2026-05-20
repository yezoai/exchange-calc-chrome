#!/usr/bin/env python3
"""Generate the Exchange Calc Chrome extension icons.

A rounded-square badge with a diagonal emerald->blue gradient and a white
"exchange" loop (two arrowed arcs). Larger sizes also carry the $ and ¥
symbols inside the loop; the small toolbar sizes use the loop alone so the
mark stays readable when shrunk.
"""

import math
import os

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")
MASTER = 1024

# size -> use the detailed (symbols inside) layout?
SIZES = {128: True, 48: True, 32: False, 16: False}

C_TOP_LEFT = (16, 185, 129)     # emerald
C_BOTTOM_RIGHT = (37, 99, 235)  # blue
WHITE = (255, 255, 255, 255)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def gradient_square(s):
    """Diagonal gradient clipped to a rounded square."""
    mid = lerp(C_TOP_LEFT, C_BOTTOM_RIGHT, 0.5)
    seed = Image.new("RGB", (2, 2))
    seed.putpixel((0, 0), C_TOP_LEFT)
    seed.putpixel((1, 0), mid)
    seed.putpixel((0, 1), mid)
    seed.putpixel((1, 1), C_BOTTOM_RIGHT)
    gradient = seed.resize((s, s), Image.BICUBIC)

    mask = Image.new("L", (s, s), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=255
    )
    icon = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    icon.paste(gradient, (0, 0), mask)
    return icon


def draw_loop(draw, cx, cy, radius, ring_w, head_len, head_w):
    """Two arrowed arcs forming a clockwise exchange loop."""
    for start_deg, end_deg in ((202, 338), (22, 158)):
        bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
        draw.arc(bbox, start_deg, end_deg, fill=WHITE, width=ring_w)
        th = math.radians(end_deg)
        px = cx + radius * math.cos(th)
        py = cy + radius * math.sin(th)
        d = (-math.sin(th), math.cos(th))     # clockwise tangent
        perp = (d[1], -d[0])
        tip = (px + d[0] * head_len, py + d[1] * head_len)
        b1 = (px + perp[0] * head_w, py + perp[1] * head_w)
        b2 = (px - perp[0] * head_w, py - perp[1] * head_w)
        draw.polygon([tip, b1, b2], fill=WHITE)


def build_master(detailed):
    s = MASTER
    icon = gradient_square(s)
    draw = ImageDraw.Draw(icon)
    cx, cy = s / 2, s / 2

    if detailed:
        draw_loop(draw, cx, cy, s * 0.320, int(s * 0.060),
                  s * 0.090, s * 0.075)
        font = ImageFont.truetype(FONT_PATH, int(s * 0.275))
        for glyph, gx in (("$", cx - s * 0.135), ("¥", cx + s * 0.135)):
            draw.text((gx, cy), glyph, font=font, fill=WHITE, anchor="mm")
    else:
        draw_loop(draw, cx, cy, s * 0.300, int(s * 0.135),
                  s * 0.150, s * 0.130)

    return icon


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    masters = {True: build_master(True), False: build_master(False)}
    masters[True].save(os.path.join(OUT_DIR, "icon.png"))
    for size, detailed in SIZES.items():
        resized = masters[detailed].resize((size, size), Image.LANCZOS)
        resized.save(os.path.join(OUT_DIR, f"icon-{size}.png"))
        print(f"wrote icon-{size}.png")


if __name__ == "__main__":
    main()
