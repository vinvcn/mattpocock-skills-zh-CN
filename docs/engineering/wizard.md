## 它做什么

`wizard` 生成一个交互式 bash 脚本，一步步引导人完成一项手动流程：接好第三方服务、运行一次性 migration、把项目从状态 A 迁到状态 B。它打开每个 URL，说明该点什么、该复制什么，捕获返回的值，并把它们写进 `.env` 文件和 GitHub Actions secrets。

[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 负责写脚本，从不运行它。运行它的是你，在你自己的机器上。所以 wizard 不是一份你照着执行的指令清单：它是一个驱动流程并持有状态的程序，而你的部分是点击、粘贴、按回车。

## 何时使用

你可以输入 `/wizard`，agent 也可以自行触发它。当它撞上一个必须由你完成的步骤（一个它无法铸造的 key、一个它无法点击的 dashboard），它就会为你构建一个 wizard，而不是把指令写进聊天里，让它们滚出视野。

当挡住你的下一步是一趟穿行 dashboard 的旅程时，就使用它：

| 情形 | wizard 做什么 |
| --- | --- |
| 一个新 dev 需要在 app 启动前配置好六个服务 | 按顺序打开每个 dashboard，捕获 keys，写入 `.env` 和 CI |
| 一次一次性 migration 需要按特定顺序拨动开关 | 把不可逆的步骤排在 confirmation gates 后面 |
| 一个项目需要一次性从状态 A 迁到状态 B | 走完整个迁移，并报告它做不到的部分 |
| 你正要把那些步骤写进 README | 转而写一个可执行版本，它无法那么安静地腐烂 |

不要用它来决定*构建什么*；那是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 和 [to-spec](https://aihero.dev/skills-to-spec) 的工具。

## 前置条件

生成一个没有前置条件。它写出的 wizard 运行在 bash 上，当某个 stage 设置 GitHub secret 或 variable 时使用 `gh`。如果 `gh` 缺失或未认证，那个 stage 会变成一个 warning，收尾 summary 会告诉你该手动设置什么，而不是让运行失败。

## 阶段

**stage** 是单个屏幕上的一项聚焦任务。脚本会在 stage 之间清屏，因此一个溢出屏幕的 stage 会丢掉已经滚出视野的部分。你按依赖顺序编排 stages，并设置 `TOTAL_STAGES`，它驱动进度显示。

Scoping 发生在写出任何一行之前。[skill](https://www.aihero.dev/ai-coding-dictionary/skill) 会读 repo，而不是凭空发问：`.env*`、`docker-compose*`、framework config，以及 `.github/workflows/` 里的每一处 `secrets.*` / `vars.*` 引用，每一个都是 wizard 必须产出的值。然后它向你展示有序的 stage 列表供确认，之后才把每个 stage 映射到人实际遵循的精确路径（"Dashboard → Developers → API keys → Reveal test key → copy"）。在它不知道当前 UI 的地方，它会问你或查阅文档，而不是凭空编造点击。

对于每个捕获的值，scoping 决定它落到哪里：

| 目的地 | 时机 |
| --- | --- |
| 仅 `.env` | 本地开发需要它，CI 不需要 |
| GitHub secret | CI 会读取它，而且它是敏感的 |
| GitHub variable | CI 会读取它，而且它是公开的 |
| `.env` 和 secret 都要 | 本地开发与 CI 都需要 |
| 哪里都不写 | 该 stage 是纯操作：拨一下开关、升级一个 plan |

## 模板已经解决了 UX

[template](https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/template.sh) 已经交付了整套体验：带剩余时间的进度、confirmation gates、跨平台 URL 打开（含 WSL）、secret 的隐藏输入、幂等的 `.env` upserts、`gh secret` / `gh variable` 写入，以及一份收尾 summary，列出它不得不跳过的所有东西。`STAGES` 标记之上的所有内容都是一个固定的 library，在每个 wizard 中都完全相同，绝不小手编辑。一致性正是重点。你的工作只是划定流程范围并编写它的 stages。

写 wizard 的 agent 永远不会端到端运行它，因为它会打开浏览器并等待人类输入。它改为静态验证：`bash -n`、可用时的 `shellcheck`，以及一次追踪：确保每个值都落到 scoping 所说的位置，每个 `set_secret` 名称都与 CI 中真实的 `secrets.*` 引用匹配。相应地调整你的预期：第一次运行是属于你的，而那一次运行就是测试。

## 默认用完即弃

| 你拥有什么 | 怎么处理脚本 |
| --- | --- |
| 一次性 migration、个人 setup、你永远不会重复的一次迁移 | 存到 scratch 或 `scripts/` 路径，运行它，删除它 |
| repo 上下一个人也会需要的 setup 路径 | 提交它并从 README 链接过去，让他们运行脚本，而不是重新问 agent |

## 常见问题

**我的 API keys 会进入 model 的 context 吗？**

不会。Agent 写脚本，但不运行它。脚本由你自己运行，它用隐藏的终端输入捕获 key，并直接写入 `.env` 或 `gh secret`。Wizard 是一个 CLI，model 与它没有连接。一个告诫：这适用于 wizard 在运行时捕获的值。如果你在 scoping 流程时把某个 key 粘贴进聊天，它就像任何其他粘贴的文本一样进入了 [context](https://www.aihero.dev/ai-coding-dictionary/context)。

**我能回去修正输错的值吗？**

运行中途不行。没有返回按钮：stages 只会向前运行，在 stage 3 答错就意味着 Ctrl-C 后重跑。重跑在设计上很便宜：任何已经写入 `.env` 的值都会作为默认值被重新提供，所以你在已经答对的 stages 上按回车，只需要重打那一个答错的。这个问题在发布周就出现了，至今没有关闭："loved it! One thing though, is there a way to go back and correct what you've entered?"

还有一个相关的 open bug。`ask` 提示符里的方向键会插入 `^[[D` / `^[[C` 而不是移动光标，因为该提示符用的是 `read -r` 而不是 Readline（[issue #741](https://github.com/mattpocock/skills/issues/741)）。Backspace 有效；方向键无效。请一路删除回到错误处，而不是把光标移进错误里。

**它知道我设置过什么吗？**

部分知道，而且比发布时的反应所设想得少。它在发问之前会读 repo（你的 `.env` 文件、`docker-compose`、framework config、CI 里的 `secrets.*` 引用），因此它把范围限定在真正缺失的值上，而不是像 README 那样从零开始。它不会做的是检查第三方服务。如果某个 key 已经存在于你的 `.env` 中，wizard 会把它重新提供出来，按回车即可保留；如果你已经创建了 Stripe 账户，却从没保存过 key，wizard 仍然会把你送去相应 dashboard 获取它。

**它在工作流里处于什么位置，在 grilling 和 spec 之后吗？**

没有特别的位置。它是一个 standalone，不是链条上的一环。常见的猜测是 `/grill-with-docs → /to-spec → /wizard`，这个顺序没问题，但触发条件是出现一项手动流程，而它可能发生在任何时刻：开工之前、构建中途，或发布很久之后。它也可以作为发现工具：scoping 会在你投入工作之前，浮出一个任务的隐藏前置条件，比如你从没想过的三把 API keys。

**它在 Claude Code 之外能用吗？**

artifact 可以，无任何条件：它是一个普通 bash 脚本，不关心是哪个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 生成的。Skill 本身是 model-invoked，所以它到处都在列表里：在 Claude Code 中输入 `/wizard`，或在 Codex 中输入 `$wizard`，或者直接描述你卡住的 setup。正因为是 model-invoked，它也避开了 [#693](https://github.com/mattpocock/skills/issues/693)：Claude 的桌面和 web 界面会把 *user-invoked* skills 从 [model](https://www.aihero.dev/ai-coding-dictionary/model) 的列表中丢掉，并报告它们未安装。

**它以前不是 user-invoked 吗？**

是的。它现在是 model-invoked，所以当 agent 撞上一个必须由你完成的步骤时，它会自行触发它。你以前能做的任何事都没有失效：model-invocation 只是*增加*了 agent 的可达范围，从不移除你的，所以 `/wizard` 的行为和以前完全一样。改变的是它淘汰的一种失败模式：agent 在构建中途撞上凭据墙，把六条编号步骤倒进聊天，让你手动照着做。

**它以前在 `in-progress/`，现在在哪？**

从 v1.2 起在 `engineering/`。它从 beta bucket 毕业，现在随 plugin 一起发布，所以它和其余转正的一套一起到达，而不需要单独安装。它的行为在毕业时没有改变。

## 它正常工作的标志

- 在任何脚本存在之前，你会看到一份有序的 stages 列表、每个 stage 产出的值，并被要求确认。
- 每个 URL 都在索取该页面的值之前被打开。你永远不会被要求粘贴一个没被派去取回的东西。
- Secrets 是盲打的。任何敏感内容都不会回显到你的 scrollback 里。
- 每个 stage 都恰好装进一个屏幕。你仍然需要的东西不会滚出视野。
- Ctrl-C 后重跑会从你停下的地方接续，把已保存的值作为默认值提供出来。
- 最后一块屏幕列出它写了什么，并单独列出它做不到、需要你手动完成的部分。

## 它在整体中的位置

`wizard` 是一个随时可用的 standalone，坐在自动化停止、人类必须点击的那条线上。它最近的邻居是 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)，因为两者都是为了把 repo 弄到可工作状态：那一个配置的是这套 skills，而 `wizard` 为其他一切生成 setup 路径。它还与 [implement](https://aihero.dev/skills-implement) 配对：当一次 build 落地一个需要凭据或手动切换的 feature 时，wizard 就是完成人类那一半的方式。当你不确定哪个 skill 适合当下时刻时，[ask-matt](https://aihero.dev/skills-ask-matt) 为你引路。