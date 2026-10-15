# 软萌大作战 © 2026 <著作权人>
# 角色 v30：真 3D 重塑——每种动物独立体型/服装/尾巴；融合=混血设计；究极=铠甲王权大轮廓；敌人多体型
# 用法：ART_OUT=art_v30 blender -b -P tools/chars_v30.py -- <filter> [force]
import sys,os
sys.argv=[a for a in sys.argv]+(['norun'] if 'norun' not in sys.argv else [])
exec(open(os.path.join('/workspace/td-proto/tools','chars.py'),encoding='utf-8').read())
import math
from mathutils import Vector
_orig_specifics=specifics;_orig_ears=ears;_orig_monster=monster
# ---- 体型：(宽,厚,高,中心z,头缩放) ----
BODY={'cat':(0.58,0.5,0.62,-0.64,1.0),'penguin':(0.7,0.62,0.68,-0.62,0.96),'frog':(0.8,0.6,0.5,-0.74,1.04),'bear':(0.78,0.66,0.66,-0.62,0.98),
 'bunny':(0.5,0.46,0.62,-0.66,0.98),'fox':(0.56,0.5,0.64,-0.64,1.0),'pig':(0.76,0.68,0.6,-0.68,1.0),'owl':(0.66,0.6,0.7,-0.6,0.98),
 'hedgehog':(0.64,0.58,0.56,-0.7,1.0),'sheep':(0.68,0.6,0.6,-0.66,1.0),'deer':(0.5,0.46,0.7,-0.6,0.96),'hamster':(0.7,0.62,0.56,-0.7,1.02),
 'koala':(0.62,0.58,0.72,-0.6,0.98),'chick':(0.6,0.56,0.54,-0.72,1.02),'dragon':(0.66,0.6,0.68,-0.62,0.98),'unicorn':(0.54,0.5,0.66,-0.64,0.98)}
# ---- 服装：(款式, 主色, 辅色) ----
OUTFIT={'cat':('tunic','#4f9a5c','#e9d39a'),'penguin':('parka','#9fe0ff','#ffffff'),'frog':('poncho','#4fae5a','#e8ff9a'),'bear':('overall','#4a6fa8','#ffd23f'),
 'bunny':('dress','#ffd6f2','#b46cff'),'fox':('robe','#c8323c','#ffd23f'),'pig':('waistcoat','#3d3a5a','#ffd23f'),'owl':('cloak','#5a4a7a','#ffcf6a'),
 'hedgehog':('tank','#4f7fe0','#ffffff'),'sheep':('bellcollar','#ff8fb1','#ffd23f'),'deer':('ranger','#7a8a3a','#e8d8a8'),'hamster':('coverall','#ff8a3a','#5a3a3a'),
 'koala':('hoodie','#8fb8e8','#ffffff'),'chick':('shorts','#5ab8ff','#ffffff'),'dragon':('armor','#d8dff0','#ffd23f'),'unicorn':('skirt','#c9a8ff','#ffe066')}
TAIL={'cat':'curl','fox':'brush','bear':'stub','bunny':'pom','pig':'twist','deer':'stub','dragon':'spike','unicorn':'mane','koala':'stub','hamster':'stub',
 'sheep':'pom','chick':'feather','owl':'feather','penguin':'feather','hedgehog':'stub','frog':None}
CUR=[None]
def chibi(t,pal,expr):
    body,dark,belly,iris=pal;mb=toon(body);md=toon(dark);mw=toon(belly)
    bx,by,bz,zc,hs=BODY.get(CUR[0] or t,BODY['cat'])
    sph(H,(R*1.05*hs,R*0.98*hs,R*0.93*hs),mb)
    sph((0,0.02,zc),(bx,by,bz),mb)
    sph((0,-0.3,zc-0.04),(bx*0.62,0.26,bz*0.62),mw,0.02)
    fw=0.32*bx/0.6
    for k in(-1,1):
        sph((k*fw,-0.14,-1.2),(0.24,0.29,0.15),md)
        decal((k*fw,-0.14,-1.2),0.21,0,-20,(0.08,0.055,0.02),toon('#ffb3c6'),0.0)
        hx_=HAND if k>0 else Vector((-HAND.x,HAND.y,HAND.z+0.06))
        rod((k*(bx*0.78),-0.08,zc+0.22),hx_,0.13,mb,0.03,r2=0.15)
        sph(tuple(hx_),(0.17,0.17,0.17),mb)
    return mb,md,mw,iris
