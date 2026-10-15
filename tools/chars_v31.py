# 软萌大作战 © 2026 <著作权人>
# 角色 v31：在 v30 基础上——Lv5 主题化王权、3/4 侧身显尾巴、究极王座/能量刃/签名色、首领非团块轮廓、AO+渐变明暗
# 用法：ART_OUT=art_v31 blender -b -P tools/chars_v31.py -- <filter> [force] go
import sys,os
_src=open('/workspace/td-proto/tools/chars_v30.py',encoding='utf-8').read().replace("if 'go' in argv:_run()","")
exec(_src)
import math
from mathutils import Vector
# ---------- 5) 明暗：环境光遮蔽 + 自下而上的亮度渐变（仅非发光材质） ----------
_toon0=toon
def toon(col,shadow=None,spec=0.0,rim=0.5,flat=False,emit=1.0):
    m=_toon0(col,shadow,spec,rim,flat,emit)
    if flat or m.get('v31'):return m
    nt=m.node_tree;N=nt.nodes;L=nt.links;em=[n for n in N if n.type=='EMISSION'][0]
    if not em.inputs[0].links:return m
    src=em.inputs[0].links[0].from_socket
    ao=N.new('ShaderNodeAmbientOcclusion');ao.samples=8;ao.inputs['Distance'].default_value=0.4
    ar=N.new('ShaderNodeMapRange');ar.inputs[1].default_value=0.0;ar.inputs[2].default_value=1.0;ar.inputs[3].default_value=0.7;ar.inputs[4].default_value=1.0
    L.new(ao.outputs['AO'],ar.inputs[0])
    geo=N.new('ShaderNodeNewGeometry');sp=N.new('ShaderNodeSeparateXYZ');L.new(geo.outputs['Position'],sp.inputs[0])
    zr=N.new('ShaderNodeMapRange');zr.inputs[1].default_value=-1.2;zr.inputs[2].default_value=1.0;zr.inputs[3].default_value=0.86;zr.inputs[4].default_value=1.05
    L.new(sp.outputs['Z'],zr.inputs[0])
    mu=N.new('ShaderNodeMath');mu.operation='MULTIPLY';L.new(ar.outputs[0],mu.inputs[0]);L.new(zr.outputs[0],mu.inputs[1])
    sc=N.new('ShaderNodeVectorMath');sc.operation='SCALE';L.new(src,sc.inputs[0]);L.new(mu.outputs[0],sc.inputs['Scale'])
    L.new(sc.outputs[0],em.inputs[0]);m['v31']=1;return m
# ---------- 5) 布料褶皱 / 毛簇 ----------
_outfit30=outfit
def outfit(t,col=None,acc=None,lv=1):
    _outfit30(t,col,acc,lv)
    st,c1,c2=OUTFIT[t];c1=col or c1;bx,by,bz,zc,hs=BODY[CUR[0] or t];fold=toon(shade_hex(c1,-0.22),rim=0.2)
    if st in('dress','skirt','robe','poncho','cloak'):
        for az in(-38,-14,14,38):o=decal((0,0.02,-0.98),bx+0.22,az,0,(0.025,0.02,0.16),fold,0.0)
    elif st in('tunic','ranger','coverall','hoodie','parka','overall','waistcoat','tank'):
        for az in(-30,30):decal((0,0.0,zc-0.15),bx+0.04,az,-10,(0.02,0.02,0.12),fold,0.0)
_tufts0=tufts
def tufts(t,mb,mw):
    _tufts0(t,mb,mw)
    if t in('sheep','hamster','koala','fox','cat','bear','chick','owl'):   # 胸前毛簇
        for i,x in enumerate((-0.1,0.0,0.1)):cone((x,-0.5,-0.3-abs(x)*0.3),0.06,0.16,(math.radians(180),0,0),mw,0.0,v=8)
