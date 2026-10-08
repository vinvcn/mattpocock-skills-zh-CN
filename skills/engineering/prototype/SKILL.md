---
name: prototype
description: 构建一次性原型来回答一个设计问题。适用于用户想验证某个 state model 或 logic 是否感觉对，或探索 UI 应该长什么样时。
---

# 原型

Prototype 是**用来回答一个问题的 throwaway code**。问题决定形状。

## 选择分支

先识别正在回答哪个问题：来自用户 prompt、周围代码，或在用户在线时直接询问：

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md)。构建一个单一、可分享的 HTML 文件（free-play buttons 加 tabbed guided walkthroughs），推动 state machine 跑过纸面上难以推理的 cases，而且非开发人员也能驱动它。
- **"What should this look like?"** → [UI.md](UI.md)。在单一路由上生成几种差异很大的 UI variations，并通过 URL search param 和浮动底栏切换。

这两个分支会产出非常不同的 artifacts；选错会浪费整个 prototype。如果问题确实模糊且用户不可达，默认选择更匹配周围代码的分支（backend module → logic；page 或 component → UI），并在 prototype 顶部说明假设。

## 两个分支通用的规则

1. **从第一天就是 throwaway，并明确标记。** Prototype code 要靠近它实际会被使用的位置（放在被 prototype 的 module 或 page 旁边），这样上下文清楚；但命名要让随手读代码的人看出它是 prototype，不是 production。对 throwaway UI routes，遵守项目现有 routing convention；不要发明新的顶层结构。
2. **运行毫无负担。** UI prototype 从项目 task runner 中的一条命令启动：`pnpm <name>`、`python <path>`、`bun <path>` 等。Logic demo 则是用户双击即可打开的单个 HTML 文件。无论哪种，启动都不需要动脑。
3. **默认不持久化。** State 保存在内存中。Persistence 是 prototype 要_检查_的东西，不该成为依赖。如果问题明确涉及 database，就用 scratch DB 或带有清晰 “PROTOTYPE, wipe me” 名称的本地文件。
4. **跳过 polish。** 不写 tests，不做超过“能跑起来”所需的 error handling，不做 abstractions。重点是快速学到东西。
5. **暴露 state。** 每次 action（logic）或每次 variant switch（UI）后，打印或渲染完整相关 state，让用户看到发生了什么变化。
6. **完成后 capture。** 把验证过的 decision 折进真实 code，然后把 prototype 本身作为 **primary source** 保存：commit 到 main 之外的 throwaway branch，并在 implementation issue 上留下指向该 branch 的 context pointer。同时在 issue 或 commit 中 capture answer，也就是 verdict 与它解决的问题。Main branch 只保留验证过的 decision。
