# 第三方资源与许可证

软萌大作战 V1.0 用到的第三方资源都列在下面。除这些资源外，游戏的全部代码、美术（Blender 程序化建模与渲染、Canvas 程序化绘制）和战斗高频音效与 BGM（WebAudio 程序化合成）均为原创。

## 打入发布包的资源

| 资源 | 用途 | 来源 | 许可证 | 备注 |
|---|---|---|---|---|
| 站酷快乐体 ZCOOL KuaiLe（子集） | 标题、按钮、飘字的展示字体 | https://github.com/google/fonts/tree/main/ofl/zcoolkuaile （Google Fonts） | SIL Open Font License 1.1 | 由 `tools/subset_font.py` 裁剪子集，输出 `assets/fonts/rmfont.ttf`。许可证全文见 `assets/fonts/OFL.txt`。OFL 允许商用、嵌入和分发，但不能单独出售字体。版权：Copyright 2018 The ZCOOL KuaiLe Project Authors |

| Kenney Interface Sounds | 点击、卡牌、掉落、合成、购买、漏怪音效 | https://kenney.nl/assets/interface-sounds | CC0 1.0 | click_002、select_004、drop_002、maximize_006、pluck_001、error_004，已转为 mp3。许可证见 `assets/sfx/License_Kenney.txt` |
| Kenney Digital Audio | 金币、传说、胜利、失败音效 | https://kenney.nl/assets/digital-audio | CC0 1.0 | pepSound2、powerUp7、threeTone2、lowDown |
| Kenney Impact Sounds | 首领登场音效 | https://kenney.nl/assets/impact-sounds | CC0 1.0 | impactBell_heavy_000 |

## 开发工具（不进入发布包）

| 工具 | 用途 | 许可证 |
|---|---|---|
| Blender | 角色与道具的建模、渲染 | GPL-2.0-or-later（渲染输出的图像归作者所有，不受 GPL 约束） |
| Node.js | 构建、模拟 | MIT |
| ESLint / @eslint/js / globals | 代码检查 | MIT |
| Prettier | 代码格式化 | MIT |
| Pillow | 图集打包、展示图 | MIT-CMU（HPND） |
| fontTools | 字体子集化 | MIT |
| FFmpeg | 音效格式转换 | LGPL-2.1+（仅作外部命令） |
| python-docx | 软著文档生成 | MIT |
| pngquant（pngquant-cli） | 图集压缩 | GPL-3.0（仅作为外部命令处理图片，输出图片不受约束） |
| Playwright / Chrome | 开发截图 | Apache-2.0 / Chrome 服务条款 |
| LibreOffice | 文档转 PDF | MPL-2.0 |

## 美术参考

我们参考了同类萌系合成塔防的公开商店页面，例如 Evo Defense: Merge TD、Starguard: Evo Merge TD，借鉴的只是“按档位着色的格子、粗描边、高饱和色”这类通用设计原则，没有使用对方的任何素材。

## 新增资源须知

- 只使用 CC0 或允许商用的许可证（OFL、MIT、Apache 等）。新增后请在本文件补充来源链接、许可证和作者。
- CC-BY 素材需要在游戏内的“关于”页署名后才能使用。
- 禁止使用 CC-BY-NC、CC-BY-ND 或来源不明的素材。


> 2026-10-14 v0.9 复核：本版本未新增第三方素材；新增饰物、提示框、加载界面均为本项目自制（Blender 程序化建模 / Canvas 绘制）。

## v1.1 音效补充
程序化音效新增：place / wave / upgrade / unlock / gacha（WebAudio 合成，本项目自制）。
采样音效仍为 Kenney CC0（见 License_Kenney.txt）。无振动：抖音 tt.vibrateShort/Long、微信 wx.vibrateShort/Long、Web navigator.vibrate；无支持时静默跳过。


## v1.2 音频
- 菜单与战斗 BGM 为程序合成旋律（Web Audio 振荡器），无第三方曲库。
- 音效采样仍为 Kenney CC0（见上文），程序化音效为自研。
