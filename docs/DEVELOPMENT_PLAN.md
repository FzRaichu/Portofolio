# Ferciano portfolio development plan

Planning baseline: 3 October 2026. This describes future work; the current application does not yet implement the friend portal or the complete developer dashboard.

## Confirmed direction

- Owner: Ferciano Wirawan, Developer, Tangerang, Banten.
- Contact: ferciano6@gmail.com; LinkedIn https://www.linkedin.com/in/ferciano-wirawan/; Instagram https://www.instagram.com/fercianow/.
- Keep the existing space identity and starfield. Build an immersive, continuous Three.js journey from introduction to contact, without planet-based navigation.
- Take inspiration from the motion and depth of https://behfar.dev/ while creating an original composition.
- Include a discreet navigation entry for friends. Name first, then a six-digit code for a recognized name.
- Start special pages with a simple birthday greeting. Support richer experiences later.
- Reserve the login name `Ferciano` for the developer. Configure the owner-supplied code privately; never put the actual code in source, this plan, fixtures, or the public client bundle.
- Developer tools manage portfolio content, friends, their access, birthday pages, and incoming messages.
- Work for 30–60 minutes daily. Deploy later to Vercel and connect `ferciano.dev`, registered at Name.com.
- Real project information will arrive later. Clearly label samples and never invent experience or qualifications.

## Current baseline and GitHub

The project uses Next.js 16.3.1, React 19, TypeScript, Tailwind, React Three Fiber/Three.js, Drei, Motion, and shadcn/Base UI. Existing code includes a starfield, section navigation, an owner editor, a contact form, and a private inbox. Persistence currently uses optional Upstash Redis; email uses optional Resend. The recent baseline fixes cover scrolling, responsive layout, profile editing, delivery errors, session checks, and regression tests.

Git remote `origin` is connected to https://github.com/FzRaichu/Portofolio.git. At inspection, the remote had no branch references. Publish a reviewed baseline on `main`, then use small feature branches and merge completed work into the default branch. Never force-push to maintain a contribution streak.

Do not commit `.env.local`, service credentials, access codes, private messages, or real birthday content. `.env.example` contains empty configuration fields. Git identity is currently FzRaichu / ferciano6@gmail.com; confirm this email belongs to the GitHub account before relying on contribution attribution.

## Recommended services

| Service | Responsibility | Decision |
| --- | --- | --- |
| Vercel | Next.js hosting, previews, production deployment | Confirmed |
| Supabase standard Postgres | Portfolio content, friends, sessions, messages | Recommended; account/project setup still needed |
| Supabase Storage | Future project images and private birthday media | Add when uploads are needed |
| Upstash Redis | Distributed login and contact throttling | Reuse the existing dependency; move portfolio records to Postgres |
| Resend | Optional contact email notifications | Keep the existing integration |
| Name.com | Domain registration and DNS, if it is the authoritative DNS provider | Confirmed registrar |

Postgres suits the relationships between friends and pages, projects and tags, and messages and their read status. Supabase also provides a database editor and storage. Use standard Postgres rather than an experimental database engine. Start with the smallest suitable plan; verify current quotas and billing before selecting a paid plan. Account creation and billing are separate from implementing local code.

Supabase is the primary content store after migration. Do not keep Redis and Postgres as competing sources for the same records. Custom name/PIN login will use application sessions; it is not automatically a Supabase Auth identity.

## Public experience and 3D story

Use a persistent Canvas across the public portfolio chapters, with one normalized scroll timeline controlling camera position, particles, and transitions. HTML carries readable content and functional controls above the canvas.

| Chapter | Content | Suggested visual story, open to Astra's design judgment |
| --- | --- | --- |
| Introduction | Name, role, short intro, explore action | A field of distant lights gathers around the introduction |
| About | Honest editable bio and location | Camera moves deeper; layered light reveals the story |
| Skills | Grouped skills with editable order | Particles form a connected constellation or abstract structure |
| Projects | Searchable, readable cards and detail views | Structures separate into a gallery of work |
| Contact | Contact form and social links | Motion settles into a calm final composition |

Keep the color, space atmosphere, and recognizable content base. Give Astra freedom over geometry, shaders, depth, typography, and transitions. Avoid requiring costly downloaded 3D models for the first iteration.

Desktop snapping should gently settle at chapter starts; tall content must remain reachable. Use normal touch scrolling on mobile. Navigation links, browser back/forward, direct section hashes, dialogs, inputs, and the terminal must work without fighting scrolling. Do not require a wheel gesture or animation completion to reach content.

Support reduced motion, WebGL unavailable, keyboard use, and low-powered devices. Limit device pixel ratio and particle counts, pause unnecessary offscreen work, and clean up GPU resources. Measure performance on the actual preview before committing to expensive effects. Admin pages prioritize clarity and speed.

## Access flow

Proposed routes: `/` public portfolio, `/special/[slug]` protected greeting, `/studio` protected developer tools. Keep a small text entry such as “For you” in navigation or the footer; keep “Explore portfolio” available in the access dialog.

