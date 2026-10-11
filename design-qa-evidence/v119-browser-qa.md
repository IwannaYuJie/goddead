# v119 河岸回声验收

2026-10-11，生产源码 / 本机 Chrome。桌面 1470×779，完整画面证据 1280×1000；手机 375×844。验收前保存本地 21 项 localStorage 原串，收尾逐项恢复。

## 前置和真实游玩

使用当前生产规范化函数派生 v82–v117 的 36 份完成态，再加合法 v118 九渡货 / 三末岸裁定完成态，共 37 个前置键；未预置 v119 到访、草稿、回应或收集。另用合法 v28 治理与 v63 退件前置显示晚期指引。旧 v29 初始三支到访 false、选择 null，v54 初始空默认；通过旧听筒实际 Enter 选择产生声音。

新回访入口原生键盘进入旧 echo，v119 archive=true，但旧 v29 echo 到访仍为 false。没有实际旧声音时，听井入口禁用并提示先拿起旧听筒；三只旧听筒均沿原路线返回门外 / 走廊 / 余响交换台，原迫近值随旧选择正常增加。

| 实际旧声音 / 最近末岸裁定 | 实答五拍 | 结果 |
| --- | --- | --- |
| 门外敲声 / 让两岸都有人 | 步、步、铃、敲、步 | 返回 echo，第一份独立余韵 |
| 自己脚步 / 给神留一个船位 | 步、敲、步、步、留白 | 手机静音完成，第二份余韵 |
| 03:17 的铃 / 让河继续流 | 铃、铃、敲、步、铃 | 完整未交付离场恢复、交付瞬间刷新，第三份余韵 |

第二 / 第三条前真实进入旧末岸听证会选择对应裁定，最终 v118 courtRuns=5、lastOutcome=river-still-flowing。三次真实旧听筒选择导致 v29 / v54 与第三次旧 v30 路线记录变化，这是旧玩法的预期写入；首、末两条实机路径分别在新谜题开始至返回的独立阶段逐字核对，v29 / v54 / v118 raw 均不变（mismatch=[]）；九组合的旧键隔离另由规则测试逐项验证。v82–v117 的 36 份前置与原 fixture 的 JSON 序列化字符串逐字不变。

第一次答错第 1 拍，明确提示位置且没有落错误答案；Space 接第一拍，撤回再答。回听逐格高亮并锁定输入，播放中真实离场取消所有高亮，保留已答一拍。刷新旧 echo 后续回听井保留一拍，再完成其余四拍。

第二条手机静音第一拍后刷新听井，草稿继续；用文字谱和留白完成。第三条完整五拍先离场再进入，仍为 5/5 且交付按钮可用；按交付后立即刷新，待交付自动重放、实际抵达 echo，runs=3、heard 三项、draft 清空、pending=null。再刷新目标仍 runs=3。第一次完成后实际指引已显示「v119 已回应彼岸」，第三次显示 3/9 可选收集。

只宣称以上三条浏览器代表路径；九组合生命周期和全部合法 / 非法前缀由独立测试覆盖。

## 布局、焦点、坏档与恢复

375px 无横向溢出；四声音按钮约 70.40×64px，文字来声、规则、已答谱和操作同屏可读。静音状态「打开声音」下照常完成。首次回信验收发现标题靠近固定顶栏，加入 5.5rem scroll-margin；新回访焦点为 re-archive-title，标题 top=87.88px，返回余韵可见。

坏 JSON `{bad` 的听井深链退回 active remembrance / hash #remembrance，原串保留。上游 v118 未完成时，即使已有 v119 到访记录，新图鉴隐藏且听井深链也退回痕迹室。收尾恢复原 21 项 raw，count=21、mismatch=[]、unexpected=[]；回到本地根页面，复原视口并停止本轮临时 HTTP 服务。所有 v119 验收操作期间及恢复后无新增 error / warn。

- [桌面河岸听井](v119-well-desktop.jpg)
- [375px 静音完整五拍](v119-well-mobile.jpg)
- [旧档案室回访与第三份余韵](v119-archive-return-desktop.jpg)

## 规则与静态检查

`node --check script.js`、`node --check tests/site.test.mjs`、`node --check tests/v119.test.mjs`、`git diff --check` 通过。`node tests/site.test.mjs`：20,967 assertions。`node --test --test-concurrency=1 tests/v101.test.mjs tests/v102.test.mjs tests/v103.test.mjs tests/v104.test.mjs`：65 tests / pass 65 / fail 0。

v119 使用九份明写目标谱独立比较全部长度 0–5 的四种输入，共 12,285 个前缀；该数量不并入主站断言。九生命周期分别走生产输入、冷草稿恢复、上游改声 / 改裁定不影响捕获谱、完整未交付恢复、reply 源重放、重复目标幂等、重复回应不新增格，以及三类 pending 的 source / target / feedback / kind / 声音裁定篡改。另覆盖非法声音、上游忙、合成点击、播放锁定与离场取消、reduced-motion、全部遗忘和实际旧 v29 路由守卫的 echo 独占窄桥。

HTML 审计：278 个唯一场景、4,407 个唯一 ID，无重复 ID、无失效 hash、无缺失本地资源。两张 1536×1024 新图约 201 / 225 KiB，均低于 300 KiB；源 PNG、提示词与 SHA-256 见 [V119ImagePrompts.md](../docs/V119ImagePrompts.md)。

## 发布

功能提交 `6efc92d82d964eae1ed77499d1e8b99c4dd1600f`（`feat: 发布 v119 河岸回声与旧听筒回访`）已直接推送 main，`git ls-remote` 与功能 HEAD 一致。GitHub Cloudflare Pages completed / success；2026-10-11 10:20（Asia/Taipei）公开站 `https://goddead.com/` 为 v119 / 278 场景。

本次公开根 HTML、CSS、JS 与两张 v119 WebP 的原始字节及 SHA-256 全部与本地一致；HTML 本次没有比对所需的边缘注入差异，raw_match 与 source_match 均 true。逐文件结果见 [v119-public-assets.json](v119-public-assets.json)。首次查询参数请求曾返回 403，普通根 URL 与实际 Chrome 均正常；最终验收使用普通根 URL，不把失败请求记作成功。

线上 Chrome 从普通根页面刷新，实际脚本 v119、278 场景、河岸听井与旧档案窗口登记正常，门外显示正常，无横向溢出或新增 error / warn。线上验收只读，没有种入测试前置；保存 [线上根页面截图](v119-public-root.jpg)。本地 21 项原串已在离开本地前全部恢复、临时服务停止、视口复原。
