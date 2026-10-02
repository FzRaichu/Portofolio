# Ferciano portfolio: seven-session development plan

Revised 3 October 2026. This replaces the previous 30-session roadmap. The current application does not yet implement the friend portal or the complete developer dashboard. Scope: a focused first release across seven delivery sessions, with layout first and an early public launch.

## Confirmed direction

- Owner: Ferciano Wirawan, Developer, Tangerang, Banten.
- Contact: ferciano6@gmail.com; LinkedIn https://www.linkedin.com/in/ferciano-wirawan/; Instagram https://www.instagram.com/fercianow/.
- Keep the existing space identity and starfield. Build an immersive, continuous Three.js journey from introduction to contact, without planet-based navigation.
- Take inspiration from the motion and depth of https://behfar.dev/ while creating an original composition.
- Include a discreet navigation entry for friends. Name first, then a six-digit code for a recognized name.
- Start special pages with a simple birthday greeting. Support richer experiences later.
- Reserve the login name `Ferciano` for the developer. Configure the owner-supplied code privately; never put the actual code in source, this plan, fixtures, or the public client bundle.
- Developer tools manage portfolio content, friends, their access, birthday pages, and incoming messages.
- Aim for 30–60 minutes of daily hands-on work while the agent implements and verifies. Some backend/deployment sessions may run longer. Launch the public portfolio on Day 3 using Vercel and `ferciano.dev`, registered at Name.com; add protected tools afterward.
- Real project information will arrive later. Clearly label samples and never invent experience or qualifications.

## Current baseline and GitHub

The project uses Next.js 16.3.1, React 19, TypeScript, Tailwind, React Three Fiber/Three.js, Drei, Motion, and shadcn/Base UI. Existing code includes a starfield, section navigation, an owner editor, a contact form, and a private inbox. Persistence currently uses optional Upstash Redis; email uses optional Resend. The recent baseline fixes cover scrolling, responsive layout, profile editing, delivery errors, session checks, and regression tests.

The reviewed baseline is published on `main` in https://github.com/FzRaichu/Portofolio.git (commit `418024b`). Use small `codex/` feature branches and merge completed work into the default branch. Never force-push to maintain a contribution streak. See [the Git workflow](GIT_WORKFLOW.md).

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

## Seven delivery sessions

Use Astra High for the visual foundation on Day 1 and Sol High for Days 2–7. Select the model in Codex before pasting that day's prompt from [DAILY_PROMPTS.md](DAILY_PROMPTS.md); prompt text does not switch the model automatically. These are delivery targets, not a guarantee that every feature fits one hour. Continue the same day's prompt when unfinished rather than creating a new roadmap.

| Day | Model | Outcome | Suggested commit |
| --- | --- | --- | --- |
| 1 | Astra High | Complete the space layout and continuous intro-to-contact 3D journey | `feat(scene): build continuous space portfolio layout` |
| 2 | Sol High | Replace starter placeholders with Ferciano's profile and honest sample content; add CI | `feat(content): personalize portfolio and starter project` |
| 3 | Sol High | Set up Supabase, deploy public site on Vercel, connect `ferciano.dev` | `feat(data): connect portfolio to Supabase` |
| 4 | Sol High | Implement protected developer login and `/studio` dashboard foundation | `feat(studio): add protected developer dashboard` |
| 5 | Sol High | Add name/code management in developer tools and protected gift-card placeholder | `feat(gifts): add access codes and private gift cards` |
| 6 | Sol High | Complete practical portfolio CRUD, greeting editing, and message inbox | `feat(studio): add content management and inbox` |
| 7 | Sol High | Verify the full live experience, fix defects, and ship the complete first release | `fix(portfolio): resolve release verification issues` |

Use separate commits for distinct changes, e.g. `chore(ci): add portfolio checks` on Day 2 and `chore(deploy): document Vercel and domain setup` on Day 3. Commit messages must describe actual changes; use `docs`, `test`, `refactor`, or `perf` when appropriate instead of forcing every day into `feat` or `fix`.

### Day 1: layout and immersive foundation

Build the complete responsive public layout and one continuous 3D scene through all five chapters. Astra may redesign spacing, typography, geometry, particles, depth, and transitions within the space theme. Keep current real profile details. Settle chapter navigation, readable overlays, mobile scrolling, reduced motion, and WebGL fallback now. Finish with desktop/mobile screenshots and a working production build. Leave the discreet friend navigation entry ready for later functionality.

