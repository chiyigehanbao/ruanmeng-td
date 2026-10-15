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
