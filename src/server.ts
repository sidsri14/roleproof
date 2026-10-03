import { createServer } from 'node:http'
import { loadLocalEnv } from './env.js'
import { reviewRoles } from './eligibility.js'
import { searchJobs } from './serpapi.js'

loadLocalEnv()

const page = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RoleProof</title>
<style>body{font:16px system-ui;max-width:900px;margin:40px auto;padding:0 18px;background:#111827;color:#e5e7eb}input,button{padding:10px;margin:4px;border-radius:6px;border:1px solid #4b5563}input{background:#1f2937;color:#fff;width:260px}button{background:#22c55e;color:#052e16;font-weight:700}.card{border:1px solid #374151;border-radius:10px;padding:16px;margin:12px 0}.ok{color:#86efac}.review{color:#fbbf24}small{color:#9ca3af}</style>
<h1>RoleProof</h1><p>Evidence-first remote-job triage. It never submits an application.</p>
<form id="search"><input name="query" value="software engineer remote"><input name="location" value="India"><button>Review roles</button></form>
<main><p><small>Use DEMO_MODE=1 for fixture data, or set SERPAPI_API_KEY for a live Google Jobs search.</small></p></main>
<script>const form=document.querySelector('#search'),main=document.querySelector('main');form.onsubmit=async(e)=>{e.preventDefault();main.textContent='Searching...';const p=new URLSearchParams(new FormData(form));const r=await fetch('/api/search?'+p);const body=await r.json();if(!r.ok){main.textContent=body.error;return}main.innerHTML=body.roles.map(x=>'<article class="card"><strong class="'+(x.eligible?'ok':'review')+'">'+(x.eligible?'Review candidate':'Manual review')+'</strong><h2>'+x.title+'</h2><p>'+x.company+' | '+x.location+'</p><p>'+x.reasons.join(' ')+'</p>'+(x.link?'<a href="'+x.link+'" target="_blank" rel="noreferrer">Open listing</a>':'')+'</article>').join('')||'No jobs returned.'};if(new URLSearchParams(location.search).get('autosearch')==='1')form.requestSubmit()</script></html>`

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
  if (url.pathname === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(page)
    return
  }
  if (url.pathname === '/api/search') {
    try {
      const query = url.searchParams.get('query')?.trim() || 'software engineer remote'
      const location = url.searchParams.get('location')?.trim() || 'India'
      const roles = reviewRoles(await searchJobs(query, location))
      response.writeHead(200, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ roles }))
    } catch (error) {
      response.writeHead(400, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Search failed.' }))
    }
    return
  }
  response.writeHead(404).end()
})

const port = Number(process.env.PORT ?? 4177)
server.listen(port, () => console.log(`RoleProof listening on http://localhost:${port}`))
