# 软萌大作战 © 2026 <著作权人>  模型展示图：python3 tools/model_sheets.py v27
import json,re,sys,os
from PIL import Image,ImageDraw,ImageFont,ImageFilter
V=sys.argv[1];A='assets/'
s=open(A+'atlas.js',encoding='utf-8').read()

i=s.find("frames:")+7;F,_=json.JSONDecoder().raw_decode(s[i:])
N=json.load(open('/tmp/names.json'));P={}
FT='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
def font(z):return ImageFont.truetype(FT,z)
def page(i):
  if i not in P:P[i]=Image.open(f'{A}atlas_{i}.png').convert('RGBA')
  return P[i]
def spr(n):
  import os
  HD=os.environ.get('HD','art_v8')
  if n.startswith('h_') and os.path.exists(f'{HD}/{n}.png'):return Image.open(f'{HD}/{n}.png').convert('RGBA')
  f=F.get('U:'+n) or F.get(n)
  if not f:return None
  return page(f[0]).crop((f[1],f[2],f[1]+f[3],f[2]+f[4]))
def sheet(out,rows,cell,title,cols):
  W=cols*cell+40;H=90+len(rows)*(cell+40)
  im=Image.new('RGB',(W,H),'#fff4f8');d=ImageDraw.Draw(im)
  for y in range(H):d.line([(0,y),(W,y)],fill=(255,244-y*20//H,248-y*14//H))
  d.text((W//2,40),title,font=font(34),fill='#7a3a55',anchor='mm')
  for r,row in enumerate(rows):
    for c,(n,lab) in enumerate(row):
      x=20+c*cell;y=80+r*(cell+40);sp=spr(n)
      d.ellipse([x+cell*.18,y+cell*.82,x+cell*.82,y+cell*.95],fill=(235,205,220))
      if sp:sp=sp.resize((cell-16,cell-16),Image.LANCZOS);im.paste(sp,(x+8,y+4),sp)
      else:d.text((x+cell//2,y+cell//2),'缺图',font=font(18),fill='#c00',anchor='mm')
      d.text((x+cell//2,y+cell+16),lab,font=font(max(14,cell//11)),fill='#5a3040',anchor='mm')
  im.save(out,optimize=True);print(out,im.size,os.path.getsize(out)//1024,'KB')
T=N['towers'];base=[k for k in T if not k.startswith(('f_','u_'))]
rows=[[(f't_{k}_{l}_0' if l<4 else f't_{k}_5A_0',f'{T[k]} Lv{l}') for l in (1,3,5)] for k in base]
# 2 towers per row → 6 cols
rows2=[rows[i]+(rows[i+1] if i+1<len(rows) else []) for i in range(0,len(rows),2)]
sheet(f'sheets/models_towers_{V}.png',rows2,190,f'基础伙伴 Lv1/3/5 · {V}',6)
fu=[(k+'_3_0',T[k]+' Lv3') for k in T if k.startswith('f_')]+[(k+'_0',T[k]+'（究极）') for k in T if k.startswith('u_')]
sheet(f'sheets/models_fusion_{V}.png',[fu[i:i+4] for i in range(0,len(fu),4)],240,f'融合 / 究极伙伴 · {V}',4)
en=[(f'e_{k}_0',v) for k,v in N['enemies'].items()]+[(f'e_{k}_0',v+'（首领）') for k,v in N['bosses'].items()]
sheet(f'sheets/models_enemies_{V}.png',[en[i:i+6] for i in range(0,len(en),6)],180,f'敌人与首领 · {V}',6)
H=N['heroes'];hs=list(H)[:4]
cl=[(f'h_{k}_0' if spr(f'h_{k}_0') else f't_{k}_5A_0',H[k]) for k in hs]
sheet(f'sheets/closeup_{V}.png',[cl[:2],cl[2:4]],560,f'英雄特写 2x · {V}',2)
