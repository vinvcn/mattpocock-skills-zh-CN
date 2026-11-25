import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const files = execSync("git ls-files", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((file) => file && fs.existsSync(file));

const forbiddenPhrases = [
  { text: "这一票", reason: "ticket 应译为“任务”，不译为“票”" },
  { text: "每张票", reason: "ticket 应译为“任务”，不译为“票”" },
  { text: "这票", reason: "ticket 应译为“任务”，不译为“票”" },
  { text: "一票", reason: "ticket 应译为“任务”，不译为“票”" },
  { text: "不关单", reason: "按语境使用“不要关闭 issue”或“不要关闭任务”" },
  { text: "关单", reason: "按语境使用“关闭 issue”或“关闭任务”" },
];

let failed = false;
function fail(file, msg) {
  failed = true;
  console.error(`✗ ${file}: ${msg}`);
}
function read(file) {
  return fs.readFileSync(file, "utf8");
}

for (const file of files) {
  if (!file.endsWith(".md")) continue;
  const text = read(file);
  const fences = text.match(/```/g) || [];
  if (fences.length % 2 !== 0) {
    fail(file, "unbalanced fenced code blocks");
  }
  const textWithoutFences = text.replace(/```[\s\S]*?```/g, "");
  const lines = textWithoutFences.split("\n");
  for (let index = 0; index < lines.length; index++) {
    if (file === "TRANSLATION-GLOSSARY.md") continue;
    const phrase = forbiddenPhrases.find(({ text }) =>
      lines[index].includes(text),
    );
    if (phrase) {
      fail(file, `line ${index + 1}: ${phrase.reason}（命中“${phrase.text}”）`);
    }
  }
  if (path.basename(file) === "SKILL.md") {
    const fm = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fm) {
      fail(file, "missing or malformed YAML frontmatter");
      continue;
    }
    const frontmatter = fm[1];
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) fail(file, "missing frontmatter name");
    if (!description) fail(file, "missing frontmatter description");
    if (name && /[\u3400-\u9fff]/.test(name)) {
      fail(file, "frontmatter name should remain an ASCII slug");
    }
    if (description && description.length > 1024) {
      fail(file, "description exceeds 1024 characters");
    }
    if (/^name:\s*["']?[\u3400-\u9fff]/m.test(frontmatter)) {
      fail(file, "frontmatter name appears translated");
    }
  }
}

if (files.includes("README.md")) {
  const readme = read("README.md");
  if (/npx skills@latest add mattpocock\/skills\//.test(readme)) {
    fail("README.md", "install commands still point at mattpocock/skills");
  }
  if (/vinvcn\/skills-zh-CN/.test(readme)) {
    fail("README.md", "README still points at vinvcn/skills-zh-CN");
  }
  if (!/vinvcn\/mattpocock-skills-zh-CN/.test(readme)) {
    fail(
      "README.md",
      "README does not reference vinvcn/mattpocock-skills-zh-CN",
    );
  }
}

if (!fs.existsSync("LICENSE")) {
  fail("LICENSE", "original MIT license file should remain");
}
if (!fs.existsSync("LICENSE.zh-CN.md")) {
  fail("LICENSE.zh-CN.md", "missing unofficial Chinese license translation");
}
const licenseDiff = execSync("git diff -- LICENSE", { encoding: "utf8" });
if (licenseDiff.trim()) {
  fail("LICENSE", "original LICENSE file was modified");
}

process.exit(failed ? 1 : 0);
