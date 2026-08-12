# 翻译术语表（Translation Glossary）

本表是本仓库 recurring 术语**译法**的唯一事实来源：每个词要么统一译成指定中文，要么「保留英文」。翻译或刷新上游内容（见 [`.skills/translate-skill/SKILL.md`](./.skills/translate-skill/SKILL.md)）时对照本表，避免同一术语在不同文件里中英混用。

**默认规则**：开发者通用的工程 / 领域术语保留英文。本表把「该译的」和「该保留的」都显式列出，以消除不一致。

**与 `CONTEXT.md` 的关系**：`CONTEXT.md` 承载 issue / triage 领域的 ubiquitous language **定义**；本表承载全仓库术语的**译法裁决**。两者互补，不重叠——要理解一个 domain term 的含义，查 `CONTEXT.md`；要决定它怎么写（中 or 英），查本表。

**关于交叉链接**：`来源文档` 列指向每个术语的 canonical doc，为将来的 skill ↔ 术语表交叉链接留好落点；当前不改动任何 skill 文件（内联链接已推迟）。

> 约定：`统一译法 / 裁决` 列写「保留英文」表示正文保持英文原词；若某词在 `description:` 里有刻意的中文写法，会在 `说明` 列注明（正文与 `description:` 可分别保持一致）。

## 核心领域与流程术语

| 英文术语 | 统一译法 / 裁决 | 来源文档 | 避免（_Avoid_） | 说明 |
|---|---|---|---|---|
| branch | 保留英文 | `docs/productivity/grilling.md` | 分支 | 指 design tree 的分支；git 分支语境同样保留 `branch` |
| bucket | 保留英文 | `CLAUDE.md` | 桶、分类目录 | `skills/` 下的组织目录（engineering / productivity / misc 等） |
| decision | 保留英文 | `docs/productivity/grilling.md` | 决策 | design tree 中挂在其它 decision 下的决定；正文保留英文 |
| deep module | 保留英文 | `docs/engineering/codebase-design.md` | 深模块 | 小接口、承载复杂度的模块；`description:` 曾用「深模块」，正文保留英文 |
| deepening | 保留英文 | `docs/engineering/improve-codebase-architecture.md` | 深化 | 把 shallow module 变深的过程；`description:` 曾用「深化」 |
| design tree | 保留英文 | `docs/productivity/grilling.md` | 决策树、设计树 | grilling 对主题的建模：decision 下挂 decision |
| domain model | 保留英文 | `docs/engineering/domain-modeling.md` | 领域模型 | 项目的领域模型；`description:` 曾用「领域模型」，正文保留英文 |
| feedback loop | 保留英文 | `docs/engineering/diagnosing-bugs.md` | 反馈循环 | 对生成代码真实运行情况的反馈（types / tests / browser） |
| frontier | 保留英文 | `docs/productivity/grilling.md` | 前沿 | 前提已敲定、当前可问的 decision 集合 |
| grilling / grill | 保留英文 | `docs/productivity/grilling.md` | 追问、访谈、拷问 | 追问式访谈循环；`description:` 用「追问式访谈」，正文保留 `grilling`；作动词亦保留（如「grill 它」） |
| handoff | 保留英文 | `docs/productivity/handoff.md` | 交接 | 把对话压缩成交接文档；`description:` 曾用「交接」，正文保留 `handoff` |
| harness | 保留英文 | `docs/productivity/handoff.md` | 框架、宿主 | 运行 agent 的宿主环境（Claude Code / Codex 等） |
| issue | 保留英文 | `CONTEXT.md` | 工单、问题 | issue tracker 中被跟踪的工作单元；作 domain term 时首字母大写 `Issue` |
| issue tracker | 保留英文 | `CONTEXT.md` | backlog、工单系统 | 托管 repo issues 的工具（GitHub Issues / Linear / 本地文件） |
| marketplace | 保留英文 | `CLAUDE.md` | 市场 | Claude Code plugin marketplace |
| materialization | 保留英文 | `README.md` | 物化 | 「materialization cascade」示例中的术语，保持上游用法 |
| model-invoked / user-invoked | 保留英文 | `docs/invocation.md` | 模型调用、用户调用 | 按「谁能调用」区分的两类 skill |
| plugin | 保留英文 | `CLAUDE.md` | 插件 | Claude Code plugin |
| prototype | 保留英文 | `docs/engineering/prototype.md` | 原型 | 回答一个设计问题的一次性代码 |
| questionnaire | 保留英文 | `docs/productivity/to-questionnaire.md` | 问卷 | 交给掌握你所缺信息的人的 Markdown document |
| red-green-refactor | 保留英文 | `docs/engineering/tdd.md` | 红绿重构 | TDD 循环；颜色机制可说「变红 / 变绿」 |
| seam | 保留英文 | `docs/engineering/codebase-design.md` | 接缝 | 不编辑当前位置即可改变行为的地方（Michael Feathers） |
| session | 保留英文 | `docs/productivity/grilling.md` | 会话 | 一次 agent 会话 |
| shared language / ubiquitous language | 保留英文 | `docs/engineering/domain-modeling.md` | 共享语言、通用语言 | 帮 agent 解码项目术语的共享词汇 |
| skill | 保留英文 | `README.md` | 技能 | 本仓库的核心单元；`description:` 偶用「技能」，正文保留 `skill` |
| spec | 保留英文 | `docs/engineering/to-spec.md` | 规格、说明书 | `to-spec` 产出的规格 |
| sub-agent | 保留英文 | `docs/productivity/grilling.md` | 子代理、子智能体 | 被派去查明 fact 的 agent；统一连字符写法 `sub-agent` |
| test | 保留英文 | `docs/engineering/tdd.md` | 测试 | 指代码测试这一概念时保留 `test` / `tests`；「跑测试」这类口语表达可用中文 |
| ticket | 保留英文 | `docs/engineering/to-tickets.md` | 工单、票据 | `to-tickets` 产出的工作单元；仅在指外部系统或 Decision ticket 时使用 |
| tracer bullet | 保留英文 | `docs/engineering/to-tickets.md` | 曳光弹 | 穿过 change 每一层的窄而完整的路径 |
| triage | 保留英文 | `docs/engineering/triage.md` | 分诊、分检 | 通过 triage roles 推进 issues |
| vertical slice | 保留英文 | `docs/engineering/tdd.md` | 垂直切片 | 一个 seam、一个 test、一个最小实现 |

