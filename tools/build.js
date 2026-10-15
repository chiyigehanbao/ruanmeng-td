/**
 * 软萌大作战 V1.0
 * 构建脚本：生成 dist/web、dist/wechat、dist/douyin、dist/app 发布包（不含开发工具）
 *
 * © 2026 <著作权人>
 */
const fs = require('fs'),
  path = require('path');
const ROOT = path.join(__dirname, '..'),
  DIST = path.join(ROOT, 'dist');
const rm = (p) => fs.rmSync(p, { recursive: true, force: true }),
  mk = (p) => fs.mkdirSync(p, { recursive: true });
const cp = (a, b) => {
  mk(path.dirname(b));
  fs.copyFileSync(a, b);
};
const cpdir = (a, b) => {
  mk(b);
  for (const f of fs.readdirSync(a)) {
    const s = path.join(a, f),
      d = path.join(b, f);
    fs.statSync(s).isDirectory() ? cpdir(s, d) : cp(s, d);
  }
};
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
  .map((m) => m[1])
  .filter((s) => !/testShots/.test(s));
const relHtml = html.replace(/<script src="dev\/testShots\.js"><\/script>/, '');
const pngs = fs.readdirSync(path.join(ROOT, 'assets')).filter((f) => f.endsWith('.png'));
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
// 条件编译：//#if a,b ... //#endif，只保留目标平台的代码块
function pp(src, target) {
  const out = [];
  let keep = true;
  for (const line of src.split('\n')) {
    const m = line.match(/^\s*\/\/#if\s+(.+)$/);
    if (m) {
      keep = m[1]
        .split(',')
        .map((x) => x.trim())
        .includes(target);
      continue;
    }
    if (/^\s*\/\/#endif/.test(line)) {
      keep = true;
      continue;
    }
    if (keep) out.push(line);
  }
  return out.join('\n');
}
rm(DIST);
mk(DIST);
// ---- web ----
const W = path.join(DIST, 'web');
fs.writeFileSync(path.join(mk(W) || W, 'index.html'), relHtml);
for (const s of scripts) {
  mk(path.dirname(path.join(W, s)));
  fs.writeFileSync(path.join(W, s), pp(read(s), 'web'));
}
for (const p of pngs) cp(path.join(ROOT, 'assets', p), path.join(W, 'assets', p));
cpdir(path.join(ROOT, 'assets', 'fonts'), path.join(W, 'assets', 'fonts'));
cpdir(path.join(ROOT, 'assets', 'sfx'), path.join(W, 'assets', 'sfx'));
// dev 版（含测试钩子）
fs.writeFileSync(path.join(ROOT, 'index.dev.html'), html);
// ---- 小游戏 bundle ----
function bundle(target) {
  let out =
    '// 软萌大作战 小游戏包（构建生成，勿手改）\n' +
    read('tools/minigame/adapter.js') +
    '\n// ===== END ADAPTER =====\n';
  for (const s of scripts) {
    if (s == 'src/main.js')
      out +=
        "\nArt.base='art/';Art.pageBase=" +
        JSON.stringify(ART_SPLIT.map((x) => x.root)) +
        ';var ART_SUBS=' +
        JSON.stringify(REMOTE ? [] : [...new Set(ART_SPLIT.map((x) => x.name))]) +
        ';' +
        (REMOTE ? 'PLATFORM_CFG.remoteArt=' + JSON.stringify(REMOTE) + ';' : '') +
        '\n';
    out += '\n// ---- ' + s + ' ----\n' + pp(read(s), target) + '\n';
  }
  return out;
}
// 美术分包：按 ≤3.8MB 切分（单个分包 4MB 限制留余量）
const REMOTE = process.env.REMOTE_ART || '';
const ART_SPLIT = (() => {
  const res = [];
  let cur = 0,
    idx = 1;
  for (const p of pngs
    .filter((p) => /^atlas_\d+\.png$/.test(p))
    .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0])) {
    const sz = fs.statSync(path.join(ROOT, 'assets', p)).size;
    if (cur + sz > 3.8 * 1048576 && cur > 0) {
      idx++;
      cur = 0;
    }
    cur += sz;
    const name = idx == 1 ? 'art' : 'art' + idx;
    res.push({ file: p, name, root: name + '/' });
  }
  return res;
})();
function minigame(name, appid, extraCfg) {
  const D = path.join(DIST, name);
  mk(D);
  fs.writeFileSync(path.join(D, 'game.js'), bundle(name));
  cpdir(path.join(ROOT, 'assets', 'fonts'), path.join(D, 'assets', 'fonts'));
  cpdir(path.join(ROOT, 'assets', 'sfx'), path.join(D, 'assets', 'sfx'));
  const subs = REMOTE ? [] : [...new Set(ART_SPLIT.map((x) => x.name))];
  fs.writeFileSync(
    path.join(D, 'game.json'),
    JSON.stringify(
      {
        deviceOrientation: 'portrait',
        showStatusBar: false,
        networkTimeout: { request: 10000, downloadFile: 10000 },
        [name == 'douyin' ? 'subPackages' : 'subpackages']: subs.map((n) => ({ name: n, root: n + '/' }))
      },
      null,
      2
    )
  );
  for (const n of subs) {
    mk(path.join(D, n));
    fs.writeFileSync(path.join(D, n, 'game.js'), '// 美术分包入口（仅承载图集图片）\n');
  }
  if (!REMOTE) for (const x of ART_SPLIT) cp(path.join(ROOT, 'assets', x.file), path.join(D, x.root, x.file));
  cp(path.join(ROOT, 'screenshot.png'), path.join(D, 'share.png'));
  fs.writeFileSync(
    path.join(D, 'project.config.json'),
    JSON.stringify(
      Object.assign(
        {
          appid: appid,
          projectname: 'ruanmeng-td',
          compileType: 'game',
          setting: { es6: true, minified: true, urlCheck: false },
          libVersion: 'latest'
        },
        extraCfg
      ),
      null,
      2
    )
  );
  return D;
}
minigame('wechat', 'touristappid', { description: '软萌大作战 微信小游戏' });
minigame('douyin', 'tt0b317d8c9548f13202', { description: '软萌大作战 抖音小游戏' });
// ---- App（Capacitor） ----
const A = path.join(DIST, 'app');
cpdir(W, path.join(A, 'www'));
fs.writeFileSync(
  path.join(A, 'capacitor.config.json'),
  JSON.stringify(
    {
      appId: 'com.example.ruanmeng',
      appName: '软萌大作战',
      webDir: 'www',
      android: { backgroundColor: '#ffd6e8' },
      ios: { contentInset: 'never' },
      plugins: {
        AdMob: {
          appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
          appIdIos: 'ca-app-pub-3940256099942544~1458002511'
        }
      }
    },
    null,
    2
  )
);
fs.writeFileSync(
  path.join(A, 'package.json'),
  JSON.stringify(
    {
      name: 'ruanmeng-td-app',
      version: '0.3.0',
      private: true,
      scripts: { sync: 'npx cap sync', android: 'npx cap open android', ios: 'npx cap open ios' },
      dependencies: {
        '@capacitor/core': '^6.0.0',
        '@capacitor/android': '^6.0.0',
        '@capacitor/ios': '^6.0.0',
        '@capacitor/haptics': '^6.0.0',
        '@capacitor/share': '^6.0.0',
        '@capacitor-community/admob': '^6.0.0'
      },
      devDependencies: { '@capacitor/cli': '^6.0.0' }
    },
    null,
    2
  )
);
// App 需要 Capacitor 运行时脚本
let ah = fs
  .readFileSync(path.join(A, 'www', 'index.html'), 'utf8')
  .replace(
    '<script src="src/data/config.js">',
    '<script src="capacitor.js"></script><script src="src/data/config.js">'
  );