### Day 2: personal content and sample data

Use these confirmed details everywhere: Ferciano Wirawan; Developer; Tangerang, Banten; ferciano6@gmail.com; LinkedIn and Instagram above; GitHub https://github.com/FzRaichu. Starter bio: “I'm Ferciano, a developer based in Tangerang, Banten. This is where I share the things I build and what I learn along the way.”

Feature the actual **Ferciano Portfolio**, linked to https://github.com/FzRaichu/Portofolio, described as an in-development space-themed portfolio using the installed stack. Do not claim Supabase or private gift features are finished before they are. Remove generic `yourusername`, `Project One`, and example.com links from published content. Use a clean “More projects coming soon” state or clearly labeled unpublished demo records for testing. Present verified technologies as “Portfolio stack” until Ferciano confirms personal skill proficiency; do not invent education, employers, testimonials, or a resume.

Add GitHub CI using the project's supported Node version, `npm ci`, lint, typecheck, tests, and build. CI must not require production secrets. Verify links and project empty/detail states. Move meaningful data into a reusable seed suitable for Day 3 without committing private records.

### Day 3: Supabase and early deployment

Create/configure a standard Postgres Supabase project using the owner's authenticated account; prepare the schema and safe public seeds, replacing Redis content persistence with a server-only data layer. Keep protected tables inaccessible to anonymous clients. Prepare only the schema needed for later access/messages; private UI is added after the public launch. Migrate legacy records privately if they exist. Configure contact storage now if available; otherwise show a working direct email option and do not claim submissions were saved.

Import the repository into Vercel, configure preview/production variables, build a preview, then publish the verified public portfolio and connect the domain using the procedure below. Keep incomplete admin/friend features hidden or unavailable on production. Before this early launch, review the existing owner editor and inbox routes/APIs: they must be properly protected with throttling, or explicitly disabled server-side until Day 4. Hiding a menu is insufficient.

If account access or DNS authentication is missing, complete local code, migrations, environment documentation, and preview preparation first. Ask for the specific account step needed; never ask for secrets in chat or commit them. Record whether production/domain verification actually succeeded, rather than marking a planned setup complete.

### Day 4: developer access first

Start the code-page work with the developer experience: reserved `Ferciano` login, name-to-credential modal, server verification, protected `/studio`, persistent throttling, revocable sessions, logout, and clear errors. Configure the owner-supplied credential privately. Resolve the production owner credential choice before enabling the live dashboard. Build dashboard navigation for Profile, Skills, Projects, Gift access, and Inbox, plus a functional profile/contact editor. Keep not-yet-implemented areas clearly marked inside the private dashboard.

### Day 5: add name/code and gift-card placeholder

Inside `/studio/access`, implement “Add gift access”: unique login name, display name, six-digit string code, title/message/signature, and enabled/published controls. Reserve the owner name. Store only a code hash; provide code replacement/reset, disable/revoke, delete confirmation, and preview. Never return saved plaintext codes in lists.

Create a reusable gift-card page at `/special/[slug]`. Its starter is an attractive “A gift for you” card with a short greeting, a reveal action, and optional birthday treatment. This is an editable placeholder template, not a requirement to finish elaborate gifts now. Use synthetic names in tests; no real friend data in Git. Recognition in the public dialog switches to code entry, and correct verification opens only the matching published card. Test refresh, direct URL denial, wrong codes, leading zeroes, and immediate revocation. Unpublished gifts remain private.

### Day 6: practical management and inbox

Finish basic skill/category CRUD, project CRUD, simple ordering, project publish state, profile/contact saves, and gift title/message/signature editing. Keep forms structured and concise. No drag-and-drop builder or arbitrary HTML execution in this release. Persist contact messages in Postgres and connect inbox list/search, detail, read/unread, and deletion. Optional Resend notifications may remain, but stored messages must survive notification failure. Verify each save after refresh and show real errors.

### Day 7: verify, polish, release

