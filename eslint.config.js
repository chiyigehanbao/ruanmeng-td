/**
 * 软萌大作战 V1.0
 * ESLint 配置：src 为浏览器/小游戏脚本（全局对象模块模式），tools/server/dev 为 Node 脚本
 *
 * © 2026 <著作权人>
 */
const js = require('@eslint/js');
const globals = require('globals');

/** 游戏模块之间共享的全局对象 */
const gameGlobals = Object.fromEntries(
  [
    'CFG',
    'Storage',
    'Save',
    'Platform',
    'PLATFORM_CFG',
    'ADAPTERS',
    'PathUtil',
    'Meta',
    'UPGRADES',
    'Game',
    'Art',
    'ATLAS',
    'FX',
    'Tween',
    'VFX',
    'Sfx',
    'UI',
    'rr',
    'shade',
    'GS',
    'Menu',
    'Exp',
    'App',
    'Shot',
    'ART_SUBS',
    'tt',
    'wx',
    'GameGlobal',
    'FONT_DISPLAY',
    'Boot',
    'loadDisplayFont',
    'FontFace',
    '__lastShow',
    'PATHSETS',
    'makePath',
    'rollUpgrades',
    'rollEndlessLaws',
    'BUILDS'
  ].map((k) => [k, 'writable'])
);

module.exports = [
  { ignores: ['dist/**', 'node_modules/**', 'assets/**', 'art_*/**', 'shots/**', 'sheets/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'dev/testShots.js', 'tools/minigame/adapter.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: { ...globals.browser, ...gameGlobals }
    },
    rules: {
      'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none' }],
      'no-redeclare': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-cond-assign': ['error', 'except-parens'],
      'no-func-assign': 'off'
    }
  },
  {
    files: ['tools/**/*.js', 'server/**/*.js', 'dev/**/*.js', 'eslint.config.js'],
    ignores: ['dev/testShots.js', 'tools/minigame/adapter.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node, ...gameGlobals }
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-cond-assign': ['error', 'except-parens']
    }
  }
];
