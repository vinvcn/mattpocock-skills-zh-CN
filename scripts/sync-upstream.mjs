import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const statePath = path.join(repoRoot, ".skills", "upstream-sync.json");
const args = new Set(process.argv.slice(2));

function git(...gitArgs) {
  return execFileSync("git", gitArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!fs.existsSync(statePath)) {
  fail(`missing ${path.relative(repoRoot, statePath)}`);
}

let state;
try {
  state = JSON.parse(fs.readFileSync(statePath, "utf8"));
} catch (error) {
  fail(`cannot read ${path.relative(repoRoot, statePath)}: ${error.message}`);
}

if (!args.has("--allow-dirty")) {
  const status = git("status", "--porcelain");
  if (status) {
    fail("working tree is dirty; commit or stash local changes before syncing");
  }
}

const remote = state.remote ?? "upstream";
const ref = state.ref ?? "main";
if (!args.has("--no-fetch")) {
  try {
    execFileSync("git", ["fetch", remote, ref], {
      cwd: repoRoot,
      stdio: "inherit",
    });
  } catch {
    fail(`git fetch ${remote} ${ref} failed; check network/proxy access`);
  }
}

const base = state.lastSyncedUpstreamCommit;
if (!base) fail("state has no lastSyncedUpstreamCommit");

let upstream;
try {
  upstream = git("rev-parse", `${remote}/${ref}`);
  git("cat-file", "-e", `${base}^{commit}`);
} catch {
  fail(`cannot resolve ${remote}/${ref} or base commit ${base}`);
}

console.log(`维护副本: ${repoRoot}`);
console.log(`上游: ${state.upstreamRepo ?? `${remote}/${ref}`}`);
console.log(`已同步基线: ${base}`);
console.log(`当前上游: ${upstream}`);

if (base === upstream) {
  console.log("结果: 上游没有新的提交，无需翻译。");
  process.exit(0);
}

try {
  if (git("merge-base", "--is-ancestor", base, upstream) !== "") {
    // git merge-base --is-ancestor normally returns no stdout; this branch is
    // intentionally unreachable and keeps the command visible in the flow.
  }
} catch {
  fail("lastSyncedUpstreamCommit is not an ancestor of the current upstream ref; resolve the base manually");
}

const rawStatus = git("diff", "--name-status", "--find-renames", `${base}..${upstream}`);
const changes = rawStatus
  ? rawStatus.split("\n").map((line) => {
      const [status, ...pathParts] = line.split("\t");
      return { status, file: pathParts.join("\t") };
    })
  : [];
const inScope = changes.filter(({ file }) => file.startsWith("skills/") || file.startsWith("docs/"));
const outOfScope = changes.filter(({ file }) => !file.startsWith("skills/") && !file.startsWith("docs/"));

const grouped = {
  新增: inScope.filter(({ status }) => status.startsWith("A")),
  修改: inScope.filter(({ status }) => status.startsWith("M")),
  删除: inScope.filter(({ status }) => status.startsWith("D")),
  重命名: inScope.filter(({ status }) => status.startsWith("R")),
};

for (const [label, files] of Object.entries(grouped)) {
  if (!files.length) continue;
  console.log(`\n${label}（${files.length}）`);
  for (const { status, file } of files) console.log(`  ${status}\t${file}`);
}

if (outOfScope.length) {
  console.log(`\n上游仓库管理或其他非内容变化（不自动导入，${outOfScope.length} 项）`);
  for (const { status, file } of outOfScope) console.log(`  ${status}\t${file}`);
}

console.log(`\n待处理内容文件: ${inScope.length}`);
console.log("下一步: 按 .skills/translate-skill/SKILL.md 翻译自然语言，保留名称、命令、路径、URL、frontmatter keys 和行为关键 labels。");
console.log("完成后运行: node scripts/check-translation.mjs && node scripts/audit-english.mjs && git diff --check");
