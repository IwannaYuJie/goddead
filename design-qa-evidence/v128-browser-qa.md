# v128 余温温室原生验收

2026-10-25（Asia/Taipei）。本文件是 Codex 独立 QA 记录；生产前端与实施文档由用户批准的 `gemini-3.8-flash-high` 编写。验收实际 `index.html` 游戏页，不是 10 月 23 日的隔离静态样本。此时本地通过，提交、推送与公开验收另记。

## 环境与边界

- 基线 HEAD：`94d61af09e4f66275820d294479f9165e9752d48`。Chrome Computer Use 只复用一个 QA 标签，实际 URL `http://127.0.0.1:8894/`，桌面约 1470×744；窄屏是桌面 Chrome 375×812 视口模拟，不是手机硬件。
- 仅在本地 origin 使用旧章前置测试档；新键 `goddead_v128_remaining_warmth` 起初不存在。A 从测试档旧甲裁定捕获；B 通过原生点击旧乙裁定取得；null 通过显式调整旧治理测试前提取得。三案的新建、拨阀、提盆、安放全部使用原生鼠标 / Space / Enter，没有调用业务内部函数或伪造已完成新盆。
- 三条代表路径 A→窗台、B→抽屉、null→空椅，不宣称九种案别与安放组合全部浏览器实走。其余状态组合、长历史与坏档由独立单元验收覆盖。
- 每条新章流程前后比较 69 项旧 raw，变化项均为空。乙裁定点击和 null 测试前提调整发生在该段比较基线建立之前，未算成新章写入。
- 收尾将本地原始 1 项 `goddead_state` raw 字节精确还原，视口恢复，Network 缓存调试关闭，临时 HTTP 服务已停止。该 QA 标签暂留空白，供随后公开冷载复用；本地测试档不写入公开站。

## 真实流程

| 检查 | 实际结果 |
| --- | --- |
| 首次入口 | 痕迹室指引先回原焚献室，再点温室入口；抵达不自动创建草稿，新建时才捕获案别 |
| A / 甲愿望 | 6/9 初局，提示指向第 1 格且 raw 不变；Space 拨阀、撤回后 raw 原样恢复；1、5、9 三阀完成 |
| 提盆 / 放回 | 只有 9/9 才可提起；提起九格锁住，放回恢复拨阀；尚未落盆时计数保持 0 |
| 窗台 | 双击放置只有一笔 pending；实际到 threshold 才记第 1 盆，焦点到 rw-echo-window-title；draft 与 pending 同时消费 |
| 抵达刷新 / 回温室 | 窗台与空椅抵达刷新均不加计数；回温室只显示上一盆与新建按钮，已交盆不能重复交 |
| B / 乙愿望 | 旧乙裁定后新建为 5/9，2、4、6、8 四阀完成；重来仍保留 B 并清空操作；再次完成后放抽屉 |
| 源房刷新 | 抽屉交接发起后立刻刷新源房，自动续程到 offering；只记第 2 盆，焦点到 rw-echo-drawer-title |
| null / 白芽 | 375px 下 0/9 初局，1、3、5、7、9 五阀完成；刷新保持 9/9 与五步历史；原生提盆放空椅 |
| 空椅 / 在途目录 | 交接期间打开目录；实际到 unending-gallery 记第 3 盆，menu-close 仍聚焦且 stage inert；Esc 后返回 menu-trigger 并解除 inert |
| 中途改道 | 再新建 null 盆并解完、提起；发起窗台交接后立刻点痕迹室出口。因测试前提没有旧焚献裁定，原门禁实际回 offering；作为第三场景正确取消 pending，保留 held 草稿，计数仍 3 |
| 捕获案别固定 | 将旧治理测试前提还回 B 后，保留的活动盆仍为 null；后来送到抽屉记第 4 盆，三个 outcome 去重保持不变 |
| 旧交接优先 | 同一原生输入批次先点击旧乙裁定、紧接温室入口，新章 pending 保持 null，旧自动交接不被覆盖 |
| 新入口优先 / 冷载锁 | 新入口在途时旧 prayer-offer、prayer-input、两裁定与 continue 五控件 inert + aria-disabled，原 disabled 均仍 false；源房刷新后五项继续锁定，抵达释放 |
| 上游活动 | 本地测试前提保留 v121 成绩、增加合法 door 草稿；温室全部工作控件禁用并说明前置事务，活动盆与新章 raw 不变 |
| 锁定深链 | 本地前提移除 v121 已完成验名后刷新温室，实际回 remembrance，入口与目录项隐藏，新章 raw 原样保留 |
| 完成指引 / 图鉴 | 痕迹室显示「已留下一抹春意」，新图鉴列出三处陈设；一盆足以完成，其余为可选回访 |

## 视觉、可访问性与修正