# ---------- 2) 尾巴：统一偏到身体左后侧，配合 3/4 侧身可读 ----------
ROTZ=18
def tail(t,mb,md,mw):
    k=TAIL.get(t)
    if k=='curl':
        for i in range(8):a=i*0.55;sph((-0.62-math.sin(a)*0.26-i*0.035,0.3,-0.98+i*0.19),(0.15,0.15,0.17),mb if i<6 else mw,0.022)
    elif k=='brush':
        o=sph((-0.72,0.42,-0.62),(0.34,0.32,0.66),mb);o.rotation_euler=(math.radians(-15),math.radians(-48),0)
        sph((-1.08,0.5,-0.18),(0.22,0.22,0.26),mw)
    elif k=='stub':sph((-0.36,0.55,-0.85),(0.25,0.22,0.22),md,0.025)
    elif k=='pom':sph((-0.4,0.55,-0.85),(0.33,0.3,0.33),mw,0.025)
    elif k=='twist':
        for i in range(5):a=i*1.2;sph((-0.45-math.cos(a)*0.09,0.55,-0.82+math.sin(a)*0.09+i*0.03),(0.06,0.06,0.06),md,0.012)
    elif k=='spike':
        for i in range(5):sph((-0.45-0.16*i,0.5+0.06*i,-1.05+0.07*i),(0.2-0.03*i,0.18-0.025*i,0.16-0.02*i),md,0.02);cone((-0.45-0.16*i,0.5+0.06*i,-0.88+0.07*i),0.07,0.16,(0,0,0),toon('#fff2c9'),0.012,v=8)
    elif k=='mane':
        for i,c in enumerate(['#ff8fb1','#ffd166','#8fd3ff']):cone((-0.4-i*0.1,0.62,-0.72+i*0.04),0.17,0.65,(math.radians(-40),math.radians(-30),0),toon(c),0.02)
    elif k=='feather':
        for i in range(3):sph((-0.3+(i-1)*0.12,0.58,-0.9),(0.08,0.11,0.24),md,0.015).rotation_euler=(math.radians(-40),(i-1)*0.35,0)
# ---------- 1) Lv5 主题王权 ----------
# (光环纹样, 光环色, 王冠款式, 宝石色)
LV5={'cat':('leaf','#7ee08a','laurel','#ff6f9c'),'penguin':('ice','#8fdcff','tiara','#5ab8ff'),'frog':('bubble','#c06cff','crown','#9be37a'),
 'bear':('flame','#ff8a3a','horns','#ff3b6b'),'bunny':('heart','#ff8fd0','tiara','#b46cff'),'fox':('flame','#ff5a3a','flamecrown','#ffd23f'),
 'pig':('coin','#ffd23f','crown','#ff3b6b'),'owl':('moon','#ffd27a','tiara','#5a4aff'),'hedgehog':('bolt','#ffe066','spikecrown','#4f7fe0'),
 'sheep':('flower','#ff6fa8','laurel','#ffd23f'),'deer':('leaf','#9be37a','antlercrown','#3ab06a'),'hamster':('sun','#ffb02a','helm','#ff5a7a'),
 'koala':('leaf','#7ec8ff','laurel','#ff6f9c'),'chick':('sun','#ffd23f','crown','#ff8a3d'),'dragon':('ice','#ff6a3d','horns','#ffd23f'),'unicorn':('star','#d8a8ff','tiara','#ffe066')}
def motif(kind,c,s,col):
    c=Vector(c);m=toon(col,flat=True,emit=1.7);w=toon('#ffffff',flat=True,emit=2.0)
    if kind=='ice':crystal(c-Vector((0,0,s*0.3)),s*0.45,s*1.1,toon(col,spec=1,emit=1.5),0.015)
    elif kind=='star':star5(c,s*0.8,m,0.014)
    elif kind=='flame':rod(c-Vector((0,0,s*0.3)),c+Vector((0,0,s*0.9)),s*0.5,m,0.014,r2=0.0,v=16);ball(c-Vector((0,0,s*0.2)),s*0.5,m,0.014);ball(c-Vector((0,0.05,s*0.25)),s*0.25,w,0)
    elif kind=='leaf':o=sph(tuple(c),(s*0.32,s*0.18,s*0.75),m,0.014)
    elif kind=='coin':cyl(tuple(c),s*0.6,0.06,(math.radians(90),0,0),toon(col,spec=1,emit=1.3),0.014)
    elif kind=='bolt':rod(c+Vector((s*0.3,0,s*0.6)),c,s*0.25,m,0.012,r2=s*0.12);rod(c,c+Vector((-s*0.3,0,-s*0.6)),s*0.25,m,0.012,r2=0.0)
    elif kind=='heart':
        for k in(-1,1):ball(c+Vector((k*s*0.28,0,s*0.15)),s*0.36,m,0.014)
        cone(tuple(c-Vector((0,0,s*0.25))),s*0.58,s*0.6,(math.radians(180),0,0),m,0.014,v=16)
    elif kind=='moon':ball(c,s*0.55,m,0.014);ball(c+Vector((s*0.28,-0.08,s*0.12)),s*0.45,toon('#3a2a6a',flat=True),0)
    elif kind=='sun':
        ball(c,s*0.42,m,0.014)
        for i in range(8):a=i/8*math.tau;rod(c+Vector((math.cos(a),0,math.sin(a)))*s*0.45,c+Vector((math.cos(a),0,math.sin(a)))*s*0.85,s*0.12,m,0.008,r2=0.0,v=6)
    elif kind=='flower':
        for i in range(5):a=i/5*math.tau;ball(c+Vector((math.cos(a),0,math.sin(a)))*s*0.38,s*0.3,m,0.012)
        ball(c-Vector((0,0.06,0)),s*0.25,toon('#ffe066',flat=True,emit=1.8),0)
    elif kind=='bubble':
        for d,r in(((0,0,0),0.4),((s*0.4,0,s*0.35),0.25),((-s*0.35,0,s*0.4),0.2)):ball(c+Vector(d),s*r*1.4,toon(col,spec=1,emit=1.3),0.012)
