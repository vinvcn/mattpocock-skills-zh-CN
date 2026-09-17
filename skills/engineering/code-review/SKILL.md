---
name: code-review
description: "从固定点（commit、branch、tag 或 merge-base）开始，按 Standards（代码是否符合本仓库记录的编码标准？）和 Spec（代码是否符合来源 issue/spec 的要求？）两个轴线审查变更。两个审查会在并行子代理中运行，并并排报告。适用于用户想审查 branch、PR、进行中的变更，或要求“review since X”时。"
---

对用户提供的 fixed point 与 `HEAD` 之间的 diff 做双轴 review：

- **Standards** — 代码是否符合这个 repo 记录下来的 coding standards？
- **Spec** — 代码是否忠实实现来源 issue / spec？

两个轴线都作为**并行 sub-agents**运行，避免互相污染 context；然后这个 skill 聚合它们的 findings。

Issue tracker 应该已经提供给你；如果缺少 `docs/agents/issue-tracker.md`，请让用户运行 `/setup-matt-pocock-skills`。

## Process

### 1. Pin the fixed point

用户说的任何内容都是 fixed point：commit SHA、branch name、tag、`main`、`HEAD~5` 等。如果用户没有指定，就询问。

先捕获一次 diff command：`git diff <fixed-point>...HEAD`（three-dot，因此比较对象是 merge-base）。同时用 `git log <fixed-point>..HEAD --oneline` 记录 commits 列表。

继续前，确认 fixed point 能解析（`git rev-parse <fixed-point>`），并且 diff 非空。错误 ref 或空 diff 应该在这里失败，而不是进入两个并行 sub-agents 后才失败。

### 2. Identify the spec source

按以下顺序寻找来源 spec：

1. Commit messages 中的 issue references（`#123`、`Closes #45`、GitLab `!67` 等）— 按 `docs/agents/issue-tracker.md` 中的 workflow 获取。
2. 用户作为 argument 传入的 path。
3. `docs/`、`specs/` 或 `.scratch/` 下与 branch name 或 feature 匹配的 spec 文件。
4. 如果什么都找不到，询问用户 spec 在哪里。如果用户说没有 spec，**Spec** sub-agent 跳过并报告 “no spec available”。

### 3. Identify the standards sources

Repo 中任何记录代码应该如何写的内容，例如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

在 repo 自己记录的 standards 之外，Standards 轴线始终带有下面的 **smell baseline**：一组固定的 Fowler code smells（_Refactoring_ 第 3 章），即使 repo 没有任何约定也适用。有两条规则：

- **The repo overrides.** 已记录的 repo standard 永远优先；如果它认可 baseline 会标记的东西，就压制该 smell。
- **Always a judgement call.** 每个 smell 都是带 label 的 heuristic（例如 "possible Feature Envy"），不是硬性违规；和这里的其他 standard 一样，跳过 tooling 已经强制检查的内容。

每个 smell 按 _what it is_ -> _how to fix_ 读取，并对照 diff：

- **Mysterious Name** — function、variable 或 type 的名称没有说明它做什么或装什么。-> rename it；如果找不到诚实名称，设计本身可能浑浊。
- **Duplicated Code** — 同一 logic shape 出现在多个 hunk 或 file 中。-> 抽出共享形状，让两边调用。
- **Feature Envy** — method 访问另一个 object 的 data 多于自己的 data。-> 把 method 移到它羡慕的数据上。
- **Data Clumps** — 同几组 fields 或 params 总是一起出现。-> 包成一个 type 来传。
- **Primitive Obsession** — primitive 或 string 代替了值得拥有自有 type 的 domain concept。-> 给该 concept 一个小 type。
- **Repeated Switches** — 对同一 type 的相同 `switch`/`if` cascade 在改动中重复。-> 换成 polymorphism，或共享一个 map。
- **Shotgun Surgery** — 一个 logical change 迫使 diff 分散修改很多文件。-> 把一起变化的东西收拢进一个 module。
- **Divergent Change** — 一个 file 或 module 因多个无关原因被修改。-> 拆分，让每个 module 只因一个原因变化。
- **Speculative Generality** — 为 spec 没有的需求增加 abstraction、params 或 hooks。-> 删除它，inline 回来，直到有真实需要。
- **Message Chains** — caller 不该依赖的长链式导航 `a.b().c().d()`。-> 把这段导航藏到第一个 object 的一个 method 后面。
- **Middle Man** — class 或 function 基本只是在继续委托。-> 删掉它，直接调用真实目标。
- **Refused Bequest** — subclass 或 implementer 忽略或 override 了继承来的大部分内容。-> 去掉 inheritance，使用 composition。

### 4. Spawn both sub-agents in parallel

**Standards sub-agent prompt** — 包含：

- 完整 diff command 和 commit list。
- Step 3 中找到的 standards-source files 列表，**以及 Step 3 的 smell baseline 全文**；sub-agent 没有其他方式读取它。
- Brief："Report — per file/hunk where relevant — (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls — documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** — 包含：

- Diff command 和 commit list。
- Spec 的 path 或已获取内容。
- Brief："Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

如果缺少 spec，跳过 Spec sub-agent，并在最终报告中说明。

### 5. Aggregate

在 `## Standards` 和 `## Spec` headings 下展示两个 reports，可原样或轻微清理。**不要**合并或重新排序 findings；这两个轴线刻意保持分离（见 _Why two axes_）。

最后用一行总结：每个轴线的 findings 总数，以及每个轴线内最严重的问题（如果有）。不要跨轴线选一个总冠军；分离就是为了避免这种 reranking。

## Why two axes

一个变更可能通过其中一个轴线，但失败在另一个轴线：

- 代码符合所有 standard，但实现了错误的东西 -> **Standards pass, Spec fail.**
- 代码完全符合 issue 要求，但破坏了项目约定 -> **Spec pass, Standards fail.**

分开报告能避免一个轴线掩盖另一个轴线。
