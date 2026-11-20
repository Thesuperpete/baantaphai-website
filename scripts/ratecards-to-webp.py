#!/usr/bin/env python3
"""Rate-card originals -> web files in public_website/photos/ratecards/.

    python3 scripts/ratecards-to-webp.py "<05 Rate Card folder>"

Per room id: <id>.webp (1200 px wide, shown on the page) and <id>-full.jpg (2400 px wide, for the full-screen viewer and "save image").
The mapping below is by original file name; edit it if the owner's files are renamed.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

MAP = {  # original file -> room id on the site
    "For Edit (2).jpg": "sky_view", "For Edit (3).jpg": "lake_view", "For Edit (4).jpg": "country_house", "For Edit (5).jpg": "family_house",
    "For Edit (6).jpg": "jp_full", "For Edit (7).jpg": "jp_king", "For Edit (8).jpg": "jp_2king", "For Edit.jpg": "rock_view",
}
OUT = Path(__file__).resolve().parent.parent / "photos" / "ratecards"


def main(src: Path):
    OUT.mkdir(parents=True, exist_ok=True)
    for name, rid in MAP.items():
        f = src / name
        if not f.exists():
            print(f"missing: {name}"); continue
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        full = im.copy(); full.thumbnail((2400, 2400)); full.save(OUT / f"{rid}-full.jpg", "JPEG", quality=84, optimize=True, progressive=True)
        show = im.copy(); show.thumbnail((1200, 1200)); show.save(OUT / f"{rid}.webp", "WEBP", quality=80, method=6)
        print(f"{name} -> {rid}: {(OUT / f'{rid}.webp').stat().st_size // 1024} KB webp, {(OUT / f'{rid}-full.jpg').stat().st_size // 1024} KB jpg")


if __name__ == "__main__":
    if len(sys.argv) != 2 or not Path(sys.argv[1]).is_dir():
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
