# 参与贡献（Contributing）

这个仓库是 [`mattpocock/skills`](https://github.com/mattpocock/skills) 的**简体中文本地化版**。我们按“内容刷新”的方式同步上游：只翻译自然语言说明，保留目录名、skill name、命令、代码块、路径和各类 identifiers。

欢迎你帮忙提升翻译质量。**你的贡献不是一次性的**——本仓库会持续从上游同步，而你沉淀下来的术语裁决、翻译约定和既有译文，会在每一次未来同步中被复用。

## 你可以怎么帮忙

有三种方式，按“对未来同步的杠杆”从高到低：

### 1. 扩充术语表（最高杠杆）

术语比句子稳定得多：上游内容会变，术语基本不变。每在 [`TRANSLATE_GLOSSARY.md`](./TRANSLATE_GLOSSARY.md) 里多登记一条裁决，未来每次同步就少一个临时决定、少一处不一致。翻译工具（`.skills/translate-skill/SKILL.md`）在每次刷新时都会查这份术语表。

这也是最好的 **good-first-issue**：认领“给某个高频词登记裁决”即可。

### 2. 翻译同步增量（delta）

每次上游刷新后，运行工作清单脚本，只翻译**相对上次同步点有变化**的内容；稳定内容的既有译文自动保留：

```bash
git fetch upstream
node scripts/sync-worklist.mjs <上次同步的上游SHA> upstream/main
```

清单会按 bucket 分组列出“新增 / 变更 / 移除”的 `.md` 文件，并标注是“需首次翻译”还是“需更新既有译文”。认领你感兴趣的条目即可。

### 3. 审计与修复翻漏

运行覆盖审计，定位正文里残留的英文：

```bash
node scripts/audit-coverage.mjs
```

它会报告高频英文术语（术语表扩表候选）和 function-word 残留（意味着“整句英文没翻译”），并按文件排出密度。挑一个密度高的文件，把残留英文翻成中文、或把术语登记进术语表。

## 翻译规则

翻译前先读 [`.skills/translate-skill/SKILL.md`](./.skills/translate-skill/SKILL.md)。核心原则：

- **翻译**自然语言 prose；**原样保留**目录名、skill name、slash command、CLI 命令、代码块、inline code、路径、package/tool/API identifiers、frontmatter key、URL 和行为关键 labels。
- 安装命令里的 repo 路径统一保持 `vinvcn/mattpocock-skills-zh-CN`。
- recurring 术语的译法**对照 [`TRANSLATE_GLOSSARY.md`](./TRANSLATE_GLOSSARY.md)**；默认保留开发者通用的工程 / 领域术语为英文。
- 拿不准是否行为关键时，**保留并标记**（fail-closed），不要擅自改写。

## 如何认领任务

1. 查看带 **`translation`** label 的 [issues](https://github.com/vinvcn/mattpocock-skills-zh-CN/issues?q=label%3Atranslation)。
2. 在想认领的 issue 下评论（例如“我来做这个”），避免重复劳动。
3. 对于同步增量，也可以在 `sync-worklist` 输出的条目 `[ ]` 里填上你的用户名。

## 如何给术语表加一条词条

在 [`TRANSLATE_GLOSSARY.md`](./TRANSLATE_GLOSSARY.md) 对应的表里加一行，五列：

| 英文术语 | 统一译法 / 裁决 | 来源文档 | 避免（_Avoid_） | 说明 |
|---|---|---|---|---|
| `example term` | 保留英文 或 指定中文 | `docs/.../xxx.md` | 不该用的译法 | 一句话说明 |

- 保留英文的词，`统一译法 / 裁决` 写 `保留英文`，并在 `避免` 里列出别去翻成的中文。
- 若某个词在 `description:` 里有刻意的中文写法而正文保留英文，在 `说明` 里注明。

## 提交前自检

```bash
node scripts/check-translation.mjs   # 结构 / frontmatter / install path / license invariants
node scripts/audit-coverage.mjs      # 翻译覆盖画像（advisory）
```

## 为什么这对未来同步有益

- **术语表增长** → 每次 `translate-skill` 刷新都从更完整的裁决出发，更快、更一致。
- **delta 工作清单** → 贡献者不重复翻译稳定内容，既有译文跨同步保留。
- **周期性审计** → 翻漏被自动发现并修复，质量只升不降。

感谢你的参与 🙏
