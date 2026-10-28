## 它做什么

`retro` 回顾一场编码 [session](https://www.aihero.dev/ai-coding-dictionary/session)，并为改进 agent 的 **[environment](https://www.aihero.dev/ai-coding-dictionary/environment)** 提出建议，好让下一次运行更好。它读取 session 自己的记录（默认是当前这场，或你在 session logs 里指向的那一场）。它找出 agent 挣扎的那些时刻，并给你一份候选修复的清单，最严重的排最前。

它改变的是 environment，而不是代码。就拿 agent 交付的那个 bug、它需要二十次 [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) 才找到的那个文件、或 reviewer 漏掉的那条规则来说。`retro` 不会直接修复其中任何一个。它问的是这个 repo 里的什么让它们发生了，然后提出能在下次阻止它们的 check、pointer 或 standard。它也只提出建议。在你选中一个候选之前，什么都不会变。

## 何时使用

你通过输入 `/retro` 来调用它，agent 不会自行取用它。

在一场比它应有的更艰难的 session 结束时用它。比如，agent 找某个东西找了太久、犯了一个某个工具本可以抓住的错误、或者需要一种它得不到的信息。一场顺滑的 session 没什么可教的，findings 来自艰难的那些。如果你想要的是对这场 session 产出的代码的裁决，改用 [code-review](https://aihero.dev/skills-code-review)。

## 发现落到哪里

每个候选都属于一个类别，而类别决定修复落在哪里：

| session 里出了什么问题 | 用什么来修 |
| --- | --- |
| Agent 花了很久才找到一个文件或事实 | 一个来自它已经在读的文件的 **navigation pointer** |
| 它犯了一个某个工具本可以抓住的错误 | 一个 **[automated check](https://www.aihero.dev/ai-coding-dictionary/automated-check)**：lint rule、type、test、pre-commit hook、CI job |
| Reviewer 漏掉了一个需要判断的错误 | `CODING_STANDARDS.md` 里给 reviewer agent 的一条规则 |
| `AGENTS.md` 或 `CLAUDE.md` 很大 | 把它的 steering 移出去，移进 standards 或 checks |
| 一次 tool call 相对它的回报太贵 | 精简这个工具，或替换它 |
| 一份 steering file 里全是改变不了任何东西的行 | 删掉那些 **no-ops** |
| Agent 需要它够不到的信息 | 放宽它的访问：把 dev server 日志 tee 进一个文件，给某个服务只读访问 |

主导想法是：standards 属于 **reviewer**，而不是 implementer。实施的 agent 承受着最大的 context 压力，因为它要探索、写代码、调试失败。审查的 agent 拿到的只是一个 diff，别无其他。所以一条新规则要落在有空间应用它的地方，也就是 review 里。它永远不会进 [AGENTS.md](https://www.aihero.dev/ai-coding-dictionary/agents-md)，那个文件无论是否相关都会加载进每一场 session 的 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window)。

在 `retro` 写下任何规则之前，它会先对 violation 做归类。**机械性的** violation（一个被禁的 API、一种 import 形状、一条文件位置规则）会得到一个确定性 check，因为一个 check 可以失败，而 standards 文件里的一句话不能。只有真正的判断题，也就是 linter 无法强制执行的那些，才成为散文。如果 repo 完全没有任何护栏（没有 pre-commit hook，也没有跑 lint、typecheck 和 tests 的 CI job），`retro` 会把这一点当作一个独立的 finding 上报。

## 常见问题

**它自己写那条 lint rule，还是等一个同意？我能把它接在每场 session 之后运行吗？**

它等。`retro` 只提出建议。在你选中一个候选之前什么都不会变，所以它不手工编辑任何东西，也不自动安装任何 hook。这是刻意的。一位用户在"被那些挡住好变更的 auto-hooks 坑过"之后，要的正是这个。判断什么配得上一条永久的 check 需要判断力，所以这个 skill 保持 [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)，并且是 user-invoked 的。有些用户确实在每次实施之后运行它。但一场顺滑的 session 没什么可教，所以每场 session 之后都跑它，产出的大多是谁也不需要的规则。没有 dry-run 模式。一条被提出的 check 就是普通代码，所以在你让它挡住 merges 之前，先对着 repo 试它。

**这不会让 lint rules 永远堆积下去吗？它会建议删掉某条吗？**

部分会，而这正是它最薄弱的地方。它能移除的是散文：steering files 里的 no-ops，以及 `AGENTS.md` 或 `CLAUDE.md` 里本该属于 standards 或某个 check 的 steering。当这些文件很大时，它会把这些标记为待删除。它对照它所读的那唯一一场 session 来评判它们，所以要把每一条当作删除测试的候选，而不是裁决。它不会审计它上个月提出的 lint rules、hooks 或 CI jobs。它只看一场 session，所以它无法告诉你某条规则现在触发得太频繁、或它背后的那个 bug 已经不复存在。你仍然必须自己修剪 checks。一条在好代码上不停触发的规则就是该删掉它的信号。

**它不会为了填满类别而凭空发明泛泛的建议吗？**

这是它得到的最强烈的批评。一位用户发现"一旦工作完成，AI 就倾向于忘掉 session 中段的挣扎，发明泛泛的建议来满足 retro 的类别"。每个候选都必须来自 session 自己的记录，所以建议对那场 session 是具体的。这既有代价也有好处：它很少凭空发明不相关的东西，但它可能对这一场 session 碰巧涉及的东西赋予过多权重。丢弃任何你无法追溯到某个具体时刻的候选。把严重性排序也当作初稿，因为一个安静但昂贵的错误可能排在响亮而廉价的错误之下。

**我的 session 很长。现在跑，还是开个新的？**

默认它审查当前这场 session。这是最好的情形，因为那些挣扎还在 context window 里。如果 session 已经移出了 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)，就 [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) 掉，让一个全新的 `/retro` 指向 session logs 里的上一场 session。

**Agent 不断犯同一个错误。我应该往 `CLAUDE.md` 里加一行吗？**

通常不应该，而 `retro` 在这一点上推得比哪里都多。`CLAUDE.md` 里的一行会被加载进每一场 session，降低文件里其他一切的权重，并随着代码变更而过时。如果那个错误是机械性的，修复它的是一个会失败的 check。如果它是一道判断题，它进 reviewer 读的 coding standards。`AGENTS.md` 和 `CLAUDE.md` 是给 navigation pointers 的，几乎仅此而已。出于同样的原因，`retro` 不是一个 [memory system](https://www.aihero.dev/ai-coding-dictionary/memory-system)。它不存储发生过什么。它改变的是 environment，好让那个错误无法再次发生。

**我的配置提到了 `CODING_STANDARDS.md`，而我手上没有这个文件。它从哪来？**

没有任何 skill 随包发布这个文件。第一次有一场 session 为 reviewer 找到一条判断类规则时，`retro` 会提议创建它。在你接受之后，[code-review](https://aihero.dev/skills-code-review) 就会读取它。你已经维护的任何其他 standards 文档，比如 `CONTRIBUTING.md`，方式相同。

**它和 `improve-codebase-architecture` 有什么不同？**

输入不同。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 只需要代码，并寻找对代码的结构性改进。`retro` 需要一份 session 历史，改进的是 agent 工作于其中的 environment，而不是代码。两个你都会用到；谁也不取代谁。

## 它正常工作的标志

- 每个候选都指回 session 里的一个具体时刻，而不是一条泛泛的最佳实践。
- 重复的错误变成会失败的 checks，而你的 `AGENTS.md` 随时间变短而不是变长。
- 如果一个 check 早已存在但一直没有接上，finding 就是把它接上，而不是提议新建一个。
- 下一场同类任务的 session 更快找到它需要的东西。

## 它在整体中的位置

`retro` 是 main chain 的最后一步，你在这里回顾这条 chain 走得如何：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

在一场值得学习的 build 之后运行它，在同一个 session 里，或指向那场 session 的 log。一场顺滑的 build 之后就可以跳过它。

- [code-review](https://aihero.dev/skills-code-review) 是 `retro` 最常调音的那个 reviewer agent。新的 coding standards 落在它的 Standards 轴会读取的地方。
- [writing-for-agents](https://aihero.dev/skills-writing-for-agents) 为 `retro` 提出的每一份 steering file 和 skill 设定写作风格，而 `retro` 在开始之前会先加载它。

[ask-matt](https://aihero.dev/skills-ask-matt) 在你拿不准情境需要哪个 skill 时，在整个集合上为你路由。
