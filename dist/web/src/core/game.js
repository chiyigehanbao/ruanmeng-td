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