## 缩写与专名（一律保留英文）

这些是缩写、产品名、工具名、文件名或人名，保留英文，不要翻译。与 `scripts/audit-english.mjs` 的 allowlist 保持一致。

| 英文术语 | 统一译法 / 裁决 | 来源文档 | 避免（_Avoid_） | 说明 |
|---|---|---|---|---|
| ADR | 保留英文 | `docs/engineering/grill-with-docs.md` | 架构决策记录 | Architecture Decision Record，落盘到 `docs/adr/` |
| API | 保留英文 | — | 应用程序接口 | 工具 / API 标识 |
| CI / CD | 保留英文 | — | 持续集成 / 持续部署 | |
| CLI | 保留英文 | — | 命令行界面 | |
| Claude | 保留英文 | — | — | 产品名 |
| Codex | 保留英文 | — | — | 产品名 |
| DDD | 保留英文 | `docs/engineering/domain-modeling.md` | 领域驱动设计 | Domain-Driven Design |
| GitHub | 保留英文 | — | — | 产品名 |
| Husky | 保留英文 | — | — | 工具名 |
| LICENSE | 保留英文 | — | 许可证 | 文件名 |
| lint-staged | 保留英文 | — | — | 工具名 |
| Matt Pocock | 保留英文 | — | — | 人名（上游作者，保留署名） |
| MIT | 保留英文 | `LICENSE` | — | License 名 |
| mock | 保留英文 | `docs/engineering/tdd.md` | 模拟 | 测试中的 mock；作概念保留英文 |
| Obsidian | 保留英文 | — | — | 产品名 |
| Prettier | 保留英文 | — | — | 工具名 |
| PRD | 保留英文 | — | 产品需求文档 | Product Requirements Document |
| README | 保留英文 | — | 自述文件 | 文件名 |
| refactor | 保留英文 | `docs/engineering/tdd.md` | 重构 | 作概念保留 `refactor` / `refactoring`；「重构」在口语表达中可用 |
| SKILL | 保留英文 | — | — | 文件名 / 标识（`SKILL.md`） |
| TDD | 保留英文 | `docs/engineering/tdd.md` | 测试驱动开发 | Test-Driven Development |

## 维护

- 新增一个 recurring 术语、或发现同一术语出现多种译法时，先在本表登记裁决，再在翻译中使用。
- 本表是参考文档（advisory），不接入 `scripts/check-translation.mjs` / `audit-english.mjs` 做硬性校验；`audit-english.mjs` 仍只作为人工复核队列。
- 修正现有文件中已存在的不一致（按本表逐处对齐）是独立的后续一步，不包含在术语表本身内。
