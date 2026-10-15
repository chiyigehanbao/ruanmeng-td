# 软萌大作战 V1.0  © 2026 <著作权人>
# 生成美术展示图：阵容表 / 进化条 / 融合树（python3 tools/sheets.py）
from PIL import Image,ImageDraw,ImageFont
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');A=R+'/'+os.environ.get('ART_SRC','art_v8')+'/';O=R+'/sheets/';os.makedirs(O,exist_ok=True)
FONT=[f for f in ['/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc','/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc','/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'] if os.path.exists(f)]
def F(s):return ImageFont.truetype(FONT[0],s) if FONT else ImageFont.load_default()
T=['cat','penguin','frog','bear','bunny','fox','pig','owl','hedgehog','sheep','hamster','chick','deer','koala','dragon','unicorn']
N={'cat':'喵喵弓手','penguin':'企鹅冰冰','frog':'蛙蛙毒毒','bear':'熊熊炮手','bunny':'兔兔电电','fox':'狐狐火球','pig':'猪猪存钱罐','owl':'咕咕狙击','hedgehog':'刺刺弹弹','sheep':'咩咩治愈','hamster':'仓仓导弹','chick':'叽叽召唤','deer':'鹿鹿光环','koala':'考拉磁磁','dragon':'龙龙光束','unicorn':'独角兽黑洞'}
RAR={'cat':'N','penguin':'N','frog':'N','bear':'R','bunny':'R','fox':'R','pig':'R','owl':'R','hedgehog':'R','sheep':'R','hamster':'SR','chick':'SR','deer':'SR','koala':'SR','dragon':'SSR','unicorn':'SSR'}
RC={'N':(159,179,200),'R':(79,168,255),'SR':(180,108,255),'SSR':(255,176,32)}
def im(n,s):
    p=A+n+'.png'
    if not os.path.exists(p):return Image.new('RGBA',(s,s))
    x=Image.open(p).convert('RGBA');b=x.getbbox()
    return x.resize((s,s),Image.LANCZOS)
def bg(w,h,c1=(255,246,250),c2=(255,232,240)):
    g=Image.new('RGBA',(w,h));d=ImageDraw.Draw(g)
    for y in range(h):t=y/h;d.line([(0,y),(w,y)],fill=tuple(int(c1[i]*(1-t)+c2[i]*t) for i in range(3))+(255,))
    return g
