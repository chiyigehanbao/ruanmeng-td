/**
 * 软萌大作战 V1.0
 * 分级攻击特效：随伙伴等级（Lv1-5）/ 融合（pw6-8）/ 究极（pw9+）逐级增强
 *
 * © 2026 <著作权人>
 */
var VFX = {
  TIER: ['#ffffff', '#8ff0a0', '#6fc8ff', '#c88bff', '#ffd23f'],
  RB: ['#ff6f8f', '#ffb020', '#ffe066', '#6ee07a', '#4fc8ff', '#8a7bff', '#d07bff'],
  tierCol: function (lv) {
    return this.TIER[Math.max(0, Math.min(4, lv - 1))];
  },
  rainbow: function (o) {
    return 'hsl(' + Math.floor(((UI.t || 0) * 160 + (o || 0)) % 360) + ',95%,66%)';
  },
  // 弹道主色：基础按等级，融合按融合色，究极彩虹
  col: function (b) {
    var pw = b.pw || 1;
    if (pw >= 9) return this.rainbow(b.life * 300);
    if (pw >= 6 && b.src) return CFG.TOWERS[b.src.type].color;
    return this.tierCol(pw);
  },
  cols: function (pw, src) {
    if (pw >= 9) return this.RB;
    if (pw >= 6 && src) return [CFG.TOWERS[src.type].color, '#ffffff', '#ffd23f'];
    return [this.tierCol(pw), '#ffffff', shade(this.tierCol(pw), -0.2)];
  },
  scale: function (pw) {
    return 1 + 0.13 * (Math.min(pw, 5) - 1) + (pw > 5 ? 0.2 + (pw - 6) * 0.06 : 0) + (pw >= 9 ? 0.2 : 0);
  },
  glow: function (c, x, y, r, col, a) {
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = a == null ? 0.8 : a;
    var g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, 7);
    c.fill();
    c.restore();
  },
  // 拖尾：Lv2 起出现，Lv3 三重拖尾，Lv5 金色，融合双螺旋，究极彩虹
  trail: function (c, b) {
    var pw = b.pw || 1;
    b.tr = b.tr || [];
    b.tr.push([b.x, b.y]);
    var n = Math.min(18, 2 + pw * 2);
    while (b.tr.length > n) b.tr.shift();
    if (pw < 2 || b.tr.length < 2) return;
    var col = this.col(b),
      T = b.tr,
      w = 2 + pw * 0.9;
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.lineCap = 'round';
    var lanes = pw >= 3 && pw < 6 ? [-1, 0, 1] : [0];
    lanes.forEach(function (ln) {
      for (var i = 1; i < T.length; i++) {
        var k = i / T.length,
          dx = T[i][0] - T[i - 1][0],
          dy = T[i][1] - T[i - 1][1],
          l = Math.hypot(dx, dy) || 1,
          ox = (-dy / l) * ln * 3 * (1 - k),
          oy = (dx / l) * ln * 3 * (1 - k);
        c.globalAlpha = k * (ln ? 0.45 : 0.8);
        c.strokeStyle = col;
        c.lineWidth = w * k * (ln ? 0.5 : 1);
        c.beginPath();
        c.moveTo(T[i - 1][0] + ox, T[i - 1][1] + oy);
        c.lineTo(T[i][0] + ox, T[i][1] + oy);
        c.stroke();
      }
    });
    if (pw >= 6) {
      var c2 = pw >= 9 ? this.rainbow(180) : '#ffffff';
      for (var j = 1; j < T.length; j++) {
        var ph = b.life * 30 + j;
        [1, -1].forEach(function (s) {
          c.globalAlpha = (j / T.length) * 0.7;
          c.strokeStyle = s > 0 ? col : c2;
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(T[j - 1][0] + Math.sin(ph - 1) * 4 * s, T[j - 1][1] + Math.cos(ph - 1) * 4 * s);
          c.lineTo(T[j][0] + Math.sin(ph) * 4 * s, T[j][1] + Math.cos(ph) * 4 * s);
          c.stroke();
        });
      }
    }
    c.restore();
    if (pw >= 4 && Math.random() < 0.25 + pw * 0.04)
      FX.burst(b.x, b.y, 1, {
        colors: this.cols(pw, b.src),
        shape: pw >= 5 ? 'star' : 'spark',
        speed: 25,
        size: 2 + pw * 0.35,
        g: 0,
        life: 0.35
      });
  },
  muzzle: function (x, y, ang, pw, src) {
    var cs = this.cols(pw, src),
      n = 2 + pw * 2;
    FX.burst(x + Math.cos(ang || 0) * 4, y + Math.sin(ang || 0) * 4, FX.ps.length > 200 ? 2 : Math.min(12, n), {
      colors: cs,
      shape: pw >= 5 ? 'star' : 'spark',
      speed: 40 + Math.min(pw, 7) * 10,
      size: 2.6 + Math.min(pw, 7) * 0.35,
      g: 0,
      life: 0.18 + Math.min(pw, 7) * 0.015
    });
    if (pw >= 3)
      FX.ring(x + Math.cos(ang || 0) * 3, y + Math.sin(ang || 0) * 3, 6 + Math.min(pw, 7) * 2, cs[0], 0.2 + pw * 0.015);
    if (pw >= 9) FX.ring(x, y, 34, cs[(Math.random() * 7) | 0], 0.35);
  },
  impact: function (x, y, pw, src, base) {
    pw = pw || 1;
    var cs = base ? [base].concat(this.cols(pw, src)) : this.cols(pw, src);
    var busy = FX.ps.length > 260;
    FX.burst(x, y, busy ? 3 : Math.min(30, 4 + pw * 2.5), {
      colors: cs,
      shape: pw >= 4 ? 'star' : 'spark',
      speed: 60 + pw * 14,
      size: 3 + pw * 0.5,
      g: pw >= 5 ? 0 : 80,
      life: 0.3 + pw * 0.03
    });
    if (pw >= 2) FX.ring(x, y, 8 + pw * 3.2, cs[0], 0.22 + pw * 0.02);
    if (pw >= 6) FX.ring(x, y, 14 + pw * 3, '#ffffff', 0.3);
    if (pw >= 5) FX.shake = Math.max(FX.shake, Math.min(4, (pw - 4) * 0.9));
    if (pw >= 9) FX.flash = Math.max(FX.flash, 0.06);
  }
};
