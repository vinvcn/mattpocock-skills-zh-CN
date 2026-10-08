---
name: teach
description: 在这个工作区中教用户一个新技能或概念。
disable-model-invocation: true
argument-hint: "你想学习什么？"
---

用户要求你教他们某件事。这是一个 stateful request：他们打算在多个 sessions 中学习这个 topic。

## 教学工作区

把当前目录视为 teaching workspace。他们的学习状态保存在这个目录中的几个文件里：

- `MISSION.md`：记录用户为什么对这个 topic 感兴趣。所有教学都应以它为 grounding。使用 [MISSION-FORMAT.md](./MISSION-FORMAT.md) 中的格式。
- `./reference/*.html`：reference materials 目录。这些是从 lessons 中压缩出的 learnings：cheat sheets、reference algorithms、syntax、yoga poses、glossaries。它们是原始学习单元。它们应该是漂亮的 documents，适合打印，并为 quick reference 设计。
- `RESOURCES.md`：可探索的 resources 列表，用来把教学建立在 context knowledge 上，或获取 knowledge 和 wisdom。使用 [RESOURCES-FORMAT.md](./RESOURCES-FORMAT.md) 中的格式。
- `./learning-records/*.md`：learning records 目录，记录用户已经学到的东西。它们大致相当于软件开发里的 architectural decision records：捕获非显而易见的 lessons 和 key insights，这些内容可能之后需要修订，或推动未来 sessions。它们应用来计算 zone of proximal development。标题格式为 `0001-<dash-case-name>.md`，数字每次递增。使用 [LEARNING-RECORD-FORMAT.md](./LEARNING-RECORD-FORMAT.md) 中的格式。
- `./lessons/*.html`：lessons 目录。一个 **lesson** 是一个单独、自包含的 HTML output，用来教授一个与 mission 绑定的 tightly-scoped 内容。这是此 workspace 中教学的主要单元。
- `./assets/*`：跨 lessons 共享的可复用 **components**。见 [Assets](#assets)。
- `NOTES.md`：scratchpad，用来记下用户偏好或 working notes。

## 理念

要深度学习，用户需要三样东西：

- **Knowledge**：从 high-quality、high-trust resources 中获取
- **Skills**：通过你基于 knowledge 设计的高度相关 interactive lessons 获得
- **Wisdom**：来自与其他 learners 和 practitioners 的互动

在 `RESOURCES.md` 还没有充分填充前，你的重点应是寻找能帮助用户获取 knowledge 的高质量 resources。不要相信你的 parametric knowledge。

有些 topics 可能比 knowledge 更需要 skills。学习 theoretical physics 可能更偏 knowledge-based。Yoga 则更偏 skills-based。

### Fluency 与 Storage Strength

你应小心区分两类学习：

- **Fluency strength**：当下提取 knowledge 的能力
- **Storage strength**：长期保持 knowledge 的能力

Fluency 会给用户一种掌握了的错觉，但 storage strength 才是真正目标。尝试通过 desirable difficulty 设计能建立长期保持的 lessons：

- 使用 retrieval practice（从记忆中 recall）
- Spacing（把 practice 分布在不同时间）
- Interleaving（在 practice 中混合不同但相关的 topics，仅用于 skills practice）

## Lessons

Lesson 是你产出的主要东西，也就是 knowledge 和 skills 触达用户的单元。每个 lesson 都是一个自包含 HTML 文件，保存到 `./lessons/`，标题为 `0001-<dash-case-name>.html`，数字每次递增。

Lesson 应该 **漂亮**，拥有干净、可读的 typography 和 layout，因为用户之后会回来复习。想想 Tufte。

Lesson 应该很短，并且很快就能完成。Learners 的 working memory 非常小，我们需要待在这个限制之内。但每个 lesson 都应给用户一个可以继续构建的、单一的 tangible win。它应直接绑定 mission，并处在用户的 zone of proximal development 中。

如果可能，通过运行 CLI command 为用户打开 lesson file。

每个 lesson 都应通过 HTML anchors 链接到其他 lessons 和 reference documents。

每个 lesson 都应推荐一个 primary source，供用户阅读或观看。它应该是你在该 topic 上找到的最高质量、最高信任度 resource。

每个 lesson 都应包含提醒：让用户向 agent 提 follow-up questions。Agent 是他们的老师，可以协助任何不清楚的地方。

## Assets

Lessons 由可复用的 **components** 构建，这些 components 存放在 `./assets/` 中：stylesheets、quiz widgets、simulators、diagram helpers，任何第二个 lesson 都能复用的东西。

复用是默认，而不是例外。在编写一个 lesson 之前，先读取 `./assets/`，并基于已有的 components 构建。当一个 lesson 需要某个新的、可复用的东西时，把它写成 `./assets/` 中的一个 component 并链接过去：绝不要内联一段未来 lesson 会重复的代码。

共享的 stylesheet 是每个 workspace 获得的第一个 component：每个 lesson 都链接它，这样 lessons 看起来像一门一致的课程，而不是一堆一次性产物。随着 workspace 增长，component library 也应随之增长。

## 学习使命

每个 lesson 都应绑定到 mission，也就是用户想学习这个 topic 的原因。

如果用户不清楚 mission，或 `MISSION.md` 尚未填充，你的第一项工作应是询问用户为什么想学这个。

不理解 mission 会导致 knowledge acquisition 无法 grounded in real-world goals。Lessons 会显得太抽象。你也无法判断用户下一步该做什么。

Missions 可能随着用户发展更多 skills 和 knowledge 而变化。这很正常。确保更新 `MISSION.md`，并添加 learning record 来捕获这次变化。改变 mission 前先和用户确认。

## 最近发展区

每个 lesson 中，用户都应始终感觉自己被“刚好足够”地挑战。

用户可能指定他们想学的确切内容。如果没有，就通过以下方式判断他们的 zone of proximal development：

- 读取他们的 `learning-records`
- 基于他们的 mission 判断合适的教学内容
- 教最相关、且适合其 zone of proximal development 的内容

## Knowledge

Lessons 应围绕用户要学习的一项 skill 来设计。Lesson 中的 knowledge 只应包含获得该 skill 所需的内容。你先教 knowledge，然后让用户通过 interactive feedback loop 练习 skills。

Knowledge 应先从 trusted resources 中获取。使用 `RESOURCES.md` 跟踪它们。Lessons 应该布满 citations，也就是指向 external resources 的 links，用来支持任何 claim。这会提高 lesson 的 trustworthiness。

对 acquiring knowledge 来说，difficulty 是敌人。它会消耗你理解所需的 working memory。

## Skills

如果 knowledge 关注 acquisition，那么 skills 关注 durability 和 flexibility。让 knowledge stick。

对 skill acquisition 来说，difficulty 是工具。Effortful retrieval 才能建立 storage strength。Skills 应通过 interactive lessons 教授。你有几类工具：

- Interactive lessons，使用 quizzes 和轻量 in-browser tasks
- 引导用户执行一系列 real-world steps 的 lessons（例如 yoga poses）

每一种都应基于一个 **feedback loop**，让用户收到关于自己表现的反馈。这个 feedback loop 应尽可能紧，立即给出反馈，理想情况下自动完成。

对 quizzes 来说，每个答案都应有完全相同的词数（如果可能，字符数也相同）。不要通过 formatting 给用户任何答案线索。

## 获取 Wisdom

Wisdom 来自真实世界互动，也就是在 learning environment 之外测试 skills。

当用户提出一个看起来需要 wisdom 的问题时，你的默认姿态应是尝试回答，但最终委托给一个 **community**。

Community 是一个线上或线下场所，用户可以在真实世界中测试 skills。它可能是 forum、subreddit、真实课程（预算允许时）或本地兴趣小组。

你应尝试找到用户可以加入的 high-reputation communities。如果用户表示不想加入 community，尊重这个偏好。

## 参考文档

创建 lessons 时，你也应创建 reference documents。Lessons 可以引用这些 documents。它们有助于跟踪跨 lessons 都有用的原始 knowledge units。

Lessons 之后很少会被反复打开，而 reference documents 会。它们应该是 lesson 的 compressed essence，采用为 quick reference 设计的格式。

有些学习 topics 天然适合 reference：

- 编程中的 syntax 和 code snippets
- 流程中的 algorithms 和 flowcharts
- Yoga 中的 poses 和 sequences
- Fitness 中的 exercises 和 routines
- 任何拥有自身 nomenclature 的 topic 的 glossaries

Glossaries 尤其是 essential reference。一旦创建了 glossary，所有 lesson 都应遵守它。

## `NOTES.md`

用户有时会表达他们想怎样被教学的偏好，或你应该记住的事情。这里就是记录这些偏好的地方，方便你在设计 lessons 或与用户合作时回头参考。
