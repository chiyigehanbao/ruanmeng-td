/**
 * 软萌大作战 V1.0
 * 小游戏发布包静态检查（构建结束时自动执行）
 *
 * © 2026 <著作权人>
 */
// 1) 扫描 dist/wechat、dist/douyin 的 JS，禁止 DOM / 浏览器专有 API / eval 等
// 2) 按官方文档校验 game.json、project.config.json 字段，并检查分包和包体大小
const fs = require('fs'),
  path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
let errors = 0,
  warns = 0;
const E = (m) => {
    errors++;
    console.log('  ✗ ' + m);
  },
  W = (m) => {
    warns++;
    console.log('  ! ' + m);
  };
const RULES = [
  [/\beval\s*\(/, 'eval'],
  [/new\s+Function\s*\(/, 'new Function'],
  [/\bfetch\s*\(/, 'fetch（请用 wx/tt.request）'],
  [/XMLHttpRequest/, 'XMLHttpRequest'],
  [/getComputedStyle/, 'getComputedStyle'],
  [/document\.(body|head|querySelector|getElementsBy|cookie|write|documentElement)/, 'DOM 节点 API'],
  [/\.innerHTML|\.appendChild\(|\.insertBefore\(/, 'DOM 操作'],
  [/navigator\.\w+/, 'navigator.*'],
  [/\bCapacitor\b|CdvPurchase|cordova/, 'App 插件'],
  [/requestGamePayment|requestMidasPayment|requestVirtualPayment|¥|￥/, '付费接口或现金符号'],
  [/充值|内购|月卡|首充|付费礼包/, '付费相关文案'],
  [/\bsessionStorage\b|\bindexedDB\b/, 'Web 存储'],
  [/\bwindow\.(open|location|history|parent|top)\b/, 'window 导航'],
  [/\bimport\s*\(|\bimportScripts\b/, '动态 import'],
  [/\bWorker\s*\(/, 'Web Worker'],
  [/\bPath2D\b|\.roundRect\(|OffscreenCanvas|createImageBitmap|\.filter\s*=\s*'/, '小游戏 Canvas 不支持的 API']
];
// adapter 中提供的垫片
const DOC_OK = ['getElementById', 'createElement', 'hidden', 'addEventListener'],
  WIN_OK = [
    'devicePixelRatio',
    'innerWidth',
    'innerHeight',
    'addEventListener',
    'AudioContext',
    'webkitAudioContext',
    'Shot'
  ];
// 官方文档字段（微信：developers.weixin.qq.com/minigame/dev/reference/configuration/app.html；抖音：developer.open-douyin.com …/mini-game-configuration）
const GAME_KEYS = {
  wechat: [
    'deviceOrientation',
    'desktopDeviceOrientation',
    'showStatusBar',
    'networkTimeout',
    'workers',
    'subpackages',
    'subPackages',
    'parallelPreloadSubpackages',
    'navigateToMiniProgramAppIdList',
    'permission',
    'openDataContext',
    'resizable',
    'displayMode',
    'disableSetUserStorageFromMiniProgram',
    'lockStepOptions',
    'iOSHighPerformance',
    'iOSHighPerformance+',
    'plugins'
  ],
  douyin: [
    'deviceOrientation',
    'showStatusBar',
    'networkTimeout',
    'workers',
    'ttNavigateToMiniGameAppIdList',
    'openDataContext',
    'subPackages',
    'menuButtonStyle',
    'enableIOSHighPerformanceMode',
    'plugins'
  ]
};
const ORIENT = ['portrait', 'landscape', 'landscapeLeft', 'landscapeRight'];
const size = (p) =>
  fs.statSync(p).isDirectory() ? fs.readdirSync(p).reduce((s, f) => s + size(path.join(p, f)), 0) : fs.statSync(p).size;
for (const plat of ['wechat', 'douyin']) {
  const D = path.join(DIST, plat);
  console.log('[' + plat + ']');
  if (!fs.existsSync(D)) {
    E('缺少 ' + D);
    continue;
  }
  const other = plat == 'wechat' ? 'tt' : 'wx';
  const walk = (d) =>
    fs.readdirSync(d).flatMap((f) => {
      const p = path.join(d, f);
      return fs.statSync(p).isDirectory() ? walk(p) : [p];
    });
  for (const f of walk(D).filter((f) => f.endsWith('.js'))) {
    let src = fs.readFileSync(f, 'utf8');
    const rel = path.relative(D, f);
    const cut = src.indexOf('// ===== END ADAPTER =====');
    const body = cut >= 0 ? src.slice(cut) : src;
    const off = cut >= 0 ? src.slice(0, cut).split('\n').length - 1 : 0;
    body.split('\n').forEach((line, i) => {
      const ln = rel + ':' + (i + 1 + off);
      const code = line.replace(/\/\/.*$/, '').replace(/'(?:[^'\\]|\\.)*'/g, "''");
      for (const [re, n] of RULES) if (re.test(code)) E(ln + ' 禁用 API：' + n);
      for (const m of code.matchAll(/\bdocument\.(\w+)/g))
        if (!DOC_OK.includes(m[1])) E(ln + ' document.' + m[1] + ' 未被适配层支持');
      for (const m of code.matchAll(/\bwindow\.(\w+)/g))
        if (!WIN_OK.includes(m[1])) E(ln + ' window.' + m[1] + ' 未被适配层支持');
      if (new RegExp('\\b' + other + '\\.\\w+').test(code)) E(ln + ' 出现其它平台 API：' + other + '.*');
      if (/\btest_shots\b|Shot\.run\(/.test(code) && !/window\.Shot/.test(code)) E(ln + ' 包含测试钩子');
    });
  }
  // game.json
  let gj;
  try {
    gj = JSON.parse(fs.readFileSync(path.join(D, 'game.json'), 'utf8'));
  } catch (e) {
    E('game.json 无法解析');
    continue;
  }
  for (const k of Object.keys(gj)) if (!GAME_KEYS[plat].includes(k)) E('game.json 未知字段 ' + k);
  if (!ORIENT.includes(gj.deviceOrientation)) E('deviceOrientation 非法');
  const subs = gj.subpackages || gj.subPackages || [];
  if (plat == 'douyin' && gj.subpackages) E('抖音须使用驼峰 subPackages');
  let subSize = 0;
  for (const s of subs) {
    if (!s.name || !s.root) E('分包缺少 name/root');
    const R = path.join(D, s.root);
    if (!fs.existsSync(R)) {
      E('分包目录不存在 ' + s.root);
      continue;
    }
    if (s.root.endsWith('/') && !fs.existsSync(path.join(R, 'game.js'))) E('分包 ' + s.root + ' 缺少入口 game.js');
    const ss = size(R);
    if (ss > 4 * 1048576) E('单个分包 ' + s.root + ' 超过 4MB');
    subSize += ss;
  }
  // project.config.json
  let pc;
  try {
    pc = JSON.parse(fs.readFileSync(path.join(D, 'project.config.json'), 'utf8'));
  } catch (e) {
    E('project.config.json 无法解析');
    continue;
  }
  if (!pc.appid) E('缺少 appid');
  else if (plat == 'douyin' && !/^tt[0-9a-f]{16,18}$/.test(pc.appid) && pc.appid !== 'testappid')
    E('抖音 appid 格式异常');
  else if (/^(touristappid|testappid)$/.test(pc.appid))
    W('appid 为占位 ' + pc.appid + '（上线前替换为本游戏自己的 AppID）');
  if (plat == 'wechat' && pc.compileType !== 'game') E('微信 compileType 须为 game');
  if (!pc.projectname) E('缺少 projectname');
  if (!pc.setting) E('缺少 setting');
  if (!fs.existsSync(path.join(D, 'game.js'))) E('缺少入口 game.js');
  const total = size(D),
    main = total - subSize,
    LIM = plat == 'wechat' ? { main: 4, total: 30 } : { main: 4, total: 20 };
  console.log(
    '  主包 ' +
      (main / 1024).toFixed(0) +
      'KB / 分包 ' +
      (subSize / 1024).toFixed(0) +
      'KB / 总 ' +
      (total / 1024).toFixed(0) +
      'KB'
  );
  if (main > LIM.main * 1048576) E('主包超过 ' + LIM.main + 'MB');
  if (total > LIM.total * 1048576) E('总包超过 ' + LIM.total + 'MB');
  // 抖音必接能力检查
  if (plat == 'douyin') {
    const g0 = fs.readFileSync(path.join(D, 'game.js'), 'utf8');
    for (const [re, n] of [
      [/tt\.checkScene/, '侧边栏 checkScene'],
      [/tt\.navigateToScene/, '侧边栏 navigateToScene'],
      [/getLaunchOptionsSync/, '启动参数同步读取'],
      [/sidebar_card/, '侧边栏来源判断'],
      [/getGameRecorderManager/, '录屏'],
      [/createRewardedVideoAd/, '激励视频'],
      [/createInterstitialAd/, '插屏广告']
    ])
      if (!re.test(g0)) E('抖音缺少：' + n);
    const ad = g0.indexOf('__api.onShow(');
    if (ad < 0 || ad > g0.indexOf('// ===== END ADAPTER')) E('tt.onShow 未在启动时同步注册');
  }
  // 广告位占位提示
  const g = fs.readFileSync(path.join(D, 'game.js'), 'utf8');
  if (/adunit-x{8}|'x{18}'/.test(g)) W('激励视频广告位为占位 ID（见 PLATFORM_CFG）');
}
console.log('lint 结果：' + errors + ' 个错误，' + warns + ' 个提示');
if (errors) process.exitCode = 1;
module.exports = { errors };
