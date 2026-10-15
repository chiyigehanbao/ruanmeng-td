# 快速审阅拼图：python3 tools/review.py out.png dir name1 name2 ...（每格 200px + 下方 64px 手机实尺寸缩略）
import sys,os
from PIL import Image,ImageDraw,ImageFont
out,d=sys.argv[1],sys.argv[2];ns=sys.argv[3:];C=200;cols=6
rows=(len(ns)+cols-1)//cols;S=Image.new('RGB',(cols*C,rows*(C+80)),'#f3e3c8');dr=ImageDraw.Draw(S);f=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',13)
for i,n in enumerate(ns):
  p=f'{d}/{n}.png'
  if not os.path.exists(p):continue
  im=Image.open(p).convert('RGBA');x=(i%cols)*C;y=(i//cols)*(C+80)
  a=im.resize((C,C),Image.LANCZOS);S.paste(a,(x,y),a);b=im.resize((56,56),Image.LANCZOS);S.paste(b,(x+8,y+C+4),b)
  dr.text((x+70,y+C+20),n,font=f,fill='#5a3040')
S.save(out)
