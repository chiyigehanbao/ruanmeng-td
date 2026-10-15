# 软萌大作战 V1.0  © 2026 <著作权人>
# 绘制高清动漫Q版脸部贴图（系统 python3 + PIL）：python3 facetex.py out.png iris expr mouth blush sp size
# 贴图坐标：x ∈ [-60°,60°]（方位角），y ∈ [-35°,25°]（相对脸中心的仰角）
import sys,math
from PIL import Image,ImageDraw,ImageFilter,ImageChops
SS=2;W,H=1024*SS,512*SS
def P(x,y):return ((x+60)/120*W,(25-y)/60*H)
def hexc(h,a=255):h=h.lstrip('#');return tuple(int(h[i:i+2],16) for i in (0,2,4))+(a,)
def mix(c1,c2,t):return tuple(int(c1[i]*(1-t)+c2[i]*t) for i in range(3))+(255,)
INK=(42,22,34,255)
def layer():return Image.new('RGBA',(W,H),(0,0,0,0))
def ell(d,cx,cy,rx,ry,fill):d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=fill)
def grad_fill(img,mask,top,bot,y0,y1):
    g=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(g)
    for y in range(int(max(0,y0)),int(min(H,y1+1))):
        t=(y-y0)/max(1,(y1-y0));gd.line([(0,y),(W,y)],fill=mix(top,bot,min(1,max(0,t))))
    img.paste(g,(0,0),mask)
def thick(d,pts,w,fill):
    d.line(pts,fill=fill,width=int(w),joint='curve')
    for p in (pts[0],pts[-1]):ell(d,p[0],p[1],w/2,w/2,fill)
def arc_pts(cx,cy,rx,ry,a0,a1,n=40):return [(cx+rx*math.cos(math.radians(a0+(a1-a0)*i/n)),cy-ry*math.sin(math.radians(a0+(a1-a0)*i/n))) for i in range(n+1)]
def eye_open(img,cx,cy,hw,hh,iris,k,attack=False):
    d=ImageDraw.Draw(img);irc=hexc(iris)
    ell(d,cx,cy,hw,hh,INK)                                             # 外轮廓
    m=Image.new('L',(W,H),0);ImageDraw.Draw(m).ellipse([cx-hw*0.84,cy-hh*0.86,cx+hw*0.84,cy+hh*0.84],fill=255)
    grad_fill(img,m,mix(irc,(20,10,20),0.55),mix(irc,(255,255,255),0.28),cy-hh*0.86,cy+hh*0.84)   # 虹膜渐变
    m2=Image.new('L',(W,H),0);md=ImageDraw.Draw(m2);md.ellipse([cx-hw*0.72,cy-hh*0.2,cx+hw*0.72,cy+hh*0.78],fill=255);md.ellipse([cx-hw*0.72,cy-hh*0.42,cx+hw*0.72,cy+hh*0.5],fill=0)
    img.paste(Image.new('RGBA',(W,H),mix(irc,(255,255,255),0.55)),(0,0),m2.filter(ImageFilter.GaussianBlur(hw*0.06)))  # 下方亮色环
    d=ImageDraw.Draw(img);ell(d,cx,cy-hh*0.08,hw*0.42,hh*0.46,mix(irc,(15,5,15),0.75))            # 瞳孔
    # 上眼睑睫毛线（外侧上挑）
    lw=hh*0.2;pts=arc_pts(cx,cy+hh*0.04,hw*1.02,hh*1.0,158,22);thick(d,pts,lw,INK)
    o=pts[0] if k<0 else pts[-1]
    d.polygon([(o[0],o[1]-lw*0.5),(o[0]+k*hw*0.42,o[1]-hh*0.3),(o[0]+k*hw*0.08,o[1]+lw*0.55)],fill=INK)   # 外眼角睫毛上挑
    if attack:  # 坚定的眉毛
        thick(d,[(cx-k*hw*0.85,cy-hh*1.12),(cx+k*hw*0.85,cy-hh*1.42)],hh*0.17,INK)
    # 高光
    ell(d,cx-hw*0.32,cy-hh*0.38,hw*0.36,hh*0.3,(255,255,255,255))
    ell(d,cx+hw*0.36,cy+hh*0.36,hw*0.15,hh*0.12,(255,255,255,255))
    ell(d,cx+hw*0.05,cy-hh*0.62,hw*0.08,hh*0.065,(255,255,255,235))
def eye_happy(img,cx,cy,hw,hh,k):
    d=ImageDraw.Draw(img);pts=arc_pts(cx,cy+hh*0.35,hw*0.95,hh*0.75,10,170);thick(d,pts,hh*0.3,INK)
