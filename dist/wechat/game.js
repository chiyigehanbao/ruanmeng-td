// 软萌大作战 小游戏包（构建生成，勿手改）
/**
 * 软萌大作战 V1.0
 * 小游戏适配层（微信 wx / 抖音 tt 通用）：将浏览器 API 映射到小游戏 API
 *
 * © 2026 <著作权人>
 */
// 只覆盖本游戏用到的：canvas、触摸、localStorage、Image、WebAudio、可见性、尺寸。
var __api = typeof tt !== 'undefined' && tt.createCanvas ? tt : wx;
var __sys = __api.getSystemInfoSync();
var __L = {};
function __on(t, fn) {
  (__L[t] = __L[t] || []).push(fn);
}
function __fire(t, e) {
  (__L[t] || []).forEach(function (f) {
    f(e);
  });
}
var __canvas = __api.createCanvas();
__canvas.style = {};
__canvas.getBoundingClientRect = function () {
  return { left: 0, top: 0, width: __sys.windowWidth, height: __sys.windowHeight };
};
__canvas.addEventListener = function (t, fn) {
  __on(t, fn);
};
function __te(e) {
  return {
    touches: e.touches || [],
    changedTouches: e.changedTouches || e.touches || [],
    preventDefault: function () {}
  };
}
__api.onTouchStart(function (e) {
  __fire('touchstart', __te(e));
});
__api.onTouchMove(function (e) {
  __fire('touchmove', __te(e));
});
__api.onTouchEnd(function (e) {
  __fire('touchend', __te(e));
});
__api.onTouchCancel &&
  __api.onTouchCancel(function (e) {
    __fire('touchend', __te(e));
  });
var innerWidth = __sys.windowWidth,
  innerHeight = __sys.windowHeight,
  devicePixelRatio = __sys.pixelRatio;
function addEventListener(t, fn) {
  __on(t, fn);
}
var document = {
  hidden: false,
  getElementById: function () {
    return __canvas;
  },
  createElement: function (t) {
    return t == 'canvas' ? __api.createCanvas() : { style: {} };
  },
  addEventListener: function (t, fn) {
    __on(t, fn);
  }
};
__api.onHide(function () {
  document.hidden = true;
  __fire('visibilitychange', {});
});
// 启动参数需在 game.js 运行时同步监听（抖音侧边栏复访要求）
var __lastShow = (__api.getLaunchOptionsSync && __api.getLaunchOptionsSync()) || {};
__api.onShow(function (o) {
  __lastShow = o || {};
  document.hidden = false;
  __fire('visibilitychange', {});
});
var localStorage = {
  getItem: function (k) {
    try {
      var v = __api.getStorageSync(k);
      return v === '' || v === undefined ? null : v;
    } catch (e) {
      return null;
    }
  },
  setItem: function (k, v) {
    try {
      __api.setStorageSync(k, String(v));
    } catch (e) {}
  },
  removeItem: function (k) {
    __api.removeStorageSync(k);
  },
  clear: function () {
    __api.clearStorageSync();
  }
};
function Image() {
  return __api.createImage();
}
var location = { search: '', href: '' },
  navigator = {};
var performance = {
  now: function () {
    return Date.now();
  }
};
var requestAnimationFrame =
  (typeof GameGlobal !== 'undefined' && GameGlobal.requestAnimationFrame) ||
  requestAnimationFrame ||
  function (f) {
    return setTimeout(function () {
      f(Date.now());
    }, 16);
  };
var window = {
  devicePixelRatio: devicePixelRatio,
  innerWidth: innerWidth,
  innerHeight: innerHeight,
  addEventListener: addEventListener,
  AudioContext: __api.createWebAudioContext
    ? function () {
        return __api.createWebAudioContext();
      }
    : undefined
};

// ===== END ADAPTER =====

// ---- src/data/config.js ----
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
  HP_CH: [1.34, 1.12, 1.10, 1.18, 1.04, 0.86, 0.76],
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
CFG.VERSION = '3.1.1';
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
  '排行榜仅显示游戏内昵称与成绩',
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


// ---- src/core/storage.js ----
/**
 * 软萌大作战 V1.0
 * 本地存储与玩家存档
 *
 * © 2026 <著作权人>
 */
var Storage = {
  get: function (k, d) {
    try {
      var v = localStorage.getItem('rm_' + k);
      return v == null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  },
  set: function (k, v) {
    try {
      localStorage.setItem('rm_' + k, JSON.stringify(v));
    } catch (e) {}
  }
};
var Save = {
  d: null,
  load: function () {
    this.d = Storage.get('save', null) || {
      gems: 0,
      candy: 0,
      talents: {},
      stars: {},
      best: 0,
      tut: false,
      signDay: 0,
      signDate: '',
      taskDate: '',
      tasks: {},
      taskClaimed: {},
      lastSeen: 0,
      mute: false
    };
    return this.d;
  },
  save: function () {
    Storage.set('save', this.d);
  },
  tl: function (id) {
    return this.d.talents[id] || 0;
  },
  add: function (r) {
    if (r.gems) this.d.gems += r.gems;
    if (r.candy) this.d.candy += r.candy;
    if (r.tickets) this.d.tickets = (this.d.tickets || 0) + r.tickets;
    this.save();
  },
  today: function () {
    return new Date().toDateString();
  },
  checkDaily: function () {
    var t = this.today();
    if (this.d.taskDate !== t) {
      this.d.taskDate = t;
      this.d.tasks = {};
      this.d.taskClaimed = {};
      this.save();
    }
  },
  task: function (id, n) {
    this.checkDaily();
    this.d.tasks[id] = (this.d.tasks[id] || 0) + (n || 1);
  },
  unlocked: function (type) {
    var D = CFG.TOWERS[type];
    if (!D || D.parts) return false;
    if (this.d.owned && this.d.owned[type]) return true;
    var u = D.unlock;
    if (D.gacha && !u) return false;
    if (!u) return !D.gemSummon;
    return !!this.d.stars[u];
  },
  // 出战编队：5 个伙伴（随机召唤池）
  team: function () {
    var d = this.d,
      self = this;
    if (!d.team) d.team = [];
    d.team = d.team.filter(function (t) {
      return self.unlocked(t);
    });
    CFG.TOWER_ORDER.forEach(function (t) {
      if (d.team.length < 5 && d.team.indexOf(t) < 0 && self.unlocked(t) && !(d.teamOff && d.teamOff[t]))
        d.team.push(t);
    });
    return d.team.slice();
  },
  toggleTeam: function (t) {
    var d = this.d;
    this.team();
    d.teamOff = d.teamOff || {};
    var i = d.team.indexOf(t);
    if (i >= 0) {
      if (d.team.length <= 2) return 'min';
      d.team.splice(i, 1);
      d.teamOff[t] = 1;
    } else {
      if (!this.unlocked(t)) return 'lock';
      if (d.team.length >= 5) return 'full';
      d.team.push(t);
      delete d.teamOff[t];
    }
    this.save();
    return 'ok';
  },
  // 解锁同步：返回新解锁的伙伴（自动编入出战队伍，满员时替换最后一位）；老存档首次同步静默补齐
  syncUnlocks: function (silent) {
    var d = this.d,
      self = this,
      nu = [];
    if (!d.seenUnlock) {
      d.seenUnlock = {};
      silent = true;
    }
    CFG.TOWER_ORDER.forEach(function (t) {
      if (self.unlocked(t) && !d.seenUnlock[t]) {
        d.seenUnlock[t] = 1;
        nu.push(t);
      }
    });
    nu.forEach(function (t) {
      self.team();
      if (d.teamOff) delete d.teamOff[t];
      if (d.team.indexOf(t) < 0) {
        if (d.team.length >= 5) d.team[4] = t;
        else d.team.push(t);
      }
    });
    if (nu.length) this.save();
    return silent ? [] : nu;
  },
  unlockAt: function (id) {
    var r = [];
    CFG.TOWER_ORDER.forEach(function (t) {
      if (CFG.TOWERS[t].unlock == id) r.push(t);
    });
    return r;
  },
  prevCleared: function (id) {
    return !!this.d.stars[id];
  },
  levelOpen: function (c, l) {
    if (c == 1 && l == 1) return true;
    var p = l > 1 ? c + '-' + (l - 1) : c - 1 + '-' + CFG.LEVELS_PER;
    return !!this.d.stars[p];
  }
};


// ---- src/platform/platform.js ----
/**
 * 软萌大作战 V1.0
 * 平台抽象层：运行时识别 web / 微信小游戏(wx) / 抖音小游戏(tt) / 原生 App 壳
 *
 * © 2026 <著作权人>
 */
// 所有广告、分享、排行榜、震动都只通过 Platform 调用；具体实现在下方 ADAPTERS 中。
// 需要填写的 ID 全部集中在 PLATFORM_CFG（见 README）。
var PLATFORM_CFG = {
  wechat: {
    rewardedAdUnitId: 'adunit-xxxxxxxxxxxxxxxx',
    interstitialAdUnitId: 'adunit-yyyyyyyyyyyyyyyy',
    bannerAdUnitId: 'adunit-zzzzzzzzzzzzzzzz',
    shareImage: 'share.png'
  },
  douyin: {
    appId: 'tt0b317d8c9548f13202',
    rewardedAdUnitId: 'xxxxxxxxxxxxxxxxxx',
    interstitialAdUnitId: 'yyyyyyyyyyyyyyyyyy',
    bannerAdUnitId: 'zzzzzzzzzzzzzzzzzz',
    shareImage: 'share.png'
  },
  app: {
    admobRewardedAndroid: 'ca-app-pub-3940256099942544/5224354917',
    admobRewardedIOS: 'ca-app-pub-3940256099942544/1712485313',
    admobInterstitialAndroid: 'ca-app-pub-3940256099942544/1033173712',
    admobInterstitialIOS: 'ca-app-pub-3940256099942544/4411468910'
  },
  // 广告频控：插屏仅在关卡结算后展示；前若干次启动不展示；两次插屏最短间隔（秒）；看完激励视频后的冷却（秒）
  interstitial: { minSessions: 3, minGapSec: 150, everyN: 2, afterRewardedSec: 60 },
  // 菜单底部横幅（可选，默认关闭；战斗中永不展示）
  bannerEnabled: false,
  // 后端开关：'mock' = 本地模拟；'server' = 扭蛋记录/排行榜走 server/（见 README）
  mode: 'mock',
  // 远程美术 CDN（可选）：填 https://cdn.xxx.com/ruanmeng/art/ 后用 REMOTE_ART=该地址 node tools/build.js 构建，图集不进包体
  remoteArt: '',
  serverUrl: 'http://127.0.0.1:8787'
};
function detectEnv() {
  if (typeof wx !== 'undefined' && wx.createRewardedVideoAd) return 'wechat';
  return 'web';
}
var ADAPTERS = {
  // ---------- 微信小游戏 ----------
  wechat: {
    safe: function () {
      var s = wx.getSystemInfoSync(),
        a = s.safeArea;
      if (!a) return { top: 0, bottom: 0, left: 0, right: 0 };
      return {
        top: Math.max(0, a.top),
        bottom: Math.max(0, s.windowHeight - a.bottom),
        left: Math.max(0, a.left),
        right: Math.max(0, s.windowWidth - a.right)
      };
    },
    req: function (method, url, body, fin) {
      wx.request({
        url: url,
        method: method,
        data: body || {},
        header: { 'content-type': 'application/json' },
        success: function (r) {
          r.statusCode == 200 ? fin(null, r.data) : fin(r.statusCode);
        },
        fail: function (e) {
          fin(e || 'fail');
        }
      });
    },
    init: function () {
      var C = PLATFORM_CFG.wechat;
      try {
        wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
        wx.onShareAppMessage(function () {
          return { title: '软萌大作战：萌宠合成塔防，一起守护城堡！', imageUrl: C.shareImage };
        });
      } catch (e) {}
    },
    boot: function (cb) {
      // 美术资源放在分包 art 中
      Platform.loadSubs(wx, cb);
    },
    _ad: null,
    ad: function (pl, ok, fail) {
      var C = PLATFORM_CFG.wechat;

      if (!this._ad) {
        this._ad = wx.createRewardedVideoAd({ adUnitId: C.rewardedAdUnitId });
      }
      var a = this._ad;
      a.offClose && a.offClose();
      a.onClose(function (r) {
        if (!r || r.isEnded) ok();
        else fail && fail('notEnded');
      });
      a.show().catch(function () {
        a.load()
          .then(function () {
            return a.show();
          })
          .catch(function (e) {
            wx.showToast({ title: '广告暂时不可用', icon: 'none' });
            fail && fail(e);
          });
      });
    },
    _it: null,
    _bn: null,
    inter: function () {
      var C = PLATFORM_CFG.wechat;
      try {
        if (!this._it) this._it = wx.createInterstitialAd({ adUnitId: C.interstitialAdUnitId });
        this._it.show().catch(function () {});
      } catch (e) {}
    },
    banner: function (show) {
      var C = PLATFORM_CFG.wechat;
      try {
        if (show) {
          if (!this._bn) {
            var s = wx.getSystemInfoSync();
            this._bn = wx.createBannerAd({
              adUnitId: C.bannerAdUnitId,
              style: { left: 0, top: s.windowHeight - 90, width: s.windowWidth }
            });
          }
          this._bn.show();
        } else if (this._bn) this._bn.hide();
      } catch (e) {}
    },
    share: function (o, cb) {
      wx.shareAppMessage({ title: o.text, imageUrl: PLATFORM_CFG.wechat.shareImage });
      setTimeout(function () {
        cb(true);
      }, 800);
    },
    vibrate: function (ms) {
      try {
        if (ms && ms > 30 && wx.vibrateLong) wx.vibrateLong({});
        else wx.vibrateShort({ type: ms && ms > 18 ? 'medium' : 'light' });
      } catch (e) {}
    }
  },
};
/** 启动加载界面：分包下载与图集解码期间显示进度 */
var Boot = {
  p: 0,
  msg: '加载中',
  on: true,
  set: function (p, msg) {
    this.p = Math.max(this.p, Math.min(1, p));
    if (msg) this.msg = msg;
    this.draw();
  },
  draw: function () {
    var c = typeof UI != 'undefined' && UI.c;
    if (!c || !this.on) return;
    var W = CFG.W,
      H = CFG.H,
      bw = 240,
      bx = (W - bw) / 2,
      by = H * 0.58,
      R = 8;
    var gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#ffe3ee');
    gr.addColorStop(0.55, '#fff0f5');
    gr.addColorStop(1, '#fff6e0');
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
    // soft orbs
    c.fillStyle = 'rgba(255,143,177,.22)';
    c.beginPath();
    c.arc(W * 0.2, H * 0.22, 48, 0, 7);
    c.fill();
    c.fillStyle = 'rgba(143,211,255,.2)';
    c.beginPath();
    c.arc(W * 0.82, H * 0.28, 36, 0, 7);
    c.fill();
    c.textAlign = 'center';
    c.fillStyle = '#ff6f9c';
    var df = typeof FONT_DISPLAY != 'undefined' ? FONT_DISPLAY : 'sans-serif';
    c.font = '900 42px ' + df;
    c.fillText('软萌大作战', W / 2, H * 0.38);
    c.fillStyle = '#c07088';
    c.font = '14px ' + df;
    c.fillText('合成 · 塔防 · 肉鸽', W / 2, H * 0.38 + 28);
    // rounded progress track
    c.fillStyle = 'rgba(255,255,255,.75)';
    if (typeof rr == 'function') {
      rr(c, bx - 4, by - 4, bw + 8, 20, R + 2);
      c.fill();
      c.fillStyle = 'rgba(160,90,110,.18)';
      rr(c, bx, by, bw, 12, R);
      c.fill();
      c.fillStyle = '#ff8fb3';
      rr(c, bx, by, Math.max(R * 2, bw * this.p), 12, R);
      c.fill();
    } else {
      c.fillRect(bx, by, bw, 12);
      c.fillStyle = '#ff8fb3';
      c.fillRect(bx, by, bw * this.p, 12);
    }
    c.fillStyle = '#a06478';
    c.font = '14px sans-serif';
    c.fillText(this.msg + ' ' + Math.round(this.p * 100) + '%', W / 2, by + 36);
  }
};
var Platform = {
  // 依次加载美术分包（构建时按 ≤4MB 拆成 art/art2/...；配置 PLATFORM_CFG.remoteArt 时改为 CDN 远程加载，不占包体）
  loadSubs: function (api, cb) {
    var L = (typeof ART_SUBS != 'undefined' ? ART_SUBS : ['art']).slice();
    if (PLATFORM_CFG.remoteArt || !api.loadSubpackage || !L.length) {
      cb();
      return;
    }
    var total = L.length,
      done = 0;
    (function nx() {
      var n = L.shift();
      if (!n) {
        cb();
        return;
      }
      var fin = function () {
        done++;
        Boot.set((done / total) * 0.85, '加载美术资源');
        nx();
      };
      var task = api.loadSubpackage({ name: n, success: fin, fail: fin });
      if (task && task.onProgressUpdate)
        task.onProgressUpdate(function (r) {
          Boot.set(((done + (r.progress || 0) / 100) / total) * 0.85, '加载美术资源');
        });
    })();
  },
  env: detectEnv(),
  get A() {
    return ADAPTERS[this.env] || ADAPTERS.web;
  },
  // 安全区（刘海/圆角/Home 指示条），单位：CSS 像素
  safeInsets: function () {
    try {
      return this.A.safe();
    } catch (e) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  },
  // ---- 后端请求（wx.request / tt.request / fetch） ----
  server: function () {
    return PLATFORM_CFG.mode == 'server' && PLATFORM_CFG.serverUrl;
  },
  uid: function () {
    return 'u' + Save.d.lbSeed;
  }, // 正式版：wx.login / tt.login 换取 openid
  request: function (method, path, body, cb) {
    var url = PLATFORM_CFG.serverUrl + path,
      done = false,
      fin = function (e, d) {
        if (done) return;
        done = true;
        cb(e, d);
      };
    try {
      this.A.req(method, url, body, fin);
    } catch (e) {
      fin(e);
    }
    setTimeout(function () {
      fin('timeout');
    }, 8000);
  },
  sidebarCheck: function (cb) {
    var a = this.A;
    a.sidebarCheck ? a.sidebarCheck(cb) : cb(false);
  },
  sidebarGo: function () {
    this.A.sidebarGo && this.A.sidebarGo();
  },
  fromSidebar: function () {
    return !!(this.A.fromSidebar && this.A.fromSidebar());
  },
  recStart: function () {
    this.A.recStart && this.A.recStart();
  },
  recStop: function (cb) {
    if (this.A.recStop) this.A.recStop(cb);
    else cb && cb(null);
  },
  canShareVideo: function () {
    return !!this.A._recPath;
  },
  shareVideo: function (cb) {
    if (this.A.shareVideo) this.A.shareVideo(cb);
    else cb(false);
  },
  init: function () {
    try {
      this.A.init();
    } catch (e) {
      console.warn('platform init', e);
    }
  },
  boot: function (cb) {
    try {
      this.A.boot(cb);
    } catch (e) {
      cb();
    }
  },
  showRewardedAd: function (placement, onSuccess, onFail) {
    Platform.onAdStart && Platform.onAdStart(placement);
    this.A.ad(
      placement,
      function () {
        Platform.lastRewarded = Date.now();
        Save.task('ad');
        if (typeof Meta != 'undefined') Meta.stat('ads', 1);
        Save.save();
        onSuccess();
      },
      function (e) {
        UI && UI.toast && UI.toast('需要看完广告才能领取哦', '#ffd6e0');
        onFail && onFail(e);
      }
    );
  },
  lastRewarded: 0,
  lastInter: 0,
  interCount: 0,
  /** 关卡结算后的插屏广告（带频控，新玩家前几次启动不展示） */
  showInterstitial: function () {
    var F = PLATFORM_CFG.interstitial,
      now = Date.now();
    if ((Save.d.sessions || 0) < F.minSessions) return false;
    this.interCount++;
    if (this.interCount % F.everyN) return false;
    if (now - this.lastInter < F.minGapSec * 1000 || now - this.lastRewarded < F.afterRewardedSec * 1000) return false;
    this.lastInter = now;
    try {
      this.A.inter && this.A.inter();
    } catch (e) {}
    return true;
  },
  /** 菜单横幅：仅在开启 bannerEnabled 时展示，进入战斗时隐藏 */
  setBanner: function (show) {
    if (!PLATFORM_CFG.bannerEnabled) return;
    if (this._bannerOn === show) return;
    this._bannerOn = show;
    try {
      this.A.banner && this.A.banner(show);
    } catch (e) {}
  },
  gachaDraw: function (n, pool, pity, G, cb) {
    if (!this.server()) {
      cb(this.gacha(n, pool, pity, G));
      return;
    }
    var sizes = {};
    for (var k in pool) sizes[k] = pool[k].length;
    this.request('POST', '/api/gacha/draw', { uid: this.uid(), n: n, sizes: sizes }, function (e, r) {
      if (e || !r || !r.items) {
        cb(null);
        return;
      }
      cb({
        pity: r.pity,
        items: r.items.map(function (x) {
          return { rar: x.rar, item: pool[x.rar][x.idx % pool[x.rar].length] };
        })
      });
    });
  },
  // 扭蛋：本地模拟（mock 模式）
  gacha: function (n, pool, pity, G) {
    var items = [];
    for (var i = 0; i < n; i++) {
      pity++;
      var x = Math.random(),
        rar =
          x < G.rates.SSR
            ? 'SSR'
            : x < G.rates.SSR + G.rates.SR
              ? 'SR'
              : x < G.rates.SSR + G.rates.SR + G.rates.R
                ? 'R'
                : 'N';
      if (pity >= G.pity) rar = 'SSR';
      if (
        n == 10 &&
        i == 9 &&
        !items.some(function (t) {
          return t.rar == 'SSR' || t.rar == 'SR';
        })
      )
        rar = 'SR';
      if (rar == 'SSR') pity = 0;
      var arr = pool[rar];
      items.push({ rar: rar, item: arr[Math.floor(Math.random() * arr.length)] });
    }
    return { items: items, pity: pity };
  },
  share: function (opt, cb) {
    this.A.share(opt, function (ok) {
      cb && cb(ok !== false);
    });
  },
  // 排行榜：配置 serverUrl 后走服务端（wx.request / tt.request / fetch），否则本地模拟
  submitScore: function (board, score) {
    var k = 'lb_' + board,
      b = Storage.get(k, 0);
    if (score > b) Storage.set(k, score);
    if (this.server())
      this.request(
        'POST',
        '/api/lb/submit',
        { uid: this.uid(), name: '我', board: board, score: score },
        function () {}
      );
  },
  getLeaderboard: function (board, cb) {
    var self = this;
    if (!this.server()) {
      this.mockLeaderboard(board, cb);
      return;
    }
    this.request('GET', '/api/lb/query?board=' + board + '&uid=' + this.uid(), null, function (e, r) {
      if (e || !r || !r.list) {
        self.mockLeaderboard(board, cb);
        return;
      }
      cb(
        r.list.map(function (x) {
          return { name: x.uid == self.uid() ? '我' : x.name, score: x.score, me: x.uid == self.uid() };
        })
      );
    });
  },
  mockLeaderboard: function (board, cb) {
    var names = [
        '软软大王',
        '喵喵队长',
        '奶茶不加糖',
        '果冻小可爱',
        '星星眨眼',
        '今天也很萌',
        '熊熊冲鸭',
        '兔兔那么可爱',
        '小猪佩奇粉',
        '企鹅啾啾',
        '狐狸不吃葡萄',
        '龙龙飞呀'
      ],
      seed = (Save.d.lbSeed + board.length * 97 + CFG.weekNo() * 13) % 997,
      list = [];
    var base = { endless: 60, daily: 15, bossrush: 14, weekly: 1800 }[board] || 50;
    for (var i = 0; i < names.length; i++) {
      seed = (seed * 16807) % 2147483647;
      list.push({
        name: names[i],
        score: Math.max(1, Math.round(base * (1 - i * 0.07) * (0.85 + (seed % 100) / 400)))
      });
    }
    var me = Storage.get('lb_' + board, 0);
    list.push({ name: '我', score: me, me: true });
    list.sort(function (a, b) {
      return b.score - a.score;
    });
    setTimeout(function () {
      cb(list);
    }, 0);
  },
  vibrate: function (ms) {
    try {
      this.A.vibrate(ms);
    } catch (e) {}
  }
};


// ---- src/entities/path.js ----
/**
 * 软萌大作战 V1.0
 * 敌人行进路线工具：按距离取坐标，支持多条路线
 *
 * © 2026 <著作权人>
 */
function makePath(pts) {
  var P = { pts: pts, segs: [], len: 0 },
    L = 0;
  for (var i = 0; i < pts.length - 1; i++) {
    var dx = pts[i + 1][0] - pts[i][0],
      dy = pts[i + 1][1] - pts[i][1],
      l = Math.hypot(dx, dy);
    P.segs.push({ x: pts[i][0], y: pts[i][1], dx: dx / l, dy: dy / l, l: l, s: L });
    L += l;
  }
  P.len = L;
  P.at = function (d) {
    var sg = this.segs;
    if (d <= 0) return { x: sg[0].x, y: sg[0].y };
    for (var i = 0; i < sg.length; i++) {
      var s = sg[i];
      if (d <= s.s + s.l) {
        var k = d - s.s;
        return { x: s.x + s.dx * k, y: s.y + s.dy * k };
      }
    }
    var e = sg[sg.length - 1];
    return { x: e.x + e.dx * e.l, y: e.y + e.dy * e.l };
  };
  return P;
}
var Path = makePath(CFG.PATH);


// ---- src/data/content.js ----
/**
 * 软萌大作战 V1.2
 * 内容数据：章节 / 模式 / 词缀 / 英雄 / 遗物 / 皮肤 / 进化 / 成就 / 通行证 / 扭蛋 / 邮件
 *
 * © 2026 <著作权人>
 */
var P_CLASSIC = [
  [60, 74],
  [60, 128],
  [300, 128],
  [300, 208],
  [60, 208],
  [60, 290],
  [285, 290],
  [285, 345]
];
var PATHSETS = {
  classic: [P_CLASSIC],
  lanes: [
    [
      [50, 74],
      [50, 330],
      [140, 330],
      [140, 200],
      [230, 200],
      [230, 320],
      [285, 320],
      [285, 345]
    ],
    [
      [310, 74],
      [310, 110],
      [90, 110],
      [90, 160],
      [330, 160],
      [330, 280],
      [285, 280],
      [285, 345]
    ]
  ],
  zigzag: [
    [
      [180, 74],
      [180, 120],
      [50, 120],
      [50, 190],
      [310, 190],
      [310, 260],
      [60, 260],
      [60, 320],
      [285, 320],
      [285, 345]
    ]
  ],
  switchA: [
    [
      [180, 74],
      [180, 120],
      [50, 120],
      [50, 330],
      [150, 330],
      [150, 230],
      [285, 230],
      [285, 345]
    ],
    [
      [180, 74],
      [180, 120],
      [320, 120],
      [320, 190],
      [100, 190],
      [100, 290],
      [320, 290],
      [320, 345],
      [285, 345]
    ]
  ],
  spiral: [
    [
      [40, 74],
      [40, 330],
      [330, 330],
      [330, 110],
      [100, 110],
      [100, 270],
      [230, 270],
      [230, 345],
      [285, 345]
    ]
  ]
};
// 章节：主题、路线、机制、敌人偏好、章节首领
CFG.CHAPTERS = [
  {
    name: '第一章 · 棉花糖草原',
    theme: 'grass',
    paths: 'classic',
    mech: null,
    color: '#9be7a0',
    sky: ['#bfe8ff', '#d9f5d0', '#b9e8a6', '#9fd88f'],
    road: ['#c9995e', '#f8e6bf'],
    mix: { normal: 3, fast: 2, flying: 1 },
    boss: 'king',
    intro: '温柔的起点，学会合成与搭配'
  },
  {
    name: '第二章 · 果冻森林',
    theme: 'forest',
    paths: 'lanes',
    mech: 'lanes',
    color: '#ffb3c7',
    sky: ['#ffd9ec', '#ffe6f0', '#f7c6d9', '#e8a9c4'],
    road: ['#d08f62', '#fbe2c8'],
    mix: { normal: 2, splitter: 3, healer: 2, tank: 1 },
    boss: 'jelly',
    intro: '双路线来袭！合理分配火力'
  },
  {
    name: '第三章 · 星星雪山',
    theme: 'snow',
    paths: 'zigzag',
    mech: 'blizzard',
    color: '#a8d8ff',
    sky: ['#dff2ff', '#eef8ff', '#d6ecff', '#c2e0ff'],
    road: ['#a08a78', '#efe3d6'],
    mix: { tank: 3, shield: 2, fast: 1, normal: 1 },
    boss: 'frost',
    intro: '暴风雪会冻慢伙伴的攻速'
  },
  {
    name: '第四章 · 焦糖沙漠',
    theme: 'desert',
    paths: 'switchA',
    mech: 'switch',
    color: '#ffd59a',
    sky: ['#ffe9c2', '#fff3dc', '#ffe0a8', '#f5c983'],
    road: ['#c27a4a', '#f3cfa6'],
    mix: { fast: 3, bomb: 2, flying: 2, normal: 1 },
    boss: 'magma',
    intro: '流沙会改变敌人的行进路线'
  },
  {
    name: '第五章 · 幽灵古堡',
    theme: 'haunt',
    paths: 'spiral',
    mech: 'fog',
    color: '#b8a8e8',
    sky: ['#4a3d6e', '#6a5a96', '#8c7cb8', '#7a6aa8'],
    road: ['#2e2448', '#5e4f86'],
    mix: { ghost: 3, shield: 2, healer: 1, flying: 1 },
    boss: 'ghostking',
    intro: '迷雾中的敌人无法被锁定'
  },
  {
    name: '第六章 · 星河彼岸',
    theme: 'space',
    paths: 'lanes',
    mech: 'lanes',
    color: '#9fa8ff',
    sky: ['#2a2f6e', '#3d4a9a', '#5a68c0', '#4a58b0'],
    road: ['#6a74c8', '#b4bcff'],
    mix: { normal: 2, tank: 2, splitter: 2, shield: 2, ghost: 2, bomb: 1, fast: 1 },
    boss: 'star',
    intro: '三路齐发，终极考验'
  }
];
CFG.LEVELS_PER = 8;
CFG.levelInfo = function (c, l, elite) {
  var ch = CFG.CHAPTERS[c - 1];
  return {
    id: c + '-' + l + (elite ? 'E' : ''),
    c: c,
    l: l,
    elite: !!elite,
    waves: 8 + Math.floor(l / 2) + c,
    diff:
      (0.82 + (c - 1) * 0.25 + (l - 1) * 0.055) *
      (c == 1 ? 1.2 : 1) *
      (l == 8 && c < 6 ? 0.92 : 1) *
      (c > 1 ? 1 + 0.26 * Math.max(0, 1 - (l - 1) / 4.5) : 1) *
      (elite ? 1.35 : 1) *
      (c == 6 ? (l == 8 ? 0.68 : 0.82) : 1),
    startGold: (c - 1) * 45 + (c == 6 ? 60 : 0),
    paths: c == 6 && l % 4 == 2 ? 'switchA' : ch.paths,
    mech: c == 6 ? ['fog', 'blizzard', 'switch', 'lanes'][l % 4] : ch.mech,
    theme: ch.theme,
    mix: ch.mix,
    boss: l == CFG.LEVELS_PER ? ch.boss : null,
    mods: elite ? ['elite'] : []
  };
};
// 无尽 / 每日 / 车轮战 / 周活动
CFG.weekNo = function () {
  return Math.floor((Date.now() / 864e5 + 3) / 7);
};
CFG.MODS = {
  swift: { name: '疾风', desc: '敌人速度 +30%', color: '#ffe066' },
  armor: { name: '铁壁', desc: '敌人护甲 +3', color: '#9aa7b8' },
  rich: { name: '富饶', desc: '金币 +50%', color: '#ffc93c' },
  poor: { name: '贫瘠', desc: '召唤费用 +50%', color: '#c9a07a' },
  giant: { name: '巨人', desc: '敌人生命 +40%', color: '#ff8fb1' },
  elite: { name: '精英', desc: '每波出现精英怪', color: '#b46cff' },
  fog: { name: '迷雾', desc: '上方区域被迷雾笼罩', color: '#8c7cb8' },
  blizzard: { name: '暴风雪', desc: '周期性降低攻速', color: '#a8d8ff' },
  catonly: { name: '喵喵军团', desc: '只能召唤喵喵弓手', color: '#ffb86b' },
  glass: { name: '玻璃城堡', desc: '城堡生命 -50%，奖励翻倍', color: '#8fd3ff' },
  regen: { name: '自愈', desc: '敌人每秒恢复 2% 生命', color: '#7fe07f' },
  bounty: { name: '赏金', desc: '击杀金币 +100%，敌人 +20% 生命', color: '#ffb020' }
};
CFG.ENDLESS_MODS = [
  ['swift', 'rich'],
  ['armor', 'bounty'],
  ['giant', 'elite'],
  ['regen', 'rich'],
  ['fog', 'swift'],
  ['blizzard', 'giant'],
  ['elite', 'bounty'],
  ['armor', 'regen'],
  ['swift', 'giant'],
  ['fog', 'rich']
];
CFG.ENDLESS_THEMES = ['grass', 'forest', 'snow', 'desert', 'haunt', 'space'];
CFG.ENDLESS_PATHS = ['classic', 'lanes', 'zigzag', 'spiral', 'switchA'];
CFG.endlessInfo = function () {
  var w = CFG.weekNo();
  return {
    id: 'endless',
    mode: 'endless',
    waves: 99999,
    diff: 1.22,
    paths: CFG.ENDLESS_PATHS[w % CFG.ENDLESS_PATHS.length],
    theme: CFG.ENDLESS_THEMES[w % CFG.ENDLESS_THEMES.length],
    mix: null,
    mech: w % 3 == 1 ? 'storm' : w % 3 == 2 ? 'switch' : null,
    mods: CFG.ENDLESS_MODS[w % CFG.ENDLESS_MODS.length].slice()
  };
};
CFG.ENDLESS_MILESTONES = [
  { w: 5, r: { gems: 15, tickets: 1 } },
  { w: 10, r: { gems: 40, tickets: 1 } },
  { w: 15, r: { candy: 120, tickets: 1 } },
  { w: 20, r: { gems: 60, tickets: 2 } },
  { w: 25, r: { candy: 200, tickets: 1 } },
  { w: 30, r: { gems: 100, tickets: 2 } },
  { w: 40, r: { gems: 150, tickets: 3 } },
  { w: 50, r: { gems: 200, tickets: 3 } },
  { w: 60, r: { gems: 250, tickets: 4 } },
  { w: 75, r: { gems: 350, tickets: 5 } },
  { w: 100, r: { gems: 500, tickets: 8 } },
  { w: 120, r: { gems: 700, tickets: 10 } },
  { w: 150, r: { gems: 1000, tickets: 12 } }
];
CFG.dailyInfo = function () {
  var d = new Date(),
    seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate(),
    keys = Object.keys(CFG.MODS),
    a = keys[seed % keys.length],
    b = keys[(seed * 7 + 3) % keys.length];
  if (a == b) b = keys[(seed + 1) % keys.length];
  var ci = seed % 6;
  return {
    id: 'daily',
    mode: 'daily',
    waves: 15,
    diff: 1.0,
    paths: CFG.CHAPTERS[ci].paths,
    theme: CFG.CHAPTERS[ci].theme,
    mix: CFG.CHAPTERS[ci].mix,
    mech: CFG.CHAPTERS[ci].mech,
    mods: [a, b],
    seed: seed
  };
};
CFG.bossRushInfo = function () {
  return {
    id: 'bossrush',
    mode: 'bossrush',
    waves: 99999,
    diff: 0.9,
    paths: 'zigzag',
    theme: 'snow',
    mix: null,
    mech: null,
    mods: []
  };
};
CFG.weeklyInfo = function () {
  var w = CFG.weekNo(),
    ci = w % 6;
  return {
    id: 'weekly',
    mode: 'weekly',
    waves: 20,
    diff: 1.1,
    paths: CFG.CHAPTERS[ci].paths,
    theme: CFG.CHAPTERS[ci].theme,
    mix: CFG.CHAPTERS[ci].mix,
    mech: CFG.CHAPTERS[ci].mech,
    mods: ['rich'],
    evName: ['糖果节', '果冻嘉年华', '冰雪祭', '沙漠寻宝', '万圣夜', '流星雨之夜'][ci]
  };
};
CFG.WEEKLY_MILESTONES = [
  { p: 100, r: { candy: 80 } },
  { p: 300, r: { gems: 40 } },
  { p: 600, r: { candy: 200 } },
  { p: 1000, r: { gems: 100 } },
  { p: 1600, r: { gems: 200 } }
];
// 英雄
CFG.HEROES = {
  captain: {
    name: '喵队长',
    rar: 'SR',
    desc: '喵喵弓手伤害 +30%',
    skill: '流星雨',
    sdesc: '召唤 8 颗流星轰炸敌人',
    cd: 25,
    base: 'cat',
    color: '#ff8a4d'
  },
  princess: {
    name: '冰雪公主',
    rar: 'SSR',
    desc: '减速效果 +15%',
    skill: '冰封万里',
    sdesc: '冻结全场敌人 3 秒',
    cd: 32,
    base: 'penguin',
    color: '#5ab8ff'
  },
  fortune: {
    name: '财神猪',
    rar: 'SR',
    desc: '金币获取 +15%',
    skill: '金币雨',
    sdesc: '立即获得大量金币',
    cd: 35,
    base: 'pig',
    color: '#ffb020'
  },
  thunder: {
    name: '闪电兔',
    rar: 'SSR',
    desc: '闪电链弹射 +1',
    skill: '雷霆万钧',
    sdesc: '12 道落雷随机打击',
    cd: 26,
    base: 'bunny',
    color: '#b46cff'
  }
};
// 遗物
CFG.RELICS = {
  clover: {
    name: '四叶草',
    desc: '暴击率 +10%',
    icon: 'clover',
    r: 'R',
    fn: function (g) {
      g.m.crit += 0.1;
    }
  },
  hourglass: {
    name: '慢慢沙漏',
    desc: '敌人速度 -8%',
    icon: 'clock',
    r: 'SR',
    fn: function (g) {
      g.m.enemySpd *= 0.92;
    }
  },
  piggy: {
    name: '小猪存钱罐',
    desc: '每波奖励 +15 金币',
    icon: 'pig',
    r: 'R',
    fn: function (g) {
      g.m.waveGold += 15;
    }
  },
  bell: {
    name: '招财铃铛',
    desc: '开局金币 +60',
    icon: 'coin',
    r: 'R',
    fn: function (g) {
      g.gold += 60;
    }
  },
  cape: {
    name: '英雄披风',
    desc: '喵喵弓手伤害 +40%',
    icon: 'paw',
    r: 'SR',
    fn: function (g) {
      g.m.type.cat = (g.m.type.cat || 1) * 1.4;
    }
  },
  scarf: {
    name: '冰晶围巾',
    desc: '减速效果 +15%',
    icon: 'snow',
    r: 'R',
    fn: function (g) {
      g.m.slowAdd += 0.15;
    }
  },
  powder: {
    name: '火药桶',
    desc: '爆炸范围 +30%',
    icon: 'bomb',
    r: 'R',
    fn: function (g) {
      g.m.splash *= 1.3;
    }
  },
  battery: {
    name: '满电电池',
    desc: '闪电链弹射 +2',
    icon: 'bolt',
    r: 'SR',
    fn: function (g) {
      g.m.chainAdd += 2;
    }
  },
  match: {
    name: '魔法火柴',
    desc: '燃烧伤害 +50%',
    icon: 'fire',
    r: 'R',
    fn: function (g) {
      g.m.burn *= 1.5;
    }
  },
  crown: {
    name: '勇者王冠',
    desc: '对首领伤害 +40%',
    icon: 'crown',
    r: 'SR',
    fn: function (g) {
      g.m.bossDmg *= 1.4;
    }
  },
  heart: {
    name: '爱心抱枕',
    desc: '城堡生命 +8',
    icon: 'heart',
    r: 'R',
    fn: function (g) {
      g.maxHp += 8;
      g.hp += 8;
    }
  },
  magnet: {
    name: '金币磁铁',
    desc: '击杀金币 +20%',
    icon: 'coin',
    r: 'R',
    fn: function (g) {
      g.m.bounty *= 1.2;
    }
  },
  dice: {
    name: '幸运骰子',
    desc: '免费刷新 +2',
    icon: 'reroll',
    r: 'SR',
    fn: function (g) {
      g.freeRerolls += 2;
    }
  },
  candle: {
    name: '萤火蜡烛',
    desc: '可以看穿迷雾',
    icon: 'eye',
    r: 'SSR',
    fn: function (g) {
      g.m.seeFog = true;
    }
  },
  mitten: {
    name: '暖暖手套',
    desc: '免疫暴风雪',
    icon: 'snow',
    r: 'SR',
    fn: function (g) {
      g.m.noBlizzard = true;
    }
  },
  comet: {
    name: '流星碎片',
    desc: '英雄技能冷却 -25%',
    icon: 'star',
    r: 'SSR',
    fn: function (g) {
      g.m.heroCd *= 0.75;
    }
  },
  sword: {
    name: '屠龙小剑',
    desc: '对精英伤害 +50%',
    icon: 'sword',
    r: 'SR',
    fn: function (g) {
      g.m.eliteDmg *= 1.5;
    }
  },
  feather: {
    name: '天使羽毛',
    desc: '每波开始回复 1 生命',
    icon: 'up',
    r: 'SSR',
    fn: function (g) {
      g.m.waveHeal += 1;
    }
  }
};
// 皮肤
CFG.SKINS = {
  cat_black: { name: '黑猫侠', type: 'cat', rar: 'SR' },
  bunny_choco: { name: '巧克力兔', type: 'bunny', rar: 'SR' },
  bear_panda: { name: '功夫熊猫', type: 'bear', rar: 'SSR' }
};
// 进化分支（Lv6 选择）
CFG.BRANCHES = {
  cat: {
    A: { name: '连珠喵', desc: '攻速 x1.6，额外 +1 箭' },
    B: { name: '狙击喵', desc: '伤害 x2.2，射程 +30%，暴击 +20%' }
  },
  penguin: {
    A: { name: '暴风雪企鹅', desc: '溅射范围 x2，减速更强' },
    B: { name: '冰封企鹅', desc: '30% 几率冻结敌人' }
  },
  bear: { A: { name: '集束熊', desc: '每发分裂 3 颗小炸弹' }, B: { name: '震地熊', desc: '击晕 0.8 秒，范围 x1.4' } },
  bunny: { A: { name: '雷暴兔', desc: '弹射 +4 次' }, B: { name: '超电磁兔', desc: '伤害 x2.5，可打穿护盾' } },
  fox: { A: { name: '地狱火狐', desc: '燃烧伤害 x2.5' }, B: { name: '流星火狐', desc: '火球命中爆炸' } },
  pig: { A: { name: '黄金猪', desc: '金币产出 x2.5' }, B: { name: '福气猪', desc: '相邻伙伴伤害 +30%' } },
  dragon: { A: { name: '双子龙', desc: '同时发射 2 道光束' }, B: { name: '炎龙', desc: '光束附带燃烧' } }
};
// 成就
CFG.ACHS = [
  { id: 'k0', name: '第一滴血', desc: '累计消灭 50 只敌人', stat: 'kills', goal: 50, r: { gems: 20, tickets: 1 } },
  { id: 'k1', name: '初出茅庐', desc: '累计消灭 500 只敌人', stat: 'kills', goal: 500, r: { gems: 40, tickets: 2 } },
  {
    id: 'k2',
    name: '史莱姆克星',
    desc: '累计消灭 5000 只敌人',
    stat: 'kills',
    goal: 5000,
    r: { gems: 120, tickets: 3 }
  },
  { id: 'm0', name: '第一次合成', desc: '累计合成 5 次', stat: 'merges', goal: 5, r: { candy: 80, tickets: 1 } },
  { id: 'm1', name: '合成新手', desc: '累计合成 50 次', stat: 'merges', goal: 50, r: { candy: 150, gems: 30 } },
  { id: 'm2', name: '合成大师', desc: '累计合成 500 次', stat: 'merges', goal: 500, r: { gems: 100, tickets: 3 } },
  { id: 'lv7', name: '满级进化', desc: '合成出 Lv5 伙伴', stat: 'maxLv', goal: 5, r: { gems: 150, tickets: 2 } },
  { id: 'fu1', name: '融合初体验', desc: '发现 1 种融合伙伴', stat: 'fusions', goal: 1, r: { gems: 100, tickets: 2 } },
  { id: 'fu5', name: '融合研究员', desc: '发现 5 种融合伙伴', stat: 'fusions', goal: 5, r: { gems: 300, tickets: 5 } },
  { id: 'ult1', name: '神话降临', desc: '合成出究极伙伴', stat: 'ults', goal: 1, r: { gems: 400, tickets: 5 } },
  { id: 'b1', name: '屠龙勇士', desc: '击败 20 个首领', stat: 'bosses', goal: 20, r: { gems: 80, tickets: 2 } },
  { id: 's1', name: '摘星者', desc: '获得 24 颗星', stat: 'stars', goal: 24, r: { candy: 200, tickets: 2 } },
  { id: 's2', name: '满天星', desc: '获得 80 颗星', stat: 'stars', goal: 80, r: { gems: 200, tickets: 5 } },
  { id: 'e0', name: '无尽入门', desc: '无尽模式达到 15 波', stat: 'endless', goal: 15, r: { gems: 50, tickets: 2 } },
  { id: 'e1', name: '无尽探索', desc: '无尽模式达到 30 波', stat: 'endless', goal: 30, r: { gems: 120, tickets: 3 } },
  { id: 'x1', name: '远征归来', desc: '完成 1 次远征', stat: 'expDone', goal: 1, r: { gems: 120, tickets: 2 } },
  { id: 'g1', name: '扭蛋达人', desc: '扭蛋 20 次', stat: 'pulls', goal: 20, r: { candy: 200, tickets: 3 } },
  { id: 'd1', name: '每日打卡', desc: '完成 3 次每日挑战', stat: 'dailyDone', goal: 3, r: { gems: 80, tickets: 2 } },
  { id: 'el1', name: '精英猎手', desc: '击败 50 个精英怪', stat: 'elites', goal: 50, r: { gems: 60, tickets: 2 } },
  { id: 'ad1', name: '广告赞助', desc: '观看 10 次广告', stat: 'ads', goal: 10, r: { gems: 50, tickets: 3 } },
  { id: 'br1', name: '车轮战王者', desc: '车轮战击败 10 个首领', stat: 'rushBest', goal: 10, r: { gems: 120 } }
];
// 通行证：30 级
CFG.PASS = {
  max: 30,
  xpPer: 100,
  free: function (i) {
    if (i % 5 == 4) return { gems: 40, tickets: 1 };
    if (i % 3 == 2) return { tickets: 1 };
    return { candy: 50 + i * 5 };
  },
  bonus: function (i) {
    return i == 29
      ? { skin: 'bear_panda' }
      : i % 5 == 4
        ? { gems: 80 }
        : i % 3 == 0
          ? { tickets: 1 }
          : { candy: 80 + i * 6 };
  }
};
// 扭蛋
/** 福利中心：激励视频奖励及每日上限 */
CFG.WELFARE = [
  { id: 'chest', name: '每日福利宝箱', desc: '40 钻石 + 100 糖果', icon: 'gift', cap: 6, r: { gems: 40, candy: 100 } },
  { id: 'ticket', name: '免费扭蛋券', desc: '1 张扭蛋券', icon: 'ticket', cap: 5, r: { tickets: 1 } },
  { id: 'candy', name: '糖果补给', desc: '200 糖果', icon: 'candy', cap: 4, r: { candy: 200 } },
  { id: 'gempack', name: '钻石补给', desc: '50 钻石', icon: 'gem', cap: 3, r: { gems: 50 } }
];
/** 皮肤钻石兑换价格（按稀有度） */
CFG.SKIN_GEMS = { SR: 100, SSR: 280 };
CFG.GACHA = { cost1: 1, cost10: 10, pity: 50, rates: { SSR: 0.03, SR: 0.15, R: 0.42, N: 0.4 } };
CFG.INBOX_DEFAULT = [
  {
    id: 'welcome',
    title: '欢迎来到软萌大作战！',
    body: '送你一份见面礼，快去召唤小伙伴吧~',
    r: { gems: 100, candy: 100 }
  },
  {
    id: 'notice1',
    title: '版本公告 v1.9',
    body: '远征加深、第1章手感微调、无尽里程碑、字号与低端机性能优化。',
    r: { tickets: 1 }
  },
  { id: 'comp', title: '维护补偿', body: '感谢耐心等待，这是小小的补偿~', r: { gems: 50 } }
];


// ---- src/core/meta.js ----
/**
 * 软萌大作战 V1.2
 * 局外系统：存档扩展 / 统计 / 成就 / 通行证 / 扭蛋 / 邮件 / 图鉴 / 排行榜
 *
 * © 2026 <著作权人>
 */
var Meta = {
  init: function () {
    var d = Save.d;
    setTimeout(function () {
      Save.syncUnlocks(true);
    }, 0);
    function def(k, v) {
      if (d[k] === undefined) d[k] = v;
    }
    def('stat', {
      kills: 0,
      merges: 0,
      maxLv: 1,
      bosses: 0,
      stars: 0,
      endless: 0,
      expDone: 0,
      pulls: 0,
      dailyDone: 0,
      elites: 0,
      rushBest: 0
    });
    def('heroes', { captain: 1 });
    def('hero', 'captain');
    def('relics', {});
    def('equip', []);
    def('skins', {});
    def('skinOn', {});
    def('pass', { xp: 0, cf: {}, cp: {} });
    def('sessions', 0);
    def('welfare', {});
    def('achClaimed', {});
    def('codex', {});
    def('codexClaimed', {});
    def('pity', 0);
    def('tickets', 5);
    def(
      'mail',
      CFG.INBOX_DEFAULT.map(function (m) {
        return { id: m.id, read: false, claimed: false };
      })
    );
    def('shareDate', '');
    def('endlessMs', {});
    def('weekly', { wk: 0, pts: 0, claimed: {} });
    def('dailyDate', '');
    def('dailyBest', 0);
    def('rushBest', 0);
    def('lbSeed', Math.floor(Math.random() * 1e6));
    // 旧存档迁移：移除已下线的付费字段
    ['noAds', 'bought', 'monthUntil', 'monthDay'].forEach(function (k) {
      delete d[k];
    });
    delete d.pass.paid;
    d.sessions++;
    // 首次进入赠送开局资源，避免几天买不起天赋/皮肤的空窗
    if (d.sessions == 1 && !d.starterGift) {
      d.starterGift = 1;
      d.candy = (d.candy || 0) + 100;
      d.gems = (d.gems || 0) + 60;
      d.tickets = Math.max(d.tickets || 0, 5);
    }
    var st = 0;
    for (var k in d.stars) st += d.stars[k];
    d.stat.stars = st;
    var wk = CFG.weekNo();
    if (d.weekly.wk != wk) d.weekly = { wk: wk, pts: 0, claimed: {} };
    Save.save();
  },
  /** 福利中心当日计数（跨天自动清零） */
  welfare: function () {
    var d = Save.d,
      t = Save.today();
    if (!d.welfare || d.welfare.date !== t) d.welfare = { date: t };
    return d.welfare;
  },
  /** 扭蛋概率公示文本：各稀有度概率、奖池内容与保底规则 */
  rateLines: function () {
    var G = CFG.GACHA,
      P = this.pool(),
      out = ['消耗扭蛋券（游戏内免费获得，不可购买）'];
    ['SSR', 'SR', 'R', 'N'].forEach(function (r) {
      var n = P[r].length;
      out.push(
        r +
          '：' +
          (G.rates[r] * 100).toFixed(0) +
          '%（共 ' +
          n +
          ' 种，每种 ' +
          ((G.rates[r] * 100) / n).toFixed(2) +
          '%）'
      );
    });
    out.push('保底：连续 ' + G.pity + ' 次未出 SSR 时，第 ' + G.pity + ' 次必出 SSR');
    out.push('十连抽至少获得 1 个 SR 或以上');
    out.push('重复获得自动转化为钻石或糖果');
    return out;
  },
  stat: function (k, v, max) {
    var s = Save.d.stat;
    if (max) s[k] = Math.max(s[k] || 0, v);
    else s[k] = (s[k] || 0) + v;
  },
  grant: function (r) {
    if (!r) return '';
    var d = Save.d,
      out = [];
    if (r.gems) {
      d.gems += r.gems;
      out.push(r.gems + '钻石');
    }
    if (r.candy) {
      d.candy += r.candy;
      out.push(r.candy + '糖果');
    }
    if (r.tickets) {
      d.tickets += r.tickets;
      out.push(r.tickets + '扭蛋券');
    }
    if (r.skin) {
      d.skins[r.skin] = 1;
      out.push('皮肤·' + CFG.SKINS[r.skin].name);
    }
    if (r.tower) {
      d.owned = d.owned || {};
      d.owned[r.tower] = 1;
      out.push('伙伴·' + CFG.TOWERS[r.tower].name);
    }
    if (r.hero) {
      d.heroes[r.hero] = (d.heroes[r.hero] || 0) + 1;
      out.push('英雄·' + CFG.HEROES[r.hero].name);
    }
    if (r.relic) {
      d.relics[r.relic] = 1;
      out.push('遗物·' + CFG.RELICS[r.relic].name);
    }
    Save.save();
    return out.join(' + ');
  },
  /** 离线挂机已迁至 App.calcOffline / App.welcome，避免双重领取 */

  // 战斗结算：通行证经验、统计、周活动
  afterBattle: function (g, level) {
    var xp = g.wave * 10 + Math.floor(g.stats.kills / 5);
    Save.d.pass.xp += xp;
    this.stat('kills', g.stats.kills);
    this.stat('merges', g.stats.merges);
    this.stat('bosses', g.stats.bosses || 0);
    this.stat('elites', g.stats.elites || 0);
    var st = 0;
    for (var k in Save.d.stars) st += Save.d.stars[k];
    Save.d.stat.stars = st;
    if (level.mode == 'endless') this.stat('endless', g.wave, true);
    if (level.mode == 'weekly') Save.d.weekly.pts += g.wave * 10 + (g.stats.bosses || 0) * 30;
    if (level.mode == 'daily' && g.state == 'win') this.stat('dailyDone', 1);
    if (level.mode == 'bossrush') this.stat('rushBest', g.stats.bosses || 0, true);
    Save.save();
    return xp;
  },
  passLv: function () {
    return Math.min(CFG.PASS.max, Math.floor(Save.d.pass.xp / CFG.PASS.xpPer));
  },
  achDone: function (a) {
    return (Save.d.stat[a.stat] || 0) >= a.goal;
  },
  achBadge: function () {
    return CFG.ACHS.some(function (a) {
      return Meta.achDone(a) && !Save.d.achClaimed[a.id];
    });
  },
  passBadge: function () {
    var lv = this.passLv(),
      p = Save.d.pass;
    for (var i = 0; i < lv; i++) {
      if (!p.cf[i]) return true;
    }
    return false;
  },
  mailBadge: function () {
    return Save.d.mail.some(function (m) {
      return !m.claimed;
    });
  },
  // 扭蛋（结果由 Platform.gacha 决定，可替换为服务端）
  pool: function () {
    var P = { SSR: [], SR: [], R: [], N: [{ candy: 50 }, { candy: 80 }, { gems: 10 }] };
    for (var h in CFG.HEROES) P[CFG.HEROES[h].rar].push({ hero: h });
    for (var s in CFG.SKINS) P[CFG.SKINS[s].rar].push({ skin: s });
    CFG.TOWER_ORDER.forEach(function (t) {
      var D = CFG.TOWERS[t];
      if (D.gacha) P[D.rar].push({ tower: t });
      else if (D.rar == 'SR' && D.unlock) P.SR.push({ tower: t });
    });
    for (var r in CFG.RELICS) P[CFG.RELICS[r].r].push({ relic: r });
    return P;
  },
  // 扭蛋：mock 模式本地抽取；server 模式由服务端抽取（含保底），客户端只做展示与发放
  pull: function (n, cb) {
    var d = Save.d,
      self = this,
      cost = n == 10 ? CFG.GACHA.cost10 : CFG.GACHA.cost1;
    if (d.tickets < cost) {
      cb(null);
      return;
    }
    d.tickets -= cost;
    var pool = this.pool();
    Platform.gachaDraw(n, pool, d.pity, CFG.GACHA, function (res) {
      if (!res) {
        d.tickets += cost;
        Save.save();
        cb(null, 'net');
        return;
      }
      d.pity = res.pity;
      self.stat('pulls', n);
      res.items.forEach(function (it) {
        var r = it.item;
        if (r.tower && Save.unlocked(r.tower)) {
          it.dup = true;
          Meta.grant({ gems: it.rar == 'SSR' ? 80 : 40 });
        } else if (r.hero && d.heroes[r.hero]) {
          it.dup = true;
          Meta.grant({ gems: it.rar == 'SSR' ? 60 : 30 });
        } else if (r.skin && d.skins[r.skin]) {
          it.dup = true;
          Meta.grant({ gems: 30 });
        } else if (r.relic && d.relics[r.relic]) {
          it.dup = true;
          Meta.grant({ candy: 60 });
        } else Meta.grant(r);
      });
      Save.save();
      cb(res.items);
    });
  },
  itemName: function (r) {
    if (r.tower) return CFG.TOWERS[r.tower].name;
    if (r.hero) return CFG.HEROES[r.hero].name;
    if (r.skin) return CFG.SKINS[r.skin].name;
    if (r.relic) return CFG.RELICS[r.relic].name;
    if (r.gems) return r.gems + ' 钻石';
    return r.candy + ' 糖果';
  },
  itemImg: function (r) {
    if (r.tower) return 't_' + r.tower + '_3_0';
    if (r.hero) return 'h_' + r.hero + '_0';
    if (r.skin) return 's_' + r.skin + '_3_0';
    return null;
  },
  discover: function (type) {
    var d = Save.d;
    d.fusions = d.fusions || {};
    if (d.fusions[type]) return false;
    d.fusions[type] = 1;
    this.stat(type[0] == 'u' ? 'ults' : 'fusions', 1);
    Save.save();
    return true;
  },
  known: function (type) {
    return !!(Save.d.fusions && Save.d.fusions[type]);
  },
  codexMark: function (t, lv) {
    var c = Save.d.codex;
    if (!c[t] || c[t] < lv) {
      c[t] = lv;
    }
    this.stat('maxLv', lv, true);
  },
  codexRewards: function (t) {
    var lv = Save.d.codex[t] || 0;
    return [2, 4, 5].map(function (L) {
      return { L: L, ok: lv >= L, claimed: !!Save.d.codexClaimed[t + L], r: { gems: L * 5 } };
    });
  }
};


// ---- src/data/upgrades.js ----
/**
 * 软萌大作战 V1.0
 * 肉鸽卡牌：稀有度 + 流派标签
 *
 * © 2026 <著作权人>
 */
var BUILDS = {
  ice: { name: '冰雷超导', color: '#6cc8ff', desc: '减速敌人受闪电伤害+60%' },
  fire: { name: '烈焰焚城', color: '#ff7a4a', desc: '燃烧伤害x2' },
  crit: { name: '致命一击', color: '#ff5a8a', desc: '暴击伤害+100%' },
  eco: { name: '招财进宝', color: '#ffc93c', desc: '击杀金币+50%' },
  boom: { name: '轰轰炮火', color: '#c7894f', desc: '爆炸范围+40%' }
};
BUILDS.toxic = { name: '剧毒蔓延', color: '#9be37a', desc: '中毒伤害x2，层数上限+3' };
BUILDS.ctrl = { name: '控场大师', color: '#8fb0ff', desc: '击退/拉回/黑洞范围+50%' };
BUILDS.nature = { name: '自然守护', color: '#7ed98a', desc: '回复效果+40%，减速敌人受伤+15%' };
var UPGRADES = [
  {
    id: 'atk',
    r: 'common',
    name: '磨磨爪子',
    desc: '全体伤害 +10%',
    icon: 'paw',
    apply: function (g) {
      g.m.dmg *= 1.1;
    }
  },
  {
    id: 'spd',
    r: 'common',
    name: '元气满满',
    desc: '全体攻速 +8%',
    icon: 'bolt',
    apply: function (g) {
      g.m.rate *= 1.08;
    }
  },
  {
    id: 'range',
    r: 'common',
    name: '望远镜',
    desc: '射程 +12%',
    icon: 'eye',
    apply: function (g) {
      g.m.range *= 1.12;
    }
  },
  {
    id: 'coin',
    r: 'common',
    name: '零花钱',
    desc: '立即获得 35 金币',
    icon: 'coin',
    tag: 'eco',
    apply: function (g) {
      g.gold += 35;
    }
  },
  {
    id: 'heal',
    r: 'common',
    name: '修修城堡',
    desc: '城堡生命上限+4 并回满',
    icon: 'heart',
    apply: function (g) {
      g.maxHp += 4;
      g.hp = g.maxHp;
    }
  },
  {
    id: 'multi',
    r: 'rare',
    name: '多重箭',
    desc: '弓手/火球 每次多射 1 发',
    icon: 'arrows',
    apply: function (g) {
      g.m.multi++;
    }
  },
  {
    id: 'pierce',
    r: 'rare',
    name: '穿透箭头',
    desc: '子弹穿透 +1 个敌人',
    icon: 'pierce',
    apply: function (g) {
      g.m.pierce++;
    }
  },
  {
    id: 'critc',
    r: 'rare',
    name: '幸运猫爪',
    desc: '暴击率 +12%',
    icon: 'clover',
    tag: 'crit',
    apply: function (g) {
      g.m.crit += 0.12;
    }
  },
  {
    id: 'frost',
    r: 'rare',
    name: '冰冰加深',
    desc: '减速效果 +20%，15%几率冰冻',
    icon: 'snow',
    tag: 'ice',
    apply: function (g) {
      g.m.slowAdd += 0.2;
      g.m.freeze += 0.15;
    }
  },
  {
    id: 'chain',
    r: 'rare',
    name: '雷电弹跳',
    desc: '闪电链弹射 +2',
    icon: 'bolt',
    tag: 'ice',
    apply: function (g) {
      g.m.chainAdd += 2;
    }
  },
  {
    id: 'burn',
    r: 'rare',
    name: '火上浇油',
    desc: '燃烧伤害 +60%',
    icon: 'fire',
    tag: 'fire',
    apply: function (g) {
      g.m.burn *= 1.6;
    }
  },
  {
    id: 'splash',
    r: 'rare',
    name: '大号火药',
    desc: '炮弹伤害 +20%，范围 +12%',
    icon: 'bomb',
    tag: 'boom',
    apply: function (g) {
      g.m.splash *= 1.12;
      g.m.cannon *= 1.2;
    }
  },
  {
    id: 'bounty',
    r: 'rare',
    name: '赏金猎人',
    desc: '击杀金币 +20%',
    icon: 'coin',
    tag: 'eco',
    apply: function (g) {
      g.m.bounty *= 1.2;
    }
  },
  {
    id: 'interest',
    r: 'epic',
    name: '小猪理财',
    desc: '每波结束获得 6% 金币利息',
    icon: 'pig',
    tag: 'eco',
    apply: function (g) {
      g.m.interest += 0.06;
    }
  },
  {
    id: 'bigatk',
    r: 'epic',
    name: '超级变身',
    desc: '全体伤害 +30%',
    icon: 'star',
    apply: function (g) {
      g.m.dmg *= 1.3;
    }
  },
  {
    id: 'promote',
    r: 'epic',
    name: '金色传承',
    desc: '随机 2 个伙伴等级 +1',
    icon: 'up',
    apply: function (g) {
      for (var i = 0; i < 2; i++) {
        var t = g.towers[Math.floor(Math.random() * g.towers.length)];
        if (t && !CFG.TOWERS[t.type].parts && t.lv < CFG.MAX_LV) {
          t.lv++;
          g.fxLevel(t);
        }
      }
    }
  },
  {
    id: 'boss',
    r: 'epic',
    name: '屠龙宝刀',
    desc: '对首领伤害 +60%',
    icon: 'sword',
    apply: function (g) {
      g.m.bossDmg *= 1.6;
    }
  },
  {
    id: 'critd',
    r: 'epic',
    name: '会心一击',
    desc: '暴击伤害 +80%',
    icon: 'clover',
    tag: 'crit',
    apply: function (g) {
      g.m.critDmg += 0.8;
    }
  },
  {
    id: 'spread',
    r: 'epic',
    name: '野火燎原',
    desc: '燃烧的敌人死亡时点燃周围',
    icon: 'fire',
    tag: 'fire',
    apply: function (g) {
      g.m.spread = true;
    }
  },
  {
    id: 'quake',
    r: 'epic',
    name: '震震弹',
    desc: '炮弹击晕敌人 0.5 秒',
    icon: 'bomb',
    tag: 'boom',
    apply: function (g) {
      g.m.stun += 0.5;
    }
  },
  {
    id: 'evolve',
    r: 'legend',
    name: '全员进化',
    desc: '所有伙伴等级 +1！',
    icon: 'crown',
    apply: function (g) {
      g.towers.forEach(function (t) {
        if (!CFG.TOWERS[t.type].parts && t.lv < CFG.MAX_LV) {
          t.lv++;
          g.fxLevel(t);
        }
      });
    }
  },
  {
    id: 'stop',
    r: 'legend',
    name: '时间停止',
    desc: '每 15 秒冻结全场 2 秒',
    icon: 'clock',
    tag: 'ice',
    apply: function (g) {
      g.m.timestop = true;
    }
  },
  {
    id: 'lava',
    r: 'legend',
    name: '熔岩之心',
    desc: '燃烧敌人死亡时爆炸',
    icon: 'fire',
    tag: 'fire',
    apply: function (g) {
      g.m.lava = true;
    }
  },
  {
    id: 'midas',
    r: 'legend',
    name: '点石成金',
    desc: '金币获取 x2',
    icon: 'coin',
    tag: 'eco',
    apply: function (g) {
      g.m.bounty *= 2;
    }
  }
];
UPGRADES.push(
  {
    id: 'castle',
    r: 'common',
    name: '城堡加固',
    desc: '城堡生命上限 +10',
    icon: 'heart',
    apply: function (g) {
      g.maxHp += 10;
      g.hp += 10;
    }
  },
  {
    id: 'lucky',
    r: 'common',
    name: '好运来',
    desc: '之后更容易出现稀有卡',
    icon: 'clover',
    apply: function (g) {
      g.luck += 0.5;
    }
  },
  {
    id: 'goldrain',
    r: 'common',
    name: '储蓄罐',
    desc: '每波奖励 +12 金币',
    icon: 'pig',
    tag: 'eco',
    apply: function (g) {
      g.m.waveGold += 12;
    }
  },
  {
    id: 'elitek',
    r: 'rare',
    name: '精英克星',
    desc: '对精英怪伤害 +60%',
    icon: 'sword',
    apply: function (g) {
      g.m.eliteDmg *= 1.6;
    }
  },
  {
    id: 'lamp',
    r: 'rare',
    name: '探照灯',
    desc: '伙伴可以看穿迷雾',
    icon: 'eye',
    only: function (g) {
      return g.fog && !g.m.seeFog;
    },
    apply: function (g) {
      g.m.seeFog = true;
    }
  },
  {
    id: 'warm',
    r: 'rare',
    name: '暖宝宝',
    desc: '免疫暴风雪减速',
    icon: 'fire',
    only: function (g) {
      return g.blizzard && !g.m.noBlizzard;
    },
    apply: function (g) {
      g.m.noBlizzard = true;
    }
  },
  {
    id: 'herocd',
    r: 'rare',
    name: '英雄觉醒',
    desc: '英雄技能冷却 -30%',
    icon: 'star',
    only: function (g) {
      return !!g.heroId;
    },
    apply: function (g) {
      g.m.heroCd *= 0.7;
    }
  },
  {
    id: 'zero',
    r: 'epic',
    name: '绝对零度',
    desc: '冰冻几率 +25%',
    icon: 'snow',
    tag: 'ice',
    apply: function (g) {
      g.m.freeze += 0.25;
    }
  },
  {
    id: 'cheap',
    r: 'epic',
    name: '伙伴招募令',
    desc: '召唤费用 -20%',
    icon: 'coin',
    tag: 'eco',
    apply: function (g) {
      g.m.costMul *= 0.8;
    }
  },
  {
    id: 'mega',
    r: 'legend',
    name: '巨大化',
    desc: '全体伤害 x1.6，射程 +20%',
    icon: 'up',
    apply: function (g) {
      g.m.dmg *= 1.6;
      g.m.range *= 1.2;
    }
  }
);
CFG.TOWER_ORDER.forEach(function (t) {
  if (CFG.PASSIVE[CFG.TOWERS[t].mech] || t == 'dragon') return;
  UPGRADES.push({
    id: 'sp_' + t,
    r: 'rare',
    name: CFG.TOWERS[t].name.slice(0, 2) + '专精',
    desc: CFG.TOWERS[t].name + ' 伤害 +50%',
    icon: 'paw',
    spType: t,
    only: function (g) {
      return g.typeCount(t) > 0;
    },
    apply: function (g) {
      g.m.type[t] = (g.m.type[t] || 1) * 1.5;
    }
  });
});
UPGRADES.push(
  {
    id: 'psn',
    r: 'rare',
    name: '毒性加深',
    desc: '中毒层数上限 +3，削甲加倍',
    icon: 'fire',
    tag: 'toxic',
    only: function (g) {
      return g.pool.indexOf('frog') >= 0;
    },
    apply: function (g) {
      g.m.psnCap += 3;
      g.m.shred *= 2;
    }
  },
  {
    id: 'psn2',
    r: 'epic',
    name: '猛毒',
    desc: '中毒伤害 +80%',
    icon: 'fire',
    tag: 'toxic',
    only: function (g) {
      return g.pool.indexOf('frog') >= 0;
    },
    apply: function (g) {
      g.m.toxic *= 1.8;
    }
  },
  {
    id: 'kb',
    r: 'rare',
    name: '强力击退',
    desc: '击退/拉回距离 +60%',
    icon: 'up',
    tag: 'ctrl',
    only: function (g) {
      return g.pool.indexOf('hedgehog') >= 0 || g.pool.indexOf('koala') >= 0;
    },
    apply: function (g) {
      g.m.kb *= 1.6;
    }
  },
  {
    id: 'hole',
    r: 'epic',
    name: '引力奇点',
    desc: '黑洞范围 +40%',
    icon: 'moon',
    tag: 'ctrl',
    only: function (g) {
      return g.pool.indexOf('unicorn') >= 0;
    },
    apply: function (g) {
      g.m.holeR *= 1.4;
    }
  },
  {
    id: 'msl',
    r: 'rare',
    name: '导弹齐射',
    desc: '导弹 +1 发',
    icon: 'bomb',
    tag: 'boom',
    only: function (g) {
      return g.pool.indexOf('hamster') >= 0;
    },
    apply: function (g) {
      g.m.missileAdd++;
    }
  },
  {
    id: 'aura',
    r: 'rare',
    name: '光环共鸣',
    desc: '鹿鹿光环效果 +50%',
    icon: 'star',
    only: function (g) {
      return g.pool.indexOf('deer') >= 0;
    },
    apply: function (g) {
      g.m.aura *= 1.5;
    }
  },
  {
    id: 'chick',
    r: 'rare',
    name: '小鸡大军',
    desc: '每次多召唤 1 只小鸡',
    icon: 'paw',
    only: function (g) {
      return g.pool.indexOf('chick') >= 0;
    },
    apply: function (g) {
      g.m.summonAdd++;
    }
  },
  {
    id: 'fuse',
    r: 'epic',
    name: '融合共振',
    desc: '融合/究极伙伴伤害 +50%',
    icon: 'crown',
    only: function (g) {
      return g.towers.some(function (t) {
        return !!CFG.TOWERS[t.type].parts;
      });
    },
    apply: function (g) {
      g.m.fusionDmg *= 1.5;
    }
  }
);
UPGRADES.push(
  {
    id: 'thorn',
    r: 'rare',
    name: '反伤刺甲',
    desc: '近战敌人受伤 +15%，被击退时额外损失生命',
    icon: 'pierce',
    tag: 'ctrl',
    apply: function (g) {
      g.m.thorn = (g.m.thorn || 0) + 0.15;
    }
  },
  {
    id: 'bloom',
    r: 'rare',
    name: '花开满城',
    desc: '每波结束额外回复 3 生命',
    icon: 'heart',
    tag: 'nature',
    apply: function (g) {
      g.m.waveHeal = (g.m.waveHeal || 0) + 3;
    }
  },
  {
    id: 'overgrow',
    r: 'epic',
    name: '丛生藤蔓',
    desc: '减速效果 +25%，减速敌人受伤 +10%',
    icon: 'snow',
    tag: 'nature',
    apply: function (g) {
      g.m.slowAdd += 0.25;
      g.m.natureAmp = (g.m.natureAmp || 0) + 0.1;
    }
  },
  {
    id: 'dualpath',
    r: 'epic',
    name: '双修心法',
    desc: '立即获得 2 张随机稀有强化',
    icon: 'star',
    apply: function (g) {
      var pool = UPGRADES.filter(function (u) {
        return u.r == 'rare' && u.id != 'dualpath';
      });
      for (var i = 0; i < 2 && pool.length; i++) {
        var u = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        u.apply(g);
        g.taken[u.id] = (g.taken[u.id] || 0) + 1;
        if (u.tag) g.tags[u.tag] = (g.tags[u.tag] || 0) + 1;
      }
    }
  },
  {
    id: 'bastion',
    r: 'legend',
    name: '不破要塞',
    desc: '城堡生命上限 +20，受伤时 15% 概率抵消',
    icon: 'crown',
    apply: function (g) {
      g.maxHp += 20;
      g.hp += 20;
      g.m.guard = (g.m.guard || 0) + 0.15;
    }
  }
);
/** 同一张卡的叠加上限：防止前期堆叠滚雪球 */
var CARD_STACK = {
  pierce: 2,
  multi: 2,
  splash: 2,
  chain: 2,
  frost: 2,
  atk: 4,
  spd: 4,
  range: 3,
  bigatk: 1,
  bounty: 2,
  goldrain: 2,
  cheap: 1
};
function rollUpgrades(g, n) {
  n = n || 3;
  var pool = UPGRADES.filter(function (u) {
      return (
        (!u.only || u.only(g)) &&
        !(u.r == 'legend' && g.taken[u.id]) &&
        !(u.id == 'spread' && g.taken.spread) &&
        !(u.id == 'interest' && (g.taken.interest || 0) >= 3) &&
        !((g.taken[u.id] || 0) >= (CARD_STACK[u.id] || 99)) &&
        !(u.r == 'epic' && g.wave < 3)
      );
    }),
    res = [];
  // 流派加权：已有的标签更容易出现
  while (res.length < n && pool.length) {
    var tot = 0,
      ws = pool.map(function (u) {
        var w = CFG.RARITY[u.r].w * (u.tag && g.tags[u.tag] ? 1.6 : 1) * (u.r != 'common' ? 1 + g.luck : 1);
        tot += w;
        return w;
      });
    var x = Math.random() * tot,
      i = 0;
    while (x > ws[i]) {
      x -= ws[i];
      i++;
    }
    res.push(pool.splice(i, 1)[0]);
  }
  return res;
}

/** 无尽法则抉择：每 15 波三选一，强化独特爬升 */
function rollEndlessLaws(g) {
  var LAWS = [
    {
      id: 'law_surge',
      r: 'epic',
      name: '浪潮法则',
      desc: '之后每波敌人 +2，但击杀金币 +35%',
      icon: 'crown',
      apply: function (g) {
        g.m.endlessSurge = (g.m.endlessSurge || 0) + 2;
        g.m.bounty *= 1.35;
      }
    },
    {
      id: 'law_tempo',
      r: 'epic',
      name: '迅捷法则',
      desc: '全体攻速 +12%，敌人移速 +8%',
      icon: 'bolt',
      apply: function (g) {
        g.m.rate *= 1.12;
        g.m.enemySpd = (g.m.enemySpd || 1) * 1.08;
      }
    },
    {
      id: 'law_forge',
      r: 'epic',
      name: '熔炉法则',
      desc: '随机 3 只伙伴 +1 级，召唤费用 -10%',
      icon: 'up',
      apply: function (g) {
        var pool = g.towers.filter(function (t) {
          return !CFG.TOWERS[t.type].parts && t.lv < CFG.MAX_LV;
        });
        for (var i = 0; i < 3 && pool.length; i++) {
          var t = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
          t.lv++;
          g.fxLevel(t);
        }
        g.m.costMul = (g.m.costMul || 1) * 0.9;
      }
    },
    {
      id: 'law_shield',
      r: 'epic',
      name: '壁垒法则',
      desc: '城堡生命上限 +12 并回满，护甲穿透 -1（更稳）',
      icon: 'heart',
      apply: function (g) {
        g.maxHp += 12;
        g.hp = g.maxHp;
        g.m.armorPen = (g.m.armorPen || 0) - 1;
      }
    },
    {
      id: 'law_chaos',
      r: 'legend',
      name: '混沌法则',
      desc: '立即获得 80 金币，并随机激活一个未有流派',
      icon: 'star',
      apply: function (g) {
        g.gold += 80;
        var ks = Object.keys(BUILDS).filter(function (k) {
          return !g.tags[k];
        });
        if (ks.length) {
          var k = ks[Math.floor(Math.random() * ks.length)];
          g.tags[k] = 3;
          g.emit('build', k);
        }
      }
    },
    {
      id: 'law_harvest',
      r: 'epic',
      name: '丰收法则',
      desc: '利息 +8%，猪猪产金 +50%',
      icon: 'coin',
      tag: 'eco',
      apply: function (g) {
        g.m.interest += 0.08;
        g.m.pigMul = (g.m.pigMul || 1) * 1.5;
      }
    }
  ];
  // shuffle pick 3（已选过的法则不再出现）
  var pool = LAWS.filter(function (u) {
    return !g.taken[u.id];
  });
  if (pool.length < 3) pool = LAWS.slice();
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, 3);
}


// ---- src/core/game.js ----
/**
 * 软萌大作战 V1.0
 * 核心玩法逻辑（不含渲染，可在 Node 中模拟）
 *
 * © 2026 <著作权人>
 */
var _uid = 1;
function Game(level, opts) {
  opts = opts || {};
  this.emit = opts.emit || function () {};
  this.noMeta = !!opts.noMeta;
  this.heroId = opts.hero === undefined ? (this.noMeta ? null : Save.d.hero) : opts.hero;
  this.poolOpt = opts.pool || null;
  this.relics = opts.relics || (this.noMeta ? [] : (Save.d.equip || []).slice());
  this.setLevel(level);
  this.reset();
}
Game.prototype.tl = function (id) {
  return this.noMeta ? 0 : Save.tl(id);
};
Game.prototype.setLevel = function (level) {
  this.level = level;
  var ps = PATHSETS[level.paths || 'classic'];
  this.paths = ps.map(makePath);
  this.activePath = 0;
  this.lane = 0;
  this.mods = {};
  var self = this;
  (level.mods || []).forEach(function (k) {
    self.mods[k] = 1;
  });
  this.mech = level.mech;
  if (this.mods.fog) this.fog = true;
  if (this.mech == 'fog') this.fog = true;
  if (this.mods.blizzard || this.mech == 'blizzard') this.blizzard = true;
  if (this.mech == 'switch') this.switching = true;
};
Game.prototype.reset = function () {
  var tl = this.tl.bind(this),
    self = this,
    opts_pool = this.poolOpt;
  this.gold = CFG.START_GOLD + tl('gold') * 30 + (this.level.startGold || 0);
  this.maxHp = this.hp = CFG.BASE_HP + tl('hp') * 4;
  this.wave = 0;
  this.enemies = [];
  this.shots = [];
  this.towers = [];
  this.m = {
    dmg: 1 + tl('dmg') * 0.08,
    rate: 1 + tl('rate') * 0.05,
    range: 1,
    multi: 0,
    pierce: 0,
    crit: 0.05 + tl('crit') * 0.04,
    critDmg: 1,
    slowAdd: 0,
    freeze: 0,
    chainAdd: 0,
    burn: 1,
    splash: 1,
    cannon: 1,
    bounty: 1,
    interest: 0,
    bossDmg: 1,
    spread: false,
    stun: 0,
    timestop: false,
    lava: false,
    type: {},
    enemySpd: 1,
    waveGold: 0,
    heroCd: 1,
    eliteDmg: 1,
    waveHeal: 0,
    seeFog: false,
    noBlizzard: false,
    costMul: 1,
    hpMul: 1,
    armorAdd: 0,
    regen: 0,
    reward: 1,
    fusionDmg: 1,
    psnCap: 0,
    toxic: 1,
    shred: 1,
    kb: 1,
    aura: 1,
    holeR: 1,
    missileAdd: 0,
    summonAdd: 0,
    thorn: 0,
    natureAmp: 0,
    guard: 0,
    endlessSurge: 0,
    pigMul: 1
  };
  this.minions = [];
  this.holes = [];
  this.fxOn = {};
  var M = this.mods;
  if (M.swift) this.m.enemySpd *= 1.3;
  if (M.armor) this.m.armorAdd += 3;
  if (M.rich) {
    this.m.bounty *= 1.5;
    this.m.waveGold += 8;
  }
  if (M.poor) this.m.costMul = 1.5;
  if (M.giant) this.m.hpMul *= 1.4;
  if (M.glass) {
    this.maxHp = Math.ceil(this.maxHp / 2);
    this.hp = this.maxHp;
    this.m.reward = 2;
  }
  if (M.regen) this.m.regen = 0.02;
  if (M.bounty) {
    this.m.bounty *= 2;
    this.m.hpMul *= 1.2;
  }
  this.tags = {};
  this.taken = {};
  this.luck = 0;
  this.buys = 0;
  this.state = 'prep';
  this.queue = [];
  this.spawnT = 0;
  this.revived = false;
  this.freeRerolls = tl('reroll');
  this.adReroll = true;
  this.stopT = 15;
  this.globalFreeze = 0;
  this.time = 0;
  this.stats = { kills: 0, merges: 0, dmg: 0, bosses: 0, elites: 0 };
  this.stormT = 10;
  this.storm = 0;
  this.switchT = 10;
  this.pool = opts_pool || (this.noMeta ? ['cat', 'penguin', 'bear', 'bunny', 'fox'] : Save.team());
  if (M.catonly) this.pool = ['cat'];
  // 英雄被动
  this.heroCdT = 8;
  var h = this.heroId;
  if (h == 'captain') this.m.type.cat = 1.3;
  if (h == 'princess') this.m.slowAdd += 0.15;
  if (h == 'fortune') this.m.bounty *= 1.15;
  if (h == 'thunder') this.m.chainAdd += 1;
  this.relics.forEach(function (r) {
    if (CFG.RELICS[r]) CFG.RELICS[r].fn(self);
  });
};
Game.prototype.build = function (id) {
  return (this.tags[id] || 0) >= 3;
};
Game.prototype.cost = function () {
  return Math.round(Math.min(CFG.BUY_MAX, CFG.BUY_COST + this.buys * CFG.BUY_STEP) * this.m.costMul);
};
Game.prototype.cellAt = function (c, r) {
  for (var i = 0; i < this.towers.length; i++) {
    var t = this.towers[i];
    if (t.c == c && t.r == r) return t;
  }
  return null;
};
Game.prototype.freeCells = function () {
  var f = [];
  for (var r = CFG.ROWS - 1; r >= 0; r--) for (var c = 0; c < CFG.COLS; c++) if (!this.cellAt(c, r)) f.push([c, r]);
  return f;
};
Game.prototype.addTower = function (type, lv, cell, branch) {
  var t = {
    id: _uid++,
    type: type,
    lv: lv,
    c: cell[0],
    r: cell[1],
    cd: Math.random() * 0.5,
    recoil: 0,
    phase: Math.random() * 6,
    born: 0,
    branch: branch || null,
    frozenT: 0
  };
  this.towers.push(t);
  this.emit('spawnTower', t);
  return t;
};
Game.prototype.buy = function (forceType) {
  var f = this.freeCells();
  if (!f.length || this.gold < this.cost()) return null;
  this.gold -= this.cost();
  this.buys++;
  var type = forceType || this.pool[Math.floor(Math.random() * this.pool.length)],
    lv = 1;
  if (!forceType && this.wave >= CFG.RESO_W && Math.random() < CFG.RESO_P) {
    var need = this.fusionNeeds();
    if (need.length) {
      type = need[Math.floor(Math.random() * need.length)];
      lv = this.wave >= 20 ? 2 : 1;
      this.emit('reso', { type: type });
    }
  }
  return this.addTower(type, lv, f[Math.floor(Math.random() * Math.min(f.length, 5))]);
};
// 融合共鸣：已有 Lv4+ 配方伙伴（或融合伙伴）时，商店更容易刷出配方所需的另一半；首领掉落组成伙伴
Game.prototype.fusionNeeds = function () {
  var g = this,
    need = [];
  g.towers.forEach(function (t) {
    var D = CFG.TOWERS[t.type];
    if (D.fusion && !D.ultimate && t.lv < CFG.FUSION_MAX) {
      D.parts.forEach(function (p) {
        if (g.pool.indexOf(p) >= 0) need.push(p);
      });
      // 已有融合伙伴时，同时偏向可与之组成究极伙伴的另一组配方
      Object.keys(CFG.ULTIMATES).forEach(function (k) {
        var U = CFG.ULTIMATES[k],
          o = U.a == D.fusion ? U.b : U.b == D.fusion ? U.a : null,
          F = o && CFG.FUSIONS[o];
        if (F && g.pool.indexOf(F.a) >= 0 && g.pool.indexOf(F.b) >= 0) need.push(F.a, F.b);
      });
      return;
    }
    if (!D.parts && t.lv >= CFG.RESO_LV)
      Object.keys(CFG.FUSIONS).forEach(function (k) {
        var F = CFG.FUSIONS[k];
        var o = F.a == t.type ? F.b : F.b == t.type ? F.a : null;
        if (o && g.pool.indexOf(o) >= 0) {
          need.push(o);
          need.push(t.type);
        }
      });
  });
  return need;
};
Game.prototype.bossDrop = function () {
  var need = this.fusionNeeds(),
    f = this.freeCells();
  if (!f.length) return;
  if (!need.length) {
    // 尚无配方进度时，掉落当前最高等级的可融合基础伙伴，帮助其冲击满级
    var best = this.towers
      .filter(function (t) {
        var D = CFG.TOWERS[t.type];
        return !D.parts && t.lv < CFG.MAX_LV && CFG.FUSION_PARTS[t.type];
      })
      .sort(function (a, b) {
        return b.lv - a.lv;
      })[0];
    if (best) need = [best.type];
    else return;
  }
  var type = need[Math.floor(Math.random() * need.length)],
    t = this.addTower(type, 3, f[0]);
  if (t) {
    t.pop = 0.5;
    this.emit('drop', { t: t });
  }
};
Game.prototype.summonByGems = function () {
  var f = this.freeCells();
  if (!f.length || Save.d.gems < CFG.DRAGON_GEMS) return null;
  Save.d.gems -= CFG.DRAGON_GEMS;
  Save.save();
  return this.addTower('dragon', 1, f[0]);
};
Game.prototype.tpos = function (t) {
  return { x: CFG.GRID_X + t.c * CFG.CELL + CFG.CELL / 2, y: CFG.GRID_Y + t.r * CFG.CELL + CFG.CELL / 2 };
};
Game.prototype.maxLv = function (t) {
  return CFG.maxLv(t.type);
};
Game.prototype.canMerge = function (a, b) {
  return (
    a &&
    b &&
    a !== b &&
    a.type == b.type &&
    a.lv == b.lv &&
    a.lv < this.maxLv(a) &&
    (a.lv < CFG.BRANCH_LV || CFG.TOWERS[a.type].fusion || a.branch == b.branch)
  );
};
// 跨塔融合：两只满级 Lv5 的不同伙伴 → 融合伙伴 Lv1；两只 Lv2+ 融合伙伴 → 究极伙伴
Game.prototype.fuseResult = function (a, b) {
  if (!a || !b || a === b || a.type == b.type) return null;
  var A = CFG.TOWERS[a.type],
    B = CFG.TOWERS[b.type];
  if (!A.fusion && !B.fusion && !A.ultimate && !B.ultimate && a.lv >= CFG.MAX_LV && b.lv >= CFG.MAX_LV) {
    var k = CFG.fusionOf(a.type, b.type);
    return k ? 'f_' + k : null;
  }
  if (A.fusion && B.fusion && a.lv >= CFG.ULT_LV && b.lv >= CFG.ULT_LV) {
    var u = CFG.ultimateOf(A.fusion, B.fusion);
    return u ? 'u_' + u : null;
  }
  return null;
};
// 喂养：把一只 Lv3+ 组成伙伴拖给融合伙伴，融合等级 +1（最高 Lv3）
Game.prototype.canFeed = function (f, b) {
  var F = CFG.TOWERS[f.type];
  return f &&
    b &&
    f !== b &&
    F.fusion &&
    !F.ultimate &&
    f.lv < CFG.FUSION_MAX &&
    b.lv >= (CFG.FEED_LV || 3) &&
    F.parts.indexOf(b.type) >= 0
    ? f
    : null;
};
Game.prototype.move = function (t, c, r) {
  var o = this.cellAt(c, r);
  if (o === t) return null;
  if (!o) {
    t.c = c;
    t.r = r;
    return 'move';
  }
  var fd = this.canFeed(t, o) || this.canFeed(o, t);
  if (fd) {
    var base = fd === t ? o : t;

    this.towers.splice(this.towers.indexOf(base), 1);
    if (fd !== o) {
      fd.c = o.c;
      fd.r = o.r;
    }
    fd.lv++;
    this.stats.merges++;
    if (!this.noMeta) {
      Save.task('merge');
      Meta.codexMark(fd.type, fd.lv);
    }
    this.emit('merge', fd);
    return 'merge';
  }
  var fz = this.fuseResult(t, o);
  if (fz) {
    var from = [t.type, o.type];
    this.towers.splice(this.towers.indexOf(t), 1);
    o.type = fz;
    o.lv = 1;
    o.branch = null;
    o.cds = null;
    this.stats.merges++;
    this.stats.fusions = (this.stats.fusions || 0) + 1;
    if (!this.noMeta) {
      Save.task('merge');
      Meta.codexMark(o.type, 1);
      Meta.discover(fz);
    }
    this.emit('fusion', { t: o, from: from, ult: fz[0] == 'u' });
    return 'fusion';
  }
  if (this.canMerge(t, o)) {
    o.lv++;
    this.towers.splice(this.towers.indexOf(t), 1);
    this.stats.merges++;
    if (!this.noMeta) {
      Save.task('merge');
      Meta.codexMark(o.type, o.lv);
    }
    this.emit('merge', o);
    if (o.lv == CFG.BRANCH_LV && !o.branch && !CFG.TOWERS[o.type].fusion && !CFG.TOWERS[o.type].ultimate) {
      this.pendingBranch = o;
      this.emit('branch', o);
    }
    return 'merge';
  }
  var tc = t.c,
    tr = t.r;
  t.c = o.c;
  t.r = o.r;
  o.c = tc;
  o.r = tr;
  return 'swap';
};
Game.prototype.chooseBranch = function (br) {
  if (this.pendingBranch) {
    this.pendingBranch.branch = br;
    this.emit('merge', this.pendingBranch);
  }
  this.pendingBranch = null;
};
Game.prototype.sellValue = function (t) {
  var D = CFG.TOWERS[t.type];
  return Math.floor(CFG.BUY_COST * Math.pow(2, (D.ultimate ? 14 : D.fusion ? 9 + t.lv : t.lv) - 1) * 0.5);
};
Game.prototype.sell = function (t) {
  this.towers.splice(this.towers.indexOf(t), 1);
  var v = this.sellValue(t);
  this.gold += v;
  this.emit('sell', { t: t, v: v });
};
Game.prototype.fxLevel = function (t) {
  if (t.lv == CFG.BRANCH_LV && !t.branch && !CFG.TOWERS[t.type].fusion) t.branch = Math.random() < 0.5 ? 'A' : 'B';
  this.emit('merge', t);
};
Game.prototype.isBossWave = function (w) {
  var L = this.level;
  if (L.mode == 'exp') return !!L.bossNode && w == L.waves;
  if (L.mode == 'bossrush') return true;
  if (L.mode == 'endless') return w % 10 == 0;
  if (L.boss && w == L.waves) return true;
  return w % 5 == 0;
};
Game.prototype.isEliteWave = function (w) {
  var L = this.level;
  if (L.mode == 'exp') return !!L.eliteNode || w % 4 == 0;
  if (this.mods.elite) return true;
  if (L.mode == 'endless') return w % 5 == 0 && w % 10 != 0;
  return w >= 4 && w % 3 == 0;
};
Game.prototype.bossFor = function (w) {
  var L = this.level,
    all = Object.keys(CFG.BOSSES);
  if (L.mode == 'bossrush' || L.mode == 'endless')
    return CFG.BOSSES[all[(Math.floor(w / (L.mode == 'endless' ? 10 : 1)) - 1) % all.length]];
  if (L.boss && w == L.waves) return CFG.BOSSES[L.boss];
  if (L.mode == 'exp') return CFG.BOSSES.star;
  return CFG.BOSSES[CFG.MID_BOSSES[(Math.floor(w / 5) - 1) % 3]];
};
// ---------- 波次生成 ----------
Game.prototype.enemyTypes = function (w) {
  var L = this.level,
    res = [];
  if (L.mix) {
    for (var k in L.mix) {
      var f = k == 'flying' && L.c > 1 ? 5 : CFG.ENEMIES[k].from;
      if (w >= Math.min(f, (k == 'bomb' ? 6 : 4) + Object.keys(L.mix).indexOf(k) * 2))
        for (var i = 0; i < L.mix[k]; i++) res.push(k);
    }
    if (!res.length) res = ['normal'];
    return res;
  }
  for (var k2 in CFG.ENEMIES) if (CFG.ENEMIES[k2].from <= w) res.push(k2);
  return res;
};
Game.prototype.startWave = function () {
  this.portalSafe =
    this.level.mode == 'endless' ? CFG.PORTAL_SAFE * 1.1 : CFG.PORTAL_SAFE * (CFG.PORTAL_CH[this.level.c] || 1);
  if (this.state != 'prep') return;
  this.wave++;
  if (this.level.mode == 'endless' && this.wave > 1 && this.wave % 20 == 1) {
    var ths = CFG.ENDLESS_THEMES || ['grass', 'forest', 'snow', 'desert', 'haunt', 'space'];
    var ps = CFG.ENDLESS_PATHS || ['classic', 'lanes', 'zigzag', 'spiral'];
    this.level.theme = ths[Math.floor(this.wave / 20) % ths.length];
    this.level.paths = ps[Math.floor(this.wave / 20) % ps.length];
    this.emit('themeShift', { theme: this.level.theme, paths: this.level.paths });
  }
  var w = this.wave,
    q = [],
    L = this.level,
    n = Math.round(CFG.WAVE_BASE + Math.min(w, 40) * CFG.WAVE_PER) + (this.m.endlessSurge || 0),
    types = this.enemyTypes(w);
  if (L.mode == 'endless' && w % 10 == 0) n += 4 + Math.floor(w / 20);
  if (L.mode == 'bossrush') n = 3 + Math.floor(w / 2);
  var pack = function (ty, cnt, gap, lead) {
    for (var k = 0; k < cnt; k++) q.push({ type: ty, delay: k ? gap : lead });
  };
  // 分组出怪：普通小队 / 急急快攻队 / 小软蜂群 / 重甲单位，组内间隔短、组间留出喘息
  var lead = 0.6;
  while (q.length < n) {
    var r = Math.random(),
      hasFast = types.indexOf('fast') >= 0,
      left = n - q.length;
    if (L.mode != 'bossrush' && w >= 3 && r < 0.18 && q.length)
      pack('mini', Math.min(left, 6 + Math.floor(w / 6)), 0.16, lead);
    else if (hasFast && r < 0.36 && q.length) pack('fast', Math.min(left, 3 + Math.floor(w / 8)), 0.3, lead);
    else {
      var cnt = Math.min(left, 3 + Math.floor(Math.random() * 3));
      for (var k = 0, nt = 0; k < cnt; k++) {
        var ty = q.length < 3 && L.mode != 'bossrush' ? 'normal' : types[Math.floor(Math.random() * types.length)];
        // 每个小队最多 1 只重甲（第 10 波起 2 只），避免高血量扎堆
        if (ty == 'tank' && ++nt > (w >= 10 ? 2 : 1)) ty = 'normal';
        q.push({ type: ty, delay: k ? (ty == 'tank' ? 0.7 : 0.42) : lead });
      }
    }
    lead = Math.max(0.55, 1.25 - Math.min(w, 30) * 0.022);
  }
  if (this.isEliteWave(w)) {
    var ne = this.mods.elite ? 2 : 1 + Math.floor(w / 15);
    for (var j = 0; j < ne; j++)
      q.splice(Math.floor(q.length * (0.4 + j * 0.2)), 0, {
        type: types[Math.floor(Math.random() * types.length)],
        elite: true,
        delay: 0.8
      });
  }
  if (this.isBossWave(w)) {
    var b = this.bossFor(w);
    q.splice(Math.floor(q.length / 2), 0, { boss: b, delay: 2 });
    this.emit('bossWarn', b);
  }
  if (this.m.waveHeal) this.hp = Math.min(this.maxHp, this.hp + this.m.waveHeal);
  this.queue = q;
  this.spawnT = 0.6;
  this.state = 'wave';
  this.emit('waveStart', w);
};
/** 每波生命成长曲线：前 11 波按 HP_GROW，之后 8 波内平滑加速到 HP_GROW + HP_ACC，避免中后期出现台阶 */
var HP_CURVE = [];
function hpCurve(w) {
  if (!HP_CURVE.length) {
    var v = 1;
    for (var i = 1; i <= 60; i++) {
      HP_CURVE[i] = v;
      v *= CFG.HP_GROW + (i >= 12 ? CFG.HP_ACC * Math.min(1, (i - 11) / 8) : 0);
    }
  }
  return HP_CURVE[Math.max(1, w)];
}
Game.prototype.hpScale = function () {
  var w = this.wave;
  return (
    20 *
    (CFG.HP_K || 1) *
    (CFG.HP_CH && this.level.mode != 'endless' && this.level.c != null
      ? CFG.HP_CH[this.level.c]
      : this.level.mode == 'endless'
        ? w < 10
          ? 0.5 + 0.05 * w
          : 1 + Math.min(CFG.HP_END || 0, (w - 10) * 0.045)
        : 1) *
    this.level.diff *
    this.m.hpMul *
    hpCurve(Math.min(w, 60)) *
    (w > 20 ? Math.pow(CFG.HP_LATE || 1, Math.min(w, 60) - 20) : 1) *
    (w > 60 ? Math.pow(1.08, w - 60) : 1)
  );
};
Game.prototype.pickPath = function () {
  if (this.switching) return this.activePath;
  if (this.paths.length > 1) {
    this.lane = (this.lane + 1) % this.paths.length;
    return this.lane;
  }
  return 0;
};
Game.prototype.spawn = function (item, atDist, near, pathIdx) {
  var e,
    def,
    s = this.hpScale(),
    L = this.level;
  if (item.boss) {
    def = item.boss;
    var midBoss = !(L.boss && this.wave == L.waves) && L.mode != 'bossrush' && L.mode != 'exp',
      bh = def.hp * s * CFG.BOSS_K * (midBoss ? CFG.MIDBOSS_K : 1) * (L.mode == 'bossrush' ? 0.85 : 1);
    e = {
      boss: def,
      hp: bh,
      speed: def.speed,
      r: def.r,
      fly: !!def.fly,
      armor: (def.armor || 0) * L.diff,
      leak: midBoss ? 5 : 8,
      gold: 40,
      color: def.color,
      skillT: 3,
      dashT: 0,
      invT: 0
    };
  } else {
    def = CFG.ENEMIES[item.type];
    e = {
      type: item.type,
      hp: def.hp * s,
      speed: def.speed * (CFG.SPD_K || 1) * (1 + Math.min(this.wave, 40) * 0.008),
      r: def.r,
      fly: !!def.fly,
      armor: (def.armor || 0) * L.diff,
      leak: def.leak,
      gold: Math.max(1, Math.round((def.gold + Math.floor(this.wave / 5)) * CFG.GOLD_K)),
      color: def.color
    };
    if (def.shield) e.shield = e.shieldMax = def.hp * s * def.shield;
    if (def.phase) {
      e.phaseT = Math.random() * 3;
    }
  }
  if (item.elite) {
    e.elite = ['swift', 'armored', 'regen'][Math.floor(Math.random() * 3)];
    e.hp *= 2.6;
    e.r *= 1.25;
    e.gold *= 3;
    e.leak += 1;
    if (e.elite == 'swift') e.speed *= 1.35;
    if (e.elite == 'armored') e.armor += 4 * L.diff;
  }
  if (item.half) {
    e.hp = item.half;
    e.r *= 0.75;
    e.splitDone = true;
  }
  e.armor += this.m.armorAdd;
  e.speed *= this.m.enemySpd;
  e.id = _uid++;
  e.maxHp = e.hp;
  e.dist = atDist || 0;
  e.slowT = 0;
  e.slowF = 1;
  e.freezeT = 0;
  e.stunT = 0;
  e.burnT = 0;
  e.burnDps = 0;
  e.hitT = 0;
  e.phase = Math.random() * 6;
  e.age = 0;
  e.invis = 0;
  e.psn = 0;
  e.psnT = 0;
  e.psnDps = 0;
  e.holdT = 0;
  e.pi = pathIdx != null ? pathIdx : this.pickPath();
  e.path = this.paths[e.pi];
  if (e.fly) {
    e.fx0 = near ? near.x : 30 + Math.random() * 300;
    e.fy0 = near ? near.y : 70;
    e.ft = 0;
    var dx = CFG.CASTLE.x - e.fx0,
      dy = CFG.CASTLE.y - e.fy0;
    e.flen = Math.hypot(dx, dy);
  }
  this.pos(e);
  this.enemies.push(e);
  this.emit('spawn', e);
  return e;
};
Game.prototype.pos = function (e) {
  if (e.fly) {
    var k = Math.min(1, e.ft / e.flen);
    e.x = e.fx0 + (CFG.CASTLE.x - e.fx0) * k + Math.sin(e.age * 2 + e.phase) * 10;
    e.y = e.fy0 + (CFG.CASTLE.y - e.fy0) * k;
    e.prog = k;
  } else {
    var p = e.path.at(e.dist);
    e.x = p.x;
    e.y = p.y;
    e.prog = e.dist / e.path.len;
  }
};
Game.prototype.FOG_Y = 205;
Game.prototype.targetable = function (e) {
  if (e.dead || e.invis > 0) return false;
  if (e.prog < this.portalSafe) return false;
  if (this.fog && !this.m.seeFog && e.y < this.FOG_Y) return false;
  return true;
};
// ---------- 主循环 ----------
Game.prototype.update = function (dt) {
  if (this.state != 'wave' || this.pendingBranch) return;
  var g = this;
  g.time += dt;
  g.fxOn = {};
  g.towers.forEach(function (t) {
    var D = CFG.TOWERS[t.type];
    if (D.fusion) g.fxOn[D.fusion] = 1;
    if (D.ultimate)
      D.fx2.forEach(function (k) {
        g.fxOn[k] = 1;
      });
  });
  if (g.queue.length) {
    g.spawnT -= dt;
    if (g.spawnT <= 0) {
      var it = g.queue.shift();
      g.spawn(it);
      g.spawnT = g.queue.length ? g.queue[0].delay : 0;
    }
  }
  if (g.m.timestop) {
    g.stopT -= dt;
    if (g.stopT <= 0) {
      g.stopT = 15;
      g.globalFreeze = 2;
      g.emit('timestop');
    }
  }
  if (g.globalFreeze > 0) g.globalFreeze -= dt;
  if (g.heroId && g.heroCdT > 0) g.heroCdT -= dt;
  if (g.blizzard && !g.m.noBlizzard) {
    g.stormT -= dt;
    if (g.storm > 0) g.storm -= dt;
    if (g.stormT <= 0) {
      g.stormT = 14;
      g.storm = 4;
      g.emit('storm');
    }
  }
  if (g.switching) {
    g.switchT -= dt;
    if (g.switchT <= 0) {
      g.switchT = 10;
      g.activePath = (g.activePath + 1) % g.paths.length;
      g.emit('switch', g.activePath);
    }
  }
  for (var i = 0; i < g.enemies.length; i++) {
    var e = g.enemies[i];
    if (e.dead) continue;
    e.age += dt;
    e.hitT -= dt;
    if (e.burnT > 0 && !(e.boss && e.boss.id == 'magma')) {
      e.burnT -= dt;
      g.hurt(e, e.burnDps * dt * (g.build('fire') ? 2 : 1), { dot: true });
      if (e.dead) continue;
    }
    if (g.m.regen || e.elite == 'regen')
      e.hp = Math.min(e.maxHp, e.hp + e.maxHp * (g.m.regen + (e.elite == 'regen' ? 0.03 : 0)) * dt);
    if (e.phaseT != null) {
      e.phaseT -= dt;
      if (e.invis > 0) e.invis -= dt;
      if (e.phaseT <= 0) {
        e.phaseT = 3.5;
        e.invis = 1.2;
      }
    }
    if (e.boss) g.bossSkill(e, dt);
    if (e.type == 'healer' && Math.floor(e.age * 2) != Math.floor((e.age - dt) * 2)) {
      g.enemies.forEach(function (o) {
        if (!o.dead && o !== e && Math.hypot(o.x - e.x, o.y - e.y) < 60) {
          o.hp = Math.min(o.maxHp, o.hp + o.maxHp * 0.04);
        }
      });
      g.emit('heal', e);
    }
    var sp = e.speed;
    if (e.slowT > 0) {
      e.slowT -= dt;
      sp *= e.slowF;
    }
    if (e.freezeT > 0) {
      e.freezeT -= dt;
      sp = 0;
    }
    if (e.stunT > 0) {
      e.stunT -= dt;
      sp = 0;
    }
    if (e.holdT > 0) sp = 0;
    if (g.globalFreeze > 0 && !e.boss) sp = 0;
    if (e.boss && e.dashT > 0) sp *= 3;
    if (e.enraged) sp *= 1.7;
    if (e.fly) e.ft += sp * dt;
    else e.dist += sp * dt;
    g.pos(e);
    if (e.prog >= 1) {
      e.dead = true;
      e.leaked = true;
      if (g.m.guard && Math.random() < g.m.guard) {
        g.emit('skill', { e: e, txt: '抵消' });
      } else {
        g.hp -= e.leak;
        g.emit('leak', e);
      }
    }
  }
  g.towers.forEach(function (t) {
    t.born += dt;
    t.recoil = Math.max(0, t.recoil - dt * 4);
    if (t.frozenT > 0) {
      t.frozenT -= dt;
      return;
    }
    g.towerAct(t, dt);
  });
  g.updateShots(dt);
  g.updateMisc(dt);
  var alive = [];
  for (var j = 0; j < g.enemies.length; j++) {
    var en = g.enemies[j];
    if (!en.dead) alive.push(en);
  }
  g.enemies = alive;
  if (g.hp <= 0) {
    g.hp = 0;
    g.state = 'lose';
    g.emit('lose');
    return;
  }
  if (!g.queue.length && !g.enemies.length) g.waveClear();
};
Game.prototype.bossSkill = function (e, dt) {
  var g = this,
    b = e.boss;
  e.skillT -= dt;
  var id = b.id;
  if (id == 'king' && e.skillT <= 0) {
    e.skillT = 4;
    for (var i = 0; i < 3; i++) g.spawn({ type: 'mini' }, Math.max(0, e.dist - 10 - i * 12), null, e.pi);
    g.emit('skill', { e: e, txt: '召唤小弟!' });
  }
  if (id == 'turtle') {
    if (e.invT > 0) e.invT -= dt;
    if (e.skillT <= 0) {
      e.skillT = 6;
      e.invT = 2;
      g.emit('skill', { e: e, txt: '无敌护盾!' });
    }
  }
  if (id == 'bat') {
    if (e.dashT > 0) e.dashT -= dt;
    if (e.skillT <= 0) {
      e.skillT = 5;
      e.dashT = 0.8;
      g.emit('skill', { e: e, txt: '冲刺!' });
    }
  }
  if (id == 'jelly' && !e.splitDone && e.hp < e.maxHp * 0.5) {
    e.splitDone = true;
    e.hp = e.maxHp * 0.25;
    e.maxHp = e.hp;
    for (var k = 0; k < 2; k++) {
      var c = g.spawn({ boss: b, half: e.hp }, e.dist - 20 - k * 25, null, e.pi);
      c.splitDone = true;
    }
    g.emit('skill', { e: e, txt: '分裂!' });
  }
  if (id == 'frost' && e.skillT <= 0) {
    e.skillT = 7;
    var ts = g.towers
      .slice()
      .sort(function () {
        return Math.random() - 0.5;
      })
      .slice(0, 2);
    ts.forEach(function (t) {
      t.frozenT = 3;
      g.emit('towerFrozen', t);
    });
    g.emit('skill', { e: e, txt: '冰冻吐息!' });
  }
  if (id == 'magma' && !e.enraged && e.hp < e.maxHp * 0.5) {
    e.enraged = true;
    g.emit('skill', { e: e, txt: '狂暴!' });
  }
  if (id == 'ghostking') {
    if (e.invis > 0) e.invis -= dt;
    if (e.skillT <= 0) {
      e.skillT = 5;
      e.dist += 60;
      e.invis = 1.5;
      g.emit('skill', { e: e, txt: '瞬移!' });
    }
  }
  if (id == 'star' && e.skillT <= 0) {
    e.skillT = 6;
    g.enemies.forEach(function (o) {
      if (!o.dead && o !== e && Math.hypot(o.x - e.x, o.y - e.y) < 120) {
        o.shield = (o.shield || 0) + o.maxHp * 0.25;
        o.shieldMax = o.shield;
      }
    });
    for (var m = 0; m < 2; m++) g.spawn({ type: 'mini' }, Math.max(0, e.dist - 15), null, e.pi);
    g.emit('skill', { e: e, txt: '星辉护盾!' });
  }
};
Game.prototype.typeCount = function (type) {
  var n = 0;
  this.towers.forEach(function (t) {
    if (t.type == type) n++;
  });
  return n;
};
// ---------- 战斗：属性 / 机制 ----------
// lvE：有效等级（基础 1-5，融合 6-8，究极 9）；pw：特效强度档位（同 lvE）
Game.prototype.lvE = function (t) {
  var D = CFG.TOWERS[t.type];
  return D.ultimate ? 9 : D.fusion ? 5 + t.lv : t.lv;
};
Game.prototype.has = function (t, k) {
  var D = CFG.TOWERS[t.type];
  return D.fusion == k || (D.ultimate && D.fx2.indexOf(k) >= 0);
};
Game.prototype.partsOf = function (t) {
  var D = CFG.TOWERS[t.type];
  return D.parts || [t.type];
};
Game.prototype.hasPart = function (t, type) {
  return this.partsOf(t).indexOf(type) >= 0;
};
Game.prototype.typeCount = function (type) {
  var n = 0;
  this.towers.forEach(function (t) {
    if (t.type == type) n++;
  });
  return n;
};
/** 卡牌加成递减：叠加越多收益越低，抑制滚雪球 */
function softCap(x) {
  return x <= 1 ? x : 1 + (x - 1) / (1 + CFG.CARD_SOFT * (x - 1));
}
Game.prototype.statsFor = function (t, type) {
  var d = CFG.TOWERS[type],
    g = this,
    L = this.lvE(t),
    br = CFG.TOWERS[t.type].parts ? null : t.branch,
    Lb = Math.min(L, 5);
  var dmg =
      d.dmg *
      Math.pow(2.3, Lb - 1) *
      (L > 5 ? Math.pow(1.6, L - 5) : 1) *
      softCap(g.m.dmg) *
      (d.mech == 'cannon' ? g.m.cannon : 1) *
      (g.m.type[type] || 1) *
      (CFG.TOWERS[t.type].parts ? g.m.fusionDmg : 1),
    rate = d.rate * (1 + 0.1 * (Lb - 1)) * (L > 5 ? 1.1 : 1) * softCap(g.m.rate),
    range = d.range * (CFG.RANGE_K || 1) * g.m.range * (L > 5 ? 1.1 : 1) * (1 + 0.03 * (Lb - 1));
  if (g.typeCount(t.type) >= 4) dmg *= 1.25;
  g.towers.forEach(function (o) {
    if (o === t) return;
    var dc = Math.max(Math.abs(o.c - t.c), Math.abs(o.r - t.r));
    if (!dc) return;
    if (g.hasPart(o, 'pig') && o.branch == 'B' && dc == 1) dmg *= 1.3;
    if (g.hasPart(o, 'sheep') && o.branch == 'B' && dc == 1) rate *= 1.2;
    if (g.hasPart(o, 'deer')) {
      var R = o.branch == 'A' || g.has(o, 'starlight') || CFG.TOWERS[o.type].ultimate ? 2 : 1;
      if (dc <= R) {
        var oL = g.lvE(o),
          k = (0.1 + 0.05 * oL) * (o.branch == 'B' ? 1.6 : 1) * g.m.aura;
        dmg *= 1 + k;
        rate *= 1 + k * 0.5;
      }
    }
  });
  if (br) {
    if (type == 'cat') {
      if (br == 'A') rate *= 1.6;
      else {
        dmg *= 2.2;
        range *= 1.3;
      }
    }
    if (type == 'bunny' && br == 'B') dmg *= 2.5;
    if (type == 'owl') {
      if (br == 'A') rate *= 1.5;
      else dmg *= 2;
    }
  }
  if (g.storm > 0) rate *= 0.6;
  return { dmg: dmg, rate: rate, range: range };
};
Game.prototype.stats4 = function (t) {
  var ps = this.partsOf(t),
    best = null,
    self = this;
  ps.forEach(function (p) {
    var s = self.statsFor(t, p);
    if (!best || s.dmg > best.dmg) best = s;
  });
  return best;
};
Game.prototype.target = function (x, y, range, noFly, excl) {
  var best = null,
    bp = -1;
  for (var i = 0; i < this.enemies.length; i++) {
    var e = this.enemies[i];
    if (!this.targetable(e) || (noFly && e.fly) || (excl && excl.indexOf(e) >= 0)) continue;
    if ((e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) < range * range && e.prog > bp) {
      bp = e.prog;
      best = e;
    }
  }
  return best;
};
Game.prototype.targetHp = function (x, y, range) {
  var best = null,
    bh = -1;
  for (var i = 0; i < this.enemies.length; i++) {
    var e = this.enemies[i];
    if (!this.targetable(e)) continue;
    if ((e.x - x) * (e.x - x) + (e.y - y) * (e.y - y) < range * range && e.hp > bh) {
      bh = e.hp;
      best = e;
    }
  }
  return best;
};
Game.prototype.kb = function (e, d) {
  if (e.dead) return;
  if (e.boss) d *= 0.3;
  if (e.fly) e.ft = Math.max(0, e.ft - d);
  else e.dist = Math.max(0, e.dist - d);
  this.pos(e);
};
Game.prototype.towerAct = function (t, dt) {
  var g = this,
    D = CFG.TOWERS[t.type],
    ps = g.partsOf(t);
  if (!t.cds)
    t.cds = ps.map(function () {
      return Math.random() * 0.5;
    });
  for (var i = 0; i < ps.length; i++) {
    t.cds[i] -= dt;
    if (t.cds[i] > 0) continue;
    t.curPart = i;
    var r = g.act(t, ps[i]);
    if (r) t.cds[i] = r;
  }
  if (D.sig) {
    t.sigT = (t.sigT == null ? 3 : t.sigT) - dt;
    if (t.sigT <= 0) t.sigT = g.signature(t);
  }
};
Game.prototype.shot = function (t, o) {
  var pw = this.lvE(t);
  o.lv = pw;
  o.pw = pw;
  o.br = CFG.TOWERS[t.type].parts ? null : t.branch;
  o.src = t;
  o.hit = o.hit || [];
  o.life = 0;
  o.dead = false;
  this.shots.push(o);
  return o;
};
Game.prototype.act = function (t, type) {
  var g = this,
    d = CFG.TOWERS[type],
    mech = d.mech;
  if (CFG.PASSIVE[mech]) return 0;
  var s = g.statsFor(t, type),
    p = g.tpos(t),
    rp = { x: p.x, y: Math.min(p.y, CFG.GRID_Y + 24) },
    L = g.lvE(t),
    pw = L,
    tg;
  if (mech == 'summon') {
    if (!g.enemies.length) return 0;
    var n = 1 + (L >= 4 ? 1 : 0) + g.m.summonAdd + (t.branch == 'A' ? 1 : 0) + (L > 5 ? 1 : 0);
    for (var k = 0; k < n; k++) {
      var pi = Math.floor(Math.random() * g.paths.length);
      g.minions.push({
        pi: pi,
        dist: g.paths[pi].len - 5 - k * 16,
        dmg: s.dmg * (t.branch == 'B' ? 2 : 1),
        spd: 70,
        life: 8,
        pw: pw,
        src: t,
        boom: t.branch == 'B' || g.has(t, 'plague'),
        plague: g.has(t, 'plague')
      });
    }
    t.recoil = 1;
    g.emit('summon', { t: t, pw: pw });
    return 1 / s.rate;
  }
  tg = mech == 'snipe' ? g.targetHp(rp.x, rp.y, s.range) : g.target(rp.x, rp.y, s.range, mech == 'cannon');
  if (!tg) return 0;
  t.recoil = 1;
  t.aim = Math.atan2(tg.y - p.y, tg.x - p.x);
  if (!d.parts && !CFG.TOWERS[t.type].parts) t.face = tg.x < p.x - 4 ? -1 : 1;
  var M = g.mz ? g.mz(t, type) : { x: p.x, y: p.y - 12 };
  g.emit('fire', { t: t, type: type, pw: pw, mech: mech, mx: M.x, my: M.y });
  if (mech == 'chain') {
    var hit = [tg],
      last = tg,
      jumps = d.jumps + g.m.chainAdd + Math.floor(L / 2) + (t.branch == 'A' ? 4 : 0),
      pts = [
        [M.x, M.y],
        [tg.x, tg.y]
      ],
      sc = g.has(t, 'superconduct');
    g.hurt(tg, s.dmg, { light: true, crit: true, pierceShield: t.branch == 'B' });
    if ((t.branch == 'B' || sc) && !tg.boss) tg.stunT = sc ? 0.5 : 0.3;
    for (var i = 0; i < jumps; i++) {
      var nx = null,
        bd = 95;
      for (var q = 0; q < g.enemies.length; q++) {
        var o = g.enemies[q];
        if (o.dead || o.invis > 0 || hit.indexOf(o) >= 0) continue;
        var dd = Math.hypot(o.x - last.x, o.y - last.y);
        if (dd < bd) {
          bd = dd;
          nx = o;
        }
      }
      if (!nx) break;
      g.hurt(nx, s.dmg * 0.8, { light: true });
      if (sc && !nx.boss) nx.freezeT = 0.4;
      hit.push(nx);
      pts.push([nx.x, nx.y]);
      last = nx;
    }
    g.emit('lightning', { pts: pts, pw: pw, sc: sc });
    return 1 / s.rate;
  }
  if (mech == 'beam') {
    var beams = t.branch == 'A' ? 2 : 1,
      fb = g.has(t, 'frostbeam');
    if (L > 5) beams++;
    for (var bi = 0; bi < beams; bi++) {
      var tgt = bi == 0 ? tg : g.target(rp.x, rp.y, s.range, false, [tg]) || tg,
        ang = Math.atan2(tgt.y - p.y, tgt.x - p.x) + (bi == 2 ? 0.2 : 0),
        ux = Math.cos(ang),
        uy = Math.sin(ang),
        w = 16 + pw * 1.5;
      g.enemies.forEach(function (e) {
        if (!g.targetable(e)) return;
        var vx = e.x - p.x,
          vy = e.y - p.y,
          pr = vx * ux + vy * uy;
        if (pr < 0 || pr > s.range) return;
        if (Math.abs(vx * uy - vy * ux) < w + e.r * 0.5) {
          g.hurt(e, s.dmg, { crit: true });
          if (t.branch == 'B') {
            e.burnT = 3;
            e.burnDps = Math.max(e.burnDps, s.dmg * 0.5);
          }
          if (fb) {
            e.slowT = 1.5;
            e.slowF = Math.min(e.slowF, 0.5);
            if (!e.boss && Math.random() < 0.3) e.freezeT = 0.6;
          }
        }
      });
      g.emit('beam', {
        x: M.x,
        y: M.y,
        x2: p.x + ux * s.range,
        y2: p.y + uy * s.range,
        lv: pw,
        pw: pw,
        col: fb ? 'ice' : null
      });
    }
    return 1 / s.rate;
  }
  if (mech == 'snipe') {
    var hk = g.has(t, 'hawkeye'),
      dm = s.dmg * (tg.boss ? 1.5 : 1);
    if (hk) {
      var ang2 = Math.atan2(tg.y - p.y, tg.x - p.x),
        ux2 = Math.cos(ang2),
        uy2 = Math.sin(ang2);
      g.enemies.forEach(function (e) {
        if (!g.targetable(e)) return;
        var vx = e.x - p.x,
          vy = e.y - p.y,
          pr = vx * ux2 + vy * uy2;
        if (pr < 0) return;
        if (Math.abs(vx * uy2 - vy * ux2) < 14 + e.r * 0.5)
          g.hurt(e, dm, { crit: true, extraCrit: 0.25, pierceArmor: t.branch == 'B' });
      });
    } else g.hurt(tg, dm, { crit: true, extraCrit: 0.25, pierceArmor: t.branch == 'B' });
    g.emit('snipe', { x: M.x, y: M.y, x2: tg.x, y2: tg.y, pw: pw, e: tg, pierce: hk });
    return 1 / s.rate;
  }
  if (mech == 'pull') {
    var tgs = [tg];
    if (t.branch == 'A' || L > 5) {
      var t2 = g.target(rp.x, rp.y, s.range, false, [tg]);
      if (t2) tgs.push(t2);
    }
    tgs.forEach(function (e) {
      g.hurt(e, s.dmg, { crit: true });
      g.kb(e, (25 + 6 * Math.min(L, 8)) * (t.branch == 'B' ? 1.6 : 1) * g.m.kb);
      if (t.branch == 'B') {
        e.slowT = 1.2;
        e.slowF = Math.min(e.slowF, 0.6);
      }
      g.emit('magnet', { x: M.x, y: M.y, e: e, pw: pw });
    });
    return 1 / s.rate;
  }
  if (mech == 'hole') {
    var st = g.has(t, 'starlight') || CFG.TOWERS[t.type].ultimate;
    g.holes.push({
      x: tg.x,
      y: tg.y,
      r: (40 + 4 * Math.min(L, 8)) * (t.branch == 'A' ? 1.3 : 1) * (st ? 1.4 : 1) * g.m.holeR,
      t: 1.8 * (t.branch == 'B' ? 1.6 : 1) * (st ? 1.5 : 1),
      max: 0,
      dps: s.dmg * 1.5,
      pw: pw
    });
    var H = g.holes[g.holes.length - 1];
    H.max = H.t;
    g.emit('hole', H);
    return 1 / s.rate;
  }
  if (mech == 'missile') {
    var nm = 2 + Math.floor(Math.min(L, 8) / 2) + g.m.missileAdd + (t.branch == 'A' ? 2 : 0),
      rf = g.has(t, 'rocketfire');
    for (var m = 0; m < nm; m++) {
      var e3 = g.enemies[Math.floor(Math.random() * g.enemies.length)];
      if (!g.targetable(e3)) e3 = tg;
      var a0 = -Math.PI / 2 + (m - (nm - 1) / 2) * 0.5;
      g.shot(t, {
        mech: 'missile',
        x: M.x,
        y: M.y,
        vx: Math.cos(a0) * 160,
        vy: Math.sin(a0) * 160,
        t: e3,
        dmg: s.dmg * (t.branch == 'B' ? 1.8 : 1),
        spd: 300,
        burn: rf,
        splash: (26 + L * 2) * (rf ? 1.4 : 1) * (t.branch == 'B' ? 1.3 : 1)
      });
    }
    return 1 / s.rate;
  }
  if (mech == 'bounce') {
    g.shot(t, {
      mech: 'spike',
      x: M.x,
      y: M.y,
      t: tg,
      dmg: s.dmg,
      spd: 380,
      bounces: 3 + Math.floor(L / 2) + (t.branch == 'A' ? 2 : 0),
      kbv: (10 + 3 * Math.min(L, 8)) * (t.branch == 'B' ? 2 : 1) * g.m.kb,
      mag: g.has(t, 'magspike')
    });
    return 1 / s.rate;
  }
  if (mech == 'poison') {
    g.shot(t, {
      mech: 'poison',
      x: M.x,
      y: M.y,
      sx: M.x,
      sy: M.y,
      t: tg,
      tx: tg.x,
      ty: tg.y,
      dmg: s.dmg,
      spd: 340,
      stacks: 1 + (t.branch == 'A' ? 1 : 0) + (L > 5 ? 1 : 0),
      splashP: t.branch == 'B' ? 40 : 0
    });
    return 1 / s.rate;
  }
  var n2 =
      mech == 'arrow' || mech == 'fire'
        ? 1 + g.m.multi + (type == 'cat' && t.branch == 'A' ? 1 : 0) + (g.has(t, 'hawkeye') && type == 'cat' ? 2 : 0)
        : 1,
    cands = [tg];
  if (n2 > 1)
    g.enemies.forEach(function (e) {
      if (g.targetable(e) && e !== tg && Math.hypot(e.x - rp.x, e.y - rp.y) < s.range && cands.length < n2)
        cands.push(e);
    });
  var crit = type == 'cat' && t.branch == 'B' ? 0.2 : 0;
  for (var k2 = 0; k2 < n2; k2++) {
    var e2 = cands[k2 % cands.length];
    g.shot(t, {
      mech: mech,
      x: M.x,
      y: M.y,
      sx: M.x,
      sy: M.y,
      t: e2,
      tx: e2.x,
      ty: e2.y,
      dmg: s.dmg,
      spd: mech == 'cannon' ? 260 : 460,
      pierce: mech == 'arrow' ? g.m.pierce + (L >= 5 ? 1 : 0) : 0,
      crit: crit,
      inferno: g.has(t, 'inferno'),
      sc: g.has(t, 'superconduct')
    });
  }
  return 1 / s.rate;
};
// 究极技能
Game.prototype.signature = function (t) {
  var g = this,
    D = CFG.TOWERS[t.type],
    s = g.statsFor(t, D.parts[0]),
    alive = g.enemies.filter(function (e) {
      return g.targetable(e);
    });
  if (!alive.length) return 1;
  var pick = function () {
    return alive[Math.floor(Math.random() * alive.length)];
  };
  if (D.sig == 'cosmos') {
    var c = pick();
    g.holes.push({ x: c.x, y: c.y, r: 110, t: 3, max: 3, dps: s.dmg * 4, pw: 10, ult: true });
    g.enemies.forEach(function (e) {
      if (!e.boss) e.freezeT = Math.max(e.freezeT, 1);
    });
    g.emit('ultSkill', { t: t, k: 'cosmos', x: c.x, y: c.y });
    return 8;
  }
  if (D.sig == 'meteor') {
    var pts = [];
    for (var i = 0; i < 6; i++) {
      var e = pick();
      pts.push([e.x, e.y]);
      g.explode(e.x, e.y, 55, s.dmg * 3, 0, true);
      g.enemies.forEach(function (o) {
        if (Math.hypot(o.x - e.x, o.y - e.y) < 55) {
          o.burnT = 4;
          o.burnDps = Math.max(o.burnDps, s.dmg * 1.6);
        }
      });
    }
    g.emit('ultSkill', { t: t, k: 'meteor', pts: pts });
    return 7;
  }
  if (D.sig == 'storm') {
    var ps = [];
    for (var j = 0; j < 6; j++) {
      var e2 = pick();
      g.hurt(e2, s.dmg * 1.2, { light: true, crit: true });
      if (!e2.boss) e2.stunT = 0.3;
      ps.push(e2);
    }
    g.emit('thunder', ps);
    g.emit('ultSkill', { t: t, k: 'storm', quiet: true });
    return 1;
  }
  if (D.sig == 'gaia') {
    for (var k = 0; k < 4; k++) {
      var pi = k % g.paths.length;
      g.minions.push({
        pi: pi,
        dist: g.paths[pi].len - 5 - k * 14,
        dmg: s.dmg * 2,
        spd: 80,
        life: 8,
        pw: 10,
        src: t,
        boom: true,
        plague: true
      });
    }
    g.emit('ultSkill', { t: t, k: 'gaia' });
    return 6;
  }
  if (D.sig == 'volley') {
    var p = g.tpos(t);
    for (var v = 0; v < 16; v++) {
      var e4 = pick();
      g.shot(t, {
        mech: 'arrow',
        x: p.x + (Math.random() - 0.5) * 30,
        y: p.y - 20,
        sx: p.x,
        sy: p.y,
        t: e4,
        tx: e4.x,
        ty: e4.y,
        dmg: s.dmg * 1.5,
        spd: 520,
        pierce: 1,
        crit: 0.2,
        tox: true
      });
    }
    g.emit('ultSkill', { t: t, k: 'volley' });
    return 6;
  }
  if (D.sig == 'verdant') {
    g.hp = Math.min(g.maxHp, g.hp + 4);
    var pV = g.tpos(t);
    g.enemies.forEach(function (e) {
      e.hp -= s.dmg * 1.8;
      e.slowT = Math.max(e.slowT || 0, 1.2);
      e.slow = Math.max(e.slow || 0, 0.45);
      if (e.hp <= 0) g.kill(e, t);
    });
    g.emit('ultSkill', { t: t, k: 'verdant' });
    g.emit('skill', { e: { x: pV.x, y: pV.y, r: 40 }, txt: '苍翠绽放' });
    return 7;
  }
  return 5;
};
Game.prototype.updateMisc = function (dt) {
  var g = this;
  // 毒
  g.enemies.forEach(function (e) {
    if (e.psnT > 0 && !e.dead) {
      e.psnT -= dt;
      g.hurt(e, e.psnDps * e.psn * dt * g.m.toxic, { dot: true });
      if (e.psnT <= 0) e.psn = 0;
    }
    if (e.holdT > 0) e.holdT -= dt;
  });
  // 黑洞
  g.holes = g.holes.filter(function (H) {
    H.t -= dt;
    g.enemies.forEach(function (e) {
      if (e.dead) return;
      var d = Math.hypot(e.x - H.x, e.y - H.y);
      if (d < H.r + e.r) {
        if (!e.boss) e.holdT = 0.12;
        else {
          e.slowT = 0.3;
          e.slowF = Math.min(e.slowF, 0.5);
        }
        g.hurt(e, H.dps * dt, { dot: true });
      }
    });
    return H.t > 0;
  });
  // 小鸡
  g.minions = g.minions.filter(function (m) {
    m.life -= dt;
    m.dist -= m.spd * dt;
    var P = g.paths[m.pi];
    if (m.dist <= 0 || m.life <= 0) return false;
    var pp = P.at(m.dist);
    m.x = pp.x;
    m.y = pp.y;
    for (var i = 0; i < g.enemies.length; i++) {
      var e = g.enemies[i];
      if (e.dead || e.fly || e.pi !== m.pi) continue;
      if (Math.hypot(e.x - m.x, e.y - m.y) < e.r + 9) {
        g.hurt(e, m.dmg, { crit: true });
        g.kb(e, 8);
        if (m.boom) g.explode(m.x, m.y, 34, m.dmg * 0.6, 0, false);
        if (m.plague)
          g.enemies.forEach(function (o) {
            if (!o.dead && Math.hypot(o.x - m.x, o.y - m.y) < 45) {
              o.psn = Math.min(g.psnCap(), (o.psn || 0) + 3);
              o.psnT = 4;
              o.psnDps = Math.max(o.psnDps || 0, m.dmg * 0.15);
            }
          });
        g.emit('minionPop', m);
        return false;
      }
    }
    return true;
  });
  // 治愈
  g.towers.forEach(function (t) {
    if (!g.hasPart(t, 'sheep') || g.state != 'wave') return;
    var L = g.lvE(t);
    t.healT = (t.healT || 0) + dt;
    var per = 12 / (1 + 0.25 * (Math.min(L, 8) - 1));
    if (t.healT >= per) {
      t.healT = 0;
      var v = (t.branch == 'A' ? 2 : 1) * (L > 5 ? 2 : 1);
      if (g.hp < g.maxHp) {
        g.hp = Math.min(g.maxHp, g.hp + v);
        g.emit('towerHeal', { t: t, v: v });
      }
    }
  });
};
Game.prototype.psnCap = function () {
  return 5 + this.m.psnCap;
};
Game.prototype.updateShots = function (dt) {
  var g = this;
  for (var i = 0; i < g.shots.length; i++) {
    var b = g.shots[i];
    b.life += dt;
    if (b.mech == 'cannon' || b.mech == 'bomblet') {
      var dx = b.tx - b.sx,
        dy = b.ty - b.sy,
        T = Math.max(0.35, Math.hypot(dx, dy) / b.spd),
        k = b.life / T;
      b.x = b.sx + dx * k;
      b.y = b.sy + dy * k - Math.sin(Math.PI * Math.min(k, 1)) * (b.mech == 'bomblet' ? 30 : 60);
      b.k = k;
      if (k >= 1) {
        b.dead = true;
        var R =
          CFG.TOWERS.bear.splash *
          g.m.splash *
          (g.build('boom') ? 1.4 : 1) *
          (1 + b.lv * 0.06) *
          (b.br == 'B' ? 1.4 : 1) *
          (b.mech == 'bomblet' ? 0.6 : 1) *
          (b.inferno ? 1.3 : 1);
        g.explode(b.tx, b.ty, R, b.dmg * (b.mech == 'bomblet' ? 0.5 : 1), b.br == 'B' ? 0.8 : 0, b.inferno, b.pw);
        if (b.inferno)
          g.enemies.forEach(function (o) {
            if (!o.dead && Math.hypot(o.x - b.tx, o.y - b.ty) < R) {
              o.burnT = 3;
              o.burnDps = Math.max(o.burnDps, b.dmg * 0.5 * g.m.burn);
            }
          });
        if ((b.br == 'A' || b.pw > 5) && b.mech == 'cannon')
          for (var q = 0; q < 3; q++) {
            var a = q * 2.1 + Math.random();
            g.shots.push({
              mech: 'bomblet',
              x: b.tx,
              y: b.ty,
              sx: b.tx,
              sy: b.ty,
              tx: b.tx + Math.cos(a) * 45,
              ty: b.ty + Math.sin(a) * 45,
              dmg: b.dmg,
              spd: 200,
              lv: b.lv,
              pw: b.pw,
              life: 0,
              hit: [],
              br: null,
              inferno: b.inferno
            });
          }
      }
      continue;
    }
    if (b.mech == 'missile') {
      if (b.t.dead || !g.targetable(b.t)) {
        var nt = g.target(b.x, b.y, 300, false);
        if (!nt) {
          b.dead = true;
          continue;
        }
        b.t = nt;
      }
      var mx = b.t.x - b.x,
        my = b.t.y - b.y,
        ml = Math.hypot(mx, my);
      b.vx += ((mx / ml) * b.spd - b.vx) * Math.min(1, dt * 5);
      b.vy += ((my / ml) * b.spd - b.vy) * Math.min(1, dt * 5);
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.ang = Math.atan2(b.vy, b.vx);
      if (ml < b.t.r + 5 || b.life > 3) {
        b.dead = true;
        g.explode(b.x, b.y, b.splash, b.dmg, 0, true, b.pw);
        if (b.burn)
          g.enemies.forEach(function (o) {
            if (!o.dead && Math.hypot(o.x - b.x, o.y - b.y) < b.splash) {
              o.burnT = 3;
              o.burnDps = Math.max(o.burnDps, b.dmg * 0.6 * g.m.burn);
            }
          });
      }
      continue;
    }
    if (b.t.dead || !g.targetable(b.t)) {
      var n = g.target(b.x, b.y, 140, false, b.hit);
      if (!n) {
        b.dead = true;
        continue;
      }
      b.t = n;
    }
    var ddx = b.t.x - b.x,
      ddy = b.t.y - b.y,
      l = Math.hypot(ddx, ddy);
    b.ang = Math.atan2(ddy, ddx);
    if (l < b.t.r + 4) {
      g.onHit(b, b.t);
      b.hit.push(b.t);
      if (b.mech == 'spike') {
        if (b.bounces-- > 0) {
          var nb = null,
            bd = 130;
          g.enemies.forEach(function (o) {
            if (!g.targetable(o) || b.hit.indexOf(o) >= 0) return;
            var dd = Math.hypot(o.x - b.x, o.y - b.y);
            if (dd < bd) {
              bd = dd;
              nb = o;
            }
          });
          if (nb) {
            b.t = nb;
            if (b.hit.length > 4) b.hit.shift();
          } else b.dead = true;
        } else b.dead = true;
        continue;
      }
      if (b.pierce > 0) {
        b.pierce--;
        var n3 = g.target(b.x, b.y, 160, false, b.hit);
        if (n3) b.t = n3;
        else b.dead = true;
      } else b.dead = true;
      continue;
    }
    var mv = b.spd * dt;
    b.x += (ddx / l) * Math.min(mv, l);
    b.y += (ddy / l) * Math.min(mv, l);
    if (b.life > 3) b.dead = true;
  }
  g.shots = g.shots.filter(function (b) {
    return !b.dead;
  });
};
Game.prototype.onHit = function (b, e) {
  var g = this;
  if (b.mech == 'frost') {
    g.hurt(e, b.dmg, { crit: true });
    var sf = Math.max(0.15, 1 - CFG.TOWERS.penguin.slow - g.m.slowAdd - b.lv * 0.03 - (b.br == 'A' ? 0.15 : 0)),
      R = (28 + b.lv * 3) * (b.br == 'A' ? 2 : 1);
    g.enemies.forEach(function (o) {
      if (!o.dead && Math.hypot(o.x - e.x, o.y - e.y) < R) {
        o.slowT = 1.6;
        o.slowF = Math.min(o.slowF < 1 && o.slowT > 0 ? o.slowF : 1, sf);
        if (o !== e) g.hurt(o, b.dmg * 0.5, {});
        if (!o.boss && Math.random() < g.m.freeze + (b.br == 'B' ? 0.3 : 0)) o.freezeT = 1;
      }
    });
    if (b.sc) {
      var pts = [[e.x, e.y]],
        n = 0;
      g.enemies.forEach(function (o) {
        if (n < 2 && o !== e && !o.dead && Math.hypot(o.x - e.x, o.y - e.y) < 90) {
          n++;
          g.hurt(o, b.dmg * 0.5, { light: true });
          pts.push([o.x, o.y]);
        }
      });
      if (pts.length > 1) g.emit('lightning', { pts: pts, pw: b.pw, sc: true });
    }
    g.emit('frostHit', { e: e, pw: b.pw, R: R });
    return;
  }
  if (b.mech == 'fire') {
    g.hurt(e, b.dmg, { crit: true });
    e.burnT = 3;
    e.burnDps = Math.max(e.burnDps * 0.5, b.dmg * 0.9 * g.m.burn * (b.br == 'A' ? 2.5 : 1));
    g.emit('fireHit', { e: e, pw: b.pw });
    if (b.br == 'B' || b.pw > 5) g.explode(e.x, e.y, 40, b.dmg * 0.6, 0, true, b.pw);
    return;
  }
  if (b.mech == 'poison') {
    var tgts = [e];
    if (b.splashP)
      g.enemies.forEach(function (o) {
        if (o !== e && !o.dead && Math.hypot(o.x - e.x, o.y - e.y) < b.splashP) tgts.push(o);
      });
    tgts.forEach(function (o) {
      g.hurt(o, b.dmg, { crit: o === e });
      o.psn = Math.min(g.psnCap(), (o.psn || 0) + b.stacks);
      o.psnT = 4;
      o.psnDps = Math.max(o.psnDps || 0, b.dmg * 0.5);
    });
    g.emit('poisonHit', { e: e, pw: b.pw, r: b.splashP });
    return;
  }
  if (b.mech == 'spike') {
    g.hurt(e, b.dmg, { crit: true });
    g.kb(e, b.kbv * (b.mag ? 2 : 1));
    g.emit('spikeHit', { e: e, pw: b.pw, mag: b.mag });
    return;
  }
  g.hurt(e, b.dmg, { crit: true, extraCrit: b.crit });
  if (b.tox) {
    e.psn = Math.min(g.psnCap(), (e.psn || 0) + 2);
    e.psnT = 4;
    e.psnDps = Math.max(e.psnDps || 0, b.dmg * 0.3);
    e.burnT = 3;
    e.burnDps = Math.max(e.burnDps, b.dmg * 0.4);
  }
  g.emit('hit', { e: e, pw: b.pw, mech: b.mech });
};
Game.prototype.explode = function (x, y, R, dmg, stun, fire, pw) {
  var g = this;
  g.emit('explode', { x: x, y: y, r: R, fire: fire, pw: pw || 1 });
  g.enemies.forEach(function (e) {
    if (e.dead || (e.fly && !fire)) return;
    var d = Math.hypot(e.x - x, e.y - y);
    if (d < R + e.r) {
      g.hurt(e, dmg * (d < R * 0.5 ? 1 : 0.7), { cannon: !fire, crit: true });
      var st = Math.max(g.m.stun, stun || 0);
      if (st && !e.boss) e.stunT = st;
    }
  });
};
Game.prototype.hurt = function (e, d, o) {
  var g = this;
  if (e.dead) return;
  var crit = false;
  if (e.boss && e.invT > 0) {
    if (!o.dot) g.emit('dmg', { e: e, v: 0, txt: '免疫' });
    return;
  }
  if (o.crit && Math.random() < g.m.crit + (o.extraCrit || 0)) {
    crit = true;
    d *= 2 * g.m.critDmg * (g.build('crit') ? 1.5 : 1);
  }
  if (o.light && g.build('ice') && e.slowT > 0) d *= 1.6;
  if (e.boss) d *= g.m.bossDmg;
  if (e.elite) d *= g.m.eliteDmg;
  if (g.fxOn.toxfire && e.psn > 0 && e.burnT > 0) d *= 1.5;
  if (g.fxOn.naturesong && ((e.slowT || 0) > 0 || (e.slow || 0) > 0)) d *= 1.25;
  if (g.m.natureAmp && ((e.slowT || 0) > 0 || (e.slow || 0) > 0)) d *= 1 + g.m.natureAmp;
  if (g.fxOn.thornmail && !e.fly) d *= 1.12;
  if (g.m.thorn && !e.fly) d *= 1 + g.m.thorn;
  var ar = Math.max(0, (e.armor || 0) - (e.psn || 0) * g.m.shred);
  if (ar && !o.dot && !o.pierceArmor) d = Math.max(d * 0.25, d - ar);
  if (e.shield > 0 && !o.pierceShield) {
    var sd = o.cannon ? d * 2 : d;
    if (sd >= e.shield) {
      d = (sd - e.shield) / (o.cannon ? 2 : 1);
      e.shield = 0;
      g.emit('shieldBreak', e);
    } else {
      e.shield -= sd;
      d = 0;
    }
  }
  e.hp -= d;
  g.stats.dmg += d;
  if (!o.dot) {
    e.hitT = 0.12;
    g.emit('dmg', { e: e, v: d, crit: crit });
  }
  if (e.hp <= 0) g.kill(e);
};
Game.prototype.kill = function (e) {
  var g = this;
  e.dead = true;
  g.stats.kills++;
  if (e.boss) {
    g.stats.bosses++;
    if (g.level.mode == 'endless') g.bossDrop();
  }
  if (e.elite) g.stats.elites++;
  if (!g.noMeta) Save.task('kill');
  var gold = Math.round(e.gold * g.m.bounty * (g.build('eco') ? 1.5 : 1));
  g.gold += gold;
  g.emit('die', { e: e, gold: gold });
  if (e.type == 'splitter')
    for (var i = 0; i < 2; i++) g.spawn({ type: 'mini' }, Math.max(0, e.dist - 6 * i), e.fly ? e : null, e.pi);
  if (e.burnT > 0 && (g.m.spread || g.m.lava)) {
    var bd = e.burnDps;
    g.enemies.forEach(function (o) {
      if (!o.dead && o !== e && Math.hypot(o.x - e.x, o.y - e.y) < 55) {
        if (g.m.spread) {
          o.burnT = 3;
          o.burnDps = Math.max(o.burnDps, bd);
        }
        if (g.m.lava) g.hurt(o, bd * 2.5, {});
      }
    });
    if (g.m.lava) g.emit('explode', { x: e.x, y: e.y, r: 55, fire: true });
  }
};
// 英雄主动技能
Game.prototype.heroReady = function () {
  return this.heroId && this.heroCdT <= 0 && this.state == 'wave';
};
Game.prototype.useHero = function () {
  if (!this.heroReady()) return false;
  var g = this,
    h = this.heroId,
    H = CFG.HEROES[h];
  g.heroCdT = H.cd * g.m.heroCd;
  var power = 8 * Math.pow(1.19, Math.min(g.wave, 60)) * g.m.dmg * g.level.diff;
  if (h == 'captain') {
    for (var i = 0; i < 8; i++) {
      var e = g.enemies[Math.floor(Math.random() * g.enemies.length)];
      if (e) g.explode(e.x + (Math.random() - 0.5) * 20, e.y, 45, power, 0, true);
    }
  }
  if (h == 'princess') {
    g.enemies.forEach(function (e) {
      if (e.boss) ((e.slowT = 3), (e.slowF = 0.4));
      else e.freezeT = 3;
    });
  }
  if (h == 'fortune') {
    var v = 50 + g.wave * 12;
    g.gold += v;
    g.emit('coinRain', v);
  }
  if (h == 'thunder') {
    var pts = [];
    for (var k = 0; k < 12; k++) {
      var t = g.enemies[Math.floor(Math.random() * g.enemies.length)];
      if (t && !t.dead) {
        g.hurt(t, power * 0.8, { light: true });
        pts.push(t);
      }
    }
    g.emit('thunder', pts);
  }
  g.emit('heroSkill', h);
  return true;
};
Game.prototype.waveClear = function () {
  var g = this,
    bonus = Math.round((16 + g.wave * 3 + g.m.waveGold) * (g.mods.rich ? 1.5 : 1)),
    pig = 0;
  g.towers.forEach(function (t) {
    var L = g.lvE(t);
    if (g.hasPart(t, 'pig')) {
      var v = Math.round(
        8 *
          Math.pow(1.9, Math.min(L, 5) - 1) *
          (L > 5 ? Math.pow(1.4, L - 5) : 1) *
          (t.branch == 'A' ? 2.5 : 1) *
          (g.has(t, 'bliss') ? 1.5 : 1) *
          (g.m.pigMul || 1)
      );
      pig += v;
      g.emit('pigGold', { t: t, v: v });
    }
    if (g.hasPart(t, 'sheep')) {
      var hv = Math.floor(L / 2) + (g.has(t, 'bliss') ? 2 : 0) + (g.has(t, 'naturesong') ? 2 : 0);
      g.hp = Math.min(g.maxHp, g.hp + hv);
    }
    if (CFG.TOWERS[t.type].sig == 'gaia') {
      g.hp = g.maxHp;
      pig += 100 + g.wave * 10;
    }
  });
  var interest = Math.floor(g.gold * Math.min(g.m.interest, 0.18));
  g.gold += bonus + pig + interest;
  if (!g.noMeta) Save.task('wave');
  g.emit('waveClear', { w: g.wave, bonus: bonus + pig + interest });
  if (g.wave >= g.level.waves) {
    g.state = 'win';
    g.emit('win');
    return;
  }
  // 无尽：每 15 波出现一次「法则抉择」——独特构筑分支
  if (g.level.mode == 'endless' && g.wave > 0 && g.wave % 15 == 0) {
    g.state = 'pick';
    g.choices = rollEndlessLaws(g);
    g.endlessLaw = true;
    return;
  }
  g.state = 'pick';
  g.choices = rollUpgrades(g);
  g.endlessLaw = false;
};
Game.prototype.pick = function (u) {
  u.apply(this);
  this.endlessLaw = false;
  this.taken[u.id] = (this.taken[u.id] || 0) + 1;
  if (u.tag) {
    this.tags[u.tag] = (this.tags[u.tag] || 0) + 1;
    if (this.tags[u.tag] == 3) {
      if (u.tag == 'toxic') {
        this.m.toxic *= 2;
        this.m.psnCap += 3;
      }
      if (u.tag == 'ctrl') {
        this.m.kb *= 1.5;
        this.m.holeR *= 1.5;
      }
      if (u.tag == 'nature') {
        this.m.waveHeal = (this.m.waveHeal || 0) + 2;
        this.m.natureAmp = (this.m.natureAmp || 0) + 0.15;
      }
      this.emit('build', u.tag);
    }
  }
  this.state = 'prep';
  this.adReroll = true;
};
Game.prototype.reroll = function (how) {
  if (how == 'free') {
    if (this.freeRerolls <= 0) return false;
    this.freeRerolls--;
  } else if (how == 'gem') {
    if (Save.d.gems < CFG.REROLL_GEMS) return false;
    Save.d.gems -= CFG.REROLL_GEMS;
    Save.save();
  } else this.adReroll = false;
  this.choices = rollUpgrades(this);
  return true;
};
Game.prototype.revive = function () {
  this.revived = true;
  this.hp = Math.ceil(this.maxHp * 0.6);
  var g = this;
  this.enemies.forEach(function (e) {
    if (e.prog > 0.5 && !e.boss) {
      e.dead = true;
      g.emit('die', { e: e, gold: 0 });
    }
  });
  this.enemies = this.enemies.filter(function (e) {
    return !e.dead;
  });
  this.state = 'wave';
};
Game.prototype.stars = function () {
  if (this.state != 'win') return 0;
  var r = this.hp / this.maxHp;
  return r >= 0.8 ? 3 : r >= 0.4 ? 2 : 1;
};
Game.prototype.rewards = function () {
  var L = this.level,
    st = this.stars(),
    id = L.id,
    prev = Save.d.stars[id] || 0,
    first = st > prev,
    c = this.wave * 5 + (first ? (st - prev) * 20 : 0) + (st ? 20 : 0),
    gems = 0;
  if (L.mode) c = this.wave * 6;
  // 首通：每星给钻石；普通关也有，精英更高
  if (first) {
    var per = L.elite ? 15 : 8 + (L.c || 1) * 2;
    gems = (st - prev) * per;
    if (prev == 0 && st > 0) gems += 10 + (L.c || 0) * 5; // 首次通关额外
  }
  if (L.mode == 'endless') gems += Math.floor(this.wave / 5) * 5;
  return { candy: Math.round(c * this.m.reward), gems: gems, stars: st, first: first };
};


// ---- src/ui/art.js ----
/**
 * 软萌大作战 V1.0
 * 美术：Blender 预渲染精灵（assets/）+ Canvas 矢量兜底
 *
 * © 2026 <著作权人>
 */
var Art = {
  pages: [],
  ready: false,
  load: function (cb) {
    var self = this;
    if (typeof ATLAS == 'undefined' || typeof Image == 'undefined') {
      this.ready = true;
      cb && cb();
      return;
    }
    var left = ATLAS.pages;
    for (var i = 0; i < ATLAS.pages; i++) {
      (function (i) {
        var im = new Image();
        im.onload = im.onerror = function () {
          if (typeof Boot != 'undefined') Boot.set(0.85 + 0.15 * (1 - (left - 1) / ATLAS.pages), '准备画面');
          if (--left == 0) {
            self.ready = true;
            cb && cb();
          }
        };
        im.src =
          ((typeof PLATFORM_CFG != 'undefined' && PLATFORM_CFG.remoteArt) ||
            (Art.pageBase && Art.pageBase[i]) ||
            Art.base ||
            'assets/') +
          'atlas_' +
          i +
          '.png';
        self.pages[i] = im;
      })(i);
    }
  },
  get: function (n) {
    return typeof ATLAS != 'undefined' && ATLAS.frames[n] ? ATLAS.frames[n] : null;
  },
  // 把精灵按比例放进 (x,y,w,h) 盒子，底部居中
  // 放大显示时自动换用高清 U: 帧（按实际设备像素判断）
  pick: function (n, w) {
    var f = this.get(n);
    if (!f) return null;
    var V = (typeof App != 'undefined' && App.view) || { scale: 1, dpr: 1 },
      px = w * V.scale * V.dpr;
    if (px > f[3] * 1.15) {
      var u = this.get('U:' + n);
      if (u) return u;
    }
    return f;
  },
  draw: function (c, n, x, y, w, h) {
    var f0 = this.get(n);
    if (!f0) return false;
    var f = this.pick(n, Math.min(w, (h * f0[3]) / f0[4]));
    if (!f) return false;
    var k = Math.min(w / f[3], h / f[4]),
      dw = f[3] * k,
      dh = f[4] * k;
    c.drawImage(this.pages[f[0]], f[1], f[2], f[3], f[4], x + (w - dw) / 2, y + h - dh, dw, dh);
    return true;
  },
  // 以底部中心为锚点、按宽度绘制
  drawAt: function (c, n, x, y, w) {
    var f = this.pick(n, w);
    if (!f) return false;
    var h = (w * f[4]) / f[3];
    c.drawImage(this.pages[f[0]], f[1], f[2], f[3], f[4], x - w / 2, y - h, w, h);
    return true;
  }
};
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function shade(hex, k) {
  var n = parseInt(hex.slice(1), 16),
    r = n >> 16,
    g = (n >> 8) & 255,
    b = n & 255;
  function f(v) {
    return Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))));
  }
  return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
}
// ---- 矢量兜底：萌系脸 ----
Art.face = function (c, x, y, s, blink, mood) {
  c.fillStyle = '#2b1b17';
  var eh = blink ? 1.2 * s : 5 * s;
  [-1, 1].forEach(function (k) {
    c.beginPath();
    c.ellipse(x + k * 7 * s, y, 3.6 * s, eh, 0, 0, 7);
    c.fill();
  });
  if (!blink) {
    // iris tint
    c.fillStyle = mood == 'attack' ? '#4a2a18' : '#3a2218';
    [-1, 1].forEach(function (k) {
      c.beginPath();
      c.ellipse(x + k * 7 * s, y + 0.4 * s, 2.2 * s, eh * 0.72, 0, 0, 7);
      c.fill();
    });
    c.fillStyle = '#fff';
    [-1, 1].forEach(function (k) {
      c.beginPath();
      c.arc(x + k * 7 * s - 1.2 * s, y - 2 * s, 1.5 * s, 0, 7);
      c.fill();
      c.beginPath();
      c.arc(x + k * 7 * s + 1.1 * s, y + 1.2 * s, 0.7 * s, 0, 7);
      c.fill();
    });
    if (mood == 'attack') {
      c.strokeStyle = '#2b1b17';
      c.lineWidth = 1.4 * s;
      [-1, 1].forEach(function (k) {
        c.beginPath();
        c.moveTo(x + k * 3 * s, y - 7 * s);
        c.lineTo(x + k * 10 * s, y - 9.5 * s);
        c.stroke();
      });
    }
  }
  c.fillStyle = 'rgba(255,120,150,.6)';
  [-1, 1].forEach(function (k) {
    c.beginPath();
    c.ellipse(x + k * 12 * s, y + 5 * s, 3.8 * s, 2.3 * s, 0, 0, 7);
    c.fill();
  });
  c.strokeStyle = '#2b1b17';
  c.lineWidth = 1.3 * s;
  c.beginPath();
  if (mood == 'hurt') {
    c.arc(x, y + 8 * s, 2.5 * s, Math.PI, 0);
  } else if (mood == 'attack') {
    c.ellipse(x, y + 6 * s, 3.2 * s, 2.4 * s, 0, 0, Math.PI);
  } else {
    c.arc(x - 2 * s, y + 4 * s, 2 * s, 0, Math.PI);
    c.moveTo(x + 4 * s, y + 4 * s);
    c.arc(x + 2 * s, y + 4 * s, 2 * s, 0, Math.PI);
  }
  c.stroke();
};
Art.vecTower = function (c, type, lv, x, y, s) {
  var d = CFG.TOWERS[type];
  c.save();
  c.translate(x, y);
  c.fillStyle = d.color;
  c.strokeStyle = shade(d.dark, -0.3);
  c.lineWidth = 2;
  if (type == 'cat' || type == 'fox') {
    [-1, 1].forEach(function (k) {
      c.beginPath();
      c.moveTo(k * 14 * s, -12 * s);
      c.lineTo(k * 16 * s, -28 * s);
      c.lineTo(k * 4 * s, -18 * s);
      c.closePath();
      c.fill();
      c.stroke();
    });
  }
  if (type == 'bear' || type == 'pig') {
    [-1, 1].forEach(function (k) {
      c.beginPath();
      c.arc(k * 13 * s, -16 * s, 6 * s, 0, 7);
      c.fill();
      c.stroke();
    });
  }
  if (type == 'bunny') {
    [-1, 1].forEach(function (k) {
      c.beginPath();
      c.ellipse(k * 7 * s, -28 * s, 4.5 * s, 13 * s, k * 0.15, 0, 7);
      c.fill();
      c.stroke();
    });
  }
  var gr = c.createRadialGradient(-6 * s, -8 * s, 2, 0, 0, 22 * s);
  gr.addColorStop(0, shade(d.color, 0.4));
  gr.addColorStop(1, d.color);
  c.fillStyle = gr;
  c.beginPath();
  c.ellipse(0, 0, 21 * s, 19 * s, 0, 0, 7);
  c.fill();
  c.stroke();
  if (type == 'penguin') {
    c.fillStyle = '#fff';
    c.beginPath();
    c.ellipse(0, 5 * s, 13 * s, 12 * s, 0, 0, 7);
    c.fill();
  }
  Art.face(c, 0, -2 * s, s * 0.9, false);
  if (lv >= 3) {
    c.fillStyle = '#ffd23f';
    c.beginPath();
    c.moveTo(-9 * s, -18 * s);
    c.lineTo(-9 * s, -26 * s);
    c.lineTo(-4 * s, -21 * s);
    c.lineTo(0, -28 * s);
    c.lineTo(4 * s, -21 * s);
    c.lineTo(9 * s, -26 * s);
    c.lineTo(9 * s, -18 * s);
    c.closePath();
    c.fill();
  }
  c.restore();
};
Art.vecSlime = function (c, e, x, y, s, t) {
  var col = e.color;
  c.save();
  c.translate(x, y);
  var w = 1 + Math.sin(t * 6 + e.phase) * 0.06;
  c.scale(w, 2 - w);
  var gr = c.createRadialGradient(-5 * s, -6 * s, 2, 0, 0, 16 * s);
  gr.addColorStop(0, shade(col, 0.5));
  gr.addColorStop(1, col);
  c.fillStyle = gr;
  c.strokeStyle = shade(col, -0.35);
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(-15 * s, 8 * s);
  c.bezierCurveTo(-17 * s, -14 * s, 17 * s, -14 * s, 15 * s, 8 * s);
  c.quadraticCurveTo(0, 13 * s, -15 * s, 8 * s);
  c.fill();
  c.stroke();
  c.restore();
  Art.face(c, x, y - 1 * s, s * 0.7, false, e.hitT > 0 ? 'hurt' : '');
};
// 精灵绘制（优先 Blender 图集）
Art.towerKey = function (type, lv, br, skin) {
  var D = CFG.TOWERS[type];
  if (D && D.ultimate) return type;
  if (D && D.fusion) return type + '_' + Math.max(1, Math.min(lv, 3));
  lv = Math.max(1, Math.min(lv, CFG.MAX_LV));
  if (skin && lv < CFG.BRANCH_LV) return 's_' + skin + '_' + lv;
  return 't_' + type + '_' + (lv < CFG.BRANCH_LV ? lv : lv + (br || 'A'));
};
Art.tower = function (c, type, lv, x, y, size, frame, br, skin) {
  var D = CFG.TOWERS[type],
    k = this.towerKey(type, lv, br, skin),
    n = k + '_' + frame;
  if (!this.get(n)) n = k + '_0';
  // fusion / ultimate aura under sprite
  if (D && (D.fusion || D.ultimate)) {
    c.save();
    var pulse = 0.55 + Math.sin((typeof UI !== 'undefined' ? UI.t : 0) * 4) * 0.12;
    var grd = c.createRadialGradient(x, y - size * 0.15, 4, x, y - size * 0.15, size * 0.62);
    grd.addColorStop(0, shade(D.color, 0.35));
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = pulse * (D.ultimate ? 0.85 : 0.55);
    c.fillStyle = grd;
    c.beginPath();
    c.arc(x, y - size * 0.1, size * 0.58, 0, 7);
    c.fill();
    if (D.ultimate) {
      c.strokeStyle = D.color;
      c.globalAlpha = 0.55;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(x, y - size * 0.15, size * 0.48 + Math.sin((typeof UI !== 'undefined' ? UI.t : 0) * 3) * 2, 0, 7);
      c.stroke();
    }
    c.restore();
  }
  var dsz = D && D.ultimate ? size * 1.44 : size;
  if (!this.drawAt(c, n, x, y, dsz)) Art.vecTower(c, type, lv, x, y - size * 0.4, size / 64);
  // high-level crown sparkle / scarf hint
  if (lv >= 5 && !(D && D.parts)) {
    c.save();
    c.fillStyle = '#ffd23f';
    c.globalAlpha = 0.85;
    c.beginPath();
    c.arc(x, y - size * 0.72, 2.2, 0, 7);
    c.fill();
    c.beginPath();
    c.arc(x - size * 0.18, y - size * 0.62, 1.6, 0, 7);
    c.fill();
    c.beginPath();
    c.arc(x + size * 0.18, y - size * 0.62, 1.6, 0, 7);
    c.fill();
    c.restore();
  }
  // 攻击帧：枪口/爪光点
  if (frame == 'a' || frame == 1 || frame == '1') {
    c.save();
    c.fillStyle = D ? D.color : '#fff';
    c.globalAlpha = 0.9;
    c.beginPath();
    c.arc(x + size * 0.28, y - size * 0.35, 3.2, 0, 7);
    c.fill();
    c.globalAlpha = 0.45;
    c.beginPath();
    c.arc(x + size * 0.28, y - size * 0.35, 7, 0, 7);
    c.fill();
    c.restore();
  }
};
Art.enemy = function (c, e, x, y, size, t, frame) {
  var k = e.boss ? e.boss.id : e.type,
    f = frame || (Math.sin(t * 7 + e.phase) > 0 ? '0' : '1');
  if (e.hitT > 0) {
    c.save();
    c.globalAlpha = 0.35;
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(x, y - size * 0.15, size * 0.42, 0, 7);
    c.fill();
    c.restore();
  }
  if (!this.drawAt(c, 'e_' + k + '_' + f, x, y, size)) Art.vecSlime(c, e, x, y - size * 0.4, size / 40, t);
};
// ---- 场景背景（按章节主题离屏缓存）----
Art.bgCache = {};
Art.buildBG = function (level) {
  level = level || { theme: 'grass', paths: 'classic' };
  var key = (level.theme || 'grass') + '|' + (level.paths || 'classic');
  if (this.bgCache[key]) {
    this.bg = this.bgCache[key];
    return;
  }
  var cv = document.createElement('canvas');
  cv.width = CFG.W * 2;
  cv.height = CFG.H * 2;
  var c = cv.getContext('2d');
  c.scale(2, 2);
  var W = CFG.W,
    th = level.theme || 'grass',
    ch = null;
  CFG.CHAPTERS.forEach(function (x) {
    if (x.theme == th) ch = x;
  });
  ch = ch || CFG.CHAPTERS[0];
  var sky = ch.sky,
    road = ch.road,
    dark = th == 'haunt' || th == 'space';
  var g = c.createLinearGradient(0, 0, 0, CFG.H);
  g.addColorStop(0, sky[0]);
  g.addColorStop(0.12, sky[1]);
  g.addColorStop(0.6, sky[2]);
  g.addColorStop(1, sky[3]);
  c.fillStyle = g;
  c.fillRect(0, 0, W, CFG.H);
  var seed = 7;
  function rnd() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }
  // 远景
  if (th == 'space') {
    for (var i = 0; i < 90; i++) {
      c.fillStyle = 'rgba(255,255,255,' + (0.3 + rnd() * 0.7) + ')';
      c.beginPath();
      c.arc(rnd() * W, rnd() * 400, rnd() * 1.6 + 0.3, 0, 7);
      c.fill();
    }
    c.fillStyle = 'rgba(255,220,150,.8)';
    c.beginPath();
    c.arc(300, 90, 20, 0, 7);
    c.fill();
    c.strokeStyle = 'rgba(255,220,150,.6)';
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(300, 90, 32, 8, -0.3, 0, 7);
    c.stroke();
  } else if (th == 'haunt') {
    c.fillStyle = '#fff6c0';
    c.beginPath();
    c.arc(290, 95, 26, 0, 7);
    c.fill();
    c.fillStyle = '#3a2f58';
    c.beginPath();
    c.moveTo(0, 130);
    [
      [30, 90],
      [50, 90],
      [50, 70],
      [60, 60],
      [70, 70],
      [70, 95],
      [110, 95],
      [110, 115]
    ].forEach(function (p) {
      c.lineTo(p[0], p[1]);
    });
    c.lineTo(140, 130);
    c.fill();
  } else {
    c.fillStyle = shade(sky[2], -0.08);
    c.beginPath();
    c.moveTo(0, 90);
    for (i = 0; i <= W; i += 40) c.quadraticCurveTo(i + 20, th == 'snow' ? 40 : 60, i + 40, 88);
    c.lineTo(W, 120);
    c.lineTo(0, 120);
    c.fill();
    if (th == 'snow') {
      c.fillStyle = '#fff';
      for (i = 0; i <= W; i += 40) {
        c.beginPath();
        c.moveTo(i + 12, 62);
        c.quadraticCurveTo(i + 20, 46, i + 28, 62);
        c.fill();
      }
    }
  }
  // 地面纹理：大块柔和明暗斑 + 少量草叶
  for (i = 0; i < 28; i++) {
    c.fillStyle = (i % 2 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + (dark ? 0.04 : 0.05) + ')';
    c.beginPath();
    c.ellipse(rnd() * W, 80 + rnd() * 320, 30 + rnd() * 50, 12 + rnd() * 20, 0, 0, 7);
    c.fill();
  }
  for (i = 0; i < 60; i++) {
    var x = rnd() * W,
      y = 70 + rnd() * 330;
    c.strokeStyle = dark ? 'rgba(255,255,255,.08)' : 'rgba(60,100,60,.16)';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x - 2, y - 5);
    c.moveTo(x, y);
    c.lineTo(x + 2, y - 6);
    c.stroke();
  }
  // 路线：投影 + 深色描边 + 浅色路面 + 铺路石
  var PS = PATHSETS[level.paths || 'classic'];
  c.lineCap = 'round';
  c.lineJoin = 'round';
  function line(P, w, col, dy) {
    c.strokeStyle = col;
    c.lineWidth = w;
    c.beginPath();
    c.moveTo(P[0][0], P[0][1] + (dy || 0));
    for (var k = 1; k < P.length; k++) c.lineTo(P[k][0], P[k][1] + (dy || 0));
    c.stroke();
  }
  PS.forEach(function (P) {
    line(P, 44, 'rgba(40,20,30,.16)', 4);
  });
  PS.forEach(function (P) {
    line(P, 40, road[0]);
  });
  PS.forEach(function (P) {
    line(P, 33, road[1]);
  });
  PS.forEach(function (P) {
    for (var k = 0; k < P.length - 1; k++) {
      var ax = P[k][0],
        ay = P[k][1],
        dx = P[k + 1][0] - ax,
        dy = P[k + 1][1] - ay,
        L = Math.hypot(dx, dy),
        ux = dx / L,
        uy = dy / L;
      for (var d = 9; d < L; d += 17) {
        for (var side = -1; side <= 1; side += 2) {
          var off = side * 7.5 + (Math.floor(d / 17) % 2 ? 3 : -3),
            sx = ax + ux * d - uy * off,
            sy = ay + uy * d + ux * off;
          c.fillStyle = shade(road[1], -0.035 - rnd() * 0.03);
          rr(c, sx - 6.5, sy - 5, 13, 10, 5);
          c.fill();
          c.fillStyle = 'rgba(255,255,255,.28)';
          rr(c, sx - 4.5, sy - 4.5, 9, 3, 2);
          c.fill();
        }
      }
    }
  });
  // 装饰
  function nearPath(x, y) {
    for (var q = 0; q < PS.length; q++) {
      var pp = PS[q];
      for (var s = 0; s < pp.length - 1; s++) {
        var ax = pp[s][0],
          ay = pp[s][1],
          bx = pp[s + 1][0],
          by = pp[s + 1][1],
          dx = bx - ax,
          dy = by - ay,
          l = dx * dx + dy * dy,
          k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l));
        if (Math.hypot(x - ax - dx * k, y - ay - dy * k) < 30) return true;
      }
    }
    return Math.hypot(x - CFG.CASTLE.x, y - CFG.CASTLE.y) < 50;
  }
  var deco =
    {
      grass: Art.decoFlower,
      forest: Art.decoMush,
      snow: Art.decoPine,
      desert: Art.decoCactus,
      haunt: Art.decoGrave,
      space: Art.decoCrystal
    }[th] || Art.decoFlower;
  for (i = 0; i < 70; i++) {
    x = 14 + rnd() * (W - 28);
    y = 80 + rnd() * 310;
    if (nearPath(x, y)) continue;
    deco(c, x, y, 0.6 + rnd() * 0.6, rnd);
  }
  // 出生洞
  PS.forEach(function (P) {
    c.fillStyle = dark ? '#1e1834' : '#6b4f7a';
    c.beginPath();
    c.ellipse(P[0][0], P[0][1] + 4, 24, 10, 0, 0, 7);
    c.fill();
    c.fillStyle = '#2b1f3a';
    c.beginPath();
    c.ellipse(P[0][0], P[0][1] + 5, 17, 6, 0, 0, 7);
    c.fill();
  });
  // 伙伴台
  var y0 = CFG.FIELD_BOT + 2,
    g2 = c.createLinearGradient(0, y0, 0, CFG.H);
  g2.addColorStop(0, dark ? '#e8defa' : '#ffe9c7');
  g2.addColorStop(1, dark ? '#cdbff0' : '#ffd6a8');
  c.fillStyle = g2;
  rr(c, 0, y0, W, CFG.H - y0 + 20, 18);
  c.fill();
  c.fillStyle = 'rgba(255,255,255,.5)';
  rr(c, 0, y0, W, 6, 3);
  c.fill();
  for (var r = 0; r < CFG.ROWS; r++)
    for (var cc = 0; cc < CFG.COLS; cc++) {
      var gx = CFG.GRID_X + cc * CFG.CELL,
        gy = CFG.GRID_Y + r * CFG.CELL;
      c.fillStyle = (r + cc) % 2 ? (dark ? '#f4eeff' : '#fff3df') : dark ? '#ebe2fc' : '#ffeccc';
      rr(c, gx + 3, gy + 3, CFG.CELL - 6, CFG.CELL - 6, 12);
      c.fill();
      c.strokeStyle = dark ? 'rgba(150,120,200,.4)' : 'rgba(220,170,120,.5)';
      c.lineWidth = 1.5;
      c.stroke();
    }
  // v2.2 主题道具：路旁灯笼 / 雪人 / 仙人掌 / 墓碑 / 星碑
  for (i = 0; i < 7; i++) {
    var ox = 24 + rnd() * (W - 48),
      oy = 100 + rnd() * 260;
    if (nearPath(ox, oy)) continue;
    if (th == 'grass' || th == 'forest') {
      c.fillStyle = '#e8a0b8';
      c.beginPath();
      c.arc(ox, oy - 10, 4, 0, 7);
      c.fill();
      c.strokeStyle = '#7a4a55';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(ox, oy - 6);
      c.lineTo(ox, oy + 6);
      c.stroke();
    } else if (th == 'snow') {
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(ox, oy, 7, 0, 7);
      c.arc(ox, oy - 10, 5, 0, 7);
      c.fill();
      c.fillStyle = '#2b1b17';
      c.fillRect(ox - 1, oy - 16, 2, 4);
    } else if (th == 'desert') {
      c.fillStyle = '#7ecf6a';
      c.fillRect(ox - 3, oy - 14, 6, 18);
      c.fillRect(ox - 10, oy - 6, 8, 4);
      c.fillRect(ox + 2, oy - 10, 8, 4);
    } else if (th == 'haunt') {
      c.fillStyle = '#5a5368';
      c.fillRect(ox - 6, oy - 12, 12, 16);
      c.fillStyle = '#3a2f58';
      c.fillRect(ox - 4, oy - 6, 3, 5);
      c.fillRect(ox + 1, oy - 6, 3, 5);
    } else if (th == 'space') {
      c.strokeStyle = 'rgba(200,180,255,.55)';
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(ox, oy - 8);
      c.lineTo(ox + 5, oy);
      c.lineTo(ox, oy + 8);
      c.lineTo(ox - 5, oy);
      c.closePath();
      c.stroke();
    }
  }
  this.bgCache[key] = cv;
  this.bg = cv;
};
Art.decoFlower = function (c, x, y, s, rnd) {
  var fc = ['#ff8fb1', '#ffd166', '#fff', '#c3a6ff', '#8fd3ff'];
  if (rnd() < 0.2) {
    c.fillStyle = '#7cc46c';
    [
      [0, 0, 12],
      [-9, 4, 9],
      [9, 4, 9]
    ].forEach(function (q) {
      c.beginPath();
      c.arc(x + q[0] * s, y + q[1] * s, q[2] * s, 0, 7);
      c.fill();
    });
    c.fillStyle = '#9be08a';
    c.beginPath();
    c.arc(x - 3 * s, y - 4 * s, 5 * s, 0, 7);
    c.fill();
    return;
  }
  c.fillStyle = fc[Math.floor(rnd() * 5)];
  for (var p = 0; p < 5; p++) {
    c.beginPath();
    c.arc(x + Math.cos(p * 1.256) * 3 * s, y + Math.sin(p * 1.256) * 3 * s, 2.4 * s, 0, 7);
    c.fill();
  }
  c.fillStyle = '#ffcf3f';
  c.beginPath();
  c.arc(x, y, 1.8 * s, 0, 7);
  c.fill();
};
Art.decoMush = function (c, x, y, s, rnd) {
  if (rnd() < 0.5) {
    c.fillStyle = '#fff3e6';
    c.fillRect(x - 2.5 * s, y - 8 * s, 5 * s, 8 * s);
    c.fillStyle = rnd() < 0.5 ? '#ff6f9c' : '#b46cff';
    c.beginPath();
    c.arc(x, y - 8 * s, 9 * s, Math.PI, 0);
    c.fill();
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(x - 3 * s, y - 12 * s, 1.6 * s, 0, 7);
    c.arc(x + 3 * s, y - 11 * s, 1.4 * s, 0, 7);
    c.fill();
  } else {
    c.fillStyle = 'rgba(255,140,190,.55)';
    c.beginPath();
    c.arc(x, y - 6 * s, 7 * s, 0, 7);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)';
    c.beginPath();
    c.arc(x - 2 * s, y - 9 * s, 2 * s, 0, 7);
    c.fill();
  }
};
Art.decoPine = function (c, x, y, s, rnd) {
  if (rnd() < 0.35) {
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(x, y - 4 * s, 6 * s, 0, 7);
    c.fill();
    return;
  }
  c.fillStyle = '#8a6a4a';
  c.fillRect(x - 2 * s, y - 4 * s, 4 * s, 5 * s);
  for (var k = 0; k < 3; k++) {
    c.fillStyle = k % 2 ? '#5fae8f' : '#6fc2a0';
    c.beginPath();
    c.moveTo(x - (11 - k * 3) * s, y - (4 + k * 7) * s);
    c.lineTo(x, y - (16 + k * 7) * s);
    c.lineTo(x + (11 - k * 3) * s, y - (4 + k * 7) * s);
    c.fill();
  }
  c.fillStyle = '#fff';
  c.beginPath();
  c.moveTo(x - 4 * s, y - 27 * s);
  c.lineTo(x, y - 32 * s);
  c.lineTo(x + 4 * s, y - 27 * s);
  c.fill();
};
Art.decoCactus = function (c, x, y, s, rnd) {
  if (rnd() < 0.4) {
    c.fillStyle = '#e8c08a';
    c.beginPath();
    c.ellipse(x, y, 9 * s, 4 * s, 0, 0, 7);
    c.fill();
    return;
  }
  c.fillStyle = '#7cc46c';
  rr(c, x - 4 * s, y - 18 * s, 8 * s, 18 * s, 4 * s);
  c.fill();
  rr(c, x - 10 * s, y - 12 * s, 5 * s, 8 * s, 2.5 * s);
  c.fill();
  rr(c, x + 5 * s, y - 14 * s, 5 * s, 9 * s, 2.5 * s);
  c.fill();
  c.fillStyle = '#ff8fb1';
  c.beginPath();
  c.arc(x, y - 19 * s, 2.5 * s, 0, 7);
  c.fill();
};
Art.decoGrave = function (c, x, y, s, rnd) {
  var k = rnd();
  if (k < 0.35) {
    c.fillStyle = '#8c84a8';
    rr(c, x - 6 * s, y - 14 * s, 12 * s, 14 * s, 6 * s);
    c.fill();
    c.fillStyle = '#6a6288';
    c.fillRect(x - 3 * s, y - 9 * s, 6 * s, 1.5 * s);
  } else if (k < 0.6) {
    c.fillStyle = '#ff9a3d';
    c.beginPath();
    c.ellipse(x, y - 5 * s, 8 * s, 6 * s, 0, 0, 7);
    c.fill();
    c.fillStyle = '#3a2f58';
    c.beginPath();
    c.moveTo(x - 4 * s, y - 6 * s);
    c.lineTo(x - 2 * s, y - 8 * s);
    c.lineTo(x, y - 6 * s);
    c.fill();
    c.fillStyle = '#5fae4f';
    c.fillRect(x - 1 * s, y - 13 * s, 2 * s, 3 * s);
  } else {
    c.fillStyle = 'rgba(255,240,150,' + (0.3 + rnd() * 0.4) + ')';
    c.beginPath();
    c.arc(x, y - 10 * s, 2 * s, 0, 7);
    c.fill();
  }
};
Art.decoCrystal = function (c, x, y, s, rnd) {
  if (rnd() < 0.5) {
    var col = ['#9fe0ff', '#f6c6ff', '#ffe066'][Math.floor(rnd() * 3)];
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(x, y - 16 * s);
    c.lineTo(x + 5 * s, y - 5 * s);
    c.lineTo(x, y);
    c.lineTo(x - 5 * s, y - 5 * s);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)';
    c.beginPath();
    c.moveTo(x, y - 16 * s);
    c.lineTo(x + 2 * s, y - 6 * s);
    c.lineTo(x, y - 2 * s);
    c.fill();
  } else {
    c.fillStyle = 'rgba(255,255,255,' + (0.4 + rnd() * 0.5) + ')';
    c.beginPath();
    for (var i = 0; i < 8; i++) {
      var r = i % 2 ? 1.5 * s : 4 * s,
        a = (i * Math.PI) / 4;
      c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    c.fill();
  }
};
Art.castle = function (c, x, y, t, hurt) {
  c.save();
  c.translate(x, y);
  var s = hurt > 0 ? 1 + Math.sin(hurt * 40) * 0.05 : 1;
  c.scale(s, s);
  if (this.get('p_castle_0')) {
    c.fillStyle = 'rgba(0,0,0,.15)';
    c.beginPath();
    c.ellipse(0, 18, 36, 9, 0, 0, 7);
    c.fill();
    this.drawAt(c, 'p_castle_0', 0, 22, 84);
    if (hurt > 0) {
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = hurt;
      this.drawAt(c, 'p_castle_0', 0, 22, 84);
      c.globalAlpha = 1;
      c.globalCompositeOperation = 'source-over';
    }
    c.restore();
    return;
  }
  c.fillStyle = 'rgba(0,0,0,.15)';
  c.beginPath();
  c.ellipse(0, 18, 34, 8, 0, 0, 7);
  c.fill();
  function tw(x0, w, h, col) {
    c.fillStyle = col;
    rr(c, x0 - w / 2, -h + 18, w, h, 5);
    c.fill();
    c.strokeStyle = '#b07a8f';
    c.lineWidth = 2;
    c.stroke();
  }
  tw(-20, 16, 38, '#ffd6e6');
  tw(20, 16, 38, '#ffd6e6');
  tw(0, 30, 44, '#fff0f6');
  c.fillStyle = '#ff8fb1';
  [
    [-20, -20],
    [20, -20]
  ].forEach(function (p) {
    c.beginPath();
    c.moveTo(p[0] - 11, p[1]);
    c.lineTo(p[0], p[1] - 18);
    c.lineTo(p[0] + 11, p[1]);
    c.fill();
  });
  c.fillStyle = '#ff6f9c';
  c.beginPath();
  c.moveTo(-17, -26);
  c.lineTo(0, -48);
  c.lineTo(17, -26);
  c.fill();
  c.fillStyle = '#8a5a7a';
  rr(c, -7, 2, 14, 16, 7);
  c.fill();
  c.fillStyle = '#ffe066';
  c.beginPath();
  c.moveTo(0, -48);
  c.lineTo(0, -60);
  c.lineTo(11, -56 + Math.sin(t * 5) * 2);
  c.lineTo(0, -52);
  c.fill();
  c.strokeStyle = '#8a5a7a';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(0, -48);
  c.lineTo(0, -61);
  c.stroke();
  c.fillStyle = '#2b1b17';
  c.beginPath();
  c.arc(-5, -12, 1.8, 0, 7);
  c.arc(5, -12, 1.8, 0, 7);
  c.fill();
  c.strokeStyle = '#2b1b17';
  c.beginPath();
  c.arc(0, -9, 2.5, 0.2, Math.PI - 0.2);
  c.stroke();
  c.restore();
};
// 小图标（UI 用）
Art.icon = function (c, name, x, y, s) {
  c.save();
  c.translate(x, y);
  c.scale(s / 20, s / 20);
  c.lineJoin = 'round';
  c.lineCap = 'round';
  var I = {
    coin: function () {
      c.fillStyle = '#ffc93c';
      c.beginPath();
      c.arc(0, 0, 9, 0, 7);
      c.fill();
      c.strokeStyle = '#e69a00';
      c.lineWidth = 2;
      c.stroke();
      c.fillStyle = '#fff3b0';
      c.beginPath();
      c.arc(-2.5, -2.5, 3, 0, 7);
      c.fill();
    },
    gem: function () {
      c.fillStyle = '#6fd6ff';
      c.beginPath();
      c.moveTo(-8, -3);
      c.lineTo(-4, -8);
      c.lineTo(4, -8);
      c.lineTo(8, -3);
      c.lineTo(0, 9);
      c.closePath();
      c.fill();
      c.strokeStyle = '#2a9fd6';
      c.lineWidth = 1.6;
      c.stroke();
      c.fillStyle = 'rgba(255,255,255,.7)';
      c.beginPath();
      c.moveTo(-4, -3);
      c.lineTo(-2, -7);
      c.lineTo(1, -3);
      c.fill();
    },
    gem2: function () {
      I.gem();
      c.translate(6, 4);
      c.scale(0.6, 0.6);
      I.gem();
    },
    candy: function () {
      c.fillStyle = '#ff8fb1';
      c.beginPath();
      c.moveTo(-6, 0);
      c.lineTo(-11, -5);
      c.lineTo(-11, 5);
      c.fill();
      c.beginPath();
      c.moveTo(6, 0);
      c.lineTo(11, -5);
      c.lineTo(11, 5);
      c.fill();
      c.beginPath();
      c.arc(0, 0, 7, 0, 7);
      c.fill();
      c.strokeStyle = '#fff';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(0, 0, 3.5, 0, 4);
      c.stroke();
    },
    heart: function () {
      c.fillStyle = '#ff5a7a';
      c.beginPath();
      c.moveTo(0, 8);
      c.bezierCurveTo(-12, -1, -7, -11, 0, -4);
      c.bezierCurveTo(7, -11, 12, -1, 0, 8);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)';
      c.beginPath();
      c.arc(-4, -3, 2, 0, 7);
      c.fill();
    },
    star: function () {
      c.fillStyle = '#ffc93c';
      c.beginPath();
      for (var i = 0; i < 10; i++) {
        var r = i % 2 ? 4 : 9,
          a = (i * Math.PI) / 5 - Math.PI / 2;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      c.closePath();
      c.fill();
      c.strokeStyle = '#e69a00';
      c.lineWidth = 1.4;
      c.stroke();
    },
    starE: function () {
      c.fillStyle = 'rgba(0,0,0,.18)';
      c.beginPath();
      for (var i = 0; i < 10; i++) {
        var r = i % 2 ? 4 : 9,
          a = (i * Math.PI) / 5 - Math.PI / 2;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      c.closePath();
      c.fill();
    },
    bolt: function () {
      c.fillStyle = '#ffd23f';
      c.beginPath();
      c.moveTo(2, -10);
      c.lineTo(-6, 2);
      c.lineTo(0, 2);
      c.lineTo(-2, 10);
      c.lineTo(6, -2);
      c.lineTo(0, -2);
      c.closePath();
      c.fill();
      c.strokeStyle = '#e69a00';
      c.lineWidth = 1.4;
      c.stroke();
    },
    paw: function () {
      c.fillStyle = '#ff9ec4';
      c.beginPath();
      c.ellipse(0, 3, 6, 5, 0, 0, 7);
      c.fill();
      [
        [-6, -4],
        [-2, -8],
        [2, -8],
        [6, -4]
      ].forEach(function (p) {
        c.beginPath();
        c.arc(p[0], p[1], 2.4, 0, 7);
        c.fill();
      });
    },
    eye: function () {
      c.fillStyle = '#fff';
      c.beginPath();
      c.ellipse(0, 0, 9, 6, 0, 0, 7);
      c.fill();
      c.strokeStyle = '#4a6';
      c.lineWidth = 1.6;
      c.stroke();
      c.fillStyle = '#2b1b17';
      c.beginPath();
      c.arc(0, 0, 3.5, 0, 7);
      c.fill();
    },
    arrows: function () {
      c.strokeStyle = '#8a5a3b';
      c.lineWidth = 2;
      [-4, 0, 4].forEach(function (o) {
        c.beginPath();
        c.moveTo(-8, o + 4);
        c.lineTo(7, o - 4);
        c.stroke();
        c.fillStyle = '#c0c8d8';
        c.beginPath();
        c.moveTo(9, o - 5);
        c.lineTo(4, o - 5);
        c.lineTo(7, o - 1);
        c.fill();
      });
    },
    pierce: function () {
      c.strokeStyle = '#8a5a3b';
      c.lineWidth = 2.4;
      c.beginPath();
      c.moveTo(-10, 0);
      c.lineTo(8, 0);
      c.stroke();
      c.fillStyle = '#c0c8d8';
      c.beginPath();
      c.moveTo(11, 0);
      c.lineTo(5, -4);
      c.lineTo(5, 4);
      c.fill();
      c.strokeStyle = '#ff8fb1';
      c.beginPath();
      c.arc(0, 0, 5, 0, 7);
      c.stroke();
    },
    clover: function () {
      c.fillStyle = '#5fcf6a';
      [0, 1, 2, 3].forEach(function (i) {
        c.beginPath();
        c.arc(Math.cos(i * 1.57) * 4.5, Math.sin(i * 1.57) * 4.5, 4.5, 0, 7);
        c.fill();
      });
      c.strokeStyle = '#3a9a45';
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(3, 10);
      c.stroke();
    },
    snow: function () {
      c.strokeStyle = '#5fbfff';
      c.lineWidth = 2;
      for (var i = 0; i < 3; i++) {
        c.beginPath();
        var a = (i * Math.PI) / 3;
        c.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
        c.lineTo(-Math.cos(a) * 9, -Math.sin(a) * 9);
        c.stroke();
      }
    },
    fire: function () {
      c.fillStyle = '#ff7a1a';
      c.beginPath();
      c.moveTo(0, -10);
      c.bezierCurveTo(9, -2, 8, 9, 0, 9);
      c.bezierCurveTo(-8, 9, -9, -2, 0, -10);
      c.fill();
      c.fillStyle = '#ffd23f';
      c.beginPath();
      c.moveTo(0, -3);
      c.bezierCurveTo(5, 2, 4, 8, 0, 8);
      c.bezierCurveTo(-4, 8, -5, 2, 0, -3);
      c.fill();
    },
    bomb: function () {
      c.fillStyle = '#4a4e66';
      c.beginPath();
      c.arc(-1, 2, 7.5, 0, 7);
      c.fill();
      c.strokeStyle = '#c9a';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(4, -4);
      c.quadraticCurveTo(8, -9, 6, -11);
      c.stroke();
      c.fillStyle = '#ffd23f';
      c.beginPath();
      c.arc(6, -11, 2.5, 0, 7);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.4)';
      c.beginPath();
      c.arc(-4, -1, 2, 0, 7);
      c.fill();
    },
    pig: function () {
      c.fillStyle = '#ffb3c7';
      c.beginPath();
      c.arc(0, 1, 8, 0, 7);
      c.fill();
      c.fillStyle = '#f07d9e';
      c.beginPath();
      c.ellipse(0, 3, 3.5, 2.5, 0, 0, 7);
      c.fill();
      c.fillStyle = '#2b1b17';
      c.beginPath();
      c.arc(-3, -2, 1.2, 0, 7);
      c.arc(3, -2, 1.2, 0, 7);
      c.fill();
    },
    up: function () {
      c.fillStyle = '#5fcf6a';
      c.beginPath();
      c.moveTo(0, -10);
      c.lineTo(9, 0);
      c.lineTo(4, 0);
      c.lineTo(4, 9);
      c.lineTo(-4, 9);
      c.lineTo(-4, 0);
      c.lineTo(-9, 0);
      c.closePath();
      c.fill();
    },
    sword: function () {
      c.strokeStyle = '#c0c8d8';
      c.lineWidth = 3.5;
      c.beginPath();
      c.moveTo(-7, 7);
      c.lineTo(8, -8);
      c.stroke();
      c.strokeStyle = '#e69a00';
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(-8, 2);
      c.lineTo(-2, 8);
      c.stroke();
    },
    crown: function () {
      c.fillStyle = '#ffc93c';
      c.beginPath();
      c.moveTo(-10, 6);
      c.lineTo(-10, -6);
      c.lineTo(-5, 0);
      c.lineTo(0, -9);
      c.lineTo(5, 0);
      c.lineTo(10, -6);
      c.lineTo(10, 6);
      c.closePath();
      c.fill();
      c.strokeStyle = '#e69a00';
      c.lineWidth = 1.4;
      c.stroke();
    },
    clock: function () {
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(0, 0, 9, 0, 7);
      c.fill();
      c.strokeStyle = '#7a6cff';
      c.lineWidth = 2;
      c.stroke();
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -6);
      c.moveTo(0, 0);
      c.lineTo(4, 2);
      c.stroke();
    },
    reroll: function () {
      c.strokeStyle = '#7a6cff';
      c.lineWidth = 2.6;
      c.beginPath();
      c.arc(0, 0, 7, 0.3, 5.2);
      c.stroke();
      c.fillStyle = '#7a6cff';
      c.beginPath();
      c.moveTo(9, -6);
      c.lineTo(8, 2);
      c.lineTo(2, -3);
      c.fill();
    },
    moon: function () {
      c.fillStyle = '#ffd23f';
      c.beginPath();
      c.arc(0, 0, 9, 0, 7);
      c.fill();
      c.fillStyle = '#fff9e6';
      c.globalCompositeOperation = 'destination-out';
      c.beginPath();
      c.arc(5, -4, 8, 0, 7);
      c.fill();
      c.globalCompositeOperation = 'source-over';
    },
    gift: function () {
      c.fillStyle = '#ff6f9c';
      rr(c, -9, -3, 18, 12, 2);
      c.fill();
      c.fillStyle = '#ff8fb1';
      rr(c, -10, -7, 20, 5, 2);
      c.fill();
      c.fillStyle = '#ffd23f';
      c.fillRect(-2, -7, 4, 16);
      c.beginPath();
      c.ellipse(-4, -9, 4, 2.5, -0.5, 0, 7);
      c.ellipse(4, -9, 4, 2.5, 0.5, 0, 7);
      c.fill();
    },
    card: function () {
      c.fillStyle = '#b46cff';
      rr(c, -10, -7, 20, 14, 3);
      c.fill();
      c.fillStyle = '#ffd23f';
      c.fillRect(-10, -3, 20, 3);
      c.fillStyle = '#fff';
      c.font = 'bold 7px sans-serif';
      c.textAlign = 'center';
      c.fillText('30天', 0, 5);
    },
    noad: function () {
      c.fillStyle = '#fff';
      rr(c, -9, -6, 18, 12, 2);
      c.fill();
      c.fillStyle = '#4a4e66';
      c.font = 'bold 8px sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('AD', 0, 0);
      c.strokeStyle = '#ff4d6d';
      c.lineWidth = 2.4;
      c.beginPath();
      c.arc(0, 0, 10, 0, 7);
      c.moveTo(-7, -7);
      c.lineTo(7, 7);
      c.stroke();
    },
    ad: function () {
      c.fillStyle = '#ff9f43';
      rr(c, -10, -7, 20, 14, 4);
      c.fill();
      c.fillStyle = '#fff';
      c.beginPath();
      c.moveTo(-3, -4);
      c.lineTo(5, 0);
      c.lineTo(-3, 4);
      c.fill();
    },
    shop: function () {
      c.fillStyle = '#ff9f43';
      rr(c, -9, -3, 18, 12, 3);
      c.fill();
      c.strokeStyle = '#ff9f43';
      c.lineWidth = 2.4;
      c.beginPath();
      c.arc(0, -3, 5, Math.PI, 0);
      c.stroke();
    },
    bag: function () {
      c.fillStyle = '#fff';
      rr(c, -9, -4, 18, 14, 4);
      c.fill();
      c.strokeStyle = '#fff';
      c.lineWidth = 2.6;
      c.beginPath();
      c.arc(0, -4, 5, Math.PI, 0);
      c.stroke();
      c.fillStyle = '#ff9f43';
      c.beginPath();
      c.arc(0, 3, 3, 0, 7);
      c.fill();
    },
    paw2: function () {
      c.fillStyle = '#fff';
      c.beginPath();
      c.ellipse(0, 3, 6.5, 5.5, 0, 0, 7);
      c.fill();
      [
        [-7, -4],
        [-2.5, -8.5],
        [2.5, -8.5],
        [7, -4]
      ].forEach(function (p) {
        c.beginPath();
        c.arc(p[0], p[1], 2.7, 0, 7);
        c.fill();
      });
    },
    gear: function () {
      c.fillStyle = '#8a94b8';
      for (var i = 0; i < 8; i++) {
        c.save();
        c.rotate((i * Math.PI) / 4);
        c.fillRect(-2, -10, 4, 5);
        c.restore();
      }
      c.beginPath();
      c.arc(0, 0, 7, 0, 7);
      c.fill();
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(0, 0, 3, 0, 7);
      c.fill();
    },
    sound: function () {
      c.fillStyle = '#5b7fa8';
      c.beginPath();
      c.moveTo(-8, -3);
      c.lineTo(-4, -3);
      c.lineTo(1, -8);
      c.lineTo(1, 8);
      c.lineTo(-4, 3);
      c.lineTo(-8, 3);
      c.fill();
      c.strokeStyle = '#5b7fa8';
      c.lineWidth = 1.8;
      c.beginPath();
      c.arc(2, 0, 5, -0.9, 0.9);
      c.stroke();
      c.beginPath();
      c.arc(2, 0, 9, -0.9, 0.9);
      c.stroke();
    },
    mute: function () {
      I.sound();
      c.strokeStyle = '#ff4d6d';
      c.lineWidth = 2.4;
      c.beginPath();
      c.moveTo(-9, -9);
      c.lineTo(9, 9);
      c.stroke();
    },
    pause: function () {
      c.fillStyle = '#5b7fa8';
      rr(c, -7, -8, 5, 16, 2);
      c.fill();
      rr(c, 2, -8, 5, 16, 2);
      c.fill();
    },
    play: function () {
      c.fillStyle = '#5b7fa8';
      c.beginPath();
      c.moveTo(-6, -8);
      c.lineTo(8, 0);
      c.lineTo(-6, 8);
      c.closePath();
      c.fill();
    },
    map: function () {
      c.fillStyle = '#8fd3ff';
      c.beginPath();
      c.moveTo(-10, -7);
      c.lineTo(-3, -9);
      c.lineTo(3, -7);
      c.lineTo(10, -9);
      c.lineTo(10, 7);
      c.lineTo(3, 9);
      c.lineTo(-3, 7);
      c.lineTo(-10, 9);
      c.closePath();
      c.fill();
      c.fillStyle = '#ff5a7a';
      c.beginPath();
      c.arc(1, -1, 3, 0, 7);
      c.fill();
    },
    task: function () {
      c.fillStyle = '#fff';
      rr(c, -8, -10, 16, 20, 3);
      c.fill();
      c.strokeStyle = '#5fcf6a';
      c.lineWidth = 2;
      c.stroke();
      c.beginPath();
      c.moveTo(-4, 0);
      c.lineTo(-1, 3);
      c.lineTo(5, -4);
      c.stroke();
    },
    lock: function () {
      c.fillStyle = '#8a94b8';
      rr(c, -7, -2, 14, 11, 3);
      c.fill();
      c.strokeStyle = '#8a94b8';
      c.lineWidth = 2.4;
      c.beginPath();
      c.arc(0, -2, 4.5, Math.PI, 0);
      c.stroke();
    },
    ticket: function () {
      c.fillStyle = '#ff8fb1';
      c.beginPath();
      c.moveTo(-10, -6);
      c.lineTo(10, -6);
      c.lineTo(10, -2);
      c.arc(10, 0, 2, -1.6, 1.6, true);
      c.lineTo(10, 6);
      c.lineTo(-10, 6);
      c.lineTo(-10, 2);
      c.arc(-10, 0, 2, 1.6, -1.6, true);
      c.closePath();
      c.fill();
      c.strokeStyle = '#d94a7a';
      c.lineWidth = 1.5;
      c.stroke();
      c.strokeStyle = '#fff';
      c.setLineDash([2, 2]);
      c.beginPath();
      c.moveTo(3, -5);
      c.lineTo(3, 5);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(-4, 0, 2.5, 0, 7);
      c.fill();
    },
    trophy: function () {
      c.fillStyle = '#ffc93c';
      c.beginPath();
      c.moveTo(-7, -8);
      c.lineTo(7, -8);
      c.lineTo(6, 0);
      c.quadraticCurveTo(0, 6, -6, 0);
      c.closePath();
      c.fill();
      c.strokeStyle = '#e69a00';
      c.lineWidth = 1.6;
      c.stroke();
      c.beginPath();
      c.arc(-8, -4, 3.5, 1.5, 4.7);
      c.arc(8, -4, 3.5, -1.6, 1.6);
      c.stroke();
      c.fillStyle = '#e69a00';
      c.fillRect(-1.5, 2, 3, 4);
      rr(c, -6, 6, 12, 3, 1.5);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)';
      c.fillRect(-4, -6, 2, 5);
    },
    mail: function () {
      c.fillStyle = '#fff';
      rr(c, -9, -6, 18, 13, 2);
      c.fill();
      c.strokeStyle = '#4fa8ff';
      c.lineWidth = 1.8;
      c.stroke();
      c.beginPath();
      c.moveTo(-9, -5);
      c.lineTo(0, 2);
      c.lineTo(9, -5);
      c.stroke();
      c.fillStyle = '#ff6f9c';
      c.beginPath();
      c.arc(7, -6, 3, 0, 7);
      c.fill();
    },
    share: function () {
      c.fillStyle = '#fff';
      [
        [-6, 0],
        [6, -6],
        [6, 6]
      ].forEach(function (p) {
        c.beginPath();
        c.arc(p[0], p[1], 3.5, 0, 7);
        c.fill();
      });
      c.strokeStyle = '#fff';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(6, -6);
      c.lineTo(-6, 0);
      c.lineTo(6, 6);
      c.stroke();
    },
    trash: function () {
      c.fillStyle = '#8a94b8';
      rr(c, -7, -5, 14, 14, 2);
      c.fill();
      c.fillRect(-9, -8, 18, 3);
      c.fillRect(-3, -10, 6, 3);
    }
  };
  (I[name] || I.star)();
  c.restore();
};


// ---- src/ui/fx.js ----
/**
 * 软萌大作战 V1.0
 * 特效：粒子 / 飘字 / 震屏 / 补间
 *
 * © 2026 <著作权人>
 */
var FX = {
  ps: [],
  texts: [],
  rings: [],
  bolts: [],
  beams: [],
  shake: 0,
  flash: 0,
  clear: function () {
    this.ps = [];
    this.texts = [];
    this.rings = [];
    this.bolts = [];
    this.beams = [];
  },
  /** 粒子对象池：复用已结束的粒子，避免敌人密集时频繁分配内存 */
  pool: [],
  MAX_PS: 360,
  burst: function (x, y, n, o) {
    o = o || {};
    if (this.ps.length > this.MAX_PS * 0.45) n = Math.ceil(n / 2);
    if (this.ps.length > this.MAX_PS * 0.7) n = Math.max(1, Math.ceil(n / 2));
    for (var i = 0; i < n; i++) {
      if (this.ps.length >= this.MAX_PS) break;
      var a = Math.random() * Math.PI * 2,
        s = (o.speed || 90) * (0.4 + Math.random() * 0.8),
        p = this.pool.pop() || {};
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s - (o.up || 0);
      p.life = p.max = o.life || 0.6;
      p.size = (o.size || 4) * (0.6 + Math.random() * 0.7);
      p.color = o.colors ? o.colors[i % o.colors.length] : o.color || '#fff';
      p.shape = o.shape || 'circle';
      p.g = o.g == null ? 160 : o.g;
      p.rot = Math.random() * 6;
      this.ps.push(p);
    }
  },
  text: function (x, y, txt, o) {
    o = o || {};
    var o2 = {
      x: x + (Math.random() - 0.5) * 10,
      y: y,
      txt: txt,
      life: o.life || 0.8,
      max: o.life || 0.8,
      color: o.color || '#fff',
      size: o.size || 14,
      vy: o.vy || -50
    };
    this.texts.push(o2);
    if (this.texts.length > 60) this.texts.shift();
    return o2;
  },
  ring: function (x, y, r, color, life) {
    this.rings.push({ x: x, y: y, r: r, color: color, life: life || 0.35, max: life || 0.35 });
  },
  update: function (dt) {
    this.shake = Math.max(0, this.shake - dt * 30);
    this.flash = Math.max(0, this.flash - dt * 2);
    var ps = this.ps,
      pool = this.pool,
      k = 0;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
      p.vx *= 0.98;
      p.rot += dt * 4;
      if (p.life > 0) ps[k++] = p;
      else if (pool.length < 400) pool.push(p);
    }
    ps.length = k;
    this.texts = this.texts.filter(function (t) {
      t.life -= dt;
      t.y += t.vy * dt;
      t.vy *= 0.94;
      return t.life > 0;
    });
    ['rings', 'bolts', 'beams'].forEach(function (k) {
      FX[k] = FX[k].filter(function (r) {
        r.life -= dt;
        return r.life > 0;
      });
    });
  },
  draw: function (c) {
    this.rings.forEach(function (r) {
      var k = 1 - r.life / r.max;
      c.globalAlpha = 1 - k;
      c.strokeStyle = r.color;
      c.lineWidth = 4 * (1 - k) + 1;
      c.beginPath();
      c.arc(r.x, r.y, r.r * (0.3 + k * 0.9), 0, 7);
      c.stroke();
      c.fillStyle = r.color;
      c.globalAlpha = (1 - k) * 0.25;
      c.fill();
    });
    c.globalAlpha = 1;
    this.bolts.forEach(function (b) {
      c.globalAlpha = b.life / b.max;
      c.lineCap = 'round';
      [
        [7 * (b.w || 1), b.col || 'rgba(200,170,255,.5)'],
        [3 * (b.w || 1), b.core || '#fff8c0']
      ].forEach(function (st) {
        c.strokeStyle = st[1];
        c.lineWidth = st[0];
        c.beginPath();
        b.pts.forEach(function (p, i) {
          if (!i) {
            c.moveTo(p[0], p[1]);
            return;
          }
          var q = b.pts[i - 1];
          for (var s = 1; s <= 4; s++) {
            var k = s / 4;
            c.lineTo(
              q[0] + (p[0] - q[0]) * k + (s < 4 ? b.j[i * 4 + s] : 0),
              q[1] + (p[1] - q[1]) * k + (s < 4 ? b.j[i * 4 + s + 1] : 0)
            );
          }
        });
        c.stroke();
      });
    });
    c.globalAlpha = 1;
    this.beams.forEach(function (b) {
      var k = b.life / b.max,
        W = b.w || 1;
      c.globalAlpha = k;
      c.lineCap = 'round';
      c.strokeStyle = b.col == 'rainbow' ? VFX.rainbow(0) : b.col || 'rgba(120,255,200,.45)';
      c.lineWidth = (16 * k + 4) * W;
      c.beginPath();
      c.moveTo(b.x, b.y);
      c.lineTo(b.x2, b.y2);
      c.stroke();
      if (W > 1.6) {
        c.strokeStyle = b.col == 'rainbow' ? VFX.rainbow(120) : 'rgba(255,255,255,.35)';
        c.lineWidth = (9 * k + 2) * W;
        c.stroke();
      }
      c.strokeStyle = b.core || '#fff';
      c.lineWidth = (4 * k + 1) * W;
      c.stroke();
    });
    c.globalAlpha = 1;
    this.ps.forEach(function (p) {
      var a = Math.min(1, (p.life / p.max) * 1.5);
      c.globalAlpha = a;
      c.fillStyle = p.color;
      var s = p.size * (0.5 + (0.5 * p.life) / p.max);
      if (p.shape == 'star') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.beginPath();
        for (var i = 0; i < 10; i++) {
          var r = i % 2 ? s * 0.45 : s,
            an = (i * Math.PI) / 5;
          c.lineTo(Math.cos(an) * r, Math.sin(an) * r);
        }
        c.fill();
        c.restore();
      } else if (p.shape == 'heart') {
        c.save();
        c.translate(p.x, p.y);
        c.scale(s / 8, s / 8);
        c.beginPath();
        c.moveTo(0, 6);
        c.bezierCurveTo(-9, -1, -5, -8, 0, -3);
        c.bezierCurveTo(5, -8, 9, -1, 0, 6);
        c.fill();
        c.restore();
      } else if (p.shape == 'spark') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillRect(-s, -s * 0.2, s * 2, s * 0.4);
        c.fillRect(-s * 0.2, -s, s * 0.4, s * 2);
        c.restore();
      } else {
        c.beginPath();
        c.arc(p.x, p.y, s, 0, 7);
        c.fill();
      }
    });
    c.globalAlpha = 1;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    this.texts.forEach(function (t) {
      var k = t.life / t.max,
        sc = k > 0.8 ? 1 + (k - 0.8) * 3 : 1;
      c.globalAlpha = Math.min(1, k * 2.5);
      c.font = Math.round(t.size * sc) + 'px ' + FONT_DISPLAY;
      c.lineWidth = 3.5;
      c.strokeStyle = 'rgba(60,30,40,.85)';
      c.strokeText(t.txt, t.x, t.y);
      c.fillStyle = t.color;
      c.fillText(t.txt, t.x, t.y);
    });
    c.globalAlpha = 1;
  },
  bolt: function (pts, o) {
    o = o || {};
    var pw = o.pw || 1,
      j = [];
    for (var i = 0; i < pts.length * 4 + 4; i++) j.push((Math.random() - 0.5) * (14 + pw * 1.5));
    this.bolts.push({
      pts: pts,
      j: j,
      life: 0.22 + pw * 0.015,
      max: 0.22 + pw * 0.015,
      w: 1 + pw * 0.18,
      col:
        o.col ||
        (pw >= 9
          ? 'rgba(255,200,255,.6)'
          : pw >= 6
            ? 'rgba(120,220,255,.6)'
            : [
                'rgba(200,170,255,.5)',
                'rgba(170,255,190,.5)',
                'rgba(120,200,255,.55)',
                'rgba(200,140,255,.6)',
                'rgba(255,215,90,.6)'
              ][Math.min(4, pw - 1)]),
      core: pw >= 5 ? '#ffffff' : '#fff8c0'
    });
  },
  beam: function (b) {
    var pw = b.pw || 1;
    this.beams.push({
      x: b.x,
      y: b.y,
      x2: b.x2,
      y2: b.y2,
      life: 0.25 + pw * 0.02,
      max: 0.25 + pw * 0.02,
      w: 1 + pw * 0.2,
      col: b.col || (pw >= 9 ? 'rainbow' : pw >= 6 ? 'rgba(140,230,255,.5)' : 'rgba(120,255,200,.45)'),
      core: b.core || '#fff'
    });
  }
};
// 补间
var Tween = {
  list: [],
  to: function (o, props, dur, ease, done) {
    var st = {};
    for (var k in props) st[k] = o[k];
    this.list.push({ o: o, st: st, p: props, d: dur, t: 0, e: ease || 'outBack', done: done });
  },
  E: {
    linear: function (k) {
      return k;
    },
    outBack: function (k) {
      var s = 1.70158;
      k -= 1;
      return k * k * ((s + 1) * k + s) + 1;
    },
    outCubic: function (k) {
      return 1 - Math.pow(1 - k, 3);
    },
    outElastic: function (k) {
      return k == 0 || k == 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * 2.094) + 1;
    }
  },
  update: function (dt) {
    this.list = this.list.filter(function (tw) {
      tw.t += dt;
      var k = Math.min(1, tw.t / tw.d),
        e = Tween.E[tw.e](k);
      for (var p in tw.p) tw.o[p] = tw.st[p] + (tw.p[p] - tw.st[p]) * e;
      if (k >= 1) {
        tw.done && tw.done();
        return false;
      }
      return true;
    });
  }
};


// ---- src/ui/vfx.js ----
/**
 * 软萌大作战 V1.0
 * 分级攻击特效：随伙伴等级（Lv1-5）/ 融合（pw6-8）/ 究极（pw9+）逐级增强
 *
 * © 2026 <著作权人>
 */
var VFX = {
  TIER: ['#ffffff', '#8ff0a0', '#6fc8ff', '#c88bff', '#ffd23f'],
  RB: ['#ff6f8f', '#ffb020', '#ffe066', '#6ee07a', '#4fc8ff', '#8a7bff', '#d07bff'],
  tierCol: function (lv) {
    return this.TIER[Math.max(0, Math.min(4, lv - 1))];
  },
  rainbow: function (o) {
    return 'hsl(' + Math.floor(((UI.t || 0) * 160 + (o || 0)) % 360) + ',95%,66%)';
  },
  // 弹道主色：基础按等级，融合按融合色，究极彩虹
  col: function (b) {
    var pw = b.pw || 1;
    if (pw >= 9) return this.rainbow(b.life * 300);
    if (pw >= 6 && b.src) return CFG.TOWERS[b.src.type].color;
    return this.tierCol(pw);
  },
  cols: function (pw, src) {
    if (pw >= 9) return this.RB;
    if (pw >= 6 && src) return [CFG.TOWERS[src.type].color, '#ffffff', '#ffd23f'];
    return [this.tierCol(pw), '#ffffff', shade(this.tierCol(pw), -0.2)];
  },
  scale: function (pw) {
    return 1 + 0.13 * (Math.min(pw, 5) - 1) + (pw > 5 ? 0.2 + (pw - 6) * 0.06 : 0) + (pw >= 9 ? 0.2 : 0);
  },
  glow: function (c, x, y, r, col, a) {
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = a == null ? 0.8 : a;
    var g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, 7);
    c.fill();
    c.restore();
  },
  // 拖尾：Lv2 起出现，Lv3 三重拖尾，Lv5 金色，融合双螺旋，究极彩虹
  trail: function (c, b) {
    var pw = b.pw || 1;
    b.tr = b.tr || [];
    b.tr.push([b.x, b.y]);
    var n = Math.min(18, 2 + pw * 2);
    while (b.tr.length > n) b.tr.shift();
    if (pw < 2 || b.tr.length < 2) return;
    var col = this.col(b),
      T = b.tr,
      w = 2 + pw * 0.9;
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.lineCap = 'round';
    var lanes = pw >= 3 && pw < 6 ? [-1, 0, 1] : [0];
    lanes.forEach(function (ln) {
      for (var i = 1; i < T.length; i++) {
        var k = i / T.length,
          dx = T[i][0] - T[i - 1][0],
          dy = T[i][1] - T[i - 1][1],
          l = Math.hypot(dx, dy) || 1,
          ox = (-dy / l) * ln * 3 * (1 - k),
          oy = (dx / l) * ln * 3 * (1 - k);
        c.globalAlpha = k * (ln ? 0.45 : 0.8);
        c.strokeStyle = col;
        c.lineWidth = w * k * (ln ? 0.5 : 1);
        c.beginPath();
        c.moveTo(T[i - 1][0] + ox, T[i - 1][1] + oy);
        c.lineTo(T[i][0] + ox, T[i][1] + oy);
        c.stroke();
      }
    });
    if (pw >= 6) {
      var c2 = pw >= 9 ? this.rainbow(180) : '#ffffff';
      for (var j = 1; j < T.length; j++) {
        var ph = b.life * 30 + j;
        [1, -1].forEach(function (s) {
          c.globalAlpha = (j / T.length) * 0.7;
          c.strokeStyle = s > 0 ? col : c2;
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(T[j - 1][0] + Math.sin(ph - 1) * 4 * s, T[j - 1][1] + Math.cos(ph - 1) * 4 * s);
          c.lineTo(T[j][0] + Math.sin(ph) * 4 * s, T[j][1] + Math.cos(ph) * 4 * s);
          c.stroke();
        });
      }
    }
    c.restore();
    if (pw >= 4 && Math.random() < 0.25 + pw * 0.04)
      FX.burst(b.x, b.y, 1, {
        colors: this.cols(pw, b.src),
        shape: pw >= 5 ? 'star' : 'spark',
        speed: 25,
        size: 2 + pw * 0.35,
        g: 0,
        life: 0.35
      });
  },
  muzzle: function (x, y, ang, pw, src) {
    var cs = this.cols(pw, src),
      n = 2 + pw * 2;
    FX.burst(x + Math.cos(ang || 0) * 4, y + Math.sin(ang || 0) * 4, FX.ps.length > 200 ? 2 : Math.min(12, n), {
      colors: cs,
      shape: pw >= 5 ? 'star' : 'spark',
      speed: 40 + Math.min(pw, 7) * 10,
      size: 2.6 + Math.min(pw, 7) * 0.35,
      g: 0,
      life: 0.18 + Math.min(pw, 7) * 0.015
    });
    if (pw >= 3)
      FX.ring(x + Math.cos(ang || 0) * 3, y + Math.sin(ang || 0) * 3, 6 + Math.min(pw, 7) * 2, cs[0], 0.2 + pw * 0.015);
    if (pw >= 9) FX.ring(x, y, 34, cs[(Math.random() * 7) | 0], 0.35);
  },
  impact: function (x, y, pw, src, base) {
    pw = pw || 1;
    var cs = base ? [base].concat(this.cols(pw, src)) : this.cols(pw, src);
    var busy = FX.ps.length > 260;
    FX.burst(x, y, busy ? 3 : Math.min(30, 4 + pw * 2.5), {
      colors: cs,
      shape: pw >= 4 ? 'star' : 'spark',
      speed: 60 + pw * 14,
      size: 3 + pw * 0.5,
      g: pw >= 5 ? 0 : 80,
      life: 0.3 + pw * 0.03
    });
    if (pw >= 2) FX.ring(x, y, 8 + pw * 3.2, cs[0], 0.22 + pw * 0.02);
    if (pw >= 6) FX.ring(x, y, 14 + pw * 3, '#ffffff', 0.3);
    if (pw >= 5) FX.shake = Math.max(FX.shake, Math.min(4, (pw - 4) * 0.9));
    if (pw >= 9) FX.flash = Math.max(FX.flash, 0.06);
  }
};


// ---- src/ui/audio.js ----
/**
 * 软萌大作战 V1.2
 * 音效与 BGM：界面音效使用 assets/sfx 采样（Kenney，CC0），战斗高频音效与 BGM 为 WebAudio 程序化合成
 *
 * © 2026 <著作权人>
 */
var Sfx = {
  ctx: null,
  master: null,
  muted: false,
  vol: 0.7,
  bgmOn: false,
  init: function () {
    if (this.ctx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.vol;
      this.master.connect(this.ctx.destination);
      this.loadSamples();
    } catch (e) {}
  },
  /** 采样音效（界面、结算类），加载失败时自动回退到程序化音效 */
  SAMPLES: ['click', 'card', 'pop', 'coin', 'merge', 'buy', 'leak', 'boss', 'legend', 'win', 'lose'],
  buf: {},
  loadSamples: function () {
    var self = this;
    this.SAMPLES.forEach(function (n) {
      var path = 'assets/sfx/' + n + '.mp3',
        done = function (ab) {
          try {
            self.ctx.decodeAudioData(
              ab,
              function (b) {
                self.buf[n] = b;
              },
              function () {}
            );
          } catch (e) {}
        };
      try {
        var api = typeof tt !== 'undefined' ? tt : wx;
        api.getFileSystemManager().readFile({
          filePath: path,
          success: function (r) {
            done(r.data);
          }
        });
      } catch (e) {}
    });
  },
  playBuf: function (n, vol) {
    var c = this.ctx,
      s = c.createBufferSource(),
      g = c.createGain();
    s.buffer = this.buf[n];
    g.gain.value = vol || 0.7;
    s.connect(g);
    g.connect(this.master);
    s.start();
  },
  setMute: function (m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.vol;
    if (this.bgmGain && this.ctx) {
      var t0 = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(t0);
      this.bgmGain.gain.setValueAtTime(m ? 0 : 0.55, t0);
    }
  },
  setVol: function (v) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.master && !this.muted) this.master.gain.value = this.vol;
  },
  tone: function (f, dur, type, vol, slide, delay) {
    if (!this.ctx || this.muted) return;
    var c = this.ctx,
      t = c.currentTime + (delay || 0),
      o = c.createOscillator(),
      g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  },
  noise: function (dur, vol) {
    if (!this.ctx || this.muted) return;
    var c = this.ctx,
      b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate),
      d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var s = c.createBufferSource(),
      g = c.createGain(),
      f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900;
    s.buffer = b;
    g.gain.value = vol || 0.3;
    s.connect(f);
    f.connect(g);
    g.connect(this.master);
    s.start();
  },
  _last: {},
  rl: function (k, ms) {
    var n = Date.now();
    if (this._last[k] && n - this._last[k] < ms) return false;
    this._last[k] = n;
    return true;
  },
  play: function (n) {
    var s = this;
    if (this.ctx && !this.muted && this.buf[n]) {
      if (this.rl('b' + n, 50)) this.playBuf(n, n == 'coin' || n == 'pop' ? 0.45 : 0.7);
      return;
    }
    switch (n) {
      case 'click':
        s.tone(880, 0.07, 'triangle', 0.15, 1.5);
        break;
      case 'shoot':
        if (s.rl('shoot', 60)) s.tone(1200 + Math.random() * 300, 0.05, 'square', 0.03, 0.5);
        break;
      case 'hit':
        if (s.rl('hit', 50)) s.tone(300, 0.06, 'triangle', 0.06, 0.6);
        break;
      case 'pop':
        if (s.rl('pop', 40)) s.tone(500 + Math.random() * 200, 0.12, 'sine', 0.14, 2.2);
        break;
      case 'boom':
        if (s.rl('boom', 80)) {
          s.noise(0.25, 0.25);
          s.tone(120, 0.25, 'sine', 0.25, 0.4);
        }
        break;
      case 'zap':
        if (s.rl('zap', 80)) s.tone(1500, 0.12, 'sawtooth', 0.05, 0.3);
        break;
      case 'coin':
        if (s.rl('coin', 60)) {
          s.tone(1320, 0.06, 'square', 0.05);
          s.tone(1760, 0.1, 'square', 0.05, 1, 0.05);
        }
        break;
      case 'merge':
        [523, 659, 784, 1046].forEach(function (f, i) {
          s.tone(f, 0.15, 'triangle', 0.15, 1, i * 0.06);
        });
        break;
      case 'buy':
        s.tone(660, 0.08, 'triangle', 0.15);
        s.tone(990, 0.12, 'triangle', 0.15, 1, 0.07);
        break;
      case 'leak':
        s.tone(200, 0.3, 'sawtooth', 0.12, 0.5);
        break;
      case 'boss':
        [110, 104, 98].forEach(function (f, i) {
          s.tone(f, 0.4, 'sawtooth', 0.15, 1, i * 0.35);
        });
        break;
      case 'card':
        s.tone(784, 0.1, 'sine', 0.12);
        s.tone(1175, 0.18, 'sine', 0.12, 1, 0.08);
        break;
      case 'legend':
        [784, 988, 1175, 1568].forEach(function (f, i) {
          s.tone(f, 0.25, 'triangle', 0.13, 1, i * 0.08);
        });
        break;
      case 'win':
        [523, 659, 784, 659, 784, 1046].forEach(function (f, i) {
          s.tone(f, 0.2, 'triangle', 0.15, 1, i * 0.12);
        });
        break;
      case 'lose':
        [392, 330, 262, 196].forEach(function (f, i) {
          s.tone(f, 0.3, 'triangle', 0.15, 1, i * 0.18);
        });
        break;
      case 'place':
        s.tone(520, 0.06, 'triangle', 0.1);
        s.tone(780, 0.1, 'triangle', 0.1, 1, 0.05);
        break;
      case 'wave':
        s.tone(300, 0.15, 'sawtooth', 0.08, 1.4);
        s.tone(450, 0.2, 'triangle', 0.1, 1, 0.12);
        break;
      case 'upgrade':
        [440, 554, 659].forEach(function (f, i) {
          s.tone(f, 0.12, 'triangle', 0.12, 1, i * 0.05);
        });
        break;
      case 'unlock':
        [523, 659, 784, 1046, 1318].forEach(function (f, i) {
          s.tone(f, 0.18, 'sine', 0.12, 1, i * 0.07);
        });
        break;
      case 'gacha':
        for (var gi = 0; gi < 6; gi++) s.tone(600 + gi * 120, 0.08, 'square', 0.06, 1, gi * 0.05);
        break;
    }
  },
  bgmScene: 'menu',
  bgmGain: null,
  bgmTimer: null,
  bgmI: 0,
  bgmFade: 1,
  /** 热切换：menu / battle，淡入淡出，跟随静音与音量 */
  bgm: function (scene) {
    this.init();
    if (!this.ctx) return;
    var next = scene || this.bgmScene || 'menu';
    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0;
      this.bgmGain.connect(this.master);
    }
    if (this.bgmOn && next == this.bgmScene) return;
    var switching = this.bgmOn && next != this.bgmScene;
    this.bgmScene = next;
    this.bgmOn = true;
    var self = this;
    if (switching) {
      // 先淡出再换曲
      this.bgmFade = 0;
      var t0 = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(t0);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, t0);
      this.bgmGain.gain.linearRampToValueAtTime(0, t0 + 0.35);
      setTimeout(function () {
        self.bgmI = 0;
        self._bgmFadeIn();
      }, 360);
    } else {
      this.bgmI = 0;
      this._bgmFadeIn();
    }
    if (!this.bgmTimer) {
      this.bgmTimer = setInterval(function () {
        self._bgmTick();
      }, 260);
    }
  },
  _bgmFadeIn: function () {
    if (!this.bgmGain || !this.ctx) return;
    var t0 = this.ctx.currentTime,
      target = this.muted ? 0 : 0.55;
    this.bgmGain.gain.cancelScheduledValues(t0);
    this.bgmGain.gain.setValueAtTime(0, t0);
    this.bgmGain.gain.linearRampToValueAtTime(target, t0 + 0.5);
    this.bgmFade = 1;
  },
  _bgmTick: function () {
    if (!this.ctx || this.muted || document.hidden || !this.bgmOn) return;
    var battle = this.bgmScene == 'battle',
      mel = battle
        ? [0, 2, 4, 7, 4, 2, 0, 5, 4, 2, 0, 7, 5, 4, 2, 0]
        : [0, 4, 7, 9, 7, 4, 2, 4, 0, 4, 7, 12, 9, 7, 4, 2],
      bass = battle ? [0, 0, 7, 7, 5, 5, 3, 3] : [0, 0, 5, 5, 7, 7, 5, 5],
      base = battle ? 349.23 : 392,
      i = this.bgmI++,
      n = mel[i % 16],
      vol = 0.04 * (this.bgmFade || 1);
    this._bgmTone(base * Math.pow(2, n / 12), 0.22, 'triangle', vol);
    if (i % 2 == 0) this._bgmTone((base / 4) * Math.pow(2, bass[(i / 2) % 8] / 12), 0.4, 'sine', vol * 1.3);
  },
  _bgmTone: function (f, dur, type, vol) {
    if (!this.ctx || !this.bgmGain || this.muted) return;
    var c = this.ctx,
      t = c.currentTime,
      o = c.createOscillator(),
      g = c.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.03, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.bgmGain);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
};


// ---- assets/atlas.js ----
// 自动生成：精灵图集索引 [页,x,y,w,h,类别]
var ATLAS={pages:11,frames:{"U:u_cosmos_0":[0,0,0,340,309,"ult"],"U:u_cosmos_h":[0,342,0,340,309,"ult"],"U:u_gaia_0":[0,684,0,340,309,"ult"],"U:u_gaia_h":[0,1026,0,340,309,"ult"],"U:u_phoenix_0":[0,1368,0,340,309,"ult"],"U:u_phoenix_h":[0,0,311,340,309,"ult"],"U:u_raijin_0":[0,342,311,340,309,"ult"],"U:u_raijin_h":[0,684,311,340,309,"ult"],"U:u_skyhunter_0":[0,1026,311,340,309,"ult"],"U:u_skyhunter_h":[0,1368,311,340,309,"ult"],"U:u_verdant_0":[0,0,622,340,309,"ult"],"U:u_verdant_h":[0,342,622,340,309,"ult"],"U:h_captain_0":[0,684,622,260,300,"tower"],"U:h_fortune_0":[0,946,622,260,300,"tower"],"U:h_princess_0":[0,1208,622,260,300,"tower"],"U:h_thunder_0":[0,1470,622,260,300,"tower"],"U:s_bear_panda_1_0":[0,1732,622,260,300,"tower"],"U:s_bear_panda_2_0":[0,0,933,260,300,"tower"],"U:s_bear_panda_3_0":[0,262,933,260,300,"tower"],"U:s_bunny_choco_1_0":[0,524,933,260,300,"tower"],"U:s_bunny_choco_2_0":[0,786,933,260,300,"tower"],"U:s_bunny_choco_3_0":[0,1048,933,260,300,"tower"],"U:s_cat_black_1_0":[0,1310,933,260,300,"tower"],"U:s_cat_black_2_0":[0,1572,933,260,300,"tower"],"U:s_cat_black_3_0":[0,0,1235,260,300,"tower"],"U:t_bear_1_0":[0,262,1235,260,300,"tower"],"U:t_bear_2_0":[0,524,1235,260,300,"tower"],"U:t_bear_3_0":[0,786,1235,260,300,"tower"],"U:t_bear_4A_0":[0,1048,1235,260,300,"tower"],"U:t_bear_4B_0":[0,1310,1235,260,300,"tower"],"U:t_bear_5A_0":[0,1572,1235,260,300,"tower"],"U:t_bear_5B_0":[0,0,1537,260,300,"tower"],"U:t_bunny_1_0":[0,262,1537,260,300,"tower"],"U:t_bunny_2_0":[0,524,1537,260,300,"tower"],"U:t_bunny_3_0":[0,786,1537,260,300,"tower"],"U:t_bunny_4A_0":[0,1048,1537,260,300,"tower"],"U:t_bunny_4B_0":[0,1310,1537,260,300,"tower"],"U:t_bunny_5A_0":[0,1572,1537,260,300,"tower"],"U:t_bunny_5B_0":[1,0,0,260,300,"tower"],"U:t_cat_1_0":[1,262,0,260,300,"tower"],"U:t_cat_2_0":[1,524,0,260,300,"tower"],"U:t_cat_3_0":[1,786,0,260,300,"tower"],"U:t_cat_4A_0":[1,1048,0,260,300,"tower"],"U:t_cat_4B_0":[1,1310,0,260,300,"tower"],"U:t_cat_5A_0":[1,1572,0,260,300,"tower"],"U:t_cat_5B_0":[1,0,302,260,300,"tower"],"U:t_chick_1_0":[1,262,302,260,300,"tower"],"U:t_chick_2_0":[1,524,302,260,300,"tower"],"U:t_chick_3_0":[1,786,302,260,300,"tower"],"U:t_chick_4A_0":[1,1048,302,260,300,"tower"],"U:t_chick_4B_0":[1,1310,302,260,300,"tower"],"U:t_chick_5A_0":[1,1572,302,260,300,"tower"],"U:t_chick_5B_0":[1,0,604,260,300,"tower"],"U:t_deer_1_0":[1,262,604,260,300,"tower"],"U:t_deer_2_0":[1,524,604,260,300,"tower"],"U:t_deer_3_0":[1,786,604,260,300,"tower"],"U:t_deer_4A_0":[1,1048,604,260,300,"tower"],"U:t_deer_4B_0":[1,1310,604,260,300,"tower"],"U:t_deer_5A_0":[1,1572,604,260,300,"tower"],"U:t_deer_5B_0":[1,0,906,260,300,"tower"],"U:t_dragon_1_0":[1,262,906,260,300,"tower"],"U:t_dragon_2_0":[1,524,906,260,300,"tower"],"U:t_dragon_3_0":[1,786,906,260,300,"tower"],"U:t_dragon_4A_0":[1,1048,906,260,300,"tower"],"U:t_dragon_4B_0":[1,1310,906,260,300,"tower"],"U:t_dragon_5A_0":[1,1572,906,260,300,"tower"],"U:t_dragon_5B_0":[1,0,1208,260,300,"tower"],"U:t_fox_1_0":[1,262,1208,260,300,"tower"],"U:t_fox_2_0":[1,524,1208,260,300,"tower"],"U:t_fox_3_0":[1,786,1208,260,300,"tower"],"U:t_fox_4A_0":[1,1048,1208,260,300,"tower"],"U:t_fox_4B_0":[1,1310,1208,260,300,"tower"],"U:t_fox_5A_0":[1,1572,1208,260,300,"tower"],"U:t_fox_5B_0":[1,0,1510,260,300,"tower"],"U:t_frog_1_0":[1,262,1510,260,300,"tower"],"U:t_frog_2_0":[1,524,1510,260,300,"tower"],"U:t_frog_3_0":[1,786,1510,260,300,"tower"],"U:t_frog_4A_0":[1,1048,1510,260,300,"tower"],"U:t_frog_4B_0":[1,1310,1510,260,300,"tower"],"U:t_frog_5A_0":[1,1572,1510,260,300,"tower"],"U:t_frog_5B_0":[2,0,0,260,300,"tower"],"U:t_hamster_1_0":[2,262,0,260,300,"tower"],"U:t_hamster_2_0":[2,524,0,260,300,"tower"],"U:t_hamster_3_0":[2,786,0,260,300,"tower"],"U:t_hamster_4A_0":[2,1048,0,260,300,"tower"],"U:t_hamster_4B_0":[2,1310,0,260,300,"tower"],"U:t_hamster_5A_0":[2,1572,0,260,300,"tower"],"U:t_hamster_5B_0":[2,0,302,260,300,"tower"],"U:t_hedgehog_1_0":[2,262,302,260,300,"tower"],"U:t_hedgehog_2_0":[2,524,302,260,300,"tower"],"U:t_hedgehog_3_0":[2,786,302,260,300,"tower"],"U:t_hedgehog_4A_0":[2,1048,302,260,300,"tower"],"U:t_hedgehog_4B_0":[2,1310,302,260,300,"tower"],"U:t_hedgehog_5A_0":[2,1572,302,260,300,"tower"],"U:t_hedgehog_5B_0":[2,0,604,260,300,"tower"],"U:t_koala_1_0":[2,262,604,260,300,"tower"],"U:t_koala_2_0":[2,524,604,260,300,"tower"],"U:t_koala_3_0":[2,786,604,260,300,"tower"],"U:t_koala_4A_0":[2,1048,604,260,300,"tower"],"U:t_koala_4B_0":[2,1310,604,260,300,"tower"],"U:t_koala_5A_0":[2,1572,604,260,300,"tower"],"U:t_koala_5B_0":[2,0,906,260,300,"tower"],"U:t_owl_1_0":[2,262,906,260,300,"tower"],"U:t_owl_2_0":[2,524,906,260,300,"tower"],"U:t_owl_3_0":[2,786,906,260,300,"tower"],"U:t_owl_4A_0":[2,1048,906,260,300,"tower"],"U:t_owl_4B_0":[2,1310,906,260,300,"tower"],"U:t_owl_5A_0":[2,1572,906,260,300,"tower"],"U:t_owl_5B_0":[2,0,1208,260,300,"tower"],"U:t_penguin_1_0":[2,262,1208,260,300,"tower"],"U:t_penguin_2_0":[2,524,1208,260,300,"tower"],"U:t_penguin_3_0":[2,786,1208,260,300,"tower"],"U:t_penguin_4A_0":[2,1048,1208,260,300,"tower"],"U:t_penguin_4B_0":[2,1310,1208,260,300,"tower"],"U:t_penguin_5A_0":[2,1572,1208,260,300,"tower"],"U:t_penguin_5B_0":[2,0,1510,260,300,"tower"],"U:t_pig_1_0":[2,262,1510,260,300,"tower"],"U:t_pig_2_0":[2,524,1510,260,300,"tower"],"U:t_pig_3_0":[2,786,1510,260,300,"tower"],"U:t_pig_4A_0":[2,1048,1510,260,300,"tower"],"U:t_pig_4B_0":[2,1310,1510,260,300,"tower"],"U:t_pig_5A_0":[2,1572,1510,260,300,"tower"],"U:t_pig_5B_0":[3,0,0,260,300,"tower"],"U:t_sheep_1_0":[3,262,0,260,300,"tower"],"U:t_sheep_2_0":[3,524,0,260,300,"tower"],"U:t_sheep_3_0":[3,786,0,260,300,"tower"],"U:t_sheep_4A_0":[3,1048,0,260,300,"tower"],"U:t_sheep_4B_0":[3,1310,0,260,300,"tower"],"U:t_sheep_5A_0":[3,1572,0,260,300,"tower"],"U:t_sheep_5B_0":[3,0,302,260,300,"tower"],"U:t_unicorn_1_0":[3,262,302,260,300,"tower"],"U:t_unicorn_2_0":[3,524,302,260,300,"tower"],"U:t_unicorn_3_0":[3,786,302,260,300,"tower"],"U:t_unicorn_4A_0":[3,1048,302,260,300,"tower"],"U:t_unicorn_4B_0":[3,1310,302,260,300,"tower"],"U:t_unicorn_5A_0":[3,1572,302,260,300,"tower"],"U:t_unicorn_5B_0":[3,0,604,260,300,"tower"],"U:f_bliss_1_0":[3,262,604,300,289,"fusion"],"U:f_bliss_2_0":[3,564,604,300,289,"fusion"],"U:f_bliss_3_0":[3,866,604,300,289,"fusion"],"U:f_frostbeam_1_0":[3,1168,604,300,289,"fusion"],"U:f_frostbeam_2_0":[3,1470,604,300,289,"fusion"],"U:f_frostbeam_3_0":[3,0,906,300,289,"fusion"],"U:f_hawkeye_1_0":[3,302,906,300,289,"fusion"],"U:f_hawkeye_2_0":[3,604,906,300,289,"fusion"],"U:f_hawkeye_3_0":[3,906,906,300,289,"fusion"],"U:f_inferno_1_0":[3,1208,906,300,289,"fusion"],"U:f_inferno_2_0":[3,1510,906,300,289,"fusion"],"U:f_inferno_3_0":[3,0,1197,300,289,"fusion"],"U:f_magspike_1_0":[3,302,1197,300,289,"fusion"],"U:f_magspike_2_0":[3,604,1197,300,289,"fusion"],"U:f_magspike_3_0":[3,906,1197,300,289,"fusion"],"U:f_naturesong_1_0":[3,1208,1197,300,289,"fusion"],"U:f_naturesong_2_0":[3,1510,1197,300,289,"fusion"],"U:f_naturesong_3_0":[3,0,1488,300,289,"fusion"],"U:f_plague_1_0":[3,302,1488,300,289,"fusion"],"U:f_plague_2_0":[3,604,1488,300,289,"fusion"],"U:f_plague_3_0":[3,906,1488,300,289,"fusion"],"U:f_rocketfire_1_0":[3,1208,1488,300,289,"fusion"],"U:f_rocketfire_2_0":[3,1510,1488,300,289,"fusion"],"U:f_rocketfire_3_0":[4,0,0,300,289,"fusion"],"U:f_starlight_1_0":[4,302,0,300,289,"fusion"],"U:f_starlight_2_0":[4,604,0,300,289,"fusion"],"U:f_starlight_3_0":[4,906,0,300,289,"fusion"],"U:f_superconduct_1_0":[4,1208,0,300,289,"fusion"],"U:f_superconduct_2_0":[4,1510,0,300,289,"fusion"],"U:f_superconduct_3_0":[4,0,291,300,289,"fusion"],"U:f_thornmail_1_0":[4,302,291,300,289,"fusion"],"U:f_thornmail_2_0":[4,604,291,300,289,"fusion"],"U:f_thornmail_3_0":[4,906,291,300,289,"fusion"],"U:f_toxfire_1_0":[4,1208,291,300,289,"fusion"],"U:f_toxfire_2_0":[4,1510,291,300,289,"fusion"],"U:f_toxfire_3_0":[4,0,582,300,289,"fusion"],"u_cosmos_0":[4,302,582,210,191,"ult"],"u_cosmos_a":[4,514,582,210,191,"ult"],"u_cosmos_h":[4,726,582,210,191,"ult"],"u_cosmos_r":[4,938,582,210,191,"ult"],"u_cosmos_w":[4,1150,582,210,191,"ult"],"u_gaia_0":[4,1362,582,210,191,"ult"],"u_gaia_a":[4,1574,582,210,191,"ult"],"u_gaia_h":[4,1786,582,210,191,"ult"],"u_gaia_r":[4,0,873,210,191,"ult"],"u_gaia_w":[4,212,873,210,191,"ult"],"u_phoenix_0":[4,424,873,210,191,"ult"],"u_phoenix_a":[4,636,873,210,191,"ult"],"u_phoenix_h":[4,848,873,210,191,"ult"],"u_phoenix_r":[4,1060,873,210,191,"ult"],"u_phoenix_w":[4,1272,873,210,191,"ult"],"u_raijin_0":[4,1484,873,210,191,"ult"],"u_raijin_a":[4,1696,873,210,191,"ult"],"u_raijin_h":[4,0,1066,210,191,"ult"],"u_raijin_r":[4,212,1066,210,191,"ult"],"u_raijin_w":[4,424,1066,210,191,"ult"],"u_skyhunter_0":[4,636,1066,210,191,"ult"],"u_skyhunter_a":[4,848,1066,210,191,"ult"],"u_skyhunter_h":[4,1060,1066,210,191,"ult"],"u_skyhunter_r":[4,1272,1066,210,191,"ult"],"u_skyhunter_w":[4,1484,1066,210,191,"ult"],"u_verdant_0":[4,1696,1066,210,191,"ult"],"u_verdant_a":[4,0,1259,210,191,"ult"],"u_verdant_h":[4,212,1259,210,191,"ult"],"u_verdant_r":[4,424,1259,210,191,"ult"],"u_verdant_w":[4,636,1259,210,191,"ult"],"U:e_bat_0":[4,848,1259,220,187,"enemy"],"U:e_bomb_0":[4,1070,1259,220,187,"enemy"],"U:e_fast_0":[4,1292,1259,220,187,"enemy"],"U:e_flying_0":[4,1514,1259,220,187,"enemy"],"U:e_frost_0":[4,1736,1259,220,187,"enemy"],"U:e_ghost_0":[4,0,1452,220,187,"enemy"],"U:e_ghostking_0":[4,222,1452,220,187,"enemy"],"U:e_healer_0":[4,444,1452,220,187,"enemy"],"U:e_jelly_0":[4,666,1452,220,187,"enemy"],"U:e_king_0":[4,888,1452,220,187,"enemy"],"U:e_magma_0":[4,1110,1452,220,187,"enemy"],"U:e_mini_0":[4,1332,1452,220,187,"enemy"],"U:e_normal_0":[4,1554,1452,220,187,"enemy"],"U:e_shield_0":[4,1776,1452,220,187,"enemy"],"U:e_splitter_0":[4,0,1641,220,187,"enemy"],"U:e_star_0":[4,222,1641,220,187,"enemy"],"U:e_tank_0":[4,444,1641,220,187,"enemy"],"U:e_turtle_0":[4,666,1641,220,187,"enemy"],"f_bliss_1_0":[4,888,1641,180,173,"fusion"],"f_bliss_1_a":[4,1070,1641,180,173,"fusion"],"f_bliss_1_h":[4,1252,1641,180,173,"fusion"],"f_bliss_1_r":[4,1434,1641,180,173,"fusion"],"f_bliss_1_w":[4,1616,1641,180,173,"fusion"],"f_bliss_2_0":[4,1798,1641,180,173,"fusion"],"f_bliss_2_a":[4,0,1830,180,173,"fusion"],"f_bliss_2_h":[4,182,1830,180,173,"fusion"],"f_bliss_2_r":[4,364,1830,180,173,"fusion"],"f_bliss_2_w":[4,546,1830,180,173,"fusion"],"f_bliss_3_0":[4,728,1830,180,173,"fusion"],"f_bliss_3_a":[4,910,1830,180,173,"fusion"],"f_bliss_3_h":[4,1092,1830,180,173,"fusion"],"f_bliss_3_r":[4,1274,1830,180,173,"fusion"],"f_bliss_3_w":[4,1456,1830,180,173,"fusion"],"f_frostbeam_1_0":[4,1638,1830,180,173,"fusion"],"f_frostbeam_1_a":[4,1820,1830,180,173,"fusion"],"f_frostbeam_1_h":[5,0,0,180,173,"fusion"],"f_frostbeam_1_r":[5,182,0,180,173,"fusion"],"f_frostbeam_1_w":[5,364,0,180,173,"fusion"],"f_frostbeam_2_0":[5,546,0,180,173,"fusion"],"f_frostbeam_2_a":[5,728,0,180,173,"fusion"],"f_frostbeam_2_h":[5,910,0,180,173,"fusion"],"f_frostbeam_2_r":[5,1092,0,180,173,"fusion"],"f_frostbeam_2_w":[5,1274,0,180,173,"fusion"],"f_frostbeam_3_0":[5,1456,0,180,173,"fusion"],"f_frostbeam_3_a":[5,1638,0,180,173,"fusion"],"f_frostbeam_3_h":[5,1820,0,180,173,"fusion"],"f_frostbeam_3_r":[5,0,175,180,173,"fusion"],"f_frostbeam_3_w":[5,182,175,180,173,"fusion"],"f_hawkeye_1_0":[5,364,175,180,173,"fusion"],"f_hawkeye_1_a":[5,546,175,180,173,"fusion"],"f_hawkeye_1_h":[5,728,175,180,173,"fusion"],"f_hawkeye_1_r":[5,910,175,180,173,"fusion"],"f_hawkeye_1_w":[5,1092,175,180,173,"fusion"],"f_hawkeye_2_0":[5,1274,175,180,173,"fusion"],"f_hawkeye_2_a":[5,1456,175,180,173,"fusion"],"f_hawkeye_2_h":[5,1638,175,180,173,"fusion"],"f_hawkeye_2_r":[5,1820,175,180,173,"fusion"],"f_hawkeye_2_w":[5,0,350,180,173,"fusion"],"f_hawkeye_3_0":[5,182,350,180,173,"fusion"],"f_hawkeye_3_a":[5,364,350,180,173,"fusion"],"f_hawkeye_3_h":[5,546,350,180,173,"fusion"],"f_hawkeye_3_r":[5,728,350,180,173,"fusion"],"f_hawkeye_3_w":[5,910,350,180,173,"fusion"],"f_inferno_1_0":[5,1092,350,180,173,"fusion"],"f_inferno_1_a":[5,1274,350,180,173,"fusion"],"f_inferno_1_h":[5,1456,350,180,173,"fusion"],"f_inferno_1_r":[5,1638,350,180,173,"fusion"],"f_inferno_1_w":[5,1820,350,180,173,"fusion"],"f_inferno_2_0":[5,0,525,180,173,"fusion"],"f_inferno_2_a":[5,182,525,180,173,"fusion"],"f_inferno_2_h":[5,364,525,180,173,"fusion"],"f_inferno_2_r":[5,546,525,180,173,"fusion"],"f_inferno_2_w":[5,728,525,180,173,"fusion"],"f_inferno_3_0":[5,910,525,180,173,"fusion"],"f_inferno_3_a":[5,1092,525,180,173,"fusion"],"f_inferno_3_h":[5,1274,525,180,173,"fusion"],"f_inferno_3_r":[5,1456,525,180,173,"fusion"],"f_inferno_3_w":[5,1638,525,180,173,"fusion"],"f_magspike_1_0":[5,1820,525,180,173,"fusion"],"f_magspike_1_a":[5,0,700,180,173,"fusion"],"f_magspike_1_h":[5,182,700,180,173,"fusion"],"f_magspike_1_r":[5,364,700,180,173,"fusion"],"f_magspike_1_w":[5,546,700,180,173,"fusion"],"f_magspike_2_0":[5,728,700,180,173,"fusion"],"f_magspike_2_a":[5,910,700,180,173,"fusion"],"f_magspike_2_h":[5,1092,700,180,173,"fusion"],"f_magspike_2_r":[5,1274,700,180,173,"fusion"],"f_magspike_2_w":[5,1456,700,180,173,"fusion"],"f_magspike_3_0":[5,1638,700,180,173,"fusion"],"f_magspike_3_a":[5,1820,700,180,173,"fusion"],"f_magspike_3_h":[5,0,875,180,173,"fusion"],"f_magspike_3_r":[5,182,875,180,173,"fusion"],"f_magspike_3_w":[5,364,875,180,173,"fusion"],"f_naturesong_1_0":[5,546,875,180,173,"fusion"],"f_naturesong_1_a":[5,728,875,180,173,"fusion"],"f_naturesong_1_h":[5,910,875,180,173,"fusion"],"f_naturesong_1_r":[5,1092,875,180,173,"fusion"],"f_naturesong_1_w":[5,1274,875,180,173,"fusion"],"f_naturesong_2_0":[5,1456,875,180,173,"fusion"],"f_naturesong_2_a":[5,1638,875,180,173,"fusion"],"f_naturesong_2_h":[5,1820,875,180,173,"fusion"],"f_naturesong_2_r":[5,0,1050,180,173,"fusion"],"f_naturesong_2_w":[5,182,1050,180,173,"fusion"],"f_naturesong_3_0":[5,364,1050,180,173,"fusion"],"f_naturesong_3_a":[5,546,1050,180,173,"fusion"],"f_naturesong_3_h":[5,728,1050,180,173,"fusion"],"f_naturesong_3_r":[5,910,1050,180,173,"fusion"],"f_naturesong_3_w":[5,1092,1050,180,173,"fusion"],"f_plague_1_0":[5,1274,1050,180,173,"fusion"],"f_plague_1_a":[5,1456,1050,180,173,"fusion"],"f_plague_1_h":[5,1638,1050,180,173,"fusion"],"f_plague_1_r":[5,1820,1050,180,173,"fusion"],"f_plague_1_w":[5,0,1225,180,173,"fusion"],"f_plague_2_0":[5,182,1225,180,173,"fusion"],"f_plague_2_a":[5,364,1225,180,173,"fusion"],"f_plague_2_h":[5,546,1225,180,173,"fusion"],"f_plague_2_r":[5,728,1225,180,173,"fusion"],"f_plague_2_w":[5,910,1225,180,173,"fusion"],"f_plague_3_0":[5,1092,1225,180,173,"fusion"],"f_plague_3_a":[5,1274,1225,180,173,"fusion"],"f_plague_3_h":[5,1456,1225,180,173,"fusion"],"f_plague_3_r":[5,1638,1225,180,173,"fusion"],"f_plague_3_w":[5,1820,1225,180,173,"fusion"],"f_rocketfire_1_0":[5,0,1400,180,173,"fusion"],"f_rocketfire_1_a":[5,182,1400,180,173,"fusion"],"f_rocketfire_1_h":[5,364,1400,180,173,"fusion"],"f_rocketfire_1_r":[5,546,1400,180,173,"fusion"],"f_rocketfire_1_w":[5,728,1400,180,173,"fusion"],"f_rocketfire_2_0":[5,910,1400,180,173,"fusion"],"f_rocketfire_2_a":[5,1092,1400,180,173,"fusion"],"f_rocketfire_2_h":[5,1274,1400,180,173,"fusion"],"f_rocketfire_2_r":[5,1456,1400,180,173,"fusion"],"f_rocketfire_2_w":[5,1638,1400,180,173,"fusion"],"f_rocketfire_3_0":[5,1820,1400,180,173,"fusion"],"f_rocketfire_3_a":[5,0,1575,180,173,"fusion"],"f_rocketfire_3_h":[5,182,1575,180,173,"fusion"],"f_rocketfire_3_r":[5,364,1575,180,173,"fusion"],"f_rocketfire_3_w":[5,546,1575,180,173,"fusion"],"f_starlight_1_0":[5,728,1575,180,173,"fusion"],"f_starlight_1_a":[5,910,1575,180,173,"fusion"],"f_starlight_1_h":[5,1092,1575,180,173,"fusion"],"f_starlight_1_r":[5,1274,1575,180,173,"fusion"],"f_starlight_1_w":[5,1456,1575,180,173,"fusion"],"f_starlight_2_0":[5,1638,1575,180,173,"fusion"],"f_starlight_2_a":[5,1820,1575,180,173,"fusion"],"f_starlight_2_h":[5,0,1750,180,173,"fusion"],"f_starlight_2_r":[5,182,1750,180,173,"fusion"],"f_starlight_2_w":[5,364,1750,180,173,"fusion"],"f_starlight_3_0":[5,546,1750,180,173,"fusion"],"f_starlight_3_a":[5,728,1750,180,173,"fusion"],"f_starlight_3_h":[5,910,1750,180,173,"fusion"],"f_starlight_3_r":[5,1092,1750,180,173,"fusion"],"f_starlight_3_w":[5,1274,1750,180,173,"fusion"],"f_superconduct_1_0":[5,1456,1750,180,173,"fusion"],"f_superconduct_1_a":[5,1638,1750,180,173,"fusion"],"f_superconduct_1_h":[5,1820,1750,180,173,"fusion"],"f_superconduct_1_r":[6,0,0,180,173,"fusion"],"f_superconduct_1_w":[6,182,0,180,173,"fusion"],"f_superconduct_2_0":[6,364,0,180,173,"fusion"],"f_superconduct_2_a":[6,546,0,180,173,"fusion"],"f_superconduct_2_h":[6,728,0,180,173,"fusion"],"f_superconduct_2_r":[6,910,0,180,173,"fusion"],"f_superconduct_2_w":[6,1092,0,180,173,"fusion"],"f_superconduct_3_0":[6,1274,0,180,173,"fusion"],"f_superconduct_3_a":[6,1456,0,180,173,"fusion"],"f_superconduct_3_h":[6,1638,0,180,173,"fusion"],"f_superconduct_3_r":[6,1820,0,180,173,"fusion"],"f_superconduct_3_w":[6,0,175,180,173,"fusion"],"f_thornmail_1_0":[6,182,175,180,173,"fusion"],"f_thornmail_1_a":[6,364,175,180,173,"fusion"],"f_thornmail_1_h":[6,546,175,180,173,"fusion"],"f_thornmail_1_r":[6,728,175,180,173,"fusion"],"f_thornmail_1_w":[6,910,175,180,173,"fusion"],"f_thornmail_2_0":[6,1092,175,180,173,"fusion"],"f_thornmail_2_a":[6,1274,175,180,173,"fusion"],"f_thornmail_2_h":[6,1456,175,180,173,"fusion"],"f_thornmail_2_r":[6,1638,175,180,173,"fusion"],"f_thornmail_2_w":[6,1820,175,180,173,"fusion"],"f_thornmail_3_0":[6,0,350,180,173,"fusion"],"f_thornmail_3_a":[6,182,350,180,173,"fusion"],"f_thornmail_3_h":[6,364,350,180,173,"fusion"],"f_thornmail_3_r":[6,546,350,180,173,"fusion"],"f_thornmail_3_w":[6,728,350,180,173,"fusion"],"f_toxfire_1_0":[6,910,350,180,173,"fusion"],"f_toxfire_1_a":[6,1092,350,180,173,"fusion"],"f_toxfire_1_h":[6,1274,350,180,173,"fusion"],"f_toxfire_1_r":[6,1456,350,180,173,"fusion"],"f_toxfire_1_w":[6,1638,350,180,173,"fusion"],"f_toxfire_2_0":[6,1820,350,180,173,"fusion"],"f_toxfire_2_a":[6,0,525,180,173,"fusion"],"f_toxfire_2_h":[6,182,525,180,173,"fusion"],"f_toxfire_2_r":[6,364,525,180,173,"fusion"],"f_toxfire_2_w":[6,546,525,180,173,"fusion"],"f_toxfire_3_0":[6,728,525,180,173,"fusion"],"f_toxfire_3_a":[6,910,525,180,173,"fusion"],"f_toxfire_3_h":[6,1092,525,180,173,"fusion"],"f_toxfire_3_r":[6,1274,525,180,173,"fusion"],"f_toxfire_3_w":[6,1456,525,180,173,"fusion"],"h_captain_0":[6,1638,525,146,168,"tower"],"h_captain_a":[6,1786,525,146,168,"tower"],"h_fortune_0":[6,0,700,146,168,"tower"],"h_fortune_a":[6,148,700,146,168,"tower"],"h_princess_0":[6,296,700,146,168,"tower"],"h_princess_a":[6,444,700,146,168,"tower"],"h_thunder_0":[6,592,700,146,168,"tower"],"h_thunder_a":[6,740,700,146,168,"tower"],"s_bear_panda_1_0":[6,888,700,146,168,"tower"],"s_bear_panda_1_a":[6,1036,700,146,168,"tower"],"s_bear_panda_1_r":[6,1184,700,146,168,"tower"],"s_bear_panda_1_w":[6,1332,700,146,168,"tower"],"s_bear_panda_2_0":[6,1480,700,146,168,"tower"],"s_bear_panda_2_a":[6,1628,700,146,168,"tower"],"s_bear_panda_2_r":[6,1776,700,146,168,"tower"],"s_bear_panda_2_w":[6,0,870,146,168,"tower"],"s_bear_panda_3_0":[6,148,870,146,168,"tower"],"s_bear_panda_3_a":[6,296,870,146,168,"tower"],"s_bear_panda_3_r":[6,444,870,146,168,"tower"],"s_bear_panda_3_w":[6,592,870,146,168,"tower"],"s_bunny_choco_1_0":[6,740,870,146,168,"tower"],"s_bunny_choco_1_a":[6,888,870,146,168,"tower"],"s_bunny_choco_1_r":[6,1036,870,146,168,"tower"],"s_bunny_choco_1_w":[6,1184,870,146,168,"tower"],"s_bunny_choco_2_0":[6,1332,870,146,168,"tower"],"s_bunny_choco_2_a":[6,1480,870,146,168,"tower"],"s_bunny_choco_2_r":[6,1628,870,146,168,"tower"],"s_bunny_choco_2_w":[6,1776,870,146,168,"tower"],"s_bunny_choco_3_0":[6,0,1040,146,168,"tower"],"s_bunny_choco_3_a":[6,148,1040,146,168,"tower"],"s_bunny_choco_3_r":[6,296,1040,146,168,"tower"],"s_bunny_choco_3_w":[6,444,1040,146,168,"tower"],"s_cat_black_1_0":[6,592,1040,146,168,"tower"],"s_cat_black_1_a":[6,740,1040,146,168,"tower"],"s_cat_black_1_r":[6,888,1040,146,168,"tower"],"s_cat_black_1_w":[6,1036,1040,146,168,"tower"],"s_cat_black_2_0":[6,1184,1040,146,168,"tower"],"s_cat_black_2_a":[6,1332,1040,146,168,"tower"],"s_cat_black_2_r":[6,1480,1040,146,168,"tower"],"s_cat_black_2_w":[6,1628,1040,146,168,"tower"],"s_cat_black_3_0":[6,1776,1040,146,168,"tower"],"s_cat_black_3_a":[6,0,1210,146,168,"tower"],"s_cat_black_3_r":[6,148,1210,146,168,"tower"],"s_cat_black_3_w":[6,296,1210,146,168,"tower"],"t_bear_1_0":[6,444,1210,146,168,"tower"],"t_bear_1_a":[6,592,1210,146,168,"tower"],"t_bear_1_h":[6,740,1210,146,168,"tower"],"t_bear_1_r":[6,888,1210,146,168,"tower"],"t_bear_1_w":[6,1036,1210,146,168,"tower"],"t_bear_2_0":[6,1184,1210,146,168,"tower"],"t_bear_2_a":[6,1332,1210,146,168,"tower"],"t_bear_2_h":[6,1480,1210,146,168,"tower"],"t_bear_2_r":[6,1628,1210,146,168,"tower"],"t_bear_2_w":[6,1776,1210,146,168,"tower"],"t_bear_3_0":[6,0,1380,146,168,"tower"],"t_bear_3_a":[6,148,1380,146,168,"tower"],"t_bear_3_h":[6,296,1380,146,168,"tower"],"t_bear_3_r":[6,444,1380,146,168,"tower"],"t_bear_3_w":[6,592,1380,146,168,"tower"],"t_bear_4A_0":[6,740,1380,146,168,"tower"],"t_bear_4A_a":[6,888,1380,146,168,"tower"],"t_bear_4A_h":[6,1036,1380,146,168,"tower"],"t_bear_4A_r":[6,1184,1380,146,168,"tower"],"t_bear_4A_w":[6,1332,1380,146,168,"tower"],"t_bear_4B_0":[6,1480,1380,146,168,"tower"],"t_bear_4B_a":[6,1628,1380,146,168,"tower"],"t_bear_4B_h":[6,1776,1380,146,168,"tower"],"t_bear_4B_r":[6,0,1550,146,168,"tower"],"t_bear_4B_w":[6,148,1550,146,168,"tower"],"t_bear_5A_0":[6,296,1550,146,168,"tower"],"t_bear_5A_a":[6,444,1550,146,168,"tower"],"t_bear_5A_h":[6,592,1550,146,168,"tower"],"t_bear_5A_r":[6,740,1550,146,168,"tower"],"t_bear_5A_w":[6,888,1550,146,168,"tower"],"t_bear_5B_0":[6,1036,1550,146,168,"tower"],"t_bear_5B_a":[6,1184,1550,146,168,"tower"],"t_bear_5B_h":[6,1332,1550,146,168,"tower"],"t_bear_5B_r":[6,1480,1550,146,168,"tower"],"t_bear_5B_w":[6,1628,1550,146,168,"tower"],"t_bunny_1_0":[6,1776,1550,146,168,"tower"],"t_bunny_1_a":[6,0,1720,146,168,"tower"],"t_bunny_1_h":[6,148,1720,146,168,"tower"],"t_bunny_1_r":[6,296,1720,146,168,"tower"],"t_bunny_1_w":[6,444,1720,146,168,"tower"],"t_bunny_2_0":[6,592,1720,146,168,"tower"],"t_bunny_2_a":[6,740,1720,146,168,"tower"],"t_bunny_2_h":[6,888,1720,146,168,"tower"],"t_bunny_2_r":[6,1036,1720,146,168,"tower"],"t_bunny_2_w":[6,1184,1720,146,168,"tower"],"t_bunny_3_0":[6,1332,1720,146,168,"tower"],"t_bunny_3_a":[6,1480,1720,146,168,"tower"],"t_bunny_3_h":[6,1628,1720,146,168,"tower"],"t_bunny_3_r":[6,1776,1720,146,168,"tower"],"t_bunny_3_w":[7,0,0,146,168,"tower"],"t_bunny_4A_0":[7,148,0,146,168,"tower"],"t_bunny_4A_a":[7,296,0,146,168,"tower"],"t_bunny_4A_h":[7,444,0,146,168,"tower"],"t_bunny_4A_r":[7,592,0,146,168,"tower"],"t_bunny_4A_w":[7,740,0,146,168,"tower"],"t_bunny_4B_0":[7,888,0,146,168,"tower"],"t_bunny_4B_a":[7,1036,0,146,168,"tower"],"t_bunny_4B_h":[7,1184,0,146,168,"tower"],"t_bunny_4B_r":[7,1332,0,146,168,"tower"],"t_bunny_4B_w":[7,1480,0,146,168,"tower"],"t_bunny_5A_0":[7,1628,0,146,168,"tower"],"t_bunny_5A_a":[7,1776,0,146,168,"tower"],"t_bunny_5A_h":[7,0,170,146,168,"tower"],"t_bunny_5A_r":[7,148,170,146,168,"tower"],"t_bunny_5A_w":[7,296,170,146,168,"tower"],"t_bunny_5B_0":[7,444,170,146,168,"tower"],"t_bunny_5B_a":[7,592,170,146,168,"tower"],"t_bunny_5B_h":[7,740,170,146,168,"tower"],"t_bunny_5B_r":[7,888,170,146,168,"tower"],"t_bunny_5B_w":[7,1036,170,146,168,"tower"],"t_cat_1_0":[7,1184,170,146,168,"tower"],"t_cat_1_a":[7,1332,170,146,168,"tower"],"t_cat_1_h":[7,1480,170,146,168,"tower"],"t_cat_1_r":[7,1628,170,146,168,"tower"],"t_cat_1_w":[7,1776,170,146,168,"tower"],"t_cat_2_0":[7,0,340,146,168,"tower"],"t_cat_2_a":[7,148,340,146,168,"tower"],"t_cat_2_h":[7,296,340,146,168,"tower"],"t_cat_2_r":[7,444,340,146,168,"tower"],"t_cat_2_w":[7,592,340,146,168,"tower"],"t_cat_3_0":[7,740,340,146,168,"tower"],"t_cat_3_a":[7,888,340,146,168,"tower"],"t_cat_3_h":[7,1036,340,146,168,"tower"],"t_cat_3_r":[7,1184,340,146,168,"tower"],"t_cat_3_w":[7,1332,340,146,168,"tower"],"t_cat_4A_0":[7,1480,340,146,168,"tower"],"t_cat_4A_a":[7,1628,340,146,168,"tower"],"t_cat_4A_h":[7,1776,340,146,168,"tower"],"t_cat_4A_r":[7,0,510,146,168,"tower"],"t_cat_4A_w":[7,148,510,146,168,"tower"],"t_cat_4B_0":[7,296,510,146,168,"tower"],"t_cat_4B_a":[7,444,510,146,168,"tower"],"t_cat_4B_h":[7,592,510,146,168,"tower"],"t_cat_4B_r":[7,740,510,146,168,"tower"],"t_cat_4B_w":[7,888,510,146,168,"tower"],"t_cat_5A_0":[7,1036,510,146,168,"tower"],"t_cat_5A_a":[7,1184,510,146,168,"tower"],"t_cat_5A_h":[7,1332,510,146,168,"tower"],"t_cat_5A_r":[7,1480,510,146,168,"tower"],"t_cat_5A_w":[7,1628,510,146,168,"tower"],"t_cat_5B_0":[7,1776,510,146,168,"tower"],"t_cat_5B_a":[7,0,680,146,168,"tower"],"t_cat_5B_h":[7,148,680,146,168,"tower"],"t_cat_5B_r":[7,296,680,146,168,"tower"],"t_cat_5B_w":[7,444,680,146,168,"tower"],"t_chick_1_0":[7,592,680,146,168,"tower"],"t_chick_1_a":[7,740,680,146,168,"tower"],"t_chick_1_h":[7,888,680,146,168,"tower"],"t_chick_1_r":[7,1036,680,146,168,"tower"],"t_chick_1_w":[7,1184,680,146,168,"tower"],"t_chick_2_0":[7,1332,680,146,168,"tower"],"t_chick_2_a":[7,1480,680,146,168,"tower"],"t_chick_2_h":[7,1628,680,146,168,"tower"],"t_chick_2_r":[7,1776,680,146,168,"tower"],"t_chick_2_w":[7,0,850,146,168,"tower"],"t_chick_3_0":[7,148,850,146,168,"tower"],"t_chick_3_a":[7,296,850,146,168,"tower"],"t_chick_3_h":[7,444,850,146,168,"tower"],"t_chick_3_r":[7,592,850,146,168,"tower"],"t_chick_3_w":[7,740,850,146,168,"tower"],"t_chick_4A_0":[7,888,850,146,168,"tower"],"t_chick_4A_a":[7,1036,850,146,168,"tower"],"t_chick_4A_h":[7,1184,850,146,168,"tower"],"t_chick_4A_r":[7,1332,850,146,168,"tower"],"t_chick_4A_w":[7,1480,850,146,168,"tower"],"t_chick_4B_0":[7,1628,850,146,168,"tower"],"t_chick_4B_a":[7,1776,850,146,168,"tower"],"t_chick_4B_h":[7,0,1020,146,168,"tower"],"t_chick_4B_r":[7,148,1020,146,168,"tower"],"t_chick_4B_w":[7,296,1020,146,168,"tower"],"t_chick_5A_0":[7,444,1020,146,168,"tower"],"t_chick_5A_a":[7,592,1020,146,168,"tower"],"t_chick_5A_h":[7,740,1020,146,168,"tower"],"t_chick_5A_r":[7,888,1020,146,168,"tower"],"t_chick_5A_w":[7,1036,1020,146,168,"tower"],"t_chick_5B_0":[7,1184,1020,146,168,"tower"],"t_chick_5B_a":[7,1332,1020,146,168,"tower"],"t_chick_5B_h":[7,1480,1020,146,168,"tower"],"t_chick_5B_r":[7,1628,1020,146,168,"tower"],"t_chick_5B_w":[7,1776,1020,146,168,"tower"],"t_deer_1_0":[7,0,1190,146,168,"tower"],"t_deer_1_a":[7,148,1190,146,168,"tower"],"t_deer_1_h":[7,296,1190,146,168,"tower"],"t_deer_1_r":[7,444,1190,146,168,"tower"],"t_deer_1_w":[7,592,1190,146,168,"tower"],"t_deer_2_0":[7,740,1190,146,168,"tower"],"t_deer_2_a":[7,888,1190,146,168,"tower"],"t_deer_2_h":[7,1036,1190,146,168,"tower"],"t_deer_2_r":[7,1184,1190,146,168,"tower"],"t_deer_2_w":[7,1332,1190,146,168,"tower"],"t_deer_3_0":[7,1480,1190,146,168,"tower"],"t_deer_3_a":[7,1628,1190,146,168,"tower"],"t_deer_3_h":[7,1776,1190,146,168,"tower"],"t_deer_3_r":[7,0,1360,146,168,"tower"],"t_deer_3_w":[7,148,1360,146,168,"tower"],"t_deer_4A_0":[7,296,1360,146,168,"tower"],"t_deer_4A_a":[7,444,1360,146,168,"tower"],"t_deer_4A_h":[7,592,1360,146,168,"tower"],"t_deer_4A_r":[7,740,1360,146,168,"tower"],"t_deer_4A_w":[7,888,1360,146,168,"tower"],"t_deer_4B_0":[7,1036,1360,146,168,"tower"],"t_deer_4B_a":[7,1184,1360,146,168,"tower"],"t_deer_4B_h":[7,1332,1360,146,168,"tower"],"t_deer_4B_r":[7,1480,1360,146,168,"tower"],"t_deer_4B_w":[7,1628,1360,146,168,"tower"],"t_deer_5A_0":[7,1776,1360,146,168,"tower"],"t_deer_5A_a":[7,0,1530,146,168,"tower"],"t_deer_5A_h":[7,148,1530,146,168,"tower"],"t_deer_5A_r":[7,296,1530,146,168,"tower"],"t_deer_5A_w":[7,444,1530,146,168,"tower"],"t_deer_5B_0":[7,592,1530,146,168,"tower"],"t_deer_5B_a":[7,740,1530,146,168,"tower"],"t_deer_5B_h":[7,888,1530,146,168,"tower"],"t_deer_5B_r":[7,1036,1530,146,168,"tower"],"t_deer_5B_w":[7,1184,1530,146,168,"tower"],"t_dragon_1_0":[7,1332,1530,146,168,"tower"],"t_dragon_1_a":[7,1480,1530,146,168,"tower"],"t_dragon_1_h":[7,1628,1530,146,168,"tower"],"t_dragon_1_r":[7,1776,1530,146,168,"tower"],"t_dragon_1_w":[7,0,1700,146,168,"tower"],"t_dragon_2_0":[7,148,1700,146,168,"tower"],"t_dragon_2_a":[7,296,1700,146,168,"tower"],"t_dragon_2_h":[7,444,1700,146,168,"tower"],"t_dragon_2_r":[7,592,1700,146,168,"tower"],"t_dragon_2_w":[7,740,1700,146,168,"tower"],"t_dragon_3_0":[7,888,1700,146,168,"tower"],"t_dragon_3_a":[7,1036,1700,146,168,"tower"],"t_dragon_3_h":[7,1184,1700,146,168,"tower"],"t_dragon_3_r":[7,1332,1700,146,168,"tower"],"t_dragon_3_w":[7,1480,1700,146,168,"tower"],"t_dragon_4A_0":[7,1628,1700,146,168,"tower"],"t_dragon_4A_a":[7,1776,1700,146,168,"tower"],"t_dragon_4A_h":[7,0,1870,146,168,"tower"],"t_dragon_4A_r":[7,148,1870,146,168,"tower"],"t_dragon_4A_w":[7,296,1870,146,168,"tower"],"t_dragon_4B_0":[7,444,1870,146,168,"tower"],"t_dragon_4B_a":[7,592,1870,146,168,"tower"],"t_dragon_4B_h":[7,740,1870,146,168,"tower"],"t_dragon_4B_r":[7,888,1870,146,168,"tower"],"t_dragon_4B_w":[7,1036,1870,146,168,"tower"],"t_dragon_5A_0":[7,1184,1870,146,168,"tower"],"t_dragon_5A_a":[7,1332,1870,146,168,"tower"],"t_dragon_5A_h":[7,1480,1870,146,168,"tower"],"t_dragon_5A_r":[7,1628,1870,146,168,"tower"],"t_dragon_5A_w":[7,1776,1870,146,168,"tower"],"t_dragon_5B_0":[8,0,0,146,168,"tower"],"t_dragon_5B_a":[8,148,0,146,168,"tower"],"t_dragon_5B_h":[8,296,0,146,168,"tower"],"t_dragon_5B_r":[8,444,0,146,168,"tower"],"t_dragon_5B_w":[8,592,0,146,168,"tower"],"t_fox_1_0":[8,740,0,146,168,"tower"],"t_fox_1_a":[8,888,0,146,168,"tower"],"t_fox_1_h":[8,1036,0,146,168,"tower"],"t_fox_1_r":[8,1184,0,146,168,"tower"],"t_fox_1_w":[8,1332,0,146,168,"tower"],"t_fox_2_0":[8,1480,0,146,168,"tower"],"t_fox_2_a":[8,1628,0,146,168,"tower"],"t_fox_2_h":[8,1776,0,146,168,"tower"],"t_fox_2_r":[8,0,170,146,168,"tower"],"t_fox_2_w":[8,148,170,146,168,"tower"],"t_fox_3_0":[8,296,170,146,168,"tower"],"t_fox_3_a":[8,444,170,146,168,"tower"],"t_fox_3_h":[8,592,170,146,168,"tower"],"t_fox_3_r":[8,740,170,146,168,"tower"],"t_fox_3_w":[8,888,170,146,168,"tower"],"t_fox_4A_0":[8,1036,170,146,168,"tower"],"t_fox_4A_a":[8,1184,170,146,168,"tower"],"t_fox_4A_h":[8,1332,170,146,168,"tower"],"t_fox_4A_r":[8,1480,170,146,168,"tower"],"t_fox_4A_w":[8,1628,170,146,168,"tower"],"t_fox_4B_0":[8,1776,170,146,168,"tower"],"t_fox_4B_a":[8,0,340,146,168,"tower"],"t_fox_4B_h":[8,148,340,146,168,"tower"],"t_fox_4B_r":[8,296,340,146,168,"tower"],"t_fox_4B_w":[8,444,340,146,168,"tower"],"t_fox_5A_0":[8,592,340,146,168,"tower"],"t_fox_5A_a":[8,740,340,146,168,"tower"],"t_fox_5A_h":[8,888,340,146,168,"tower"],"t_fox_5A_r":[8,1036,340,146,168,"tower"],"t_fox_5A_w":[8,1184,340,146,168,"tower"],"t_fox_5B_0":[8,1332,340,146,168,"tower"],"t_fox_5B_a":[8,1480,340,146,168,"tower"],"t_fox_5B_h":[8,1628,340,146,168,"tower"],"t_fox_5B_r":[8,1776,340,146,168,"tower"],"t_fox_5B_w":[8,0,510,146,168,"tower"],"t_frog_1_0":[8,148,510,146,168,"tower"],"t_frog_1_a":[8,296,510,146,168,"tower"],"t_frog_1_h":[8,444,510,146,168,"tower"],"t_frog_1_r":[8,592,510,146,168,"tower"],"t_frog_1_w":[8,740,510,146,168,"tower"],"t_frog_2_0":[8,888,510,146,168,"tower"],"t_frog_2_a":[8,1036,510,146,168,"tower"],"t_frog_2_h":[8,1184,510,146,168,"tower"],"t_frog_2_r":[8,1332,510,146,168,"tower"],"t_frog_2_w":[8,1480,510,146,168,"tower"],"t_frog_3_0":[8,1628,510,146,168,"tower"],"t_frog_3_a":[8,1776,510,146,168,"tower"],"t_frog_3_h":[8,0,680,146,168,"tower"],"t_frog_3_r":[8,148,680,146,168,"tower"],"t_frog_3_w":[8,296,680,146,168,"tower"],"t_frog_4A_0":[8,444,680,146,168,"tower"],"t_frog_4A_a":[8,592,680,146,168,"tower"],"t_frog_4A_h":[8,740,680,146,168,"tower"],"t_frog_4A_r":[8,888,680,146,168,"tower"],"t_frog_4A_w":[8,1036,680,146,168,"tower"],"t_frog_4B_0":[8,1184,680,146,168,"tower"],"t_frog_4B_a":[8,1332,680,146,168,"tower"],"t_frog_4B_h":[8,1480,680,146,168,"tower"],"t_frog_4B_r":[8,1628,680,146,168,"tower"],"t_frog_4B_w":[8,1776,680,146,168,"tower"],"t_frog_5A_0":[8,0,850,146,168,"tower"],"t_frog_5A_a":[8,148,850,146,168,"tower"],"t_frog_5A_h":[8,296,850,146,168,"tower"],"t_frog_5A_r":[8,444,850,146,168,"tower"],"t_frog_5A_w":[8,592,850,146,168,"tower"],"t_frog_5B_0":[8,740,850,146,168,"tower"],"t_frog_5B_a":[8,888,850,146,168,"tower"],"t_frog_5B_h":[8,1036,850,146,168,"tower"],"t_frog_5B_r":[8,1184,850,146,168,"tower"],"t_frog_5B_w":[8,1332,850,146,168,"tower"],"t_hamster_1_0":[8,1480,850,146,168,"tower"],"t_hamster_1_a":[8,1628,850,146,168,"tower"],"t_hamster_1_h":[8,1776,850,146,168,"tower"],"t_hamster_1_r":[8,0,1020,146,168,"tower"],"t_hamster_1_w":[8,148,1020,146,168,"tower"],"t_hamster_2_0":[8,296,1020,146,168,"tower"],"t_hamster_2_a":[8,444,1020,146,168,"tower"],"t_hamster_2_h":[8,592,1020,146,168,"tower"],"t_hamster_2_r":[8,740,1020,146,168,"tower"],"t_hamster_2_w":[8,888,1020,146,168,"tower"],"t_hamster_3_0":[8,1036,1020,146,168,"tower"],"t_hamster_3_a":[8,1184,1020,146,168,"tower"],"t_hamster_3_h":[8,1332,1020,146,168,"tower"],"t_hamster_3_r":[8,1480,1020,146,168,"tower"],"t_hamster_3_w":[8,1628,1020,146,168,"tower"],"t_hamster_4A_0":[8,1776,1020,146,168,"tower"],"t_hamster_4A_a":[8,0,1190,146,168,"tower"],"t_hamster_4A_h":[8,148,1190,146,168,"tower"],"t_hamster_4A_r":[8,296,1190,146,168,"tower"],"t_hamster_4A_w":[8,444,1190,146,168,"tower"],"t_hamster_4B_0":[8,592,1190,146,168,"tower"],"t_hamster_4B_a":[8,740,1190,146,168,"tower"],"t_hamster_4B_h":[8,888,1190,146,168,"tower"],"t_hamster_4B_r":[8,1036,1190,146,168,"tower"],"t_hamster_4B_w":[8,1184,1190,146,168,"tower"],"t_hamster_5A_0":[8,1332,1190,146,168,"tower"],"t_hamster_5A_a":[8,1480,1190,146,168,"tower"],"t_hamster_5A_h":[8,1628,1190,146,168,"tower"],"t_hamster_5A_r":[8,1776,1190,146,168,"tower"],"t_hamster_5A_w":[8,0,1360,146,168,"tower"],"t_hamster_5B_0":[8,148,1360,146,168,"tower"],"t_hamster_5B_a":[8,296,1360,146,168,"tower"],"t_hamster_5B_h":[8,444,1360,146,168,"tower"],"t_hamster_5B_r":[8,592,1360,146,168,"tower"],"t_hamster_5B_w":[8,740,1360,146,168,"tower"],"t_hedgehog_1_0":[8,888,1360,146,168,"tower"],"t_hedgehog_1_a":[8,1036,1360,146,168,"tower"],"t_hedgehog_1_h":[8,1184,1360,146,168,"tower"],"t_hedgehog_1_r":[8,1332,1360,146,168,"tower"],"t_hedgehog_1_w":[8,1480,1360,146,168,"tower"],"t_hedgehog_2_0":[8,1628,1360,146,168,"tower"],"t_hedgehog_2_a":[8,1776,1360,146,168,"tower"],"t_hedgehog_2_h":[8,0,1530,146,168,"tower"],"t_hedgehog_2_r":[8,148,1530,146,168,"tower"],"t_hedgehog_2_w":[8,296,1530,146,168,"tower"],"t_hedgehog_3_0":[8,444,1530,146,168,"tower"],"t_hedgehog_3_a":[8,592,1530,146,168,"tower"],"t_hedgehog_3_h":[8,740,1530,146,168,"tower"],"t_hedgehog_3_r":[8,888,1530,146,168,"tower"],"t_hedgehog_3_w":[8,1036,1530,146,168,"tower"],"t_hedgehog_4A_0":[8,1184,1530,146,168,"tower"],"t_hedgehog_4A_a":[8,1332,1530,146,168,"tower"],"t_hedgehog_4A_h":[8,1480,1530,146,168,"tower"],"t_hedgehog_4A_r":[8,1628,1530,146,168,"tower"],"t_hedgehog_4A_w":[8,1776,1530,146,168,"tower"],"t_hedgehog_4B_0":[8,0,1700,146,168,"tower"],"t_hedgehog_4B_a":[8,148,1700,146,168,"tower"],"t_hedgehog_4B_h":[8,296,1700,146,168,"tower"],"t_hedgehog_4B_r":[8,444,1700,146,168,"tower"],"t_hedgehog_4B_w":[8,592,1700,146,168,"tower"],"t_hedgehog_5A_0":[8,740,1700,146,168,"tower"],"t_hedgehog_5A_a":[8,888,1700,146,168,"tower"],"t_hedgehog_5A_h":[8,1036,1700,146,168,"tower"],"t_hedgehog_5A_r":[8,1184,1700,146,168,"tower"],"t_hedgehog_5A_w":[8,1332,1700,146,168,"tower"],"t_hedgehog_5B_0":[8,1480,1700,146,168,"tower"],"t_hedgehog_5B_a":[8,1628,1700,146,168,"tower"],"t_hedgehog_5B_h":[8,1776,1700,146,168,"tower"],"t_hedgehog_5B_r":[8,0,1870,146,168,"tower"],"t_hedgehog_5B_w":[8,148,1870,146,168,"tower"],"t_koala_1_0":[8,296,1870,146,168,"tower"],"t_koala_1_a":[8,444,1870,146,168,"tower"],"t_koala_1_h":[8,592,1870,146,168,"tower"],"t_koala_1_r":[8,740,1870,146,168,"tower"],"t_koala_1_w":[8,888,1870,146,168,"tower"],"t_koala_2_0":[8,1036,1870,146,168,"tower"],"t_koala_2_a":[8,1184,1870,146,168,"tower"],"t_koala_2_h":[8,1332,1870,146,168,"tower"],"t_koala_2_r":[8,1480,1870,146,168,"tower"],"t_koala_2_w":[8,1628,1870,146,168,"tower"],"t_koala_3_0":[8,1776,1870,146,168,"tower"],"t_koala_3_a":[9,0,0,146,168,"tower"],"t_koala_3_h":[9,148,0,146,168,"tower"],"t_koala_3_r":[9,296,0,146,168,"tower"],"t_koala_3_w":[9,444,0,146,168,"tower"],"t_koala_4A_0":[9,592,0,146,168,"tower"],"t_koala_4A_a":[9,740,0,146,168,"tower"],"t_koala_4A_h":[9,888,0,146,168,"tower"],"t_koala_4A_r":[9,1036,0,146,168,"tower"],"t_koala_4A_w":[9,1184,0,146,168,"tower"],"t_koala_4B_0":[9,1332,0,146,168,"tower"],"t_koala_4B_a":[9,1480,0,146,168,"tower"],"t_koala_4B_h":[9,1628,0,146,168,"tower"],"t_koala_4B_r":[9,1776,0,146,168,"tower"],"t_koala_4B_w":[9,0,170,146,168,"tower"],"t_koala_5A_0":[9,148,170,146,168,"tower"],"t_koala_5A_a":[9,296,170,146,168,"tower"],"t_koala_5A_h":[9,444,170,146,168,"tower"],"t_koala_5A_r":[9,592,170,146,168,"tower"],"t_koala_5A_w":[9,740,170,146,168,"tower"],"t_koala_5B_0":[9,888,170,146,168,"tower"],"t_koala_5B_a":[9,1036,170,146,168,"tower"],"t_koala_5B_h":[9,1184,170,146,168,"tower"],"t_koala_5B_r":[9,1332,170,146,168,"tower"],"t_koala_5B_w":[9,1480,170,146,168,"tower"],"t_owl_1_0":[9,1628,170,146,168,"tower"],"t_owl_1_a":[9,1776,170,146,168,"tower"],"t_owl_1_h":[9,0,340,146,168,"tower"],"t_owl_1_r":[9,148,340,146,168,"tower"],"t_owl_1_w":[9,296,340,146,168,"tower"],"t_owl_2_0":[9,444,340,146,168,"tower"],"t_owl_2_a":[9,592,340,146,168,"tower"],"t_owl_2_h":[9,740,340,146,168,"tower"],"t_owl_2_r":[9,888,340,146,168,"tower"],"t_owl_2_w":[9,1036,340,146,168,"tower"],"t_owl_3_0":[9,1184,340,146,168,"tower"],"t_owl_3_a":[9,1332,340,146,168,"tower"],"t_owl_3_h":[9,1480,340,146,168,"tower"],"t_owl_3_r":[9,1628,340,146,168,"tower"],"t_owl_3_w":[9,1776,340,146,168,"tower"],"t_owl_4A_0":[9,0,510,146,168,"tower"],"t_owl_4A_a":[9,148,510,146,168,"tower"],"t_owl_4A_h":[9,296,510,146,168,"tower"],"t_owl_4A_r":[9,444,510,146,168,"tower"],"t_owl_4A_w":[9,592,510,146,168,"tower"],"t_owl_4B_0":[9,740,510,146,168,"tower"],"t_owl_4B_a":[9,888,510,146,168,"tower"],"t_owl_4B_h":[9,1036,510,146,168,"tower"],"t_owl_4B_r":[9,1184,510,146,168,"tower"],"t_owl_4B_w":[9,1332,510,146,168,"tower"],"t_owl_5A_0":[9,1480,510,146,168,"tower"],"t_owl_5A_a":[9,1628,510,146,168,"tower"],"t_owl_5A_h":[9,1776,510,146,168,"tower"],"t_owl_5A_r":[9,0,680,146,168,"tower"],"t_owl_5A_w":[9,148,680,146,168,"tower"],"t_owl_5B_0":[9,296,680,146,168,"tower"],"t_owl_5B_a":[9,444,680,146,168,"tower"],"t_owl_5B_h":[9,592,680,146,168,"tower"],"t_owl_5B_r":[9,740,680,146,168,"tower"],"t_owl_5B_w":[9,888,680,146,168,"tower"],"t_penguin_1_0":[9,1036,680,146,168,"tower"],"t_penguin_1_a":[9,1184,680,146,168,"tower"],"t_penguin_1_h":[9,1332,680,146,168,"tower"],"t_penguin_1_r":[9,1480,680,146,168,"tower"],"t_penguin_1_w":[9,1628,680,146,168,"tower"],"t_penguin_2_0":[9,1776,680,146,168,"tower"],"t_penguin_2_a":[9,0,850,146,168,"tower"],"t_penguin_2_h":[9,148,850,146,168,"tower"],"t_penguin_2_r":[9,296,850,146,168,"tower"],"t_penguin_2_w":[9,444,850,146,168,"tower"],"t_penguin_3_0":[9,592,850,146,168,"tower"],"t_penguin_3_a":[9,740,850,146,168,"tower"],"t_penguin_3_h":[9,888,850,146,168,"tower"],"t_penguin_3_r":[9,1036,850,146,168,"tower"],"t_penguin_3_w":[9,1184,850,146,168,"tower"],"t_penguin_4A_0":[9,1332,850,146,168,"tower"],"t_penguin_4A_a":[9,1480,850,146,168,"tower"],"t_penguin_4A_h":[9,1628,850,146,168,"tower"],"t_penguin_4A_r":[9,1776,850,146,168,"tower"],"t_penguin_4A_w":[9,0,1020,146,168,"tower"],"t_penguin_4B_0":[9,148,1020,146,168,"tower"],"t_penguin_4B_a":[9,296,1020,146,168,"tower"],"t_penguin_4B_h":[9,444,1020,146,168,"tower"],"t_penguin_4B_r":[9,592,1020,146,168,"tower"],"t_penguin_4B_w":[9,740,1020,146,168,"tower"],"t_penguin_5A_0":[9,888,1020,146,168,"tower"],"t_penguin_5A_a":[9,1036,1020,146,168,"tower"],"t_penguin_5A_h":[9,1184,1020,146,168,"tower"],"t_penguin_5A_r":[9,1332,1020,146,168,"tower"],"t_penguin_5A_w":[9,1480,1020,146,168,"tower"],"t_penguin_5B_0":[9,1628,1020,146,168,"tower"],"t_penguin_5B_a":[9,1776,1020,146,168,"tower"],"t_penguin_5B_h":[9,0,1190,146,168,"tower"],"t_penguin_5B_r":[9,148,1190,146,168,"tower"],"t_penguin_5B_w":[9,296,1190,146,168,"tower"],"t_pig_1_0":[9,444,1190,146,168,"tower"],"t_pig_1_a":[9,592,1190,146,168,"tower"],"t_pig_1_h":[9,740,1190,146,168,"tower"],"t_pig_1_r":[9,888,1190,146,168,"tower"],"t_pig_1_w":[9,1036,1190,146,168,"tower"],"t_pig_2_0":[9,1184,1190,146,168,"tower"],"t_pig_2_a":[9,1332,1190,146,168,"tower"],"t_pig_2_h":[9,1480,1190,146,168,"tower"],"t_pig_2_r":[9,1628,1190,146,168,"tower"],"t_pig_2_w":[9,1776,1190,146,168,"tower"],"t_pig_3_0":[9,0,1360,146,168,"tower"],"t_pig_3_a":[9,148,1360,146,168,"tower"],"t_pig_3_h":[9,296,1360,146,168,"tower"],"t_pig_3_r":[9,444,1360,146,168,"tower"],"t_pig_3_w":[9,592,1360,146,168,"tower"],"t_pig_4A_0":[9,740,1360,146,168,"tower"],"t_pig_4A_a":[9,888,1360,146,168,"tower"],"t_pig_4A_h":[9,1036,1360,146,168,"tower"],"t_pig_4A_r":[9,1184,1360,146,168,"tower"],"t_pig_4A_w":[9,1332,1360,146,168,"tower"],"t_pig_4B_0":[9,1480,1360,146,168,"tower"],"t_pig_4B_a":[9,1628,1360,146,168,"tower"],"t_pig_4B_h":[9,1776,1360,146,168,"tower"],"t_pig_4B_r":[9,0,1530,146,168,"tower"],"t_pig_4B_w":[9,148,1530,146,168,"tower"],"t_pig_5A_0":[9,296,1530,146,168,"tower"],"t_pig_5A_a":[9,444,1530,146,168,"tower"],"t_pig_5A_h":[9,592,1530,146,168,"tower"],"t_pig_5A_r":[9,740,1530,146,168,"tower"],"t_pig_5A_w":[9,888,1530,146,168,"tower"],"t_pig_5B_0":[9,1036,1530,146,168,"tower"],"t_pig_5B_a":[9,1184,1530,146,168,"tower"],"t_pig_5B_h":[9,1332,1530,146,168,"tower"],"t_pig_5B_r":[9,1480,1530,146,168,"tower"],"t_pig_5B_w":[9,1628,1530,146,168,"tower"],"t_sheep_1_0":[9,1776,1530,146,168,"tower"],"t_sheep_1_a":[9,0,1700,146,168,"tower"],"t_sheep_1_h":[9,148,1700,146,168,"tower"],"t_sheep_1_r":[9,296,1700,146,168,"tower"],"t_sheep_1_w":[9,444,1700,146,168,"tower"],"t_sheep_2_0":[9,592,1700,146,168,"tower"],"t_sheep_2_a":[9,740,1700,146,168,"tower"],"t_sheep_2_h":[9,888,1700,146,168,"tower"],"t_sheep_2_r":[9,1036,1700,146,168,"tower"],"t_sheep_2_w":[9,1184,1700,146,168,"tower"],"t_sheep_3_0":[9,1332,1700,146,168,"tower"],"t_sheep_3_a":[9,1480,1700,146,168,"tower"],"t_sheep_3_h":[9,1628,1700,146,168,"tower"],"t_sheep_3_r":[9,1776,1700,146,168,"tower"],"t_sheep_3_w":[9,0,1870,146,168,"tower"],"t_sheep_4A_0":[9,148,1870,146,168,"tower"],"t_sheep_4A_a":[9,296,1870,146,168,"tower"],"t_sheep_4A_h":[9,444,1870,146,168,"tower"],"t_sheep_4A_r":[9,592,1870,146,168,"tower"],"t_sheep_4A_w":[9,740,1870,146,168,"tower"],"t_sheep_4B_0":[9,888,1870,146,168,"tower"],"t_sheep_4B_a":[9,1036,1870,146,168,"tower"],"t_sheep_4B_h":[9,1184,1870,146,168,"tower"],"t_sheep_4B_r":[9,1332,1870,146,168,"tower"],"t_sheep_4B_w":[9,1480,1870,146,168,"tower"],"t_sheep_5A_0":[9,1628,1870,146,168,"tower"],"t_sheep_5A_a":[9,1776,1870,146,168,"tower"],"t_sheep_5A_h":[10,0,0,146,168,"tower"],"t_sheep_5A_r":[10,148,0,146,168,"tower"],"t_sheep_5A_w":[10,296,0,146,168,"tower"],"t_sheep_5B_0":[10,444,0,146,168,"tower"],"t_sheep_5B_a":[10,592,0,146,168,"tower"],"t_sheep_5B_h":[10,740,0,146,168,"tower"],"t_sheep_5B_r":[10,888,0,146,168,"tower"],"t_sheep_5B_w":[10,1036,0,146,168,"tower"],"t_unicorn_1_0":[10,1184,0,146,168,"tower"],"t_unicorn_1_a":[10,1332,0,146,168,"tower"],"t_unicorn_1_h":[10,1480,0,146,168,"tower"],"t_unicorn_1_r":[10,1628,0,146,168,"tower"],"t_unicorn_1_w":[10,1776,0,146,168,"tower"],"t_unicorn_2_0":[10,0,170,146,168,"tower"],"t_unicorn_2_a":[10,148,170,146,168,"tower"],"t_unicorn_2_h":[10,296,170,146,168,"tower"],"t_unicorn_2_r":[10,444,170,146,168,"tower"],"t_unicorn_2_w":[10,592,170,146,168,"tower"],"t_unicorn_3_0":[10,740,170,146,168,"tower"],"t_unicorn_3_a":[10,888,170,146,168,"tower"],"t_unicorn_3_h":[10,1036,170,146,168,"tower"],"t_unicorn_3_r":[10,1184,170,146,168,"tower"],"t_unicorn_3_w":[10,1332,170,146,168,"tower"],"t_unicorn_4A_0":[10,1480,170,146,168,"tower"],"t_unicorn_4A_a":[10,1628,170,146,168,"tower"],"t_unicorn_4A_h":[10,1776,170,146,168,"tower"],"t_unicorn_4A_r":[10,0,340,146,168,"tower"],"t_unicorn_4A_w":[10,148,340,146,168,"tower"],"t_unicorn_4B_0":[10,296,340,146,168,"tower"],"t_unicorn_4B_a":[10,444,340,146,168,"tower"],"t_unicorn_4B_h":[10,592,340,146,168,"tower"],"t_unicorn_4B_r":[10,740,340,146,168,"tower"],"t_unicorn_4B_w":[10,888,340,146,168,"tower"],"t_unicorn_5A_0":[10,1036,340,146,168,"tower"],"t_unicorn_5A_a":[10,1184,340,146,168,"tower"],"t_unicorn_5A_h":[10,1332,340,146,168,"tower"],"t_unicorn_5A_r":[10,1480,340,146,168,"tower"],"t_unicorn_5A_w":[10,1628,340,146,168,"tower"],"t_unicorn_5B_0":[10,1776,340,146,168,"tower"],"t_unicorn_5B_a":[10,0,510,146,168,"tower"],"t_unicorn_5B_h":[10,148,510,146,168,"tower"],"t_unicorn_5B_r":[10,296,510,146,168,"tower"],"t_unicorn_5B_w":[10,444,510,146,168,"tower"],"p_castle_0":[10,592,510,126,128,"prop"],"e_bat_0":[10,720,510,136,116,"enemy"],"e_bat_1":[10,858,510,136,116,"enemy"],"e_bat_d":[10,996,510,136,116,"enemy"],"e_bat_h":[10,1134,510,136,116,"enemy"],"e_bomb_0":[10,1272,510,136,116,"enemy"],"e_bomb_1":[10,1410,510,136,116,"enemy"],"e_bomb_d":[10,1548,510,136,116,"enemy"],"e_bomb_h":[10,1686,510,136,116,"enemy"],"e_fast_0":[10,1824,510,136,116,"enemy"],"e_fast_1":[10,0,680,136,116,"enemy"],"e_fast_d":[10,138,680,136,116,"enemy"],"e_fast_h":[10,276,680,136,116,"enemy"],"e_flying_0":[10,414,680,136,116,"enemy"],"e_flying_1":[10,552,680,136,116,"enemy"],"e_flying_d":[10,690,680,136,116,"enemy"],"e_flying_h":[10,828,680,136,116,"enemy"],"e_frost_0":[10,966,680,136,116,"enemy"],"e_frost_1":[10,1104,680,136,116,"enemy"],"e_frost_d":[10,1242,680,136,116,"enemy"],"e_frost_h":[10,1380,680,136,116,"enemy"],"e_ghost_0":[10,1518,680,136,116,"enemy"],"e_ghost_1":[10,1656,680,136,116,"enemy"],"e_ghost_d":[10,1794,680,136,116,"enemy"],"e_ghost_h":[10,0,798,136,116,"enemy"],"e_ghostking_0":[10,138,798,136,116,"enemy"],"e_ghostking_1":[10,276,798,136,116,"enemy"],"e_ghostking_d":[10,414,798,136,116,"enemy"],"e_ghostking_h":[10,552,798,136,116,"enemy"],"e_healer_0":[10,690,798,136,116,"enemy"],"e_healer_1":[10,828,798,136,116,"enemy"],"e_healer_d":[10,966,798,136,116,"enemy"],"e_healer_h":[10,1104,798,136,116,"enemy"],"e_jelly_0":[10,1242,798,136,116,"enemy"],"e_jelly_1":[10,1380,798,136,116,"enemy"],"e_jelly_d":[10,1518,798,136,116,"enemy"],"e_jelly_h":[10,1656,798,136,116,"enemy"],"e_king_0":[10,1794,798,136,116,"enemy"],"e_king_1":[10,0,916,136,116,"enemy"],"e_king_d":[10,138,916,136,116,"enemy"],"e_king_h":[10,276,916,136,116,"enemy"],"e_magma_0":[10,414,916,136,116,"enemy"],"e_magma_1":[10,552,916,136,116,"enemy"],"e_magma_d":[10,690,916,136,116,"enemy"],"e_magma_h":[10,828,916,136,116,"enemy"],"e_mini_0":[10,966,916,136,116,"enemy"],"e_mini_1":[10,1104,916,136,116,"enemy"],"e_mini_d":[10,1242,916,136,116,"enemy"],"e_mini_h":[10,1380,916,136,116,"enemy"],"e_normal_0":[10,1518,916,136,116,"enemy"],"e_normal_1":[10,1656,916,136,116,"enemy"],"e_normal_d":[10,1794,916,136,116,"enemy"],"e_normal_h":[10,0,1034,136,116,"enemy"],"e_shield_0":[10,138,1034,136,116,"enemy"],"e_shield_1":[10,276,1034,136,116,"enemy"],"e_shield_d":[10,414,1034,136,116,"enemy"],"e_shield_h":[10,552,1034,136,116,"enemy"],"e_splitter_0":[10,690,1034,136,116,"enemy"],"e_splitter_1":[10,828,1034,136,116,"enemy"],"e_splitter_d":[10,966,1034,136,116,"enemy"],"e_splitter_h":[10,1104,1034,136,116,"enemy"],"e_star_0":[10,1242,1034,136,116,"enemy"],"e_star_1":[10,1380,1034,136,116,"enemy"],"e_star_d":[10,1518,1034,136,116,"enemy"],"e_star_h":[10,1656,1034,136,116,"enemy"],"e_tank_0":[10,1794,1034,136,116,"enemy"],"e_tank_1":[10,0,1152,136,116,"enemy"],"e_tank_d":[10,138,1152,136,116,"enemy"],"e_tank_h":[10,276,1152,136,116,"enemy"],"e_turtle_0":[10,414,1152,136,116,"enemy"],"e_turtle_1":[10,552,1152,136,116,"enemy"],"e_turtle_d":[10,690,1152,136,116,"enemy"],"e_turtle_h":[10,828,1152,136,116,"enemy"],"p_ball_0":[10,966,1152,58,72,"prop"],"p_coin_0":[10,1026,1152,71,72,"prop"],"p_feather_0":[10,1099,1152,15,72,"prop"],"p_poison_0":[10,1116,1152,55,72,"prop"],"p_snow_0":[10,1173,1152,71,72,"prop"],"p_fireball_0":[10,1246,1152,72,71,"prop"],"p_orb_0":[10,1320,1152,72,71,"prop"],"p_chickling_0":[10,1394,1152,72,70,"prop"],"p_spike_0":[10,1468,1152,72,69,"prop"],"p_star_0":[10,1542,1152,72,66,"prop"],"p_heal_0":[10,1616,1152,72,60,"prop"],"p_heart_0":[10,1690,1152,72,60,"prop"],"p_missile_0":[10,1764,1152,72,27,"prop"],"p_arrow_0":[10,1838,1152,72,19,"prop"]},mz:{"h_captain_0":[[0.949,0.575]],"h_captain_a":[[0.919,0.529]],"h_fortune_0":[[0.803,0.284]],"h_fortune_a":[[0.685,0.218]],"h_princess_0":[[0.827,0.217]],"h_princess_a":[[0.692,0.143]],"h_thunder_0":[[0.805,0.278]],"h_thunder_a":[[0.686,0.212]],"s_bear_panda_1_0":[[0.778,0.582]],"s_bear_panda_1_a":[[0.723,0.532]],"s_bear_panda_1_r":[[0.762,0.565]],"s_bear_panda_1_w":[[0.868,0.686]],"s_bear_panda_2_0":[[0.81,0.555]],"s_bear_panda_2_a":[[0.749,0.5]],"s_bear_panda_2_r":[[0.792,0.536]],"s_bear_panda_2_w":[[0.91,0.67]],"s_bear_panda_3_0":[[0.843,0.527]],"s_bear_panda_3_a":[[0.776,0.466]],"s_bear_panda_3_r":[[0.823,0.505]],"s_bear_panda_3_w":[[0.952,0.653]],"s_bunny_choco_1_0":[[0.704,0.444]],"s_bunny_choco_1_a":[[0.619,0.396]],"s_bunny_choco_1_r":[[0.676,0.427]],"s_bunny_choco_1_w":[[0.884,0.54]],"s_bunny_choco_2_0":[[0.728,0.401]],"s_bunny_choco_2_a":[[0.633,0.349]],"s_bunny_choco_2_r":[[0.697,0.383]],"s_bunny_choco_2_w":[[0.927,0.508]],"s_bunny_choco_3_0":[[0.752,0.357]],"s_bunny_choco_3_a":[[0.648,0.3]],"s_bunny_choco_3_r":[[0.718,0.337]],"s_bunny_choco_3_w":[[0.972,0.474]],"s_cat_black_1_0":[[0.808,0.657]],"s_cat_black_1_a":[[0.787,0.623]],"s_cat_black_1_r":[[0.803,0.644]],"s_cat_black_1_w":[[0.835,0.695]],"s_cat_black_2_0":[[0.842,0.636]],"s_cat_black_2_a":[[0.819,0.6]],"s_cat_black_2_r":[[0.836,0.623]],"s_cat_black_2_w":[[0.872,0.679]],"s_cat_black_3_0":[[0.877,0.615]],"s_cat_black_3_a":[[0.851,0.575]],"s_cat_black_3_r":[[0.871,0.601]],"s_cat_black_3_w":[[0.91,0.663]],"t_bear_1_0":[[0.778,0.582]],"t_bear_1_a":[[0.723,0.532]],"t_bear_1_h":[[0.79,0.594]],"t_bear_1_r":[[0.762,0.565]],"t_bear_1_w":[[0.868,0.686]],"t_bear_2_0":[[0.81,0.555]],"t_bear_2_a":[[0.749,0.5]],"t_bear_2_h":[[0.823,0.567]],"t_bear_2_r":[[0.792,0.536]],"t_bear_2_w":[[0.91,0.67]],"t_bear_3_0":[[0.843,0.527]],"t_bear_3_a":[[0.776,0.466]],"t_bear_3_h":[[0.858,0.54]],"t_bear_3_r":[[0.823,0.505]],"t_bear_3_w":[[0.952,0.653]],"t_bear_4A_0":[[0.877,0.497]],"t_bear_4A_a":[[0.803,0.431]],"t_bear_4A_h":[[0.893,0.512]],"t_bear_4A_r":[[0.855,0.474]],"t_bear_4A_w":[[0.997,0.635]],"t_bear_4B_0":[[0.877,0.497]],"t_bear_4B_a":[[0.803,0.431]],"t_bear_4B_h":[[0.893,0.512]],"t_bear_4B_r":[[0.855,0.474]],"t_bear_4B_w":[[0.997,0.635]],"t_bear_5A_0":[[0.911,0.466]],"t_bear_5A_a":[[0.832,0.395]],"t_bear_5A_h":[[0.93,0.482]],"t_bear_5A_r":[[0.887,0.441]],"t_bear_5A_w":[[1.043,0.617]],"t_bear_5B_0":[[0.911,0.466]],"t_bear_5B_a":[[0.832,0.395]],"t_bear_5B_h":[[0.93,0.482]],"t_bear_5B_r":[[0.887,0.441]],"t_bear_5B_w":[[1.043,0.617]],"t_bunny_1_0":[[0.704,0.444]],"t_bunny_1_a":[[0.619,0.396]],"t_bunny_1_h":[[0.731,0.444]],"t_bunny_1_r":[[0.676,0.427]],"t_bunny_1_w":[[0.884,0.54]],"t_bunny_2_0":[[0.728,0.401]],"t_bunny_2_a":[[0.633,0.349]],"t_bunny_2_h":[[0.758,0.402]],"t_bunny_2_r":[[0.697,0.383]],"t_bunny_2_w":[[0.927,0.508]],"t_bunny_3_0":[[0.752,0.357]],"t_bunny_3_a":[[0.648,0.3]],"t_bunny_3_h":[[0.786,0.358]],"t_bunny_3_r":[[0.718,0.337]],"t_bunny_3_w":[[0.972,0.474]],"t_bunny_4A_0":[[0.777,0.311]],"t_bunny_4A_a":[[0.663,0.249]],"t_bunny_4A_h":[[0.814,0.312]],"t_bunny_4A_r":[[0.74,0.29]],"t_bunny_4A_w":[[1.018,0.44]],"t_bunny_4B_0":[[0.777,0.311]],"t_bunny_4B_a":[[0.663,0.249]],"t_bunny_4B_h":[[0.814,0.312]],"t_bunny_4B_r":[[0.74,0.29]],"t_bunny_4B_w":[[1.018,0.44]],"t_bunny_5A_0":[[0.803,0.264]],"t_bunny_5A_a":[[0.678,0.195]],"t_bunny_5A_h":[[0.843,0.264]],"t_bunny_5A_r":[[0.762,0.24]],"t_bunny_5A_w":[[1.066,0.404]],"t_bunny_5B_0":[[0.803,0.264]],"t_bunny_5B_a":[[0.678,0.195]],"t_bunny_5B_h":[[0.843,0.264]],"t_bunny_5B_r":[[0.762,0.24]],"t_bunny_5B_w":[[1.066,0.404]],"t_cat_1_0":[[0.808,0.657]],"t_cat_1_a":[[0.787,0.623]],"t_cat_1_h":[[0.805,0.66]],"t_cat_1_r":[[0.803,0.644]],"t_cat_1_w":[[0.835,0.695]],"t_cat_2_0":[[0.842,0.636]],"t_cat_2_a":[[0.819,0.6]],"t_cat_2_h":[[0.839,0.64]],"t_cat_2_r":[[0.836,0.623]],"t_cat_2_w":[[0.872,0.679]],"t_cat_3_0":[[0.877,0.615]],"t_cat_3_a":[[0.851,0.575]],"t_cat_3_h":[[0.874,0.619]],"t_cat_3_r":[[0.871,0.601]],"t_cat_3_w":[[0.91,0.663]],"t_cat_4A_0":[[0.913,0.594]],"t_cat_4A_a":[[0.884,0.55]],"t_cat_4A_h":[[0.91,0.598]],"t_cat_4A_r":[[0.906,0.578]],"t_cat_4A_w":[[0.95,0.646]],"t_cat_4B_0":[[0.913,0.594]],"t_cat_4B_a":[[0.884,0.55]],"t_cat_4B_h":[[0.91,0.598]],"t_cat_4B_r":[[0.906,0.578]],"t_cat_4B_w":[[0.95,0.646]],"t_cat_5A_0":[[0.95,0.571]],"t_cat_5A_a":[[0.919,0.524]],"t_cat_5A_h":[[0.947,0.576]],"t_cat_5A_r":[[0.942,0.554]],"t_cat_5A_w":[[0.99,0.628]],"t_cat_5B_0":[[0.95,0.571]],"t_cat_5B_a":[[0.919,0.524]],"t_cat_5B_h":[[0.947,0.576]],"t_cat_5B_r":[[0.942,0.554]],"t_cat_5B_w":[[0.99,0.628]],"t_chick_1_0":[[0.759,0.51]],"t_chick_1_a":[[0.688,0.459]],"t_chick_1_h":[[0.779,0.517]],"t_chick_1_r":[[0.737,0.492]],"t_chick_1_w":[[0.892,0.617]],"t_chick_2_0":[[0.789,0.474]],"t_chick_2_a":[[0.71,0.418]],"t_chick_2_h":[[0.811,0.483]],"t_chick_2_r":[[0.764,0.455]],"t_chick_2_w":[[0.936,0.593]],"t_chick_3_0":[[0.82,0.438]],"t_chick_3_a":[[0.733,0.376]],"t_chick_3_h":[[0.844,0.447]],"t_chick_3_r":[[0.793,0.417]],"t_chick_3_w":[[0.982,0.568]],"t_chick_4A_0":[[0.851,0.399]],"t_chick_4A_a":[[0.756,0.333]],"t_chick_4A_h":[[0.878,0.409]],"t_chick_4A_r":[[0.821,0.376]],"t_chick_4A_w":[[1.029,0.543]],"t_chick_4B_0":[[0.851,0.399]],"t_chick_4B_a":[[0.756,0.333]],"t_chick_4B_h":[[0.878,0.409]],"t_chick_4B_r":[[0.821,0.376]],"t_chick_4B_w":[[1.029,0.543]],"t_chick_5A_0":[[0.884,0.36]],"t_chick_5A_a":[[0.78,0.287]],"t_chick_5A_h":[[0.913,0.371]],"t_chick_5A_r":[[0.851,0.335]],"t_chick_5A_w":[[1.078,0.516]],"t_chick_5B_0":[[0.884,0.36]],"t_chick_5B_a":[[0.78,0.287]],"t_chick_5B_h":[[0.913,0.371]],"t_chick_5B_r":[[0.851,0.335]],"t_chick_5B_w":[[1.078,0.516]],"t_deer_1_0":[[0.702,0.447]],"t_deer_1_a":[[0.618,0.4]],"t_deer_1_h":[[0.729,0.448]],"t_deer_1_r":[[0.675,0.431]],"t_deer_1_w":[[0.881,0.543]],"t_deer_2_0":[[0.726,0.406]],"t_deer_2_a":[[0.633,0.354]],"t_deer_2_h":[[0.756,0.406]],"t_deer_2_r":[[0.696,0.387]],"t_deer_2_w":[[0.923,0.511]],"t_deer_3_0":[[0.75,0.362]],"t_deer_3_a":[[0.648,0.305]],"t_deer_3_h":[[0.784,0.363]],"t_deer_3_r":[[0.717,0.342]],"t_deer_3_w":[[0.968,0.478]],"t_deer_4A_0":[[0.775,0.316]],"t_deer_4A_a":[[0.663,0.254]],"t_deer_4A_h":[[0.812,0.317]],"t_deer_4A_r":[[0.738,0.295]],"t_deer_4A_w":[[1.014,0.443]],"t_deer_4B_0":[[0.775,0.316]],"t_deer_4B_a":[[0.663,0.254]],"t_deer_4B_h":[[0.812,0.317]],"t_deer_4B_r":[[0.738,0.295]],"t_deer_4B_w":[[1.014,0.443]],"t_deer_5A_0":[[0.801,0.269]],"t_deer_5A_a":[[0.678,0.202]],"t_deer_5A_h":[[0.841,0.27]],"t_deer_5A_r":[[0.76,0.246]],"t_deer_5A_w":[[1.061,0.408]],"t_deer_5B_0":[[0.801,0.269]],"t_deer_5B_a":[[0.678,0.202]],"t_deer_5B_h":[[0.841,0.27]],"t_deer_5B_r":[[0.76,0.246]],"t_deer_5B_w":[[1.061,0.408]],"t_dragon_1_0":[[0.716,0.409]],"t_dragon_1_a":[[0.622,0.357]],"t_dragon_1_h":[[0.746,0.41]],"t_dragon_1_r":[[0.685,0.391]],"t_dragon_1_w":[[0.915,0.515]],"t_dragon_2_0":[[0.741,0.363]],"t_dragon_2_a":[[0.637,0.306]],"t_dragon_2_h":[[0.775,0.364]],"t_dragon_2_r":[[0.707,0.344]],"t_dragon_2_w":[[0.961,0.48]],"t_dragon_3_0":[[0.767,0.315]],"t_dragon_3_a":[[0.652,0.253]],"t_dragon_3_h":[[0.804,0.316]],"t_dragon_3_r":[[0.729,0.294]],"t_dragon_3_w":[[1.009,0.444]],"t_dragon_4A_0":[[0.794,0.265]],"t_dragon_4A_a":[[0.668,0.197]],"t_dragon_4A_h":[[0.835,0.266]],"t_dragon_4A_r":[[0.752,0.242]],"t_dragon_4A_w":[[1.059,0.406]],"t_dragon_4B_0":[[0.794,0.265]],"t_dragon_4B_a":[[0.668,0.197]],"t_dragon_4B_h":[[0.835,0.266]],"t_dragon_4B_r":[[0.752,0.242]],"t_dragon_4B_w":[[1.059,0.406]],"t_dragon_5A_0":[[0.821,0.213]],"t_dragon_5A_a":[[0.683,0.139]],"t_dragon_5A_h":[[0.866,0.214]],"t_dragon_5A_r":[[0.775,0.188]],"t_dragon_5A_w":[[1.11,0.367]],"t_dragon_5B_0":[[0.821,0.213]],"t_dragon_5B_a":[[0.683,0.139]],"t_dragon_5B_h":[[0.866,0.214]],"t_dragon_5B_r":[[0.775,0.188]],"t_dragon_5B_w":[[1.11,0.367]],"t_fox_1_0":[[0.708,0.432]],"t_fox_1_a":[[0.62,0.383]],"t_fox_1_h":[[0.736,0.433]],"t_fox_1_r":[[0.679,0.415]],"t_fox_1_w":[[0.894,0.532]],"t_fox_2_0":[[0.732,0.389]],"t_fox_2_a":[[0.635,0.335]],"t_fox_2_h":[[0.764,0.389]],"t_fox_2_r":[[0.7,0.37]],"t_fox_2_w":[[0.938,0.499]],"t_fox_3_0":[[0.757,0.343]],"t_fox_3_a":[[0.649,0.284]],"t_fox_3_h":[[0.792,0.344]],"t_fox_3_r":[[0.722,0.323]],"t_fox_3_w":[[0.984,0.464]],"t_fox_4A_0":[[0.782,0.296]],"t_fox_4A_a":[[0.665,0.231]],"t_fox_4A_h":[[0.821,0.297]],"t_fox_4A_r":[[0.744,0.274]],"t_fox_4A_w":[[1.032,0.429]],"t_fox_4B_0":[[0.782,0.296]],"t_fox_4B_a":[[0.665,0.231]],"t_fox_4B_h":[[0.821,0.297]],"t_fox_4B_r":[[0.744,0.274]],"t_fox_4B_w":[[1.032,0.429]],"t_fox_5A_0":[[0.809,0.247]],"t_fox_5A_a":[[0.68,0.177]],"t_fox_5A_h":[[0.851,0.248]],"t_fox_5A_r":[[0.767,0.223]],"t_fox_5A_w":[[1.081,0.392]],"t_fox_5B_0":[[0.809,0.247]],"t_fox_5B_a":[[0.68,0.177]],"t_fox_5B_h":[[0.851,0.248]],"t_fox_5B_r":[[0.767,0.223]],"t_fox_5B_w":[[1.081,0.392]],"t_frog_1_0":[[0.684,0.552]],"t_frog_1_a":[[0.625,0.512]],"t_frog_1_h":[[0.702,0.554]],"t_frog_1_r":[[0.665,0.537]],"t_frog_1_w":[[0.809,0.626]],"t_frog_2_0":[[0.706,0.521]],"t_frog_2_a":[[0.64,0.477]],"t_frog_2_h":[[0.726,0.523]],"t_frog_2_r":[[0.685,0.505]],"t_frog_2_w":[[0.844,0.603]],"t_frog_3_0":[[0.728,0.489]],"t_frog_3_a":[[0.655,0.441]],"t_frog_3_h":[[0.75,0.492]],"t_frog_3_r":[[0.705,0.472]],"t_frog_3_w":[[0.88,0.579]],"t_frog_4A_0":[[0.751,0.456]],"t_frog_4A_a":[[0.671,0.403]],"t_frog_4A_h":[[0.775,0.459]],"t_frog_4A_r":[[0.725,0.437]],"t_frog_4A_w":[[0.918,0.554]],"t_frog_4B_0":[[0.751,0.456]],"t_frog_4B_a":[[0.671,0.403]],"t_frog_4B_h":[[0.775,0.459]],"t_frog_4B_r":[[0.725,0.437]],"t_frog_4B_w":[[0.918,0.554]],"t_frog_5A_0":[[0.774,0.422]],"t_frog_5A_a":[[0.687,0.365]],"t_frog_5A_h":[[0.801,0.424]],"t_frog_5A_r":[[0.746,0.401]],"t_frog_5A_w":[[0.956,0.529]],"t_frog_5B_0":[[0.774,0.422]],"t_frog_5B_a":[[0.687,0.365]],"t_frog_5B_h":[[0.801,0.424]],"t_frog_5B_r":[[0.746,0.401]],"t_frog_5B_w":[[0.956,0.529]],"t_hamster_1_0":[[0.762,0.574]],"t_hamster_1_a":[[0.706,0.526]],"t_hamster_1_h":[[0.775,0.584]],"t_hamster_1_r":[[0.745,0.557]],"t_hamster_1_w":[[0.859,0.673]],"t_hamster_2_0":[[0.792,0.546]],"t_hamster_2_a":[[0.729,0.493]],"t_hamster_2_h":[[0.807,0.556]],"t_hamster_2_r":[[0.773,0.527]],"t_hamster_2_w":[[0.9,0.655]],"t_hamster_3_0":[[0.823,0.516]],"t_hamster_3_a":[[0.754,0.458]],"t_hamster_3_h":[[0.839,0.528]],"t_hamster_3_r":[[0.802,0.496]],"t_hamster_3_w":[[0.941,0.637]],"t_hamster_4A_0":[[0.855,0.486]],"t_hamster_4A_a":[[0.779,0.422]],"t_hamster_4A_h":[[0.873,0.498]],"t_hamster_4A_r":[[0.832,0.464]],"t_hamster_4A_w":[[0.985,0.618]],"t_hamster_4B_0":[[0.855,0.486]],"t_hamster_4B_a":[[0.779,0.422]],"t_hamster_4B_h":[[0.873,0.498]],"t_hamster_4B_r":[[0.832,0.464]],"t_hamster_4B_w":[[0.985,0.618]],"t_hamster_5A_0":[[0.887,0.454]],"t_hamster_5A_a":[[0.805,0.385]],"t_hamster_5A_h":[[0.908,0.468]],"t_hamster_5A_r":[[0.862,0.43]],"t_hamster_5A_w":[[1.03,0.598]],"t_hamster_5B_0":[[0.887,0.454]],"t_hamster_5B_a":[[0.805,0.385]],"t_hamster_5B_h":[[0.908,0.468]],"t_hamster_5B_r":[[0.862,0.43]],"t_hamster_5B_w":[[1.03,0.598]],"t_hedgehog_1_0":[[0.683,0.553]],"t_hedgehog_1_a":[[0.623,0.512]],"t_hedgehog_1_h":[[0.702,0.555]],"t_hedgehog_1_r":[[0.664,0.538]],"t_hedgehog_1_w":[[0.81,0.626]],"t_hedgehog_2_0":[[0.705,0.523]],"t_hedgehog_2_a":[[0.638,0.477]],"t_hedgehog_2_h":[[0.725,0.524]],"t_hedgehog_2_r":[[0.684,0.506]],"t_hedgehog_2_w":[[0.845,0.604]],"t_hedgehog_3_0":[[0.727,0.491]],"t_hedgehog_3_a":[[0.654,0.441]],"t_hedgehog_3_h":[[0.75,0.493]],"t_hedgehog_3_r":[[0.704,0.473]],"t_hedgehog_3_w":[[0.881,0.58]],"t_hedgehog_4A_0":[[0.75,0.458]],"t_hedgehog_4A_a":[[0.669,0.403]],"t_hedgehog_4A_h":[[0.775,0.46]],"t_hedgehog_4A_r":[[0.724,0.438]],"t_hedgehog_4A_w":[[0.919,0.556]],"t_hedgehog_4B_0":[[0.75,0.458]],"t_hedgehog_4B_a":[[0.669,0.403]],"t_hedgehog_4B_h":[[0.775,0.46]],"t_hedgehog_4B_r":[[0.724,0.438]],"t_hedgehog_4B_w":[[0.919,0.556]],"t_hedgehog_5A_0":[[0.773,0.424]],"t_hedgehog_5A_a":[[0.685,0.365]],"t_hedgehog_5A_h":[[0.8,0.425]],"t_hedgehog_5A_r":[[0.745,0.402]],"t_hedgehog_5A_w":[[0.957,0.53]],"t_hedgehog_5B_0":[[0.773,0.424]],"t_hedgehog_5B_a":[[0.685,0.365]],"t_hedgehog_5B_h":[[0.8,0.425]],"t_hedgehog_5B_r":[[0.745,0.402]],"t_hedgehog_5B_w":[[0.957,0.53]],"t_koala_1_0":[[0.643,0.556]],"t_koala_1_a":[[0.586,0.523]],"t_koala_1_h":[[0.661,0.555]],"t_koala_1_r":[[0.624,0.544]],"t_koala_1_w":[[0.769,0.613]],"t_koala_2_0":[[0.66,0.526]],"t_koala_2_a":[[0.597,0.49]],"t_koala_2_h":[[0.68,0.525]],"t_koala_2_r":[[0.64,0.513]],"t_koala_2_w":[[0.8,0.589]],"t_koala_3_0":[[0.678,0.494]],"t_koala_3_a":[[0.608,0.455]],"t_koala_3_h":[[0.7,0.493]],"t_koala_3_r":[[0.655,0.48]],"t_koala_3_w":[[0.832,0.564]],"t_koala_4A_0":[[0.695,0.462]],"t_koala_4A_a":[[0.619,0.419]],"t_koala_4A_h":[[0.72,0.46]],"t_koala_4A_r":[[0.671,0.446]],"t_koala_4A_w":[[0.864,0.538]],"t_koala_4B_0":[[0.695,0.462]],"t_koala_4B_a":[[0.619,0.419]],"t_koala_4B_h":[[0.72,0.46]],"t_koala_4B_r":[[0.671,0.446]],"t_koala_4B_w":[[0.864,0.538]],"t_koala_5A_0":[[0.714,0.428]],"t_koala_5A_a":[[0.631,0.382]],"t_koala_5A_h":[[0.741,0.426]],"t_koala_5A_r":[[0.687,0.411]],"t_koala_5A_w":[[0.898,0.511]],"t_koala_5B_0":[[0.714,0.428]],"t_koala_5B_a":[[0.631,0.382]],"t_koala_5B_h":[[0.741,0.426]],"t_koala_5B_r":[[0.687,0.411]],"t_koala_5B_w":[[0.898,0.511]],"t_owl_1_0":[[0.858,0.652]],"t_owl_1_a":[[0.836,0.625]],"t_owl_1_h":[[0.854,0.656]],"t_owl_1_r":[[0.853,0.642]],"t_owl_1_w":[[0.885,0.687]],"t_owl_2_0":[[0.897,0.63]],"t_owl_2_a":[[0.872,0.6]],"t_owl_2_h":[[0.893,0.634]],"t_owl_2_r":[[0.891,0.619]],"t_owl_2_w":[[0.928,0.669]],"t_owl_3_0":[[0.937,0.607]],"t_owl_3_a":[[0.91,0.574]],"t_owl_3_h":[[0.933,0.611]],"t_owl_3_r":[[0.931,0.595]],"t_owl_3_w":[[0.972,0.65]],"t_owl_4A_0":[[0.979,0.583]],"t_owl_4A_a":[[0.949,0.546]],"t_owl_4A_h":[[0.975,0.588]],"t_owl_4A_r":[[0.971,0.57]],"t_owl_4A_w":[[1.017,0.631]],"t_owl_4B_0":[[0.979,0.583]],"t_owl_4B_a":[[0.949,0.546]],"t_owl_4B_h":[[0.975,0.588]],"t_owl_4B_r":[[0.971,0.57]],"t_owl_4B_w":[[1.017,0.631]],"t_owl_5A_0":[[1.022,0.558]],"t_owl_5A_a":[[0.988,0.518]],"t_owl_5A_h":[[1.017,0.563]],"t_owl_5A_r":[[1.013,0.544]],"t_owl_5A_w":[[1.064,0.611]],"t_owl_5B_0":[[1.022,0.558]],"t_owl_5B_a":[[0.988,0.518]],"t_owl_5B_h":[[1.017,0.563]],"t_owl_5B_r":[[1.013,0.544]],"t_owl_5B_w":[[1.064,0.611]],"t_penguin_1_0":[[0.719,0.4]],"t_penguin_1_a":[[0.623,0.347]],"t_penguin_1_h":[[0.751,0.4]],"t_penguin_1_r":[[0.688,0.381]],"t_penguin_1_w":[[0.923,0.508]],"t_penguin_2_0":[[0.745,0.353]],"t_penguin_2_a":[[0.638,0.294]],"t_penguin_2_h":[[0.78,0.353]],"t_penguin_2_r":[[0.71,0.333]],"t_penguin_2_w":[[0.97,0.473]],"t_penguin_3_0":[[0.771,0.304]],"t_penguin_3_a":[[0.654,0.24]],"t_penguin_3_h":[[0.809,0.304]],"t_penguin_3_r":[[0.733,0.282]],"t_penguin_3_w":[[1.019,0.436]],"t_penguin_4A_0":[[0.798,0.253]],"t_penguin_4A_a":[[0.669,0.183]],"t_penguin_4A_h":[[0.84,0.253]],"t_penguin_4A_r":[[0.756,0.229]],"t_penguin_4A_w":[[1.07,0.397]],"t_penguin_4B_0":[[0.798,0.253]],"t_penguin_4B_a":[[0.669,0.183]],"t_penguin_4B_h":[[0.84,0.253]],"t_penguin_4B_r":[[0.756,0.229]],"t_penguin_4B_w":[[1.07,0.397]],"t_penguin_5A_0":[[0.826,0.199]],"t_penguin_5A_a":[[0.685,0.124]],"t_penguin_5A_h":[[0.872,0.2]],"t_penguin_5A_r":[[0.779,0.174]],"t_penguin_5A_w":[[1.123,0.357]],"t_penguin_5B_0":[[0.826,0.199]],"t_penguin_5B_a":[[0.685,0.124]],"t_penguin_5B_h":[[0.872,0.2]],"t_penguin_5B_r":[[0.779,0.174]],"t_penguin_5B_w":[[1.123,0.357]],"t_pig_1_0":[[0.702,0.447]],"t_pig_1_a":[[0.618,0.4]],"t_pig_1_h":[[0.729,0.448]],"t_pig_1_r":[[0.675,0.431]],"t_pig_1_w":[[0.881,0.543]],"t_pig_2_0":[[0.726,0.406]],"t_pig_2_a":[[0.633,0.354]],"t_pig_2_h":[[0.756,0.406]],"t_pig_2_r":[[0.696,0.387]],"t_pig_2_w":[[0.923,0.511]],"t_pig_3_0":[[0.75,0.362]],"t_pig_3_a":[[0.648,0.305]],"t_pig_3_h":[[0.784,0.363]],"t_pig_3_r":[[0.717,0.342]],"t_pig_3_w":[[0.968,0.478]],"t_pig_4A_0":[[0.775,0.316]],"t_pig_4A_a":[[0.663,0.254]],"t_pig_4A_h":[[0.812,0.317]],"t_pig_4A_r":[[0.738,0.295]],"t_pig_4A_w":[[1.014,0.443]],"t_pig_4B_0":[[0.775,0.316]],"t_pig_4B_a":[[0.663,0.254]],"t_pig_4B_h":[[0.812,0.317]],"t_pig_4B_r":[[0.738,0.295]],"t_pig_4B_w":[[1.014,0.443]],"t_pig_5A_0":[[0.801,0.269]],"t_pig_5A_a":[[0.678,0.202]],"t_pig_5A_h":[[0.841,0.27]],"t_pig_5A_r":[[0.76,0.246]],"t_pig_5A_w":[[1.061,0.408]],"t_pig_5B_0":[[0.801,0.269]],"t_pig_5B_a":[[0.678,0.202]],"t_pig_5B_h":[[0.841,0.27]],"t_pig_5B_r":[[0.76,0.246]],"t_pig_5B_w":[[1.061,0.408]],"t_sheep_1_0":[[0.649,0.608]],"t_sheep_1_a":[[0.602,0.572]],"t_sheep_1_h":[[0.663,0.608]],"t_sheep_1_r":[[0.634,0.594]],"t_sheep_1_w":[[0.753,0.661]],"t_sheep_2_0":[[0.667,0.583]],"t_sheep_2_a":[[0.615,0.544]],"t_sheep_2_h":[[0.683,0.583]],"t_sheep_2_r":[[0.651,0.568]],"t_sheep_2_w":[[0.782,0.641]],"t_sheep_3_0":[[0.685,0.557]],"t_sheep_3_a":[[0.628,0.515]],"t_sheep_3_h":[[0.703,0.557]],"t_sheep_3_r":[[0.667,0.542]],"t_sheep_3_w":[[0.811,0.622]],"t_sheep_4A_0":[[0.704,0.531]],"t_sheep_4A_a":[[0.641,0.485]],"t_sheep_4A_h":[[0.723,0.53]],"t_sheep_4A_r":[[0.684,0.514]],"t_sheep_4A_w":[[0.842,0.601]],"t_sheep_4B_0":[[0.704,0.531]],"t_sheep_4B_a":[[0.641,0.485]],"t_sheep_4B_h":[[0.723,0.53]],"t_sheep_4B_r":[[0.684,0.514]],"t_sheep_4B_w":[[0.842,0.601]],"t_sheep_5A_0":[[0.723,0.503]],"t_sheep_5A_a":[[0.654,0.453]],"t_sheep_5A_h":[[0.744,0.503]],"t_sheep_5A_r":[[0.701,0.485]],"t_sheep_5A_w":[[0.874,0.58]],"t_sheep_5B_0":[[0.723,0.503]],"t_sheep_5B_a":[[0.654,0.453]],"t_sheep_5B_h":[[0.744,0.503]],"t_sheep_5B_r":[[0.701,0.485]],"t_sheep_5B_w":[[0.874,0.58]],"t_unicorn_1_0":[[0.704,0.444]],"t_unicorn_1_a":[[0.619,0.396]],"t_unicorn_1_h":[[0.731,0.444]],"t_unicorn_1_r":[[0.676,0.427]],"t_unicorn_1_w":[[0.884,0.54]],"t_unicorn_2_0":[[0.728,0.401]],"t_unicorn_2_a":[[0.633,0.349]],"t_unicorn_2_h":[[0.758,0.402]],"t_unicorn_2_r":[[0.697,0.383]],"t_unicorn_2_w":[[0.927,0.508]],"t_unicorn_3_0":[[0.752,0.357]],"t_unicorn_3_a":[[0.648,0.3]],"t_unicorn_3_h":[[0.786,0.358]],"t_unicorn_3_r":[[0.718,0.337]],"t_unicorn_3_w":[[0.972,0.474]],"t_unicorn_4A_0":[[0.777,0.311]],"t_unicorn_4A_a":[[0.663,0.249]],"t_unicorn_4A_h":[[0.814,0.312]],"t_unicorn_4A_r":[[0.74,0.29]],"t_unicorn_4A_w":[[1.018,0.44]],"t_unicorn_4B_0":[[0.777,0.311]],"t_unicorn_4B_a":[[0.663,0.249]],"t_unicorn_4B_h":[[0.814,0.312]],"t_unicorn_4B_r":[[0.74,0.29]],"t_unicorn_4B_w":[[1.018,0.44]],"t_unicorn_5A_0":[[0.803,0.264]],"t_unicorn_5A_a":[[0.678,0.195]],"t_unicorn_5A_h":[[0.843,0.264]],"t_unicorn_5A_r":[[0.762,0.24]],"t_unicorn_5A_w":[[1.066,0.404]],"t_unicorn_5B_0":[[0.803,0.264]],"t_unicorn_5B_a":[[0.678,0.195]],"t_unicorn_5B_h":[[0.843,0.264]],"t_unicorn_5B_r":[[0.762,0.24]],"t_unicorn_5B_w":[[1.066,0.404]],"f_bliss_1_0":[[0.826,0.302],[0.341,0.564]],"f_bliss_1_a":[[0.73,0.238],[0.374,0.508]],"f_bliss_1_h":[[0.858,0.303],[0.323,0.567]],"f_bliss_1_r":[[0.795,0.28],[0.351,0.544]],"f_bliss_1_w":[[1.031,0.432],[0.23,0.659]],"f_bliss_2_0":[[0.844,0.271],[0.333,0.547]],"f_bliss_2_a":[[0.742,0.204],[0.367,0.488]],"f_bliss_2_h":[[0.877,0.272],[0.314,0.55]],"f_bliss_2_r":[[0.81,0.248],[0.344,0.525]],"f_bliss_2_w":[[1.059,0.408],[0.216,0.647]],"f_bliss_3_0":[[0.867,0.219],[0.325,0.53]],"f_bliss_3_a":[[0.756,0.146],[0.361,0.468]],"f_bliss_3_h":[[0.903,0.22],[0.305,0.533]],"f_bliss_3_r":[[0.83,0.194],[0.336,0.507]],"f_bliss_3_w":[[1.102,0.369],[0.202,0.635]],"f_frostbeam_1_0":[[0.842,0.249],[0.222,0.298]],"f_frostbeam_1_a":[[0.734,0.179],[0.282,0.209]],"f_frostbeam_1_h":[[0.877,0.25],[0.185,0.305]],"f_frostbeam_1_r":[[0.806,0.225],[0.24,0.268]],"f_frostbeam_1_w":[[1.069,0.394],[0.007,0.491]],"f_frostbeam_2_0":[[0.86,0.216],[0.208,0.267]],"f_frostbeam_2_a":[[0.747,0.142],[0.27,0.174]],"f_frostbeam_2_h":[[0.897,0.216],[0.169,0.275]],"f_frostbeam_2_r":[[0.823,0.19],[0.227,0.235]],"f_frostbeam_2_w":[[1.099,0.368],[-0.019,0.47]],"f_frostbeam_3_0":[[0.885,0.159],[0.193,0.236]],"f_frostbeam_3_a":[[0.761,0.079],[0.259,0.138]],"f_frostbeam_3_h":[[0.926,0.159],[0.152,0.244]],"f_frostbeam_3_r":[[0.844,0.132],[0.213,0.203]],"f_frostbeam_3_w":[[1.147,0.326],[-0.045,0.449]],"f_hawkeye_1_0":[[1.001,0.576],[0.157,0.665]],"f_hawkeye_1_a":[[0.975,0.538],[0.17,0.616]],"f_hawkeye_1_h":[[0.997,0.581],[0.158,0.668]],"f_hawkeye_1_r":[[0.995,0.562],[0.16,0.647]],"f_hawkeye_1_w":[[1.034,0.625],[0.129,0.724]],"f_hawkeye_2_0":[[1.027,0.559],[0.139,0.653]],"f_hawkeye_2_a":[[1.0,0.52],[0.152,0.601]],"f_hawkeye_2_h":[[1.024,0.564],[0.141,0.657]],"f_hawkeye_2_r":[[1.021,0.545],[0.142,0.634]],"f_hawkeye_2_w":[[1.062,0.611],[0.11,0.715]],"f_hawkeye_3_0":[[1.066,0.532],[0.121,0.641]],"f_hawkeye_3_a":[[1.036,0.489],[0.135,0.587]],"f_hawkeye_3_h":[[1.063,0.538],[0.122,0.645]],"f_hawkeye_3_r":[[1.059,0.516],[0.124,0.622]],"f_hawkeye_3_w":[[1.105,0.59],[0.09,0.707]],"f_inferno_1_0":[[0.913,0.487],[0.236,0.34]],"f_inferno_1_a":[[0.85,0.419],[0.291,0.258]],"f_inferno_1_h":[[0.927,0.502],[0.202,0.347]],"f_inferno_1_r":[[0.894,0.464],[0.252,0.312]],"f_inferno_1_w":[[1.016,0.63],[0.038,0.517]],"f_inferno_2_0":[[0.935,0.466],[0.222,0.311]],"f_inferno_2_a":[[0.869,0.395],[0.28,0.225]],"f_inferno_2_h":[[0.95,0.482],[0.186,0.319]],"f_inferno_2_r":[[0.915,0.441],[0.239,0.282]],"f_inferno_2_w":[[1.044,0.616],[0.013,0.497]],"f_inferno_3_0":[[0.967,0.433],[0.208,0.282]],"f_inferno_3_a":[[0.895,0.355],[0.269,0.192]],"f_inferno_3_h":[[0.983,0.45],[0.17,0.29]],"f_inferno_3_r":[[0.945,0.406],[0.226,0.251]],"f_inferno_3_w":[[1.085,0.596],[-0.011,0.478]],"f_magspike_1_0":[[0.805,0.447],[0.319,0.495]],"f_magspike_1_a":[[0.736,0.391],[0.357,0.44]],"f_magspike_1_h":[[0.826,0.449],[0.296,0.497]],"f_magspike_1_r":[[0.782,0.427],[0.331,0.475]],"f_magspike_1_w":[[0.949,0.548],[0.183,0.601]],"f_magspike_2_0":[[0.821,0.424],[0.309,0.474]],"f_magspike_2_a":[[0.748,0.365],[0.35,0.417]],"f_magspike_2_h":[[0.843,0.426],[0.286,0.477]],"f_magspike_2_r":[[0.797,0.403],[0.322,0.454]],"f_magspike_2_w":[[0.973,0.53],[0.167,0.586]],"f_magspike_3_0":[[0.842,0.387],[0.3,0.453]],"f_magspike_3_a":[[0.762,0.323],[0.342,0.393]],"f_magspike_3_h":[[0.866,0.389],[0.275,0.456]],"f_magspike_3_r":[[0.816,0.364],[0.313,0.432]],"f_magspike_3_w":[[1.008,0.502],[0.15,0.57]],"f_naturesong_1_0":[[0.765,0.522],[0.242,0.359]],"f_naturesong_1_a":[[0.711,0.475],[0.295,0.281]],"f_naturesong_1_h":[[0.782,0.522],[0.209,0.367]],"f_naturesong_1_r":[[0.748,0.505],[0.258,0.333]],"f_naturesong_1_w":[[0.884,0.594],[0.052,0.529]],"f_naturesong_2_0":[[0.779,0.503],[0.228,0.332]],"f_naturesong_2_a":[[0.722,0.453],[0.284,0.249]],"f_naturesong_2_h":[[0.797,0.502],[0.194,0.339]],"f_naturesong_2_r":[[0.761,0.484],[0.245,0.304]],"f_naturesong_2_w":[[0.904,0.579],[0.029,0.51]],"f_naturesong_3_0":[[0.796,0.473],[0.215,0.304]],"f_naturesong_3_a":[[0.734,0.419],[0.274,0.217]],"f_naturesong_3_h":[[0.816,0.472],[0.179,0.312]],"f_naturesong_3_r":[[0.777,0.453],[0.233,0.274]],"f_naturesong_3_w":[[0.933,0.556],[0.005,0.491]],"f_plague_1_0":[[0.806,0.445],[0.177,0.458]],"f_plague_1_a":[[0.737,0.391],[0.224,0.376]],"f_plague_1_h":[[0.827,0.448],[0.153,0.472]],"f_plague_1_r":[[0.784,0.426],[0.191,0.43]],"f_plague_1_w":[[0.948,0.546],[0.032,0.634]],"f_plague_2_0":[[0.822,0.422],[0.16,0.435]],"f_plague_2_a":[[0.749,0.365],[0.209,0.349]],"f_plague_2_h":[[0.844,0.425],[0.135,0.451]],"f_plague_2_r":[[0.799,0.402],[0.174,0.406]],"f_plague_2_w":[[0.972,0.528],[0.007,0.621]],"f_plague_3_0":[[0.843,0.385],[0.143,0.412]],"f_plague_3_a":[[0.764,0.323],[0.195,0.322]],"f_plague_3_h":[[0.867,0.387],[0.117,0.429]],"f_plague_3_r":[[0.818,0.362],[0.158,0.382]],"f_plague_3_w":[[1.007,0.5],[-0.017,0.607]],"f_rocketfire_1_0":[[0.894,0.476],[0.236,0.34]],"f_rocketfire_1_a":[[0.83,0.411],[0.291,0.258]],"f_rocketfire_1_h":[[0.91,0.489],[0.202,0.347]],"f_rocketfire_1_r":[[0.875,0.453],[0.252,0.312]],"f_rocketfire_1_w":[[1.006,0.611],[0.038,0.517]],"f_rocketfire_2_0":[[0.915,0.454],[0.222,0.311]],"f_rocketfire_2_a":[[0.847,0.385],[0.28,0.225]],"f_rocketfire_2_h":[[0.932,0.468],[0.186,0.319]],"f_rocketfire_2_r":[[0.894,0.43],[0.239,0.282]],"f_rocketfire_2_w":[[1.033,0.597],[0.013,0.497]],"f_rocketfire_3_0":[[0.945,0.42],[0.208,0.282]],"f_rocketfire_3_a":[[0.871,0.345],[0.269,0.192]],"f_rocketfire_3_h":[[0.963,0.434],[0.17,0.29]],"f_rocketfire_3_r":[[0.923,0.394],[0.226,0.251]],"f_rocketfire_3_w":[[1.073,0.576],[-0.011,0.478]],"f_starlight_1_0":[[0.826,0.302],[0.24,0.355]],"f_starlight_1_a":[[0.73,0.238],[0.294,0.275]],"f_starlight_1_h":[[0.858,0.303],[0.208,0.362]],"f_starlight_1_r":[[0.795,0.28],[0.257,0.328]],"f_starlight_1_w":[[1.031,0.432],[0.049,0.526]],"f_starlight_2_0":[[0.844,0.271],[0.227,0.326]],"f_starlight_2_a":[[0.742,0.204],[0.283,0.243]],"f_starlight_2_h":[[0.877,0.272],[0.192,0.334]],"f_starlight_2_r":[[0.81,0.248],[0.244,0.298]],"f_starlight_2_w":[[1.059,0.408],[0.025,0.507]],"f_starlight_3_0":[[0.867,0.219],[0.213,0.298]],"f_starlight_3_a":[[0.756,0.146],[0.272,0.211]],"f_starlight_3_h":[[0.903,0.22],[0.177,0.306]],"f_starlight_3_r":[[0.83,0.194],[0.231,0.269]],"f_starlight_3_w":[[1.102,0.369],[0.001,0.488]],"f_superconduct_1_0":[[0.846,0.236],[0.24,0.355]],"f_superconduct_1_a":[[0.735,0.164],[0.294,0.275]],"f_superconduct_1_h":[[0.882,0.237],[0.208,0.362]],"f_superconduct_1_r":[[0.809,0.212],[0.257,0.328]],"f_superconduct_1_w":[[1.079,0.385],[0.049,0.526]],"f_superconduct_2_0":[[0.864,0.202],[0.227,0.326]],"f_superconduct_2_a":[[0.748,0.126],[0.283,0.243]],"f_superconduct_2_h":[[0.902,0.202],[0.192,0.334]],"f_superconduct_2_r":[[0.826,0.176],[0.244,0.298]],"f_superconduct_2_w":[[1.11,0.358],[0.025,0.507]],"f_superconduct_3_0":[[0.889,0.144],[0.213,0.298]],"f_superconduct_3_a":[[0.762,0.062],[0.272,0.211]],"f_superconduct_3_h":[[0.931,0.144],[0.177,0.306]],"f_superconduct_3_r":[[0.847,0.116],[0.231,0.269]],"f_superconduct_3_w":[[1.158,0.315],[0.001,0.488]],"f_thornmail_1_0":[[0.805,0.447],[0.165,0.561]],"f_thornmail_1_a":[[0.736,0.391],[0.204,0.483]],"f_thornmail_1_h":[[0.826,0.449],[0.149,0.579]],"f_thornmail_1_r":[[0.782,0.427],[0.176,0.535]],"f_thornmail_1_w":[[0.949,0.548],[0.064,0.724]],"f_thornmail_2_0":[[0.821,0.424],[0.147,0.544]],"f_thornmail_2_a":[[0.748,0.365],[0.188,0.462]],"f_thornmail_2_h":[[0.843,0.426],[0.131,0.563]],"f_thornmail_2_r":[[0.797,0.403],[0.159,0.516]],"f_thornmail_2_w":[[0.973,0.53],[0.041,0.715]],"f_thornmail_3_0":[[0.842,0.387],[0.13,0.527]],"f_thornmail_3_a":[[0.762,0.323],[0.172,0.441]],"f_thornmail_3_h":[[0.866,0.389],[0.113,0.547]],"f_thornmail_3_r":[[0.816,0.364],[0.142,0.497]],"f_thornmail_3_w":[[1.008,0.502],[0.018,0.706]],"f_toxfire_1_0":[[0.806,0.445],[0.236,0.34]],"f_toxfire_1_a":[[0.737,0.391],[0.291,0.258]],"f_toxfire_1_h":[[0.827,0.448],[0.202,0.347]],"f_toxfire_1_r":[[0.784,0.426],[0.252,0.312]],"f_toxfire_1_w":[[0.948,0.546],[0.038,0.517]],"f_toxfire_2_0":[[0.822,0.422],[0.222,0.311]],"f_toxfire_2_a":[[0.749,0.365],[0.28,0.225]],"f_toxfire_2_h":[[0.844,0.425],[0.186,0.319]],"f_toxfire_2_r":[[0.799,0.402],[0.239,0.282]],"f_toxfire_2_w":[[0.972,0.528],[0.013,0.497]],"f_toxfire_3_0":[[0.843,0.385],[0.208,0.282]],"f_toxfire_3_a":[[0.764,0.323],[0.269,0.192]],"f_toxfire_3_h":[[0.867,0.387],[0.17,0.29]],"f_toxfire_3_r":[[0.818,0.362],[0.226,0.251]],"f_toxfire_3_w":[[1.007,0.5],[-0.011,0.478]],"u_cosmos_0":[[0.792,0.232],[0.254,0.239]],"u_cosmos_a":[[0.704,0.171],[0.307,0.156]],"u_cosmos_h":[[0.821,0.233],[0.22,0.247]],"u_cosmos_r":[[0.763,0.211],[0.27,0.211]],"u_cosmos_w":[[0.979,0.359],[0.061,0.422]],"u_gaia_0":[[0.773,0.372],[0.268,0.287]],"u_gaia_a":[[0.71,0.32],[0.316,0.211]],"u_gaia_h":[[0.792,0.374],[0.238,0.294]],"u_gaia_r":[[0.753,0.353],[0.283,0.262]],"u_gaia_w":[[0.904,0.47],[0.095,0.452]],"u_phoenix_0":[[0.872,0.413],[0.214,0.469]],"u_phoenix_a":[[0.814,0.347],[0.25,0.395]],"u_phoenix_h":[[0.885,0.427],[0.199,0.484]],"u_phoenix_r":[[0.855,0.39],[0.225,0.444]],"u_phoenix_w":[[0.966,0.551],[0.116,0.621]],"u_raijin_0":[[0.81,0.169],[0.311,0.422]],"u_raijin_a":[[0.709,0.099],[0.347,0.357]],"u_raijin_h":[[0.843,0.169],[0.29,0.428]],"u_raijin_r":[[0.777,0.145],[0.322,0.399]],"u_raijin_w":[[1.024,0.313],[0.187,0.546]],"u_skyhunter_0":[[0.951,0.496],[0.302,0.421]],"u_skyhunter_a":[[0.927,0.46],[0.339,0.359]],"u_skyhunter_h":[[0.948,0.501],[0.282,0.428]],"u_skyhunter_r":[[0.945,0.483],[0.313,0.399]],"u_skyhunter_w":[[0.982,0.545],[0.18,0.546]],"u_verdant_0":[[0.736,0.447],[0.311,0.422]],"u_verdant_a":[[0.686,0.401],[0.347,0.357]],"u_verdant_h":[[0.751,0.446],[0.29,0.428]],"u_verdant_r":[[0.72,0.43],[0.322,0.399]],"u_verdant_w":[[0.845,0.517],[0.187,0.546]]}};


// ---- src/ui/uiCore.js ----
/**
 * 软萌大作战 V1.0
 * UI 基础组件：按钮 / 面板 / 文字
 *
 * © 2026 <著作权人>
 */
var FONT = '"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Noto Sans SC",sans-serif';
/** 展示字体（站酷快乐体子集，用于标题、按钮、飘字），加载失败时回退系统字体 */
var FONT_DISPLAY = FONT;
var FONT_FILE = 'assets/fonts/rmfont.ttf';
function loadDisplayFont() {
  try {
    if (typeof wx !== 'undefined' && wx.loadFont) {
      var f2 = wx.loadFont(FONT_FILE);
      if (f2) FONT_DISPLAY = '"' + f2 + '",' + FONT;
    }
  } catch (e) {}
}
var UI = {
  c: null,
  t: 0,
  btns: [],
  pressId: null,
  toasts: [],
  begin: function () {
    this.btns = [];
  },
  font: function (sz, w, display) {
    this.c.font = (display ? 'normal' : w || 'bold') + ' ' + sz + 'px ' + (display ? FONT_DISPLAY : FONT);
  },
  text: function (s, x, y, sz, col, o) {
    o = o || {};
    var c = this.c;
    this.font(sz, o.w || '900', o.display !== false);
    c.textAlign = o.align || 'center';
    c.textBaseline = 'middle';
    if (o.stroke !== false) {
      c.lineJoin = 'round';
      c.lineWidth = o.sw || Math.max(2.5, sz / 5);
      c.strokeStyle = o.stroke || 'rgba(90,50,60,.9)';
      c.strokeText(s, x, y);
    }
    c.fillStyle = col || '#fff';
    c.fillText(s, x, y);
  },
  plain: function (s, x, y, sz, col, align, w) {
    var c = this.c;
    this.font(sz, w || 'bold');
    c.textAlign = align || 'center';
    c.textBaseline = 'middle';
    c.fillStyle = col;
    c.fillText(s, x, y);
  },
  // 按钮：col=主色，自动生成渐变、厚度、阴影；按下缩放
  button: function (id, x, y, w, h, label, col, fn, o) {
    o = o || {};
    var c = this.c,
      pressed = this.pressId === id,
      dis = o.disabled;
    var sc = pressed ? 0.93 : o.pulse ? 1 + Math.sin(this.t * 5) * 0.035 : 1;
    c.save();
    c.translate(x + w / 2, y + h / 2 + (pressed ? 2 : 0));
    c.scale(sc, sc);
    var base = dis ? '#b8b8c4' : col,
      r = o.r || Math.min(h / 2, 16);
    c.fillStyle = 'rgba(60,30,50,.25)';
    rr(c, -w / 2, -h / 2 + 4, w, h, r);
    c.fill();
    c.fillStyle = shade(base, -0.25);
    rr(c, -w / 2, -h / 2 + 2, w, h, r);
    c.fill();
    var g = c.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, shade(base, 0.35));
    g.addColorStop(1, base);
    c.fillStyle = g;
    rr(c, -w / 2, -h / 2, w, h - 3, r);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)';
    rr(c, -w / 2 + 6, -h / 2 + 3, w - 12, (h - 3) * 0.38, r * 0.7);
    c.fill();
    if (o.primary) {
      c.strokeStyle = 'rgba(255,255,255,.85)';
      c.lineWidth = 2.4;
      rr(c, -w / 2 + 2, -h / 2 + 2, w - 4, h - 7, r - 1);
      c.stroke();
      c.strokeStyle = shade(base, 0.55);
      c.lineWidth = 1.2;
      rr(c, -w / 2 + 4, -h / 2 + 4, w - 8, h - 11, r - 2);
      c.stroke();
    } else {
      c.strokeStyle = 'rgba(255,255,255,.55)';
      c.lineWidth = 1.4;
      rr(c, -w / 2 + 1.5, -h / 2 + 1.5, w - 3, h - 6, r - 1);
      c.stroke();
    }
    if (pressed) {
      c.fillStyle = 'rgba(40,20,40,.14)';
      rr(c, -w / 2, -h / 2, w, h - 3, r);
      c.fill();
    }
    if (o.pulse && !dis) {
      c.save();
      rr(c, -w / 2, -h / 2, w, h - 3, r);
      c.clip();
      var sx = ((this.t * 90) % (w + 80)) - w / 2 - 40;
      var sg = c.createLinearGradient(sx - 20, 0, sx + 20, 0);
      sg.addColorStop(0, 'rgba(255,255,255,0)');
      sg.addColorStop(0.5, 'rgba(255,255,255,.45)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = sg;
      c.fillRect(-w / 2, -h / 2, w, h);
      c.restore();
    }
    var tx = 0;
    if (o.icon) {
      var is = o.iconSize || h * 0.5;
      if (label) {
        this.font(o.size || 16, '900');
        var tw = c.measureText(label).width,
          tot = is + 4 + tw;
        Art.icon(c, o.icon, -tot / 2 + is / 2, -1, is);
        tx = -tot / 2 + is + 4 + tw / 2;
      } else Art.icon(c, o.icon, 0, -1, is);
    }
    if (label) this.text(label, tx, -1, o.size || 16, '#fff', { stroke: shade(base, -0.45), sw: 3.5 });
    if (o.badge) {
      c.fillStyle = '#ff4d6d';
      c.beginPath();
      c.arc(w / 2 - 4, -h / 2 + 4, 7, 0, 7);
      c.fill();
      this.text(o.badge, w / 2 - 4, -h / 2 + 4, 10, '#fff', { stroke: false });
    }
    c.restore();
    if ((!dis || o.allowDis) && this.inClip(y + h / 2)) this.btns.push({ id: id, x: x, y: y, w: w, h: h, fn: fn });
  },
  clipY: null,
  inClip: function (y) {
    return !this.clipY || (y >= this.clipY[0] && y <= this.clipY[1]);
  },
  hit: function (id, x, y, w, h, fn) {
    if (this.inClip(y + h / 2)) this.btns.push({ id: id, x: x, y: y, w: w, h: h, fn: fn });
  },
  panel: function (x, y, w, h, o) {
    o = o || {};
    var c = this.c,
      R = o.r || 22;
    // 外层柔光 + 投影，让面板从背景浮出来
    c.fillStyle = 'rgba(255,180,200,.18)';
    rr(c, x - 4, y - 2, w + 8, h + 10, R + 4);
    c.fill();
    c.fillStyle = 'rgba(80,40,60,.28)';
    rr(c, x, y + 7, w, h, R);
    c.fill();
    c.fillStyle = o.border || '#ffb3c7';
    rr(c, x, y, w, h, R);
    c.fill();
    var g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, o.top || '#fffdf8');
    g.addColorStop(0.55, o.mid || '#fff6ea');
    g.addColorStop(1, o.bot || '#ffe6d4');
    c.fillStyle = g;
    rr(c, x + 5, y + 5, w - 10, h - 10, R - 4);
    c.fill();
    // 顶部高光条
    c.fillStyle = 'rgba(255,255,255,.55)';
    rr(c, x + 10, y + 8, w - 20, 10, 6);
    c.fill();
    c.fillStyle = '#ffd23f';
    [
      [x + 12, y + 12],
      [x + w - 12, y + 12],
      [x + 12, y + h - 12],
      [x + w - 12, y + h - 12]
    ].forEach(function (q) {
      c.beginPath();
      c.arc(q[0], q[1], 3.2, 0, 7);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)';
      c.beginPath();
      c.arc(q[0] - 1, q[1] - 1, 1.2, 0, 7);
      c.fill();
      c.fillStyle = '#ffd23f';
    });
    if (o.title) {
      var tw = Math.max(150, o.title.length * 24 + 40),
        tx = x + w / 2 - tw / 2;
      c.fillStyle = shade(o.border || '#ff8fb1', -0.2);
      rr(c, tx - 6, y - 16, tw + 12, 40, 14);
      c.fill();
      var g2 = c.createLinearGradient(0, y - 18, 0, y + 20);
      g2.addColorStop(0, shade(o.border || '#ff8fb1', 0.25));
      g2.addColorStop(1, o.border || '#ff8fb1');
      c.fillStyle = g2;
      rr(c, tx, y - 18, tw, 36, 14);
      c.fill();
      this.text(o.title, x + w / 2, y, 20, '#fff', { stroke: shade(o.border || '#ff8fb1', -0.5) });
    }
  },
  dim: function (a) {
    this.c.fillStyle = 'rgba(40,20,40,' + (a == null ? 0.55 : a) + ')';
    this.c.fillRect(0, 0, CFG.W, CFG.H);
  },
  pill: function (x, y, w, h, icon, val, o) {
    var c = this.c;
    c.fillStyle = 'rgba(255,255,255,.85)';
    rr(c, x, y, w, h, h / 2);
    c.fill();
    c.strokeStyle = 'rgba(200,140,150,.5)';
    c.lineWidth = 1.5;
    c.stroke();
    Art.icon(c, icon, x + h / 2, y + h / 2, h * 0.85);
    this.text(String(val), x + w / 2 + h / 4, y + h / 2 + 0.5, 13, '#7a4a55', { stroke: false });
  },
  bar: function (x, y, w, h, k, col, bg) {
    var c = this.c;
    c.fillStyle = bg || 'rgba(90,50,60,.25)';
    rr(c, x, y, w, h, h / 2);
    c.fill();
    if (k > 0) {
      c.fillStyle = col;
      rr(c, x, y, Math.max(h, w * Math.min(1, k)), h, h / 2);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)';
      rr(c, x + 2, y + 1, Math.max(0, w * Math.min(1, k) - 4), h * 0.35, h / 4);
      c.fill();
    }
  },
  toast: function (s, col) {
    this.toasts.push({ s: s, t: 1.6, col: col || '#fff' });
    if (this.toasts.length > 3) this.toasts.shift();
  },
  drawToasts: function (dt) {
    var c = this.c,
      self = this;
    this.toasts = this.toasts.filter(function (t, i) {
      t.t -= dt;
      var a = Math.min(1, t.t * 3),
        y = 250 - i * 40 - (1.6 - t.t) * 10;
      c.globalAlpha = a;
      self.font(16, '900');
      var w = c.measureText(t.s).width + 40;
      c.fillStyle = 'rgba(60,30,50,.82)';
      rr(c, CFG.W / 2 - w / 2, y - 18, w, 36, 18);
      c.fill();
      self.text(t.s, CFG.W / 2, y, 16, t.col, { stroke: false });
      c.globalAlpha = 1;
      return t.t > 0;
    });
  },
  tap: function (x, y) {
    for (var i = this.btns.length - 1; i >= 0; i--) {
      var b = this.btns[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
    }
    return null;
  }
};


// ---- src/scenes/sceneGame.js ----
/**
 * 软萌大作战 V1.0
 * 战斗场景
 *
 * © 2026 <著作权人>
 */
var GS = {
  g: null,
  speed: 1,
  paused: false,
  drag: null,
  sel: null,
  banner: null,
  castleHurt: 0,
  clouds: [],
  panel: null,
  panelK: 0,
  tut: -1,
  cardAnim: [],
  resultK: 0,
  pickT: 0,
  adBusy: false,
  start: function (level, existing) {
    var self = this;
    FX.clear();
    Platform.recStart();
    this.level = level;
    this.corpses = [];
    if (existing) {
      this.g = existing;
      existing.emit = function (n, d) {
        self.on(n, d);
      };
      existing.setLevel(level);
      existing.state = 'prep';
    } else
      this.g = new Game(level, {
        emit: function (n, d) {
          self.on(n, d);
        }
      });
    this.g.mz = function (t, ty) {
      return self.muzzleOf(t, ty);
    };
    this.speed = Storage.get('speed', 1);
    this.paused = false;
    this.drag = null;
    this.sel = null;
    Art.buildBG(level);
    this.banner = null;
    this.panel = null;
    this.result = null;
    this.tut = !Save.d.tut && level.id == '1-1' ? 0 : -1;
    // 1-2 引导提示：搭配阵容 / 强化卡 / 首领波，各提示一次
    this.tips = level.id == '1-2' && !(Save.d.tips && Save.d.tips.l12) ? ['team', 'card', 'boss'] : [];
    this.tipT = 0;
    this.bossE = null;
    this.bossIntro = null;
    this.seen = {};
    this.snow = [];
    this.arcs = [];
    this.hearts = [];
    this.ultFx = [];
    this.popups = [];
    this.popup = null;
    this.cine = null;
    this.amb = [];
    this.clouds = [0, 1, 2, 3].map(function (i) {
      return {
        x: Math.random() * 360,
        y: 62 + i * 22 + Math.random() * 10,
        s: 0.6 + Math.random() * 0.5,
        v: 5 + Math.random() * 6
      };
    });
    var M = {
        endless: '无尽模式',
        daily: '每日挑战',
        bossrush: '首领车轮战',
        weekly: level.evName || '周活动',
        exp: '远征'
      }[level.mode],
      ch = level.c ? CFG.CHAPTERS[level.c - 1] : null;
    var mods = (level.mods || [])
      .map(function (k) {
        return CFG.MODS[k] ? CFG.MODS[k].name : k;
      })
      .join(' · ');
    this.showBanner(
      M || '关卡 ' + level.id + (level.elite ? ' 精英' : ''),
      M ? mods || '坚持越久奖励越多' : level.l == 1 && ch ? ch.intro : '守护城堡，坚持 ' + level.waves + ' 波',
      level.elite ? '#b46cff' : '#ff8fb1'
    );
  },
  showBanner: function (t, sub, col, boss) {
    this.banner = { t: t, sub: sub, col: col, life: 2.2, boss: boss };
  },
  // ---- 逻辑事件 -> 表现 ----
  on: function (n, d) {
    var g = this.g;
    switch (n) {
      case 'spawnTower':
        d.pop = 0.3;
        var sp = g.tpos(d);
        FX.burst(sp.x, sp.y, 16, {
          colors: ['#fff', '#ffd23f', '#ff8fb1'],
          shape: 'star',
          speed: 130,
          size: 5.5
        });
        FX.ring(sp.x, sp.y, 36, '#ffd23f', 0.35);
        Sfx.play('place');
        Platform.vibrate(12);
        break;
      case 'merge':
        var p = g.tpos(d),
          D0 = CFG.TOWERS[d.type],
          tc = D0.parts ? D0.color : VFX.tierCol(d.lv),
          pwm = g.lvE(d);
        d.pop = 0.5;
        d.mergeT = 0.9;
        FX.flash = Math.max(FX.flash, 0.12 + pwm * 0.03);
        FX.ring(p.x, p.y, 40 + pwm * 5, tc, 0.5);
        FX.ring(p.x, p.y, 24, '#ffffff', 0.3);
        if (pwm >= 3) FX.ring(p.x, p.y, 70 + pwm * 4, '#ffd23f', 0.7);
        FX.burst(p.x, p.y, 18 + pwm * 5, {
          colors: [tc, '#fff', '#ffd23f', shade(tc, 0.4)],
          shape: 'star',
          speed: 150 + pwm * 12,
          size: 5 + pwm * 0.4,
          up: 60
        });
        FX.shake = Math.max(FX.shake, 2 + pwm * 0.6);
        FX.text(p.x, p.y - 34, 'Lv' + d.lv + '!', { color: tc, size: 20 + pwm * 1.5, life: 1.1 });
        Sfx.play(pwm >= 4 ? 'upgrade' : 'merge');
        Platform.vibrate(pwm >= 5 ? 40 : pwm >= 4 ? 28 : 15);
        var sk = d.type + '_' + d.lv + (d.branch || '');
        if (!g.noMeta && d.lv >= 2 && !D0.ultimate) {
          Save.d.seenLv = Save.d.seenLv || {};
          if (!Save.d.seenLv[sk] && !(d.lv == CFG.BRANCH_LV && !d.branch && !D0.parts)) {
            Save.d.seenLv[sk] = 1;
            Save.save();
            this.queuePopup({ k: 'evo', type: d.type, lv: d.lv, br: d.branch, t: 0 });
          }
        }
        break;
      case 'fusion':
        var fp0 = g.tpos(d.t),
          FD = CFG.TOWERS[d.t.type];
        d.t.pop = 0.8;
        d.t.mergeT = 1.6;
        this.cine = { x: fp0.x, y: fp0.y, t: 0, ult: d.ult, col: FD.color, type: d.t.type };
        FX.flash = d.ult ? 1.15 : 0.85;
        FX.shake = d.ult ? 26 : 14;
        Platform.vibrate(d.ult ? 50 : 28);
        for (var fi = 0; fi < (d.ult ? 5 : 3); fi++)
          FX.ring(fp0.x, fp0.y, 60 + fi * 40, d.ult ? VFX.RB[fi] : FD.color, 0.6 + fi * 0.15);
        FX.burst(fp0.x, fp0.y, d.ult ? 80 : 50, {
          colors: d.ult ? VFX.RB : [FD.color, '#fff', '#ffd23f'],
          shape: 'star',
          speed: d.ult ? 320 : 240,
          size: 8
        });
        Sfx.play('legend');
        Platform.vibrate();
        var known = !g.noMeta && Save.d.fusions && Save.d.fusions[d.t.type] === 1;
        if (!g.noMeta) {
          Save.d.fusions[d.t.type] = 2;
          Save.save();
        }
        this.queuePopup({ k: d.ult ? 'ult' : 'fuse', type: d.t.type, from: d.from, t: 0, first: known });
        break;
      case 'fire':
        var ft = d.t,
          fp = g.tpos(ft);
        VFX.muzzle(d.mx != null ? d.mx : fp.x, d.my != null ? d.my : fp.y - 10, ft.aim, d.pw, ft);
        Sfx.play(d.mech == 'cannon' || d.mech == 'missile' ? 'hit' : 'shoot');
        break;
      case 'snipe':
        FX.beam({
          x: d.x,
          y: d.y,
          x2: d.x2,
          y2: d.y2,
          pw: d.pw,
          col: d.pw >= 9 ? 'rainbow' : d.pw >= 6 ? 'rgba(255,200,90,.55)' : 'rgba(255,240,200,.5)',
          core: '#fff'
        });
        VFX.impact(d.x2, d.y2, d.pw + 1, null, '#ffd23f');
        FX.shake = Math.max(FX.shake, 1.5 + d.pw * 0.3);
        Sfx.play('boom');
        break;
      case 'magnet':
        var mp = d;
        this.arcs.push({ x: mp.x, y: mp.y, e: mp.e, t: 0.3, pw: mp.pw });
        VFX.impact(mp.e.x, mp.e.y, mp.pw, null, '#ff4d6d');
        break;
      case 'hole':
        FX.ring(d.x, d.y, d.r, '#b46cff', 0.4);
        Sfx.play('zap');
        break;
      case 'summon':
        var sp0 = g.tpos(d.t);
        FX.burst(sp0.x, sp0.y - 10, 8 + d.pw * 2, {
          colors: ['#ffe066', '#fff', '#ff8a3d'],
          shape: 'star',
          speed: 90,
          size: 4
        });
        break;
      case 'minionPop':
        VFX.impact(d.x, d.y, d.pw, null, d.plague ? '#9be37a' : '#ffe066');
        if (d.plague)
          FX.burst(d.x, d.y, 12, { colors: ['#9be37a', '#c8ff9a', '#b46cff'], speed: 50, size: 6, g: -30, life: 0.8 });
        break;
      case 'poisonHit':
        VFX.impact(d.e.x, d.e.y, d.pw, null, '#9be37a');
        FX.burst(d.e.x, d.e.y, 3 + d.pw, {
          colors: ['#9be37a', '#c8ff9a', '#b46cff'],
          speed: 30,
          size: 3 + d.pw * 0.4,
          g: -50,
          life: 0.6
        });
        if (d.r) FX.ring(d.e.x, d.e.y, d.r, '#9be37a', 0.3);
        break;
      case 'spikeHit':
        VFX.impact(d.e.x, d.e.y, d.pw, null, d.mag ? '#ff4d6d' : '#e8c890');
        break;
      case 'hit':
        VFX.impact(d.e.x, d.e.y, d.pw, null);
        break;
      case 'towerHeal':
        var hp0 = g.tpos(d.t);
        for (var hi = 0; hi < 3; hi++) this.hearts.push({ x: hp0.x, y: hp0.y - 10, t: -hi * 0.12 });
        break;
      case 'ultSkill':
        this.ultFx.push({ k: d.k, t: 0, x: d.x, y: d.y, pts: d.pts });
        if (!d.quiet) {
          FX.flash = 0.35;
          FX.shake = 10;
          this.showBanner(
            CFG.TOWERS[d.t.type].name,
            { cosmos: '星海吞噬！', meteor: '流星火雨！', gaia: '万物生长！', volley: '万箭齐发！', verdant: '苍翠绽放！', storm: '雷暴领域！' }[d.k] || '',
            CFG.TOWERS[d.t.type].color
          );
        }
        Sfx.play('legend');
        break;
      case 'dmg':
        if (d.txt) {
          FX.text(d.e.x, d.e.y - d.e.r - 8, d.txt, { color: '#ffd23f', size: 13 });
          break;
        }
        if (d.v < 0.5) break;
        // 伤害数字合并：同一敌人 0.3 秒内的普通伤害累加到同一个数字上；暴击单独弹出
        if (!d.crit && d.e._ft && d.e._ft.life > d.e._ft.max - 0.3) {
          d.e._ft.v += d.v;
          d.e._ft.txt = fmtDmg(d.e._ft.v);
          d.e._ft.x = d.e.x;
        } else if (d.crit || FX.texts.length < (g.enemies.length > 30 ? 10 : g.enemies.length > 15 ? 16 : 24)) {
          var ft = FX.text(d.e.x, d.e.y - d.e.r - 6, fmtDmg(d.v) + (d.crit ? '!' : ''), {
            color: d.crit ? '#ffd23f' : '#fff',
            size: d.crit ? 19 : 12,
            life: d.crit ? 0.9 : 0.6
          });
          if (!d.crit) {
            ft.v = d.v;
            d.e._ft = ft;
          }
        }
        Sfx.play('hit');
        if (d.crit) Platform.vibrate(18);
        break;
      case 'die':
        var e = d.e;
        this.corpses.push({
          k: e.boss ? e.boss.id : e.type,
          x: e.x,
          y: e.y + e.r * 0.75,
          s: e.r * (e.boss ? 3.3 : 3.5),
          t: 0.45
        });
        if (this.corpses.length > 24) this.corpses.shift();
        FX.burst(e.x, e.y, e.boss ? 40 : 12, {
          colors: [e.color, shade(e.color, 0.5), '#fff'],
          speed: e.boss ? 200 : 110,
          size: e.boss ? 7 : 4.5
        });
        FX.ring(e.x, e.y, e.r * 2, shade(e.color, 0.3), 0.3);
        FX.burst(e.x, e.y - e.r, e.boss ? 14 : 5, {
          colors: ['#ffffff', '#fff3c4'],
          shape: 'star',
          speed: e.boss ? 160 : 80,
          size: e.boss ? 6 : 4,
          g: -20,
          life: 0.6
        });
        FX.burst(e.x, e.y, e.boss ? 10 : 4, {
          colors: ['rgba(255,255,255,.8)'],
          speed: 30,
          size: e.boss ? 14 : 8,
          g: -30,
          life: 0.5
        });
        if (d.gold) {
          // 小额金币只在敌人稀少时显示，避免满屏 +1 +2
          if (d.gold >= 5 || FX.texts.length < 12)
            FX.text(e.x, e.y - 6, '+' + d.gold, { color: '#ffd23f', size: 12, vy: -70 });
          Sfx.play('coin');
        }
        Sfx.play('pop');
        if (e.boss) {
          FX.shake = 12;
          FX.flash = 0.6;
          this.showBanner('首领击败!', '获得大量金币', '#ffb020');
          Sfx.play('win');
        }
        break;
      case 'drop':
        var dp = g.tpos(d.t);
        FX.burst(dp.x, dp.y, 18, {
          colors: ['#ffd23f', '#fff', '#ff8fb1'],
          shape: 'star',
          speed: 90,
          size: 4,
          life: 0.8
        });
        UI.toast('首领掉落：' + CFG.TOWERS[d.t.type].name + ' Lv3！');
        break;
      case 'reso':
        if (!this.resoTold) {
          this.resoTold = 1;
          UI.toast('融合共鸣：更容易刷出配方伙伴');
        }
        break;
      case 'leak':
        this.castleHurt = 0.55;
        FX.shake = Math.max(FX.shake, d.boss ? 14 : 5);
        Platform.vibrate(d.boss ? 45 : 22);
        FX.burst(CFG.CASTLE.x, CFG.CASTLE.y - 20, 10, { color: '#ff5a7a', shape: 'heart', speed: 90 });
        FX.text(CFG.CASTLE.x, CFG.CASTLE.y - 50, '-' + d.leak, { color: '#ff5a7a', size: 18 });
        Sfx.play('leak');
        Platform.vibrate();
        break;
      case 'lightning':
        FX.bolt(d.pts, { pw: d.pw, col: d.sc ? 'rgba(140,230,255,.65)' : null });
        var lp = d.pts[d.pts.length - 1];
        VFX.impact(lp[0], lp[1], d.pw, null, '#e8c8ff');
        Sfx.play('zap');
        break;
      case 'beam':
        FX.beam(d);
        Sfx.play('zap');
        break;
      case 'explode':
        var ep = d.pw || 1;
        FX.ring(d.x, d.y, d.r, d.fire ? '#ff7a1a' : '#ffb35a', 0.35 + ep * 0.02);
        if (ep >= 3) FX.ring(d.x, d.y, d.r * 0.6, '#fff3c4', 0.25);
        var busy = FX.ps.length > 260;
        FX.burst(d.x, d.y, busy ? 5 : Math.min(24, 8 + ep * 2), {
          colors: d.fire ? ['#ff7a1a', '#ffd23f', '#fff'] : ['#ffb35a', '#fff3c4', '#9a8a7a'],
          speed: 110 + ep * 12,
          size: 3 + ep * 0.3,
          g: 40,
          life: 0.45
        });
        if (ep >= 4 && !busy)
          FX.burst(d.x, d.y, 3 + Math.floor(ep / 2), {
            colors: ['rgba(140,120,110,.55)', 'rgba(200,184,168,.55)'],
            speed: 30,
            size: 5 + ep * 0.3,
            g: -40,
            life: 0.6
          });
        if (ep >= 6 && !busy) FX.ring(d.x, d.y, d.r * 1.2, '#ffffff', 0.3);
        FX.shake = Math.max(FX.shake, 2 + ep * 0.35);
        Sfx.play('boom');
        break;
      case 'frostHit':
        VFX.impact(d.e.x, d.e.y, d.pw, null, '#bfe9ff');
        if (d.pw >= 3) FX.ring(d.e.x, d.e.y, d.R, '#bfe9ff', 0.3);
        break;
      case 'fireHit':
        VFX.impact(d.e.x, d.e.y, d.pw, null, '#ff7a1a');
        FX.burst(d.e.x, d.e.y, 3 + d.pw, { colors: ['#ff7a1a', '#ffd23f'], speed: 50, size: 3.5, g: -60 });
        break;
      case 'shieldBreak':
        FX.burst(d.x, d.y, 14, { colors: ['#bfe9ff', '#fff'], shape: 'spark', speed: 130, size: 5 });
        FX.text(d.x, d.y - 20, '破盾!', { color: '#8fd3ff', size: 14 });
        break;
      case 'heal':
        FX.burst(d.x, d.y, 3, { color: '#7fe07f', shape: 'heart', speed: 30, size: 4, g: -40 });
        break;
      case 'bossWarn':
        this.showBanner('首领来袭!', d.name + ' · ' + d.skill, '#ff4d6d', true);
        this.bossIntro = { boss: d, t: 0, life: 2.6 };
        FX.shake = 14;
        FX.flash = 0.55;
        Sfx.play('boss');
        Platform.vibrate(40);
        break;
      case 'spawn':
        if (d.type && d.type != 'mini' && !this.seen[d.type]) {
          this.seen[d.type] = 1;
          if (d.type != 'normal')
            UI.toast('新敌人：' + CFG.ENEMIES[d.type].name + '（' + CFG.ENEMIES[d.type].desc + '）', '#ffe0a0');
        }
        if (d.boss) {
          this.bossE = d;
          FX.shake = 14;
        }
        break;
      case 'skill':
        FX.text(d.e.x, d.e.y - d.e.r - 18, d.txt, { color: '#ff8fb1', size: 15, life: 1.1 });
        FX.ring(d.e.x, d.e.y, d.e.r * 2.2, '#ff8fb1', 0.5);
        break;
      case 'timestop':
        FX.flash = 0.5;
        UI.toast('时间停止!', '#8fd3ff');
        break;
      case 'waveStart':
        Sfx.play('wave');
        Platform.vibrate(20);
        if (!g.isBossWave(d)) this.showBanner('第 ' + d + ' 波', '', '#ff8fb1');
        break;
      case 'pigGold':
        var pp = g.tpos(d.t);
        FX.text(pp.x, pp.y - 30, '+' + d.v, { color: '#ffd23f', size: 15, life: 1.2 });
        FX.burst(pp.x, pp.y, 8, { color: '#ffd23f', speed: 80, size: 4 });
        Sfx.play('coin');
        break;
      case 'waveClear':
        UI.toast('波次完成 +' + d.bonus + ' 金币', '#ffd23f');
        if (g.level && g.level.mode == 'endless' && g.wave > 0 && g.wave % 10 == 0) {
          Sfx.play('legend');
          Platform.vibrate(20);
          this.showBanner('无尽 ' + g.wave + ' 波！', '继续坚持，里程碑奖励在玩法页领取', '#7a6cff');
        }
        if (g.endlessLaw) {
          Sfx.play('legend');
          Platform.vibrate(28);
          this.showBanner('法则抉择', '选择一条永久规则强化构筑', '#7a6cff');
        }
        break;
      case 'build':
        var b = BUILDS[d];
        this.showBanner('流派激活!', b.name + '：' + b.desc, b.color);
        Sfx.play('legend');
        break;
      case 'sell':
        var sp = g.tpos(d.t);
        FX.text(sp.x, sp.y, '+' + d.v, { color: '#ffd23f', size: 16 });
        Sfx.play('coin');
        Platform.vibrate(12);
        break;
      case 'storm':
        UI.toast('暴风雪来袭！', '#bfe9ff');
        break;
      case 'switch':
        UI.toast('流沙移动，路线改变！', '#ffe0a0');
        FX.shake = 4;
        break;
      case 'towerFrozen':
        var fp2 = g.tpos(d);
        FX.burst(fp2.x, fp2.y, 10, { colors: ['#fff', '#bfe9ff'], shape: 'spark', speed: 90, size: 5 });
        break;
      case 'heroSkill':
        FX.flash = 0.5;
        FX.shake = 8;
        this.showBanner(CFG.HEROES[d].skill + '!', CFG.HEROES[d].name, CFG.HEROES[d].color);
        if (d == 'princess')
          FX.burst(180, 220, 50, { colors: ['#fff', '#bfe9ff'], shape: 'spark', speed: 250, size: 6, g: 0 });
        break;
      case 'coinRain':
        for (var ci = 0; ci < 20; ci++)
          FX.burst(Math.random() * 360, 60, 1, { color: '#ffd23f', speed: 40, size: 6, g: 300, life: 1.2 });
        UI.toast('+' + d + ' 金币', '#ffd23f');
        break;
      case 'thunder':
        d.forEach(function (e) {
          FX.bolt(
            [
              [e.x, 40],
              [e.x + (Math.random() - 0.5) * 30, e.y]
            ],
            { pw: 8 }
          );
          VFX.impact(e.x, e.y, 6, null, '#8fd3ff');
        });
        Sfx.play('zap');
        break;
      case 'themeShift':
        Art.bgCache = {};
        Art.buildBG(this.level);
        this.amb = [];
        this.showBanner('场景切换', '无尽空间折叠至新主题', '#b46cff');
        FX.flash = 0.4;
        Sfx.play('wave');
        break;
      case 'win':
        this.finish(true);
        break;
      case 'lose':
        this.finish(false);
        break;
    }
  },
  finish: function (win) {
    var g = this.g,
      L = this.level,
      self = this;
    this.result = { win: win, rw: g.rewards(), t: 0, doubled: false };
    Platform.recStop(function (p) {
      if (self.result) self.result.video = !!p;
    });
    var id = L.id;
    Sfx.play(win ? 'win' : 'lose');
    if (L.mode == 'exp') {
      this.result.exp = true;
      return;
    }
    if (win && !L.mode && this.result.rw.stars > (Save.d.stars[id] || 0)) Save.d.stars[id] = this.result.rw.stars;
    if (win && !L.mode) {
      var nu = Save.syncUnlocks();
      nu.forEach(function (t) {
        self.popups.push({ k: 'unlock', type: t, t: 0 });
      });
      Save.save();
    }
    if (L.mode == 'endless') {
      if (g.wave > Save.d.best) Save.d.best = g.wave;
      Platform.submitScore('endless', g.wave);
    }
    if (L.mode == 'daily') {
      Platform.submitScore('daily', g.wave);
      if (Save.d.dailyDate != Save.today()) {
        Save.d.dailyDate = Save.today();
        this.result.rw.gems = (this.result.rw.gems || 0) + 30;
      }
    }
    if (L.mode == 'bossrush') {
      Platform.submitScore('bossrush', g.stats.bosses);
    }
    if (L.mode == 'weekly') {
      Platform.submitScore('weekly', Save.d.weekly.pts + g.wave * 10 + g.stats.bosses * 30);
    }
    if (!win && !g.revived && L.mode != 'bossrush') this.result.canRevive = true;
    if (!this.result.canRevive) this.grantResult();
    Save.save();
  },
  grantResult: function () {
    var r = this.result;
    if (r.granted) return;
    r.granted = true;
    Save.add({ candy: r.rw.candy, gems: r.rw.gems || 0 });
    r.xp = Meta.afterBattle(this.g, this.level);
    Save.save();
  },
  update: function (dt) {
    var g = this.g;
    if (this.banner) {
      this.banner.life -= dt;
      if (this.banner.life <= 0) this.banner = null;
    }
    this.castleHurt = Math.max(0, this.castleHurt - dt);
    this.clouds.forEach(function (c) {
      c.x += c.v * dt;
      if (c.x > 400) c.x = -60;
    });
    if (this.result) {
      this.result.t += dt;
    }
    if (g.state == 'pick') {
      this.pickT += dt;
    } else this.pickT = 0;
    if (!this.popup && this.popups.length && !this.cine) this.popup = this.popups.shift();
    if (this.popup) this.popup.t += dt;
    if (this.cine) {
      this.cine.t += dt;
      if (this.cine.t > (this.cine.ult ? 2.8 : 1.55)) this.cine = null;
    }
    if (this.bossIntro) {
      this.bossIntro.t += dt;
      if (this.bossIntro.t >= this.bossIntro.life) this.bossIntro = null;
    }
    this.arcs = this.arcs.filter(function (a) {
      a.t -= dt;
      return a.t > 0;
    });
    this.hearts = this.hearts.filter(function (h) {
      h.t += dt;
      return h.t < 0.9;
    });
    this.ultFx = this.ultFx.filter(function (u) {
      u.t += dt;
      return u.t < 1.6;
    });
    this.updAmb(dt);
    var sdt = this.paused || g.pendingBranch || this.popup || this.cine || (this.bossIntro && this.bossIntro.t < 1.8) ? 0 : dt * this.speed;
    for (var i = 0; i < 2; i++) g.update(sdt / 2);
    g.towers.forEach(function (t) {
      if (t.pop > 0) t.pop -= dt;
    });
    this.corpses = this.corpses.filter(function (k) {
      k.t -= dt;
      return k.t > 0;
    });
    g.enemies.forEach(function (e) {
      if (e.burnT > 0 && Math.random() < dt * 8)
        FX.burst(e.x, e.y - e.r * 0.5, 1, { colors: ['#ff7a1a', '#ffd23f'], speed: 15, size: 3, g: -80, life: 0.5 });
    });
    if (g.blizzard) {
      var n = g.storm > 0 ? 6 : 1;
      for (var s = 0; s < n; s++)
        if (Math.random() < dt * 20)
          this.snow.push({ x: Math.random() * 400 - 20, y: -5, v: 40 + Math.random() * 60, w: Math.random() * 6 });
    }
    this.snow = this.snow.filter(function (f) {
      f.y += f.v * dt;
      f.x += (g.storm > 0 ? -60 : -10) * dt + Math.sin(f.y / 20 + f.w) * 0.5;
      return f.y < CFG.FIELD_BOT;
    });
    FX.update(sdt > 0 ? dt * this.speed : dt * 0.3);
  },
  tutBlock: function () {
    return false;
  },
  // ---- 绘制 ----
  draw: function () {
    var c = UI.c,
      g = this.g,
      self = this,
      t = UI.t;
    UI.begin();
    c.save();
    if (FX.shake > 0) c.translate((Math.random() - 0.5) * FX.shake, (Math.random() - 0.5) * FX.shake);
    c.drawImage(Art.bg, 0, 0, CFG.W, CFG.H);
    this.drawAmb();
    this.clouds.forEach(function (cl) {
      c.fillStyle = 'rgba(255,255,255,.75)';
      c.beginPath();
      [
        [0, 0, 14],
        [14, -6, 17],
        [30, 0, 13],
        [16, 5, 13]
      ].forEach(function (q) {
        c.moveTo(cl.x + q[0] * cl.s + q[2] * cl.s, cl.y + q[1] * cl.s);
        c.arc(cl.x + q[0] * cl.s, cl.y + q[1] * cl.s, q[2] * cl.s, 0, 7);
      });
      c.fill();
    });
    Art.castle(c, CFG.CASTLE.x, CFG.CASTLE.y, t, this.castleHurt);
    // 城堡血条
    var hk = g.hp / g.maxHp;
    UI.bar(
      CFG.CASTLE.x - 28,
      CFG.CASTLE.y + 24,
      56,
      8,
      hk,
      hk > 0.5 ? '#6ee07a' : hk > 0.25 ? '#ffc93c' : '#ff5a7a',
      'rgba(90,50,60,.35)'
    );
    this.drawMech();
    // 尸体（死亡帧）
    this.corpses.forEach(function (k) {
      var a = k.t / 0.45;
      c.save();
      c.globalAlpha = a;
      c.translate(k.x, k.y);
      c.scale(1 + (1 - a) * 0.4, a * 0.8 + 0.2);
      Art.drawAt(c, 'e_' + k.k + '_d', 0, 0, k.s);
      c.restore();
    });
    this.drawHoles();
    // 敌人
    var es = g.enemies.slice().sort(function (a, b) {
      return a.y - b.y;
    });
    es.forEach(function (e) {
      // 传送门保护期：半透明淡入，提示此时无法被锁定
      var safe = e.prog < g.portalSafe;
      if (safe) {
        c.save();
        c.globalAlpha = 0.45 + 0.4 * (e.prog / g.portalSafe);
      }
      self.drawEnemy(e);
      if (safe) c.restore();
    });
    // 子弹
    g.shots.forEach(function (b) {
      self.drawShot(b);
    });
    this.drawMinions();
    this.drawArcs();
    // 网格高亮（拖动时）：同类可合成=金色；跨塔融合=彩虹
    if (this.drag && this.drag.moved) {
      g.towers.forEach(function (o) {
        var fz = g.fuseResult(self.drag.t, o);
        if (fz) {
          var p = g.tpos(o);

          c.save();
          var pu = 0.6 + Math.sin(t * 12) * 0.4;
          c.shadowColor = VFX.rainbow(0);
          c.shadowBlur = (g.enemies.length > 28 ? 8 : 22) * pu;
          c.lineWidth = 4;
          c.strokeStyle = VFX.rainbow(0);
          c.fillStyle = 'rgba(255,255,255,' + (0.25 * pu + 0.15) + ')';
          rr(c, p.x - 29, p.y - 29, 58, 58, 13);
          c.fill();
          c.stroke();
          c.restore();
          for (var si = 0; si < 3; si++) {
            var an = t * 4 + si * 2.1;
            Art.icon(c, 'star', p.x + Math.cos(an) * 30, p.y + Math.sin(an) * 30, 9);
          }
        }
      });
      g.towers.forEach(function (o) {
        if (g.canMerge(self.drag.t, o) || g.canFeed(o, self.drag.t) || g.canFeed(self.drag.t, o)) {
          var p = g.tpos(o);
          c.save();
          var pu = 0.6 + Math.sin(t * 10) * 0.4;
          c.shadowColor = '#ffd23f';
          c.shadowBlur = 16 * pu;
          c.fillStyle = 'rgba(255,230,120,' + (0.35 * pu + 0.15) + ')';
          rr(c, p.x - 28, p.y - 28, 56, 56, 12);
          c.fill();
          c.strokeStyle = '#ffb020';
          c.lineWidth = 3;
          c.stroke();
          c.restore();
          self._mt = p;
        }
      });
      var hc = this.cellAt(this.drag.x, this.drag.y);
      if (hc) {
        c.fillStyle = 'rgba(255,255,255,.4)';
        rr(c, CFG.GRID_X + hc.c * CFG.CELL + 3, CFG.GRID_Y + hc.r * CFG.CELL + 3, CFG.CELL - 6, CFG.CELL - 6, 12);
        c.fill();
      }
    }
    // 塔
    g.towers
      .slice()
      .sort(function (a, b) {
        return a.r - b.r;
      })
      .forEach(function (tw) {
        if (self.drag && self.drag.t === tw && self.drag.moved) return;
        var p = g.tpos(tw);
        self.drawTower(tw, p.x, p.y, 1);
      });
    // 选中塔范围
    if (this.sel && g.towers.indexOf(this.sel) >= 0 && CFG.TOWERS[this.sel.type].range) {
      var sp = g.tpos(this.sel),
        st = g.stats4(this.sel);
      c.save();
      c.fillStyle = 'rgba(255,255,255,.12)';
      c.strokeStyle = 'rgba(255,255,255,.7)';
      c.setLineDash([6, 6]);
      c.lineWidth = 2;
      c.beginPath();
      c.arc(sp.x, sp.y, st.range, 0, 7);
      c.fill();
      c.stroke();
      c.restore();
    }
    FX.draw(c);
    if (this.drag && this.drag.moved) {
      g.towers.forEach(function (o) {
        if (g.canMerge(self.drag.t, o) || g.canFeed(o, self.drag.t) || g.canFeed(self.drag.t, o)) {
          var p = g.tpos(o);
          UI.text('可合成', p.x, p.y - 34 + Math.sin(t * 8) * 2, 11, '#fff', { stroke: '#ff9f43' });
        }
        var fz = g.fuseResult(self.drag.t, o);
        if (fz) {
          var q = g.tpos(o),
            kn = Meta.known(fz);
          c.fillStyle = 'rgba(60,30,80,.85)';
          rr(c, q.x - 40, q.y - 70, 80, 34, 12);
          c.fill();
          if (kn) Art.drawAt(c, fz + (fz[0] == 'f' ? '_1' : '') + '_0', q.x - 24, q.y - 38, 30);
          else UI.text('?', q.x - 24, q.y - 53, 18, '#ffe066');
          UI.text(fz[0] == 'u' ? '究极融合!' : '融合!', q.x + 10, q.y - 53, 12, VFX.rainbow(0), {
            stroke: '#3a1a4a',
            sw: 3
          });
        }
      });
      this.drawTower(this.drag.t, this.drag.x, this.drag.y - 10, 1.15);
    }
    c.restore();
    if (FX.flash > 0) {
      c.fillStyle = 'rgba(255,255,255,' + FX.flash * 0.6 + ')';
      c.fillRect(0, 0, CFG.W, CFG.H);
    }
    this.drawHUD();
    if (this.sel && !this.drag) this.drawInfo();
    this.drawHero();
    if (this.banner && !this.g.pendingBranch && !this.result) this.drawBanner();
    if (this.tut >= 0) this.drawTut();
    if (g.state == 'pick' && !this.result) this.drawPick();
    if (this.tips.length && !this.result && !this.banner) this.drawTip();
    if (g.pendingBranch && !this.result) this.drawBranch();
    this.drawUlt();
    if (this.cine) this.drawCine();
    if (this.bossIntro) this.drawBossIntro();
    if (this.popup && !this.cine && !this.result) this.drawPopup();
    if (this.paused) this.drawPause();
    if (this.result) {
      this.drawResult();
      if (this.popup && !this.cine) this.drawPopup();
    }
  },
  drawEnemy: function (e) {
    var c = UI.c,
      t = UI.t,
      sz = e.r * (e.boss ? 3.3 : 3.85),
      born = Math.min(1, e.age / 0.25),
      fy = e.fly ? -14 + Math.sin(t * 5 + e.phase) * 3 : 0,
      base = e.y + e.r * 0.75,
      dense = this.g && this.g.enemies.length > 36;
    if (!dense || e.boss || e.elite) {
      c.fillStyle = 'rgba(60,40,40,.22)';
      c.beginPath();
      c.ellipse(e.x, base, e.r * (e.fly ? 0.7 : 1.05), e.r * 0.32, 0, 0, 7);
      c.fill();
    }
    if (e.elite && !e.boss) {
      c.save();
      c.strokeStyle = 'rgba(180,108,255,0.65)';
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(e.x, base, e.r * 1.25, e.r * 0.4, 0, 0, 7);
      c.stroke();
      c.restore();
    }
    if (e.boss) {
      // 首领脚下的警示环：缓慢旋转的虚线圈，便于在敌群中一眼识别
      c.save();
      c.translate(e.x, base);
      c.scale(1, 0.36);
      c.rotate(t * 0.8);
      c.strokeStyle = 'rgba(255,90,90,' + (0.55 + Math.sin(t * 4) * 0.2) + ')';
      c.lineWidth = 3.2;
      c.setLineDash([7, 5]);
      c.beginPath();
      c.arc(0, 0, e.r * 1.45, 0, 7);
      c.stroke();
      c.setLineDash([]);
      c.restore();
    }
    if (e.slowT > 0 && !e.fly) {
      c.fillStyle = 'rgba(140,210,255,.5)';
      c.beginPath();
      c.ellipse(e.x, base, e.r * 1.3, e.r * 0.45, 0, 0, 7);
      c.fill();
    }
    if (e.elite) {
      c.save();
      c.globalAlpha = 0.45 + Math.sin(t * 6) * 0.2;
      var eg = c.createRadialGradient(e.x, e.y, 2, e.x, e.y, e.r * 2);
      eg.addColorStop(0, 'rgba(190,110,255,.8)');
      eg.addColorStop(1, 'rgba(190,110,255,0)');
      c.fillStyle = eg;
      c.beginPath();
      c.arc(e.x, e.y, e.r * 2, 0, 7);
      c.fill();
      c.restore();
    }
    c.save();
    c.translate(e.x, base + fy);
    var wob = Math.sin(t * 8 + e.phase) * 0.05;
    // 受击压扁回弹：0.12 秒内横向拉宽、纵向压低
    var sq = e.hitT > 0 ? (e.hitT / 0.12) * 0.12 : 0;
    c.scale(born * (1 + wob + sq), born * (1 - wob - sq * 0.8));
    var ba = c.globalAlpha;
    if (e.invis > 0) c.globalAlpha = ba * 0.3;
    var fr = e.hitT > 0 ? 'h' : null;
    Art.enemy(c, e, 0, 0, sz, t, fr);
    if (e.hitT > 0) {
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = 0.45 * ba;
      Art.enemy(c, e, 0, 0, sz, t, 'h');
      c.globalCompositeOperation = 'source-over';
    }
    c.globalAlpha = ba;
    var cy = -e.r * 0.9;
    if (e.freezeT > 0 || (GS.g.globalFreeze > 0 && !e.boss)) {
      c.fillStyle = 'rgba(190,235,255,.55)';
      c.strokeStyle = '#fff';
      c.lineWidth = 1.5;
      rr(c, -e.r * 1.2, cy - e.r * 1.1, e.r * 2.4, e.r * 2.2, 6);
      c.fill();
      c.stroke();
    }
    if (e.shield > 0) {
      c.strokeStyle = 'rgba(120,200,255,.9)';
      c.fillStyle = 'rgba(150,220,255,.2)';
      c.lineWidth = 2.5;
      c.beginPath();
      c.arc(0, cy, e.r * 1.45, 0, 7);
      c.fill();
      c.stroke();
      c.fillStyle = 'rgba(255,255,255,.6)';
      c.beginPath();
      c.ellipse(-e.r * 0.6, cy - e.r * 0.7, e.r * 0.35, e.r * 0.16, -0.6, 0, 7);
      c.fill();
    }
    if (e.boss && e.invT > 0) {
      c.strokeStyle = '#ffd23f';
      c.lineWidth = 4;
      c.globalAlpha = 0.6 + Math.sin(t * 20) * 0.3;
      c.beginPath();
      c.arc(0, cy, e.r * 1.4, 0, 7);
      c.stroke();
      c.globalAlpha = 1;
    }
    if (e.enraged) {
      c.globalAlpha = 0.4 + Math.sin(t * 15) * 0.2;
      c.strokeStyle = '#ff4d2d';
      c.lineWidth = 3;
      c.beginPath();
      c.arc(0, cy, e.r * 1.3, 0, 7);
      c.stroke();
      c.globalAlpha = 1;
    }
    if (e.stunT > 0) {
      for (var i = 0; i < 3; i++) {
        var a = t * 6 + i * 2.1;
        Art.icon(c, 'star', Math.cos(a) * e.r * 0.8, cy - e.r * 1.1 + Math.sin(a) * 3, 8);
      }
    }
    if (e.type == 'healer') {
      c.strokeStyle = 'rgba(120,230,120,' + (0.25 + Math.sin(t * 4) * 0.15) + ')';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(0, cy, 60, 0, 7);
      c.stroke();
    }
    c.restore();
    if (e.elite) {
      c.fillStyle = '#b46cff';
      rr(c, e.x - 14, base + fy - e.r * 2.6 - 14, 28, 11, 5);
      c.fill();
      UI.text('精英', e.x, base + fy - e.r * 2.6 - 8.5, 8, '#fff', { stroke: false });
    }
    if (!e.boss && e.hp < e.maxHp) {
      var w = e.r * 2;
      UI.bar(
        e.x - w / 2,
        base + fy - e.r * 2.4,
        w,
        4,
        e.hp / e.maxHp,
        e.elite ? '#b46cff' : '#ff6b8b',
        'rgba(60,30,40,.4)'
      );
    }
  },
  drawShotOld: function (b) {
    var c = UI.c;
    c.save();
    if (b.mech == 'cannon' || b.mech == 'bomblet') {
      c.fillStyle = 'rgba(60,40,40,.2)';
      var gx = b.sx + (b.tx - b.sx) * Math.min(1, b.k || 0),
        gy = b.sy + (b.ty - b.sy) * Math.min(1, b.k || 0);
      c.beginPath();
      c.ellipse(gx, gy, 6, 3, 0, 0, 7);
      c.fill();
    }
    c.translate(b.x, b.y);
    if (b.mech == 'arrow') {
      c.rotate(b.ang || -Math.PI / 2);
      if (!Art.drawAt(c, 'p_arrow_0', 0, 6, 24)) {
        c.strokeStyle = '#8a5a3b';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(-10, 0);
        c.lineTo(8, 0);
        c.stroke();
      }
    } else if (b.mech == 'frost') {
      Art.drawAt(c, 'p_snow_0', 0, 7, 15);
    } else if (b.mech == 'cannon') {
      c.rotate(b.life * 8);
      Art.drawAt(c, 'p_ball_0', 0, 8, 18);
    } else if (b.mech == 'bomblet') {
      Art.drawAt(c, 'p_ball_0', 0, 5, 10);
    } else if (b.mech == 'fire') {
      var g = c.createRadialGradient(0, 0, 1, 0, 0, 12);
      g.addColorStop(0, 'rgba(255,240,150,.9)');
      g.addColorStop(1, 'rgba(255,90,20,0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, 12, 0, 7);
      c.fill();
      Art.drawAt(c, 'p_fireball_0', 0, 7, 14);
      if (Math.random() < 0.5)
        FX.burst(b.x, b.y, 1, { colors: ['#ff7a1a', '#ffd23f'], speed: 10, size: 3, g: -30, life: 0.3 });
    }
    c.restore();
  },
  queuePopup: function (p) {
    if (this.g.noMeta) return;
    this.popups.push(p);
  },
  drawShot: function (b) {
    var c = UI.c,
      pw = b.pw || 1,
      sc = VFX.scale(pw) * Math.min(1, 0.45 + (b.life || 0) * 6),
      col = VFX.col(b);
    if (b.mech == 'cannon' || b.mech == 'bomblet') {
      c.fillStyle = 'rgba(60,40,40,.2)';
      var gx = b.sx + (b.tx - b.sx) * Math.min(1, b.k || 0),
        gy = b.sy + (b.ty - b.sy) * Math.min(1, b.k || 0);
      c.beginPath();
      c.ellipse(gx, gy, 6 * sc, 3 * sc, 0, 0, 7);
      c.fill();
    }
    VFX.trail(c, b);
    if (pw >= 3) VFX.glow(c, b.x, b.y, 7 + pw * 1.8, col, 0.22 + Math.min(pw, 9) * 0.03);
    c.save();
    c.translate(b.x, b.y);
    if (b.mech == 'arrow') {
      c.rotate(b.ang || -Math.PI / 2);
      Art.drawAt(c, 'p_arrow_0', 0, 6 * sc, 24 * sc);
      if (pw >= 5) {
        c.globalCompositeOperation = 'lighter';
        c.strokeStyle = pw >= 9 ? VFX.rainbow(0) : '#ffd23f';
        c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(-12 * sc, 0);
        c.lineTo(12 * sc, 0);
        c.stroke();
        c.globalCompositeOperation = 'source-over';
        c.fillStyle = pw >= 9 ? VFX.rainbow(90) : '#fff6c8';
        [1, -1].forEach(function (sy) {
          c.beginPath();
          c.ellipse(-9 * sc, sy * 3.5, 5 * sc, 1.8, sy * 0.5, 0, 7);
          c.fill();
        });
      }
    } else if (b.mech == 'frost') {
      c.rotate(b.life * 4);
      if (pw >= 2) {
        c.globalCompositeOperation = 'lighter';
        c.strokeStyle = pw >= 3 ? 'rgba(120,200,255,.9)' : 'rgba(170,225,255,.75)';
        c.lineWidth = pw >= 3 ? 2.5 : 1.8;
        c.beginPath();
        c.arc(0, 0, (pw >= 3 ? 13 : 10) * sc, 0, 7);
        c.stroke();
        c.globalCompositeOperation = 'source-over';
      }
      if (pw >= 3) {
        var cg = c.createLinearGradient(0, -10 * sc, 0, 10 * sc);
        cg.addColorStop(0, '#ffffff');
        cg.addColorStop(1, '#5ab8ff');
        c.fillStyle = cg;
        c.strokeStyle = '#2f7fd0';
        c.lineWidth = 1.2;
        c.beginPath();
        for (var hk = 0; hk < 12; hk++) {
          var ra = (hk % 2 ? 4 : 10) * sc,
            aa = (hk * Math.PI) / 6;
          c.lineTo(Math.cos(aa) * ra, Math.sin(aa) * ra);
        }
        c.closePath();
        c.fill();
        c.stroke();
        for (var ok = 0; ok < 3; ok++) {
          var oa = b.life * -9 + ok * 2.09;
          c.fillStyle = '#e8f8ff';
          c.beginPath();
          c.arc(Math.cos(oa) * 15 * sc, Math.sin(oa) * 15 * sc, 2.2, 0, 7);
          c.fill();
        }
      } else Art.drawAt(c, 'p_snow_0', 0, 7 * sc, (pw >= 2 ? 17 : 13) * sc);
      if (pw >= 2 && Math.random() < 0.6)
        FX.burst(b.x, b.y, 1, {
          colors: pw >= 3 ? ['#5ab8ff', '#ffffff'] : ['#bfe9ff'],
          shape: pw >= 3 ? 'star' : null,
          speed: 8,
          size: 2 + pw * 0.5,
          g: 10,
          life: 0.35
        });
      if (pw >= 4) {
        c.strokeStyle = '#ffffff';
        c.lineWidth = 1.5;
        for (var i = 0; i < 6; i++) {
          c.rotate(Math.PI / 3);
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(0, 9 * sc);
          c.stroke();
        }
      }
    } else if (b.mech == 'cannon') {
      c.rotate(b.life * 8);
      Art.drawAt(c, 'p_ball_0', 0, 8 * sc, 18 * sc);
    } else if (b.mech == 'bomblet') {
      Art.drawAt(c, 'p_ball_0', 0, 5, 10);
    } else if (b.mech == 'fire') {
      var g = c.createRadialGradient(0, 0, 1, 0, 0, 12 * sc);
      g.addColorStop(0, 'rgba(255,240,150,.9)');
      g.addColorStop(1, 'rgba(255,90,20,0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, 12 * sc, 0, 7);
      c.fill();
      Art.drawAt(c, 'p_fireball_0', 0, 7 * sc, 14 * sc);
      if (Math.random() < 0.5 + pw * 0.08)
        FX.burst(b.x, b.y, 1, { colors: ['#ff7a1a', '#ffd23f'], speed: 10, size: 3 * sc, g: -30, life: 0.3 });
    } else if (b.mech == 'poison') {
      c.rotate(Math.sin(b.life * 10) * 0.3);
      if (!Art.drawAt(c, 'p_poison_0', 0, 7 * sc, 14 * sc)) {
        c.fillStyle = '#9be37a';
        c.beginPath();
        c.arc(0, 0, 6 * sc, 0, 7);
        c.fill();
      }
      if (Math.random() < 0.3 + pw * 0.06)
        FX.burst(b.x, b.y, 1, {
          colors: ['#9be37a', '#c8ff9a', '#b46cff'],
          speed: 12,
          size: 2.5 * sc,
          g: -20,
          life: 0.4
        });
    } else if (b.mech == 'missile') {
      c.rotate(b.ang || 0);
      if (!Art.drawAt(c, 'p_missile_0', 0, 5 * sc, 20 * sc)) {
        c.fillStyle = '#e8eef8';
        c.fillRect(-8, -3, 16, 6);
      }
      if (FX.ps.length < 220 && Math.random() < 0.55)
        FX.burst(b.x - Math.cos(b.ang || 0) * 8, b.y - Math.sin(b.ang || 0) * 8, 1, {
          colors: b.burn ? ['#ff8a3a', '#ffd23f', '#fff2c0'] : ['#ffb020', '#fff', '#c8c8d8'],
          speed: 15,
          size: Math.min(4.2, 2.6 + pw * 0.2),
          g: -10,
          life: 0.28
        });
    } else if (b.mech == 'spike') {
      c.rotate(b.life * 14);
      if (!Art.drawAt(c, 'p_spike_0', 0, 8 * sc, 16 * sc)) {
        c.fillStyle = '#a8734e';
        c.beginPath();
        c.arc(0, 0, 6, 0, 7);
        c.fill();
      }
      if (b.mag) {
        c.strokeStyle = '#ff4d6d';
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(0, 0, 11 * sc, 0, 4);
        c.stroke();
      }
    }
    c.restore();
  },
  drawBadge: function (tw, x, y) {
    var c = UI.c,
      D = CFG.TOWERS[tw.type],
      t = UI.t;
    if (D.ultimate) {
      c.save();
      c.translate(x, y + 22);
      c.rotate(Math.sin(t * 2) * 0.08);
      var gg = c.createLinearGradient(-14, 0, 14, 0);
      VFX.RB.forEach(function (cc, i) {
        gg.addColorStop(i / 6, cc);
      });
      c.fillStyle = '#ffd23f';
      rr(c, -16, -9, 32, 18, 8);
      c.fill();
      c.fillStyle = gg;
      rr(c, -14, -7, 28, 14, 7);
      c.fill();
      c.restore();
      UI.text('神', x, y + 22, 10, '#fff', { stroke: '#8a3ab8', sw: 3 });
      return;
    }
    if (D.fusion) {
      c.fillStyle = D.color;
      rr(c, x - 15, y + 13, 30, 15, 7);
      c.fill();
      c.strokeStyle = '#fff';
      c.lineWidth = 1.5;
      c.stroke();
      UI.text('融' + tw.lv, x, y + 20.5, 9.5, '#fff', { stroke: shade(D.color, -0.5), sw: 2.5 });
      for (var i = 0; i < tw.lv; i++) Art.icon(c, 'star', x - 9 + i * 9, y + 32, 7);
      return;
    }
    var lv = tw.lv,
      col =
        lv >= CFG.BRANCH_LV && tw.branch
          ? tw.branch == 'A'
            ? '#4fa8ff'
            : '#ff5a7a'
          : ['#9fb3c8', '#5fcf6a', '#4fa8ff', '#b46cff', '#ffb020'][lv - 1],
      sd = tw.face == -1 ? 1 : -1,
      X = x + 19 * sd,
      Y = y + 19;
    c.save();
    c.translate(X, Y);
    if (lv >= 5) {
      c.shadowColor = '#ffd23f';
      c.shadowBlur = 8 + Math.sin(t * 5) * 4;
    }
    c.fillStyle = lv >= 5 ? '#ffd23f' : '#fff';
    c.beginPath();
    if (lv <= 2) {
      c.arc(0, 0, 9, 0, 7);
    } else if (lv == 3) {
      c.moveTo(-9, -8);
      c.lineTo(9, -8);
      c.lineTo(9, 1);
      c.quadraticCurveTo(0, 11, -9, 1);
      c.closePath();
    } else if (lv == 4) {
      for (var k = 0; k < 6; k++) {
        var a = (k * Math.PI) / 3 - Math.PI / 2;
        c.lineTo(Math.cos(a) * 10, Math.sin(a) * 10);
      }
      c.closePath();
    } else {
      c.moveTo(-10, 7);
      c.lineTo(-10, -6);
      c.lineTo(-5, -1);
      c.lineTo(0, -10);
      c.lineTo(5, -1);
      c.lineTo(10, -6);
      c.lineTo(10, 7);
      c.closePath();
    }
    c.fill();
    c.shadowBlur = 0;
    c.scale(0.8, 0.8);
    c.fillStyle = col;
    c.fill();
    c.restore();
    UI.text('' + lv, X, Y + (lv >= 5 ? 1.5 : 0), 10, '#fff', { stroke: shade(col, -0.5), sw: 2.5 });
    if (tw.branch) {
      c.fillStyle = tw.branch == 'A' ? '#4fa8ff' : '#ff5a7a';
      c.beginPath();
      c.arc(x + 20 * sd, y - 14, 7, 0, 7);
      c.fill();
      UI.text(tw.branch, x + 20 * sd, y - 14, 9, '#fff', { stroke: false });
    }
  },
  drawTower: function (tw, x, y, sc) {
    var c = UI.c,
      t = UI.t,
      D = CFG.TOWERS[tw.type],
      L = this.g.lvE(tw),
      size = (D.ultimate ? 72 : D.fusion ? 66 : 66 - Math.max(0, Math.min(tw.lv, 5) - 3) * 2.5) * sc,
      skin = Save.d.skinOn && Save.d.skinOn[tw.type];
    // 等级底座：颜色随档位，融合/究极旋转光环
    var tc = D.parts ? D.color : VFX.tierCol(tw.lv);
    if (sc == 1 && tw.c !== undefined && L >= 2) {
      // 格子按档位着色：远看即可分辨伙伴等级
      var gx = CFG.GRID_X + tw.c * CFG.CELL + 3,
        gy = CFG.GRID_Y + tw.r * CFG.CELL + 3;
      c.save();
      c.globalAlpha = 0.2;
      c.fillStyle = tc;
      rr(c, gx, gy, CFG.CELL - 6, CFG.CELL - 6, 12);
      c.fill();
      c.globalAlpha = 0.75;
      c.strokeStyle = tc;
      c.lineWidth = 2;
      c.stroke();
      c.restore();
    }
    c.save();
    c.translate(x, y + 22);
    c.scale(1, 0.32);
    if (L >= 2) {
      c.globalAlpha = 0.55;
      c.fillStyle = tc;
      c.beginPath();
      c.arc(0, 0, 22 + L, 0, 7);
      c.fill();
      c.globalAlpha = 1;
    }
    c.fillStyle = 'rgba(120,70,40,.25)';
    c.beginPath();
    c.arc(0, 0, 18, 0, 7);
    c.fill();
    if (L >= 4) {
      c.rotate(t * 1.5);
      c.strokeStyle = D.ultimate ? VFX.rainbow(0) : tc;
      c.lineWidth = 3;
      c.setLineDash([8, 6]);
      c.beginPath();
      c.arc(0, 0, 26 + L, 0, 7);
      c.stroke();
      c.setLineDash([]);
    }
    c.restore();
    if (L >= 4) {
      VFX.glow(
        c,
        x,
        y,
        30 + L * 2.5,
        D.ultimate
          ? VFX.rainbow(0)
          : D.parts
            ? D.color
            : tw.branch == 'B'
              ? 'rgba(255,120,150,.8)'
              : tw.branch == 'A'
                ? 'rgba(110,190,255,.8)'
                : 'rgba(255,220,80,.8)',
        0.25 + Math.sin(t * 3 + tw.phase) * 0.06
      );
    }
    if (L >= 5 && Math.random() < 0.04 + L * 0.01)
      FX.burst(x + (Math.random() - 0.5) * 40, y + 10, 1, {
        colors: VFX.cols(L, tw),
        shape: 'star',
        speed: 12,
        size: 2.5 + L * 0.2,
        g: -40,
        life: 0.8
      });
    if (tw.mergeT > 0) {
      tw.mergeT -= 1 / 60;
      var mk = tw.mergeT;
      c.save();
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = Math.min(1, mk * 1.4);
      var pg = c.createLinearGradient(0, y - 90, 0, y + 20);
      pg.addColorStop(0, 'rgba(255,255,255,0)');
      pg.addColorStop(0.7, tc);
      pg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = pg;
      c.fillRect(x - 18 - mk * 10, y - 90, 36 + mk * 20, 110);
      c.restore();
    }
    var bounce = Math.sin(t * 3.2 + tw.phase),
      pop = tw.pop > 0 ? Math.sin((tw.pop / 0.5) * Math.PI) * 0.3 : 0,
      rc = tw.recoil || 0;
    c.save();
    c.translate(x, y + 26);
    c.scale(1 + bounce * 0.03 + pop + rc * 0.05, 1 - bounce * 0.03 + pop - rc * 0.06);
    if (CFG.PASSIVE[D.mech] && GS.g.state == 'wave') c.rotate(Math.sin(t * 3) * 0.05);
    var fr = GS.towerFrame(tw);
    if (tw.face == -1 && !D.parts) c.scale(-1, 1);
    if (fr == 'w') {
      c.rotate(0.07);
      c.scale(0.96, 1.04);
    } else if (fr == 'a') {
      c.translate(2, -3);
      c.scale(1.07, 0.95);
    } else if (fr == 'r') c.rotate(-0.03);
    if (D.parts) {
      var key = D.ultimate ? tw.type : tw.type + '_' + Math.min(tw.lv, 3),
        n = key + '_' + fr;
      if (!Art.get(n)) n = key + '_0';
      if (!Art.drawAt(c, n, 0, 0, size)) Art.vecTower(c, D.parts[0], 5, 0, -size * 0.4, size / 64);
    } else Art.tower(c, tw.type, tw.lv, 0, 0, size, fr, tw.branch, skin);
    if (tw.mergeT > 0) {
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = Math.min(0.8, tw.mergeT);
      if (D.parts) {
        var k2 = D.ultimate ? tw.type : tw.type + '_' + Math.min(tw.lv, 3);
        Art.drawAt(c, k2 + '_0', 0, 0, size);
      } else Art.tower(c, tw.type, tw.lv, 0, 0, size, '0', tw.branch, skin);
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
    }
    c.restore();
    if (tw.frozenT > 0) {
      c.fillStyle = 'rgba(190,235,255,.6)';
      c.strokeStyle = '#fff';
      c.lineWidth = 2;
      rr(c, x - 24, y - 26, 48, 50, 8);
      c.fill();
      c.stroke();
      Art.icon(c, 'snow', x, y, 18);
    }
    this.drawBadge(tw, x, y);
  },
  towerFrame: function (tw) {
    if (tw.pop > 0) return 'h';
    var rc = tw.recoil || 0;
    if (rc > 0.72) return 'a';
    if (rc > 0.3) return 'r';
    var g = this.g;
    if (g && g.state == 'wave' && g.enemies.length && tw.cds && !CFG.PASSIVE[CFG.TOWERS[tw.type].mech]) {
      for (var i = 0; i < tw.cds.length; i++) if (tw.cds[i] < 0.2) return 'w';
    }
    return '0';
  },
  // 武器枪口：从精灵元数据（ATLAS.mz）取当前帧道具尖端，换算成世界坐标
  muzzleOf: function (tw, type) {
    var g = this.g,
      D = CFG.TOWERS[tw.type],
      p = g.tpos(tw),
      size = D.ultimate ? 80 : D.fusion ? 72 : 66,
      key,
      wi = 0;
    if (D.parts) {
      key = D.ultimate ? tw.type : tw.type + '_' + Math.min(tw.lv, 3);
      var pi = D.parts.indexOf(type);
      wi = D.ultimate ? (pi < 2 ? 0 : 1) : pi < 0 ? 0 : pi % 2;
    } else key = Art.towerKey(tw.type, tw.lv, tw.branch, Save.d.skinOn && Save.d.skinOn[tw.type]);
    var n = key + '_a',
      f = Art.get(n) || Art.get(key + '_0'),
      m = typeof ATLAS != 'undefined' && ATLAS.mz && (ATLAS.mz[n] || ATLAS.mz[key + '_0']);
    if (!f || !m) return { x: p.x, y: p.y - 12 };
    var q = m[Math.min(wi, m.length - 1)],
      h = (size * f[4]) / f[3],
      fl = tw.face == -1 && !D.parts ? -1 : 1;
    return { x: p.x + fl * (q[0] - 0.5) * size, y: p.y + 26 - h * (1 - q[1]) };
  },
  drawHoles: function () {
    var c = UI.c,
      t = UI.t;
    this.g.holes.forEach(function (H) {
      var k = Math.min(1, (H.max - H.t) * 4, H.t * 3),
        R = H.r * k;
      c.save();
      c.translate(H.x, H.y);
      var g = c.createRadialGradient(0, 0, 2, 0, 0, R);
      g.addColorStop(0, 'rgba(20,0,40,.95)');
      g.addColorStop(0.55, H.ult ? 'rgba(90,60,220,.6)' : 'rgba(120,60,200,.55)');
      g.addColorStop(1, 'rgba(180,120,255,0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, R, 0, 7);
      c.fill();
      c.globalCompositeOperation = 'lighter';
      for (var i = 0; i < (H.ult ? 5 : 3); i++) {
        c.rotate(t * 3 + i * 2.1);
        c.strokeStyle = H.ult ? VFX.RB[i] : ['#d8b0ff', '#8fd3ff', '#ffffff'][i];
        c.globalAlpha = 0.6;
        c.lineWidth = 2.5;
        c.beginPath();
        for (var a = 0; a < 5; a += 0.25) {
          var r = R * (1 - a / 5);
          c.lineTo(Math.cos(a * 2) * r, Math.sin(a * 2) * r * 0.8);
        }
        c.stroke();
      }
      c.restore();
      if (Math.random() < 0.5)
        FX.burst(H.x + (Math.random() - 0.5) * R * 2, H.y + (Math.random() - 0.5) * R, 1, {
          colors: ['#d8b0ff', '#fff'],
          speed: 20,
          size: 2.5,
          g: 0,
          life: 0.4
        });
    });
  },
  drawMinions: function () {
    var c = UI.c,
      t = UI.t;
    this.g.minions.forEach(function (m) {
      if (m.x == null) return;
      c.fillStyle = 'rgba(60,40,40,.2)';
      c.beginPath();
      c.ellipse(m.x, m.y + 8, 8, 3, 0, 0, 7);
      c.fill();
      c.save();
      c.translate(m.x, m.y + 9 - Math.abs(Math.sin(t * 14 + m.dist)) * 4);
      if (m.pw >= 6) VFX.glow(c, 0, -8, 16, m.plague ? '#9be37a' : '#ffe066', 0.5);
      if (!Art.drawAt(c, 'p_chickling_0', 0, 0, 18 + Math.min(m.pw, 9))) {
        c.fillStyle = '#ffe066';
        c.beginPath();
        c.arc(0, -7, 7, 0, 7);
        c.fill();
      }
      c.restore();
    });
  },
  drawArcs: function () {
    var c = UI.c;
    this.arcs.forEach(function (a) {
      if (a.e.dead) return;
      var k = a.t / 0.3;
      c.save();
      c.globalAlpha = k;
      c.lineCap = 'round';
      [
        ['#ff4d6d', -6],
        ['#8fd3ff', 6]
      ].forEach(function (q) {
        c.strokeStyle = q[0];
        c.lineWidth = 2 + a.pw * 0.4;
        c.beginPath();
        c.moveTo(a.x, a.y);
        c.quadraticCurveTo((a.x + a.e.x) / 2 + q[1] * 3, (a.y + a.e.y) / 2 - 30, a.e.x, a.e.y);
        c.stroke();
      });
      c.restore();
    });
    this.hearts.forEach(function (h) {
      if (h.t < 0) return;
      var k = h.t / 0.9,
        x = h.x + (CFG.CASTLE.x - h.x) * k,
        y = h.y + (CFG.CASTLE.y - 20 - h.y) * k - Math.sin(k * Math.PI) * 50;
      if (!Art.drawAt(UI.c, 'p_heal_0', x, y + 6, 12)) Art.icon(UI.c, 'heart', x, y, 12);
      if (k > 0.95) FX.burst(CFG.CASTLE.x, CFG.CASTLE.y - 20, 6, { color: '#ff6f8f', shape: 'heart', speed: 60 });
    });
  },
  drawUlt: function () {
    var c = UI.c,
      t = UI.t;
    this.ultFx.forEach(function (u) {
      var k = u.t / 1.6;
      if (u.k == 'meteor' && u.pts) {
        u.pts.forEach(function (p, i) {
          var kk = Math.min(1, u.t * 3 - i * 0.1);
          if (kk <= 0 || kk >= 1) return;
          var x = p[0] + 60 * (1 - kk),
            y = p[1] - 300 * (1 - kk);
          VFX.glow(c, x, y, 22, '#ff7a1a', 0.9);
          c.fillStyle = '#fff2a0';
          c.beginPath();
          c.arc(x, y, 6, 0, 7);
          c.fill();
          c.strokeStyle = 'rgba(255,140,40,.6)';
          c.lineWidth = 6;
          c.beginPath();
          c.moveTo(x, y);
          c.lineTo(x + 30, y - 120);
          c.stroke();
        });
      }
      if (u.k == 'cosmos') {
        c.save();
        c.globalAlpha = 0.35 * (1 - k);
        c.fillStyle = '#1a0a40';
        c.fillRect(0, 58, CFG.W, CFG.FIELD_BOT - 58);
        c.globalAlpha = 1 - k;
        for (var i = 0; i < 30; i++) {
          var a = i * 0.7 + t;
          c.fillStyle = '#fff';
          c.beginPath();
          c.arc(180 + Math.cos(a) * (40 + i * 5) * (1 - k * 0.5), 220 + Math.sin(a) * (30 + i * 3), 1.5, 0, 7);
          c.fill();
        }
        c.restore();
      }
      if (u.k == 'volley') {
        c.save();
        c.globalAlpha = 1 - k;
        for (var j = 0; j < 14; j++) {
          var x0 = ((j * 29 + u.t * 300) % 380) - 10;
          c.strokeStyle = VFX.RB[j % 7];
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(x0, 60 + ((j * 53) % 120));
          c.lineTo(x0 + 16, 90 + ((j * 53) % 120));
          c.stroke();
        }
        c.restore();
      }
      if (u.k == 'gaia') {
        c.save();
        c.globalAlpha = 1 - k;
        for (var q = 0; q < 12; q++) {
          var lx = (q * 37 + u.t * 40) % 360,
            ly = 60 + ((q * 71 + u.t * 120) % 340);
          c.fillStyle = q % 2 ? '#7fe07f' : '#c8ff9a';
          c.beginPath();
          c.ellipse(lx, ly, 6, 3, q + u.t * 4, 0, 7);
          c.fill();
        }
        c.restore();
      }
    });
  },
  // 融合过场：聚光 + 彩虹光柱 + 星芒 + 放大登场；究极更长、更炫
  drawCine: function () {
    var C = this.cine,
      c = UI.c,
      t = UI.t,
      T = C.ult ? 2.4 : 1.3,
      a = Math.min(1, C.t * 4, (T - C.t) * 3);
    c.save();
    c.globalAlpha = a * 0.75;
    c.fillStyle = C.ult ? '#100828' : '#2a1240';
    c.fillRect(0, 0, CFG.W, CFG.H);
    c.globalAlpha = a;
    var cx = 180,
      cy = 300;
    c.translate(cx, cy);
    c.globalCompositeOperation = 'lighter';
    var n = C.ult ? 18 : 10;
    for (var i = 0; i < n; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / n + t * (C.ult ? 1.2 : 0.6));
      var gr = c.createLinearGradient(0, 0, 0, -320);
      gr.addColorStop(0, C.ult ? VFX.RB[i % 7] : C.col);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gr;
      c.globalAlpha = a * 0.5;
      c.beginPath();
      c.moveTo(-10, 0);
      c.lineTo(-40, -320);
      c.lineTo(40, -320);
      c.lineTo(10, 0);
      c.fill();
      c.restore();
    }
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = a;
    VFX.glow(c, 0, 0, 120, C.ult ? VFX.rainbow(0) : C.col, 0.8);
    var e = Tween.E.outBack(Math.min(1, C.t / (C.ult ? 0.9 : 0.5))),
      sz = (C.ult ? 190 : 150) * e,
      key = C.type[0] == 'u' ? C.type : C.type + '_1';
    Art.drawAt(c, key + '_h', 0, sz * 0.55, sz) || Art.drawAt(c, key + '_0', 0, sz * 0.55, sz);
    c.restore();
    if (C.ult && Math.random() < 0.6)
      FX.burst(Math.random() * 360, Math.random() * 640, 2, {
        colors: VFX.RB,
        shape: 'star',
        speed: 60,
        size: 6,
        g: 0,
        life: 0.8
      });
    UI.text(C.ult ? '· 神话降临 ·' : '融合成功！', 180, 150, C.ult ? 30 : 26, '#fff', {
      stroke: C.ult ? '#8a3ab8' : shade(C.col, -0.4),
      sw: 7
    });
    UI.text(CFG.TOWERS[C.type].name, 180, 470, 22, C.ult ? VFX.rainbow(0) : '#fff', { stroke: '#3a1a4a', sw: 6 });
  },
  drawPopup: function () {
    var P = this.popup,
      c = UI.c,
      self = this,
      k = Tween.E.outBack(Math.min(1, P.t / 0.35)),
      D = CFG.TOWERS[P.type];
    UI.dim(0.6);
    c.save();
    c.translate(180, 320);
    c.scale(k, k);
    c.translate(-180, -320);
    if (P.k == 'unlock') {
      if (P.t < 0.05) {
        Sfx.play('unlock');
        Platform.vibrate(30);
      }
      UI.panel(24, 140, 312, 360, { title: '新伙伴加入！', border: D.color });
      for (var ri = 0; ri < 12; ri++) {
        var ra = UI.t * 0.6 + (ri * Math.PI) / 6;
        c.save();
        c.translate(180, 300);
        c.rotate(ra);
        c.fillStyle = ri % 2 ? 'rgba(255,224,102,.25)' : 'rgba(255,143,177,.2)';
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(-18, -150);
        c.lineTo(18, -150);
        c.closePath();
        c.fill();
        c.restore();
      }
      VFX.glow(c, 180, 300, 90, D.color, 0.6);
      Art.drawAt(c, 'U:' + Art.towerKey(P.type, 1) + '_h', 180, 380 - Math.abs(Math.sin(UI.t * 3)) * 8, 170) ||
        Art.drawAt(c, Art.towerKey(P.type, 1) + '_0', 180, 380, 170);
      if (Math.random() < 0.3)
        FX.burst(180 + (Math.random() - 0.5) * 200, 200, 1, {
          colors: ['#ffd23f', '#ff8fb1', '#8fd3ff'],
          shape: 'star',
          speed: 30,
          size: 4,
          g: 60,
          life: 1.2
        });
      UI.text(D.name, 180, 408, 20, D.color, { stroke: '#fff', sw: 5 });
      UI.plain('[' + D.rar + '] ' + D.desc, 180, 436, 11, '#7a4a55');
      UI.plain('已自动编入出战队伍，召唤时会随机出现', 180, 458, 10, '#a07080');
    } else if (P.k == 'evo') {
      var col = D.parts ? D.color : P.br ? (P.br == 'A' ? '#4fa8ff' : '#ff5a7a') : VFX.tierCol(P.lv);
      UI.panel(24, 170, 312, 300, { title: '新形态！', border: col == '#ffffff' ? '#ffb3c7' : col });
      var prevLv = P.lv - 1,
        kb = D.parts ? P.type + '_' + prevLv + '_0' : Art.towerKey(P.type, prevLv, P.br) + '_0',
        ka = D.parts ? P.type + '_' + P.lv + '_0' : Art.towerKey(P.type, P.lv, P.br) + '_0';
      VFX.glow(c, 250, 320, 70, col, 0.5);
      Art.drawAt(c, kb, 100, 370, 104);
      c.globalAlpha = 1;
      Art.drawAt(c, ka, 250, 382 - Math.abs(Math.sin(UI.t * 3)) * 5, 150);
      UI.text('→', 172, 320, 30, '#ffb020', { stroke: '#fff', sw: 5 });
      UI.plain('Lv' + prevLv, 100, 390, 13, '#a07080');
      UI.text('Lv' + P.lv + (P.br ? ' ' + P.br : ''), 250, 398, 16, col == '#ffffff' ? '#ff6f9c' : col, {
        stroke: '#fff',
        sw: 4
      });
      UI.plain(
        D.name + (P.br && CFG.BRANCHES[P.type] ? ' · ' + CFG.BRANCHES[P.type][P.br].name : ''),
        180,
        420,
        13,
        '#7a4a55'
      );
    } else {
      var ult = P.k == 'ult',
        tc = ult ? '#ffb020' : D.color;
      UI.panel(18, 150, 324, 350, { title: ult ? '神话伙伴！' : P.first ? '发现新融合！' : '融合成功', border: tc });
      var ka2 = ult ? P.type + '_0' : P.type + '_1_0',
        fa = P.from[0],
        fb = P.from[1],
        ia = fa[0] == 'f' ? fa + '_3_0' : Art.towerKey(fa, 5, 'A') + '_0',
        ib = fb[0] == 'f' ? fb + '_3_0' : Art.towerKey(fb, 5, 'A') + '_0';
      Art.drawAt(c, ia, 70, 250, 70);
      UI.text('+', 118, 222, 26, '#ff6f9c', { stroke: '#fff', sw: 5 });
      Art.drawAt(c, ib, 166, 250, 70);
      UI.text('=', 212, 222, 26, '#ff6f9c', { stroke: '#fff', sw: 5 });
      VFX.glow(c, 270, 215, 60, ult ? VFX.rainbow(0) : tc, 0.6);
      Art.drawAt(c, ka2, 272, 262 - Math.abs(Math.sin(UI.t * 3)) * 4, ult ? 110 : 96);
      UI.text(D.name, 180, 300, 22, ult ? VFX.rainbow(0) : tc, { stroke: '#fff', sw: 5 });
      var ds = D.desc.match(/.{1,16}/g);
      ds.forEach(function (d, j) {
        UI.plain(d, 180, 330 + j * 18, 12, '#7a4a55');
      });
      UI.plain(
        '同时拥有：' +
          D.parts
            .map(function (p) {
              return CFG.TOWERS[p].name;
            })
            .join(' + '),
        180,
        334 + ds.length * 18,
        10.5,
        '#a07080'
      );
      if (!ult)
        UI.plain(
          '同级融合伙伴合成，或喂入 Lv3+ 组成伙伴 → 升级（最高 Lv3）',
          180,
          352 + ds.length * 18,
          10.5,
          '#a07080'
        );
    }
    c.restore();
    if (P.t > 0.4)
      UI.button(
        'popok',
        110,
        P.k == 'evo' ? 482 : P.k == 'unlock' ? 474 : 470,
        140,
        40,
        '知道了',
        '#5fcf6a',
        function () {
          self.popup = null;
          Sfx.play('click');
          Platform.vibrate(12);
        },
        { size: 15, pulse: true }
      );
  },
  // 章节动态背景：飘落花瓣/萤火/雪/沙尘/幽灵火/流星
  updAmb: function (dt) {
    if (this.bossIntro) return;
    var th = (this.level && this.level.theme) || 'grass',
      A = this.amb,
      busy = this.g && this.g.enemies.length > 22;
    // 敌群较密或低性能时减少氛围粒子
    if (!busy && A.length < (busy ? 4 : 10) && Math.random() < dt * (busy ? 2 : 6)) {
      var o = {
        x: Math.random() * CFG.W,
        y: th == 'snow' || th == 'grass' ? 50 : 60 + Math.random() * 340,
        t: 0,
        life: 4 + Math.random() * 4,
        s: Math.random(),
        th: th
      };
      if (th == 'desert') {
        o.x = -10;
      }
      if (th == 'space' && Math.random() < 0.08) {
        o.shoot = true;
        o.x = Math.random() * 200 + 160;
        o.y = 60;
      }
      A.push(o);
    }
    this.amb = A.filter(function (o) {
      o.t += dt;
      var k = o.s;
      if (o.th == 'grass') {
        o.y += (14 + k * 12) * dt;
        o.x += Math.sin(o.t * 2 + k * 9) * 20 * dt;
      } else if (o.th == 'forest' || o.th == 'haunt') {
        o.y -= 6 * dt;
        o.x += Math.sin(o.t * 1.5 + k * 7) * 12 * dt;
      } else if (o.th == 'snow') {
        o.y += (22 + k * 20) * dt;
        o.x += Math.sin(o.t + k * 5) * 14 * dt;
      } else if (o.th == 'desert') {
        o.x += (60 + k * 50) * dt;
        o.y += Math.sin(o.t * 3) * 6 * dt;
      } else if (o.shoot) {
        o.x -= 260 * dt;
        o.y += 120 * dt;
      }
      return o.t < o.life && o.y < CFG.FIELD_BOT && o.x < CFG.W + 20 && o.x > -20;
    });
  },
  drawAmb: function () {
    var c = UI.c,
      t = UI.t;
    this.amb.forEach(function (o) {
      var a = Math.min(1, o.t, o.life - o.t);
      c.globalAlpha = a * 0.85;
      if (o.th == 'grass') {
        c.save();
        c.translate(o.x, o.y);
        c.rotate(o.t * 2 + o.s * 6);
        c.fillStyle = o.s < 0.5 ? '#ffb3c7' : '#fff0f6';
        c.beginPath();
        c.ellipse(0, 0, 3.5, 2, 0, 0, 7);
        c.fill();
        c.restore();
      } else if (o.th == 'forest') {
        VFX.glow(c, o.x, o.y, 5, 'rgba(255,236,120,.7)', a * (0.35 + Math.sin(t * 5 + o.s * 9) * 0.25));
      } else if (o.th == 'snow') {
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(o.x, o.y, 1.4 + o.s * 1.6, 0, 7);
        c.fill();
      } else if (o.th == 'desert') {
        c.strokeStyle = 'rgba(255,230,180,.6)';
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(o.x, o.y);
        c.lineTo(o.x - 14 - o.s * 10, o.y);
        c.stroke();
      } else if (o.th == 'haunt') {
        VFX.glow(c, o.x, o.y, 8, o.s < 0.5 ? 'rgba(170,140,255,.9)' : 'rgba(120,255,200,.8)', a * 0.7);
      } else if (o.th == 'space') {
        if (o.shoot) {
          c.strokeStyle = 'rgba(255,255,255,.8)';
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(o.x, o.y);
          c.lineTo(o.x + 30, o.y - 14);
          c.stroke();
        } else {
          c.fillStyle = '#fff';
          var tw = 0.5 + Math.sin(t * 6 + o.s * 20) * 0.5;
          c.globalAlpha = a * tw;
          c.beginPath();
          c.arc(o.x, o.y, 1.2 + o.s, 0, 7);
          c.fill();
        }
      }
    });
    c.globalAlpha = 1;
  },
  drawHUD: function () {
    var c = UI.c,
      g = this.g,
      self = this;
    var hg = c.createLinearGradient(0, 0, 0, 54);
    hg.addColorStop(0, 'rgba(255,255,255,.9)');
    hg.addColorStop(1, 'rgba(255,240,245,.75)');
    c.fillStyle = hg;
    rr(c, -10, -10, CFG.W + 20, 62, 18);
    c.fill();
    UI.pill(8, 10, 86, 26, 'coin', g.gold);
    UI.pill(100, 10, 70, 26, 'gem', Save.d.gems);
    // 波次
    var tot = this.level.waves > 100 ? '∞' : this.level.waves;
    UI.text('第 ' + g.wave + ' / ' + tot + ' 波', 230, 18, 15, '#ff6f9c', { stroke: '#fff', sw: 4 });
    UI.bar(
      185,
      32,
      90,
      7,
      this.level.waves > 100 ? (g.wave % 5) / 5 : g.wave / this.level.waves,
      '#ff8fb1',
      'rgba(200,140,160,.3)'
    );
    UI.button(
      'pause',
      288,
      6,
      34,
      34,
      '',
      '#8fd3ff',
      function () {
        self.paused = true;
        Sfx.play('click');
        Platform.vibrate(10);
      },
      { icon: 'pause', iconSize: 18, r: 12 }
    );
    UI.button(
      'speed',
      324,
      6,
      34,
      34,
      'x' + this.speed,
      this.speed > 1 ? '#ff9f43' : '#8fd3ff',
      function () {
        self.speed = self.speed == 1 ? 2 : 1;
        Storage.set('speed', self.speed);
        Sfx.play('click');
        Platform.vibrate(10);
        UI.toast(self.speed > 1 ? '二倍速' : '一倍速', '#8fd3ff');
      },
      { size: 12, r: 12 }
    );
    // 首领血条
    if (this.bossE && !this.bossE.dead) {
      var b = this.bossE;
      c.fillStyle = 'rgba(60,30,50,.72)';
      rr(c, 20, 374, 220, 26, 13);
      c.fill();
      UI.bar(26, 388, 208, 8, b.hp / b.maxHp, '#ff4d6d', 'rgba(255,255,255,.2)');
      UI.text(b.boss.name + ' · ' + b.boss.skill, 130, 381, 10, '#ffd23f', { stroke: false });
    }
    // 底栏
    var by = CFG.H - 44;
    if (g.state == 'prep' || g.state == 'wave') {
      var cost = g.cost(),
        full = !g.freeCells().length;
      UI.button(
        'buy',
        10,
        by,
        150,
        38,
        full ? '格子已满' : '召唤 ' + cost,
        g.gold >= cost && !full ? '#5fcf6a' : '#b8b8c4',
        function () {
          if (g.buy(self.tut >= 0 ? 'cat' : null)) {
            if (self.tut == 0 && g.towers.length >= 2) self.tut = 1;
          } else if (full) UI.toast('格子满啦，合成腾位置吧', '#ffd6e0');
          else if ((g.adSummons || 0) < CFG.AD_SUMMONS) {
            Platform.showRewardedAd('summon', function () {
              g.adSummons = (g.adSummons || 0) + 1;
              g.gold += cost;
              g.buy(null);
              Sfx.play('coin');
              Platform.vibrate(18);
              UI.toast('免费召唤成功（本局 ' + g.adSummons + '/' + CFG.AD_SUMMONS + '）', '#9be7a0');
            });
          } else UI.toast('金币不足', '#ffd6e0');
        },
        { icon: full ? null : 'coin', size: 15, pulse: self.tut == 0 }
      );
      if (g.state == 'prep')
        UI.button(
          'go',
          166,
          by,
          130,
          38,
          g.isBossWave(g.wave + 1) ? '挑战首领' : '开始战斗',
          '#ff6f9c',
          function () {
            if (self.tut == 1) return;
            g.startWave();
            if (self.tut == 2) {
              self.tut = -1;
              Save.d.tut = true;
              Save.save();
            }
            Sfx.play('click');
          },
          { size: 15, pulse: self.tut == 2 || (g.wave == 0 && self.tut < 0) }
        );
      else {
        UI.c.fillStyle = 'rgba(255,255,255,.7)';
        rr(c, 166, by, 130, 38, 16);
        c.fill();
        var left = g.queue.length + g.enemies.length;
        UI.text('剩余 ' + left + ' 只', 231, by + 19, 14, '#ff6f9c', { stroke: false });
      }
      UI.button(
        'dragon',
        302,
        by,
        50,
        38,
        '',
        '#b46cff',
        function () {
          if (!g.summonByGems())
            UI.toast(Save.d.gems < CFG.DRAGON_GEMS ? '钻石不足，闯关和福利中心可获得' : '格子已满', '#ffd6e0');
          else {
            Sfx.play('legend');
            Platform.vibrate(22);
            UI.toast('龙龙加入战斗!', '#9be7a0');
          }
        },
        {}
      );
      Art.draw(c, 't_dragon_1_0', 305, by - 8, 44, 44);
      c.fillStyle = '#fff';
      rr(c, 306, by + 26, 42, 14, 7);
      c.fill();
      Art.icon(c, 'gem', 316, by + 33, 10);
      UI.plain('' + CFG.DRAGON_GEMS, 334, by + 33, 10, '#8a4ab8');
    }
    if (g.state == 'prep' && !this.result) {
      var nw = g.wave + 1,
        ts = [];
      for (var ek in CFG.ENEMIES) if (CFG.ENEMIES[ek].from <= nw) ts.push(ek);
      var boss = g.isBossWave(nw),
        bw = Math.min(6, ts.length) * 26 + (boss ? 40 : 0) + 70;
      c.fillStyle = 'rgba(255,255,255,.85)';
      rr(c, 180 - bw / 2, CFG.FIELD_BOT - 34, bw, 30, 15);
      c.fill();
      UI.plain('下一波', 180 - bw / 2 + 30, CFG.FIELD_BOT - 19, 11, '#ff6f9c');
      ts.slice(-6).forEach(function (ek, i) {
        Art.draw(c, 'e_' + ek + '_0', 180 - bw / 2 + 56 + i * 26, CFG.FIELD_BOT - 34, 28, 28);
      });
      if (boss) {
        var bo = g.bossFor(nw);
        Art.draw(c, 'e_' + ((bo && bo.id) || 'king') + '_0', 180 + bw / 2 - 44, CFG.FIELD_BOT - 40, 38, 38);
        UI.text('BOSS', 180 + bw / 2 - 25, CFG.FIELD_BOT - 8, 9, '#fff', { stroke: '#ff4d6d' });
      }
    }
    // 流派
    var bx = 8;
    for (var k in g.tags) {
      var n = g.tags[k],
        b2 = BUILDS[k];
      c.fillStyle = n >= 3 ? b2.color : 'rgba(255,255,255,.75)';
      rr(c, bx, 42, 74, 14, 7);
      c.fill();
      UI.text(b2.name + ' ' + Math.min(n, 3) + '/3', bx + 37, 49, 10, n >= 3 ? '#fff' : '#a06070', { stroke: false });
      bx += 78;
    }
    UI.drawToasts(1 / 60);
  },
  drawInfo: function () {
    var g = this.g,
      tw = this.sel,
      self = this;
    if (g.towers.indexOf(tw) < 0) {
      this.sel = null;
      return;
    }
    var d = CFG.TOWERS[tw.type],
      st = g.stats4(tw),
      p = g.tpos(tw),
      bd = d.parts ? d.color : '#ffb3c7';
    var x = Math.max(8, Math.min(CFG.W - 248, p.x - 120)),
      y = Math.max(58, p.y - 168);
    UI.panel(x, y, 240, 128, { border: bd, r: 18 });
    // 左侧头像圈
    var c = UI.c;
    c.fillStyle = shade(bd, 0.55);
    c.beginPath();
    c.arc(x + 44, y + 50, 32, 0, 7);
    c.fill();
    c.strokeStyle = bd;
    c.lineWidth = 2.5;
    c.stroke();
    Art.tower(c, tw.type, Math.min(tw.lv, 5), x + 44, y + 62, 58, '0', tw.branch);
    UI.text(d.name, x + 145, y + 22, 15, d.parts ? shade(d.color, -0.25) : '#c05070', { stroke: false });
    UI.plain(
      d.ultimate
        ? '神话伙伴'
        : d.fusion
          ? '融合 Lv' + tw.lv
          : '等级 Lv' + tw.lv + (tw.branch ? ' · 分支' + tw.branch : ''),
      x + 145,
      y + 40,
      11,
      '#a07080'
    );
    var pm = CFG.PASSIVE[d.mech],
      line = pm
        ? { gold: '每波产出金币', heal: '持续回复城堡', aura: '强化周围伙伴' }[d.mech]
        : '伤害 ' + Math.round(st.dmg) + ' · 攻速 ' + st.rate.toFixed(1) + '/秒';
    UI.plain(line, x + 145, y + 58, 11, '#7a4a55');
    UI.plain('射程 ' + Math.round(st.range), x + 145, y + 74, 11, '#7a4a55');
    var v = g.sellValue(tw);
    UI.button(
      'sell',
      x + 60,
      y + 88,
      120,
      32,
      '回收 +' + v,
      '#ff9f43',
      function () {
        g.sell(tw);
        self.sel = null;
        Platform.vibrate(14);
      },
      { size: 13, icon: 'coin' }
    );
  },
  drawBossIntro: function () {
    var B = this.bossIntro,
      c = UI.c,
      t = B.t,
      boss = B.boss,
      col = boss.color || '#ff4d6d';
    c.save();
    c.globalAlpha = Math.min(1, t * 2) * (t > B.life - 0.45 ? Math.max(0, (B.life - t) / 0.45) : 1);
    c.fillStyle = 'rgba(20,8,18,0.72)';
    c.fillRect(0, 0, CFG.W, CFG.H);
    // name plate
    var cy = 200 + Math.sin(Math.min(t, 1) * Math.PI) * 8;
    c.fillStyle = 'rgba(0,0,0,0.45)';
    rr(c, 28, cy - 36, CFG.W - 56, 110, 16);
    c.fill();
    c.strokeStyle = col;
    c.lineWidth = 3;
    rr(c, 28, cy - 36, CFG.W - 56, 110, 16);
    c.stroke();
    Art.enemy(c, { boss: boss, type: boss.id, phase: t, hitT: 0, r: boss.r || 28, color: col }, CFG.W / 2, cy - 70, 92, UI.t, 0);
    UI.text(boss.name, CFG.W / 2, cy + 18, 22, col, { stroke: '#fff', sw: 5 });
    UI.plain(boss.skill || '', CFG.W / 2, cy + 42, 13, '#ffe0a0');
    UI.plain('首领登场', CFG.W / 2, cy - 48, 12, '#ffb0c0');
    c.restore();
  },
  drawBanner: function () {
    var b = this.banner,
      c = UI.c,
      k = b.life,
      a = k > 1.9 ? (2.2 - k) / 0.3 : k < 0.4 ? k / 0.4 : 1,
      x = k > 1.9 ? (1 - a) * -200 : k < 0.4 ? (1 - a) * 200 : 0;
    c.save();
    c.globalAlpha = a;
    c.translate(x, 0);
    var y = 170;
    if (b.boss) {
      c.fillStyle = 'rgba(120,0,30,.35)';
      c.fillRect(0, y - 46, CFG.W, 92);
    }
    var g = c.createLinearGradient(0, y - 30, 0, y + 30);
    g.addColorStop(0, shade(b.col, 0.3));
    g.addColorStop(1, b.col);
    c.fillStyle = g;
    c.fillRect(0, y - 28, CFG.W, 56);
    c.fillStyle = 'rgba(255,255,255,.3)';
    c.fillRect(0, y - 28, CFG.W, 4);
    c.fillRect(0, y + 24, CFG.W, 4);
    UI.text(b.t, CFG.W / 2, y - (b.sub ? 7 : 0), 26, '#fff', { stroke: shade(b.col, -0.5), sw: 5 });
    if (b.sub) UI.text(b.sub, CFG.W / 2, y + 16, 12, '#fff', { stroke: shade(b.col, -0.5) });
    c.restore();
  },
  drawTut: function () {
    var c = UI.c,
      g = this.g,
      t = UI.t,
      msg,
      hx,
      hy;
    if (this.tut == 0) {
      msg = '点击召唤萌宠伙伴（需要2只）';
      hx = 85;
      hy = CFG.H - 26;
    } else if (this.tut == 1) {
      var cats = g.towers.filter(function (x) {
        return x.lv == 1;
      });
      if (
        cats.length < 2 &&
        g.towers.some(function (x) {
          return x.lv >= 2;
        })
      ) {
        this.tut = 2;
        return;
      }
      msg = '把一只伙伴拖到另一只相同的伙伴上合成升级！';
      if (cats[0] && cats[1]) {
        var a = g.tpos(cats[0]),
          b = g.tpos(cats[1]),
          k = (t * 0.7) % 1;
        hx = a.x + (b.x - a.x) * k;
        hy = a.y + (b.y - a.y) * k;
      } else {
        hx = 180;
        hy = 470;
      }
    } else if (this.tut == 2) {
      msg = '合成成功！点击开始战斗';
      hx = 231;
      hy = CFG.H - 26;
    }
    if (this.tut == 3) return;
    var pr = (t * 1.6) % 1;
    c.strokeStyle = 'rgba(255,176,32,' + (1 - pr) + ')';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(hx, hy, 14 + pr * 22, 0, 7);
    c.stroke();
    UI.panel(30, 300, 300, 52, { border: '#8fd3ff' });
    UI.plain(msg, 180, 326, 13, '#4a6a8a');
    c.save();
    c.translate(hx + 10, hy + 8 + Math.sin(t * 8) * 4);
    c.fillStyle = '#fff';
    c.strokeStyle = '#5a3a4a';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(6, 16);
    c.lineTo(10, 11);
    c.lineTo(17, 18);
    c.lineTo(20, 15);
    c.lineTo(13, 8);
    c.lineTo(18, 5);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
  },
  drawTip: function () {
    var g = this.g,
      k = this.tips[0],
      TXT = {
        team: ['不同伙伴各有专长', '企鹅减速、熊熊炮轰范围，猫咪远程输出，混搭更强'],
        card: ['每波结束选一张强化卡', '卡牌加成整局有效，同流派凑满 3 张触发套装效果'],
        boss: ['第 5 波会出现首领', '首领血量很高，脚下有红色警示圈，提前合成高级伙伴']
      },
      show =
        (k == 'team' && g.wave == 0) ||
        (k == 'card' && g.state == 'pick') ||
        (k == 'boss' && g.wave == 4 && g.state == 'prep');
    if (!show) {
      if ((k == 'team' && g.wave > 0) || (k == 'card' && g.wave > 1) || (k == 'boss' && g.wave > 4)) this.nextTip();
      return;
    }
    this.tipT += 1 / 60;
    var y = k == 'card' ? 560 : 300,
      a = Math.min(1, this.tipT * 4);
    UI.c.save();
    UI.c.globalAlpha = a;
    UI.panel(24, y, 312, 56, { border: '#ffb020' });
    UI.text(TXT[k][0], 180, y + 20, 15, '#c0602a', { stroke: '#fff', sw: 3 });
    UI.plain(TXT[k][1], 180, y + 41, 10.5, '#9a7a5a');
    UI.c.restore();
    if (this.tipT > 6) this.nextTip();
  },
  nextTip: function () {
    this.tips.shift();
    this.tipT = 0;
    if (!this.tips.length) {
      Save.d.tips = Save.d.tips || {};
      Save.d.tips.l12 = 1;
      Save.save();
    }
  },
  drawPick: function () {
    var g = this.g,
      c = UI.c,
      self = this,
      k = Math.min(1, this.pickT / 0.3);
    UI.dim(0.6 * k);
    UI.text(g.endlessLaw ? '法则抉择' : '选择一张强化卡', CFG.W / 2, 88, 24, '#fff', {
      stroke: g.endlessLaw ? '#7a6cff' : '#ff6f9c',
      sw: 6
    });
    if (g.endlessLaw) UI.plain('无尽专属：三选一，永久改变本局规则', CFG.W / 2, 112, 12, '#c8b0ff');
    else UI.plain('第 ' + g.wave + ' 波完成！', CFG.W / 2, 116, 13, '#ffe0ea');
    g.choices.forEach(function (u, i) {
      var dl = Math.max(0, Math.min(1, (self.pickT - 0.1 - i * 0.1) / 0.35)),
        e = Tween.E.outBack(dl),
        y = 140 + i * 118,
        x = 28,
        w = 304,
        h = 106,
        R = CFG.RARITY[u.r];
      c.save();
      c.translate(CFG.W / 2, y + h / 2);
      c.scale(e, e);
      c.translate(-CFG.W / 2, -(y + h / 2));
      c.globalAlpha = Math.min(1, dl * 2);
      c.fillStyle = 'rgba(60,30,50,.22)';
      rr(c, x + 3, y + 6, w, h, 18);
      c.fill();
      if (u.r == 'legend' || u.r == 'epic') {
        c.shadowColor = R.color;
        c.shadowBlur = g.enemies.length > 20 ? 0 : 18 + Math.sin(UI.t * 5) * 8;
      }
      c.fillStyle = R.color;
      rr(c, x, y, w, h, 18);
      c.fill();
      c.shadowBlur = 0;
      var bg = c.createLinearGradient(0, y, 0, y + h);
      bg.addColorStop(0, '#fffdf8');
      bg.addColorStop(1, '#fff0e6');
      c.fillStyle = bg;
      rr(c, x + 4, y + 4, w - 8, h - 8, 15);
      c.fill();
      if (u.r == 'legend' || (u.r == 'epic' && g.endlessLaw)) {
        c.save();
        rr(c, x + 4, y + 4, w - 8, h - 8, 15);
        c.clip();
        var sx = ((UI.t * 120) % (w + 120)) - 60;
        var sg = c.createLinearGradient(x + sx - 30, 0, x + sx + 30, 0);
        sg.addColorStop(0, 'rgba(255,255,255,0)');
        sg.addColorStop(0.5, 'rgba(255,240,180,.7)');
        sg.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = sg;
        c.fillRect(x, y, w, h);
        c.restore();
      }
      c.fillStyle = shade(R.color, 0.75);
      c.beginPath();
      c.arc(x + 52, y + h / 2, 34, 0, 7);
      c.fill();
      c.strokeStyle = R.color;
      c.lineWidth = 3;
      c.stroke();
      Art.icon(c, u.icon, x + 52, y + h / 2, 40);
      c.fillStyle = R.color;
      rr(c, x + w - 64, y + 10, 52, 20, 10);
      c.fill();
      UI.text(R.name, x + w - 38, y + 20, 11, '#fff', { stroke: false });
      UI.text(u.name, x + 100, y + 34, 19, '#6a3a4a', { align: 'left', stroke: false });
      UI.plain(u.desc, x + 100, y + 62, 12.5, '#8a6070', 'left');
      if (u.tag) {
        var bd = BUILDS[u.tag];
        c.fillStyle = bd.color;
        rr(c, x + 100, y + 76, 90, 18, 9);
        c.fill();
        UI.plain(
          bd.name + ' ' + ((g.tags[u.tag] || 0) >= 3 ? '已激活' : (g.tags[u.tag] || 0) + 1 + '/3'),
          x + 145,
          y + 85,
          10,
          '#fff'
        );
      }
      c.restore();
      if (dl >= 1)
        UI.hit('card' + i, x, y, w, h, function () {
          Sfx.play(u.r == 'legend' ? 'legend' : 'card');
          var cx = x + w / 2;
          FX.burst(cx, y + h / 2, 24, { colors: [R.color, '#fff', '#ffd23f'], shape: 'star', speed: 200, size: 6 });
          Platform.vibrate(u.r == 'legend' ? 35 : 12);
          g.pick(u);
        });
    });
    var by = 508;
    if (g.freeRerolls > 0)
      UI.button(
        'rr0',
        40,
        by,
        130,
        36,
        '免费刷新 x' + g.freeRerolls,
        '#7a6cff',
        function () {
          g.reroll('free');
          self.pickT = 0;
          Sfx.play('click');
        },
        { size: 13 }
      );
    else
      UI.button(
        'rr1',
        40,
        by,
        130,
        36,
        '刷新 ' + CFG.REROLL_GEMS,
        '#7a6cff',
        function () {
          if (g.reroll('gem')) {
            self.pickT = 0;
            Sfx.play('click');
          } else UI.toast('钻石不足', '#ffd6e0');
        },
        { icon: 'gem', size: 13 }
      );
    UI.button(
      'rr2',
      190,
      by,
      130,
      36,
      g.adReroll ? '看广告刷新' : '已使用',
      '#ff9f43',
      function () {
        Platform.showRewardedAd('reroll', function () {
          g.reroll('ad');
          self.pickT = 0;
          Sfx.play('card');
          Platform.vibrate(12);
        });
      },
      { icon: 'ad', size: 13, disabled: !g.adReroll }
    );
  },
  drawPause: function () {
    var self = this;

    UI.dim(0.55);
    UI.panel(50, 180, 260, 280, { title: '暂停一下' });
    UI.button(
      'resume',
      85,
      220,
      190,
      44,
      '继续游戏',
      '#5fcf6a',
      function () {
        self.paused = false;
        Sfx.play('click');
        Platform.vibrate(10);
      },
      { size: 17 }
    );
    UI.button(
      'retry',
      85,
      274,
      190,
      44,
      '重新开始',
      '#ff9f43',
      function () {
        self.paused = false;
        Sfx.play('click');
        Platform.vibrate(12);
        self.start(self.level);
      },
      { size: 17 }
    );
    UI.button(
      'home',
      85,
      328,
      190,
      44,
      '返回地图',
      '#8fd3ff',
      function () {
        self.paused = false;
        Sfx.play('click');
        Platform.vibrate(10);
        App.go(GS.backScene());
      },
      { size: 17 }
    );
    UI.button(
      'mute',
      85,
      382,
      190,
      44,
      Sfx.muted ? '音效：关' : '音效：开',
      '#b46cff',
      function () {
        Sfx.setMute(!Sfx.muted);
        Save.d.mute = Sfx.muted;
        Save.save();
        if (!Sfx.muted) Sfx.play('click');
        Platform.vibrate(10);
        UI.toast(Sfx.muted ? '已静音' : '声音已开', '#8fd3ff');
      },
      { icon: Sfx.muted ? 'mute' : 'sound', size: 15 }
    );
  },
  drawResult: function () {
    var r = this.result,
      self = this,
      c = UI.c,
      g = this.g,
      L = this.level,
      k = Tween.E.outBack(Math.min(1, r.t / 0.4));
    UI.dim(0.6 * Math.min(1, r.t * 3));
    c.save();
    c.translate(180, 320);
    c.scale(k, k);
    c.translate(-180, -320);
    if (r.exp) {
      UI.panel(30, 190, 300, 260, { title: r.win ? '战斗胜利！' : '远征失败…', border: r.win ? '#ffb020' : '#9fb3c8' });
      Art.draw(c, r.win ? 't_cat_3_h' : 'e_king_h', 130, 210, 100, 100);
      UI.plain(r.win ? '继续前进吧！' : '走到第 ' + (Exp.row + 1) + ' 层', 180, 330, 15, '#7a4a55');
      if (!r.win && !g.revived)
        UI.button(
          'revive',
          60,
          356,
          240,
          40,
          '看广告复活',
          '#ff9f43',
          function () {
            Platform.showRewardedAd('revive', function () {
              self.result = null;
              g.revive();
              Sfx.play('legend');
              Platform.vibrate(28);
            });
          },
          { icon: 'ad', pulse: true, size: 16, primary: true }
        );
      UI.button(
        'expgo',
        60,
        402,
        240,
        38,
        r.win ? '返回远征地图' : '结算',
        '#5fcf6a',
        function () {
          Exp.onBattleEnd(r.win);
        },
        { size: 15 }
      );
      c.restore();
      return;
    }
    var title = r.win ? '胜利啦！' : L.mode ? '挑战结束' : '城堡失守…';
    UI.panel(30, 160, 300, 340, { title: title, border: r.win ? '#ffb020' : '#9fb3c8' });
    Art.draw(c, r.win ? 't_cat_3_h' : 'e_king_h', 130, 182, 100, 100);
    if (r.win && !L.mode) {
      for (var i = 0; i < 3; i++) {
        var sk = Math.max(0, Math.min(1, (r.t - 0.4 - i * 0.25) / 0.3)),
          on = i < r.rw.stars;
        c.save();
        c.translate(110 + i * 70, i == 1 ? 290 : 300);
        var e = on ? Tween.E.outBack(sk) + 0.0001 : 1;
        c.scale(e, e);
        Art.icon(c, on ? 'star' : 'starE', 0, 0, i == 1 ? 52 : 42);
        c.restore();
      }
    } else {
      var line = L.mode == 'bossrush' ? '击败首领 ' + g.stats.bosses + ' 个' : '坚持到第 ' + g.wave + ' 波';
      UI.text(line, 180, 294, 18, '#7a4a55', { stroke: false });
      if (L.mode == 'endless')
        UI.plain(
          '历史最佳 ' +
            Save.d.best +
            ' 波 · 本周词缀：' +
            (L.mods || [])
              .map(function (m) {
                return CFG.MODS[m].name;
              })
              .join('+'),
          180,
          316,
          10.5,
          '#a07080'
        );
    }
    // 奖励筹码：白底圆角 + 图标，层次更清晰
    c.fillStyle = '#fff';
    rr(c, 70, 324, 100, 38, 19);
    c.fill();
    c.strokeStyle = '#ffb3c7';
    c.lineWidth = 2;
    c.stroke();
    Art.icon(c, 'candy', 92, 343, 22);
    UI.text('+' + r.rw.candy * (r.doubled ? 2 : 1), 128, 343, 16, '#ff6f9c', { stroke: false });
    if (r.rw.gems) {
      c.fillStyle = '#fff';
      rr(c, 190, 324, 100, 38, 19);
      c.fill();
      c.strokeStyle = '#8fd3ff';
      c.lineWidth = 2;
      c.stroke();
      Art.icon(c, 'gem', 212, 343, 20);
      UI.text('+' + r.rw.gems, 248, 343, 16, '#4fa8ff', { stroke: false });
    }
    if (r.video)
      UI.button(
        'vshare',
        236,
        168,
        88,
        28,
        Save.d.vidDate == Save.today() ? '分享录屏' : '录屏+20钻',
        '#ff4d6d',
        function () {
          Platform.shareVideo(function (ok) {
            if (ok && Save.d.vidDate != Save.today()) {
              Save.d.vidDate = Save.today();
              Save.add({ gems: 20 });
              Sfx.play('coin');
              Platform.vibrate(18);
              UI.toast('分享成功 +20 钻石', '#8fd3ff');
            }
          });
        },
        { size: 11, r: 12, pulse: Save.d.vidDate != Save.today() }
      );
    UI.plain(
      '击杀 ' + g.stats.kills + '   合成 ' + g.stats.merges + (r.xp ? '   通行证经验 +' + r.xp : ''),
      180,
      374,
      10.5,
      '#a07080'
    );
    if (r.canRevive && !r.granted) {
      UI.button(
        'revive',
        60,
        392,
        240,
        40,
        '看广告复活',
        '#ff9f43',
        function () {
          Platform.showRewardedAd('revive', function () {
            self.result = null;
            g.revive();
            Sfx.play('legend');
            Platform.vibrate(28);
            FX.burst(CFG.CASTLE.x, CFG.CASTLE.y, 30, { color: '#ff5a7a', shape: 'heart', speed: 150 });
            UI.toast('城堡复活！', '#ffd6e0');
          });
        },
        { icon: 'ad', pulse: true, size: 16 }
      );
      UI.button(
        'giveup',
        60,
        440,
        240,
        36,
        '放弃',
        '#9fb3c8',
        function () {
          r.canRevive = false;
          self.grantResult();
        },
        { size: 14 }
      );
    } else {
      if (!r.doubled)
        UI.button(
          'dbl',
          60,
          392,
          240,
          40,
          '看广告 奖励翻倍',
          '#ff9f43',
          function () {
            Platform.showRewardedAd('double', function () {
              r.doubled = true;
              Save.add({ candy: r.rw.candy });
              Sfx.play('coin');
              Platform.vibrate(22);
              UI.toast('奖励已翻倍', '#ffd23f');
            });
          },
          { icon: 'ad', size: 15, pulse: true, primary: true }
        );
      var next = r.win && !L.mode && this.nextLevel(),
        bw = next ? 72 : 115;
      UI.button(
        'back',
        50,
        440,
        bw,
        40,
        '返回',
        '#8fd3ff',
        function () {
          Sfx.play('click');
          Platform.vibrate(12);
          Platform.showInterstitial();
          App.go(GS.backScene());
        },
        { size: 14 }
      );
      UI.button(
        'again',
        50 + bw + 8,
        440,
        bw,
        40,
        '再来',
        '#ff9f43',
        function () {
          Sfx.play('click');
          Platform.vibrate(12);
          Platform.showInterstitial();
          self.start(L.mode == 'endless' ? CFG.endlessInfo() : L);
        },
        { size: 14 }
      );
      if (next)
        UI.button(
          'next',
          50 + bw * 2 + 16,
          440,
          bw,
          40,
          '下一关',
          '#5fcf6a',
          function () {
            Sfx.play('click');
            Platform.vibrate(14);
            Platform.showInterstitial();
            self.start(next);
          },
          { size: 14, primary: true, pulse: true }
        );
    }
    c.restore();
  },
  nextLevel: function () {
    var L = this.level;
    if (!L.c || L.elite) return null;
    var c = L.c,
      l = L.l + 1;
    if (l > CFG.LEVELS_PER) {
      c++;
      l = 1;
    }
    if (c > CFG.CHAPTERS.length) return null;
    return CFG.levelInfo(c, l);
  },
  cellAt: function (x, y) {
    var c = Math.floor((x - CFG.GRID_X) / CFG.CELL),
      r = Math.floor((y - CFG.GRID_Y) / CFG.CELL);
    return c >= 0 && c < CFG.COLS && r >= 0 && r < CFG.ROWS ? { c: c, r: r } : null;
  },
  down: function (x, y) {
    if (this.paused || this.result || this.g.state == 'pick') return;
    var cl = this.cellAt(x, y);
    if (cl) {
      var t = this.g.cellAt(cl.c, cl.r);
      if (t) {
        this.drag = { t: t, x: x, y: y, sx: x, sy: y, moved: false };
        return;
      }
    }
    this.sel = null;
  },
  move: function (x, y) {
    if (!this.drag) return;
    this.drag.x = x;
    this.drag.y = y;
    if (Math.hypot(x - this.drag.sx, y - this.drag.sy) > 8) this.drag.moved = true;
  },
  up: function (x, y) {
    var d = this.drag;
    if (!d) return;
    this.drag = null;
    if (!d.moved) {
      this.sel = this.sel === d.t ? null : d.t;
      Sfx.play('click');
      return;
    }
    var cl = this.cellAt(x, y);
    if (cl) {
      var r = this.g.move(d.t, cl.c, cl.r);
      if (r == 'merge' && this.tut == 1) this.tut = 2;
      if (r) this.sel = null;
    }
  },
  drawMech: function () {
    var c = UI.c,
      g = this.g,
      t = UI.t;
    if (g.switching) {
      g.paths.forEach(function (p, i) {
        if (i == g.activePath) return;
        c.save();
        c.globalAlpha = 0.45;
        c.strokeStyle = 'rgba(120,90,60,.6)';
        c.lineWidth = 30;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.beginPath();
        var P = p.pts;
        c.moveTo(P[2][0], P[2][1]);
        for (var k = 3; k < P.length - 1; k++) c.lineTo(P[k][0], P[k][1]);
        c.stroke();
        c.restore();
        var q = p.pts[2];
        c.fillStyle = '#ff6f6f';
        rr(c, q[0] - 16, q[1] - 9, 32, 18, 6);
        c.fill();
        UI.text('封路', q[0], q[1], 10, '#fff', { stroke: false });
      });
      var ap = g.paths[g.activePath].pts[2];
      UI.text('→', ap[0], ap[1] - 16 + Math.sin(t * 6) * 3, 18, '#5fcf6a', { stroke: '#fff' });
      c.fillStyle = 'rgba(255,255,255,.85)';
      rr(c, 10, CFG.FIELD_BOT - 30, 92, 22, 11);
      c.fill();
      UI.plain('路线切换 ' + Math.ceil(g.switchT) + '秒', 56, CFG.FIELD_BOT - 19, 10, '#a0703a');
    }
    if (g.blizzard) {
      c.fillStyle = '#fff';
      this.snow.forEach(function (f) {
        c.globalAlpha = 0.8;
        c.beginPath();
        c.arc(f.x, f.y, 1.6 + f.w * 0.25, 0, 7);
        c.fill();
      });
      c.globalAlpha = 1;
      if (g.storm > 0) {
        c.fillStyle = 'rgba(200,230,255,' + (0.18 + Math.sin(t * 3) * 0.05) + ')';
        c.fillRect(0, 0, CFG.W, CFG.FIELD_BOT);
        UI.text('暴风雪！攻速降低', 180, CFG.FIELD_BOT - 18, 13, '#5ab8ff', { stroke: '#fff', sw: 4 });
      }
    }
    if (g.fog && !g.m.seeFog) {
      var Y = g.FOG_Y,
        fg = c.createLinearGradient(0, 40, 0, Y + 30);
      fg.addColorStop(0, 'rgba(80,60,120,.88)');
      fg.addColorStop(0.75, 'rgba(120,100,170,.7)');
      fg.addColorStop(1, 'rgba(160,140,210,0)');
      c.fillStyle = fg;
      c.fillRect(0, 40, CFG.W, Y - 10);
      for (var i = 0; i < 9; i++) {
        var x = ((i * 67 + t * 12) % 420) - 30,
          y = Y - 14 + Math.sin(t + i) * 6;
        c.fillStyle = 'rgba(200,185,240,.35)';
        c.beginPath();
        c.arc(x, y, 22, 0, 7);
        c.arc(x + 20, y + 4, 16, 0, 7);
        c.fill();
      }
      UI.plain('迷雾区域：无法锁定敌人', 180, Y - 34, 10, 'rgba(255,255,255,.75)');
    }
  },
  drawHero: function () {
    var g = this.g,
      c = UI.c;

    if (!g.heroId || this.result) return;
    var H = CFG.HEROES[g.heroId],
      x = 322,
      y = 372,
      R = 24,
      cd = H.cd * g.m.heroCd,
      k = g.heroCdT > 0 ? 1 - g.heroCdT / cd : 1,
      ready = g.heroReady();
    c.save();
    if (ready) {
      c.shadowColor = H.color;
      c.shadowBlur = 14 + Math.sin(UI.t * 6) * 6;
    }
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(x, y, R + 4, 0, 7);
    c.fill();
    c.shadowBlur = 0;
    c.fillStyle = shade(H.color, 0.7);
    c.beginPath();
    c.arc(x, y, R, 0, 7);
    c.fill();
    c.save();
    c.beginPath();
    c.arc(x, y, R, 0, 7);
    c.clip();
    Art.drawAt(c, 'h_' + g.heroId + '_' + (ready ? 'a' : '0'), x, y + R + 6, R * 2.4);
    c.restore();
    if (k < 1) {
      c.fillStyle = 'rgba(40,20,40,.5)';
      c.beginPath();
      c.moveTo(x, y);
      c.arc(x, y, R, -Math.PI / 2 + k * Math.PI * 2, Math.PI * 1.5);
      c.closePath();
      c.fill();
      UI.text(Math.ceil(g.heroCdT) + '', x, y, 14, '#fff');
    }
    c.strokeStyle = H.color;
    c.lineWidth = 3;
    c.beginPath();
    c.arc(x, y, R + 2, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2);
    c.stroke();
    c.restore();
    c.fillStyle = H.color;
    rr(c, x - 26, y + R - 2, 52, 14, 7);
    c.fill();
    UI.text(H.skill, x, y + R + 5, 9, '#fff', { stroke: false });
    UI.hit('hero', x - R, y - R, R * 2, R * 2, function () {
      if (g.useHero()) {
        Sfx.play('legend');
        Platform.vibrate(30);
      } else if (g.state != 'wave') UI.toast('战斗中才能释放技能', '#ffd6e0');
      else UI.toast('技能冷却中', '#ffd6e0');
    });
  },
  drawBranch: function () {
    var g = this.g,
      t = g.pendingBranch,
      c = UI.c;
    if (!t) return;
    var B = CFG.BRANCHES[t.type];
    UI.dim(0.65);
    UI.text('进化抉择！', 180, 120, 26, '#fff', { stroke: '#ff6f9c', sw: 6 });
    UI.plain(CFG.TOWERS[t.type].name + ' 达到 Lv' + CFG.BRANCH_LV + '，选择进化方向', 180, 150, 12, '#ffe0ea');
    ['A', 'B'].forEach(function (br, i) {
      var x = 20 + i * 165,
        y = 180,
        w = 155,
        h = 300,
        col = br == 'A' ? '#4fa8ff' : '#ff5a7a';
      c.save();
      c.shadowColor = col;
      c.shadowBlur = 18;
      c.fillStyle = col;
      rr(c, x, y, w, h, 18);
      c.fill();
      c.restore();
      c.fillStyle = '#fffaf3';
      rr(c, x + 4, y + 4, w - 8, h - 8, 15);
      c.fill();
      c.fillStyle = shade(col, 0.8);
      c.beginPath();
      c.arc(x + w / 2, y + 95, 62, 0, 7);
      c.fill();
      Art.drawAt(
        c,
        Art.towerKey(t.type, CFG.BRANCH_LV, br) + '_0',
        x + w / 2,
        y + 165 - Math.abs(Math.sin(UI.t * 3 + i)) * 4,
        124
      );
      c.fillStyle = col;
      rr(c, x + w / 2 - 24, y + 12, 48, 20, 10);
      c.fill();
      UI.text('路线' + br, x + w / 2, y + 22, 11, '#fff', { stroke: false });
      UI.text(B[br].name, x + w / 2, y + 190, 17, shade(col, -0.3), { stroke: false });
      var ds = B[br].desc.match(/.{1,9}/g);
      ds.forEach(function (d, j) {
        UI.plain(d, x + w / 2, y + 216 + j * 17, 11.5, '#7a5a6a');
      });
      UI.button(
        'br' + br,
        x + 20,
        y + h - 52,
        w - 40,
        36,
        '选择',
        col,
        function () {
          g.chooseBranch(br);
          Sfx.play('legend');
          Platform.vibrate(28);
          FX.burst(180, 330, 40, { colors: [col, '#fff', '#ffd23f'], shape: 'star', speed: 220, size: 7 });
        },
        { size: 15, pulse: true }
      );
    });
  },
  backScene: function () {
    var L = this.level;
    return L.mode == 'exp' ? 'exp' : L.mode ? 'modes' : 'map';
  }
};
function fmtDmg(v) {
  return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
}


// ---- src/scenes/sceneMenu.js ----
/**
 * 软萌大作战 V1.0
 * 标题 / 地图 / 玩法大厅 / 英雄 / 扭蛋 / 远征 / 各类面板
 *
 * © 2026 <著作权人>
 */
var Menu = {
  chapter: 1,
  panel: null,
  pk: 0,
  popup: null,
  open: function (p) {
    this.panel = p;
    this.pk = 0;
    this.sc = 0;
    Sfx.play('click');
  },
  drawTitle: function () {
    var c = UI.c,
      t = UI.t;
    UI.begin();
    var g = c.createLinearGradient(0, 0, 0, CFG.H);
    g.addColorStop(0, '#ffd6e8');
    g.addColorStop(0.5, '#ffe9f2');
    g.addColorStop(1, '#c9f0d4');
    c.fillStyle = g;
    c.fillRect(0, 0, CFG.W, CFG.H);
    // 光芒
    c.save();
    c.translate(180, 210);
    c.rotate(t * 0.15);
    for (var i = 0; i < 12; i++) {
      c.rotate(Math.PI / 6);
      c.fillStyle = 'rgba(255,255,255,.28)';
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-30, -400);
      c.lineTo(30, -400);
      c.fill();
    }
    c.restore();
    // 漂浮泡泡
    for (i = 0; i < 14; i++) {
      var bx = ((i * 53 + t * 12 * (1 + (i % 3))) % 400) - 20,
        by = CFG.H - ((t * 30 * (1 + (i % 4)) + i * 97) % (CFG.H + 40));
      c.fillStyle = 'rgba(255,255,255,.45)';
      c.beginPath();
      c.arc(bx, by, 4 + (i % 5) * 2, 0, 7);
      c.fill();
    }
    // 草地
    c.fillStyle = '#9fd88f';
    c.beginPath();
    c.moveTo(0, 500);
    for (var x = 0; x <= 360; x += 30) c.quadraticCurveTo(x + 15, 488, x + 30, 500);
    c.lineTo(360, 640);
    c.lineTo(0, 640);
    c.fill();
    c.fillStyle = '#b9e8a6';
    c.beginPath();
    c.moveTo(0, 520);
    for (x = 0; x <= 360; x += 45) c.quadraticCurveTo(x + 22, 506, x + 45, 520);
    c.lineTo(360, 640);
    c.lineTo(0, 640);
    c.fill();
    // 角色
    var cast = [
      ['t_cat_5A_0', 70, 470, 104],
      ['h_princess_0', 180, 452, 100],
      ['t_bear_4A_0', 290, 470, 104],
      ['e_normal_0', 40, 560, 56],
      ['e_flying_0', 320, 565, 56],
      ['t_penguin_3_0', 120, 578, 76],
      ['t_fox_3_0', 240, 580, 76]
    ];
    cast.forEach(function (a, i) {
      var b = Math.abs(Math.sin(t * 3 + i * 1.3));
      c.fillStyle = 'rgba(60,90,40,.2)';
      c.beginPath();
      c.ellipse(a[1], a[2] + a[3] * 0.33, a[3] * 0.3, a[3] * 0.08, 0, 0, 7);
      c.fill();
      c.save();
      c.translate(a[1], a[2] + a[3] * 0.35 - b * 14);
      c.scale(1 + (1 - b) * 0.05, 1 - (1 - b) * 0.05);
      Art.drawAt(c, a[0], 0, 0, a[3]);
      c.restore();
    });
    // 标题字
    var title = '软萌大作战',
      cols = ['#ff6f9c', '#ff9f43', '#ffc93c', '#5fcf6a', '#4fa8ff'];
    for (i = 0; i < 5; i++) {
      var ty = 200 + Math.sin(t * 3 + i * 0.8) * 8,
        sc = 1 + Math.sin(t * 3 + i * 0.8) * 0.04;
      c.save();
      c.translate(60 + i * 60, ty);
      c.rotate(Math.sin(t * 2 + i) * 0.06);
      c.scale(sc, sc);
      UI.font(58, '900', true);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineJoin = 'round';
      c.lineWidth = 16;
      c.strokeStyle = '#fff';
      c.strokeText(title[i], 0, 0);
      c.lineWidth = 7;
      c.strokeStyle = shade(cols[i], -0.35);
      c.strokeText(title[i], 0, 0);
      var gg = c.createLinearGradient(0, -26, 0, 26);
      gg.addColorStop(0, shade(cols[i], 0.45));
      gg.addColorStop(1, cols[i]);
      c.fillStyle = gg;
      c.fillText(title[i], 0, 0);
      c.fillStyle = 'rgba(255,255,255,.5)';
      c.beginPath();
      c.ellipse(-8, -14, 8, 4, -0.4, 0, 7);
      c.fill();
      c.restore();
    }
    c.fillStyle = '#ff8fb1';
    rr(c, 80, 250, 200, 28, 14);
    c.fill();
    UI.text('合成 · 塔防 · 肉鸽', 180, 264, 14, '#fff', { stroke: false });
    for (i = 0; i < 4; i++)
      Art.icon(
        c,
        'star',
        40 + i * 95 + Math.sin(t * 2 + i) * 5,
        130 + Math.cos(t * 2 + i) * 6 + (i % 2) * 170,
        14 + Math.sin(t * 4 + i) * 3
      );
    var a = 1 + Math.sin(t * 4) * 0.05;
    c.save();
    c.translate(180, 345);
    c.scale(a, a);
    c.fillStyle = 'rgba(255,111,156,.22)';
    rr(c, -102, -28, 204, 56, 28);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)';
    rr(c, -94, -22, 188, 44, 22);
    c.fill();
    c.fillStyle = '#ff6f9c';
    rr(c, -88, -19, 176, 38, 19);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)';
    rr(c, -80, -16, 160, 14, 7);
    c.fill();
    UI.text('点击开始冒险', 0, 0, 18, '#fff', { stroke: '#d94a7a', sw: 4 });
    c.restore();
    c.fillStyle = 'rgba(255,255,255,.72)';
    rr(c, 20, 548, 320, 64, 12);
    c.fill();
    UI.plain('健康游戏忠告', 180, 560, 10, '#7a4a55');
    CFG.HEALTH_NOTICE.forEach(function (l, k) {
      UI.plain(l, 180, 577 + k * 14, 9.5, '#7a4a55');
    });
    UI.plain('V' + CFG.VERSION.replace(/\.0$/, ''), 180, 628, 10, 'rgba(90,60,70,.65)');
    var self = this;
    UI.hit('start', 0, 60, CFG.W, 470, function () {
      if (self.popup) return;
      Sfx.init();
      Sfx.bgm();
      Sfx.play('card');
      Platform.vibrate(18);
      App.go('map');
    });
    UI.button(
      'age',
      300,
      24,
      48,
      48,
      CFG.AGE_RATING.label,
      '#5fcf6a',
      function () {
        self.popup = {
          title: '适龄提示',
          border: '#5fcf6a',
          lines: CFG.AGE_RATING.lines,
          btns: [{ t: '知道了', c: '#5fcf6a', f: function () {} }]
        };
      },
      { size: 15, r: 12 }
    );
    UI.button(
      'privacy',
      12,
      24,
      76,
      28,
      '隐私政策',
      '#c9a0e8',
      function () {
        self.popup = {
          title: '隐私政策摘要',
          border: '#b46cff',
          lines: CFG.PRIVACY_LINES,
          btns: [{ t: '知道了', c: '#b46cff', f: function () {} }]
        };
      },
      { size: 11, r: 12 }
    );
    if (this.popup) this.drawPopup();
  },
  drawTalent: function () {
    var c = UI.c;
    UI.panel(16, 80, 328, 500, { title: '天赋树' });
    UI.pill(130, 108, 100, 26, 'candy', Save.d.candy);
    CFG.TALENTS.forEach(function (tl, i) {
      var y = 144 + i * 60,
        lv = Save.tl(tl.id),
        cost = tl.cost * (lv + 1),
        max = lv >= tl.max;
      c.fillStyle = i % 2 ? '#fff4ec' : '#ffece4';
      rr(c, 30, y, 300, 54, 14);
      c.fill();
      c.fillStyle = '#ffd6e0';
      c.beginPath();
      c.arc(58, y + 27, 20, 0, 7);
      c.fill();
      Art.icon(c, tl.icon, 58, y + 27, 24);
      UI.text(tl.name, 88, y + 16, 14, '#6a3a4a', { align: 'left', stroke: false });
      UI.plain(tl.desc + '  (' + lv + '/' + tl.max + ')', 88, y + 35, 10.5, '#a07080', 'left');
      for (var s = 0; s < tl.max; s++) {
        c.fillStyle = s < lv ? '#ff8fb1' : 'rgba(200,150,160,.3)';
        rr(c, 88 + s * (110 / tl.max), y + 44, 110 / tl.max - 2, 5, 2.5);
        c.fill();
      }
      UI.button(
        'tl' + tl.id,
        240,
        y + 11,
        82,
        32,
        max ? '已满' : '' + cost,
        max ? '#b8b8c4' : Save.d.candy >= cost ? '#5fcf6a' : '#c9a0b0',
        function () {
          if (max) return;
          if (Save.d.candy < cost) {
            UI.toast('糖果不足，去闯关吧', '#ffd6e0');
            return;
          }
          Save.d.candy -= cost;
          Save.d.talents[tl.id] = lv + 1;
          Save.save();
          Sfx.play('upgrade');
          Platform.vibrate(16);
          UI.toast(tl.name + ' 升级!', '#ffd23f');
        },
        { icon: max ? null : 'candy', size: 13, disabled: max }
      );
    });
    UI.plain('天赋永久生效，糖果通过闯关获得', 180, 566, 11, '#a07080');
  },
  drawDaily: function () {
    var c = UI.c,
      d = Save.d,
      today = Save.today();
    Save.checkDaily();
    UI.panel(16, 80, 328, 500, { title: '每日福利' });
    UI.plain('七日签到', 180, 116, 13, '#ff6f9c');
    var signed = d.signDate == today;
    CFG.SIGNIN.forEach(function (r, i) {
      var x = 26 + (i % 4) * 78,
        y = 128 + Math.floor(i / 4) * 78,
        got = i < d.signDay,
        cur = i == d.signDay % 7 && !signed;
      if (i == 6) x = 104 + 78;
      c.fillStyle = got ? '#ffe6a8' : cur ? '#fff' : '#ffece4';
      rr(c, x, y, i == 6 ? 150 : 72, 70, 12);
      c.fill();
      if (cur) {
        c.strokeStyle = '#ff8fb1';
        c.lineWidth = 3;
        c.stroke();
      }
      UI.plain('第' + (i + 1) + '天', x + (i == 6 ? 75 : 36), y + 12, 10, '#a07080');
      Art.icon(c, r.gems ? 'gem' : 'candy', x + (i == 6 ? 75 : 36), y + 36, 24);
      UI.plain(
        '' + (r.gems || r.candy) + (r.tickets ? ' +' + r.tickets + '券' : ''),
        x + (i == 6 ? 75 : 36),
        y + 58,
        10,
        '#7a4a55'
      );
      if (got) {
        c.fillStyle = 'rgba(95,207,106,.8)';
        c.beginPath();
        c.arc(x + (i == 6 ? 130 : 58), y + 12, 9, 0, 7);
        c.fill();
        UI.plain('好', x + (i == 6 ? 130 : 58), y + 12, 11, '#fff');
      }
    });
    UI.button(
      'sign',
      100,
      290,
      160,
      36,
      signed ? '今日已签到' : '签到领取',
      signed ? '#b8b8c4' : '#ff6f9c',
      function () {
        if (signed) return;
        var r = CFG.SIGNIN[d.signDay % 7];
        var got = Meta.grant(r);
        d.signDay++;
        d.signDate = today;
        Save.save();
        Sfx.play('legend');
        Platform.vibrate(25);
        UI.toast('签到成功 +' + got, '#ffd23f');
      },
      { size: 15, pulse: !signed, disabled: signed }
    );
    UI.plain('每日任务', 180, 344, 13, '#ff6f9c');
    CFG.TASKS.forEach(function (tk, i) {
      var y = 358 + i * 52,
        v = Math.min(tk.goal, d.tasks[tk.id] || 0),
        done = v >= tk.goal,
        cl = d.taskClaimed[tk.id];
      c.fillStyle = '#fff4ec';
      rr(c, 30, y, 300, 46, 12);
      c.fill();
      UI.plain(tk.name, 40, y + 14, 12, '#6a3a4a', 'left');
      UI.bar(40, y + 28, 150, 8, v / tk.goal, '#5fcf6a');
      UI.plain(v + '/' + tk.goal, 200, y + 32, 10, '#a07080', 'left');
      Art.icon(c, tk.reward.gems ? 'gem' : 'candy', 236, y + 23, 16);
      UI.plain('' + (tk.reward.gems || tk.reward.candy), 252, y + 23, 10, '#7a4a55', 'left');
      UI.button(
        'tk' + tk.id,
        270,
        y + 8,
        54,
        30,
        cl ? '已领' : '领取',
        cl ? '#b8b8c4' : done ? '#ff9f43' : '#c9a0b0',
        function () {
          if (cl || !done) return;
          Save.add(tk.reward);
          d.taskClaimed[tk.id] = true;
          Save.save();
          Sfx.play('coin');
          Platform.vibrate(18);
          UI.toast('领取成功', '#ffd23f');
        },
        { size: 12, disabled: cl || !done, pulse: done && !cl }
      );
    });
    var canAll = CFG.TASKS.some(function (tk) {
      return (d.tasks[tk.id] || 0) >= tk.goal && !d.taskClaimed[tk.id];
    });
    if (canAll)
      UI.button(
        'tkall',
        100,
        570,
        160,
        34,
        '一键领取任务',
        '#ff9f43',
        function () {
          var got = [];
          CFG.TASKS.forEach(function (tk) {
            if ((d.tasks[tk.id] || 0) >= tk.goal && !d.taskClaimed[tk.id]) {
              Save.add(tk.reward);
              d.taskClaimed[tk.id] = true;
              got.push(tk.name);
            }
          });
          if (!got.length) return;
          Save.save();
          Sfx.play('legend');
          Platform.vibrate(22);
          UI.toast('领取 ' + got.length + ' 项任务奖励', '#ffd23f');
        },
        { size: 13, pulse: true }
      );
  },
  /** 福利中心：激励视频奖励（每日上限）与钻石兑换皮肤，全部为游戏内获取 */
  drawWelfare: function () {
    var c = UI.c,
      d = Save.d,
      w = Meta.welfare();
    UI.panel(16, 80, 328, 500, { title: '福利中心', border: '#ff9f43' });
    UI.pill(70, 108, 100, 26, 'gem', d.gems);
    UI.pill(190, 108, 100, 26, 'ticket', d.tickets);
    var rows = CFG.WELFARE.map(function (it) {
      return { it: it, ad: true };
    }).concat(
      Object.keys(CFG.SKINS).map(function (k) {
        return { skin: k };
      })
    );
    this.list(138, 556, rows.length * 76, function (y0) {
      rows.forEach(function (row, i) {
        var y = y0 + 6 + i * 76;
        c.fillStyle = '#fff4ec';
        rr(c, 30, y, 300, 68, 14);
        c.fill();
        c.fillStyle = '#ffe0ea';
        c.beginPath();
        c.arc(66, y + 34, 24, 0, 7);
        c.fill();
        if (row.ad) {
          var it = row.it,
            used = w[it.id] || 0,
            left = it.cap - used;
          Art.icon(c, it.icon, 66, y + 34, 32);
          UI.text(it.name, 100, y + 22, 15, '#6a3a4a', { align: 'left', stroke: false });
          UI.plain(it.desc + '（今日 ' + used + '/' + it.cap + '）', 100, y + 46, 10.5, '#a07080', 'left');
          UI.button(
            'wf' + it.id,
            246,
            y + 16,
            76,
            36,
            left > 0 ? '看广告' : '已领完',
            left > 0 ? '#ff9f43' : '#b8b8c4',
            function () {
              if (left <= 0) return;
              Platform.showRewardedAd('welfare_' + it.id, function () {
                w[it.id] = (w[it.id] || 0) + 1;
                Sfx.play('coin');
                Platform.vibrate(20);
                UI.toast('获得 ' + Meta.grant(it.r), '#ffd23f');
              });
            },
            { size: 14, icon: left > 0 ? 'ad' : null, disabled: left <= 0 }
          );
        } else {
          var k = row.skin,
            S = CFG.SKINS[k],
            own = !!d.skins[k],
            cost = CFG.SKIN_GEMS[S.rar];
          Art.icon(c, 'gift', 66, y + 34, 30);
          UI.text(S.name, 100, y + 22, 15, '#6a3a4a', { align: 'left', stroke: false });
          UI.plain(S.rar + ' 皮肤 · ' + CFG.TOWERS[S.type].name, 100, y + 46, 10.5, '#a07080', 'left');
          UI.button(
            'sk' + k,
            246,
            y + 16,
            76,
            36,
            own ? '已拥有' : '' + cost,
            own ? '#b8b8c4' : '#b46cff',
            function () {
              if (own) return;
              if (d.gems < cost) {
                UI.toast('钻石不足，闯关和福利宝箱都能获得', '#ffd6e0');
                return;
              }
              d.gems -= cost;
              Meta.grant({ skin: k });
              Sfx.play('legend');
              Platform.vibrate(30);
              UI.toast('兑换成功：' + S.name, '#ffd23f');
            },
            { size: 14, icon: own ? null : 'gem', disabled: own }
          );
        }
      });
    });
    UI.plain('广告奖励每日 0 点重置 · 游戏内无任何付费项目', 180, 566, 10, '#a07080');
  },
  drawPopup: function () {
    var p = this.popup,
      c = UI.c,
      self = this;
    UI.dim(0.55);
    UI.hit('blk2', 0, 0, 360, 640, function () {});
    var ex = p.lines ? Math.max(36, (p.lines.length - 4) * 22 + 36) : 0;
    UI.panel(40, 190, 280, 250 + ex, { title: p.title, border: p.border || '#ff8fb1' });
    if (p.img) {
      Art.draw(c, p.img, 130, 212, 100, 100);
    }
    if (p.lines)
      p.lines.forEach(function (l, i) {
        UI.plain(l, 180, p.img ? 318 + i * 16 : 236 + i * 22, i ? 10.5 : 12.5, i ? '#a07080' : '#7a4a55');
      });
    else UI.text(p.msg, 180, 326, 16, '#7a4a55', { stroke: false });
    p.btns.forEach(function (b, i) {
      UI.button(
        'pp' + i,
        70,
        350 + ex + i * 44,
        220,
        38,
        b.t,
        b.c,
        function () {
          self.popup = null;
          Sfx.play('click');
          Platform.vibrate(10);
          b.f && b.f();
        },
        { icon: b.icon, size: 15, pulse: i == 0 }
      );
    });
  },
  // ---------- 地图（6 章 × 8 关） ----------
  nodes: [
    [105, 516],
    [220, 498],
    [300, 450],
    [215, 405],
    [105, 374],
    [150, 312],
    [272, 282],
    [180, 214]
  ],
  sky: function (ch) {
    var c = UI.c,
      t = UI.t,
      g = c.createLinearGradient(0, 0, 0, CFG.H);
    g.addColorStop(0, ch.sky[0]);
    g.addColorStop(0.35, ch.sky[1]);
    g.addColorStop(0.7, ch.sky[2]);
    g.addColorStop(1, ch.sky[3]);
    c.fillStyle = g;
    c.fillRect(0, 0, CFG.W, CFG.H);
    var dark = ch.theme == 'haunt' || ch.theme == 'space';
    if (dark) {
      for (var i = 0; i < 40; i++) {
        var a = 0.4 + 0.4 * Math.sin(t * 2 + i);
        c.fillStyle = 'rgba(255,255,255,' + a + ')';
        c.beginPath();
        c.arc((i * 97) % 360, (i * 53) % 330, 1 + (i % 3) * 0.6, 0, 7);
        c.fill();
      }
      c.fillStyle = '#fff8d6';
      c.beginPath();
      c.arc(300, 150, 24, 0, 7);
      c.fill();
      c.fillStyle = ch.sky[0];
      c.beginPath();
      c.arc(290, 144, 22, 0, 7);
      c.fill();
    } else
      for (i = 0; i < 5; i++) {
        var cx = ((i * 90 + t * 8) % 440) - 40;
        c.fillStyle = 'rgba(255,255,255,.75)';
        c.beginPath();
        c.arc(cx, 150 + i * 26, 16, 0, 7);
        c.arc(cx + 20, 144 + i * 26, 20, 0, 7);
        c.arc(cx + 40, 152 + i * 26, 14, 0, 7);
        c.fill();
      }
    c.fillStyle = shade(ch.sky[3], dark ? -0.15 : -0.08);
    c.beginPath();
    c.moveTo(0, 280);
    c.quadraticCurveTo(90, 220, 180, 270);
    c.quadraticCurveTo(270, 220, 360, 270);
    c.lineTo(360, 640);
    c.lineTo(0, 640);
    c.fill();
    c.fillStyle = shade(ch.sky[3], dark ? 0.05 : 0.12);
    c.beginPath();
    c.moveTo(0, 380);
    c.quadraticCurveTo(120, 330, 220, 370);
    c.quadraticCurveTo(300, 345, 360, 365);
    c.lineTo(360, 640);
    c.lineTo(0, 640);
    c.fill();
    var deco = {
      grass: 'decoFlower',
      forest: 'decoMush',
      snow: 'decoPine',
      desert: 'decoCactus',
      haunt: 'decoGrave',
      space: 'decoCrystal'
    }[ch.theme];
    [
      [60, 320, 1],
      [330, 410, 0.9],
      [60, 470, 0.8],
      [330, 575, 1.1],
      [200, 612, 0.8],
      [320, 250, 0.8],
      [55, 600, 0.9],
      [150, 470, 0.7]
    ].forEach(function (d, i) {
      var sd = i * 7 + 3;
      if (Art[deco])
        Art[deco](c, d[0], d[1], d[2] * 1.3, function () {
          sd = (sd * 16807 + 11) % 2147483647;
          return sd / 2147483647;
        });
    });
  },
  elite: false,
  drawMap: function () {
    var c = UI.c,
      t = UI.t,
      self = this,
      ch = CFG.CHAPTERS[this.chapter - 1],
      E = this.elite;
    UI.begin();
    this.sky(ch);
    var N = this.nodes;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = 'rgba(255,255,255,.85)';
    c.lineWidth = 14;
    c.beginPath();
    c.moveTo(N[0][0], N[0][1]);
    for (var i = 1; i < N.length; i++) c.lineTo(N[i][0], N[i][1]);
    c.stroke();
    c.strokeStyle = E ? '#c9a0ff' : ch.road[0];
    c.setLineDash([2, 14]);
    c.lineWidth = 8;
    c.stroke();
    c.setLineDash([]);
    var curNode = null;
    for (i = 0; i < N.length; i++) {
      (function (l) {
        var id = self.chapter + '-' + l + (E ? 'E' : ''),
          base = self.chapter + '-' + l,
          open = E ? (Save.d.stars[base] || 0) >= 3 : Save.levelOpen(self.chapter, l),
          st = Save.d.stars[id] || 0,
          p = N[l - 1],
          boss = l == N.length,
          cur = open && !st && !curNode,
          bob = cur ? Math.sin(t * 4) * 4 : 0,
          R = boss ? 33 : 26;
        if (cur) curNode = p;
        c.fillStyle = 'rgba(0,0,0,.18)';
        c.beginPath();
        c.ellipse(p[0], p[1] + R - 4, R, 8, 0, 0, 7);
        c.fill();
        var col = !open ? '#b8b8c4' : E ? (st ? '#b46cff' : '#8a5ad8') : st ? '#ffb020' : boss ? '#ff4d6d' : '#ff6f9c';
        c.fillStyle = shade(col, -0.25);
        c.beginPath();
        c.arc(p[0], p[1] + 3 + bob, R, 0, 7);
        c.fill();
        var gg = c.createLinearGradient(0, p[1] - R, 0, p[1] + R);
        gg.addColorStop(0, shade(col, 0.4));
        gg.addColorStop(1, col);
        c.fillStyle = gg;
        c.beginPath();
        c.arc(p[0], p[1] + bob, R, 0, 7);
        c.fill();
        c.strokeStyle = '#fff';
        c.lineWidth = 3;
        c.stroke();
        if (cur) {
          var pr = (t * 1.4) % 1;
          c.strokeStyle = 'rgba(255,176,32,' + (1 - pr) * 0.9 + ')';
          c.lineWidth = 3;
          c.beginPath();
          c.arc(p[0], p[1], R + 4 + pr * 14, 0, 7);
          c.stroke();
        }
        if (boss && open) {
          Art.drawAt(c, 'e_' + ch.boss + '_0', p[0], p[1] + bob + 18, 58);
        } else if (open) UI.text(self.chapter + '-' + l, p[0], p[1] + bob, 16, '#fff', { stroke: shade(col, -0.5) });
        else Art.icon(c, 'lock', p[0], p[1], 22);
        for (var s = 0; s < 3; s++) Art.icon(c, s < st ? 'star' : 'starE', p[0] - 17 + s * 17, p[1] + R + 8, 14);
        if (open)
          UI.hit('lv' + id, p[0] - R, p[1] - R, R * 2, R * 2, function () {
            Sfx.play('click');
            self.levelPop(self.chapter, l, E);
          });
        else
          UI.hit('lk' + id, p[0] - R, p[1] - R, R * 2, R * 2, function () {
            UI.toast(E ? '普通模式 3 星解锁精英' : '先通关前一关哦', '#ffd6e0');
          });
      })(i + 1);
    }
    if (curNode) {
      var hb = Math.abs(Math.sin(t * 5)) * 8;
      Art.drawAt(c, 'h_' + Save.d.hero + '_0', curNode[0], curNode[1] - 24 - hb, 50);
    }
    this.topBar();
    // 章节标题
    UI.panel(46, 58, 268, 44, { border: E ? '#b46cff' : shade(ch.color, -0.1) });
    UI.text(ch.name, 180, 80, 15, '#7a4a55', { stroke: false });
    if (this.chapter > 1)
      UI.button(
        'chL',
        6,
        62,
        34,
        38,
        '‹',
        '#ff8fb1',
        function () {
          self.chapter--;
          Sfx.play('click');
          Platform.vibrate(10);
        },
        { size: 22, r: 12 }
      );
    if (this.chapter < CFG.CHAPTERS.length)
      UI.button(
        'chR',
        320,
        62,
        34,
        38,
        '›',
        Save.levelOpen(this.chapter + 1, 1) ? '#ff8fb1' : '#b8b8c4',
        function () {
          if (Save.levelOpen(self.chapter + 1, 1)) {
            self.chapter++;
            Sfx.play('click');
            Platform.vibrate(10);
          } else UI.toast('通关本章解锁下一章', '#ffd6e0');
        },
        { size: 22, r: 12, allowDis: true }
      );
    var tot = 0,
      cs = 0;
    for (var k in Save.d.stars) {
      tot += Save.d.stars[k];
      if (k.indexOf(this.chapter + '-') == 0 && k.indexOf('E') > 0 == E) cs += Save.d.stars[k];
    }
    UI.plain(
      '本章 ' + cs + '/24 星   总计 ' + tot + ' 星',
      150,
      114,
      10.5,
      ch.theme == 'haunt' || ch.theme == 'space' ? '#fff' : '#7a4a55'
    );
    UI.button(
      'eliteT',
      258,
      102,
      96,
      32,
      E ? '精英 ON' : '精英模式',
      E ? '#b46cff' : '#9fb3c8',
      function () {
        self.elite = !self.elite;
      },
      { size: 11, r: 13 }
    );
    // 左侧功能栏
    var side = [
      ['daily', '每日', 'task', '#5fcf6a', this.dailyBadge()],
      ['pass', '通行证', 'crown', '#ffb020', Meta.passBadge()],
      ['ach', '成就', 'trophy', '#ff8a4d', Meta.achBadge()],
      ['mail', '邮件', 'mail', '#4fa8ff', Meta.mailBadge()],
      ['talent', '天赋', 'paw2', '#b46cff', false],
      ['codex', '图鉴', 'eye', '#ff6f9c', this.codexBadge()],
      ['share', '分享', 'share', '#5fcf6a', Save.d.shareDate != Save.today()]
    ];
    if (this.sidebarOk === undefined) {
      this.sidebarOk = false;
      Platform.sidebarCheck(function (ok) {
        self.sidebarOk = ok;
      });
    }
    if (this.sidebarOk) side.unshift(['sidebar', '侧边栏', 'gift', '#ff4d6d', Save.d.sideDate != Save.today()]);
    side.forEach(function (n, i) {
      var y = 146 + i * (side.length > 7 ? 44 : 50);
      UI.button(
        'sd' + n[0],
        6,
        y,
        40,
        40,
        '',
        n[3],
        function () {
          if (n[0] == 'share') self.share();
          else self.open(n[0]);
        },
        { icon: n[2], iconSize: 22, r: 14, badge: n[4] ? '!' : null }
      );
      UI.text(n[1], 26, y + 44, 10, '#fff', { stroke: shade(n[3], -0.4), sw: 3 });
    });
    // 解锁提示
    var up = CFG.unlockSchedule()
      .filter(function (t) {
        return !Save.unlocked(t);
      })
      .slice(0, 3);
    if (up.length) {
      var D0 = CFG.TOWERS[up[0]];
      c.fillStyle = 'rgba(255,255,255,.85)';
      rr(c, 262, 140, 92, 72, 14);
      c.fill();
      UI.plain('即将解锁', 308, 151, 9, '#a06070');
      up.forEach(function (t, i) {
        c.globalAlpha = i ? 0.45 : 0.9;
        Art.draw(c, Art.towerKey(t, 1) + '_0', 266 + i * 29, 158, 28, 28);
        c.globalAlpha = 1;
      });
      UI.plain(D0.unlock + ' ' + D0.name, 308, 200, 10, '#ff6f9c');
    }
    this.nav('map');
    this.overlays();
  },
  levelPop: function (ch, l, E) {
    var L = CFG.levelInfo(ch, l, E),
      self = this;
    var mech = { lanes: '双路线', blizzard: '暴风雪', switch: '流沙变道', fog: '迷雾' }[L.mech] || '标准';
    this.popup = {
      title: '关卡 ' + ch + '-' + l + (E ? ' 精英' : ''),
      msg: '',
      img: L.boss ? 'e_' + L.boss + '_0' : null,
      lines: [
        L.waves + ' 波 · 机制：' + mech,
        L.boss
          ? '章节首领：' + CFG.BOSSES[L.boss].name
          : '敌人：' +
            Object.keys(L.mix)
              .map(function (k) {
                return CFG.ENEMIES[k].name;
              })
              .slice(0, 4)
              .join('、'),
        (function () {
          var ul = Save.unlockAt(ch + '-' + l).filter(function (t) {
            return !Save.unlocked(t);
          });
          return ul.length
            ? '通关解锁新伙伴：' +
                ul
                  .map(function (t) {
                    return CFG.TOWERS[t].name;
                  })
                  .join('、')
            : '';
        })(),
        '英雄：' +
          CFG.HEROES[Save.d.hero].name +
          '   遗物：' +
          (Save.d.equip
            .map(function (r) {
              return CFG.RELICS[r].name;
            })
            .join('、') || '无')
      ],
      border: E ? '#b46cff' : '#ff8fb1',
      btns: [
        {
          t: '出发！',
          c: E ? '#b46cff' : '#ff6f9c',
          icon: 'sword',
          f: function () {
            App.go('game', L);
          }
        },
        {
          t: '调整阵容',
          c: '#4fa8ff',
          f: function () {
            self.go('hero');
          }
        }
      ]
    };
  },
  topBar: function () {
    var self = this,
      c = UI.c;
    c.fillStyle = 'rgba(255,255,255,.88)';
    rr(c, -10, -10, 380, 58, 18);
    c.fill();
    UI.pill(8, 10, 86, 26, 'candy', Save.d.candy);
    UI.pill(98, 10, 78, 26, 'gem', Save.d.gems);
    UI.pill(180, 10, 52, 26, 'ticket', Save.d.tickets);
    UI.button(
      'volDown',
      248,
      8,
      28,
      32,
      '−',
      '#c9b8c0',
      function () {
        Sfx.init();
        Sfx.setVol((Sfx.vol || 0.7) - 0.15);
        Save.d.vol = Sfx.vol;
        Save.save();
        Sfx.play('click');
        UI.toast('音量 ' + Math.round(Sfx.vol * 100) + '%', '#8fd3ff');
      },
      { size: 18, r: 10 }
    );
    UI.button(
      'mute',
      280,
      8,
      32,
      32,
      '',
      '#8fd3ff',
      function () {
        Sfx.init();
        Sfx.setMute(!Sfx.muted);
        Save.d.mute = Sfx.muted;
        Save.save();
        if (!Sfx.muted) Sfx.play('click');
        Platform.vibrate(10);
        UI.toast(Sfx.muted ? '已静音' : '声音已开', '#8fd3ff');
      },
      { icon: Sfx.muted ? 'mute' : 'sound', iconSize: 20, r: 12 }
    );
    UI.button(
      'volUp',
      316,
      8,
      28,
      32,
      '+',
      '#c9b8c0',
      function () {
        Sfx.init();
        Sfx.setVol((Sfx.vol || 0.7) + 0.15);
        Save.d.vol = Sfx.vol;
        Save.save();
        Sfx.play('click');
        UI.toast('音量 ' + Math.round(Sfx.vol * 100) + '%', '#8fd3ff');
      },
      { size: 18, r: 10 }
    );
    UI.button(
      'lbTop',
      212,
      8,
      32,
      32,
      '',
      '#ffb020',
      function () {
        self.open('lb');
      },
      { icon: 'trophy', iconSize: 20, r: 12 }
    );
  },
  nav: function (cur) {
    var self = this,
      c = UI.c;
    c.fillStyle = 'rgba(255,255,255,.92)';
    rr(c, 6, CFG.H - 74, 348, 68, 22);
    c.fill();
    var navs = [
      ['map', '冒险', 'map', '#ff6f9c'],
      ['modes', '玩法', 'sword', '#7a6cff'],
      ['hero', '英雄', 'paw', '#ff8a4d'],
      ['gacha', '扭蛋', 'gift', '#b46cff'],
      ['welfare', '福利', 'gift', '#ff9f43']
    ];
    navs.forEach(function (n, i) {
      var bx = 14 + i * 67,
        on = cur == n[0],
        y = CFG.H - (on ? 72 : 66);
      UI.button(
        'nav' + n[0],
        bx,
        y,
        60,
        on ? 56 : 50,
        '',
        on ? n[3] : shade(n[3], 0.35),
        function () {
          Sfx.play('click');
          Platform.vibrate(10);
          if (n[0] == 'welfare') self.open('welfare');
          else self.go(n[0]);
        },
        {
          icon: n[2],
          iconSize: on ? 28 : 24,
          r: 16,
          badge:
            n[0] == 'gacha' && Save.d.tickets > 0
              ? '!'
              : n[0] == 'welfare' && (Save.d.signDate != Save.today() || Meta.mailBadge())
                ? '!'
                : null
        }
      );
      UI.text(n[1], bx + 30, CFG.H - 20, 10.5, '#fff', { stroke: shade(n[3], -0.4), sw: 3 });
    });
  },
  overlays: function () {
    if (this.panel) this.drawPanel();
    if (this.popup) this.drawPopup();
    UI.drawToasts(1 / 60);
  },
  go: function (s) {
    this.panel = null;
    this.sc = 0;
    App.scene = s == 'map' ? 'map' : s;
  },
  share: function () {
    var d = Save.d;
    Platform.share(
      { title: '软萌大作战', text: '我的萌宠守住了第 ' + (d.best || 0) + ' 波！快来一起玩~' },
      function (ok) {
        if (ok && d.shareDate != Save.today()) {
          d.shareDate = Save.today();
          Save.add({ gems: 20 });
          UI.toast('分享成功 +20 钻石', '#8fd3ff');
        } else if (ok) UI.toast('分享成功（今日奖励已领取）', '#ffd6e0');
      }
    );
  },
  codexBadge: function () {
    return CFG.TOWER_ORDER.some(function (t) {
      return Meta.codexRewards(t).some(function (r) {
        return r.ok && !r.claimed;
      });
    });
  },
  dailyBadge: function () {
    Save.checkDaily();
    if (Save.d.signDate != Save.today()) return true;
    return CFG.TASKS.some(function (tk) {
      return (Save.d.tasks[tk.id] || 0) >= tk.goal && !Save.d.taskClaimed[tk.id];
    });
  },
  // ---------- 滚动列表 ----------
  sc: 0,
  scMax: 0,
  list: function (y0, y1, contentH, fn) {
    var c = UI.c;
    this.scMax = Math.max(0, contentH - (y1 - y0));
    this.sc = Math.max(0, Math.min(this.scMax, this.sc));
    this.listR = [y0, y1];
    c.save();
    c.beginPath();
    c.rect(0, y0, CFG.W, y1 - y0);
    c.clip();
    UI.clipY = [y0, y1];
    fn(y0 - this.sc);
    UI.clipY = null;
    c.restore();
    if (this.scMax > 0) {
      var k = (y1 - y0) / contentH,
        h = Math.max(30, (y1 - y0) * k),
        y = y0 + (y1 - y0 - h) * (this.sc / this.scMax);
      c.fillStyle = 'rgba(160,112,128,.35)';
      rr(c, 336, y, 4, h, 2);
      c.fill();
    }
  },
  scroll: function (dy) {
    this.sc = Math.max(0, Math.min(this.scMax, this.sc + dy));
  },
  // ---------- 玩法大厅 ----------
  drawModes: function () {
    var c = UI.c,
      self = this,
      d = Save.d;
    UI.begin();
    this.sky(CFG.CHAPTERS[5]);
    this.topBar();
    UI.text('玩法大厅', 180, 78, 22, '#fff', { stroke: '#7a6cff', sw: 6 });
    var wk = CFG.weekNo(),
      em = CFG.ENDLESS_MODS[wk % CFG.ENDLESS_MODS.length]
        .map(function (k) {
          return CFG.MODS[k].name;
        })
        .join('·'),
      di = CFG.dailyInfo(),
      wi = CFG.weeklyInfo(),
      unl = !!d.stars['1-8'];
    var M = [
      [
        'endless',
        '无尽模式',
        '无限波次 · 法则抉择 · 本周词缀 ' + em,
        '最佳 ' + (d.best || 0) + ' 波',
        '#7a6cff',
        't_dragon_5A_0',
        unl,
        '通关 1-8 解锁'
      ],
      [
        'daily',
        '每日挑战',
        '今日词缀：' +
          di.mods
            .map(function (k) {
              return CFG.MODS[k].name;
            })
            .join(' + '),
        d.dailyDate == Save.today() ? '今日已完成' : '首胜 +30 钻石',
        '#5fcf6a',
        't_bunny_5A_0',
        !!d.stars['1-3'],
        '通关 1-3 解锁'
      ],
      [
        'exp',
        '远征冒险',
        '节点地图 · 事件 · 商店 · 遗物',
        '完成 ' + (d.stat.expDone || 0) + ' 次',
        '#ff8a4d',
        'h_captain_0',
        !!d.stars['1-6'],
        '通关 1-6 解锁'
      ],
      [
        'rush',
        '首领车轮战',
        '连续挑战 8 大首领',
        '最佳 ' + (d.stat.rushBest || 0) + ' 个',
        '#ff4d6d',
        'e_king_0',
        !!d.stars['2-1'],
        '通关 2-1 解锁'
      ],
      [
        'weekly',
        '周活动 · ' + wi.evName,
        '活动积分 ' + d.weekly.pts + ' · 20 波限时挑战',
        '积分领奖',
        '#ffb020',
        't_pig_5B_0',
        !!d.stars['1-4'],
        '通关 1-4 解锁'
      ]
    ];
    this.list(100, CFG.H - 82, M.length * 92 + 10, function (y0) {
      M.forEach(function (m, i) {
        var y = y0 + 8 + i * 92,
          on = m[6];
        c.fillStyle = on ? 'rgba(255,255,255,.93)' : 'rgba(230,230,240,.85)';
        rr(c, 16, y, 328, 84, 18);
        c.fill();
        c.strokeStyle = m[4];
        c.lineWidth = 3;
        c.stroke();
        c.fillStyle = shade(m[4], 0.75);
        rr(c, 22, y + 6, 72, 72, 14);
        c.fill();
        c.globalAlpha = on ? 1 : 0.4;
        Art.draw(c, m[5], 22, y + 4, 72, 74);
        c.globalAlpha = 1;
        UI.text(m[1], 104, y + 20, 16, shade(m[4], -0.3), { align: 'left', stroke: false });
        UI.plain(m[2], 104, y + 42, 9.5, '#8a6a7a', 'left');
        UI.plain(on ? m[3] : m[7], 104, y + 62, 10.5, on ? m[4] : '#a0a0b0', 'left');
        UI.button(
          'md' + m[0],
          262,
          y + 42,
          74,
          34,
          on ? '进入' : '未解锁',
          on ? m[4] : '#b8b8c4',
          function () {
            if (!on) {
              UI.toast(m[7], '#ffd6e0');
              return;
            }
            Sfx.play('click');
            Platform.vibrate(12);
            if (m[0] == 'endless') self.open('endless');
            else if (m[0] == 'daily') App.go('game', CFG.dailyInfo());
            else if (m[0] == 'exp') {
              if (Exp.active) self.go('exp');
              else Exp.start();
            } else if (m[0] == 'rush') App.go('game', CFG.bossRushInfo());
            else self.open('weekly');
          },
          { size: 13, allowDis: true }
        );
      });
    });
    this.nav('modes');
    this.overlays();
  },
  // ---------- 英雄 / 遗物 / 皮肤 ----------
  drawHero: function () {
    var c = UI.c,
      self = this,
      d = Save.d,
      t = UI.t;
    UI.begin();
    this.sky(CFG.CHAPTERS[1]);
    this.topBar();
    var h = CFG.HEROES[d.hero];
    c.fillStyle = 'rgba(255,255,255,.9)';
    rr(c, 16, 56, 328, 176, 20);
    c.fill();
    c.strokeStyle = h.color;
    c.lineWidth = 3;
    c.stroke();
    c.fillStyle = shade(h.color, 0.7);
    c.beginPath();
    c.ellipse(90, 212, 56, 12, 0, 0, 7);
    c.fill();
    Art.drawAt(c, 'h_' + d.hero + '_' + (Math.floor(t * 2) % 2), 90, 214 - Math.abs(Math.sin(t * 3)) * 5, 130);
    UI.text(h.name, 250, 80, 19, shade(h.color, -0.3), { stroke: false });
    c.fillStyle = h.rar == 'SSR' ? '#ffb020' : '#b46cff';
    rr(c, 300, 92, 36, 16, 8);
    c.fill();
    UI.plain(h.rar, 318, 100, 10, '#fff');
    UI.plain('被动：' + h.desc, 250, 112, 10.5, '#7a4a55');
    UI.plain('技能：' + h.skill, 250, 134, 12, h.color);
    UI.plain(h.sdesc, 250, 152, 10, '#8a6a7a');
    UI.plain('冷却 ' + h.cd + ' 秒', 250, 170, 10, '#a07080');
    UI.plain('遗物（最多 2 件）：', 250, 194, 10.5, '#7a4a55');
    for (var s = 0; s < 2; s++) {
      var r = d.equip[s];
      c.fillStyle = r ? '#fff0c8' : '#f0e6ea';
      rr(c, 196 + s * 58, 204, 52, 24, 10);
      c.fill();
      if (r) {
        Art.icon(c, CFG.RELICS[r].icon, 212 + s * 58, 216, 16);
        UI.plain(CFG.RELICS[r].name.slice(0, 2), 236 + s * 58, 216, 9, '#7a4a55');
      } else UI.plain('空', 222 + s * 58, 216, 10, '#b8a0a8');
    }
    var tabs = [
      ['h', '英雄'],
      ['r', '遗物'],
      ['s', '皮肤']
    ];
    this.htab = this.htab || 'h';
    tabs.forEach(function (tb, i) {
      UI.button(
        'ht' + tb[0],
        22 + i * 108,
        240,
        100,
        32,
        tb[1],
        self.htab == tb[0] ? '#ff8a4d' : '#d8b8c0',
        function () {
          self.htab = tb[0];
          self.sc = 0;
        },
        { size: 14, r: 14 }
      );
    });
    var T = this.htab;
    if (T == 'h') {
      var ks = Object.keys(CFG.HEROES);
      this.list(280, CFG.H - 82, Math.ceil(ks.length / 2) * 150, function (y0) {
        ks.forEach(function (k, i) {
          var H = CFG.HEROES[k],
            x = 18 + (i % 2) * 164,
            y = y0 + 6 + Math.floor(i / 2) * 150,
            own = d.heroes[k],
            on = d.hero == k;
          c.fillStyle = on ? '#fff6e0' : 'rgba(255,255,255,.9)';
          rr(c, x, y, 160, 142, 16);
          c.fill();
          c.strokeStyle = on ? '#ffb020' : H.color;
          c.lineWidth = on ? 4 : 2;
          c.stroke();
          c.globalAlpha = own ? 1 : 0.35;
          Art.draw(c, 'h_' + k + '_0', x + 30, y + 4, 100, 90);
          c.globalAlpha = 1;
          UI.text(H.name, x + 80, y + 100, 13, shade(H.color, -0.3), { stroke: false });
          UI.plain(H.skill, x + 80, y + 116, 10, '#8a6a7a');
          if (own)
            UI.hit('hp' + k, x, y, 160, 142, function () {
              d.hero = k;
              Save.save();
              Sfx.play('card');
              Platform.vibrate(14);
              UI.toast('出战：' + H.name, '#ffd23f');
            });
          else UI.plain('扭蛋获得', x + 80, y + 132, 10, '#ff6f9c');
          if (on) UI.plain('出战中', x + 80, y + 132, 10, '#ffb020');
        });
      });
    }
    if (T == 'r') {
      var rs = Object.keys(CFG.RELICS);
      this.list(280, CFG.H - 82, rs.length * 54, function (y0) {
        rs.forEach(function (k, i) {
          var R = CFG.RELICS[k],
            y = y0 + 4 + i * 54,
            own = d.relics[k],
            eq = d.equip.indexOf(k) >= 0;
          c.fillStyle = eq ? '#fff0c8' : 'rgba(255,255,255,.9)';
          rr(c, 18, y, 316, 48, 12);
          c.fill();
          c.fillStyle = own ? '#ffe0ea' : '#eee';
          c.beginPath();
          c.arc(44, y + 24, 18, 0, 7);
          c.fill();
          c.globalAlpha = own ? 1 : 0.35;
          Art.icon(c, R.icon, 44, y + 24, 22);
          c.globalAlpha = 1;
          UI.text(R.name, 70, y + 15, 13, '#6a3a4a', { align: 'left', stroke: false });
          c.fillStyle = { R: '#4fa8ff', SR: '#b46cff', SSR: '#ffb020' }[R.r];
          rr(c, 70 + R.name.length * 13 + 4, y + 8, 30, 14, 7);
          c.fill();
          UI.plain(R.r, 70 + R.name.length * 13 + 19, y + 15, 9, '#fff');
          UI.plain(R.desc, 70, y + 34, 10, '#a07080', 'left');
          if (own)
            UI.button(
              're' + k,
              262,
              y + 9,
              66,
              30,
              eq ? '卸下' : '装备',
              eq ? '#ff8fb1' : '#5fcf6a',
              function () {
                if (eq) d.equip.splice(d.equip.indexOf(k), 1);
                else {
                  if (d.equip.length >= 2) d.equip.shift();
                  d.equip.push(k);
                }
                Save.save();
                Sfx.play('card');
                Platform.vibrate(14);
              },
              { size: 12 }
            );
          else UI.plain('未拥有', 294, y + 24, 10, '#b8a0a8');
        });
      });
      if (
        !Object.keys(CFG.RELICS).some(function (k) {
          return d.relics[k];
        })
      )
        UI.plain('扭蛋可获得遗物，最多同时装备 2 件', 180, 560, 11, '#a07080');
    }
    if (T == 's') {
      var ss = Object.keys(CFG.SKINS);
      this.list(280, CFG.H - 82, ss.length * 112, function (y0) {
        ss.forEach(function (k, i) {
          var S = CFG.SKINS[k],
            y = y0 + 4 + i * 112,
            own = d.skins[k],
            on = d.skinOn[S.type] == k;
          c.fillStyle = 'rgba(255,255,255,.92)';
          rr(c, 18, y, 316, 104, 16);
          c.fill();
          if (on) {
            c.strokeStyle = '#ffb020';
            c.lineWidth = 3;
            c.stroke();
          }
          c.globalAlpha = own ? 1 : 0.4;
          Art.draw(c, 't_' + S.type + '_3_0', 24, y + 4, 90, 96);
          Art.draw(c, 's_' + k + '_3_0', 100, y + 4, 90, 96);
          c.globalAlpha = 1;
          UI.plain('→', 108, y + 52, 16, '#a07080');
          UI.text(S.name, 250, y + 26, 15, '#6a3a4a', { stroke: false });
          UI.plain(CFG.TOWERS[S.type].name + ' 皮肤 · ' + S.rar, 250, y + 46, 10, '#a07080');
          if (own)
            UI.button(
              'sk' + k,
              206,
              y + 60,
              88,
              32,
              on ? '使用中' : '使用',
              on ? '#ffb020' : '#5fcf6a',
              function () {
                if (on) delete d.skinOn[S.type];
                else d.skinOn[S.type] = k;
                Save.save();
                Sfx.play('card');
                Platform.vibrate(14);
              },
              { size: 13 }
            );
          else UI.plain(k == 'bear_panda' ? '通行证 30 级 / 扭蛋' : '扭蛋获得', 250, y + 76, 10, '#ff6f9c');
        });
      });
    }
    this.nav('hero');
    this.overlays();
  },
  // ---------- 扭蛋 ----------
  gres: null,
  drawGacha: function () {
    var c = UI.c,
      self = this,
      d = Save.d,
      t = UI.t,
      G = CFG.GACHA;
    UI.begin();
    this.sky(CFG.CHAPTERS[4]);
    this.topBar();
    UI.text('萌宠扭蛋机', 180, 82, 24, '#fff', { stroke: '#b46cff', sw: 7 });
    // 扭蛋机
    c.save();
    c.translate(180, 250);
    c.fillStyle = '#ff8fb1';
    rr(c, -80, 40, 160, 90, 22);
    c.fill();
    c.fillStyle = '#ff6f9c';
    rr(c, -30, 70, 60, 40, 12);
    c.fill();
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(0, 90, 12, 0, 7);
    c.fill();
    c.save();
    c.rotate(Math.sin(t * 2) * 0.2);
    c.fillStyle = '#d35b8a';
    c.fillRect(-3, 78, 6, 24);
    c.restore();
    c.fillStyle = 'rgba(220,240,255,.75)';
    c.beginPath();
    c.arc(0, -20, 90, 0, 7);
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 5;
    c.stroke();
    var cols = ['#ffd23f', '#8fd3ff', '#ff8fb1', '#b46cff', '#5fcf6a', '#ff9f43'];
    for (var i = 0; i < 14; i++) {
      var a = i * 2.1 + t * 0.3 * (i % 2 ? 1 : -1),
        r = 30 + ((i * 17) % 50);
      c.fillStyle = cols[i % 6];
      c.beginPath();
      c.arc(Math.cos(a) * r, -10 + Math.sin(a) * r * 0.7 + 20, 14, 0, 7);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)';
      c.beginPath();
      c.arc(Math.cos(a) * r - 4, -10 + Math.sin(a) * r * 0.7 + 16, 4, 0, 7);
      c.fill();
    }
    c.fillStyle = 'rgba(255,255,255,.5)';
    c.beginPath();
    c.ellipse(-40, -70, 22, 10, -0.6, 0, 7);
    c.fill();
    c.restore();
    var left = G.pity - d.pity;
    UI.panel(30, 392, 300, 60, {});
    UI.plain('再抽 ' + left + ' 次必出 SSR', 180, 410, 13, '#b46cff');
    UI.bar(60, 424, 240, 10, d.pity / G.pity, '#b46cff');
    UI.plain('SSR ' + G.rates.SSR * 100 + '%  SR ' + G.rates.SR * 100 + '%  十连必得 SR+', 180, 442, 10.5, '#a07080');
    UI.button(
      'g1',
      24,
      464,
      150,
      46,
      '',
      '#4fa8ff',
      function () {
        self.doPull(1);
      },
      { size: 14 }
    );
    UI.text('单抽', 99, 478, 14, '#fff', { stroke: false });
    Art.icon(c, 'ticket', 80, 498, 14);
    UI.plain('×' + G.cost1, 100, 498, 11, '#fff');
    UI.button(
      'g10',
      186,
      464,
      150,
      46,
      '',
      '#b46cff',
      function () {
        self.doPull(10);
      },
      { size: 14, pulse: d.tickets >= G.cost10, primary: true }
    );
    UI.text('十连抽', 261, 478, 14, '#fff', { stroke: false });
    Art.icon(c, 'ticket', 242, 498, 14);
    UI.plain('×' + G.cost10, 262, 498, 11, '#fff');
    UI.pill(130, 346, 100, 26, 'ticket', d.tickets);
    UI.button(
      'grate',
      110,
      514,
      140,
      32,
      '概率公示',
      '#c9a0e8',
      function () {
        self.popup = {
          title: '概率公示',
          border: '#b46cff',
          lines: Meta.rateLines(),
          btns: [{ t: '知道了', c: '#b46cff', f: function () {} }]
        };
      },
      { size: 11, r: 12 }
    );
    if ((d.tickets || 0) < 1)
      UI.button(
        'g2w',
        110,
        552,
        140,
        32,
        '去福利领券',
        '#ff9f43',
        function () {
          Sfx.play('click');
          Platform.vibrate(10);
          self.open('welfare');
        },
        { size: 12, r: 12, pulse: true, icon: 'ad' }
      );
    if (this.gres) this.drawGRes();
    this.nav('gacha');
    this.overlays();
  },
  doPull: function (n) {
    var self = this;
    if (this.pulling) return;
    this.pulling = true;
    Sfx.play('gacha');
    Platform.vibrate(15);
    Meta.pull(n, function (r, err) {
      self.pulling = false;
      if (!r) {
        UI.toast(err == 'net' ? '网络异常，已退还' : '扭蛋券不足，可在福利中心或签到获得', '#ffd6e0');
        return;
      }
      self.gres = { items: r, t: 0 };
      var ssr = r.some(function (x) {
        return x.rar == 'SSR';
      });
      Sfx.play(ssr ? 'legend' : 'card');
      Platform.vibrate(ssr ? 35 : 18);
    });
  },
  drawGRes: function () {
    var c = UI.c,
      self = this,
      R = this.gres;
    R.t += 1 / 60;
    UI.dim(0.9);
    UI.hit('gblk', 0, 0, 360, 640, function () {});
    UI.text('召唤结果', 180, 92, 22, '#fff', { stroke: '#b46cff', sw: 6 });
    var n = R.items.length;

    R.items.forEach(function (it, i) {
      var k = Math.max(0, Math.min(1, (R.t - i * 0.12) / 0.3));
      if (!k) return;
      var x = n == 1 ? 180 : 110 + (i % 2) * 140,
        y = n == 1 ? 300 : 146 + Math.floor(i / 2) * 80,
        s = Tween.E.outBack(k),
        col = { SSR: '#ffb020', SR: '#b46cff', R: '#4fa8ff', N: '#9fb3c8' }[it.rar];
      c.save();
      c.translate(x, y);
      c.scale(s * (n == 1 ? 1.6 : 1), s * (n == 1 ? 1.6 : 1));
      if (it.rar == 'SSR') {
        c.save();
        c.rotate(UI.t);
        c.fillStyle = 'rgba(255,210,60,.35)';
        for (var j = 0; j < 8; j++) {
          c.rotate(Math.PI / 4);
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(-10, -50);
          c.lineTo(10, -50);
          c.fill();
        }
        c.restore();
      }
      c.fillStyle = '#fff';
      rr(c, -62, -36, 124, 74, 14);
      c.fill();
      c.strokeStyle = col;
      c.lineWidth = 4;
      c.stroke();
      var im = Meta.itemImg(it.item);
      if (im) Art.draw(c, im, -60, -34, 56, 64);
      else Art.icon(c, it.item.relic ? CFG.RELICS[it.item.relic].icon : it.item.gems ? 'gem' : 'candy', -32, 0, 30);
      c.fillStyle = col;
      rr(c, 4, -30, 34, 15, 7);
      c.fill();
      UI.plain(it.rar, 21, -22, 9, '#fff');
      UI.plain(Meta.itemName(it.item), 30, 0, 10.5, '#6a3a4a');
      UI.plain(
        it.dup ? '重复·已转化' : it.item.hero ? '新英雄！' : it.item.skin ? '新皮肤！' : it.item.relic ? '遗物' : '',
        30,
        18,
        8.5,
        it.dup ? '#a07080' : '#ff6f9c'
      );
      c.restore();
    });
    UI.button(
      'gok',
      110,
      CFG.H - 118,
      140,
      40,
      '收下',
      '#5fcf6a',
      function () {
        self.gres = null;
      },
      { size: 15 }
    );
  },
  // ---------- 远征地图 ----------
  drawExp: function () {
    var c = UI.c,
      self = this,
      t = UI.t;
    UI.begin();
    this.sky(CFG.CHAPTERS[3]);
    if (Exp.result) {
      var r = Exp.result;
      UI.panel(30, 170, 300, 280, { title: r.win ? '远征成功！' : '远征结束', border: r.win ? '#ffb020' : '#9fb3c8' });
      Art.draw(c, r.win ? 'h_captain_a' : 'h_captain_0', 120, 196, 120, 110);
      UI.plain('糖果 +' + r.rw.candy + '   钻石 +' + r.rw.gems, 180, 330, 14, '#7a4a55');
      UI.button(
        'exok',
        90,
        380,
        180,
        42,
        '返回大厅',
        '#5fcf6a',
        function () {
          Exp.result = null;
          Sfx.play('coin');
          Platform.vibrate(18);
          self.go('modes');
        },
        { size: 15 }
      );
      UI.drawToasts(1 / 60);
      return;
    }
    var g = Exp.g;
    c.fillStyle = 'rgba(255,255,255,.9)';
    rr(c, -10, -10, 380, 60, 18);
    c.fill();
    UI.pill(8, 10, 100, 26, 'heart', g.hp + '/' + g.maxHp);
    UI.pill(114, 10, 90, 26, 'coin', g.gold);
    UI.text('远征 第 ' + (Exp.row + 2 > Exp.ROWS ? Exp.ROWS : Exp.row + 2) + ' 层', 290, 24, 14, '#ff8a4d', {
      stroke: false
    });
    // 节点连线
    var Y = function (r) {
      return 560 - r * 62;
    };
    c.lineWidth = 4;
    c.strokeStyle = 'rgba(255,255,255,.6)';
    Exp.map.forEach(function (row, r) {
      if (r == 0) return;
      row.forEach(function (nd, i) {
        Exp.map[r - 1].forEach(function (pn, j) {
          var a = Exp.map[r - 1].length,
            b = row.length;
          if (b == 1 || a == 1 || Math.abs(pn.x - nd.x) <= 120) {
            c.beginPath();
            c.moveTo(pn.x, Y(r - 1));
            c.lineTo(nd.x, Y(r));
            c.stroke();
          }
        });
      });
    });
    Exp.map.forEach(function (row, r) {
      row.forEach(function (nd, i) {
        var N = Exp.NODE[nd.type],
          can = Exp.canEnter(r, i) && !Exp.msg,
          here = r == Exp.row && i == Exp.col,
          y = Y(r),
          R = nd.type == 'boss' ? 26 : 19,
          bob = can ? Math.sin(t * 4 + i) * 3 : 0;
        c.fillStyle = 'rgba(0,0,0,.15)';
        c.beginPath();
        c.ellipse(nd.x, y + R, R, 5, 0, 0, 7);
        c.fill();
        c.fillStyle = nd.done && !here ? '#c8c0c8' : can ? N.col : shade(N.col, 0.45);
        c.beginPath();
        c.arc(nd.x, y + bob, R, 0, 7);
        c.fill();
        c.strokeStyle = can ? '#fff' : 'rgba(255,255,255,.6)';
        c.lineWidth = can ? 3.5 : 2;
        c.stroke();
        if (nd.type == 'boss') Art.drawAt(c, 'e_star_0', nd.x, y + 18 + bob, 48);
        else Art.icon(c, N.icon, nd.x, y + bob, 20);
        if (can) {
          UI.plain(N.name, nd.x, y + R + 10, 9.5, '#fff');
          UI.hit('xn' + r + '_' + i, nd.x - R - 4, y - R - 4, R * 2 + 8, R * 2 + 8, function () {
            Sfx.play('click');
            Exp.enter(r, i);
          });
        }
        if (here) Art.drawAt(c, 'h_' + Save.d.hero + '_0', nd.x, y - 10 - Math.abs(Math.sin(t * 5)) * 5, 40);
      });
    });
    // 阵容 & 遗物
    c.fillStyle = 'rgba(255,255,255,.88)';
    rr(c, 6, 582, 348, 52, 16);
    c.fill();
    g.towers.slice(0, 8).forEach(function (tw, i) {
      Art.tower(c, tw.type, tw.lv, 28 + i * 30, 626, 34, '0', tw.branch);
    });
    UI.plain('遗物 ' + g.relics.length, 320, 598, 10, '#7a4a55');
    UI.button(
      'exquit',
      286,
      602,
      64,
      30,
      '放弃',
      '#9fb3c8',
      function () {
        self.popup = {
          title: '放弃远征？',
          msg: '将按当前层数结算奖励',
          btns: [
            {
              t: '确认放弃',
              c: '#ff6f9c',
              f: function () {
                Exp.finish(false);
              }
            },
            { t: '继续冒险', c: '#5fcf6a', f: null }
          ]
        };
      },
      { size: 11, r: 10 }
    );
    if (g.relics.length) {
      g.relics.slice(-8).forEach(function (rl, i) {
        c.fillStyle = 'rgba(255,255,255,.85)';
        c.beginPath();
        c.arc(20 + i * 26, 68, 11, 0, 7);
        c.fill();
        Art.icon(c, CFG.RELICS[rl].icon, 20 + i * 26, 68, 15);
      });
    }
    UI.button(
      'exback',
      300,
      52,
      54,
      32,
      '大厅',
      '#8fd3ff',
      function () {
        Sfx.play('click');
        Platform.vibrate(10);
        self.go('modes');
      },
      { size: 11, r: 10 }
    );
    if (Exp.msg) {
      var m = Exp.msg;
      UI.dim(0.5);
      UI.hit('xblk', 0, 0, 360, 640, function () {});
      var h = 150 + m.btns.length * 44;
      UI.panel(30, 320 - h / 2, 300, h, { title: m.title, border: '#4fa8ff' });
      UI.text(m.text, 180, 320 - h / 2 + 56, 14, '#7a4a55', { stroke: false });
      if (m.sub) UI.plain(m.sub, 180, 320 - h / 2 + 80, 11, '#a07080');
      m.btns.forEach(function (b, i) {
        UI.button(
          'xb' + i,
          60,
          320 - h / 2 + 100 + i * 44,
          240,
          38,
          b.t,
          i == m.btns.length - 1 && m.btns.length > 1 ? '#9fb3c8' : '#ff9f43',
          function () {
            if (b.f) b.f();
            if (m.title != '旅行商人' || !b.f) {
              Exp.msg = null;
              Exp.persist();
            } else Exp.msg.text = '金币：' + Exp.g.gold;
            Sfx.play('card');
          },
          { size: 13 }
        );
      });
    }
    this.overlays();
  },
  // ---------- 面板 ----------
  drawPanel: function () {
    var self = this,
      c = UI.c,
      p = this.panel;
    this.pk = Math.min(1, this.pk + 1 / 60 / 0.25);
    var k = Tween.E.outBack(this.pk);
    UI.dim(0.55 * this.pk);
    UI.hit('blocker', 0, 0, CFG.W, CFG.H, function () {});
    c.save();
    c.translate(180, 330);
    c.scale(k, k);
    c.translate(-180, -330);
    var F = {
      sidebar: 'drawSidebar',
      talent: 'drawTalent',
      daily: 'drawDaily',
      welfare: 'drawWelfare',
      codex: 'drawCodex',
      pass: 'drawPass',
      ach: 'drawAch',
      mail: 'drawMail',
      lb: 'drawLB',
      endless: 'drawEndless',
      weekly: 'drawWeekly'
    }[p];
    if (F) this[F]();
    UI.button(
      'close',
      300,
      64,
      40,
      40,
      '×',
      '#ff6f9c',
      function () {
        self.panel = null;
        Sfx.play('click');
      },
      { size: 24, r: 20 }
    );
    c.restore();
  },
  // 抖音侧边栏复访奖励：从侧边栏进入游戏后可每日领取
  drawSidebar: function () {
    var c = UI.c,
      d = Save.d,
      self = this,
      got = d.sideDate == Save.today(),
      from = Platform.fromSidebar();
    UI.panel(30, 150, 300, 330, { title: '侧边栏奖励', border: '#ff4d6d' });
    Art.draw(c, 't_bunny_5A_h', 120, 176, 120, 110);
    UI.plain('从抖音「侧边栏」进入游戏', 180, 300, 13, '#7a4a55');
    UI.plain('每天可领取：30 钻石 + 100 糖果', 180, 322, 12, '#ff6f9c');
    c.fillStyle = '#fff4ec';
    rr(c, 50, 340, 260, 50, 12);
    c.fill();
    UI.plain('① 点击下方按钮打开侧边栏  ② 点击「软萌大作战」返回', 180, 358, 10.5, '#a07080');
    UI.plain('③ 回到这里领取奖励', 180, 376, 10.5, '#a07080');
    if (got) UI.button('sbok', 80, 404, 200, 42, '今日已领取', '#c8c0c8', function () {}, { size: 15, disabled: true });
    else if (from)
      UI.button(
        'sbget',
        80,
        404,
        200,
        42,
        '领取奖励',
        '#ff4d6d',
        function () {
          d.sideDate = Save.today();
          UI.toast('获得 ' + Meta.grant({ gems: 30, candy: 100 }), '#ffd23f');
          Sfx.play('legend');
          Platform.vibrate(25);
        },
        { size: 16, pulse: true }
      );
    else
      UI.button(
        'sbgo',
        80,
        404,
        200,
        42,
        '去侧边栏',
        '#ff9f43',
        function () {
          self.panel = null;
          Platform.sidebarGo();
        },
        { size: 16, pulse: true }
      );
  },
  drawPass: function () {
    var c = UI.c,
      d = Save.d,
      P = CFG.PASS,
      lv = Meta.passLv();
    UI.panel(16, 80, 328, 500, { title: '萌萌通行证', border: '#ffb020' });
    UI.plain('等级 ' + lv + ' / ' + P.max, 100, 116, 13, '#7a4a55');
    UI.bar(150, 110, 110, 10, (d.pass.xp % P.xpPer) / P.xpPer, '#ffb020');
    UI.plain('战斗获得经验', 300, 116, 10.5, '#a07080');
    UI.plain('免费奖励直接领取，加成奖励观看一次广告领取', 180, 148, 11, '#ff9f43');
    UI.plain('免费', 112, 180, 11, '#5fcf6a');
    UI.plain('加成', 246, 180, 11, '#ff9f43');
    this.list(190, 568, P.max * 50, function (y0) {
      for (var i = 0; i < P.max; i++) {
        (function (i) {
          var y = y0 + i * 50,
            ok = i < lv,
            rf = P.free(i),
            rp = P.bonus(i);
          c.fillStyle = ok ? '#fff6e0' : '#f4eef0';
          rr(c, 28, y + 2, 300, 44, 12);
          c.fill();
          c.fillStyle = ok ? '#ffb020' : '#c8b8c0';
          c.beginPath();
          c.arc(48, y + 24, 14, 0, 7);
          c.fill();
          UI.plain('' + (i + 1), 48, y + 24, 11, '#fff');
          [
            [rf, 'cf', 112, false],
            [rp, 'cp', 246, true]
          ].forEach(function (q) {
            var r = q[0],
              got = d.pass[q[1]][i],
              can = ok && !got;
            Art.icon(c, r.gems ? 'gem' : r.tickets ? 'ticket' : r.skin ? 'gift' : 'candy', q[2] - 30, y + 24, 18);
            UI.plain(
              r.skin ? '熊猫皮肤' : '' + (r.gems || r.tickets || r.candy),
              q[2] - 4,
              y + 24,
              10.5,
              '#7a4a55',
              'left'
            );
            if (got) UI.plain('已领', q[2] + 42, y + 24, 11, '#5fcf6a');
            else
              UI.button(
                'ps' + q[1] + i,
                q[2] + 18,
                y + 8,
                48,
                30,
                q[3] ? '广告' : '领取',
                can ? '#ff9f43' : '#c9b8c0',
                function () {
                  if (!can) return;
                  var give = function () {
                    d.pass[q[1]][i] = 1;
                    UI.toast('获得 ' + Meta.grant(r), '#ffd23f');
                    Sfx.play('coin');
                    Platform.vibrate(18);
                  };
                  if (q[3]) Platform.showRewardedAd('pass', give);
                  else give();
                },
                { size: 11, disabled: !can, r: 10, pulse: can }
              );
          });
        })(i);
      }
    });
  },
  drawAch: function () {
    var c = UI.c,
      d = Save.d;
    UI.panel(16, 80, 328, 500, { title: '成就', border: '#ff8a4d' });
    var A = CFG.ACHS.slice().sort(function (a, b) {
      var sa = Meta.achDone(a) && !d.achClaimed[a.id] ? 0 : d.achClaimed[a.id] ? 2 : 1,
        sb = Meta.achDone(b) && !d.achClaimed[b.id] ? 0 : d.achClaimed[b.id] ? 2 : 1;
      return sa - sb;
    });
    this.list(112, 568, A.length * 58, function (y0) {
      A.forEach(function (a, i) {
        var y = y0 + i * 58,
          v = Math.min(a.goal, d.stat[a.stat] || 0),
          done = v >= a.goal,
          cl = d.achClaimed[a.id];
        c.fillStyle = cl ? '#f0ecee' : '#fff4ec';
        rr(c, 28, y + 2, 300, 52, 12);
        c.fill();
        Art.icon(c, 'trophy', 50, y + 28, 24);
        UI.text(a.name, 72, y + 16, 13, cl ? '#b0a0a8' : '#6a3a4a', { align: 'left', stroke: false });
        UI.plain(a.desc, 72, y + 32, 10.5, '#a07080', 'left');
        UI.bar(72, y + 42, 140, 6, v / a.goal, '#ff8a4d');
        UI.button(
          'ac' + a.id,
          256,
          y + 14,
          64,
          28,
          cl ? '已领' : done ? (a.r.gems ? a.r.gems + '钻' : a.r.candy + '糖') : v + '/' + a.goal,
          cl ? '#c8c0c8' : done ? '#ff9f43' : '#c9b8c0',
          function () {
            if (cl || !done) return;
            d.achClaimed[a.id] = 1;
            UI.toast('获得 ' + Meta.grant(a.r), '#ffd23f');
            Sfx.play('legend');
            Platform.vibrate(28);
          },
          { size: 10.5, disabled: cl || !done, pulse: done && !cl, r: 10 }
        );
      });
    });
  },
  drawMail: function () {
    var c = UI.c,
      d = Save.d;
    UI.panel(16, 80, 328, 500, { title: '邮件 · 公告', border: '#4fa8ff' });
    this.list(112, 568, d.mail.length * 104, function (y0) {
      d.mail.forEach(function (m, i) {
        var M =
            CFG.INBOX_DEFAULT.filter(function (x) {
              return x.id == m.id;
            })[0] || m,
          y = y0 + i * 104;
        c.fillStyle = m.claimed ? '#f0f2f6' : '#f0f7ff';
        rr(c, 28, y + 2, 300, 98, 12);
        c.fill();
        Art.icon(c, 'mail', 50, y + 24, 22);
        UI.text(M.title, 70, y + 20, 13, '#4a6a8a', { align: 'left', stroke: false });
        UI.plain(M.body, 40, y + 46, 10, '#7a8aa0', 'left');
        var rs = Meta.itemName
          ? Object.keys(M.r || {})
              .map(function (k) {
                return { gems: '钻石', candy: '糖果', tickets: '扭蛋券' }[k] + '×' + M.r[k];
              })
              .join('  ')
          : '';
        UI.plain(rs, 40, y + 74, 10, '#ff6f9c', 'left');
        UI.button(
          'ml' + m.id,
          250,
          y + 62,
          70,
          30,
          m.claimed ? '已领取' : '领取',
          m.claimed ? '#c8c0c8' : '#4fa8ff',
          function () {
            if (m.claimed) return;
            m.claimed = true;
            m.read = true;
            UI.toast('获得 ' + Meta.grant(M.r), '#ffd23f');
            Sfx.play('coin');
            Platform.vibrate(18);
          },
          { size: 12, disabled: m.claimed, r: 10 }
        );
      });
    });
  },
  lbBoard: 'endless',
  drawLB: function () {
    var c = UI.c,
      self = this;
    UI.panel(16, 80, 328, 500, { title: '排行榜', border: '#ffb020' });
    var B = [
      ['endless', '无尽'],
      ['daily', '每日'],
      ['bossrush', '车轮战'],
      ['weekly', '周活动']
    ];
    B.forEach(function (b, i) {
      UI.button(
        'lbt' + b[0],
        28 + i * 76,
        110,
        70,
        28,
        b[1],
        self.lbBoard == b[0] ? '#ffb020' : '#d8c8b0',
        function () {
          self.lbBoard = b[0];
          self.lbData = null;
          self.sc = 0;
        },
        { size: 12, r: 12 }
      );
    });
    if (!this.lbData || this.lbData.b != this.lbBoard) {
      var bd = this.lbBoard;
      this.lbData = { b: bd, list: null };
      Platform.getLeaderboard(bd, function (l) {
        if (self.lbData && self.lbData.b == bd) self.lbData.list = l;
      });
    }
    var L = this.lbData.list;
    if (!L) {
      UI.plain('加载中…', 180, 300, 13, '#a07080');
      return;
    }
    this.list(148, 568, L.length * 40, function (y0) {
      L.forEach(function (e, i) {
        var y = y0 + i * 40,
          me = e.me;
        c.fillStyle = me ? '#fff0c8' : i % 2 ? '#fff8f0' : '#fff4ec';
        rr(c, 28, y + 2, 300, 36, 10);
        c.fill();
        if (i < 3) Art.icon(c, 'crown', 50, y + 20, 18);
        UI.text('' + (i + 1), i < 3 ? 50 : 50, y + 21, i < 3 ? 9 : 13, i < 3 ? '#fff' : '#a07080', { stroke: false });
        UI.plain(e.name, 80, y + 20, 12, me ? '#ff6f9c' : '#6a3a4a', 'left');
        UI.plain('' + e.score, 310, y + 20, 13, '#ff9f43', 'right');
      });
    });
    UI.plain('本周好友与同城榜（示意数据，正式上线接平台排行榜）', 180, 572, 10.5, '#a07080');
  },
  drawEndless: function () {
    var c = UI.c,
      d = Save.d,
      self = this,
      wk = CFG.weekNo(),
      mods = CFG.ENDLESS_MODS[wk % CFG.ENDLESS_MODS.length];
    UI.panel(16, 80, 328, 500, { title: '无尽模式', border: '#7a6cff' });
    UI.plain('最佳纪录：' + (d.best || 0) + ' 波', 180, 118, 14, '#7a6cff');
    UI.plain('本周词缀（每周轮换）', 180, 142, 11, '#a07080');
    mods.forEach(function (k, i) {
      var M = CFG.MODS[k];
      c.fillStyle = shade(M.color, 0.6);
      rr(c, 36 + i * 148, 154, 140, 42, 12);
      c.fill();
      UI.text(M.name, 106 + i * 148, 167, 13, shade(M.color, -0.4), { stroke: false });
      UI.plain(M.desc, 106 + i * 148, 185, 9.5, '#6a3a4a');
    });
    UI.plain('每 5 波首领 · 每 3 波精英 · 难度无限递增', 180, 212, 10, '#a07080');
    UI.plain('里程碑奖励（首次达成）', 180, 236, 12, '#7a6cff');
    CFG.ENDLESS_MILESTONES.forEach(function (m, i) {
      var y = 250 + i * 36,
        ok = (d.best || 0) >= m.w,
        cl = d.endlessMs[m.w];
      c.fillStyle = ok ? '#f0eaff' : '#f4f2f6';
      rr(c, 36, y, 288, 32, 10);
      c.fill();
      UI.plain('第 ' + m.w + ' 波', 80, y + 16, 12, '#6a3a4a');
      Art.icon(c, m.r.gems ? 'gem' : 'candy', 160, y + 16, 16);
      UI.plain('' + (m.r.gems || m.r.candy), 186, y + 16, 11, '#7a4a55');
      UI.button(
        'em' + m.w,
        250,
        y,
        64,
        32,
        cl ? '已领' : ok ? '领取' : '未达成',
        cl ? '#c8c0c8' : ok ? '#7a6cff' : '#c9b8c0',
        function () {
          if (cl || !ok) return;
          d.endlessMs[m.w] = 1;
          UI.toast('获得 ' + Meta.grant(m.r), '#ffd23f');
          Sfx.play('coin');
          Platform.vibrate(22);
        },
        { size: 11, disabled: cl || !ok, r: 10, pulse: ok && !cl }
      );
    });
    UI.button(
      'enlb',
      36,
      520,
      130,
      40,
      '排行榜',
      '#ffb020',
      function () {
        self.lbBoard = 'endless';
        self.lbData = null;
        self.open('lb');
      },
      { size: 14, icon: 'trophy' }
    );
    UI.button(
      'engo',
      176,
      520,
      148,
      40,
      '开始挑战',
      '#7a6cff',
      function () {
        Sfx.play('click');
        Platform.vibrate(16);
        App.go('game', CFG.endlessInfo());
      },
      { size: 15, pulse: true }
    );
  },
  drawWeekly: function () {
    var c = UI.c,
      d = Save.d,
      wi = CFG.weeklyInfo();
    UI.panel(16, 80, 328, 500, { title: '周活动 · ' + wi.evName, border: '#ffb020' });
    var left = Math.ceil((CFG.weekNo() + 1) * 7 - (Date.now() / 864e5 + 3));
    UI.plain(
      '剩余 ' + left + ' 天 · 关卡主题：' + CFG.CHAPTERS[CFG.weekNo() % 6].name.split('· ')[1],
      180,
      118,
      11,
      '#a07080'
    );
    Art.draw(c, 't_pig_5B_0', 120, 128, 120, 110);
    UI.plain('当前积分 ' + d.weekly.pts, 180, 252, 15, '#ff9f43');
    UI.plain('每波 +10 分 · 每个首领 +30 分', 180, 272, 10, '#a07080');
    CFG.WEEKLY_MILESTONES.forEach(function (m, i) {
      var y = 290 + i * 42,
        ok = d.weekly.pts >= m.p,
        cl = d.weekly.claimed[m.p];
      c.fillStyle = ok ? '#fff6e0' : '#f4f2f6';
      rr(c, 36, y, 288, 40, 10);
      c.fill();
      UI.plain(m.p + ' 分', 80, y + 20, 12, '#6a3a4a');
      Art.icon(c, m.r.gems ? 'gem' : 'candy', 160, y + 18, 16);
      UI.plain('' + (m.r.gems || m.r.candy), 186, y + 18, 11, '#7a4a55');
      UI.button(
        'wm' + m.p,
        250,
        y + 5,
        64,
        32,
        cl ? '已领' : ok ? '领取' : '未达成',
        cl ? '#c8c0c8' : ok ? '#ff9f43' : '#c9b8c0',
        function () {
          if (cl || !ok) return;
          d.weekly.claimed[m.p] = 1;
          UI.toast('获得 ' + Meta.grant(m.r), '#ffd23f');
          Sfx.play('coin');
          Platform.vibrate(22);
        },
        { size: 11, disabled: cl || !ok, r: 10, pulse: ok && !cl }
      );
    });
    UI.button(
      'wkgo',
      90,
      515,
      180,
      42,
      '开始活动关卡',
      '#ff9f43',
      function () {
        Sfx.play('click');
        Platform.vibrate(16);
        App.go('game', CFG.weeklyInfo());
      },
      { size: 15, pulse: true }
    );
  },
  drawCodex: function () {
    var c = UI.c,
      self = this,
      T = this.cxTab || 't';
    UI.panel(16, 80, 328, 500, { title: '萌宠图鉴', border: '#4fa8ff' });
    [
      ['t', '伙伴/编队'],
      ['f', '融合配方'],
      ['u', '究极神话']
    ].forEach(function (q, i) {
      UI.button(
        'cxt' + q[0],
        28 + i * 104,
        104,
        98,
        30,
        q[1],
        T == q[0] ? '#4fa8ff' : '#b8c8dc',
        function () {
          self.cxTab = q[0];
          self.sc = 0;
        },
        { size: 11.5, r: 12 }
      );
    });
    if (T == 't') {
      var team = Save.team();
      UI.plain('点击「出战」编入队伍（5 只，战斗中随机召唤）  已选 ' + team.length + '/5', 180, 140, 10.5, '#7a8aa0');
      this.list(150, 568, Math.ceil(CFG.TOWER_ORDER.length / 2) * 150, function (y0) {
        CFG.TOWER_ORDER.forEach(function (ty, i) {
          var D = CFG.TOWERS[ty],
            x = 26 + (i % 2) * 156,
            y = y0 + Math.floor(i / 2) * 150,
            un = Save.unlocked(ty) || D.gemSummon,
            lv = Save.d.codex[ty] || 0,
            inT = team.indexOf(ty) >= 0,
            rc = CFG.RAR_COL[D.rar];
          c.fillStyle = rc;
          rr(c, x, y, 150, 142, 14);
          c.fill();
          c.fillStyle = inT ? '#fffbe8' : '#f0f7ff';
          rr(c, x + 2.5, y + 2.5, 145, 137, 12);
          c.fill();
          c.fillStyle = rc;
          rr(c, x + 4, y + 4, 30, 15, 7);
          c.fill();
          UI.text(D.rar, x + 19, y + 11.5, 9, '#fff', { stroke: false });
          var show = Art.towerKey(ty, Math.max(1, lv), 'A') + '_0';
          c.globalAlpha = un ? 1 : 0.35;
          Art.draw(c, show, x + 2, y + 8, 64, 62);
          c.globalAlpha = 1;
          UI.text(D.name, x + 108, y + 16, 12, '#4a6a8a', { stroke: false });
          var words = D.desc
            .replace('【钻石】', '')
            .match(/.{1,7}/g)
            .slice(0, 3);
          words.forEach(function (w, j) {
            UI.plain(w, x + 108, y + 34 + j * 13, 9, '#7a8aa0');
          });
          UI.plain(
            un ? '最高 Lv' + lv : D.gacha ? '扭蛋获得' : D.gemSummon ? '战斗中钻石召唤' : '通关 ' + D.unlock + ' 解锁',
            x + 42,
            y + 80,
            9.5,
            un ? '#4a6a8a' : '#ff6f9c'
          );
          if (un && !D.gemSummon)
            UI.button(
              'tm' + ty,
              x + 86,
              y + 72,
              58,
              18,
              inT ? '已出战' : '出战',
              inT ? '#ff9f43' : '#b8c8dc',
              function () {
                var r = Save.toggleTeam(ty);
                if (r == 'full') UI.toast('队伍已满 5 只，先取消一只', '#ffd6e0');
                else if (r == 'min') UI.toast('至少保留 2 只', '#ffd6e0');
                Sfx.play('click');
              },
              { size: 9.5, r: 9 }
            );
          Meta.codexRewards(ty).forEach(function (r, j) {
            var bx = x + 6 + j * 48;
            UI.button(
              'cx' + ty + r.L,
              bx,
              y + 94,
              44,
              40,
              '',
              r.claimed ? '#c8c0c8' : r.ok ? '#4fa8ff' : '#d8d0e0',
              function () {
                if (!r.ok || r.claimed) return;
                Save.d.codexClaimed[ty + r.L] = 1;
                UI.toast('获得 ' + Meta.grant(r.r), '#ffd23f');
                Sfx.play('coin');
                Platform.vibrate(16);
              },
              { disabled: !r.ok || r.claimed, r: 10, pulse: r.ok && !r.claimed }
            );
            UI.plain('Lv' + r.L, bx + 22, y + 106, 9.5, '#fff');
            UI.plain(r.claimed ? '已领' : r.r.gems + '钻', bx + 22, y + 122, 9.5, '#fff');
          });
        });
      });
      return;
    }
    if (T == 'f') {
      var ks = Object.keys(CFG.FUSIONS),
        n = ks.filter(function (k) {
          return Meta.known('f_' + k);
        }).length;
      UI.plain('两只 Lv5 满级的不同伙伴拖到一起融合 · 已发现 ' + n + '/' + ks.length, 180, 140, 9.5, '#7a8aa0');
      this.list(150, 568, ks.length * 92, function (y0) {
        ks.forEach(function (k, i) {
          var F = CFG.FUSIONS[k],
            y = y0 + i * 92,
            kn = Meta.known('f_' + k);
          c.fillStyle = kn ? F.color : '#c8d0dc';
          rr(c, 26, y, 308, 86, 14);
          c.fill();
          c.fillStyle = kn ? '#fffdf8' : '#eef2f8';
          rr(c, 29, y + 3, 302, 80, 12);
          c.fill();
          Art.draw(c, Art.towerKey(F.a, 5, 'A') + '_0', 32, y + 10, 44, 48);
          UI.text('+', 84, y + 34, 16, '#ff6f9c', { stroke: '#fff' });
          Art.draw(c, Art.towerKey(F.b, 5, 'A') + '_0', 90, y + 10, 44, 48);
          UI.text('=', 142, y + 34, 16, '#ff6f9c', { stroke: '#fff' });
          if (kn) {
            Art.draw(c, 'f_' + k + '_1_0', 150, y + 4, 56, 58);
            UI.text(F.name, 268, y + 20, 14, shade(F.color, -0.35), { stroke: false });
            var ds = F.desc.match(/.{1,10}/g).slice(0, 2);
            ds.forEach(function (d, j) {
              UI.plain(d, 268, y + 42 + j * 14, 9.5, '#7a6070');
            });
          } else {
            c.globalAlpha = 0.16;
            Art.draw(c, 'f_' + k + '_1_0', 150, y + 4, 56, 58);
            c.globalAlpha = 0.18;
            c.globalAlpha = 1;
            UI.text('???', 178, y + 34, 16, '#fff', { stroke: '#8a94b8' });
            UI.text('未发现的融合', 268, y + 26, 13, '#8a94b8', { stroke: false });
            UI.plain(
              CFG.TOWERS[F.a].name.slice(0, 2) + ' × ' + CFG.TOWERS[F.b].name.slice(0, 2),
              268,
              y + 48,
              10,
              '#a0a8c0'
            );
          }
          UI.plain('融合 Lv1-3', 70, y + 72, 9, '#a07080');
        });
      });
      return;
    }
    var us = Object.keys(CFG.ULTIMATES);
    UI.plain('两只 融合Lv2+ 伙伴再融合 → 神话究极伙伴', 180, 140, 9.5, '#7a8aa0');
    this.list(150, 568, us.length * 120, function (y0) {
      us.forEach(function (k, i) {
        var U = CFG.ULTIMATES[k],
          y = y0 + i * 120,
          kn = Meta.known('u_' + k),
          ka = Meta.known('f_' + U.a),
          kb = Meta.known('f_' + U.b);
        var gg = c.createLinearGradient(26, 0, 334, 0);
        VFX.RB.forEach(function (cc, j) {
          gg.addColorStop(j / 6, cc);
        });
        c.fillStyle = kn ? gg : '#c8d0dc';
        rr(c, 26, y, 308, 112, 16);
        c.fill();
        c.fillStyle = kn ? '#fffbf0' : '#eef2f8';
        rr(c, 29.5, y + 3.5, 301, 105, 13);
        c.fill();
        Art.draw(c, 'f_' + U.a + '_3_0', 34, y + 20, 52, 56);
        UI.plain(ka ? CFG.FUSIONS[U.a].name : '???', 60, y + 90, 9, '#7a6070');
        UI.text('+', 94, y + 48, 16, '#ff6f9c', { stroke: '#fff' });
        Art.draw(c, 'f_' + U.b + '_3_0', 102, y + 20, 52, 56);
        UI.plain(kb ? CFG.FUSIONS[U.b].name : '???', 128, y + 90, 9, '#7a6070');
        UI.text('=', 162, y + 48, 16, '#ff6f9c', { stroke: '#fff' });
        if (kn) {
          VFX.glow(c, 206, y + 52, 40, VFX.rainbow(i * 50), 0.5);
          Art.draw(c, 'u_' + k + '_0', 172, y + 8, 70, 76);
          UI.text(U.name, 286, y + 26, 14, '#8a3ab8', { stroke: false });
          var ds = U.desc.match(/.{1,8}/g).slice(0, 3);
          ds.forEach(function (d, j) {
            UI.plain(d, 286, y + 48 + j * 14, 9.5, '#7a6070');
          });
        } else {
          c.save();
          c.globalAlpha = 0.14;
          Art.draw(c, 'u_' + k + '_0', 172, y + 8, 70, 76);
          c.restore();
          UI.text('???', 207, y + 48, 18, '#fff', { stroke: '#8a94b8' });
          UI.text('神话 · 未解锁', 286, y + 40, 12, '#8a94b8', { stroke: false });
        }
      });
    });
  },
  down: function (x, y) {
    this.dragY = y;
    this.dragSc = this.sc;
    this.moved = false;
  },
  move: function (x, y) {
    if (this.dragY == null) return false;
    var dy = y - this.dragY;
    if (Math.abs(dy) > 8) this.moved = true;
    if (this.moved && this.scMax > 0) {
      this.sc = Math.max(0, Math.min(this.scMax, this.dragSc - dy));
      return true;
    }
    return false;
  },
  up: function () {
    var m = this.moved;
    this.dragY = null;
    this.moved = false;
    return m;
  }
};


// ---- src/core/expedition.js ----
/**
 * 软萌大作战 V1.0
 * 远征（肉鸽节点地图）：战斗 / 精英 / 事件 / 商店 / 休息 / 宝箱 / 首领
 *
 * © 2026 <著作权人>
 */
var Exp = {
  active: false,
  g: null,
  map: [],
  row: -1,
  col: -1,
  msg: null,
  NODE: {
    battle: { name: '战斗', icon: 'sword', col: '#ff8fb1' },
    elite: { name: '精英', icon: 'crown', col: '#b46cff' },
    event: { name: '奇遇', icon: 'eye', col: '#4fa8ff' },
    shop: { name: '商店', icon: 'bag', col: '#ff9f43' },
    rest: { name: '营地', icon: 'heart', col: '#5fcf6a' },
    treasure: { name: '宝箱', icon: 'gift', col: '#ffb020' },
    boss: { name: '首领', icon: 'crown', col: '#ff4d6d' }
  },
  ROWS: 9,
  // ---- 存档：进入节点前 / 战斗结算后 / 切后台时保存，重新打开游戏可继续 ----
  persist: function () {
    if (!this.active || !this.g) {
      Storage.set('exp', null);
      return;
    }
    var g = this.g;
    Storage.set('exp', {
      v: 1,
      map: this.map,
      row: this.row,
      col: this.col,
      gold: g.gold,
      hp: g.hp,
      maxHp: g.maxHp,
      wave: g.wave,
      relics: g.relics.slice(),
      taken: g.taken,
      tags: g.tags,
      hero: g.heroId,
      towers: g.towers.map(function (t) {
        return [t.type, t.lv, t.c, t.r, t.branch || null];
      }),
      t: Date.now()
    });
  },
  restore: function () {
    var d = Storage.get('exp', null);
    if (!d || d.v != 1) return false;
    var g = new Game(
      { id: 'exp', mode: 'exp', waves: 0, diff: 0.8, paths: 'classic', theme: 'grass', mods: [] },
      { relics: d.relics.slice(), hero: d.hero }
    );
    for (var id in d.taken) {
      var u = UPGRADES.filter(function (x) {
        return x.id == id;
      })[0];
      if (u) for (var k = 0; k < d.taken[id]; k++) u.apply(g);
    }
    g.taken = d.taken;
    g.tags = d.tags;
    g.towers = [];
    d.towers.forEach(function (a) {
      g.addTower(a[0], a[1], [a[2], a[3]], a[4]);
    });
    g.gold = d.gold;
    g.hp = d.hp;
    g.maxHp = d.maxHp;
    g.wave = d.wave;
    g.state = 'prep';
    this.g = g;
    this.map = d.map;
    this.row = d.row;
    this.col = d.col;
    this.active = true;
    this.msg = null;
    this.result = null;
    return true;
  },
  start: function () {
    if (this.restore()) {
      UI.toast('已恢复上次的远征进度', '#ffd6e0');
      App.go('exp');
      return;
    }
    this.active = true;
    this.row = -1;
    this.col = -1;
    this.msg = null;
    this.g = new Game({ id: 'exp', mode: 'exp', waves: 0, diff: 0.8, paths: 'classic', theme: 'grass', mods: [] }, {});
    this.g.gold += 60;
    this.map = [];
    for (var r = 0; r < this.ROWS; r++) {
      var n = r == this.ROWS - 1 ? 1 : r == 0 ? 2 : 3,
        row = [];
      for (var i = 0; i < n; i++) {
        var t = 'battle';
        if (r == this.ROWS - 1) t = 'boss';
        else if (r == 3 || r == 6) t = 'treasure';
        else if (r > 0) {
          var x = Math.random();
          t = x < 0.38 ? 'battle' : x < 0.58 ? 'event' : x < 0.72 ? 'shop' : x < 0.86 ? 'elite' : 'rest';
        }
        row.push({ type: t, x: n == 1 ? 180 : n == 2 ? 110 + i * 140 : 70 + i * 110, done: false });
      }
      this.map.push(row);
    }
    this.persist();
    App.go('exp');
  },
  canEnter: function (r, i) {
    if (r != this.row + 1) return false;
    if (this.row < 0) return true;
    var a = this.map[this.row].length,
      b = this.map[r].length,
      from = this.col;
    if (b == 1 || a == 1) return true;
    var fx = this.map[this.row][from].x,
      tx = this.map[r][i].x;
    return Math.abs(fx - tx) <= 120;
  },
  enter: function (r, i) {
    var node = this.map[r][i],
      self = this,
      g = this.g;
    this.persist();
    this.row = r;
    this.col = i;
    node.done = true;
    var ch = CFG.CHAPTERS[Math.min(5, Math.floor((r * 6) / this.ROWS))];
    if (node.type == 'battle' || node.type == 'elite' || node.type == 'boss') {
      var L = {
        id: 'exp',
        mode: 'exp',
        waves: g.wave + (node.type == 'boss' ? 4 : 3),
        diff: 0.75 + r * 0.14 + (node.type == 'elite' ? 0.25 : 0),
        paths: ch.paths,
        theme: ch.theme,
        mix: ch.mix,
        mech: null,
        mods: [],
        eliteNode: node.type == 'elite',
        bossNode: node.type == 'boss'
      };
      this.cur = node;
      App.scene = 'game';
      GS.start(L, g);
      return;
    }
    if (node.type == 'treasure') {
      var rl = this.randomRelic();
      this.addRelic(rl);
      if (typeof Sfx != 'undefined') {
        Sfx.play('legend');
        Platform.vibrate(22);
      }
      this.msg = {
        title: '宝箱',
        text: '获得遗物：' + CFG.RELICS[rl].name,
        sub: CFG.RELICS[rl].desc,
        btns: [{ t: '继续', f: null }]
      };
    }
    if (node.type == 'rest')
      this.msg = {
        title: '营地篝火',
        text: '在温暖的篝火旁休息一下吧',
        btns: [
          {
            t: '回复 40% 生命',
            f: function () {
              g.hp = Math.min(g.maxHp, g.hp + Math.ceil(g.maxHp * 0.4));
              UI.toast('休息得好舒服', '#5fcf6a');
            }
          },
          {
            t: '随机伙伴 +1 级',
            f: function () {
              var t = g.towers[Math.floor(Math.random() * g.towers.length)];
              if (t && t.lv < CFG.MAX_LV && !CFG.TOWERS[t.type].parts) {
                t.lv++;
                if (t.lv == 6) t.branch = 'A';
              }
            }
          },
          {
            t: '烤棉花糖（+40 金，生命上限 +2）',
            f: function () {
              g.gold += 40;
              g.maxHp += 2;
              g.hp += 2;
              UI.toast('真甜', '#ffd23f');
            }
          }
        ]
      };
    if (node.type == 'shop') {
      var items = [this.randomRelic(), this.randomRelic()];
      this.msg = {
        title: '旅行商人',
        text: '金币：' + g.gold,
        btns: items
          .map(function (rl, k) {
            var price = 80 + k * 30;
            return {
              t: CFG.RELICS[rl].name + '  ' + price + '金',
              f: function () {
                if (g.gold >= price) {
                  g.gold -= price;
                  self.addRelic(rl);
                  UI.toast('获得 ' + CFG.RELICS[rl].name, '#ffd23f');
                } else UI.toast('金币不足', '#ffd6e0');
              }
            };
          })
          .concat([
            {
              t: '修城堡 +6 (40金)',
              f: function () {
                if (g.gold >= 40) {
                  g.gold -= 40;
                  g.hp = Math.min(g.maxHp, g.hp + 6);
                  UI.toast('城堡修好了', '#5fcf6a');
                } else UI.toast('金币不足', '#ffd6e0');
              }
            },
            {
              t: '换一批货 (20金)',
              f: function () {
                if (g.gold < 20) {
                  UI.toast('金币不足', '#ffd6e0');
                  return;
                }
                g.gold -= 20;
                var items2 = [self.randomRelic(), self.randomRelic()];
                self.msg = {
                  title: '旅行商人',
                  text: '金币：' + g.gold,
                  btns: items2
                    .map(function (rl, k) {
                      var price = 80 + k * 30;
                      return {
                        t: CFG.RELICS[rl].name + '  ' + price + '金',
                        f: function () {
                          if (g.gold >= price) {
                            g.gold -= price;
                            self.addRelic(rl);
                            UI.toast('获得 ' + CFG.RELICS[rl].name, '#ffd23f');
                          } else UI.toast('金币不足', '#ffd6e0');
                        }
                      };
                    })
                    .concat([{ t: '离开', f: null }])
                };
                self.msg.text = '金币：' + g.gold;
              }
            },
            { t: '离开', f: null }
          ])
      };
    }
    if (node.type == 'event') {
      var EV = [
        {
          title: '迷路的小猫',
          text: '一只小猫想加入队伍',
          btns: [
            {
              t: '收留它 (Lv2 喵喵)',
              f: function () {
                var f = g.freeCells();
                if (f.length) g.addTower('cat', 2, f[0]);
              }
            },
            {
              t: '给它小鱼干 (+50金)',
              f: function () {
                g.gold += 50;
              }
            }
          ]
        },
        {
          title: '许愿池',
          text: '投入硬币，许个愿望吧',
          btns: [
            {
              t: '城堡 -5，随机2只伙伴+1级',
              f: function () {
                g.hp = Math.max(1, g.hp - 5);
                for (var k = 0; k < 2; k++) {
                  var t = g.towers[Math.floor(Math.random() * g.towers.length)];
                  if (t && t.lv < CFG.MAX_LV && !CFG.TOWERS[t.type].parts) {
                    t.lv++;
                    if (t.lv == 6) t.branch = 'B';
                  }
                }
              }
            },
            { t: '离开', f: null }
          ]
        },
        {
          title: '神秘商人',
          text: '"60 金币，换一件神秘宝物？"',
          btns: [
            {
              t: '交易',
              f: function () {
                if (g.gold >= 60) {
                  g.gold -= 60;
                  self.addRelic(self.randomRelic());
                }
              }
            },
            { t: '拒绝', f: null }
          ]
        },
        {
          title: '温泉',
          text: '泡个温泉放松一下',
          btns: [
            {
              t: '回复 8 生命',
              f: function () {
                g.hp = Math.min(g.maxHp, g.hp + 8);
              }
            },
            {
              t: '生命上限 +4',
              f: function () {
                g.maxHp += 4;
                g.hp += 4;
              }
            }
          ]
        },
        {
          title: '魔法书',
          text: '书页上写着奇怪的咒语',
          btns: [
            {
              t: '阅读（随机强化卡）',
              f: function () {
                var u = rollUpgrades(g, 1)[0];
                if (u) {
                  g.pick(u);
                  g.state = 'prep';
                  UI.toast('获得 ' + u.name, '#b46cff');
                }
              }
            },
            { t: '合上', f: null }
          ]
        },
        {
          title: '岔路石碑',
          text: '石碑上刻着两种祝福，选一个',
          btns: [
            {
              t: '攻速祝福（全体攻速 +8%）',
              f: function () {
                g.m.rate *= 1.08;
                UI.toast('攻速提升', '#8fd3ff');
              }
            },
            {
              t: '暴击祝福（暴击 +6%）',
              f: function () {
                g.m.crit = (g.m.crit || 0) + 0.06;
                UI.toast('暴击提升', '#ffd23f');
              }
            }
          ]
        },
        {
          title: '流浪维修匠',
          text: '他可以加固城堡，或改造一只伙伴',
          btns: [
            {
              t: '加固城堡（生命上限 +6）',
              f: function () {
                g.maxHp += 6;
                g.hp += 6;
              }
            },
            {
              t: '改造（随机一只 +2 级）',
              f: function () {
                var pool = g.towers.filter(function (t) {
                  return !CFG.TOWERS[t.type].parts && t.lv < CFG.MAX_LV;
                });
                if (!pool.length) {
                  UI.toast('没有可改造的伙伴', '#ffd6e0');
                  return;
                }
                var t = pool[Math.floor(Math.random() * pool.length)];
                t.lv = Math.min(CFG.MAX_LV, t.lv + 2);
                if (t.lv >= CFG.BRANCH_LV && !t.branch) t.branch = Math.random() < 0.5 ? 'A' : 'B';
                UI.toast(CFG.TOWERS[t.type].name + ' → Lv' + t.lv, '#ffd23f');
              }
            }
          ]
        },
        {
          title: '星空许愿',
          text: '流星划过，许下三个愿望中的一个',
          btns: [
            {
              t: '伙伴全体攻速 +6%',
              f: function () {
                g.m.rate *= 1.06;
                UI.toast('攻速提升', '#8fd3ff');
              }
            },
            {
              t: '立即 +70 金币',
              f: function () {
                g.gold += 70;
              }
            },
            {
              t: '随机遗物',
              f: function () {
                self.addRelic(self.randomRelic());
              }
            }
          ]
        },
        {
          title: '荆棘试炼',
          text: '穿过荆棘丛可获得力量，但会受伤',
          btns: [
            {
              t: '硬闯（-4 生命，全体伤害 +12%）',
              f: function () {
                g.hp = Math.max(1, g.hp - 4);
                g.m.dmg *= 1.12;
                UI.toast('力量提升', '#ff8fb1');
              }
            },
            {
              t: '绕路（+30 金币）',
              f: function () {
                g.gold += 30;
              }
            }
          ]
        },
        {
          title: '古树低语',
          text: '古树愿意分享自然之力',
          btns: [
            {
              t: '自然庇护（生命上限 +5，每波回 2）',
              f: function () {
                g.maxHp += 5;
                g.hp += 5;
                g.m.waveHeal = (g.m.waveHeal || 0) + 2;
              }
            },
            {
              t: '藤蔓缠绕（减速 +15%）',
              f: function () {
                g.m.slowAdd += 0.15;
                UI.toast('藤蔓缠绕', '#7ed98a');
              }
            }
          ]
        },
        {
          title: '决斗擂台',
          text: '击败幻影首领可获厚礼，失败则扣血',
          btns: [
            {
              t: '应战（50%：+100金+遗物 / 否则 -6 生命）',
              f: function () {
                if (Math.random() < 0.5) {
                  g.gold += 100;
                  self.addRelic(self.randomRelic());
                  UI.toast('决斗胜利', '#ffd23f');
                } else {
                  g.hp = Math.max(1, g.hp - 6);
                  UI.toast('决斗惜败', '#ff8fb1');
                }
              }
            },
            { t: '放弃', f: null }
          ]
        }
      ];
      this.msg = EV[Math.floor(Math.random() * EV.length)];
    }
    if (!this.msg) this.persist();
    Save.save();
  },
  randomRelic: function () {
    var ks = Object.keys(CFG.RELICS).filter(function (k) {
      return Exp.g.relics.indexOf(k) < 0;
    });
    return ks[Math.floor(Math.random() * ks.length)] || 'clover';
  },
  addRelic: function (rl) {
    this.g.relics.push(rl);
    CFG.RELICS[rl].fn(this.g);
    if (!this.msg) this.persist();
  },
  onBattleEnd: function (win) {
    var g = this.g;
    if (!win) {
      this.finish(false);
      return;
    }
    g.state = 'prep';
    if (this.cur && this.cur.type == 'elite') {
      var rl = this.randomRelic();
      this.addRelic(rl);
      this.msg = {
        title: '精英战利品',
        text: '获得遗物：' + CFG.RELICS[rl].name,
        sub: CFG.RELICS[rl].desc,
        btns: [{ t: '收下', f: null }]
      };
    }
    if (this.cur && this.cur.type == 'boss') {
      this.finish(true);
      return;
    }
    this.persist();
    App.go('exp');
  },
  finish: function (win) {
    var r = this.row + 1,
      rw = { candy: r * 28 + (win ? 220 : 0), gems: r * 5 + (win ? 90 : 0), tickets: win ? 1 : 0 };
    Save.add(rw);
    if (win) Meta.stat('expDone', 1);
    Meta.afterBattle(this.g, { mode: 'exp' });
    this.active = false;
    Storage.set('exp', null);
    this.result = { win: win, rw: rw };
    App.go('exp');
  }
};


Art.base='art/';Art.pageBase=["art/","art/","art/","art/","art/","art/","art/","art2/","art2/","art2/","art2/"];var ART_SUBS=["art","art2"];

// ---- src/main.js ----
/**
 * 软萌大作战 V1.2
 * 入口：场景管理 / 输入 / 主循环
 *
 * © 2026 <著作权人>
 */
var App = {
  scene: 'title',
  go: function (s, arg) {
    if (s != this.scene) this.trans = 1;
    this.scene = s;
    Platform.setBanner(s == 'map' || s == 'modes' || s == 'hero' || s == 'gacha');
    // BGM 热切换：战斗用激昂旋律，其余用菜单旋律
    if (typeof Sfx != 'undefined') Sfx.bgm(s == 'game' ? 'battle' : 'menu');
    if (s == 'game') GS.start(arg);
    if (s == 'map' || s == 'modes' || s == 'exp') {
      Menu.panel = null;
      Menu.sc = 0;
    }
    if (s == 'map') {
      if (!this.welcomed) {
        this.welcomed = true;
        this.welcome();
      }
    }
  },
  welcome: function () {
    var off = this.offline;
    if (!off || !off.candy) return;
    var lines = ['离线约 ' + off.h + ' 小时', '基础收益：' + off.candy + ' 糖果'];
    if (off.gems) lines.push('+' + off.gems + ' 钻石');
    if (off.tickets) lines.push('+' + off.tickets + ' 扭蛋券');
    lines.push('看广告可双倍糖果与钻石');
    Menu.popup = {
      title: '挂机收益',
      border: '#ffb020',
      lines: lines,
      btns: [
        {
          t: '看广告 双倍领取',
          c: '#ff9f43',
          icon: 'ad',
          f: function () {
            Platform.showRewardedAd('offline', function () {
              var r = { candy: off.candy * 2 };
              if (off.gems) r.gems = off.gems * 2;
              if (off.tickets) r.tickets = off.tickets;
              UI.toast('获得 ' + Meta.grant(r), '#ffd23f');
              Sfx.play('legend');
              Platform.vibrate(25);
              Save.d.lastSeen = Date.now();
              Save.save();
              App.offline = null;
            });
          }
        },
        {
          t: '直接领取',
          c: '#5fcf6a',
          f: function () {
            var r = { candy: off.candy };
            if (off.gems) r.gems = off.gems;
            if (off.tickets) r.tickets = off.tickets;
            UI.toast('获得 ' + Meta.grant(r), '#ffd23f');
            Sfx.play('coin');
            Platform.vibrate(15);
            Save.d.lastSeen = Date.now();
            Save.save();
            App.offline = null;
          }
        }
      ]
    };
  },
  calcOffline: function () {
    var last = Save.d.lastSeen,
      O = CFG.OFFLINE;
    if (!last || !O) return null;
    var h = Math.min(O.maxH, (Date.now() - last) / 3600000);
    if (h < 0.05) return null;
    var mul = 1 + Save.tl('offline') * 0.25,
      r = {
        candy: Math.max(1, Math.round(O.candyPerH * h * mul)),
        gems: Math.round(O.gemsPerH * h * mul),
        tickets: Math.floor(O.ticketsPerH * h * mul),
        h: Math.round(h * 10) / 10
      };
    if (!r.gems) delete r.gems;
    if (!r.tickets) delete r.tickets;
    return r;
  },
  view: { scale: 1, ox: 0, oy: 0, sw: 360, sh: 640, dpr: 1 },
  bandCols: function () {
    var s = this.scene;
    if (s == 'game' && GS.level) {
      var ch =
        CFG.CHAPTERS.filter(function (c) {
          return c.theme == GS.level.theme;
        })[0] || CFG.CHAPTERS[0];
      return [ch.sky[0], '#fbe3cf'];
    }
    if (s == 'map') {
      var c = CFG.CHAPTERS[Menu.chapter - 1];
      return [c.sky[0], c.sky[3]];
    }
    if (s == 'modes') return [CFG.CHAPTERS[5].sky[0], CFG.CHAPTERS[5].sky[3]];
    if (s == 'hero') return [CFG.CHAPTERS[1].sky[0], CFG.CHAPTERS[1].sky[3]];
    if (s == 'gacha') return [CFG.CHAPTERS[4].sky[0], CFG.CHAPTERS[4].sky[3]];
    if (s == 'exp') return [CFG.CHAPTERS[3].sky[0], CFG.CHAPTERS[3].sky[3]];
    return ['#ffd6e8', '#c9f0d4'];
  },
  // 画面外区域：延展背景色 + 柔和圆点纹理，避免黑边/空白
  drawBands: function () {
    var V = this.view,
      c = UI.c;
    if (V.ox < 0.5 && V.oy < 0.5 && V.ox + CFG.W * V.scale > V.sw - 0.5 && V.oy + CFG.H * V.scale > V.sh - 0.5) return;
    var col = this.bandCols();
    c.save();
    c.setTransform(V.dpr, 0, 0, V.dpr, 0, 0);
    var g = c.createLinearGradient(0, 0, 0, V.sh);
    g.addColorStop(0, col[0]);
    g.addColorStop(1, col[1]);
    c.fillStyle = g;
    c.fillRect(0, 0, V.sw, V.sh);
    c.fillStyle = 'rgba(255,255,255,.25)';
    for (var y = 10; y < V.sh; y += 28)
      for (var x = ((y / 28) % 2) * 14; x < V.sw; x += 28) {
        c.beginPath();
        c.arc(x, y, 3, 0, 7);
        c.fill();
      }
    c.shadowColor = 'rgba(120,60,90,.25)';
    c.shadowBlur = 18;
    c.fillStyle = col[0];
    c.fillRect(V.ox, V.oy, CFG.W * V.scale, CFG.H * V.scale);
    c.restore();
    c.save();
    c.beginPath();
    c.rect(0, 0, CFG.W, CFG.H);
    c.clip();
    this._clip = true;
  },
  frame: function (dt) {
    UI.t += dt;
    Tween.update(dt);
    this._clip = false;
    this.drawBands();
    this._frame(dt);
    this.drawTrans(dt);
    if (this._clip) UI.c.restore();
  },
  /** 场景切换过渡：圆形遮罩从中心张开（0.32 秒），不阻塞输入 */
  trans: 0,
  drawTrans: function (dt) {
    if (this.trans <= 0) return;
    this.trans = Math.max(0, this.trans - dt / 0.32);
    var c = UI.c,
      k = 1 - this.trans,
      r = Tween.E.outBack ? 760 * k * k : 760 * k;
    c.save();
    c.fillStyle = '#ff9fbf';
    c.beginPath();
    c.rect(-200, -200, CFG.W + 400, CFG.H + 400);
    c.arc(CFG.W / 2, CFG.H / 2, Math.max(0.1, r), 0, Math.PI * 2, true);
    c.fill('evenodd');
    c.restore();
  },
  _frame: function (dt) {
    if (this.scene == 'game') {
      GS.update(dt);
      GS.draw();
    } else if (this.scene == 'map') Menu.drawMap();
    else if (this.scene == 'modes') Menu.drawModes();
    else if (this.scene == 'hero') Menu.drawHero();
    else if (this.scene == 'gacha') Menu.drawGacha();
    else if (this.scene == 'exp') Menu.drawExp();
    else Menu.drawTitle();
  }
};
(function () {
  var cv = document.getElementById('c'),
    ctx = cv.getContext('2d'),
    scale = 1;
  UI.c = ctx;
  Save.load();
  Meta.init();
  Sfx.muted = !!Save.d.mute;
  App.offline = App.calcOffline();
  if (!App.offline) {
    Save.d.lastSeen = Date.now();
    Save.save();
  }
  function resize() {
    // 中低端机限制超高 DPR，减少填充压力
    var dpr = Math.min(2.5, window.devicePixelRatio || 1),
      sw = innerWidth,
      sh = innerHeight,
      si = Platform.safeInsets();
    // 在安全区内等比适配 360x640，其余区域（刘海/长屏/平板两侧）由 App.drawBands 延展背景
    var aw = sw - si.left - si.right,
      ah = sh - si.top - si.bottom;
    scale = Math.min(aw / CFG.W, ah / CFG.H);
    var ox = si.left + (aw - CFG.W * scale) / 2,
      oy = si.top + (ah - CFG.H * scale) / 2;
    cv.style.width = sw + 'px';
    cv.style.height = sh + 'px';
    cv.width = Math.round(sw * dpr);
    cv.height = Math.round(sh * dpr);
    App.view = { scale: scale, ox: ox, oy: oy, sw: sw, sh: sh, dpr: dpr };
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr);
  }
  addEventListener('resize', resize);
  resize();
  function pt(e) {
    var r = cv.getBoundingClientRect(),
      p = e.touches ? e.touches[0] || e.changedTouches[0] : e;
    var V = App.view;
    return { x: (p.clientX - r.left - V.ox) / V.scale, y: (p.clientY - r.top - V.oy) / V.scale };
  }
  var pressBtn = null;
  function down(e) {
    e.preventDefault();
    Sfx.init();
    if (Save.d.vol != null) Sfx.setVol(Save.d.vol);
    if (Save.d.mute) Sfx.setMute(true);
    var p = pt(e),
      b = UI.tap(p.x, p.y);
    if (App.scene != 'game' || GS.result) Menu.down(p.x, p.y);
    if (b) {
      pressBtn = b;
      UI.pressId = b.id;
      return;
    }
    if (App.scene == 'game') GS.down(p.x, p.y);
  }
  function move(e) {
    var p = pt(e);
    if (App.scene != 'game' && Menu.move(p.x, p.y)) {
      e.preventDefault();
      if (pressBtn) {
        pressBtn = null;
        UI.pressId = null;
      }
      return;
    }
    if (App.scene == 'game' && GS.drag) {
      e.preventDefault();
      GS.move(p.x, p.y);
    }
  }
  function up(e) {
    var p = pt(e);
    if (Menu.up() && !pressBtn) return;
    if (pressBtn) {
      var b = UI.tap(p.x, p.y);
      UI.pressId = null;
      var pb = pressBtn;
      pressBtn = null;
      if (b && b.id == pb.id && pb.fn) {
        if (pb.id.indexOf('nav') != 0 && pb.id != 'start') Sfx.play('click');
        pb.fn();
      }
      return;
    }
    if (App.scene == 'game') GS.up(p.x, p.y);
  }
  cv.addEventListener('mousedown', down);
  addEventListener('mousemove', move);
  addEventListener('mouseup', up);
  cv.addEventListener('touchstart', down, { passive: false });
  addEventListener('touchmove', move, { passive: false });
  addEventListener('touchend', up);
  addEventListener('touchcancel', up);
  cv.addEventListener(
    'wheel',
    function (e) {
      Menu.scroll(e.deltaY * 0.5);
      e.preventDefault();
    },
    { passive: false }
  );
  setInterval(function () {
    if (App.offline) return;
    Save.d.lastSeen = Date.now();
    Save.save();
  }, 5000);
  document.addEventListener('visibilitychange', function () {
    if (!App.offline) Save.d.lastSeen = Date.now();
    Save.save();
    if (Exp.active && App.scene != 'game') Exp.persist();
  });
  addEventListener('pagehide', function () {
    Save.save();
    if (Exp.active && App.scene != 'game') Exp.persist();
  });
  Platform.init();
  Boot.draw();
  Platform.boot(function () {
    loadDisplayFont();
    Art.load(function () {
      Boot.on = false;
      Art.buildBG();
      var last = performance.now();
      function loop(now) {
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        App.frame(dt);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    });
  });
})();

