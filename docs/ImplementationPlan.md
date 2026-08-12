# Implementation Plan — Goddead

## 当前版本：v77 自我真伪鉴定所 / AUTHENTICITY OFFICE OF THE SELF

### 目标
在 v76 现实退款处判现实虚假宣传、且玩家已覆盖三存在/三凭证/四方案并集齐三退款结局后，开放 v77。v77 新增 4 场景、36 份自我鉴定证书、3 个终审结局、3 处旧场景鉴定员回流、39 格新图鉴，场景总数 137 → 141。

### 已实现
- [x] 按冻结设计实现 5 个目标场景（4 新场景 + 1 痕迹室入口）
- [x] 3×3×4 = 36 组合证书与 3 个终审结局
- [x] 3 个旧场景（scar-loom / borrowed-childhood / lifetime-pawn-vault）鉴定员回流
- [x] 覆盖率门槛（3 claimant / 3 provenance / 4 method，至少 4 份证书）
- [x] 7 类 strict pending（entry / claimant / provenance / certificate / authenticator-return / tribunal-entry / tribunal）
- [x] 单键坏存档回退（坏 JSON / 错 version / 数组 / null / 未解锁均返回默认态）
- [x] 生产交互全部使用 `e.isTrusted` 与 `AutoAdvance`
- [x] 恰好 18 个 v77 `addEventListener`，首句均为 `if (!e.isTrusted) return;`
- [x] handler 引用真实 DOM id，测试已补齐 handler→DOM 校验
- [x] 接入 v77 已冻结 WebP 素材（4 张 1536×1024，sha256/bytes 冻结）
- [x] README / design-qa / ProgressLog / V77 设计文档已同步
- [x] 静态门禁 `node tests/site.test.mjs = 10277 assertions passed`

### 独立验收状态
- [x] Chrome 深链种子真实点击预检：v76 / v77 Remembrance 记忆、图鉴、普通入口按前置状态显露，真实按钮 enabled
- [ ] Codex 独立浏览器验收：桌面 1280×720、手机 390×844
- [ ] 真实三段点击（claimant → provenance → method）
- [ ] 三个旧场景回程
- [ ] 四份 coverage 解锁终审
- [ ] 三终审结局
- [ ] 重载幂等
- [ ] 坏存档降级
- [ ] 页面 console 0

### 版本边界
- v77 只读 v76（`realityRefundCounterUnlocked`、`getRealityRefund`、`realityRefundCoverageComplete`），不写 v76 及任何更早 key。
- v77 不实现 v78 及之后内容。
- Kimi 不提交、不推送；Codex 审核后按用户要求统一提交推送。

## 历史版本摘要

| 版本 | 场景数 | 关键交付 | 状态 |
|------|--------|----------|------|
| v76 | 137 | 现实退款处 / 36 退货单 / 3 退款结局 | 已实现，入口预检通过，完整浏览器矩阵待执行 |
| v77 | 141 | 自我真伪鉴定所 / 36 证书 / 3 终审 | 前端已实装，10277 断言全绿，入口预检通过，完整浏览器矩阵待执行 |
| v84 | 169 | 无罪证人保护院 / 36 安置令 / 3 裁定 | 设计与 4 组源图/WebP 已冻结，待 v83 |
| v85 | 173 | 孤事实认领处 / 36 继承契 / 3 裁定 | 设计与 4 组源图/WebP 已冻结，待 v84 |
