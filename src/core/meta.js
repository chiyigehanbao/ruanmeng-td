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
