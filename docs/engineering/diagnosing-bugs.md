## What it does

`diagnosing-bugs` 对难啃的 bug 或性能回退运行一个六 phase 的诊断：构建一个 repro，把它最小化，对 hypotheses 排序、instrument，带着 regression test 修复，清理。

在一条 **tight** feedback loop 存在之前（一条已经运行过一次的、在*这个* bug 上变红、修复后就变绿的具名命令），它不允许 agent 形成理论。一个接到 bug report 的 coding agent 的默认行为是读代码然后猜测；这个 skill 阻止它。如果不存在能变红的命令，就没有 Phase 2。这唯一一道闸门就是这个 skill 存在的意义。它之后的一切（bisection、hypothesis-testing、instrumentation）一旦信号存在就都是机械操作。

## When to reach for it

输入 `/diagnosing-bugs`，或者当任务契合时由 agent 自行调用：它是 model-invoked 的，会在 "diagnose" / "debug this" 时触发，或者在关于某样东西 broken、throwing、failing 或 slow 的报告时触发。

在那些难啃的问题上使用它：一眼看不出就抵抗的 bug、间歇性的 flake、在两个 known-good states 之间悄悄潜入的 regression。它刻意沉重，对于你想一条消息就得到答案的问题，它是一个错误的工具。

| 你的处境 | 去哪里 |
| --- | --- |
| 一个你能描述为症状的具体缺陷 | 这个 skill |
| 一个已知 before-and-after 的慢 endpoint 或时间相关 regression | 这个 skill：它有一个 performance 分支（先量一个 baseline，再 bisect） |
| 「这个 codebase 的瓶颈在哪里？」（没有具体症状） | 不是这个 skill。它诊断一个已知失败，它不做 audit |
| 别人发来的未确认、未写好的原始 bug report | 先 [triage](https://aihero.dev/skills-triage) |
| 用来回答设计问题的用完即弃代码，而不是追查缺陷 | [prototype](https://aihero.dev/skills-prototype) |
| Test-first 构建一个有计划的 behavior | [tdd](https://aihero.dev/skills-tdd) |
| 在 bug 修复之后追问什么本可以阻止它 | [retro](https://aihero.dev/skills-retro)，在同一场 session 里运行 |
| 没有好的 seam 能锁住这个 bug | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)，由你自己启动 |

## The tight loop is the skill

Phase 1 获得了不成比例的精力，因为它是唯一难做的 phase。Skill 给出了一架构建 loop 的梯子，大致按偏好顺序：

1. 在触达 bug 的任何 seam 处的一条 failing test。
2. 针对运行中的 dev server 的 curl 或 HTTP script。
3. 带 fixture input 的 CLI invocation，对照一个 known-good snapshot 做 diff。
4. 在 DOM、console 或 network 上断言的 headless browser script。
5. 重放的 capture：一条保存的 request、payload 或 event log，在隔离中跑过这条 code path。
6. 一个用完即弃的 harness：系统的最小子集，一个函数调用。
7. 一个 property 或 fuzz loop，用于「时对时错的输出」。
8. 一个你能交给 `git bisect run` 的 bisection harness。
9. 一个 differential loop：相同 input，旧版本对新版本。
10. 一个 [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) bash script，最后手段。Skill 为此随附发布 `scripts/hitl-loop.template.sh`：agent 运行脚本，你在终端里跟随 prompts，而你的答案以可解析的输出返回。

*一条* loop 不是目标。**Tight** 才是：快（秒级）、确定（每次运行同样的裁决）、尖锐（断言你的确切症状，而不是「没崩溃」）、并且可无人值守地由 agent 运行。一个 30 秒的 flaky loop 几乎和没有一样糟。对于一个只是偶尔出现的 bug，目标不是一个干净的 repro，而是一个**更高的复现率**：循环触发、并行化、施加压力、注入 sleeps，直到 flake 率高到足以对其调试。

当它真的无法构建一条时，它被指示停下来并说明，列出它试过的东西，并向你要 [environment](https://www.aihero.dev/ai-coding-dictionary/environment) 访问权限、一个捕获的 artifact，或临时 instrumentation 的许可。它不应该照旧继续假设。

## The gates between phases

Phases 是闸门，不是清单。每一个都拒绝打开，直到某件具体的事为真。

| 闸门 | 必须为真 |
| --- | --- |
| 进入 Phase 2 | 一条具名命令，已经运行并粘贴了它的输出，能在*这个* bug 上变红 |
| 进入 Phase 3 | Repro 被复现*并*最小化，每一个剩余元素都是承重的 |
| 进入 Phase 4 | 存在 3–5 条排好序、可证伪的 hypotheses，每一条都陈述它的预测，且在任何一条被测试前展示给你 |
| 进入 Phase 5 | Probes 映射到一条具体的预测，一次一个变量，每条 debug log 都按 `[DEBUG-a4f2]` 风格打标签，这样清理就是一次 grep |
| Done | 原始 repro 不再复现，instrumentation 已移除，而结果被证明正确的 hypothesis 被写进 commit message |

Phase 5 有一个值得知道的逃生舱。Regression test 在修复*之前*被写下来，但仅当存在一条对它**正确的 seam** 时：一条 test 能像在 call site 处发生的那样演练真实 bug 模式的 seam。在唯一可用的 seam 太浅的地方，skill 被指示说明这一点，而不是写一条给出虚假信心的 test。那种缺失本身就是那项 finding，而 skill 会把它记录下来，而不是把它掩盖过去。

## Common questions

**它在我只想要一个直接答案的快速问题上触发了。**
这是这个 skill 被报告最多的一个问题，而且是真的。特别是在 GPT-5.6-Sol 上，用户报告它在一个对问题的朴素描述上触发：「the model triggers the rather formal diagnosing-bugs skill instead. It then goes on to construct a reproduction scenario (often building a mock scenario with limited value) before giving me a response or suggestion. This results in considerable reply delays.」四个人在 [issue #578](https://github.com/mattpocock/skills/issues/578) 上报告了同样的形态。被接受的修复是以一个更轻的方法开始，只在问题值得时才升级到更重的那个，但那个变更尚未落地。Skill 是照 Claude Code 的调用行为校准的；一个激活阈值更低的 [model](https://www.aihero.dev/ai-coding-dictionary/model) 会过度触发它。在它被升级之前，实际的修复是说出你想要的（「just answer this, don't diagnose」），或者在你的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 里为它禁用 model invocation。

**我能把它指向一个 codebase，问性能问题在哪里吗？**
不能。它诊断一个你已经能叫出名字的失败。它的 performance 分支是为带症状的 regression 准备的（先建立一个 baseline measurement，然后 bisect，先量再修），不是为主动的 sweep。主动版本的 skill 曾被 [提议并关闭](https://github.com/mattpocock/skills/issues/431)；目前没有针对它的 skill。

**它会在写修复之前停下问我吗？**
不会。只有 Phase 3 有一个人工 checkpoint：排好序的 hypothesis 列表在任何一条被测试前展示给你，而如果你不在场，它会按自己的排序继续。Instrumentation 和 fix 之间没有闸门，所以 agent 可以在你同意它的 root cause 之前就开始写代码。[Issue #124](https://github.com/mattpocock/skills/issues/124) 要求这样一道闸门，仍然开着。如果你想要它，在调用 skill 时说出来。

**我已经在这份 bug report 上跑了 `/triage`。这还是同一份工作吗？**
部分是，而两个 skill 都不承认这一点。正如一位读者所言：「Triage's step 3 is essentially a shallow, bounded instance of diagnosing-bugs Phase 1–2, but neither file mentions the other.」Triage 做一个有边界的「这真是一个 bug 吗，surface 是什么」pass；这个 skill 做彻底版本。先跑 triage 不是浪费（它的 verification 常常给你 Phase 1 的大部分原材料），但在这里要预期彻底重做它，并且预期没有交叉引用告诉你这一点。

**它粘贴的 repro 输出会泄漏 secrets 吗？**
可能会。Skill 要求 agent 粘贴 invocation 及其输出，并索取像 HAR files、log dumps 和 core dumps 这样的 artifacts。这些没有一个被指令消毒。[Issue #674](https://github.com/mattpocock/skills/issues/674) 恰恰提出了这一点（credentials、tokens、cookies 和个人数据搭着车进到一场 chat、一个 issue 或一个 PR），并提议一个 redaction guardrail。它开着、未实现。目前把 redaction 当作你的工作，尤其是当输出要去任何公开的地方之前。

**我的安全扫描器把这个 skill 标记为高风险。**
Snyk 标记它，而那个 flag 是误报。它是这套里唯一随附一个可执行 shell script（`hitl-loop.template.sh`）以及运行它、curl 一个 dev server 的指令的 skill。随附发布的 `.sh` 加上 run-it 指令再加上 outbound HTTP，足以绊倒一个静态扫描器。脚本本身大约 30 行 `read -r -p` prompts，用于暂停等待人工输入。扫描器评估的是能力表面，而不是一个被证明的 exploit。

**`/diagnose` 怎么了？**
在 v1.0.0 被改名为 `/diagnosing-bugs`。旧名字不再存在。任何你链接了 `/diagnose` 的东西（一个 wrapper skill、一条保存的 prompt）都需要更新。

## It's working if

- 它在提出任何一条理论*之前*就给你看一条命令和它的变红输出。如果理论先到，skill 就没有在运行。
- 它复现的失败是你报告的那个，而不是它在路上找到的邻近一个。
- 它在你开始猜测之前就缩小 repro，并能告诉你为什么每一个剩余部分都是承重的。
- 在任何一条被测试之前，你被展示一张排好序的 3–5 条 hypotheses 清单，每条都带着一个你能证伪的预测。
- 它加的每条 debug log 都带一个像 `[DEBUG-a4f2]` 这样的标签，而当它宣布完成时，对该标签的一次 grep 返回为空。
- Commit 或 PR message 点名哪条 hypothesis 是对的。
- 当它无法用一条 test 锁住 bug 时，它直白地说出来，而不是写一条浅的。

## Where it fits

`diagnosing-bugs` 是一个随时可调用的 standalone。你在某样东西坏掉的那一刻落入它，并在修复及其 regression test 就位时退出；它不持有状态，也不需要先前的设置。[ask-matt](https://aihero.dev/skills-ask-matt) 把「有东西坏了」路由到这里。

两个邻居要紧。[retro](https://aihero.dev/skills-retro) 排在它之后：一旦修复就位，就在同一场 session 里运行它，追问什么本可以阻止这个 bug，此时手里的信息比开始时更多。这个 skill 从不自行发起那一步，因为 `retro` 是 user-invoked 的。[triage](https://aihero.dev/skills-triage) 对来自别人的原始报告 bug 坐在它上游，并对同样的前两个 phases 做一个更浅的版本。