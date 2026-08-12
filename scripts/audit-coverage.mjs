#!/usr/bin/env node
// audit-coverage.mjs — 翻译覆盖审计（advisory，只作为人工复核队列，不做硬性失败）
//
// 目的：在剥离“不可翻译区”之后，量化正文里残留的英文，帮助定位：
//   ① 高频英文术语（术语表 TRANSLATE_GLOSSARY.md 的扩表候选）
//   ② function words（the/and/when/…）——它们不属于领域术语，出现即意味着“未翻译的英文句子”
//
// 剥离规则遵循 .skills/translate-skill/SKILL.md 的 coverage：frontmatter、fenced code、
// inline code、图片、链接 URL（保留链接文字）、裸 URL、文件路径、slash command、skill names。
//
// 用法：
//   node scripts/audit-coverage.mjs [--top 25] [--min-freq 10]
//
// 与 scripts/audit-english.mjs 的关系：audit-english 逐行找“疑似整句英文”；本脚本从“术语 + 词频”
// 角度给出覆盖画像。两者都是 review flag，不阻断流程。

import fs from "node:fs";
import { execSync } from "node:child_process";

// ---- parse args ----
const argv = process.argv.slice(2);
function argOf(flag, dflt) {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : dflt;
}
const TOP = argOf("--top", 25);
const MIN_FREQ = argOf("--min-freq", 10);

// ---- in-scope tracked .md files ----
const files = execSync("git ls-files '*.md'", { encoding: "utf8" })
  .trim().split("\n")
  .filter((f) => f && fs.existsSync(f))
  .filter((f) => !f.startsWith(".claude/worktrees/"))
  .filter((f) => f.endsWith(".md") && f !== "LICENSE.zh-CN.md");

// skill names, to be stripped (they are preserved identifiers, not translatable prose)
const skillNames = execSync(
  "git ls-files 'skills/*/SKILL.md' '.skills/*/SKILL.md' '.agents/skills/*/SKILL.md'",
  { encoding: "utf8" }
).trim().split("\n").filter(Boolean).map((p) => p.split("/").slice(-2)[0]);

// pure grammatical function words -> their presence marks untranslated English prose
const FUNC = new Set(["the","and","of","to","in","for","with","on","at","by","from","this","that","these","those","it","its","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","should","could","can","may","might","must","not","no","so","but","or","nor","if","when","where","which","who","whom","whose","what","how","why","then","than","there","here","as","all","any","both","each","few","more","most","other","some","such","only","own","same","into","onto","upon","within","without","about","between","under","over","after","before","during"]);

// ---- stripping helpers (per translate-skill "preserve exactly") ----
const stripFrontmatter = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, "");
const stripCodeFences = (t) => t.replace(/```[\s\S]*?```/g, " ");
const stripInlineCode = (t) => t.replace(/`[^`\n]*`/g, " ");
const stripImages = (t) => t.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
const stripLinkUrls = (t) => t.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // keep link text
const stripBareUrls = (t) => t.replace(/https?:\/\/\S+/g, " ");
const stripSlashCmds = (t) => t.replace(/\/[a-z][a-z0-9-]*/gi, " ");
const stripFilePaths = (t) =>
  t
    .replace(/[\w.@/-]+\.(md|json|ya?ml|js|mjs|cjs|ts|tsx|sh|html|png|jpg|jpeg|svg)\b/gi, " ")
    .replace(/\b[\w.-]+\/[\w./-]+\b/g, " ");

const isIntentionallyEnglish = (f) => f.startsWith(".skills/translate-skill");

const tokenFreq = new Map();
const tokenFiles = new Map();
const funcFreq = new Map();
const perFile = new Map(); // file -> {func, content, total}

for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  text = stripFrontmatter(text);
  text = stripCodeFences(text);
  text = stripInlineCode(text);
  text = stripImages(text);
  text = stripLinkUrls(text);
  text = stripBareUrls(text);
  text = stripFilePaths(text);
  text = stripSlashCmds(text);
  for (const n of skillNames) {
    text = text.replace(new RegExp("\\b" + n.replace(/[-/]/g, "\\$&") + "\\b", "g"), " ");
  }

  const tokens = text.match(/[A-Za-z][A-Za-z'-]*[A-Za-z]|[A-Za-z]{2}/g) || [];
  let func = 0, content = 0;
  for (const t0 of tokens) {
    const t = t0.toLowerCase();
    if (t.length < 3) continue;
    if (FUNC.has(t)) {
      func++;
      funcFreq.set(t, (funcFreq.get(t) || 0) + 1);
    } else {
      content++;
      tokenFreq.set(t, (tokenFreq.get(t) || 0) + 1);
      if (!tokenFiles.has(t)) tokenFiles.set(t, new Set());
      tokenFiles.get(t).add(file);
    }
  }
  perFile.set(file, { func, content, total: func + content });
}

const funcLocalized = [...perFile.entries()]
  .filter(([f]) => !isIntentionallyEnglish(f))
  .reduce((s, [, { func }]) => s + func, 0);

console.log("# 翻译覆盖审计（advisory）");
console.log(`\n分析文件数: ${files.length}`);
console.log(`正文英文内容 token 总数: ${[...perFile.values()].reduce((s, x) => s + x.content, 0)}`);
console.log(`未翻译英文句子指标（function words，本地化内容，不含刻意英文的 translate-skill）: ${funcLocalized}`);

console.log(`\n## 高频英文术语（freq ≥ ${MIN_FREQ}）— 术语表扩表候选`);
[...tokenFreq.entries()]
  .sort((a, b) => b[1] - a[1])
  .filter(([, c]) => c >= MIN_FREQ)
  .slice(0, 120)
  .forEach(([t, c]) => console.log(`  ${String(c).padStart(5)}  ${t.padEnd(28)} [${tokenFiles.get(t).size} 文件]`));

console.log(`\n## function-word 残留（freq ≥ 2）— 未翻译英文句子指标`);
[...funcFreq.entries()]
  .sort((a, b) => b[1] - a[1])
  .filter(([, c]) => c >= 2)
  .forEach(([t, c]) => console.log(`  ${String(c).padStart(5)}  ${t}`));

console.log(`\n## 未翻译英文最集中的文件（top ${TOP}，按 function-word 数）`);
console.log("func# | func% | 文件");
[...perFile.entries()]
  .sort((a, b) => b[1].func - a[1].func)
  .slice(0, TOP)
  .forEach(([f, { func, total }]) => {
    const tag = isIntentionallyEnglish(f) ? "  [刻意英文]" : "";
    const pct = total ? Math.round((func / total) * 100) : 0;
    console.log(`${String(func).padStart(5)} | ${String(pct).padStart(3)}% | ${f}${tag}`);
  });

console.log("\n说明：本脚本仅输出 review 信息，始终以退出码 0 结束，不阻断 CI。");
