# 软萌大作战 V1.0  © 2026 <著作权人>
# 角色阵容总览图：python3 tools/lineup.py -> lineup_v3.png
import os
from PIL import Image,ImageDraw
R=os.environ.get('ART_SRC','art_v8');T=['cat','penguin','bear','bunny','fox','pig','dragon']
rows=[[f't_{t}_{l}_0' for l in (1,2,3,4,5)]+[f't_{t}_6A_0',f't_{t}_6B_0',f't_{t}_7A_0',f't_{t}_7B_0'] for t in T]
en=sorted(f[:-4] for f in os.listdir(R) if f.startswith('e_') and f.endswith('_0.png'))
rows+=[en[i:i+9] for i in range(0,len(en),9)]
rows.append(sorted(f[:-4] for f in os.listdir(R) if f.startswith('h_') and f.endswith('_0.png'))+[f's_{s}_3_0' for s in ('cat_black','bunny_choco','bear_panda')])
C=150;S=Image.new('RGB',(9*C,len(rows)*C),'#fff4f8');d=ImageDraw.Draw(S)
for r,row in enumerate(rows):
  for c,n in enumerate(row):
    p=f'{R}/{n}.png'
    if os.path.exists(p):im=Image.open(p).convert('RGBA').resize((C-10,C-10),Image.LANCZOS);S.paste(im,(c*C+5,r*C+5),im)
S.save('lineup_v3.png');print(S.size,len(rows))
