/**
 * 软萌大作战 V1.0
 * 服务端：扭蛋记录（含保底）与排行榜，纯 Node 实现。启动：node server/index.js
 *
 * © 2026 <著作权人>
 */
const http = require('http'),
  crypto = require('crypto'),
  fs = require('fs'),
  path = require('path'),
  url = require('url');
const CFG = { port: +process.env.PORT || 8787, gacha: { pity: 50, rates: { SSR: 0.03, SR: 0.15, R: 0.42, N: 0.4 } } };
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.json');
let db = { pity: {}, lb: {} };
try {
  db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
} catch (e) {}
let dirty = false;
const save = () => {
  dirty = true;
};
setInterval(() => {
  if (dirty) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db));
    dirty = false;
  }
}, 1000).unref();
function draw(uid, n, sizes) {
  let pity = db.pity[uid] || 0;
  const G = CFG.gacha,
    items = [];
  for (let i = 0; i < n; i++) {
    pity++;
    const x = crypto.randomInt(1e6) / 1e6;
    let rar =
      x < G.rates.SSR
        ? 'SSR'
        : x < G.rates.SSR + G.rates.SR
          ? 'SR'
          : x < G.rates.SSR + G.rates.SR + G.rates.R
            ? 'R'
            : 'N';
    if (pity >= G.pity) rar = 'SSR';
    if (n == 10 && i == 9 && !items.some((t) => t.rar == 'SSR' || t.rar == 'SR')) rar = 'SR';
    if (rar == 'SSR') pity = 0;
    items.push({ rar, idx: crypto.randomInt(Math.max(1, (sizes && sizes[rar]) || 1)) });
  }
  db.pity[uid] = pity;
  save();
  return { items, pity };
}
function lbSubmit(board, uid, name, score) {
  const b = (db.lb[board] = db.lb[board] || {});
  if (!b[uid] || b[uid].score < score) {
    b[uid] = { uid, name: String(name || '玩家').slice(0, 12), score: Math.floor(+score || 0) };
    save();
  }
}
function lbQuery(board, uid) {
  const all = Object.values(db.lb[board] || {}).sort((a, b) => b.score - a.score);
  const top = all.slice(0, 50);
  const me = all.findIndex((x) => x.uid === uid);
  if (me >= 50) top.push(Object.assign({ rank: me + 1 }, all[me]));
  return top;
}
const routes = {
  'POST /api/gacha/draw': (b) => {
    const n = b.n == 10 ? 10 : 1;
    return draw(String(b.uid), n, b.sizes);
  },
  'POST /api/lb/submit': (b) => {
    lbSubmit(String(b.board), String(b.uid), b.name, b.score);
    return { ok: true };
  },
  'GET /api/lb/query': (b, q) => ({ list: lbQuery(String(q.board), String(q.uid || '')) }),
  'GET /health': () => ({ ok: true })
};
const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true),
    key = req.method + ' ' + u.pathname;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  let raw = '';
  req.on('data', (c) => {
    raw += c;
    if (raw.length > 1e5) req.destroy();
  });
  req.on('end', async () => {
    const h = routes[key];
    if (!h) {
      res.statusCode = 404;
      res.end('{"err":"not found"}');
      return;
    }
    try {
      const body = raw ? JSON.parse(raw) : {};
      const out = await h(body, u.query);
      if (out && out.__raw !== undefined) {
        res.end(out.__raw);
        return;
      }
      res.statusCode = (out && out.__status) || 200;
      if (out) delete out.__status;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(out));
    } catch (e) {
      res.statusCode = 400;
      res.end(JSON.stringify({ err: e.message }));
    }
  });
});
if (require.main === module) server.listen(CFG.port, () => console.log('server on :' + CFG.port));
module.exports = { server, draw, CFG, db };
