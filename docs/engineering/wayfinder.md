## 它做什么

`wayfinder` 接手一个对单个 agent [session](https://www.aihero.dev/ai-coding-dictionary/session) 来说太大的 effort。也就是一个你能说出其 **destination**、却还看不见路径的想法。Wayfinder 把它绘制成你 issue tracker 上的一张由 **decision tickets** 组成的共享 **map**，然后一次一个地解决这些 tickets，直到路径清晰。

它做 planning，不做构建。每个 ticket 都提出一个问题，其答案是一个 decision，而不是一块 build。当在有人去构建这东西之前再没有什么需要决定时，map 就完成了。这一条规则就是 wayfinder ticket 与普通实现 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 的区别，也是 agent 最常打破的规则。当 map 清除时，wayfinder 交接，不会继续进入代码。

## 何时使用

你通过输入 `/wayfinder` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。

它是整套流程中最重的一条，因此触发条件很窄。Effort 必须大于单个 agent session 所能容纳的范围，而且通往 destination 的路线必须不清晰。分工就看 session 数量：`/grill-with-docs` 用于单 session 规划，`/wayfinder` 用于多 session 规划。

| 你面前有什么 | 运行什么 |
| --- | --- |
| 一个范围明确、一次就能敲定的 feature | [grill-me](https://aihero.dev/skills-grill-me)，或当有 codebase 时用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一个 greenfield 项目，或一个跨越许多 session 的 build，路径仍不清晰 | `/wayfinder` |
| 一条该决定的事已经做完的 thread | [to-spec](https://aihero.dev/skills-to-spec)，直接跳过 map |
| 一张已清除的 wayfinder map | [to-spec](https://aihero.dev/skills-to-spec)，然后 [to-tickets](https://aihero.dev/skills-to-tickets) 和 [implement](https://aihero.dev/skills-implement) |
| 一个已经长到太大的现有 session | 说 "hand off to `/wayfinder`"，[handoff](https://aihero.dev/skills-handoff) 既架桥进入 map，也架桥离开 map |

Greenfield 不是必要条件。人们也常规地在 legacy 和半成品的 codebase 上使用 wayfinder，而且在那里它可以说更有用，因为很多 fog 是"这里已经成立的事实"，而不是"我们应该做什么"。

## 前置条件

Map 及其 tickets 位于 repo 的 issue tracker 上，因此 wayfinder 需要 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 提供的 tracker setup。该步骤会写入一个「Wayfinding 操作」小节。该小节描述如何在 GitHub、GitLab 或 local markdown 上表达 map、child tickets、blocking edges 和 frontier queries。Wayfinder 通过你 `CLAUDE.md` / `AGENTS.md` 中的 pointer 找到这份文档，而不是某个固定路径。如果完全没有配置 tracker，它就回退到 local markdown 文件。

Tracker 承担实际的工作。它的原生 blocking 链接让 frontier 呈现在 tracker 自己的 UI 里。在一个没有原生依赖链接的 tracker（比如自托管的 Gitea）上，wayfinder 会从 map 文本推断 blockers。这能用，但你必须更密切地监督它。

## Map、fog 与 frontier

**map** 是一个标记为 `wayfinder:map` 的单一 issue，它的 tickets 是它的 child issues。它是一个 **index, not a store**。一个 decision 恰好存在于一个地方（它的 ticket），map 只给出一行摘要和一个链接。一个 session 以低分辨率加载 map，需要时才打开各个 ticket。这让一个 map 可以不断增长，而不必让每个 session 加载它的全部历史。

map 有四个小节：

- **Destination.** 这张 map 尽头的样子。你最先命名它，在任何 ticket 存在之前，因为 destination 固定了你衡量每个 ticket 的 scope。
- **Decisions so far.** 每个已关闭 ticket 一行，各自带一个链接指向细节所在的地方。
- **Not yet specified.** 这就是 **fog of war**：你能看出即将到来、却还无法精确表述的 decisions。fog 与 ticket 的判别标准，是你现在能否*精确地说出*问题，而不是你能否回答它。你解决一个 ticket 时，它前方的 fog 会清除，现在可以明确说明的任何内容都会 graduate 成一个新的 ticket。
- **Out of scope.** 超出 destination 的工作。Fog 只*朝着* destination 聚集，因此 out-of-scope 的工作保持关闭，永不 graduate。

**Frontier** 是那些 open、unblocked、unclaimed 的 tickets 的集合（已知世界的边缘）。一个 session 在动手之前先把 ticket 分配给自己，从而认领它。Assignee *就是*认领，所以并发 session 会跳过那个 ticket。Sessions 以名字引用 tickets，绝不用一个光秃秃的 `#42`，因为一墙 issue 编号在叙述中难以阅读。

## 四种 decision ticket 类型

每个 ticket 都带一个 `wayfinder:<type>` label。每个 ticket 要么是 **[HITL](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)**（与一个为自己发声的人类一起完成），要么是 **[AFK](https://www.aihero.dev/ai-coding-dictionary/afk)**（由 agent 独自驱动）。一个 HITL ticket 只能通过 live exchange 解决。一个自答 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 问题的 agent 已经把它破坏了。

| Type | Mode | 何时使用 | 如何解决 |
| --- | --- | --- | --- |
| `grilling` | HITL | 默认。这个问题可以通过谈清楚来敲定。 | [grilling](https://aihero.dev/skills-grilling) 加上 [domain-modeling](https://aihero.dev/skills-domain-modeling)，在一个全新的 session 中 |
| `prototype` | HITL | "这应该长什么样"或"这该怎么表现"：一个谈话无法敲定的问题。 | [prototype](https://aihero.dev/skills-prototype)，ticket 里带一个链接指向构建出的 artifact |
| `research` | AFK | 工作目录之外的一个事实阻塞了一个 decision。 | 一个 [research](https://aihero.dev/skills-research) [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent)，在你 chart map 时启动，并在一个 `research/<name>` branch 上并行运行 |
| `task` | Either | 没有要决定的事，但手动工作阻塞了一个 decision（开通访问权限、注册一个服务、移动数据以便你能看清它的形状）。 | 能由 agent 独自完成的就独自完成，否则给人类一份精确的 checklist |

`task` 是唯一一种 *做* 而非 *决定* 的类型。它出现在 map 上，只因为解除了一个 decision 的阻塞，绝不是因为交付了 destination 的一部分。这也是实践中出错最多的类型。Agent 把它理解为实现步骤，开始在 map 里写产品代码。

Research 是 *每个 session 一个 ticket* 的唯一例外。

## 常见问题

**这和 `/grill-with-docs` 有什么不同？我应该先启动哪个？**
看 session 数量，而不是项目大小。`/grill-with-docs` 是单 session 规划；wayfinder 是多 session 规划。如果你能在一次 conversation 里装下整件事，grilling 更便宜也更好，而 wayfinder 在这种情况下更慢、更密。社区的简短共识是：只有当工作放不进单个 session 时，wayfinder 才有意义。这是 wayfinder 上被问得最多的问题，遥遥领先。人们一直问它，因为那两段 skill 描述并没有告诉你自己的任务在这条线上位于何处，你必须自己判断 session 数量。

**当它询问 "destination" 时，是指这次 session 的终点，还是所有事情的终点？**
整张 map 的终点，而不只是第一个 session。这个问题读起来很含糊，但 wayfinder 从定义上就是一个多 session 工具，所以 session 范围的答案永远没有意义。典型的 destination 包括一份要交接的 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、一个在规划开始前要锁定的 decision、一个 proof of concept，或像数据迁移那样的就地变更。

**map 已经清除了。为什么我还需要 `/to-spec` 和 `/to-tickets`，wayfinder 不是已经写了 spec 并生成了 tickets 吗？**
没有。Wayfinder 的 tickets 是 decision tickets，而到 map 关闭时它们也全部关闭了。剩下的是满满一张互相链接的 decisions，这不是 build plan。[to-spec](https://aihero.dev/skills-to-spec) 把这些链接的 decisions 折叠成一份 spec（`/to-spec #<map_issue>`），而 [to-tickets](https://aihero.dev/skills-to-tickets) 把那份 spec 切成 tracer-bullet 式的实现 tickets。如果把 map 直接循环进 [implement](https://aihero.dev/skills-implement)，你就跳过了折叠，丢掉了链接的细节。只有当 effort 结果真的很小的时候，才直接进入实现。确实有人跑更短的流程并报告它可行。多出的这两步为你换来一份 reviewer 或同事能读的明确 spec，你不是独自工作的时候，这一点就更重要。

**我的 agent 在 wayfinder session 中途开始写生产代码了。**
这是这个 skill 最常被报告的失败，背后是 skill 的一个真实缺口。你可以在 map 的 **Notes** 里覆盖 wayfinder 的 "plan, don't do" 默认。但 Notes 是 agent 写的，于是约束和它的豁免住在一个归受约束 agent 所有的文件里。一位用户看着 agent 把 "this map carries execution" 写进它自己的 Notes。在后续 session 里，agent 把那一行读回来当作许可，在线上服务器上继续构建。对于 "我是指默认值" 这种情况，skill 内部没有硬性的阻止。在那之前：对你没有亲自 chart 的任何 map，都要读它的 Notes；把实现放在分开的 session 里；把任何看起来像 build 切片的 `wayfinder:task` 当作打错了类型。

**我 chart 了 27 个 tickets，等我做到第十三个时，剩下的已经不再有意义了。**
这个问题出自一位用户的原话，其他人也报告过同样的结果。Wayfinder 默认会全面规划。当后面的 tickets 建立在前面 tickets 所推翻的假设之上时，map 就落入了批评者指责这个 skill 的 waterfall 陷阱。有两件事能帮上忙。第一，把 map 的范围限定在一个有边界的 destination，而不是整个产品。用户们报告，限定在单个明确 epic 上的 map 比一个铺开的 "implement V1" 表现更好。目标是分小步交付，而不是规划一个非常大的东西。第二，积极地 [prototype](https://www.aihero.dev/ai-coding-dictionary/prototyping)。路线之所以能保持实时，是因为廉价而具体的 artifact 在实现依赖它之前就把不确定性暴露了出来。Wayfinder 是 "prototypemaxxing"，不是 "planmaxxing"：把 prototype 拉满，而不是把 plan 拉满。

**我能同时处理几个 tickets 吗？**
Frontier 会向你展示哪些 tickets 可以领取，blocking edges 让并行工作在纸面上是安全的。但在实践中，一次一个 ticket 才是更安全的默认。如果你同时推进两个 grilling tickets，一个 session 可能会问你刚刚在另一个 session 里回答过的问题，因为这些 session 之间没有共享 [context](https://www.aihero.dev/ai-coding-dictionary/context)。Prototype tickets 也有一个已知缺口。一位用户报告说，agent 构建了三种 UI 变体，自己选了一个，然后关闭了 ticket。那个选择是你的，这个 skill 还没有把这一点说得足够清楚。如果你确实要并行推进 tickets，先自己审查一遍依赖图。

**我必须使用 GitHub Issues 吗？**
不，任何 issue tracker 都可以。GitHub 支持得最好，因为它的原生 sub-issues 和 blocking 关系让 frontier 无需打开 map 就可见。人们也使用 GitLab、Linear、Jira 和 local markdown。有两个告诫。在没有原生 blocking 的 tracker 上，wayfinder 从文本推断依赖图，你必须手动修正它。而 local markdown 会把 artifact 放进你的 repo，这并不推荐，因为存在 repo 里的材料容易意外留存。开源维护者遇到的是相反的问题（公开 tracker 被 agent 生成的规划 tickets 塞满），于是他们往往还是会选择 local markdown。

**grilling 太耗人了。每个问题都有三段那么长。**
这是对 wayfinder 最尖锐的未决抱怨，还没有人修复它。一位用户是这样拆解的：冗长本身就会导致 decision 疲劳，而长度掩盖了 agent *为什么*问这个问题，于是随着 map 增长，你失去了从 decision 到 decision 的链条。这种冗长看起来更像是当前这批 [models](https://www.aihero.dev/ai-coding-dictionary/model) 的属性，而不是 skill 的属性。用户们尝试两种缓解手段：使用更低的 [reasoning effort](https://www.aihero.dev/ai-coding-dictionary/effort)，并在你的全局 `CLAUDE.md` 里放一条口语化的指令。无论如何都要准备好认真思考。Wayfinder 要求你投入大量思考，而那几乎就是它的目的所在，不是缺陷。

**一个我已经关闭的 decision 结果证明是错的。我是编辑旧 ticket，还是新建一个？**
没有官方指引，而 agent 的默认反应帮不上忙。它倾向于绕开那个坏 decision 去设计，而不是挑战它，所以你必须自己掌舵。真正有效的是直接告诉 wayfinder 什么变了。然后它会更新 map、修订受影响的 tickets，并在已关闭的 tickets 上留言。map 中途的 scope 变更是可以恢复的。但一张你*设计*成会变的 map，则说明 scope 定错了。

**`decision-mapping` 去哪了？**
它就是当前这个 skill。v1.1 把它改名为 `wayfinder`，并以 `/wayfinder` 调用。"Decision map" 是行话，而且也不准确，因为四种 ticket 类型里只有一种本身是 decision。新名字给了 skill 一套一致的词汇（destination、fog of war、frontier、map），而不是在顶上再叠一个生造的词。单位保留了 "decision" 这个词：wayfinder ticket 就叫 **decision ticket**，正是为了不让人把它读成实现 ticket。

## 它正常工作的标志

- 在任何一个 ticket 存在之前，destination 就已写下并达成一致。
- 每个 open ticket 读起来都是一个问题。任何读起来像 "build the X" 的 ticket，要么是打错了类型，要么属于 map 的下游。
- 无需打开 map，你就能看着 tracker 看出哪些 tickets 是可领取的，因为 native blocking 会显示 frontier。
- 一个 session 解决一个 ticket，把答案作为 resolution comment 贴出，关闭它，并在 map 的 *Decisions so far* 上添一行。然后它就停下来。
- **Not yet specified** 会随时间缩小。当一片 fog graduate 成 ticket 时，它会离开该小节，而不是同时出现在两个地方。
- 当开场的那次 breadth-first grill 完全没发现 fog 时，skill 会停下来，告诉你这个 effort 小到可以跳过 map。
- 完成 map 的那个 session 把你引向一份 spec，而不是一个 pull request。

## 它在整体中的位置

`wayfinder` 是一个 **situational on-ramp**，而不是默认的起点。大多数工作仍然从以 grill 为起点的 idea → ship 链条开始。当 idea 大到无法装进一个 session 时，你才使用 wayfinder。它会在 [to-spec](https://aihero.dev/skills-to-spec) 处重新汇入那条链条，因为一张已清除的 map 是交接，而不是构建。

大部分工作发生在 wayfinder 所调度的其他 skills 里：[grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 解决默认的 ticket 类型，[prototype](https://aihero.dev/skills-prototype) 解决谈话解决不了的 tickets，而 [research](https://aihero.dev/skills-research) 以 subagent 运行，让它的阅读不会落进你的 session。[handoff](https://aihero.dev/skills-handoff) 负责把工作搬进搬出：从一个长到太大的 conversation 进入 map，或在 session 中途冒出支线任务时离开 map。至于其他一切，[ask-matt](https://aihero.dev/skills-ask-matt) 会在整套中为你引路。