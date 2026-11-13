import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  rewriteReferences,
  findUnrewrittenReferences,
  rewriteDshCommands,
  findClaudeOnlyCommands
} from '../scripts/rewrite-references.mjs'

test('a) rewrites a backticked /tdd invocation', () => {
  assert.match(rewriteReferences('运行 `/tdd` session'), /\/zh-tdd/)
})

test('b) rewrites /tdd after CJK text', () => {
  assert.equal(rewriteReferences('参见/tdd'), '参见/zh-tdd')
})

test('c) rewrites /tdd at index 0', () => {
  assert.equal(rewriteReferences('/tdd'), '/zh-tdd')
})

test('d) rewrites /code-review after CJK text', () => {
  assert.equal(rewriteReferences('完成 `/code-review`'), '完成 `/zh-code-review`')
})

test('e) leaves src/triage/handler.ts unchanged', () => {
  assert.equal(rewriteReferences('src/triage/handler.ts'), 'src/triage/handler.ts')
})

test('f) leaves docs/agents/triage-labels.md unchanged', () => {
  assert.equal(
    rewriteReferences('docs/agents/triage-labels.md'),
    'docs/agents/triage-labels.md'
  )
})

test('g) leaves /prototype/<name> unchanged', () => {
  const text = '`/prototype/<name>`'
  assert.equal(rewriteReferences(text), text)
  assert.ok(!rewriteReferences(text).includes('/zh-prototype'))
})

test('h) leaves non-skill /clear and /compact unchanged in the skill rewriter', () => {
  assert.equal(rewriteReferences('运行 /clear 和 /compact'), '运行 /clear 和 /compact')
})

test('i) leaves URLs unchanged', () => {
  assert.equal(rewriteReferences('https://example.com/tdd'), 'https://example.com/tdd')
})

test('j) leaves relative markdown links unchanged', () => {
  assert.equal(
    rewriteReferences('[ask-matt](./ask-matt/SKILL.md)'),
    '[ask-matt](./ask-matt/SKILL.md)'
  )
})

test('k) findUnrewrittenReferences distinguishes prefixed and unprefixed', () => {
  assert.deepEqual(findUnrewrittenReferences('运行 `/zh-tdd` 吧'), [])
  assert.deepEqual(findUnrewrittenReferences('运行 `/tdd` 吧'), ['/tdd'])
})

test('l) rewrites /clear to the dsh new-session action', () => {
  assert.equal(rewriteDshCommands('运行 /clear 和 /compact'), '运行 新建会话 和 /compact')
})

test('m) rewrites every /clear occurrence', () => {
  assert.equal(rewriteDshCommands('先 /clear，再 /clear。'), '先 新建会话，再 新建会话。')
})

test('n) rewrites /clear at index 0 and after CJK text', () => {
  assert.equal(rewriteDshCommands('/clear'), '新建会话')
  assert.equal(rewriteDshCommands('参见/clear'), '参见新建会话')
})

test('o) leaves URLs and paths containing clear unchanged', () => {
  assert.equal(rewriteDshCommands('https://example.com/clear'), 'https://example.com/clear')
  assert.equal(rewriteDshCommands('src/clear/handler.ts'), 'src/clear/handler.ts')
  assert.equal(rewriteDshCommands('/clearwater'), '/clearwater')
  assert.equal(rewriteDshCommands('/clear-foo'), '/clear-foo')
})

test('p) findClaudeOnlyCommands reports /clear occurrences only', () => {
  assert.deepEqual(findClaudeOnlyCommands('运行 `/clear` 吧'), ['/clear'])
  assert.deepEqual(findClaudeOnlyCommands('https://example.com/clear'), [])
  assert.deepEqual(findClaudeOnlyCommands('运行 `/zh-clear` 吧'), [])
})

test('extra) rewrites multiple invocations in one string', () => {
  assert.equal(
    rewriteReferences('使用 /grilling 与 /to-spec'),
    '使用 /zh-grilling 与 /zh-to-spec'
  )
})
