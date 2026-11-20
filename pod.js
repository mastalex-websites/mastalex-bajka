'use strict';
/* Mastalex – silnik bajkowych podstron.
   Krainy: każda sekcja ma swoją planszę (dzień/noc), ładowaną, gdy się zbliża.
   Historia: zwój „projekt Twojej strony” wędruje z góry na dół. Postać, która go dostała, robi swoje
   (przyczyna), a gdy następna kraina wchodzi w okno albo klikniesz postać, rzuca zwój dalej (skutek).
   Ostatnia postać oddaje go przyciskowi „Zamów bezpłatny projekt”, który się rozświetla.
   Postacie reagują na to, czego dotykasz w ich krainie (przyciski, nagłówki, karty, pytania). Bez ruchu na stronie nic nie liczy. */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const q=(s,r)=>(r||document).querySelector(s),qa=(s,r)=>[...(r||document).querySelectorAll(s)];
const DOC=document.documentElement,AS=q('#actors'),lever=q('#lever'),menuBtn=q('.menu'),topEl=q('.top'),main=q('#main');
const KR=qa('.kr'),M=window.MOTYWY||{};
const OUTL=3.2,SPK=['#fff6b0','#ffd23f','#ffc6e0','#c9f7ff'];
const gg=(p,a)=>E('g',a||{},p),f1=v=>(+v).toFixed(1);
const setsw=(el,px)=>{el.style.setProperty('--sw',px.toFixed(3)+'px');return el;};
const op=(el,v)=>el.setAttribute('opacity',clamp(v).toFixed(3));
const noHit=el=>{el.style.pointerEvents='none';return el;};
const q2=(a,c,b,t)=>(1-t)*(1-t)*a+2*t*(1-t)*c+t*t*b;
const inR=u=>u>=0&&u<1;
function dRect(el){const r=el.getBoundingClientRect();return {l:r.left+scrollX,t:r.top+scrollY,r:r.right+scrollX,b:r.bottom+scrollY,w:r.width,h:r.height,cx:r.left+scrollX+r.width/2,cy:r.top+scrollY+r.height/2};}
function retrig(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
let seed=11;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};

/* ---- plansze krain: obraz dopiero, gdy kraina jest blisko ---- */
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('wid');io.unobserve(e.target);}}),{rootMargin:'100px 0px'});KR.filter(k=>!k.classList.contains('kr-wstep')).forEach(k=>io.observe(k));}
else KR.forEach(k=>k.classList.add('wid'));

/* ---- dzień / noc (zapamiętane) ---- */
function setNight(on){DOC.classList.toggle('night',on);lever.setAttribute('aria-pressed',on?'true':'false');try{localStorage.setItem('mx-noc',on?'1':'0');}catch(e){}}
lever.setAttribute('aria-pressed',DOC.classList.contains('night')?'true':'false');
lever.addEventListener('click',()=>{setNight(!DOC.classList.contains('night'));kick(.3);});
/* ---- menu na wąskich ekranach ---- */
const mnav=q('#mnav'),setMenu=o=>{DOC.classList.toggle('menu-open',o);menuBtn.setAttribute('aria-expanded',o?'true':'false');if(mnav)mnav.setAttribute('aria-hidden',o?'false':'true');};
menuBtn.addEventListener('click',()=>setMenu(!DOC.classList.contains('menu-open')));
if(mnav)mnav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&DOC.classList.contains('menu-open')){setMenu(false);menuBtn.focus();}});
const solid=()=>topEl.classList.toggle('solid',scrollY>40);addEventListener('scroll',solid,{passive:true});solid();

/* ---- warstwa nad treścią: zwój i iskry (postacie są pod panelami, zwój leci nad nimi) ---- */
const FS=document.createElementNS('http://www.w3.org/2000/svg','svg');FS.id='fly';FS.setAttribute('aria-hidden','true');FS.classList.add('lay');AS.classList.add('lay');
document.body.appendChild(FS);

