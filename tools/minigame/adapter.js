/**
 * 软萌大作战 V1.0
 * 小游戏适配层（微信 wx / 抖音 tt 通用）：将浏览器 API 映射到小游戏 API
 *
 * © 2026 <著作权人>
 */
// 只覆盖本游戏用到的：canvas、触摸、localStorage、Image、WebAudio、可见性、尺寸。
var __api = typeof tt !== 'undefined' && tt.createCanvas ? tt : wx;
var __sys = __api.getSystemInfoSync();
var __L = {};
function __on(t, fn) {
  (__L[t] = __L[t] || []).push(fn);
}
function __fire(t, e) {
  (__L[t] || []).forEach(function (f) {
    f(e);
  });
}
var __canvas = __api.createCanvas();
__canvas.style = {};
__canvas.getBoundingClientRect = function () {
  return { left: 0, top: 0, width: __sys.windowWidth, height: __sys.windowHeight };
};
__canvas.addEventListener = function (t, fn) {
  __on(t, fn);
};
function __te(e) {
  return {
    touches: e.touches || [],
    changedTouches: e.changedTouches || e.touches || [],
    preventDefault: function () {}
  };
}
__api.onTouchStart(function (e) {
  __fire('touchstart', __te(e));
});
__api.onTouchMove(function (e) {
  __fire('touchmove', __te(e));
});
__api.onTouchEnd(function (e) {
  __fire('touchend', __te(e));
});
__api.onTouchCancel &&
  __api.onTouchCancel(function (e) {
    __fire('touchend', __te(e));
  });
var innerWidth = __sys.windowWidth,
  innerHeight = __sys.windowHeight,
  devicePixelRatio = __sys.pixelRatio;
function addEventListener(t, fn) {
  __on(t, fn);
}
var document = {
  hidden: false,
  getElementById: function () {
    return __canvas;
  },
  createElement: function (t) {
    return t == 'canvas' ? __api.createCanvas() : { style: {} };
  },
  addEventListener: function (t, fn) {
    __on(t, fn);
  }
};
__api.onHide(function () {
  document.hidden = true;
  __fire('visibilitychange', {});
});
// 启动参数需在 game.js 运行时同步监听（抖音侧边栏复访要求）
var __lastShow = (__api.getLaunchOptionsSync && __api.getLaunchOptionsSync()) || {};
__api.onShow(function (o) {
  __lastShow = o || {};
  document.hidden = false;
  __fire('visibilitychange', {});
});
var localStorage = {
  getItem: function (k) {
    try {
      var v = __api.getStorageSync(k);
      return v === '' || v === undefined ? null : v;
    } catch (e) {
      return null;
    }
  },
  setItem: function (k, v) {
    try {
      __api.setStorageSync(k, String(v));
    } catch (e) {}
  },
  removeItem: function (k) {
    __api.removeStorageSync(k);
  },
  clear: function () {
    __api.clearStorageSync();
  }
};
function Image() {
  return __api.createImage();
}
var location = { search: '', href: '' },
  navigator = {};
var performance = {
  now: function () {
    return Date.now();
  }
};
var requestAnimationFrame =
  (typeof GameGlobal !== 'undefined' && GameGlobal.requestAnimationFrame) ||
  requestAnimationFrame ||
  function (f) {
    return setTimeout(function () {
      f(Date.now());
    }, 16);
  };
var window = {
  devicePixelRatio: devicePixelRatio,
  innerWidth: innerWidth,
  innerHeight: innerHeight,
  addEventListener: addEventListener,
  AudioContext: __api.createWebAudioContext
    ? function () {
        return __api.createWebAudioContext();
      }
    : undefined
};