def eye_hurt(img,cx,cy,hw,hh,k):
    d=ImageDraw.Draw(img);s=-k  # 指向脸中心
    thick(d,[(cx-s*hw*0.75,cy-hh*0.6),(cx+s*hw*0.55,cy),(cx-s*hw*0.75,cy+hh*0.6)],hh*0.28,INK)
def eye_dead(img,cx,cy,hw,hh,k):
    d=ImageDraw.Draw(img);r=hw*0.7
    thick(d,[(cx-r,cy-r),(cx+r,cy+r)],hh*0.26,INK);thick(d,[(cx-r,cy+r),(cx+r,cy-r)],hh*0.26,INK)
def blush(img,cx,cy,rx,ry):
    b=layer();ImageDraw.Draw(b).ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=(255,140,170,170));b=b.filter(ImageFilter.GaussianBlur(ry*0.45))
    img.alpha_composite(b);d=ImageDraw.Draw(img)
    for i in(-1,0,1):thick(d,[(cx+i*rx*0.38-rx*0.08,cy+ry*0.28),(cx+i*rx*0.38+rx*0.1,cy-ry*0.28)],ry*0.14,(255,255,255,200))
def mouth(img,style,cx,cy,s):
    d=ImageDraw.Draw(img);u=W/120*s  # 每度像素
    red=(122,47,69,255);pink=(255,122,152,255)
    if style=='smile':thick(d,arc_pts(cx,cy-1.2*u,3.2*u,2.6*u,200,340),1.0*u,INK)
    elif style=='cat':
        for k in(-1,1):thick(d,arc_pts(cx+k*2.2*u,cy-0.6*u,2.2*u,1.9*u,190,350),0.9*u,INK)
    elif style=='open':
        d.chord([cx-4*u,cy-3.2*u,cx+4*u,cy+4.2*u],0,180,fill=red);d.line([(cx-4*u,cy+0.5*u),(cx+4*u,cy+0.5*u)],fill=red,width=int(1.2*u))
        m=Image.new('L',(W,H),0);ImageDraw.Draw(m).chord([cx-4*u,cy-3.2*u,cx+4*u,cy+4.2*u],0,180,fill=255)
        t=layer();ImageDraw.Draw(t).ellipse([cx-2.6*u,cy+1.6*u,cx+2.6*u,cy+5*u],fill=pink);img.paste(t,(0,0),ImageChops.multiply(m,t.split()[3]))
    elif style=='o':
        ImageDraw.Draw(img).ellipse([cx-2.4*u,cy-2.2*u,cx+2.4*u,cy+2.6*u],fill=red)
    elif style=='wavy':
        pts=[(cx+(i-10)/10*4*u,cy+math.sin(i/10*math.pi*2)*0.9*u) for i in range(21)];thick(d,pts,0.9*u,INK)
def sweat(img,cx,cy,u):
    d=ImageDraw.Draw(img);d.polygon([(cx,cy-3*u),(cx-1.6*u,cy+0.6*u),(cx+1.6*u,cy+0.6*u)],fill=(150,215,255,240));ell(d,cx,cy+0.8*u,1.65*u,1.65*u,(150,215,255,240));ell(d,cx-0.5*u,cy+0.6*u,0.5*u,0.6*u,(255,255,255,230))
def make(out,iris,expr,mstyle,bl,sp,size):
    img=layer();u=W/120;s=size
    hw=11*s*u;hh=14.5*s*u*(H/60)/(W/120)
    for k in(-1,1):
        cx,cy=P(k*sp,0)
        if expr=='happy':eye_happy(img,cx,cy,hw,hh,k)
        elif expr=='hurt':eye_hurt(img,cx,cy,hw,hh,k)
        elif expr=='dead':eye_dead(img,cx,cy,hw,hh,k)
        else:eye_open(img,cx,cy,hw,hh,iris,k,expr=='attack')
        if bl:bx,by=P(k*(sp+15),-13*s);blush(img,bx,by,8*s*u,4.2*s*u*(H/60)/(W/120))
    mx,my=P(0,-15.5*s)
    if expr in('hurt',):mouth(img,'o',mx,my,s);sweat(img,*P(sp+14,8),u*s)
    elif expr=='dead':mouth(img,'wavy',mx,my,s)
    elif expr in('attack',) and mstyle!='none':mouth(img,'open',mx,my,s)
    elif expr=='happy' and mstyle!='none':mouth(img,'open',mx,my,s)
    elif mstyle!='none':mouth(img,mstyle,mx,my,s)
    img.resize((W//SS,H//SS),Image.LANCZOS).save(out)
if __name__=='__main__':
    a=sys.argv[1:];make(a[0],a[1],a[2],a[3],a[4]=='1',float(a[5]),float(a[6]))
