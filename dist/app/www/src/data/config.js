/**
 * 软萌大作战 V1.2
 * 软萌大作战 全局配置（纯数据，移植 Cocos/小游戏时可原样复用）
 *
 * © 2026 <著作权人>
 */
var CFG = {
  W: 360,
  H: 640,
  RANGE_K: 0.95,
  HP_K: 1.9,
  HP_END: 2.6,
  HP_CH: [1.34, 1.12, 1.1, 1.18, 1.04, 0.86, 0.76],
  COLS: 5,
  ROWS: 3,
  CELL: 60,
  GRID_X: 30,
  GRID_Y: 412,
  FIELD_TOP: 58,
  FIELD_BOT: 404,
  // 敌人行进路线（逻辑坐标）
  PATH: [
    [60, 74],
    [60, 128],
    [300, 128],
    [300, 208],
    [60, 205],
    [60, 290],
    [285, 290],
    [285, 345]
  ],
  CASTLE: { x: 300, y: 362 },
  BASE_HP: 20,
  START_GOLD: 95,
  BUY_COST: 20,
  BUY_STEP: 4,
  BUY_MAX: 120,
  REROLL_GEMS: 3,
  DRAGON_GEMS: 20,
  AD_SUMMONS: 2
};

// 塔（萌宠）定义：mech 决定攻击机制
CFG.MAX_LV = 5;
CFG.BRANCH_LV = 4;
// 稀有度：N/R/SR/SSR；unlock=通关关卡解锁，gacha=扭蛋获得，gemSummon=战斗中消耗游戏内钻石召唤
CFG.TOWERS = {
  cat: {
    name: '喵喵弓手',
    rar: 'N',
    desc: '单体速射，最可靠的伙伴',
    color: '#ffb86b',
    dark: '#e98a3c',
    dmg: 7,
    rate: 1.6,
    range: 340,
    mech: 'arrow',
    unlock: null
  },
  penguin: {
    name: '企鹅冰冰',
    rar: 'N',
    desc: '雪球减速，小范围溅射',
    color: '#8fd3ff',
    dark: '#4aa3e0',
    dmg: 4,
    rate: 1.0,
    range: 300,
    mech: 'frost',
    slow: 0.4,
    unlock: '1-1'
  },
  frog: {
    name: '蛙蛙毒毒',
    rar: 'N',
    desc: '毒液叠层持续伤害，并削减护甲',
    color: '#9be37a',
    dark: '#5fbf55',
    dmg: 3,
    rate: 1.1,
    range: 300,
    mech: 'poison',
    unlock: '1-7'
  },
  bear: {
    name: '熊熊炮手',
    rar: 'R',
    desc: '范围爆炸，克制护盾，打不到飞行',
    color: '#c99a6e',
    dark: '#9a6b43',
    dmg: 18,
    rate: 0.45,
    range: 320,
    mech: 'cannon',
    splash: 48,
    unlock: '1-4'
  },
  bunny: {
    name: '兔兔电电',
    rar: 'R',
    desc: '闪电链，弹射多个敌人',
    color: '#f6c6ff',
    dark: '#d48be6',
    dmg: 8,
    rate: 0.8,
    range: 300,
    mech: 'chain',
    jumps: 3,
    unlock: '2-5'
  },
  fox: {
    name: '狐狐火球',
    rar: 'R',
    desc: '点燃敌人造成持续伤害',
    color: '#ff8a65',
    dark: '#e0573a',
    dmg: 5,
    rate: 0.75,
    range: 320,
    mech: 'fire',
    unlock: '2-2'
  },
  pig: {
    name: '猪猪存钱罐',
    rar: 'R',
    desc: '不攻击，每波结束产出金币',
    color: '#ffb3c7',
    dark: '#f07d9e',
    dmg: 0,
    rate: 0,
    range: 0,
    mech: 'gold',
    unlock: '2-8'
  },
  owl: {
    name: '咕咕狙击',
    rar: 'R',
    desc: '超远射程，优先狙击血量最高的敌人',
    color: '#c9a07a',
    dark: '#8a6448',
    dmg: 30,
    rate: 0.32,
    range: 620,
    mech: 'snipe',
    unlock: '3-3'
  },
  hedgehog: {
    name: '刺刺弹弹',
    rar: 'R',
    desc: '刺球在敌人间弹跳并击退',
    color: '#f2d0a8',
    dark: '#8a5a3e',
    dmg: 7,
    rate: 0.7,
    range: 300,
    mech: 'bounce',
    unlock: '3-6'
  },
  sheep: {
    name: '咩咩治愈',
    rar: 'R',
    desc: '不攻击，持续为城堡回复生命',
    color: '#fff8f2',
    dark: '#c8b8d0',
    dmg: 0,
    rate: 0,
    range: 0,
    mech: 'heal',
    unlock: '4-1'
  },
  hamster: {
    name: '仓仓导弹',
    rar: 'SR',
    desc: '齐射追踪导弹，可打飞行，小范围爆炸',
    color: '#ffd08f',
    dark: '#eaa25a',
    dmg: 6,
    rate: 0.6,
    range: 360,
    mech: 'missile',
    unlock: '4-4'
  },
  chick: {
    name: '叽叽召唤',
    rar: 'SR',
    desc: '召唤小鸡逆行冲撞敌人',
    color: '#ffe066',
    dark: '#f2bf2a',
    dmg: 12,
    rate: 0.5,
    range: 0,
    mech: 'summon',
    unlock: '4-7'
  },
  deer: {
    name: '鹿鹿光环',
    rar: 'SR',
    desc: '不攻击，周围伙伴伤害、攻速提升',
    color: '#e6a874',
    dark: '#b8784a',
    dmg: 0,
    rate: 0,
    range: 0,
    mech: 'aura',
    gacha: true,
    unlock: '5-6'
  },
  koala: {
    name: '考拉磁磁',
    rar: 'SR',
    desc: '磁力把敌人拉回起点方向',
    color: '#aab3c4',
    dark: '#7e889c',
    dmg: 5,
    rate: 0.45,
    range: 320,
    mech: 'pull',
    gacha: true,
    unlock: '5-3'
  },
  dragon: {
    name: '龙龙光束',
    rar: 'SSR',
    desc: '【钻石】穿透光束，贯穿一排敌人',
    color: '#9be7a0',
    dark: '#4fbf5a',
    dmg: 26,
    rate: 0.6,
    range: 380,
    mech: 'beam',
    gemSummon: true,
    unlock: null
  },
  unicorn: {
    name: '独角兽黑洞',
    rar: 'SSR',
    desc: '制造黑洞吸住敌人并持续伤害',
    color: '#e6d8ff',
    dark: '#b46cff',
    dmg: 10,
    rate: 0.25,
    range: 340,
    mech: 'hole',
    gacha: true,
    unlock: '6-4'
  }
};
// 数据驱动：新增伙伴只需在 CFG.TOWERS 加一条（name/rar/mech/dmg/rate/range/unlock:'章-关' 或 gacha/gemSummon），
// 并在 tools/chars.py 的 PAL + weapon() 里加配色与道具，重跑渲染与 pack_atlas 即可；图鉴/召唤池/解锁/预告自动生效。
CFG.TOWER_ORDER = Object.keys(CFG.TOWERS);
CFG.unlockKey = function (u) {
  var a = u.split('-');
  return +a[0] * 100 + +a[1];
};
CFG.unlockSchedule = function () {
  return CFG.TOWER_ORDER.filter(function (t) {
    return CFG.TOWERS[t].unlock;
  }).sort(function (a, b) {
    return CFG.unlockKey(CFG.TOWERS[a].unlock) - CFG.unlockKey(CFG.TOWERS[b].unlock);
  });
};
CFG.PASSIVE = { gold: 1, heal: 1, aura: 1 };
CFG.RAR_COL = { N: '#9fb3c8', R: '#4fa8ff', SR: '#b46cff', SSR: '#ffb020' };
// 跨塔融合：两只不同伙伴都达到 Lv5（满级）时拖到一起 → 独特融合伙伴（同时拥有两者机制 + 专属效果）
CFG.FUSIONS = {
  superconduct: {
    a: 'penguin',
    b: 'bunny',
    name: '超导冰雷',
    color: '#7fd8ff',
    desc: '闪电命中冻结敌人，雪球附带电击'
  },
  inferno: { a: 'bear', b: 'fox', name: '爆烎炎炮', color: '#ff7a3a', desc: '炮弹爆炸点燃范围内所有敌人' },
  plague: { a: 'frog', b: 'chick', name: '毒菇小队', color: '#9be37a', desc: '召唤的小鸡撞击时炸开毒雾' },
  hawkeye: { a: 'owl', b: 'cat', name: '鹰眼神射', color: '#ffb020', desc: '狙击贯穿整条直线，弓箭多射 2 发' },
  magspike: { a: 'hedgehog', b: 'koala', name: '磁暴刺球', color: '#ff4d6d', desc: '刺球每次弹跳都把敌人拉回' },
  bliss: { a: 'pig', b: 'sheep', name: '福运牧场', color: '#ffd23f', desc: '金币 x1.5，并每波额外回复城堡' },
  starlight: { a: 'deer', b: 'unicorn', name: '星辉圣鹿', color: '#c39bff', desc: '光环范围扩大，黑洞更大更久' },
  rocketfire: { a: 'hamster', b: 'fox', name: '烈焰导弹', color: '#ff5a3a', desc: '导弹附带燃烧，爆炸范围更大' },
  frostbeam: { a: 'dragon', b: 'penguin', name: '冰霜龙息', color: '#9fe8ff', desc: '光束冻结路径上的敌人' },
  toxfire: { a: 'frog', b: 'fox', name: '毒火双生', color: '#c86cff', desc: '中毒且燃烧的敌人受到伤害 x1.5' },
  naturesong: {
    a: 'sheep',
    b: 'deer',
    name: '自然颂歌',
    color: '#7ed98a',
    desc: '光环额外回血，减速敌人受到更多自然伤害'
  },
  thornmail: {
    a: 'hedgehog',
    b: 'bear',
    name: '荆棘重甲',
    color: '#c8895a',
    desc: '爆炸附带反伤刺甲，近战敌人受伤回弹'
  }
};
// 融合伙伴可再合成 Lv1-3；两只 Lv2+ 融合伙伴再融合 → 究极伙伴（神话级）
CFG.FUSION_MAX = 3;
CFG.HP_LATE = 1.02;
CFG.ULT_LV = 2;
CFG.FEED_LV = 3;
/** 融合共鸣：第 RESO_W 波起按 RESO_P 概率刷出配方所需伙伴；基础伙伴达到 RESO_LV 级即计入配方进度 */
CFG.RESO_W = 12;
CFG.RESO_P = 0.35;
CFG.RESO_LV = 3;
CFG.ULTIMATES = {
  cosmos: {
    a: 'starlight',
    b: 'frostbeam',
    name: '星海神兽',
    color: '#8a7bff',
    desc: '每 8 秒召唤星海黑洞吞噬全场，光束冻结一切',
    sig: 'cosmos'
  },
  phoenix: {
    a: 'inferno',
    b: 'rocketfire',
    name: '不死凤凰',
    color: '#ff6a2a',
    desc: '每 7 秒降下流星火雨，燃烧伤害 x2',
    sig: 'meteor'
  },
  raijin: {
    a: 'superconduct',
    b: 'magspike',
    name: '雷神降临',
    color: '#5ad0ff',
    desc: '雷暴领域：每秒对全场 6 个敌人落雷并击晕',
    sig: 'storm'
  },
  gaia: {
    a: 'plague',
    b: 'bliss',
    name: '万物之母',
    color: '#7fe07f',
    desc: '召唤小鸡大军，每波回满城堡并产出大量金币',
    sig: 'gaia'
  },
  skyhunter: {
    a: 'hawkeye',
    b: 'toxfire',
    name: '天穹猎手',
    color: '#ffcf3f',
    desc: '每 6 秒万箭齐发，命中附带剧毒与燃烧',
    sig: 'volley'
  },
  verdant: {
    a: 'naturesong',
    b: 'thornmail',
    name: '苍翠守护',
    color: '#5ecf9a',
    desc: '每 7 秒绽放荆棘花环，治疗城堡并刺伤全场',
    sig: 'verdant'
  }
};
(function () {
  for (var k in CFG.FUSIONS) {
    var F = CFG.FUSIONS[k],
      A = CFG.TOWERS[F.a],
      B = CFG.TOWERS[F.b];
    CFG.TOWERS['f_' + k] = {
      name: F.name,
      rar: 'UR',
      desc: F.desc,
      color: F.color,
      dark: A.dark,
      dmg: 0,
      rate: 0,
      range: Math.max(A.range, B.range),
      mech: 'fusion',
      fusion: k,
      parts: [F.a, F.b]
    };
  }
  for (var u in CFG.ULTIMATES) {
    var U = CFG.ULTIMATES[u],
      FA = CFG.TOWERS['f_' + U.a],
      FB = CFG.TOWERS['f_' + U.b];
    CFG.TOWERS['u_' + u] = {
      name: U.name,
      rar: 'MR',
      desc: U.desc,
      color: U.color,
      dark: '#5a3a8a',
      dmg: 0,
      rate: 0,
      range: 400,
      mech: 'fusion',
      ultimate: u,
      fusion: null,
      fx2: [U.a, U.b],
      sig: U.sig,
      parts: FA.parts.concat(FB.parts)
    };
  }
})();
/** 可参与融合的基础伙伴集合 */
CFG.FUSION_PARTS = {};
Object.keys(CFG.FUSIONS).forEach(function (k) {
  CFG.FUSION_PARTS[CFG.FUSIONS[k].a] = 1;
  CFG.FUSION_PARTS[CFG.FUSIONS[k].b] = 1;
});
CFG.ultimateOf = function (a, b) {
  for (var k in CFG.ULTIMATES) {
    var U = CFG.ULTIMATES[k];
    if ((U.a == a && U.b == b) || (U.a == b && U.b == a)) return k;
  }
  return null;
};
CFG.maxLv = function (type) {
  var D = CFG.TOWERS[type];
  return D.ultimate ? 1 : D.fusion ? CFG.FUSION_MAX : CFG.MAX_LV;
};
CFG.fusionOf = function (a, b) {
  for (var k in CFG.FUSIONS) {
    var F = CFG.FUSIONS[k];
    if ((F.a == a && F.b == b) || (F.a == b && F.b == a)) return k;
  }
  return null;
};

