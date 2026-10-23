# Usage: python3 board.py out.jpg "Title" "Subtitle" desk:<cols> a.png b.png ... phone:<cols> x.png y.png ...
# Lays out a titled storyboard: a dark header, then each group of screenshots in a grid.
import sys
from PIL import Image, ImageDraw, ImageFont

W, GAP, PAD = 2400, 28, 48
BG, INK, MUTED = (14, 16, 22), (245, 245, 240), (150, 156, 170)
FONT = '/usr/share/fonts/opentype/inter/'
title_f = ImageFont.truetype(FONT + 'InterDisplay-SemiBold.otf', 60)
sub_f = ImageFont.truetype(FONT + 'Inter-Regular.otf', 30)
label_f = ImageFont.truetype(FONT + 'Inter-SemiBold.otf', 24)

out, title, sub = sys.argv[1:4]
groups, cur = [], None
for a in sys.argv[4:]:
    if ':' in a and a.split(':')[0] in ('desk', 'phone', 'wide'):
        kind, cols = a.split(':'); cur = {'kind': kind, 'cols': int(cols), 'imgs': []}; groups.append(cur)
    else:
        cur['imgs'].append(a)

blocks = []
for g in groups:
    cols = g['cols']; cw = (W - 2 * PAD - (cols - 1) * GAP) // cols
    ims = [Image.open(p).convert('RGB') for p in g['imgs']]
    ims = [im.resize((cw, round(im.height * cw / im.width)), Image.LANCZOS) for im in ims]
    rh = max(im.height for im in ims); rows = (len(ims) + cols - 1) // cols
    blocks.append((g, cols, cw, rh, rows, ims))

label_h = 56
H = 200 + sum(label_h + rows * rh + (rows - 1) * GAP + PAD for g, cols, cw, rh, rows, ims in blocks)
board = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(board)
d.text((PAD, 52), title, font=title_f, fill=INK)
d.text((PAD, 128), sub, font=sub_f, fill=MUTED)
y = 200
for g, cols, cw, rh, rows, ims in blocks:
    d.text((PAD, y + 12), {'desk': 'DESKTOP', 'phone': 'PHONE', 'wide': ''}[g['kind']], font=label_f, fill=MUTED)
    y += label_h
    for i, im in enumerate(ims):
        x = PAD + (i % cols) * (cw + GAP); yy = y + (i // cols) * (rh + GAP)
        board.paste(im, (x, yy))
        d.rectangle([x - 1, yy - 1, x + im.width, yy + im.height], outline=(44, 48, 60), width=1)
    y += rows * rh + (rows - 1) * GAP + PAD
board.save(out, quality=86, optimize=True)
print(out, board.size)
