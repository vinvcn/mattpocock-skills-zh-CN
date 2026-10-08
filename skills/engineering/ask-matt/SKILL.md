---
name: ask-matt
description: 询问当前情境适合哪个技能或流程；它是本仓库所有 skills 的路由器。
disable-model-invocation: true
---

# 问 Matt

你不需要记住每个 skill，所以直接问。

**Flow** 是穿过 skills 的一条路径。大多数路径沿着一条 **main flow** 前进，两个 **on-ramps** 会并入它。其他内容要么是 standalone，要么是在下层运行的 vocabulary layer。

## 主流程：idea -> ship

这是大多数工作的路线：你有一个想法，并希望把它构建出来。

1. **`/grill-with-docs`** - 通过访谈打磨想法。在 **working directory** 中工作时从这里开始：它是 stateful 的，会把学到的内容保存在 `GLOSSARY.md` 和 ADRs 中。（没有 working directory？用 `/grill-me`，见「独立 skills」。两者都运行同一个 `/grilling` primitive；`grill-with-docs` 是会留下文档痕迹的版本，只要有 repo 可记录，它就是两者中更好的那个。）
2. **分支 - 能否在对话中解决所有问题？** 如果某个问题需要可运行的答案（state、business logic，或必须亲眼看到的 UI），就通过 prototype 绕行，并用 **`/handoff`** 在两个方向桥接（prototype 住在自己的目录里，这正是 `/handoff` 的用途，见「Phase 边界」）：
   - **`/handoff`** 导出，然后基于该文件打开 fresh session；
   - **`/prototype`** 用 throwaway code 回答问题；
   - **`/handoff`** 把学到的内容带回来，并在原始 idea thread 中引用它。
3. **分支 - 这是 multi-session build 吗？**
   - **是** -> **`/to-spec`**（把 thread 变成 spec），再用 **`/to-tickets`** 拆成 tracer-bullet tickets，每个 ticket 声明 **blocking edges**。然后从以下两种方式中选一种来推进这些 tickets：
     - 逐 ticket 运行 **`/implement`**，并在 tickets 之间用 **`/clear`** 清空 context。Local tracker 在 `.scratch/<feature>/issues/` 下每 ticket 一个文件，手动按 blockers-first 处理；真实 tracker 用 native blocking links，因此 blockers 已完成的 ticket 都可领取。每个 ticket 都是自包含的，因此最后一个 ticket 的 context 可以丢弃。
     - 用 **`/implement-spec`** 一次运行实现整份 spec。它把 tickets 读作 **task graph**，在 ready **frontier** 上并行运行 implementer subagents，并把全部成果落到一条 **integration branch** 上。当你更想编排这次 build、而不是亲自逐个驱动 ticket 时，就选它。
   - **否** -> 在当前 context window 里直接运行 **`/implement`**。

   无论哪种方式，代码都通过驱动 **`/tdd`** 来构建（一次一个 red-green slice），并用 **`/code-review`** 收尾，也就是对 diff 做 Standards + Spec 双轴 review。`/implement` 会在每个 ticket 上运行这两者；`/implement-spec` 的每个 implementer 各自驱动 `/tdd`，它再对 integration branch 运行一次 `/code-review`。只想在没有完整 spec 的情况下 test-first 构建一个具体 behavior 时，单独用 **`/tdd`**；想按固定点 review branch 或 PR 时，单独用 **`/code-review`**。

   当工作以 pull request 的形式提上去时，**`/pr`** 负责塑形 PR 正文：展示这次变更的最小 visual、证明它可用的 before/after 证据，再加上一次单向门还是双向门的判断。它是 model-invoked 的，所以 agent 每次写 PR 都会伸手用它。

4. **`/retro`** 闭合循环。一次 build 之后，尤其是一次走了弯路的 build，它会回看整个 session，建议改动 agent 的 **environment**，而不是代码：navigation pointers、automated checks、`/code-review` 强制执行的 coding standards、steering files、tooling。机械性错误变成 deterministic checks；judgement calls 变成 coding standards。下一次 build 由此从更好的 environment 出发。

### Context 卫生