def tail(t,mb,md,mw):
    k=TAIL.get(t)
    if k=='curl':
        for i in range(7):a=i*0.5;sph((0.62+math.sin(a)*0.18,0.25,-0.95+i*0.17),(0.11,0.11,0.13),mb if i<5 else mw,0.02)
    elif k=='brush':
        sph((-0.55,0.62,-0.5),(0.38,0.4,0.7),mb).rotation_euler=(math.radians(-30),math.radians(-35),0);sph((-0.9,0.85,0.05),(0.22,0.22,0.3),mw)
    elif k=='stub':sph((0,0.62,-0.85),(0.17,0.15,0.15),md,0.02)
    elif k=='pom':sph((0,0.66,-0.85),(0.24,0.22,0.24),mw,0.02)
    elif k=='twist':tor((0.0,0.68,-0.78),0.12,0.04,(math.radians(90),0,0),md,0.015)
    elif k=='spike':
        for i in range(4):cone((0.15*i,0.6+0.12*i,-1.0+0.05*i),0.22-0.04*i,0.35,(math.radians(-70),0,math.radians(20)),md,0.02)
    elif k=='mane':
        for i,c in enumerate(['#ff8fb1','#ffd166','#8fd3ff']):cone((-0.1+i*0.08,0.75,-0.7),0.18,0.6,(math.radians(-50),0,0),toon(c),0.02)
    elif k=='feather':
        for i in range(3):sph(((i-1)*0.12,0.6,-0.9),(0.07,0.1,0.22),md,0.015).rotation_euler=(math.radians(-40),(i-1)*0.35,0)
