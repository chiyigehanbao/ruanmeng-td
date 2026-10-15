# 软萌大作战 V1.0  © 2026 <著作权人>
# 美术升级前后对比：python3 tools/before_after.py <旧渲染目录> art_v4 out.png
import sys
from PIL import Image,ImageDraw
old,new,out=sys.argv[1:4]
names=['t_cat_6A_0','t_cat_6A_h','t_penguin_3_0','t_bunny_7B_0','e_normal_0','e_king_h','h_princess_0','t_fox_5_a']
C=300;S=Image.new('RGB',(len(names)*C,3*C+40),'#fff4f8');d=ImageDraw.Draw(S)
for i,n in enumerate(names):
    a=Image.open(f'{old}/{n}.png').convert('RGBA');b=Image.open(f'{new}/{n}.png').convert('RGBA')
    S.paste(a.resize((C,C),Image.LANCZOS),(i*C,40),a.resize((C,C),Image.LANCZOS))
    S.paste(b.resize((C,C),Image.LANCZOS),(i*C,40+C),b.resize((C,C),Image.LANCZOS))
    cb=b.crop((int(b.width*.28),int(b.height*.3),int(b.width*.72),int(b.height*.74))).resize((C//2,C//2),Image.LANCZOS)
    ca=a.crop((int(a.width*.28),int(a.height*.3),int(a.width*.72),int(a.height*.74))).resize((C//2,C//2),Image.LANCZOS)
    S.paste(ca,(i*C,40+2*C),ca);S.paste(cb,(i*C+C//2,40+2*C),cb)
d.text((10,10),'top: before (v3, 256px)   middle: after (v4, 512px)   bottom: face crop before | after',fill='#7a4a55')
S.save(out);print(S.size)
