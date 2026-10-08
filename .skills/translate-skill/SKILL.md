---
name: translate-skill
description: 将 mattpocock/skills 的内容翻译、刷新或复核到简体中文本地化仓库 vinvcn/mattpocock-skills-zh-CN 时使用这个项目级 skill。适用于 skill files、README content、CLAUDE.md、GLOSSARY.md、docs，以及其他需要保留行为关键 identifiers 的上游用户可见内容。
---

# 翻译 skill

使用这个 skill 把上游 `mattpocock/skills` 的内容翻译成简体中文，用于 `vinvcn/mattpocock-skills-zh-CN`。

这个 skill 用于**内容本地化**，不是 Git 同步。

## 操作原则

把用户可见的英文说明性文字翻译成自然的简体中文，同时原样保留所有行为关键内容。

目标仓库是一个独立的简体中文本地化版本。它应接收翻译后的内容，而不是上游的仓库元数据。

## 翻译哪些内容

翻译自然语言文本，包括：

```text
README 说明
skill instructions
skill descriptions
用户可见的 frontmatter prompts
面向 agent 的指引
面向维护者的指引
docs 说明性文字
以说明性文字写成的示例
Markdown 标题（headings）
```

### Markdown 标题的翻译规则

标题是说明性文字，翻译成简体中文；标题层级与 Markdown 结构保持不变。标题内嵌的 inline code、identifiers 原样保留。

- docs 页面的固定 schema 标题（`What it does`、`When to reach for it`、`Common questions`、`It's working if`、`Where it fits`、`Prerequisites`）与 skill 文件的结构性标题（`Steps`、`Reference` 等）必须使用 `TRANSLATION-GLOSSARY.md` 登记的统一译法，保证所有页面一致。
- 其余标题按页面语境意译，无需逐一登记。
- 例外（作为术语保留英文，不译）：bucket 名（`Engineering`、`Productivity`、`Misc` 等，与目录名一致）；invocation 术语（`User-invoked`、`Model-invoked`）。
- 修改标题时，同步更新同一文件内指向该标题的 anchor links（GitHub 会按标题文本生成 slug，中文标题生成中文 anchor）。

## 原样保留哪些内容

不要翻译或改写：

```text
目录名
skill 名称
slash commands
CLI 命令
代码块
inline code
文件路径
package 名
tool identifiers
API identifiers
环境变量名
frontmatter keys
JSON/YAML/TOML keys
Markdown 链接 URL
行为关键 labels
```

保持 Markdown 结构、标题层级、列表嵌套、表格、链接目标、相对路径和 code fences 不变。

## 仓库路径本地化

翻译用户可见的安装示例时，把上游仓库路径：

```text
mattpocock/skills
```

替换为本地化仓库路径：

```text
vinvcn/mattpocock-skills-zh-CN
```

只有当命令或说明性文字是在告诉用户如何安装或使用本地化仓库时，才做这个替换。

不要移除对上游项目的署名。

## Frontmatter 规则

原样保留 frontmatter keys。

按含义而不仅是字段名，对每个 frontmatter 值分类：

- 保持 `name` 值不变。
- 把用户可见或面向 agent 的自然语言文本翻译成简体中文，包括 `description` 和 `argument-hint` 的值。
- 保持 identifiers、命令、路径、package 名、URL、工具名、布尔值、数字和其他有类型的配置值不变。
- 在可翻译的值内部，原样保留内嵌的 slash commands、inline code、占位符、路径、URL、package 名、工具名和其他行为关键片段。
- 对有歧义的值打复核标记，不要猜测。

示例：

```yaml
---
name: teach
description: 在这个工作区中教用户一个新技能或概念。
disable-model-invocation: true
argument-hint: "你想学习什么？"
---
```

## 翻译风格

使用满足以下要求的简体中文：

```text
自然
对开发者友好
简洁
准确
与本仓库现有语气一致
```

如果某个常见工程术语在开发者中是标准说法，或者翻译它会降低清晰度，就把它保留为英文。

