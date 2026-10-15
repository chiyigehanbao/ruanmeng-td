/**
 * 软萌大作战 V1.0
 * 平台抽象层：运行时识别 web / 微信小游戏(wx) / 抖音小游戏(tt) / 原生 App 壳
 *
 * © 2026 <著作权人>
 */
// 所有广告、分享、排行榜、震动都只通过 Platform 调用；具体实现在下方 ADAPTERS 中。
// 需要填写的 ID 全部集中在 PLATFORM_CFG（见 README）。
var PLATFORM_CFG = {
  wechat: {
    rewardedAdUnitId: 'adunit-xxxxxxxxxxxxxxxx',
    interstitialAdUnitId: 'adunit-yyyyyyyyyyyyyyyy',
    bannerAdUnitId: 'adunit-zzzzzzzzzzzzzzzz',
    shareImage: 'share.png'
  },
  douyin: {
    appId: 'tt0b317d8c9548f13202',
    rewardedAdUnitId: 'xxxxxxxxxxxxxxxxxx',
    interstitialAdUnitId: 'yyyyyyyyyyyyyyyyyy',
    bannerAdUnitId: 'zzzzzzzzzzzzzzzzzz',
    shareImage: 'share.png'
  },
  app: {
    admobRewardedAndroid: 'ca-app-pub-3940256099942544/5224354917',
    admobRewardedIOS: 'ca-app-pub-3940256099942544/1712485313',
    admobInterstitialAndroid: 'ca-app-pub-3940256099942544/1033173712',
    admobInterstitialIOS: 'ca-app-pub-3940256099942544/4411468910'
  },
  // 广告频控：插屏仅在关卡结算后展示；前若干次启动不展示；两次插屏最短间隔（秒）；看完激励视频后的冷却（秒）
  interstitial: { minSessions: 3, minGapSec: 150, everyN: 2, afterRewardedSec: 60 },
  // 菜单底部横幅（可选，默认关闭；战斗中永不展示）
  bannerEnabled: false,
  // 后端开关：'mock' = 本地模拟；'server' = 扭蛋记录/排行榜走 server/（见 README）
  mode: 'mock',
  // 远程美术 CDN（可选）：填 https://cdn.xxx.com/ruanmeng/art/ 后用 REMOTE_ART=该地址 node tools/build.js 构建，图集不进包体
  remoteArt: '',
  serverUrl: 'http://127.0.0.1:8787'
};
function detectEnv() {
  if (typeof tt !== 'undefined' && tt.createRewardedVideoAd) return 'douyin';
  if (typeof wx !== 'undefined' && wx.createRewardedVideoAd) return 'wechat';
  if (
    typeof window !== 'undefined' &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform()
  )
    return 'app';
  return 'web';
}
var ADAPTERS = {
  // ---------- 浏览器：全部模拟 ----------
  web: {
    init: function () {},
    boot: function (cb) {
      cb();
    },
    safe: function () {
      var z = { top: 0, bottom: 0, left: 0, right: 0 };
      if (typeof document === 'undefined' || !document.body || typeof getComputedStyle === 'undefined') return z;
      var d = this._probe;
      if (!d) {
        d = this._probe = document.createElement('div');
        d.style.cssText =
          'position:fixed;left:0;top:0;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
        document.body.appendChild(d);
      }
      var cs = getComputedStyle(d);
      return {
        top: parseFloat(cs.paddingTop) || 0,
        right: parseFloat(cs.paddingRight) || 0,
        bottom: parseFloat(cs.paddingBottom) || 0,
        left: parseFloat(cs.paddingLeft) || 0
      };
    },
    req: function (method, url, body, fin) {
      fetch(url, {
        method: method,
        headers: { 'content-type': 'application/json' },
        body: method == 'GET' ? undefined : JSON.stringify(body || {})
      })
        .then(function (r) {
          return r.ok ? r.json() : Promise.reject(r.status);
        })
        .then(
          function (d) {
            fin(null, d);
          },
          function (e) {
            fin(e || 'fail');
          }
        );
    },
    ad: function (pl, ok, fail) {
      setTimeout(ok, 500);
    },
    inter: function () {},
    banner: function (show) {},
    share: function (o, cb) {
      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title: o.title, text: o.text, url: location.href }).then(
          function () {
            cb(true);
          },
          function () {
            cb(false);
          }
        );
      } else
        setTimeout(function () {
          cb(true);
        }, 300);
    },
    vibrate: function (ms) {
      try {
        navigator.vibrate && navigator.vibrate(ms || 15);
      } catch (e) {}
    }
  },
  // ---------- App（Capacitor：@capacitor-community/admob + AdMob） ----------
  app: {
    init: function () {
      var P = window.Capacitor.Plugins || {};
      this.admob = P.AdMob;
      if (this.admob) this.admob.initialize({ initializeForTesting: true }).catch(function () {});
    },
    boot: function (cb) {
      cb();
    },
    safe: function () {
      return ADAPTERS.web.safe();
    },
    req: function (m, u, b, f) {
      ADAPTERS.web.req(m, u, b, f);
    },
    ad: function (pl, ok, fail) {
      var A = this.admob;
      if (!A) {
        setTimeout(ok, 300);
        return;
      }
      var ios = window.Capacitor.getPlatform() == 'ios',
        C = PLATFORM_CFG.app,
        done = false;
      var h = A.addListener('onRewardedVideoAdReward', function () {
        done = true;
      });
      A.prepareRewardVideoAd({ adId: ios ? C.admobRewardedIOS : C.admobRewardedAndroid })
        .then(function () {
          return A.showRewardVideoAd();
        })
        .then(function () {
          h && h.remove && h.remove();
          if (done) ok();
          else fail && fail('notEnded');
        })
        .catch(function (e) {
          fail && fail(e);
        });
    },
    inter: function () {
      var A = this.admob;
      if (!A) return;
      var ios = window.Capacitor.getPlatform() == 'ios',
        C = PLATFORM_CFG.app;
      A.prepareInterstitial({ adId: ios ? C.admobInterstitialIOS : C.admobInterstitialAndroid })
        .then(function () {
          return A.showInterstitial();
        })
        .catch(function () {});
    },
    banner: function (show) {},
    share: function (o, cb) {
      var Sh = window.Capacitor.Plugins && window.Capacitor.Plugins.Share;
      if (Sh)
        Sh.share({ title: o.title, text: o.text }).then(
          function () {
            cb(true);
          },
          function () {
            cb(false);
          }
        );
      else cb(true);
    },
    vibrate: function (ms) {
      var H = window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (!H) return;
      var style = ms && ms > 30 ? 'HEAVY' : ms && ms > 18 ? 'MEDIUM' : 'LIGHT';
      H.impact({ style: style });
    }
  }
};
/** 启动加载界面：分包下载与图集解码期间显示进度 */
var Boot = {
  p: 0,
  msg: '加载中',
  on: true,
  set: function (p, msg) {
    this.p = Math.max(this.p, Math.min(1, p));
    if (msg) this.msg = msg;
    this.draw();
  },
  draw: function () {
    var c = typeof UI != 'undefined' && UI.c;
    if (!c || !this.on) return;
    var W = CFG.W,
      H = CFG.H,
      bw = 240,
      bx = (W - bw) / 2,
      by = H * 0.58,
      R = 8;
    var gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#ffe3ee');
    gr.addColorStop(0.55, '#fff0f5');
    gr.addColorStop(1, '#fff6e0');
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
    // soft orbs
    c.fillStyle = 'rgba(255,143,177,.22)';
    c.beginPath();
    c.arc(W * 0.2, H * 0.22, 48, 0, 7);
    c.fill();
    c.fillStyle = 'rgba(143,211,255,.2)';
    c.beginPath();
    c.arc(W * 0.82, H * 0.28, 36, 0, 7);
    c.fill();
    c.textAlign = 'center';
    c.fillStyle = '#ff6f9c';
    var df = typeof FONT_DISPLAY != 'undefined' ? FONT_DISPLAY : 'sans-serif';
    c.font = '900 42px ' + df;
    c.fillText('软萌大作战', W / 2, H * 0.38);
    c.fillStyle = '#c07088';
    c.font = '14px ' + df;
    c.fillText('合成 · 塔防 · 肉鸽', W / 2, H * 0.38 + 28);
    // rounded progress track
    c.fillStyle = 'rgba(255,255,255,.75)';
    if (typeof rr == 'function') {
      rr(c, bx - 4, by - 4, bw + 8, 20, R + 2);
      c.fill();
      c.fillStyle = 'rgba(160,90,110,.18)';
      rr(c, bx, by, bw, 12, R);
      c.fill();
      c.fillStyle = '#ff8fb3';
      rr(c, bx, by, Math.max(R * 2, bw * this.p), 12, R);
      c.fill();
    } else {
      c.fillRect(bx, by, bw, 12);
      c.fillStyle = '#ff8fb3';
      c.fillRect(bx, by, bw * this.p, 12);
    }
    c.fillStyle = '#a06478';
    c.font = '14px sans-serif';
    c.fillText(this.msg + ' ' + Math.round(this.p * 100) + '%', W / 2, by + 36);
  }
};
var Platform = {
  // 依次加载美术分包（构建时按 ≤4MB 拆成 art/art2/...；配置 PLATFORM_CFG.remoteArt 时改为 CDN 远程加载，不占包体）
  loadSubs: function (api, cb) {
    var L = (typeof ART_SUBS != 'undefined' ? ART_SUBS : ['art']).slice();
    if (PLATFORM_CFG.remoteArt || !api.loadSubpackage || !L.length) {
      cb();
      return;
    }
    var total = L.length,
      done = 0;
    (function nx() {
      var n = L.shift();
      if (!n) {
        cb();
        return;
      }
      var fin = function () {
        done++;
        Boot.set((done / total) * 0.85, '加载美术资源');
        nx();
      };
      var task = api.loadSubpackage({ name: n, success: fin, fail: fin });
      if (task && task.onProgressUpdate)
        task.onProgressUpdate(function (r) {
          Boot.set(((done + (r.progress || 0) / 100) / total) * 0.85, '加载美术资源');
        });
    })();
  },
  env: detectEnv(),
  get A() {
    return ADAPTERS[this.env] || ADAPTERS.web;
  },
  // 安全区（刘海/圆角/Home 指示条），单位：CSS 像素
  safeInsets: function () {
    try {
      return this.A.safe();
    } catch (e) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  },
  // ---- 后端请求（wx.request / tt.request / fetch） ----
  server: function () {
    return PLATFORM_CFG.mode == 'server' && PLATFORM_CFG.serverUrl;
  },
  uid: function () {
    return 'u' + Save.d.lbSeed;
  }, // 正式版：wx.login / tt.login 换取 openid
  request: function (method, path, body, cb) {
    var url = PLATFORM_CFG.serverUrl + path,
      done = false,
      fin = function (e, d) {
        if (done) return;
        done = true;
        cb(e, d);
      };
    try {
      this.A.req(method, url, body, fin);
    } catch (e) {
      fin(e);
    }
    setTimeout(function () {
      fin('timeout');
    }, 8000);
  },
  sidebarCheck: function (cb) {
    var a = this.A;
    a.sidebarCheck ? a.sidebarCheck(cb) : cb(false);
  },
  sidebarGo: function () {
    this.A.sidebarGo && this.A.sidebarGo();
  },
  fromSidebar: function () {
    return !!(this.A.fromSidebar && this.A.fromSidebar());
  },
  recStart: function () {
    this.A.recStart && this.A.recStart();
  },
  recStop: function (cb) {
    if (this.A.recStop) this.A.recStop(cb);
    else cb && cb(null);
  },
  canShareVideo: function () {
    return !!this.A._recPath;
  },
  shareVideo: function (cb) {
    if (this.A.shareVideo) this.A.shareVideo(cb);
    else cb(false);
  },
  init: function () {
    try {
      this.A.init();
    } catch (e) {
      console.warn('platform init', e);
    }
  },
  boot: function (cb) {
    try {
      this.A.boot(cb);
    } catch (e) {
      cb();
    }
  },
  showRewardedAd: function (placement, onSuccess, onFail) {
    Platform.onAdStart && Platform.onAdStart(placement);
    this.A.ad(
      placement,
      function () {
        Platform.lastRewarded = Date.now();
        Save.task('ad');
        if (typeof Meta != 'undefined') Meta.stat('ads', 1);
        Save.save();
        onSuccess();
      },
      function (e) {
        UI && UI.toast && UI.toast('需要看完广告才能领取哦', '#ffd6e0');
        onFail && onFail(e);
      }
    );
  },
  lastRewarded: 0,
  lastInter: 0,
  interCount: 0,
  /** 关卡结算后的插屏广告（带频控，新玩家前几次启动不展示） */
  showInterstitial: function () {
    var F = PLATFORM_CFG.interstitial,
      now = Date.now();
    if ((Save.d.sessions || 0) < F.minSessions) return false;
    this.interCount++;
    if (this.interCount % F.everyN) return false;
    if (now - this.lastInter < F.minGapSec * 1000 || now - this.lastRewarded < F.afterRewardedSec * 1000) return false;
    this.lastInter = now;
    try {
      this.A.inter && this.A.inter();
    } catch (e) {}
    return true;
  },
  /** 菜单横幅：仅在开启 bannerEnabled 时展示，进入战斗时隐藏 */
  setBanner: function (show) {
    if (!PLATFORM_CFG.bannerEnabled) return;
    if (this._bannerOn === show) return;
    this._bannerOn = show;
    try {
      this.A.banner && this.A.banner(show);
    } catch (e) {}
  },
  gachaDraw: function (n, pool, pity, G, cb) {
    if (!this.server()) {
      cb(this.gacha(n, pool, pity, G));
      return;
    }
    var sizes = {};
    for (var k in pool) sizes[k] = pool[k].length;
    this.request('POST', '/api/gacha/draw', { uid: this.uid(), n: n, sizes: sizes }, function (e, r) {
      if (e || !r || !r.items) {
        cb(null);
        return;
      }
      cb({
        pity: r.pity,
        items: r.items.map(function (x) {
          return { rar: x.rar, item: pool[x.rar][x.idx % pool[x.rar].length] };
        })
      });
    });
  },
  // 扭蛋：本地模拟（mock 模式）
  gacha: function (n, pool, pity, G) {
    var items = [];
    for (var i = 0; i < n; i++) {
      pity++;
      var x = Math.random(),
        rar =
          x < G.rates.SSR
            ? 'SSR'
            : x < G.rates.SSR + G.rates.SR
              ? 'SR'
              : x < G.rates.SSR + G.rates.SR + G.rates.R
                ? 'R'
                : 'N';
      if (pity >= G.pity) rar = 'SSR';
      if (
        n == 10 &&
        i == 9 &&
        !items.some(function (t) {
          return t.rar == 'SSR' || t.rar == 'SR';
        })
      )
        rar = 'SR';
      if (rar == 'SSR') pity = 0;
      var arr = pool[rar];
      items.push({ rar: rar, item: arr[Math.floor(Math.random() * arr.length)] });
    }
    return { items: items, pity: pity };
  },
  share: function (opt, cb) {
    this.A.share(opt, function (ok) {
      cb && cb(ok !== false);
    });
  },
  // 排行榜：配置 serverUrl 后走服务端（wx.request / tt.request / fetch），否则只显示本机个人纪录
  submitScore: function (board, score) {
    var k = 'lb_' + board,
      b = Storage.get(k, 0);
    if (score > b) Storage.set(k, score);
    if (score > 0) {
      var h = Storage.get('lbh_' + board, []);
      h.push({ s: score, t: Date.now() });
      h.sort(function (x, y) {
        return y.s - x.s;
      });
      Storage.set('lbh_' + board, h.slice(0, 10));
    }
    if (this.server())
      this.request(
        'POST',
        '/api/lb/submit',
        { uid: this.uid(), name: '我', board: board, score: score },
        function () {}
      );
  },
  getLeaderboard: function (board, cb) {
    var self = this;
    if (!this.server()) {
      this.mockLeaderboard(board, cb);
      return;
    }
    this.request('GET', '/api/lb/query?board=' + board + '&uid=' + this.uid(), null, function (e, r) {
      if (e || !r || !r.list) {
        self.mockLeaderboard(board, cb);
        return;
      }
      cb(
        r.list.map(function (x) {
          return { name: x.uid == self.uid() ? '我' : x.name, score: x.score, me: x.uid == self.uid() };
        })
      );
    });
  },
  // 无服务端时：只展示本机的个人最佳纪录（前 10 次），不出现任何虚构玩家
  online: function () {
    return !!this.server();
  },
  mockLeaderboard: function (board, cb) {
    var h = Storage.get('lbh_' + board, []),
      best = Storage.get('lb_' + board, 0) || (board == 'endless' ? Save.d.best || 0 : 0);
    if (!h.length && best > 0) h = [{ s: best, t: 0 }];
    var list = h.map(function (x, i) {
      var d = x.t ? new Date(x.t) : null;
      return { name: d ? d.getMonth() + 1 + '月' + d.getDate() + '日' : '早前纪录', score: x.s, me: i == 0 };
    });
    setTimeout(function () {
      cb(list);
    }, 0);
  },
  vibrate: function (ms) {
    try {
      this.A.vibrate(ms);
    } catch (e) {}
  }
};
