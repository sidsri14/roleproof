import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { RawJob } from './types.js'

interface SerpApiPayload {
  jobs_results?: RawJob[] | { jobs?: RawJob[] }
  error?: string
}

const fixturePath = fileURLToPath(new URL('../test/fixtures/google-jobs.json', import.meta.url))

function jobsFromPayload(payload: SerpApiPayload): RawJob[] {
  if (Array.isArray(payload.jobs_results)) return payload.jobs_results
  if (Array.isArray(payload.jobs_results?.jobs)) return payload.jobs_results.jobs
  return []
}

export async function searchJobs(query: string, location: string): Promise<RawJob[]> {
  if (process.env.DEMO_MODE === '1') {
    const fixture = JSON.parse(await readFile(fixturePath, 'utf8')) as SerpApiPayload
    return jobsFromPayload(fixture)
  }

  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) throw new Error('Set SERPAPI_API_KEY or DEMO_MODE=1 before searching.')

  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_jobs')
  url.searchParams.set('q', query)
  url.searchParams.set('location', location)
  url.searchParams.set('hl', 'en')
  url.searchParams.set('gl', 'in')
  url.searchParams.set('api_key', apiKey)

  const response = await fetch(url)
  if (!response.ok) throw new Error(`SerpApi returned HTTP ${response.status}.`)
  const payload = (await response.json()) as SerpApiPayload
  if (payload.error) throw new Error(`SerpApi error: ${payload.error}`)
  return jobsFromPayload(payload)
}