# 阵容表：16 伙伴 × Lv1 / Lv3 / Lv4A / Lv5B
cols=[('Lv1','_1'),('Lv3','_3'),('Lv4·A','_4A'),('Lv5·B','_5B')];S=220;CW=S*4+40;rows=4;per=4
W=CW*per+40;H=120+((len(T)+per-1)//per)*(S+80)+20;img=bg(W,H);d=ImageDraw.Draw(img)
d.text((W//2,50),'软萌大作战 v0.5 · 16 伙伴阵容（Lv1 / Lv3 / Lv4 分支A / Lv5 分支B）',font=F(48),fill=(200,80,120),anchor='mm')
for i,t in enumerate(T):
    x0=20+(i%per)*CW;y0=110+(i//per)*(S+80);rc=RC[RAR[t]]
    d.rounded_rectangle([x0,y0,x0+CW-20,y0+S+66],24,fill=(255,255,255,200),outline=rc,width=5)
    d.rounded_rectangle([x0+14,y0+12,x0+80,y0+48],14,fill=rc);d.text((x0+47,y0+30),RAR[t],font=F(24),fill='white',anchor='mm')
    d.text((x0+(CW-20)//2,y0+30),N[t],font=F(32),fill=(110,60,80),anchor='mm')
    for j,(lab,suf) in enumerate(cols):
        sp=im('t_'+t+suf+'_0',S-10);img.alpha_composite(sp,(x0+10+j*S,y0+50));d.text((x0+10+j*S+S//2,y0+S+50),lab,font=F(22),fill=(150,100,120),anchor='mm')
img.convert('RGB').save(O+'roster_v5.png',quality=92)
# 进化条：3 只伙伴 Lv1..5A/B
EV=['cat','bunny','hamster'];S=260;labs=['Lv1','Lv2','Lv3','Lv4 A','Lv4 B','Lv5 A','Lv5 B'];sufs=['_1','_2','_3','_4A','_4B','_5A','_5B']
W=S*7+60;H=110+len(EV)*(S+70);img=bg(W,H);d=ImageDraw.Draw(img);d.text((W//2,50),'合成进化：每一级都有明显外观变化（围巾 → 护肩腰带宝石 → 分支披风/翅膀 → 王冠光环宝珠）',font=F(36),fill=(200,80,120),anchor='mm')
TC=[(196,206,220),(110,224,122),(79,168,255),(79,168,255),(255,90,122),(79,168,255),(255,90,122)]
for r,t in enumerate(EV):
    y0=100+r*(S+70)
    for j,suf in enumerate(sufs):
        x0=30+j*S;d.rounded_rectangle([x0+6,y0,x0+S-6,y0+S+40],20,fill=(255,255,255,190),outline=TC[j],width=6)
        img.alpha_composite(im('t_'+t+suf+'_0',S-30),(x0+15,y0+6));d.text((x0+S//2,y0+S+18),N[t]+' '+labs[j],font=F(22),fill=(120,70,90),anchor='mm')
img.convert('RGB').save(O+'evolution_strip.png',quality=92)
# 融合树：基础 → 融合(Lv1/3) → 究极
FU={'superconduct':('penguin','bunny','超导冰雷'),'inferno':('bear','fox','爆烎炎炮'),'plague':('frog','chick','毒菇小队'),'hawkeye':('owl','cat','鹰眼神射'),'magspike':('hedgehog','koala','磁暴刺球'),
 'bliss':('pig','sheep','福运牧场'),'starlight':('deer','unicorn','星辉圣鹿'),'rocketfire':('hamster','fox','烈焰导弹'),'frostbeam':('dragon','penguin','冰霜龙息'),'toxfire':('frog','fox','毒火双生')}
UL={'cosmos':('starlight','frostbeam','星海神兽'),'phoenix':('inferno','rocketfire','不死凤凰'),'raijin':('superconduct','magspike','雷神降临'),'gaia':('plague','bliss','万物之母'),'skyhunter':('hawkeye','toxfire','天穹猎手')}
order=['starlight','frostbeam','inferno','rocketfire','superconduct','magspike','plague','bliss','hawkeye','toxfire']
RH=150;W=2200;H=160+len(order)*RH+40;img=bg(W,H,(250,246,255),(236,228,255));d=ImageDraw.Draw(img)
d.text((W//2,50),'融合树：两只 Lv5 → 融合伙伴（Lv1-3）→ 两只融合 Lv3 → 究极神话',font=F(46),fill=(130,70,190),anchor='mm')
for x,lab in((330,'基础伙伴 Lv5 ×2'),(930,'融合伙伴 Lv1 → Lv3'),(1800,'究极神话')):d.text((x,115),lab,font=F(30),fill=(150,110,190),anchor='mm')
pos={}
for i,k in enumerate(order):
    a,b,n=FU[k];y=160+i*RH;d.rounded_rectangle([40,y,640,y+RH-14],20,fill=(255,255,255,200))
    img.alpha_composite(im('t_'+a+'_5A_0',128),(70,y+4));d.text((230,y+68),'+',font=F(50),fill=(255,111,156),anchor='mm');img.alpha_composite(im('t_'+b+'_5A_0',128),(270,y+4))
    d.text((520,y+50),N[a][:2]+'×'+N[b][:2],font=F(26),fill=(120,80,110),anchor='mm');d.line([(640,y+68),(700,y+68)],fill=(180,140,220),width=6)
    d.rounded_rectangle([700,y,1260,y+RH-14],20,fill=(255,255,255,210),outline=(200,170,240),width=4)
    for j in range(3):img.alpha_composite(im('f_%s_%d_0'%(k,j+1),124),(712+j*130,y+4))
    d.text((1180,y+50),n,font=F(30),fill=(110,60,150),anchor='mm');d.text((1180,y+92),'Lv1→3',font=F(22),fill=(150,120,180),anchor='mm');pos[k]=(1260,y+68)
RB=[(255,111,143),(255,176,32),(255,224,102),(110,224,122),(79,200,255),(138,123,255),(208,123,255)]
for u,(fa,fb,n) in UL.items():
    ya,yb=pos[fa][1],pos[fb][1];ym=(ya+yb)//2
    for yy in(ya,yb):d.line([(1260,yy),(1500,yy),(1500,ym),(1560,ym)],fill=(255,190,60),width=6)
    for k in range(7):d.rounded_rectangle([1560+k,ym-110+k,2160-k,ym+110-k],30,outline=RB[k],width=2)
    d.rounded_rectangle([1568,ym-102,2152,ym+102],26,fill=(255,251,240,235))
    img.alpha_composite(im('u_'+u+'_0',200),(1580,ym-100));d.text((1950,ym-30),n,font=F(40),fill=(140,60,180),anchor='mm');d.text((1950,ym+28),'神话 MR',font=F(26),fill=(220,150,40),anchor='mm')
img.convert('RGB').save(O+'fusion_tree.png',quality=92)
print('ok')
