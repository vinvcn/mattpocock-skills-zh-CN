---
name: wayfinder
description: 把单个 agent session 装不下的一大块工作规划成 issue tracker 上的 decision tickets shared map，并逐一解决，直到通往 destination 的路清晰。
disable-model-invocation: true
---

一个松散想法出现了：它太大，单个 agent session 装不下，而且被 fog 包围；从这里到 **destination** 的路还看不见。Wayfinding 的目标是找到这条路，而不是朝 destination 猛冲。这个 skill 会把路径绘制成 repo issue tracker 上的 **shared map**，然后逐个处理 **decision tickets**——它们承载需要决策才能解决的问题，而不是要执行的 build slices——直到路线清晰。

不同 effort 的 destination 不同，而为它命名是 charting 的第一个动作；它塑造每个 ticket。它可能是一份要 hand off 并迭代的 spec、一个必须在 planning 前确定的 decision，或 data-structure migration 之类原地完成的 change。Map 与领域无关：engineering work、course content，或任何符合这个形状的事项都可以。

## Plan, don't do

Wayfinder 默认用于 **planning**：每个 ticket 解决一个 decision；当别人动手前已经没有任何事情需要决定、路径完全清晰时，map 才算完成。想直接做工作的冲动通常表示你已经到达 map 边缘，该 hand off 了。Effort 可以在 **Notes** 中覆盖这个默认值，把 execution 纳入 map；否则只产出 decisions，不产出 deliverables。

## Refer by name

每张 map 和每个 ticket 都是 issue，因此都有一个 **name**：它的 title。在所有给人看的内容里，包括叙述和 map 的 Decisions-so-far，都用 name 引用它，不要只写裸 id、number 或 slug。一堵 `#42, #43, #44` 很难读；name 一眼就能看懂。Id 和 URL 不会消失，它们被包在 name 的 link 里面，但不单独替代 name。

## The Map

Map 是这个 repo issue tracker 上一个带 `wayfinder:map` label 的单独 issue，是 canonical artifact。它的 tickets 是 map 的 child issues。

Map 是 **index**，不是 store。它列出已经做出的 decisions，并指向保存细节的 tickets；一个 decision 只存在一个地方，也就是它的 ticket。因此 map 不复述细节，只给 gist 和 link。

**Map、child tickets、blocking 和 frontier queries 的物理表达方式取决于 tracker。** Issue tracker 应该已经提供；如果没有，请让用户运行 `/setup-matt-pocock-skills`。查阅 tracker doc 的 "Wayfinding operations" section，了解这个 repo 如何表达它们。如果没有 tracker，默认使用 local-markdown tracker。

### The map body

Map 是低分辨率的全局视图，每个 session 加载一次。Open tickets 不列在里面；它们是 open child issues，通过 query 找到。

```markdown
## Destination

<what reaching the end of this map looks like — the spec, decision, or change this effort is finding its way to. One or two lines; every session orients to it before choosing a ticket.>

## Notes

<domain; skills every session should consult; standing preferences for this effort>

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [<closed ticket title>](link) — <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

### Tickets

每个 ticket 都是 map 的 **child issue**；tracker 的 issue id 是它的 identity。Body 是一个问题，大小控制在一个 100K token agent session 内：

```markdown
## Question

