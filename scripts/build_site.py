"""Package the static portfolio and its linked assets for GitHub Pages."""

from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"
LICENSES = (
    "assets/fonts/InstrumentSerif-OFL.txt",
    "assets/fonts/SpaceGrotesk-OFL.txt",
    "assets/fonts/SOURCES.txt",
)


class SiteReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.ids = set()
        self.anchors = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                raise ValueError(f"Duplicate ID: {attrs['id']}")
            self.ids.add(attrs["id"])
        for key in ("src", "href"):
            reference = attrs.get(key, "")
            if reference.startswith("#"):
                self.anchors.append(unquote(reference[1:]))
            elif reference:
                self.references.append(reference)


def local_asset(reference, parent=ROOT):
    url = urlsplit(reference)
    if url.scheme or url.netloc or not url.path:
        return None
    if url.path.startswith("/"):
        raise ValueError(f"Root-relative URL would escape /Mounir/: {reference}")
    path = (parent / unquote(url.path)).resolve()
    if not path.is_relative_to(ROOT) or path.is_relative_to(OUTPUT):
        raise ValueError(f"Asset outside the source tree: {reference}")
    if not path.is_file():
        raise FileNotFoundError(path.relative_to(ROOT))
    return path


def main():
    parser = SiteReferences()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    missing_anchors = set(parser.anchors) - parser.ids
    if missing_anchors:
        raise ValueError(f"Missing anchors: {sorted(missing_anchors)}")

    assets = {ROOT / "index.html"}
    pending = parser.references + list(LICENSES)
    while pending:
        asset = local_asset(pending.pop())
        if asset is None or asset in assets:
            continue
        assets.add(asset)
        if asset.suffix == ".css":
            urls = re.findall(r"url\(\s*['\"]?([^)'\"\s]+)", asset.read_text(encoding="utf-8"))
            for url in urls:
                linked = local_asset(url, asset.parent)
                if linked:
                    pending.append(linked.relative_to(ROOT).as_posix())

    # This directory is generated only by this script, never a source directory.
    if OUTPUT.is_symlink() or OUTPUT.resolve() != ROOT / "_site":
        raise ValueError("Unsafe build output directory")
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for asset in sorted(assets):
        destination = OUTPUT / asset.relative_to(ROOT)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(asset, destination)
    (OUTPUT / ".nojekyll").touch()
    total = sum(asset.stat().st_size for asset in assets)
    print(f"Pages ready: {len(assets)} files + .nojekyll, {total / 1024**2:.2f} MiB")


if __name__ == "__main__":
    main()