def themed_halo(t,z,r,br):
    mk,hc,cr,gem=LV5[t];hc2=hc if br!='B' else shade_hex(hc,-0.25)
    tor((0,0.62,z),r,0.06,(math.radians(90),0,0),toon(hc2,flat=True,emit=1.7),0.016)
    for i in range(6):
        a=math.radians(90+(-1 if i<3 else 1)*(28+(i%3)*32))
        motif(mk,(math.cos(a)*r,0.56,z+math.sin(a)*r),0.27,hc2)
def themed_crown(t,z,br):
    mk,hc,cr,gem=LV5[t];gold=toon('#ffd23f',spec=0.9,rim=0.5);gm=toon(gem,spec=1,emit=1.3)
    if cr=='crown':crown(z,gem)
    elif cr=='tiara':
        tor((0,0.0,z-0.05),0.42,0.035,(math.radians(-12),0,0),gold,0.012)
        for i,x in enumerate((-0.2,0,0.2)):crystal((x,-0.3,z+0.0),0.07 if i!=1 else 0.1,0.18 if i!=1 else 0.32,gm if i==1 else gold,0.012)
    elif cr=='laurel':
        for i in range(12):
            a=math.radians(200+i*12) if i<6 else math.radians(-20-(i-6)*12);o=sph((math.cos(a)*0.48,math.sin(a)*0.3-0.05,z-0.02+abs(i%6-2.5)*0.01),(0.06,0.1,0.13),toon('#6ec86a' if i%2 else '#ffd23f',spec=0.5),0.012)
        ball((0,-0.38,z+0.02),0.07,gm,0.01)
    elif cr=='horns':
        cyl((0,0.08,z),0.28,0.12,(math.radians(-10),0,0),gold,0.02)
        for k in(-1,1):rod((k*0.2,0.0,z+0.05),(k*0.48,0.0,z+0.42),0.09,gold,0.016,r2=0.0,v=16)
        ball((0,-0.2,z+0.02),0.08,gm,0.01)
    elif cr=='flamecrown':
        cyl((0,0.08,z),0.28,0.12,(math.radians(-10),0,0),gold,0.02)
        for i,x in enumerate((-0.2,-0.1,0,0.1,0.2)):motif('flame',(x,-0.05,z+0.14+(0.1 if i==2 else 0)),0.13 if i!=2 else 0.18,'#ff6a2a')
    elif cr=='spikecrown':
        cyl((0,0.08,z),0.28,0.12,(math.radians(-10),0,0),metal('#dfe6f2'),0.02)
        for i in range(7):x=(i-3)*0.08;h=0.34-abs(i-3)*0.05;cone((x,-0.05,z+0.06+h/2),0.05,h,(math.radians(-10),0,0),gold,0.012,v=8)
        ball((0,-0.22,z+0.02),0.07,gm,0.01)
    elif cr=='antlercrown':
        for k in(-1,1):
            rod((k*0.18,0,z),(k*0.4,0,z+0.45),0.05,gold,0.012);rod((k*0.3,0,z+0.22),(k*0.55,0,z+0.32),0.04,gold,0.01);ball((k*0.4,0,z+0.46),0.06,gm,0.01)
        tor((0,0.0,z-0.02),0.36,0.035,(math.radians(-10),0,0),gold,0.01)
    elif cr=='helm':
        sph((0,0.05,z-0.08),(0.48,0.44,0.24),metal('#ffd23f'),0.02);cone((0,0.12,z+0.18),0.07,0.4,(math.radians(-20),0,0),toon(gem,emit=1.2),0.014)
