## What it does

`prototype` 编写**回答一个问题的 throwaway code**：这个 state model 感觉对吗，或者这个屏幕应该长什么样。问题先行，并决定其后一切事物的形状；一个回答了错误问题的 prototype，无论看起来多好，都是纯粹的浪费。

Throwaway 是对代码*怎么写*的一种约束，而不是销毁它的承诺。没有测试、除了能让它跑起来之外没有错误处理、没有抽象、没有持久化，因为那些东西没有一样能帮你学到你想学到的那一件事。存续下来的是答案（折叠进真实代码），以及 prototype 本身（停在 main 之外的一条 branch 上，作为答案来自何处的证据）。

## When to reach for it

输入 `/prototype`，或者当任务合适时由 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 自动取用它。

在你撞上一个靠谈话无法敲定的问题的那一刻就使用它：一个你无法在脑中握住所有边界 case 的 state machine，或者一个不看到三个版本并排就想象不出来的屏幕。[Grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) sessions 恰恰会在这些问题上膨胀：agent 换着说法重述、你猜、范围不断增长去填满不确定性。停止 grilling，构建 throwaway 版本，看着它，然后用一行回答。如果相反，某个已经构建好的东西行为异常、你想知道原因，用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)：prototyping 探索的是该构建什么，而不是为什么已构建的东西坏了。

你也会在非自愿的情况下到达这里。[wayfinder](https://aihero.dev/skills-wayfinder) 会在地图上登记 `prototype` 决策 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)，而处理其中一个，就是这个 skill。

## Two branches

问题选择分支，而分支产出截然不同的 artifacts：

- **"这个 logic / state model 感觉对吗？"**：一份**可分享的单一 HTML 文件**。一个自包含的页面、无需 build 也无需 server，别人双击即可打开。它带着一个带标签的 state panel，在每次点击后重新渲染；自由玩耍的按钮，让你以任意顺序戳弄 model；以及分标签页的 **guided walkthroughs**：每个 tab 一个场景，每个场景下方是依序要按的按钮。所有东西都用 domain language 标注，所以你可以把它交给设计师、PM 或 domain expert，让他们自己感受这个 model。页面背后的逻辑是一个小型 pure module（一个 reducer、一台 machine、一组 functions），与 DOM 保持干净分离，这样经过验证的版本可以直接提进真实代码。
- **"这应该长什么样？"**：同一路由上的几个**截然不同**的 UI variations，可通过一个浮动底栏和一个 `?variant=` URL 参数切换。Variants 必须在结构上意见相左，而不是在颜色上；三个微调过的卡片网格是壁纸，不是 prototype。它们尽可能在真实页面里渲染，对着真实数据和真实密度，因为一个在真空中被评判的 variant 看起来总是可以的。

两者都把 state 保存在内存中、无需思考即可启动，并在每一步之后展示完整 state。当你发现自己在加固其中一个的那一刻（加一个测试、接上真实数据库、为了你以后可能想要的 case 而泛化），你就已经停止 prototyping 了。

## The prototype is a primary source

一个完成的 prototype 留下两样东西，它们去往不同的地方。

**答案**（结论加上它所定夺的那个问题）被持久地捕获：一条 commit message、一份 ADR、implementation issue。那正是 main branch 保留的东西，折叠进真实代码。

**prototype** 是答案所源自的可运行证据，而且它不会被删除。它同样不属于 main（那里没有东西需要维护，而且它腐烂得很快），所以它被提交到 main 之外的一条 throwaway `prototype/<name>` branch，永不合并，并在 implementation issue 上留下一个指向该 branch 的 [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer)。Main 保持干净；那份探索对任何接下来接手工作的人来说，保持可被发现、可被重新运行。

## Common questions

**等等，prototype 不是应该被删掉吗？**
不再是这样了。以前确实是：构建它、留住答案、扔掉代码。对此最尖锐的反对从来不是关于速度，而是*下一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 谁来接手这件工作，他们有什么可据以工作的东西？*一份 prototype 的口语化总结，会丢失让它具有说服力的东西。所以 prototype 现在被当作一份 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)：它落在 main 之外的一条 `prototype/<name>` branch 上，而 implementation issue 指向它。改变的是代码住在哪里，而不是纪律：它仍然永远不会合并进 main。