<the decision or investigation this ticket resolves>
```

每个 ticket 带一个 `wayfinder:<type>` label，取值为 `research`、`prototype`、`grilling`、`task`（见 [Ticket Types](#ticket-types)）。

Session **claim** ticket 的方式，是在任何工作开始前**先**把 ticket assign 给 driving map 的 dev，这样并发的 sessions 就会跳过它。这个 assignee 就是 claim：open 且 unassigned 的 ticket 才是 unclaimed。

Blocking 使用 tracker 的 **native** dependency relationship；这很重要，因为 tracker UI 会可视化 frontier，人类不用打开 map 也能看到哪些 ticket 可拿。只有 tracker 没有 native blocking 时，才退回 body convention。一个 ticket 的所有 blockers 都关闭后，它就是 **unblocked**；**frontier** 是 open、unblocked、unclaimed 的 children，也就是已知世界的边缘。

答案不写进 body，而是在 resolution 时记录（见 [Work through the map](#work-through-the-map)）。解决 ticket 时产生的 assets 从 issue 链接出去，不粘贴进 body。

## Ticket Types

每个 ticket 都是 **HITL**（human in the loop，与能代表自己发言的人类一起处理）或 **AFK**（agent 独立驱动）。HITL ticket 只能通过 live exchange 解决；agent 绝不能替人类回答。一旦 grilling agent 自问自答，它就已经坏了。

- **Research**（AFK）：阅读 documentation、third-party APIs，或 knowledge bases 等 local resources，找出某项 decision 正在等待的事实。交给调用 Skill 工具并指定 `research` 的 **subagent** 解决。当需要当前 working directory 外的知识时使用。
- **Prototype**（HITL）：通过 cheap、rough、concrete artifact 提高讨论 fidelity，例如 outline、rough take、stub，或通过调用 Skill 工具并指定 `prototype` 写 UI/logic code。Prototype 作为 asset 链接。当核心问题是 "how should it look" 或 "how should it behave" 时使用。
- **Grilling**（HITL）：Conversation。默认类型。始终调用两次 Skill 工具，分别指定 `grilling` 和 `domain-modeling`。
- **Task**（HITL 或 AFK）：做出 _decision_ 前必须完成、但本身没有要 decide、prototype 或 research 的 manual work。例如注册服务以评估其 API、配置访问权限、移动数据以看清 shape。这是唯一会 _do_ 而不是 decide 的类型；它凭借解锁 decision 而存在，而不是交付 destination。Agent 能独立完成时采用 AFK，否则给人类精确 checklist（HITL）。工作完成后 resolved；答案记录做了什么，以及后续 tickets 依赖的事实（credentials location、new URLs、row counts 等）。

## Fog of war

Map 是 _有意_ 不完整的：不要描绘你还看不见的东西。Tickets 之外是 fog：那些你能感觉到以后会来的 decisions 和 investigations，但它们悬在仍未解决的问题之上，暂时还无法钉住。解决一个 ticket 会清掉它前方的一片 fog，把现在已经能说明的问题升级成新的 tickets；一次一个，直到通向目标的路清楚且没有 tickets 剩下。

Map 的 **Not yet specified** section 用来记录这种朦胧视野：怀疑中的问题、之后要回访的区域。这里是通往 destination、尚未探索的 frontier；所有内容都在 scope 内，只是还不够清晰，无法成为 ticket。可以按视野允许的粗细来写；它也是协作者阅读这个 effort 走向时的路标。

**Fog or ticket?** 测试标准是你现在能不能把问题说清楚，而不是现在能不能回答它。

- **Ticket when** 问题已经清晰，即使它被 blocked、现在不能处理。
- **Not yet specified when** 你还不能把它说得那么清楚。不要把 fog 预先切成 ticket-sized pieces：fog 比 ticket 粗，frontier 到达后，一片 fog 可能升级成多个 tickets，也可能一个都没有。

**Not yet specified** 排除已经决定的内容（Decisions so far）、已经是 live ticket 的内容，以及 out of scope 的内容（下一节）。

## Out of scope

Fog 只会聚集在通往 destination 的方向。Destination 固定 scope，因此超出它的工作是 **out of scope**，不是 fog，也不属于 **Not yet specified**。它写进 map 单独的 **Out of scope** section：你有意识地排除在这个 effort 之外的工作。决定它属于这里的是 scope，而不是 sharpness。

Out-of-scope work 永远不会 graduate；frontier 会停在 destination。只有重画 destination 时它才会回来，而且应成为新的 effort，不是 resumption。

把某事排除出 scope 是 scoping act，不是 route 上的一步。如果已有 ticket 被发现位于 destination 之外——charting 时被错误地划入 scope，或被某次 resolution 暴露——应 **close it**（closed ticket 明确不在 frontier 上），并在 **Out of scope** section 中留一行：gist 加上它为何 out of scope，并链接到 closed ticket。不要把它放进 **Decisions so far**；后者只记录真正走过的路线——scope 边界不是路线上的一步。

## Invocation

两种模式。无论哪种，**每个 session 绝不要 resolve 超过一个 ticket**——research tickets 除外。

### Chart the map

用户带着松散想法调用。

1. **Name the destination.** 调用两次 Skill 工具，分别指定 `grilling` 和 `domain-modeling`，确定 map 要找到的 spec、decision 或 change。Destination 固定 scope，所以先解决它。
2. **Map the frontier.** 再 grill 一次，这次采用 **breadth-first**：覆盖整个空间，而不是深入一条 thread，浮现 open decisions 和现在可开始的 first steps。**如果没有 fog**，说明路径已经清晰，整个 journey 一个 session 就能完成，你不需要 map。停止并询问用户如何继续。
3. **Create the map**（label `wayfinder:map`）：填好 Destination 和 Notes，Decisions-so-far 为空，把 fog 勾勒进 **Not yet specified**。
4. **Create the tickets you can specify now** 作为 map 的 child issues，然后第二遍再 wire blocking edges（issues 需要 ids 后才能互相引用）。Wiring 会把它们分成 frontier 和 blocked；现在还说不清的都留在 **Not yet specified**。
5. **启动 research subagents。** 对刚创建的每个 `research` ticket，并行启动一个调用 Skill 工具并指定 `research` 的 subagent 解决它；findings 保存在一次性的 `research/<name>` branch，并从 ticket 留下 context pointer。
6. 停止。Charting 是一个 session 的工作；不要在这个 session 中手动 resolve tickets。

### Work through the map

用户用 map（URL 或 number）调用。Ticket 是 **optional**；没有 ticket 时，你选择下一个 decision，而不是用户选择。

1. 加载 **map**：低分辨率视图，而不是每个 ticket body。
2. 选择 ticket。用户点名就用它；否则按顺序拿第一个 frontier ticket。**Claim it**：任何工作开始前先 assign 给自己。
3. Resolve it：按需 **zoom**，只在需要时获取相关或已关闭 ticket 的完整 body；调用 `## Notes` block 提到的 skills。不确定时调用两次 Skill 工具，分别指定 `grilling` 和 `domain-modeling`。
4. 记录 resolution：把答案作为 **resolution comment** 发布，**close** issue，并向 map 的 Decisions-so-far 追加 context pointer。
5. 添加新浮现的 tickets（create-then-wire）；把答案已经说清的 fog graduate 成 ticket，并从 **Not yet specified** 清掉每个已升级 patch，让它只作为新 ticket 存在。如果答案表明这个或其他 ticket 位于 destination 之外，将其 **rule out of scope**，而不是当作路线的一部分解决。如果这个 decision 使 map 其他部分失效，更新或删除那些 tickets。

用户可能并行运行 unblocked tickets，所以要预期其他 sessions 同时编辑 tracker。
