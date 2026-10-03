import type { RawJob, RoleReview } from './types.js'

const seniorityPattern = /\b(senior|staff|principal|lead|manager|director|architect|ii|iii|iv)\b/i
const foreignAuthorizationPattern = /\b(us citizen|us work authorization|authorized to work in the united states|h-?1b transfer)\b/i
const onsitePattern = /\b(on[- ]site|in office|office-based|relocate to)\b/i
const remotePattern = /\b(remote|work from home|wfh|anywhere|distributed)\b/i

function textFor(job: RawJob): string {
  return [job.title, job.location, job.description, ...(job.extensions ?? [])]
    .filter(Boolean)
    .join(' ')
}

export function reviewRole(job: RawJob): RoleReview {
  const text = textFor(job)
  const reasons: string[] = []
  const remote = remotePattern.test(text) || job.detected_extensions?.work_from_home === true
  const senior = seniorityPattern.test(job.title ?? '')
  const foreignAuthorization = foreignAuthorizationPattern.test(text)
  const onsite = onsitePattern.test(text) && !remote

  if (remote) reasons.push('Remote evidence found in the listing.')
  else reasons.push('No clear remote evidence found; review manually.')
  if (senior) reasons.push('Senior title detected.')
  if (foreignAuthorization) reasons.push('Foreign work-authorization requirement detected.')
  if (onsite) reasons.push('Onsite-only language detected.')

  return {
    title: job.title ?? 'Untitled role',
    company: job.company_name ?? 'Unknown company',
    location: job.location ?? 'Location not listed',
    postedAt: job.detected_extensions?.posted_at,
    schedule: job.detected_extensions?.schedule_type,
    link: job.apply_options?.find((option) => option.link)?.link ?? job.share_link,
    eligible: remote && !senior && !foreignAuthorization && !onsite,
    reasons,
  }
}

export function reviewRoles(jobs: RawJob[]): RoleReview[] {
  return jobs.map(reviewRole).sort((a, b) => Number(b.eligible) - Number(a.eligible))
}
