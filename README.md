# CHEXXY — Lucky Race

React + TypeScript implementation of [Figma node 27731:35278](https://www.figma.com/design/XjXU6fg3jQArN1tZQqX80H/CHEXXY?node-id=27731-35278).

## Run

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Build with `npm run build`; serve the build with `npm run preview`.

## Implementation

- The race fills the phone's visible viewport. The artwork scales with screen width and height, the leaderboard scrolls within its panel, and the participation button remains visible. The phone's own status and browser bars supply the device chrome.
- Artwork is composed from the original Figma image layers. Every asset is local in `public/assets`; SVGs retain their intrinsic dimensions. The beer avatar has a 216px display variant to avoid browser downsampling artifacts; its original export is preserved. The asset manifest lists the original export identifiers.
- Balgin, FreeSetBlackC, and SF Pro fonts were copied from the local font installation into `public/fonts`. Inter Medium is from the official Inter repository and retained for existing integrations.
- The prize summary and rewards use the data supplied in Figma. The leaderboard has ten distinct demo player IDs and descending total bets. The tenth prize is unspecified in the source and is left empty.
- Tabs support arrow keys, Home, and End. The close control dismisses the race and exposes a button to reopen it in this standalone preview. The artwork responds subtly to pointer movement and respects reduced-motion preferences.
- The countdown starts at the supplied design value on each page load. Replace its demo deadline with the actual race end timestamp when integrating an API.
- The Terms link opens the Figma bottom sheet with parameters and leaderboard facts shared with the race screen. Its header and footer remain visible while content scrolls on shorter phones. Events & Games shows preview content because its screen was not supplied. The participation button opens an accessible preview dialog; it does not create an account, join a race, or place a bet.

## Verify

```sh
npm test
```

The Playwright configuration uses installed Google Chrome. Seven browser checks cover asset loading and screen geometry, tab navigation, dialog keyboard behavior, countdown, closing and reopening, responsive widths, scrolling, and reduced motion. The terms sheet is captured at 360px and 320px. Race screenshots are saved to `test-results/lucky-race-360.png` and `test-results/lucky-race-mobile-390.png`.

`src/main.tsx` contains the reusable UI components and supplied player data. `src/styles.css` contains the design tokens, responsive layout and artwork positioning.
