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
