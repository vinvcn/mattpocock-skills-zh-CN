# English 覆盖分析报告

> 生成日期：2026-08-12。目的：查清仓库正文（translatable prose）中残留的英文术语与英文句子，评估翻译覆盖情况，为 `TRANSLATE_GLOSSARY.md` 扩表提供依据。

## 范围与方法

- 范围：98 个 git-tracked `.md` 文件（排除 `LICENSE.zh-CN.md`、`.claude/worktrees/`、未跟踪的 `.agents/skills/` 与 `research/`）。
- 按 `.skills/translate-skill/SKILL.md` 的 coverage 规则剥除不可翻译区：frontmatter、fenced code blocks、inline code、图片、链接 URL（保留链接文字）、裸 URL、文件路径、slash command、skill names。
- 对剩余正文提取英文 token，按词频排序；并单独统计 **function words**（the/and/when/what…）——它们不属于领域术语，出现即意味着**未翻译的英文句子**。

## 结论（TL;DR）

仓库**只部分本地化**，且存在两种不同性质的英文残留：

1. **守住“保留英文”策略的领域术语**（主体）：剥离后正文仍有约 **15,126 个英文内容 token**，共 **2,436 个不同词**。当前 53 词术语表只覆盖了其中最高频的一小部分（约 30 个词条命中 top 词频），词汇量远超术语表。
2. **未翻译的英文句子/片段**（翻漏）：正文残留 **848 个 function words**（本地化内容，不含刻意用英文的 translate-skill），集中在约 15 个文件里。这是“译文里夹着整句英文”的翻漏，不是术语问题。

## 未翻译英文句子最集中的文件（function-word 密度）

| func# | func% | 文件 |
|---|---|---|
| 108 | 20% | `.skills/translate-skill/SKILL.md`（刻意英文） |
| 47 | 16% | `skills/in-progress/writing-shape/SKILL.md` |
| 40 | 10% | `docs/engineering/codebase-design.md` |
| 39 | 12% | `skills/engineering/code-review/SKILL.md` |
| 31 | 10% | `skills/engineering/prototype/UI.md` |
| 29 | 20% | `skills/engineering/domain-modeling/ADR-FORMAT.md` |
| 29 | 11% | `skills/engineering/prototype/LOGIC.md` |
| 24 | 5% | `skills/engineering/wayfinder/SKILL.md` |
| 23 | 4% | `README.md` |
| 23 | 14% | `skills/engineering/ask-matt/PHASE-BOUNDARIES.md` |
| 21 | 8% | `docs/engineering/setup-matt-pocock-skills.md` |
| 20 | 6% | `docs/engineering/diagnosing-bugs.md` |
| 19 | 11% | `skills/engineering/triage/OUT-OF-SCOPE.md` |
| 17 | 15% | `skills/engineering/domain-modeling/SKILL.md` |
| 14 | 8% | `docs/productivity/grilling.md` |

> function% = 该文件剥离后英文 token 中 function words 占比。占比越高，说明越像“整段英文没翻”，而不是“中译里夹术语”。

## 高频内容词（freq≥10，共 307 个）——术语表扩表候选

按词频降序，前 60 个为代表：

```
agent(299) session(202) issue(201) ticket(194) spec(163) skills(151) repo(145)
tracker(139) context(129) tickets(120) interface(115) map(115) seam(108) module(108)
test(103) code(80) bug(79) implementation(79) decision(76) tests(72) issues(71)
codebase(71) loop(71) model(66) state(64) branch(58) github(57) phase(55)
decisions(54) domain(53) glossary(51) adr(50) markdown(49) label(49) seams(49)
file(48) frontier(48) reference(47) diff(47) review(45) source(45) commit(45)
user-invoked(44) flow(44) feature(43) build(42) working(42) claude(41) deep(41)
files(40) main(39) scope(38) pointer(38) questions(37) primary(37) beat(37)
grounded(37) package(36) adrs(36) brief(36)
```

完整清单可用 `node scripts/audit-coverage.mjs --min-freq 1` 复现（该脚本即本报告的分析工具）。

## 与当前 53 词术语表的差距

- 当前 53 词表覆盖了最高频的约 30 个核心词（skill/agent/session/issue/ticket/spec/tracker/context/interface/seam/module/test/branch/domain/adr/frontier/grilling/triage…）。
- 但高频候选有 **307 个（freq≥10）**、全量有 **2,436 个**，且混有大量工具/专名（markdown/diff/review/commit/github/gitlab/html/config…）与普通英文词（working/feature/build/file…）。
- 结论：**“一个词一条裁决”的术语表思路，无法也无必要覆盖到 2,436 的量级。** 术语表应继续做“决策型 + 易混型”的精选集合；真正的两件事是——(1) 收紧/明确 keep-English 边界，避免整句英文；(2) 对上述 ~15 个文件做一次翻译补齐。

## 建议

1. **术语表保持精选**，但补上本报告 top 高频里遗漏的、确有“中英摇摆”的词（如 `phase`、`state`、`build`、`release`、`scope`、`review`、`commit`、`merge`、`loop`、`shallow/deep`、`adapter`、`flow`、`map`、`root`、`boundary`、`entry`、`fog`、`glass`…）。
2. **另起“翻译补齐”工作**：对 function-word 密度高的 ~15 个文件，把残留英文句子翻成中文（这是翻漏，不是术语问题）。
3. 若想进一步压缩英文量，可收紧 keep-English 策略（例如只在“首次出现标英文、后文用中文”时保留，或限定保留词表）。