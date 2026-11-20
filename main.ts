// Leonida Trophy Guide — the entry program for gta6-trophy-guide-01 (Node 22,
// standard library only). The guide itself is app/: plain static files that a
// browser opens at app/index.html (ES modules, CSS and data/trophies.json, no
// build step, no network). This program hands it in: it copies app/ and
// screenshots/ from beside this file to /output (or $MAKEFUN_OUTPUT_DIR outside
// the grader) and writes /output/dossier.json with the vendored make.fun
// library. vendor/makefun-frontend.ts is the kit's copy, left untouched: the
// scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit): at most 4 screenshots, each at most
// 256 KiB; app/ at most 993 files and directories and 48 MiB in all.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
