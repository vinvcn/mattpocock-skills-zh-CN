---
name: to-tickets
description: 把 plan、spec 或当前对话拆成一组 tracer-bullet tickets，每个 ticket 声明 blocking edges，并发布到已配置的 tracker；本地用每 ticket 一个文件中的文本 edge，真实 tracker 用 native blocking links。
disable-model-invocation: true
---

# To Tickets

把 plan、spec 或 conversation 拆成一组 **tickets**：tracer-bullet vertical slices，每个 ticket 都声明 **block** 它的 tickets。

Issue tracker 和 triage label vocabulary 应该已经提供；如果没有，请让用户运行 `/setup-matt-pocock-skills`。

## Process

### 1. Gather context

使用 conversation context 中已经存在的内容。如果用户把 reference（spec path、issue number 或 URL）作为参数传入，获取并完整读取其 body 和 comments。

### 2. Explore the codebase (optional)

如果还没有探索 codebase，先了解 code 当前状态。Ticket title 和 description 应使用项目 domain glossary vocabulary，并遵守相关 ADRs。

寻找 prefactor code、让 implementation 更容易的机会。“Make the change easy, then make the easy change.”

### 3. Draft vertical slices

把工作拆成 **tracer bullet** tickets。

<vertical-slice-rules>

- 每个 slice 都要贯穿每一层（schema、API、UI、tests）形成窄而完整的路径；必须是 vertical slice，不是某一层的 horizontal slice
- 完成的 slice 可独立 demo 或 verify
- 每个 slice 的大小必须能放进一个 fresh context window
- 任何 prefactoring 都应先完成

</vertical-slice-rules>

为每个 ticket 给出 **blocking edges**：它开始前必须完成的其他 tickets。没有 blockers 的 ticket 可以立即开始。

**Wide refactors 是 vertical slicing 的例外。** **Wide refactor** 是一个影响整个 codebase 的 mechanical change，例如 rename column 或 retype shared symbol；一次 edit 会破坏成千上万 call sites，无法让任何 vertical slice 独立保持 green。不要强行做成 tracer bullet；应按 **expand–contract** 排序。先 expand：在旧形式旁加入新形式，保持一切正常。再按 blast radius 分批迁移 call sites（按 package、directory 等），每批一个 ticket，并被 expand block；旧形式仍存在，因此 CI 每批都保持 green。最后 contract：一旦没有 caller 残留，就在被所有 migrate batches block 的 ticket 中删除旧形式。如果连单独 batches 也不能保持 green，仍保留这个 sequence，但让它们共享 integration branch，并全部 block 最后的 integrate-and-verify ticket；只在最后承诺 green。

### 4. Quiz the user

把建议的拆分作为 numbered list 展示。每个 ticket 包含：

- **Title**：简短的描述性名称
- **Blocked by**：必须先完成的其他 tickets（如有）
- **What it delivers**：这个 ticket 打通的 end-to-end behaviour

询问用户：

- Granularity 是否合适（太粗或太细）？
- Blocking edges 是否正确，每个 ticket 是否只依赖真正 gate 它的 tickets？
- 是否应继续合并或拆分 tickets？

迭代到用户批准拆分。

### 5. Publish the tickets to the configured tracker

发布已批准的 tickets。具体方式取决于 `/setup-matt-pocock-skills` 配置的 tracker；tickets 相同，只有 blocking edges 的形状不同：

- **Local files** → 在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下每 ticket 写一个文件，按 dependency order（blockers 优先）从 `01` 编号。每个文件的 “Blocked by” 列出它依赖的 number/title。使用下面的 per-ticket template；每个文件只放一个 ticket，绝不要写成一个 combined file。
- **真实 issue tracker（GitHub、Linear 等）** → 按 dependency order（blockers 优先）每 ticket 发布一个 issue，让 blocking edges 能引用真实 identifiers。平台支持时使用 native blocking/sub-issue relationship，否则把 blocking issues 写进每个 ticket 的 “Blocked by”。除非另有指示，应用 `ready-for-agent` triage label；这些 tickets 天生可被 agent 领取。

处理 **frontier**：所有 blockers 都完成的 tickets。纯 linear chain 就是从上到下。

不要 close 或 modify 任何 parent issue。

<local-ticket-template>

# <NN> — <Ticket title>

**What to build:** 这个 ticket 从用户视角打通的 end-to-end behaviour，而不是逐层 implementation list。

**Blocked by:** gate 这个 ticket 的 numbers/titles，或 “None — can start immediately”。

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

Tracker 上 parent issue 的 reference（如果来源是 existing issue；否则省略本 section）。

## What to build

这个 ticket 从用户视角打通的 end-to-end behaviour，而不是逐层 implementation。

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- 每个 blocking ticket 的 reference，或 “None — can start immediately”。

</issue-template>

无论哪种形式，都避免具体 file paths 或 code snippets；它们很快会过时。例外：如果 prototype 产出的 snippet 比 prose 更精确地编码了 decision（state machine、reducer、schema、type shape），可以内联，并简短说明来自 prototype。只保留 decision-rich parts，不要放 working demo。
