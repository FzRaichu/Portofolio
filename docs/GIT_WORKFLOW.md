# Portfolio Git workflow

Repository: https://github.com/FzRaichu/Portofolio. Default branch: `main`.

## Branches and review

- Start from an up-to-date, clean `main`. Inspect existing work before switching branches; do not discard changes.
- Use `codex/day-01-layout`, `codex/day-02-content`, `codex/day-03-deploy`, etc. Reuse the day's branch when resuming unfinished work.
- Commit complete, understandable slices. Separate a feature, unrelated repair, and housekeeping when they have different purposes.
- Push the feature branch and open a PR when GitHub tooling/authentication is available. Describe the resulting behavior and relevant validation.
- Prefer a squash merge with a descriptive Conventional Commit title. For solo documentation changes, a reviewed local fast-forward merge is also fine.
- Treat `main` as deployable. After Vercel is linked, pushing/merging to `main` can trigger production deployment; review the preview first.
- Enable branch protection and required CI checks after the workflow exists, using the actual repository settings available to the owner. Never bypass checks to preserve a streak.

## Commit messages

Format: `type(scope): describe the change` using an imperative, specific description. Scope is optional.

| Type | Use | Example |
| --- | --- | --- |
| `feat` | New user-visible capability | `feat(gifts): add protected greeting cards` |
| `fix` | Correct broken behavior | `fix(auth): revoke access after code reset` |
| `chore` | Tooling or maintenance | `chore(ci): add lint and build checks` |
| `docs` | Documentation | `docs(plan): revise roadmap to seven sessions` |
| `test` | Test coverage | `test(gifts): verify friend access isolation` |
| `refactor` | Restructure without behavior changes | `refactor(data): centralize content queries` |
| `perf` | Performance improvement | `perf(scene): reduce mobile particle workload` |
| `style` | Formatting-only changes | `style: format dashboard components` |

Visual redesigns change behavior/appearance and typically use `feat` or `fix`; `style` here means formatting. Use `!` or a `BREAKING CHANGE:` footer only for an actual breaking change, and document the migration. Never include private codes or credentials in commit messages or PR bodies. These conventions adopt [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/); types besides `feat`/`fix` are project conventions.

## Before every commit

1. Inspect `git status --short` and the diff. Stage explicit paths rather than blindly adding every local file.
2. Check staged paths and `git diff --cached --check`. Inspect for accidental secrets and private content.
3. For application changes, run lint, typecheck, relevant tests, and build. For documentation-only changes, verify links, consistency, and whitespace; do not rerun the application suite without a reason.
4. Review the public preview for layout changes. Run meaningful authorization/persistence tests for backend changes.
5. Commit, push the finished slice, and record its verification and next action in `docs/PROGRESS.md`. Keep checkpoints free of private data.

Track source, lockfile, safe migrations, safe seed templates, and the empty `.env.example`. Ignore dependencies, build products, local environment files, Vercel linkage, CLI temporary state, test reports, private exports, and private fixtures. Do not ignore the whole `supabase/` directory: migrations/configuration should be reviewable. Real birthday content belongs in the database.

The repository ignore file is a convenience, not a secret scanner. It does not untrack an already committed file. If a credential is exposed, rotate it and address repository history deliberately; adding an ignore rule alone is insufficient.

## Contributions

Use meaningful daily work, not filler commits or backdating. Verify that the author email is linked to the GitHub account. Eligible branch commits generally appear in the contribution graph after reaching the default branch; counts can be delayed. A feature branch upload by itself does not guarantee that day's graph cell. See [GitHub's contribution guidance](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions).

The existing baseline commit predates this convention. Keep it; begin the naming convention with new commits rather than rewriting published history.
