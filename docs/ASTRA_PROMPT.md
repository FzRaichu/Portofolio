# Prompt for GPT-6 Astra

Copy the following into Astra in this same project. The roadmap provides detail; this prompt sets direction and the first implementation slice.

---

Help me develop my existing portfolio into an original, immersive space experience. Read `AGENTS.md`, `README.md`, and `docs/DEVELOPMENT_PLAN.md`, inspect the actual code, and read the relevant bundled Next.js documentation before changing framework code. Preserve the working baseline and my profile information.

I am Ferciano Wirawan, a Developer in Tangerang, Banten. My contact information is already in the project. Real projects will come later: keep sample projects clearly identified and do not invent credentials or experience.

You have creative freedom over the visual composition, abstract geometry, shaders, particles, camera movement, typography, and transitions. Keep the current space/starfield identity. https://behfar.dev/ is inspiration for depth and smooth motion; create your own design. I do not want planet-based navigation. I want one continuous 3D story moving through Introduction, About, Skills, Projects, and Contact. Give the journey a strong opening, evolving middle, and calm ending.

Use the installed Three.js/React Three Fiber stack, one persistent public Canvas, and a shared scroll timeline with smoothly interpolated scene states. Keep content, forms, navigation, and dialogs in accessible HTML. Add gentle desktop chapter snapping where it helps; preserve native mobile scrolling and allow tall sections. Respect reduced motion, provide a no-WebGL fallback, and adapt rendering quality to device performance. Make navigation, hash links, keyboard use, browser history, and modal interactions work throughout the journey.

The finished product also needs a discreet “For you” entry. Visitors submit a name; recognized enabled names switch the modal to a six-digit code field. A correct friend code opens only their protected greeting page. Keep codes as strings, including leading zeroes. Start with a simple birthday title, personal message, signature, and celebration effect; richer pages can follow later.

Reserve `Ferciano` as my developer login name. I will configure my requested owner credential privately. Developer tools at `/studio` must eventually manage profile/contact fields, skill/category CRUD and ordering, project CRUD/drafts/publishing, friends and code resets/revocation, birthday greetings, and the contact inbox. Use clear forms, explicit save states, validation, and confirmation for destructive actions.

Follow the roadmap's recommended architecture: Vercel hosting, Supabase standard Postgres as the main content store, optional Supabase Storage later, existing Upstash for persistent throttling, and optional Resend notifications. Read the Supabase skill and current documentation when implementing that integration. Name/PIN sessions need explicit server authorization; they are not automatically Supabase Auth users. Hash credentials server-side, use expiring revocable HttpOnly sessions, enforce role/ownership on every protected operation, and keep friend content, messages, hashes, secrets, and drafts out of public payloads and shared caches. Discuss the production owner credential choice before that milestone. Never hardcode real codes or commit credentials.

Work in small runnable milestones that fit my 30–60 minute daily sessions. Make local progress autonomously; ask concise questions only when a product decision or missing service configuration matters. Do not deploy, buy services, or change DNS during development. Keep Git commits meaningful, and do not push unfinished work merely to create a streak.

Start now with the local 3D prototype from roadmap days 3–4: establish the persistent canvas and complete intro-to-contact timeline, with readable existing content, mobile scrolling, reduced motion, and WebGL fallback. If credentials are unavailable, keep this slice runnable locally. Verify lint, types, appropriate regression checks, production build, and the actual desktop/mobile preview. Report what changed, what passed, and the next small milestone. Continue within this slice until it is reviewable; do not attempt the entire roadmap in one uncontrolled rewrite.