1. Visitor submits a name. Normalize surrounding whitespace and case consistently on the server. Use a unique login name; reserve `Ferciano` for the developer.
2. An available enabled name switches the dialog to a six-digit code field. Do not expose the friend list or page content. An unknown name may continue to the portfolio with a clear explanation.
3. Treat the code as a string so leading zeroes work. Wrong codes show a retry error; successful friend login grants access only to that friend's published page.
4. Developer login grants access to `/studio`. Friends never gain developer privileges.
5. Provide back, close, logout, expired-session, disabled-access, and cooldown states. Preserve the existing landing entrance where useful.

Use server-side bcrypt verification and opaque, revocable sessions in HttpOnly cookies with secure production settings and explicit expiry. Authorize every protected page, API, server action, and mutation. Revoking access, resetting a code, or unpublishing a greeting must stop access immediately, including existing sessions where applicable.

A six-digit PIN has limited guessing resistance; a repeated-digit owner PIN is especially easy to guess. Honor the requested code for local development. For the live developer dashboard, recommend a stronger owner credential or an additional verification factor. Persistent per-IP and per-name throttling and cooldowns are required for either approach. Do not make credentials visible to the browser, logs, or repository.

Name recognition deliberately reveals whether a submitted login name exists. Keep responses minimal and rate-limit that step too. Do not publish friend names in a searchable list.

## Developer tools and birthday v1

| Area | First release |
| --- | --- |
| Profile/contact | Edit bio, role, location, email, socials, resume link; preview and save |
| Skills | Create, edit, delete, group, and reorder |
| Projects | Create, edit, delete; tags, links, image reference, featured flag, publish state, order |
| Friends | Create unique login name, set/reset a code, disable/revoke access, optional expiry |
| Special pages | Edit greeting title, message, signature, optional birthday date, theme; preview and publish |
| Inbox | List/search messages, open details, mark read/unread, delete with confirmation |

The initial greeting is a polished text experience with a lightweight celebration animation. Defer galleries, video, music, timelines, and per-friend 3D worlds. Later audio requires an explicit play control. Keep birthday content in the database, not committed page files.

Use structured content fields rather than arbitrary HTML or JavaScript execution. Show validation, loading, empty states, and save failures. Distinguish previews/drafts from published content. A completed save must survive refresh and be reflected on the public page. Disabling a friend does not delete their greeting.

## Data and authorization foundation

Proposed tables: `profile`, `skill_categories`, `skills`, `projects` (tags can start as an array), `friend_access`, `special_pages`, `access_sessions`, and `contact_messages`. Add audit events for administrative mutations if time permits. Include timestamps, sort order, and publish flags where relevant. Use unique normalized login names and unique page slugs, plus foreign keys linking access and pages.

Keep server-only database access behind a small data layer with explicit developer and friend checks. Enable RLS and restrict Data API grants on exposed schemas. Anonymous clients must not read friends, PIN hashes, sessions, drafts, or messages. Public responses expose only published portfolio fields. A privileged Supabase secret bypasses RLS, so server authorization remains mandatory; RLS alone cannot protect an unguarded privileged query.

Do not write policies that assume `auth.uid()` exists for the custom name/PIN session. Either keep the private data inaccessible to anonymous Data API clients and enforce access in the server layer, or explicitly integrate a supported authenticated identity before depending on user-scoped RLS.

Protect direct routes and payloads, not just hidden buttons. Do not include greetings in public JSON, shared caches, sitemap entries, metadata, or preload responses. Private media added later uses private storage and authorized delivery. Validate URLs, text lengths, uploads when introduced, and request origin for state-changing operations.

Create reviewed schema migrations and a seed containing only safe public starter content. Migrate any existing Redis portfolio content and inbox records through a deliberate private migration; verify counts before switching reads. Missing database configuration may use explicit local development fixtures. A configured database failure must not pretend a write succeeded or silently revert to template data.

## Daily roadmap

These are 30 work sessions, not guaranteed one-hour tasks. Split large items into additional sessions; allow roughly 4–6 weeks plus any account setup or troubleshooting. Each day ends with a small reviewable change, appropriate verification, and a commit when there is actual completed work.

