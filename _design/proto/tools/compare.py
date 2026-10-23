# Usage: python3 compare.py out.jpg "Title" "Subtitle" "Name|Feel|desktop.png|phone.png" ...
# One column per prototype: its name and feel, the desktop hero, and the phone hero underneath.
import sys
from PIL import Image, ImageDraw, ImageFont

W, GAP, PAD, PHONE_W = 2400, 40, 48, 330
BG, INK, MUTED = (14, 16, 22), (245, 245, 240), (150, 156, 170)
FONT = '/usr/share/fonts/opentype/inter/'
title_f = ImageFont.truetype(FONT + 'InterDisplay-SemiBold.otf', 60)
sub_f = ImageFont.truetype(FONT + 'Inter-Regular.otf', 30)
name_f = ImageFont.truetype(FONT + 'InterDisplay-SemiBold.otf', 40)
feel_f = ImageFont.truetype(FONT + 'Inter-Regular.otf', 24)

out, title, sub, *cols = sys.argv[1:]
cols = [c.split('|') for c in cols]
cw = (W - 2 * PAD - (len(cols) - 1) * GAP) // len(cols)
desk = [Image.open(d).convert('RGB') for _, _, d, _ in cols]
desk = [im.resize((cw, round(im.height * cw / im.width)), Image.LANCZOS) for im in desk]
phone = [Image.open(p).convert('RGB') for _, _, _, p in cols]
phone = [im.resize((PHONE_W, round(im.height * PHONE_W / im.width)), Image.LANCZOS) for im in phone]
top = 200 + 120
H = top + max(d.height for d in desk) + GAP + max(p.height for p in phone) + PAD
board = Image.new('RGB', (W, H), BG)
dr = ImageDraw.Draw(board)
dr.text((PAD, 52), title, font=title_f, fill=INK)
dr.text((PAD, 128), sub, font=sub_f, fill=MUTED)
for i, ((name, feel, _, _), d, p) in enumerate(zip(cols, desk, phone)):
    x = PAD + i * (cw + GAP)
    dr.text((x, 200), name, font=name_f, fill=INK)
    dr.text((x, 256), feel, font=feel_f, fill=MUTED)
    board.paste(d, (x, top))
    dr.rectangle([x - 1, top - 1, x + d.width, top + d.height], outline=(44, 48, 60), width=1)
    px, py = x + (cw - p.width) // 2, top + d.height + GAP
    board.paste(p, (px, py))
    dr.rectangle([px - 1, py - 1, px + p.width, py + p.height], outline=(44, 48, 60), width=1)
board.save(out, quality=86, optimize=True)
print(out, board.size)
