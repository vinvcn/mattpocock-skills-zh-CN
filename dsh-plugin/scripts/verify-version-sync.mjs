import { readFileSync } from 'node:fs'

const packageUrl = new URL('../package.json', import.meta.url)
const pluginUrl = new URL('../../.claude-plugin/plugin.json', import.meta.url)

/**
 * Read and parse a JSON file, reporting failures as a bare message.
 *
 * @param {URL} url - File to read.
 * @returns {{ version?: string }} Parsed JSON object.
 */
function readJson(url) {
  try {
    return JSON.parse(readFileSync(url, 'utf8'))
  } catch (error) {
    console.error(`cannot read ${url.pathname}: ${error.message}`)
    process.exit(1)
  }
}

const packageJson = readJson(packageUrl)
const pluginJson = readJson(pluginUrl)

if (packageJson.version !== pluginJson.version) {
  console.error(`version mismatch: ${packageJson.version} != ${pluginJson.version}`)
  process.exitCode = 1
} else {
  console.log('ok')
}
