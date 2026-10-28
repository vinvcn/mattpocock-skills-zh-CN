## 它做什么

`prototype` 编写**回答一个问题的 throwaway code**：这个 state model 感觉对吗，或者这个屏幕应该长什么样。问题先行，并决定你要构建什么。一个回答了错误问题的 prototype，无论看起来多好，都是浪费。

Throwaway 是对代码*怎么写*的一种约束，而不是销毁它的承诺。没有测试、除了能让它跑起来之外没有错误处理、没有抽象、没有持久化，因为那些东西没有一样能帮你学到你想学到的那一件事。有两样东西存续下来。答案进入真实代码，而 prototype 停到 main 之外的一条 branch 上，作为答案的证据。

## 何时使用

输入 `/prototype`，或者当任务合适时由 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 自动取用它。

在你撞上一个靠谈话无法敲定的问题的那一刻就使用它：一个你无法在脑中握住所有边界 case 的 state machine，或者一个不看到三个版本并排就想象不出来的屏幕。[Grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) sessions 会在这些问题上拖得很长。agent 换着说法重述、你猜、范围不断增长。停止 grilling，构建 throwaway 版本，看着它，然后用一行回答。如果相反，某个已经构建好的东西行为异常、你想知道原因，用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)：prototyping 探索的是该构建什么，而不是为什么已构建的东西坏了。

你也会在非自愿的情况下到达这里。[wayfinder](https://aihero.dev/skills-wayfinder) 会在地图上登记 `prototype` 决策 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)，而你要用这个 skill 来处理其中一个。

## 两个分支

问题选择分支，而分支产出不同的 artifacts：

- **"这个 logic / state model 感觉对吗？"**：一份**可分享的单一 HTML 文件**。一个自包含的页面、无需 build 也无需 server，别人双击即可打开。它带着一个带标签的 state panel，在每次点击后重新渲染；自由玩耍的按钮，让你以任意顺序戳弄 model；以及分标签页的 **guided walkthroughs**：每个 tab 一个场景，每个场景下方是依序要按的按钮。所有东西都用 domain language 标注，所以你可以把它交给设计师、PM 或 domain expert，让他们自己试用这个 model。页面背后的逻辑是一个小型 pure module（一个 reducer、一台 machine、一组 functions），其中不含任何 DOM 代码，这样你可以把经过验证的版本直接搬进真实代码。
- **"这应该长什么样？"**：同一路由上的几个**截然不同**的 UI variations，可通过一个浮动底栏和一个 `?variant=` URL 参数切换。Variants 必须在结构上意见相左，而不是在颜色上；三个带小改动的卡片网格什么也回答不了。它们尽可能在真实页面里渲染，对着真实数据和真实密度，因为一个在空白页面上被评判的 variant 看起来总是可以的。

两者都把 state 保存在内存中、无需任何设置即可启动，并在每一步之后展示完整 state。当你发现自己在加固其中一个的那一刻（加一个测试、接上真实数据库、为了你以后可能想要的 case 而泛化），你就已经停止 prototyping 了。

## Prototype 是一手来源

一个完成的 prototype 留下两样东西，它们去往不同的地方。

你把**答案**（结论加上它所定夺的那个问题）记录在某个永久的地方：一条 commit message、一份 ADR、implementation issue。Main 保留的是答案，就在真实代码里。

**prototype** 是答案所源自的可运行证据，而且你不会删除它。它同样不属于 main，因为没有人维护它，而且它很快就会过时。所以你把它提交到 main 之外的一条 throwaway `prototype/<name>` branch，永不合并，并在 implementation issue 上留下一个指向该 branch 的 [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer)。Main 保持干净，而接下来接手工作的人可以找到并重新运行这个 prototype。

## 常见问题

**等等，prototype 不是应该被删掉吗？**
不再是这样了。以前确实是：构建它、留住答案、扔掉代码。对此最强烈的反对不是关于速度，而是*下一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 谁来接手这件工作，他们有什么可据以工作的东西？*一份 prototype 的口语化总结，会丢失让它具有说服力的东西。所以这个 skill 现在把 prototype 当作一份 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)。它落在 main 之外的一条 `prototype/<name>` branch 上，而 implementation issue 指向它。改变的是代码住在哪里，而不是纪律：它仍然永远不会合并进 main。

