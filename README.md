[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/bebek22-jpg/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/bebek22-jpg/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide

An offline, open-source trophy guide and tracker for Grand Theft Auto VI on PlayStation 5: all 55 official trophies with a guide to each, a roadmap to the platinum, and a checklist saved in your browser. It runs entirely offline in a desktop browser from its own static files — no account, no network, nothing uploaded.

## What it does

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze — each with its official name, description and grade, and a guide in our own words: what to do, where, and how.
- **Checklist that remembers** — tick trophies off and they stay ticked (localStorage), with export and import as JSON so you can back up or move your progress.
- **Filters by kind** — story, strangers, crime & robberies, activities, collectibles & money, 100% completion, hidden & unsolved — plus grade filter, search, and a hide-earned toggle.
- **Spoiler-safe mode** — on by default: story trophies stay hidden until you earn them or choose to reveal one.
- **Roadmap to the platinum** — three phases (story, the 100% checklist, clean-up), about 200 hours all in, one playthrough.
- **The one missable flagged** — Positive Mental Attitude: meditate at Jason's house in Chapter 1, before the chapter ends. Everything else can be earned after the story.
- **Honest about what is not known yet** — 47 trophies are confirmed by the guides, 6 are reported methods drawn from the trophy description, and 2 (Bad Luck, I Guess; The Truth Is Out There) are unconfirmed: no published guide states a method as of 21 November 2026, and this guide says so instead of inventing one. Every trophy card cites the guides its steps rest on.

## Sources

Names, descriptions and grades are the ones shown on the console trophy list (PS5 / Xbox), compiled from independent guides that cross-check each other: [Push Square](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap), [GTA Vibes](https://www.gtavibes.com/guides/gta-6-trophy-list-achievements), [GTA Scoop](https://gtascoop.com/guides/gta-6-trophies-achievements/), [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/), [GameMapa (PowerPyx / GamesRadar+)](https://gamemapa.com/en/gta-6/guides/gta-6-trophy-achievement-list/), [Vice City Hustle](https://www.vicecityhustle.com/guides/gta-6-trophy-list-all-55-trophies) and [Sixshore](https://sixshore.com/gta-6/guides/trophies-and-achievements/). No official Rockstar, Sony or Microsoft page publishes the list as a web page. One disagreement is noted in the app: Push Square's page labels Maximum Withdrawal Bronze, while the other guides list it Silver — this guide lists it Silver.

Guide text is written for this page in our own words; it draws on the guides above and cites them, and never copies their text. No Rockstar Games logo, artwork or font is used. This is an unofficial fan guide, not affiliated with Rockstar Games.

## How to run it

```sh
node serve.ts
# open http://localhost:8080
```

Node 22 or later, no install step, no network needed. Or open `app/index.html` directly from the files (served is recommended so the trophy data loads).

## How to take screenshots

The app supports `?shot=` presets that stage fixed scenes for screenshots (with `&demo=1` to seed a sample set of earned trophies):

- `/?shot=cover&demo=1` — hero, progress bar and roadmap intro
- `/?shot=checklist&demo=1` — the trophy checklist with filters
- `/?shot=missable&demo=1` — the Positive Mental Attitude guide, the one missable trophy
- `/?shot=roadmap&demo=1` — the three-phase roadmap to the platinum

See `shots.json` for the exact presets used for this entry's screenshots.

## Bounty

Built for the [gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01) on make.fun. `main.ts` hands the guide in: it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library.
