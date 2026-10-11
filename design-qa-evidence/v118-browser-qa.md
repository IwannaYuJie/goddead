# v118 渡河码头验收

2026-10-11，生产源码 / 本机 Chrome。桌面 1470×779，手机 375×844；原本地 21 项游戏 localStorage 在验收前备份 raw，收尾逐项恢复。

## 前置与实际游玩

用当前生产 getter 和规范化函数派生 v82–v117 的 36 份完成态，v81 以下保留原本地状态；从空 v118 开始，没有预置本章航程、到访、交货或裁定。VM 的 DOM / 音频 / 计时器为桩；以下页面行为由 CUA 真实鼠标和键盘输入验证。

| 托运 / 航法 | 趟数 | 实际签收房间 | 回码头 |
| --- | ---: | --- | --- |
| 遗物科 / 一席小舟 | 7 | 神圣遗物科 | 摆渡人签收返回 |
| 投递所 / 双桨渡船 | 7 | 无主投递所 | 摆渡人签收返回 |
| 值夜室 / 无灯夜渡 | 9 | 第三值夜室 | 从签收指引进入，Enter 返回 |

空船首次起渡提示此岸无人看守及具体冲突双方，航程不变。小舟首次载客通过 Enter 选择，撤回后重走，再刷新：船位和第一趟恢复，选中状态清空。完成航程交货时立即刷新源场景，pending 重放并实际抵达遗物科；抵达后再次刷新仍只记一次。夜渡亦在第一趟后刷新，继续其余八趟。

三份托运、三种航法覆盖后真实开庭。让两岸都有人 → 门外；给神留一个船位 → 痕迹室；让河继续流 → 无终局画廊。最终 departRuns=3、courtRuns=3，三条不同交货、三项裁定、activeFerryman=null、pending=null；下一步实际显示 `v118 已全部完成`。为显示晚期进度引导，另补规范 v28 治理与 v63 退件前置，未修改 v118 完成态。

浏览器覆盖上述三条代表路径；九种组合的完整生命周期、输入竞争、pending 篡改与错误历史截断由测试覆盖，不宣称全部逐项实机操作。

## 修复、布局和存档

手机最初选择乘客后需要向下滚动划船，已把划船按钮移至两岸中央；乘客点击区扩大至约 45.38×44px。375px 页面无横向溢出，六位同行者、船位与划船按钮可同屏操作；未用背景图上的文字表达规则。桌面三托运热点与原画实物对应，听证热点对准两岸模型 / 空船 / 水碗。

实机签收指引发现 `showScene` 不存在，修正为当前真实导航函数 `goScene`；增加对应回归断言，重载后真实进入值夜室并以 Enter 签收成功。修正后的验收日志没有新 error / warn，早先捕获的错误没有被当作成功结果。

坏 JSON `{bad` 保持原串并使用安全默认状态。码头 / 渡河 / 听证会三个未到访深链逐项完整导航，实际 active scene 与 hash 均回到 remembrance。36 份上游存档与原 fixture 的 JSON 序列化字符串逐字相等，mismatch=[]。恢复原 21 项 raw，并清理本轮种入的前置、v118、图鉴展开键；count=21、mismatch=[]、unexpected=[]，回到本地根 URL，取消手机视口覆写。

- [桌面码头](v118-landing-desktop.jpg)
- [桌面两岸与拒绝起渡提示](v118-river-desktop.jpg)
- [375px 夜渡全部到岸](v118-river-mobile.jpg)
- [桌面末岸听证会](v118-court-desktop.jpg)

## 静态验收

`node --check script.js`、`node --check tests/site.test.mjs`、`node --check tests/v118.test.mjs`、`git diff --check` 通过。`node tests/site.test.mjs`：20,573 assertions。`node --test --test-concurrency=1 tests/v101.test.mjs tests/v102.test.mjs tests/v103.test.mjs tests/v104.test.mjs`：65 tests / pass 65 / fail 0。

新增规则测试单独用布尔岸位判定，与生产位掩码实现比较全部 10,368 组输入；该数量不并入主站断言计数。独立 BFS 的最短趟数为 7 / 7 / 9，九种托运 × 航法分别验证生产输入、冷恢复、交货 pending、重复到达、签收撤桥和旧键隔离。基础主线测试执行实际早期守卫片段，锁住窄桥的临时许可。

HTML 审计：277 个唯一场景、4,374 个唯一 ID，无重复 ID、无缺失本地文件、无失效 hash 路由，敏感标记检查通过。三张源 PNG 与 WebP 均 1536×1024，运行时分别约 212 / 191 / 193 KiB，均低于 300 KiB；提示词与 SHA-256 见 `docs/V118ImagePrompts.md`。

## 发布

功能提交 `185c0fd3475fc2ea563708c4fb9c70517125d5e0`（`feat: 发布 v118 渡河码头与可恢复航程`）已直接推送 main，`git ls-remote` 与功能 HEAD 一致；GitHub 的 Cloudflare Pages 检查 completed / success。2026-10-11 09:48（Asia/Taipei）公开站 `https://goddead.com/` 为 v118 / 277 场景。

CSS、JS 与三张 v118 WebP 的原始 SHA-256 / 字节均与本地一致。HTML 原始字节多出 Cloudflare Web Analytics 自动注入的 beacon 脚本及闭合 body 的缩进变化；比对全部差异后，仅移除该脚本并恢复缩进，HTML 源码 SHA-256 与本地完全一致。未把经过边缘注入的 HTML 声称为原始字节相等。逐文件结果见 [v118-public-assets.json](v118-public-assets.json)。

线上 Chrome 从普通根 URL 读取 v118、277 场景与三个新场景注册；门外正常显示，无横向溢出，无新 error / warn。线上验收只读，没有种入前置或更改生产存档。[线上根页面截图](v118-public-root.jpg)。本地临时服务已关闭，手机视口已恢复，原本地 21 项 raw 完成逐项恢复后才离开本地页面。
