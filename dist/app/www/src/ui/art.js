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
