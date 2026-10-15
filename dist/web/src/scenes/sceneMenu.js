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
