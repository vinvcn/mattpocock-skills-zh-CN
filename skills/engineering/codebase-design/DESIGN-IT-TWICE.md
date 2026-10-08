# 设计两次

当用户想为某个 deepening candidate 探索 alternative interfaces 时，使用这个并行 sub-agent pattern。它基于 Ousterhout 的 "Design It Twice"：你的第一个想法很可能不是最好的。

使用 [SKILL.md](SKILL.md) 中的词汇：**module**、**interface**、**seam**、**adapter**、**leverage**。

## 流程

### 1. 框定问题空间

在启动 sub-agents 之前，先为选中的 candidate 写一段面向用户的问题空间说明：

- 新 interface 需要满足的 constraints
- 它会依赖哪些 dependencies，以及这些 dependencies 属于哪一类（见 [DEEPENING.md](DEEPENING.md)）
- 一个粗略的 illustrative code sketch，用来让 constraints 具体化；这不是 proposal，只是帮助理解约束

把这些展示给用户，然后立即进入 Step 2。用户可以一边读一边思考，sub-agents 同时并行工作。

### 2. 启动 sub-agents

并行启动 3+ 个 sub-agents。每个都必须为 deepened module 产出一个 **radically different** interface。

给每个 sub-agent 单独的 technical brief（file paths、coupling details、来自 [DEEPENING.md](DEEPENING.md) 的 dependency category、seam 后面是什么）。这个 brief 独立于 Step 1 的用户-facing problem-space explanation。给每个 agent 不同的 design constraint：

- Agent 1: "Minimize the interface - aim for 1-3 entry points max. Maximise leverage per entry point."
- Agent 2: "Maximise flexibility - support many use cases and extension."
- Agent 3: "Optimise for the most common caller - make the default case trivial."
- Agent 4（如适用）: "Design around ports & adapters for cross-seam dependencies."

Brief 中同时包含 [SKILL.md](SKILL.md) vocabulary 和 `GLOSSARY.md` vocabulary，确保每个 sub-agent 的命名同时符合 architecture language 和项目 domain language。

每个 sub-agent 输出：

1. Interface（types、methods、params，以及 invariants、ordering、error modes）
2. Usage example，展示 callers 如何使用它
3. Implementation 在 seam 后隐藏了什么
4. Dependency strategy 和 adapters（见 [DEEPENING.md](DEEPENING.md)）
5. Trade-offs：leverage 哪里高，哪里薄

### 3. 展示并比较

顺序展示各个 designs，让用户能逐个吸收，然后用 prose 比较。按 **depth**（interface 上的 leverage）、**locality**（change 集中在哪里）和 **seam placement** 对比。

比较后，给出你的推荐：你认为哪个 design 最强，以及为什么。如果不同 designs 的元素可以组合，提出 hybrid。要有观点；用户需要强判断，不是菜单。
