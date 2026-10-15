# 软萌大作战 V1.0  © 2026 <著作权人>
# 软萌大作战 角色 v3：卡通渲染（Cycles 自发光 cel-shading + 边缘光 + 反向外壳描边）
# 用法：blender -b -P tools/chars.py -- <filter> [force]
import bpy, math, sys, os, json
from mathutils import Vector
HERE='/workspace/td-proto/tools';RAW=os.path.join(HERE,'..',os.environ.get('ART_OUT','art_v8'));RES=int(os.environ.get('ART_RES','512'));os.makedirs(RAW,exist_ok=True)
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
FILT=argv[0] if argv else '';FORCE='force' in argv
LIGHT=Vector((-0.45,-0.75,0.85)).normalized()
def hx(h):h=h.lstrip('#');c=[int(h[i:i+2],16)/255 for i in (0,2,4)];return [(x/12.92 if x<0.04045 else ((x+0.055)/1.055)**2.4) for x in c]
MATS={}
def toon(col,shadow=None,spec=0.0,rim=0.5,flat=False,emit=1.0):
    key=(col,shadow,spec,rim,flat,emit)
    if key in MATS:return MATS[key]
    m=bpy.data.materials.new('m%d'%len(MATS));m.use_nodes=True;nt=m.node_tree;N=nt.nodes;L=nt.links
    for n in list(N):N.remove(n)
    out=N.new('ShaderNodeOutputMaterial');em=N.new('ShaderNodeEmission');em.inputs[1].default_value=emit;L.new(em.outputs[0],out.inputs[0])
    base=hx(col);sh=hx(shadow) if shadow else [base[0]*0.78+0.004,base[1]*0.66+0.002,base[2]*0.84+0.03]
    if flat:
        em.inputs[0].default_value=base+[1];m['col']=col;MATS[key]=m;return m
    geo=N.new('ShaderNodeNewGeometry');dot=N.new('ShaderNodeVectorMath');dot.operation='DOT_PRODUCT';dot.inputs[1].default_value=LIGHT
    L.new(geo.outputs['Normal'],dot.inputs[0])
    ramp=N.new('ShaderNodeValToRGB');cr=ramp.color_ramp;cr.interpolation='EASE'
    mid=[(a+b)/2 for a,b in zip(sh,base)]
    cr.elements[0].position=0.44;cr.elements[0].color=sh+[1];cr.elements[1].position=0.54;cr.elements[1].color=base+[1];e=cr.elements.new(0.49);e.color=mid+[1]
    mr=N.new('ShaderNodeMapRange');mr.inputs[1].default_value=-0.4;mr.inputs[2].default_value=0.3;L.new(dot.outputs['Value'],mr.inputs[0]);L.new(mr.outputs[0],ramp.inputs[0])
    col_out=ramp.outputs[0]
    # 边缘光
    lw=N.new('ShaderNodeLayerWeight');lw.inputs[0].default_value=0.25
    rr=N.new('ShaderNodeMapRange');rr.inputs[1].default_value=0.6;rr.inputs[2].default_value=0.68;L.new(lw.outputs['Facing'],rr.inputs[0])
    mix=N.new('ShaderNodeMix');mix.data_type='RGBA';mix.blend_type='SCREEN';L.new(rr.outputs[0],mix.inputs[0]);mix.inputs[0].default_value=0
    L.new(col_out,mix.inputs[6]);mix.inputs[7].default_value=(1,0.95,0.98,1)
    mul=N.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=rim;L.new(rr.outputs[0],mul.inputs[0]);L.new(mul.outputs[0],mix.inputs[0])
    last=mix.outputs[2]
    if spec>0:
        # 高光：法线与半程向量点积
        cam=Vector((0,-0.85,0.5)).normalized();H=(LIGHT+cam).normalized()
        d2=N.new('ShaderNodeVectorMath');d2.operation='DOT_PRODUCT';d2.inputs[1].default_value=H;L.new(geo.outputs['Normal'],d2.inputs[0])
        sr=N.new('ShaderNodeMapRange');sr.inputs[1].default_value=0.955;sr.inputs[2].default_value=0.97;L.new(d2.outputs['Value'],sr.inputs[0])
        m2=N.new('ShaderNodeMix');m2.data_type='RGBA';m2.blend_type='MIX';sm=N.new('ShaderNodeMath');sm.operation='MULTIPLY';sm.inputs[1].default_value=spec
        L.new(sr.outputs[0],sm.inputs[0]);L.new(sm.outputs[0],m2.inputs[0]);L.new(last,m2.inputs[6]);m2.inputs[7].default_value=(1,1,1,1);last=m2.outputs[2]
    L.new(last,em.inputs[0]);m['col']=col;MATS[key]=m;return m
def outline_mat(col=None):
    k='OUT'+str(col)
    if k in MATS:return MATS[k]
    m=bpy.data.materials.new('outline');m.use_nodes=True;nt=m.node_tree;N=nt.nodes;L=nt.links
    for n in list(N):N.remove(n)
    # 彩色描边：取本体颜色压暗并偏紫，比统一深色更柔和
    if col:c=hx(col);oc=[c[0]*0.28+0.035,c[1]*0.2+0.012,c[2]*0.26+0.03]
    else:oc=hx('#5a3442')
    out=N.new('ShaderNodeOutputMaterial');em=N.new('ShaderNodeEmission');em.inputs[0].default_value=oc+[1];tr=N.new('ShaderNodeBsdfTransparent')
    geo=N.new('ShaderNodeNewGeometry');mx=N.new('ShaderNodeMixShader');L.new(geo.outputs['Backfacing'],mx.inputs[0]);L.new(em.outputs[0],mx.inputs[1]);L.new(tr.outputs[0],mx.inputs[2]);L.new(mx.outputs[0],out.inputs[0])
    MATS[k]=m;return m
OBJS=[];SCALE=1.0
def finish(o,m,outline=0.035,smooth=True,sub=0):
    if smooth:bpy.ops.object.shade_smooth()
    o.data.materials.append(m)
    if sub:
        md=o.modifiers.new('s','SUBSURF');md.levels=sub;md.render_levels=sub
    if outline:
        o.data.materials.append(outline_mat(m.get('col') if hasattr(m,'get') else None));md=o.modifiers.new('o','SOLIDIFY');md.thickness=max(outline*1.25,0.03);md.offset=1;md.use_flip_normals=True;md.material_offset=1;md.use_rim=False
    OBJS.append(o);return o
def sph(loc,sc,m,ol=0.035,seg=40):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=seg//2,location=loc);o=bpy.context.object;o.scale=sc;return finish(o,m,ol)
def cone(loc,r1,d,rot,m,r2=0.0,ol=0.03,v=32):
    bpy.ops.mesh.primitive_cone_add(vertices=v,radius1=r1,radius2=r2,depth=d,location=loc,rotation=rot);o=bpy.context.object;return finish(o,m,ol)
def cyl(loc,r,d,rot,m,ol=0.03,v=40):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v,radius=r,depth=d,location=loc,rotation=rot);o=bpy.context.object;return finish(o,m,ol)
def tor(loc,R,r,rot,m,ol=0.02,arc=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R,minor_radius=r,location=loc,rotation=rot,major_segments=48,minor_segments=16);o=bpy.context.object;return finish(o,m,ol)
def on(center,R,az,el,off=0.0):
    a=math.radians(az);e=math.radians(el);d=Vector((math.sin(a)*math.cos(e),-math.cos(a)*math.cos(e),math.sin(e)));return Vector(center)+d*(R+off),d
def decal(center,R,az,el,sc,m,off=0.0,ol=0.0,roll=0):
    p,d=on(center,R,az,el,off);bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=p);o=bpy.context.object;o.scale=sc
    q=d.to_track_quat('Z','Y');o.rotation_mode='QUATERNION';o.rotation_quaternion=q
    if roll:
        from mathutils import Quaternion
        o.rotation_quaternion=q@Quaternion((0,0,1),math.radians(roll))
    return finish(o,m,ol)
# ---------------- 脸 ----------------
EYE=lambda:toon('#3a2230',flat=True);WH=lambda:toon('#ffffff',flat=True,emit=1.2)
FACEDIR=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','art_faces')
def face_tex(iris,expr,mouth,blush,sp,size):
    import subprocess,hashlib
    os.makedirs(FACEDIR,exist_ok=True);key='%s_%s_%s_%d_%g_%g'%(iris.strip('#'),expr,mouth,blush,sp,size);path=os.path.join(FACEDIR,key+'.png')
    if not os.path.exists(path):subprocess.run(['python3',os.path.join(os.path.dirname(os.path.abspath(__file__)),'facetex.py'),path,iris,expr,mouth,'1' if blush else '0',str(sp),str(size)],check=True)
    return path
def tex_mat(path):
    if path in MATS:return MATS[path]
    m=bpy.data.materials.new('face');m.use_nodes=True;nt=m.node_tree;N=nt.nodes;L=nt.links
    for n in list(N):N.remove(n)
    out=N.new('ShaderNodeOutputMaterial');tx=N.new('ShaderNodeTexImage');tx.image=bpy.data.images.load(path);tx.interpolation='Cubic';tx.extension='CLIP'
    em=N.new('ShaderNodeEmission');tr=N.new('ShaderNodeBsdfTransparent');mx=N.new('ShaderNodeMixShader')
    L.new(tx.outputs['Color'],em.inputs[0]);L.new(tx.outputs['Alpha'],mx.inputs[0]);L.new(tr.outputs[0],mx.inputs[1]);L.new(em.outputs[0],mx.inputs[2]);L.new(mx.outputs[0],out.inputs[0])
    m.blend_method='BLEND' if hasattr(m,'blend_method') else None;MATS[path]=m;return m
def face(H,R,iris='#7a4a9a',expr='idle',sp=27,el=-10,size=1.0,blush=True,mouth='smile'):
    """高清贴图脸：在头部球面上生成贴合网格（方位角 ±60°，仰角 el-35°~el+25°），贴上 PIL 绘制的动漫眼睛/腮红/嘴"""
    import bmesh
    path=face_tex(iris,expr,mouth,blush,sp,size);me=bpy.data.meshes.new('face');bm=bmesh.new();NX,NY=48,24;vs=[]
    uvl=bm.loops.layers.uv.new()
    for j in range(NY+1):
        row=[]
        for i in range(NX+1):
            az=-60+120*i/NX;e=el-35+60*j/NY;p,_=on(H,R,az,e,0.05);row.append(bm.verts.new(p))
        vs.append(row)
    for j in range(NY):
        for i in range(NX):
            f=bm.faces.new((vs[j][i],vs[j][i+1],vs[j+1][i+1],vs[j+1][i]))
            for lp,(u,v) in zip(f.loops,((i/NX,j/NY),((i+1)/NX,j/NY),((i+1)/NX,(j+1)/NY),(i/NX,(j+1)/NY))):lp[uvl].uv=(u,v)
    bm.to_mesh(me);bm.free();o=bpy.data.objects.new('face',me);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True)
    for p in me.polygons:p.use_smooth=True
    me.materials.append(tex_mat(path));OBJS.append(o);return o
