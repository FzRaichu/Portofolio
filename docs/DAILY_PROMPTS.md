# Seven daily implementation prompts

Select the stated model and High reasoning in Codex before sending the day's prompt. These prompts implement one delivery session at a time. Use the same project; `docs/PROGRESS.md` carries the checkpoint between models. If unfinished, resume the same day. Model labels describe the user's chosen workflow, not a promise about task duration.

## Day 1 — Astra High: visual foundation

Copy the full prompt from [ASTRA_PROMPT.md](ASTRA_PROMPT.md), or send this starter:

```text
Implement Day 1 now by following docs/ASTRA_PROMPT.md and the seven-session
docs/DEVELOPMENT_PLAN.md. Create the complete responsive public layout and
continuous introduction-to-contact Three.js space journey. You have creative
freedom within my space/starfield theme; avoid planet-based navigation.
Finish the local implementation, verify desktop/mobile, and update
docs/PROGRESS.md. Follow docs/GIT_WORKFLOW.md for branches and commits.
```

## Day 2 — Sol High: personal data and CI

```text
Implement Day 2 of docs/DEVELOPMENT_PLAN.md. Read AGENTS.md,
docs/PROGRESS.md, and docs/GIT_WORKFLOW.md; inspect the current implementation
and relevant bundled Next.js guides. Preserve Day 1's visual direction.

Replace starter placeholders throughout the public UI, terminal, links, and
metadata with the confirmed Ferciano profile in the plan. Use GitHub FzRaichu
and the actual Portofolio repository as the featured in-development project.
Use the verified site technologies as Portfolio stack, without inventing skill
proficiency or experience. Remove fake project URLs; use honest empty states
or clearly labeled unpublished demo records for remaining sample content.
Prepare a reusable safe seed and add GitHub CI for npm ci, lint, typecheck,
tests, and build using a supported Node version without production secrets.

Complete and verify this session, including actual content/links in the browser.
Use codex/day-02-content and meaningful Conventional Commits; update
docs/PROGRESS.md with checks actually run and the Day 3 handoff.
```

## Day 3 — Sol High: Supabase, Vercel, domain

```text
Implement Day 3 of docs/DEVELOPMENT_PLAN.md. Read AGENTS.md,
docs/PROGRESS.md, and docs/GIT_WORKFLOW.md; inspect the current implementation.
Use the Supabase skill and current service documentation for the setup.

Prepare reviewed migrations and safe public seeds, connect standard Supabase
Postgres through a server-only data layer, and migrate legacy Redis data
privately if it exists. Use Postgres as the main content store and keep private
tables inaccessible to anonymous clients. Configure durable contact storage
or show a truthful direct email fallback. Disable incomplete private features
server-side until their access protection is ready; audit existing owner APIs.

This session includes deployment: use my authenticated accounts to configure
Supabase, import this GitHub repository into Vercel, set private environment
variables, verify a preview, deploy the public portfolio, and connect
ferciano.dev using the exact current Vercel DNS records at the authoritative
DNS provider. Preserve unrelated DNS records. Do not purchase paid services.
If account login/configuration is missing, complete independent code work and
ask only for the precise account step needed; never request secrets in chat.

Use codex/day-03-deploy and Conventional Commits. Verify the build, live public
site, actual database queries/permissions, and HTTPS/domain status. Update
docs/PROGRESS.md; distinguish verified external setup from pending steps.
```

## Day 4 — Sol High: developer login and dashboard

```text
Implement Day 4 of docs/DEVELOPMENT_PLAN.md. Read AGENTS.md,
docs/PROGRESS.md, and docs/GIT_WORKFLOW.md; inspect existing auth and storage
before building on them. Follow relevant Next.js guides and the Supabase skill.

Start private code-page work with developer access. Reserve Ferciano as the
owner login name and transition the name dialog to credential entry. Configure
the owner-supplied credential privately; resolve the production credential
choice before enabling the live dashboard. Never hardcode a real credential.
Use server-side verification, hashed credentials, revocable expiring HttpOnly
sessions, persistent throttling, and authorization for every private operation.

Build protected /studio with clear navigation for Profile, Skills, Projects,
Gift access, and Inbox. Finish a functional profile/contact editor now; mark
later tools clearly as pending inside the private dashboard. Provide logout
and error states. Preserve the public portfolio and existing useful editor code.

Use codex/day-04-studio and Conventional Commits. Verify unauthorized page/API
denial, expiry/logout/revocation, throttling, and refresh-persistent editing;
run relevant checks and review preview before production promotion.
Update docs/PROGRESS.md with actual results and the Day 5 handoff.
```