def capecol(t,br):return shade_hex(OUTFIT[t][1],-0.12) if br!='B' else shade_hex(PAL[t][3],-0.12)
def level_deco(t,lv,br):
    z=HATZ.get(t,1.42)
    if lv>=4:
        cape(capecol(t,br),1.0 if lv==4 else 1.1)
        if lv==4:top_ornament(t,(0,0.25,z+0.36),1.2)
        else:themed_halo(t,0.55,1.0,br)
    if lv>=5:
        themed_crown(t,z,br);mk,hc,cr,gem=LV5[t]
        tor((0,0.0,-1.32),0.85,0.045,(0,0,0),toon(hc,flat=True,emit=1.7),0)
# ---------- 3) 究极：王座/坐骑/能量刃 + 签名色 + 1.25 倍 ----------
ULTSIG={'cosmos':('#7a5cff','throne','crescent'),'phoenix':('#ff4a1a','throne','flameblade'),'raijin':('#2ab8ff','drums','bolt'),
 'gaia':('#3fbf4f','rock','leafblade'),'skyhunter':('#ffb800','throne','ballista'),'verdant':('#1fbf8f','tree','leafblade')}
def energy_blade(base,ang,length,col,kind):
    d=Vector((math.sin(math.radians(ang)),0,math.cos(math.radians(ang))));tip=base+d*length;m=toon(col,flat=True,emit=2.0);w=toon('#ffffff',flat=True,emit=2.2)
    if kind=='flameblade':rod(base,tip,0.16,m,0.02,r2=0.0,v=12);rod(base-Vector((0,0.03,0)),base+d*length*0.75,0.07,w,0,r2=0.0,v=8)
    elif kind=='crescent':
        for i in range(7):p=base+d*(length*i/6)+Vector((math.sin(i/6*math.pi)*0.22*(1 if ang>0 else -1),0,0));ball(p,0.12-0.012*i,m,0.016)
    elif kind=='leafblade':o=sph(tuple(base+d*length*0.5),(0.16,0.05,length*0.5),m,0.018);o.rotation_euler=(0,math.radians(ang),0)
    else:rod(base,tip,0.13,m,0.018,r2=0.02,v=4);rod(base,base+d*length*0.8,0.05,w,0,r2=0.0,v=4)
