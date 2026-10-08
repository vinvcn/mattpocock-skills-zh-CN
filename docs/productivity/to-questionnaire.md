## 它做什么

`to-questionnaire` 把你无法独自定夺的 decision 转成一份 **questionnaire**：一份你交给那个掌握你所缺信息的人的 Markdown document，让对方异步填写，或由你们俩在会议中一起过一遍。

它追问的是 **send**，绝不是 subject。在这里围绕主题访谈你是没有意义的：你之所以要写信给别人，正是因为你不了解那个主题。所以它只问两件你总能回答的事（这份东西要发给谁、以及你需要对方返回什么），并把 document 里的每个问题都对准这两者之间的 **gap**。

## 何时使用

你通过输入 `/to-questionnaire` 来调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用。

当一个 decision 卡在只存在于某一个人脑子里的知识上时（一个客户、一个领域专家、一个掌握业务规则的高管、一个你不坐在同一团队的同事），就用它。你想要哪个 skill，取决于答案到底在哪里：

| 答案在…… | 去用 |
| --- | --- |
| 你自己的脑子里，还没打磨 | [grill-me](https://aihero.dev/skills-grill-me) |
| codebase 里 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 别人的脑子里 | `to-questionnaire` |
| 还没在任何人脑子里，这个问题需要有个东西去反应 | [prototype](https://aihero.dev/skills-prototype) |

最常见的情况是一次 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 会话卡住了：浮现出来的某些东西不该由你来回答。在同一段对话里运行 `/to-questionnaire`，把这些 questions 离线化，再把答案带回来继续。

## 追问 send，而非 subject

访谈分两轮，然后停止。

- **它要发给谁？** 对方的 role、expertise，以及对方与你的关系。这决定了语气，以及 document 需要携带多少 context，外部的客户需要被引导进来，同事则不需要。
- **你需要对方返回什么？** 那些你独自无法解决的 concrete decisions 或 facts。这会成为成品 document 的对照清单：你点名的每一项，都会有一个问题对准它。

这之后都只是草拟。文件生成在当前目录的 `to-questionnaire-<slug>.md`。没有 setup、没有 workspace，也没有任何需要配置的东西。

## 这份文档的形状

它的定位是一份 **discovery questionnaire**（你缺少 context，而 recipient 掌握它），这个定位决定了它的形状：

- 一行 purpose，点明这份东西关系到的 decision，再加上一小段 context，给一个从未进过你脑子的 recipient。
- 问题按 **most-important-first** 排序，并分组放在主题 headings 下，因为异步意味着你可能只有一次机会。
- 每个问题只含一个 idea，绝不复合，正下方放 answer stub，只有某个问题可能被误读时才加一行 _why this matters_。
- 明确允许回答 "I don't know"：标记出来的不确定是有用的；一个读起来像 facts 的自信猜测则不然。
- 结尾的兜底：还有哪些我们没问、但应该知道的？

有两件事它刻意不做。它不是 **branching**：questions 是一个扁平的、分组列表，而不是一棵"你答了 A 就跳过 D 部分"的树。它也不是 **multi-recipient**：运行一次只产出一份 document，给一个人。

## 常见问题

**它会读我的 grilling 会话，并从里面提取 questions 吗？**
不会作为单独一步。skill 没有 ingest 阶段：它问 send，然后草拟。它在 grilling 会话之后之所以有效，是因为你在**同一段对话**里运行它，所以 [session](https://www.aihero.dev/ai-coding-dictionary/session) 已经在 [context](https://www.aihero.dev/ai-coding-dictionary/context) 里，草拟时可以借鉴它。在一个全新会话里启动它，它就对这次 grilling 一无所知，当你回答"你需要对方返回什么？"时，你得自己重新提供主题。

**缺失的答案并不都在同一个人那里。它能按 recipient 拆分吗？**
不能。第一步只问_那个_ recipient，单数，整个 document 的语气和 context 都是对着他调的。如果有三个人各掌握答案的一部分，就运行三次，每次对应一个人。在单份 document 内部按 discipline 或 role 路由 questions 是有人提过的请求；但它没有这么做。

**questions 之间有依赖吗：它会根据前面的回答跳过某些小节吗？**
不会。依赖式问题的设计被探索过，但没有发布。输出是一份静态 document：主题分组、most-important-first、每个 question 都活在里面。反对它的理由站得住脚：一个 [model](https://www.aihero.dev/ai-coding-dictionary/model) 在真实答案之前规划两三个以上的问题，会规划得很糟，而一份 branching document 必须在每一个答案之前把全部问题都规划好。

**如果 recipient 也不知道呢？**
document 会告诉对方直说。"I don't know" 和部分回答是被明确要求的，而一个标记出来的不确定远比一个猜测更有价值，因为一个含糊的回答和一个自信但错误的回答，一旦回到你的 context 里就看起来一模一样。

**它会把它发到任何地方吗：Slack、issue tracker、邮件？**
不会。它在当前目录写一个 Markdown 文件，并告诉你路径。投递是你的事：粘贴进一个 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)、丢进一条 Slack 线程、附在邮件里，或打开一份共享屏幕实时过一遍。人们手动接好了全部四种方式。

**这不就是批量模式的 `/grill-me` 吗？**
不是，而且这个区别值得守住。`grill-me` 已经按 **rounds** 来问了（一次把整个 frontier 全问出来，再从你的回答重新计算），所以"一次性给我全部 questions"的需求在那里已经满足了。`to-questionnaire` 关心的是另一条轴：不是 questions 如何交付，而是答案在谁的脑子里。自己更快地回答它们，是 `grill-me`；把答案从别人那里问出来，是这个。

**没有 skill，我不能直接让 agent 做这个吗？**
能，而且 skill 存在之前就有很多人这么干：`OPEN_QUESTIONS.md` 文件、发给客户的 spreadsheet、每个未回答的 question 一个 "needs more info" ticket。skill 给你带来两样东西：访谈从不漂移到 subject 上，以及 document 以非技术 recipient 真能填的形状产出。如果你已经有了一套行之有效的自家格式，诚实的答案是你并不需要这个。

## 它正常工作的标志

- 它问 recipient、问你需要对方返回什么，然后就不问了。一个关于 subject 本身的问题，说明 skill 跑偏了。
- 你点名的每一项"我需要对方返回什么"，都能在文件里追溯到对应的问题。
- questions 读起来是冲着_recipient_ 所知的去的，而不是你那些 open questions 的逐字转抄。
- 你随手把文件递给一个没参与对话的人，对方就知道自己为什么收到它、以及该在什么时候回复。
- 收回来的答案能作为新一轮 grilling 的可用输入，而不是一组全新的 questions。

## 它在整体中的位置

`to-questionnaire` 是一个随时可调的 standalone。它位于你自己知识边界处，在那里下一步是找另一个人，而不是找另一个 skill，最常见是在流程中途，当规划卡在某个不归你决定的东西上时。

它的邻居是 [grill-me](https://aihero.dev/skills-grill-me)，两者以答案所在之处分界：grilling 挖掘你自己，questionnaire 挖掘别人。收回来的东西是原材料：喂进又一轮 grilling，或者如果工作要走向构建，就喂给 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 或 [to-spec](https://aihero.dev/skills-to-spec)。当你不确定哪个 skill 适合此刻时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。