## 术语参考

查阅仓库根目录的 `TRANSLATION-GLOSSARY.md`。

对已决定的术语，严格使用记录的译法。

## 术语决定与落地流程

术语的请求与认领流程见 `CONTRIBUTING.md`；译法以 `TRANSLATION-GLOSSARY.md` 为唯一权威。一次完整的落地流程：

1. 批准：维护者把术语登入术语表的「已决定的翻译」区并填「决定于」，请求行保留在请求区。
2. 落地：开分支，按已决定的译法替换仓库中的字面出现位置（大小写不敏感匹配），只改与该术语相关的出现位置；`dsh-plugin/skills/` 是构建产物（gitignored，由 `dsh-plugin/scripts/copy-skills.mjs` 从 `skills/` 生成），不要手改，源头修复后随插件构建自动同步。
3. 更新术语表：把请求行状态改为 `applied`（该状态在应用 PR 合并后生效），保留来源引用与历史行。
4. 提交 PR：按 `CONTRIBUTING.md` 的 PR 检查清单执行（先 `git add` 再运行脚本）；PR 描述链接术语表条目与相关 issue，除非明确要关闭该 issue，不要使用会自动关闭它的关键字。

## 单文件工作流

翻译单个文件时：

1. 确认文件路径和文件类型。
2. 把文件归类为可翻译的自然语言文本、混合内容、config/metadata 或不可翻译。
3. 翻译前先保护行为关键片段。
4. 只翻译自然语言文本。
5. 原样恢复被保护的片段。
6. 检查命令、代码块、路径、URL、identifiers 和 frontmatter keys 保持不变。
7. 检查本地化后的安装命令使用 `vinvcn/mattpocock-skills-zh-CN`。
8. 返回翻译后的文件内容或 patch，并附上所有复核标记。

## 仓库刷新工作流

从上游刷新时：

1. 把上游当作内容来源，而不是 Git 历史。
2. 找出新增、变更和移除的内容文件。
3. 翻译新增和变更的、含说明性文字的文件。
4. 仅当不可翻译的支持文件属于刷新范围时，才复制或保留。
5. 保持本地化仓库的 README 定位和安装路径不变。
6. 按“验证步骤”完成同步后的结构、完整性、索引和行为关键内容检查。
7. 在 README 同步记录中追加一条简短条目。
8. 在 README 中记录本次验证结果、翻译执行者和翻译策略摘要。
9. 把有歧义的文件、被移除的文件或有风险的转换打上复核标记，交维护者审查。
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

## SYNC.md 同步记录

每次上游刷新都应在顶层 `SYNC.md` 的同步记录中新增一条简短条目。

条目应包含：

- 刷新日期，使用 `YYYY-MM-DD` 格式
- 上游来源 revision，通常是 `mattpocock/skills@<short-sha>`
- 本地同步 commit（如果已存在）；否则先写一句简短的待定说明，commit 后再替换
- 一句话描述本次可见的内容变更

保持记录简短。

示例：

```text
- 2026-05-09：已同步上游 `mattpocock/skills@733d312`，本地 commit `c9fe120`。为 `prototype` 和 `in-progress` 内容新增了中文翻译，并刷新公开 skill 索引。
```

## 复核输出格式

复核一次翻译刷新时，提供：

```text
改动文件：
- ...

已翻译文件：
- ...

复制或保留文件：
- ...

移除或过时文件：
- ...

复核标记：
- ...

SYNC.md 同步记录：
- ...

验证结果:
- ...

不变量检查：
- 安装命令指向 vinvcn/mattpocock-skills-zh-CN
- 代码块保持原样
- frontmatter keys 保持原样
- 路径和 identifiers 保持原样
- Markdown 结构保持原样
```

## Fail-closed 规则

拿不准一段文本是否行为关键时，先原样保留并打上复核标记。

不要悄悄改写任何可能影响安装、skill 发现、命令执行、文件引用、API 调用、工具使用或 agent 行为的内容。
