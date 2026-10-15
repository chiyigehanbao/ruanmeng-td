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
