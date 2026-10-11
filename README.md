# Mounir DABIRE — living poster

A static portfolio for AI engineer Mounir DABIRE, presenting his background and projects. The process of creating the site may also be shared on social media.

## Run locally

A static website with no build step or JavaScript dependencies required for local development. Serve this directory with `python -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173/`.

## GitHub and deployment

Public repository: https://github.com/Mounir1200/Mounir

GitHub Pages: https://mounir1200.github.io/Mounir/

Every push to `main` runs `.github/workflows/pages.yml`: checking scripts, preparing the `_site` directory, and publishing through GitHub Actions. The workflow can also be triggered manually from Actions. Both the site and repository are public, enabling GitHub Pages with the current account plan.

To check the published files locally, run `python scripts/build_site.py`. The script copies only the page, its linked assets, and font licenses. It checks files and anchors, preserves relative paths compatible with `/Mounir/`, and adds `.nojekyll`. Working documents, source manifests, review screenshots, and earlier video experiments are excluded from the published artifact.

## Art direction

An italic “Hello” introduces a kinetic studio poster: large lettering on peach, with a portrait in a cobalt frame. Selected projects and linked test cases come immediately after the poster, followed by professional experience, education from Ouagadougou to Angers, and personal photographs. The hero links directly to projects and contact. The palette uses brown #6c2b11, peach #f2ad78, and blue #0057ba. Body text uses brown and peach (5.54:1 contrast); blue and peach are reserved for large type and graphics (3.59:1). Gallery photographs retain their original colors.

Space Grotesk and Instrument Serif are served from `assets/fonts/`, with OFL licenses. The portrait in `assets/portrait-cobalt-peche.png` was generated with imagegen; the original remains in `assets/portrait.jpg`, and the prompts are kept locally in assets.

The page serves responsive WebP versions of the portrait: 560 × 700 (43,172 bytes) and 1122 × 1402 (199,924 bytes). The PNG master remains unchanged. The build includes `srcset` and responsive preload references.

