#!/usr/bin/env python3
"""Turn the originals in "Website Photos/<group>/<id>/*" into web-ready WebP files under public_website/photos/.

    python3 scripts/photos-to-webp.py "<Website Photos folder>"

Groups: 1-rooms -> photos/rooms/<id>/, 2-activities -> photos/activities/<id>/, 3-photo-spots -> photos/spots/<id>/,
4-other -> photos/other/. Each folder's images are sorted by file name and written as 1.webp, 2.webp, ... (1 = cover).
Long edge is capped at 1600 px, EXIF rotation is applied. HEIC is converted with macOS `sips` first (Pillow cannot read it).
The output folder of every id is rebuilt from scratch, so running it again after adding or removing originals is safe.
"""
import shutil, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageOps

MAX_EDGE, QUALITY, WARN_KB = 1600, 80, 400
GROUPS = {"1-rooms": "rooms", "2-activities": "activities", "3-photo-spots": "spots", "4-other": "other"}
EXT = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"}
OUT = Path(__file__).resolve().parent.parent / "photos"


def load(src: Path, tmp: Path) -> Image.Image:
    if src.suffix.lower() in (".heic", ".heif"):
        jpg = tmp / (src.stem + ".jpg")
        subprocess.run(["sips", "-s", "format", "jpeg", str(src), "--out", str(jpg)], check=True, capture_output=True)
        src = jpg
    im = ImageOps.exif_transpose(Image.open(src))
    im.thumbnail((MAX_EDGE, MAX_EDGE))
    return im.convert("RGB")


def convert_folder(files, dest: Path, tmp: Path):
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    out = []
    for f in sorted(files, key=lambda p: p.name.lower()):
        target = dest / f"{len(out) + 1}.webp"  # no gaps in the numbering when a file is skipped
        try:
            load(f, tmp).save(target, "WEBP", quality=QUALITY, method=6)
        except Exception as e:  # one bad file must not stop the other 99
            print(f"  SKIP {f.name}: {e}")
            continue
        kb = target.stat().st_size // 1024
        print(f"  {f.name} -> {target.relative_to(OUT.parent)} ({kb} KB{' !! large' if kb > WARN_KB else ''})")
        out.append(target)
    return out


def main(root: Path):
    total = 0
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        for group, outname in GROUPS.items():
            g = root / group
            if not g.is_dir():
                continue
            if outname == "other":
                files = [p for p in g.iterdir() if p.suffix.lower() in EXT]
                if files:
                    print(f"[{group}]")
                    # keep the original names: they say where each file is used
                    (OUT / "other").mkdir(parents=True, exist_ok=True)
                    for f in files:
                        target = OUT / "other" / (f.stem + ".webp")
                        load(f, tmp).save(target, "WEBP", quality=QUALITY, method=6)
                        print(f"  {f.name} -> {target.relative_to(OUT.parent)}")
                        total += 1
                continue
            for d in sorted(p for p in g.iterdir() if p.is_dir()):
                files = [p for p in d.iterdir() if p.suffix.lower() in EXT]
                if not files:
                    continue
                print(f"[{group}/{d.name}] {len(files)} photos")
                total += len(convert_folder(files, OUT / outname / d.name, tmp))
    print(f"done: {total} files, {sum(f.stat().st_size for f in OUT.rglob('*.webp')) // 1024} KB in photos/")


if __name__ == "__main__":
    if len(sys.argv) != 2 or not Path(sys.argv[1]).is_dir():
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