def outfit(t,col=None,acc=None,lv=1):
    st,c1,c2=OUTFIT[t];c1=col or c1;c2=acc or c2
    bx,by,bz,zc,hs=BODY[CUR[0] or t];m1=toon(c1,rim=0.35);m2=toon(c2,spec=0.4)
    if st in('tunic','ranger','tank','coverall','hoodie','parka'):
        sph((0,0.0,zc-0.02),(bx+0.05,by+0.05,bz*0.82),m1,0.028)
        if st in('tunic','ranger'):decal((0,0.02,zc),bx,0,5,(0.09,0.03,0.25),m2,0.04)
        if st=='parka':tor((0,0.0,zc+bz*0.62),bx*0.82,0.11,(math.radians(8),0,0),toon('#ffffff',rim=0.2),0.02)
        if st=='hoodie':sph((0,0.42,0.1),(0.62,0.3,0.4),m1,0.025)
        if st=='coverall':[decal((0,0.02,zc),bx,k*25,10,(0.07,0.07,0.03),m2,0.04) for k in(-1,1)]
        if st=='tank':decal((0,0.02,zc),bx,0,0,(0.16,0.03,0.16),toon('#ffd23f',spec=0.5),0.04)
    elif st in('dress','skirt','robe'):
        h={'dress':0.7,'skirt':0.42,'robe':0.86}[st];cone((0,0.02,-1.14+h/2),bx+0.28,h,(0,0,0),m1,r2=bx*0.72,ol=0.03)
        tor((0,0.02,-1.14+0.04),bx+0.26,0.045,(0,0,0),m2,0.0)
        if st=='robe':sph((0,0.0,zc+0.08),(bx+0.04,by+0.04,bz*0.7),m1,0.025);rod((-0.3,-0.48,zc+0.45),(0.25,-0.5,zc-0.25),0.06,m2,0.01)
        if st=='dress':ball((0,-by-0.04,zc+0.3),0.11,m2,0.015,(1.6,0.6,1))
    elif st=='overall':
        sph((0,0.0,zc-0.14),(bx+0.05,by+0.05,bz*0.66),m1,0.028)
        for k in(-1,1):rod((k*0.26,-by*0.86,zc+0.05),(k*0.32,-by*0.55,zc+bz*0.85),0.06,m1,0.015);ball((k*0.26,-by-0.02,zc+0.05),0.06,m2,0.01)
        decal((0,0.0,zc-0.1),bx+0.05,0,0,(0.16,0.03,0.12),toon(shade_hex(c1,0.2)),0.02)
    elif st=='poncho':
        cone((0,0.02,zc+0.12),bx+0.32,0.6,(0,0,0),m1,r2=0.35,ol=0.03)
        for i in range(6):a=i/6*math.tau;sph((math.cos(a)*(bx+0.3),math.sin(a)*(bx+0.3)*0.9,zc-0.18),(0.07,0.07,0.07),m2,0.01)
    elif st=='waistcoat':
        sph((0,0.0,zc),(bx+0.04,by+0.04,bz*0.8),m1,0.028);decal((0,0.0,zc),bx,0,5,(0.1,0.02,0.32),toon('#ffffff'),0.04)
        for j in range(3):ball((0.08,-by-0.08,zc+0.25-j*0.18),0.04,m2,0.006)
        rod((0.12,-by-0.06,zc+0.1),(0.35,-by+0.05,zc-0.1),0.015,m2,0)
    elif st=='cloak':
        sph((0,0.15,zc+0.05),(bx+0.12,by+0.02,bz*0.95),m1,0.03);rod((-0.2,-0.4,zc+0.55),(0.2,-0.4,zc+0.55),0.06,m2,0.01)
        for j in range(4):sph((0,-0.0,zc+0.2-j*0.18),(bx+0.13,by*0.5,0.02),toon(shade_hex(c1,0.12)),0.0)
    elif st=='bellcollar':
        tor((0,-0.02,-0.22),0.42,0.06,(math.radians(10),0,0),m1,0.015);ball((0,-0.48,-0.32),0.13,toon('#ffd23f',spec=0.9),0.02);ball((0,-0.6,-0.36),0.03,toon('#5a3442'),0)
    elif st=='shorts':
        sph((0,0.0,zc-0.24),(bx+0.04,by+0.04,bz*0.48),m1,0.026);[ball((k*0.2,-by-0.0,zc-0.08),0.05,m2,0.01) for k in(-1,1)]
    elif st=='armor':
        sph((0,-0.02,zc),(bx+0.06,by+0.06,bz*0.8),metal(c1),0.028)
        for j in range(3):tor((0,-0.02,zc+0.28-j*0.22),bx+0.02-abs(j-1)*0.05,0.03,(0,0,0),toon(c2,spec=0.8),0)
        ball((0,-by-0.08,zc+0.15),0.09,toon('#ff3b6b',spec=1,emit=1.2),0.01)
    # 等级：Lv2 镶边徽章 / Lv3 护肩
    tc=TIER[min(lv,3)-1]
    if lv>=2:ball((-0.24,-by-0.07,zc+0.32),0.08,toon(tc,spec=0.8,emit=1.15),0.012,(1,0.5,1))
    if lv>=3:
        st2=metal('#e6ecf6');gold=toon('#ffd23f',spec=0.8,rim=0.5)
        for k in(-1,1):o=sph((k*(bx*0.82),-0.05,zc+bz*0.62),(0.22,0.22,0.14),st2,0.02);o.rotation_euler=(0,k*math.radians(-35),0)
def shade_hex(h,k):
    h=h.lstrip('#');c=[int(h[i:i+2],16) for i in (0,2,4)];c=[max(0,min(255,int(v+(255-v)*k if k>0 else v*(1+k)))) for v in c];return '#%02x%02x%02x'%tuple(c)
