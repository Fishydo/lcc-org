# Local vendor assets for `lcc-math2`

This repository mirrors the CDN dependencies referenced by
`https://gitlab.com/Lucaspeck/lcc-math2/-/blob/main/index.html` into `/script`.

## Files
- `tailwindcss-browser@4.js`
- `three.r134.min.js`
- `vanta.fog.0.5.24.min.js`
- `font-awesome.6.4.0.all.min.css`

## App structure
- `index.html` is now a minimal bootstrap file that only pulls CSS/JS paths.
- `/pages/app-shell.html` contains the app markup.
- `/js/bootstrap.js` fetches the app shell and then loads `/js/inline-01.js` to `/js/inline-04.js`.
