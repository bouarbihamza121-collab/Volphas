# Volphas — Project Handoff

This document is the complete onboarding guide for any developer (or AI agent
like Claude Code) picking up Volphas after the prototype phase. Read it
end-to-end before touching code.

---

## 1 — What Volphas is

A Duolingo-style language-learning app **for native Arabic speakers learning
English** (other languages planned). Mobile-first, RTL UI, friendly cartoon
mascot named Volph (a teal wolf). Built as a single HTML prototype to
validate UX before investing in a "real" stack.

**Differentiators vs Duolingo:**
- Arabic-first interface (RTL, Arabic copy, Arabic explanations)
- Story/conversation units mixed in (every 3 teaching units)
- "تحجير القلب" (heart-stoning) — a weekly-quest-earned shield that lets users
  make mistakes for a week without losing hearts
- 8-tier league ladder (Bronze → Galaxy/Champion) — deeper progression than
  Duolingo's 4 leagues
- Wolf mascot with multiple expressions; 22 selectable animal avatars

**Current state:** Single-file HTML prototype, ~250KB, fully functional.
Has been refined heavily for visual polish and tested by the founder
(Hamza). Not yet user-tested with strangers.

---

## 2 — Audience and business model

**Target user:** Arabic-speaking learners (Morocco, Algeria, Tunisia, Egypt,
Saudi, Levant). Mobile-first, price-sensitive, value-driven.

**Business model:** freemium with two revenue streams (planned, not yet built):
1. **AdMob rewarded ads** — between lessons, also unlock-after-no-hearts
2. **Volphas Plus subscription (~$3/mo)** — unlimited hearts, no ads,
   double XP. Soft blue/yellow card already designed in the prototype.

**Minimum viable launch:** Android PWA → Trusted Web Activity → Play Store.
iOS deferred until revenue justifies the $99/year fee.

---

## 3 — File layout

```
volphas/
  volphas-app.html              ← THE app (single-file prototype, ~250KB)
  README.txt                    ← user-facing "how to run" doc
  HOW_TO_GET_GOOD_VOICES.txt    ← stale, points to README now
  START.bat                     ← Windows launcher (Hamza uses this)
  PROJECT_HANDOFF.md            ← this file

  audio/
    manifest.json               ← exact-text → mp3-path lookup
    *.mp3                       ← exercise vocabulary audio (~50 files)
    stories/
      l1_s1_0.mp3 … l6_s10_*    ← per-line story audio (Sonia/Ryan voices)

  images/
    volph_icon.png              ← small wolf logo (header, profile default)
    volph_inside.png            ← full-body wolf (onboarding, mascot)
    volph_smile.png             ← happy-face (correct-answer feedback)
    volph_sad.png               ← sad-face (wrong-answer feedback)
    heart.png, heart_stone.png  ← hearts UI
    electric_bolt.png           ← XP icon
    streak.png, 0_streak.png    ← active / inactive streak shield
    basic_chest.png             ← unit treasure
    good_chest.png              ← daily quest chest
    premium_chest.png           ← weekly quest chest
    nav_*.png                   ← 5 bottom-nav icons (home/quests/rewards/league/profile)
    level_1_*.png … level_6_*   ← 6 level icons (sprout → crown)
    avatar_*.png                ← 22 animal avatars
    bronze.png … galaxy.png     ← 8 league-tier badges
    book.png, clock.png         ← daily quest icons
    ball.png                    ← (used in match exercises)
    cards/                      ← 13 vocabulary cards (clay-style PNGs)
      apple.png, banana.png, …

  tools/
    extract_audio_texts.py      ← scans HTML for AUDIO_MAP entries
    generate_audio.py           ← edge-tts MP3 generator (Sonia voice)
    generate_audio.bat          ← Windows wrapper
    generate_story_audio.py     ← per-line story audio (Sonia + Ryan voices)
    generate_story_audio.bat    ← Windows wrapper
    fix_image_backgrounds.py    ← removes solid backgrounds via flood-fill
    fix_image_backgrounds.bat   ← Windows wrapper
    install_images.html         ← drag-drop helper that bundles user's
                                  PNGs into the right folder structure
```

---

## 4 — Architecture

**Single-file HTML.** All state, UI, exercise data, audio paths, and design
are in `volphas-app.html`. ~3500 lines. There is no build step.

**Why single file?** Because we wanted the founder to be able to send the
prototype as one zip, open it offline by double-clicking `START.bat`, and
have everything work. When migrating to PWA + Firebase, this should be
split into modules (see Section 9).

