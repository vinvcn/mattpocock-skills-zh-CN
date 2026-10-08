## 它做什么

`teach` 把你运行它的那个目录变成一个常设的教学 workspace，并在多个 [sessions](https://www.aihero.dev/ai-coding-dictionary/session) 中教你一个主题，以简短、自包含的 HTML 课程的形式。

它不从 [model](https://www.aihero.dev/ai-coding-dictionary/model) 已经知道的东西教学。[Parametric knowledge](https://www.aihero.dev/ai-coding-dictionary/parametric-knowledge) 被视为不可信：在它教学之前，它去寻找高可信度的资源，把它们记录在 `RESOURCES.md` 里，并在每一节课内部引用它们。另一个结构性事实是它是 [stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) 的：mission、resources、lessons 和你学过什么的记录都以文件的形式存在于目录中，所以下一个 session 从那些文件接续，而不是从上一段对话剩下的任何东西接续。

## 何时使用

你通过输入 `/teach` 来调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。

当学习本身就是那个 project 时用它：一门语言、一个框架、一个你刚加入的 codebase、瑜伽、shaders、一个认证。它不是为了一次顺带解释而准备的工具。

| 你想要什么 | 拿什么 |
| --- | --- |
| 在数周内学习一个主题，sessions 会累积 | `teach` |
| 一个在你已经身处其中的 session 里被解释的想法 | 直接在那个 session 里问 |
| agent 的上一条消息因为没讲明白而换个角度重讲 | [wait-what](https://aihero.dev/skills-wait-what) |
| 磨砺你已有的思考，而不是获取新材料 | [grill-me](https://aihero.dev/skills-grill-me) |
| 一个后台 agent 去读 [primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source) 并给你留一份带引用的文档 | [research](https://aihero.dev/skills-research) |
| 学习某个在 grilling 中途冒出来的东西，而不让 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 脱轨 | [handoff](https://aihero.dev/skills-handoff) 到一个教学 workspace，然后在那里 `teach` |

## 前置条件

`teach` 构建一个目录，而不是产出一份文件，而且这个 skill 假设每个 workspace 一个 mission，所以请在一个你乐意把它交给单一主题的地方运行它。把它放在你正在工作的 project 之外：一个独立的 repo 是推荐的家，而不是一个全局的 `~/.learnings/` 文件夹或工作项目本身。一个专用的 repo 也让课程可以 commit，这正是团队共享它们的方式。

在那个目录中累积的东西：

| 路径 | 它保存什么 |
| --- | --- |
| `MISSION.md` | 你为什么学这个。一切都挂在它下面；如果它缺失，`teach` 的第一件事就是访谈你，直到它不再缺失 |
| `RESOURCES.md` | 它据以教学的、经过审定的来源，分为 Knowledge 和 Wisdom（社区） |
| `lessons/*.html` | 编号的课程：教学的主要单元 |
| `reference/*.html` | 压缩的 cheat-sheets、算法、glossaries：你真正会回看的文档 |
| `learning-records/*.md` | 关于你已实证学到什么的 ADR 风格笔记，用来决定接下来教什么 |
| `assets/*` | 可复用的组件（首先是一份共享的 stylesheet），好让课程看起来像同一门课 |
| `NOTES.md` | 你声明的教学偏好 |

关于这份列表有两条诚实的说明。一份 glossary 适合大多数主题，但这个 skill 附带了一份 `SKILL.md` 不再链接到的 `GLOSSARY-FORMAT.md`，所以只有你开口要才会得到一份（[issue #559](https://github.com/mattpocock/skills/issues/559)）。而且 workspace 并不总在你预期的地方被创建，在它之上构建一个冗长的课程之前，先看下面的第一个问题。

## 存储强度，而非流利度

用来思考的词是 **storage strength**：长期保持，与之相对的是 **fluency**，那种当你阅读时感觉像精通、一周后就消失的当下回忆。`teach` 通过可取的难度（desirable difficulty）来构建前者：retrieval practice、spacing、interleaving。知识先行，在那里难度是敌人，因为它会吞噬你用来理解的 working memory；然后 skill 通过一个紧密的反馈 loop 被反复操练，在那里难度是工具。

有两件事引导你学到什么。**mission**（你想要它的具体现实理由）为每一节课提供 grounding；没有它，课程会漂移成抽象，也没有任何东西决定接下来是什么。从 mission 和 learning records 出发，`teach` 在你的 **zone of proximal development**（最近发展区）内挑选下一节课：挑战性足以需要努力，又不会超前到无法学习。

这也是为什么这个 skill 会回推而不是迁就。一个需要 **wisdom**（现实世界判断）的问题，会得到一个尝试性的回答，然后是一个指向你能去检验它的社区的指针。一个 quiz 是一道关卡，而不是一种形式：一位用户报告说了一句「非常感谢」，结果被告知操练仍然在进行中。

## 课程、参考文档与组件

一份 **lesson** 是一个自包含的 HTML 文件，短到一口气就能读完，与 mission 相连，给出一个实实在在的收获。它引用它的来源，推荐一份你自己去读的 primary source，并链接到兄弟课程和 reference 文档。

值得知道的分野：课程很少被重读，reference 文档会。所以一份课程的压缩精华（syntax 表、算法、体式序列、glossary）属于 `reference/`，而不是埋在引入它的课程里。

课程由 `assets/` 中的 **components** 构建：stylesheets、quiz 小组件、simulators、diagram 辅助工具。复用是默认。agent 在撰写课程前会读取 `assets/`，并基于那里已有的东西构建，而任何第二个课程可能用到的新的东西都会被写成 component，而不是内联。共享的 stylesheet 是每个 workspace 挣得的第一个 component；正是它阻止输出变成一堆一次性作品。

## 常见问题

**它把文件放哪里了？我的最后落在了 `~/.claude/skills`。**
一个真实、未修复的 bug（[#377](https://github.com/mattpocock/skills/issues/377)）。`SKILL.md` 同时为两个不同的根使用 `./`：`./MISSION-FORMAT.md` 及其兄弟文件确实紧挨着已安装 skill 中的 `SKILL.md`，而 `./lessons/`、`./reference/`、`./learning-records/` 和 `./assets/` 本意是在你的目录里。一个针对 skill 的安装目录解析第一类的 agent，会继续在那里解析第二类，并把你的课程写进 skill 文件夹。在它之上构建之前，先检查第一节课落在了哪里，并在开始时显式地说出目录名，而不是依赖「当前目录」被理解。

**我是留在同一个 session 里，还是每节课开一个新的？**
三种做法都行：留在同一个 session、在一个新的 session 里重新调用 `/teach`、或者在同一个文件夹里开一个新的 session。每节课都是它自己的一次调用。Folder 才是连续性，而不是那段对话。常见做法是在 workspace 里开一个全新的 session，然后说 `/teach next lesson for <topic>`。

**我怎么知道它没有在教我它编造的东西？**
单凭 skill 的话，你无法知道。你要去读 primary sources。`teach` 还没有可靠到可以不检查就信任，任何建立在 LLM 之上的 skill 也不行。Grounding 机制（`RESOURCES.md`、每一节课里的引用、每节课一份推荐的 primary source）是为了让验证变得便宜，而不是为了消除验证的需要。这个失败不是假设性的：一位学习 2x2 魔方的用户拿到了编造的、解法不对的转动序列。针对这类案例的诊断清单是 model、harness、effort，以及来源是什么。在不精确记号的程序性领域风险最高，而在输出可以立即验证的地方风险最低，比如你能运行的代码。

**正确的 quiz 答案总是第一个选项。**
这一点在 Sonnet、Opus 和 GLM 上都被好几个人证实过，而且仍未修复。`SKILL.md` 现在要求每个答案字数相同，这去掉了一个不同的破绽（正确答案过去是唯一一个推理完整的），但它对位置只字未提。一位贡献者测试了一个针对位置的 instruction 级修复，报告说正确的答案在九个课程中仍 33 次里 33 次落在 A 位置（[#335](https://github.com/mattpocock/skills/issues/335)），这指向 `assets/` 中一个打乱顺序的 quiz component 才是真正的修复，而不是更好的措辞。在那发布之前，把答案位置看作无意义的。你的 `assets/` 目录由你自由更改，所以要求一个在渲染时打乱顺序的 component 是一个合理的本地修复。

**它假设我已经知道一些东西，还使用它从未定义过的术语。**
这是最常见的实质性抱怨。没有评估步骤：`teach` 从 mission 和 learning records 推断你的水平，而在第一个 session 里并没有 learning records。一位在 wayfinder pipeline 内运行它的用户说得直白：「它从未做 grilling 来确定我的起点，所以它对我已经知道的东西做了大量假设。」另一位报告课程依赖未定义的术语，还有一份针对他们硬件的课程只讲了硬件能做什么，却从没说它不能做什么。有两件事有帮助：在第一条消息里说明你的既有知识和你的缺口，并在课程没讲对时大声纠正那个水平，因为纠正会变成一条 learning record，并引导下一节课。一个显式的知识评估步骤是一个长期存在的 feature request（[#725](https://github.com/mattpocock/skills/issues/725)），而不是已发布的行为。

**它会做 spaced repetition 吗，以及它知道什么时候停止教学吗？**
第一个没有，第二个不太可靠。Spacing 和 interleaving 是课程设计所依据的原则，但没有任何东西会安排复习，也没有 Anki 或日历集成；两者都是反复出现的请求。相关的缺口是退出标准：正如一位用户所说，`teach`「擅长制作下一节课，但不太擅长知道何时停下来切换到复习或真实练习。」如果你想要复习或操练而不是新内容，就开口要；这个 skill 不会自己提议切换。

**它只对代码有用吗？**
不，而且非代码的用途占了记录的大头：韩语、日语的正式语体、钢琴、吉他、桌游设计、OpenSCAD、电影剧情、Azure 和 CCNA 认证、大学考试，以及八岁和十岁的孩子拿到关于密室逃脱和火蠑螈的可打印书。这个 skill 里没有任何编程特有的东西：mission、resources、zone of proximal development 和操练在任何领域都以同样的方式运作。在代码范围内，被报告的最强用途不是从零学一门语言，而是在一个不熟悉的 codebase 或新手团队的 stack 里找到方向。

**我应该用哪个模型运行它？**
没有标准答案，而且被报告的差异很大。更高的 [reasoning effort](https://www.aihero.dev/ai-coding-dictionary/effort) 被报告为能产出比 medium 设置明显更好的课程。一位用户用 Codex 通过 Copilot CLI 运行同一个 skill，得到一个 30 行的 HTML 卡片，而 Claude Code 则产出一份完整的课程。它在 Claude Cowork 中无需修改即可运行，取决于你的组织是否允许在那里添加 skills。如果课程出来很单薄，在重写你的 prompt 之前，先换模型、[harness](https://www.aihero.dev/ai-coding-dictionary/harness) 或 effort。

## 它正常工作的标志

- 它在空目录里做的第一件事是访谈你为什么想要这个，而不是产出课程。
- `RESOURCES.md` 在课程之前就被填满，而每节课都点名一份值得你自己去读的 primary source。
- 课程中的论断都带有外链。一份没有引用的课程，是这个 skill 在凭记忆教学。
- 一节课只占一次坐下的时间，并让你能做一件你之前做不到的事。
- 在文件夹里打开一个新的 session 并说「next lesson」，会继续这门课，而不是重启它。
- `learning-records/` 在增长，而课程不再重复你已经证明会的东西。
- 课程看起来像同一门课：它们链接 `assets/` 里的 stylesheet，而不是各自带一份。
- 一个需要判断的问题会让你被指向一个 forum、subreddit 或课堂，而不只是一个答案。

## 它在整体中的位置

`teach` 是一个**随时可调用的 standalone**。它不是 build chain 中的一步，也不与 engineering flow 共享任何 artifact；它拥有自己的目录，并在主题持续期间驻留其中。

它唯一的真正邻居是 [handoff](https://aihero.dev/skills-handoff)，经由 Matt 命名为「如果我在 grilling 中被问到我不明白的东西该怎么办」这一问题的答案的组合：不要为了学习而停止 grilling：`/handoff` 到一个教学 workspace，在那里用 `/teach` 学习它，然后回去从你停下的地方接着干。近旁的替代方案是 [research](https://aihero.dev/skills-research)，用于你想要的是一份带引用的文档而不是课程和保持时。当你不确定哪个 skill 或流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会带你路由过整个集合。