def ears(t,mb,md,mw):
    if t=='dragon':
        horn=toon('#fff2c9')
        for k in(-1,1):cone((k*0.45,0.05,1.38),0.13,0.5,(0,k*math.radians(-22),0),horn);cone((k*0.88,0.0,0.85),0.12,0.32,(0,k*math.radians(-70),0),md,0.02)  # 耳鳍（不是翅膀）
        return
    _orig_ears(t,mb,md,mw)
def specifics(t,mb,md,mw,iris,lv):
    if t=='owl':   # 去掉侧边羽翼：改为斗篷 + 胸前羽纹
        decal(H,R,-24,-4,(0.36,0.36,0.1),mw,-0.08);decal(H,R,24,-4,(0.36,0.36,0.1),mw,-0.08)
        cone(tuple(on(H,R,0,-22,-0.02)[0]),0.12,0.28,(math.radians(100),0,0),toon('#ffb020'))
        tor(tuple(on(H,R,24,-4,0.0)[0]),0.17,0.025,(math.radians(80),0,math.radians(15)),toon('#ffd23f',spec=0.9),0.01)
        weapon(t,lv);return
    if t=='cat':   # 猫：去掉旧尾巴/叶子（尾巴改由 tail 生成），保留条纹 + 小羽毛帽
        for i,k in enumerate((-0.18,0,0.18)):decal(H,R,k*60,58-abs(k)*30,(0.05,0.16,0.03),md,0.0)
        cone((-0.35,0.1,1.35),0.06,0.4,(0,math.radians(-35),0),toon('#ff6f9c'),0.012,v=12)
        weapon(t,lv);return
    if t=='fox':   # 狐：尾巴由 tail 生成
        decal(H,R,-30,-34,(0.26,0.18,0.12),mw,-0.05);decal(H,R,30,-34,(0.26,0.18,0.12),mw,-0.05);decal(H,R,0,-12,(0.07,0.05,0.05),toon('#5a3442'),0.06)
        weapon(t,lv);return
    if t=='unicorn':weapon(t,lv);return
    if t=='deer':
        for az,el in((-55,15),(50,25),(65,-10),(-65,-15)):decal(H,R,az,el,(0.07,0.07,0.02),toon('#fff6ea'),0.0)
        decal(H,R,0,-22,(0.07,0.05,0.05),toon('#5a3442'),0.07);weapon(t,lv);return
    if t=='dragon':decal(H,R,0,-24,(0.3,0.2,0.12),mw,-0.05);weapon(t,lv);return
    _orig_specifics(t,mb,md,mw,iris,lv)
def level_deco(t,lv,br):
    gold=toon('#ffd23f',spec=0.8,rim=0.5);z=HATZ.get(t,1.42);acc=PAL[t][3] if t in PAL else '#ffd23f'
    if lv>=4:
        bc={'A':'#6cc4ff','B':'#ff7a8a'}.get(br,'#c39bff');cc={'A':'#3d7fd6','B':'#d63d6b'}.get(br,'#8a4ad6')
        cape(cc,1.0 if lv==4 else 1.08)
        if lv==4:top_ornament(t,(0,0.25,z+0.36),1.2)
        else:back_halo(0.55,1.0,bc,0,acc,0.075)
    if lv>=5:
        crown(z,{'A':'#5ab8ff','B':'#ff3b6b'}.get(br,'#ff3b6b'))
        tor((0,0.0,-1.32),0.85,0.04,(0,0,0),toon({'A':'#9fe0ff','B':'#ffb0c0'}.get(br,'#fff1a8'),flat=True,emit=1.6),0)
def cape(col,big=1.0):sph((0,0.42,-0.62),(0.82*big,0.18,0.68*big),toon(col,rim=0.45),0.03)
def tower(t,lv,br='',expr='idle',pal=None,hero=None):
    clear();CUR[0]=t;pal=pal or PAL[t];mb,md,mw,iris=chibi(t,pal,expr);ears(t,mb,md,mw);tufts(t,mb,mw)
    face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(t,'smile'))
    tail(t,mb,md,mw);outfit(t,lv=lv);specifics(t,mb,md,mw,iris,lv);level_deco(t,lv,br)
    if hero:hero_deco(hero)