The project panels visualize existing test cases, not product screenshots or client results. UrdWell's example comes from [`test_pipeline.py`](https://github.com/Mounir1200/urdwell-mcp/blob/main/test_pipeline.py#L89-L130). HindSight's synthetic billing example comes from [`test_retroactive_rate.py`](https://github.com/Mounir1200/HindSight/blob/main/tests/test_retroactive_rate.py#L37-L45). These public sources were reviewed on October 11, 2026; their remote tests were not executed as part of the portfolio update.

Each test panel is an independent native disclosure, initially open, with translated expand/collapse labels and keyboard support even without JavaScript. Featured project titles and the explicit “View the project on GitHub” links open their repositories; repository links remain accessible when test panels are collapsed.

Project descriptions explain the problem, the proposed approach and the reason for the technical choices in plain language. Test panels explain the scenario and the assertions: UrdWell preserves an inactive memory when a supplied correction replaces it; HindSight reconstructs a July 2 bill after receiving a retroactive rate on July 3. These are descriptions of source tests, not claims that the external test suites were run for this site update.

Professional experience is presented from newest to oldest. Each entry keeps its dates, role, employer, purpose and a short technology or topic list visible. Independent native disclosures reveal responsibilities, with technical details placed directly below the relevant tasks. The latest ESSCA role is expanded initially. ESSCA responsibilities and tool associations are drawn from the supplied French and English CVs; the October 9, 2026 contract end was supplied separately by Mounir. Moov Africa retains only the responsibilities and topics already documented in the portfolio. The disclosures work without JavaScript, support keyboard input and use translated FR/EN labels.

The HTML references `experience.css` and `translations.js` with content-version query parameters so an existing browser tab fetches their updated contents. When changing either file, refresh its `?v=` value in `index.html` with the first 12 characters of its SHA-256 hash. The build resolves and packages these versioned references normally.

## Background music

Music: [“Positive Chill-Hop” by ZephiraMusic on Pixabay](https://pixabay.com/fr/music/beats-positive-chill-hop-595886/). The track page lists use under the [Pixabay Content License](https://pixabay.com/service/license-summary/).

The website uses `assets/audio/positive-chill-hop.mp3`. The track lasts approximately 2 minutes and 1 second and plays on a loop. Gain is set to 18% through Web Audio, falling back to `audio.volume` when unavailable, independently of scrolling and animations.

Every visit starts silently. Playback begins only when the user activates the sound control in the header or photo viewer. Ordinary navigation, clicks and keyboard actions do not start audio. The controls pause and resume at the same position, and their indicators reflect actual playback. Animations respect reduced-motion preferences. Browser or operating system restrictions may suspend background playback.

## Languages and CVs

The portfolio is available in French and English. On the first visit, it uses the first supported language in the browser’s preferences, falling back to English if none matches. The persistent FR/EN switch saves the choice in localStorage. Links with `?lang=fr` or `?lang=en` can also be used to share a specific language; an explicit URL parameter takes precedence over the saved choice.

Switching languages does not reload the page: content, titles, alternative text, captions, controls, and accessibility messages update without rebuilding the document. Music, photographs, and the introduction retain their state. French strings in `index.html` serve as keys in `translations.js`; labels generated by JavaScript are listed in `dynamic-translations.js`. Add or update the translation whenever source text changes.

The CV links download the file for the active language: `assets/Mounir-DABIRE-CV.pdf` for French and `assets/Mounir-DABIRE-CV-EN.pdf` for English. These are the PDFs supplied on October 3, 2026, copied without modification. The build includes both variants declared in `data-cv-fr` / `data-cv-en`. Without JavaScript, the French content and French CV download remain available.

Check language selection and persistence with `node scripts/check_i18n.cjs`, which also runs in GitHub Actions.

## Motion

- On arrival, “Hello” appears for 1.4 seconds, followed by a 650 ms exit transition. Once the portrait loads, the poster starts a 6.5-second sequence involving typography, framing, the portrait, and orbits. An interaction skips the welcome screen immediately. Reduced-motion mode skips this welcome sequence.
- The poster never advances the page automatically. Pause, resume, and replay controls remain available from the landing section.
- The “Imagine / Build / Connect” band and project evidence panels stay still, keeping their text and links easy to read and use.
- Internal links use a short 240 ms transition. The skip link and reduced-motion navigation are immediate. Escape, another interaction, or a tab change ends the transition. Keyboard navigation moves focus to the destination section.
- A thin cobalt and peach trail follows mouse movement and fades within 500 ms when idle. It stops outside the page, during text input, and inside the photo viewer. The native cursor remains unchanged.
- When the tab is hidden, the welcome screen finishes and the introduction pauses. System reduced-motion preferences and data-saving mode disable automatic movement.
- All content remains visible without JavaScript and in reduced-motion mode. The global animation toggle has been removed; introduction pause and replay controls remain available.

## Navigation

The main navigation stays fixed at the top: Home, Projects, Experience, Journey, Hobbies, Gallery, and Contact. Sound and language controls share the header rather than covering content at the bottom of the screen. At widths up to 1100 px, an accessible Menu button reveals the links and CV download. Escape closes the menu and returns focus to the button; selecting a link also closes it. Without JavaScript, the navigation remains visible. The current section is underlined, and anchor destinations leave space below the header.

The `#galerie` section replaces the film with four supplied photographs, offset frames, and a native dialog for enlarged images. The viewer supports previous/next buttons, keyboard arrows, Escape, and focus restoration to the thumbnail. Loading and error messages explain unavailable images, with a retry button; stale image requests cannot replace a newer selection. Without JavaScript, each photograph remains a direct link. Legacy `#film` and `#film-details` anchors redirect to the gallery.

The KTU exchange in Lithuania (2023) and RWU exchange in Germany (2024–2025) each have a three-photo album in the Journey section. The `#hobbies` chapter follows the projects and covers Pixel photography, video games and manga, reading, music, and strength training. Albums remain separate in the viewer through `data-gallery-group`.

Images come from the four subfolders of `Photos-1-001`. The Photography section displays all 16 files from its source folder in a continuously looping fan carousel: an enlarged foreground image, pause on hover and focus, previous/next controls, keyboard support, and horizontal dragging. The Pause button keeps the carousel stopped until resumed. Automatic motion stops offscreen, inside the viewer, in a hidden tab, and when reduced motion is preferred. Without JavaScript, all 16 links remain available in a grid.

WebP previews, up to 900 px, are loaded on demand. Viewer versions, up to 1,800 px, are requested only when opened. The 16 photography thumbnails total approximately 1.16 MiB. Original files remain untouched. `assets/life/sources.json` and `assets/life/photography.json` record the source mappings.

Visual reference for the fan carousel: https://21st.dev/@ayushmxxn/components/image-fan-carousel. The local implementation uses native JavaScript and CSS, without React, Framer Motion, or additional dependencies. Text, photographs, and the color direction belong to this portfolio.

The two reading excerpts are transcribed from the supplied text. The passage about the dreamer is presented with Fiodor Dostoïevski’s *White Nights* (*Les Nuits blanches*). The author of the passage on page 99 has not been confirmed; its caption identifies it only as a passage retained from the copy being read. The BnF record at https://catalogue.bnf.fr/ark:/12148/cb35591828m confirms an afterword by Michel del Castillo in the 1992 Babel edition, but does not establish the quotation’s authorship on its own.

Video files and the two video prompts are kept as working archives; there is no video player on the page.

## Sources

- Supplied CVs, copied to `assets/Mounir-DABIRE-CV.pdf` and `assets/Mounir-DABIRE-CV-EN.pdf`: ESAIP, ESSCA, skills, contact details, and main projects.
- Previous portfolio: https://mounir1200.github.io/PortFolio/ (reviewed on October 2, 2026), additional projects, Moov Africa, and preparatory classes (CPGE).
- Project repositories: https://github.com/Mounir1200/urdwell-mcp and https://github.com/Mounir1200/HindSight.

Project illustrations are conceptual diagrams, not screenshots of their interfaces. No clients, testimonials, or performance figures are fabricated.

## Files

- `index.html`: content and structure.
- `style.css`: foundations, fonts, and components.
- `landing.css`: poster and opening sequence.
- `experience.css`: visual direction and motion for subsequent sections.
- `encore.css`: typography band, scroll-driven artwork, and hover effects.
- `transitions.css`: navigation panels and poster staging.
- `gallery.css`: photographs and viewer.
- `narrative.css`: chapters, connections between stages, the Hello welcome screen, and cursor layer.
- `life.css`: Erasmus albums, hobbies, reading excerpts, and mobile navigation with seven links.
- `photography.css` and `photography.js`: continuous photo fan, controls, dragging, and grid fallback.
- `music.css` and `music.js`: looping background audio, quiet volume, and synchronized controls.
- `language.css`, `i18n.js`, `translations.js`, and `dynamic-translations.js`: FR/EN switch, preferences, translation, and CV selection.
- `app.js`: introduction state, scrolling, controls, visibility, preferences, and pointer interactions.
- `cursor.js`: a short-lived SVG trail, active only during mouse movement.
- `VALIDATION.md`: checks and limitations.

Original files in the parent directory are outside the repository. Earlier video experiments remain local and are ignored by Git.
