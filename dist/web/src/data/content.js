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