**它以前会构建一个 terminal app。那个去哪了？**
logic 分支现在改为产出单一的可分享 HTML 文件。Terminal app 只有克隆了 repo 并安装了 runtime 的人才能驱动，而这恰恰排除了 prototype 需要其意见的那些人：设计师、PM、知道 state model 本该意味着什么的 domain expert。一份双击即可打开、经得起被邮件转发的自包含文件，任何人都能驱动。底下的 pure logic module 没有变，它仍然是提进真实代码的那一部分。

**一个 agent 在我本该 implement 的时候让我 `/prototype`。**
已知问题，而且这是一个命名问题。`prototype` 是一个通用、讨喜的词，一旦 tickets 存在，它在一个不熟悉 flow 的 agent 读起来就是"显而易见的下一步"，所以即便设计已经在对话中完全敲定，它也会被指名推荐。如果你已经知道要构建什么，下一步是 `/implement`，每个 ticket 一次。只有当某个具体的设计问题真正悬而未决、而且谈话无法解决它时，才取用 prototype。

**我应该在生产功能之前先 prototype 整个应用吗，比如说，向潜在客户演示它？**
那是披着这个 skill 名字的另一种 artifact。这里的 prototype 被限定在一个问题上，而"整个应用是什么？"不是一个问题。一个全应用 prototype 没有自然的停止点，所以它会靠惯性变成生产应用：清理从不发生，而按 prototype 规则写下的代码（没有测试、没有错误处理）最终会出现在用户面前。如果你需要一个销售演示，就刻意把它当作 demo 来构建，并明确其中没有一样是生产代码。如果你需要敲定一个设计问题，就把它裁到那个问题上。

**我怎么在它自己的 session 里运行它？**
prototype 住在它自己的目录里，并生成大量你不想留在这个提问 thread 里的 [context](https://www.aihero.dev/ai-coding-dictionary/context)，所以换个地方运行它，只把答案带回来。[handoff](https://aihero.dev/skills-handoff) 是两个方向上的桥。

**这难道不是烧 tokens 的最快方式吗？**
可能是，如果你 prototype 那些靠谈话就能回答的问题，或者让一个 prototype 蔓延到整个 feature 上的话。真正重要的比较不是 tokens 对比零；而是 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 对比构建了错误的 state model、然后等它有了生产调用者才发现。让问题保持狭窄、运行保持简短，花费就会保持相称。

## It's working if

- 你能用一句话说出这个 prototype 存在是为了回答什么问题，而且它被写在 demo 的顶部，而不只是在你脑子里。
- 一个不读代码的人能驱动这个 logic demo。他们打开文件，按下 walkthrough 标签页里的按钮，用自己的话描述他们看到的东西。
- 有人说"等等，那不该是可能的"或"嗯，我以为 X 是这样的"。那是 *idea* 里的一个 bug，而这正是全部意义所在。
- UI variants 在布局和信息层级上意见相左，而不只是颜色和文案，而你得到的反馈是"B 的头部配 C 的侧边栏"。
- 它被一次性回答。如果一天之后你还在构建它，那问题太大了；拆分它。
- 结束时，main 只包含决策、不包含任何 prototype 代码，而 implementation issue 指向仍然保存着它的那条 branch。

## Where it fits

`prototype` 是一个**可随时取用的 standalone**（你进入它来敲定一个设计问题，然后退出），同时它也是另一个 skill 赖以运行的机制。

它最大的消费者是 [wayfinder](https://aihero.dev/skills-wayfinder)。一张 wayfinder 地图由 **decision tickets** 构成，而 `prototype` 是 ticket 可以成为的四种类型之一：当阻塞性问题是谁说多少讨论都无法解决的"这应该长什么样"或"它应该怎么表现"时使用的那个。Wayfinder 通过制造某个具体的东西来供人反应，从而提升一场迷雾般讨论的保真度，而这个 skill 正是那个具体的东西被构建的方式。一个 prototype ticket 由答案来结案，而 prototype 作为一份 asset 从地图中被链接出来。

其他邻居在它上游和下游。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 回答可 grill 的问题；不可 grill 的那些则来到这里，而那一行回答回到访谈中。在下游，一个经过验证的 state model 或 UI 方向会成为 [to-spec](https://aihero.dev/skills-to-spec) 的已定输入，后者可以把 prototype 产出的决策密集片段内联进去，而不是用口语化文字描述它。至于其他任何东西，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由整个集合。