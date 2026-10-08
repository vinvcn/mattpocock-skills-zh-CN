# Skill 机制

[`writing-for-agents`](SKILL.md) 的 skill 专属分支：当文档是一个 skill 时会有什么不同：frontmatter、invocation 选择以及 router skills。关于写作的其他一切都是 `SKILL.md` 中的通用 reference。

## 调用

两种选择，交易两种 load：

- **Model-invoked** skill 保留 `description`，所以 agent 可以自主触发它，其他 skills 也能触达它。你仍然可以手动输入它的名称：model-invocation 总是 _包含_ 用户触达；description 只会增加 agent 发现，从不移除人类的那份。description 是 skill 的顶层 context pointer，被迫始终加载，以永久的 context load 换取可发现性。一个内容全是 reference 的 model-invoked skill 也是 shared reference 的一个归属：另一个 skill 可以调用它，所以被多个 skills 需要的 reference 可以住在同一处。机制：省略 `disable-model-invocation`，并写一个 model-facing description，承载触发 branches（`SKILL.md` 中的 pointer-writing 规则完整适用）。
- **User-invoked** skill 把 description 从 agent 的触达范围中拿掉：只有人类输入它的名称才能调用它，其他 skill 也不能。零 context load，但它会花 cognitive load：你是那个必须记得它存在的 index。机制：设置 `disable-model-invocation: true`；`description` 变成人类可见的：一行摘要，去掉触发列表。

只有当 agent 必须自行触达该 skill、或另一个 skill 必须触达它时，才选 model-invocation。如果它只会被手动触发，就做成 user-invoked，不付 context load。

两个 user-invoked skills 都需要的 shared reference 放在谁那里都不行：没有 descriptions，谁都触发不了谁。把它推到 skill system 之外的普通文件中：任何 skill 都能指向的 external reference。

## 按 invocation 拆分

invocation 上的切分（sequence 切分在 `SKILL.md` 中）：当你有一个应独立触发它的 distinct leading word 时（一个你确实在自己的 prompts 里用到的触发词），或另一个 skill 必须触达它时，拆出一个 model-invoked skill。你为新的始终加载的 description 支付 context load，所以那份独立触达必须值得。

## Router skills

当 user-invoked skills 多到你记不住时，堆积的 cognitive load 由一个 **router skill** 来治疗：一个 user-invoked skill，负责命名其他 skills 以及何时伸手去取每一份，这样人类只需记住一个 skill，而不是许多个。它只能提示，绝不触发它们：user-invoked skills 没有 description，所以除了人类，没有任何东西能触达它们。