**Persistence:** browser `localStorage` only. Keys are all `vp_*`:
- `vp_email`, `vp_name`, `vp_avatar`, `vp_lang`, `vp_onboarded`
- `vp_hearts`, `vp_streak`, `vp_xp`, `vp_lastRefill`, `vp_units_done`
- `vp_league`, `vp_trophies`
- `vp_units_<level>` — per-unit completion state
- `vp_lessons_<unit>` — per-lesson completion (4 lessons per unit)
- `vp_daily_<YYYY-M-D>` — daily quest progress
- `vp_weekly_<YYYY-M-D>` — weekly quest progress
- `vp_currentLevel` — last-opened level

**State shape (`var S = {...}`):**
- Identity: `name`, `email`, `avatar`, `lang`
- Progress: `xp`, `streak`, `hearts`, `maxHearts`, `unitsCompleted`
- Power-ups: `rockActive` (week-long), `miniRock` (short-term)
- Trophies: array of badges earned
- League: `leagueId` (one of 8 tiers)
- Lesson runtime: `exIdx`, `exList`, `correct`, `xpGained`, `done`,
  `sel`, `placed`, `ordPlaced`, `matchDone`

---

## 5 — Feature inventory

### Screens
1. **Onboarding** — 2 steps: name+email/Google → language picker
2. **Home (الرئيسية)** — language pill (top-left), level cards
3. **Map** — units arranged in winding sine path, paws inside each unit
   show 4-lesson progress, treasures and stories interleaved
4. **Lesson** — 9 exercises per lesson, hearts + XP + progress bar
5. **Story** — auto-playing dialogue with per-speaker voices, clickable
   Arabic translations, comprehension Q&A at the end
6. **Quests (مهام)** — 3 daily + 1 weekly with chest + reward pills
7. **Rewards (المكافآت)** — Premium card + "watch ad" + "تحجير القلب" earn
8. **League (الدوري)** — 8-tier ladder strip, leaderboard against 9 bots
9. **Profile (ملفي)** — avatar (clickable to change), stats, invite friends,
   discreet ⚙ Settings (edit name + sign out)

### Exercise types (in `EXERCISES` map)
- `mcq` — 4-option multiple choice
- `tiles` — fill-in-the-blank by tapping a word tile
- `match` — pair English left-column with Arabic right-column
- `order` — drag/tap word tiles into the right order (with distractor
  words to make it harder)
- `dict` — listen and type what you hear (single words only)
- `trans` — Arabic→English translation MCQ
- `tf` — true/false
- `img` — pick the right vocabulary card (PNG, with emoji fallback)

### Hearts system (3 enforcement points — keep them in sync!)
1. `checkAns()` — wrong-answer in regular exercises
2. The match-pairs error path (~line 3402) — wrong pairing
3. (Anywhere else hearts decrement)

All three:
- `if(S.hearts > 0) S.hearts--;` (never go below 0)
- If `S.hearts <= 0`: lock the continue button (`disabled = true; opacity=.4;
  pointerEvents='none'`) and show the no-hearts modal (`#nh-ov`) which
  has only **two** buttons: "Watch ad" and "Leave lesson". No escape.
- `watchAd()` is a 5-second placeholder for AdMob (Phase 4)

### Audio pipeline
- `_speak(text, btn)` is the single entry point for vocabulary audio
- It first checks `AUDIO_MAP[text]` for a pre-rendered MP3 (Sonia voice)
- Falls back to browser TTS (`speechSynthesis`) if no MP3
- Story audio uses `_playStoryLine(sid, idx, sp, text, onDone)` which:
  1. Tries `audio/stories/<sid>_<idx>.mp3` directly
  2. Falls back to TTS with `_pickVoiceForSpeaker(speaker)` — male voice for
     Omar/Ali/Dad/Waiter, female for Sara/Layla/Mom/etc.
  3. Has a **stale-callback guard** — Chromium fires belated `onend` events
     on cancelled utterances; without the guard, lines skip. See the comment
     block in `_playStoryLine` for the full reasoning.

### Animation/feedback sounds
- `playRight()` — bright two-note chime on correct answer
- `playWrong()` — gentle minor-second descent on wrong answer
- Used in `checkAns()`, match-pair check, story Q&A

---

## 6 — Critical bugs we've fixed (don't reintroduce)

These were each painful to find — don't undo them in a refactor:

