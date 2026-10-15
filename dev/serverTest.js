/**
 * 软萌大作战 V1.0
 * 服务端接口自测（开发用）：扭蛋保底与排行榜
 *
 * © 2026 <著作权人>
 */
process.env.DB_FILE = '/tmp/rm_test_db.json';
try {
  require('fs').unlinkSync(process.env.DB_FILE);
} catch (e) {}
const { server } = require('../server/index.js');
server.listen(0, async () => {
  const port = server.address().port,
    base = 'http://127.0.0.1:' + port;
  const J = async (m, p, b) => {
    const r = await fetch(base + p, {
      method: m,
      headers: { 'content-type': 'application/json' },
      body: b ? JSON.stringify(b) : undefined
    });
    return [r.status, await r.json().catch(() => null)];
  };
  const ok = (c, m) => {
    console.log((c ? '✓ ' : '✗ ') + m);
    if (!c) process.exitCode = 1;
  };
  let ssr = 0,
    maxGap = 0,
    gap = 0;
  for (let i = 0; i < 30; i++) {
    const [, g] = await J('POST', '/api/gacha/draw', { uid: 'g1', n: 10, sizes: { SSR: 2, SR: 5, R: 10, N: 3 } });
    g.items.forEach((x) => {
      gap++;
      if (x.rar == 'SSR') {
        ssr++;
        maxGap = Math.max(maxGap, gap);
        gap = 0;
      }
    });
    ok(
      g.items.some((x) => x.rar == 'SSR' || x.rar == 'SR'),
      '十连保底 SR+ #' + i
    );
  }
  ok(Math.max(maxGap, gap) <= 50, '300 抽 SSR ' + ssr + ' 次，最长间隔 ' + Math.max(maxGap, gap) + ' ≤ 50');
  await J('POST', '/api/lb/submit', { uid: 'a', name: '甲', board: 'endless', score: 30 });
  await J('POST', '/api/lb/submit', { uid: 'b', name: '乙', board: 'endless', score: 50 });
  await J('POST', '/api/lb/submit', { uid: 'a', name: '甲', board: 'endless', score: 20 });
  const [, v] = await J('GET', '/api/lb/query?board=endless&uid=a');
  ok(v.list[0].uid == 'b' && v.list[1].score == 30, '排行榜排序/只保留最好成绩');
  server.close();
  process.exit();
});