FUSIONS['naturesong']=('sheep','deer','#7ed98a');FUSIONS['thornmail']=('hedgehog','bear','#c8895a')
ULTS['verdant']=('naturesong','thornmail','#5ecf9a')
def fusion_tower(k,expr,flv=3):
    """混血：A 的头/耳/体型 + B 的尾巴/服装款式（染融合色）+ B 的标志耳饰 + 双手各持一件主题道具"""
    a,b,col=FUSIONS[k];clear();CUR[0]=a;pa,pb=PAL[a],PAL[b];pal=(pa[0],pa[1],pb[2],pb[3])
    mb,md,mw,iris=chibi(a,pal,expr);ears(a,mb,md,mw);tufts(a,mb,mw)
    face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(a,'smile'))
    mbb=toon(pb[0]);mdb=toon(pb[1]);mwb=toon(pb[2])
    tail(b,mbb,mdb,mwb)
    # B 的头部特征缩小后作为第二对耳饰/角（真正的混血轮廓）
    i0=len(OBJS);_orig_ears(b,mbb,mdb,mwb) if b not in('dragon',) else ears(b,mbb,mdb,mwb)
    for o in OBJS[i0:]:o.location=Vector((o.location.x*1.05,o.location.y+0.1,o.location.z*0.9+0.06));o.scale=o.scale*0.8
    CUR[0]=a;outfit(b,col=col,acc=pb[3],lv=2 if flv==1 else 3)
    specifics(a,mb,md,mw,iris,4+flv//3)
    i1=len(OBJS);weapon(b,4);mirror_part(i1)
    z=HATZ.get(a,1.42);cape(col,1.05)
    back_halo(0.55,0.96+0.03*flv,col,0,pb[3],0.05+0.01*flv)
    sph((0,-0.66,-0.22),(0.13,0.055,0.14),toon(col,spec=1,emit=1.4),0.015)
    if flv>=3:crown(z,pb[3])
    tor((0,0.0,-1.32),0.9,0.045,(0,0,0),toon(col,flat=True,emit=1.8),0)
def ultimate_tower(k,expr):
    """究极：更大体型 + 全身金甲 + 巨型护肩 + 王冠尖塔 + 太阳光芒背环（射线轮廓独一无二）+ 双层地面法阵"""
    fa,fb,col=ULTS[k];a=FUSIONS[fa][0];b=FUSIONS[fb][0];clear();CUR[0]=a
    pal=(PAL[a][0],PAL[a][1],PAL[b][2],'#ffcf3f');mb,md,mw,iris=chibi(a,pal,expr);ears(a,mb,md,mw);tufts(a,mb,mw)
    face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(a,'smile'))
    tail(b,toon(PAL[b][0]),toon(PAL[b][1]),toon(PAL[b][2]))
    gold=toon('#ffd23f',spec=1,rim=0.6);bx,by,bz,zc,hs=BODY[a]
    sph((0,-0.04,zc),(bx+0.08,by+0.08,bz*0.86),toon('#ffe48a',spec=1,rim=0.6),0.03)
    for j in range(3):tor((0,-0.04,zc+0.3-j*0.24),bx+0.05-abs(j-1)*0.06,0.035,(0,0,0),toon(col,spec=0.9,emit=1.2),0)
    for kk in(-1,1):
        o=sph((kk*(bx*0.9),-0.05,zc+bz*0.68),(0.34,0.3,0.2),gold,0.025);o.rotation_euler=(0,kk*math.radians(-35),0)
        for j in range(3):cone((kk*(bx*0.9+0.08*j),-0.05,zc+bz*0.68+0.18),0.06,0.22,(0,kk*math.radians(-30),0),toon(col,emit=1.3),0.012,v=10)
    sph((0,-by-0.12,zc+0.12),(0.16,0.06,0.18),toon(col,spec=1,emit=1.7),0.015)
    specifics(a,mb,md,mw,iris,5);i1=len(OBJS);weapon(b,5);mirror_part(i1)
    sph((0,0.5,-0.55),(1.0,0.2,0.85),toon(col,rim=0.5),0.03)   # 长披风
    # 太阳光芒背环
    R2=1.15;tor((0,0.66,0.55),R2,0.08,(math.radians(90),0,0),toon('#ffe066',flat=True,emit=1.8),0.016)
    for i in range(12):
        a2=i/12*math.tau;p=Vector((math.cos(a2)*R2,0.68,0.55+math.sin(a2)*R2))
        rod(p,p+Vector((math.cos(a2),0,math.sin(a2)))*(0.32 if i%2 else 0.2),0.07,toon(col if i%2 else '#fff2a0',flat=True,emit=1.8),0.012,r2=0.0,v=8)
    z=HATZ.get(a,1.42);cyl((0,0.08,z),0.3,0.16,(math.radians(-10),0,0),gold,0.022)
    for i,x in enumerate((-0.22,-0.11,0,0.11,0.22)):
        h=0.42 if i==2 else 0.3 if i in(1,3) else 0.2;cone((x,-0.05,z+0.08+h/2),0.065,h,(math.radians(-10),0,0),gold,0.016,v=12);sph((x,-0.06,z+0.1+h),(0.05,0.05,0.05),toon(col,spec=1,emit=1.4),0.01)
    tor((0,0,-1.32),1.1,0.06,(0,0,0),toon(col,flat=True,emit=2),0);tor((0,0,-1.32),0.85,0.03,(0,0,0),toon('#ffffff',flat=True,emit=2),0)