| Day | Deliverable |
| --- | --- |
| 1 | Publish the reviewed baseline and this roadmap; verify repository default branch/email attribution |
| 2 | Add GitHub CI for lint, types, regression tests, and production build; document environment setup |
| 3 | Build a local public-scene prototype covering intro-to-contact camera continuity |
| 4 | Refine the prototype on desktop/mobile; settle visual direction and performance budget |
| 5 | Create Supabase development project and reviewed schema migrations |
| 6 | Add safe seeds and server-only data layer; validate public/private permissions |
| 7 | Read public profile, skills, and projects from Postgres; document legacy migration |
| 8 | Implement name recognition and six-digit code states with dummy local friend fixtures |
| 9 | Implement hashed verification, roles, expiring/revocable sessions, and persistent throttling |
| 10 | Test guest/friend/developer boundaries, direct URL access, expiry, and wrong-code cooldown |
| 11 | Build protected `/studio` shell, navigation, logout, and status states |
| 12 | Implement profile/contact editor with refresh-persistent saves |
| 13 | Implement skill/category CRUD and ordering |
| 14 | Implement project CRUD and URL validation |
| 15 | Implement draft preview, publishing, featured state, and ordering |
| 16 | Implement friend creation, unique names, code reset, disable, and revocation |
| 17 | Implement birthday greeting editor and preview |
| 18 | Implement protected birthday route, publish state, and lightweight celebration |
| 19 | Move contact submissions to Postgres; retain optional email notifications |
| 20 | Connect inbox list/details/read/delete; verify persistence and submission errors |
| 21 | Polish introduction and about chapters on the persistent scene timeline |
| 22 | Polish skills constellation/structure and readable overlays |
| 23 | Polish project gallery transitions and detail dialogs |
| 24 | Polish contact ending, chapter navigation, and gentle snapping |
| 25 | Add/review reduced motion, mobile quality adaptation, and WebGL fallback |
| 26 | Test keyboard, contrast, screen readers, tall sections, hash links, and browser history |
| 27 | Test authorization across APIs, private payload leakage, rate limits, and private caching |
| 28 | Configure Vercel preview and service variables; test against non-production data |
| 29 | Replace approved placeholders; review SEO/public metadata, backup/export, and launch checklist |
| 30 | Deploy the approved version and connect domain DNS; smoke-test HTTPS and every role |

Suggested daily routine: 5 minutes review, 20–40 minutes implement one slice, 10 minutes verify, 5 minutes commit and record the next action. If a task is unfinished, a useful passing test, documentation improvement, or complete sub-slice can be that day's contribution. Avoid fake, empty, backdated, or unnecessary commits.

GitHub counts eligible commits associated with an account email on the repository's default branch (or `gh-pages`); feature-branch commits alone may not appear until merged. Contributions can take time to appear. PRs and issues are also useful legitimate work, but never manufacture activity just to color the graph. Keep changes tested before merging and pushing.

## Acceptance gates

- Foundation: lint, types, tests, build pass; public fixtures contain no private content; environment example contains no credentials.
- Data/access: persistent saves work; unauthorized requests fail; friend A cannot read friend B; reset/disable/expiry revoke access; valid codes with leading zeroes work.
- Admin: every requested CRUD operation persists after refresh; deletes require confirmation; failed requests show errors; drafts stay private.
- Experience: all chapters remain readable and reachable; one continuous scene; mobile, keyboard, reduced motion, and no-WebGL paths work; modals do not break scrolling.
- Contact: a successful submission is durably recorded before inbox success; optional email failure does not lose a stored message; total delivery failure is explained.
- Launch: preview/production environments are separated; login protections work across function instances; private routes/payloads are uncached or appropriately private; HTTPS and domain redirects work.

## Vercel and Name.com launch procedure

1. Import the GitHub repository into Vercel and select the detected Next.js framework. Create a preview before production launch.
2. Add server credentials through Vercel environment settings; use separate preview and production data where practical. Never use `NEXT_PUBLIC_` for privileged keys or session secrets.
3. Apply reviewed migrations, seed approved public content, configure owner credentials privately, and run the acceptance checks on preview.
4. When ready to launch, add `ferciano.dev` in the Vercel project's Domains settings. Add `www.ferciano.dev` only if desired and choose a canonical redirect.
5. Check which provider currently hosts authoritative DNS. If Name.com is authoritative, open the domain's Manage DNS Records screen and enter the exact records Vercel currently displays. Do not hardcode an old Vercel IP or change nameservers merely because Name.com is the registrar. Preserve unrelated records, including email MX/TXT records.
6. Wait for Vercel to verify DNS and issue HTTPS, then test apex/redirect URLs, guest entry, developer login, friend greeting, contact submission, and inbox.

Deployment and DNS changes happen at the launch stage, not as part of this planning task.

## Open decisions

- Accept Supabase as the main database and create its project when the data milestone starts.
- Choose the production owner credential strategy: stronger credential or the requested PIN with an additional verification factor.
- Supply real projects and skill levels before launch. A restrained starter bio could be: “I'm Ferciano, a developer based in Tangerang, Banten. This is where I share my projects and the things I'm learning.” Edit it to match your voice.
- Choose the first friend's login name and private greeting content during the birthday milestone; do not put them in public Git history.

## References

- [Supabase database overview](https://supabase.com/docs/guides/database/overview), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage), and [current changelog](https://supabase.com/changelog).
- [Vercel Next.js hosting](https://vercel.com/docs/frameworks/full-stack/nextjs) and [adding a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain).
- [Name.com DNS records](https://cs.name.com/hc/en-us/articles/206127137-Adding-DNS-records-and-templates).
- [GitHub contribution attribution](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions).
