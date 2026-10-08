# Phase 边界

**phase** 是 session 内的一段工作：grilling、implementation、QA。这个定义刻意模糊：当你冒出 "行，这个做完了" 的想法时，一个 phase 就结束了。

**phase boundary** 是两个 phase 之间的间隙，也是这个决定唯一该出现的地方。phase 中途没有决定要做：要么继续，要么把剩余的工作拆成 subagents。在 phase 中途 compact 会让 agent 丢失线索。

## 五个选项

| 选项         | 作用                                                            |
| ------------ | --------------------------------------------------------------- |
| **Continue** | 留在当前 session。完全不做 context 切换。                         |
| **`/clear`** | 清空 context window，从零开始。                                   |
| **`/handoff`** | 写出一份可携带的 markdown 文件，用它随时随地 seed 一个新 session。 |
| **Subagent** | 把任务送进它自己的 context window，拿回一份报告。                  |
| **`/compact`** | 压缩当前 context，用 summary seed 一个新 session。                |

## 决策树

在 boundary 处从上到下工作。第一个 **yes** 胜出。

**1. 你能在这个 session 里继续吗？** 有两个条件让答案为 yes：下一 phase 需要当前 phase 作为 **primary source**，或者你还有足够的 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)（约 150k tokens）让下一 phase 装得下。Grilling -> implementation 是标准的 yes：implementation 想要的是逐字的推理过程，而不是它的 summary。Continue 不花成本也不丢任何东西，所以先排除它。

**2. 这个 context 对接下来要做的事无关紧要吗？** 这个 session 里的一切（探索、决定、死胡同）都可以丢弃吗？如果是，**`/clear`**。它是整张棋盘上最便宜的一步：不花时间，把整个 window 还给你。`/clear` 也不是终局：旧 session 仍然可以恢复。

选错这一步的代价是单向的。清掉一个 *relevant* 的 context，你就失去了你构建之物背后的 **why**，再怎么回读 diff 也要不回来。

**3. 你需要 hand off 吗？** `/handoff` 很窄。只有以下情况才需要它：

- 换到 **new harness**（Claude -> Codex），
- 移到 **new directory** 或 repo，
- 把工作交给 **colleague**，
- 或者在 **phase 中途** 分叉一个 side task，而不打乱你正在做的事。

这个列表就是全部条款。`/handoff` 买到的是 **portability**：一份能随行移动的文件。如果没有东西在移动，你就不需要它。

**4. 这个 task 能否 AFK 完成？** 它的 scope 是否足够紧，能在你离开键盘、不做任何 steering 的情况下运行？如果是，就把它发给 **subagent**，让这个 session 保持原样。自动化 review 是标准场景：agent 读 diff 并报告，期间不需要你。

**5. 否则，`/compact`。** Relevant context、同一 harness、同一 directory，而且你需要留在 loop 中：树的落点就在这里，而且经常落在这里。给它一条指令（`/compact we're going to QA this area`），让 summary 保留下一 phase 需要的东西。

`/compact` 是 **default，不是最先伸手可及的选择**。它位于树底，是因为上面四个问题的成本都更低或更精确。人们从这里开始时典型的 failure mode 是：一个 fresh session 对 summary 压扁过的决定自信地给出错误答案。

## 一手来源与二手来源

除了 **Continue**，每个动作都会把 **primary source** 变成 **secondary source**：以 summary 取而代之正在发生的 session。权衡的形状总是一样的：

| 来源                              | 信息量 | 噪音 | 回旋余地 |
| --------------------------------- | ----------- | ----- | ------------ |
| 一手（Continue）                  | 完整    | 很多  | 很小       |
| 二手（`/compact`、`/handoff`）     | 有损    | 较少  | 很多       |

这就是为什么问题 1 排在最前。只有留在原地比省下更多时，你才付 lossiness 的代价。

## 这些是主观判断

这些问题不是客观的：每个都掺着品味，同一个 boundary 昨天和今天可能走两个方向。价值在于**按顺序**、在 boundary 而不是工作中途提出它们。