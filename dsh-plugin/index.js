/**
 * Self-contained skill provider for the bundled `mattpocock-skills-zh` package.
 *
 * Discovers the generated `skills/<name>/SKILL.md` bundle shipped in this
 * package, parses each file's YAML frontmatter, and registers the results on
 * `ctx.skills` at bundled rank 600. Skill bodies are re-read on every `get`,
 * so edits need no cache invalidation.
 *
 * @module @vinvcn/dsh-mattpocock-skills-zh
 */

import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { parse } from 'yaml'

/** Provider name registered on `ctx.skills`. */
const PROVIDER_NAME = 'mattpocock-skills-zh'
/** Bundled-provider rank, matching `BUNDLED_SKILL_RANK` in `dsh-skill`. */
const RANK = 600
/** Origin bucket for skills shipped inside this package. */
const SOURCE = 'bundled'
/** Absolute path of the generated skill tree. */
const skillsRoot = fileURLToPath(new URL('./skills/', import.meta.url))

/**
 * Split `---`-delimited YAML frontmatter from a skill's Markdown body.
 * @param raw - full `SKILL.md` text.
 * @returns parsed frontmatter object and the body after it, or `undefined` when
 *   the file has no closed frontmatter block.
 */
function splitFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw)
  if (match === null) return undefined
  return { data: parse(match[1]) ?? {}, body: raw.slice(match[0].length) }
}

/**
 * Project frontmatter into the shared invocation policy; omitted fields permit
 * both surfaces.
 * @param data - parsed frontmatter.
 * @returns model and user invocation controls.
 */
function invocationFrom(data) {
  return {
    modelInvocable: data['disable-model-invocation'] !== true,
    userInvocable: data['user-invocable'] !== false,
  }
}

/**
 * Create a provider over a skill root.
 * @param root - absolute directory containing one `<name>/SKILL.md` bundle per
 *   skill; defaults to this package's generated `skills/` tree.
 * @returns the `ctx.skills` provider, whose `list`/`get` both return Promises.
 */
export function createProvider(root = skillsRoot) {
  return {
    name: PROVIDER_NAME,
    async list(_options) {
      const entries = await readdir(root, { withFileTypes: true })
      entries.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
      const candidates = []
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const dir = join(root, entry.name)
        const { data } = splitFrontmatter(await readFile(join(dir, 'SKILL.md'), 'utf8')) ?? { data: {} }
        const whenToUse = data.whenToUse
        const metadata = data.metadata
        candidates.push({
          name: data.name,
          description: data.description,
          ...(whenToUse !== undefined ? { whenToUse } : {}),
          invocation: invocationFrom(data),
          source: SOURCE,
          provider: PROVIDER_NAME,
          rank: RANK,
          locator: dir,
          path: join(dir, 'SKILL.md'),
          ...(metadata !== undefined ? { metadata } : {}),
        })
      }
      return candidates
    },
    async get(candidate, _options) {
      let raw
      try {
        raw = await readFile(candidate.path, 'utf8')
      } catch {
        // Any `readFile` failure (missing, unreadable, or invalid path) means the skill is no longer loadable.
        return undefined
      }
      const frontmatter = splitFrontmatter(raw)
      const data = frontmatter?.data ?? {}
      const whenToUse = data.whenToUse
      const metadata = data.metadata
      return {
        name: data.name,
        description: data.description,
        ...(whenToUse !== undefined ? { whenToUse } : {}),
        invocation: invocationFrom(data),
        source: SOURCE,
        provider: PROVIDER_NAME,
        path: candidate.path,
        ...(metadata !== undefined ? { metadata } : {}),
        resourceBase: { kind: 'directory', path: candidate.locator },
        content: frontmatter?.body ?? raw,
      }
    },
  }
}

/** Cordis plugin name. */
export const name = PROVIDER_NAME
/** Service required by the bundled provider. */
export const inject = ['skills']

/**
 * Register the bundled provider on `ctx.skills`.
 * @param ctx - Cordis context carrying the `skills` service.
 */
export function apply(ctx) {
  ctx.skills.registerProvider(() => createProvider())
}
