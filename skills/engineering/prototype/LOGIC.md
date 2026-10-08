# Logic 原型

一个单一、自包含的 HTML 文件（一个 **shareable demo**），让任何人点按 buttons 就能驱动 state model。用于问题围绕 **business logic、state transitions 或 data shape** 的场景，也就是纸面上看起来合理，但只有跑过真实 cases 才会感觉哪里不对的东西。

因为它是一个文件、无需安装任何东西，你可以把它交给非开发人员（designer、PM、domain expert），让他们亲手感受这个 model。它以他们的语言说话，而不是代码的语言。

## 何时适合这个形状

- "I'm not sure if this state machine handles the edge case where X then Y."
- "Does this data model actually let me represent the case where..."
- "I want to feel out what the API should look like before writing it."
- 任何想**按按钮并观察 state 变化**的情况。

如果问题是 “what should this look like”，这是错误分支。使用 [UI.md](UI.md)。

## 流程

### 1. 陈述问题

写代码前，先写下你正在 prototype 哪个 state model、回答什么问题。一段即可，放在 demo 顶部（一个可见的 intro，而不是只写 comment）。回答错问题的 logic prototype 纯属浪费；把问题显式写出来，这样无论用户现在旁观，还是之后 AFK 回来看，都能检查。

### 2. 把 logic 隔离到可搬运的 module 中

把真正的 logic，也就是回答问题的那部分，放在单个 `<script>` block 中，写成一个小而纯粹的 module，之后可以被拿出来放进真实 codebase。包在外面的 page 是 throwaway；这个 module 不应该是。

合适形状取决于问题：

- **Pure reducer**：`(state, action) => state`。适合 actions 是离散 events、state 是单个值的场景。
- **State machine**：显式 states 和 transitions。适合 “现在到底哪些 actions 合法” 本身就是问题的一部分。
- **一组作用于 plain data type 的 pure functions**。适合没有隐式 current state，只有 transformations 的场景。
- **Class 或带清晰 method surface 的 module**，当 logic 确实拥有持续的 internal state。

选择最适合所问问题的形状，*而不是*最容易接到 page 上的形状。保持 pure：不要 DOM、不要 `document`、不要让 button handlers 伸进 module 内部。Page 调用它；没有任何东西反向流动。这让 prototype 在自身生命周期之后仍有价值：问题被回答后，验证过的 reducer / machine / function set 可以自己独立搬进真实 module。

### 3. 构建可分享的 HTML 文件

一个文件，纯 HTML/CSS/JS：没有 framework、没有 bundler、没有 server，一切内联，因此双击就能打开，经得起被 email 传来传去。任何人都应该能通过打开它来运行。

为非开发人员而写。每个 label 都用 **domain language**，而不是代码：buttons 和 state 读起来像业务，而不是 reducer。用平实的语言解释正在发生什么。

用清晰的层级从上到下排版：

1. **Title 和一行说明**，说明这个 demo 让你探索什么（即 step 1 的问题）。
2. **Current state**：完整相关 state，渲染成可读的 panel（带 label 的 fields，而不是 raw JSON dump），每次点击后重新渲染，让变化可见。在有助于非开发人员跟上的地方，指出刚刚发生了什么变化。
3. **Free-play buttons**：每个 action 一个 button，始终可用，让任何人都可以按任意顺序戳这个 model。每次点击 dispatch 它的 action 并重新渲染 state。
4. **Guided walkthroughs**：一组 **scenarios**，每个 tab 一个。每个 tab 放一段简短的平实语言 scenario 描述（它搭建的情境、要看什么），下面是对应 scenario 按顺序 **要按的 buttons**。每一步都是真实 button：点击它执行该 action 并进入下一步。启动一个 walkthrough 会重置到已知 initial state，让 scenario 每次都以相同方式运行。

选择能演示那些 awkward cases 的 scenarios：happy path、一个棘手的 edge case、一次尝试做本应非法的事，也就是纸面上难以推理的那些。

保持美观但克制：干净的 typography、充裕的 spacing、一个 accent colour。不要动画、不要花招：不要任何与 state 和 buttons 抢注意力的东西。

### 4. 交给对方

把文件发给他们，或帮他们打开。他们会找时间点完 walkthroughs 和 free-play；真正有趣的时刻是他们说 “wait, that shouldn't be possible” 或 “huh, I assumed X would be different” 的时候。这些是_想法_里的 bug，也正是 prototype 的目的。如果他们想要新 actions 或新的 scenario，就添加。Prototypes 会演进。

### 5. 捕获答案和 prototype

Prototype 回答问题后，capture answer，再按 [SKILL](SKILL.md) 描述的方式 capture prototype。Logic-specific mapping：验证过的 reducer / machine / function set 搬进真实 module（decision 被吸收）；HTML shell 跟随 prototype 一起进入把它作为 primary source 保留的 throwaway branch，而且由于它是单一自包含文件，在那里仍然可以毫不费力地重新运行。

## 反模式

- **不要加 tests。** 需要 tests 的 prototype 已经不再是 prototype。
- **不要接真实 database。** 除非问题专门关于 persistence，否则使用 in-memory state。
- **不要 generalise。** 不要做 “what if we wanted to support X later”。Prototype 回答一个问题。
- **不要把 logic 和 page 混在一起。** 如果 pure module 引用了 DOM、`document` 或 button handlers，它就不再可搬运。让 page 作为 pure module 外面的薄 shell。
- **不要引入 framework、bundler 或 server。** 收件人双击的只有一个文件；React app 或 dev server 会毁掉 “shareable”。
- **不要把 HTML shell 发到 production。** Page 是为手工点击浏览优化的。它背后的 logic module 才是值得保留的部分。