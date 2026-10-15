/**
 * 软萌大作战 V1.0
 * 数值模拟器（开发用）：批量模拟关卡与无尽模式，输出推进度与通关统计
 *
 * © 2026 <著作权人>
 */
global.localStorage = {
  s: {},
  getItem(k) {
    return this.s[k] ?? null;
  },
  setItem(k, v) {
    this.s[k] = v;
  }
};
const fs = require('fs');
eval(
  [
    'data/config',
    'core/storage',
    'platform/platform',
    'entities/path',
    'data/content',
    'core/meta',
    'data/upgrades',
    'core/game'
  ]
    .map((f) => fs.readFileSync(__dirname + '/../src/' + f + '.js', 'utf8'))
    .join('\n') + ';global.G={Game,Save,CFG,UPGRADES};'
);
Save.load();
Meta.init();
function merge(g, sk) {
  var did = true,
    n = 0;
  while (did && n++ < 200) {
    did = false;
    for (var a of g.towers)
      for (var b of g.towers)
        if (g.fuseResult(a, b) || g.canFeed(a, b)) {
          g.move(a, b.c, b.r);
          did = true;
          break;
        }
    if (did) continue;
    var ts = g.towers.slice().sort((x, y) => x.lv - y.lv);
    for (const a of ts)
      for (const b of ts)
        if (g.canMerge(a, b)) {
          g.move(a, b.c, b.r);
          if (g.pendingBranch) g.chooseBranch(Math.random() < 0.5 ? 'A' : 'B');
          did = true;
          break;
        }
  }
}
/** 单局模拟：P 为操作水平（1=最优，0.6=休闲：较少购买，仅每波合成） */
function run(level, pool, cards, maxW, P) {
  var W = {},
    g = new Game(level, {
      noMeta: true,
      hero: null,
      pool: pool,
      emit: function (n, d) {
        if (n == 'leak' && process.env.LK) {
          var k = (d.boss ? 'BOSS' : d.type || '?') + '@' + g.wave;
          (global.LKS = global.LKS || {})[k] = (global.LKS[k] || 0) + d.leak;
        }
        if (n == 'die' && d && d.e && !d.e.isMini) {
          (W[g.wave] = W[g.wave] || []).push(d.e.prog || 0);
        }
      }
    }),
    mx = { f: 0, u: 0 },
    hpLost = 0,
    firstLossW = 0;
  for (var w = 0; w < maxW; w++) {
    for (var k = 0; k < 3; k++) {
      while (g.buy());
      merge(g);
    }
    if (!g.freeCells().length && g.gold > g.cost() * 2) {
      var low = g.towers.filter((t) => !CFG.TOWERS[t.type].parts).sort((a, b) => a.lv - b.lv)[0];
      if (low && low.lv <= 2) {
        g.sell(low);
        while (g.buy());
        merge(g);
      }
    }
    g.towers.forEach((t) => {
      var D = CFG.TOWERS[t.type];
      if (D.ultimate) {
        if (!mx.u) mx.u = g.wave + 1;
      } else if (D.fusion) mx.f = Math.max(mx.f, t.lv);
    });
    var h0 = g.hp;
    g.startWave();
    for (var i = 0; i < 40000 && g.state == 'wave'; i++) {
      g.update(+process.env.DT || 0.03);
    }
    if (g.hp < h0) {
      hpLost += h0 - g.hp;
      if (!firstLossW) firstLossW = g.wave;
    }
    if (g.state == 'lose') return { r: 'L' + g.wave, W, hpLost, firstLossW, mx };
    if (g.state == 'win') return { r: 'W' + g.stars(), W, hpLost, firstLossW, mx };
    if (g.state == 'pick') {
      if (cards && process.env.BLK && process.env.BLK.split(',').indexOf(g.choices[0].id) >= 0) g.state = 'prep';
      else if (cards) {
        if (process.env.CLOG) (global.CL = global.CL || {})[g.choices[0].id] = (global.CL[g.choices[0].id] || 0) + 1;
        g.pick(g.choices[0]);
      } else g.state = 'prep';
    }
  }
  return { r: '>' + maxW, W, hpLost, firstLossW, mx };
}
var T = {
  star: ['deer', 'unicorn', 'dragon', 'penguin', 'cat'],
  basic: ['cat', 'penguin', 'bear', 'bunny', 'fox'],
  starter: ['cat'],
  ch1: ['cat', 'penguin', 'bear'],
  tox: ['frog', 'fox', 'chick', 'cat', 'bear'],
  ctrl: ['hedgehog', 'koala', 'owl', 'cat', 'hamster'],
  ice: ['penguin', 'bunny', 'cat', 'bear', 'fox'],
  phoenix: ['bear', 'fox', 'hamster', 'cat', 'penguin'],
  raijin: ['penguin', 'bunny', 'hedgehog', 'koala', 'cat']
};
function report(tag, rs) {
  var all = {};
  rs.forEach((x) => {
    for (var w in x.W) {
      (all[w] = all[w] || []).push(...x.W[w]);
    }
  });
  var pw = Object.keys(all)
    .sort((a, b) => a - b)
    .map((w) => w + ':' + (((all[w].reduce((a, b) => a + b, 0) / all[w].length) * 100) | 0) + '%')
    .join(' ');
  var tot = [].concat(...Object.values(all));
  var early = tot.length ? ((tot.filter((v) => v < 0.15).length / tot.length) * 100).toFixed(0) : 0;
  var avg = tot.length ? ((tot.reduce((a, b) => a + b, 0) / tot.length) * 100).toFixed(0) : 0;
  console.log(
    tag,
    'res',
    rs.map((x) => x.r + (x.mx.u ? 'U' + x.mx.u : x.mx.f ? 'F' + x.mx.f : '')).join(' '),
    '| avgProg',
    avg + '%',
    '| early<15%',
    early + '%',
    '| hpLost',
    rs.map((x) => x.hpLost).join(','),
    '| 1stLeakW',
    rs.map((x) => x.firstLossW).join(',')
  );
  console.log('   perWave', pw);
}
var N = +process.argv[2] || 3,
  mode = process.argv[3] || 'ch',
  teams = (process.argv[4] || 'basic,tox,ctrl').split(',');