# ---------------- 场景 ----------------
def setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=48;s.cycles.use_denoising=False;s.cycles.max_bounces=2;s.cycles.transparent_max_bounces=16
    s.render.resolution_x=s.render.resolution_y=RES;s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
    s.view_settings.view_transform='Standard';s.render.filter_size=1.0
    w=bpy.data.worlds.new('W');s.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[1].default_value=0
    bpy.ops.object.camera_add(location=(0,-12,4.6));c=bpy.context.object;c.data.type='ORTHO';c.data.ortho_scale=4.3;c.rotation_euler=(math.radians(73),0,0);s.camera=c
def clear():
    for o in list(bpy.data.objects):
        if o.type!='CAMERA':bpy.data.objects.remove(o,do_unlink=True)
    OBJS.clear()
    try:TIPS.clear();WSET.clear()
    except NameError:pass
MZ={}
def render(name,sq=1.0,tilt=0,dz=0,rotz=0):
    bpy.ops.object.empty_add(location=(0,0,0));e=bpy.context.object
    for o in OBJS:
        if o.parent is None:o.parent=e;o.matrix_parent_inverse=e.matrix_world.inverted()
    e.scale=(SCALE/sq**0.5,SCALE/sq**0.5,SCALE*sq);e.rotation_euler=(math.radians(tilt),0,math.radians(rotz));e.location.z=0.32+dz+1.15*(SCALE-1)
    bpy.context.view_layer.update()
    if TIPS:
        from bpy_extras.object_utils import world_to_camera_view
        sc=bpy.context.scene;MZ[name]=[[round(v.x,4),round(1-v.y,4)] for v in (world_to_camera_view(sc,sc.camera,tp.matrix_world.translation) for tp in TIPS)]
    if os.environ.get('MZ_ONLY'):return
    bpy.context.scene.render.filepath=os.path.join(RAW,name+'.png');bpy.ops.render.render(write_still=True)
# ---------------- 萌宠塔 ----------------
H=(0,0,0.5);R=0.92
PAL={'cat':('#ffbf7a','#ff9a4d','#fff1de','#5fbf6a'),'penguin':('#5a7fb8','#3d5c94','#ffffff','#5ab8ff'),'bear':('#c99a6e','#a87a50','#f6dcbc','#8a5a3b'),
 'bunny':('#f6d2ff','#e0a8f0','#ffffff','#b46cff'),'fox':('#ff9a62','#e8713f','#fff5ea','#ff6a3d'),'pig':('#ffc0d2','#f598b3','#ffe0ea','#ff6f9c'),'dragon':('#9be7a8','#62c97a','#fff3b8','#3ab06a'),
 'frog':('#9be37a','#5fbf55','#f2ffd6','#c06cff'),'owl':('#b8916e','#8a6448','#f6e6cc','#ffb020'),'hedgehog':('#f2d0a8','#8a5a3e','#fff3e2','#5a8aff'),
 'sheep':('#fff8f2','#e8dce8','#ffe6d6','#4fb8ff'),'deer':('#e6a874','#b8784a','#fff2e0','#3ab06a'),'hamster':('#ffd08f','#eaa25a','#fff7e8','#ff5a7a'),
 'koala':('#aab3c4','#7e889c','#f0f2f8','#ff6f9c'),'chick':('#ffe066','#f2bf2a','#fff8d0','#ff8a3d'),'unicorn':('#fffaff','#eadcff','#ffffff','#b46cff')}
SKINS={'cat_black':('cat',('#4e4660','#37304a','#d8d0f0','#ffd23f')),'bunny_choco':('bunny',('#b07a5a','#8a5a3e','#ffe6d0','#ff8fb1')),'bear_panda':('bear',('#ffffff','#e6e6ee','#ffffff','#3a2230'))}
MOUTH={'cat':'cat','fox':'cat','hamster':'cat','bear':'none','pig':'none','penguin':'none','owl':'none','chick':'none','koala':'none'}
def metal(col='#e8eef8'):return toon(col,spec=0.9,rim=0.6)
def chibi(t,pal,expr):
    body,dark,belly,iris=pal;mb=toon(body);md=toon(dark);mw=toon(belly)
    sph(H,(R*1.05,R*0.98,R*0.93),mb)                       # 大头
    sph((0,0.02,-0.66),(0.64,0.56,0.6),mb)                 # 圆润身体（头身比约 6:4）
    sph((0,-0.3,-0.7),(0.42,0.28,0.4),mw,0.02)             # 肚皮
    for k in(-1,1):
        sph((k*0.32,-0.14,-1.2),(0.24,0.29,0.15),md)       # 脚
        decal((k*0.32,-0.14,-1.2),0.21,0,-20,(0.08,0.055,0.02),toon('#ffb3c6'),0.0)   # 肉垫
        hx_=HAND if k>0 else Vector((-HAND.x,HAND.y,HAND.z+0.06))
        rod((k*0.46,-0.08,-0.42),hx_,0.13,mb,0.03,r2=0.15)  # 短手臂
        sph(tuple(hx_),(0.17,0.17,0.17),mb)                # 握道具的小手
    return mb,md,mw,iris
FURRY=('cat','fox','bear','bunny','hamster','koala','deer','dragon')
def tufts(t,mb,mw):
    """毛发簇：头顶呆毛 + 脸颊绒毛"""
    if t in FURRY:
        for i,(az,el,ln,tl) in enumerate([(-12,78,0.26,-25),(4,82,0.32,10),(18,76,0.22,30)]):
            p,d=on(H,R*0.98,az,el,-0.02);cone(tuple(p),0.09,ln,(math.radians(tl*0.3),math.radians(tl),0),mb,ol=0.018,v=16)
        for k in(-1,1):
            for j in range(2):
                p,d=on(H,R*0.97,k*(78+j*8),-22-j*12,-0.02);o=cone(tuple(p),0.1,0.26,(0,k*math.radians(-80-j*12),0),mw if t in('cat','fox','koala') else mb,ol=0.016,v=16)
def ears(t,mb,md,mw):
    pink=toon('#ffb3c6')
    if t in('cat','fox'):
        for k in(-1,1):
            o=cone((k*0.56,0.05,1.25),0.33,0.62,(math.radians(-6),k*math.radians(-24),0),mb,ol=0.03)
            cone((k*0.53,-0.07,1.19),0.18,0.38,(math.radians(-6),k*math.radians(-24),0),pink if t=='cat' else mw,ol=0)
            cone((k*0.52,-0.12,1.16),0.06,0.3,(math.radians(-6),k*math.radians(-20),0),mw,ol=0,v=12)   # 耳内绒毛
            if t=='fox':cone((k*0.69,0.05,1.5),0.11,0.18,(math.radians(-6),k*math.radians(-24),0),toon('#5a3442'),ol=0)
    if t in('bear','hamster','koala'):
        big={'bear':1.0,'hamster':0.8,'koala':1.45}[t]
        for k in(-1,1):
            sph((k*(0.68+0.05*(big-1)),0.05,1.18),(0.28*big,0.2,0.28*big),mb);sph((k*(0.66+0.05*(big-1)),-0.08,1.16),(0.15*big,0.06,0.15*big),toon('#f6dcbc') if mb!=toon('#ffffff') else toon('#3a2230'),0)
            if t=='koala':
                for j in range(4):a=math.radians(200+j*35)*k;cone((k*0.98+math.cos(a)*0.08,-0.02,1.18+math.sin(a)*0.3),0.09,0.2,(0,k*math.radians(-90+j*30),0),mw,ol=0.012,v=12)
    if t=='bunny':
        for k in(-1,1):
            sph((k*0.36,0.05,1.75),(0.2,0.14,0.62),mb).rotation_euler=(0,k*math.radians(-12),0)
            sph((k*0.36,-0.06,1.75),(0.1,0.05,0.45),pink,0).rotation_euler=(0,k*math.radians(-12),0)
    if t=='pig':
        for k in(-1,1):cone((k*0.55,-0.05,1.25),0.24,0.32,(math.radians(-35),k*math.radians(-30),0),mb)
    if t=='dragon':
        horn=toon('#fff2c9')
        for k in(-1,1):cone((k*0.45,0.05,1.38),0.13,0.5,(0,k*math.radians(-22),0),horn)
        for k in(-1,1):sph((k*0.72,0.42,-0.35),(0.08,0.45,0.32),md).rotation_euler=(0,0,k*math.radians(30))
    if t=='frog':
        for k in(-1,1):sph((k*0.42,-0.1,1.22),(0.3,0.28,0.26),mb);sph((k*0.42,-0.3,1.24),(0.14,0.06,0.14),toon('#ffffff'),0.012)
    if t=='owl':
        for k in(-1,1):cone((k*0.55,0.0,1.28),0.2,0.55,(0,k*math.radians(-28),0),md,0.025)
    if t=='sheep':
        for k in(-1,1):sph((k*0.95,-0.05,0.75),(0.28,0.12,0.13),toon('#4a3a48'),0.02).rotation_euler=(0,k*math.radians(25),0)
    if t=='deer':
        ant=toon('#e8c890',rim=0.4)
        for k in(-1,1):
            cyl((k*0.42,0.05,1.45),0.055,0.55,(0,k*math.radians(-20),0),ant,0.018)
            cyl((k*0.62,0.05,1.62),0.045,0.35,(0,k*math.radians(-60),0),ant,0.016);cyl((k*0.5,0.05,1.78),0.04,0.3,(0,k*math.radians(10),0),ant,0.016)
            sph((k*0.88,0.0,1.0),(0.24,0.08,0.13),mb).rotation_euler=(0,k*math.radians(30),0)
    if t=='chick':
        for i in range(3):cone(((i-1)*0.1,0.0,1.36+(i%2)*0.05),0.06,0.32,(0,math.radians((i-1)*30),0),toon('#ffd23f'),ol=0.016,v=12)
    if t=='unicorn':
        g=toon('#ffe48a',spec=0.9,rim=0.5);cone((0,-0.35,1.38),0.14,0.7,(math.radians(-20),0,0),g,0.025)
        for j in range(4):tor((0,-0.35+0.04*j,1.18+0.15*j),0.12-0.025*j,0.018,(math.radians(-20),0,0),toon('#ffffff'),0)
        for k in(-1,1):cone((k*0.55,0.05,1.25),0.2,0.4,(0,k*math.radians(-24),0),mb)
        for i,c in enumerate(['#ff8fb1','#ffd166','#8fe3a0','#8fd3ff','#c39bff']):sph((0.15-i*0.05,0.5+i*0.06,1.05-i*0.32),(0.3,0.26,0.24),toon(c),0.02)
