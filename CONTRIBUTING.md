# 参与贡献（Contributing）

这个仓库是 [`mattpocock/skills`](https://github.com/mattpocock/skills) 的**简体中文本地化版**。我们按“内容刷新”的方式同步上游：只翻译自然语言说明，保留目录名、skill name、命令、代码块、路径和各类 identifiers。

欢迎你帮忙提升翻译质量。**你的贡献不是一次性的**——本仓库会持续从上游同步，而你沉淀下来的术语裁决、翻译约定和既有译文，会在每一次未来同步中被复用。

## 一致性底线：术语表是唯一裁决来源

[`TRANSLATE_GLOSSARY.md`](./TRANSLATE_GLOSSARY.md) 是唯一裁决来源，规则是**二元的**：

- **在表内** → 保留英文，不翻译。
- **不在表内** → 翻译成中文。

不存在中间态：一个词要么在表里（保留英文）、要么不在（翻译），同一术语绝不在不同文件里中英混用。这正是术语表能当一致性看门人的原因。

边界只通过两种方式移动——**加入**与**移除**。因此每次加入 / 移除都是一次正式决定，是本仓库的**决策资产**，必须在 issue / PR 里留痕。

## 维护者如何操作

- **加入（add）**：把某词登记为「保留英文」。这是前瞻性决定——**加入时跳过对既有出现处的翻译**，不回溯处理存量内容（存量对齐是独立的后续步骤）。
- **移除（remove）**：把某词从保留列表拿掉，意味着它从今往后应该被翻译。移除会**触发一次全仓库扫描，把每个出现处都翻成中文**，再删掉词条；这是大工作量操作，必须有计划地执行。

## 贡献者如何参与

有三种方式，按“对未来同步的杠杆”从高到低：

### 1. 提交翻译请求

你可以提交翻译请求，来源有两种：

- **上游同步增量**：相对上次同步点有变化的内容（见「翻译同步增量」一节）；
- **现有未翻译片段**：正文里残留的英文句子 / 词。

请求会变成带 `translation` label 的 ticket，认领后开工。

### 2. 承接翻译 ticket

翻译工作走「**加入术语表门禁**」：翻译中遇到希望保留英文的 recurring 术语，把裁决登记进术语表，**由 owner 批准**后才能合入。也就是说，翻译 PR 里的术语表改动是门禁，必须 owner 签字。

### 3. 提出 / 执行「移除术语」

- 你可以**提出**移除某词（trigger remove glossary）：只要不引发 scope creep，owner 可以批准。
- 你也可以**承接**移除工作：这会触发一次全仓库扫描，把该词的所有出现处翻译掉，然后删掉词条。

## 翻译同步增量（delta）

每次上游刷新后，运行工作清单脚本，只翻译**相对上次同步点有变化**的内容；稳定内容的既有译文自动保留。

首次使用需配置上游远端（新克隆只有 `origin`，这一步只需做一次）：

```bash
git remote add upstream https://github.com/mattpocock/skills.git
git fetch upstream
```

然后生成工作清单：

```bash
node scripts/sync-worklist.mjs
```

> 上次同步的上游 SHA 记录在仓库根目录的 `.upstream-sha`，由维护者在每次同步后更新；贡献者通常不用手动传 SHA（脚本默认读取它）。

清单会按 bucket 分组列出“新增 / 变更 / 移除”的 `.md` 文件，并标注是“需首次翻译”还是“需更新既有译文”。认领你感兴趣的条目即可。

## 翻译规则

翻译前先读 [`.skills/translate-skill/SKILL.md`](./.skills/translate-skill/SKILL.md)。核心原则：

- **翻译**自然语言 prose；**原样保留**目录名、skill name、slash command、CLI 命令、代码块、inline code、路径、package/tool/API identifiers、frontmatter key、URL 和行为关键 labels。
- 安装命令里的 repo 路径统一保持 `vinvcn/mattpocock-skills-zh-CN`。
- recurring 术语的译法**对照 [`TRANSLATE_GLOSSARY.md`](./TRANSLATE_GLOSSARY.md)**：表内保留英文、表外翻译，不存在第三种选择。
- 拿不准是否行为关键时，**保留并标记**（fail-closed），不要擅自改写。

## 如何认领任务

1. 查看带 **`translation`** label 的 [issues](https://github.com/vinvcn/mattpocock-skills-zh-CN/issues?q=label%3Atranslation)。
2. 在想认领的 issue 下评论（例如“我来做这个”），避免重复劳动。
3. 对于同步增量，也可以在 `sync-worklist` 输出的条目 `[ ]` 里填上你的用户名。
4. 没有匹配的 ticket 时，可以按上文「提交翻译请求」新建一个，再认领。

## 如何给术语表加一条词条

在 [`TRANSLATE_GLOSSARY.md`](./TRANSLATE_GLOSSARY.md) 对应的表里加一行，五列：

| 英文术语 | 统一译法 / 裁决 | 来源文档 | 避免（_Avoid_） | 说明 |
|---|---|---|---|---|
| `example term` | 保留英文 或 指定中文 | `docs/.../xxx.md` | 不该用的译法 | 一句话说明 |

- 保留英文的词，`统一译法 / 裁决` 写 `保留英文`，并在 `避免` 里列出别去翻成的中文。
- 若某个词在 `description:` 里有刻意的中文写法而正文保留英文，在 `说明` 里注明。
- 词条新增属于「加入」决策，须经 owner 批准；提交时在 PR 里说明理由。

## 提交前自检

```bash
node scripts/check-translation.mjs   # 结构 / frontmatter / install path / license invariants
node scripts/audit-coverage.mjs      # 翻译覆盖画像（advisory）
```

## 为什么这对未来同步有益

- **术语表是决策资产** → 每次「加入 / 移除」都被留痕、可追溯，同一术语不会在每次同步中反复摇摆。
- **二元规则** → 「表内保留、表外翻译」没有解释空间，贡献者不需要重新判断，一致性自动成立。
- **delta 工作清单** → 贡献者不重复翻译稳定内容，既有译文跨同步保留。

感谢你的参与 🙏