# ---- 敌人 ----
EC['ghost']='#cbbdf5';EC['ghostking']='#b8a8f0'
def monster(k,expr='idle'):
    fe=dict(iris='#5a3442',expr=expr,el=-6,sp=27,size=1.15);ink=toon('#5a3442')
    if k=='fast':   # 高瘦豆豆跑者：长腿 + 头带 + 前倾
        clear();m=toon(EC[k],spec=0.5,rim=0.45);sph((0,0,-0.15),(0.62,0.58,0.95),m);face((0,0,0.05),0.64,**dict(fe,size=0.85))
        tor((0,0,0.5),0.5,0.07,(math.radians(-8),0,0),toon('#ff4d6d'));cone((0.15,0.55,0.5),0.1,0.5,(math.radians(-80),0,0),toon('#ff4d6d'))
        for kk in(-1,1):rod((kk*0.25,0,-0.9),(kk*0.32,-0.15,-1.3),0.09,m,0.02);sph((kk*0.32,-0.25,-1.32),(0.16,0.24,0.1),toon('#ff4d6d'),0.02)
        for kk in(-1,1):cone((kk*0.75,0.1,-0.1),0.06,0.4,(0,kk*math.radians(-70),0),toon('#ffffff',flat=True,emit=1.2),0)
        return
    if k=='flying':  # 气球水母：圆伞 + 垂下触手 + 小螺旋桨
        clear();m=toon(EC[k],rim=0.5,spec=0.5);sph((0,0,0.0),(0.85,0.8,0.62),m);face((0,0,-0.05),0.86,**dict(fe,size=1.0))
        for i in range(5):x=(i-2)*0.28;rod((x,0,-0.5),(x*1.15,0,-1.15),0.07,toon('#d8c8ff'),0.015,r2=0.03,v=12)
        cyl((0,0,0.6),0.03,0.2,(0,0,0),ink,0.0);[sph((kk*0.22,0,0.72),(0.22,0.06,0.04),toon('#ffd23f'),0.01) for kk in(-1,1)]
        return
    if k=='tank':   # 四足穿山甲：甲片背 + 四条腿
        clear();m=toon(EC[k],rim=0.4);sh=toon('#7a8a9a',spec=0.6);sph((0,0.15,-0.45),(1.0,0.75,0.6),m)
        for i in range(4):sph((0,0.25-i*0.02,-0.15-i*0.0),(0.98-i*0.1,0.7,0.36),sh,0.025).rotation_euler=(math.radians(-15+i*12),0,0)
        sph((0,-0.72,-0.4),(0.58,0.5,0.5),m);face((0,-0.72,-0.4),0.56,iris='#5a3442',expr=expr,el=-4,sp=28,size=0.72,blush=True)
        for x in(-0.6,0.6):
            for y in(-0.25,0.45):rod((x,y,-0.7),(x*1.05,y,-1.2),0.13,m,0.02)
        return
    if k in('ghost','ghostking'):
        clear();col=EC[k];m=toon(col,rim=0.4,shadow='#8a78d0');dk=toon('#6a58b0')
        sph((0,0,-0.2),(0.75,0.7,0.85),m,0.05)
        for i in range(5):sph(((i-2)*0.3,0,-0.98),(0.17,0.17,0.17),dk,0.04)
        face((0,0,-0.1),0.72,iris='#3a2a8a',expr=expr,el=-4,sp=26,size=0.85)
        for kk in(-1,1):sph((kk*0.74,-0.1,-0.35),(0.15,0.12,0.28),m,0.04).rotation_euler=(0,kk*math.radians(-30),0)
        if k=='ghostking':
            cone((0,0.05,1.0),0.6,1.3,(math.radians(-8),0,0),toon('#4a3a8a'),0.04);tor((0,0.05,0.45),0.6,0.07,(0,0,0),toon('#ffd23f'))
            cone((0,0.1,-1.05),1.05,0.6,(0,0,0),toon('#5a4aa0'),r2=0.62,ol=0.04)
            cyl((0.95,-0.3,-0.2),0.05,1.8,(0,math.radians(10),0),toon('#a8673e'));sph((1.05,-0.3,0.75),(0.2,0.2,0.2),toon('#8fe8ff',emit=1.6),0.02)
        return
    if k=='frost':   # 冰霜巨人：高大人形 + 冰甲肩 + 长臂大拳
        clear();m=toon(EC[k],spec=0.6,rim=0.5);sph((0,0,-0.3),(0.9,0.75,1.05),m);face((0,0,0.15),0.8,**dict(fe,size=0.95))
        ice=toon('#ffffff',spec=0.9,rim=0.6)
        for i in range(7):a=math.radians(15+i*25);cone((math.cos(a)*0.6,0.1,0.75+math.sin(a)*0.3),0.1,0.45,(0,-(a-math.pi/2)*0.9,0),ice,0.015)
        for kk in(-1,1):
            sph((kk*0.95,0,0.15),(0.35,0.3,0.28),toon('#8fd3ff',spec=1,rim=0.6),0.02);rod((kk*0.95,0,0),(kk*1.2,-0.1,-0.85),0.18,m,0.025)
            sph((kk*1.22,-0.12,-1.0),(0.3,0.28,0.28),m,0.025);rod((kk*0.35,0,-1.2),(kk*0.4,0,-1.45),0.2,m,0.02)
        return
    if k=='magma':   # 熔岩岩石魔像：多面岩块拼接 + 发光裂纹
        clear();rk=toon('#8a3a2a',rim=0.35);lava=toon('#ffb02a',flat=True,emit=1.8)
        sph((0,0,-0.3),(0.95,0.8,0.9),rk,0.04,seg=8);face((0,-0.05,-0.15),0.86,**dict(fe,iris='#ff4d1a'))
        for i in range(6):a=i/6*math.tau;decal((0,0,-0.3),0.88,i*55-140,-45+i*6,(0.2,0.07,0.03),lava,0)
        for kk in(-1,1):sph((kk*1.05,0,-0.2),(0.38,0.35,0.42),rk,0.035,seg=8);sph((kk*1.12,-0.05,-0.8),(0.32,0.3,0.3),rk,0.03,seg=8)
        for i in range(3):cone(((i-1)*0.32,0.1,0.65),0.16,0.4,(0,0,0),lava,0.02,v=6)
        return
    if k=='king':
        _orig_monster(k,expr);gold=toon('#ffd23f',spec=0.8)
        cyl((1.0,-0.3,-0.4),0.05,1.6,(0,math.radians(8),0),gold);sph((1.06,-0.3,0.45),(0.18,0.18,0.18),toon('#ff3b6b',spec=1,emit=1.3),0.02)
        cone((0,0.4,-0.6),1.25,1.2,(math.radians(-12),0,0),toon('#c8324a'),r2=0.3,ol=0.03);return
    _orig_monster(k,expr)
