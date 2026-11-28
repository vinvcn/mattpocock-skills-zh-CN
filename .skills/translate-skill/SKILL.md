---
name: translate-skill
description: 把 mattpocock/skills 的上游内容翻译、刷新或复核到简体中文本地化仓库 vinvcn/mattpocock-skills-zh-CN。覆盖 skill 文件、README、CLAUDE.md、GLOSSARY、docs 等用户可见内容，并原样保留行为关键的 identifiers、命令、路径与 frontmatter keys。当用户要求「翻译上游 skill / 刷新中文仓 / 同步 mattpocock / 复核本地化」时使用。不用于 Git 同步本身，也不用于把普通文档翻成中文。
---

# 上游 skill 的简体中文本地化

把英文原文变成自然中文，同时**一个字节都不动**行为关键内容。这是内容本地化，不是 Git 同步、不是重写。

## 何时使用 / 何时不用

- 使用：给 `vinvcn/mattpocock-skills-zh-CN` 翻新上游内容；改术语表并落地；复核一次刷新是否破坏结构。
- 不用：只做 `git pull/merge`；把任意英文文档（邮件、论文、README 之外）翻成中文；翻译游戏文本。

## 前提

1. 本地有本地化仓库工作区，记作 `[REPO_DIR]`（下面命令都在该目录执行）。
2. `node` 可用（仓库自带 `scripts/check-translation.mjs`、`scripts/audit-english.mjs`）。
3. 术语以 `[REPO_DIR]/TRANSLATION-GLOSSARY.md` 为唯一权威；流程见 `CONTRIBUTING.md`。
4. 缺任一项：先说明缺什么，不要凭记忆编术语译法。

## 步骤

### A. 翻译单个文件

1. 判断文件类型：纯说明性文本 / 混合 / config-metadata / 不可译。
2. 先把行为关键片段圈出来（命令、路径、URL、identifiers、frontmatter keys）。
3. 只翻自然语言，标题按 `references/rules.md` 的标题规则处理。
4. 恢复被圈出的片段，逐项核对没被改写。
5. 输出译文或 patch，并把所有歧义点标成复核标记。

### B. 仓库刷新（上游 → 本地化仓）

1. 把上游当内容来源，不当 Git 历史。
2. 列出新增 / 变更 / 移除的文件。
3. 翻新增与变更里含说明性文字的文件。
4. 只复制属于本次范围的不可译支持文件。
5. 保持 README 定位与安装路径不变。
6. 跑「判据」全部检查。
7. 在 `SYNC.md` 追加一条同步记录（日期 + 上游 short SHA + 本地 commit + 一句话变更）。
8. 把验证结果写进顶层 `README.md` 的简短 checklist。
9. 有歧义、被移除或有风险的转换打复核标记交给维护者。

细节与逐条说明见 `references/workflows.md`。

## 判据

```bash
# 1) 结构不变量：Markdown / frontmatter / README 安装路径 / license
node scripts/check-translation.mjs

# 2) diff 卫生（工作区与暂存区都要）
git diff --check ; git diff --cached --check

# 3) 英文残留只作复核队列，不作失败门槛
node scripts/audit-english.mjs
```

人工核对（必须，脚本覆盖不到）：

- 公开 skill 索引一致：`engineering/`、`productivity/`、`misc/` 的 skill 同时出现在顶层 `README.md` 与 `.claude-plugin/plugin.json`；`personal/`、`in-progress/`、`deprecated/` 不出现在公开索引；
- 与 `upstream/main` 的 in-scope 清单比对：无缺失、无过期残留；
- 安装命令指向 `vinvcn/mattpocock-skills-zh-CN`，无残留上游路径；
- `SYNC.md` 里的 short SHA 与本地 commit 已填实，无「待定」。

判据细节见 `references/validation.md`。

## 陷阱

| 现象 | 原因 | 处置 |
|---|---|---|
| 中文标题后页面内跳转失效 | GitHub 按标题文本生成 anchor，翻译标题即换 slug | 同文件内指向该标题的 anchor link 一起改 |
| 改了 `dsh-plugin/skills/` 却被下次构建覆盖 | 该目录是构建产物（gitignored） | 改 `skills/` 源头，等 `copy-skills.mjs` 重新生成 |
| `audit-english.mjs` 报一堆词 | 仓库里合法的英文术语、命令、示例都会被列出 | 只当复核队列，逐条判断，不当失败 |
| 同一术语三种译法 | 没查术语表就动手 | 以 `TRANSLATION-GLOSSARY.md` 为准，缺的先走术语请求流程 |
| 安装示例仍指上游仓库 | 只在正文改了路径，示例里的命令没改 | 全仓扫 `mattpocock/skills`，只替换「告诉用户怎么装本地化仓」的那些 |
| 结构检查过但索引不一致 | 只跑了脚本，没做公开索引人工核对 | 把索引一致性当成第 2 道门 |
| `SYNC.md` 留「待定」就交付 | commit 还没产生就写记录 | commit 后回填 short SHA，再提交 PR |

## Fail-closed

拿不准一段文本是否行为关键时：**原样保留 + 打复核标记**。不要悄悄改写任何可能影响安装、skill 发现、命令执行、文件引用、API 调用或 agent 行为的内容。

## 复核输出格式

```text
改动文件 / 已翻译 / 复制保留 / 移除过时 / 复核标记
SYNC.md 条目：
验证结果（check-translation · 索引一致性 · 上游清单 · diff 卫生）
不变量：安装命令 / 代码块 / frontmatter keys / 路径与 identifiers / Markdown 结构
```

## 参考索引

| 文件 | 内容 |
|---|---|
| `references/rules.md` | 翻译范围、标题规则、frontmatter 规则、风格、术语权威与歧义处理 |
| `references/workflows.md` | 术语落地四步、单文件 8 步、仓库刷新 10 步、`SYNC.md` 记录规范 |
| `references/validation.md` | 8 项验证的逐条说明、公开索引判定、常见失败与输出格式 |