## Day 5 — Sol High: add code and gift-card placeholder

```text
Implement Day 5 of docs/DEVELOPMENT_PLAN.md. Read AGENTS.md,
docs/PROGRESS.md, and docs/GIT_WORKFLOW.md. Follow applicable Next.js and
Supabase guidance and reuse Day 4's protected sessions and data layer.

Inside /studio/access, implement Add gift access: unique normalized login
name, display name, six-digit string code, greeting title/message/signature,
and enabled/published state. Reserve Ferciano. Store only a code hash; support
reset/replacement, immediate revoke/disable, delete confirmation, and preview.
Do not expose saved plaintext codes in lists or commit real friend data.

Build a reusable protected /special/[slug] gift-card placeholder with a polished
A gift for you card, reveal action, short message, signature, and simple birthday
treatment. Connect the discreet For you entry: name recognition switches to
code input; successful login grants only that friend's published card. Keep
leading zeroes and clear wrong-code/back/close states. No friend list leakage.

Use codex/day-05-gifts and Conventional Commits. Test direct URL/API denial,
friend A versus friend B, leading zeroes, code resets, disabled/expired access,
unpublished cards, and refresh persistence. Verify the preview and update
docs/PROGRESS.md with the Day 6 handoff.
```

## Day 6 — Sol High: content CRUD and inbox

```text
Implement Day 6 of docs/DEVELOPMENT_PLAN.md. Read AGENTS.md,
docs/PROGRESS.md, and docs/GIT_WORKFLOW.md; inspect implemented tools so you
extend rather than duplicate them. Use relevant Next.js and Supabase guidance.

Complete practical developer management: skill/category CRUD, project CRUD
with URLs, tags, simple ordering and publish state, profile/contact saves,
and gift title/message/signature editing. Keep fields structured; no rich page
builder or arbitrary HTML/JavaScript. Show real save/validation failures and
confirm deletions. Published portfolio changes must appear after refresh.

Persist contact messages in Postgres and implement inbox search/list, detail,
read/unread, and deletion. Retain optional Resend notifications; email failure
must not lose a stored message, and total storage failure must not report success.
Check server authorization on every mutation and keep drafts/messages private.

Use codex/day-06-management and meaningful Conventional Commits. Verify CRUD
after refresh, failed saves, draft visibility, message submission and inbox
operations, plus relevant regression checks and build. Review preview before
promotion and update docs/PROGRESS.md with the Day 7 handoff.
```

## Day 7 — Sol High: verification and release

```text
Implement Day 7 of docs/DEVELOPMENT_PLAN.md. Read AGENTS.md,
docs/PROGRESS.md, and docs/GIT_WORKFLOW.md. Review the actual first release
and fix observed issues rather than adding unrelated features.

Verify guest, developer, and friend journeys on desktop/mobile: role isolation,
direct page/API access, expiry, reset/revoke, throttling, private payloads and
caching, saved content, drafts, contact delivery, and inbox. Check 3D performance,
keyboard use, reduced motion, no-WebGL fallback, tall sections, hash navigation,
and modal behavior. Add meaningful missing regression checks and fix failures.
Finish useful public metadata/social preview, a not-found state, and concise
owner operations plus backup/export documentation where still missing.

Use codex/day-07-release and commit types matching actual changes. Run release
checks, verify the Vercel preview, and deploy the completed release to
ferciano.dev using the existing account configuration. Verify HTTPS, the domain,
and all three roles after deployment. Update docs/PROGRESS.md with the actual
release status/URL and remaining items. Defer richer gift media and extra worlds.
```

## Resuming an unfinished session

```text
Resume Day [N] of docs/DEVELOPMENT_PLAN.md using docs/PROGRESS.md and the
existing day's branch. Finish its remaining work, verify it, and update the
checkpoint. Do not restart completed work or claim pending account steps succeeded.
```