WPN=[]
def wpn_begin():WPN.append(len(OBJS))
def wpn_end(pivot,lv):
    """武器随等级放大，Lv3 镶宝石，Lv5 金边，Lv6+ 发光"""
    i0=WPN.pop();s=0.8+0.07*lv
    for o in OBJS[i0:]:
        o.location=Vector(pivot)+(o.location-Vector(pivot))*s;o.scale=o.scale*s
    if lv>=3:sph((pivot[0],pivot[1]-0.18,pivot[2]),(0.07,0.04,0.07),toon('#ff3b6b',spec=1,emit=1.2),0.012)
    if lv>=5:tor(pivot,0.16,0.025,(math.radians(90),0,0),toon('#ffd23f',spec=0.9),0)
    if lv>=6:sph(pivot,(0.2,0.2,0.2),toon('#fff6c0',flat=True,emit=0.0),0)
# ---------------- 主题武器（v0.6：大号可读道具 + 攻击三帧 + 枪口点） ----------------
from mathutils import Matrix,Quaternion
POSE='0';TIPS=[];WSET=set()
HAND=Vector((0.74,-0.5,-0.5))
POSE_ANG={'0':0,'w':28,'a':-9,'r':-3,'h':5}
def _setM(o,M):
    loc,rot,sc=M.decompose();o.rotation_mode='QUATERNION';o.location=loc;o.rotation_quaternion=rot;o.scale=sc
def _M(o):
    q=o.rotation_quaternion if o.rotation_mode=='QUATERNION' else o.rotation_euler.to_quaternion()
    return Matrix.LocRotScale(o.location,q,o.scale)
def xform(objs,M):
    for o in objs:_setM(o,M@_M(o))
def rod(a,b,r,m,ol=0.025,r2=None,v=24):
    a=Vector(a);b=Vector(b);d=b-a;L=d.length;c=(a+b)/2
    if r2 is None:bpy.ops.mesh.primitive_cylinder_add(vertices=v,radius=r,depth=L,location=c)
    else:bpy.ops.mesh.primitive_cone_add(vertices=v,radius1=r,radius2=r2,depth=L,location=c)
    o=bpy.context.object;o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector((0,0,1)).rotation_difference(d.normalized());return finish(o,m,ol)
def ball(c,r,m,ol=0.03,sc=(1,1,1)):return sph(tuple(c),(r*sc[0],r*sc[1],r*sc[2]),m,ol)
def tip_at(p):
    bpy.ops.object.empty_add(location=tuple(p));e=bpy.context.object;e.empty_display_size=0.05;OBJS.append(e);TIPS.append(e);return e
def star5(c,r,m,ol=0.02,face_y=True):
    ball(c,r*0.55,m,ol,(1,0.5,1))
    for i in range(5):
        a=math.pi/2+i/5*math.tau;p=Vector(c)+Vector((math.cos(a)*r*0.75,0,math.sin(a)*r*0.75));rod(Vector(c)+Vector((math.cos(a)*r*0.3,0,math.sin(a)*r*0.3)),p+Vector((math.cos(a)*r*0.25,0,math.sin(a)*r*0.25)),r*0.32,m,ol,r2=0.0,v=12)
def crystal(c,r,h,m,ol=0.02):
    c=Vector(c);rod(c,c+Vector((0,0,h)),r,m,ol,r2=0.0,v=6);rod(c,c-Vector((0,0,h*0.45)),r,m,ol,r2=0.0,v=6)
def staff_shaft(top,col='#a8673e',r=0.08,bot=None):
    bot=bot or HAND-Vector((0.1,0,0.42));rod(bot,top,r,toon(col),0.022);
    for f in(0.42,0.5):p=bot+(Vector(top)-bot)*f;ball(p,r*1.35,toon('#ff8fb1'),0.012,(1,1,0.6))   # 握把缠带
