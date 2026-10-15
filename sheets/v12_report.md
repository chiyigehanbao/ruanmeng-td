# v1.2 交付报告（Asia/Shanghai 2026-10-14 21:30）

## 复审发现与修复
1. **BGM**：进战斗/回菜单热切换（fade 0.35s / fade-in 0.5s），menu/battle 两套旋律；静音与音量经 master 同步；mute 补 click+vibrate。
2. **2-8**：N=16×3 队带卡 avgProg 约 43–54%；复核 N=10 basic 47% / tox 51%，落在 40–55%。
3. **功能/边界**：去掉死代码 Meta.claimOffline；挂机统一 App.welcome，未领取前不刷新 lastSeen（防吞收益）；邮箱公告改 v1.2；版本号 1.2.0。
4. **经济**：首次进入送 100 糖+60 钻；皮肤 SR 100 / SSR 280（原 120/350）；无软锁（天赋首阶 20 糖、龙龙 20 钻、十连约 1–2 天）。
5. **感官**：福利/周活/无尽里程碑/天赋/翻倍/复活/录屏/广告召唤·刷新/龙龙/远征结算/扭蛋结果全部补 SFX+震动；领取钮加高到 32 并 pulse。
6. **艺审**：手机尺寸 sheet 抽查标题/福利/扭蛋/2-8/通行证/天赋/玩法大厅，圆角高光一致；标题版本已升 V1.2.0。

## 自审一轮
- eslint 0；minigame lint 0 错；抖音主包 ~904KB；无 IAP 文案。
- 领取按钮二次扫 gaps=[]。
- 软著 V1.2 源程序/说明书 docx+pdf 已更新；sheets：phone_size_v12 / juice_v12 / economy_v12 / enemies_v12。

## 交付
- 备份：/workspace/td-proto-v11
- 包：/workspace/v12.part*
- 工作树：/workspace/td-proto（含 dist 需重新 build，打包时排除了 dist/node_modules）
