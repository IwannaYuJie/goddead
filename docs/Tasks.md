# Tasks — Goddead

## v77 自我真伪鉴定所 / AUTHENTICITY OFFICE OF THE SELF

### Kimi 负责（前端 / 测试 / 文档）
- [x] 阅读 `docs/V77SelfAuthenticityOfficeDesign.md` 与 v76 实现模式
- [x] 实现 `script.js` v77 状态模块（key `goddead_v77_self_authenticity`、十一键投影、七类 pending）
- [x] 实现 18 组 `isTrusted` 点击监听与 handler→DOM 绑定
- [x] 接入 `sceneInit` / `goScene` 守卫 / `DOMContentLoaded` / `forget-all` 集成
- [x] 添加 4 个新场景 HTML、preload、目录链接、Remembrance 记忆/图鉴/入口
- [x] 在 scar-loom / borrowed-childhood / lifetime-pawn-vault 添加鉴定员回流容器
- [x] 添加 v77 CSS（figure、hotspot、authenticator、codex、响应式）
- [x] 更新 `tests/site.test.mjs`：141 场景、素材冻结、handler→DOM 校验、运行时回归
- [x] 更新缓存版本 `v=76 → v=77`
- [x] 更新 `README.md`、`design-qa.md`、`docs/ProgressLog.md`
- [x] 创建 `docs/ImplementationPlan.md` 与 `docs/Tasks.md`
- [x] 更新 `docs/V77SelfAuthenticityOfficeDesign.md` 实现状态
- [x] 跑静态门禁并修到全绿

### Codex 负责（设计 / 素材 / 独立验收）
- [x] Chrome 深链种子真实点击预检：v76 / v77 Remembrance 入口、记忆与图鉴按前置状态显露
- [ ] 桌面 1280×720 浏览器验收
- [ ] 手机 390×844 浏览器验收
- [ ] 真实三段点击（claimant → provenance → method）
- [ ] 三个旧场景回程验证
- [ ] 四份 coverage 解锁终审
- [ ] 三终审结局验证
- [ ] 重载幂等验证
- [ ] 坏存档降级验证
- [ ] 页面 console 0 验证

### 向后扩充
- [x] 冻结 v84《无罪证人保护院》完整设计与 4 张源 PNG / 4 张运行 WebP
- [x] 冻结 v85《孤事实认领处》完整设计与 4 张源 PNG / 4 张运行 WebP
- [ ] v84 等待 v78–v83 依序实装与验收后交 Kimi
- [ ] v85 等待 v84 实装与验收后交 Kimi

## 约束
- 只实现 v77，不改 v78 及之后设计/素材。
- 保留 v76 全部行为，禁止删减已有分支。
- Kimi 不提交、不推送；Codex 审核后按用户要求统一提交推送。
- 不触碰 `qa-v76-seed.html`。
