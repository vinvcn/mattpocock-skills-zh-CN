---
name: to-spec
description: "把当前对话转成 spec 并发布到项目 issue tracker——不做访谈，只综合已经讨论的内容。"
disable-model-invocation: true
---

这个 skill 使用当前 conversation context 和 codebase understanding 产出 spec。**不要**访谈用户，只综合你已经知道的内容。

Issue tracker 和 triage label vocabulary 应该已经提供给你；如果没有，请让用户运行 `/setup-matt-pocock-skills`。

## Process

1. 如果还没有探索 repo，先探索它以理解 codebase 当前状态。在 spec 中始终使用项目 domain glossary vocabulary，并遵守相关 ADRs。

2. 草拟你准备在哪些 seams 上测试这个 feature。优先使用现有 seams，而不是新增 seams。使用尽可能高层的 seam。如果确实需要新增 seams，尽可能在最高层提出。

Seams 越少越好，理想数量是一个。与用户确认这些 seams 是否符合预期。

3. 使用下面模板写 spec，并发布到项目 issue tracker。应用 `ready-for-agent` triage label；不需要额外 triage。

<spec-template>

## Problem Statement

用户正在面对的问题，从用户视角描述。

## Solution

问题的解决方案，从用户视角描述。

## User Stories

一份很长的编号 user stories 列表。每条 user story 使用以下格式：

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

这份 user stories 列表应该非常完整，覆盖 feature 的所有方面。

## Implementation Decisions

已作出的 implementation decisions 列表。可以包括：

- 将 build/modify 的 modules
- 将 modify 的 module interfaces
- 来自 developer 的技术澄清
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

不要包含具体 file paths 或 code snippets。它们可能很快过时。

例外：如果 prototype 产出的 snippet 比 prose 更精确地编码了某个决策（state machine、reducer、schema、type shape），可以内联到相关 decision 中，并简短说明它来自 prototype。只保留决策密集部分，不要放完整 working demo。

## Testing Decisions

已作出的 testing decisions 列表。包括：

- 什么是好测试的描述（只测试 external behavior，不测试 implementation details）
- 哪些 modules 会被测试
- 测试的 prior art（即 codebase 中类似类型的 tests）

## Out of Scope

本 spec 范围外事项的描述。

## Further Notes

关于 feature 的其他 notes。

</spec-template>
