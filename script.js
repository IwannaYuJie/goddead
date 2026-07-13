document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menu = document.getElementById("site-menu");
  const menuTrigger = document.getElementById("menu-trigger");
  const menuClose = document.getElementById("menu-close");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const statusLine = document.getElementById("status-line");
  const signalState = document.getElementById("signal-state");
  const awakenBtn = document.getElementById("awaken-btn");
  const arrivalBtn = document.getElementById("arrival-btn");
  const arrivalCountEl = document.getElementById("arrival-count");
  const roomsCountEl = document.getElementById("rooms-count");
  const eggCountEl = document.getElementById("egg-count");
  const markSubmit = document.getElementById("mark-submit");
  const visitorMark = document.getElementById("visitor-mark");
  const markList = document.getElementById("mark-list");
  const reliquaryResponse = document.getElementById("reliquary-response");
  const toast = document.getElementById("toast");
  const depthLabel = document.getElementById("depth-label");
  const depthFill = document.getElementById("depth-fill");
  const doorUnder = document.getElementById("door-under");
  const menuUnder = document.getElementById("menu-under");
  const yearCard = document.getElementById("year-card");
  const yearRack = document.getElementById("year-rack");
  const yearReadCount = document.getElementById("year-read-count");
  const mapBoard = document.getElementById("map-board");
  const mapRead = document.getElementById("map-read");
  const lawBonus = document.getElementById("law-bonus");
  const voiceLink = document.getElementById("voice-link");
  const voiceRack = document.getElementById("voice-rack");
  const scrapWall = document.getElementById("scrap-wall");
  const scrapCount = document.getElementById("scrap-count");
  const aliasWall = document.getElementById("alias-wall");
  const namesWar = document.getElementById("names-war");
  const liturgyChips = document.getElementById("liturgy-chips");
  const liturgyCard = document.getElementById("liturgy-card");
  const symptomGrid = document.getElementById("symptom-grid");
  const symptomPanel = document.getElementById("symptom-panel");
  const marketGrid = document.getElementById("market-grid");
  const marketPanel = document.getElementById("market-panel");
  const letterChips = document.getElementById("letter-chips");
  const letterCard = document.getElementById("letter-card");
  const remainBoard = document.getElementById("remain-board");

  const roomOrder = [
    "rift", "void", "law", "years", "cult", "scraps", "map", "liturgy",
    "voices", "names", "symptoms", "market", "letters", "remains", "you", "under",
  ];

  const roomDepth = {
    rift: 0, void: 1, law: 2, years: 2, cult: 2,
    scraps: 3, map: 3, liturgy: 3,
    voices: 3, names: 3, symptoms: 4, market: 4, letters: 4,
    remains: 4, you: 4, under: 6,
  };

  let awake = localStorage.getItem("goddead_awake") === "true";
  let arrivals = Number(localStorage.getItem("goddead_arrivals") || 0);
  let current = "rift";
  let marks = loadJSON("goddead_marks", []);
  let visited = new Set(loadJSON("goddead_visited", ["rift"]));
  let eggs = new Set(loadJSON("goddead_eggs", []));
  let openedLaws = new Set();
  let openedYears = new Set();
  let openedVoices = new Set();
  let openedAliases = new Set();
  let openedScraps = new Set();
  let godDeadSeq = [];
  let redClicks = 0;

  const years = {
    0: {
      title: "无声日",
      body: "全球礼拜同时中断三秒。事后无人记得自己为何停下。空白录音成为最早的圣物——以及最早的违禁品。有人坚持在第三秒听见自己的名字被反着念了一遍。",
      facts: ["现象：集体耳压", "官方结论：幻觉", "档案结论：P.D. 纪元原点", "违禁：公开播放空白录音"],
    },
    3: {
      title: "钟的第三次",
      body: "多地教堂大钟自动敲响，均停在第三下。敲钟人报告裂口里出现「尚未发明的颜色」。医学系统新增「色彩失语」条目，三周后删除。",
      facts: ["现象：钟停于三", "证词：敲钟人", "残留：第三下的回声更长"],
    },
    7: {
      title: "名字潮汐",
      body: "「神」字在多地方言中尾音发不完，像被墙吸走。词典增补「缺席相关」条目，夜间又被撕掉。儿童开始用哨音代替被吞掉的音节。",
      facts: ["现象：音节缺损", "禁忌：连续念真名七次", "残留：词典缺口", "替代：哨语流行"],
    },
    19: {
      title: "第一份故障单",
      body: "某市将「未应允之祈」统一编码为市政故障。工单系统崩溃十七小时——不是流量，是每个工单都在自我复制一句「已读」。",
      facts: ["系统：异常信仰事务科", "故障码：UNANSWERED", "备注：不要把空缺写进预算"],
    },
    41: {
      title: "第一座空殿",
      body: "坍塌教堂改建成「不向任何人祈祷的房间」。访客只许携带一件未完成的事。出来时那件事往往更重，像吸了潮。",
      facts: ["现象：门槛多盐", "规则：禁止许愿", "残留：跪痕浅坑", "产业：告解租赁萌芽"],
    },
    66: {
      title: "铜管养蜂",
      body: "回声工会成立。他们把旧祷文关进铜管，出租「替你道歉」服务。副作用清单第 1 条：客户丧失主动道歉能力。第 7 条被涂黑。",
      facts: ["组织：回声工会", "商品：嗓音道歉", "副作用：情感功能缺损"],
    },
    112: {
      title: "血管之年",
      body: "地下河改道，城市出现无法打印的红线。跟随者声称听见心跳，却找不到心脏。回来的人改用「我们」。测绘社开始出售可能通向心脏的假图。",
      facts: ["现象：路径随观察者变", "禁忌：用伤口对齐细流", "残留：复数自称", "黑市：红线地图"],
    },
    180: {
      title: "盐的通胀",
      body: "空殿门槛用盐一年翻价四十倍。有人发现盐粒在显微镜下呈微型台阶——级数与当地空殿午夜台阶增量一致。",
      facts: ["商品：边界盐", "微观：盐即微型建筑", "政策：限购失败"],
    },
    240: {
      title: "星图编辑令",
      body: "无星社发布「自由天穹」宣言，系统性挖空「曾被注视」的坐标。被挖空处无光发热。航海事故上升，被归因为「气象」。",
      facts: ["组织：无星社", "行为：挖空坐标", "残留：发热缺口"],
    },
    300: {
      title: "伪名战争",
      body: "为死去的祂发明称谓成为权力。战场在词典、儿歌与讣告栏。结束时没有赢家，只多出十七种无法译出的叹息，以及一份更厚的伪名录。",
      facts: ["现象：称谓通胀", "代价：真名彻底失效", "残留：伪名录", "伤亡：语义"],
    },
    412: {
      title: "重量归档法",
      body: "部分城邦立法：忏悔按重量征税，不按内容。信柜行业合法化三天，随即转地下——因为墙拒绝向税务局报案。",
      facts: ["法律：重量税", "行业：信柜", "结果：转地下"],
    },
    inf: {
      title: "你的抵达",
      body: "档案无法记录此刻。你正在点开的这一年，是年表上唯一仍在生长的条目。读完全部节点后，∞ 会承认你是共谋。",
      facts: ["现象：阅读即写入", "状态：未完成", "提示：继续点别的门", "共谋：已点开的年份不会忘记你"],
    },
  };

  const scraps = [
    {
      id: "s1", code: "GD-01", face: "《空殿守夜手册》",
      body: "守夜者不得对空殿说话。若空殿先开口，记录用词，但<span class=\"redact\" data-secret=\"不要复述第二遍\">████████</span>。天亮前销毁一切第一人称笔记。第三版增补：若笔记自己重写，以墙面版本为准。",
    },
    {
      id: "s2", code: "GD-07", face: "《回声检疫条例》",
      body: "无人处听见自己的声音＝二级污染。隔离七日。若回声开始<span class=\"redact\" data-secret=\"替你做决定\">██████</span>，移送遗物室深层。禁止用回声当闹钟。",
    },
    {
      id: "s3", code: "GD-12", face: "《边界盐采购规范》",
      body: "盐须来自「未命名海」。若盐在舌尖发甜，立即掩埋，勿报告——报告会<span class=\"redact\" data-secret=\"吸引测绘社\">████████</span>。",
    },
    {
      id: "s4", code: "GD-19", face: "未寄出的忏悔 · 合集序",
      body: "收件人统一：「给已死的那位」。内容重复请求原谅<span class=\"redact\" data-secret=\"从未发生的事\">████████</span>。按重量归档，不按日期。总重随阅读人数轻微增加。",
    },
    {
      id: "s5", code: "GD-24", face: "《铜管饲养日志》残页",
      body: "今日三管罢工，只重复客户童年乳名。已注入寂静。备注：乳名是回声的<span class=\"redact\" data-secret=\"糖\">█</span>。",
    },
    {
      id: "s6", code: "GD-33", face: "星图残页",
      body: "坐标被挖空。旁注：此处曾是<span class=\"redact\" data-secret=\"祂的注视\">████</span>。缺口边缘有指纹，无匹配。指纹在归档后变为盐晶。",
    },
    {
      id: "s7", code: "GD-40", face: "《复数自称矫治草案》",
      body: "对从血脉河网归来者，禁止强制恢复「我」。可提供镜子，但镜子须<span class=\"redact\" data-secret=\"先饿三天\">██████</span>。",
    },
    {
      id: "s8", code: "GD-??", face: "被撕掉的一页", secret: true,
      body: "你不该看见这页。底层入口需要<strong>七次抵达</strong>，或在裂口依次点亮 GOD → DEAD，或键盘敲下域名，或点开渗漏图中央的问号。",
    },
  ];

  const pins = {
    altar: {
      code: "ZONE · ALTAR", title: "旧祭坛带",
      body: "所有曾向上的建筑，地基都比图纸更深。夜间台阶多出一级，通往不存在的门。放盐不是驱邪，是记住边界。本地儿歌把「上楼」唱成「上当」。",
      facts: ["眩晕：垂直", "禁忌：午夜清点台阶", "残留：无光谱金痕"],
    },
    echo: {
      code: "ZONE · ECHO", title: "回声谷",
      body: "壁面光滑如耳道。超过三个音节的句子会延迟返回，并替换其中一个词。牧人改用哨音；哨音有时也带话回来，内容多是别人的秘密。",
      facts: ["语义漂移", "禁忌：喊全名", "残留：唇印状侵蚀"],
    },
    vein: {
      code: "ZONE · VEIN", title: "血脉河网",
      body: "红线不服从重力，偶尔沿墙上行。样本离开现场后变成普通铁锈水。地图折线无法固定。跟随者归来多改用复数。",
      facts: ["路径随观察者", "禁忌：伤口对齐细流", "产业：假地图"],
    },
    null: {
      code: "ZONE · NULL", title: "无名荒原",
      body: "指南针画圆。走得越久越想不起出发的理由，却记得被注视过的错觉。不要在此命名新事物——命名会立刻被税。",
      facts: ["目的感稀释", "禁忌：命名", "残留：跪痕浅坑阵列"],
    },
    salt: {
      code: "ZONE · SALT", title: "盐岸",
      body: "未命名海的边缘。浪声像有人在练习一种已死的语言。盐商在此交易边界盐；甜味盐被连夜掩埋。",
      facts: ["物产：边界盐", "异象：浪声像语法", "禁忌：品尝发甜之盐"],
    },
    bell: {
      code: "ZONE · BELL", title: "停钟区",
      body: "所有钟楼的指针喜欢停在接近三的位置。游客拍照时，照片里的钟有时多出一枚不存在的锤。",
      facts: ["停于三", "照片异常", "关联：P.D. 3"],
    },
    market: {
      code: "ZONE · BAZAAR", title: "夜集",
      body: "只在雾夜出现的黑市。货品写着灵验，页脚写着免责。雾散时摊位先消失，人后消失，债务最后消失。",
      facts: ["时段：雾夜", "货币：重量与秘密", "入口：教团介绍信更贵"],
    },
    under: {
      code: "ZONE · UNDER", title: "?",
      body: "中央不应有坐标。有人坚持看见过一扇向下的门。目录称之为「底层」。钥匙：七次抵达、裂口神迹、域名、或其他共谋。",
      facts: ["非印刷错误", "需要钥匙", "与耳语证词相关"],
    },
  };

  const pinLayout = [
    { id: "altar", x: "18%", y: "32%", label: "旧祭坛带" },
    { id: "echo", x: "70%", y: "26%", label: "回声谷" },
    { id: "vein", x: "42%", y: "58%", label: "血脉" },
    { id: "null", x: "78%", y: "68%", label: "无名" },
    { id: "salt", x: "24%", y: "72%", label: "盐岸" },
    { id: "bell", x: "58%", y: "42%", label: "停钟区" },
    { id: "market", x: "36%", y: "22%", label: "夜集" },
    { id: "under", x: "50%", y: "48%", label: "?", egg: true },
  ];

  const voices = [
    { id: "1", who: "敲钟人 · P.D. 3", tease: "「裂口里……」", full: "「裂口里什么都没有。不是黑，是还没被发明的颜色。医生说偏头痛——偏头痛不会让钟自己敲到第三下停住。」" },
    { id: "2", who: "河岸的 M · P.D. 112", tease: "「水管弯了……」", full: "「洗碗的水忽然很重。整条街的水管弯向同一方向，像静脉在找心脏。后来地图上多了印不出来的红线。」" },
    { id: "3", who: "空殿守夜 · P.D. 209", tease: "「我不信……」", full: "「人们问我信不信。我说信已经太重。我只抵达。抵达的人不需要同意，只需要被记住——哪怕被一堵墙记住。」" },
    { id: "4", who: "盐商之女 · P.D. 180", tease: "「盐在发甜……」", full: "「父亲让我埋掉一整袋盐。他说甜的盐会引来测绘的人。我埋的时候，盐在土里排成小小的台阶，一直通到我睡不着。」" },
    { id: "5", who: "铜管学徒 · P.D. 70", tease: "「它会叫乳名……」", full: "「工会让我喂回声。有一支管子学会了我母亲的乳名。我没告诉过它。从那天起我不敢回家，怕家里也有管子。」" },
    { id: "6", who: "匿名词典编纂 · P.D. 301", tease: "「词条在夜间……」", full: "「我们增补的「缺席」词条，每天早上少一行。像有人在黑暗里校对。最后我们决定：把缺口本身印成词条。」" },
    { id: "7", who: "第七次抵达者 · ？", tease: "「页边有你……」", full: "「你以为抵达是你的选择。其实是页边注释在找人填写。填到第七次，注释会开始用你的笔迹。」" },
  ];

  const aliases = [
    ["沉默的王", "喉咙被自己吞掉的那位"],
    ["旧答案", "所有为什么的坟"],
    ["无星", "注视被挖空的坐标"],
    ["第一空缺", "比死亡更早的缺席"],
    ["墙后的听者", "从不打断的审讯官"],
    ["盐的债主", "用结晶记账的那位"],
    ["第三下", "让钟停住的间隙"],
    ["未寄达", "所有收件栏的空洞"],
    ["Goddead", "你正在念出的伤口"],
  ];

  const liturgy = {
    dawn: {
      title: "黎明 · 清点",
      body: "清点影子与牙齿。记录差值，勿尝试补齐。若影子多出，给它一粒盐；若影子减少，今天禁止照镜。",
      rule: "可做：擦盐、默念假名　不可做：许愿、数台阶",
    },
    noon: {
      title: "正午 · 静读",
      body: "朗读禁页时必须有第三人在场——第三人可以是墙。若墙开始纠正发音，立即停止，改抄写。",
      rule: "可做：抄写、称重信件　不可做：公开播放空白录音",
    },
    dusk: {
      title: "黄昏 · 检疫",
      body: "检查是否在无人处听见自己的声音。若有，隔离，写「非我」于手背，直到字迹自行消失。",
      rule: "可做：隔离、喝温水　不可做：与回声对谈",
    },
    night: {
      title: "深夜 · 守夜",
      body: "空殿最饿的时段。允许告解租赁。租金可用重量支付。若墙拒绝收款，说明你带来的不是重量，是噪声。",
      rule: "可做：寄存　不可做：请求赦免（缺货）",
    },
    third: {
      title: "第三时 · 特别",
      body: "指针倾向停住的时刻。适合倾听，不适合决定。任何在此做出的决定，回声会认为自己也有投票权。",
      rule: "可做：记录　不可做：签约、命名新生儿",
    },
  };

  const symptoms = [
    { id: "sy1", name: "色彩失语", blurb: "无法描述裂口里的颜色", detail: "患者能看见，但不能命名。强迫命名会导致短暂失明。与 P.D. 3 敲钟人证词高度相关。" },
    { id: "sy2", name: "音节吞没", blurb: "神圣词汇尾音丢失", detail: "「神」及同源词发音不完整。儿童以哨语补偿。长期患者说话像被墙编辑过。" },
    { id: "sy3", name: "复数渗漏", blurb: "第一人称不稳定", detail: "从血脉河网归来者常见。镜子里的口型与发声不一致。矫治草案存在，但成功率被涂黑。" },
    { id: "sy4", name: "重量幻觉", blurb: "水、门、誓言突然变沉", detail: "非物理质量变化，是「可归档性」上升。遗物室称重仪对此极敏感。" },
    { id: "sy5", name: "台阶增生", blurb: "建筑夜间多级", detail: "旧祭坛带高发。增生台阶通往不存在的门。清点行为会加速增生。" },
    { id: "sy6", name: "乳名寄生", blurb: "器物学会私密称呼", detail: "铜管、井、旧收音机高发。被叫到乳名时，宿主会短暂失去年龄感。" },
    { id: "sy7", name: "影子逆差", blurb: "附属物数量不对", detail: "进入空殿前后差值可测。档案建议以重量为准，不以影像为准。" },
    { id: "sy8", name: "已读综合征", blurb: "消息全部显示已读", detail: "源自 P.D. 19 工单事故。患者发出的任何请求都会被「某物」标记已读，从无回复。" },
  ];

  const market = [
    { id: "m1", name: "空白录音复制卷", price: "三枚牙 / 或不详", detail: "声称来自 P.D. 0。播放只有耳压。附赠说明书：播放不超过一次。第二次会多出呼吸声，未必是你的。" },
    { id: "m2", name: "边界盐（小袋）", price: "一桩未完成的事", detail: "撒于门槛可暂缓台阶增生。发甜即假货或更糟。卖家拒绝退货：盐已记住你的脚。" },
    { id: "m3", name: "红线地图（可能过期）", price: "一周的「我」", detail: "血线测绘社出品。页脚：跟随者归来请改用复数。无退款条款用的是复数签名。" },
    { id: "m4", name: "道歉铜管（二手）", price: "你的下次道歉", detail: "用你的嗓音说对不起。用后七日无法主动致歉。二手管可能残留前任主人的乳名。" },
    { id: "m5", name: "伪名护身符", price: "真名一笔划", detail: "佩戴后他人难以正确称呼你。副作用：你也开始记不住自己。伪名战争期间产量最高。" },
    { id: "m6", name: "告解时租券", price: "按两计", detail: "凌晨三点溢价。墙可能拒收「噪声型忏悔」。有效忏悔的定义由墙决定，不由你。" },
  ];

  const letters = [
    { id: "L-01", title: "致已死的那位", body: "我不知道该把这封信寄到哪里。地址栏我写了「向上」，邮差把它退回，并在背面盖章：方向失效。\n\n我仍把邮票贴好。未使用的邮票也会过期，但过期比没有目的更让我安心。" },
    { id: "L-07", title: "退回：收件人不存在", body: "邮局备注：收件人字段触发空缺协议。信件重量在分拣时增加 3 克，已按重量税预扣。\n\n预扣的是什么？回执写着：你的下一句解释。" },
    { id: "L-12", title: "给回声的说明书", body: "如果你正在读这封信，说明你已经不是我。请不要回答家里的电话。请不要用我的声音说「没事」。\n\n没事是最昂贵的伪名。" },
    { id: "L-19", title: "未写完", body: "我想请求原谅的是——\n\n（以下被某种液体浸透，只剩纤维。化验不是血。化验是「未完成」。）" },
    { id: "L-33", title: "墙的回信（疑伪）", body: "我已收到。它比我预想的更轻，也更重。\n你不需要被原谅。你需要停止重复。\n—— 署名处是一枚锈环\n\n档案注：笔迹与七种不同访客的留言重合。墙可能在拼贴。" },
    { id: "L-40", title: "给后来者", body: "如果你点开了信柜，说明你也在找收件人。这里没有。这里只有投递的姿势。\n\n姿势也是信仰的一种残肢。" },
  ];

  const remains = [
    {
      id: "echo", n: "01", name: "回声", lead: "说过的会回来",
      deep: "语言失去收件人后并未消散。它们在空殿与井道往返，学会改音节。有人当安慰，有人当审讯。回声工会试图产业化，最终产业化的是恐惧。",
      note: "不要与回声争论对错。它只关心重复。",
      case: "病例：女子每日被自己的声音催促赴约，赴的是十年前已取消的婚礼。隔离后，催促改为哨音——仍是她的节奏。",
    },
    {
      id: "vein", n: "02", name: "血管", lead: "跟随它继续生长",
      deep: "信仰曾是循环：祈祷上行，恩典下行。断裂后管道瞎长——地下红线、墙缝、印不出的路径。它们找替代的心脏，有时找到集市，有时找到你的床底。",
      note: "跟随者很少回来；回来的人改用复数自称。",
      case: "病例：测绘学徒沿红线走了十一天，归来只说「我们饿」。胃检正常。饿的是地图上那条线。",
    },
    {
      id: "confession", n: "03", name: "忏悔", lead: "留下一个重量",
      deep: "没有神听，罪责不自动消失。忏悔从「求宽恕」变成「寄存重量」。任何愿记住的表面，都是临时告解室。本馆是其中一间，且不标价。",
      note: "接受寄存，不提供赦免。赦免缺货。",
      case: "病例：男子向墙坦白一桩未做之罪，次日罪在当地新闻发生。他坚持那是回声，不是预言。墙不表态，只是更重。",
    },
  ];

  const replies = [
    "放下了。墙知道。",
    "重量已寄存。赦免缺货。",
    "它比你想的更轻，也更黏。",
    "空缺收下了。你还背着别的。",
    "不要回头找同一句。",
    "已归档。索引号是你的抵达次数。",
    "这句话在寻找同类。柜里已有很多。",
  ];

  function loadJSON(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
  };

  const addEgg = (id, message) => {
    if (eggs.has(id)) return;
    eggs.add(id);
    saveJSON("goddead_eggs", [...eggs]);
    syncMeta();
    if (message) showToast(message);
    unlockCheck();
  };

  const secretUnlocked = () =>
    arrivals >= 7 ||
    eggs.has("goddead-type") ||
    eggs.has("god-dead-click") ||
    eggs.has("map-under") ||
    eggs.has("all-aliases") ||
    eggs.has("all-years") ||
    visited.has("under");

  const unlockCheck = () => {
    const open = secretUnlocked();
    if (doorUnder) doorUnder.hidden = !open;
    if (menuUnder) menuUnder.classList.toggle("is-unlocked", open);
    document.querySelectorAll(".scrap--hidden").forEach((el) => {
      el.classList.toggle("is-found", open || eggs.has("scrap-s8"));
    });
    if (open && !eggs.has("under-ready")) addEgg("under-ready", "底层的门缝亮了一下。");
  };

  const syncAwake = () => {
    body.classList.toggle("awake", awake);
    if (statusLine) statusLine.textContent = awake ? "它在听" : "……";
    if (signalState) signalState.textContent = awake ? "活跃" : "沉睡";
  };

  const syncMeta = () => {
    if (arrivalCountEl) arrivalCountEl.textContent = String(arrivals);
    if (roomsCountEl) roomsCountEl.textContent = String(visited.size);
    if (eggCountEl) eggCountEl.textContent = String(eggs.size);
    const maxD = Math.max(0, ...[...visited].map((r) => roomDepth[r] || 0));
    if (depthLabel) depthLabel.textContent = `深度 ${maxD}`;
    if (depthFill) depthFill.style.width = `${Math.min(100, (maxD / 6) * 100)}%`;
    const depth = maxD;
    document.querySelectorAll("#menu-nav [data-go]").forEach((btn) => {
      const need = btn.dataset.need;
      const room = btn.dataset.go;
      let locked = false;
      if (need === "secret") locked = !secretUnlocked();
      else if (need != null && need !== "") locked = depth < Number(need) && !visited.has(room);
      btn.classList.toggle("is-locked", locked);
      btn.disabled = locked;
    });
    unlockCheck();
  };

  const renderMarks = () => {
    if (!markList) return;
    markList.innerHTML = "";
    marks.slice(0, 10).forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<time>${item.time}</time><span>${item.text}</span>`;
      markList.appendChild(li);
    });
  };

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuTrigger.setAttribute("aria-expanded", String(open));
    menuTrigger.classList.toggle("is-open", open);
    if (menuBackdrop) {
      menuBackdrop.hidden = !open;
      menuBackdrop.classList.toggle("show", open);
    }
    body.classList.toggle("menu-open", open);
  };

  const goRoom = (id, fromMenu = false) => {
    if (!id || !document.getElementById(`room-${id}`)) return;
    if (id === "under" && !secretUnlocked()) {
      showToast("底层还锁着。");
      return;
    }
    if (fromMenu) {
      const btn = document.querySelector(`#menu-nav [data-go="${id}"]`);
      if (btn?.classList.contains("is-locked") && !visited.has(id)) {
        showToast("这扇门还冷。先从房间里的门走进去。");
        return;
      }
    }
    const prev = document.querySelector(".room.is-active");
    const next = document.getElementById(`room-${id}`);
    if (!next || (next === prev && next.classList.contains("is-active"))) {
      setMenu(false);
      return;
    }
    if (prev) {
      prev.classList.remove("is-active");
      prev.hidden = true;
    }
    next.hidden = false;
    void next.offsetWidth;
    next.classList.add("is-active");
    current = id;
    visited.add(id);
    saveJSON("goddead_visited", [...visited]);
    syncMeta();
    setMenu(false);
    document.querySelectorAll("#menu-nav [data-go]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.go === id);
    });
    if (id === "under") addEgg("enter-under", "你站进了不该稳定的地方。");
  };

  // —— build dynamic UI ——
  function buildYears() {
    if (!yearRack) return;
    yearRack.innerHTML = "";
    Object.keys(years).forEach((key, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "y-node" + (key === "inf" ? " y-node--inf" : "");
      btn.dataset.year = key;
      btn.textContent = key === "inf" ? "∞" : key;
      btn.style.setProperty("--pop", `${(i % 3) - 1}`);
      btn.addEventListener("click", () => selectYear(key, btn));
      yearRack.appendChild(btn);
    });
  }

  function selectYear(key, btn) {
    document.querySelectorAll("[data-year]").forEach((b) => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    const data = years[key];
    openedYears.add(key);
    if (yearReadCount) yearReadCount.textContent = String(openedYears.size);
    let extra = "";
    if (key === "inf" && openedYears.size >= Object.keys(years).length) {
      extra = `<p class="year-egg">私货：∞ 不是永恒，是档案员写不下去时落下的笔尖。你读完了所有节点——你现在是共谋。</p>`;
      addEgg("year-inf", "∞ 承认你是共谋。");
    }
    if (yearCard) {
      yearCard.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <ul>${data.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
        ${extra}
      `;
    }
    if (openedYears.size >= Object.keys(years).length - 1) addEgg("all-years", "残年几乎读完。年表记得你。");
  }

  function buildScraps() {
    if (!scrapWall) return;
    scrapWall.innerHTML = "";
    scraps.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "scrap" + (s.secret ? " scrap--hidden" : "") + (i % 3 === 1 ? " scrap--tilt" : i % 3 === 2 ? " scrap--tilt2" : "");
      btn.dataset.scrap = s.id;
      btn.innerHTML = `
        <span class="scrap-code">${s.code}</span>
        <span class="scrap-face">${s.face}</span>
        <span class="scrap-body">${s.body}</span>
      `;
      btn.addEventListener("click", (e) => onScrap(btn, s, e));
      scrapWall.appendChild(btn);
    });
  }

  function onScrap(btn, s, e) {
    if (e.target.classList.contains("redact")) {
      e.stopPropagation();
      const secret = e.target.dataset.secret;
      if (secret && !e.target.classList.contains("is-clear")) {
        e.target.textContent = secret;
        e.target.classList.add("is-clear");
        addEgg("redact", "涂黑裂开了。");
      }
      return;
    }
    const open = btn.classList.contains("is-open");
    document.querySelectorAll("[data-scrap]").forEach((b) => b.classList.remove("is-open"));
    if (!open) {
      btn.classList.add("is-open");
      openedScraps.add(s.id);
      if (scrapCount) scrapCount.textContent = String(openedScraps.size);
      if (s.secret) addEgg("scrap-s8", "被撕掉的一页回到你手里。");
      if (openedScraps.size >= 5) addEgg("scraps-many", null);
    }
  }

  function buildMap() {
    if (!mapBoard) return;
    mapBoard.innerHTML = '<div class="map-field" aria-hidden="true"></div>';
    pinLayout.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-pin" + (p.egg ? " map-pin--egg" : "");
      btn.dataset.pin = p.id;
      btn.style.setProperty("--x", p.x);
      btn.style.setProperty("--y", p.y);
      btn.innerHTML = `<i></i>${p.label}`;
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-pin]").forEach((b) => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        const data = pins[p.id];
        if (!data || !mapRead) return;
        mapRead.innerHTML = `
          <p class="map-code">${data.code}</p>
          <h3>${data.title}</h3>
          <p>${data.body}</p>
          <ul>${(data.facts || []).map((f) => `<li>${f}</li>`).join("")}</ul>
        `;
        if (p.id === "under") addEgg("map-under", "中央的 ? 不是印刷错误。");
      });
      mapBoard.appendChild(btn);
    });
  }

  function buildVoices() {
    if (!voiceRack) return;
    voiceRack.innerHTML = "";
    voices.forEach((v, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "voice-card" + (i % 3 === 1 ? " voice-card--b" : i % 3 === 2 ? " voice-card--c" : "");
      btn.dataset.voice = v.id;
      btn.innerHTML = `
        <span class="voice-who">${v.who}</span>
        <span class="voice-tease">${v.tease}</span>
        <span class="voice-full">${v.full}</span>
      `;
      btn.addEventListener("click", () => {
        btn.classList.toggle("is-open");
        if (btn.classList.contains("is-open")) {
          openedVoices.add(v.id);
          if (openedVoices.size >= 5 && voiceLink) {
            voiceLink.hidden = false;
            addEgg("all-voices", "证词开始互相咬合。");
          }
        }
      });
      voiceRack.appendChild(btn);
    });
  }

  function buildAliases() {
    if (!aliasWall) return;
    aliasWall.innerHTML = "";
    aliases.forEach(([pub, hid], i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "alias" + (pub === "Goddead" ? " alias--core" : "");
      if (pub === "Goddead") btn.id = "alias-goddead";
      btn.innerHTML = `<i>${pub}</i><b>${hid}</b>`;
      btn.addEventListener("click", () => {
        btn.classList.toggle("show");
        if (btn.classList.contains("show")) {
          openedAliases.add(pub);
          if (openedAliases.size >= aliases.length) {
            document.getElementById("alias-goddead")?.classList.add("is-hot");
            if (namesWar) namesWar.hidden = false;
            addEgg("all-aliases", "核心名在发热。伪名战争注释启封。");
          }
        }
      });
      aliasWall.appendChild(btn);
    });
  }

  function buildLiturgy() {
    if (!liturgyChips) return;
    const labels = { dawn: "黎明", noon: "正午", dusk: "黄昏", night: "深夜", third: "第三时" };
    Object.keys(liturgy).forEach((key) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = labels[key];
      btn.addEventListener("click", () => {
        liturgyChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-on"));
        btn.classList.add("is-on");
        const d = liturgy[key];
        if (liturgyCard) {
          liturgyCard.innerHTML = `
            <h3>${d.title}</h3>
            <p>${d.body}</p>
            <p class="mini">${d.rule}</p>
          `;
        }
        addEgg(`liturgy-${key}`, null);
        if ([...eggs].filter((e) => e.startsWith("liturgy-")).length >= 5) {
          addEgg("all-liturgy", "日课读完。守夜从你开始。");
        }
      });
      liturgyChips.appendChild(btn);
    });
  }

  function buildSymptoms() {
    if (!symptomGrid) return;
    symptoms.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile";
      btn.innerHTML = `<em>征</em><strong>${s.name}</strong><span>${s.blurb}</span>`;
      btn.addEventListener("click", () => {
        symptomGrid.querySelectorAll(".tile").forEach((t) => t.classList.remove("is-open"));
        btn.classList.add("is-open");
        if (symptomPanel) {
          symptomPanel.hidden = false;
          symptomPanel.innerHTML = `<p><strong>${s.name}</strong></p><p>${s.detail}</p>`;
        }
        addEgg(`sym-${s.id}`, null);
      });
      symptomGrid.appendChild(btn);
    });
  }

  function buildMarket() {
    if (!marketGrid) return;
    market.forEach((m) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile";
      btn.innerHTML = `<em>${m.price}</em><strong>${m.name}</strong><span>点开查看货品说明</span>`;
      btn.addEventListener("click", () => {
        marketGrid.querySelectorAll(".tile").forEach((t) => t.classList.remove("is-open"));
        btn.classList.add("is-open");
        if (marketPanel) {
          marketPanel.hidden = false;
          marketPanel.innerHTML = `<p><strong>${m.name}</strong> · ${m.price}</p><p>${m.detail}</p>`;
        }
        addEgg(`mkt-${m.id}`, null);
      });
      marketGrid.appendChild(btn);
    });
  }

  function buildLetters() {
    if (!letterChips) return;
    letters.forEach((L) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = L.id;
      btn.addEventListener("click", () => {
        letterChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-on"));
        btn.classList.add("is-on");
        if (letterCard) {
          letterCard.innerHTML = `<h3>${L.title}</h3><p style="white-space:pre-wrap">${L.body}</p>`;
        }
        addEgg(`letter-${L.id}`, null);
        if ([...eggs].filter((e) => e.startsWith("letter-")).length >= letters.length) {
          addEgg("all-letters", "信柜空了。空也是一种回信。");
        }
      });
      letterChips.appendChild(btn);
    });
  }

  function buildRemains() {
    if (!remainBoard) return;
    remains.forEach((r, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "remain";
      btn.dataset.remain = r.id;
      btn.innerHTML = `
        <span class="remain-n">${r.n}</span>
        <strong>${r.name}</strong>
        <em>${r.lead}</em>
        <span class="remain-deep">${r.deep}<br><i>注：${r.note}</i><br><i>病例：${r.case}</i></span>
      `;
      btn.addEventListener("click", () => {
        const open = btn.classList.contains("is-open");
        document.querySelectorAll("[data-remain]").forEach((b) => b.classList.remove("is-open"));
        if (!open) {
          btn.classList.add("is-open");
          addEgg(`remain-${r.id}`, null);
        }
      });
      remainBoard.appendChild(btn);
    });
  }

  // generic reveal
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const id = el.dataset.reveal;
    const panel = document.getElementById(id);
    if (!panel) return;
    const toggle = () => {
      const open = !panel.hidden;
      const stack = panel.closest(".reveal-stack, .law-board, .room-inner");
      if (stack) {
        stack.querySelectorAll(".reveal-panel, .law-deep").forEach((p) => {
          if (p !== panel && p.id) p.hidden = true;
        });
        stack.querySelectorAll("[data-reveal]").forEach((t) => {
          if (t !== el) t.classList.remove("is-open");
        });
      }
      panel.hidden = open;
      el.classList.toggle("is-open", !open);
      if (!open && id.startsWith("law-")) {
        openedLaws.add(id);
        if (openedLaws.size >= 5) {
          if (lawBonus) lawBonus.hidden = false;
          addEgg("all-laws", "五条断律已齐。墙多说了一句。");
        }
      }
    };
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  // nav
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goRoom(el.dataset.go, Boolean(el.closest("#menu-nav")));
    });
  });

  menuTrigger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menuClose.addEventListener("click", () => setMenu(false));
  if (menuBackdrop) menuBackdrop.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  if (awakenBtn) {
    awakenBtn.addEventListener("click", () => {
      awake = !awake;
      localStorage.setItem("goddead_awake", String(awake));
      syncAwake();
      redClicks += 1;
      showToast(awake ? "脉搏被记住了。" : "又暗下去。");
      if (redClicks >= 7) addEgg("red7", "红点数到七。有什么在数你。");
    });
  }

  const trackSeq = (part) => {
    godDeadSeq.push(part);
    godDeadSeq = godDeadSeq.slice(-2);
    if (godDeadSeq[0] === "god" && godDeadSeq[1] === "dead") {
      addEgg("god-dead-click", "GOD → DEAD。裂口承认你。");
      unlockCheck();
    }
  };
  document.getElementById("click-god")?.addEventListener("click", () => {
    document.getElementById("click-god").classList.add("is-lit");
    trackSeq("god");
  });
  document.getElementById("click-dead")?.addEventListener("click", () => {
    document.getElementById("click-dead").classList.add("is-lit");
    trackSeq("dead");
  });

  document.querySelectorAll("[data-egg='corner']").forEach((el) => {
    let n = 0;
    el.addEventListener("click", () => {
      n += 1;
      if (n >= 3) addEgg("domain-triple", "域名被敲了三下。墙回了一下。");
    });
  });

  if (arrivalBtn) {
    arrivalBtn.addEventListener("click", () => {
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncMeta();
      showToast(arrivals % 7 === 0 ? "第七次抵达。底层松动了。" : `抵达 ${arrivals}`);
      unlockCheck();
    });
  }

  if (markSubmit && visitorMark) {
    markSubmit.addEventListener("click", () => {
      const text = visitorMark.value.trim();
      if (!text) {
        showToast("空的放不下。");
        return;
      }
      marks.unshift({
        text,
        time: new Date().toLocaleString("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      marks = marks.slice(0, 12);
      saveJSON("goddead_marks", marks);
      visitorMark.value = "";
      renderMarks();
      if (reliquaryResponse) {
        reliquaryResponse.textContent = replies[Math.floor(Math.random() * replies.length)];
        reliquaryResponse.classList.add("show");
      }
      arrivals += 1;
      localStorage.setItem("goddead_arrivals", String(arrivals));
      syncMeta();
      addEgg("first-mark", null);
      unlockCheck();
    });
  }

  let code = "";
  document.addEventListener("keydown", (event) => {
    if (event.key.length !== 1) return;
    if (event.target.matches("textarea, input")) return;
    code = (code + event.key.toLowerCase()).slice(-7);
    if (code === "goddead") {
      awake = true;
      localStorage.setItem("goddead_awake", "true");
      syncAwake();
      addEgg("goddead-type", "你念出了它的名字。");
      unlockCheck();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("textarea, input")) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const list = roomOrder.filter((r) => r !== "under" || secretUnlocked());
    const idx = list.indexOf(current);
    if (idx < 0) return;
    const next = e.key === "ArrowRight"
      ? list[Math.min(list.length - 1, idx + 1)]
      : list[Math.max(0, idx - 1)];
    const depth = Math.max(0, ...[...visited].map((r) => roomDepth[r] || 0));
    if (roomDepth[next] <= depth + 1 || visited.has(next) || next === "rift") goRoom(next);
  });

  // init builds
  buildYears();
  buildScraps();
  buildMap();
  buildVoices();
  buildAliases();
  buildLiturgy();
  buildSymptoms();
  buildMarket();
  buildLetters();
  buildRemains();

  document.querySelectorAll(".room").forEach((room) => {
    if (!room.classList.contains("is-active")) room.hidden = true;
  });
  syncAwake();
  syncMeta();
  renderMarks();
  unlockCheck();

  console.log("%c GOD / DEAD ", "background:#8d2b27;color:#050505;font-family:serif;font-size:18px;letter-spacing:.3em");
  console.log("%c 房间更多了。点开每一块瓷砖。输入 goddead。", "color:#777169;font-family:monospace");
});