/* ---- cel historii ---- */
const finalBtn=(()=>{const c=qa('.pcta .btn-primary');if(c.length)return c[c.length-1];const f=q('.pform .btn-primary');if(f)return f;const a=qa('main .btn-primary');return a.length?a[a.length-1]:null;})();
const FIN=finalBtn?KR.indexOf(finalBtn.closest('.kr')):KR.length-1;
const S={holder:-1,done:false,started:false,pend:{},acted:{}};
let T=0,last=0,running=false,busyUntil=0,ready=false,DW=0,DH=0,L={},ACT=[],PAR=null,defs=null,SC=null;const FX=[];

/* ---- efekty ---- */
function addFX(g,life,upd){const f={g,t0:T,life,upd};FX.push(f);return f;}
function updFX(){for(let i=FX.length-1;i>=0;i--){const f=FX[i],a=T-f.t0;if(a>f.life){f.g.remove();FX.splice(i,1);}else f.upd(clamp(a/f.life),a);}}
function sparkles(x,y,nn,s,cols){if(RM)return;cols=cols||SPK;for(let i=0;i<nn;i++){const o=noHit(gg(L.fx));const sp=spark(o);sp.setAttribute('fill',cols[i%cols.length]);
  const a=i/nn*Math.PI*2+R()*.4,v=(60+R()*70)*s,sc=(.2+R()*.16)*s;setsw(o,1.8/sc);const r0=R()*90;
  addFX(o,.8,(u,t)=>{place(o,x+Math.cos(a)*v*t,y+Math.sin(a)*v*t+30*t*t,Math.max(.001,sc*(1-u*.8)),r0+t*200);op(o,1-u*u);});}}
function trail(x,y,sz){if(RM)return;const o=noHit(gg(L.fx));const sp=spark(o);sp.setAttribute('fill',SPK[(R()*4)|0]);const s=sz*(.8+R()*.5);setsw(o,1.6/s);
  const vx=(R()-.5)*40,vy=20+R()*30,r0=R()*90;addFX(o,.8,(u,a)=>{place(o,x+vx*a,y+vy*a,Math.max(.001,s*(1-u*.9)),r0+a*180);op(o,1-u*u);});}
function confetti(x,y,nn){if(RM)return;const cols=['#ff6b8f','#ffd23f','#7cf2c8','#c9b6ff','#6fd36b','#9fe7ff'];for(let i=0;i<nn;i++){const o=noHit(gg(L.fx));
  E('rect',{x:-6,y:-3.5,width:12,height:7,rx:2,fill:cols[i%cols.length],stroke:OUT,'stroke-width':1.4},o);
  const a=-Math.PI/2+(R()-.5)*2.4,v=260+R()*300,r0=R()*360,vr=(R()-.5)*900,ph=R()*6;
  addFX(o,1.7,(u,t)=>{place(o,x+Math.cos(a)*v*t,y+Math.sin(a)*v*t+520*t*t,1,r0+vr*t,Math.cos(t*10+ph));op(o,1-u*u);});}}
function parcelG(p){const g=gg(p);
  E('rect',{x:-46,y:-22,width:92,height:44,rx:6,fill:'#fff6dc',class:'o'},g);E('path',{d:'M -30 -8 h 40 M -30 4 h 52',stroke:'#c9b6ff','stroke-width':5,'stroke-linecap':'round'},g);
  E('rect',{x:-60,y:-28,width:18,height:56,rx:9,fill:'#e2c487',class:'o2'},g);E('rect',{x:42,y:-28,width:18,height:56,rx:9,fill:'#e2c487',class:'o2'},g);
  E('path',{d:'M 18 -22 L 18 22',stroke:'#6a3fd6','stroke-width':9},g);E('circle',{cx:18,cy:0,r:11,fill:'#ffd23f',class:'o2'},g);return g;}

/* ---- pomiar i budowa ---- */
function anchorOf(kr){return q('.pan,.kform-wrap,.kafel-link,.lista-siatka>li.kafel,.siatka>li.kafel',kr);}
function measure(){AS.style.height='0px';FS.style.height='0px';DW=DOC.clientWidth;DH=Math.max(document.body.scrollHeight,DOC.scrollHeight);
  [AS,FS].forEach(s=>{s.style.height=DH+'px';s.setAttribute('width',DW);s.setAttribute('height',DH);});}