// 敌人（史莱姆）定义
CFG.ENEMIES = {
  normal: { desc: '普通史莱姆', name: '软软', hp: 1, speed: 34, color: '#7fd88c', leak: 1, gold: 2, r: 12, from: 1 },
  fast: { desc: '移动很快', name: '急急', hp: 0.55, speed: 62, color: '#ffe066', leak: 1, gold: 2, r: 10, from: 2 },
  flying: {
    desc: '会飞，熊熊炮手打不到',
    name: '飞飞',
    hp: 0.7,
    speed: 40,
    color: '#c3a6ff',
    leak: 1,
    gold: 3,
    r: 11,
    fly: true,
    from: 3
  },
  tank: {
    desc: '血厚有护甲',
    name: '铁铁',
    hp: 2.8,
    speed: 22,
    color: '#9aa7b8',
    leak: 2,
    gold: 5,
    r: 15,
    armor: 2,
    from: 4
  },
  splitter: {
    desc: '死亡分裂成2只',
    name: '分分',
    hp: 1.6,
    speed: 30,
    color: '#e86eb8',
    leak: 1,
    gold: 3,
    r: 14,
    split: 2,
    from: 6
  },
  shield: {
    desc: '护盾，用炮弹打破',
    name: '盾盾',
    hp: 1.2,
    speed: 30,
    color: '#7ec8e3',
    leak: 1,
    gold: 4,
    r: 13,
    shield: 1.5,
    from: 7
  },
  healer: {
    desc: '治疗周围同伴',
    name: '奶奶',
    hp: 1.1,
    speed: 30,
    color: '#b8f27c',
    leak: 1,
    gold: 4,
    r: 12,
    heal: true,
    from: 8
  },
  bomb: {
    desc: '抵达城堡造成大量伤害',
    name: '炸炸',
    hp: 0.9,
    speed: 46,
    color: '#4e4a66',
    leak: 4,
    gold: 4,
    r: 12,
    from: 9
  },
  ghost: {
    desc: '周期性隐身无法被锁定',
    name: '飘飘',
    hp: 0.9,
    speed: 36,
    color: '#f4f4ff',
    leak: 1,
    gold: 4,
    r: 12,
    phase: true,
    fly: false,
    from: 10
  },
  mini: { desc: '小小只', name: '小软', hp: 0.3, speed: 44, color: '#ffb08a', leak: 1, gold: 1, r: 8, from: 99 }
};
CFG.BOSSES = {
  king: { id: 'king', name: '史莱姆大王', skill: '召唤小弟', color: '#6fcf7c', hp: 28, speed: 16, r: 28 },
  turtle: {
    id: 'turtle',
    name: '铁壳龟王',
    skill: '周期无敌护盾',
    color: '#8fd18a',
    hp: 40,
    speed: 13,
    r: 30,
    armor: 4
  },
  bat: { id: 'bat', name: '疾风蝠王', skill: '飞行 + 冲刺', color: '#a98bff', hp: 24, speed: 20, r: 26, fly: true },
  jelly: { id: 'jelly', name: '果冻女王', skill: '半血分裂成两只', color: '#ff5a9a', hp: 30, speed: 15, r: 28 },
  frost: { id: 'frost', name: '冰霜巨人', skill: '冻结伙伴', color: '#bfe9ff', hp: 42, speed: 12, r: 30, armor: 3 },
  magma: { id: 'magma', name: '熔岩焦糖王', skill: '半血狂暴加速', color: '#ff9a4d', hp: 36, speed: 15, r: 28 },
  ghostking: { id: 'ghostking', name: '幽灵法师', skill: '瞬移 + 隐身', color: '#e6e2ff', hp: 30, speed: 15, r: 27 },
  star: { id: 'star', name: '星河魔王', skill: '护盾光环 + 召唤', color: '#ffe066', hp: 48, speed: 13, r: 30, armor: 3 }
};
CFG.MID_BOSSES = ['king', 'turtle', 'bat'];

