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
            {
              cosmos: '星海吞噬！',
              meteor: '流星火雨！',
              gaia: '万物生长！',
              volley: '万箭齐发！',
              verdant: '苍翠绽放！',
              storm: '雷暴领域！'
            }[d.k] || '',
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
    var sdt =
      this.paused || g.pendingBranch || this.popup || this.cine || (this.bossIntro && this.bossIntro.t < 1.8)
        ? 0
        : dt * this.speed;
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
    Art.enemy(
      c,
      { boss: boss, type: boss.id, phase: t, hitT: 0, r: boss.r || 28, color: col },
      CFG.W / 2,
      cy - 70,
      92,
      UI.t,
      0
    );
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