1. **Hearts going negative** — match-pair wrong-answer path was decrementing
   without the `> 0` guard *and* didn't trigger the no-hearts modal. Fixed.
   Both code paths now share the same hard gate.

2. **Story lines skipping** — Brave/Chrome's `speechSynthesis.cancel()` fires
   a belated `onend` on the cancelled utterance, which used to advance the
   story sequence past the next line. Guard: each `_playStoryLine` call is
   tagged with `idx` and `finish` bails if `_storyAutoIdx !== idx`.

3. **Locked stories after a state migration** — older saved progress predates
   story insertion, leaving stories locked even when their `afterUnit` is
   done. Fix: `_reconcileStoryStates()` runs after `_loadUnitsState()` and
   promotes such stories.

4. **Double comma in unit array** — when the unit-expansion script (50 units
   per level) appended new entries, it created a `},,` sparse-array hole
   that crashed `buildMap()` silently. Always end array entries cleanly.

5. **Wrong audio for fill-in-blank** — exercise text said "My name ___ Sara."
   but `phrase` was `"My name is Sara. Nice to meet you!"` — audio must
   match the *visible sentence*, not a longer one.

6. **Streak overlapping the language pill** — absolute positioning collided
   with the chip group. Fixed by giving the streak its own `flex:1` slot
   between the logo and chips.

7. **Background-removal: solid black ≠ transparent.** AI image tools often
   save "transparent" PNGs with solid `#000` fill. `tools/fix_image_backgrounds.py`
   flood-fills corner-connected near-black/near-grey regions to alpha=0,
   preserving internal black details (eyes, outlines). Skips `avatar_*.png`
   because their colored circles are intentional.

---

## 7 — Phased deployment plan

The agreed path from "prototype" to "real app on the Play Store":

### Phase 1 — PWA + public URL (this week, free)
- Add `manifest.json` (name, icons, theme color, display: standalone)
- Add a `service-worker.js` (cache audio + images for offline-first)
- Host on **Cloudflare Pages** or **Netlify** (free tier)
- Result: real link like `volphas.pages.dev`, Chrome Android offers
  "Install" button → installs as a real app icon

