# v103 照相馆验收记录

2026-10-02，本章实现与验收完成。本轮接续本地v102候车亭，Codex设计、生图和独立验收，exact `gemini-3.7-flash-high`编写生产前端及测试。当前232场景/cache103，HEAD仍为v100 `952d75c`，未提交或发布。测试桩、真实源接线和Computer Use分别记；长期扩充goal仍active。

## 已完成的设计和资产核验

设计规格见 `docs/V103ShadowlessPhotographyDesign.md`，原画与实际提示词见 `docs/V103ImagePrompts.md`。独立数学验算确认10种合法单曝光、100个完整有序对分为10/10/6/74；含null两槽共121种（100完整、20单张、1空）。换序保持几何分类，但第一灯余味和有序底片记录应变化。这是设计级独立计算，不代表生产已通过。

内置image_gen生成三张1536×1024环境图并保留源PNG；Sharp仅压为WebP/q88，运行图247434、208296、168738字节。源图与压缩图逐张看过，三真实场景也已加载，均complete且naturalWidth1536。实际人形、影子、底片缩图、暗房和图鉴由代码绘制，原画不代替实时结果；安全区域按实际原画修正。

## 候选模块与接线审查

Gemini首候选49217字节的问题均退回同一模型：pending键集、严格计数/容错、默认空槽、缩图几何、坏latest、画廊回声覆盖和forget范围。最终第二底片编号修正后模块51820字节，SHA256 `63799057b2c7b21bcb429a34c8dcca245072af7c0b3b8cb09d3d1c900ddb720a`，与实际生产切片逐字节一致。script SHA256 `d0926870a51152b1d631f851c2a4713343967a75b8f62fc74a8ab54a5dc22e84`。实际HTML232场景、3040唯一ID、25原生BUTTON绑定；三个入口不在会被textContent覆盖的WS钩子内。

独立实际生产contract审计673项/19组通过，guide/入口映射/即时闭锁另23项通过；真实v82–v102 getter链加实际PH模块审计1860项/19组通过。后者有48个fresh VM source/target/无关页冷情境、七kind逐字段污染、坏JSON原串、真实WS/DW临时锁保留本章档、重复签收和25个真实HTML按钮唯一ID。明确使用v81完成边界及DOM/audio/timer桩，不是完整全局bootstrap或原生点击。

旧20-key fixture SHA256 `fb7a6ed10b8feeafcfe73358142c772b060640316ce68e510b09ef0d8ec98bf7`不变；21-key fixture SHA256 `767628d5ed2cff4219aaeec8a85ee1883024d2b4e3a78c0637e25fbae04399db`。只读builder确认21个实际getter逐key字节规范，删除任一key或任一WS结局都会关闭gate，零写入。范围为完成且quiet的正常串行上游，不全局禁用或改造旧v63/v85/治理pending语义。

## 真实浏览器范围

始终复用既有Chrome标签80231134，没有新建标签或窗口，没有使用Playwright。原生AX索引点击/Return/滚动；CDP用于原串备份、隔离QA进度、hardreload和只读状态/几何核验，不用JS代点快门或代填本章曝光。本轮开始重新备份完整localStorage的21个raw键、URL `http://127.0.0.1:4173/`、viewport1470×779；原档无PH键，恢复用QA备份键仍保留。只注入21个完成且quiet的上游fixture。

已实际拍照、寄出并全部带回：3左/3左→同位同影/threshold；3左/3右→同位双影/remembrance；2左/4右→异位同影/unending-gallery；2左/5左→全不重合/unending-gallery。第五次将双影互换成3右/3左，右灯余味正确；runs5、unique endings4，只有双影latest更新，其余三对保留。两个画廊回声同时可见。三入口threshold/remembrance/真实weatherless-bus-shelter均原生点击后抵达studio。

已通过：范例不填槽；快门键盘Return；设置改变不改冻结底片；单张/null原位互换；擦除所选槽；第二槽半卷收起source冷刷新后继续且默认第一空槽；不足两张preview禁用；预览不增加runs或结局；revise source冷刷新保留两张；print source冷恢复和target再次刷新只签收一次；print-return source冷恢复清activePrint。未返照片时studio禁新拍并给精确threshold找回链接，实际找回和带回成功。

