# Happy Birthday, Aakanksha

## Setup
1. Put 15–20 photos in `photos/` folder, named `1.jpg`, `2.jpg`, `3.jpg`, ... up to however many you have (jpg/png/webp all fine — just keep numeric names, or update extension in `index.html`).
2. In `index.html`, find `const TOTAL_PHOTOS = 18;` and set to your actual photo count.
3. Push both `index.html` and `photos/` folder to your GitHub repo.
4. Enable GitHub Pages: repo Settings → Pages → Source: `main` branch, root. Site goes live at `https://<username>.github.io/<repo>/`.

## Customize
- Name/messages: edit text inside `<h1>Aakanksha</h1>`, `.script.small` label, `.note-card h2/p`, `.msg2-wrap h2/p`, `.closing` sections in `index.html`.
- Colors: whole page is one continuous red gradient (bright red top → deep red/black bottom), set on `body`. CSS variables at top of `<style>` (`--sunset-deep`, `--sunset-mid`, `--sunset-pink`, `--wine`, `--rose-red`, `--gold`) control accents; palette is red / white / black / small orange only, matched to reference image.
- Hero visual: rose illustration (pure SVG, no image needed) sways gently above the name.
- Animation: falling rose-petal canvas runs automatically; button at bottom triggers extra burst; gallery section also bursts once on scroll-in. See "Swap the animation" below for other options.
- Photo count: any number 15–20 works, just match `TOTAL_PHOTOS` in the script to real count.

Missing photos show a numbered placeholder square instead of breaking — good way to check layout before uploading real images.

## Swap the animation
`index.html` currently runs the petal-fall animation inline (between `/* ================= Falling rose petals ================= */` and `</script>` near the bottom of the file). Other effects live standalone in `effects/`:

- `effects/petals.js` — falling rose petals (current default)
- `effects/fireflies.js` — glowing drifting sparkles
- `effects/lanterns.js` — rising paper lanterns
- `effects/cursor-hearts.js` — hearts trailing your cursor

To switch: delete the inline block in `index.html` (from `/* ================= Falling rose petals ================= */` down to the line before `</script>`), then either paste in one of the other files' contents in its place, or replace the whole inline block with a single line:
```html
<script src="effects/fireflies.js"></script>
```
(swap `fireflies.js` for `lanterns.js` or `cursor-hearts.js` as wanted). Only run one effect at a time — each file declares its own `canvas`/`ctx`/`tick()`, so loading two together will conflict.
