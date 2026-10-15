/**
 * 软萌大作战 V1.0
 * 敌人行进路线工具：按距离取坐标，支持多条路线
 *
 * © 2026 <著作权人>
 */
function makePath(pts) {
  var P = { pts: pts, segs: [], len: 0 },
    L = 0;
  for (var i = 0; i < pts.length - 1; i++) {
    var dx = pts[i + 1][0] - pts[i][0],
      dy = pts[i + 1][1] - pts[i][1],
      l = Math.hypot(dx, dy);
    P.segs.push({ x: pts[i][0], y: pts[i][1], dx: dx / l, dy: dy / l, l: l, s: L });
    L += l;
  }
  P.len = L;
  P.at = function (d) {
    var sg = this.segs;
    if (d <= 0) return { x: sg[0].x, y: sg[0].y };
    for (var i = 0; i < sg.length; i++) {
      var s = sg[i];
      if (d <= s.s + s.l) {
        var k = d - s.s;
        return { x: s.x + s.dx * k, y: s.y + s.dy * k };
      }
    }
    var e = sg[sg.length - 1];
    return { x: e.x + e.dx * e.l, y: e.y + e.dy * e.l };
  };
  return P;
}
var Path = makePath(CFG.PATH);
