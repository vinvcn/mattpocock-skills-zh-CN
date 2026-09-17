# Codex 自动同步维护

本仓库是 `mattpocock/skills` 的简体中文内容下游。上游只提供英文内容；本地维护副本负责翻译自然语言，并保留本仓库的安装路径、中文 README、翻译检查和 plugin policy。

## 固定来源

- 维护副本：`/Users/hcc/projects/mattpocock-skills-zh-CN`
- 上游 remote：`https://github.com/mattpocock/skills.git`，本地名称为 `upstream`
- 用户安装来源：`https://github.com/vinvcn/mattpocock-skills-zh-CN`
- 同步状态：`.skills/upstream-sync.json`

不要把上游的 `.agents/`、`.changeset/`、release workflow、package metadata 或其他 repository-management state 直接复制进来。它们属于上游工程，不属于中文版内容下游。

## 一次同步

先确保 working tree clean，再运行：

```bash
node scripts/sync-upstream.mjs
```

脚本只负责 fetch、比较上游基线并列出新增、修改、删除和不导入的仓库管理文件。它不会覆盖中文文件，也不会把英文文件直接当作翻译结果。

Codex 随后按 [`.skills/translate-skill/SKILL.md`](../../.skills/translate-skill/SKILL.md) 处理 in-scope 文件：翻译自然语言，保留 skill names、frontmatter keys、命令、代码块、路径、URL、package/tool/API identifiers 和行为关键 labels。新增 beta skill 放在 `skills/in-progress/`，不要加入公开 plugin 或顶层 README。

完成翻译后运行：

```bash
node scripts/check-translation.mjs
node scripts/audit-english.mjs
git diff --check
```

确认结果后，更新 `.skills/upstream-sync.json` 的 `lastSyncedUpstreamCommit`、`lastSyncDate` 和 `lastLocalCommit`，再创建 `codex/sync-upstream-<short-sha>` 分支并提交。将分支推送到有权限的 fork，并向 `vinvcn/mattpocock-skills-zh-CN` 的 `main` 创建 PR；自动流程不直接修改目标仓库的 `main`，也不自动合并。

## 本地安装副本

维护仓库与插件缓存分离。不要直接把长期维护工作写进 `/Users/hcc/.codex/plugins/cache/`，因为插件管理器可能用新缓存覆盖它。需要更新全局本地安装时运行：

```bash
node scripts/install-local-skills.mjs
```

脚本会先备份 `/Users/hcc/.agents/skills`，只同步本仓库对应的 skill，保留其他个人 skills，并把 `.agents/.skill-lock.json` 的这些条目改为中文版维护副本的 `local` 来源。预览可用 `node scripts/install-local-skills.mjs --dry-run`。

当前 PR 流程使用 `HCC06/mattpocock-skills-zh-CN` fork，目标为 `vinvcn/mattpocock-skills-zh-CN`。如果未来更换 GitHub 账号或获得目标仓库直接写权限，只需调整 remote 和自动任务提示，不改变翻译流程。
