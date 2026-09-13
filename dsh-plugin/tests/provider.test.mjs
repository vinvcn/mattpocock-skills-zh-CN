import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as m from '../index.js'

const PROVIDER_NAME = 'mattpocock-skills-zh'
const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SKILLS_ROOT = fileURLToPath(new URL('../skills/', import.meta.url))
const BOGUS_SKILL_PATH = fileURLToPath(new URL('./__no_such_skill__.md', import.meta.url))

test('module exposes only the documented named exports', () => {
  assert.equal(m.default, undefined)
  assert.equal(m.name, PROVIDER_NAME)
  assert.ok(m.inject.includes('skills'))
  assert.equal(typeof m.apply, 'function')
})

test('createProvider returns a named provider whose list and get are thenable', () => {
  const provider = m.createProvider()
  assert.equal(provider.name, PROVIDER_NAME)
  assert.equal(typeof provider.list({}).then, 'function')
  assert.equal(typeof provider.get({}).then, 'function')
})

test('list resolves to 35 well-formed zh- candidates owned by the provider', async () => {
  const candidates = await m.createProvider().list({})
  assert.equal(candidates.length, 35)
  assert.equal(new Set(candidates.map((candidate) => candidate.name)).size, 35)
  for (const candidate of candidates) {
    assert.equal(candidate.provider, PROVIDER_NAME)
    assert.equal(candidate.source, 'bundled')
    assert.equal(candidate.rank, 600)
    assert.equal(typeof candidate.description, 'string')
    assert.ok(candidate.description.length > 0, `${candidate.name} has a description`)
    assert.match(candidate.name, KEBAB_CASE)
    assert.ok(candidate.name.startsWith('zh-'), `${candidate.name} is zh- prefixed`)
    assert.equal(candidate.path, join(candidate.locator, 'SKILL.md'))
    assert.ok(candidate.path.startsWith(SKILLS_ROOT), `${candidate.path} lives under the bundled skills root`)
  }
})

test('zh-grill-me disables model invocation but stays user-invocable', async () => {
  const candidates = await m.createProvider().list({})
  const grillMe = candidates.find((candidate) => candidate.name === 'zh-grill-me')
  assert.deepEqual(grillMe.invocation, { modelInvocable: false, userInvocable: true })
})

test('zh-research is both model- and user-invocable', async () => {
  const candidates = await m.createProvider().list({})
  const research = candidates.find((candidate) => candidate.name === 'zh-research')
  assert.deepEqual(research.invocation, { modelInvocable: true, userInvocable: true })
})

test('get loads the zh-grill-me body and a directory resource base', async () => {
  const provider = m.createProvider()
  const candidates = await provider.list({})
  const candidate = candidates.find((entry) => entry.name === 'zh-grill-me')
  const skill = await provider.get(candidate, {})
  assert.equal(skill.name, 'zh-grill-me')
  assert.match(skill.content, /zh-grilling/)
  assert.deepEqual(skill.resourceBase, { kind: 'directory', path: candidate.locator })
  assert.equal(skill.rank, undefined)
  assert.equal(skill.locator, undefined)
})

test('get resolves undefined for an unreadable path', async () => {
  const provider = m.createProvider()
  const skill = await provider.get({ name: 'zh-missing', path: BOGUS_SKILL_PATH }, {})
  assert.equal(skill, undefined)
})

test('apply registers a provider that lists the same catalog', async () => {
  let captured
  m.apply({ skills: { registerProvider: (create) => { captured = create() } } })
  assert.equal(captured.name, PROVIDER_NAME)
  const candidates = await captured.list({})
  assert.equal(candidates.length, 35)
  for (const candidate of candidates) {
    assert.equal(candidate.provider, m.name)
  }
})