JOBS[:]=[]
for t in TYPES:
    for lv in range(1,6):
        for br in (['A','B'] if lv>=4 else ['']):JOBS.append(('t_%s_%d%s'%(t,lv,br),'t',(t,lv,br,None,None)))
for k in FUSIONS:
    for fl in (1,2,3):JOBS.append(('f_%s_%d'%(k,fl),'f',(k,fl)))
for k in ULTS:JOBS.append(('u_'+k,'u',k))
for sk,(t,pal) in SKINS.items():
    for lv in range(1,4):JOBS.append(('s_%s_%d'%(sk,lv),'t',(t,lv,'',pal,None)))
for h,t in HERO_DECO.items():JOBS.append(('h_'+h,'t',(t,3,'',None,h)))
for k in EC:JOBS.append(('e_'+k,'e',k))
for k in['arrow','snow','ball','fireball','orb','coin','star','heart','castle','poison','missile','spike','chickling','feather','heal']:JOBS.append(('p_'+k,'p',k))
_LVS=LVS
def _run():
    global SCALE
    setup()
    for name,kind,a in JOBS:
        if FILT and not any(f in name for f in FILT.split(',')):continue
        if not FORCE and os.path.exists(os.path.join(RAW,name+'_0.png')):continue
        if kind=='u':
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr);ultimate_tower(a,ex);SCALE=1.12;render(name+'_'+fr,sq,tl,-0.05);SCALE=1.0
            continue
        JOBS_ONE=[(name,kind,a)];_bak=JOBS[:];JOBS[:]=JOBS_ONE
        globals()['FILT']=''
        try:_orig_run_inner()
        finally:JOBS[:]=_bak;globals()['FILT']=FILT0
    print('V30 DONE')
