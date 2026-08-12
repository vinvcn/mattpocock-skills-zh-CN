---
name: translate-skill
description: 将 mattpocock/skills 的内容翻译、刷新或复核到简体中文本地化仓库 vinvcn/mattpocock-skills-zh-CN 时使用这个项目级 skill。适用于 skill files、README content、CLAUDE.md、CONTEXT.md、docs，以及其他需要保留行为关键 identifiers 的上游用户可见内容。
---

# Translate Skill

Use this skill to translate upstream `mattpocock/skills` content into Simplified Chinese for `vinvcn/mattpocock-skills-zh-CN`.

This skill is for **content localization**, not Git synchronization.

## Operating principle

Translate user-facing English prose into natural Simplified Chinese while preserving all behavior-critical content exactly.

The target repo is an independent Simplified Chinese localized edition. It should receive translated content, not upstream repository metadata.

## What to translate

Translate natural-language prose, including:

```text
README explanations
skill instructions
skill descriptions
user-facing frontmatter prompts
agent-facing guidance
maintainer-facing guidance
docs prose
examples that are written as prose
```

## What to preserve exactly

Do not translate or rewrite:

```text
directory names
skill names
slash commands
CLI commands
code blocks
inline code
file paths
package names
tool identifiers
API identifiers
environment variable names
frontmatter keys
JSON/YAML/TOML keys
Markdown link URLs
behavior-critical labels
```

Preserve Markdown structure, heading levels, list nesting, tables, link targets, relative paths, and code fences.

## Repository-path localization

When translating user-facing installation examples, replace the upstream repo path:

```text
mattpocock/skills
```

with the localized repo path:

```text
vinvcn/mattpocock-skills-zh-CN
```

Only make this replacement where the command or prose is telling users how to install or use the localized repo.

Do not remove attribution to the upstream project.

## Frontmatter rules

Preserve frontmatter keys exactly.

Classify each frontmatter value by meaning, not just by field name:

- Keep `name` values unchanged.
- Translate user-facing or agent-facing natural-language prose into Simplified Chinese. This
  includes `description` and `argument-hint` values.
- Keep identifiers, commands, paths, package names, URLs, tool names, booleans, numbers, and
  other typed configuration values unchanged.
- Within a translatable value, preserve embedded slash commands, inline code, placeholders,
  paths, URLs, package names, tool names, and other behavior-critical spans exactly.
- Flag ambiguous values rather than guessing.

Example:

```yaml
---
name: teach
description: 在这个工作区中教用户一个新技能或概念。
disable-model-invocation: true
argument-hint: "你想学习什么？"
---
```

## Translation style

Use Simplified Chinese that is:

```text
natural
developer-friendly
concise
accurate
consistent with existing repo tone
```

Keep common engineering terms in English when the English term is standard among developers or when translating it would reduce clarity.

The per-term ruling (keep English vs translate) for every recurring term is registered in the top-level [`TRANSLATE_GLOSSARY.md`](../../TRANSLATE_GLOSSARY.md). Before translating, consult it and render each term exactly as it rules, so the same term is never written differently across files. If you meet a recurring term the glossary does not yet cover, keep the keep-English default and flag it so it can be registered.

## Workflow for a single file

When translating one file:

1. Identify the file path and file type.
2. Classify the file as translatable prose, mixed content, config/metadata, or non-translatable.
3. Protect behavior-critical spans before translation.
4. Translate only natural-language prose.
5. Restore protected spans exactly.
6. Check that commands, code blocks, paths, URLs, identifiers, and frontmatter keys are unchanged.
7. Check that localized install commands use `vinvcn/mattpocock-skills-zh-CN`.
8. Return the translated file content or a patch, plus any review flags.

## Workflow for a repo refresh

When refreshing from upstream:

1. Treat upstream as a content source, not as Git history.
2. Identify new, changed, and removed content files.
3. Translate new and changed prose-bearing files.
4. Copy or preserve non-translatable support files only when they are in scope.
5. Preserve the localized repo’s README positioning and install path.
6. 按“验证步骤”完成同步后的结构、完整性、索引和行为关键内容检查。
7. Add a concise entry to the README sync log.
8. 在 README 中记录本次验证结果、翻译执行者和翻译策略摘要。
9. Flag ambiguous files, removed files, or risky transformations for maintainer review.
10. 总结已翻译文件、复制或保留文件、移除文件、跳过文件、验证结果和复核标记。

## 验证步骤

每次上游内容刷新后，必须完成并记录以下检查：

1. 运行 `node scripts/check-translation.mjs`，确认 Markdown 结构、frontmatter、README install path 和 license invariant 没被破坏。
2. 检查公开 skill 索引一致性：`engineering/`、`productivity/`、`misc/` 下的 skills 必须同时出现在顶层 `README.md` 和 `.claude-plugin/plugin.json`；`personal/`、`in-progress/`、`deprecated/` 不应出现在 plugin 或顶层公开索引中。
3. 对比 `upstream/main` 的 in-scope 文件清单，确认没有缺失上游文件，也没有保留已经从上游移除且不属于本地策略的 stale files。
4. 检查共同 Markdown 文件的行为关键内容：frontmatter keys 和 `name` 值不变，fenced code blocks 平衡，路径、命令、URL、identifier 不被误改。
5. 运行 `git diff --check` 和 `git diff --cached --check`，确认没有 whitespace 或 patch hygiene 问题。
6. 检查 README 同步记录指向最新 upstream short SHA，并包含本地同步 commit；不能留下“待定”占位。
7. 扫描 stale install path 和旧路径，例如仍指向上游 repo 的安装命令、旧的中文仓库短路径、已移除的 triage skill 名、已移除的 domain-model 相对路径等。
8. 运行 `node scripts/audit-english.mjs` 作为人工复核队列。该脚本在本仓库会包含大量合理的英文术语、命令、示例和 identifiers，因此只作为 review flag，不作为硬性失败门槛。

验证结果应同步写入顶层 `README.md`，使用简短 checklist，不要把完整命令输出粘进去。

## README sync log

Each upstream refresh should update the top-level `README.md` sync log with one short entry.

The entry should include:

- the refresh date in `YYYY-MM-DD` format
- the upstream source revision, usually `mattpocock/skills@<short-sha>`
- the local sync commit, if it already exists; otherwise use a short pending note and replace it after commit
- a one-sentence description of the visible content change

Keep this record concise. Do not move the detailed translation workflow into the README; link to this skill instead.

Example:

```text
- 2026-05-09: Synced upstream `mattpocock/skills@733d312`, local commit `c9fe120`. Added Chinese translations for `prototype` and `in-progress` content, and refreshed public skill indexes.
```

## Required output format for review

When reviewing a translation refresh, provide:

```text
Changed files:
- ...

Translated files:
- ...

Copied or preserved files:
- ...

Removed or stale files:
- ...

Review flags:
- ...

README sync log:
- ...

验证结果:
- ...

Invariant checks:
- install commands point to vinvcn/mattpocock-skills-zh-CN
- code blocks preserved
- frontmatter keys preserved
- paths and identifiers preserved
- Markdown structure preserved
```

## Fail-closed rule

When unsure whether text is behavior-critical, preserve it and flag it.

Do not silently rewrite anything that could affect installation, skill discovery, command execution, file references, API calls, tool use, or agent behavior.
