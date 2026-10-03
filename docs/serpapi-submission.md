# RoleProof - SerpApi India Hackathon Submission Pack

Use this only after a live SerpApi query and public demo video have been
verified. Do not claim that the project is submitted until the dashboard shows
confirmation.

## Project name

RoleProof

## One-line description

An evidence-first remote-job triage dashboard that uses SerpApi Google Jobs and
shows why each role needs review before a person applies.

## Submission description

RoleProof is a small local dashboard for a frustrating part of job search:
search results often look suitable until a hidden location, seniority, onsite,
or work-authorisation requirement disqualifies them.

The local server calls SerpApi's Google Jobs engine with a user-selected query
and location. It normalizes returned job data, preserves the source link, and
applies deliberately conservative review rules. A role needs explicit remote
evidence to become a review candidate. Senior titles, foreign work-
authorization requirements, and onsite-only language remain visible as reasons
for manual review instead of being silently discarded.

RoleProof does not log into job sites, send outreach, or submit applications.
It is designed to keep a human in control of every application while making
the evidence behind the shortlist inspectable.

## SerpApi usage

RoleProof calls `https://serpapi.com/search.json` with `engine=google_jobs`, a
job query, and a search location. The API key stays in the local server
environment and is never returned to the browser. The response's job results
are normalized before the local eligibility review runs.

## Track suggestion

Open Innovation, unless the authenticated dashboard offers a more precise
career-search or developer-tools track.

## Existing-project answer

No. RoleProof was created during the hackathon window. Its public Git history
starts with commit `a71f2b6` on October 3, 2026.

## AI-tools disclosure

AI-assisted development tools were used for implementation support and code
review. The project scope, eligibility rules, repository review, and test
verification were checked by the builder. The tool never presents AI output as
an application decision or submits an application automatically.

## Demo recording checklist (under 3 minutes)

1. Start with the public GitHub repository and briefly show the README's
   no-auto-apply constraint.
2. With a configured `SERPAPI_API_KEY` and `DEMO_MODE=0`, start the local
   server using `npm run dev`.
3. Open `http://localhost:4177`, search a real query such as `software engineer
   remote` from `India`, and wait for the live results.
4. Open one result card. Point out the source link and the reason it is a
   review candidate or requires manual review.
5. Show the tests briefly with `npm test` and close by stating that the final
   application decision stays with the user.

Before sharing the recording, open its link in a private browser window to
confirm that judges can view it without login.
