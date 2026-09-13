/**
 * Build the dsh-plugin skill tree: copy every skill from the source buckets
 * into a flat `dsh-plugin/skills/` directory, prefix each frontmatter `name:`,
 * and rewrite cross-skill references to their `zh-` prefixed form.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { cpSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SKILL_NAMES, rewriteReferences } from './rewrite-references.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PLUGIN_DIR = dirname(SCRIPT_DIR)
const REPO_ROOT = dirname(PLUGIN_DIR)

const BUCKETS = ['engineering', 'productivity', 'misc', 'in-progress']

const sourceRoot = resolve(process.env.SKILLS_SRC ?? join(REPO_ROOT, 'skills'))
const outputRoot = resolve(process.env.SKILLS_OUT ?? join(PLUGIN_DIR, 'skills'))
const prefix = process.env.SKILL_PREFIX ?? 'zh-'

console.log(`sourceRoot: ${sourceRoot}`)
console.log(`outputRoot: ${outputRoot}`)

/**
 * Print a guard violation and exit with a non-zero status.
 *
 * @param {string} message - Specific description of the violated guard.
 */
function fail(message) {
  console.error(`copy-skills: ${message}`)
  process.exit(1)
}

if (outputRoot === sourceRoot) {
  fail(`outputRoot must differ from sourceRoot (both are ${sourceRoot})`)
}
if (!outputRoot.includes('/dsh-plugin/')) {
  fail(`outputRoot must be inside a /dsh-plugin/ directory, got ${outputRoot}`)
}

/** @type {Map<string, string>} child skill name -> owning bucket */
const owners = new Map()

for (const bucket of BUCKETS) {
  const bucketDir = join(sourceRoot, bucket)
  if (!existsSync(bucketDir) || !statSync(bucketDir).isDirectory()) {
    fail(`missing source bucket directory: ${bucketDir}`)
  }
  for (const entry of readdirSync(bucketDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const skillDir = join(bucketDir, entry.name)
    if (!existsSync(join(skillDir, 'SKILL.md'))) {
      fail(`skill directory has no SKILL.md: ${skillDir}`)
    }
    if (owners.has(entry.name)) {
      fail(`duplicate skill name '${entry.name}' in buckets '${owners.get(entry.name)}' and '${bucket}'`)
    }
    owners.set(entry.name, bucket)
  }
}

rmSync(outputRoot, { recursive: true, force: true })
mkdirSync(outputRoot, { recursive: true })

/** @type {string[]} */
const copied = []
for (const [name, bucket] of owners) {
  cpSync(join(sourceRoot, bucket, name), join(outputRoot, name), { recursive: true })
  copied.push(name)
}

/**
 * Prefix the `name:` value inside the leading frontmatter block.
 *
 * @param {string} text - Markdown file contents.
 * @returns {string} Contents with the frontmatter name prefixed.
 */
function prefixFrontmatterName(text) {
  const match = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/)
  if (!match) return text
  const frontmatter = match[2].replace(
    /^(name:[ \t]*)(.*)$/m,
    (_full, key, value) => `${key}${prefix}${value}`
  )
  if (frontmatter === match[2]) return text
  return match[1] + frontmatter + match[3] + text.slice(match[0].length)
}

/**
 * Yield every regular file under a directory, recursively.
 *
 * @param {string} dir - Directory to walk.
 * @returns {Generator<string>} Absolute file paths.
 */
function* walkFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkFiles(full)
    else if (entry.isFile()) yield full
  }
}

for (const file of walkFiles(outputRoot)) {
  if (!file.endsWith('.md')) continue
  const original = readFileSync(file, 'utf8')
  let text = original
  if (file.endsWith('SKILL.md')) text = prefixFrontmatterName(text)
  const rewritten = rewriteReferences(text, SKILL_NAMES, prefix)
  if (rewritten !== original) writeFileSync(file, rewritten)
}

console.log(`copied ${copied.length} skills to ${outputRoot}`)