function build(){
  if(PAR&&PAR.fly){if(PAR.fly.to==='cta')finish(true);else S.holder=PAR.fly.to;}
  measure();AS.textContent='';FS.textContent='';defs=E('defs',{},AS);L.act=gg(AS);L.par=gg(FS);L.fx=noHit(gg(FS));FX.length=0;
  const k=clamp(DW/1440,.62,1);ACT=[];
  KR.forEach((kr,i)=>{const th=M[kr.dataset.motyw],an=anchorOf(kr);const r=an&&dRect(an);if(!th||!r||!r.w){ACT.push(null);return;}
    const s=th.bs*k*1.18,dir=i%2?1:-1,out=th.ext[0]*s,fr=th.ext[1]*s;
    let x=dir<0?r.r-14-out:r.l+14+out;x=dir<0?clamp(x,fr+6,DW-out-6):clamp(x,out+6,DW-fr-6);
    const root=gg(L.act);root.classList.add('hit');setsw(root,OUTL/s);place(root,x,r.t+3,s*dir,0,s);
    const A={i,kr,an,th,x,y:r.t+3,s,dir,root,aT:-9,pT:-9,thT:-9,holdT:T,lk:0,dirty:true,aDur:RM?.01:th.aDur};
    Object.defineProperty(A,'pend',{get:()=>!!S.pend[i],set:v=>{S.pend[i]=v;}});Object.defineProperty(A,'acted',{get:()=>!!S.acted[i],set:v=>{S.acted[i]=v;}});
    try{A.obj=th.build(gg(root),{s,defs,uid:'m'+i});}catch(e){root.remove();ACT.push(null);return;}
    root.addEventListener('pointerdown',e=>{e.preventDefault();actorClick(A);});ACT.push(A);});
  if(S.holder<0||!ACT[S.holder]){let j=Math.max(0,S.holder);while(j<ACT.length&&!ACT[j])j++;S.holder=j<ACT.length?j:-1;}
  PAR=null;
  if(S.holder>=0&&!S.done){const ps=.42*k;PAR={g:parcelG(L.par),ps,fly:null};setsw(PAR.g,OUTL/ps);
    if(!S.started){S.started=true;ACT[S.holder].pend=true;}}
  ACT.forEach(A=>A&&A.obj.draw(stOf(A)));if(SC)try{SC.onBuild();}catch(e){SC=null;}updParcel();kick(.3);}

/* ---- stan postaci ---- */
function stOf(A){const a=(T-A.aT)/A.aDur,p=RM?-1:(T-A.pT)/.9,th=RM?-1:(T-A.thT)/.7;
  return {T,a:inR(a)?a:-1,p:inR(p)?p:-1,th:inR(th)?th:-1,hold:!!PAR&&!PAR.fly&&!S.done&&S.holder===A.i,lk:A.lk,done:S.done&&A.i===FIN};}
function updActor(A){if(!!A.away!==!!A.awS){A.awS=!!A.away;A.root.style.transition='opacity .3s';A.root.style.opacity=A.away?'0':'';A.root.style.pointerEvents=A.away?'none':'';}
  const st=stOf(A),busy=st.a>=0||st.p>=0||st.th>=0;if(busy||A.dirty||A.was){A.dirty=false;A.obj.draw(st);}A.was=busy;return busy;}
function handG(A,st){const h=A.obj.hand(st||stOf(A));return [A.x+h[0]*A.s*A.dir,A.y+h[1]*A.s];}
const visible=A=>A.y>scrollY+60&&A.y-120*A.s<scrollY+innerHeight-30;
function ctaVisible(){if(!finalBtn)return true;const r=finalBtn.getBoundingClientRect();return r.top>40&&r.bottom<innerHeight-20;}

/* ---- historia ---- */
function startAct(A){if(!A)return;A.aT=T;A.pend=false;A.acted=true;kick(A.aDur+.3);
  if(A.i===FIN&&S.holder===A.i&&!S.done){A.ctaAfter=T+A.aDur+.2;kick(A.aDur+.6);}}
