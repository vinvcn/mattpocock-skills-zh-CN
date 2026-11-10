## 最新同步

`mattpocock/skills@d1478fc`（v1.3.2）于 2026-11-10

提醒：每次同步上游导致 `.claude-plugin/plugin.json` 版本变化时，要同步 bump
`dsh-plugin/package.json` 并按同名 tag 打 GitHub Release，`publish-dsh-plugin.yml`
workflow 会自动把 dsh 插件发布到 npm。

## 同步记录

- 2026-11-10：已同步 `mattpocock/skills@d1478fc`（v1.3.2）：8 个 skill 明确要求 subagent 使用全新的 context window，维护指南同步补充这一约定；Claude plugin 与 dsh-plugin 版本统一升级为 `1.3.2`，发布时通过同名 GitHub Release 自动发布 npm。采用 skill-guided content localization，由 Codex 执行翻译。维护 commit 待提交后回填。
- 2026-10-28：已同步 `mattpocock/skills@59db609`：新增 in-progress `chief-of-staff` skill；`setup-matt-pocock-skills` 落地 reachable repo 检查、tracker label 创建，GitHub tracker 换用 sub-issue 与 native blocking 新约定；`implement` 先 fetch 传入的 ticket reference 并复述标题；`grilling` 新增「yes 即接受推荐答案」措辞规则；28 个 docs 页面随上游 prose 重写刷新；`.out-of-scope/` 新增 6 条记录并新增顶层 `SCOPE.md` 译本；README 安装章节随上游重构，新增 Codex、Copilot、Gemini CLI 路线（安装路径已适配本仓库）。上游未发版（仍为 v1.3.1），plugin 版本无变化，dsh-plugin 无需 bump。维护 commit 为 `72f94d0`。
- 2026-10-08：已同步 `mattpocock/skills@24fe0ef`（v1.3.1）：`implement-spec`、`pr`、`retro` 从 in-progress 毕业至 engineering，移除 `resolving-merge-conflicts`，`CONTEXT.md`/`CONTEXT-MAP.md` 约定重命名为 `GLOSSARY.md`/`GLOSSARY-MAP.md`，并落地上游的 em-dash 清理与跨 skill 调用措辞修正；维护 commit 为 `f659bb3`，PR 为 [#40](https://github.com/vinvcn/mattpocock-skills-zh-CN/pull/40)。
- 2026-09-24：已同步 `mattpocock/skills@c55ee46`，新增 beta `pr` skill 的简体中文翻译；由 Codex 自动翻译并通过本地结构、行为不变量和 Markdown 检查，维护 commit 为 `d71a03d`。
- 2026-09-17：已同步 `mattpocock/skills@959a8e9` 对 `retro` 的 deterministic checks 指引，并补齐既有的 `Skills` 行为说明；由 Codex 自动翻译并通过本地结构、行为不变量和 Markdown 检查，维护 commit 为 `fb3bd36`。
- 2026-08-25：已同步 `mattpocock/skills@6654f6b` 的内容变化；由 Codex 自动翻译并通过本地结构、行为不变量和 Markdown 检查，维护 commit 为 `df042c8`，PR 为 [#29](https://github.com/vinvcn/mattpocock-skills-zh-CN/pull/29)。该工作使用 `/Users/hcc/projects/mattpocock-skills-zh-CN` 作为持久化维护副本。