步骤 1 到 `/to-tickets` 要留在 **同一个未中断的 context window** 中；不要 compact 或 clear，这样 grilling、spec 和 tickets 才能建立在同一组思考之上。之后每个 `/implement` 都从 fresh session 开始，只基于对应 ticket 工作。在 clear 之前，在被回看的那个 session 里运行 `/retro`；clear 之后，改为让它读取该 session 的 log。

限制来自 **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**：在该窗口（最新模型大约 150k tokens）内，模型还能保持敏锐推理。如果 session 在 `/to-tickets` 前接近这个区间，不要硬撑降级状态；在最近的 phase boundary 用 `/compact`，然后继续（见「Phase 边界」）。

## 入口匝道

起点会生成工作，然后并入 main flow。

- **Bugs 和 requests 堆积** -> **`/triage`**。它通过 triage roles 推进 issues，并产出 agent-ready issues，之后由 **`/implement`** 领取。

  Triage 只用于 **不是你创建的** issues：bug reports、incoming feature requests，以及任何原始进入的内容。`/to-tickets` 产出的 tickets 已经是 agent-ready，不要再 triage。

- **Something's broken** -> **`/diagnosing-bugs`**。用于难处理的问题：第一眼看不出的 bug、间歇性 flake、夹在两个 known-good states 之间的 regression。它在拥有 **tight feedback loop** 前拒绝空想，也就是一个已经能在 _这个_ bug 上变红的命令；然后用 regression test 修复。修复到位后，在同一个 session 里运行 **`/retro`**，追问什么本可以预防这个 bug；如果真正的发现是没有好 seam 能把 bug 锁住，那就是 **`/improve-codebase-architecture`** 的工作。

- **巨大而模糊的 effort：greenfield project 或巨大 feature build，一个 session 装不下** -> **`/wayfinder`**，这是这里认知负担最重的 flow。当从当前位置到 destination 的路还看不见时，它在 issue tracker 上绘制 **decision tickets** 的 **shared map**，逐个解决，产出 **decisions, not deliverables**，直到 fog 被推开、路径清晰。`/grill-with-docs` 用于一个 session 能装下的想法，wayfinder 用于装不下的想法；它更慢、更密集，所以只应留给确实如此的 effort，绝不要用于范围明确的 feature。

  Map 清晰后，**它会 hand off，而不是 build**：先进入 **`/to-spec`**，把 map 中相互链接的 decisions 收束成可构建计划，然后照常使用 `/to-tickets` 和 `/implement`。让 map 直接循环进入 `/implement` 会跳过这次收束并丢掉相互链接的细节；只有当 effort 后来发现确实很小时，才直接进入 `/implement`。

## Codebase 健康

这不是 feature work，而是维护。

- **`/improve-codebase-architecture`** - 有空时运行，保持 codebase 适合 agents 操作。它会暴露 **deepening opportunities**；选择其中一个会生成一个 idea，可以带入 main flow 的 `/grill-with-docs`。它负责找候选项；**`/codebase-design`**（见下文）是你设计已选候选项时使用的工作台。

## 底层词汇

两个 model-invoked references 在其他 skills 下层运行，分别是自己词汇的 single source of truth。问题在于**词语**而不是流程时直接用它们；也可以让上面的 skills 自动拉起它们。

- **`/domain-modeling`** - 打磨项目的 _domain_ language：挑战模糊术语、解决 overloaded word（例如一个 "account" 承担三件事）、把难以逆转的决策记录为 ADR。它是 `/grill-with-docs` 用来保持 `GLOSSARY.md` glossary 干净的主动纪律。
- **`/codebase-design`** - deep-module vocabulary（module、interface、depth、seam、adapter、leverage、locality），用于设计 module 的 _shape_：把大量 behavior 放在 clean seam 上的小 interface 后面。`/tdd` 和 `/improve-codebase-architecture` 都使用这套语言。

## Phase 边界

**phase** 是 session 内的一段工作：grilling、implementation、QA。在它们之间的 **boundary** 处你有五个选项，而在这整张 map 中，选哪个是最模糊的决定：

