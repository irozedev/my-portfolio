# Redesign source

The working files behind the design canvas at
https://claude.ai/code/artifact/957da0d0-1595-46db-867d-e70d61fb9334

Each `.dc.html` is one artboard. `canvas.json` places them and carries the
sticky notes. `roze-live-redesign.html` is the built canvas: do not edit it by
hand, it is regenerated from these files.

| file | what it is |
|---|---|
| `Main.dc.html` | client page, dark, the built-out direction |
| `Light.dc.html` | client page, light theme |
| `CV.dc.html` | hiring mode |
| `Mobile.dc.html` | client page at 390px |
| `Project.dc.html` | the fullscreen project view |
| `Components.dc.html` | GitHub feed, chat assistant, cookie banner, book-a-call, scroll-to-top, toasts, theme and mode switches |
| `Legal.dc.html` | privacy, terms, cookies, with the company details rail |
| `CvPrint.dc.html` | A4 print sheet, 794x1123 at 96dpi |
| `AltEditorial.dc.html` | sketch of a second direction, not built out |
| `AltTerminal.dc.html` | sketch of a third direction, not built out |

Palette and contrast come from `src/styles/theme.css` unchanged, including the
darker light-mode accents that exist to clear 4.5:1. Type is Archivo for
display, Instrument Sans for body, IBM Plex Mono for labels: Inter was dropped
because it is one of the faces that makes a page read as generated.

Still to fill in: the KBO number (`BE 0800.000.000` is a stand-in) and two
screenshots. Everything else came out of `src/app/data/experience.ts` and the
live components.