原生打开PH折叠标题，四格图鉴有16个几何marker、真实pair、第一灯余味及“替别人醒来的旅馆”钩子；入口实际closest为ph-codex。原治理基线下progress-guide隐藏，本轮没有冒称实际点击“找到入口”，该接线由真实source/helper诊断验证。正常串行至五次签收、三入口和图鉴展开后，21个上游raw仍逐字节与fixture一致。

## 测试和交付状态

root最终实跑主套件18429 assertions通过、v101/v102/v103联合50组（12+22+16）全绿，syntax与diff-check通过。本章suite SHA256 `0acac720cef8a1e0434845724fae7782bb5972a8da8d5fe9fd87caed76e7f575`，两份Gemini返回片段机械拼接。它实际执行PH生产slice，使用模拟isTrusted及旧章/store/DOM/audio/timer桩；100/121为独立数学oracle，七pending键集有独立固定oracle，25真实HTML节点为单监听登记。16次VM冷恢复不是原生浏览器。resolve与guide/helper实际执行；sceneInit/bootstrap只查真实源码接线，不称完整VM运行；Group14的sceneInit为测试包装，21个quiet token仅证明模块写隔离，真实21getter链另记。独立只读内存反例审查给preview统一加禁止字段、分别删两个治理PH窄桥、重复入口监听，四个故意回归均被测试捕获，零生产编辑。

390×844取景台15个可见按钮最小高度44px、横向overflow0；①②底片缩图人形和标签可见。手机暗房heading top121.46，高于固定72px栏；同坐标真实叠合，未水平错开。

实际发现手机暗房标签越界：plane143.30×88.71、y394.76；原①tag y386.47、②y372.47、各高19px，越出白板顶边8.29/22.29px；同坐标间距14px重叠5px。带真实尺寸退回exact Gemini后，又将跨人形/影子标签1.5px相交的小缺陷退回；最终CSS SHA256 `c227e65aa2d933d5a7b065def7b2aeef6d5cb644c3a93a9e1305cda14e6b1151`。真实390×844同位同影复验：四标签y404.97/417.97/431.47/444.47、各11px高，任意两tag bbox不相交，所有人形/影子/tag均在plane内，两次人形与两次影子分别物理中心完全相同。0/6影位实际left10%/90%，取景器live实际布局和暗房可见边缘均完整；未将marker错位伪装分离。

桌面最终同位同影人形/影子/tag全在安全区内，标签16.48px高、同类两曝间隔18px，四tag不相交；横向overflow0。原画alt修为描述实际空白幕布/曝光板与周围器材，原生AX已读到更正文案，结局与坐标仍在真实面板描述。最终warn/error日志为空。

已保存01 studio desktop、02 camera desktop、03 camera mobile、04/05初版darkroom、06 mobile before-tag-fix、07四格codex、08/09第一轮标签修正、10边缘初复验、11最终mobile0/6、12最终mobile重合、13最终desktop重合、14原档恢复。保留旧缺陷截图，最终交付截图为12/13，不覆盖早期证据。

另有独立原生跨章锁验证：WS hall点ws-new，真实source pending=start期间PH shelter入口立即disabled，PH raw不变。该阶段确实写了WS测试进度，随后仅还原WS fixture raw并hardreload，入口enabled、21fixture全部byteexact且PH raw仍不变；不冒称这个阶段从未写过上游。此前五路线正常串行的21raw不变结论独立保留。

最后恢复本轮开始的21个原始raw键，按实际白名单撤除24个QA新增键（备份、21上游、PH、图鉴阅读偏好），hardreload后exactRaw=true、21keys，PH/全部fixture/备份均不存在。原档cold开3新场景均退回remembrance，原raw仍精确不变；studio/camera使用不同临时QA query强制完整document reload，最终query全部撤回原URL `http://127.0.0.1:4173/`，active threshold。手机视口override已reset清除，最终浏览器默认inner1470×723；进场时记录1470×779，故不宣称尺寸逐像素回到进场值，也不强行留下新override。仍为同一原Chrome标签，未新建任何窗口/标签。