### Phase 2 — Accounts + cloud sync (next, free)
- **Firebase Auth** — Google sign-in (replaces the placeholder
  `onboardGoogleSignIn` button — there's a TODO comment in the code)
- **Firestore** — sync state from `localStorage` to `users/{uid}/state`
- Migration: on first login, push existing localStorage to Firestore;
  subsequent loads read from Firestore with localStorage as fallback
- This unlocks: cross-device progress, leaderboards with real users
  (not just bots), social features later

### Phase 3 — Play Store listing ($25 one-time)
- Wrap PWA as a **Trusted Web Activity** using **Bubblewrap** (Google's
  CLI tool). Generates a signed Android `.aab`
- Hamza creates Google Play developer account ($25)
- Upload the `.aab`, fill out store listing
- Review takes 1-3 days. Live.

### Phase 4 — Monetization
- **AdMob** — replace the `watchAd()` placeholder with a real rewarded ad
- **Subscription** — implement Volphas Plus via Google Play Billing
- The Premium card UI is already designed (rewards screen)

### Phase 5 — iOS (only if Phase 4 is making money)
- Wrap with **Capacitor** for an Xcode-buildable shell
- $99/year App Store fee
- Needs a Mac

---

## 8 — Recommended tech stack for the rewrite

When converting from single-file to a real codebase:

- **Framework:** React + Vite (or Next.js if you want SEO landing pages)
- **State:** Zustand or Redux Toolkit (the `S` object in the prototype
  → a Zustand store is a 1:1 mapping)
- **Routing:** React Router (the `go(screen)` function → routes)
- **Styling:** Tailwind CSS (most of the existing CSS variables map cleanly
  to tailwind's color tokens — `var(--V)` → custom theme colors)
- **Audio:** keep current MP3 + TTS dual approach; wrap in a hook
- **Icons/SVGs:** keep inline as React components
- **Backend:** Firebase (Auth + Firestore + Storage for audio)
- **Hosting:** Cloudflare Pages or Vercel
- **Analytics:** PostHog (free tier) or Firebase Analytics
- **A/B testing:** PostHog flags

**Splitting the monolith:**
- `src/screens/` — Home, Map, Lesson, Story, Quests, Rewards, League, Profile
- `src/components/` — UnitButton, PawCloverSvg, RewardPill, StreakChip,
  LeagueLadder, BackButton, AvatarPicker, NoHeartsModal
- `src/data/` — UNITS_BY_LEVEL, EXERCISES, STORIES_BY_LEVEL, LEAGUES,
  DAILY_DEFS, WEEKLY_DEF, AVATARS, EMOJI_TO_CARD
- `src/audio/` — speak hook, story player with stale-callback guard
- `src/state/` — Zustand store mirroring `S`
- `public/images/`, `public/audio/` — static assets

---

## 9 — Concrete first steps (for whoever picks this up)

**Day 1 — Setup**
1. Clone into a fresh git repo
2. `npm create vite@latest volphas-app --template react-ts`
3. Set up Tailwind, ESLint, Prettier
4. Copy `images/` and `audio/` into `public/`

**Days 2-7 — Port core screens**
1. Set up Zustand store with the same `S` shape
2. Port the home screen (level cards) — easiest, no exercise logic
3. Port the map screen + UnitButton + PawCloverSvg
4. Port the lesson runner (renderEx → ExerciseRenderer component)
5. Port the story player with the stale-callback guard intact

**Days 8-14 — Backend**
1. Create Firebase project (free Spark plan)
2. Wire up Firebase Auth — replace `onboardGoogleSignIn` placeholder
3. Build Firestore schema:
   ```
   users/{uid}
     profile: { name, email, avatar, lang, createdAt }
     progress: { xp, streak, hearts, leagueId, ... }
     units/{unitId}: { state, lessons: [bool×4], lastPlayedAt }
     daily/{YYYY-M-D}: { streak, minutes, units, claimed: {} }
     weekly/{YYYY-M-D}: { xp, claimed: bool }
   ```
4. Two-way sync: localStorage as offline cache, Firestore as truth

**Days 15-21 — PWA + Cloudflare**
1. `manifest.json` with the volph_icon.png as app icon
2. `service-worker.js` with stale-while-revalidate for audio
3. Push to GitHub, connect Cloudflare Pages
4. Test "Install to home screen" on a real Android phone

**Days 22-28 — Play Store**
1. Buy Google Play developer account ($25)
2. `npm i -g @bubblewrap/cli`
3. `bubblewrap init --manifest=https://volphas.pages.dev/manifest.json`
4. `bubblewrap build` → produces signed `.aab`
5. Submit to Play Store Internal Testing track first (you can invite up
   to 100 testers before going to Production)
6. Once happy → Production

---

## 10 — Content gaps (what still needs writing)

The data structure has **300 units (50 × 6 levels)** defined, but only the
first 3 units of L1 have full exercise content. The rest are placeholders.

To fill: each unit needs 9 exercises, 4 times (one set per lesson). Use the
existing exercise types. Aim for ~10 vocabulary words per unit, recycled
across the 4 lessons (Leitner SRS handles spacing).

**Stories**: 60 stories defined (10 per level). L1's 10 are richly written;
L2-L6 are trimmed to ~5 lines each. To beef up: add 3-7 more lines + 2-3
comprehension Qs per story.

**Audio**: every line of every story has a corresponding MP3 in
`audio/stories/`. New exercise dictation audio needs adding via
`tools/extract_audio_texts.py` then `tools/generate_audio.py`.

---

## 11 — How to ask Hamza questions

Hamza is the founder/PO. Communication style:
- He prefers concrete decisions over open-ended brainstorms
- He's not a developer — describe code changes in user terms
- He cares deeply about *visual polish* — pixel-perfect alignment matters
- He'll send screenshots when something's off; treat those as ground truth
- Native Arabic speaker — keep Arabic copy quality high; never use Google
  Translate output unchanged. Reread Arabic with him before shipping.

---

## 12 — Open questions for the next phase

Things we haven't decided yet:

1. **Exact pricing for Volphas Plus** — currently labeled $3/mo in the UI.
   Validate with target market; could be lower in MENA.
2. **Free hearts vs. paid hearts** — currently 10 hearts max, +1 every 45min.
   Watch real user data to see if this is too punishing or too lenient.
3. **Streak save** — Duolingo lets users buy "streak freezes" with gems.
   We don't have gems yet; consider adding this as a power-up.
4. **Other languages** — onboarding picker shows French/Spanish/German/
   Portuguese/Japanese as "قريباً". Building a second language is roughly
   3-4 weeks of content work; only do it after L1-L6 English is filled.
5. **Social features** — friend lists, comparing streaks, sending hearts.
   Defer until 1k+ DAU.

---

End of handoff. Welcome to Volphas. 🐺
