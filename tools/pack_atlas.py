# 软萌大作战 V1.0  © 2026 <著作权人>
# 裁剪 + 缩放 + 打包图集：python3 tools/pack_atlas.py
from PIL import Image
import glob,os,json,subprocess,shutil
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');RAW=ROOT+'/'+os.environ.get('ART_SRC','art_v8')+'/';OUT=ROOT+'/assets/'
os.makedirs(OUT,exist_ok=True)
files=sorted(glob.glob(RAW+'*.png'))
groups={'tower':[f for f in files if os.path.basename(f)[:2] in('t_','s_','h_')],'fusion':[f for f in files if os.path.basename(f).startswith('f_')],'ult':[f for f in files if os.path.basename(f).startswith('u_')],'enemy':[f for f in files if os.path.basename(f).startswith('e_')],'prop':[f for f in files if os.path.basename(f).startswith('p_')]}
SIZE={'tower':168,'fusion':180,'ult':210,'enemy':136,'prop':72}
# 高清 UI 版（进化卡、扭蛋、图鉴、英雄界面等放大显示时使用），帧名前缀 U:
UI_SIZE={'tower':300,'fusion':300,'ult':340,'enemy':220}
UI_PICK=lambda n:(n[:2] in('t_','s_','h_','f_','u_') and n[-2:]=='_0') or (n.startswith('u_') and n.endswith('_h')) or (n.startswith('e_') and n.endswith('_0'))
def union(fs):
    bb=None
    for f in fs:
        b=Image.open(f).getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
        if not b:continue
        bb=b if bb is None else (min(bb[0],b[0]),min(bb[1],b[1]),max(bb[2],b[2]),max(bb[3],b[3]))
    return bb
sprites={};MZ=json.load(open(RAW+'_mz.json')) if os.path.exists(RAW+'_mz.json') else {};mzo={}
for g,fs in groups.items():
    if g=='prop':
        for f in fs:
            im=Image.open(f);b=im.getchannel('A').getbbox();im=im.crop(b);S=128 if 'castle' in f else SIZE[g];k=S/max(im.size);im=im.resize((max(1,round(im.width*k)),max(1,round(im.height*k))),Image.LANCZOS)
            sprites[os.path.basename(f)[:-4]]=(im,g)
        continue
    bb=union(fs);w=bb[2]-bb[0];h=bb[3]-bb[1];S=SIZE[g];k=S/max(w,h)
    for f in fs:
        im0=Image.open(f);src=im0.crop(bb);n=os.path.basename(f)[:-4]
        if n in MZ:mzo[n]=[[round((u*im0.width-bb[0])/w,3),round((v*im0.height-bb[1])/h,3)] for u,v in MZ[n]]
        sprites[n]=(src.resize((round(w*k),round(h*k)),Image.LANCZOS),g)
        if UI_PICK(n):ku=UI_SIZE[g]/max(w,h);sprites['U:'+n]=(src.resize((round(w*ku),round(h*ku)),Image.LANCZOS),g)
# 货架式打包
PAGE=2048;pages=[];meta={}
items=sorted(sprites.items(),key=lambda kv:-kv[1][0].height)
cur=Image.new('RGBA',(PAGE,PAGE),(0,0,0,0));x=y=rowh=0;pi=0
for name,(im,g) in items:
    if x+im.width+2>PAGE:x=0;y+=rowh+2;rowh=0
    if y+im.height+2>PAGE:pages.append(cur);cur=Image.new('RGBA',(PAGE,PAGE),(0,0,0,0));x=y=rowh=0;pi+=1
    cur.paste(im,(x,y));meta[name]=[pi,x,y,im.width,im.height,g];x+=im.width+2;rowh=max(rowh,im.height)
pages.append(cur)
for f in glob.glob(OUT+'atlas_*.png'):os.remove(f)
for i,p in enumerate(pages):
    bb=p.getbbox();p=p.crop((0,0,PAGE,bb[3]))
    fn=OUT+'atlas_%d.png'%i;p.save(fn,optimize=True)
    pq=shutil.which('pngquant') or os.path.expanduser('~/.local/bin/pngquant')
    if os.path.exists(pq):
        r=subprocess.run([pq,'--quality=55-95','--speed=1','--strip','--force','--output',fn,fn])
        if r.returncode!=0:subprocess.run([pq,'--quality=30-90','--speed=1','--strip','--force','--output',fn,fn])   # 噪点页回退
open(OUT+'atlas.js','w').write('// 自动生成：精灵图集索引 [页,x,y,w,h,类别]\nvar ATLAS={pages:%d,frames:%s,mz:%s};\n'%(len(pages),json.dumps(meta,separators=(',',':')),json.dumps(mzo,separators=(',',':'))))
tot=sum(os.path.getsize(f) for f in glob.glob(OUT+'atlas_*.png'))
print('sprites',len(meta),'pages',len(pages),'bytes',tot)
