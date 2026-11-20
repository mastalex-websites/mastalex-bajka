'use strict';
/* Mastalex — bajkowe hero, wersja 3: każdy element strony i każdy element scenerii ma zadanie.
   #scene  = świat pod tekstem (współrzędne hero): góry, chmury, wyspy, wzgórza, staw, chatka, postacie na ziemi.
   #actors = postacie nad stroną (współrzędne dokumentu), zakotwiczone do prawdziwych elementów HTML.
   Tekst strony zostaje prawdziwym tekstem (SEO); postacie tylko go noszą, piszą, odsłaniają i pilnują. */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,AMB=0;
const BGN='img/tlo-bajka-noc.webp',BG='img/tlo-bajka-szew.webp',BGW=1586,BGH=992,LAK='img/tlo-laka-dol.webp',LAKH=516,LTOP=4,GROUND='#63881e'; /* malowane tło świata zamiast rysowanej sceny */ /* tło stoi: rusza się tylko to, co dotyczy przycisków i tekstu */
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const hero=q('#hero'),S=q('#scene'),root=q('#root'),AS=q('#actors');
const nav=q('#nav'),navLinks=qa('#nav a'),brand=q('#brand'),ctaHead=q('#ctaHead'),menuBtn=q('.menu');
const eyebrow=q('#eyebrow'),h1l1=q('#h1l1'),words=qa('#h1l1 .w'),price=q('#price'),em=q('#em'),scrollEl=q('#scroll'),lead=q('#lead');
const cards=qa('.card'),cardH3=qa('.card h3'),allPrice=q('#allPrice');
const serp=q('#serp'),sq=q('#sq'),sRes=qa('.sres'),sMe=q('#sMe'),sBadge=q('#sBadge'),seoWhat=q('#seoWhat'),seoAudit=q('#seoAudit');
const ctaMain=q('#ctaMain'),ctaPrice=q('#ctaPrice'),chips=qa('.chip'),lever=q('#lever'),curtain=q('.curtain'),h2=q('.next h2');
const OUTL=3.2,QUERY='remont łazienki kraków',SPK=['#fff6b0','#ffd23f','#ffc6e0','#c9f7ff'];
const QUOTES=['PROJEKT W 3 DNI','PROJEKT BEZPŁATNIE','WYCENA BEZ ZOBOWIĄZAŃ'];
const DAY=['#78c2ff','#b9e2ff','#fff0f6'],NIGHT=['#120c33','#2b2068','#5f45a3'];
const ORDER=['sky','stars','mtnFar','mtnNear','cloudsFar','islands','cloudsNear','birds','backhill','back','fronthill','front','flowers','rain','night','orb','glow','fx'];
const PAR={stars:3,mtnFar:8,mtnNear:12,cloudsFar:14,islands:18,cloudsNear:22,birds:14,orb:5};
const ALAY=['ropes','birds','lid','dragon','mascot','lev','nowe','svc','seo','more','fx'];

