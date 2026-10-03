# Ferciano's portfolio

A Next.js 16 / React 19 portfolio with a continuous Three.js space journey, accessible section navigation, searchable projects, a terminal, an owner editor, and a private contact inbox.

## Development direction

See [the seven-session development plan](docs/DEVELOPMENT_PLAN.md) for layout, personal content, early Supabase/Vercel/domain deployment, developer tools, and gift access. Use [the daily Astra/Sol prompts](docs/DAILY_PROMPTS.md), starting with [Day 1's Astra prompt](docs/ASTRA_PROMPT.md). Follow [the Git workflow](docs/GIT_WORKFLOW.md) and update [the checkpoint](docs/PROGRESS.md) between sessions. These planned features are not all implemented yet; the configuration below describes the current application.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. The public portfolio opens directly; scroll through Introduction, About, Skills, Projects, and Contact. The discreet **For you** entry opens the optional visitor/owner dialog. Friend gift access is planned for Day 5. The portfolio works without service credentials; contact delivery and persistent editing need the configuration below.

## Content

- `src/lib/data.ts`: default profile, skills, projects, fun facts, and music. Projects and skills still contain template content pending real project details.
- Owner mode: open **For you**, enter **Ferciano**, then your existing owner credential. Edit name and role directly. Expand **Edit profile & links** for the bio, tagline, location, education, email, social links, and resume. Fields save on blur; errors are shown instead of pretending a save worked.
- Leave optional social links or resume blank to hide them. To use a local resume, place your actual PDF in `public/resume.pdf` and set the resume URL to `/resume.pdf`.
- Saved Redis values override file defaults. New field updates use `portfolio:site-content:fields`; legacy `portfolio:site-content` values are still read.
- Section links such as `/#projects` can be shared. Native scrolling preserves form and terminal state while browsing.
- Open **For the curious** in About for the terminal and fun facts. Existing `/#fun` links open this disclosure.

## Scene and motion

The public page uses one lazy-loaded React Three Fiber Canvas with an abstract wireframe sculpture and seeded starfield. `src/lib/journey.ts` defines the five interpolated poses; `src/components/three/space-scene.tsx` renders them. Actual section positions drive the shared timeline, including expanded terminal content and tall project grids. `src/app/journey.css` contains the responsive visual system.

Desktop scrolling uses proximity snapping; phones and tablets retain native scrolling. **Motion on / Still view** switches between animation and the CSS fallback. Device reduced-motion preferences also select the still experience. Rendering pauses when the document is hidden, uses fewer particles and capped pixel density on smaller screens, and lowers pixel density after sustained slow frames. WebGL initialization errors or context loss leave the public HTML and static atmosphere available.

## Configure owner access, storage, and email

Copy `.env.example` to `.env.local` and supply your own credentials. Restart the dev server after changing them.

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | A long random secret for signed owner sessions |
| `AUTH_PASSWORD_HASH_B64` | Base64-encoded bcrypt hash of your owner password |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Persistent profile fields and private inbox messages |
| `RESEND_API_KEY` | Optional email delivery for contact submissions |
| `RESEND_FROM_EMAIL` | Sender on your verified Resend domain; defaults to Resend's testing sender |

Generate a session secret locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Generate your password's bcrypt hash with bcryptjs, then encode the resulting hash as base64. Never commit `.env.local` or put your password in tracked source files.

A contact submission succeeds if it is stored in Redis or accepted by Resend. If both fail or neither is configured, the visitor receives an error with your direct email address. Email notifications use the current saved profile email. The inbox requires Redis; email-only messages will not appear there.

## Verify changes

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Tests use in-memory mocks and never send email or write to Redis. They cover delivery failures, input validation, unsafe links, session tampering/expiry, variable-height chapter alignment, and continuous scene interpolation.

The build downloads Geist fonts through `next/font/google`, so the first build requires network access to Google Fonts. The installed Next.js guides are in `node_modules/next/dist/docs/`; read the relevant guide before changing framework APIs.
