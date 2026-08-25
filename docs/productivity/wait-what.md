## What it does

`wait-what` 是你在一句话没听明白时输入的内容。[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 随后会把它刚说过的话重新讲一遍。它补上你缺少的 context，用朴素英语书写，并使用你项目 `CONTEXT.md` 里的词汇。

这个 skill 只有三行长。这是设计，不是未完成的草稿。那些对抗冗长的 skills 会因膨胀而失败：一个四百行的 concision skill 仍然让 [model](https://www.aihero.dev/ai-coding-dictionary/model) 显得啰嗦，因为 model 读的是篇幅，而不是恳求。这一个只携带一个精确的 leading word，除此之外什么都没有。

## When to reach for it

你通过输入 `/wait-what` 来调用它。agent 不会自行调用它，也不该。只有你知道自己什么时候跟丢了。

在你发现自己开始跳读的那一刻就用它。agent 已经漂移进它自己发明的术语、堆了五个缩写，或者解释了一个你从没见过前提的 decision。它修复的是你正在进行的这场对话。要彻底阻止术语出现，用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它预先构建共享语言。

## The name is the mechanism

leading word 是 **wait**。"Be concise" 是一条针对 agent 输出的指令，model 通过删词来服从它，从而让你进一步迷失。**Wait** 是关于_你_的状态的。它说：这里理解失败了。一个听到"讲简短点"的 agent 会写电报体。一个听到"等等，我跟丢了"的 agent 会退回去解释。

这个区别就是整个 skill。每一种对抗冗长的流行修复都在命名 _output_：`/tldr`、`/no-fluff`、`/talk-normal`。model 会过度纠枉，落进一个更短、却也一点也不更清楚的原始人腔调。命名 _listener_ 则一次要两样：更少的词**和**你缺少的 context。

skill 说重新讲一遍**那个**，不是"刚才那条消息"。让你迷失的东西通常比一个段落更大，所以 agent 决定要回溯多远。

## It plugs into the language you already have

正文复用了你全局 `CLAUDE.md` 和项目 `CONTEXT.md` 里已有的 leading words。ASD-STE100 Simplified Technical English 设定语域。ubiquitous language 提供名词。skill、`CLAUDE.md` 和 `CONTEXT.md` 抓取的是同一批 [tokens](https://www.aihero.dev/ai-coding-dictionary/token)，所以调用它并不是一条新指令。它是对 agent 早已同意的一条指令的提醒。

如果你没有 `CONTEXT.md`，或者没有由 `CONTEXT-MAP.md` 指向正确 context 的文件，skill 仍然有效。你只是失去领域词汇那一半。

## It's working if

- 重新讲一遍**更短更清楚**，而不是更短更生硬。
- 它补上了你缺少的前提，而不只是删词。
- 项目的名词替换了那些发明出来的词。你 `CONTEXT.md` 里的术语回来了。
- 你能连用两次，而它不会退化成生硬简短。

## Where it fits

你可以在任何时刻、任何对话、任何其他 skill 内部使用 `wait-what`。它事后修复一条消息。真正的解药是预先商定的共享语言，那就是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)：一次 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 会话，一边跑 [domain-modeling](https://aihero.dev/skills-domain-modeling)，这样你们双方都在用的词会落进你的 `CONTEXT.md`。如果你不确定哪个 skill 适合此刻，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。