if (mode == 'ch') {
  (process.argv[5] || '1-4,2-8,4-4,6-8').split(',').forEach((spec) => {
    var [id, tm] = spec.split(':'),
      [c, l] = id.split('-').map(Number),
      L = CFG.levelInfo(c, l);
    (tm ? [tm] : teams).forEach((k) => {
      [true, false].forEach((cd) => {
        var rs = [];
        for (var i = 0; i < N; i++) rs.push(run(L, T[k], cd, 40));
        report(id + ' ' + k + (cd ? ' cards' : ' nocard'), rs);
      });
    });
  });
}
if (mode == 'end') {
  var E = CFG.endlessInfo();
  E.mods = [];
  teams.forEach((k) => {
    var rs = [];
    for (var i = 0; i < N; i++) {
      var x = run(E, T[k], true, +(process.argv[5] || 70));
      rs.push(x);
      console.log(
        'RUN',
        k,
        x.r,
        'ult@',
        x.mx.u || 0,
        'fz',
        x.mx.f,
        'hp',
        x.hpLost,
        'prog20-40',
        (function () {
          var a = [];
          for (var w = 20; w <= 40; w++) if (x.W[w]) a.push(...x.W[w]);
          return a.length ? (((a.reduce((p, q) => p + q, 0) / a.length) * 100) | 0) + '%' : '-';
        })()
      );
    }
    report('endless ' + k, rs);
  });
}
process.on('exit', () => {
  if (global.CL) console.log(JSON.stringify(global.CL));
});

process.on('exit', () => {
  if (global.LKS)
    console.log(
      JSON.stringify(
        Object.entries(global.LKS)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
      )
    );
});
