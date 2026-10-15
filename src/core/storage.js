/**
 * 软萌大作战 V1.0
 * 本地存储与玩家存档
 *
 * © 2026 <著作权人>
 */
var Storage = {
  get: function (k, d) {
    try {
      var v = localStorage.getItem('rm_' + k);
      return v == null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  },
  set: function (k, v) {
    try {
      localStorage.setItem('rm_' + k, JSON.stringify(v));
    } catch (e) {}
  }
};
var Save = {
  d: null,
  load: function () {
    this.d = Storage.get('save', null) || {
      gems: 0,
      candy: 0,
      talents: {},
      stars: {},
      best: 0,
      tut: false,
      signDay: 0,
      signDate: '',
      taskDate: '',
      tasks: {},
      taskClaimed: {},
      lastSeen: 0,
      mute: false
    };
    return this.d;
  },
  save: function () {
    Storage.set('save', this.d);
  },
  tl: function (id) {
    return this.d.talents[id] || 0;
  },
  add: function (r) {
    if (r.gems) this.d.gems += r.gems;
    if (r.candy) this.d.candy += r.candy;
    if (r.tickets) this.d.tickets = (this.d.tickets || 0) + r.tickets;
    this.save();
  },
  today: function () {
    return new Date().toDateString();
  },
  checkDaily: function () {
    var t = this.today();
    if (this.d.taskDate !== t) {
      this.d.taskDate = t;
      this.d.tasks = {};
      this.d.taskClaimed = {};
      this.save();
    }
  },
  task: function (id, n) {
    this.checkDaily();
    this.d.tasks[id] = (this.d.tasks[id] || 0) + (n || 1);
  },
  unlocked: function (type) {
    var D = CFG.TOWERS[type];
    if (!D || D.parts) return false;
    if (this.d.owned && this.d.owned[type]) return true;
    var u = D.unlock;
    if (D.gacha && !u) return false;
    if (!u) return !D.gemSummon;
    return !!this.d.stars[u];
  },
  // 出战编队：5 个伙伴（随机召唤池）
  team: function () {
    var d = this.d,
      self = this;
    if (!d.team) d.team = [];
    d.team = d.team.filter(function (t) {
      return self.unlocked(t);
    });
    CFG.TOWER_ORDER.forEach(function (t) {
      if (d.team.length < 5 && d.team.indexOf(t) < 0 && self.unlocked(t) && !(d.teamOff && d.teamOff[t]))
        d.team.push(t);
    });
    return d.team.slice();
  },
  toggleTeam: function (t) {
    var d = this.d;
    this.team();
    d.teamOff = d.teamOff || {};
    var i = d.team.indexOf(t);
    if (i >= 0) {
      if (d.team.length <= 2) return 'min';
      d.team.splice(i, 1);
      d.teamOff[t] = 1;
    } else {
      if (!this.unlocked(t)) return 'lock';
      if (d.team.length >= 5) return 'full';
      d.team.push(t);
      delete d.teamOff[t];
    }
    this.save();
    return 'ok';
  },
  // 解锁同步：返回新解锁的伙伴（自动编入出战队伍，满员时替换最后一位）；老存档首次同步静默补齐
  syncUnlocks: function (silent) {
    var d = this.d,
      self = this,
      nu = [];
    if (!d.seenUnlock) {
      d.seenUnlock = {};
      silent = true;
    }
    CFG.TOWER_ORDER.forEach(function (t) {
      if (self.unlocked(t) && !d.seenUnlock[t]) {
        d.seenUnlock[t] = 1;
        nu.push(t);
      }
    });
    nu.forEach(function (t) {
      self.team();
      if (d.teamOff) delete d.teamOff[t];
      if (d.team.indexOf(t) < 0) {
        if (d.team.length >= 5) d.team[4] = t;
        else d.team.push(t);
      }
    });
    if (nu.length) this.save();
    return silent ? [] : nu;
  },
  unlockAt: function (id) {
    var r = [];
    CFG.TOWER_ORDER.forEach(function (t) {
      if (CFG.TOWERS[t].unlock == id) r.push(t);
    });
    return r;
  },
  prevCleared: function (id) {
    return !!this.d.stars[id];
  },
  levelOpen: function (c, l) {
    if (c == 1 && l == 1) return true;
    var p = l > 1 ? c + '-' + (l - 1) : c - 1 + '-' + CFG.LEVELS_PER;
    return !!this.d.stars[p];
  }
};
