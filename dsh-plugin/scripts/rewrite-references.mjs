/**
 * Path-safe rewriter for skill invocations such as `/tdd`.
 *
 * Only references whose surrounding characters show they are skill invocations
 * (not filesystem paths or URLs) are rewritten to the `zh-` prefixed form.
 */

const DEFAULT_PREFIX = 'zh-'

/** Characters that, immediately before a `/`, mean the slash is part of a path. */
const BEFORE_BLOCKED = 'A-Za-z0-9_/.-'

/** Characters that, immediately after a skill name, mean the match is a path segment. */
const AFTER_BLOCKED = 'A-Za-z0-9_/-'

/** The 35 locales skill names, sorted. */
export const SKILL_NAMES = [
  'ask-matt',
  'claude-handoff',
  'code-review',
  'codebase-design',
  'diagnosing-bugs',
  'domain-modeling',
  'git-guardrails-claude-code',
  'grill-me',
  'grill-with-docs',
  'grilling',
  'handoff',
  'implement',
  'improve-codebase-architecture',
  'loop-me',
  'migrate-to-shoehorn',
  'prototype',
  'research',
  'resolving-merge-conflicts',
  'scaffold-exercises',
  'setup-matt-pocock-skills',
  'setup-pre-commit',
  'setup-ts-deep-modules',
  'tdd',
  'teach',
  'to-questionnaire',
  'to-spec',
  'to-tickets',
  'triage',
  'wait-what',
  'wayfinder',
  'wizard',
  'writing-beats',
  'writing-for-agents',
  'writing-fragments',
  'writing-shape'
]

/**
 * Escape a skill name for use inside a regular expression.
 *
 * @param {string} name - Skill name to escape.
 * @returns {string} Escaped name.
 */
function escapeName(name) {
  return name.replace(/-/g, '\\-')
}

/**
 * Build a global regular expression matching `/<name>` with the boundary rule.
 *
 * Candidate names are alternated longest-first so a shorter name is not matched
 * inside a longer one's occurrence.
 *
 * @param {readonly string[]} names - Skill names to match.
 * @returns {RegExp} Global regular expression.
 */
function buildPattern(names) {
  const alternatives = [...names]
    .sort((a, b) => b.length - a.length)
    .map(escapeName)
    .join('|')
  return new RegExp(
    `(?<![${BEFORE_BLOCKED}])/(?:${alternatives})(?![${AFTER_BLOCKED}])`,
    'g'
  )
}

/**
 * Rewrite known skill references to the prefixed form.
 *
 * @param {string} text - Text to rewrite.
 * @param {readonly string[]} [names] - Skill names; defaults to all known names.
 * @param {string} [prefix] - Prefix to insert; defaults to `zh-`.
 * @returns {string} Rewritten text.
 */
export function rewriteReferences(text, names = SKILL_NAMES, prefix = DEFAULT_PREFIX) {
  return text.replace(buildPattern(names), (match) => `/${prefix}${match.slice(1)}`)
}

/**
 * List known-skill references that are still unprefixed.
 *
 * Uses the same boundary rule as {@link rewriteReferences} and excludes
 * occurrences already carrying the prefix.
 *
 * @param {string} text - Text to inspect.
 * @param {readonly string[]} [names] - Skill names; defaults to all known names.
 * @returns {string[]} Unprefixed reference occurrences, including the leading slash.
 */
export function findUnrewrittenReferences(text, names = SKILL_NAMES) {
  const found = []
  for (const match of text.matchAll(buildPattern(names))) {
    const nameEnd = match.index + match[0].length
    if (!text.startsWith(DEFAULT_PREFIX, nameEnd)) found.push(match[0])
  }
  return found
}