def ultimate_tower(k,expr):
    fa,fb,col0=ULTS[k];col,mount,blade=ULTSIG[k];a=FUSIONS[fa][0];b=FUSIONS[fb][0];clear();CUR[0]=a
    pal=(PAL[a][0],PAL[a][1],PAL[b][2],'#ffcf3f');mb,md,mw,iris=chibi(a,pal,expr);ears(a,mb,md,mw);tufts(a,mb,mw)
    face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(a,'smile'))
    tail(b,toon(PAL[b][0]),toon(PAL[b][1]),toon(PAL[b][2]))
    gold=toon('#ffd23f',spec=1,rim=0.6);bx,by,bz,zc,hs=BODY[a];sig=toon(col,spec=0.9,emit=1.3);dk=toon(shade_hex(col,-0.45),rim=0.4)
    sph((0,-0.04,zc),(bx+0.08,by+0.08,bz*0.86),toon(shade_hex(col,0.55),spec=1,rim=0.6),0.03)
    for j in range(2):tor((0,-0.04,zc+0.22-j*0.3),bx+0.04,0.035,(0,0,0),gold,0)
    for kk in(-1,1):o=sph((kk*(bx*0.9),-0.05,zc+bz*0.68),(0.3,0.28,0.18),gold,0.025);o.rotation_euler=(0,kk*math.radians(-35),0)
    sph((0,-by-0.12,zc+0.12),(0.16,0.06,0.18),toon(col,spec=1,emit=1.8),0.015)
    specifics(a,mb,md,mw,iris,5);i1=len(OBJS);weapon(b,5);mirror_part(i1)
    sph((0,0.5,-0.55),(0.95,0.2,0.8),toon(col,rim=0.5),0.03)   # 签名色披风
    # 底座：阶梯台
    cyl((0,0.1,-1.38),1.05,0.14,(0,0,0),dk,0.025);cyl((0,0.1,-1.26),0.85,0.1,(0,0,0),gold,0.02)
    if mount=='throne':
        cyl((0,0.95,0.2),1.5,0.18,(math.radians(90),0,0),dk,0.03,v=6);tor((0,0.85,0.2),1.5,0.05,(math.radians(90),0,0),gold,0.012)
        for kk in(-1,1):energy_blade(Vector((kk*0.95,0.4,-0.7)),kk*24,2.0,col,blade)
        if blade=='ballista':
            rod(Vector((-0.95,0.6,1.0)),Vector((0.95,0.6,1.0)),0.08,toon('#8a5a3b'),0.02);rod(Vector((0,0.6,0.6)),Vector((0,0.6,1.5)),0.1,gold,0.02)
            cone((0,0.55,1.65),0.16,0.3,(0,0,0),sig,0.02)
        elif blade=='crescent':star5(Vector((0,0.8,1.4)),0.3,toon('#ffe066',spec=1,emit=1.6),0.02)
        else:motif('flame',(0,0.8,1.3),0.36,col)
    elif mount=='drums':
        tor((0,0.85,0.45),1.48,0.05,(math.radians(90),0,0),gold,0.012)
        for i in range(8):
            a2=i/8*math.tau;p=(math.cos(a2)*1.48,0.6,0.45+math.sin(a2)*1.48);cyl(p,0.25,0.16,(math.radians(90),0,0),sig,0.02);cyl((p[0],0.7,p[2]),0.14,0.02,(math.radians(90),0,0),toon('#fff6e0'),0.0)
        for kk in(-1,1):energy_blade(Vector((kk*0.7,0.7,-0.6)),kk*24,1.5,col,'bolt')
    elif mount=='rock':
        for kk in(-1,1):
            sph((kk*1.35,0.3,-0.45),(0.38,0.36,1.0),toon('#8a7a6a',rim=0.3),0.03,seg=8);energy_blade(Vector((kk*1.35,0.25,0.4)),kk*14,1.1,col,'leafblade')
        sph((0,0.95,0.3),(0.9,0.2,1.0),toon('#7a6a5a',rim=0.3),0.03,seg=8)
    elif mount=='tree':
        cyl((0,0.95,0.0),0.32,2.0,(0,0,0),toon('#8a5a3b',rim=0.3),0.03,v=10)
        for (x,zz,r) in((-1.3,0.6,0.5),(1.3,0.6,0.5),(0,1.6,0.55),(-0.75,1.45,0.45),(0.75,1.45,0.45)):sph((x,1.0,zz),(r,r*0.6,r*0.85),toon(col,rim=0.5),0.03)
        for (x,zz) in((-0.75,1.1),(0.4,1.45),(0.8,0.85)):ball((x,0.62,zz),0.09,toon('#ffe066',flat=True,emit=1.8),0.01)
    z=HATZ.get(a,1.42);cyl((0,0.08,z),0.3,0.16,(math.radians(-10),0,0),gold,0.022)
    for i,x in enumerate((-0.2,0,0.2)):h=0.3 if i==1 else 0.2;cone((x,-0.05,z+0.08+h/2),0.07,h,(math.radians(-10),0,0),gold,0.016,v=12);sph((x,-0.06,z+0.1+h),(0.055,0.055,0.055),sig,0.01)
    tor((0,0,-1.45),1.15,0.06,(0,0,0),toon(col,flat=True,emit=2),0)
