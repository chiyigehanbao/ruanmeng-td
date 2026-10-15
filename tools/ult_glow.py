# 软萌大作战 © 2026 <著作权人>
# 究极塔精灵内发光：按签名色在 alpha 轮廓外加柔光，五帧强度不同形成呼吸动画
import sys,os
from PIL import Image,ImageFilter,ImageChops
D=sys.argv[1] if len(sys.argv)>1 else 'art_v31'
SIG={'cosmos':'#7a5cff','phoenix':'#ff4a1a','raijin':'#2ab8ff','gaia':'#3fbf4f','skyhunter':'#ffb800','verdant':'#1fbf8f'}
K={'0':0.75,'w':0.9,'a':1.0,'r':0.6,'h':0.85}
for u,col in SIG.items():
    rgb=tuple(int(col[i:i+2],16) for i in (1,3,5))
    for fr,k in K.items():
        p=os.path.join(D,'u_%s_%s.png'%(u,fr))
        if not os.path.exists(p):continue
        im=Image.open(p).convert('RGBA');a=im.split()[3]
        g=a.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(10)).point(lambda v:int(min(255,v*1.6*k)))
        glow=Image.new('RGBA',im.size,rgb+(0,));glow.putalpha(g)
        out=Image.alpha_composite(glow,im);out.save(p+'.tmp.png');os.replace(p+'.tmp.png',p)
print('glow ok')
