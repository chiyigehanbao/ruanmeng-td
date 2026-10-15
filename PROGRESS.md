# 进度记录（时间：Asia/Shanghai）

## 2026-10-14 v0.3
- ✅ v2 已备份到 /workspace/td-proto-v2/
- ✅ 美术：Blender 卡通渲染重做全部角色
  - Q 版大头、高光大眼、腮红、配饰
  - 描边 + 边缘光
  - 待机、攻击、受击、死亡帧
  - 共 390 张，打成 2 张图集，约 520KB（原来约 8MB）
  - 角色总览：lineup_v3.png
- ✅ 内容：6 章 × 8 关，每章不同主题，加入双路线、暴风雪、流沙变道、迷雾等机制；每关有精英难度；每章有章节首领（共 8 个首领技能）
- ✅ 模式
  - 无尽：每周轮换词缀、里程碑奖励、排行榜
  - 每日挑战
  - 首领车轮战
  - 周活动：积分里程碑
  - 远征：节点地图，含战斗、精英、奇遇、商店、营地、宝箱、首领
- ✅ 养成
  - 4 个英雄，各有主动技能
  - 18 件遗物，可装备 2 件
  - 3 款皮肤
  - Lv6 进化分为 A/B 两条分支
  - 专精卡和羁绊
- ✅ 留存
  - 通行证：免费 + 豪华两条奖励线
  - 14 个成就
  - 图鉴奖励
  - 扭蛋：50 抽保底，十连必出 SR
  - 邮件和公告
  - 分享奖励
- ✅ 菜单重写
  - 底部导航：冒险 / 玩法 / 英雄 / 扭蛋 / 商城
  - 侧边功能栏
  - 列表支持拖动和滚轮滚动
- ✅ 平台：platform.js 适配 web/wx/tt/app 四个环境；tools/build.js 输出四端产物；小游戏适配层；美术放在分包
- ✅ 测试
  - Playwright 移动端触摸测试通过：拖拽合成、取消拖拽、列表滚动
  - 小游戏包在 Node 中模拟 wx 环境做了冒烟测试：启动后点击标题能进入地图
- ✅ 平衡：第六章难度系数 ×0.85，开局金币 +60。模拟结果见最终报告。

## 2026-10-14 v0.3.1 修复（已备份 v0.3 到 /workspace/td-proto-v3/，不含 art_raw）
- ✅ 屏幕适配：画面在安全区内等比缩放，长屏和平板的多余区域填充背景，已在 9:16、9:19.5、9:21、iPad 尺寸下截图验证
- ✅ 远征存档：Node 往返测试 ROUNDTRIP OK；切后台时（visibilitychange / onHide）自动保存
- ✅ 6-8 平衡：使用卡牌的模拟 8 局中通关 6 局（1–2 星），不用卡牌 0 局通关
- ✅ server/：下单 / 校验 / 微信与抖音回调签名 / 服务端扭蛋保底 / 排行榜，test.js 全部通过；浏览器 server 模式联调通过
- ✅ 小游戏：条件编译，抖音分包改为 subPackages，lint 结果 0 个错误
- ✅ 修复：备战栏首领预告使用了旧的首领数组（v3 遗留问题）

## v0.4 美术升级 + 抖音优先（2026-10-14）
- 角色 512px 重渲（贴图式二次元眼睛/表情、三阶色阶、轮廓线、边缘光），UI 使用 U: 高清帧；图集 635 精灵/8 页/≈2.7MB（pngquant）
- 抖音 AppID tt0b317d8c9548f13202 已写入配置；侧边栏复访奖励、录屏分享(≥3s)、激励视频、requestGamePayment 适配；lint 0 错误
- 对比图 art_before_after.png，阵容图 lineup_v3.png；dist/douyin ≈3.1MB（主包+art 分包）
- 未上传/发布任何内容

## v0.5 (2026-10-14 CST)
- 16 base towers (N/R/SR/SSR), MAX_LV 5, A/B branch at Lv4; 10 fusion recipes (Lv5+Lv5, fusion Lv1-3, feed Lv3+ component +1); 5 ultimates (two Lv3 fusions) with cinematic + rainbow frame.
- Per-level VFX tiers (js/vfx.js); codex tabs base/fusion/ultimate; UI skin pass; ambient backgrounds.
- Art split into subpackages art/art2 (<3.8MB each), main 505KB; remoteArt CDN option. Lint 0 errors; Douyin smoke OK.
- Sim: endless phoenix ~W42, raijin >W80; ultimates not reached by bot in 80 waves (intended deep chase, may need tuning).
- Sheets: sheets/roster_v5.png, evolution_strip.png, fusion_tree.png, vfx_compare.png.

## v0.6 (2026-10-14 CST)
- Themed held props for all 16 base towers (bow, ice wand, poison flask, shoulder cannon, star staff, fire staff, coin scepter, crossbow, slingshot, heal book, leaf staff, missile tube, magnet, flag, dragon scepter, star-orb wand); fusions/ultimates hold both partners' props (mirrored).
- Attack frames rendered: _0 idle, _w windup, _a release, _r recover, _h happy (old _1 removed). Per-frame prop-tip muzzle points projected in Blender → art_v4/_mz.json → ATLAS.mz. Projectiles + muzzle flash spawn at the tip; base towers flip to face their target; frames play in-game (verified: sheets/attack_anim_strip.png, log w→a→r→0).
- Level badge moved to the side opposite the prop; frost Lv1/2/3 VFX now distinct.
- Balance: tower range ×0.7 measured from grid front edge (CFG.RANGE_K); 6-8 diff 0.68; endless late HP ×1.02^(w-20); fusion resonance shop bias from wave 15 + endless boss drop of Lv3 component; ultimate needs two fusions Lv2+ (CFG.ULT_LV).
- Sim: tools/sim3.js (path progress at death, hp lost, first leak wave).