FILT0=FILT
def _orig_run_inner():
    global SCALE
    for name,kind,a in JOBS:
        if kind=='t':
            t,lv,br,pal,hero=a
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr)
                if (pal or hero) and fr=='h':continue
                if hero and fr in('w','r'):continue
                tower(t,lv,br,ex,pal,hero);SCALE=LVS(lv) if not hero else 1.0;render(name+'_'+fr,sq,tl,0);SCALE=1.0
        elif kind=='f':
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr);fusion_tower(a[0],ex,a[1]);SCALE=0.9+0.05*a[1];render(name+'_'+fr,sq,tl,0);SCALE=1.0
        elif kind=='e':
            for fr,ex,sq,tl,dz in(('0','idle',1.0,0,0),('1','idle',0.88,0,-0.08),('h','hurt',0.95,8,0),('d','dead',0.55,0,-0.3)):
                monster(a,ex);render(name+'_'+fr,sq,tl,dz)
        else:
            prop(a);prop2(a);render(name+'_0')
        if MZ:
            fn=os.path.join(RAW,'_mz.json');old=json.load(open(fn)) if os.path.exists(fn) else {};old.update(MZ);json.dump(old,open(fn,'w'));MZ.clear()
_clear0=clear
def clear():
    _clear0()
    for coll in (bpy.data.meshes,bpy.data.images):
        for d in list(coll):
            if d.users==0:coll.remove(d)
if 'go' in argv:_run()
