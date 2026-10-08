## 它做什么

`pr` 是一份 pull request body 应该采用的形状：一段展示这次变更的 **Summary**、证明它可用的 **Evidence**、以及对把它落地有多危险所做的 **Merge Danger** 判断。它是一个格式参考，不是一个工作流。它不 push branch、不打开 PR、也不决定里面放什么；它告诉 [agent](https://www.aihero.dev/ai-coding-dictionary/agent)，当它写 PR body 时，这个 body 应该长什么样。

摘要是一幅图，而不是一段话。默认的 PR body 用散文叙述 diff，而这一份会挑出能把关键点讲清楚的**最小视图**（pseudocode、一棵 call tree、一棵 component tree、一棵 file tree、一张 Mermaid 图，或一个 shaped diff），并让它周围的文字保持简短。reviewer 手里已经打开了 diff；body 的任务是在他们阅读之前先展示它的形状。

## 何时使用

输入 `/pr`，或者每当 agent 在写 PR body 时，它会自动取用。

| 你的情况 | 该用哪个 |
| --- | --- |
| 一条 branch 已经就绪，需要一份 reviewer 能扫读的 body | `pr` |
| 代码写完了，但还没有人 review 过 | 先 [code-review](https://aihero.dev/skills-code-review)，再 `pr` |
| PR 已经打开，review comments 正在回来 | 这套里暂时没有对应的；`pr` 只写 body |

## 模板

三个 section，按此顺序：

- **Summary**：一个或多个小图，每个都放在它所支撑的那段短文字旁边。用一个，有时用几个，很少全用。只保留 reviewer 需要的 calls、files、props 和边界。
- **Evidence**：一份 before 和 after。当变更是视觉性的、而且 [environment](https://www.aihero.dev/ai-coding-dictionary/environment) 允许时，screenshot 是最强的证据；否则就写那条之前失败、现在通过的确切测试，写成 pseudocode，或者写那段变化了的 console 输出。
- **Merge Danger**：这次变更是**单向门（one-way door）**还是**双向门（two-way door）**，以及它的 **blast radius**。双向门走回头路代价很低；单向门（一次破坏性 migration、一次公共 API 移除、一个难以撤销的决定）则不然。Blast radius 点名如果这次变更错了，什么可能坏掉：layout shift、一个 API 的 consumers、移动端响应性。

关于门的判断是主导想法。它把"这合并安全吗"从一种直觉变成一条 reviewer 可以表示异议的明确主张，并告诉他们把 [human review](https://www.aihero.dev/ai-coding-dictionary/human-review) 花在哪里：blast radius 小的双向门可以扫读；单向门值得一次慢读。

## 常见问题

**我能相信 agent 自己给出的门判断吗？**

不能盲信，而把判断说出来正是为了这一点。写下这次变更的 agent 同时也是给它打分的人，而一份自报最舒心的时候，恰恰是它写着"two-way, small blast radius"的时候。可逆性也常常在 diff 里是看不见的：正如一位用户所说，"回滚一个 commit 并不能撤回一批已经发出的邮件"，而一次带 flag 的 rollout 在第一笔写入以新格式落地之前，都还只是双向门。这个 skill 给 agent 的是一个定义（破坏性动作和难以撤销的决定是单向的），而不是一份 checklist，所以要把 Merge Danger 那一行读得最仔细。有两件事有帮助：确保 agent 面前有 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 或 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)，而不只是 diff；并把你这个 repo 一贯视为单向的变更（schema migrations、任何向外发送或删除东西的操作）写在 agent 做判断之前会读到的地方。

**它会替我打开 PR 吗？**

不会。`pr` 只管 body。[implement](https://aihero.dev/skills-implement) 以提交到当前 branch 收尾，而那些要求一个能打开 PR 的 skill 或选项的请求（一个 `/to-pr`，或者让 `implement` 开 PR 而不是 commit）仍是 open proposals；一位用户的变通办法，是给 `implement` 加一句本地覆盖，告诉它打开一个 PR。[implement-spec](https://aihero.dev/skills-implement-spec) 是例外：当你的 issue tracker 通过 PR 关闭工作、或你主动要求一个时，它会打开一个 draft PR。因为 `pr` 是 model-invoked 的，任何时候你让 agent 打开 PR，得到的都是这个形状的 body。

**它不会又产出一面文字和图的墙吗？**

这正是它针对的失败模式，而且仍然可能发生。用户对 agent PR bodies 的抱怨是一致的："摘要很长，但我只想知道改了什么、怎么验证的、什么可能坏掉、以及合并是否安全。"这个 skill 告诉 agent 跳过 preambles、保持文字简短、并挑最小的视图，通常是一张图，很少全部用上。如果你仍然收到一摞 diagrams，那是 agent 无视了这些指示；如果 body 巨大是因为 diff 巨大，那问题出在 PR 的尺寸，`pr` 不会替你拆分它。

**我的 repo 已经有 PR template 了。听谁的？**

默认谁都不听：`pr` 自带模板，不会去找 `.github/pull_request_template.md` 或任何类似的东西。好几位用户要求这个 skill 尊重 repo 的模板，而放任不管的话，agent 手里就攥着针对同一份文档的两条互相竞争的指令。在你 repo 的 agent docs 里解决它，比如填满 repo 的模板，并把 Summary、Evidence 和 Merge Danger 放在它下面。

**输出是 HTML 吗？为什么 Mermaid 图不渲染？**

输出是一份 markdown 的 PR body，不是一张 HTML 页面。GitHub 和 GitLab 会在 PR description 里渲染 Mermaid blocks，但终端不会，所以在 agent 本地展示给你看时，那张图看起来就像原始文本。CLI harness 上的用户用 ASCII 的 Mermaid renderer、或让 agent 往 PR 上附一个 HTML 版本来绕过这一点。Mermaid 只是六种视图中的一种；call tree、file tree 或 shaped diff 在哪里读起来都一样。

**它能替我分拣回来的 review comments 吗？**

不能。它写完 body 就停。分拣来自其他开发者或 review bots 的 comments（哪些值得处理、哪些是无事生非）被请求过不止一次，而那不是这个 skill 做的事。

**PR 变了之后，它会让 body 保持最新吗？**

不会。它在某个时间点写下 body，而一个在 review 期间变化的 PR 会让那份 body 过时。在实质性变更之后让 agent 重写 body；它又是在写一份 PR body，所以同样适用这个形状。

**我的变更没有 UI。Evidence 里放什么？**

除 screenshot 以外的一切。Screenshot 只在变更是视觉性的时才是最强的证据；对一次 migration、一个 background job 或一次 refactor 来说，证据是那条之前失败、现在通过的确切测试，或那段变化了的 console 输出。单独一句"测试是绿的"只是一个主张，而不是一份 before 和 after。

**它能标注 body 是 LLM 写的吗？**

它自己做不到。一位用户的做法是在 repo 的 agent docs 里放一条常设指令：agent 写的每一个 issue、comment 和 PR 都以一行披露结尾。这条规则属于 repo，在那里它覆盖 agent 发出的一切，而不是待在只管一种文档的模板里。

## 它正常工作的标志

- 只看 Summary 的那张图、在打开 diff 之前，你就能说出这个 PR 改了什么。
- body 没有 preamble：它从 Summary 标题开始。
- Evidence section 展示一份 before 和 after，而不是一个"测试通过"的主张。
- 每个 PR 都声明一扇门和一个 blast radius，而单向门就是你放慢速度对待的那些。

## 它在整体中的位置

当构建以 pull request 的形式上线时，`pr` 位于 review 和 retro 之间：`to-spec → to-tickets → implement → code-review → pr → retro`。它是 model-invoked 的，所以在这条链之外，任何时候 agent 写 PR body，它也会自行触发。

- [code-review](https://aihero.dev/skills-code-review) 在它之前运行，因为一份 PR body 描述的应该是一个已经 review 过的 diff。
- [implement](https://aihero.dev/skills-implement) 产出 body 所描述的那些 commits。

[ask-matt](https://aihero.dev/skills-ask-matt) 在你拿不准情境想要哪个 skill 时，在整个集合上为你路由。