## v0.6.1 (2026-10-14 CST)
- Range: RANGE_K 0.95 (per-tower differences kept, sniper 590), measured from grid front edge → front rows engage around end of path row 1. sheets/range_overlay.png.
- Tension compensated by HP: HP_K 1.6 × chapter factor HP_CH [1.25,1.1,1,1,0.95,0.82]; endless ramp 1+min(1.3,(w-10)*0.06).
- Unlock pacing (data-driven via CFG.TOWERS[*].unlock, schedule derived): penguin 1-1, bear 1-4, frog 1-7, fox 2-2, bunny 2-5, pig 2-8, owl 3-3, hedgehog 3-6, sheep 4-1, hamster 4-4, chick 4-7, koala 5-3, deer 5-6, unicorn 6-4 (last three also gacha), dragon premium.
- New-partner celebration popup on clear (auto-joins team), pre-level panel shows "通关解锁新伙伴", map shows next 3 upcoming unlocks. Save.syncUnlocks backfills old saves silently.

## v0.7（V1.0.0 送审版）— 2026-10-14
- 下线全部付费内容，改为广告变现：福利中心、通行证改为广告加成轨道、免费召唤、带频控的插屏、可选横幅。扭蛋只消耗券，并提供概率公示。
- 合规：开始界面显示健康游戏忠告、适龄提示 8+、隐私摘要（全文见 docs/privacy.md）。README 中整理了抖音个人主体开发者的注意事项。
- 代码规范：
  - 源码迁移到 src/ 分层目录，开发工具迁移到 dev/。
  - 统一了文件头，接入 ESLint 和 Prettier（0 错误）。
  - 发布代码中已清除开发钩子。
- 软著：tools/gen_source_doc.py（60 页）、tools/gen_manual.py（21 页），清单见 docs/软著/申请信息清单.md。
- 修复：地图“即将解锁”框不再遮挡关卡节点。无尽模式加强了融合补给（只调供给，不调敌人）。

## v0.8 完成（2026-10-14）
美术重制 + 全局美化 + 出怪密度平衡；sim3 结果见 CHANGELOG / 交付报告。剩余：章1有卡组时仍偏轻松（平均进度约 25%），可后续下调卡牌加成。
- v0.8.1（2026-10-14）：卡牌递减与传送门保护落地，第 1 章带卡 35–48%；主包 0.95MB；软著文档已重生成。
- v0.9（2026-10-14）：第 2–6 章带卡 38–55%，消除 5-5 台阶；饰物与手感打磨；1-2 引导；无付费复核。
- v1.0（2026-10-14）：开局关入带、敌人三分、UI 商业化打磨；主包 0.95MB。
- v1.1（2026-10-14）：经济可负担扭蛋/皮肤；感官三件套；果冻减负；挂机修复。

## 2026-10-14 v1.2
- 备份 v1.1 在 /workspace/td-proto-v11。
- BGM 热切换（menu/battle fade），音量与静音走 master。
- 2-8 多种子带卡 43–54%（N=16）。
- 感官补全：领取/广告结算/龙龙召唤/远征/扭蛋结果。
- 挂机不再双重结算，未领取不烧 lastSeen。
- 经济：新手礼 100 糖+60 钻；皮肤 SR 100 / SSR 280。
- eslint 0；主包仍 <1MB。

## 2026-10-14 v1.3
- 备份 /workspace/td-proto-v12。
- vibrate(ms) 全平台贯通；去符号文案；Boot/按钮/红点/音量 toast；敌群阴影降载；第 1 章微调。

## 2026-10-14 v1.4
- 备份 /workspace/td-proto-v13。
- 暂停/倍速手感；扭蛋领券入口；任务一键领；文案去 AI 味；密集伤害数字降载。

## 2026-10-14 v1.5
- 备份 /workspace/td-proto-v14。
- 分支/英雄/遗物/皮肤/技能手感；遗物空态；尸体上限。

## 2026-10-14 v1.6
- 备份 /workspace/td-proto-v15。
- 弹窗/章节/结算导航手感；氛围粒子降载。

## 2026-10-14 v1.7
- 备份 /workspace/td-proto-v16。回收手感；排行榜文案。

## 2026-10-14 v1.8
- 强制再扫一轮；弹窗关闭震感；公告文案更新。残留：第1章偏易、占位 AppID。

## 2026-10-14 v1.9
- 备份 td-proto-v18。第1章张力、远征加深、无尽里程碑、字号/FPS/玩法入口手感。

## 2026-10-14 v2.0
- 备份 td-proto-v19。无尽十波演出、字号、Boot 字体、第1章微调。

## 2026-10-14 v2.1
- 备份 td-proto-v20。Toast/DPR/远征宝箱营地/粒子降载。
