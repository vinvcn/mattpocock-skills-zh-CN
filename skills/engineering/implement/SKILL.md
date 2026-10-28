---
name: implement
description: "基于 spec 或 ticket 集合实现一段工作。"
disable-model-invocation: true
---

实现用户在 spec 或 tickets 中描述的工作。

如果用户传入 ticket reference，先从 issue tracker 获取它，并在开始前复述它的标题。如果 reference 有歧义，先询问。

尽可能在预先约定好的 seams 上调用 Skill 工具并指定 `tdd`。

定期运行 typechecking，定期运行单个测试文件，并在最后运行完整测试套件。

完成后，调用 Skill 工具并指定 `code-review` 来审查这次工作。

把工作提交到当前 branch。
