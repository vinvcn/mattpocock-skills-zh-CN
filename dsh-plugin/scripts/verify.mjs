/**
 * Verify the generated dsh-plugin skill tree: presence, count, frontmatter
 * prefix and description, no unprefixed references, no retired directories,
 * and a resolvable bundle patch path declared by package.json.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SKILL_NAMES, findUnrewrittenReferences } from './rewrite-references.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PLUGIN_DIR = dirname(SCRIPT_DIR)

const EXPECTED_SKILLS = 35
const FORBIDDEN_DIRS = ['deprecated', 'translate-skill']

/**
 * Print a failure message and exit with a non-zero status.
 *
 * @param {string} message - Specific description of the failed check.
 */
function fail(message) {
  console.error(`verify: ${message}`)
  process.exit(1)
}

const skillsDir = join(PLUGIN_DIR, 'skills')
if (!existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) {
  fail(`missing skills directory: ${skillsDir}`)
}

const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const skillFiles = skillDirs
  .map((name) => join(skillsDir, name, 'SKILL.md'))
  .filter((file) => existsSync(file))

if (skillFiles.length !== EXPECTED_SKILLS) {
  fail(`expected ${EXPECTED_SKILLS} skills/*/SKILL.md files, found ${skillFiles.length}`)
}

/**
 * Extract the leading frontmatter block of a Markdown document.
 *
 * @param {string} text - Markdown file contents.
 * @returns {string | undefined} Frontmatter body, or undefined when absent.
 */
function frontmatterOf(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match?.[1]
}

for (const file of skillFiles) {
  const frontmatter = frontmatterOf(readFileSync(file, 'utf8'))
  if (frontmatter === undefined) {
    fail(`missing leading frontmatter: ${file}`)
  }
  const nameMatch = frontmatter.match(/^name:[ \t]*(.*)$/m)
  if (!nameMatch || !nameMatch[1].startsWith('zh-')) {
    fail(`frontmatter name is missing the 'zh-' prefix: ${file}`)
  }
  const descriptionMatch = frontmatter.match(/^description:[ \t]*(.*)$/m)
  if (!descriptionMatch || descriptionMatch[1].trim() === '') {
    fail(`frontmatter description is empty: ${file}`)
  }
}

/**
 * Yield every path under a directory, recursively, paired with its type.
 *
 * @param {string} dir - Directory to walk.
 * @returns {Generator<{ path: string, isDirectory: boolean }>} Entries.
 */
function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    yield { path: full, isDirectory: entry.isDirectory() }
    if (entry.isDirectory()) yield* walk(full)
  }
}

for (const entry of walk(skillsDir)) {
  if (entry.isDirectory && FORBIDDEN_DIRS.includes(basename(entry.path))) {
    fail(`forbidden directory present: ${entry.path}`)
  }
  if (!entry.isDirectory && entry.path.endsWith('.md')) {
    const found = findUnrewrittenReferences(readFileSync(entry.path, 'utf8'), SKILL_NAMES)
    if (found.length > 0) {
      fail(`unrewritten skill reference(s) in ${entry.path}: ${[...new Set(found)].join(', ')}`)
    }
  }
}

const packageJsonPath = join(PLUGIN_DIR, 'package.json')
if (!existsSync(packageJsonPath)) {
  fail(`missing package.json: ${packageJsonPath}`)
}
const patchPath = JSON.parse(readFileSync(packageJsonPath, 'utf8'))?.dsh?.bundle?.patch
if (typeof patchPath !== 'string' || patchPath === '') {
  fail(`package.json declares no dsh.bundle.patch: ${packageJsonPath}`)
}
const resolvedPatch = resolve(PLUGIN_DIR, patchPath)
if (!existsSync(resolvedPatch)) {
  fail(`declared dsh.bundle.patch does not exist: ${resolvedPatch} (from ${packageJsonPath})`)
}

console.log(`ok: ${skillFiles.length} skills verified, bundle patch ${patchPath}`)
