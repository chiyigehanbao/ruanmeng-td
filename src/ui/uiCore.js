/**
 * 软萌大作战 V1.0
 * UI 基础组件：按钮 / 面板 / 文字
 *
 * © 2026 <著作权人>
 */
var FONT = '"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Noto Sans SC",sans-serif';
/** 展示字体（站酷快乐体子集，用于标题、按钮、飘字），加载失败时回退系统字体 */
var FONT_DISPLAY = FONT;
var FONT_FILE = 'assets/fonts/rmfont.ttf';
function loadDisplayFont() {
  try {
    //#if douyin
    if (typeof tt !== 'undefined' && tt.loadFont) {
      var f1 = tt.loadFont(FONT_FILE);
      if (f1) FONT_DISPLAY = '"' + f1 + '",' + FONT;
    }
    //#endif
    //#if wechat
    if (typeof wx !== 'undefined' && wx.loadFont) {
      var f2 = wx.loadFont(FONT_FILE);
      if (f2) FONT_DISPLAY = '"' + f2 + '",' + FONT;
    }
    //#endif
    //#if web,app
    if (typeof FontFace !== 'undefined' && typeof document !== 'undefined' && document.fonts) {
      new FontFace('RMFont', 'url(' + FONT_FILE + ')').load().then(function (ff) {
        document.fonts.add(ff);
        FONT_DISPLAY = '"RMFont",' + FONT;
      });
    }
    //#endif
  } catch (e) {}
}
var UI = {
  c: null,
  t: 0,
  btns: [],
  pressId: null,
  toasts: [],
  begin: function () {
    this.btns = [];
  },
  font: function (sz, w, display) {
    this.c.font = (display ? 'normal' : w || 'bold') + ' ' + sz + 'px ' + (display ? FONT_DISPLAY : FONT);
  },
  text: function (s, x, y, sz, col, o) {
    o = o || {};
    var c = this.c;
    this.font(sz, o.w || '900', o.display !== false);
    c.textAlign = o.align || 'center';
    c.textBaseline = 'middle';
    if (o.stroke !== false) {
      c.lineJoin = 'round';
      c.lineWidth = o.sw || Math.max(2.5, sz / 5);
      c.strokeStyle = o.stroke || 'rgba(90,50,60,.9)';
      c.strokeText(s, x, y);
    }
    c.fillStyle = col || '#fff';
    c.fillText(s, x, y);
  },
  plain: function (s, x, y, sz, col, align, w) {
    var c = this.c;
    this.font(sz, w || 'bold');
    c.textAlign = align || 'center';
    c.textBaseline = 'middle';
    c.fillStyle = col;
    c.fillText(s, x, y);
  },
  // 按钮：col=主色，自动生成渐变、厚度、阴影；按下缩放
  button: function (id, x, y, w, h, label, col, fn, o) {
    o = o || {};
    var c = this.c,
      pressed = this.pressId === id,
      dis = o.disabled;
    var sc = pressed ? 0.93 : o.pulse ? 1 + Math.sin(this.t * 5) * 0.035 : 1;
    c.save();
    c.translate(x + w / 2, y + h / 2 + (pressed ? 2 : 0));
    c.scale(sc, sc);
    var base = dis ? '#b8b8c4' : col,
      r = o.r || Math.min(h / 2, 16);
    c.fillStyle = 'rgba(60,30,50,.25)';
    rr(c, -w / 2, -h / 2 + 4, w, h, r);
    c.fill();
    c.fillStyle = shade(base, -0.25);
    rr(c, -w / 2, -h / 2 + 2, w, h, r);
    c.fill();
    var g = c.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, shade(base, 0.35));
    g.addColorStop(1, base);
    c.fillStyle = g;
    rr(c, -w / 2, -h / 2, w, h - 3, r);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)';
    rr(c, -w / 2 + 6, -h / 2 + 3, w - 12, (h - 3) * 0.38, r * 0.7);
    c.fill();
    if (o.primary) {
      c.strokeStyle = 'rgba(255,255,255,.85)';
      c.lineWidth = 2.4;
      rr(c, -w / 2 + 2, -h / 2 + 2, w - 4, h - 7, r - 1);
      c.stroke();
      c.strokeStyle = shade(base, 0.55);
      c.lineWidth = 1.2;
      rr(c, -w / 2 + 4, -h / 2 + 4, w - 8, h - 11, r - 2);
      c.stroke();
    } else {
      c.strokeStyle = 'rgba(255,255,255,.55)';
      c.lineWidth = 1.4;
      rr(c, -w / 2 + 1.5, -h / 2 + 1.5, w - 3, h - 6, r - 1);
      c.stroke();
    }
    if (pressed) {
      c.fillStyle = 'rgba(40,20,40,.14)';
      rr(c, -w / 2, -h / 2, w, h - 3, r);
      c.fill();
    }
    if (o.pulse && !dis) {
      c.save();
      rr(c, -w / 2, -h / 2, w, h - 3, r);
      c.clip();
      var sx = ((this.t * 90) % (w + 80)) - w / 2 - 40;
      var sg = c.createLinearGradient(sx - 20, 0, sx + 20, 0);
      sg.addColorStop(0, 'rgba(255,255,255,0)');
      sg.addColorStop(0.5, 'rgba(255,255,255,.45)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = sg;
      c.fillRect(-w / 2, -h / 2, w, h);
      c.restore();
    }
    var tx = 0;
    if (o.icon) {
      var is = o.iconSize || h * 0.5;
      if (label) {
        this.font(o.size || 16, '900');
        var tw = c.measureText(label).width,
          tot = is + 4 + tw;
        Art.icon(c, o.icon, -tot / 2 + is / 2, -1, is);
        tx = -tot / 2 + is + 4 + tw / 2;
      } else Art.icon(c, o.icon, 0, -1, is);
    }
    if (label) this.text(label, tx, -1, o.size || 16, '#fff', { stroke: shade(base, -0.45), sw: 3.5 });
    if (o.badge) {
      c.fillStyle = '#ff4d6d';
      c.beginPath();
      c.arc(w / 2 - 4, -h / 2 + 4, 7, 0, 7);
      c.fill();
      this.text(o.badge, w / 2 - 4, -h / 2 + 4, 10, '#fff', { stroke: false });
    }
    c.restore();
    if ((!dis || o.allowDis) && this.inClip(y + h / 2)) this.btns.push({ id: id, x: x, y: y, w: w, h: h, fn: fn });
  },
  clipY: null,
  inClip: function (y) {
    return !this.clipY || (y >= this.clipY[0] && y <= this.clipY[1]);
  },
  hit: function (id, x, y, w, h, fn) {
    if (this.inClip(y + h / 2)) this.btns.push({ id: id, x: x, y: y, w: w, h: h, fn: fn });
  },
  panel: function (x, y, w, h, o) {
    o = o || {};
    var c = this.c,
      R = o.r || 22;
    // 外层柔光 + 投影，让面板从背景浮出来
    c.fillStyle = 'rgba(255,180,200,.18)';
    rr(c, x - 4, y - 2, w + 8, h + 10, R + 4);
    c.fill();
    c.fillStyle = 'rgba(80,40,60,.28)';
    rr(c, x, y + 7, w, h, R);
    c.fill();
    c.fillStyle = o.border || '#ffb3c7';
    rr(c, x, y, w, h, R);
    c.fill();
    var g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, o.top || '#fffdf8');
    g.addColorStop(0.55, o.mid || '#fff6ea');
    g.addColorStop(1, o.bot || '#ffe6d4');
    c.fillStyle = g;
    rr(c, x + 5, y + 5, w - 10, h - 10, R - 4);
    c.fill();
    // 顶部高光条
    c.fillStyle = 'rgba(255,255,255,.55)';
    rr(c, x + 10, y + 8, w - 20, 10, 6);
    c.fill();
    c.fillStyle = '#ffd23f';
    [
      [x + 12, y + 12],
      [x + w - 12, y + 12],
      [x + 12, y + h - 12],
      [x + w - 12, y + h - 12]
    ].forEach(function (q) {
      c.beginPath();
      c.arc(q[0], q[1], 3.2, 0, 7);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)';
      c.beginPath();
      c.arc(q[0] - 1, q[1] - 1, 1.2, 0, 7);
      c.fill();
      c.fillStyle = '#ffd23f';
    });
    if (o.title) {
      var tw = Math.max(150, o.title.length * 24 + 40),
        tx = x + w / 2 - tw / 2;
      c.fillStyle = shade(o.border || '#ff8fb1', -0.2);
      rr(c, tx - 6, y - 16, tw + 12, 40, 14);
      c.fill();
      var g2 = c.createLinearGradient(0, y - 18, 0, y + 20);
      g2.addColorStop(0, shade(o.border || '#ff8fb1', 0.25));
      g2.addColorStop(1, o.border || '#ff8fb1');
      c.fillStyle = g2;
      rr(c, tx, y - 18, tw, 36, 14);
      c.fill();
      this.text(o.title, x + w / 2, y, 20, '#fff', { stroke: shade(o.border || '#ff8fb1', -0.5) });
    }
  },
  dim: function (a) {
    this.c.fillStyle = 'rgba(40,20,40,' + (a == null ? 0.55 : a) + ')';
    this.c.fillRect(0, 0, CFG.W, CFG.H);
  },
  pill: function (x, y, w, h, icon, val, o) {
    var c = this.c;
    c.fillStyle = 'rgba(255,255,255,.85)';
    rr(c, x, y, w, h, h / 2);
    c.fill();
    c.strokeStyle = 'rgba(200,140,150,.5)';
    c.lineWidth = 1.5;
    c.stroke();
    Art.icon(c, icon, x + h / 2, y + h / 2, h * 0.85);
    this.text(String(val), x + w / 2 + h / 4, y + h / 2 + 0.5, 13, '#7a4a55', { stroke: false });
  },
  bar: function (x, y, w, h, k, col, bg) {
    var c = this.c;
    c.fillStyle = bg || 'rgba(90,50,60,.25)';
    rr(c, x, y, w, h, h / 2);
    c.fill();
    if (k > 0) {
      c.fillStyle = col;
      rr(c, x, y, Math.max(h, w * Math.min(1, k)), h, h / 2);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)';
      rr(c, x + 2, y + 1, Math.max(0, w * Math.min(1, k) - 4), h * 0.35, h / 4);
      c.fill();
    }
  },
  toast: function (s, col) {
    this.toasts.push({ s: s, t: 1.6, col: col || '#fff' });
    if (this.toasts.length > 3) this.toasts.shift();
  },
  drawToasts: function (dt) {
    var c = this.c,
      self = this;
    this.toasts = this.toasts.filter(function (t, i) {
      t.t -= dt;
      var a = Math.min(1, t.t * 3),
        y = 250 - i * 40 - (1.6 - t.t) * 10;
      c.globalAlpha = a;
      self.font(16, '900');
      var w = c.measureText(t.s).width + 40;
      c.fillStyle = 'rgba(60,30,50,.82)';
      rr(c, CFG.W / 2 - w / 2, y - 18, w, 36, 18);
      c.fill();
      self.text(t.s, CFG.W / 2, y, 16, t.col, { stroke: false });
      c.globalAlpha = 1;
      return t.t > 0;
    });
  },
  tap: function (x, y) {
    for (var i = this.btns.length - 1; i >= 0; i--) {
      var b = this.btns[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
    }
    return null;
  }
};