def weapon(t,lv):
    i0=len(OBJS);nt0=len(TIPS);g=lambda c,**k:toon(c,**k);gold=toon('#ffd23f',spec=0.9,rim=0.5)
    up=Vector((0.32,0,1)).normalized();top=HAND+up*1.45
    tipv=None;piv=HAND;pk=1.0
    if t=='cat':     # 大木弓（箭矢上弦），整体向右上倾斜
        C=HAND+Vector((0.22,-0.2,0.15));wood=g('#b0703e',rim=0.4);pts=[]
        for i in range(9):
            a=math.radians(-75+150*i/8);pts.append(C+Vector((0.36*math.cos(a)+0.02,0,0.85*math.sin(a))))
        for i in range(8):rod(pts[i],pts[i+1],0.095 if 2<i<5 else 0.07,wood,0.025)
        for p in(pts[0],pts[-1]):ball(p,0.1,gold,0.015)
        pull=0.3 if POSE=='w' else 0.0;nock=C+Vector((0.06-pull,0,0))
        st=g('#fff6fb',flat=True);rod(pts[0],nock,0.014,st,0);rod(nock,pts[-1],0.014,st,0)
        if POSE!='a':
            ar0=nock;ar1=C+Vector((0.62,0,0));rod(ar0,ar1,0.035,g('#a8673e'),0.012);rod(ar1,ar1+Vector((0.22,0,0)),0.095,metal('#e8eef8'),0.018,r2=0.0,v=12)
            for k in(-1,1):rod(ar0+Vector((0.04,0,k*0.0)),ar0+Vector((0.2,0,k*0.09)),0.06,g('#ff8fb1'),0.012,r2=0.0,v=8)
        tipv=C+Vector((0.86,0,0));base=-32;piv=C;pk=0.35
    elif t=='penguin':   # 冰晶法杖
        staff_shaft(top,'#bfe9ff');ice=toon('#bff2ff',spec=1,rim=0.7,emit=1.25)
        crystal(top+up*0.05,0.17,0.55,ice);[crystal(top+Vector((k*0.17,0,-0.05)),0.08,0.25,ice) for k in(-1,1)]
        tipv=top+up*0.55;base=0
    elif t=='frog':      # 大号毒药瓶（高举）
        F=HAND+Vector((0.42,-0.1,0.45));gl=toon('#d8f5ff',spec=0.9,rim=0.7);ball(F,0.36,toon('#7fe05a',spec=0.9,rim=0.8,emit=1.3),0.03);ball(F+Vector((0,-0.32,0.12)),0.1,toon('#ffffff',flat=True,emit=1.3),0,(1,0.3,0.6));tor(tuple(F+Vector((0,0,0.12))),0.33,0.03,(0,0,0),toon('#b46cff',emit=1.2),0)
        rod(F+Vector((0,0,0.3)),F+Vector((0,0,0.58)),0.12,gl,0.02);rod(F+Vector((0,0,0.55)),F+Vector((0,0,0.68)),0.135,toon('#a8673e'),0.02)
        for i,(dx,dz) in enumerate(((-0.1,0.82),(0.08,0.98),(-0.02,1.12))):ball(F+Vector((dx,-0.02,dz)),0.07-i*0.012,toon('#c8ff9a',emit=1.5),0.01)
        rod(HAND,F+Vector((0,0,-0.3)),0.09,toon(PAL['frog'][0]),0.02)   # 举瓶的手臂
        tipv=F+Vector((0,0,0.72));base=0
    elif t=='bear':      # 肩扛小炮
        a0=HAND+Vector((-0.35,0.05,0.25));a1=HAND+Vector((0.75,-0.05,0.9));m=metal('#6a6f8a');rod(a0,a1,0.21,m,0.03)
        rod(a1-(a1-a0).normalized()*0.05,a1+(a1-a0).normalized()*0.1,0.27,gold,0.025);rod(a0,a0-(a1-a0).normalized()*0.12,0.24,metal('#3a3f55'),0.025)
        ball((a0+a1)/2+Vector((0,-0.2,-0.05)),0.1,toon('#ff4d6d',spec=0.6),0.015)
        tipv=a1+(a1-a0).normalized()*0.12;base=0
    elif t=='bunny':     # 雷电星星法杖
        staff_shaft(top,'#fff3c4');y=toon('#ffe14d',emit=1.35,spec=0.6);star5(top+up*0.3,0.42,y)
        for k in(-1,1):rod(top+up*0.3+Vector((k*0.38,0,0.05)),top+up*0.3+Vector((k*0.55,0,-0.25)),0.05,toon('#8fd3ff',emit=1.6),0.0,r2=0.0,v=6)
        tipv=top+up*0.32;base=0
    elif t=='fox':       # 火焰法杖：火球 + 火舌
        staff_shaft(top,'#8a4a2b');ball(top+up*0.08,0.13,gold,0.02)
        fo=top+up*0.38;ball(fo,0.3,toon('#ff7a1a',flat=True,emit=1.7),0.03);ball(fo+Vector((0,-0.18,-0.04)),0.17,toon('#fff2a0',flat=True,emit=1.9),0)
        for i in range(5):a=math.radians(60+i*15);rod(fo+Vector((math.cos(a)*0.2,0,math.sin(a)*0.2)),fo+Vector((math.cos(a)*0.5,0,math.sin(a)*0.55)),0.12,toon(['#ff5a1a','#ff9a2a','#ffd23f'][i%3],flat=True,emit=1.7),0.0,r2=0.0,v=10)
        tipv=fo;base=0
    elif t=='pig':       # 金币权杖
        staff_shaft(top,'#ffd23f');co=top+up*0.3;cyl(tuple(co),0.36,0.12,(math.radians(90),0,0),toon('#ffd23f',spec=0.8),0.03);decal(tuple(co),0.0,0,0,(0.16,0.16,0.02),toon('#e69a00'),0.07)
        tipv=co;base=0
    elif t=='owl':       # 狙击十字弩（横持，指向右上）
        C=HAND+Vector((0.1,-0.05,0.1));m=metal('#5a6178');wd=g('#8a5a3b')
        rod(C+Vector((-0.35,0,0)),C+Vector((1.0,0,0)),0.08,wd,0.022);rod(C+Vector((0.55,0,-0.5)),C+Vector((0.55,0,0.5)),0.06,m,0.022)
        st=g('#fff6fb',flat=True);pb=0.22 if POSE=='w' else 0
        for k in(-1,1):rod(C+Vector((0.55,0,k*0.5)),C+Vector((0.2-pb,0,0)),0.012,st,0)
        rod(C+Vector((0.1,-0.1,0.13)),C+Vector((0.5,-0.1,0.13)),0.07,m,0.02);ball(C+Vector((0.5,-0.18,0.13)),0.06,toon('#8fe8ff',emit=1.6),0.0)
        if POSE!='a':rod(C+Vector((0.2-pb,-0.04,0)),C+Vector((1.05,-0.04,0)),0.025,metal('#e8eef8'),0.01);rod(C+Vector((1.05,-0.04,0)),C+Vector((1.22,-0.04,0)),0.06,toon('#8fe8ff',emit=1.4),0.012,r2=0.0,v=8)
        tipv=C+Vector((1.25,0,0));base=-32;piv=C+Vector((0.4,0,0));pk=0.35
    elif t=='hedgehog':  # 弹弓 + 尖刺石
        Y0=HAND+Vector((0.15,-0.05,0.0));wd=g('#a8673e');fk=Y0+Vector((0.25,0,0.7))
        rod(Y0,fk,0.1,wd,0.025)
        for k in(-1,1):rod(fk,fk+Vector((k*0.34,0,0.48)),0.085,wd,0.022);ball(fk+Vector((k*0.34,0,0.48)),0.09,gold,0.012)
        pb=0.35 if POSE=='w' else 0.0;pouch=fk+Vector((0,-0.15-pb*0.3,0.3-pb))
        rb=g('#ff6f9c');[rod(fk+Vector((k*0.3,0,0.42)),pouch,0.025,rb,0.008) for k in(-1,1)]
        if POSE!='a':
            ball(pouch,0.22,metal('#c8d0e0'),0.02)
            for i in range(6):a=i/6*math.tau;rod(pouch+Vector((math.cos(a)*0.18,0,math.sin(a)*0.18)),pouch+Vector((math.cos(a)*0.36,0,math.sin(a)*0.36)),0.07,metal('#e8eef8'),0.01,r2=0.0,v=8)
        tipv=fk+Vector((0,-0.1,0.48));base=0
    elif t=='sheep':     # 治愈魔法书（翻开）+ 漂浮爱心
        B=HAND+Vector((0.22,-0.18,0.32));cv=toon('#ff8fb1',spec=0.4);pg=toon('#fffaf0')
        for k in(-1,1):o=sph(tuple(B+Vector((k*0.3,0,0))),(0.32,0.06,0.4),cv,0.025);o.rotation_euler=(math.radians(-25),k*math.radians(-12),0);o2=sph(tuple(B+Vector((k*0.27,-0.05,0.01))),(0.27,0.05,0.35),pg,0.0);o2.rotation_euler=(math.radians(-25),k*math.radians(-12),0)
        ball(B+Vector((0,-0.06,0)),0.05,gold,0.01,(1,1,5))
        hp=B+Vector((0,-0.05,0.62));hm=toon('#ff5a7a',emit=1.4,spec=0.6);[ball(hp+Vector((k*0.13,0,0.05)),0.16,hm,0.018) for k in(-1,1)];rod(hp+Vector((0,0,0.02)),hp+Vector((0,0,-0.27)),0.23,hm,0.018,r2=0.0,v=16)
        tipv=hp;base=0
    elif t=='deer':      # 森林叶环法杖
        staff_shaft(top,'#8a5a3b');lf=toon('#5fbf6a',rim=0.5);ce=top+up*0.3
        for i in range(6):a=i/6*math.tau;o=sph(tuple(ce+Vector((math.cos(a)*0.28,0,math.sin(a)*0.28))),(0.16,0.04,0.08),lf,0.015);o.rotation_euler=(0,-a,0)
        ball(ce,0.14,toon('#ffd23f',emit=1.5,spec=0.9),0.015)
        tipv=ce;base=0
    elif t=='hamster':   # 肩扛导弹筒
        a0=HAND+Vector((-0.3,0.05,0.2));a1=HAND+Vector((0.7,-0.05,0.95));m=metal('#7a8a6a');rod(a0,a1,0.23,m,0.03);d=(a1-a0).normalized()
        rod(a1,a1+d*0.08,0.27,metal('#3a3f55'),0.025);ball(a1+d*0.02,0.17,toon('#ff4d6d',spec=0.6),0.0)
        for f in(0.3,0.65):p=a0+(a1-a0)*f;rod(p-d*0.03,p+d*0.03,0.245,gold,0.0)
        tipv=a1+d*0.1;base=0
    elif t=='koala':     # 大号马蹄磁铁
        C=HAND+Vector((0.25,-0.05,0.55));mg=toon('#ff4d6d',spec=0.5);pts=[]
        for i in range(9):a=math.radians(180*i/8);pts.append(C+Vector((0.32*math.cos(a),0,-0.32*math.sin(a)+0.0)))
        pts=[C+Vector((0.32*math.cos(math.radians(180*i/8)),0,-0.32*math.sin(math.radians(180*i/8)))) for i in range(9)]
        for i in range(8):rod(pts[i],pts[i+1],0.12,mg,0.025)
        for p in(pts[0],pts[-1]):rod(p,p+Vector((0,0,0.38)),0.12,mg,0.025);rod(p+Vector((0,0,0.38)),p+Vector((0,0,0.55)),0.125,metal('#e8eef8'),0.02)
        rod(HAND,C+Vector((0,0,-0.32)),0.08,toon(PAL['koala'][0]),0.02)
        for k in range(3):tor(tuple(C+Vector((0,0,0.75+k*0.12))),0.12+k*0.08,0.02,(0,0,0),toon('#8fd3ff',flat=True,emit=1.6),0)
        tipv=C+Vector((0,0,0.6));base=0
    elif t=='chick':     # 召唤军旗
        staff_shaft(top+up*0.15,'#a8673e',0.05);fl=toon('#ff6f9c',rim=0.4);tp=top+up*0.15
        o=sph(tuple(tp+Vector((0.33,0,-0.2))),(0.34,0.03,0.24),fl,0.025);decal(tuple(tp+Vector((0.33,-0.03,-0.2))),0.0,0,0,(0.1,0.02,0.1),toon('#ffe066',emit=1.3),0.0)
        ball(tp+up*0.05,0.08,gold,0.015);tipv=tp+Vector((0.3,0,-0.2));base=0
    elif t=='dragon':    # 龙晶权杖
        staff_shaft(top,'#7a4a8a');gm=toon('#7affd6',emit=1.6,spec=0.9)
        for k in(-1,1):rod(top,top+Vector((k*0.22,0,0.32)),0.05,gold,0.015,r2=0.02)
        crystal(top+up*0.2,0.16,0.4,gm);tipv=top+up*0.5;base=0
    elif t=='unicorn':   # 星空球法杖
        staff_shaft(top,'#d8b0ff');ce=top+up*0.32;ball(ce,0.3,toon('#3a2a6a',spec=0.9,rim=0.8,emit=1.2),0.03)
        tor(tuple(ce),0.42,0.03,(math.radians(70),math.radians(20),0),toon('#d8b0ff',flat=True,emit=1.8),0)
        for i in range(4):a=i*1.6;ball(ce+Vector((math.cos(a)*0.14,-0.28,math.sin(a)*0.14)),0.035,toon('#ffffff',flat=True,emit=2),0)
        tipv=ce;base=0
    else:return
    if lv>=3:ball(HAND+Vector((0.04,-0.12,0.08)),0.08,toon('#ff3b6b',spec=1,emit=1.2),0.012)
    if lv>=5:tor(tuple(HAND+Vector((0.03,0,0.12))),0.14,0.03,(math.radians(90),0,0),gold,0)
    if lv>=4:ball(tipv,0.12,toon('#fff6c0',flat=True,emit=1.6),0)
    tip_at(tipv)
    objs=OBJS[i0:];WSET.update(id(o) for o in objs)
    s=1.02+0.05*lv
    P=Matrix.Translation(piv)@Matrix.Rotation(math.radians(base+pk*POSE_ANG.get(POSE,0)),4,'Y')@Matrix.Translation(-piv)@Matrix.Translation(HAND)@Matrix.Scale(s,4)@Matrix.Translation(-HAND)
    xform(objs,P)
