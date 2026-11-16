/**
 * Path-safe rewriter for skill invocations such as `/tdd`.
 *
 * Only references whose surrounding characters show they are skill invocations
 * (not filesystem paths or URLs) are rewritten to the `zh-` prefixed form.
 */

const DEFAULT_PREFIX = 'zh-'

/**
 * Claude Code-only slash commands that need a dsh-facing equivalent.
 *
 * The generated dsh plugin copies the localized skill text as-is, but dsh
 * rejects unknown slash commands instead of treating them as prompts. Every
 * entry here is replaced during the build so readers see an action dsh
 * actually supports.
 */
export const DSH_COMMAND_REPLACEMENTS = new Map([
  ['/clear', '新建会话']
])

/** Characters that, immediately before a `/`, mean the slash is part of a path. */
const BEFORE_BLOCKED = 'A-Za-z0-9_/.-'

/** Characters that, immediately after a skill name, mean the match is a path segment. */
const AFTER_BLOCKED = 'A-Za-z0-9_/-'

/** The 38 locales skill names, sorted. */
export const SKILL_NAMES = [
  'ask-matt',
  'chief-of-staff',
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
  'implement-spec',
  'improve-codebase-architecture',
  'loop-me',
  'migrate-to-shoehorn',
  'pr',
  'prototype',
  'research',
  'retro',
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
 * Escape a slash command for use inside a regular expression.
 *
 * @param {string} command - Command without the leading slash.
 * @returns {string} Escaped command.
 */
function escapeCommand(command) {
  return command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Build a global regular expression matching the Claude Code-only commands.
 *
 * Candidate commands are alternated longest-first so a shorter command is not
 * matched inside a longer one's occurrence.
 *
 * @param {Iterable<string>} commands - Slash commands, including the leading slash.
 * @returns {RegExp} Global regular expression.
 */
function buildCommandPattern(commands) {
  const alternatives = [...commands]
    .sort((a, b) => b.length - a.length)
    .map((command) => escapeCommand(command.slice(1)))
    .join('|')
  return new RegExp(
    `(?<![${BEFORE_BLOCKED}])/(?:${alternatives})(?![${AFTER_BLOCKED}])`,
    'g'
  )
}

/**
 * Rewrite Claude Code-only slash commands to their dsh equivalents.
 *
 * Uses the same path and URL boundary rule as {@link rewriteReferences}, so
 * values such as `src/clear/handler.ts` or `https://example.com/clear` are
 * left untouched.
 *
 * @param {string} text - Text to rewrite.
 * @returns {string} Rewritten text.
 */
export function rewriteDshCommands(text) {
  return text.replace(
    buildCommandPattern(DSH_COMMAND_REPLACEMENTS.keys()),
    (match) => DSH_COMMAND_REPLACEMENTS.get(match)
  )
}

/**
 * List Claude Code-only command occurrences that still need a dsh mapping.
 *
 * @param {string} text - Text to inspect.
 * @returns {string[]} Matching command occurrences, including the leading slash.
 */
export function findClaudeOnlyCommands(text) {
  return [...text.matchAll(buildCommandPattern(DSH_COMMAND_REPLACEMENTS.keys()))].map(
    (match) => match[0]
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
