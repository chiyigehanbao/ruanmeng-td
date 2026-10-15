/**
 * 软萌大作战 V1.0
 * 特效：粒子 / 飘字 / 震屏 / 补间
 *
 * © 2026 <著作权人>
 */
var FX = {
  ps: [],
  texts: [],
  rings: [],
  bolts: [],
  beams: [],
  shake: 0,
  flash: 0,
  clear: function () {
    this.ps = [];
    this.texts = [];
    this.rings = [];
    this.bolts = [];
    this.beams = [];
  },
  /** 粒子对象池：复用已结束的粒子，避免敌人密集时频繁分配内存 */
  pool: [],
  MAX_PS: 360,
  burst: function (x, y, n, o) {
    o = o || {};
    if (this.ps.length > this.MAX_PS * 0.45) n = Math.ceil(n / 2);
    if (this.ps.length > this.MAX_PS * 0.7) n = Math.max(1, Math.ceil(n / 2));
    for (var i = 0; i < n; i++) {
      if (this.ps.length >= this.MAX_PS) break;
      var a = Math.random() * Math.PI * 2,
        s = (o.speed || 90) * (0.4 + Math.random() * 0.8),
        p = this.pool.pop() || {};
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s - (o.up || 0);
      p.life = p.max = o.life || 0.6;
      p.size = (o.size || 4) * (0.6 + Math.random() * 0.7);
      p.color = o.colors ? o.colors[i % o.colors.length] : o.color || '#fff';
      p.shape = o.shape || 'circle';
      p.g = o.g == null ? 160 : o.g;
      p.rot = Math.random() * 6;
      this.ps.push(p);
    }
  },
  text: function (x, y, txt, o) {
    o = o || {};
    var o2 = {
      x: x + (Math.random() - 0.5) * 10,
      y: y,
      txt: txt,
      life: o.life || 0.8,
      max: o.life || 0.8,
      color: o.color || '#fff',
      size: o.size || 14,
      vy: o.vy || -50
    };
    this.texts.push(o2);
    if (this.texts.length > 60) this.texts.shift();
    return o2;
  },
  ring: function (x, y, r, color, life) {
    this.rings.push({ x: x, y: y, r: r, color: color, life: life || 0.35, max: life || 0.35 });
  },
  update: function (dt) {
    this.shake = Math.max(0, this.shake - dt * 30);
    this.flash = Math.max(0, this.flash - dt * 2);
    var ps = this.ps,
      pool = this.pool,
      k = 0;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
      p.vx *= 0.98;
      p.rot += dt * 4;
      if (p.life > 0) ps[k++] = p;
      else if (pool.length < 400) pool.push(p);
    }
    ps.length = k;
    this.texts = this.texts.filter(function (t) {
      t.life -= dt;
      t.y += t.vy * dt;
      t.vy *= 0.94;
      return t.life > 0;
    });
    ['rings', 'bolts', 'beams'].forEach(function (k) {
      FX[k] = FX[k].filter(function (r) {
        r.life -= dt;
        return r.life > 0;
      });
    });
  },
  draw: function (c) {
    this.rings.forEach(function (r) {
      var k = 1 - r.life / r.max;
      c.globalAlpha = 1 - k;
      c.strokeStyle = r.color;
      c.lineWidth = 4 * (1 - k) + 1;
      c.beginPath();
      c.arc(r.x, r.y, r.r * (0.3 + k * 0.9), 0, 7);
      c.stroke();
      c.fillStyle = r.color;
      c.globalAlpha = (1 - k) * 0.25;
      c.fill();
    });
    c.globalAlpha = 1;
    this.bolts.forEach(function (b) {
      c.globalAlpha = b.life / b.max;
      c.lineCap = 'round';
      [
        [7 * (b.w || 1), b.col || 'rgba(200,170,255,.5)'],
        [3 * (b.w || 1), b.core || '#fff8c0']
      ].forEach(function (st) {
        c.strokeStyle = st[1];
        c.lineWidth = st[0];
        c.beginPath();
        b.pts.forEach(function (p, i) {
          if (!i) {
            c.moveTo(p[0], p[1]);
            return;
          }
          var q = b.pts[i - 1];
          for (var s = 1; s <= 4; s++) {
            var k = s / 4;
            c.lineTo(
              q[0] + (p[0] - q[0]) * k + (s < 4 ? b.j[i * 4 + s] : 0),
              q[1] + (p[1] - q[1]) * k + (s < 4 ? b.j[i * 4 + s + 1] : 0)
            );
          }
        });
        c.stroke();
      });
    });
    c.globalAlpha = 1;
    this.beams.forEach(function (b) {
      var k = b.life / b.max,
        W = b.w || 1;
      c.globalAlpha = k;
      c.lineCap = 'round';
      c.strokeStyle = b.col == 'rainbow' ? VFX.rainbow(0) : b.col || 'rgba(120,255,200,.45)';
      c.lineWidth = (16 * k + 4) * W;
      c.beginPath();
      c.moveTo(b.x, b.y);
      c.lineTo(b.x2, b.y2);
      c.stroke();
      if (W > 1.6) {
        c.strokeStyle = b.col == 'rainbow' ? VFX.rainbow(120) : 'rgba(255,255,255,.35)';
        c.lineWidth = (9 * k + 2) * W;
        c.stroke();
      }
      c.strokeStyle = b.core || '#fff';
      c.lineWidth = (4 * k + 1) * W;
      c.stroke();
    });
    c.globalAlpha = 1;
    this.ps.forEach(function (p) {
      var a = Math.min(1, (p.life / p.max) * 1.5);
      c.globalAlpha = a;
      c.fillStyle = p.color;
      var s = p.size * (0.5 + (0.5 * p.life) / p.max);
      if (p.shape == 'star') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.beginPath();
        for (var i = 0; i < 10; i++) {
          var r = i % 2 ? s * 0.45 : s,
            an = (i * Math.PI) / 5;
          c.lineTo(Math.cos(an) * r, Math.sin(an) * r);
        }
        c.fill();
        c.restore();
      } else if (p.shape == 'heart') {
        c.save();
        c.translate(p.x, p.y);
        c.scale(s / 8, s / 8);
        c.beginPath();
        c.moveTo(0, 6);
        c.bezierCurveTo(-9, -1, -5, -8, 0, -3);
        c.bezierCurveTo(5, -8, 9, -1, 0, 6);
        c.fill();
        c.restore();
      } else if (p.shape == 'spark') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillRect(-s, -s * 0.2, s * 2, s * 0.4);
        c.fillRect(-s * 0.2, -s, s * 0.4, s * 2);
        c.restore();
      } else {
        c.beginPath();
        c.arc(p.x, p.y, s, 0, 7);
        c.fill();
      }
    });
    c.globalAlpha = 1;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    this.texts.forEach(function (t) {
      var k = t.life / t.max,
        sc = k > 0.8 ? 1 + (k - 0.8) * 3 : 1;
      c.globalAlpha = Math.min(1, k * 2.5);
      c.font = Math.round(t.size * sc) + 'px ' + FONT_DISPLAY;
      c.lineWidth = 3.5;
      c.strokeStyle = 'rgba(60,30,40,.85)';
      c.strokeText(t.txt, t.x, t.y);
      c.fillStyle = t.color;
      c.fillText(t.txt, t.x, t.y);
    });
    c.globalAlpha = 1;
  },
  bolt: function (pts, o) {
    o = o || {};
    var pw = o.pw || 1,
      j = [];
    for (var i = 0; i < pts.length * 4 + 4; i++) j.push((Math.random() - 0.5) * (14 + pw * 1.5));
    this.bolts.push({
      pts: pts,
      j: j,
      life: 0.22 + pw * 0.015,
      max: 0.22 + pw * 0.015,
      w: 1 + pw * 0.18,
      col:
        o.col ||
        (pw >= 9
          ? 'rgba(255,200,255,.6)'
          : pw >= 6
            ? 'rgba(120,220,255,.6)'
            : [
                'rgba(200,170,255,.5)',
                'rgba(170,255,190,.5)',
                'rgba(120,200,255,.55)',
                'rgba(200,140,255,.6)',
                'rgba(255,215,90,.6)'
              ][Math.min(4, pw - 1)]),
      core: pw >= 5 ? '#ffffff' : '#fff8c0'
    });
  },
  beam: function (b) {
    var pw = b.pw || 1;
    this.beams.push({
      x: b.x,
      y: b.y,
      x2: b.x2,
      y2: b.y2,
      life: 0.25 + pw * 0.02,
      max: 0.25 + pw * 0.02,
      w: 1 + pw * 0.2,
      col: b.col || (pw >= 9 ? 'rainbow' : pw >= 6 ? 'rgba(140,230,255,.5)' : 'rgba(120,255,200,.45)'),
      core: b.core || '#fff'
    });
  }
};
// 补间
var Tween = {
  list: [],
  to: function (o, props, dur, ease, done) {
    var st = {};
    for (var k in props) st[k] = o[k];
    this.list.push({ o: o, st: st, p: props, d: dur, t: 0, e: ease || 'outBack', done: done });
  },
  E: {
    linear: function (k) {
      return k;
    },
    outBack: function (k) {
      var s = 1.70158;
      k -= 1;
      return k * k * ((s + 1) * k + s) + 1;
    },
    outCubic: function (k) {
      return 1 - Math.pow(1 - k, 3);
    },
    outElastic: function (k) {
      return k == 0 || k == 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * 2.094) + 1;
    }
  },
  update: function (dt) {
    this.list = this.list.filter(function (tw) {
      tw.t += dt;
      var k = Math.min(1, tw.t / tw.d),
        e = Tween.E[tw.e](k);
      for (var p in tw.p) tw.o[p] = tw.st[p] + (tw.p[p] - tw.st[p]) * e;
      if (k >= 1) {
        tw.done && tw.done();
        return false;
      }
      return true;
    });
  }
};