# ---------- 4) 首领：非团块轮廓 ----------
BOSS=('king','jelly','frost','magma','ghostking','star');BOSS_SC=1.16
_mon30=monster
def monster(k,expr='idle'):
    fe=dict(iris='#5a3442',expr=expr,el=-6,sp=27,size=1.0)
    if k=='frost':   # 冰晶巨人：多面体躯干 + 冰角 + 肩部晶簇 + 粗臂巨拳 + 双腿
        clear();ice=toon('#bfe9ff',spec=0.8,rim=0.6);deep=toon('#5aa8e8',spec=0.9,rim=0.5);wh=toon('#ffffff',spec=1,emit=1.2)
        sph((0,0,-0.35),(0.82,0.66,0.9),ice,0.04,seg=6);sph((0,-0.15,0.35),(0.62,0.55,0.55),ice,0.04,seg=8)
        face((0,-0.15,0.35),0.6,**dict(fe,iris='#2a5ab8',size=0.8))
        for kk in(-1,1):
            crystal((kk*0.38,0,0.75),0.12,0.6,deep,0.02);
            for j,(dx,dz,h) in enumerate(((0,0,0.55),(0.18,-0.08,0.38),(-0.12,-0.05,0.32))):crystal((kk*(0.85+dx),0.05,0.3+dz),0.1,h,wh if j else deep,0.016)
            rod((kk*0.85,0,0.1),(kk*1.15,-0.15,-0.7),0.2,ice,0.03,v=8);sph((kk*1.2,-0.2,-0.88),(0.34,0.3,0.3),deep,0.03,seg=6)
            rod((kk*0.35,0,-1.0),(kk*0.4,-0.05,-1.4),0.22,ice,0.03,v=8);sph((kk*0.42,-0.15,-1.45),(0.24,0.3,0.1),deep,0.02,seg=8)
        decal((0,0,-0.35),0.66,0,-10,(0.2,0.2,0.04),toon('#8fdcff',flat=True,emit=1.6),0.02)
        return
    if k=='magma':   # 熔岩角魔像：多面岩块 + 弯角 + 背脊尖刺 + 熔岩拳 + 双腿
        clear();rk=toon('#6a2e24',rim=0.35);rk2=toon('#8a3a2a',rim=0.35);lava=toon('#ffb02a',flat=True,emit=1.9);hot=toon('#ff5a1a',flat=True,emit=1.8)
        sph((0,0,-0.4),(0.9,0.72,0.82),rk2,0.04,seg=6);sph((0,-0.12,0.3),(0.62,0.55,0.5),rk,0.04,seg=7)
        face((0,-0.12,0.3),0.6,**dict(fe,iris='#ff4d1a',size=0.8))
        for kk in(-1,1):
            rod((kk*0.4,0,0.62),(kk*0.75,-0.05,1.1),0.13,toon('#3a2a2a',spec=0.5),0.02,r2=0.0,v=8)
            rod((kk*0.85,0,0.0),(kk*1.2,-0.15,-0.7),0.22,rk2,0.03,v=6);sph((kk*1.25,-0.2,-0.9),(0.36,0.32,0.32),rk,0.03,seg=6);ball((kk*1.25,-0.48,-0.9),0.14,lava,0.01)
            rod((kk*0.35,0,-1.0),(kk*0.42,-0.05,-1.4),0.24,rk,0.03,v=6)
        for i in range(5):cone(((i-2)*0.3,0.55,0.0+(2-abs(i-2))*0.15),0.12,0.45,(math.radians(-25),0,0),hot,0.02,v=6)
        for i in range(7):decal((0,0,-0.4),0.78,i*40-120,-40+(i%3)*25,(0.18,0.05,0.03),lava,0)
        return
    if k=='ghost':
        _mon30(k,expr);m=toon('#ff4fb8',flat=True,emit=1.8)
        cone((0,0.1,0.75),0.22,0.55,(0,0,0),m,0.02,v=12);ball((0,0.0,0.62),0.16,toon('#ffd0f0',flat=True,emit=2),0)   # 粉色鬼火
        tor((0,-0.05,-0.62),0.62,0.05,(math.radians(8),0,0),toon('#2fe0c8',flat=True,emit=1.7),0.012)   # 青色腰环
        return
    if k=='ghostking':
        _mon30(k,expr);m=toon('#ff4fb8',flat=True,emit=1.8)
        for kk in(-1,1):rod((kk*0.5,-0.25,0.55),(kk*1.0,-0.3,1.05),0.11,toon('#ffd23f',spec=0.9),0.016,r2=0.0)
        cyl((-1.0,-0.3,-0.45),0.16,0.3,(0,0,0),toon('#2a2448'),0.02);ball((-1.0,-0.35,-0.45),0.12,toon('#2fe0c8',flat=True,emit=2),0)   # 灯笼
        rod((-1.0,-0.3,-0.3),(-0.75,-0.25,0.1),0.025,toon('#ffd23f'),0.01)
        return
    if k=='king':
        _mon30(k,expr);gold=toon('#ffd23f',spec=0.8)
        for kk in(-1,1):sph((kk*0.85,-0.1,-0.1),(0.28,0.24,0.18),gold,0.02).rotation_euler=(0,kk*math.radians(-30),0)   # 金肩甲
        sph((0,-0.65,-0.75),(0.4,0.12,0.22),toon('#fff6f0',spec=0.3),0.02)   # 白胡须
        return
    if k=='jelly':
        _mon30(k,expr)
        for i in range(6):a=math.radians(200+i*28);rod((math.cos(a)*0.85,math.sin(a)*0.5,-0.55),(math.cos(a)*1.15,math.sin(a)*0.5-0.1,-1.2),0.09,toon('#ff8fb8',spec=0.7),0.016,r2=0.03,v=12)
        tor((0,0,0.1),0.95,0.06,(math.radians(5),0,0),toon('#fff6f0',spec=0.6),0.012)   # 奶油裙边
        for i,x in enumerate((-0.3,0,0.3)):ball((x,-0.1,0.72+(0.12 if i==1 else 0)),0.12,toon('#ff3b6b',spec=1),0.012)   # 樱桃冠
        return
    if k=='star':
        _mon30(k,expr);gold=toon('#ffd23f',spec=0.9);wh=toon('#ffffff',flat=True,emit=1.8)
        for i in range(5):a=math.pi/2+i/5*math.tau;ball((math.cos(a)*1.2,-0.1,-0.25+math.sin(a)*1.2),0.1,wh,0.012)
        tor((0,0,-0.25),0.72,0.05,(math.radians(90),0,0),gold,0.012);cyl((0,-0.05,0.55),0.22,0.16,(0,0,0),gold,0.016)
        return
    _mon30(k,expr)
