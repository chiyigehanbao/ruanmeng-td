/**
 * 软萌大作战 V1.2
 * 音效与 BGM：界面音效使用 assets/sfx 采样（Kenney，CC0），战斗高频音效与 BGM 为 WebAudio 程序化合成
 *
 * © 2026 <著作权人>
 */
var Sfx = {
  ctx: null,
  master: null,
  muted: false,
  vol: 0.7,
  bgmOn: false,
  init: function () {
    if (this.ctx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.vol;
      this.master.connect(this.ctx.destination);
      this.loadSamples();
    } catch (e) {}
  },
  /** 采样音效（界面、结算类），加载失败时自动回退到程序化音效 */
  SAMPLES: ['click', 'card', 'pop', 'coin', 'merge', 'buy', 'leak', 'boss', 'legend', 'win', 'lose'],
  buf: {},
  loadSamples: function () {
    var self = this;
    this.SAMPLES.forEach(function (n) {
      var path = 'assets/sfx/' + n + '.mp3',
        done = function (ab) {
          try {
            self.ctx.decodeAudioData(
              ab,
              function (b) {
                self.buf[n] = b;
              },
              function () {}
            );
          } catch (e) {}
        };
      try {
        fetch(path)
          .then(function (r) {
            return r.arrayBuffer();
          })
          .then(done, function () {});
      } catch (e) {}
    });
  },
  playBuf: function (n, vol) {
    var c = this.ctx,
      s = c.createBufferSource(),
      g = c.createGain();
    s.buffer = this.buf[n];
    g.gain.value = vol || 0.7;
    s.connect(g);
    g.connect(this.master);
    s.start();
  },
  setMute: function (m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.vol;
    if (this.bgmGain && this.ctx) {
      var t0 = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(t0);
      this.bgmGain.gain.setValueAtTime(m ? 0 : 0.55, t0);
    }
  },
  setVol: function (v) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.master && !this.muted) this.master.gain.value = this.vol;
  },
  tone: function (f, dur, type, vol, slide, delay) {
    if (!this.ctx || this.muted) return;
    var c = this.ctx,
      t = c.currentTime + (delay || 0),
      o = c.createOscillator(),
      g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  },
  noise: function (dur, vol) {
    if (!this.ctx || this.muted) return;
    var c = this.ctx,
      b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate),
      d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var s = c.createBufferSource(),
      g = c.createGain(),
      f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900;
    s.buffer = b;
    g.gain.value = vol || 0.3;
    s.connect(f);
    f.connect(g);
    g.connect(this.master);
    s.start();
  },
  _last: {},
  rl: function (k, ms) {
    var n = Date.now();
    if (this._last[k] && n - this._last[k] < ms) return false;
    this._last[k] = n;
    return true;
  },
  play: function (n) {
    var s = this;
    if (this.ctx && !this.muted && this.buf[n]) {
      if (this.rl('b' + n, 50)) this.playBuf(n, n == 'coin' || n == 'pop' ? 0.45 : 0.7);
      return;
    }
    switch (n) {
      case 'click':
        s.tone(880, 0.07, 'triangle', 0.15, 1.5);
        break;
      case 'shoot':
        if (s.rl('shoot', 60)) s.tone(1200 + Math.random() * 300, 0.05, 'square', 0.03, 0.5);
        break;
      case 'hit':
        if (s.rl('hit', 50)) s.tone(300, 0.06, 'triangle', 0.06, 0.6);
        break;
      case 'pop':
        if (s.rl('pop', 40)) s.tone(500 + Math.random() * 200, 0.12, 'sine', 0.14, 2.2);
        break;
      case 'boom':
        if (s.rl('boom', 80)) {
          s.noise(0.25, 0.25);
          s.tone(120, 0.25, 'sine', 0.25, 0.4);
        }
        break;
      case 'zap':
        if (s.rl('zap', 80)) s.tone(1500, 0.12, 'sawtooth', 0.05, 0.3);
        break;
      case 'coin':
        if (s.rl('coin', 60)) {
          s.tone(1320, 0.06, 'square', 0.05);
          s.tone(1760, 0.1, 'square', 0.05, 1, 0.05);
        }
        break;
      case 'merge':
        [523, 659, 784, 1046].forEach(function (f, i) {
          s.tone(f, 0.15, 'triangle', 0.15, 1, i * 0.06);
        });
        break;
      case 'buy':
        s.tone(660, 0.08, 'triangle', 0.15);
        s.tone(990, 0.12, 'triangle', 0.15, 1, 0.07);
        break;
      case 'leak':
        s.tone(200, 0.3, 'sawtooth', 0.12, 0.5);
        break;
      case 'boss':
        [110, 104, 98].forEach(function (f, i) {
          s.tone(f, 0.4, 'sawtooth', 0.15, 1, i * 0.35);
        });
        break;
      case 'card':
        s.tone(784, 0.1, 'sine', 0.12);
        s.tone(1175, 0.18, 'sine', 0.12, 1, 0.08);
        break;
      case 'legend':
        [784, 988, 1175, 1568].forEach(function (f, i) {
          s.tone(f, 0.25, 'triangle', 0.13, 1, i * 0.08);
        });
        break;
      case 'win':
        [523, 659, 784, 659, 784, 1046].forEach(function (f, i) {
          s.tone(f, 0.2, 'triangle', 0.15, 1, i * 0.12);
        });
        break;
      case 'lose':
        [392, 330, 262, 196].forEach(function (f, i) {
          s.tone(f, 0.3, 'triangle', 0.15, 1, i * 0.18);
        });
        break;
      case 'place':
        s.tone(520, 0.06, 'triangle', 0.1);
        s.tone(780, 0.1, 'triangle', 0.1, 1, 0.05);
        break;
      case 'wave':
        s.tone(300, 0.15, 'sawtooth', 0.08, 1.4);
        s.tone(450, 0.2, 'triangle', 0.1, 1, 0.12);
        break;
      case 'upgrade':
        [440, 554, 659].forEach(function (f, i) {
          s.tone(f, 0.12, 'triangle', 0.12, 1, i * 0.05);
        });
        break;
      case 'unlock':
        [523, 659, 784, 1046, 1318].forEach(function (f, i) {
          s.tone(f, 0.18, 'sine', 0.12, 1, i * 0.07);
        });
        break;
      case 'gacha':
        for (var gi = 0; gi < 6; gi++) s.tone(600 + gi * 120, 0.08, 'square', 0.06, 1, gi * 0.05);
        break;
    }
  },
  bgmScene: 'menu',
  bgmGain: null,
  bgmTimer: null,
  bgmI: 0,
  bgmFade: 1,
  /** 热切换：menu / battle，淡入淡出，跟随静音与音量 */
  bgm: function (scene) {
    this.init();
    if (!this.ctx) return;
    var next = scene || this.bgmScene || 'menu';
    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0;
      this.bgmGain.connect(this.master);
    }
    if (this.bgmOn && next == this.bgmScene) return;
    var switching = this.bgmOn && next != this.bgmScene;
    this.bgmScene = next;
    this.bgmOn = true;
    var self = this;
    if (switching) {
      // 先淡出再换曲
      this.bgmFade = 0;
      var t0 = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(t0);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, t0);
      this.bgmGain.gain.linearRampToValueAtTime(0, t0 + 0.35);
      setTimeout(function () {
        self.bgmI = 0;
        self._bgmFadeIn();
      }, 360);
    } else {
      this.bgmI = 0;
      this._bgmFadeIn();
    }
    if (!this.bgmTimer) {
      this.bgmTimer = setInterval(function () {
        self._bgmTick();
      }, 260);
    }
  },
  _bgmFadeIn: function () {
    if (!this.bgmGain || !this.ctx) return;
    var t0 = this.ctx.currentTime,
      target = this.muted ? 0 : 0.55;
    this.bgmGain.gain.cancelScheduledValues(t0);
    this.bgmGain.gain.setValueAtTime(0, t0);
    this.bgmGain.gain.linearRampToValueAtTime(target, t0 + 0.5);
    this.bgmFade = 1;
  },
  _bgmTick: function () {
    if (!this.ctx || this.muted || document.hidden || !this.bgmOn) return;
    var battle = this.bgmScene == 'battle',
      mel = battle
        ? [0, 2, 4, 7, 4, 2, 0, 5, 4, 2, 0, 7, 5, 4, 2, 0]
        : [0, 4, 7, 9, 7, 4, 2, 4, 0, 4, 7, 12, 9, 7, 4, 2],
      bass = battle ? [0, 0, 7, 7, 5, 5, 3, 3] : [0, 0, 5, 5, 7, 7, 5, 5],
      base = battle ? 349.23 : 392,
      i = this.bgmI++,
      n = mel[i % 16],
      vol = 0.04 * (this.bgmFade || 1);
    this._bgmTone(base * Math.pow(2, n / 12), 0.22, 'triangle', vol);
    if (i % 2 == 0) this._bgmTone((base / 4) * Math.pow(2, bass[(i / 2) % 8] / 12), 0.4, 'sine', vol * 1.3);
  },
  _bgmTone: function (f, dur, type, vol) {
    if (!this.ctx || !this.bgmGain || this.muted) return;
    var c = this.ctx,
      t = c.currentTime,
      o = c.createOscillator(),
      g = c.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.03, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.bgmGain);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
};
