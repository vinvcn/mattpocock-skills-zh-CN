## 它做什么

`grill-me` 拿一个**松散的想法**，持续访谈你，直到你能对它做出承诺。你不需要一份已经成型的工作计划才能开始，因为这个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 的存在就是为了产出一份。它以 **rounds** 来提问。每一 round 就是整条 **frontier**，也就是所有那些前提你已经搞定的问题。所以它绝不会问你某个依赖它尚未听到的答案的问题。

它是 **[stateless](https://www.aihero.dev/ai-coding-dictionary/stateless)** 的。它不写任何文件，也不留下任何 workspace。唯一的结果，是你自己头脑中一个更清晰的、关于这个想法的版本。

## 何时使用

你通过输入 `/grill-me` 来调用它，这个 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。请在一个**全新的对话**中开始它，而不是叠加在一个你已经让 agent 写好的计划之上。

当你有一个值得认真对待的想法（一个功能、一个产品方向、一个商业决定、一段文字），并且远在你把它想清楚之前，就用它。含糊不是等待的理由，因为这个 session 的存在就是为了消除含糊。如果你已经能精确地表述这件事，那你就不需要 grill 它。

你想要三个 grilling skills 中的哪一个，取决于你面前的是什么：

- **Anything, anywhere**。用 `grill-me`。它不需要 repo，也不写任何文件，而且主题不必与代码有关。
- **有一个要与之对齐的 codebase**。用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。它是同样的访谈，但它是 [stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) 的：它读取你的代码，并把学到的东西保存在 `GLOSSARY.md` 和 ADRs 里。
- **对单一 session 来说太大**。用 [wayfinder](https://aihero.dev/skills-wayfinder)。它把 effort 绘制成一张 map，并在其内部运行 grilling sessions。

关闭 [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode)。Plan mode 会让 agent 急着产出一份计划，而你想要的是它继续提问。

## 这是一场对话，不是一场访谈

这个 skill 负责提问，但 **scope 由你**掌握。人们经常忽略这一点。它正是区分「把想法变成 decisions 的 session」和「产出自信的胡言乱语」的地方。

失败模式是**被动**：连续四十个问题都回答「同意、同意、同意」，最后得到一份 agent 写的、而你只是点头的计划。它之所以感觉富有成效，是因为它很长。但你其实什么都没有决定，而结果看起来比实际更确定。

主动意味着掌舵。如果一个问题比你需要的还要粗略，就反驳回去。当 scope 正在漂移时，就指出来。回答「我不知道」，并且是认真的。这个 skill 协助工程师，而不是取代工程师。结果的质量取决于你回答的质量，而不是问题的数量。

相反的错误是真实但罕见的：在访谈中停留太久，以至于永远到不了写代码那一步。

## 可以 grill 的与 grill 不动的

有些问题可以通过交谈来回答。另一些不行，而且无论你怎么 grill 都到不了那儿。

「一份长表单还是三页？」和「这个交互应该如何感觉？」是 **ungrillable** 的。你需要先有可以回应的东西，才能回答它们。当你遇到一个这样的问题，就停止 grilling。用 [prototype](https://aihero.dev/skills-prototype) 构建一个一次性版本，看看它，然后回来用一句话回答。

当你试图靠交谈磨过一个 ungrillable 的问题时，session 就会变得过长。agent 不断换说法，你不断猜，scope 也随着不确定性一起膨胀。

## 它正常工作的标志

- 你对某件事表示不同意。一场没有你反驳的 session，是一场你本不需要的 session。
- 问题以几轮 rounds 的形式到来，而不是很长一段时间里一次一个地来，而且后面的 rounds 清楚地建立在你早先说过的话之上。
- 你最终到达了一个你没想到的地方，因为一个问题让你看到了一个你一直没注意到自己正在做出的 decision。
- 到结束时，你能向一个不在场的人为每一个选择辩护。

## 常见问题

**我应该预期多少问题，以及我怎么知道它何时结束？**
数 rounds，而不是数问题。四个 rounds 里四十六个问题是一个普通的 session。它在前沿为空时结束：每一条分支都已走过，没有任何东西被留作未言明的假设。

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
比大多数 skills 更重要。Grilling 依赖 [model](https://www.aihero.dev/ai-coding-dictionary/model) 自身对系统如何崩溃的认知，所以用你最好的模型。实施大多跟随 context，所以在实施环节用更便宜的模型也没问题。

## 它在整体中的位置

`grill-me` 是一个**可以在任何地方、针对任何事物运行的 standalone**。因为它 stateless，所以它可移植。它不需要 repo、workspace 或配置，也不假设这个想法与软件有关。人们把它用于商业决定、用于写作、用于下一步要做什么，任何他们无法靠自己想清楚的东西。

可移植性正是它与 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 唯一的区别。后者运行同样的访谈，但会读取一个 codebase 来对齐，并把学到的东西记录为 `GLOSSARY.md` 和 ADRs。两者底层都使用 [grilling](https://aihero.dev/skills-grilling) skill；`grill-me` 是不保留任何状态的 user-invoked 入口。

如果你 grill 的东西确实被证明是软件，你可以把同一段对话交给 [to-spec](https://aihero.dev/skills-to-spec)，继续进入 build flow，这是一个选项，而不是这个 skill 的重点。当你不确定哪条流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你引路。
