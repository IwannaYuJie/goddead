# v123 房间目录与旧支线滚动验收

2026-10-11，本机 Chrome 1470×779 / 375×844；原 280 场景、278 目录入口（276 唯一 hash，保留 echo / return-audit 别名），4500 静态唯一 ID，缓存 v123。沿用原图，本轮没有新增美术。

## 规则与集成

30,878 条全站断言、旧章 v101–v104 65/65、script / directory / 新测试语法与 diff 检查通过。新 tests/v123.test.mjs 覆盖全部 278 入口与真实场景标题 / kicker metadata、三种可用档、Unicode NFKC / 多词 AND / 用户输入不作为正则、原节点和门槛属性保留、折叠快照 / 搜索 Enter / IME、门槛变化 / 当前标记、Tab 和 inert 生命周期。独立检查已排队的场景聚焦在目录打开时中止、正常导航仍聚焦标题。

源码审计确认原 278 个 anchor 标签与上一版逐字节相同，无重复 ID、失效场景 hash 或缺失本地依赖；四个既有隐藏 courier 的 href="#" 由各章动态写入目标，继续保留。新 directory.js 在主脚本前加载，三个缓存参数均为 123，无新增存档键 / 第二套路由，敏感标记计数全为零。报告见 [v123-source-audit.json](v123-source-audit.json)。

## 原生 Chrome 操作

| 场景 | 实际结果 |
| --- | --- |
| 空档目录 | 五个基础入口；搜索灵车无结果，不揭示未到访房间；零结果 Enter 留在输入框 |
| 长完成档 | 137 可用入口按区域折叠；中文灵车、编号 32、全角英文 ＪＡＭＭＥＤ - ＹＡＲＤ 正常检索；目录独立滚轮 scrollTop=3116，背景场景保持 0 |
| 搜索与折叠 | 查询展开匹配区域，清除恢复此前全部收起；展开 / 收起全部；dawn 多结果 Enter 聚焦首项，原 hash 保持 |
| 原导航 | 唯一 hearse gate Enter 到灵车门房、标题聚焦；无车草稿的已到访院子仍被原守卫改写为 remembrance，入口到访不等于绕过章节草稿门槛 |
| 焦点 | 首焦点关闭按钮，主区域收起后 Tab 从末个 summary 回关闭，Shift+Tab 反向循环；Esc / 遮罩关闭回触发器，stage inert 恢复 |
| 无存档检索 | 原生连续输入 goddead、检索 / 清除 / 折叠 / 遮罩关闭前后全部 raw 相同，awake 没被写入 |
| 小屏 | 375×844，目录满宽，document.scrollWidth=375；搜索至少 44px 高，关闭 44×44px，清除宽 44px |
| 旧场景滚轮 | 旧遗言银行 / 海关原生 wheel 到 160.5px；375px 出餐台 0→340px，听单 / 出餐 / 撤回 / 放回小票均在屏内；该插图仍 overflow:hidden |
| 冷恢复 / 在途 | 灵车院子实际挪一步后刷新 raw 相同；选车 / 四步放行后立即开目录，后台正确抵达 / 更新到访和当前标记，菜单焦点保持，落账 departRuns=1、pending=null；原生签收正常 |

实机先发现 visibility 过渡导致首焦点未落位，后发现折叠 details 的链接仍有 getClientRects，以及后台标题聚焦重试可能在关闭后抢焦点；已修正并重跑选择车 / 四步放行竞争，关闭后稳定在 menu-trigger。布局证明来自原生 wheel 和截图；单元 DOM facade 只验证节点 / 状态生命周期，不作为真实布局证明。

测试前保存本地原 21 项状态。本地完成档与旧银行 / 海关到访用 scoped CDP 前置；所有检索、折叠、键盘、滚轮、选车、四步挪车及签收均走 CUA 原生 UI。35 上游 raw 与旧 21 串在挪车段逐项不变，菜单操作整份存储不变。收尾精确恢复原 21 项，mismatch=[] / unexpected=[]，视口与缓存调试偏好恢复，新增 error / warn 为空。见 [v123-storage-audit.json](v123-storage-audit.json)。本轮验收覆盖目录和代表性旧场景滚动，不声称重玩全部 280 场景。

- [桌面长目录](v123-directory-desktop.jpg)
- [手机编号检索](v123-directory-mobile.jpg)
- [旧银行滚轮](v123-old-bank-scroll-desktop.jpg)
- [旧海关滚轮](v123-old-customs-scroll-desktop.jpg)
- [手机出餐台下方操作区](v123-breakfast-scroll-mobile.jpg)

## 公开发布

功能推送、Pages 和公开源字节 / Chrome 目录检查随后补记。