def _orig_run_inner():
    global SCALE
    for name,kind,a in JOBS:
        if kind=='t':
            t,lv,br,pal,hero=a
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr)
                if (pal or hero) and fr=='h':continue
                if hero and fr in('w','r'):continue
                tower(t,lv,br,ex,pal,hero);SCALE=LVS(lv) if not hero else 1.0;render(name+'_'+fr,sq,tl,0,ROTZ);SCALE=1.0
        elif kind=='f':
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr);fusion_tower(a[0],ex,a[1]);SCALE=0.9+0.05*a[1];render(name+'_'+fr,sq,tl,0,ROTZ);SCALE=1.0
        elif kind=='e':
            for fr,ex,sq,tl,dz in(('0','idle',1.0,0,0),('1','idle',0.88,0,-0.08),('h','hurt',0.95,8,0),('d','dead',0.55,0,-0.3)):
                monster(a,ex);SCALE=BOSS_SC if a in BOSS else 1.0;render(name+'_'+fr,sq,tl,dz);SCALE=1.0
        else:
            prop(a);prop2(a);render(name+'_0')
        if MZ:
            fn=os.path.join(RAW,'_mz.json');old=json.load(open(fn)) if os.path.exists(fn) else {};old.update(MZ);json.dump(old,open(fn,'w'));MZ.clear()
def _run():
    global SCALE
    setup()
    for name,kind,a in JOBS:
        if FILT and not any(f in name for f in FILT.split(',')):continue
        if not FORCE and os.path.exists(os.path.join(RAW,name+'_0.png')):continue
        if kind=='u':
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr);ultimate_tower(a,ex);bpy.context.scene.camera.data.ortho_scale=5.4;SCALE=1.05;render(name+'_'+fr,sq,tl,0.4,ROTZ);SCALE=1.0;bpy.context.scene.camera.data.ortho_scale=4.3
            if MZ:
                fn=os.path.join(RAW,'_mz.json');old=json.load(open(fn)) if os.path.exists(fn) else {};old.update(MZ);json.dump(old,open(fn,'w'));MZ.clear()
            continue
        _bak=JOBS[:];JOBS[:]=[(name,kind,a)];globals()['FILT']=''
        try:_orig_run_inner()
        finally:JOBS[:]=_bak;globals()['FILT']=FILT0
    print('V31 DONE')
FILT0=FILT
if 'go' in argv:_run()