def specifics(t,mb,md,mw,iris,lv):
    ink=toon('#5a3442')
    if t=='cat':
        for i,k in enumerate((-0.18,0,0.18)):decal(H,R,k*60,58-abs(k)*30,(0.05,0.16,0.03),md,0.0)
        cyl((0.15,0.75,-0.75),0.08,0.8,(math.radians(-40),math.radians(20),0),mb)
        pass
        cyl((-0.45,0.55,-0.2),0.16,0.6,(math.radians(-20),math.radians(-30),0),toon('#5fbf6a'))
        for i in range(3):cone((-0.5+i*0.06,0.6,0.18),0.06,0.15,(0,0,0),toon('#ff8fb1'),0.0)
    if t=='penguin':
        decal(H,R,0,-14,(0.62,0.55,0.3),mw,-0.27)
        cone((0,-0.95,0.28),0.13,0.28,(math.radians(95),0,0),toon('#ffa94d'))
        sph((0,0,1.15),(0.8,0.78,0.42),toon('#8fd3ff'));tor((0,0,0.95),0.78,0.09,(0,0,0),toon('#ffffff'))
        for i in range(8):a=i/8*math.tau;sph((math.cos(a)*0.2,math.sin(a)*0.2,1.62),(0.09,0.09,0.09),toon('#ffffff'),0.01)
        pass
    if t=='bear':
        decal(H,R,0,-27,(0.3,0.22,0.2),mw,-0.05);decal(H,R,0,-21,(0.09,0.065,0.06),ink,0.08)
        pass
        sph((0,0.05,1.1),(0.72,0.7,0.42),toon('#7fb069'));tor((0,0,0.98),0.72,0.06,(0,0,0),toon('#5f8a4f'))
    if t=='bunny':
        pass
        cone((-0.55,-0.4,1.05),0.1,0.25,(0,math.radians(30),0),toon('#ffe14d'))
    if t=='fox':
        decal(H,R,-30,-34,(0.26,0.18,0.12),mw,-0.05);decal(H,R,30,-34,(0.26,0.18,0.12),mw,-0.05);decal(H,R,0,-12,(0.07,0.05,0.05),ink,0.06)
        sph((-0.6,0.6,-0.3),(0.4,0.42,0.75),mb).rotation_euler=(math.radians(-30),math.radians(-35),0);sph((-0.95,0.85,0.25),(0.22,0.22,0.3),mw)
        pass
    if t=='pig':
        cyl(on(H,R,0,-24,-0.05)[0],0.2,0.2,(math.radians(105),0,0),toon('#f598b3'))
        for k in(-1,1):decal(H,R,k*4.5,-24,(0.04,0.06,0.03),ink,0.1)
        pass
        cyl((0,0.05,1.25),0.32,0.4,(0,0,0),toon('#5a3442'));cyl((0,0.05,1.06),0.55,0.06,(0,0,0),toon('#5a3442'));tor((0,0.05,1.12),0.33,0.05,(0,0,0),toon('#ff6f9c'))
    if t=='dragon':
        decal((0,0.02,-0.58),0.5,0,0,(0.32,0.38,0.1),mw,-0.02)
        pass
        for i in range(3):cone((0,0.55+i*0.0,0.9-i*0.35),0.1,0.22,(math.radians(-60),0,0),md,0)
    if t=='frog':
        decal(H,R,0,-30,(0.5,0.3,0.15),mw,-0.08)
        for az,el in((-50,30),(45,40),(60,-5)):decal(H,R,az,el,(0.1,0.1,0.03),md,0.0)
        pass
        sph((0,0.05,1.1),(0.55,0.5,0.1),toon('#6cc25a'));sph((0.25,-0.1,1.22),(0.12,0.1,0.1),toon('#ff8fb1'),0.012)   # 荷叶帽
    if t=='owl':
        decal(H,R,-24,-4,(0.36,0.36,0.1),mw,-0.08);decal(H,R,24,-4,(0.36,0.36,0.1),mw,-0.08)
        cone(tuple(on(H,R,0,-22,-0.02)[0]),0.12,0.28,(math.radians(100),0,0),toon('#ffb020'))
        for k in(-1,1):
            for j in range(3):sph((k*(0.62+j*0.06),0.15,-0.4-j*0.15),(0.14,0.1,0.32),md,0.02).rotation_euler=(0,k*math.radians(-15-j*10),0)
        for j in range(3):decal((0,0.02,-0.58),0.48,(j-1)*25,10,(0.08,0.06,0.02),md,0.0)
        pass
        tor(tuple(on(H,R,24,-4,0.0)[0]),0.17,0.025,(math.radians(80),0,math.radians(15)),toon('#ffd23f',spec=0.9),0.01)   # 单片镜
    if t=='hedgehog':
        sp=toon('#8a5a3e',rim=0.3);sp2=toon('#a8734e',rim=0.3)
        for i in range(34):
            az=180+((i*47)%150-75);el=-15+((i*29)%95)
            if abs(az-180)<20 and el<5:continue
            p,d=on(H,R*0.92,az,el,0);o=cone(tuple(p+d*0.18),0.12,0.42,(0,0,0),sp if i%2 else sp2,ol=0.016,v=12);q=d.to_track_quat('Z','Y');o.rotation_mode='QUATERNION';o.rotation_quaternion=q
        for i in range(10):p,d=on((0,0.02,-0.58),0.55,140+i*9*(1 if i%2 else -1)+(0 if i%2 else 80),10+(i%3)*20,0);o=cone(tuple(p+d*0.1),0.08,0.28,(0,0,0),sp,ol=0.014,v=12);q=d.to_track_quat('Z','Y');o.rotation_mode='QUATERNION';o.rotation_quaternion=q
        decal(H,R,0,-20,(0.07,0.05,0.05),ink,0.07)
        pass
    if t=='sheep':
        wool=toon('#ffffff',rim=0.25,shadow='#e2dae6')
        for i in range(16):a=i/16*math.tau;sph((math.cos(a)*0.82,0.08+abs(math.sin(a))*0.1,0.55+math.sin(a)*0.8),(0.3,0.26,0.3),wool,0.02)
        for i in range(8):a=i/8*math.tau;sph((math.cos(a)*0.5,0.02+math.sin(a)*0.35,-0.5+math.sin(a)*0.25),(0.27,0.25,0.25),wool,0.02)
        decal(H,R,0,-6,(0.68,0.62,0.3),toon('#ffe6d6'),-0.24)
        pass
    if t=='deer':
        for az,el in((-55,15),(50,25),(65,-10),(-65,-15)):decal(H,R,az,el,(0.07,0.07,0.02),toon('#fff6ea'),0.0)
        decal(H,R,0,-22,(0.07,0.05,0.05),ink,0.07)
        pass
        for k in(-1,1):sph((0,0.6,-0.6),(0.15,0.12,0.15),mw,0.02)
    if t=='hamster':
        for k in(-1,1):sph(tuple(on(H,R,k*40,-30,-0.25)[0]),(0.34,0.26,0.28),mw,0.02)
        decal(H,R,0,-18,(0.06,0.045,0.04),toon('#ff8fb1'),0.07)
        pass
        tor((0,-0.05,1.05),0.8,0.05,(math.radians(-12),0,0),toon('#5a3a3a'));[sph((k*0.3,-0.72,1.12),(0.17,0.08,0.13),toon('#9fe0ff',spec=1,rim=0.6),0.02) for k in(-1,1)]
    if t=='koala':
        sph(tuple(on(H,R,0,-18,-0.12)[0]),(0.17,0.13,0.22),toon('#3a2a3a',spec=0.7),0.015)
        pass
    if t=='chick':
        cone(tuple(on(H,R,0,-14,-0.02)[0]),0.13,0.26,(math.radians(100),0,0),toon('#ff8a3d'))
        for k in(-1,1):sph((k*0.6,0.05,-0.45),(0.12,0.22,0.3),md,0.02).rotation_euler=(0,k*math.radians(-25),0)
        egg=toon('#fffaf0',rim=0.3);o=sph((0,0.02,1.15),(0.62,0.6,0.32),egg)
        for i in range(8):a=i/8*math.tau;cone((math.cos(a)*0.58,0.02+math.sin(a)*0.56,1.02),0.13,0.24,(math.radians(180),0,0),egg,ol=0.014,v=12)
        pass
    if t=='unicorn':
        pass
        for i,c in enumerate(['#ff8fb1','#ffd166','#8fd3ff']):cone((-0.1+i*0.08,0.75,-0.7),0.18,0.6,(math.radians(-50),0,0),toon(c),0.02)
    weapon(t,lv)
TIER=['#c4cedc','#6ee07a','#4fa8ff']
HATZ={'penguin':1.7,'bear':1.5,'pig':1.52,'frog':1.22,'sheep':1.42,'chick':1.42,'hamster':1.42,'deer':1.36,'unicorn':1.36}
def level_deco(t,lv,br):
    """Lv1 素体 / Lv2 围巾 / Lv3 金属护肩+腰带+武器宝石 / Lv4 分支：A 冰晶骑士(蓝披风+羽翼+羽饰) B 炎红魔导(红披风+火焰翼+魔导帽) / Lv5 王冠+大翼+光环+环绕宝珠"""
    gold=toon('#ffd23f',spec=0.8,rim=0.5);tc=TIER[lv-1] if lv<=3 else {'A':'#4fa8ff','B':'#ff5a7a'}.get(br,'#b46cff')
    if lv>=2:
        sc=toon(tc,rim=0.3);tor((0,-0.02,-0.12),0.62,0.11,(math.radians(8),0,0),sc,0.025)
        for i in range(6):a=math.radians(200+i*28);tor((math.cos(a)*0.62,-0.02+math.sin(a)*0.62,-0.12),0.06,0.03,(0,math.radians(90),a),toon(tc,shadow='#5a3a5a'),0)
        for j,(x,z,rz) in enumerate([(-0.28,-0.32,12),(-0.14,-0.42,-8)]):o=sph((x,-0.55,z),(0.12,0.06,0.2+j*0.04),sc,0.02);o.rotation_euler=(0,math.radians(rz),0)
    if lv>=3:
        st=metal('#dfe6f2')
        for k in(-1,1):sph((k*0.5,-0.05,-0.3),(0.24,0.24,0.15),st,0.02).rotation_euler=(0,k*math.radians(-35),0);tor((k*0.5,-0.05,-0.31),0.19,0.022,(0,k*math.radians(-35),0),gold,0.0)
        tor((0,0.0,-0.8),0.62,0.05,(0,0,0),toon('#8a5a3b'),0.012);cyl((0,-0.58,-0.8),0.08,0.04,(math.radians(90),0,0),gold,0.01)
    z=HATZ.get(t,1.42);acc=PAL[t][3] if t in PAL else '#ffd23f'
    if lv>=4:
        bc={'A':'#6cc4ff','B':'#ff7a8a'}.get(br,'#c39bff');cc={'A':'#3d7fd6','B':'#d63d6b'}.get(br,'#8a4ad6')
        cape(cc,1.0 if lv==4 else 1.08)
        sph((0,-0.62,-0.2),(0.11,0.05,0.12),toon(bc,spec=1,emit=1.25),0.015);tor((0,-0.6,-0.2),0.12,0.025,(math.radians(90),0,0),gold,0)   # 胸前宝石扣
        if lv==4:top_ornament(t,(0,0.25,z+0.36),1.2)   # Lv4：头顶悬浮主题饰物，取代光环，轮廓更干净
        else:back_halo(0.55,1.0,bc,0,acc,0.075)          # Lv5：无装饰钉的粗光环 + 王冠，两级一眼可分
    if lv>=5:
        crown(z,{'A':'#5ab8ff','B':'#ff3b6b'}.get(br,'#ff3b6b'))
        tor((0,0.0,-1.32),0.85,0.04,(0,0,0),toon({'A':'#9fe0ff','B':'#ffb0c0'}.get(br,'#fff1a8'),flat=True,emit=1.6),0)
THEME={'penguin':'ice','sheep':'ice','bunny':'star','unicorn':'star','owl':'star','chick':'star','fox':'flame','bear':'flame','dragon':'flame','hamster':'flame',
 'frog':'leaf','deer':'leaf','koala':'leaf','pig':'coin','cat':'leaf','hedgehog':'bolt'}
