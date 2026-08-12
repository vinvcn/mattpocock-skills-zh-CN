#!/usr/bin/env node
// sync-worklist.mjs — 生成“上游同步翻译工作清单”
//
// 目的：每次从上游 mattpocock/skills 做内容刷新（content refresh）时，产出一份可认领的翻译
// 工作清单——只列出相对上次同步点“新增/变更/移除”的 in-scope .md 内容文件，让贡献者只翻译
// 增量（delta），稳定内容的既有译文自动保留，从而让社区贡献在未来的同步中持续复用。
//
// 用法：
//   node scripts/sync-worklist.mjs <last-synced-upstream-sha> [upstream-ref]
//     <last-synced-upstream-sha>  上次同步对应的上游 short/full SHA（见 README 同步记录）
//     [upstream-ref]              默认 upstream/main；先 `git fetch upstream` 确保已抓取
//
// 输出：Markdown 工作清单（stdout），按 bucket 分组、每项带认领 checkbox，并标注该文件在本仓库
// 是否已有对应译文（“需首次翻译” vs “需更新/复核既有译文”）。

import fs from "node:fs";
import { execSync as run } from "node:child_process";

const [baseSha, upstreamRef = "upstream/main"] = process.argv.slice(2);

function die(msg) {
  console.error(`错误：${msg}`);
  console.error("\n用法：node scripts/sync-worklist.mjs <last-synced-upstream-sha> [upstream-ref]");
  console.error("  例如：node scripts/sync-worklist.mjs 733d312 upstream/main");
  console.error("  上次同步的上游 SHA 见 README 的同步记录（sync log）。");
  process.exit(1);
}
function revExists(rev) {
  try { run(`git rev-parse --verify ${rev}^{commit}`, { encoding: "utf8", stdio: "pipe" }); return true; }
  catch { return false; }
}

if (!baseSha) die("缺少 <last-synced-upstream-sha> 参数。");
if (!revExists(baseSha)) die(`找不到 commit ${baseSha}。请确认它是有效的上游 SHA。`);
if (!revExists(upstreamRef)) die(`找不到 ref ${upstreamRef}。请先运行：git fetch upstream`);

// 上游 base..upstreamRef 之间变更的 .md 文件
const raw = run(`git diff --name-status ${baseSha}..${upstreamRef} -- '*.md'`, { encoding: "utf8" });
const entries = raw.trim().split("\n").filter(Boolean).map((line) => {
  const [status, ...rest] = line.split("\t");
  // 处理 rename：R100\told\tnew -> 取新路径
  const path = rest.length > 1 ? rest[1] : rest[0];
  return { status: status[0], path };
});

// in-scope：排除 LICENSE（不翻译）、worktree
const inScope = entries.filter(
  (e) => e.path.endsWith(".md") && !/LICENSE/i.test(e.path) && !e.path.startsWith(".claude/worktrees/")
);

if (!inScope.length) {
  console.log(`# 同步翻译工作清单\n\n相对 ${baseSha}..${upstreamRef}，没有 in-scope 的 .md 内容变更。无需翻译增量。`);
  process.exit(0);
}

// 本地是否已有对应译文（同路径）
const hasLocal = (p) => fs.existsSync(p);
const statusLabel = { A: "新增", M: "变更", D: "移除", R: "重命名" };

// 分组：按 bucket / 顶层目录
function groupKey(p) {
  const parts = p.split("/");
  if (parts[0] === "skills" && parts.length >= 2) return `skills/${parts[1]}`;
  if (parts[0] === "docs" && parts.length >= 2) return `docs/${parts[1]}`;
  return parts[0] || "root";
}
const groups = new Map();
for (const e of inScope) {
  const k = groupKey(e.path);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(e);
}
const orderedKeys = [...groups.keys()].sort();

console.log("# 同步翻译工作清单");
console.log("");
console.log(`上游对比范围：\`${baseSha}..${upstreamRef}\``);
console.log(`in-scope 变更文件：${inScope.length} 个（新增/变更/移除/重命名）。`);
console.log("");
console.log("> 认领方式：在自己认领的条目 `[ ]` 里填上自己的 GitHub 用户名，例如 `[x] @yourname`。");
console.log("> “需首次翻译”= 本仓库尚无对应译文；“需更新/复核”= 已有译文，需对照上游变更刷新。");
console.log("");

for (const k of orderedKeys) {
  console.log(`## ${k}`);
  console.log("");
  for (const e of groups.get(k).sort((a, b) => a.path.localeCompare(b.path))) {
    const s = statusLabel[e.status] || e.status;
    if (e.status === "D") {
      console.log(`- [ ] ~~\`${e.path}\`~~ —— 上游已移除（${s}）：考虑同步移除本地译文或标记 stale`);
      continue;
    }
    const local = hasLocal(e.path);
    const action = local ? "需更新/复核既有译文" : "需首次翻译";
    console.log(`- [ ] \`${e.path}\` —— 上游${s} · ${action}`);
  }
  console.log("");
}

console.log("## 完成每个条目后");
console.log("");
console.log("1. 翻译时遵循 `.skills/translate-skill/SKILL.md` 的规则。");
console.log("2. 遇到新的 recurring 术语，顺手在 `TRANSLATE_GLOSSARY.md` 登记裁决。");
console.log("3. 完成后运行 `node scripts/check-translation.mjs` 与 `node scripts/audit-coverage.mjs` 自检。");
