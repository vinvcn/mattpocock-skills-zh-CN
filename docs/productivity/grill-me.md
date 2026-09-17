## What it does

`grill-me` 拿一个**松散的想法**，持续访谈你，直到你能对它做出承诺。你不需要一份已经成型的工作计划才能开始——产出一份计划正是这个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 的用途。它以 **rounds** 来提问：每一 round 就是整条 **frontier**——所有那些前提你已经搞定的问题——所以你永远不会被问到某个还悬而未决的问题。

它是 **[stateless](https://www.aihero.dev/ai-coding-dictionary/stateless)** 的。它不写任何文件，也不留下任何 workspace。它唯一留下的，是你自己头脑中一个更清晰的、关于这个想法的版本。

## When to reach for it

你通过输入 `/grill-me` 来调用它——这个 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。请在一个**全新的对话**中开始它，而不是叠加在一个你已经让 agent 写好的计划之上。

当你有一个值得认真对待的想法——一个功能、一个产品方向、一个商业决定、一段文字——并且远在你把它想清楚之前，就用它。含糊不是等待的理由；它正是这个 session 要吃掉的东西。如果你已经能精确地表述这件事，那你就不需要 grill 它。

你想要三个 grilling skills 中的哪一个，取决于你面前的是什么：

- **Anything, anywhere** —— `grill-me`。它不需要 repo，也不写任何文件，而且主题不必与代码有关。
- **有一个要与之对齐的 codebase** —— [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。同样的访谈，但它是 [stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) 的：它读取你的代码，并把学到的东西保存在 `CONTEXT.md` 和 ADRs 里。
- **对单一 session 来说太大** —— [wayfinder](https://aihero.dev/skills-wayfinder)。它把 effort 绘制成一张 map，并在其内部运行 grilling sessions。

关闭 [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode)。Plan mode 会让 agent 倾向于赶着产出一份计划，而这与停留在追问中恰恰相反。

## It's a conversation, not an interview

这个 skill 负责提问，但 **scope 由你**掌握。这正是人们会忽略的部分，也是区分「把想法变成 decisions 的 session」和「产出自信的胡言乱语」的地方。

失败模式是**被动**——连续四十个问题都回答「同意、同意、同意」，最后得到一份 agent 写的、而你只是点头的计划。它之所以感觉富有成效，是因为它很长。实际上什么都没有决定，而结果带着一种它并未挣得的确定性。

主动意味着掌舵。当一个问题低于你所需的保真度时，就反驳回去。当 scope 正在漂移时，就指出来。回答「我不知道」，并且是认真的。这个 skill 是为了协助工程师，而不是取代工程师：产出的质量取决于你回答的质量，而不是问了多少个问题。

相反的错误是真实但罕见的——在访谈中停留太久，以至于永远到不了写代码那一步。

## Grillable and ungrillable

有些问题可以通过交谈来回答。另一些不行，而且无论你怎么 grill 都到不了那儿。

「一份长表单还是三页？」和「这个交互应该如何感觉？」是 **ungrillable** 的——它们需要某种可以回应的东西。当你遇到一个这样的问题，就停止 grilling。用 [prototype](https://aihero.dev/skills-prototype) 构建一个一次性版本，看看它，然后回来用一句话回答。

靠交谈硬磨一个 ungrillable 的问题，正是 session 膨胀的地方。agent 不断换说法，你不断猜，scope 也随着不确定性一起膨胀。

## It's working if

- 你对某件事表示不同意。一场没有你反驳的 session，是一场你本不需要的 session。
- 问题以几轮 rounds 的形式到来，而不是一条漫长的涓流，而且后面的 rounds 清楚地建立在你早先说过的话之上。
- 你最终到达了一个你没想到的地方，因为一个问题浮出了你一直在隐式做出的一个 decision。
- 到结束时，你能向一个不在场的人为每一个选择辩护。

## Common questions

**我应该预期多少问题，以及我怎么知道它何时结束？**
数 rounds，而不是数问题。四个 rounds 里四十六个问题是一个普通的 session。它在前沿为空时结束——每一个分支都被走过，没有任何东西被默默地当作理所当然。

**它问了我两百个问题。哪里出了问题？**
通常是因为 scope 太大了。先让 agent 把工作拆成更小的块，然后分别 grill 每一块。非常长的 session 也会漂进 **[dumb zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**，在那里 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 已经足够满，以至于问题变得更糟。

**我能回到一次只问一个问题吗？**
可以。把这段加到你的全局 `CLAUDE.md` 里：

```
When grilling, ask one question at a time.
```

**如果我确实不知道答案怎么办？**
就说出来。「我不知道」是一个真实的回答，而一个你答不上来的问题，通常说明应该去 prototype，而不是去猜。

**在写 spec 之前，我要开一个新的 session 吗？**
不。这个 session 的价值就在于你刚刚建立起来的 [context](https://www.aihero.dev/ai-coding-dictionary/context)。把同一段对话直接交给 [to-spec](https://aihero.dev/skills-to-spec)。

**模型重要吗？**
比大多数 skills 更重要。Grilling 依赖 [model](https://www.aihero.dev/ai-coding-dictionary/model) 自己对系统如何崩溃的直觉，所以给它你最好的模型。实施大多跟随 context，可以容忍更便宜的模型。

## Where it fits

`grill-me` 是一个**可以在任何地方、针对任何事物运行的 standalone**。stateless 正是让它可移植的原因：没有 repo、没有 workspace、没有配置，也不假设这个想法与软件有关。人们把它用于商业决定、用于写作、用于下一步要做什么——任何在他们头脑里无法安定的东西。

这种可移植性正是它与 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 的主要区别——后者运行同样的访谈，但会读取一个 codebase 来对齐，并把学到的东西记录为 `CONTEXT.md` 和 ADRs。两者都位于 [grilling](https://aihero.dev/skills-grilling) primitive 之上；`grill-me` 是不携带任何东西的 user-invoked 前门。

如果你 grill 的东西确实被证明是软件，你可以把同一段对话交给 [to-spec](https://aihero.dev/skills-to-spec)，继续进入 build flow——这是一个选项，而不是这个 skill 的重点。当你不确定哪条流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你引路。