- **Continue** - 原地不动。不花成本，也不丢失任何东西。
- **`/clear`** - 清空 context window，当这里的内容对接下来什么都不重要时。
- **`/handoff`** - 写一个便携 markdown 文件。范围很窄：只用于 **new harness**、**new directory**、**colleague**，或在 **阶段中途** 分叉一个 side task。它买到的是 portability。
- **Subagent** - 把 tightly-scoped task 送到它自己的 context window，并拿回一份报告。
- **`/compact`** - 压缩这个 context，并用 summary 播种 fresh session。它是 **default**，位于树的底部，而不是最先伸手可及的地方。

关于有序的树，阅读 [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md)：五个问题、每个分支背后的推理，以及为什么 primary-source 成本让 **Continue** 成为第一个要排除的选项。**在** boundary 处做决定；阶段中途，要么继续，要么把剩余的工作拆成 subagents。

## 独立 skills

完全在 main flow 之外。

- **`/grill-me`** - 与 `/grill-with-docs` 一样的持续访谈，但 **stateless**：不在本地保存任何内容，也不构建 `GLOSSARY.md`。当你 **不在 working directory** 中工作时使用它：打磨一个计划、一个设计、一段文字，任何没有 repo 承载的东西。如果你在 working directory 中，改用 `/grill-with-docs`：它运行同样的访谈并留下文档痕迹，因此严格来说是更好的选择。
- **`/grilling`** - 访谈 primitive 本身：rounds、frontier，facts 是 agent 的工作，decisions 是你的。`/grill-me` 和 `/grill-with-docs` 是两个命名的入口，`/triage`、`/wayfinder` 和 `/improve-codebase-architecture` 都在内部运行它。只有在你想要不带任何 wrapper 的访谈时才直接使用它。
- **`/prototype`** - 一个小型 throwaway program，用来回答一个设计问题：这个 state model 感觉对吗，或者这个 UI 应该是什么样。Throwaway 是对代码编写方式的约束，而不是销毁它的承诺：答案会折进真实代码，prototype 本身则作为 **primary source** 保留在 main 之外的 `prototype/<name>` branch 上，并由 implementation issue 指向。它是 main flow 第 2 步的绕行，但任何难以纸面解决的 design question 都可以直接用它。
- **`/research`** - 把阅读工作委托给 **background agent**：它对照 **primary sources** 调研问题，然后在 repo 中留下带引用的 Markdown 文件。你可以在它阅读时继续工作。产物应带入 `/grill-with-docs` 的 main flow；research 提供思考材料，但不取代思考。
- **`/to-questionnaire`** - 当阻塞你的东西不在你的头脑或 codebase 里，而在 **别人的** 头脑里时，这个 skill 会写一份问卷让他们填写。它是 `/grill-me` 的反向：它不访问你关于 subject，而是访问你关于 **send**（发给谁、你需要拿回什么），并把问题对准 gap。拿回来的东西是 `/grill-with-docs` 或 `/to-spec` 的素材。
- **`/wizard`** - 用于只有 **human** 能完成的步骤：provisioning infrastructure、设置 credentials 或 CI secrets、在陌生的第三方 dashboard 中点击操作、运行一次性 migration 或 cutover。它生成一个交互式 bash script，打开每个 URL、捕获每个值，并写入 `.env` 和 GitHub secrets，这样该过程就不再需要你每次向 agent 重新解释。它是 model-invoked 的，所以 agent 一遇到只有你能通过的墙就会伸手够它。如果 agent 自己能做，它就应该自己做；这个 skill 用于 human 真正在 loop 中的场景。
- **`/wait-what`** - 对没有落地的消息的纠正。在对话中途、任何其他 skill 内部使用它，agent 会用你缺失的 context、以平实的语言、用 `GLOSSARY.md` vocabulary 重新表述它刚说的话。它事后生效；`/grill-with-docs` 是前置的解法，因为早早就共同约定的共享语言才是阻止 jargon 出现的根本。
- **`/teach`** - 使用当前目录作为 stateful workspace，跨多个 sessions 学习一个概念。
- **`/writing-for-agents`** - 编写 agents 消费的文档的 reference：skills、AGENTS.md、被指向的 docs。

## 前置条件

**`/setup-matt-pocock-skills`** - 第一次运行 engineering flow 前先执行，用来配置其他 skills 所依赖的 issue tracker、triage labels 和 docs layout。自定义 issue trackers 也可以。