def top_ornament(t,c,k=1.0):
    """光环顶部的元素饰物：按伙伴主题区分（冰晶 / 星星 / 火焰 / 叶子 / 金币 / 闪电）"""
    th=THEME.get(t,'star');c=Vector(c)
    if th=='ice':crystal(c,0.13*k,0.3*k,toon('#7fd0ff',spec=1,emit=1.3),0.02)
    elif th=='star':star5(c,0.22*k,toon('#ffe066',spec=0.9,emit=1.3),0.016)
    elif th=='flame':
        # 水滴形火焰：橙红外焰 + 黄色内焰 + 白芯，两侧小火舌，小尺寸下轮廓仍是"火"
        rod(c+Vector((0,0,-0.02))*1,c+Vector((0.03,0,0.34*k)),0.15*k,toon('#ff6a2a',flat=True,emit=1.6),0.018,r2=0.0,v=24);ball(c,0.15*k,toon('#ff6a2a',flat=True,emit=1.6),0.018,(1,0.8,0.95))
        for sx in(-1,1):rod(c+Vector((sx*0.1*k,0,-0.02)),c+Vector((sx*0.2*k,0,0.18*k)),0.06*k,toon('#ff8a3a',flat=True,emit=1.6),0.012,r2=0.0,v=16)
        rod(c+Vector((0,-0.07,-0.02)),c+Vector((0.02,-0.07,0.22*k)),0.09*k,toon('#ffd23f',flat=True,emit=2.0),0,r2=0.0,v=20);ball(c+Vector((0,-0.07,0)),0.09*k,toon('#ffd23f',flat=True,emit=2.0),0,(1,0.7,0.9))
        ball(c+Vector((0,-0.11,0.0)),0.045*k,toon('#fffbe0',flat=True,emit=2.4),0)
    elif th=='coin':
        # 金币：厚边 + 正面凸起星纹，避免成为一块扁平黄片
        cyl(tuple(c),0.17*k,0.07,(math.radians(90),0,0),toon('#ffc21f',spec=0.9,rim=0.5),0.018);cyl(tuple(c+Vector((0,-0.04,0))),0.12*k,0.02,(math.radians(90),0,0),toon('#ffe680',spec=1),0.008)
        star5(c+Vector((0,-0.06,0)),0.07*k,toon('#e09a10',spec=0.6),0.006)
    elif th=='leaf':
        for a in(-35,35):o=sph(tuple(c),(0.09*k,0.05*k,0.2*k),toon('#7ee08a',rim=0.5),0.016);o.rotation_euler=(0,math.radians(a),0)
    else:
        rod(c+Vector((0.06,0,0.18))*k,c+Vector((-0.05,0,0))*k,0.06*k,toon('#ffe066',flat=True,emit=1.8),0.014,r2=0.03*k);rod(c+Vector((0.05,0,0))*k,c+Vector((-0.06,0,-0.18))*k,0.06*k,toon('#ffe066',flat=True,emit=1.8),0.014,r2=0.0)
def cape(col,big=1.0):
    """短披风：贴在背后的圆润外壳，正面只露出两侧，不遮挡身体"""
    sph((0,0.4,-0.6),(0.84*big,0.2,0.7*big),toon(col,rim=0.45),0.03)
    tor((0,0.08,-0.12),0.46,0.06,(math.radians(10),0,0),toon('#ffd23f',spec=0.8),0.012)
def back_halo(z,r,col,studs,scol,thick=0.06):
    """背后光环：竖直圆环围住头部轮廓，小尺寸下也清晰可读"""
    tor((0,0.62,z),r,thick,(math.radians(90),0,0),toon(col,flat=True,emit=1.7),0.016)
    for i in range(studs):
        a=math.pi/2+(1 if i%2 else -1)*(0.5+0.48*(i//2));sph((math.cos(a)*r,0.58,z+math.sin(a)*r),(0.072,0.05,0.072),toon(scol,spec=1,emit=1.25),0.015)
def crown(z,gem):
    """简洁王冠：金圈 + 三个圆头尖角 + 正中宝石"""
    gold=toon('#ffd23f',spec=0.9,rim=0.5);cyl((0,0.08,z),0.28,0.14,(math.radians(-10),0,0),gold,0.022)
    for i,x in enumerate((-0.18,0,0.18)):
        h=0.22 if i==1 else 0.16;cone((x,-0.05,z+0.07+h/2),0.08,h,(math.radians(-10),0,0),gold,0.016,v=16);sph((x,-0.06,z+0.09+h),(0.05,0.05,0.05),gold,0.012)
    sph((0,-0.2,z),(0.07,0.04,0.07),toon(gem,spec=1,emit=1.2),0.01)
# ---------------- 跨塔融合 ----------------
FUSIONS={'superconduct':('penguin','bunny','#7fd8ff'),'inferno':('bear','fox','#ff7a3a'),'plague':('frog','chick','#9be37a'),'hawkeye':('owl','cat','#ffb020'),
 'magspike':('hedgehog','koala','#ff4d6d'),'bliss':('pig','sheep','#ffd23f'),'starlight':('deer','unicorn','#c39bff'),'rocketfire':('hamster','fox','#ff5a3a'),
 'frostbeam':('dragon','penguin','#9fe8ff'),'toxfire':('frog','fox','#c86cff')}
def mixpal(a,b):
    import colorsys
    pa,pb=PAL[a],PAL[b];return (pa[0],pa[1],pa[2],pb[3])
def fusion_tower(k,expr,flv=3):
    a,b,col=FUSIONS[k];clear();pal=mixpal(a,b);mb,md,mw,iris=chibi(a,pal,expr);ears(a,mb,md,mw);tufts(a,mb,mw)
    face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(a,'smile'))
    specifics(a,mb,md,mw,iris,5)
    # 伙伴的武器换到左手（镜像）
    i0=len(OBJS);pb=PAL[b];specifics(b,toon(pb[0]),toon(pb[1]),toon(pb[2]),pb[3],5)
    mirror_part(i0)
    level_deco(a,2 if flv==1 else 3,'')
    # 融合专属：双色披风 + 双色背后光环 + 融合宝石；Lv3 加王冠
    z=HATZ.get(a,1.42);cape(col,1.05)
    back_halo(0.55,0.96+0.03*flv,col,0,PAL[b][3],0.05+0.01*flv)
    sph((0,-0.62,-0.2),(0.12,0.055,0.13),toon(col,spec=1,emit=1.4),0.015)
    if flv>=3:crown(z,PAL[b][3])
    tor((0,0.0,-1.32),0.9,0.045,(0,0,0),toon(col,flat=True,emit=1.8),0)
def mirror_part(i0):
    for o in OBJS[i0:]:
        full=id(o) in WSET
        if full or o.location.x>0.3:o.location.x=-o.location.x
        if o.rotation_mode!='QUATERNION':o.rotation_euler=(o.rotation_euler[0],-o.rotation_euler[1],-o.rotation_euler[2])
        elif full or o.location.x<-0.3:q=o.rotation_quaternion;o.rotation_quaternion=(q[0],q[1],-q[2],-q[3])
def fus_wings(c1,c2,n,big=1.0):
    for k2 in(-1,1):
        for j in range(n):o=sph((k2*(0.72+j*0.2*big),0.62,-0.05+j*0.2*big),(0.13,0.07,(0.46-j*0.05)*big),toon(c1 if k2>0 else c2,emit=1.1,rim=0.5),0.02);o.rotation_euler=(0,k2*math.radians(-42-j*10),0)
ULTS={'cosmos':('starlight','frostbeam','#8a7bff'),'phoenix':('inferno','rocketfire','#ff6a2a'),'raijin':('superconduct','magspike','#5ad0ff'),'gaia':('plague','bliss','#7fe07f'),'skyhunter':('hawkeye','toxfire','#ffcf3f')}
RAINBOW=['#ff6f8f','#ffb020','#ffe066','#6ee07a','#4fc8ff','#8a7bff','#d07bff']
def ultimate_tower(k,expr):
    fa,fb,col=ULTS[k];a=FUSIONS[fa][0];b=FUSIONS[fb][0];clear();pal=(PAL[a][0],PAL[a][1],PAL[a][2],'#ffcf3f')
    mb,md,mw,iris=chibi(a,pal,expr);ears(a,mb,md,mw);tufts(a,mb,mw);face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(a,'smile'))
    specifics(a,mb,md,mw,iris,5);i0=len(OBJS);pb=PAL[b];specifics(b,toon(pb[0]),toon(pb[1]),toon(pb[2]),pb[3],5)
    mirror_part(i0)
    level_deco(a,3,'');gold=toon('#ffd23f',spec=1,rim=0.6)
    # 黄金胸甲 + 太阳背环（双环+六宝石）+ 王冠 + 地面光环
    sph((0,-0.18,-0.6),(0.5,0.34,0.42),toon('#ffe48a',spec=1,rim=0.6),0.025);sph((0,-0.5,-0.5),(0.13,0.05,0.15),toon(col,spec=1,emit=1.6),0.012)
    cape(col,1.1);sph((0,0.75,0.55),(1.12,0.02,1.12),toon('#fff2b0',flat=True,emit=1.0),0.02)
    back_halo(0.55,1.08,'#ffe066',0,col,0.08);tor((0,0.66,0.55),0.9,0.035,(math.radians(90),0,0),toon('#ffffff',flat=True,emit=2),0)
    z=HATZ.get(a,1.42);crown(z,col)
    tor((0,0,-1.32),1.0,0.05,(0,0,0),toon(col,flat=True,emit=2),0)
HERO_DECO={'captain':'cat','princess':'penguin','fortune':'pig','thunder':'bunny'}
def hero_deco(h):
    if h=='captain':
        cone((0,0.3,-0.45),1.0,1.05,(math.radians(-8),0,0),toon('#ff4d6d'),0.03);cyl((-0.8,-0.3,-0.1),0.045,1.0,(0,math.radians(25),0),toon('#e8eef8',spec=0.9));cyl((-0.68,-0.3,-0.55),0.12,0.05,(0,math.radians(25),0),toon('#ffd23f'))
        sph((0,0.0,1.32),(0.95,0.5,0.28),toon('#3d4a7a'),0.03);tor((0,0.0,1.25),0.8,0.05,(0,0,0),toon('#ffd23f'));sph((0,-0.42,1.4),(0.12,0.05,0.12),toon('#ffffff'),0.015)
    if h=='princess':
        for i in range(7):a=math.radians(30+i*20);cone((math.cos(a)*0.4,-0.2,1.3+math.sin(a)*0.15),0.06,0.28,(0,0,0),toon('#bfe9ff',emit=1.3,spec=1))
    if h=='fortune':cyl((0,0.05,1.25),0.42,0.42,(0,0,0),toon('#d62f3a'));tor((0,0.05,1.08),0.48,0.07,(0,0,0),toon('#ffd23f',spec=0.7))
    if h=='thunder':tor((0,-0.62,0.8),0.55,0.07,(math.radians(80),0,0),toon('#4a4e66'));[sph((k*0.28,-0.85,0.78),(0.17,0.06,0.15),toon('#8fd3ff',spec=1),0.02) for k in(-1,1)]
