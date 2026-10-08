> **已归档。** 这个 skill 已在 v1.3.0 中从 plugin 移除，不再维护。没有任何东西取代它：agent 会在没有专门 skill 的情况下自行处理完 merge 或 rebase conflict。本页面保留仅供参考。

## What it does

`resolving-merge-conflicts` 逐个 hunk 地处理正在进行的 git merge 或 rebase，然后运行项目自己的检查，并以一次 commit 完成整个操作。

它拒绝把 conflict 当成文本问题。在触碰一个 hunk 之前，它会把每一侧追溯回其 **[primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)**（commit message、PR、原始 issue），因此它是在两个 intent 之间做选择，而不是在两段文本之间做选择，并且在两者兼容的地方同时保留双方。在它们确实互不相容的地方，它选择与 merge 所声明目标相符的那一侧，并明确说出其中的取舍。它绝不发明新的行为来粉饰冲突，`--abort` 也不是它拥有的选项：merge 总是被一路推进到一个完成的 commit。

## When to reach for it

输入 `/resolving-merge-conflicts`，或者当任务合适时由 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 自动触发。

当 git 已经在它自己无法解决的 conflict 上停下来时使用它。它针对的是你眼前的这个 conflict，而不是它两侧的任何东西：

| 你的处境 | Skill |
| --- | --- |
| merge 或 rebase 中途，树上带有冲突标记 | 本 skill |
| merge 已经完成，现在有东西因为你看不出的原因在出问题 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |
| 规划如何切片工作，让 branches 更少冲突 | 两者都不用，见下面的 parallel-work 问题 |

## Primary sources over `ours` and `theirs`

这个 skill 存在所要消灭的失败模式，是按旗标来合并：`--ours`、`--theirs`，或手工删除看起来不太重要的那个块，于是冲突标记消失、build 能编译通过。这种合并结果在语法上可以完美，却仍然会悄悄丢掉某人刻意做出的改动。

你无法保留一个你还没读过的 intent。所以这项工作从历史开始（commits、PRs、[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)），然后才移动到 diff。loop 中还存在另一步，出于同样的原因：这个 skill 会找到 repo 自己的 [automated checks](https://www.aihero.dev/ai-coding-dictionary/automated-check)，并在提交前运行它们，因为在 git 中，merge 是最容易产出既满足两个 branch、又都过不了各自测试的代码的地方。

## Common questions

**Claude Code 本来就很擅长自行解决 merge conflicts。为什么还需要一个 skill？**

附加价值就在于 "find the primary sources" 和 "run feedback loops" 这两步，否则每一步都得每次都手工提示。一个未经提示的 agent 通常只会凭 diff 产生一个看似合理的解决结果，然后就此打住。这个 skill 的价值在于它绝不允许 agent 跳过的那两步：阅读每一侧为什么存在，以及事后运行检查。这相对于一个优秀的 [model](https://www.aihero.dev/ai-coding-dictionary/model) 来说是一层很薄的余量，而且它本应如此：至少有一位读者预言过这是一个会随着模型变好而变成 no-op 的完整 skill。

**我应该让并行 agents 避开同一个文件，从一开始就避免 conflicts 吗？**

多数情况下不用。在并行任务之间把文件划分成区，花费要比节省的多，因为 agent 对 merge conflicts 足够好，所以这个权衡没有看起来那么严苛。值得保留的那一点纪律是：先把大型 refactor 做完。一个大型 rename 在十个 branch 从它分出之后才落地，才是始终昂贵的那个情形。

来自一份关于并行 worktrees 的用户报告有一个 caveat：当并行的 [sessions](https://www.aihero.dev/ai-coding-dictionary/session) 各自在自己的 tree 里构建一个 ticket 时，merge 回来最好由写下那份改动的 session 来做，因为它就是那个已经知道 intent 的 session。到最后把所有冲突集中到一个 agent 身上，恰恰丢掉了本 skill 第 2 步不得不去重建的 [context](https://www.aihero.dev/ai-coding-dictionary/context)。

**为什么绝不用 `--abort`？**

Abort 会丢掉已完成的解决工作，并在你下次尝试时把你送回到同一个、未改变的 conflict。这个 skill 是为 merge 注定要发生的情形而写的。如果你已经决定它不该发生，那是一个在调用之前就该做的决定，而不是 loop 内部的一个分叉。

## It's working if

- agent 在解决时引用 commits、PRs 或 issues 给你看，而不只是 diff hunks。
- 每个 hunk 最终都保留双方的行为，或者带有一条明确说明丢掉了什么、为什么丢掉的注释。
- 结果中没有出现任何两个 branch 上都不存在的东西。
- Typecheck、tests 和 format 被找到，并在提交**之前**、而不是在你注意到有东西坏了之后跑出绿色。
- 你以一棵干净的树结束，操作已完成，包括 multi-commit rebase 中剩余的每一个 commit。

## Where it fits

一个可随时调用的 standalone，不依赖任何其他 skill：它在 git 卡住时开始，在树干净并已提交时结束。它唯一的真正邻居是 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)，后者在 merge 干净解决、但合并后的代码行为异常时接管：那是一个诊断问题，而不是 conflict 问题。它完全处在 main idea-to-ship flow 之外，所以 [ask-matt](https://aihero.dev/skills-ask-matt) 是了解它前后该运行什么的 map。