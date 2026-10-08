---
name: to-questionnaire
description: 把你无法完整回答的 decision 转成一份交给他人填写的 questionnaire。
disable-model-invocation: true
---

把用户无法独自回答的事情转成一份 **questionnaire**：一份交给某个人异步填写，或在会议中一起填写的 Markdown document。Recipient 掌握用户缺少的知识；questionnaire 要把这些知识提取出来。

**Grill the send, not the subject。** 只围绕用户始终能够回答的 _send_ 进行访谈：发送给谁，以及需要对方返回什么。Document 中的问题再针对 recipient 所知与用户所需之间的 **gap**。

1. **发送给谁？** 在一次交流中询问 recipient 的 role、expertise 和与用户的关系。这会确定 questionnaire 的语气，以及需要携带多少 context。知道 recipient 是谁，以及对方掌握哪些用户不掌握的知识后，这一步完成。

2. **需要返回什么？** 在一次交流中询问用户无法独自解决、需要此人提供的具体 decisions 或 facts。当你得到一份具体清单，明确用户最终必须能做什么或决定什么时，这一步完成。

3. **编写 questionnaire。** 根据步骤 1–2 的 gap 起草问题，并遵循下面的 Document structure。把文件写到当前目录的 `to-questionnaire-<slug>.md`（slug 来自主题），然后报告路径。当文件存在，且步骤 2 中用户列出的每项内容都有问题覆盖时完成。

## 文档结构

把 document 定位为 **discovery questionnaire**：用户缺少 context，而 recipient 掌握它。按重要程度降序排列问题，异步沟通可能只有一次机会；问题超过少量时，按主题放在 `##` headings 下。使用以下 template。

<questionnaire-template>

# <Questionnaire title>

**Purpose:** <这份 questionnaire 为什么存在，以及它关系到哪项 decision>

**From:** <用户>, **To:** <recipient>, **How your answers will be used:** <答案将用于哪里>

## Context

用一个 paragraph 帮助不了解用户思路的 recipient 建立 context。内容足以让对方认真回答，但不要写满一页。

## How to answer

说明 deadline 和大致所需时间。部分回答和“我不知道”也有价值；不确定时请标记出来，而不是直接跳过。

## <Theme heading>

每个 theme 使用一个 `##` section，问题按重要性降序排列。每个问题只包含一个 idea，绝不要组合多个问题；在正下方放 answer stub。只有问题可能被误解或得到敷衍回答时，才添加一行 _why this matters_。

<question-example>
### 系统上线时预计需要承受多大负载？

_Why this matters: 这决定我们现在就为突发流量预留资源，还是推迟处理。_

>
</question-example>

## Anything else?

最后提供一个兜底问题：还有哪些我们没问、但应该知道的内容？

</questionnaire-template>