- 375×812 实际游戏无横向溢出；九格约 110.33×110.33px，提示 / 撤回 / 重来 / 提盆按钮高度 44px。冷热有文字、圆形标记与 aria-pressed，行列与受影响格可读。原生 Space、Enter、点击均验证。
- 实际截图发现抽屉抵达标题被固定栏遮挡（修正前 y=-0.195px；治理 HUD 底部 88.5px）。交回同一 Gemini，只新增四个 v128 标题的 `scroll-margin-top: clamp(112px, 16vh, 140px)`。
- 样式修正回包 `resp_foXdapGdB6O80-kPitmuaQ` 原文应用；最终 CSS SHA-256 `f847a4e882acc100b565d64829f7353fa4c4045acd8f378b9f0ddc7f1ba31770`。真实新一次抽屉抵达标题 y=118.805px，HUD 底部 88.5px；空椅窄屏标题 y=129.867px，文字完整可见。
- 本地开发普通 reload 曾继续使用旧 CSS；启用 CDP Network 后 ignoreCache 硬刷新确认实际样式，收尾已关闭该调试设置。
- 浏览器日志最后读取 warn / error 为空；这只覆盖本次捕获窗口。长历史 / 伪原型 / 存储异常等未逐项浏览器人工复演，以明确的单元证据列在下面。

## 自动化与作者来源

- `node tests/site.test.mjs`：191,860 条站点断言通过（已导入四份 v128 永久测试）。旧 v101–v104、v123–v127 显式 `node --test`：70/70。
- `tests/v128-warmth-rules.test.mjs`：162,768 条独立规则断言；512 状态 / 4,608 转移 / 1,536 检查点 / 三案 699 次逐步恢复 / 192 次撤回 / 89 类非法草稿。该计数与站点统计口径不同，不相加。
- `tests/v128-prototype-shapes.test.mjs`：10 类伪原型 × 6 接口正确拒绝，6 类合法输入保持接受，21 次不改写检查，getter 零调用。
- `tests/v128-runtime.test.mjs`：363 用例、2,570 断言通过；轻量 DOM/event 单元替身，实际载入已接受纯规则；不冒充浏览器可信事件或视觉证据。
- `tests/v128-host-bindings.test.mjs`：实际适配源码 56 项回调、门禁、存储键、宿主生命周期顺序验证通过；不替代全部旧章完整游玩。
- 纯规则作者回包 `resp_6jfbat_wE7vMrfcPufPt6Ac`，SHA `d935b2cfdefd9417aea070433fb4619855234942a9748d4eb7849d76deecbe72`。
- 最终运行时回包 `resp_SoPdatyYFt_A1e8PpP2E2AI`，SHA `26bcddc81675ce7f45b861c9acabf42e46cf10e94d07c032db5af17fa2ebd47a`。
- UI 原回包 `resp_CjrbapiTDPm3vr0Pg6SZ6Q8`，宿主片段回包 `resp_BoLdaoHzJ4eX9tMPpPGm2QQ`；均为 `gemini-3.8-flash-high`。Codex 仅机械应用，独立编写测试与证据。
- 逆向撤销模型新片段和缓存替换后，index.html 与 script.js 恢复原基线字节；旧 styles.css、directory.js、ink-rules.js、light-rules.js、tea-rules.js 保持。
- 原画由 Codex 内置 imagegen 生成，生产 WebP SHA `bb440351f87015113855a9e6ed2fe5a09fac51a415039ecd0ed877e9b20cb4c8`；来源与提示词见设计目录。

## 截图

- [温室实际主画面](v128-native-room-desktop-20261025.png)
- [甲愿望已提盆](v128-native-a-held-desktop-20261025.png)
- [修正后的抽屉抵达](v128-native-drawer-desktop-20261025.png)
- [375px 实际白芽九格](v128-native-null-grid-mobile-20261025.png)
- [375px 空椅结局](v128-native-chair-mobile-20261025.png)

10 月 23 日 `v128-static-*` 截图只作独立静态布局历史证据，不能替代上述实际流程。公开验证与提交 SHA 待发布后附记。


## 2026-10-25 公开发布闭环

功能提交 `c86c7ad4dd1d22789f4fbcc12eef084ca959e37a` 已推送 main，远端 SHA 一致；Cloudflare Pages completed / success。12:46（Asia/Taipei）普通公开 URL 的 12 份资源 raw 字节与 SHA-256 全量一致，无需 HTML 归一化，九项核心依赖 v128、281 场景。详情见 [公开资源](v128-public-assets.json)。

同一 Chrome QA 标签转到正式站，冷载七脚本与两样式；五个规则 / 运行时工厂注册且命名空间冻结。首页 active=threshold、title=Goddead，1470×744 无横溢，空档温室入口及目录项隐藏。原生目录 5/5、搜索「守则」1/5，menu-close 首焦点与 stage inert 正常；Esc 返回 menu-trigger 并解除 inert，菜单前后唯一 raw 完全相同，warn / error 捕获为空。见 [公开浏览器记录](v128-public-browser.json) 与 [公开首页截图](v128-public-root-desktop.png)。

公开站未写入本地前置测试档；本次公开检查不替代上文的本地三条完整代表玩法。唯一 QA 标签现已关闭，本地原始 raw / 视口 / 缓存调试均已恢复，临时 HTTP 服务已停止。
