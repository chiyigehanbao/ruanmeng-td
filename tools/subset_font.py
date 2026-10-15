# 软萌大作战 V1.0  © 2026 <著作权人>
"""展示字体子集化：收集 src 中出现的全部字符，从站酷快乐体（OFL 1.1）裁出子集。
用法：python3 tools/subset_font.py <ZCOOLKuaiLe-Regular.ttf>
输出：assets/fonts/rmfont.ttf
"""
import glob
import os
import sys

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
chars = set(chr(c) for c in range(32, 127))
for f in glob.glob(os.path.join(ROOT, 'src', '**', '*.js'), recursive=True):
    chars |= set(open(f, encoding='utf-8').read())
chars = ''.join(sorted(c for c in chars if ord(c) >= 32))
out = os.path.join(ROOT, 'assets', 'fonts', 'rmfont.ttf')
opts = subset.Options()
opts.layout_features = ['*']
opts.name_IDs = ['*']
opts.notdef_outline = True
font = subset.load_font(sys.argv[1], opts)
s = subset.Subsetter(opts)
s.populate(text=chars)
s.subset(font)
subset.save_font(font, out, opts)
print('字符数', len(chars), '输出', out, os.path.getsize(out) // 1024, 'KB')
