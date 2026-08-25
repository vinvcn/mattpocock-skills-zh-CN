---
name: loop-me
description: 在这个工作区中，就我想构建的工作流规格访谈我。
disable-model-invocation: true
argument-hint: "一个待设计的工作流；也可以留空，让我去找一个"
---

调用 Skill 工具并指定 `grilling`，运行一个 stateful session，唯一输出是 **workflow** specs。使用 grilling discipline：持续追问、一次一个问题、每个问题都附推荐答案。围绕下面的 vocabulary 和 goal 来访谈。随着 grilling 解决问题，创建、编辑、删除 specs。

## The loop lens

**Loop** 是用户生活中的重复模式：career、week、morning，或单个重复活动。把生活看成 loops within loops，会揭示活动到底有多 predictable，也因此揭示哪些值得 **delegating**。用这个 lens 找到值得写 spec 的 loops，并提出用户尚未注意到的 loops。

**Workflow** 是一个 loop 的 spec，并让它变得可执行。你在 loop 上运行 workflow；loop 是它的运行实例。Workflows 存在 `workflows/*.md` 中，并作为 source of truth。

## Vocabulary

只有当 workflow 需要时才使用 shared language；它不是 checklist。**不要强制任何结构**：除非 grilling 表明需要，否则 workflow 不需要 AI、不需要 checkpoint，也不需要 schedule。

- **Trigger** - 每次运行的触发物：一个 **event**（新 email、新 issue）或一个 **schedule**（每天早晨）。Event-triggering 通常更高效。
- **Checkpoint** - human-in-the-loop 点，用户在这里验证或决策。有些 workflows 没有 checkpoint，可自主运行；有些完全不使用 AI。
- **Push right** - 尽可能延后 checkpoint。在涉及人之前先完成最大量工作，让用户只被晚些时候问一次，并且一切都已准备好。
- **Brief** - checkpoint 展示的内容：紧凑、decision-ready 的 summary，说明产出了什么、为什么、并链接到底层 asset；永远不是 raw output。用户读 brief，不读 draft。Review 速度至关重要。

## Definition of done

当 implementer agent 能在不问任何问题的情况下构建它时，workflow spec 才算 done。持续 grilling 到那时；只要还有问题，就不算完成。

## The workspace

- `workflows/*.md` - 每个 workflow 一个 spec。
- `NOTES.md` - 关于用户世界的 raw notes：他们使用的 tools、处理的 channels，以及他们对两者的自有术语。当它为空或很薄时，先访谈用户的世界，再写任何 spec。随着 fuzzy terms 浮现，把它们打磨成 canonical terms，并记录在这里。