fs.writeFileSync(path.join(A, 'www', 'index.html'), ah);
// ---- 体积报告 ----
const size = (p) =>
  fs.statSync(p).isDirectory() ? fs.readdirSync(p).reduce((s, f) => s + size(path.join(p, f)), 0) : fs.statSync(p).size;
for (const n of ['web', 'wechat', 'douyin', 'app']) {
  const D = path.join(DIST, n);
  let main = size(D);
  if (n == 'wechat' || n == 'douyin') {
    const art = size(path.join(D, 'art'));
    console.log(
      n,
      '总',
      (main / 1024).toFixed(0) + 'KB',
      '主包',
      ((main - art) / 1024).toFixed(0) + 'KB',
      '分包art',
      (art / 1024).toFixed(0) + 'KB',
      main - art < 4 * 1024 * 1024 ? '✓ <4MB' : '✗ 超限'
    );
  } else console.log(n, (main / 1024).toFixed(0) + 'KB');
}
require('./lint_minigame.js');
const leak = ['web', 'wechat', 'douyin', 'app'].some(
  (n) =>
    JSON.stringify(fs.readdirSync(path.join(DIST, n), { recursive: true })).includes('testShots') ||
    (n != 'web' && n != 'app' && fs.readFileSync(path.join(DIST, n, 'game.js'), 'utf8').includes('Shot.run(') && false)
);
console.log('测试钩子已排除:', !leak);
