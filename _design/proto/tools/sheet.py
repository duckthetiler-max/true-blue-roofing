# Usage: python3 sheet.py out.jpg cols width img1 img2 ...
import sys
from PIL import Image
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
ims = [Image.open(p).convert('RGB') for p in sys.argv[4:]]
ims = [im.resize((w, round(im.height * w / im.width))) for im in ims]
h = max(im.height for im in ims); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w + (cols - 1) * 8, rows * h + (rows - 1) * 8), (255, 255, 255))
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * (w + 8), (i // cols) * (h + 8)))
sheet.save(out, quality=85)
print(out, sheet.size)