LVS=lambda lv:0.78+0.045*(lv-1)
def tower(t,lv,br='',expr='idle',pal=None,hero=None):
    clear();pal=pal or PAL[t];mb,md,mw,iris=chibi(t,pal,expr);ears(t,mb,md,mw);tufts(t,mb,mw)
    face(H,R*1.04,iris=iris,expr=expr,size=1.18,sp=29,el=-7,mouth=MOUTH.get(t,'smile'))
    specifics(t,mb,md,mw,iris,lv);level_deco(t,lv,br)
    if hero:hero_deco(hero)
# ---------------- 怪物 ----------------
EC={'normal':'#86dd8f','fast':'#ffe066','flying':'#b49cff','tank':'#8fd18a','splitter':'#e86eb8','shield':'#7ec8f0','healer':'#fff0d8','mini':'#ffb08a','bomb':'#4e4a66','ghost':'#f4f4ff',
 'king':'#6fcf7c','turtle':'#8fd18a','bat':'#a98bff','ghostking':'#e6e2ff','jelly':'#ff5a9a','frost':'#bfe9ff','magma':'#ff9a4d','star':'#ffe066'}
def slime_body(col,sc=(1,0.95,0.78),z=-0.35):
    m=toon(col,spec=0.55,rim=0.45);sph((0,0,z),sc,m);decal((0,0,z),sc[0]*0.95,-30,40,(0.16,0.09,0.03),toon('#ffffff',flat=True),0.0)
    return m
def monster(k,expr='idle'):
    clear();col=EC[k];ink=toon('#5a3442');FH=(0,0,-0.35);FR=0.92;fe=dict(iris='#5a3442',expr=expr,el=-6,sp=27,size=1.15)
    if k in('normal','mini','splitter','king','jelly','frost','magma'):
        if k=='mini':
            # 小软：更小圆身 + 双耳 + 头顶小芽，和粉红分裂体一眼可分
            m=slime_body(col,sc=(0.72,0.7,0.58),z=-0.55);face((0,0,-0.55),0.7,iris='#5a3442',expr=expr,el=-4,sp=28,size=0.85,blush=True,mouth='smile')
            for kk in(-1,1):sph((kk*0.42,0.05,-0.2),(0.16,0.12,0.2),m,0.015)
            cyl((0,0,-0.05),0.025,0.18,(0,0,0),toon('#7fd06a'),0.008);sph((0.08,0,0.1),(0.12,0.05,0.07),toon('#9be37a'),0.01).rotation_euler=(0,math.radians(-25),0)
        elif k=='jelly':
            # 果冻首领：扁圆身子 + 两根短触须（减重叠杂乱）+ 头顶奶油旋，轮廓仍是「滴水果冻」
            m=slime_body(col,sc=(1.05,1.0,0.72),z=-0.2);face((0,0,-0.2),1.0,**fe)
            cream=toon('#fff6f0',spec=0.6);tor((0,0,0.42),0.55,0.08,(0,0,0),cream);sph((0,0.05,0.55),(0.22,0.22,0.18),cream,0.02)
            for x in(-0.32,0.32):
                rod((x,-0.05,-0.8),(x*1.05,-0.08,-1.15),0.09,toon('#ff8fb8',spec=0.7),0.016,r2=0.035,v=16)
                sph((x*1.05,-0.08,-1.18),(0.11,0.11,0.13),toon('#ff3b6b',spec=0.8),0.012)
        else:
            m=slime_body(col);face(FH,0.97,**fe)
            if k=='normal':cyl((0,0,0.42),0.03,0.2,(0,0,0),toon('#5fa84f'),0.01);sph((0.12,0,0.55),(0.16,0.05,0.08),toon('#7fd06a'),0.015).rotation_euler=(0,math.radians(-20),0)
            if k=='splitter':
                # 分裂体：母体 + 明显分离的小体叠在头顶，轮廓是「双层雪人」
                baby=toon('#ffb0d8',spec=0.55,rim=0.45)
                sph((0,0.08,0.62),(0.42,0.4,0.36),baby);face((0,0.08,0.62),0.4,iris='#5a3442',expr=expr,el=-4,sp=26,size=0.48,blush=False,mouth='smile')
                # 母体两侧小角，强化横向轮廓
                for kk in(-1,1):cone((kk*0.72,0.05,0.15),0.1,0.28,(0,kk*math.radians(-35),0),toon('#c84a8a'),0.015)
            if k=='king':
                gold=toon('#ffd23f',spec=0.7);cyl((0,0.05,0.48),0.36,0.22,(0,0,0),gold)
                for i in range(5):a=i/5*math.tau;cone((math.cos(a)*0.33,0.05+math.sin(a)*0.33,0.68),0.08,0.24,(0,0,0),gold,0.015)
                cone((0,0.4,-0.5),0.9,0.9,(math.radians(-15),0,0),toon('#e8475f'))
        if k=='frost':
            for i in range(7):a=math.radians(15+i*25);cone((math.cos(a)*0.6,0.1,0.3+math.sin(a)*0.28),0.1,0.45,(0,-(a-math.pi/2)*0.9,0),toon('#ffffff',spec=0.8),0.015)
        if k=='magma':
            for i in range(5):a=i/5*math.tau;decal(FH,FR*0.86,i*70-140,-30+i*8,(0.12,0.05,0.03),toon('#ffe14d',flat=True,emit=1.5),0)
            for i in range(3):sph(((i-1)*0.35,0.1,0.42),(0.12,0.12,0.16),toon('#5a3a3a'),0.015)
    if k=='fast':
        m=toon(col,spec=0.5,rim=0.45);sph((0,0.15,-0.4),(0.85,1.1,0.68),m);face((0,0,-0.4),0.98,**fe)
        tor((0,0.12,0.12),0.55,0.07,(math.radians(-8),0,0),toon('#ff4d6d'));cone((0.1,0.9,0.15),0.12,0.6,(math.radians(-70),0,0),toon('#ff4d6d'))
        for kk in(-1,1):cyl((kk*0.25,-0.78,0.0),0.02,0.18,(math.radians(90),math.radians(kk*25),0),ink,0)
    if k in('flying','bat'):
        s=1.0;m=toon(col,rim=0.45);sph((0,0,-0.2),(0.78,0.72,0.72),m);face((0,0,-0.2),0.76,**fe)
        wm=toon('#6e4fbf')
        for kk in(-1,1):
            for j in range(3):sph((kk*(0.8+j*0.28),0.15,-0.05-j*0.12),(0.3,0.05,0.32-j*0.06),wm,0.025).rotation_euler=(0,kk*math.radians(25+j*10),0)
            cone((kk*0.4,0,0.55),0.18,0.35,(0,kk*math.radians(-15),0),m)
            cone((kk*0.12,-0.72,-0.42),0.035,0.12,(math.radians(180),0,0),toon('#ffffff'),0.01)
        if k=='bat':
            gold=toon('#ffd23f',spec=0.7);cyl((0,0,0.5),0.3,0.18,(0,0,0),gold);[cone((math.cos(i/5*math.tau)*0.27,math.sin(i/5*math.tau)*0.27,0.66),0.07,0.2,(0,0,0),gold,0.015) for i in range(5)];cone((0,0.3,-0.6),0.9,0.7,(math.radians(-10),0,0),toon('#e8475f'),0.03);[cone((kk*0.5,0.0,0.75),0.15,0.5,(0,kk*math.radians(-20),0),m) for kk in(-1,1)]
    if k in('tank','turtle'):
        m=toon(col,rim=0.4);sph((0,-0.45,-0.35),(0.48,0.42,0.42),m);face((0,-0.45,-0.35),0.45,iris='#5a3442',expr=expr,el=-4,sp=28,size=0.55,blush=True)
        sh=toon('#b07a4a',spec=0.3);sph((0,0.25,-0.25),(0.95,0.85,0.65),sh);
        for i in range(6):a=i/6*math.tau;decal((0,0.25,-0.25),0.75,math.degrees(a)*0.6-90,40,(0.18,0.18,0.03),toon('#8a5a32'),0.0)
        for kk in(-1,1):sph((kk*0.65,-0.2,-0.85),(0.18,0.2,0.14),m)
        if k=='turtle':
            gold=toon('#ffd23f',spec=0.7)
            for i in range(5):cone(((i-2)*0.32,0.25,0.38),0.12,0.35,(0,0,0),toon('#e8eef8',spec=0.6),0.015)
            cyl((0,-0.45,0.12),0.22,0.14,(0,0,0),gold)
    if k=='shield':
        m=slime_body(col);face(FH,0.97,**fe)
        sph((0,0.05,0.05),(0.72,0.7,0.48),toon('#d8dfea',spec=0.8));cyl((0,-0.62,0.05),0.03,0.6,(0,math.radians(90),0),toon('#5a6a8a'),0.01)
        cone((0,0.1,0.65),0.12,0.4,(math.radians(-20),0,0),toon('#ff4d6d'))
        cyl((0.72,-0.5,-0.45),0.38,0.1,(math.radians(80),0,math.radians(-20)),toon('#ffd23f',spec=0.6));decal((0.72,-0.5,-0.45),0.0,-20,0,(0.15,0.15,0.03),toon('#ff6f9c'),0.07)
    if k=='healer':
        stem=toon(col,rim=0.4);sph((0,0,-0.55),(0.6,0.55,0.55),stem);face((0,0,-0.55),0.58,iris='#5a3442',expr=expr,el=-2,sp=28,size=0.7)
        cap=toon('#ff6b7a',spec=0.4);sph((0,0.05,0.05),(1.0,0.95,0.6),cap)
        for i,(az,el) in enumerate([(-40,30),(10,50),(45,25),(-10,15),(70,45),(-70,45)]):decal((0,0.05,0.05),0.85,az,el,(0.13,0.13,0.03),toon('#ffffff'),0.02)
        cyl((0.6,-0.45,-0.55),0.03,0.6,(0,math.radians(-20),0),toon('#a8673e'));sph((0.7,-0.48,-0.25),(0.1,0.1,0.1),toon('#7fe07f',emit=1.4),0.015)
    if k=='bomb':
        m=toon(col,spec=0.6,rim=0.5);sph((0,0,-0.35),(0.8,0.78,0.78),m);face(FH,0.8,iris='#ff4d6d',expr=expr if expr!='idle' else 'idle',el=-8,sp=26)
        cyl((0,0,0.5),0.18,0.18,(0,0,0),toon('#8a8fa8'));cyl((0.1,0,0.72),0.03,0.35,(0,math.radians(25),0),toon('#c9a07a'),0.01)
        sph((0.2,0,0.92),(0.11,0.11,0.11),toon('#ffd23f',flat=True,emit=2),0)
    if k in('ghost','ghostking'):
        m=toon(col,rim=0.6);sph((0,0,-0.25),(0.75,0.7,0.85),m)
        for i in range(5):sph(((i-2)*0.3,0,-1.0),(0.16,0.16,0.16),m,0.02)
        face((0,0,-0.15),0.72,iris='#7a6cff',expr=expr,el=-4,sp=26,size=0.85)
        for kk in(-1,1):sph((kk*0.72,-0.1,-0.4),(0.15,0.12,0.28),m,0.02).rotation_euler=(0,kk*math.radians(-30),0)
        if k=='ghostking':cone((0,0.05,0.85),0.55,1.0,(math.radians(-8),0,0),toon('#6a4fa8'));tor((0,0.05,0.4),0.55,0.06,(0,0,0),toon('#ffd23f'))
    if k=='star':
        m=toon(col,spec=0.5,rim=0.45);sph((0,0,-0.25),(0.75,0.6,0.75),m)
        for i in range(5):a=math.pi/2+i/5*math.tau;cone((math.cos(a)*0.85,0,-0.25+math.sin(a)*0.85),0.35,0.6,(0,-a+math.pi/2,0),m,0.03)
        face((0,0,-0.25),0.62,iris='#ff8a3d',expr=expr,el=-4,sp=28,size=0.8)

