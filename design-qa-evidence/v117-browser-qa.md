# v117 灵车场验收

日期：2026-10-11。当前生产源码 / 本机 Chrome，桌面默认 1470×779，手机覆写 375×844。原本地 21 项 localStorage 在测试前读取并保存在验收会话，收尾逐项恢复，不清空整站存储。

## 前置和边界

使用当前生产默认状态、ID 白名单、正常化函数与 getter 派生 v82–v116 的 35 份完成态；v81 以下沿用原本地存档。VM 验证 v104–v116 getter 读回规范对象、v117 实际解锁；没有预置 v117 放行、裁定或到访。生产页面从空 v117 开始，用 CUA 的真实鼠标与键盘输入操作。VM 中的 DOM / 音频 / 计时器为桩，真实页面初始化、签收与路由另由以下浏览器路径覆盖。

## 实际游玩

| 车与时辰 | 挪动次数 | 签收房间 | 返回 |
| --- | ---: | --- | --- |
| 遗物科灵车 / 天刚亮 | 4 | 神圣遗物科 | 赶车人返回门房 |
| 守则厅篷车 / 早上 | 8 | 访客守则 | 赶车人返回门房 |
| 焚献炉灰车 / 正午 | 14 | 焚献炉 | Enter 签收返回门房 |

三个类别、三个时辰都覆盖后，真实进入末车听证厅。让每辆车出门到门外、给神留车到痕迹室、让车停院里到无终局画廊；courtOutcomes 三项、courtRuns=3。

一次额外灵车发车用于冷恢复验收：移动后刷新复原车阵；发车 pending 已保存时立即刷新，仍送到遗物科，departRuns 从 3 变成 4；再次抵达刷新仍为 4，distinct departs 仍为 3。签收后 activeDriver 清空，pending 清空。各章输入受 pending 锁定的竞争输入和错误落点/反馈归一化由站点测试覆盖，不冒称逐个浏览器连点矩阵。

坏 JSON `{bad` 保留原串、返回安全默认态；门房 / 院子 / 听证厅三个未到访深链逐项导航，实际 hash 与 active scene 都为 remembrance。完整前置下进度引导实际显示 `v117 已全部完成`。收尾比较 35 份上游 raw 与 fixture 全部一致；error/warn 日志为空；原 21 项存档恢复后总数 21、mismatch=[]、unexpected=[]，并回到原本地根 URL。

## 修复与布局

真实发车暴露基础主线最早的遗物守卫在治理桥之前改写落点；已为 v117 合法发车 / 未签收赶车人补上遗物和焚献两处早期窄桥。回归执行实际早期守卫片段，验证合法 pending、activeDriver、签收撤桥以及锁定旧主线回退。

新场景背景用 absolute/inset 铺满固定比例画面，修复图片零尺寸；三个桌面热点与对应小车 / 三件裁定物相对齐。手机院子居中裁成 1:1，figure 330×330px，格子 52.27×50.22px，document.scrollWidth=375。布局中包含完整指引、时辰按钮和放行 / 复原控件，状态文本位于图下。

- [桌面门房](v117-gate-desktop.jpg)
- [桌面听证厅](v117-court-desktop.jpg)
- [手机院子](v117-yard-mobile.jpg)

## 静态验收

`node --check script.js`、`node --check tests/site.test.mjs`、`node tests/site.test.mjs` 20,381 assertions；`node --test --test-concurrency=1 tests/v101.test.mjs tests/v102.test.mjs tests/v103.test.mjs tests/v104.test.mjs` 65 tests / pass 65 / fail 0。九阵广搜：灵车 4/9/12、篷车 5/8/13、灰车 6/10/14。资产三张 PNG / WebP 均 1536×1024，WebP 小于 300KB。

## 发布

功能提交 `3532b6455e52891b247737db07835000fb90d86f`（`feat: 发布 v117 灵车场与挪车谜题`）已推送 GitHub main，`git ls-remote` 与本地 HEAD 一致。2026-10-11 09:20（Asia/Taipei）确认公开站 `https://goddead.com/` 已切到 v117：274 个场景，CSS / JS 都为 `?v=117`。

公开站 HTML、`styles.css`、`script.js` 和三个 v117 WebP 的 SHA-256 分别与功能提交中的本地文件一致；Chrome 实际打开公开站后，三个新场景在 DOM 中注册，门外正常显示，无横向溢出、error / warn。此前部署等待期间仍显示 v116，验收以切换完成后的结果为准。线上验收只读，未植入前置或更改生产存档。

本地验收收尾再次比对原 21 项 raw：count=21、mismatch=[]、unexpected=[]，确认恢复完成后才离开本地页面。
