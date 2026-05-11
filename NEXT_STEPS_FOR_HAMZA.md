# Volphas — What to do next (your baby-step guide)

This is your personal walkthrough Hamza — the bridge from "I have a finished
prototype" to "Volphas is on the Play Store". Read it once, then follow it
one step at a time. You're not dumb — this is just the first time you've
done it. Once is enough.

---

## A — Quick answers to your questions first

**Q: Should I buy the Google Play developer account ($25) now?**
**A:** No. **Do that LAST**, right when you're about to upload your finished
app. If you buy it now, the $25 fee just sits there. We'll come back to
this around day 6-7 of the plan below.

**Q: Will Claude Code write all the exercises in every unit?**
**A:** Honest answer — *no, not all of them*. Here's the deal:

- Volphas has **300 units** (50 × 6 levels) × **36 exercises per unit** =
  about **10,800 exercises** to write.
- Claude Code can **draft them in batches** — you tell it "write 9
  exercises for unit L1U4 (Numbers 1-10)" and it'll generate them with
  Arabic translations.
- BUT — and this matters — **you must read every batch before shipping**.
  Arabic translations from any AI need a native eye. Wrong nuance =
  bad reviews on the Play Store.
- A realistic content rhythm: 1-3 hours/day of you reviewing AI-drafted
  exercises, you'll fill ~3 units/day. So 300 units ≈ 100 days of part-
  time work, OR ~30 days of full-time work.

**Don't let that scare you.** You don't need all 300 units to launch:

- **MVP launch:** finish L1's 50 units (about 2-3 weeks of content work).
  L2-L6 can ship as "coming soon" placeholders.
- Real users will give you feedback before you write all 6 levels —
  better to launch L1, learn what works, then write L2 in that style.

**Q: Why does the technical migration take 30 days? Can it be 4-5?**
**A:** Yes, the *code migration* (PWA + Firebase + Play Store) realistically
takes **7-10 focused days**, not 30. The "30 days" in my earlier doc was
conservative — assumed mixing in daily content work. If you focus 100% on
the migration first and skip content, the timeline tightens to ~1 week.

Updated timeline:

| Phase | Days | What happens |
|---|---|---|
| 1 — PWA | 1-2 | App becomes installable from a browser link |
| 2 — Firebase Auth | 1-2 | Real Google sign-in, cloud progress sync |
| 3 — Bubblewrap → Play Store | 1 day work + 1-3 days Google review | Live on Play Store internal testing |
| **Subtotal** | **~7-10 days** | App is technically launched |
| 4 — Content (L1) | +2-3 weeks | Fill the 47 empty units of L1 |
| 5 — AdMob + subscription | +3-5 days | Revenue starts flowing |
| 6 — iOS | later, when revenue justifies it | Capacitor wrap |

**Q: What do I type into Claude Code right after creating my accounts?**
**A:** Read section C below — I wrote you the exact opening prompt.

---

## B — Right now, before opening Claude Code

You said you've created GitHub, Cloudflare, and Firebase accounts. Good.
Two more 5-minute things to do, both free:

### B1 — Install Node.js (you'll need it)
1. Go to https://nodejs.org
2. Click the green **"LTS" download** button (Windows installer)
3. Run the installer, click Next-Next-Next, default everything
4. **Reboot your computer** so the system picks it up

