# Kimi v74 实现交接：墓碑专利局

> 当前状态：设计与四张视觉资产已冻结，等待 Kimi 实现。
> 唯一产品规范：`docs/V74TombstonePatentOfficeDesign.md`。

## 任务边界

- Kimi 负责生产前端、自动化测试、README、ProgressLog、KimiUsageLog 与 design-qa 文档更新。
- Codex 已完成机制、文本、路由、状态合同与视觉资产，不由 Kimi 改写设计。
- 不要顺手重构 v73 或旧版本；保留当前工作区全部未提交修改。
- 不提交、不推送。

## 实现要求

1. 完整阅读 `docs/V74TombstonePatentOfficeDesign.md`，严格实现其中四幕、36 份专利、3 个裁决结局、11 键状态、7 类 strict pending、18 个 `isTrusted` 监听与路由窄桥。
2. 使用已冻结的四张 WebP：
   - `assets/v74-tombstone-patent-office.webp`
   - `assets/v74-prior-art-ossuary.webp`
   - `assets/v74-impossible-claim-examination.webp`
   - `assets/v74-perpetual-license-tribunal.webp`
3. 不得修改四张 source PNG / WebP；散列与尺寸以设计文档为准。
4. 交互热点桌面与手机均不得重叠，最小可点尺寸 `44×44px`。
5. 状态、pending、重复结算、来源页刷新、目标页刷新、坏 JSON、坏 version、额外键投影、未解锁回落，都要有自动化覆盖。
6. 测试必须包含真实 listener 结构校验：所有新增动作监听先验证 `event.isTrusted`，合成 click 不产生状态副作用。
7. 完成后运行：
   - `node --check script.js`
   - `node --check tests/site.test.mjs`
   - `node tests/site.test.mjs`
   - `git diff --check`
8. 更新文档时准确写成“静态检查完成，等待 Codex 独立真实浏览器验收”，不要提前宣称浏览器 QA 已完成。

## v73 收尾事实

v73 已由 Codex 独立完成真实浏览器验收：

- Chrome 真实点击走通 `入口 → 护照 → 违禁梦 → 关税 → 旧场景 → 梦检员返回`；
- 锁态、ready-zero、3/4 与 4/4 覆盖门槛、三个梦检员、三个驱逐目标、pending 重播、刷新不重复、坏 JSON/数组回落均通过；
- 1280×720 与 390×844 四幕布局通过，图片完整、无横向溢出、热点不重叠且 `≥44px`；
- 页面自身无 console error/warning；Chrome 仅出现 Immersive Translate 扩展自己的版本报错，与项目无关；
- 静态结果：`site.test.mjs: 7880 assertions passed`、两份 `node --check` 与 `git diff --check` 通过。

请先把 v73 的 README、ProgressLog、KimiUsageLog、design-qa、`V73BorrowedDreamCustomsDesign.md` 状态改成上述真实结论，再开始 v74。KimiUsageLog 里不能把“等待 Codex”写成已由 Kimi 完成浏览器 QA。