Test the complete guest/developer/friend flow on desktop and mobile; verify role isolation, direct URLs/APIs, code resets, disable, expiry, throttling, no leaked private payloads, and drafts. Check 3D performance, keyboard use, reduced motion, WebGL fallback, tall sections, hash navigation, contact delivery, and editor persistence. Fix observed defects, verify the Vercel preview, then publish the updated release to `ferciano.dev`. Record the actual release URL and outstanding items.

My suggested finishing touches are descriptive public metadata/social preview, a useful not-found page, a short operational guide for changing codes and recovering owner access, and an export/backup procedure. Prioritize these over extra 3D effects after the core experience works. Defer media uploads, music, custom per-friend worlds, analytics dashboards, and rich page builders to a later release.

Suggested daily routine: review the previous checkpoint, run the day's prompt, inspect the result, verify, and commit a useful completed change. Use one concise checkpoint file, [PROGRESS.md](PROGRESS.md), to carry context between Astra and Sol. If a task is unfinished, record exactly what remains and resume the same session. Avoid fake, empty, backdated, or unnecessary commits.

GitHub counts eligible commits associated with an account email on the repository's default branch (or `gh-pages`); feature-branch commits alone may not appear until merged. Contributions can take time to appear. PRs and issues are also useful legitimate work, but never manufacture activity just to color the graph. Keep changes tested before merging and pushing.

## Acceptance gates

- Foundation: lint, types, tests, build pass; public fixtures contain no private content; environment example contains no credentials.
- Data/access: persistent saves work; unauthorized requests fail; friend A cannot read friend B; reset/disable/expiry revoke access; valid codes with leading zeroes work.
- Admin: every requested CRUD operation persists after refresh; deletes require confirmation; failed requests show errors; drafts stay private.
- Experience: all chapters remain readable and reachable; one continuous scene; mobile, keyboard, reduced motion, and no-WebGL paths work; modals do not break scrolling.
- Contact: a successful submission is durably recorded before inbox success; optional email failure does not lose a stored message; total delivery failure is explained.
- Launch: preview/production environments are separated; login protections work across function instances; private routes/payloads are uncached or appropriately private; HTTPS and domain redirects work.

## Day 3: Vercel and Name.com launch procedure

1. Import the GitHub repository into Vercel and select the detected Next.js framework. Create a preview before production launch.
2. Add server credentials through Vercel environment settings; use separate preview and production data where practical. Never use `NEXT_PUBLIC_` for privileged keys or session secrets.
3. Apply reviewed migrations, seed approved public content, and run public acceptance checks on preview. Keep incomplete private routes unavailable server-side; configure and enable the protected dashboard in Day 4.
4. When ready to launch, add `ferciano.dev` in the Vercel project's Domains settings. Add `www.ferciano.dev` only if desired and choose a canonical redirect.
5. Check which provider currently hosts authoritative DNS. If Name.com is authoritative, open the domain's Manage DNS Records screen and enter the exact records Vercel currently displays. Do not hardcode an old Vercel IP or change nameservers merely because Name.com is the registrar. Preserve unrelated records, including email MX/TXT records.
6. Wait for Vercel to verify DNS and issue HTTPS, then test apex/redirect URLs, public content, guest entry, and contact behavior. Verify developer/friend/inbox functionality when those milestones ship, and recheck everything on Day 7.

Day 3 authorizes deployment and domain setup when its implementation prompt is run. This current task revises planning and Git hygiene; it does not create accounts, deploy, or edit DNS.

## Open decisions

- Use the recommended Supabase database for the Day 3 setup; account/project configuration is still required.
- Choose the production owner credential strategy: stronger credential or the requested PIN with an additional verification factor.
- Supply real projects and skill levels before launch. A restrained starter bio could be: “I'm Ferciano, a developer based in Tangerang, Banten. This is where I share my projects and the things I'm learning.” Edit it to match your voice.
- Choose the first friend's login name and private greeting content during the birthday milestone; do not put them in public Git history.

## References

- [Supabase database overview](https://supabase.com/docs/guides/database/overview), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage), and [current changelog](https://supabase.com/changelog).
- [Vercel Next.js hosting](https://vercel.com/docs/frameworks/full-stack/nextjs) and [adding a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain).
- [Name.com DNS records](https://cs.name.com/hc/en-us/articles/206127137-Adding-DNS-records-and-templates).
- [GitHub contribution attribution](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions).
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and [official OpenAI model/prompting guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra).