CFG.ENDLESS = null; // 见 content.js
// 局外天赋（消耗糖果升级）
CFG.TALENTS = [
  { id: 'gold', name: '初始资金', icon: 'coin', desc: '开局金币 +30', max: 5, cost: 20 },
  { id: 'dmg', name: '锋利爪爪', icon: 'paw', desc: '全体伤害 +8%', max: 10, cost: 25 },
  { id: 'rate', name: '快快出击', icon: 'bolt', desc: '全体攻速 +5%', max: 10, cost: 25 },
  { id: 'hp', name: '坚固城堡', icon: 'heart', desc: '城堡生命 +4', max: 5, cost: 30 },
  { id: 'crit', name: '幸运四叶草', icon: 'clover', desc: '暴击率 +4%', max: 5, cost: 35 },
  { id: 'reroll', name: '换换卡', icon: 'reroll', desc: '每局免费刷新 +1', max: 3, cost: 50 },
  { id: 'offline', name: '挂机达人', icon: 'moon', desc: '离线收益 +25%', max: 5, cost: 30 }
];

CFG.SIGNIN = [
  { gems: 30, tickets: 2 },
  { candy: 60, tickets: 1 },
  { gems: 40, tickets: 2 },
  { candy: 80, tickets: 1 },
  { gems: 60, tickets: 3 },
  { candy: 120, tickets: 2 },
  { gems: 120, tickets: 5 }
];
CFG.TASKS = [
  { id: 'kill', name: '消灭 120 只史莱姆', goal: 120, reward: { gems: 30, tickets: 1 } },
  { id: 'merge', name: '合成 6 次', goal: 6, reward: { candy: 50, tickets: 1 } },
  { id: 'wave', name: '通过 8 波', goal: 8, reward: { gems: 25, tickets: 1 } },
  { id: 'ad', name: '观看 1 次广告', goal: 1, reward: { candy: 60, gems: 10 } }
];
CFG.RARITY = {
  common: { name: '普通', color: '#9fb3c8', w: 60 },
  rare: { name: '稀有', color: '#4fa8ff', w: 28 },
  epic: { name: '史诗', color: '#b46cff', w: 10 },
  legend: { name: '传说', color: '#ffb020', w: 2.5 }
};