let W=0,H=0,HX=0,HY=0,DW=0,U=1,wide=true,T=0,last=0,ready=false,introT=1e9,nT=0,n=0,nPrev=-1,running=false,busyUntil=0;
const P={x:-9999,y:-9999,inside:false,sx:0,sy:0,lastDust:0,lastRip:0,lastSnow:0},PD={x:-9999,y:-9999};
const F={nav:false,brand:false,hdr:false,eb:false,cta:false,chest:false,read:false,em:false};
let G={},A={},L={},K={},RC={};const FX=[];
let seed=7;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const gg=(p,a)=>E('g',a||{},p),f1=v=>(+v).toFixed(1);
const setsw=(el,px)=>{el.style.setProperty('--sw',px.toFixed(3)+'px');return el;};
const q2=(a,c,b,t)=>(1-t)*(1-t)*a+2*t*(1-t)*c+t*t*b;
const tl=(el,x,y)=>el.setAttribute('transform',`translate(${f1(x)} ${f1(y)})`);
const noHit=el=>{el.style.pointerEvents='none';return el;};
const op=(el,v)=>el.setAttribute('opacity',typeof v==='number'?clamp(v).toFixed(3):v);
const hideEl=(o,k)=>{const v=o&&o[k];if(v&&v.setAttribute)v.setAttribute('opacity',0);else if(v&&v.g&&v.g.setAttribute)v.g.setAttribute('opacity',0);};
const hitsAny=(boxes,TR)=>boxes.some(b=>TR.some(r=>b.l<r.r&&b.r>r.l&&b.t<r.b&&b.b>r.t));
function addFX(g,life,upd,t0,keep){const f={g,t0:t0===undefined?T:t0,life,upd,keep};FX.push(f);return f;}
function killFX(f){if(!f)return;f.g.remove();const i=FX.indexOf(f);if(i>=0)FX.splice(i,1);}
function onHit(el,fn){el.classList.add('hit');el.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();fn(e);});}
function retrig(el,cls){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
function fRect(el){const r=el.getBoundingClientRect();return {l:r.left+scrollX,t:r.top,r:r.right+scrollX,b:r.bottom,w:r.width,h:r.height,cx:r.left+scrollX+r.width/2,cy:r.top+r.height/2};}
function dRect(el){const r=el.getBoundingClientRect(),x=scrollX,y=scrollY;return {l:r.left+x,t:r.top+y,r:r.right+x,b:r.bottom+y,w:r.width,h:r.height,cx:r.left+x+r.width/2,cy:r.top+y+r.height/2};}
const shown=el=>!!el&&el.getClientRects().length>0&&getComputedStyle(el).display!=='none';
function lineRects(el){const rg=document.createRange();rg.selectNodeContents(el);return [...rg.getClientRects()].filter(r=>r.width>2).map(r=>({l:r.left+scrollX,t:r.top+scrollY,r:r.right+scrollX,b:r.bottom+scrollY,w:r.width,h:r.height,cx:r.left+scrollX+r.width/2,cy:r.top+scrollY+r.height/2}));}

/* ================= efekty ================= */
function fxBurst(p,x,y,txt,fill,s,life){const o=noHit(gg(p));const inner=gg(o);burst(inner,txt,80,fill||'#fff6b0',OUT);setsw(inner,OUTL/s);const Lf=life||1.05;
  return addFX(o,Lf,(u,a)=>{place(o,x,y-a*12,Math.max(.001,s*popS(a,0,Lf-.2)),-8+a*5);});}
function bubbleShape(p,txt,size,dir){const tmp=E('text',{'font-family':'Impact','font-size':size,'letter-spacing':1},p);tmp.textContent=txt;const tw=tmp.getComputedTextLength();tmp.remove();
  const w=tw+size*1.1,h=size*1.5,x0=dir>0?22:-22-w;
  blob(p,[['rect',{x:x0,y:-h/2,width:w,height:h,rx:h/2}],['path',{d:`M 0 0 L ${dir*34} ${f1(-h*.32)} L ${dir*34} ${f1(h*.18)} Z`}]],'#ffffff');
  const t=E('text',{x:f1(x0+w/2),y:f1(size*.36),'text-anchor':'middle','font-family':'Impact','font-size':size,fill:OUT,'letter-spacing':1},p);t.textContent=txt;return w+22;}
function say(p,x,y,txt,s,dir,life,bw){const o=noHit(gg(p));let inner=gg(o);const w=bubbleShape(inner,txt,36,dir);
  if(dir>0&&x+w*s>bw-6){inner.remove();inner=gg(o);bubbleShape(inner,txt,36,-1);}
  else if(dir<0&&x-w*s<6){inner.remove();inner=gg(o);bubbleShape(inner,txt,36,1);}
  setsw(inner,OUTL/s);const Lf=life||2.3;return addFX(o,Lf,(u,a)=>{place(o,x,y,Math.max(.001,s*popS(a,0,Lf-.2)),0);});}
const bubS=()=>Math.max(.4,.5*U),bubA=()=>Math.max(.36,.46*U);
function sparkles(p,x,y,nn,s,cols){cols=cols||SPK;for(let i=0;i<nn;i++){const o=noHit(gg(p));const sp=spark(o);sp.setAttribute('fill',cols[i%cols.length]);
  const a=i/nn*Math.PI*2+R()*.4,v=(60+R()*70)*s,sc=(.2+R()*.16)*s;setsw(o,1.8/sc);const r0=R()*90;
  addFX(o,.8,(u,t)=>{place(o,x+Math.cos(a)*v*t,y+Math.sin(a)*v*t+30*t*t,Math.max(.001,sc*(1-u*.8)),r0+t*200);op(o,1-u*u);});}}
function trail(p,x,y,sz){const o=noHit(gg(p));const sp=spark(o);sp.setAttribute('fill',SPK[(R()*4)|0]);const s=sz*(.8+R()*.5);setsw(o,1.6/s);
  const vx=(R()-.5)*40,vy=20+R()*30,r0=R()*90;addFX(o,.8,(u,a)=>{place(o,x+vx*a,y+vy*a,Math.max(.001,s*(1-u*.9)),r0+a*180);op(o,1-u*u);});}
function confetti(x,y,nn){const cols=['#ff6b8f','#ffd23f','#7cf2c8','#c9b6ff','#6fd36b','#9fe7ff'];for(let i=0;i<nn;i++){const o=noHit(gg(L.fx));
  E('rect',{x:-6,y:-3.5,width:12,height:7,rx:2,fill:cols[i%cols.length],stroke:OUT,'stroke-width':1.4},o);
  const a=-Math.PI/2+(R()-.5)*2.4,v=(260+R()*300)*Math.max(U,.7),r0=R()*360,vr=(R()-.5)*900,ph=R()*6;
  addFX(o,1.7,(u,t)=>{place(o,x+Math.cos(a)*v*t,y+Math.sin(a)*v*t+520*t*t,1,r0+vr*t,Math.cos(t*10+ph));op(o,1-u*u);});}}
function coin(p){const g=gg(p);E('circle',{r:20,fill:'#ffd23f',class:'o'},g);E('circle',{r:12,fill:'none',stroke:'#e8b64a','stroke-width':5},g);
  E('path',{d:'M -9 -9 q 5 -5 11 -3',fill:'none',stroke:'#fff','stroke-width':5,'stroke-linecap':'round'},g);return g;}
function coinArc(x0,y0,x1,y1,delay,onLand){const o=noHit(gg(L.fx));const inn=gg(o);coin(inn);const s=Math.max(.3,.38*U);setsw(inn,OUTL/s);op(o,0);
  const pk=Math.min(y0,y1)-110*Math.max(U,.6);let landed=false;
  addFX(o,.85,(u,a)=>{if(a<0){op(o,0);return;}op(o,u>.9?(1-u)*10:1);place(o,lerp(x0,x1,u),q2(y0,pk,y1,u),s,a*720,s*Math.abs(Math.cos(a*9))+.05*s);
    if(u>.88&&!landed){landed=true;if(onLand)onLand();}},T+delay);}
function flower(p,x,y,s,col){const o=gg(p);E('path',{d:`M ${f1(x)} ${f1(y)} l 0 ${f1(14*s)}`,class:'ln'},o);for(let k=0;k<5;k++){const a=k/5*Math.PI*2;E('circle',{cx:f1(x+Math.cos(a)*6*s),cy:f1(y+Math.sin(a)*6*s),r:f1(5*s),fill:col,class:'o2'},o);}E('circle',{cx:f1(x),cy:f1(y),r:f1(4*s),fill:'#ffd23f',class:'o2'},o);return o;}

/* ================= pomiar strony ================= */
function measure(){AS.style.height='0px';document.documentElement.classList.add('msr');hero.classList.add('measure');hero.classList.remove('nav-open');AS.classList.remove('dim');
  const sr=S.getBoundingClientRect();W=Math.round(sr.width);H=Math.round(sr.height);HX=sr.left+scrollX;HY=sr.top+scrollY;DW=document.documentElement.clientWidth;
  const ws=words.map(dRect),lines=[];
  ws.forEach((r,i)=>{let ln=lines.find(l=>Math.abs(l.cy-r.cy)<r.h*.5);if(!ln){ln={l:r.l,r:r.r,t:r.t,b:r.b,cy:r.cy,w:[]};lines.push(ln);}
    ln.l=Math.min(ln.l,r.l);ln.r=Math.max(ln.r,r.r);ln.t=Math.min(ln.t,r.t);ln.b=Math.max(ln.b,r.b);ln.w.push(i);});
  lines.forEach(l=>{l.cy=(l.t+l.b)/2;l.w2=l.r-l.l;});
  RC={nav:DW>1180&&shown(nav)?fRect(nav):null,brand:fRect(brand),ctaHead:shown(ctaHead)?fRect(ctaHead):null,menu:shown(menuBtn)?fRect(menuBtn):null,
    eyebrow:dRect(eyebrow),words:ws,lines,price:dRect(price),em:lineRects(em),emBox:dRect(em),scroll:dRect(scrollEl),
    cta:dRect(ctaMain),chest:dRect(ctaPrice),chips:chips.map(dRect),lever:dRect(lever),h2:dRect(h2),h2l:lineRects(h2),cards:cards.map(dRect),allPrice:lineRects(allPrice),serp:dRect(serp),sres:sRes.map(dRect),
    steps:qa('.step').map(dRect),motto:dRect(q('.motto-box')),people:qa('.person').map(dRect),faq:dRect(q('.faq-box')),ksend:dRect(q('.ksend'))};
  hero.classList.remove('measure');document.documentElement.classList.remove('msr');AS.style.height=document.documentElement.scrollHeight+'px';
  U=Math.max(.42,Math.min(1.2,Math.min(W/1440,H/900)));wide=W>=1000;}

/* ================= świat (scena pod tekstem) ================= */
function sideF(x){const dl=A.e0-x,dr=x-A.e1,d=Math.max(dl,dr),zone=dl>dr?A.e0:W-A.e1;return ease.ioS(clamp((d+60)/Math.max(80,zone*.62)));}
function backY(x){if(!wide)return A.backFlat+Math.sin(x*.02+1)*6*U;const f=sideF(x),top=x<W/2?H*.6:H*.62;return lerp(A.floor+Math.sin(x*.01)*5*U,top,f)+Math.sin(x*.014)*7*U*f;}
function frontY(x){if(!wide)return A.frontFlat+Math.sin(x*.024+2)*6*U;const f=sideF(x+(x<W/2?-40:40)),top=x<W/2?H*.81:H*.8;return lerp(H+40,top,f)+Math.sin(x*.02+1)*5*U*f;}
const groundTop=x=>Math.min(backY(x),frontY(x));
function peak(p,x,base,w,h,fill,snow){const C1=[x-w*.16,base-h*.58],C2=[x+w*.16,base-h*.58],L0=[x-w/2,base],R0=[x+w/2,base],A0=[x,base-h];
  const f=v=>f1(v[0])+' '+f1(v[1]);E('path',{d:`M ${f(L0)} Q ${f(C1)} ${f(A0)} Q ${f(C2)} ${f(R0)} Z`,fill,class:'o'},p);
  if(!snow)return;const t=.66,Lp=[q2(L0[0],C1[0],A0[0],t),q2(L0[1],C1[1],A0[1],t)],Rp=[2*x-Lp[0],Lp[1]],Cl=[lerp(C1[0],A0[0],t),lerp(C1[1],A0[1],t)],Cr=[2*x-Cl[0],Cl[1]],z=h*.07;
  E('path',{d:`M ${f(Lp)} Q ${f(Cl)} ${f(A0)} Q ${f(Cr)} ${f(Rp)} L ${f([x+w*.06,Lp[1]+z])} L ${f([x+w*.015,Lp[1]-z*.2])} L ${f([x-w*.035,Lp[1]+z*1.1])} Z`,fill:snow,class:'o2'},p);
  A.peaks.push({x,y:base-h,w});}
function buildMountains(){A.peaks=[];const far=[[.03,.44,.36],[.2,.3,.3],[.38,.22,.3],[.57,.26,.3],[.75,.36,.32],[.95,.48,.38]],nr=[[.1,.24,.3],[.3,.15,.26],[.68,.18,.3],[.88,.25,.32]];
  const base=wide?A.floor+24:A.backFlat+16,hh=wide?H:Math.min(H,base*1.05);setsw(G.mtnFar,OUTL);setsw(G.mtnNear,OUTL);
  far.sort((a,b)=>b[1]-a[1]).forEach(([x,h,w])=>peak(G.mtnFar,x*W,base,Math.max(w*W,h*hh),h*hh,'#cdbff4','#ffffff'));
  nr.sort((a,b)=>b[1]-a[1]).forEach(([x,h,w])=>peak(G.mtnNear,x*W,base+H*.02,Math.max(w*W,h*hh*1.1),h*hh,'#a796e6',h>.2?'#f4efff':null));}
/* świat pod hero: pas kafli (img/swiat/swiat.js) w tej samej skali i przesunięciu co obraz hero; wąsko pas telefonu (wycinek x0..x0+w) */
let worldKey='';
function buildWorld(sc,ix){const wb=q('#wbg'),wo=q('#world'),SW=window.SWIAT;if(!wb||!SW)return;
  /* pas telefonu (wąski kadr 460 px obrazu) tylko gdy naprawdę pokrywa całą szerokość; inaczej pełny pas – zawsze pokrywa */
  const mx=SW.m?ix+SW.m.x0*sc:0,mob=W<700&&!!SW.m&&mx<=.5&&mx+SW.m.w*sc>=W-.5,set=mob?SW.m:SW.d,nset=mob?SW.mn:SW.dn,key=[mob,f1(sc),f1(ix)].join();if(key===worldKey)return;worldKey=key;wb.textContent='';
  const y0=2-LTOP*sc,x=ix+set.x0*sc,w=set.w*sc;
  const lay=(t,cls)=>{let y=y0;t.tiles.forEach(([src,h],i)=>{const im=document.createElement('img');im.alt='';im.decoding='async';if(i>1)im.loading='lazy';if(cls)im.className=cls;im.src=src;
    im.style.cssText=`left:${f1(x)}px;top:${f1(y)}px;width:${f1(w)}px;height:${f1(h*sc+1)}px`;wb.appendChild(im);y+=h*sc;});return y;};
  const end=lay(set,''),hasN=!!(nset&&nset.tiles.length);if(hasN)lay(nset,'n');wo.classList.toggle('nonight',!hasN);
  /* kolor pod końcem pasa: osobno dzień i noc (górne 8 px bez koloru – inaczej przebija na ułamkowym pikselu szwu) */
  wo.style.setProperty('--wbg',set.bot);if(hasN)wo.style.setProperty('--wbgn',nset.bot);const fh=90*sc;
  [[set,end,''],hasN?[nset,y0+nset.tiles.reduce((s,t)=>s+t[1],0)*sc,'n']:null].forEach(z=>{if(!z)return;const fd=document.createElement('div');fd.className='fade '+z[2];
    fd.style.cssText=`top:${f1(z[1]-fh)}px;height:${f1(fh)}px;background:linear-gradient(rgba(0,0,0,0),${z[0].bot})`;wb.appendChild(fd);});}
/* obraz tła: „cover” przyklejony do dołu, jak tło CSS; mp() przelicza piksel obrazu na współrzędne sceny */
function buildBg(){const sc=Math.max(W/BGW,H/BGH),iw=BGW*sc,ih=BGH*sc,iy=H-ih,
  /* wąsko: kadr na prawą część obrazu (czyste niebo nad tekstem, na dole chatka, domek i turysta) */
  ix=W<700?clamp(W/2-1245*sc,W-iw,0):(W-iw)/2,mp=(x,y)=>[ix+x*sc,iy+y*sc];
  E('image',{href:BG,x:f1(ix),y:f1(iy),width:f1(iw),height:f1(ih),preserveAspectRatio:'none'},G.sky);A.bg={sc,ix,iy,mp};A.houses=[];
  /* wersja nocna (wygenerowana, dopasowana co do piksela do dziennej): przenikanie zamiast przyciemniania */
  A.bgN=E('image',{href:BGN,x:f1(ix),y:f1(iy),width:f1(iw),height:f1(ih),preserveAspectRatio:'none',opacity:f1(A.u||0)},G.sky);
  /* sekcja pod hero: dolna połowa łąki, ta sama skala i przesunięcie, zaczyna się dokładnie tam, gdzie kończy się obraz hero */
  /* plik łąki ma 4 wiersze zapasu nad szwem, a sekcja wchodzi 2 px pod hero: te same piksele po obu stronach, bez jasnej kreski */
  buildWorld(sc,ix);
  const ct=mp(150,40);if(ct[0]>30&&ct[0]<W-30&&ct[1]>0)A.castleTop=ct; /* wieża zamku na lewej wyspie obrazu */
  const isl=[[0,0,345,380],[1380,60,1575,310],[1265,280,1575,370]];A.stars=[];const ns=Math.min(60,Math.round(W*H/18000));
  for(let i=0,k=0;i<ns&&k<ns*6;k++){const x=R()*BGW,y=20+R()*400;if(isl.some(b=>x>b[0]&&x<b[2]&&y>b[1]&&y<b[3]))continue;const [sx,sy]=mp(x,y);if(sx<6||sx>W-6||sy<6)continue;
    const o=gg(G.stars);spark(o);const s=(.14+R()*.2)*Math.max(U,.6);setsw(o,2.2/s);place(o,sx,sy,s,R()*40);A.stars.push({g:o,ph:R()*6});i++;}op(G.stars,0);}
function buildStars(){A.stars=[];const ns=Math.min(70,Math.round(W*H/16000));for(let i=0;i<ns;i++){const o=gg(G.stars);spark(o);const s=(.14+R()*.2)*Math.max(U,.6);setsw(o,2.2/s);place(o,R()*W,R()*H*.7,s,R()*40);A.stars.push({g:o,ph:R()*6});}op(G.stars,0);}
function buildClouds(avoid){A.clouds=[];const M=wide?1:1.4,boxes=avoid.slice(),yMax=wide?H*.55:A.backFlat-170*A.cs;
  const spot=sc=>{for(let k=0;k<80;k++){const x=R()*W,y=H*.05+R()*(yMax-H*.05);const b={l:x-195*sc,r:x+195*sc,t:y-118*sc,b:y+48*sc};
      if(b.l<-30||b.r>W+30||b.b>backY(x)-150*A.cs)continue;if(!hitsAny([b],boxes)){boxes.push(b);return {x,y};}}return null;};
  for(let i=0;i<5;i++){const soft=i<2,sc=(soft?.5+R()*.3:.3+R()*.16)*U*M,p=spot(sc);if(!p)continue;
    const o=gg(soft?G.cloudsFar:G.cloudsNear);if(soft)cloudSoft(o,0,0,1,.7,'#ffffff');else{const inn=gg(o);cloud(inn,0,0,1,'#ffffff',i+2);setsw(inn,OUTL/sc);}
    A.clouds.push({g:o,x:p.x,y:p.y,s:sc});}}
function placeIsl(side,TR,chK,topW,yBot){const sizes=[250,225,200,178,156,136,118].map(v=>v*U);
  for(const lw of sizes){const ch=lw*chK,lx=side<0?lw*.5+W*.012:W-lw*.5-W*.012;
    for(let ly=Math.max(H*.1+ch,80);ly+lw*.62<=yBot;ly+=8){const bx=[{l:lx-lw*topW,r:lx+lw*topW,t:ly-ch,b:ly},{l:lx-lw*.5,r:lx+lw*.5,t:ly-lw*.1,b:ly+lw*.62}];
      if(!hitsAny(bx,TR))return {lx,ly,lw,bx};}}
  const lw=sizes[sizes.length-1];return {lx:side<0?lw*.55:W-lw*.55,ly:Math.min(H*.42,yBot-lw*.62),lw,bx:[]};}
function buildIslands(TR){let PL,PR;
  if(wide){const yb=H*.6-175*A.cs;PL=placeIsl(-1,TR,.56,.38,yb);TR=TR.concat(PL.bx);PR=placeIsl(1,TR,1.12,.2,yb);}
  else{const avail=A.backFlat-A.bandTop-150*A.cs;const lw1=clamp(avail/1.22,70,170*U),lw2=clamp(avail/1.75,60,150*U);
    PL={lx:W*.2,ly:A.bandTop+8+lw1*.56,lw:lw1};PR={lx:W*.8,ly:A.bandTop+8+lw2*1.12,lw:lw2};}
  const lx=PL.lx,ly=PL.ly,lw=PL.lw;const li=gg(G.islands);setsw(li,OUTL);island(li,lx,ly,lw,lw*.62,'#7fdc7a','#9d92c9');
  const cg=gg(li);A.castle=castle(cg);const b=cg.getBBox(),cs=lw*.74/b.width;cg.setAttribute('transform',`translate(${f1(lx-(b.x+b.width/2)*cs)} ${f1(ly+4*U-(b.y+b.height)*cs)}) scale(${cs.toFixed(4)})`);setsw(cg,OUTL/cs);
  A.castleTop=[lx,ly-b.height*cs];
  const rs=PR.lw/640,ri=gg(G.islands);setsw(ri,OUTL);const beam=gg(ri);const tw=mTower(ri,PR.lx,PR.ly,rs);setsw(tw.logo,OUTL/(1.5*rs));A.tw=tw;
  tl(beam,tw.lx,tw.ly);const br=gg(beam);for(const a of [0,180])E('path',{d:`M 0 0 L ${f1(560*rs)} ${f1(-70*rs)} Q ${f1(600*rs)} 0 ${f1(560*rs)} ${f1(70*rs)} Z`,fill:'#fff6b0',opacity:.55,transform:`rotate(${a})`},br);
  A.beam={g:beam,r:br,v:0};op(beam,0);
  A.isl=[{g:li,ph:0},{g:ri,ph:1.9}];A.islBoxes=[{l:lx-lw*.52-14,r:lx+lw*.52+14,t:ly-lw*.62-14,b:ly+lw*.64+14},{l:PR.lx-PR.lw*.52-14,r:PR.lx+PR.lw*.52+14,t:PR.ly-PR.lw*1.18-14,b:PR.ly+PR.lw*.64+14}];
  A.tglow=E('circle',{cx:f1(tw.lx),cy:f1(tw.ly),r:f1(260*rs),fill:'url(#hGlowP)',opacity:0},G.glow);}
function ringBell(){A.bellT=T;const pr=A.par.islands||[0,0];fxBurst(L.fx,HX+A.castleTop[0]+pr[0]+40*U,HY+A.castleTop[1]+pr[1]+46*U,'BIM-BAM!','#ffd23f',Math.max(.5,.62*U),1.9);}
function hillPath(p,fn,fill){let d=`M -80 ${H+80}`;for(let x=-80;x<=W+80;x+=10)d+=` L ${x} ${f1(fn(x))}`;E('path',{d:d+` L ${W+80} ${H+80} Z`,fill,class:'o'},p);}
function buildTree(x,y,s,col){const g=gg(G.back);tree(g,0,0,s,col);place(g,x,y,1);A.trees.push({g,x,y,s});}
function buildHouse(x,y,s,wall,roof){const g=gg(G.back);house(g,0,0,s,wall,roof);place(g,x,y,1);
  const win=E('rect',{x:f1(-18*s),y:f1(-60*s),width:f1(36*s),height:f1(36*s),rx:f1(6*s),fill:'#ffd23f',class:'o2'},g);
  E('path',{d:`M 0 ${f1(-60*s)} L 0 ${f1(-24*s)} M ${f1(-18*s)} ${f1(-42*s)} L ${f1(18*s)} ${f1(-42*s)}`,class:'ln'},g);
  const glow=E('circle',{cx:f1(x),cy:f1(y-42*s),r:f1(85*s),fill:'url(#hGlow)',opacity:0},G.glow);
  A.houses.push({g,win,glow});}
function buildBack(){const sb=gg(G.backhill);setsw(sb,OUTL);hillPath(sb,backY,'#8fe08a');
  const ts=.5*A.cs*(wide?1:.8),hs=.45*A.cs*(wide?1:.8);A.trees=[];A.houses=[];
  A.POS.trees.forEach((fx,i)=>buildTree(fx,backY(fx)+6*U,ts*(i%2?.85:1.05),i%2?'#4fbf6a':'#5fcf7a'));
  A.POS.houses.forEach((fx,i)=>buildHouse(fx,backY(fx)+8*U,hs,i?'#ffe9c7':'#fff3d6',i?'#ff8f6b':'#8a7cf0'));
  // staw z Syrenką
  const px=A.POS.pond,py=backY(px)+14*U,prx=70*A.cs*(wide?1:.85),pry=16*A.cs;
  const pond=E('ellipse',{cx:f1(px),cy:f1(py),rx:f1(prx),ry:f1(pry),fill:'#6cc8ff',class:'o'},sb);E('ellipse',{cx:f1(px-prx*.2),cy:f1(py-pry*.25),rx:f1(prx*.5),ry:f1(pry*.35),fill:'#a8e2ff'},sb);
  A.rip=gg(sb);
  const defs=S.querySelector('defs');let cp=document.getElementById('syClip3');if(!cp)cp=E('clipPath',{id:'syClip3'},defs);cp.textContent='';
  E('rect',{x:f1(px-prx*2),y:f1(py-600*U),width:f1(prx*4),height:f1(600*U+2)},cp);
  const wrap=gg(G.back,{'clip-path':'url(#syClip3)'});const SY=syrenka(wrap);const ss=.17*A.cs;setsw(SY.g,OUTL/ss);
  ['phone','bub','keys','ec','mo'].forEach(k=>hideEl(SY,k));
  A.sy={S:SY,x:px,y:py+6*U,s:ss};
  // chatka na kurzej stopce (Przebudowa)
  qa('#hutClip3').forEach(e=>e.remove());const hx=A.POS.hut,hs2=.17*A.cs,H2=chatka(G.back,defs,'hutClip3');setsw(H2.g,OUTL/hs2);
  H2.patches.forEach(p=>p.o0=p.getAttribute('transform')||'');A.hut={H:H2,x:hx,y:backY(hx)+4*U,s:hs2};
  // Lajkonik (Tworzenie stron)
  const LJ=lajkonik(G.back);const ls=.14*A.cs;setsw(LJ.g,OUTL/ls);A.lj={S:LJ,s:ls,home:A.POS.laj};}
function buildFront(){const fh=gg(G.fronthill);setsw(fh,OUTL);hillPath(fh,frontY,'#6fd36b');A.flw=[];
  for(let i=0;i<16;i++){const x=R()*W,y=frontY(x)+(8+R()*24)*U;if(y<H)E('path',{d:`M ${f1(x-8)} ${f1(y)} l 4 -11 l 4 11 l 4 -8 l 3 8`,class:'ln'},fh);}
  [.04,.13,.22,.78,.88,.97].forEach((fx,i)=>{const x=fx*W,y=frontY(x)+(14+i%3*10)*U;if(y<H-6)flower(fh,x,y,Math.max(U,.6),['#ff9ab8','#ffd23f','#c9b6ff'][i%3]);});
  // detektyw z lupą (Audyt SEO)
  const dx=A.POS.det,ds=.25*A.cs;const PE=person(G.front,{shirt:'#b5804f',cap:'#5b4632',hair:'#3b2f22',pants:'#4b3a6b'});setsw(PE.g,OUTL/ds);
  const mg=gg(PE.g);E('path',{d:'M 0 0 L 0 70',stroke:OUT,'stroke-width':22,'stroke-linecap':'round'},mg);E('path',{d:'M 0 0 L 0 70',stroke:'#8a5a3c','stroke-width':12,'stroke-linecap':'round'},mg);
  E('circle',{cx:0,cy:-44,r:44,fill:'#c9f7ff',opacity:.75,class:'o'},mg);E('circle',{cx:0,cy:-44,r:44,fill:'none',stroke:'#ffd23f','stroke-width':10},mg);E('path',{d:'M -22 -62 q 10 -12 24 -10',fill:'none',stroke:'#fff','stroke-width':7,'stroke-linecap':'round'},mg);
  A.det={P:PE,mg,x:dx,y:frontY(dx)+4*U,s:ds};
  // turysta z telefonem (wyszukiwanie)
  const tx=A.POS.tour,ts=.11*A.cs;const TU=tourist(G.front);setsw(TU.g,OUTL/ts);TU.map.setAttribute('opacity',0);TU.mouthO.setAttribute('opacity',0);
  A.tu={S:TU,x:tx,y:frontY(tx)+4*U-251*ts,s:ts};}
function buildOrb(TR){const os=.6*Math.max(U,.55)*(wide?1:.85),rO=78*os;let ox=W*.5,oy=rO+8,found=false;
  if(wide){search:for(let y=rO+10;y<H*.42;y+=6)for(const side of [1,-1])for(let k=0;k<W*.5-rO;k+=8){const x=side>0?W-rO-W*.03-k:rO+W*.03+k;
      if(!hitsAny([{l:x-rO-6,r:x+rO+6,t:y-rO-6,b:y+rO+6}],TR)){ox=x;oy=y;found=true;break search;}}}
  if(!found){ox=W*.5;oy=A.bandTop?A.bandTop+rO+10:rO+10;}
  const sun=gg(G.orb),sin=gg(sun);setsw(sin,OUTL/os);const rays=gg(sin);
  for(let i=0;i<12;i++)E('rect',{x:-8,y:-98,width:16,height:30,rx:8,fill:'#ffd23f',class:'o2',transform:`rotate(${i*30})`},rays);
  E('circle',{r:58,fill:'#ffd23f',class:'o'},sin);E('circle',{cx:-34,cy:16,r:8,fill:'#ff9ab8',opacity:.85},sin);E('circle',{cx:34,cy:16,r:8,fill:'#ff9ab8',opacity:.85},sin);
  const eyes=[];for(const s of [-1,1]){E('ellipse',{cx:s*20,cy:-12,rx:12,ry:14,fill:'#fff',class:'o2'},sin);eyes.push(E('circle',{cx:s*20,cy:-10,r:6,fill:OUT},sin));}
  E('path',{d:'M -16 18 q 16 16 32 0',class:'ln'},sin);
  const moon=gg(G.orb),min=gg(moon);setsw(min,OUTL/os);E('circle',{r:56,fill:'#fff3b0',class:'o'},min);
  E('circle',{cx:-24,cy:-26,r:9,fill:'#f2df8c'},min);E('circle',{cx:28,cy:22,r:6,fill:'#f2df8c'},min);E('circle',{cx:-32,cy:14,r:8,fill:'#ff9ab8',opacity:.8},min);E('circle',{cx:30,cy:-4,r:7,fill:'#ff9ab8',opacity:.8},min);
  E('path',{d:'M -30 -2 q 9 9 18 0 M 8 -8 q 9 9 18 0 M -12 18 q 12 12 24 0',class:'ln'},min);
  A.orb={x:ox,y:oy,s:os,d:H*.24,sun,moon,rays,eyes};A.orbBox={l:ox-rO-12,r:ox+rO+12,t:oy-rO-12,b:oy+rO+12};}
function buildValance(){const v=curtain&&curtain.isConnected&&curtain.querySelector('.valance');if(!v)return;v.setAttribute('viewBox',`0 0 ${W} 110`);
  const nn=Math.max(4,Math.round(W/120)),w=W/nn;let d=`M -10 -10 L ${W+10} -10 L ${W+10} 58`,trim='',tas='';
  for(let i=nn;i>0;i--){const x1=i*w,x0=(i-1)*w;d+=` L ${f1(x1)} 58 Q ${f1((x0+x1)/2)} 104 ${f1(x0)} 58`;trim+=`M ${f1(x0+8)} 50 Q ${f1((x0+x1)/2)} 90 ${f1(x1-8)} 50 `;tas+=`<circle cx="${f1(x0)}" cy="62" r="8" fill="#ffd23f" stroke="#1c1336" stroke-width="2.5"/>`;}
  v.innerHTML=`<path d="${d} L -10 58 Z" fill="#c21a33" stroke="#1c1336" stroke-width="3"/><path d="M 0 22 L ${W} 22" stroke="#e8b64a" stroke-width="8"/><path d="${trim}" fill="none" stroke="#e8b64a" stroke-width="6" stroke-linecap="round"/>${tas}`;}

function buildScene(){S.setAttribute('viewBox',`0 0 ${W} ${H}`);root.textContent='';G={};A={};seed=7;
  ORDER.forEach(k=>G[k]=gg(root));['night','glow','fx','rain','flowers'].forEach(k=>noHit(G[k]));
  E('rect',{x:-200,y:-200,width:W+400,height:H+400,fill:'url(#hSky)'},G.sky);A.stops=[0,1,2].map(i=>document.getElementById('hS'+i));
  const TR=[],add=(r,p)=>{if(r)TR.push({l:r.l-HX-p,r:r.r-HX+p,t:r.t-HY-p*.7,b:r.b-HY+p*.7});};
  RC.lines.forEach(r=>add(r,16));RC.em.forEach(r=>add(r,16));[RC.scroll,RC.cta,RC.chest,RC.lever,RC.brand,RC.menu,RC.eyebrow].forEach(r=>add(r,16));RC.chips.forEach(r=>add(r,10));
  if(RC.nav)TR.push({l:RC.nav.l-HX-30,r:RC.nav.r-HX+30,t:-50,b:RC.nav.b-HY+12});
  if(RC.ctaHead)TR.push({l:RC.ctaHead.l-HX-16,r:RC.ctaHead.r-HX+16,t:-50,b:RC.ctaHead.b-HY+12});
  (K.res||[]).forEach(r=>TR.push({l:r.l-HX,r:r.r-HX,t:r.t-HY,b:r.b-HY}));A.TR=TR;
  const ctaB=Math.max(RC.cta.b,RC.chest.b)-HY;
  if(wide){A.e0=Math.min(RC.scroll.l,RC.cta.l)-HX-26;A.e1=Math.max(RC.scroll.r,RC.chest.r)-HX+26;A.floor=Math.min(H-24,Math.max(...RC.chips.map(c=>c.b))-HY+16);
    A.cs=clamp(Math.min(A.e0,W-A.e1)/330,.6,1.15)*clamp(H/860,.8,1.12);const zl=A.e0,zr=W-A.e1;
    A.POS={laj:zl*.24,pond:zl*.6,det:zl*.42,trees:[zl*.97,W-zr*.06,W-zr*.95],houses:[zl*.07,W-zr*.84],hut:W-zr*.36,tour:W-zr*.62};}
  else{A.bandTop=ctaB+16;A.bh=H-A.bandTop;A.backFlat=A.bandTop+A.bh*.47;A.frontFlat=A.bandTop+A.bh*.68;A.cs=clamp(W/390,.85,1.35)*.62;
    A.POS={laj:W*.13,pond:W*.5,det:W*.64,trees:[W*.02,W*.985],houses:[W*.31],hut:W*.85,tour:W*.2};}
  if(BG)buildBg();else{buildStars();buildMountains();buildIslands(TR);buildBack();buildFront();buildOrb(TR.concat(A.islBoxes));buildClouds(TR.concat(A.islBoxes,[A.orbBox]));}
  A.nightRect=E('rect',{x:-200,y:-200,width:W+400,height:H+400,fill:BG?'#4a3f9a':'#160f40',opacity:0},G.night);if(BG){A.nightRect.style.mixBlendMode='multiply';root.insertBefore(G.stars,G.orb);}
  buildValance();nPrev=-1;A.u=0;A.par={};ORDER.forEach(k=>A.par[k]=[0,0]);}

/* ---------- akcje postaci w świecie ---------- */
function toggleNight(){nT=nT?0:1;hero.classList.toggle('is-night',!!nT);document.documentElement.classList.toggle('night',!!nT);lever.setAttribute('aria-pressed',nT?'true':'false');kick(.2);}

/* ================= aktorzy nad stroną (współrzędne dokumentu) ================= */
function defsActors(){const d=E('defs',{},AS);
  d.innerHTML='<linearGradient id="gPearl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#ffe0f3"/><stop offset="1" stop-color="#c8f0ff"/></linearGradient>'+
  '<radialGradient id="gGlow"><stop offset="0" stop-color="#fff6c2" stop-opacity=".95"/><stop offset="1" stop-color="#fff6c2" stop-opacity="0"/></radialGradient>'+
  '<radialGradient id="gBrass" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffe29a"/><stop offset=".45" stop-color="#f0b043"/><stop offset="1" stop-color="#b8742a"/></radialGradient>'+
  '<clipPath id="cpGlass"><circle cx="0" cy="-316" r="43"/></clipPath>';return d;}
function rope(){return E('path',{fill:'none',stroke:OUT,'stroke-width':1.8,'stroke-linecap':'round'},L.ropes);}
function anchorsFirst(){/* rezerwacje miejsca dla aktorów, żeby świat ich nie zasłaniał */K.res=[];const k=Math.max(U,.75);
  const em=RC.em;if(em.length){const lst=em[em.length-1],ps=clamp((lst.b-lst.t)*1.12/648,.055,.15);let px=lst.r+92*ps+8;if(px+110*ps>DW-6)px=em[0].l-92*ps-8;K.res.push({l:px-140*ps,r:px+140*ps,t:lst.b-680*ps,b:lst.b+60*ps});}
  K.res.push({l:RC.cta.l-12,r:RC.cta.r+12,t:RC.cta.t-95,b:RC.cta.t},{l:RC.chest.l-40,r:RC.chest.r+40,t:RC.chest.t-130,b:RC.chest.t});
  const sc=RC.scroll;if(wide){const ts=.14*k;K.res.push({l:sc.l-12-300*ts,r:sc.l,t:sc.t-30,b:sc.b+520*ts});}
  const eb=RC.eyebrow;if(wide){const bs=.13*k;K.res.push({l:eb.l-20-760*bs,r:eb.l,t:eb.t-60*bs-20,b:eb.b+30});}}
function buildActors(){AS.textContent='';L={};const keep={searchT:K.searchT||-99};K=Object.assign({res:K.res},keep);K.defs=defsActors();
  ALAY.forEach(k=>L[k]=gg(AS));['ropes','fx','lid','nowe'].forEach(k=>noHit(L[k]));
  buildChest();buildMascot();buildHeroNew();buildServices();buildSeo();buildMore();}

/* ---- skrzynia smoka = „Zobacz cennik” ---- */
function buildChest(){const c=RC.chest,ds=clamp(c.w/900,.13,.22);
  const cp=E('clipPath',{id:'chestClip',clipPathUnits:'userSpaceOnUse'},K.defs);E('rect',{x:f1(c.l-500),y:f1(c.t-700),width:f1(c.w+1000),height:f1(700+3)},cp);
  const dw=gg(L.dragon,{'clip-path':'url(#chestClip)'});const D=dragon(dw);setsw(D.g,OUTL/ds);
  const lw=c.w+8,lh=clamp(c.h*.44,14,24),lid=gg(L.lid);setsw(lid,3);
  const hw=lw/2;K.lidFill=E('path',{d:`M ${hw} 0 L ${-hw} 0 L ${-hw} ${f1(-lh*.45)} Q ${-hw} ${-lh} ${f1(-hw+lh*.9)} ${-lh} L ${f1(hw-lh*.9)} ${-lh} Q ${hw} ${-lh} ${hw} ${f1(-lh*.45)} Z`,fill:'#9a6a46',class:'o'},lid);
  for(const x of [-hw+16,hw-24])E('rect',{x:f1(x),y:-lh+2,width:8,height:lh-2,fill:'#ffd23f',class:'o2'},lid);
  E('rect',{x:-8,y:f1(-lh*.55),width:16,height:f1(lh*.55+5),rx:3,fill:'#ffd23f',class:'o2'},lid);
  K.dr={D,c,ds,peek:0,open:0,coinT:-9,lid,lw,lh,lastG:0,wasShown:true};}
function coinThrow(){const d=K.dr;if(!d||T-d.coinT<1.6)return;d.coinT=T;kick(2.4);const c=d.c,p=RC.price;
  for(let i=0;i<6;i++)coinArc(c.cx+(R()-.5)*c.w*.4,c.t-14,p.l+p.w*(.15+.7*R()),p.cy,.35+i*.09,i===5?()=>{sparkles(L.fx,p.cx,p.cy,10,Math.max(U,.7),['#ffd23f','#fff6b0','#ffffff']);}:null);}
function updChest(dt){const d=K.dr;if(!d)return false;const c=d.c,coin=T-d.coinT<1.6,want=F.chest||coin?1:0;
  d.open+=(want-d.open)*Math.min(1,dt*(want?7:5));if(Math.abs(want-d.open)<.003)d.open=want;
  const pt=d.open>.55?1:0;d.peek+=(pt-d.peek)*Math.min(1,dt*(pt?5:9));if(Math.abs(pt-d.peek)<.003)d.peek=pt;
  const shown=d.peek>0;
  if(shown||d.wasShown){d.wasShown=shown;const look=PD.x>-999?clamp((PD.x-c.cx)/300,-1,1):0;
    d.D.set({x:c.cx-6,y:c.t+lerp(600,175,ease.outBack(clamp(d.peek)))*d.ds,s:d.ds,look,hr:look*5,mouth:coin?.5:0,eyes:1,happy:true,
      wf:shown?Math.sin(T*2)*6:0,aL:[-175,-70],aR:coin?[200,-420]:[175,-70],bob:0});}
  const ky=1-d.open*2.4;d.lid.setAttribute('transform',`translate(${f1(c.cx)} ${f1(c.t+1-d.lh)}) scale(1 ${ky.toFixed(3)}) translate(0 ${f1(d.lh)})`);
  const inside=ky<0;if(d.inside!==inside){d.inside=inside;K.lidFill.setAttribute('fill',inside?'#5a3a26':'#9a6a46');}
  if(d.open>.5&&T-d.lastG>.22){d.lastG=T;trail(L.fx,c.l+10+R()*(c.w-20),c.t-4,.13);}
  return want>0||d.open>0||d.peek>0;}
/* ---- maskotka i dźwignia na „Zamów bezpłatny projekt” ---- */
function buildMascot(){const c=RC.cta,ms=wide?.42*Math.max(U,.8):.34;const mo=gg(L.mascot);setsw(mo,OUTL/ms);
  E('ellipse',{cx:0,cy:2,rx:46,ry:8,fill:OUT,opacity:.18},mo);const body=gg(mo);
  E('rect',{x:-34,y:-30,width:22,height:34,rx:10,fill:'#4b2aa8',class:'o'},body);E('rect',{x:12,y:-30,width:22,height:34,rx:10,fill:'#4b2aa8',class:'o'},body);
  const arm=limb(body,20,'#6a3fd6');const hand=E('circle',{r:13,fill:'#6a3fd6',class:'o2'},body);
  const bt=gg(body,{transform:'translate(0 -84)'});mLogo(bt,1);
  const eyes=gg(bt);E('ellipse',{cx:-24,cy:-52,rx:16,ry:17,fill:'#fff',class:'o'},eyes);E('ellipse',{cx:24,cy:-52,rx:16,ry:17,fill:'#fff',class:'o'},eyes);
  const pL=E('circle',{cx:-24,cy:-50,r:7,fill:OUT},eyes),pR=E('circle',{cx:24,cy:-50,r:7,fill:OUT},eyes);
  const home={x:c.l+28+46*ms,y:c.t+1};
  const lv=gg(L.lev);setsw(lv,3);const len=Math.max(24,30*Math.max(U,.8));
  E('rect',{x:-15,y:-9,width:30,height:11,rx:5,fill:'#3a2f6e',class:'o2'},lv);const st=gg(lv);
  E('path',{d:`M 0 -4 L 0 ${-len}`,stroke:OUT,'stroke-width':8,'stroke-linecap':'round'},st);E('path',{d:`M 0 -4 L 0 ${-len}`,stroke:'#d9d2f2','stroke-width':4,'stroke-linecap':'round'},st);
  E('circle',{cx:0,cy:-len,r:7.5,fill:'#ff5d5d',class:'o2'},st);
  const tag=E('text',{class:'ui',x:0,y:-len-14,'text-anchor':'middle','font-size':10,'font-weight':800,fill:OUT},lv);tag.textContent='OFF';
  const lvx=c.r-24,lvy=c.t+1;tl(lv,lvx,lvy);onHit(lv,e=>ctaGo(e,true));
  K.m={g:mo,body,arm,hand,eyes,pL,pR,s:ms,home,x:home.x,y:home.y,hopT:-9,n:0,bub:null,h2:false,jT:-9,jFrom:null,jTo:null,waveT:-9};
  K.lv={g:lv,st,tag,x:lvx,y:lvy,len,on:0,onT:-9,ang:-38};
}
function mascotSay(txt){const m=K.m;killFX(m.bub);m.bub=say(L.fx,m.x+58*m.s,m.y-120*m.s,txt,bubA(),1,2.3,DW);}
function updMascot(dt){const m=K.m;if(!m)return false;const s=m.s,lv=K.lv;
  const tx=F.cta&&!lv.on?lv.x-50*s-14:m.home.x;m.x+=clamp(tx-m.x,-170*dt,170*dt);if(Math.abs(tx-m.x)<.5)m.x=tx;
  const walking=m.x!==tx,x=m.x,y=m.home.y,ht=T-m.hopT;let hop=0,sq=0;
  if(ht<.5){hop=Math.sin(Math.PI*ht/.5)*70;sq=-.08*Math.sin(Math.PI*ht/.5);}else if(ht<.7)sq=.12*Math.sin(Math.PI*(ht-.5)/.2);
  const gait=walking?Math.abs(Math.sin(T*12))*18:0;
  place(m.g,x,y-(hop+gait)*s,s*(1+sq*.8),walking?Math.sin(T*12)*4:0,s*(1-sq));
  const lt=T-lv.onT,near=F.cta&&!walking;lv.ang=lv.on?lerp(-38,38,ease.outBack(clamp(lt/.35))):(near?-30:-38);
  let H2=[62,-60];if(near||(lv.on&&lt<.6)){const lx=(lv.x-x)/s,ly=(lv.y-lv.len*Math.cos(lv.ang*R2D)-y)/s;H2=[lx+lv.len*Math.sin(lv.ang*R2D)/s,ly];}
  m.arm([34,-80],H2,-20);m.hand.setAttribute('cx',f1(H2[0]));m.hand.setAttribute('cy',f1(H2[1]));
  lv.st.setAttribute('transform',`rotate(${f1(lv.ang)} 0 -4)`);if(lv.tag.textContent!==(lv.on?'ON':'OFF'))lv.tag.textContent=lv.on?'ON':'OFF';
  return walking||ht<.75||(lv.on&&lt<.6);}
function ctaGo(e,fromLever){if(e&&(e.ctrlKey||e.metaKey||e.shiftKey||e.button===1))return;if(e&&e.preventDefault)e.preventDefault();
  const lv=K.lv,m=K.m;if(lv.on)return;lv.on=1;lv.onT=T;m.hopT=T;confetti(lv.x,lv.y-lv.len,26);if(A.castleTop)ringBell();mascotSay('JUŻ ZAMAWIAM!');
  kick(2.2);const href=ctaMain.href;setTimeout(()=>{location.href=href;},RM?250:1100);}

/* ================= Hero: nowe interakcje =================
   Każda rusza dopiero, gdy najedziesz na element albo go stukniesz, i pokazuje to, co mówi jego tekst.
   Gra jedna naraz; tekst się nie rusza i nie świeci. */
function hnFree(b){const obs=[...RC.lines,...RC.em,RC.eyebrow,RC.scroll,RC.cta,RC.chest,...RC.chips,RC.brand,RC.nav,RC.ctaHead,RC.menu,
    RC.cta&&{l:RC.cta.l-12,r:RC.cta.r+12,t:RC.cta.t-95,b:RC.cta.t},RC.chest&&{l:RC.chest.l-40,r:RC.chest.r+40,t:RC.chest.t-130,b:RC.chest.t}].filter(Boolean);
  if(b.l<4||b.r>DW-4||b.t<(RC.brand?RC.brand.b+6:4))return false;
  return !obs.some(o=>Math.min(b.r,o.r)-Math.max(b.l,o.l)>2&&Math.min(b.b,o.b)-Math.max(b.t,o.t)>2);}
function buildHeroNew(){K.hn=null;const G=L.nowe;if(!G)return;const H={cur:null,it:{}};
  /* 1. „Projekt zobaczysz za darmo.” – panna Izabela zdejmuje zasłonę ze sztalugi: pod spodem projekt strony, na ramie metka „0 zł” */
  const ls=RC.em;if(ls&&ls.length){const lst=ls[ls.length-1],fst=ls[0],lh=lst.b-lst.t,s0=clamp(lh/100*1.15,.34,1);let pick=null;
    for(const k of [1,.85,.72,.6,.5]){const s=s0*k,w=136*s,ht=104*s,gy=lst.b-lh*.1;
      for(const [side,x0] of [[1,lst.r+12],[-1,lst.l-12],[-1,fst.l-12]]){const b=side>0?{l:x0-4*s,r:x0+w,t:gy-ht,b:gy+6*s}:{l:x0-w,r:x0+4*s,t:gy-ht,b:gy+6*s};
        if(hnFree(b)){pick={s,side,x0,gy};break;}}
      if(pick)break;}
    if(!pick)K.hnSkip='em';else{const {s,side,x0,gy}=pick,g=gg(G);op(g,0);const m=gg(g);setsw(m,OUTL/s);place(m,x0,gy,s*side,0,s);
    for(const d of ['M 10 0 L 24 -40','M 62 0 L 48 -40','M 36 2 L 36 -40'])E('path',{d,fill:'none',stroke:'#7b4f24','stroke-width':4,'stroke-linecap':'round'},m);
    E('rect',{x:-2,y:-96,width:76,height:58,rx:3,fill:'#e8b64a',class:'o'},m);
    const pic=gg(m);E('rect',{x:4,y:-90,width:64,height:46,fill:'#ffffff',class:'o2'},pic);E('rect',{x:4,y:-90,width:64,height:8,fill:'#e6e0f2'},pic);
    ['#ff5d5d','#ffd23f','#6fd36b'].forEach((c,i)=>E('circle',{cx:10+6*i,cy:-86,r:2,fill:c},pic));
    E('rect',{x:9,y:-77,width:30,height:6,rx:2,fill:'#6a3fd6'},pic);E('rect',{x:9,y:-67,width:26,height:3,rx:1.5,fill:'#c9c3dc'},pic);E('rect',{x:9,y:-61,width:22,height:3,rx:1.5,fill:'#c9c3dc'},pic);
    E('rect',{x:9,y:-54,width:18,height:6,rx:3,fill:'#ffd23f'},pic);E('rect',{x:44,y:-77,width:19,height:27,rx:2,fill:'#9fe7ff'},pic);
    E('path',{d:'M 44 -54 L 51 -62 L 56 -57 L 63 -66 L 63 -50 L 44 -50 Z',fill:'#6fd36b'},pic);
    E('rect',{x:-6,y:-40,width:84,height:5,rx:2,fill:'#7b4f24',class:'o2'},m);
    const cloth=gg(m);E('path',{d:'M -4 -98 L 74 -98 L 76 -37 Q 56 -31 38 -37 Q 18 -31 -4 -37 Z',fill:'#c0303f',class:'o'},cloth);
    E('path',{d:'M 18 -94 Q 16 -66 20 -39 M 40 -94 Q 42 -64 38 -38 M 60 -94 Q 58 -66 62 -38',fill:'none',stroke:'#8a1f2c','stroke-width':3},cloth);
    E('path',{d:'M -4 -98 L 74 -98',stroke:'#ffd23f','stroke-width':4},cloth);
    const cord=E('path',{fill:'none',stroke:'#ffd23f','stroke-width':2.5,'stroke-linecap':'round'},m);
    /* Izabela: liliowa krynolina, jasny kok, fioletowy kapelusik z różowym piórem, wachlarz; patrzy na sztalugę */
    const iz=gg(m);place(iz,104,0,1);
    E('path',{d:'M -26 0 Q -24 -30 -9 -46 L 9 -46 Q 24 -30 26 0 Z',fill:'#c9a7f0',class:'o'},iz);E('path',{d:'M -22 -12 Q 0 -6 22 -12',fill:'none',stroke:'#a77ef0','stroke-width':3},iz);
    E('path',{d:'M -8 -46 L -6 -62 L 6 -62 L 8 -46 Z',fill:'#b48cff',class:'o2'},iz);
    E('path',{d:'M 6 -58 Q 12 -54 10 -50',fill:'none',stroke:'#b48cff','stroke-width':5,'stroke-linecap':'round'},iz);
    E('circle',{cx:0,cy:-71,r:9,fill:'#ffe0c8',class:'o2'},iz);E('circle',{cx:6,cy:-78,r:6,fill:'#f5d27a',class:'o2'},iz);
    E('path',{d:'M -9 -72 Q -8 -82 2 -81 Q 9 -80 9 -73 Q 2 -78 -9 -72 Z',fill:'#f5d27a'},iz);
    E('circle',{cx:-4,cy:-71,r:1.6,fill:OUT},iz);E('path',{d:'M -6 -66 Q -4 -64 -2 -66',fill:'none',stroke:OUT,'stroke-width':1.4},iz);
    E('path',{d:'M -6 -82 Q 2 -90 10 -83 Z',fill:'#7b4fd0',class:'o2'},iz);E('path',{d:'M 6 -86 C 14 -98 22 -98 26 -96 C 20 -92 14 -88 8 -84 Z',fill:'#ff8fc0',class:'o2'},iz);
    const fan=gg(iz);E('path',{d:'M 0 0 L -9 -12 Q 0 -17 9 -12 Z',fill:'#ff8fc0',class:'o2'},fan);
    const arm=E('path',{fill:'none',stroke:'#b48cff','stroke-width':5,'stroke-linecap':'round'},m),hand=E('circle',{r:3.2,fill:'#ffe0c8',class:'o2'},m);
    /* metka „0 zł” poza lustrem, żeby napis się nie odwracał */
    const tag=gg(g),tin=gg(tag);E('path',{d:'M 0 0 L 0 9',stroke:OUT,'stroke-width':1.5},tin);
    E('rect',{x:-15,y:9,width:30,height:16,rx:4,fill:'#fff6dc',stroke:OUT,'stroke-width':1.6},tin);
    const tx=E('text',{x:0,y:21,'text-anchor':'middle','font-family':'Bahnschrift, Arial, sans-serif','font-weight':700,'font-size':11,fill:OUT},tin);tx.textContent='0 zł';
    H.it.em={kind:'em',g,cloth,cord,arm,hand,fan,tag,s,side,x0,gy,P:(lx,ly)=>[x0+side*lx*s,gy+ly*s]};}}
  const C=RC.chips||[];
  /* 2. „Projekt bezpłatnie” – na plakietce zawiązuje się kokarda jak na prezencie */
  if(C[0]){const r=C[0],s=r.h/36,g=gg(G);op(g,0);const b=gg(g);setsw(b,OUTL/s);
    for(const sx of [-1,1]){E('path',{d:`M 0 0 C ${-16*sx} -16 ${-28*sx} -2 ${-19*sx} 6 C ${-12*sx} 10 ${-4*sx} 5 0 0 Z`,fill:'#ff6b8f',class:'o2'},b);
      E('path',{d:`M ${-2*sx} 3 L ${-8*sx} 9 L ${-3*sx} 8 Z`,fill:'#ff6b8f',class:'o2'},b);}
    E('circle',{cx:0,cy:1,r:5,fill:'#e84a78',class:'o2'},b);
    H.it.c0={kind:'c0',g,b,r,s,x:r.cx,y:r.t-6*s};}
  /* 3. „Wycena bez zobowiązań” – pod plakietką wisi łańcuch z kłódką; kłódka się otwiera, łańcuch spada */
  if(C[1]){const r=C[1],s=r.h/36,g=gg(G);op(g,0);const a0=[r.l+16*s,r.b-2*s],a1=[r.r-16*s,r.b-2*s],sag=9*s,halves=[gg(g),gg(g)];
    const n=Math.max(8,Math.round((a1[0]-a0[0])/(8*s)));
    for(let i=0;i<=n;i++){const u=i/n;if(Math.abs(u-.5)<.05)continue;const x=lerp(a0[0],a1[0],u),y=lerp(a0[1],a1[1],u)+Math.sin(Math.PI*u)*sag,
        ang=Math.atan2(Math.cos(Math.PI*u)*Math.PI*sag,a1[0]-a0[0])*180/Math.PI;
      E('ellipse',{cx:f1(x),cy:f1(y),rx:f1(4.4*s),ry:f1((i%2?1.1:2.7)*s),fill:'none',stroke:'#7d7a96','stroke-width':f1(2*s),transform:`rotate(${f1(ang)} ${f1(x)} ${f1(y)})`},halves[u<.5?0:1]);}
    const lk=gg(g),lx=r.cx,ly=r.b-2*s+sag+4*s;
    const sh=E('path',{d:`M ${f1(lx-4*s)} ${f1(ly)} L ${f1(lx-4*s)} ${f1(ly-5*s)} A ${f1(4*s)} ${f1(4*s)} 0 0 1 ${f1(lx+4*s)} ${f1(ly-5*s)} L ${f1(lx+4*s)} ${f1(ly)}`,fill:'none',stroke:'#7d7a96','stroke-width':f1(2.4*s)},lk);
    E('rect',{x:f1(lx-6.5*s),y:f1(ly),width:f1(13*s),height:f1(11*s),rx:f1(2*s),fill:'#ffd23f',stroke:OUT,'stroke-width':f1(1.6*s)},lk);
    E('circle',{cx:f1(lx),cy:f1(ly+4.5*s),r:f1(1.7*s),fill:OUT},lk);E('path',{d:`M ${f1(lx)} ${f1(ly+5*s)} L ${f1(lx)} ${f1(ly+8*s)}`,stroke:OUT,'stroke-width':f1(1.6*s)},lk);
    H.it.c1={kind:'c1',g,halves,lk,sh,a0,a1,lx,ly,r,s};}
  /* 4. „Projekt w 3 dni” – nad plakietką wschodzą po kolei trzy słońca: 1, 2, 3 */
  if(C[2]){const r=C[2],s=r.h/36,g=gg(G);op(g,0);
    const ss=s*1.2,suns=[.22,.5,.78].map((u,i)=>{const o=gg(g),rays=gg(o);
      for(let k=0;k<8;k++){const a=k*Math.PI/4;E('path',{d:`M ${f1(Math.cos(a)*9)} ${f1(Math.sin(a)*9)} L ${f1(Math.cos(a)*13)} ${f1(Math.sin(a)*13)}`,stroke:'#f5a623','stroke-width':2.4,'stroke-linecap':'round'},rays);}
      E('circle',{r:7,fill:'#ffd23f',stroke:OUT,'stroke-width':1.6},o);
      const d=E('text',{x:0,y:3.6,'text-anchor':'middle','font-family':'Bahnschrift, Arial, sans-serif','font-weight':700,'font-size':10,fill:OUT},o);d.textContent=String(i+1);
      return {o,rays,u,i};});
    /* miejsce: nad plakietką; gdy tam inne plakietki (telefon) – obok niej, w ostateczności pod nią */
    const R13=13*ss,lv=RC.lever,clear=bx=>hnFree(bx)&&!(lv&&Math.min(bx.r,lv.r)-Math.max(bx.l,lv.l)>2&&Math.min(bx.b,lv.b)-Math.max(bx.t,lv.t)>2);
    const lay=[
      {m:'up',bx:{l:r.l+r.w*.22-R13,r:r.l+r.w*.78+R13,t:r.t-31*ss,b:r.t-2},f:sn=>[r.l+r.w*sn.u,r.t-18*ss,r.l+r.w*sn.u,r.t-4*ss]},
      {m:'right',bx:{l:r.r+2,r:r.r+16*ss+56*ss+R13,t:r.cy-R13,b:r.cy+R13},f:sn=>[r.r+16*ss+sn.i*28*ss,r.cy,r.r,r.cy]},
      {m:'left',bx:{l:r.l-16*ss-56*ss-R13,r:r.l-2,t:r.cy-R13,b:r.cy+R13},f:sn=>[r.l-16*ss-(2-sn.i)*28*ss,r.cy,r.l,r.cy]},
      {m:'down',bx:{l:r.l+r.w*.22-R13,r:r.l+r.w*.78+R13,t:r.b+2,b:r.b+31*ss},f:sn=>[r.l+r.w*sn.u,r.b+18*ss,r.l+r.w*sn.u,r.b+4*ss]}];
    const pick=lay.find(o=>clear(o.bx))||lay[0];
    suns.forEach(sn=>{[sn.fx,sn.fy,sn.sx,sn.sy]=pick.f(sn);});
    H.it.c2={kind:'c2',g,suns,r,s:ss,mode:pick.m};}
  buildLowerHN(H,G);
  K.hn=H;if(hnPend){const p=hnPend;hnPend=null;if(H.it[p.kind])heroGo(p.kind,p.auto);}}
/* auto: stuknięcie palcem – nie będzie zejścia kursora, więc scena sama zniknie po obejrzeniu */
function heroGo(kind,auto){const H=K.hn;if(!H||!H.it[kind])return;const it=H.it[kind];
  if(H.cur&&H.cur!==it){op(H.cur.g,0);H.cur.on=false;H.cur=null;}
  if(H.cur===it&&it.on){it.leaveT=auto?T:0;kick(auto?4:.3);return;}            /* już gra albo stoi odsłonięta: nie zaczynaj od nowa */
  H.cur=it;it.t0=RM?T-9:T;it.leaveT=auto?T:0;it.on=true;it.fx={};kick(auto?4.5:2.6);}
function heroLeave(kind){const H=K.hn;if(!H)return;const it=H.it[kind];if(it&&H.cur===it&&it.on){it.leaveT=T;kick(4);}}
function updHeroNew(){const H=K.hn;if(!H||!H.cur)return false;const it=H.cur,t=T-it.t0;
  const minShow=it.minShow||(it.kind==='em'?3.2:2.2),fs=it.leaveT?Math.max(it.leaveT+1.2,it.t0+minShow):1e9,fade=clamp((T-fs)/.35);
  const once=(k,u,fn)=>{if(t>=u&&!it.fx[k]){it.fx[k]=1;fn();}};
  if(it.upd){op(it.g,fade>=1?0:1);it.upd(t,fade,once);}
  else op(it.g,Math.min(clamp(t/.2),1-fade));
  if(it.upd){}else if(it.kind==='em'){const u=ease.ioS(clamp((t-.3)/.75));
    it.cloth.setAttribute('transform',`translate(${f1(u*34)} ${f1(u*u*70)}) rotate(${f1(u*30)} 74 -98)`);op(it.cloth,1-clamp((u-.7)/.3));
    const hx=lerp(86,106,u),hy=lerp(-84,-46,u);
    it.arm.setAttribute('d',`M 98 -58 Q ${f1((98+hx)/2-4)} ${f1(Math.min(-58,hy)-6)} ${f1(hx)} ${f1(hy)}`);it.hand.setAttribute('cx',f1(hx));it.hand.setAttribute('cy',f1(hy));
    const cx=74+u*34,cy=-98+u*u*70;it.cord.setAttribute('d',`M ${f1(cx)} ${f1(cy)} Q ${f1((cx+hx)/2)} ${f1(Math.max(cy,hy)+5)} ${f1(hx)} ${f1(hy)}`);op(it.cord,1-clamp((u-.6)/.25));
    const fa=t>1.15&&t<2.2?Math.sin((t-1.15)*16)*20:0;it.fan.setAttribute('transform',`translate(10 -52) rotate(${f1(-30+fa)})`);
    once('sp',1.0,()=>{const [x,y]=it.P(36,-67);sparkles(L.fx,x,y,9,.5*Math.max(it.s,.5));});
    const tu=clamp((t-1.0)/.4),[tx,ty]=it.P(66,-40),sw=t>1?Math.sin((t-1)*8)*18*Math.exp(-(t-1)*2.4):0;
    place(it.tag,tx,ty-(1-ease.outBack(tu))*10*it.s,Math.max(.001,it.s*1.15*tu),sw);}
  else if(it.kind==='c0'){const u=ease.outBack(clamp(t/.4)),w=Math.sin(clamp(t/.7)*Math.PI*2)*10*(1-clamp(t/.7));
    place(it.b,it.x,it.y,Math.max(.001,it.s*u),w);once('sp',.35,()=>sparkles(L.fx,it.x,it.y,7,.45));}
  else if(it.kind==='c1'){const a=ease.ioS(clamp((t-.25)/.3)),f=clamp((t-.6)/.6),fe=ease.inQ(f),s=it.s;
    it.sh.setAttribute('transform',`rotate(${f1(-55*a)} ${f1(it.lx+4*s)} ${f1(it.ly)})`);
    it.halves[0].setAttribute('transform',`translate(0 ${f1(fe*24*s)}) rotate(${f1(fe*38)} ${f1(it.a0[0])} ${f1(it.a0[1])})`);
    it.halves[1].setAttribute('transform',`translate(0 ${f1(fe*24*s)}) rotate(${f1(-fe*38)} ${f1(it.a1[0])} ${f1(it.a1[1])})`);
    it.lk.setAttribute('transform',`translate(0 ${f1(fe*30*s)}) rotate(${f1(fe*22)} ${f1(it.lx)} ${f1(it.ly)})`);
    [...it.halves,it.lk].forEach(x=>op(x,1-clamp((f-.55)/.45)));
    once('sp',.55,()=>sparkles(L.fx,it.lx,it.ly,6,.4));}
  else if(it.kind==='c2'){const s=it.s;it.suns.forEach((sn,i)=>{const u=clamp((t-i*.35)/.4);
      const e=ease.outBack(u);place(sn.o,lerp(sn.sx,sn.fx,e),lerp(sn.sy,sn.fy,e),Math.max(.001,s*.95*u),0);sn.rays.setAttribute('transform',`rotate(${f1(t*50)})`);
      once('s'+i,i*.35+.3,()=>sparkles(L.fx,sn.fx,sn.fy,4,.3));});}
  if(fade>=1){op(it.g,0);it.on=false;H.cur=null;return false;}
  return t<(it.busy||2.4)||!!it.leaveT;}

/* ================= dolne sekcje: przedmiot wychodzi z karty i robi to, o czym mówi jej tekst =================
   kroki współpracy (najazd / stuknięcie), motto, karty zespołu, pytania (po otwarciu). Gra jedna naraz, przez ten sam mechanizm co Hero. */
let hnClipN=0,hnPend=null;
function hnClip(p,x,y,w,h){const id='hnc'+(++hnClipN),cp=E('clipPath',{id,clipPathUnits:'userSpaceOnUse'},K.defs);
  const r=E('rect',{x:f1(x),y:f1(y),width:f1(Math.max(1,w)),height:f1(Math.max(1,h))},cp);const g=gg(p,{'clip-path':`url(#${id})`});g.cr=r;return g;}
const hnLn=(p,d,col,w,draw)=>E('path',Object.assign({d,fill:'none',stroke:col||OUT,'stroke-width':w||2,'stroke-linecap':'round','stroke-linejoin':'round'},draw?{pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1}:{}),p);
const hnDraw=(el,u)=>el.setAttribute('stroke-dashoffset',(1-clamp(u)).toFixed(3));
const hnRise=(t,fade,hid,dur)=>hid*(1-ease.outBack(clamp(t/(dur||.4))))+hid*ease.inQ(fade);
const hnTxt=(p,x,y,size,txt,fill)=>{const e=E('text',{x,y,'text-anchor':'middle','font-family':'Bahnschrift, Arial, sans-serif','font-weight':700,'font-size':size,fill:fill||OUT},p);e.textContent=txt;return e;};
function hnSite(p,x0,y0,w,h,col){/* mała strona: pasek, obrazek ze wzgórzem, linie tekstu, przycisk */
  E('rect',{x:x0,y:y0,width:w,height:h,rx:2,fill:'#ffffff',class:'o2'},p);E('rect',{x:x0,y:y0,width:w,height:h*.16,fill:col?'#6a3fd6':'#cfcadb'},p);
  E('rect',{x:x0+w*.08,y:y0+h*.26,width:w*.4,height:h*.44,fill:col?'#9fe7ff':'#e1dcea'},p);
  if(col){E('path',{d:`M ${x0+w*.08} ${y0+h*.7} Q ${x0+w*.2} ${y0+h*.5} ${x0+w*.32} ${y0+h*.6} Q ${x0+w*.4} ${y0+h*.55} ${x0+w*.48} ${y0+h*.64} L ${x0+w*.48} ${y0+h*.7} Z`,fill:'#6fd36b'},p);E('circle',{cx:x0+w*.18,cy:y0+h*.38,r:h*.06,fill:'#ffd23f'},p);}
  for(const [k,ww] of [[.3,.36],[.42,.28],[.54,.32]])E('rect',{x:x0+w*.56,y:y0+h*k,width:w*ww,height:h*.06,rx:1,fill:col?'#3d3358':'#d6d1e0'},p);
  E('rect',{x:x0+w*.56,y:y0+h*.72,width:w*.24,height:h*.12,rx:2,fill:col?'#ffd23f':'#d6d1e0'},p);}
function hnGear(p,r,n,col){let d='';for(let k=0;k<n*2;k++){const a=k/(n*2)*Math.PI*2,a2=(k+1)/(n*2)*Math.PI*2,R=k%2?r*.78:r;d+=`${k?'L':'M'} ${f1(Math.cos(a)*R)} ${f1(Math.sin(a)*R)} L ${f1(Math.cos(a2)*R)} ${f1(Math.sin(a2)*R)} `;}
  const g=gg(p);E('path',{d:d+'Z',fill:col,stroke:OUT,'stroke-width':1.8,'stroke-linejoin':'round'},g);E('circle',{r:r*.3,fill:'#fff8e6',stroke:OUT,'stroke-width':1.6},g);return g;}

function buildLowerHN(H,G){
  /* ---- 1. kroki współpracy: przedmiot wysuwa się zza górnej krawędzi karty, po prawej (numer kroku jest po lewej) ---- */
  qa('.step').map(dRect).forEach((r,i)=>{const s=clamp(r.w/270,.85,1.1),x=r.r-56*s,top=r.t,g=gg(G),cg=hnClip(g,r.l-40,top-300,r.w+80,300),m=gg(cg);setsw(m,OUTL/s);
    const it={kind:'st'+i,g,minShow:2.9,busy:2.5},pos=(t,fade)=>place(m,x,top+hnRise(t,fade,72*s),s);
    if(i===0){/* „Opowiedz nam o firmie”: ołówek wypełnia krótki formularz, na końcu ptaszek */
      E('rect',{x:-22,y:-60,width:44,height:68,rx:3,fill:'#ffffff',class:'o'},m);E('rect',{x:-22,y:-60,width:44,height:8,fill:'#c9b6ff'},m);
      const ls=[[-50,14],[-40,14],[-30,14],[-20,6]].map(([y,x1])=>hnLn(m,`M -14 ${y} L ${x1} ${y}`,'#6a3fd6',2.6,true));
      const ok=hnLn(m,'M 6 -9 L 11 -4 L 20 -15','#2f9e44',3.4,true);
      const pen=gg(m);E('path',{d:'M 0 0 L -4 -7 L -4 -32 L 4 -32 L 4 -7 Z',fill:'#ffd23f',class:'o2'},pen);E('path',{d:'M 0 0 L -1.6 -3 L 1.6 -3 Z',fill:OUT},pen);E('rect',{x:-4,y:-38,width:8,height:6,rx:1.5,fill:'#ff7aa8',class:'o2'},pen);
      it.upd=(t,fade,once)=>{pos(t,fade);let px=14,py=-50;
        ls.forEach((l,k)=>{const u=clamp((t-.45-k*.32)/.3);hnDraw(l,u);if(t>=.45+k*.32){const y=-50+k*10,x1=k===3?6:14;px=lerp(-14,x1,u);py=y;}});
        const cu=clamp((t-1.85)/.3);hnDraw(ok,cu);if(t>1.75){const u=clamp((t-1.75)/.4);px=lerp(6,20,u);py=lerp(-9,-15,u);}
        place(pen,px,py-1,1,28+Math.sin(t*30)*(t>.45&&t<2.15?5:0));once('sp',2.2,()=>sparkles(L.fx,x+13*s,top-12*s,6,.4));};}
    else if(i===1){/* „Bezpłatny projekt i wycena – w 3 dni”: kartki kalendarza 1, 2, 3 odpadają, pod nimi projekt strony */
      E('rect',{x:-26,y:-62,width:52,height:66,rx:4,fill:'#ffffff',class:'o'},m);E('rect',{x:-26,y:-62,width:52,height:11,fill:'#e8343f',class:'o2'},m);
      hnSite(m,-21,-46,42,38,true);
      const pages=[3,2,1].map(n=>{const pg=gg(m);E('rect',{x:-24,y:-50,width:48,height:50,rx:2,fill:'#fffdf6',class:'o2'},pg);hnTxt(pg,0,-12,30,String(n));return pg;}).reverse();
      [-12,12].forEach(cx=>E('circle',{cx,cy:-62,r:3.5,fill:'#fff8e6',stroke:OUT,'stroke-width':1.8},m));
      it.upd=(t,fade,once)=>{pos(t,fade);pages.forEach((pg,k)=>{const u=clamp((t-.55-k*.45)/.35);pg.setAttribute('transform',`translate(${f1(-u*10)} ${f1(-u*26)}) rotate(${f1(-u*40)} -24 -50)`);op(pg,1-u);
          once('p'+k,.6+k*.45,()=>sparkles(L.fx,x-10*s,top-40*s,3,.25,['#fffdf6','#ffd23f']));});
        once('sp',1.85,()=>sparkles(L.fx,x,top-28*s,8,.45));};}
    else if(i===2){/* „Dopracowanie projektu”: pędzel przemalowuje szary projekt na kolory, na końcu serce */
      E('rect',{x:-32,y:-58,width:64,height:64,rx:4,fill:'#ffffff',class:'o'},m);E('rect',{x:-32,y:-58,width:64,height:8,fill:'#e6e0f2'},m);
      ['#ff5d5d','#ffd23f','#6fd36b'].forEach((c,k)=>E('circle',{cx:-26+5*k,cy:-54,r:1.6,fill:c},m));
      E('rect',{x:-26,y:-46,width:52,height:10,rx:2,fill:'#cfcadb'},m);const hd=E('rect',{x:-26,y:-46,width:0,height:10,rx:2,fill:'#6a3fd6'},m);
      E('rect',{x:-26,y:-32,width:22,height:22,rx:2,fill:'#e1dcea'},m);E('path',{d:'M -26 -14 Q -18 -24 -10 -17 Q -7 -20 -4 -16 L -4 -10 L -26 -10 Z',fill:'#6fd36b'},m);
      [-30,-24].forEach(y=>E('rect',{x:0,y,width:24,height:3,rx:1.5,fill:'#cfcadb'},m));E('rect',{x:0,y:-16,width:22,height:6,rx:3,fill:'#cfcadb'},m);
      const bt=E('rect',{x:0,y:-16,width:0,height:6,rx:3,fill:'#ffd23f'},m);
      const br=gg(m);E('path',{d:'M 0 -12 L 0 -34',stroke:'#b5804f','stroke-width':4,'stroke-linecap':'round'},br);E('rect',{x:-4,y:-14,width:8,height:5,fill:'#b9b3cc',class:'o2'},br);
      const bris=E('path',{d:'M -4 -9 L 4 -9 L 3 0 L -3 0 Z',fill:'#6a3fd6',class:'o2'},br);
      const heart=gg(m);E('path',{d:'M 0 6 C -14 -4 -10 -16 0 -9 C 10 -16 14 -4 0 6 Z',fill:'#ff6b8f',class:'o2'},heart);
      it.upd=(t,fade,once)=>{pos(t,fade);const u1=ease.ioS(clamp((t-.5)/.6)),u2=ease.ioS(clamp((t-1.3)/.45));hd.setAttribute('width',f1(52*u1));bt.setAttribute('width',f1(22*u2));
        let bx=-26,by=-41;if(t>=.5&&t<1.3){bx=lerp(-26,26,u1);by=-41;}else if(t>=1.3){bx=lerp(0,22,u2);by=-13;}bris.setAttribute('fill',t<1.2?'#6a3fd6':'#ffd23f');
        place(br,bx,by,1,t>.4&&t<1.85?Math.sin(t*22)*12:0);op(br,t<1.95?1:0);
        const hk=ease.outBack(clamp((t-1.9)/.35));place(heart,40,-30,Math.max(.001,hk));once('sp',2,()=>sparkles(L.fx,x+40*s,top-30*s,7,.4));};}
    else{/* „Uruchomienie – strona startuje”: rakieta wysuwa się, odpala i startuje */
      const rk=gg(m);const fl=E('path',{d:'M -7 -1 Q 0 24 7 -1 Z',fill:'#ffd23f',class:'o2'},rk);
      E('path',{d:'M -13 -14 L -22 4 L -12 -2 Z M 13 -14 L 22 4 L 12 -2 Z',fill:'#ff6b8f',class:'o2'},rk);
      E('path',{d:'M 0 -56 Q 16 -38 13 -2 L -13 -2 Q -16 -38 0 -56 Z',fill:'#ffffff',class:'o'},rk);E('circle',{cx:0,cy:-30,r:6,fill:'#9fe7ff',class:'o2'},rk);
      const pf=[-24,-14,14,24].map(px=>({c:E('circle',{cx:px,cy:-2,r:3,fill:'#ffffff',stroke:OUT,'stroke-width':1.4,opacity:0},m),px}));
      it.minShow=2.2;it.busy=2;
      it.upd=(t,fade,once)=>{pos(t,0);const ig=clamp((t-.5)/.5),la=clamp((t-1)/.6),sh=t>.5&&t<1.05?Math.sin(t*60)*2:0;
        place(rk,0,-ease.inQ(la)*60,1,sh);fl.setAttribute('transform',`scale(1 ${f1(t>.5?.6+ig*.5+Math.sin(t*40)*.15:0)})`);op(rk,1-clamp((la-.6)/.4));
        pf.forEach((p,k)=>{const u=clamp((t-.6-k*.08)/.8);p.c.setAttribute('r',f1(3+u*8));p.c.setAttribute('cx',f1(p.px*(1+u*.6)));p.c.setAttribute('opacity',(t>.6?1-u:0).toFixed(2));});
        once('sp',1.45,()=>sparkles(L.fx,x,top-80*s,8,.45));};}
    H.it[it.kind]=it;op(g,0);});
  /* ---- 2. motto „Twoja wizja. Nasze wykonanie.”: spod ramki zjeżdża kartka, ołówek szkicuje stronę (wizja), wałek ją maluje (wykonanie) ---- */
  const mbE=q('.motto-box'),mhE=q('#motto-h');if(mbE&&mhE){const mb=dRect(mbE),mh=dRect(mhE),wideM=mb.w>700,s=clamp(mb.w/1200,.62,1)*1.1,x=wideM?mh.l+80*s:mb.cx,g=gg(G),cg=hnClip(g,mb.l,mb.b,mb.w,320),m=gg(cg);setsw(m,OUTL/s);
    hnLn(m,'M -54 -4 L -54 14 M 54 -4 L 54 14',OUT,2);E('rect',{x:-62,y:12,width:124,height:92,rx:4,fill:'#fff8e6',class:'o'},m);
    const sk=['M -52 22 H 52 V 94 H -52 Z','M -52 34 H 52','M -44 42 H -6 V 74 H -44 Z','M -44 70 Q -30 56 -18 64 Q -12 60 -6 66','M 4 46 H 44','M 4 54 H 36','M 4 62 H 40','M 4 72 H 26 V 80 H 4 Z','M -44 86 H 44'].map(d=>hnLn(m,d,'#8c8aa3',1.8,true));
    const cc=hnClip(m,-62,10,0,96);hnSite(cc,-52,22,104,72,true);
    const pen=gg(m);E('path',{d:'M 0 0 L -4 -7 L -4 -32 L 4 -32 L 4 -7 Z',fill:'#ffd23f',class:'o2'},pen);E('path',{d:'M 0 0 L -1.6 -3 L 1.6 -3 Z',fill:OUT},pen);
    const ro=gg(m);E('path',{d:'M 5 58 L 18 58 L 18 112',fill:'none',stroke:OUT,'stroke-width':3,'stroke-linecap':'round'},ro);E('rect',{x:15,y:104,width:7,height:16,rx:3,fill:'#ff6b8f',class:'o2'},ro);
    E('rect',{x:-6,y:18,width:12,height:80,rx:5,fill:'#ffd23f',class:'o'},ro);
    H.it.mt={kind:'mt',g,minShow:3.6,busy:2.8,upd:(t,fade,once)=>{place(m,x,mb.b+hnRise(t,fade,-118*s,.45),s);
      let px=-52,py=22;sk.forEach((l,k)=>{const u=clamp((t-.5-k*.11)/.16);hnDraw(l,u);if(t>=.5+k*.11&&t<.66+k*.11){const L2=l.getTotalLength?l.getTotalLength():0;try{const pt=l.getPointAtLength(L2*u);px=pt.x;py=pt.y;}catch(e){}}});
      op(pen,t>.45&&t<1.55?1:0);place(pen,px,py,1,24);
      const u=ease.ioS(clamp((t-1.6)/.8)),rx=lerp(-58,58,u);cc.cr.setAttribute('width',f1(Math.max(0,rx+62)));place(ro,rx,0,1);op(ro,t>1.5&&t<2.5?1:0);
      once('sp',2.45,()=>sparkles(L.fx,x,mb.b+60*s,10,.5));}};op(g,0);}
  /* ---- 3. zespół: Karolowi (laureat konkursu matematycznego) spada medal, Aleksowi (finalista mistrzostw) wysuwa się puchar zza awatara ---- */
  const P=qa('.person').map(dRect),AV=qa('.pava').map(dRect);
  if(P[0]&&AV[0]){const r=P[0],a=AV[0],s=clamp(r.w/560,.85,1.1),x=a.r+46*s,d=(a.cy-r.t)/s,g=gg(G),cg=hnClip(g,r.l+3,r.t+2,r.w-6,r.h-4),m=gg(cg);setsw(m,OUTL/s);
    E('path',{d:`M -12 0 L -3 0 L 3 ${f1(d-12)} L -5 ${f1(d-12)} Z`,fill:'#e8343f',class:'o2'},m);E('path',{d:`M 12 0 L 3 0 L -3 ${f1(d-12)} L 5 ${f1(d-12)} Z`,fill:'#2f5fd0',class:'o2'},m);
    E('circle',{cx:0,cy:f1(d),r:15,fill:'#ffd23f',class:'o'},m);E('circle',{cx:0,cy:f1(d),r:10,fill:'none',stroke:'#e8a917','stroke-width':2},m);hnTxt(m,0,f1(d+5.5),15,'π');
    H.it.pp0={kind:'pp0',g,minShow:2.8,busy:2.6,upd:(t,fade,once)=>{const sw=t>.35?Math.sin((t-.35)*5.5)*16*Math.exp(-(t-.35)*1.5):0;
      place(m,x,r.t+hnRise(t,fade,-(d+30)*s,.45),s,sw);once('sp',.5,()=>sparkles(L.fx,x,a.cy,8,.45));}};op(g,0);}
  if(P[1]&&AV[1]){const r=P[1],a=AV[1],s=clamp(r.w/560,.85,1.1),x=a.r+34*s,g=gg(G),cg=hnClip(g,a.r+1,a.t-50,150,a.h+52),m=gg(cg);setsw(m,OUTL/s);
    E('path',{d:'M -16 -40 Q -28 -38 -17 -26 M 16 -40 Q 28 -38 17 -26',fill:'none',stroke:OUT,'stroke-width':2.6,'stroke-linecap':'round'},m);
    E('path',{d:'M -16 -46 L 16 -46 Q 16 -20 0 -16 Q -16 -20 -16 -46 Z',fill:'#ffd23f',class:'o'},m);E('path',{d:'M 0 -38 L 2.4 -33 L 7.6 -32.6 L 3.6 -29.2 L 4.8 -24 L 0 -26.8 L -4.8 -24 L -3.6 -29.2 L -7.6 -32.6 L -2.4 -33 Z',fill:'#fff6b0'},m);
    E('rect',{x:-3,y:-17,width:6,height:9,fill:'#e8a917',class:'o2'},m);E('rect',{x:-12,y:-9,width:24,height:9,rx:2,fill:'#b5804f',class:'o2'},m);
    const gl=E('path',{d:'M -8 -44 L -2 -44 L -10 -22 L -14 -22 Z',fill:'#ffffff',opacity:0},m);
    H.it.pp1={kind:'pp1',g,minShow:2.8,busy:2.2,upd:(t,fade,once)=>{const ox=hnRise(t,fade,-64*s,.45),u=clamp((t-.6)/.5);
      place(m,x+ox,a.b-1,s,t>.45&&t<1.2?Math.sin((t-.45)*14)*6*(1-clamp((t-.45)/.75)):0);gl.setAttribute('transform',`translate(${f1(u*26)} 0)`);gl.setAttribute('opacity',(u>0&&u<1?.85:0).toFixed(2));
      once('sp',1.1,()=>sparkles(L.fx,x,a.b-50*s,9,.45));}};op(g,0);}
  /* ---- 4. pytania: po otwarciu przy pytaniu pojawia się przedmiot z odpowiedzi (komputer: z lewej krawędzi pytania; telefon: z dolnej krawędzi odpowiedzi) ---- */
  const fbE=q('.faq-box');if(fbE){const fb=dRect(fbE);qa('.faql details').forEach((de,i)=>{const dt=dRect(de),sm=dRect(de.querySelector('summary')),side=dt.l-fb.l>200,s=side?1.35:.9,g=gg(G);
    let cg,bx,by,hx,hy;if(side){cg=hnClip(g,fb.l+16,sm.t-40,dt.l-2-fb.l-16,sm.h+80);bx=dt.l-66*s;by=sm.cy;hx=104*s;hy=0;}else{cg=hnClip(g,dt.l,dt.t,dt.w,dt.h-3);bx=dt.r-44*s;by=dt.b-3-38*s;hx=0;hy=86*s;}
    const m=gg(cg);setsw(m,OUTL/s);const pos=(t,fade)=>{const k=hnRise(t,fade,1,.45);place(m,bx+hx*k,by+hy*k,s);};
    const it={kind:'fq'+i,g,minShow:3.2,busy:2.4};
    if(i===0){/* cena 1500 zł = strona wizytówka: wizytówka obraca się i pokazuje jednostronicową stronę */
      const c=gg(m),fr=gg(c),bk=gg(c);E('rect',{x:-28,y:-17,width:56,height:34,rx:3,fill:'#ffffff',class:'o'},fr);E('circle',{cx:-16,cy:-5,r:6,fill:'#c9b6ff',class:'o2'},fr);
      [[-6,-8,26],[-6,-1,18],[-20,8,40]].forEach(([x0,y,w])=>E('rect',{x:x0,y,width:w,height:3,rx:1.5,fill:'#3d3358'},fr));
      E('rect',{x:-28,y:-17,width:56,height:34,rx:3,fill:'#ffffff',class:'o'},bk);hnSite(bk,-24,-13,48,26,true);op(bk,0);
      it.upd=(t,fade,once)=>{pos(t,fade);const u=clamp((t-.6)/.6),c2=Math.cos(Math.PI*u);c.setAttribute('transform',`scale(${f1(Math.max(.02,Math.abs(c2)))} 1)`);op(fr,c2>=0?1:0);op(bk,c2<0?1:0);once('sp',1.25,()=>sparkles(L.fx,bx,by,7,.4));};}
    else if(i===1){/* utrzymanie: co roku tylko domena i hosting – moneta wpada do świnki skarbonki */
      const pig=gg(m);E('ellipse',{cx:0,cy:8,rx:24,ry:17,fill:'#ff9fc0',class:'o'},pig);E('path',{d:'M -8 -7 L -3 -16 L 3 -8 Z',fill:'#ff7aa8',class:'o2'},pig);
      E('ellipse',{cx:23,cy:9,rx:5,ry:6,fill:'#ff7aa8',class:'o2'},pig);E('circle',{cx:13,cy:2,r:1.8,fill:OUT},pig);[-14,-4,6,14].forEach(lx=>E('rect',{x:lx-2.5,y:21,width:5,height:6,rx:1.5,fill:'#ff7aa8',class:'o2'},pig));
      hnLn(pig,'M -6 -8 L 6 -8',OUT,2.6);const coins=[0,1].map(()=>{const c=gg(m);E('circle',{r:7,fill:'#ffd23f',stroke:OUT,'stroke-width':1.6},c);E('circle',{r:4,fill:'none',stroke:'#e8a917','stroke-width':1.4},c);op(c,0);return c;});
      it.upd=(t,fade,once)=>{pos(t,fade);let sq=0;coins.forEach((c,k)=>{const u=clamp((t-.55-k*.55)/.38);place(c,0,lerp(-44,-12,ease.inQ(u)),1,0,Math.max(.25,Math.abs(Math.cos(t*8))));op(c,u>0&&u<1?1:0);
          if(u>=1&&t-(.93+k*.55)<.25)sq=1-(t-(.93+k*.55))/.25;once('c'+k,.93+k*.55,()=>sparkles(L.fx,bx,by-14,4,.3,['#ffd23f','#fff6b0']));});
        pig.setAttribute('transform',`translate(0 ${f1(sq*3)}) scale(${f1(1+sq*.06)} ${f1(1-sq*.08)})`);};}
    else if(i===2){/* po uruchomieniu: 12 miesięcy naprawiamy każdy błąd – klucz przegania robaczka */
      const bug=gg(m),bi=gg(bug);const legs=gg(bi);for(const lx of [-5,0,5]){hnLn(legs,`M ${lx} 0 L ${lx-3} 11`,OUT,1.6);hnLn(legs,`M ${lx} 0 L ${lx-3} -11`,OUT,1.6);}
      E('ellipse',{cx:0,cy:0,rx:12,ry:9,fill:'#e8343f',class:'o2'},bi);E('circle',{cx:-12,cy:0,r:5,fill:OUT},bi);hnLn(bi,'M -2 -9 L -2 9',OUT,1.4);[[4,-4],[5,4],[-6,-4]].forEach(([cx,cy])=>E('circle',{cx,cy,r:1.8,fill:OUT},bi));
      const wr=gg(m),wi=gg(wr);E('rect',{x:-3,y:0,width:6,height:28,rx:2,fill:'#b9b3cc',class:'o2'},wi);E('path',{d:'M -9 2 L -9 -8 L -4 -12 L -4 -4 L 4 -4 L 4 -12 L 9 -8 L 9 2 Z',fill:'#b9b3cc',class:'o2'},wi);
      it.upd=(t,fade,once)=>{pos(t,fade);const w=clamp((t-.4)/.6),hit=clamp((t-1.05)/.18),fly=clamp((t-1.25)/.5);
        place(bug,lerp(18,0,w)-fly*30,8-fly*34,1,-fly*200);legs.setAttribute('transform',`rotate(${f1(w>0&&w<1?Math.sin(t*30)*14:0)})`);op(bug,1-fly);
        place(wr,20,-28,1,lerp(-70,-145,ease.inQ(hit))+(hit>=1?Math.sin(clamp((t-1.23)/.4)*Math.PI)*12:0));op(wr,t>.9?1:0);
        once('sp',1.24,()=>sparkles(L.fx,bx,by,7,.4));};}
    else if(i===3){/* projekt naprawdę bezpłatny: wieczko prezentu odskakuje, z pudełka wychodzi metka „0 zł” */
      const tag=gg(m);E('rect',{x:-15,y:-8,width:30,height:16,rx:4,fill:'#fff6dc',stroke:OUT,'stroke-width':1.6},tag);hnTxt(tag,0,4,11,'0 zł');
      E('rect',{x:-18,y:-6,width:36,height:30,rx:2,fill:'#6fd36b',class:'o'},m);E('rect',{x:-4,y:-6,width:8,height:30,fill:'#ffd23f'},m);
      const lid=gg(m);E('rect',{x:-21,y:-15,width:42,height:10,rx:2,fill:'#5bc35a',class:'o'},lid);E('rect',{x:-4,y:-15,width:8,height:10,fill:'#ffd23f'},lid);
      E('path',{d:'M 0 -15 C -10 -26 -18 -16 -8 -14 Z M 0 -15 C 10 -26 18 -16 8 -14 Z',fill:'#ffd23f',class:'o2'},lid);
      it.upd=(t,fade,once)=>{pos(t,fade);const u=clamp((t-.6)/.45);lid.setAttribute('transform',`translate(${f1(u*22)} ${f1(-Math.sin(u*Math.PI)*22+u*30)}) rotate(${f1(u*70)} 21 -10)`);op(lid,1-clamp((u-.6)/.4));
        const k=ease.outBack(clamp((t-.75)/.4));place(tag,0,lerp(4,-26,k),Math.max(.001,k));once('sp',1,()=>sparkles(L.fx,bx,by-26,8,.4));};}
    else if(i===4){/* nie musisz się znać: technikę bierzemy na siebie – zębatki ruszają */
      const g1=gg(m),g2=gg(m),g3=gg(m);hnGear(g1,15,8,'#c9b6ff');hnGear(g2,10,6,'#ffd23f');hnGear(g3,8,6,'#7cf2c8');
      it.upd=(t,fade,once)=>{pos(t,fade);const a=clamp((t-.45)/1.6)*360;place(g1,-8,6,1,a);place(g2,15,-8,1,-a*1.5+15);place(g3,14,16,1,-a*1.8);once('sp',1.9,()=>sparkles(L.fx,bx,by,6,.35));};}
    else if(i===5){/* przebudowa tańsza niż nowa strona: nożyczki odcinają kawałek metki z ceną */
      const lp=E('path',{d:'M -28 -12 L -6 -12 L -6 12 L -28 12 Z',fill:'#fff6dc',class:'o2'},m);E('path',{d:'M -6 -12 L 14 -12 L 26 0 L 14 12 L -6 12 Z',fill:'#fff6dc',class:'o2'},m);
      E('circle',{cx:16,cy:0,r:2.6,fill:'#fff8e6',stroke:OUT,'stroke-width':1.4},m);E('path',{d:'M -6 -14 L -6 14',stroke:'#8c8aa3','stroke-width':1.6,'stroke-dasharray':'3 3'},m);
      [[-22,-4,10],[-22,4,10],[-2,-4,10],[-2,4,8]].forEach(([x0,y,w])=>E('rect',{x:x0,y,width:w,height:3,rx:1.5,fill:'#6a3fd6'},m));
      const sc=gg(m),bA=gg(sc),bB=gg(sc);for(const [b,sy] of [[bA,1],[bB,-1]]){E('path',{d:`M 0 0 L 22 ${-3*sy} L 22 ${-1*sy} Z`,fill:'#d6d1e0',stroke:OUT,'stroke-width':1.4,'stroke-linejoin':'round'},b);E('circle',{cx:-8,cy:5*sy,r:5,fill:'none',stroke:'#ff6b8f','stroke-width':3},b);}
      it.upd=(t,fade,once)=>{pos(t,fade);const mv=ease.ioS(clamp((t-.4)/.4)),cut=clamp((t-.8)/.35),fall=clamp((t-1.15)/.5);
        const op1=t<.8?14:Math.abs(Math.sin(cut*Math.PI*2))*14;bA.setAttribute('transform',`rotate(${f1(-op1)})`);bB.setAttribute('transform',`rotate(${f1(op1)})`);
        place(sc,-28,lerp(-40,-14,mv)+cut*24,1,90);op(sc,t>.35&&t<1.5?1:0);
        lp.setAttribute('transform',`translate(${f1(-fall*6)} ${f1(fall*fall*30)}) rotate(${f1(-fall*30)} -6 12)`);op(lp,1-fall);once('sp',1.2,()=>sparkles(L.fx,bx,by,6,.35));};}
    else if(i===6){/* SEO: lupa przegląda wyniki, Twój wynik wskakuje na górę i robi się złoty */
      const bars=[-16,-2,12].map(y=>E('rect',{x:-26,y,width:52,height:8,rx:3,fill:'#e6e0f2',stroke:OUT,'stroke-width':1.2},m));const gold=E('rect',{x:-26,y:-16,width:0,height:8,rx:3,fill:'#ffd23f'},m);
      const mg=gg(m);E('circle',{r:8,fill:'rgba(159,231,255,.55)',stroke:OUT,'stroke-width':2.4},mg);hnLn(mg,'M 6 6 L 14 14',OUT,3.4);
      it.upd=(t,fade,once)=>{pos(t,fade);const u=clamp((t-.45)/.9),g2=ease.ioS(clamp((t-1.35)/.4));place(mg,lerp(-16,16,u)+Math.sin(u*Math.PI*3)*4,lerp(16,-12,u),1);op(mg,t<1.9?1:0);
        gold.setAttribute('width',f1(52*g2));once('sp',1.8,()=>sparkles(L.fx,bx,by-12,7,.35));};}
    else{/* firmy z całej Polski, wszystko online: samolocik z papieru robi pętlę i ląduje przy pinezce */
      const tr=hnLn(m,'M -24 10 C -24 -22 18 -22 10 -2 C 4 12 -10 4 0 -6 C 8 -14 22 -8 22 6','#8c8aa3',1.6,true);
      const pin=gg(m);E('path',{d:'M 0 0 C -8 -10 -8 -20 0 -20 C 8 -20 8 -10 0 0 Z',fill:'#e8343f',class:'o2'},pin);E('circle',{cx:0,cy:-13,r:3,fill:'#fff'},pin);
      const pl=gg(m);E('path',{d:'M -12 -6 L 14 0 L -12 6 L -6 0 Z',fill:'#ffffff',class:'o2'},pl);hnLn(pl,'M -6 0 L 14 0',OUT,1.2);
      it.upd=(t,fade,once)=>{pos(t,fade);const u=clamp((t-.4)/1.2);hnDraw(tr,u);op(tr,1-clamp((t-2)/.3));
        const L2=tr.getTotalLength(),p0=tr.getPointAtLength(L2*u),p1=tr.getPointAtLength(Math.min(L2,L2*u+1));place(pl,p0.x,p0.y,1,Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI);op(pl,u>0?1:0);
        const k=ease.outBack(clamp((t-1.6)/.35));place(pin,22,8,Math.max(.001,k));once('sp',1.7,()=>sparkles(L.fx,bx+22,by,6,.35));};}
    H.it[it.kind]=it;op(g,0);});}
}
/* ================= sekcja usług: postacie działają na karty i link ================= */
function buildServices(){K.sv=null;const C=RC.cards;if(!C||C.length<3)return;const [c1,c2,c3]=C,k=clamp(c1.w/380,.72,1.1),g=L.svc;const sv={};
  // 1) budowniczy za górną krawędzią „Tworzenie stron internetowych” stawia blanki
  const cp1=E('clipPath',{id:'svcClip1',clipPathUnits:'userSpaceOnUse'},K.defs);E('rect',{x:f1(c1.l-80),y:f1(c1.t-320),width:f1(c1.w+160),height:323},cp1);
  const bw=gg(g,{'clip-path':'url(#svcClip1)'});const B=person(bw,{shirt:'#ff9a3d',cap:'#ffd23f',hair:'#5b4632',pants:'#3b4a8a'});const bs=.25*k;setsw(B.g,OUTL/bs);
  const ham=gg(B.g);E('path',{d:'M 0 10 L 0 -96',stroke:OUT,'stroke-width':22,'stroke-linecap':'round'},ham);E('path',{d:'M 0 10 L 0 -96',stroke:'#b5804f','stroke-width':11,'stroke-linecap':'round'},ham);
  E('rect',{x:-40,y:-130,width:80,height:38,rx:9,fill:'#9aa3b8',class:'o'},ham);
  const n=Math.max(4,Math.round((c1.w-68)/40)),step=(c1.w-68)/n,merl=[];
  for(let i=0;i<n;i++){const m=gg(g);setsw(m,3);E('rect',{x:-12,y:-20,width:24,height:22,rx:3,fill:'#f7e7c6',class:'o'},m);E('path',{d:'M -12 -9 L 12 -9',stroke:'#e2c487','stroke-width':2},m);
    op(m,RM?1:0);merl.push({g:m,x:c1.l+34+step*(i+.5),t:RM?-9:null});}
  sv.b={P:B,ham,s:bs,c:c1,merl,t0:-99,dur:.7+n*.14,x0:c1.l+44,x1:c1.r-44,yHide:c1.t+390*bs,yUp:c1.t+120*bs,h3:cardH3[0]};
  // 2) połatana karta „Przebudowa strony internetowej” i chatka na jej dachu
  const hs=.078*k,HH=chatka(g,K.defs,'svcHut');setsw(HH.g,OUTL/hs);place(HH.g,c2.r-58*k,c2.t+3-182*hs,hs);
  const ps=.2*k,pts=[['plank',c2.l+10,c2.t+10,-24,-1,-1],['tape',c2.l+12,c2.b-12,12,-1,1],['aid',c2.r-24,c2.b-22,30,1,1],['cloth',c2.r-6,c2.cy+10,-8,1,0]];
  const patches=pts.map(([kd,x,y,r,dx,dy])=>{const w=gg(g);patch(w,kd,0,0,r);setsw(w,OUTL/ps);place(w,x,y,ps);return {w,x,y,dx,dy};});
  sv.f={H:HH,patches,pr:0,el:cards[1],c:c2};
  // 3) „Optymalizacja SEO” stoi w wodzie, Syrenka ją podnosi
  const ss=.13*k,wy=c3.b-7;
  const cp3=E('clipPath',{id:'svcClip3',clipPathUnits:'userSpaceOnUse'},K.defs);E('rect',{x:f1(c3.l-60),y:f1(c3.t-200),width:f1(c3.w+120),height:f1(c3.h+200+wy-c3.b+2)},cp3);
  const sw=gg(g,{'clip-path':'url(#svcClip3)'});const SY=syrenka(sw);setsw(SY.g,OUTL/ss);['phone','bub','keys','ec','mo','sword'].forEach(kk=>hideEl(SY,kk));
  const wv=gg(g);setsw(wv,3);const wx0=c3.l-8,wx1=c3.r+8,wn=Math.max(4,Math.round((wx1-wx0)/26)),wst=(wx1-wx0)/wn;let d=`M ${f1(wx0)} ${f1(wy+20)} L ${f1(wx0)} ${f1(wy)}`;
  for(let i=0;i<wn;i++)d+=` q ${f1(wst/4)} -7 ${f1(wst/2)} 0 q ${f1(wst/4)} 7 ${f1(wst/2)} 0`;
  E('path',{d:d+` L ${f1(wx1)} ${f1(wy+20)} Z`,fill:'#6cc8ff',class:'o'},wv);
  for(let x=c3.l+20;x<c3.r-20;x+=70)E('path',{d:`M ${f1(x)} ${f1(wy+10)} q 8 -5 16 0`,fill:'none',stroke:'#fff','stroke-width':2.5,'stroke-linecap':'round'},wv);
  sv.s={S:SY,s:ss,k,x:c3.r-80*k,pr:0,el:cards[2],c:c3,splash:false,wy};
  // 4) „Zobacz pełny cennik →”: smok za kupką monet rozgrzewa podkreślenie
  const ap=RC.allPrice[0];if(ap){const ds=.075*k,px=ap.l-30,base=ap.b+2;
    const cp4=E('clipPath',{id:'svcClip4',clipPathUnits:'userSpaceOnUse'},K.defs);E('rect',{x:f1(px-200),y:f1(base-300),width:400,height:f1(300-6)},cp4);
    const dw=gg(g,{'clip-path':'url(#svcClip4)'});const D=dragon(dw);setsw(D.g,OUTL/ds);
    const pile=gg(g);[[-10,-8],[10,-8],[0,-22]].forEach(([x,y])=>{const o=gg(pile);coin(o);const cs=.42*k;setsw(o,OUTL/cs);place(o,px+x*k,base+y*k,cs);});
    sv.d={D,s:ds,x:px,base,pr:0,ap,fireT:-9,lastSp:0,wasShown:true};}
  K.sv=sv;}
function svcBuild(){const b=K.sv&&K.sv.b;if(!b||RM)return;if(T-b.t0<b.dur)return;b.t0=T;kick(b.dur+.3);}
function updServices(dt){const sv=K.sv;if(!sv)return false;let mv=false;const ez=(o,tg,up,dn)=>{if(RM){o.pr=tg;return;}o.pr+=(tg-o.pr)*Math.min(1,dt*(tg?up:dn));if(Math.abs(tg-o.pr)<.004)o.pr=tg;};
  // 1) budowniczy
  const b=sv.b,bt=T-b.t0;
  if(bt<b.dur){mv=true;const up=ease.outBack(clamp(bt/.35))*(1-ease.inQ(clamp((bt-(b.dur-.35))/.35))),wu=clamp((bt-.35)/(b.dur-.7)),x=lerp(b.x0,b.x1,wu),y=lerp(b.yHide,b.yUp,up);
    const ph=(bt-.35)/.14,hitA=Math.max(0,Math.sin(ph*Math.PI*2)),hand=[78,-250-60*hitA];
    b.P.set({x,y,s:b.s,aL:[-74,-150],aR:hand,mo:false,hr:0});b.ham.setAttribute('transform',`translate(${f1(hand[0])} ${f1(hand[1])}) rotate(${f1(-50+80*(1-hitA))})`);
    b.merl.forEach(m=>{if(wu>0&&x>=m.x-6&&(m.t===null||m.t<b.t0)){m.t=T;trail(L.fx,m.x,b.c.t-18,.12);}});}
  else if(!b.parked){b.parked=true;b.P.set({x:b.x1,y:b.yHide,s:b.s,aL:[-74,-150],aR:[78,-250],mo:false,hr:0});}
  if(bt<b.dur)b.parked=false;
  b.merl.forEach(m=>{if(m.t===null)return;const a=T-m.t;if(a<.45)mv=true;const k=a<.45?ease.outBack(clamp(a/.3)):1;op(m.g,1);place(m.g,m.x,b.c.t+2,k,0,Math.max(.001,k));});
  // 2) przebudowa: łaty odpadają, chatka nowa, karta odświeżona
  const f=sv.f,ft=F.c1?1:0;ez(f,ft,3.2,2.4);if(f.pr!==ft)mv=true;
  f.patches.forEach((p,i)=>{const k=clamp(f.pr*1.35-i*.08),ps=.2*clamp(b.c.w/380,.72,1.1);place(p.w,p.x+p.dx*70*k,p.y+(p.dy*50-40)*k+90*k*k,ps,(p.dx||1)*170*k);op(p.w,1-k);});
  f.H.clipC.forEach((c,i)=>{const cc=[[-150,-300],[130,-160],[0,-520]][i];c.setAttribute('cx',cc[0]);c.setAttribute('cy',cc[1]);c.setAttribute('r',f1(720*clamp(f.pr*1.25-i*.1)));});
  const fr=f.pr>.5;if(f.fresh!==fr){f.fresh=fr;f.el.classList.toggle('fresh',fr);if(fr)sparkles(L.fx,f.c.r-58,f.c.t-40,8,.7);}
  // 3) SEO: Syrenka wynurza się i podnosi kartę
  const sq=sv.s,st=F.c2?1:0;ez(sq,st,4,3);if(sq.pr!==st)mv=true;
  const lift=74*sq.k*ease.outBack(clamp(sq.pr)),SY=sq.S,y=sq.c.b-lift+372*sq.s;sq.el.style.transform='';
  const hL=[-92,-372],hR=[92,-372];SY.armL([-58,-160],hL,-30);SY.armR([58,-160],hR,40);tl(SY.hL,hL[0],hL[1]);tl(SY.hR,hR[0],hR[1]);
  place(SY.g,sq.x,y,sq.s);
  if(sq.pr>.08&&!sq.splash){sq.splash=true;sparkles(L.fx,sq.x,sq.wy,9,.7,['#9fe7ff','#ffffff','#6cc8ff']);}if(sq.pr<.02)sq.splash=false;
  // 4) smok przy „Zobacz pełny cennik”
  const dd=sv.d;if(dd){const dt2=F.ap?1:0;ez(dd,dt2,5,7);if(dd.pr!==dt2)mv=true;const shown=dd.pr>0;
    if(shown||dd.wasShown){dd.wasShown=shown;dd.D.set({x:dd.x,y:dd.base+lerp(620,0,ease.outBack(clamp(dd.pr)))*dd.s,s:dd.s,look:1,hr:6,mouth:dd.pr>.6?1:0,eyes:1,happy:true,wf:0,aL:[-175,-70],aR:[175,-70],bob:0});}
    const hot=dd.pr>.6;if(dd.hot!==hot){dd.hot=hot;if(hot)dd.fireT=T;}
    const fa=T-dd.fireT;if(fa<.55){mv=true;if(T-dd.lastSp>.03){dd.lastSp=T;trail(L.fx,lerp(dd.ap.l,dd.ap.r,fa/.55),dd.ap.b+2,.13);}}}
  return mv;}

/* ================= sekcja SEO: klient wpisuje hasło, detektyw sprawdza stronę ================= */
function buildSeo(){K.seo=null;serp.classList.remove('loading');sq.textContent=QUERY;sMe.classList.remove('ok');sRes.forEach(el=>el.style.transform='');
  const sp=RC.serp,R3=RC.sres;if(!sp||!R3||R3.length<3||!sp.w)return;const k=clamp(sp.w/470,.72,1.1),g=L.seo,o={};
  const gap=R3[1].t-R3[0].b;o.D0=R3[0].h+gap;o.D1=R3[1].h+R3[2].h+2*gap;
  // 1) „Czym jest SEO?”: klient za górną krawędzią wyników wpisuje hasło, „twojafirma.pl” wspina się na 1. miejsce
  const cs=.27*k,et=sp.t;const cp=E('clipPath',{id:'seoClip1',clipPathUnits:'userSpaceOnUse'},K.defs);E('rect',{x:f1(sp.l-120),y:f1(et-320),width:f1(sp.w+240),height:321},cp);
  const cw=gg(g,{'clip-path':'url(#seoClip1)'});const C=person(cw,{shirt:'#ff6b8f',hair:'#3b2f22',pants:'#3b4a8a'});setsw(C.g,OUTL/cs);
  const ph=gg(C.g);E('rect',{x:-26,y:-44,width:52,height:84,rx:10,fill:'#2d2650',class:'o'},ph);E('rect',{x:-17,y:-34,width:34,height:58,rx:4,fill:'#9fe7ff'},ph);
  o.c={P:C,ph,s:cs,x:sp.l+70*k,yHide:et+430*cs,yUp:et+175*cs,pr:0,was:true};
  o.w={t0:-99,dur:2.1,popped:true,done:true};
  K.seo=o;}
function seoGo(){const w=K.seo&&K.seo.w;if(!w||RM)return;if(T-w.t0<w.dur)return;w.t0=T;w.popped=false;w.done=false;kick(w.dur+.3);}
function auditGo_(){const d=K.seo&&K.seo.d;if(!d)return;if(RM){d.t0=T-d.dur;return;}if(T-d.t0<d.dur||d.pr>.3)return;d.t0=T;d.ok=false;kick(d.dur+.6);}
function updSeo(dt){const o=K.seo;if(!o)return false;let mv=false;const ez=(p,tg,up,dn)=>{if(RM){p.pr=tg;return;}p.pr+=(tg-p.pr)*Math.min(1,dt*(tg?up:dn));if(Math.abs(tg-p.pr)<.004)p.pr=tg;};
  // 1) wyszukiwanie i wspinaczka wyniku
  const w=o.w,a=T-w.t0;let off=[0,0,0];
  if(a<w.dur){mv=true;serp.classList.toggle('loading',a<.85);typeTo(sq,QUERY,a,.12,.8);
    const u=a<.95?0:ease.outBack(clamp((a-.95)/.6));off=[o.D1*(1-u),-o.D0*(1-u),-o.D0*(1-u)];
    if(a>=1.5&&!w.popped){w.popped=true;const r=RC.sres[0];sparkles(L.fx,r.r-48,r.t+26,9,.6);}}
  else if(!w.done){w.done=true;serp.classList.remove('loading');sq.textContent=QUERY;}
  sRes.forEach((el,i)=>{const v=off[i];el.style.transform=Math.abs(v)>.3?`translateY(${f1(v)}px)`:'';});
  const c=o.c,ct=F.sw?1:0;ez(c,ct,5,4);if(c.pr!==ct)mv=true;
  if(c.pr>0||c.was){c.was=c.pr>0;const typing=a>=0&&a<.9,cheer=a>=1.5,j=typing?Math.sin(a*42):0;
    const aL=cheer?[-118,-400]:[-30,-218+7*j],aR=cheer?[118,-400]:[30,-218-7*j];
    c.P.set({x:c.x,y:lerp(c.yHide,c.yUp,ease.outBack(clamp(c.pr))),s:c.s,aL,aR,mo:cheer,hr:cheer?0:(a>=.9?8:4)});
    op(c.ph,cheer?0:1);c.ph.setAttribute('transform','translate(0 -236)');}
  return mv;}

/* ================= dalsze sekcje: postać wychodzi zza górnej krawędzi karty, gdy najedziesz na kartę / tekst ================= */
function propG(p,kind){const g=gg(p);
  if(kind==='list'){E('rect',{x:-50,y:-34,width:100,height:68,rx:8,fill:'#fff',class:'o'},g);E('path',{d:'M -50 -28 L 0 8 L 50 -28',fill:'none',class:'ln'},g);E('circle',{cx:0,cy:12,r:9,fill:'#ff6b8f',class:'o2'},g);}
  else if(kind==='projekt'){E('rect',{x:-60,y:-44,width:120,height:88,rx:6,fill:'#fff8e6',class:'o'},g);E('rect',{x:-46,y:-30,width:48,height:34,rx:4,fill:'#c9b6ff',class:'o2'},g);E('path',{d:'M 14 -24 h 30 M 14 -8 h 30 M -46 22 h 92',class:'ln'},g);}
  else if(kind==='olowek'){E('path',{d:'M -12 56 L -12 -40 L 0 -66 L 12 -40 L 12 56 Z',fill:'#ffd23f',class:'o'},g);E('path',{d:'M -12 -40 L 12 -40',class:'ln'},g);E('rect',{x:-12,y:46,width:24,height:18,rx:4,fill:'#ff7aa8',class:'o2'},g);}
  else if(kind==='rakieta'){E('path',{d:'M 0 -78 Q 34 -44 28 22 L -28 22 Q -34 -44 0 -78 Z',fill:'#fff',class:'o'},g);E('circle',{cx:0,cy:-24,r:13,fill:'#9fe7ff',class:'o2'},g);E('path',{d:'M -28 4 L -48 38 L -26 28 Z M 28 4 L 48 38 L 26 28 Z',fill:'#ff6b8f',class:'o2'},g);g.fl=E('path',{d:'M -15 24 Q 0 74 15 24 Z',fill:'#ffd23f',class:'o2'},g);}
  else if(kind==='zarowka'){E('circle',{cx:0,cy:-18,r:38,fill:'#fff3a0',class:'o'},g);E('rect',{x:-18,y:16,width:36,height:26,rx:6,fill:'#b9b3cc',class:'o2'},g);E('path',{d:'M -12 -16 q 12 -18 24 0',class:'ln'},g);}
  else if(kind==='mlotek'){E('path',{d:'M 0 64 L 0 -30',stroke:OUT,'stroke-width':20,'stroke-linecap':'round'},g);E('path',{d:'M 0 64 L 0 -30',stroke:'#b5804f','stroke-width':11,'stroke-linecap':'round'},g);E('rect',{x:-40,y:-60,width:80,height:34,rx:7,fill:'#8c8aa3',class:'o'},g);}
  else if(kind==='laptop'){E('rect',{x:-58,y:-54,width:116,height:74,rx:8,fill:'#2d2650',class:'o'},g);E('rect',{x:-47,y:-44,width:94,height:55,rx:4,fill:'#9fe7ff'},g);E('path',{d:'M -38 -28 h 32 M -38 -13 h 54 M -38 2 h 22',stroke:'#2d2650','stroke-width':5,'stroke-linecap':'round'},g);E('rect',{x:-70,y:20,width:140,height:13,rx:5,fill:'#8c8aa3',class:'o2'},g);}
  else if(kind==='liczydlo'){E('rect',{x:-58,y:-46,width:116,height:88,rx:8,fill:'#b5804f',class:'o'},g);for(let r=0;r<3;r++){E('path',{d:`M -46 ${-22+r*24} h 92`,stroke:OUT,'stroke-width':3},g);for(let k=0;k<4;k++)E('circle',{cx:-32+k*16+(r%2)*12,cy:-22+r*24,r:7,fill:['#ff6b8f','#ffd23f','#7cf2c8'][r],class:'o2'},g);}}
  else if(kind==='pytanie'){E('circle',{r:44,fill:'#ffd23f',class:'o'},g);E('path',{d:'M -14 -12 q 0 -18 15 -18 q 16 0 16 15 q 0 12 -15 17 l 0 10',fill:'none',stroke:OUT,'stroke-width':9,'stroke-linecap':'round','stroke-linejoin':'round'},g);E('circle',{cx:1,cy:26,r:5.5,fill:OUT},g);}
  return g;}
let peekN=0;
function peeker(g,top,l,r,x,s,look,kind){const id='pk'+(++peekN),cp=E('clipPath',{id,clipPathUnits:'userSpaceOnUse'},K.defs);
  E('rect',{x:f1(l),y:f1(top-700*s),width:f1(r-l),height:f1(700*s+1)},cp);
  const w=gg(g,{'clip-path':`url(#${id})`});const P=person(w,look);setsw(P.g,OUTL/s);const hand=[96,-300];
  const pg=propG(P.g,kind);pg.setAttribute('transform',`translate(${hand[0]+10} ${hand[1]-52})`);
  return {P,pg,s,x,yHide:top+450*s,yUp:top+170*s,pr:0,was:true,hand};}
function updPeek(o,on,dt){const tg=on?1:0;if(RM)o.pr=tg;else{o.pr+=(tg-o.pr)*Math.min(1,dt*(tg?5:4));if(Math.abs(tg-o.pr)<.004)o.pr=tg;}
  if(o.pr>0||o.was){o.was=o.pr>0;const up=o.pr>.85;o.P.set({x:o.x,y:lerp(o.yHide,o.yUp,ease.outBack(clamp(o.pr))),s:o.s,aL:up?[-104,-330]:[-60,-200],aR:o.hand,mo:up,hr:up?6:0});}
  return o.pr!==tg;}
function buildMore(){K.more=null;const g=L.more,o={st:[],ppl:[]};
  const looks=[{shirt:'#ff6b8f',hair:'#3b2f22',pants:'#3b4a8a'},{shirt:'#6fd36b',hair:'#8a5a3c',pants:'#4b3a6b'},{shirt:'#ffd23f',hair:'#2b2140',pants:'#3b4a8a'},{shirt:'#7cc4ff',cap:'#ff6b8f',hair:'#3b2f22',pants:'#4b3a6b'}];
  const kb=RC.ksend;if(kb&&kb.w){const bs=.45*Math.max(U,.8),w=gg(g),B=bird(w,'#8fa0c8');const env=gg(w);E('rect',{x:-38,y:30,width:76,height:52,rx:6,fill:'#fff',class:'o'},env);E('path',{d:'M -38 34 L 0 62 L 38 34',fill:'none',class:'ln'},env);
    E('path',{d:'M 0 12 L 0 30',class:'ln'},env);setsw(w,OUTL/bs);op(w,0);o.pg={g:w,B,bs,x0:DW+80,y0:kb.t-260,x1:Math.min(kb.r+60*bs/.45,DW-40),y1:kb.cy-26*bs/.45,pr:0,was:true};}
  K.more=o;}
function updMore(dt){const o=K.more;if(!o)return false;let mv=false;
  const b=o.pg;if(b){const tg=F.ks?1:0;if(RM)b.pr=tg;else{b.pr+=(tg-b.pr)*Math.min(1,dt*(tg?2.6:2.2));if(Math.abs(tg-b.pr)<.004)b.pr=tg;}
    if(b.pr!==tg)mv=true;if(b.pr>0||b.was){b.was=b.pr>0;const u=ease.ioS(clamp(b.pr)),x=lerp(b.x0,b.x1,u),y=q2(b.y0,Math.min(b.y0,b.y1)-120,b.y1,u);
      birdFlap(b.B,b.pr>0&&b.pr<1?T*14:1.1);place(b.g,x,y,b.bs);op(b.g,b.pr>.02?1:0);}}
  return mv;}
/* ================= ruch świata ================= */
function updNight(dt){const st=dt/1.2;n=RM?nT:(n<nT?Math.min(nT,n+st):Math.max(nT,n-st));if(n===nPrev)return;nPrev=n;const u=ease.ioS(n);A.u=u;
  A.stops.forEach((s,i)=>s.setAttribute('stop-color',mixC(DAY[i],NIGHT[i],u)));op(G.stars,A.bgN?.55*u:u);if(A.bgN)op(A.bgN,u);op(A.nightRect,(A.bgN?0:BG?.92:.34)*u);if(A.tglow)op(A.tglow,.95*u);
  (A.houses||[]).forEach(h=>{op(h.glow,u);h.win.setAttribute('fill',mixC('#9fe7ff','#fff3a0',u));});}
function updOrb(){const o=A.orb,u=A.u;place(o.sun,o.x,o.y+u*o.d,o.s);op(o.sun,1-u);place(o.moon,o.x,o.y+(1-u)*o.d,o.s);op(o.moon,u);}
function updClouds(){A.clouds.forEach(c=>{place(c.g,c.x,c.y,c.s);op(c.g,hitsAny([{l:c.x-185*c.s,r:c.x+185*c.s,t:c.y-110*c.s,b:c.y+40*c.s}],A.TR)?.3:1);});}
function updIslands(){op(A.beam.g,A.u);A.beam.r.setAttribute('transform','rotate(-18)');op(A.tglow,.95*A.u);
  if(A.castle&&A.castle.update&&!A.castleBroken){try{A.castle.update(0,hit(T-(A.bellT||-9),3));}catch(e){A.castleBroken=true;}}}
function updLaj(){const lj=A.lj,L2=lj.S,x=lj.home,fB=[-60,-10],fF=[40,-10],hF=[110,-400],hB=[150,-380];
  L2.armB([-60,-480],hB,-40);L2.armF([60,-480],hF,40);L2.legB([-40,-120],fB,-20);L2.legF([40,-120],fF,20);
  tl(L2.bootB,fB[0],fB[1]);tl(L2.bootF,fF[0],fF[1]);tl(L2.handF,hF[0],hF[1]);tl(L2.handB,hB[0],hB[1]);L2.mace.setAttribute('transform',`translate(${hF[0]} ${hF[1]}) rotate(20)`);
  place(L2.g,x,backY(x)+6*U,lj.s);}
function updHut(){const h=A.hut,H2=h.H;place(H2.g,h.x,h.y-182*h.s,h.s);H2.clipC.forEach(c=>c.setAttribute('r',0));
  H2.patches.forEach(p=>{p.setAttribute('transform',p.o0);op(p,1);});H2.lights.forEach(l=>op(l,0));
  H2.smk.forEach((p,i)=>{const u=.12+i*.3;place(p,145,-660-u*260,.3+u*.6);op(p,(1-u)*.9);});}
function updSy(){const sy=A.sy,SY=sy.S,hR=[122,-300],hL=[-118,-40];SY.armL([-58,-160],hL,-30);SY.armR([58,-160],hR,40);tl(SY.hL,hL[0],hL[1]);tl(SY.hR,hR[0],hR[1]);
  SY.sword.setAttribute('transform',`translate(${hR[0]} ${hR[1]})`);op(SY.sword,1);op(SY.phone,0);op(SY.mo,0);op(SY.mc,1);place(SY.g,sy.x,sy.y,sy.s);}
function updDet(){const d=A.det,aR=[66,-150];d.P.set({x:d.x,y:d.y,s:d.s,aL:[-74,-118],aR,mo:false,hr:0});d.mg.setAttribute('transform',`translate(${aR[0]} ${aR[1]}) rotate(-20)`);}
function updTour(){const tu=A.tu,TU=tu.S,hR=[70,-260],hL=[-80,-250];TU.armL([-60,-360],hL,-30);TU.armR([60,-360],hR,30);tl(TU.hL,hL[0],hL[1]);tl(TU.hR,hR[0],hR[1]);
  op(TU.phone,0);op(TU.mouthO,0);op(TU.mouth,1);place(TU.g,tu.x,tu.y,tu.s);}
function updFX(){for(let i=FX.length-1;i>=0;i--){const f=FX[i],a=T-f.t0;if(a>f.life){if(f.keep)f.upd(1,f.life);else f.g.remove();FX.splice(i,1);}else f.upd(clamp(a/f.life),a);}}

/* klatki liczone tylko wtedy, gdy coś się dzieje; w spoczynku pętla stoi */
function kick(sec){busyUntil=Math.max(busyUntil,T+(sec||.2));if(!running&&ready){running=true;last=0;requestAnimationFrame(frame);}}
function frame(now){const dt=Math.min(.05,last?(now-last)/1000:0);last=now;T+=dt;
  if(A.dirty||n!==nT||n!==nPrev||T-(A.bellT||-9)<2){A.dirty=false;updNight(dt);if(!BG){updOrb();updClouds();updIslands();updLaj();updHut();updSy();updDet();updTour();}}
  if(K.dirty)K.dirty=false;
  let mv=updHeroNew();mv=updChest(dt)||mv;mv=updMascot(dt)||mv;mv=updServices(dt)||mv;mv=updSeo(dt)||mv;mv=updMore(dt)||mv;updFX();
  if(mv||T<busyUntil||FX.length||n!==nT)requestAnimationFrame(frame);else running=false;}
/* ================= zdarzenia: tylko przyciski i tekst ================= */
function build(){measure();anchorsFirst();buildScene();buildActors();A.dirty=true;K.dirty=true;kick(.3);}
const hov=(el,key,on,off)=>{const enter=e=>{F[key]=true;kick(.3);if(on)on(e);},leave=()=>{F[key]=false;kick(.3);if(off)off();};
  el.addEventListener('pointerenter',enter);el.addEventListener('pointerleave',leave);el.addEventListener('focus',enter);el.addEventListener('blur',leave);};
function wire(){
  addEventListener('pointermove',e=>{PD.x=e.pageX;PD.y=e.pageY;if(F.chest)kick(.2);},{passive:true});
  const mnav=q('#mnav'),setMenu=o=>{document.documentElement.classList.toggle('menu-open',o);menuBtn.setAttribute('aria-expanded',o?'true':'false');if(mnav)mnav.setAttribute('aria-hidden',o?'false':'true');};
  menuBtn.addEventListener('click',()=>setMenu(!document.documentElement.classList.contains('menu-open')));
  if(mnav)mnav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.documentElement.classList.contains('menu-open')){setMenu(false);menuBtn.focus();}});
  const topEl=q('#top'),solid=()=>{if(topEl)topEl.classList.toggle('solid',scrollY>40);};addEventListener('scroll',solid,{passive:true});solid();
  price.addEventListener('pointerenter',coinThrow);price.addEventListener('click',coinThrow);
  const touchy=e=>!!e&&(e.pointerType==='touch'||e.pointerType==='pen'||(e.type==='click'&&!matchMedia('(hover:hover)').matches));
  hov(em,'em',e=>heroGo('em',touchy(e)),()=>heroLeave('em'));em.addEventListener('click',e=>heroGo('em',touchy(e)));
  chips.forEach((c,i)=>{hov(c,'hc'+i,e=>heroGo('c'+i,touchy(e)),()=>heroLeave('c'+i));c.addEventListener('click',e=>heroGo('c'+i,touchy(e)));});
  hov(ctaMain,'cta');ctaMain.addEventListener('click',e=>ctaGo(e,false));
  hov(ctaPrice,'chest');
  lever.addEventListener('click',toggleNight);
  cards.forEach((c,i)=>hov(c,'c'+i,i===0?svcBuild:null));hov(allPrice,'ap');
  hov(seoWhat,'sw',seoGo);
  /* dalsze sekcje: karty kroków, motto, karty zespołu, pytania, formularz */
  const go=(el,k)=>{hov(el,k,e=>heroGo(k,touchy(e)),()=>heroLeave(k));el.addEventListener('click',e=>heroGo(k,touchy(e)));};
  qa('.step').forEach((el,i)=>go(el,'st'+i));
  const mbx=q('.motto-box');if(mbx)go(mbx,'mt');
  qa('.person').forEach((el,i)=>go(el,'pp'+i));
  [q('.ksend'),...qa('.kform input:not([type=hidden]):not(.honey),.kform textarea')].forEach(el=>el&&hov(el,'ks'));
  /* otwarte pytanie przesuwa wszystko niżej: postacie mierzą stronę od nowa */
  let tt=0;qa('.faql details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)hnPend={kind:'fq'+qa('.faql details').indexOf(d),auto:true};clearTimeout(tt);tt=setTimeout(()=>{if(ready)build();},120);}));
  let rt=0,lw=document.documentElement.clientWidth;new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{const w=document.documentElement.clientWidth,r=S.getBoundingClientRect();if(Math.abs(w-lw)<2&&Math.abs(r.height-H)<3)return;lw=w;if(ready)build();},160);}).observe(hero);
  window.V3={get T(){return T;},get K(){return K;},get A(){return A;},get RC(){return RC;},get running(){return running;},coinThrow,toggleNight,build};}
function openCurtain(){if(hero.classList.contains('open'))return;hero.classList.add('open');document.documentElement.classList.add('opened');AS.classList.add('on');introT=T+.8;kick(5);setTimeout(()=>{if(curtain)curtain.remove();},1900);}
function start(){wire();build();ready=true;kick(.5);
  if(RM){if(curtain)curtain.remove();hero.classList.add('open');document.documentElement.classList.add('opened');AS.classList.add('on');introT=-10;em.classList.add('shown');}
  else{curtain.addEventListener('click',openCurtain);setTimeout(openCurtain,650);}}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(start);
})();
