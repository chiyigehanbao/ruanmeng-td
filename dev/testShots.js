/**
 * 软萌大作战 V1.0
 * 开发截图工具：?shot=名称 构造场景并截图，仅开发版加载
 *
 * © 2026 <著作权人>
 */
var Shot = {
  tick: function (n) {
    for (var i = 0; i < n; i++) App.frame(1 / 60);
  },
  setupGame: function (lv, waves, towers) {
    Save.d.tut = true;
    App.go('game', lv);
    var g = GS.g;
    g.gold = 99999;
    towers.forEach(function (t, i) {
      var f = g.freeCells()[0];
      if (f) g.addTower(t[0], t[1], f);
    });
    g.gold = 320;
    return g;
  },
  run: function (n) {
    var S = this;
    UI.toasts = [];
    dispatchEvent(new Event('resize'));
    Save.d.stars = { '1-1': 3, '1-2': 3, '1-3': 2, '1-4': 3, '1-5': 1, '2-1': 2, '2-2': 1 };
    Save.d.candy = 860;
    Save.d.gems = 145;
    Save.d.signDay = 2;
    for (var c = 1; c <= 2; c++) for (var l = 1; l <= 8; l++) Save.d.stars[c + '-' + l] = l < 6 || c == 1 ? 3 : 0;
    Save.d.stars['3-1'] = 2;
    Save.d.tickets = 3;
    Save.d.pass.xp = 760;
    Save.d.heroes.princess = 1;
    Save.d.relics = { clover: 1, crown: 1, candle: 1 };
    Save.d.equip = ['clover', 'crown'];
    Save.d.skins = { cat_black: 1 };
    Save.d.codex = { cat: 7, penguin: 5, bear: 3 };
    Save.d.stat.kills = 640;
    Save.d.stat.merges = 61;
    Save.d.best = 34;
    if (n == 'title') {
      App.scene = 'title';
      S.tick(90);
    } else if (n.indexOf('panel_') == 0) {
      App.go('map');
      Menu.popup = null;
      Menu.open(n.slice(6));
      S.tick(40);
    } else if (n == 'gacha' || n == 'rates') {
      App.go('gacha');
      Menu.popup = null;
      Save.d.tickets = 12;
      S.tick(30);
      if (n == 'rates') {
        Menu.popup = {
          title: '概率公示',
          border: '#b46cff',
          lines: Meta.rateLines(),
          btns: [{ t: '知道了', c: '#b46cff', f: function () {} }]
        };
        S.tick(10);
      }
    } else if (n == 'agepop') {
      App.scene = 'title';
      S.tick(30);
      Menu.popup = {
        title: '适龄提示',
        border: '#5fcf6a',
        lines: CFG.AGE_RATING.lines,
        btns: [{ t: '知道了', c: '#5fcf6a', f: function () {} }]
      };
      S.tick(10);
    } else if (n == 'map') {
      App.scene = 'map';
      Menu.chapter = 2;
      S.tick(60);
    } else if (n == 'tip12' || n == 'tip12c') {
      Save.d.tips = {};
      var g12 = S.setupGame(CFG.levelInfo(1, 2), 0, [
        ['cat', 1],
        ['penguin', 1]
      ]);
      if (n == 'tip12c') {
        g12.wave = 1;
        g12.state = 'pick';
        g12.choices = rollUpgrades(g12);
        GS.tips.shift();
        GS.pickT = 1;
      }
      GS.banner = null;
      S.tick(+(new URLSearchParams(location.search).get('t') || 40));
    } else if (n.indexOf('lv_') == 0) {
      // lv_<章>_<关>_<波> 或 lv_end_<波>：按关卡进度配置一套典型阵容，截取波次中段
      var pp = n.split('_'),
        endl = pp[1] == 'end',
        wv = +(endl ? pp[2] : pp[3]),
        LI = endl ? CFG.endlessInfo() : CFG.levelInfo(+pp[1], +pp[2]);
      if (endl) LI.mods = [];
      var tier = endl ? 4 : Math.min(4, 1 + Math.floor((+pp[1] - 1) * 0.7 + wv / 5));
      var team = [
        ['cat', tier],
        ['penguin', Math.max(1, tier - 1)],
        ['bear', Math.max(1, tier - 1)],
        ['cat', Math.max(1, tier - 1)],
        ['bunny', Math.max(1, tier - 2)],
        ['fox', Math.max(1, tier - 2)],
        ['pig', 1],
        ['frog', 1]
      ].slice(0, Math.min(8, 3 + wv));
      var g = S.setupGame(LI, 0, team);
      g.wave = wv - 1;
      g.startWave();
      GS.banner = null;
      S.tick(+(new URLSearchParams(location.search).get('t') || 520));
      GS.banner = null;
      UI.toasts = [];
    } else if (n == 'info') {
      var gi = S.setupGame(CFG.levelInfo(1, 3), 0, [
        ['cat', 3],
        ['penguin', 2],
        ['bear', 4, 'A'],
        ['bunny', 2]
      ]);
      gi.state = 'prep';
      GS.sel = gi.towers[2];
      GS.banner = null;
      S.tick(10);
    } else if (n == 'wave' || n == 'ult' || n == 'boss' || n == 'pick' || n == 'merge' || n == 'over' || n == 'win') {
      var g = S.setupGame(n == 'boss' ? CFG.levelInfo(4, CFG.LEVELS_PER) : CFG.levelInfo(2, 3), 0, [
        ['cat', 3],
        ['penguin', 2],
        ['bear', 2],
        ['bunny', 2],
        ['fox', 1],
        ['cat', 2],
        ['cat', 2],
        ['pig', 2],
        ['bear', 1],
        ['penguin', 1],
        ['bunny', 1]
      ]);
      g.tags = { ice: 3, fire: 1 };
      if (n == 'ult') {
        [3, 7].forEach(function (ti, j) {
          var old = g.towers[ti];
          g.towers.splice(ti, 1);
          g.gold = 99999;
          g.addTower(j ? 'u_phoenix' : 'u_cosmos', 1, [old.c, old.r]);
          g.gold = 320;
        });
      }
      g.m.chainAdd = 2;
      if (n == 'boss') {
        g.wave = g.level.waves - 1;
      } else g.wave = n == 'wave' || n == 'ult' ? 7 : 3;
      g.startWave();
      if (n == 'boss') {
        var bi = g.queue.findIndex(function (q) {
          return q.boss;
        });
        if (bi > 0) g.queue.unshift(g.queue.splice(bi, 1)[0]);
        g.queue[0].delay = 0;
      }
      GS.banner = null;
      S.tick(n == 'boss' ? 420 : 520);
      if (n == 'boss') {
        GS.banner = null;
      }
      if (n == 'pick') {
        g.enemies = [];
        g.queue = [];
        g.waveClear();
        g.choices = [UPGRADES[22], UPGRADES[8], UPGRADES[13]];
        S.tick(50);
      }
      if (n == 'merge') {
        var a = g.towers.filter(function (t) {
          return t.type == 'cat' && t.lv == 2;
        });
        if (a.length >= 2) {
          GS.drag = { t: a[0], x: g.tpos(a[1]).x + 6, y: g.tpos(a[1]).y - 4, sx: 0, sy: 0, moved: true };
        }
        S.tick(2);
      }
      if (n == 'over') {
        g.hp = 0;
        g.state = 'lose';
        GS.finish(false);
        S.tick(40);
      }
      if (n == 'win') {
        g.hp = g.maxHp;
        g.state = 'win';
        GS.finish(true);
        S.tick(120);
      }
    } else if (n == 'v5' || n == 'fuse' || n == 'fpop' || n == 'cine' || n == 'evo') {
      Save.d.fusions = { f_superconduct: 2, f_inferno: 2 };
      var EL = CFG.endlessInfo();
      EL.mods = [];
      var g = S.setupGame(EL, 0, []);
      [
        ['cat', 5, 'A', 0, 2],
        ['penguin', 5, 'B', 1, 2],
        ['bunny', 5, 'A', 2, 2],
        ['f_superconduct', 2, null, 3, 2],
        ['u_phoenix', 1, null, 4, 2],
        ['fox', 4, 'B', 0, 1],
        ['bear', 3, null, 1, 1],
        ['frog', 2, null, 2, 1],
        ['hamster', 5, 'B', 3, 1],
        ['f_inferno', 3, null, 4, 1],
        ['owl', 1, null, 0, 0],
        ['hedgehog', 4, 'A', 1, 0],
        ['unicorn', 5, 'A', 2, 0],
        ['chick', 3, null, 3, 0],
        ['bear', 5, 'A', 4, 0]
      ].forEach(function (q) {
        var t = g.addTower(q[0], q[1], [q[3], q[4]], q[2]);
        t.pop = 0;
      });
      g.wave = 24;
      g.tags = { ice: 3, toxic: 2 };
      g.startWave();
      GS.banner = null;
      S.tick(n == 'v5' ? 420 : 200);
      GS.banner = null;
      UI.toasts = [];
      GS.popups = [];
      GS.popup = null;
      GS.cine = null;
      if (n == 'fuse') {
        var a = g.cellAt(2, 2);
        g.towers.splice(g.towers.indexOf(a), 1);
        var b = g.addTower('bunny', 5, [2, 2], 'A');
        var pe = g.cellAt(1, 2);
        GS.drag = { t: pe, x: g.tpos(b).x + 8, y: g.tpos(b).y - 6, sx: 0, sy: 0, moved: true };
        S.tick(3);
      }
      if (n == 'fpop') {
        var x1 = g.cellAt(1, 2),
          x2 = g.cellAt(2, 2);
        Save.d.fusions = {};
        g.noMeta = false;
        g.move(x1, x2.c, x2.r);
        GS.cine = null;
        S.tick(40);
      }
      if (n == 'cine') {
        g.noMeta = false;
        var y1 = g.cellAt(3, 2);
        y1.lv = 3;
        var y2 = g.addTower('f_magspike', 3, g.freeCells()[0] || [0, 0]);
        var y3 = g.cellAt(4, 1);
        g.towers.splice(g.towers.indexOf(y3), 1);
        y2.c = 4;
        y2.r = 1;
        g.move(y1, 4, 1);
        S.tick(70);
      }
      if (n == 'evo') {
        g.noMeta = false;
        Save.d.seenLv = {};

        var e2 = g.addTower('frog', 2, [0, 0]);
        g.towers.splice(g.towers.indexOf(g.cellAt(0, 0)), 1);
        g.towers.push(e2);
        e2.c = 0;
        e2.r = 0;
        g.move(e2, 2, 1);
        S.tick(40);
      }
    } else if (n == 'vfxcat' || n == 'vfxfox' || n == 'vfxbunny' || n == 'vfxfrog') {
      var ty = n.slice(3),
        EL2 = CFG.endlessInfo();
      EL2.mods = [];
      var g = S.setupGame(EL2, 0, []);
      for (var i = 0; i < 5; i++) {
        var t = g.addTower(ty, i + 1, [i, 2], i >= 3 ? 'B' : null);
        t.pop = 0;
      }
      g.addTower(
        'f_' + (ty == 'cat' ? 'hawkeye' : ty == 'fox' ? 'inferno' : ty == 'bunny' ? 'superconduct' : 'toxfire'),
        3,
        [1, 0]
      );
      g.addTower(
        'u_' + (ty == 'cat' ? 'skyhunter' : ty == 'fox' ? 'phoenix' : ty == 'bunny' ? 'raijin' : 'gaia'),
        1,
        [3, 0]
      );
      g.wave = 21;
      g.startWave();
      GS.banner = null;
      S.tick(330);
      GS.banner = null;
      UI.toasts = [];
    } else if (n == 'unlock') {
      Save.d.stars = {};
      Save.d.seenUnlock = null;
      Save.syncUnlocks(true);
      var g = S.setupGame(CFG.levelInfo(1, 1), 0, [['cat', 2]]);
      GS.banner = null;
      g.wave = g.level.waves;
      g.state = 'win';
      GS.finish(true);
      S.tick(40);
      App.go('game', CFG.levelInfo(1, 2));
      var g2 = GS.g,
        cnt = {};
      g2.gold = 99999;
      for (var q = 0; q < 15; q++) {
        var tt = g2.buy();
        if (tt) cnt[tt.type] = (cnt[tt.type] || 0) + 1;
      }
      console.error('POOL', JSON.stringify(g2.pool), 'ROLLS', JSON.stringify(cnt), 'TEAM', JSON.stringify(Save.team()));
      App.go('game', CFG.levelInfo(1, 1));
      var g3 = GS.g;
      g3.wave = g3.level.waves;
      g3.state = 'win';
      Save.d.stars = {};
      Save.d.seenUnlock = { cat: 1 };
      GS.finish(true);
      S.tick(40);
    } else if (n == 'range') {
      var g = S.setupGame(CFG.levelInfo(2, 4), 0, [
        ['cat', 2],
        ['owl', 2],
        ['bear', 2],
        ['penguin', 2],
        ['fox', 2],
        ['bunny', 1],
        ['hamster', 1],
        ['frog', 1],
        ['koala', 1],
        ['hedgehog', 1]
      ]);
      GS.banner = null;
      g.startWave();
      S.tick(300);
      var od = GS.draw;
      GS.draw = function () {
        od.call(GS);
        var c = UI.c;
        g.towers.forEach(function (t, i) {
          if (i >= 5 && i != 7) return;
          var D = CFG.TOWERS[t.type],
            st = g.statsFor(t, t.type),
            p = g.tpos(t),
            y = Math.min(p.y, CFG.GRID_Y + 24);
          c.save();
          c.strokeStyle = D.color;
          c.globalAlpha = 0.9;
          c.lineWidth = 2;
          c.setLineDash([6, 4]);
          c.beginPath();
          c.arc(p.x, y, st.range, 0, 7);
          c.stroke();
          c.setLineDash([]);
          c.globalAlpha = 0.07;
          c.fillStyle = D.color;
          c.fill();
          c.restore();
          UI.plain(D.name + ' ' + Math.round(st.range), p.x, y - st.range + 10, 9, shade(D.dark, -0.3));
        });
      };
    } else if (n == 'anim') {
      var g = S.setupGame(CFG.levelInfo(2, 4), 0, [
        ['cat', 3],
        ['fox', 3],
        ['bear', 3],
        ['owl', 3]
      ]);
      GS.banner = null;
      g.startWave();
      var cv = UI.c.canvas,
        st = document.createElement('canvas'),
        K = 6,
        Wd = cv.width,
        cw = Wd,
        ch = Math.round(cv.height * 0.32);
      st.width = cw;
      st.height = ch * K;
      var sx = 0,
        sy = Math.round(cv.height * 0.6),
        log = [];
      for (var k = 0; k < K; k++) {
        S.tick(k == 0 ? 420 : 3);
        App.frame(1 / 60);
        st.getContext('2d').drawImage(cv, sx, sy, cw, ch, 0, k * ch, cw, ch);
        log.push(
          g.towers
            .map(function (t) {
              return GS.towerFrame(t);
            })
            .join('')
        );
      }
      window.ANIMLOG = log;
      if (location.search.indexOf('raw') < 0) console.error('ANIM', log.join(' '));
      GS.draw = function () {
        var c = UI.c;
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.fillStyle = '#fff';
        c.fillRect(0, 0, cv.width, cv.height);
        c.drawImage(st, 0, 0, cw, ch * K, 0, 0, (cw * cv.height) / (ch * K), cv.height);
      };
    } else if (n == 'proplab' || n == 'proplab2') {
      var g = S.setupGame(CFG.levelInfo(1, 1), 0, []);
      GS.banner = null;
      g.state = 'prep';
      var ents = [];
      CFG.TOWER_ORDER.forEach(function (k) {
        ents.push({ type: k, lv: 3 });
      });
      Object.keys(CFG.FUSIONS).forEach(function (k) {
        ents.push({ type: 'f_' + k, lv: 2 });
      });
      Object.keys(CFG.ULTIMATES).forEach(function (k) {
        ents.push({ type: 'u_' + k, lv: 1 });
      });
      if (n == 'proplab') ents = ents.slice(0, 16);
      else ents = ents.slice(16);
      var F = 0,
        COLS = 4,
        CW = 90,
        CH = n == 'proplab' ? 140 : 112;
      ents.forEach(function (e, i) {
        var cx = CW / 2 + (i % COLS) * CW,
          cy = (n == 'proplab' ? 100 : 100) + Math.floor(i / COLS) * CH;
        e.cx = cx;
        e.cy = cy;
        e.tw = {
          id: 900 + i,
          type: e.type,
          lv: e.lv,
          branch: null,
          c: (cx - CFG.GRID_X - CFG.CELL / 2) / CFG.CELL,
          r: (cy - CFG.GRID_Y - CFG.CELL / 2) / CFG.CELL,
          phase: 0,
          recoil: 0.9,
          pop: 0,
          face: 1,
          cds: [1, 1, 1, 1]
        };
      });
      GS.draw = function () {
        var c = UI.c;
        UI.begin();
        var bg = c.createLinearGradient(0, 0, 0, 640);
        bg.addColorStop(0, '#dff3d0');
        bg.addColorStop(1, '#cfe9c0');
        c.fillStyle = bg;
        c.fillRect(0, 0, 360, 640);
        F++;
        UI.text('道具出手检查：每只伙伴的攻击从武器尖端发出', 180, 14, 11, '#5a3442', { stroke: false });
        ents.forEach(function (e) {
          var tw = e.tw,
            D = CFG.TOWERS[tw.type],
            ps = D.parts ? (D.ultimate ? [D.parts[0], D.parts[2]] : D.parts) : [tw.type];
          tw.recoil = 0.9;
          c.fillStyle = 'rgba(255,255,255,.35)';
          rr(c, e.cx - CW / 2 + 2, e.cy - CH + 40, CW - 4, CH - 4, 8);
          c.fill();
          GS.drawTower(tw, e.cx, e.cy, 1);
          ps.forEach(function (pt, pi) {
            var M = GS.muzzleOf(tw, pt),
              mech = CFG.TOWERS[pt].mech,
              pw = D.ultimate ? 9 : D.parts ? 6 : 3,
              dx = pi == 1 ? -0.55 : 0.55,
              dy = -0.83,
              b = {
                mech: mech == 'bounce' ? 'spike' : mech,
                pw: pw,
                lv: pw,
                src: tw,
                life: F / 60,
                x: M.x + dx * 16,
                y: M.y + dy * 16,
                ang: Math.atan2(dy, dx),
                vx: dx * 300,
                vy: dy * 300,
                tr: [
                  { x: M.x, y: M.y },
                  { x: M.x + dx * 8, y: M.y + dy * 8 }
                ]
              };
            if (F % 30 == 1) VFX.muzzle(M.x, M.y, b.ang, Math.min(pw, 5), tw);
            if (['arrow', 'frost', 'poison', 'cannon', 'fire', 'missile', 'spike'].indexOf(b.mech) >= 0) GS.drawShot(b);
            else if (mech == 'chain') {
              if (F % 10 == 1)
                FX.bolt(
                  [
                    [M.x, M.y],
                    [M.x + dx * 12 + 4, M.y - 14],
                    [M.x + dx * 24, M.y - 30]
                  ],
                  { pw: pw }
                );
            } else if (mech == 'beam' || mech == 'snipe') {
              c.save();
              c.globalCompositeOperation = 'lighter';
              c.strokeStyle = mech == 'beam' ? 'rgba(120,255,200,.8)' : 'rgba(255,240,180,.9)';
              c.lineWidth = mech == 'beam' ? 5 : 2.5;
              c.beginPath();
              c.moveTo(M.x, M.y);
              c.lineTo(M.x + dx * 40, M.y + dy * 40);
              c.stroke();
              c.strokeStyle = '#fff';
              c.lineWidth = 1.5;
              c.stroke();
              c.restore();
            } else if (mech == 'hole') {
              var hg = c.createRadialGradient(M.x + dx * 14, M.y - 12, 1, M.x + dx * 14, M.y - 12, 9);
              hg.addColorStop(0, '#1a0030');
              hg.addColorStop(1, 'rgba(180,120,255,0)');
              c.fillStyle = hg;
              c.beginPath();
              c.arc(M.x + dx * 14, M.y - 12, 9, 0, 7);
              c.fill();
            } else if (mech == 'summon') {
              Art.drawAt(c, 'p_chickling_0', M.x + dx * 14, M.y - 6, 14);
            } else if (mech == 'pull') {
              c.strokeStyle = 'rgba(120,200,255,.9)';
              c.lineWidth = 2;
              for (var q = 1; q <= 3; q++) {
                c.beginPath();
                c.arc(M.x, M.y, q * 5, -2.4, -0.7);
                c.stroke();
              }
            } else if (F % 12 == 1)
              FX.burst(M.x, M.y, 3, {
                colors:
                  mech == 'gold' ? ['#ffd23f', '#fff'] : mech == 'heal' ? ['#ff6f8f', '#fff'] : ['#8fe08a', '#fff'],
                shape: mech == 'heal' ? 'heart' : 'star',
                speed: 25,
                size: 3,
                g: -20,
                life: 0.6
              });
            c.strokeStyle = 'rgba(255,40,80,.9)';
            c.lineWidth = 1;
            c.beginPath();
            c.arc(M.x, M.y, 2.5, 0, 7);
            c.stroke();
          });
          UI.plain(D.name, e.cx, e.cy + 24, 8, '#5a3442');
        });
        FX.draw(c);
      };
      S.tick(44);
    } else if (n == 'vfxlab') {
      var g = S.setupGame(CFG.levelInfo(1, 1), 0, []);
      GS.banner = null;
      var rows = [
          ['arrow', '喵喵弓手'],
          ['fire', '狐狐火球'],
          ['frost', '企鹅冰冰'],
          ['chain', '兔兔电电'],
          ['poison', '蛙蛙毒毒'],
          ['missile', '仓仓导弹']
        ],
        cols = [1, 2, 3, 4, 5, 7, 9],
        F = 0,
        shots = [];
      rows.forEach(function (r, ri) {
        cols.forEach(function (pw, ci) {
          shots.push({
            mech: r[0],
            pw: pw,
            lv: pw,
            x: 0,
            y: 0,
            life: 0,
            ri: ri,
            ci: ci,
            src: { type: pw >= 9 ? 'u_raijin' : pw >= 6 ? 'f_inferno' : 'cat' },
            ang: -Math.PI / 2,
            burn: pw >= 6
          });
        });
      });
      GS.draw = function () {
        var c = UI.c;
        UI.begin();
        var bg = c.createLinearGradient(0, 0, 0, 640);
        bg.addColorStop(0, '#2a2140');
        bg.addColorStop(1, '#3a2a55');
        c.fillStyle = bg;
        c.fillRect(0, 0, 360, 640);
        F++;
        UI.text('攻击特效分级对比', 180, 22, 17, '#fff', { stroke: '#ff6f9c' });
        ['Lv1', 'Lv2', 'Lv3', 'Lv4', 'Lv5', '融合', '究极'].forEach(function (l, i) {
          UI.text(l, 30 + i * 50, 46, 11, i >= 5 ? '#ffe066' : '#fff', { stroke: '#3a1a4a' });
        });
        shots.forEach(function (b) {
          var x0 = 30 + b.ci * 50,
            y0 = 62 + b.ri * 96;
          if (b.ci == 0) UI.plain(rows[b.ri][1], 180, y0 + 90, 9, 'rgba(255,255,255,.55)');
          var k = (F % 40) / 40;
          b.life += 1 / 60;
          if (b.mech == 'chain') {
            if (F % 18 == 0) {
              FX.bolt(
                [
                  [x0, y0 + 80],
                  [x0 + 8, y0 + 40],
                  [x0 - 6, y0 + 10]
                ],
                { pw: b.pw }
              );
              VFX.impact(x0 - 6, y0 + 10, b.pw, b.src);
            }
            return;
          }
          b.x = x0;
          b.y = y0 + 82 - k * 70;
          b.ang = -Math.PI / 2;
          b.vx = 0;
          b.vy = -200;
          if (F % 40 == 1) {
            b.tr = [];
            VFX.muzzle(x0, y0 + 82, -Math.PI / 2, b.pw, b.src);
          }
          if (F % 40 == 39)
            VFX.impact(
              x0,
              y0 + 12,
              b.pw,
              b.src,
              { fire: '#ff7a1a', frost: '#bfe9ff', poison: '#9be37a', missile: '#ffb020' }[b.mech]
            );
          GS.drawShot(b);
        });
        FX.draw(c);
      };
      S.tick(104);
    } else if (n == 'cxt' || n == 'cxf' || n == 'cxu') {
      Save.d.fusions = { f_superconduct: 2, f_inferno: 2, f_rocketfire: 2, f_plague: 2, u_phoenix: 2 };
      App.scene = 'map';
      Menu.cxTab = n[2];
      Menu.panel = 'codex';
      Menu.pk = 1;
      S.tick(30);
    } else if (n == 'modes' || n == 'hero' || n == 'gacha') {
      App.scene = n;
      S.tick(40);
    } else if (n == 'heroR') {
      App.scene = 'hero';
      Menu.htab = 'r';
      S.tick(20);
    } else if (n == 'heroS') {
      App.scene = 'hero';
      Menu.htab = 's';
      S.tick(20);
    } else if (n == 'gachaRes') {
      Save.d.gems = 999;
      Save.d.tickets = 20;
      App.scene = 'gacha';
      Menu.doPull(10);
      S.tick(40);
      // 等异步抽卡回调落盘
      for (var gi = 0; gi < 90 && !Menu.gres; gi++) S.tick(1);
      S.tick(80);
    } else if (n == 'exp') {
      Exp.start();
      Exp.row = 2;
      Exp.col = 1;
      Exp.map[0][0].done = true;
      Exp.map[1][1].done = true;
      Exp.map[2][1].done = true;
      var g = Exp.g;
      g.gold = 999;
      [
        ['cat', 4],
        ['penguin', 3],
        ['bear', 3],
        ['bunny', 2]
      ].forEach(function (t) {
        g.addTower(t[0], t[1], g.freeCells()[0]);
      });
      g.gold = 145;
      Exp.addRelic('clover');
      Exp.addRelic('bell');
      S.tick(40);
    } else if (n == 'expEv') {
      Exp.start();
      Exp.enter(0, 0);
      App.scene = 'exp';
      Exp.msg = {
        title: '许愿池',
        text: '投入硬币，许个愿望吧',
        btns: [
          { t: '城堡 -5，随机2只伙伴+1级', f: null },
          { t: '离开', f: null }
        ]
      };
      S.tick(30);
    } else if (n == 'lv7' || n == 'fog' || n == 'space') {
      var lvi = n == 'fog' ? CFG.levelInfo(5, 3) : n == 'space' ? CFG.levelInfo(6, 8) : CFG.levelInfo(3, 8);
      var g = S.setupGame(lvi, 0, [
        ['cat', 7],
        ['penguin', 6],
        ['bear', 7],
        ['bunny', 6],
        ['fox', 7],
        ['pig', 6],
        ['dragon', 7],
        ['cat', 5],
        ['bunny', 4],
        ['penguin', 4],
        ['fox', 3]
      ]);
      g.towers.forEach(function (t, i) {
        if (t.lv >= 6) t.branch = i % 2 ? 'B' : 'A';
      });
      g.wave = lvi.waves - 1;
      g.startWave();
      GS.banner = null;
      S.tick(n == 'lv7' ? 640 : 420);
      GS.banner = null;
    } else if (n == 'branch') {
      var g = S.setupGame(CFG.levelInfo(2, 4), 0, [
        ['cat', 3],
        ['cat', 3],
        ['bear', 3]
      ]);
      var b = g.towers[1];
      g.move(g.towers[0], b.c, b.r);
      S.tick(30);
    } else if (n == 'prep') {
      var g = S.setupGame(CFG.levelInfo(1, 4), 0, [
        ['cat', 2],
        ['cat', 1],
        ['penguin', 1],
        ['bear', 1]
      ]);
      g.wave = 4;
      GS.banner = null;
      S.tick(30);
    } else if (n == 'tut') {
      Save.d.tut = false;
      App.go('game', CFG.levelInfo(1, 1));
      GS.banner = null;
      GS.g.buy();
      GS.g.buy();
      GS.tut = 1;
      S.tick(30);
    } else {
      App.scene = 'map';
      Menu.panel = n;
      Menu.pk = 1;
      S.tick(30);
    }
    var fin = function () {
      dispatchEvent(new Event('resize'));
      App.frame(1 / 60);
      document.title = 'SHOT_READY';
    };
    if (n == 'lb')
      setTimeout(function () {
        S.tick(5);
        fin();
      }, 900);
    else fin();
  }
};

// 开发版启动时接管资源加载回调：带 ?shot= 参数时只构造截图场景，不启动主循环
(function () {
  var q = location.search,
    load = Art.load;
  if (q.indexOf('shot=') < 0) return;
  Art.load = function (cb) {
    load.call(Art, function () {
      Art.buildBG();
      Shot.run(q.split('shot=')[1].split('&')[0]);
    });
  };
})();
