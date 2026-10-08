# 翻译术语表

记录已决定的翻译术语与正在征集的翻译请求；流程见 [贡献指南](./CONTRIBUTING.md)。

## 已决定的翻译

只有决定后的译法才移入本表。

| 英文术语 | 中文译法 | 说明/语境 | 首次来源 | 决定于（issue/PR） |
| --- | --- | --- | --- | --- |
| `ASD-STE100 Simplified Technical English` | `ASD-STE100 简化技术英语` | `ASD-STE100` 是规范代码不译；「简化技术英语」是该 controlled-language 标准的通用中文名 | `skills/productivity/wait-what/SKILL.md:7` | [#34](https://github.com/vinvcn/mattpocock-skills-zh-CN/issues/34)（2026-09-28 维护者批准） |
| `plain English`（含大小写变体） | `平实的语言` | 语言中立，避免「平实的英文」误导；与 README 既有表述一致 | `skills/engineering/ask-matt/SKILL.md:84` | [#34](https://github.com/vinvcn/mattpocock-skills-zh-CN/issues/34)（2026-09-28 维护者批准） |
| `GLOSSARY.md` / `GLOSSARY-MAP.md`（文件名） | 保留英文文件名，不本地化 | 上游 v1.3.1 将 `CONTEXT.md`/`CONTEXT-MAP.md` 约定重命名为 `GLOSSARY.md`/`GLOSSARY-MAP.md`；文件名是 skills 读取的行为关键 identifier，正文以 inline code 引用，说明性文字可称「术语表」 | 上游 v1.3.1 同步（`mattpocock/skills@24fe0ef`） | 维护者于 2026-10-08 v1.3.1 同步时批准（本 PR 待复核） |

## Translate terms（翻译请求）

| 英文术语 | 来源引用 | 建议译法 | 状态 | 关联 issue/PR | 备注 |
| --- | --- | --- | --- | --- | --- |
| `ASD-STE100 Simplified Technical English` | `skills/productivity/wait-what/SKILL.md:7`；`docs/productivity/wait-what.md:23` | `ASD-STE100 简化技术英语` | `applied` | [#34](https://github.com/vinvcn/mattpocock-skills-zh-CN/issues/34) | 建议理由：`ASD-STE100` 是规范代码（标识符，按仓库保留规则不译）；「简化技术英语」是该 controlled-language 标准的通用中文名。两处原句可直接替换：「用 ASD-STE100 简化技术英语来说」「ASD-STE100 简化技术英语 设定语域」。同类第三处字面出现见 `dsh-plugin/skills/wait-what/SKILL.md:7`，落地 PR 应一并处理。2026-09-28 更新：dsh-plugin/skills/ 为构建产物（gitignored，由 dsh-plugin/scripts/copy-skills.mjs 生成），源头修复后随插件构建自动同步，落地 PR 无需手改。 |
| `plain English`（含大小写变体 `Plain English`） | `skills/engineering/ask-matt/SKILL.md:84`；`skills/engineering/improve-codebase-architecture/SKILL.md:47`；`skills/engineering/improve-codebase-architecture/HTML-REPORT.md:108` | `平实的语言` | `applied` | —（同类排查；背景见 [#34](https://github.com/vinvcn/mattpocock-skills-zh-CN/issues/34)） | 建议理由：本仓库产出为中文，直译「平实的英文」会误导（agent 并非用英文复述）；「平实的语言」语言中立，与 README 既有描述「用平实的语言重新表述」一致，三处原句可直接替换。既有分歧译法（均不含字面术语）：`docs/engineering/improve-codebase-architecture.md:38`（平实的英文）、`docs/engineering/domain-modeling.md:70`（平白的英文描述）、`docs/engineering/grill-with-docs.md:41`（平白英文展开式）、`docs/productivity/wait-what.md:3`（朴素英语）、`README.md:258`（用平实的语言重新表述）、`skills/productivity/README.md:13`（以直白的语言） |

## 如何更新本表

- 请求一经提交就加进 Translate terms 表。
- 术语决定后从请求区迁入已决定的翻译表并填「决定于」。
- 应用 PR 合并后由维护者把状态改为 `applied`，并保留该行。
- 应用时按大小写不敏感匹配，同一术语的大小写变体视为同一术语。
- 来源引用与 issue/PR 链接必须保留；不要删除历史行。