**它以前会构建一个 terminal app。那个去哪了？**
logic 分支现在改为产出单一的可分享 HTML 文件。Terminal app 只有克隆了 repo 并安装了 runtime 的人才能驱动，而这排除了 prototype 需要其意见的那些人：设计师、PM、知道 state model 本该意味着什么的 domain expert。一份双击即可打开、被邮件转发后仍然能用的自包含文件，任何人都能驱动。底下的 pure logic module 没有变，它仍然是你搬进真实代码的那一部分。

**一个 agent 在我本该 implement 的时候让我 `/prototype`。**
这是一个已知的命名问题。一个不熟悉 flow 的 agent，一旦 tickets 存在，就会把 `prototype` 这个通用、讨喜的词读成"显而易见的下一步"。所以即便设计已经在对话中敲定，agents 也会指名推荐它。如果你已经知道要构建什么，下一步是 `/implement`，每个 ticket 一次。只有当某个具体的设计问题悬而未决、而且谈话无法解决它时，才取用 prototype。

**我应该在生产功能之前先 prototype 整个应用吗，比如说，向潜在客户演示它？**
那是碰巧和这个 skill 同名的另一种 artifact。这里的 prototype 被限定在一个问题上，而"整个应用是什么？"不是一个问题。一个全应用 prototype 没有自然的停止点，所以它会不知不觉地变成生产应用：清理从不发生，而按 prototype 规则写下的代码（没有测试、没有错误处理）最终会出现在用户面前。如果你需要一个销售演示，就刻意把它当作 demo 来构建，并明确其中没有一样是生产代码。如果你需要敲定一个设计问题，就把它裁到那个问题上。

**我怎么在它自己的 session 里运行它？**
prototype 住在它自己的目录里，并生成大量你不想留在这个提问 thread 里的 [context](https://www.aihero.dev/ai-coding-dictionary/context)，所以换个地方运行它，只把答案带回来。用 [handoff](https://aihero.dev/skills-handoff) 把工作搬进那个 session，再把答案带回来。

**这难道不是烧 tokens 的最快方式吗？**
可能是，如果你 prototype 那些靠谈话就能回答的问题，或者让一个 prototype 蔓延到整个 feature 上的话。真正重要的比较不是 tokens 对比零；而是 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 对比构建了错误的 state model、然后等它有了生产调用者才发现。让问题保持狭窄、运行保持简短，花费就会保持相称。

## 它正常工作的标志

- 你能用一句话说出这个 prototype 存在是为了回答什么问题，而且它被写在 demo 的顶部，而不只是在你脑子里。
- 一个不读代码的人能驱动这个 logic demo。他们打开文件，按下 walkthrough 标签页里的按钮，用自己的话描述他们看到的东西。
- 有人说"等等，那不该是可能的"或"嗯，我以为 X 是这样的"。那是 *idea* 里的一个 bug，而这正是 prototype 的用途所在。
- UI variants 在布局和信息层级上意见相左，而不只是颜色和文案，而你得到的反馈是"B 的头部配 C 的侧边栏"。
- 它被一次性回答。如果一天之后你还在构建它，那问题太大了；拆分它。
- 结束时，main 只包含决策、不包含任何 prototype 代码，而 implementation issue 指向仍然保存着它的那条 branch。

## 它在整体中的位置

`prototype` 是一个**可随时取用的 standalone**：你用它敲定一个设计问题，然后回到你的工作。另有一个 skill 也会运行它。

运行它最多的 skill 是 [wayfinder](https://aihero.dev/skills-wayfinder)。一张 wayfinder 地图由 **decision tickets** 构成，而 `prototype` 是 ticket 可以成为的四种类型之一：当阻塞性问题是无论多少讨论都无法解决的"这应该长什么样"或"它应该怎么表现"时使用的那个。当一场讨论含混不清时，wayfinder 会制造某个具体的东西来供人反应，而这个 skill 负责构建那个东西。答案为一个 prototype ticket 结案，而地图把 prototype 作为一份 asset 链接出来。

其他邻居在它上游和下游。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 回答可 grill 的问题；不可 grill 的那些则来到这里，而那一行回答回到访谈中。在下游，一个经过验证的 state model 或 UI 方向会成为 [to-spec](https://aihero.dev/skills-to-spec) 的已定输入，后者可以把 prototype 产出的决策密集片段内联进去，而不是用口语化文字描述它。至于其他任何东西，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由整个集合。