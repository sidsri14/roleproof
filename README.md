# RoleProof

RoleProof is an evidence-first remote-job triage dashboard. It uses SerpApi's
Google Jobs endpoint from a local server, then highlights roles that have
explicit remote evidence while flagging senior titles, onsite language, and
foreign work-authorization requirements for manual review.

It does not scrape authenticated sites, send messages, or submit applications.
Every application remains a deliberate human decision.

## Why it exists

Job search tools often turn a vague search result into an overly confident
match. RoleProof keeps the evidence visible: the source listing, the remote
signal, and the reason a role was included or flagged.

## Run it locally

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:4177`. The checked-in `DEMO_MODE=1` configuration uses
fixture results. For live searches, set `DEMO_MODE=0` and provide a
`SERPAPI_API_KEY` in `.env`.

## SerpApi integration

The server calls `https://serpapi.com/search.json` with `engine=google_jobs`,
the reviewer's query, and their requested search location. The API key remains
on the server and is never returned to the browser. Results are normalized from
the documented `jobs_results` response before the local review rules run.

## Verification

```bash
npm run typecheck
npm test
```

The test suite covers the conservative eligibility rules: remote evidence is
required, and senior, foreign-authorization, or onsite-only signals force a
manual review.

## Hackathon submission material

Factual dashboard copy and a live-demo checklist are in
[`docs/serpapi-submission.md`](docs/serpapi-submission.md). The project should
only be submitted after a live SerpApi request and a publicly accessible demo
video are verified.