def prop(k):
    clear()
    if k=='arrow':cyl((0,0,0),0.06,1.6,(0,math.radians(90),0),toon('#a8673e'));cone((0.9,0,0),0.2,0.4,(0,math.radians(90),0),toon('#e8eef8',spec=0.8));cone((-0.75,0,0),0.24,0.32,(0,math.radians(-90),0),toon('#ff8fb1'))
    if k=='snow':sph((0,0,0),(0.55,0.55,0.55),toon('#ffffff',spec=0.5,shadow='#bfe0ff'));decal((0,0,0),0.55,-30,30,(0.12,0.08,0.03),toon('#ffffff',flat=True))
    if k=='ball':sph((0,0,0),(0.55,0.55,0.55),toon('#4e4a66',spec=0.7,rim=0.5));cyl((0.1,0,0.55),0.06,0.3,(0,math.radians(20),0),toon('#c9a07a'));sph((0.2,0,0.75),(0.12,0.12,0.12),toon('#ffd23f',flat=True,emit=2),0)
    if k=='fireball':sph((0,0,0),(0.55,0.55,0.55),toon('#ff7a1a',flat=True,emit=1.8),0.04);sph((0,-0.3,0.05),(0.32,0.25,0.32),toon('#fff2a0',flat=True,emit=2),0)
    if k=='orb':sph((0,0,0),(0.5,0.5,0.5),toon('#d8b0ff',flat=True,emit=1.8),0.04);sph((0,-0.3,0),(0.25,0.2,0.25),toon('#ffffff',flat=True,emit=2),0)
    if k=='coin':cyl((0,0,0),0.55,0.14,(math.radians(80),0,0),toon('#ffd23f',spec=0.8));decal((0,-0.08,0),0.0,0,0,(0.25,0.25,0.02),toon('#ffb020'),0.0)
    if k=='star':
        m=toon('#ffe066',spec=0.6);sph((0,0,0),(0.45,0.3,0.45),m)
        for i in range(5):a=math.pi/2+i/5*math.tau;cone((math.cos(a)*0.5,0,math.sin(a)*0.5),0.22,0.45,(0,-a+math.pi/2,0),m,0.03)
    if k=='heart':
        m=toon('#ff6f8f',spec=0.6);[sph((kk*0.25,0,0.1),(0.33,0.3,0.33),m) for kk in(-1,1)];cone((0,0,-0.25),0.47,0.6,(math.radians(180),0,0),m)
    if k=='castle':
        wall=toon('#fff0f6');roof=toon('#ff7aa5',spec=0.4);pink=toon('#ffd6e6')
        cyl((0,0.2,-0.2),0.75,1.3,(0,0,0),wall);cone((0,0.2,0.85),0.9,0.9,(0,0,0),roof)
        for kk in(-1,1):cyl((kk*0.95,0,-0.35),0.38,1.1,(0,0,0),pink);cone((kk*0.95,0,0.55),0.5,0.75,(0,0,0),roof)
        sph((0,-0.55,-0.68),(0.3,0.1,0.36),toon('#8a5a7a'))
        cyl((0,0.2,1.55),0.03,0.5,(0,0,0),toon('#8a5a7a'));cone((0.15,0.2,1.7),0.12,0.3,(0,math.radians(90),0),toon('#ffe066'))
        face((0,0.2,-0.2),0.76,iris='#ff6f9c',el=8,sp=22,size=0.7)
def prop2(k):
    if k=='poison':
        m=toon('#9be37a',spec=0.8,rim=0.6,emit=1.2);sph((0,0,0),(0.5,0.5,0.58),m,0.04);sph((-0.15,-0.4,0.18),(0.13,0.06,0.13),toon('#ffffff',flat=True,emit=1.5),0)
        for i in range(3):sph((0.3-i*0.25,0,0.5+i*0.12),(0.12-i*0.02,)*3,toon('#c8ff9a',emit=1.3),0.02)
        sph((0,-0.45,-0.05),(0.18,0.05,0.15),toon('#b46cff',emit=1.2),0.0)
    if k=='missile':
        cyl((0,0,0),0.18,1.1,(0,math.radians(90),0),metal('#e8eef8'));cone((0.7,0,0),0.18,0.35,(0,math.radians(90),0),toon('#ff4d6d',spec=0.6))
        for a in range(4):cone((-0.45,math.cos(a*1.57)*0.18,math.sin(a*1.57)*0.18),0.12,0.25,(a*1.57,math.radians(-90),0),toon('#ffd23f'),ol=0.02,v=4)
        tor((0.2,0,0),0.185,0.03,(0,math.radians(90),0),toon('#ff4d6d'),0)
        cone((-0.8,0,0),0.16,0.4,(0,math.radians(90),0),toon('#ffb020',flat=True,emit=2.2),0)
    if k=='spike':
        sph((0,0,0),(0.38,0.38,0.38),toon('#a8734e',rim=0.5))
        for i in range(14):
            a=i*2.4;e=math.asin(-1+2*(i+0.5)/14);d=Vector((math.cos(a)*math.cos(e),math.sin(a)*math.cos(e),math.sin(e)));o=cone(tuple(d*0.48),0.1,0.3,(0,0,0),metal('#e8eef8'),ol=0.015,v=10);q=d.to_track_quat('Z','Y');o.rotation_mode='QUATERNION';o.rotation_quaternion=q
    if k=='chickling':
        m=toon('#ffe066');sph((0,0,0),(0.55,0.5,0.5),m);face((0,0,0),0.57,iris='#5a3442',expr='attack',el=-2,sp=27,size=0.75)
        cone(tuple(on((0,0,0),0.55,0,-12,-0.02)[0]),0.1,0.2,(math.radians(100),0,0),toon('#ff8a3d'))
        for i in range(3):cone(((i-1)*0.07,0,0.55),0.05,0.22,(0,math.radians((i-1)*30),0),toon('#ffd23f'),ol=0.012,v=10)
        for k2 in(-1,1):sph((k2*0.52,0.05,-0.05),(0.1,0.18,0.24),toon('#f2bf2a'),0.02).rotation_euler=(0,k2*math.radians(-25),0)
        sph((0,0.1,-0.55),(0.3,0.25,0.12),toon('#fffaf0'),0.02)
    if k=='feather':
        o=sph((0,0,0),(0.12,0.04,0.6),toon('#fff6d8',rim=0.5),0.03);cyl((0,0,-0.3),0.02,0.8,(0,0,0),toon('#e8c890'),0.01)
    if k=='heal':
        m=toon('#ff6f8f',spec=0.7,emit=1.3);[sph((kk*0.25,0,0.1),(0.33,0.3,0.33),m) for kk in(-1,1)];cone((0,0,-0.25),0.47,0.6,(math.radians(180),0,0),m);sph((-0.25,-0.3,0.25),(0.1,0.05,0.1),toon('#ffffff',flat=True,emit=1.5),0)
FRAMES=(('0','idle',1.0,0),('w','attack',0.95,6),('a','attack',1.06,-10),('r','idle',1.01,-4),('h','happy',1.03,0))
def POSE_SET(fr):
    global POSE;POSE=fr
JOBS=[]
TYPES=list(PAL.keys())
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
def run():
    global SCALE
    setup()
    for name,kind,a in JOBS:
        if FILT and not any(f in name for f in FILT.split(',')):continue
        if not FORCE and os.path.exists(os.path.join(RAW,name+'_0.png')):continue
        if kind=='t':
            t,lv,br,pal,hero=a
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr)
                if kind=='t' and (pal or hero) and fr=='h':continue
                if hero and fr in('w','r'):continue
                tower(t,lv,br,ex,pal,hero);SCALE=LVS(lv) if not hero else 1.0;render(name+'_'+fr,sq,tl,0);SCALE=1.0
        elif kind=='f':
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr);fusion_tower(a[0],ex,a[1]);SCALE=0.9+0.05*a[1];render(name+'_'+fr,sq,tl,0);SCALE=1.0
        elif kind=='u':
            for fr,ex,sq,tl in FRAMES:
                POSE_SET(fr);ultimate_tower(a,ex);render(name+'_'+fr,sq,tl,0)
        elif kind=='e':
            for fr,ex,sq,tl,dz in(('0','idle',1.0,0,0),('1','idle',0.88,0,-0.08),('h','hurt',0.95,8,0),('d','dead',0.55,0,-0.3)):
                monster(a,ex);render(name+'_'+fr,sq,tl,dz)
        else:
            prop(a);prop2(a);render(name+'_0')
        if MZ:
            fn=os.path.join(RAW,'_mz.json');old=json.load(open(fn)) if os.path.exists(fn) else {};old.update(MZ);json.dump(old,open(fn,'w'));MZ.clear()
    print('ALL DONE')
if __name__=='__main__' or True:
    if 'norun' not in argv:run()