function nextOf(i){let j=i+1;while(j<=FIN&&!ACT[j])j++;return j<=FIN?j:-1;}
function pass(i){const A=ACT[i];if(!A||A.away||!PAR||PAR.fly||S.done||S.holder!==i||A.throwing)return;{const nj=i>=FIN?-1:nextOf(i);if(nj>=0&&ACT[nj]&&ACT[nj].away)return;}A.thT=T;A.throwing=true;A.dirty=true;kick(1);}
function launchFrom(A){const [x0,y0]=handG(A);let to,x1,y1;const j=A.i>=FIN?-1:nextOf(A.i);
  if(j<0){if(!finalBtn){finish();return;}to='cta';const r=dRect(finalBtn);x1=r.r-34;y1=r.cy;}
  else{to=j;const B=ACT[j];[x1,y1]=handG(B,Object.assign(stOf(B),{hold:true}));}
  const dist=Math.hypot(x1-x0,y1-y0),dur=RM?.01:clamp(dist/1150,.8,1.8);
  const cx=(x0+x1)/2+(x1>x0?-1:1)*Math.min(180,dist*.16),cy=Math.min(y0,y1)-Math.min(240,70+dist*.12);
  PAR.fly={x0,y0,x1,y1,cx,cy,t0:T,dur,to,spin:(x1>x0?1:-1)*540};A.dirty=true;kick(dur+.3);}
function arrive(j){const B=ACT[j];S.holder=j;if(!B)return;B.holdT=T;B.dirty=true;const [hx,hy]=handG(B);sparkles(hx,hy,8,.6);
  if(visible(B))startAct(B);else B.pend=true;kick(.6);}
function finish(silent){S.done=true;if(finalBtn){finalBtn.classList.add('cel');if(!silent){const r=dRect(finalBtn);sparkles(r.r-30,r.cy,12,.9);confetti(r.cx,r.t,26);}}
  if(PAR)op(PAR.g,0);const F=ACT[FIN];if(F)F.dirty=true;kick(1.8);}
function checkAuto(){if(!PAR||PAR.fly||S.done)return;if(SC)try{if(SC.busy())return;}catch(e){}const h=S.holder,A=ACT[h];if(!A)return;const vy=scrollY,vh=innerHeight;
  if(A.pend&&T>.5&&(visible(A)||h>=FIN&&!A.away&&ctaVisible()))startAct(A);
  if(A.throwing)return;
  if(h>=FIN){if(A.pend&&A.y<vy-200&&finalBtn&&finalBtn.getBoundingClientRect().bottom<0){A.pend=false;finish(true);return;}
    if(A.ctaAfter&&T>=A.ctaAfter){if(ctaVisible()){A.ctaAfter=0;pass(h);}
      else if(finalBtn&&finalBtn.getBoundingClientRect().bottom<0){A.ctaAfter=0;finish(true);}}return;}
  const j=nextOf(h);if(j<0)return;const B=ACT[j];
  /* szybkie przewijanie: zwój przeskakuje do krainy tuż nad oknem, żeby lot było widać */
  if(A.y<vy-vh*.6&&B.y<vy+vh*.25){let m=j;for(;;){const n=nextOf(m);if(n<0||ACT[n].y>=vy+vh*.25)break;m=n;}
    S.holder=m;const H=ACT[m];H.holdT=T;H.acted=false;H.pend=true;H.dirty=true;A.dirty=true;
    if(m>=FIN&&!visible(H)){H.pend=true;}return;}
  if(B.y<vy+vh*.85&&T-A.holdT>.6&&(A.acted&&T-A.aT>A.aDur*.8||A.y<vy+vh*.3))pass(h);}
function updParcel(){if(!PAR)return false;const P=PAR;
  if(P.fly){const f=P.fly,u=clamp((T-f.t0)/f.dur),e=ease.ioS(u),x=q2(f.x0,f.cx,f.x1,e),y=q2(f.y0,f.cy,f.y1,e);
    place(P.g,x,y,P.ps,f.spin*e);op(P.g,1);if(T-(P.lt||0)>.045){P.lt=T;trail(x,y,.13);}
    if(u>=1){const to=f.to;P.fly=null;if(to==='cta')finish();else arrive(to);}return true;}
  const A=ACT[S.holder];if(S.done||!A||A.away){op(P.g,0);return false;}
  const [hx,hy]=handG(A);place(P.g,hx,hy,P.ps,-10*A.dir);op(P.g,1);return false;}
