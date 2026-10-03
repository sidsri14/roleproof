import test from 'node:test'
import assert from 'node:assert/strict'
import { reviewRole, reviewRoles } from '../src/eligibility.js'
import { loadLocalEnv } from '../src/env.js'
import { searchJobs } from '../src/serpapi.js'

test('accepts a non-senior role with remote evidence', () => {
  const role = reviewRole({ title: 'Software Engineer', company_name: 'Acme', location: 'Remote - India' })
  assert.equal(role.eligible, true)
})

test('rejects senior and foreign-authorized roles even when remote', () => {
  const role = reviewRole({
    title: 'Senior Backend Engineer',
    company_name: 'Acme',
    location: 'Remote',
    description: 'US work authorization required.',
  })
  assert.equal(role.eligible, false)
  assert.match(role.reasons.join(' '), /Senior title/)
  assert.match(role.reasons.join(' '), /authorization/)
})

test('sorts review candidates before manual-review roles', () => {
  const roles = reviewRoles([
    { title: 'Engineer', company_name: 'Office', location: 'Bengaluru', description: 'Onsite.' },
    { title: 'Engineer', company_name: 'Remote', location: 'Remote', description: 'Distributed team.' },
  ])
  assert.equal(roles[0].company, 'Remote')
  assert.equal(roles[0].eligible, true)
})

test('loads the documented Google Jobs fixture in demo mode', async () => {
  const previous = process.env.DEMO_MODE
  process.env.DEMO_MODE = '1'
  try {
    const jobs = await searchJobs('software engineer remote', 'India')
    assert.equal(jobs.length, 3)
    assert.equal(reviewRoles(jobs)[0].eligible, true)
  } finally {
    if (previous === undefined) delete process.env.DEMO_MODE
    else process.env.DEMO_MODE = previous
  }
})

test('loads unset values from a local dotenv file without overriding process values', () => {
  const originalDemo = process.env.DEMO_MODE
  const originalPort = process.env.PORT
  const path = new URL('fixtures/test.env', import.meta.url)
  process.env.PORT = '9999'
  delete process.env.DEMO_MODE
  try {
    loadLocalEnv(path)
    assert.equal(process.env.DEMO_MODE, '1')
    assert.equal(process.env.PORT, '9999')
  } finally {
    if (originalDemo === undefined) delete process.env.DEMO_MODE
    else process.env.DEMO_MODE = originalDemo
    if (originalPort === undefined) delete process.env.PORT
    else process.env.PORT = originalPort
  }
})