### B2 — Install Claude Code (the CLI tool)
This is what you'll use instead of Cowork going forward.
1. Open Command Prompt (press Win key, type `cmd`, hit Enter)
2. Type:  `npm install -g @anthropic-ai/claude-code`
3. Wait until it finishes (about 30 seconds)
4. Type:  `claude` to verify it works (it'll ask you to log in)

If you get "command not found" errors, reboot and try again.

That's all the setup you need. Now you're ready.

---

## C — Your first conversation with Claude Code

1. Open File Explorer. Find your `volphas` folder (the one with `START.bat`,
   `volphas-app.html`, `images/`, `audio/`, `tools/`, and the two `.md`
   files I just gave you: `PROJECT_HANDOFF.md` and `NEXT_STEPS_FOR_HAMZA.md`).

2. Click the address bar at the top of the File Explorer window. Type
   `cmd` and press Enter. A black Command Prompt window opens, already
   "inside" your volphas folder.

3. In that Command Prompt, type:  `claude`  and press Enter.

4. Claude Code will start up inside your project. It can see all your
   files. Now copy this **exact prompt** and paste it as your first
   message:

```
Hi! I'm Hamza, the founder of Volphas. We've been building a Duolingo-
style Arabic-to-English language app together with another instance of
you (in Cowork). The prototype is finished and it's time to ship.

Please start by reading these two files end-to-end, in this order:
  1. PROJECT_HANDOFF.md  — full context on the project, architecture,
                           bugs we've fixed, and the deployment plan.
  2. NEXT_STEPS_FOR_HAMZA.md — my personal step-by-step guide.

Once you've read both, we're starting Phase 1 — converting volphas-app.html
to a Progressive Web App and deploying it to Cloudflare Pages.

Three things I want from you:
  1. Be patient with me — I'm not a developer. Explain things in simple
     terms. When you give me a command, tell me where to type it.
  2. When something requires me to log into an account or click something
     in a browser, pause and tell me clearly: "Now do X in your browser,
     come back when done."
  3. Don't make changes I don't understand. If you're not sure, ask first.

Ready when you are.
```

That's it. Claude Code reads your files, understands the whole project,
and walks you through Phase 1 step-by-step. It'll tell you exactly when to
type what, when to switch to your browser, when to wait.

---

## D — A few last things you mentioned

### D1 — The hearts bug (entering a unit with 0 hearts)
**Fixed in this update.** Before, you could exit the no-hearts modal via
"leave lesson" and then start a different unit with 0 hearts. Now, trying
to enter ANY lesson or story with 0 hearts shows the same modal: only
"Watch ad" or "Leave" — no other way through.

### D2 — More languages in the picker
**Added Italian, Turkish, Russian, and Chinese.** Plus the existing English,
French, Spanish, German, Portuguese, Japanese. The picker now shows 10
languages — only English is active right now; the others will become
available as content gets written.

### D3 — League promotion celebration + share
**Built.** When the user moves up a league (Bronze → Silver, Silver → Gold,
etc.), they now see a **full-screen celebration**:
- The new league's badge appears with a glow matching its color
- Confetti rains down
- A bright blue **"شارك إنجازك مع الأصدقاء"** button uses the native share
  sheet on Android (WhatsApp, Instagram, SMS, etc.) — when users share,
  their friends see "I just hit Gold league on Volphas! تعلم معي" and a
  link to download the app. **This is your viral growth driver** — every
  share is a free new user.
- Bonus: if the user has granted notification permission earlier, a system
  push notification also fires ("🎉 ترقية في الدوري!") — works even when
  the app is in the background.

### D4 — Notifications on promotion
Built into the same celebration flow. Browser notifications are requested
during onboarding (you saw the prompt). When a user promotes leagues, the
notification fires automatically.

---

## E — Honest expectations

You wrote: *"making this app seems hard"*. It IS some work. But the hard
part is mostly behind you — the prototype is the most creative, most
design-heavy piece of the whole journey. From here it's mechanics:

- Phase 1-3 is **mostly clicking buttons and following Claude Code's
  instructions**. You don't write code; you read what it explains, run
  the commands it gives you, and tell it what you see.
- Phase 4 (content) is **the long marathon**. Don't try to do it all in
  one go. Aim for 3 units a day, take weekends off, keep it sustainable.
- Real users will tell you what to fix. Launch with L1 incomplete if you
  have to. **Done > perfect.**

If you get stuck on anything Claude Code says, come back here and ask me.
I have full context. The handoff doc is your bridge, not the wall.

---

## F — Order of operations summary

```
[ ✓ ] Created GitHub, Cloudflare, Firebase accounts
[   ] Install Node.js     ← do now (5 min)
[   ] Install Claude Code  ← do now (5 min)
[   ] Open Claude Code in volphas folder, paste the prompt in section C
[   ] Phase 1 — PWA conversion (Claude Code walks you through, ~1-2 days)
[   ] Phase 2 — Firebase Auth + sync (Claude Code walks you through, ~1-2 days)
[   ] Buy Google Play developer account ($25, takes 5 min)
[   ] Phase 3 — Bubblewrap → Play Store internal testing (~1 day)
[   ] Wait 1-3 days for Google review
[   ] App is LIVE on Play Store internal testing! Invite your first 100 testers.
[   ] Phase 4 — Fill out L1 content (2-3 weeks at ~3 units/day)
[   ] Promote from internal testing to Production
[   ] Phase 5 — AdMob + subscription
[   ] Marketing — Instagram/TikTok ads, share with friends
[   ] Watch users learn English with Volphas. Be proud.
```

You got this. 🐺