function actorClick(A){if(RM)return;
  if(PAR&&!PAR.fly&&!S.done&&S.holder===A.i){if(!A.acted||inR((T-A.aT)/A.aDur)){startAct(A);return;}
    if(A.i>=FIN){A.ctaAfter=0;pass(A.i);}else pass(A.i);return;}
  startAct(A);const [hx,hy]=handG(A);sparkles(hx,hy-20,6,.5);}

/* ---- pętla: liczy tylko, gdy coś się dzieje ---- */
function kick(sec){busyUntil=Math.max(busyUntil,T+(sec||.2));if(!running&&ready){running=true;last=0;requestAnimationFrame(frame);}}
function frame(now){const dt=Math.min(.05,last?(now-last)/1000:0);last=now;T+=dt;
  checkAuto();const H=ACT[S.holder];if(H&&H.throwing&&T-H.thT>=(RM?0:.32)&&PAR&&!PAR.fly){H.throwing=false;launchFrom(H);}
  let mv=false;for(const A of ACT)if(A)mv=updActor(A)||mv;mv=updParcel()||mv;if(SC)try{mv=SC.frame()||mv;}catch(e){SC=null;}updFX();
  if(mv||T<busyUntil||FX.length)requestAnimationFrame(frame);else running=false;}

/* ---- strona → postacie ---- */
let lastEl=null,lastKafel=null;
function react(t){if(!(t instanceof Element))return;if(SC)try{SC.hover(t);}catch(e){}const el=t.closest('a,button,summary,input,textarea,label,.kafel,.kafel-link,h1,h2,h3,.knum,.znak,.plak,tr,.cena-duza');
  if(!el||el===lastEl)return;lastEl=el;const kr=el.closest('.kr');if(!kr)return;const A=ACT[KR.indexOf(kr)];
  if(!A)return;const r=dRect(el);A.lk=clamp((r.cx-A.x)/420,-1,1)*A.dir;A.dirty=true;
  if(el.closest('.btn-primary')){if(!inR((T-A.aT)/A.aDur))startAct(A);}
  else if(!inR((T-A.pT)/.9)&&!inR((T-A.aT)/A.aDur))A.pT=T;
  kick(1);}
function wire(){
  main.addEventListener('pointerover',e=>react(e.target),{passive:true});
  main.addEventListener('focusin',e=>react(e.target));
  main.addEventListener('pointerleave',()=>{lastEl=null;});
  addEventListener('scroll',()=>kick(.15),{passive:true});
  /* odhaczony punkt listy: postać krainy się cieszy */
  main.addEventListener('change',e=>{const t=e.target;if(!(t instanceof HTMLInputElement)||t.type!=='checkbox'||!t.checked)return;
    const A=ACT[KR.indexOf(t.closest('.kr'))];const r=dRect(t);sparkles(r.cx,r.cy,7,.5);if(SC)try{SC.ticked(t);}catch(e){}if(A&&!inR((T-A.aT)/A.aDur))startAct(A);kick(.9);});
  /* pytanie otwarte: postać krainy się cieszy, a strona rośnie, więc liczymy miejsca od nowa */
  let tt=0;qa('.faql details').forEach(d=>d.addEventListener('toggle',()=>{const A=ACT[KR.indexOf(d.closest('.kr'))];
    if(d.open){if(SC)try{SC.faq(d);}catch(e){}if(A)startAct(A);}
    clearTimeout(tt);tt=setTimeout(()=>{if(ready)build();},140);}));
  let rt=0,lw=DOC.clientWidth,lh=0;new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{const w=DOC.clientWidth,h=main.offsetHeight;if(Math.abs(w-lw)<2&&Math.abs(h-lh)<3)return;lw=w;lh=h;if(ready)build();},160);}).observe(main);
  window.POD={get T(){return T;},get S(){return S;},get ACT(){return ACT;},get PAR(){return PAR;},get SC(){return SC;},build,pass,startAct};}
function start(){if(window.SCENY)try{SC=window.SCENY({get T(){return T;},get ACT(){return ACT;},get S(){return S;},get L(){return L;},get FS(){return FS;},get DW(){return DW;},kick,addFX,sparkles,confetti,handG});}catch(e){SC=null;}
  wire();ready=true;build();AS.classList.add('on');kick(1);}
(document.fonts?.ready||Promise.resolve()).then(()=>{
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:900});
    else setTimeout(start,0);
  }));
});
})();