/** 版本号（与软著申请名称一致） */
CFG.VERSION = '3.1.2';
/** 健康游戏忠告（开始界面全文展示） */
CFG.HEALTH_NOTICE = [
  '抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。',
  '适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。'
];
/** 适龄提示 */
CFG.AGE_RATING = {
  label: '8+',
  lines: [
    '本游戏适合 8 周岁以上用户',
    '卡通休闲塔防，无暴力血腥内容',
    '无任何付费内容，奖励均可通过游戏获得',
    '含观看广告领取奖励功能，均为自愿观看',
    '未成年人请在监护人指导下合理安排游戏时间',
    '防沉迷由平台实名认证系统统一执行'
  ]
};
/** 隐私政策摘要（完整文本见 docs/privacy.md，需在平台后台配置链接） */
CFG.PRIVACY_LINES = [
  '本游戏不收集姓名、手机号、位置等个人信息',
  '游戏进度仅保存在本机',
  '广告由平台广告服务提供，遵循平台隐私规则',
  '成绩纪录只保存在本机',
  '如需删除数据，清除小游戏缓存即可',
  '完整隐私政策可在平台小游戏资料页查看'
];

/** 波次规模：每波敌人数 = WAVE_BASE + 波数 × WAVE_PER（上限按 40 波计）；GOLD_K 为单只敌人金币系数（敌人增多后防止经济膨胀） */
CFG.WAVE_BASE = 14;
CFG.WAVE_PER = 3.2;
CFG.GOLD_K = 0.9;
/** 首领生命系数（敌人数量增加后相对下调，避免首领波成为唯一压力来源） */
CFG.BOSS_K = 0.65;
/** 每波生命成长率 */
CFG.HP_GROW = 1.215;
/** 卡牌伤害/攻速加成递减强度 */
CFG.CARD_SOFT = 0.45;
/** 敌人基础移速系数 */
CFG.SPD_K = 1.1;
/** 传送门保护：敌人走出入口前一小段路程内无法被锁定（入口淡入表现） */
CFG.PORTAL_SAFE = 0.18;
/** 第 12 波之后的额外成长（平滑过渡） */
CFG.HP_ACC = 0.02;
/** 各章传送门保护倍率（第 5 章迷雾章加长） */
CFG.PORTAL_CH = [1, 1, 1.85, 1.65, 1.5, 2.1, 1.6];
/** 中途首领（第 5/10/15 波）生命系数与漏怪伤害下调，避免中期台阶 */
CFG.MIDBOSS_K = 0.7;

/** 离线挂机：每小时基础收益，受「挂机达人」天赋加成；单次最长 8 小时 */
CFG.OFFLINE = { candyPerH: 40, gemsPerH: 4, ticketsPerH: 0.25, maxH: 8 };
