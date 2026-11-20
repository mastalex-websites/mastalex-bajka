'use strict';
/* Wspólny silnik: kamera, paralaksa, kontury, napisy kinetyczne, tabliczka z wersem. Scena = obiekt SC. */
const NS='http://www.w3.org/2000/svg', OUT='#1c1336', R2D=Math.PI/180;
const $=id=>document.getElementById(id);
function E(tag,a,p){const e=document.createElementNS(NS,tag);if(a)for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const ease={lin:u=>u,inQ:u=>u*u,outQ:u=>1-(1-u)*(1-u),inC:u=>u*u*u,outC:u=>1-Math.pow(1-u,3),
  ioC:u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,ioS:u=>u*u*(3-2*u),outQuart:u=>1-Math.pow(1-u,4),
  outBack:u=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2);}};
const hit=(dt,k=9)=>(dt<0||dt>3)?0:Math.exp(-dt*k);
function hex(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function mixC(a,b,u){u=clamp(u);const A=hex(a),B=hex(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],u)).toString(16).padStart(2,'0')).join('');}
let _s=4242;const rnd=()=>{_s=(_s*16807)%2147483647;return (_s-1)/2147483646;};
const place=(g,x,y,s,r,sy)=>g.setAttribute('transform',`translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) rotate(${(r||0).toFixed(2)}) scale(${(+s).toFixed(3)} ${(sy===undefined?s:sy).toFixed(3)})`);
function popS(t,t0,t1){if(t<t0)return 0;const a=ease.outBack(seg(t,t0,t0+0.16));const b=t1?1-ease.inQ(seg(t,t1,t1+0.12)):1;return Math.max(0,a*b);}
function mixP(a,b,u){return {x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u),z:Math.exp(lerp(Math.log(a.z),Math.log(b.z),u))};}
function kf(K,t){let a=K[0];if(t<=a.t)return a;for(let i=1;i<K.length;i++){const b=K[i];if(t<=b.t)return mixP(a,b,ease[b.e||'ioS'](seg(t,a.t,b.t)));a=b;}return a;}
function blob(parent,shapes,fill){const g=E('g',{},parent);const go=E('g',{fill:OUT,class:'ob'},g),gf=E('g',{fill},g);
  for(const [tag,a] of shapes){E(tag,a,go);E(tag,a,gf);}return g;}
function burst(p,txt,size,fill,tcol){const g=E('g',{},p);let d='';
  for(let i=0;i<18;i++){const a=i*Math.PI/9,r=(i%2?0.6:1)*size;d+=(i?'L':'M')+(Math.cos(a)*r*1.3).toFixed(1)+' '+(Math.sin(a)*r).toFixed(1);}
  E('path',{d:d+'Z',fill:fill||'#fff6b0',class:'o'},g);
  const t=E('text',{x:0,y:size*0.2,'text-anchor':'middle','font-family':'Impact','font-size':size*0.6,fill:tcol||OUT,'letter-spacing':1},g);t.textContent=txt;return g;}
function sbub(p,txt,size,col,w0){const g=E('g',{},p);const w=w0||txt.length*size*0.5+60,h=size*1.3;
  blob(g,[['rect',{x:-w/2,y:-h-26,width:w,height:h,rx:h/2}],['path',{d:'M -14 -30 L 6 0 L 18 -30 Z'}]],'#ffffff');
  const t=E('text',{x:0,y:-26-h/2+size*0.36,'text-anchor':'middle','font-family':'Impact','font-size':size,fill:col||OUT,'letter-spacing':1},g);t.textContent=txt;return g;}
function heart(p,col){return E('path',{d:'M 0 18 C -30 -2 -34 -26 -16 -32 C -6 -35 0 -26 0 -20 C 0 -26 6 -35 16 -32 C 34 -26 30 -2 0 18 Z',fill:col||'#ff6b9a',class:'o2'},p);}
function spark(p){return E('path',{d:'M 0 -22 Q 4 -4 22 0 Q 4 4 0 22 Q -4 4 -22 0 Q -4 -4 0 -22 Z',fill:'#fff6b0',class:'o2'},p);}
function mLogo(p,s){const g=E('g',{},p);
  E('rect',{x:-60,y:-55,width:120,height:110,rx:30,fill:'#6a3fd6',class:'o'},g);
  E('path',{d:'M -36 32 L -36 -26 L 0 8 L 36 -26 L 36 32',fill:'none',stroke:OUT,'stroke-width':26,'stroke-linejoin':'round','stroke-linecap':'round'},g);
  E('path',{d:'M -36 32 L -36 -26 L 0 8 L 36 -26 L 36 32',fill:'none',stroke:'#ffffff','stroke-width':15,'stroke-linejoin':'round','stroke-linecap':'round'},g);
  E('circle',{cx:-18,cy:-34,r:6,fill:'#fff',class:'o2'},g);E('circle',{cx:18,cy:-34,r:6,fill:'#fff',class:'o2'},g);
  E('path',{d:'M 46 -58 l 4 10 l 10 4 l -10 4 l -4 10 l -4 -10 l -10 -4 l 10 -4 Z',fill:'#ffd23f'},g);
  if(s)g.setAttribute('transform',`scale(${s})`);return g;}
// chmura: zlany kontur z kilku kół
function cloud(p,x,y,s,col,seed){const n=5;const sh=[];let k=seed||1;
  for(let i=0;i<n;i++){const f=i/(n-1);const r=(46+28*Math.sin(f*Math.PI)+((k*37+i*13)%17))*s;sh.push(['circle',{cx:x+(f-0.5)*230*s,cy:y-Math.sin(f*Math.PI)*36*s,r}]);}
  sh.push(['rect',{x:x-118*s,y:y-10*s,width:236*s,height:50*s,rx:25*s}]);
  return blob(p,sh,col||'#ffffff');}
// wyspa unosząca się w powietrzu: górna trawa, spód skalny ze stalaktytami
function island(p,x,top,w,h,grass,rock){const g=E('g',{},p);
  let d=`M ${x-w/2} ${top}`;const n=7;for(let i=0;i<=n;i++){const f=i/n;const xx=x-w/2+f*w;const yy=top+h*(0.25+0.75*Math.sin(f*Math.PI))*(i%2?1:0.82);d+=` L ${xx.toFixed(1)} ${yy.toFixed(1)}`;}
  d+=` L ${x+w/2} ${top} Z`;E('path',{d,fill:rock||'#8a7fb8',class:'o'},g);
  for(let i=0;i<5;i++){const xx=x-w*0.35+i*w*0.17;E('path',{d:`M ${xx} ${top+h*0.2} q 10 ${h*0.25} 0 ${h*0.45}`,class:'ln',style:'stroke:#6d6399'},g);}
  E('path',{d:`M ${x-w/2-10} ${top+8} Q ${x-w/2} ${top-26} ${x-w*0.3} ${top-22} L ${x+w*0.3} ${top-22} Q ${x+w/2} ${top-26} ${x+w/2+10} ${top+8} Q ${x} ${top+30} ${x-w/2-10} ${top+8} Z`,fill:grass||'#6fd36b',class:'o'},g);
  return g;}

const svg=()=>$('v');
let SC=null, world, far, mid, fg, parts, ui, defs;
const L={};
function setupLayers(){
  defs=document.querySelector('defs');
  world=$('world');far=$('far');mid=$('mid');fg=$('fg');parts=$('parts');ui=$('ui');
}
/* ---------- napisy ---------- */
const WY=500;
function buildWord(w){const g=E('g',{opacity:0},ui);w.g=g;const inner=E('g',{},g);w.inner=inner;
  const size=w.size||170;
  const mk=(txt,sz,y,fill)=>{const sh=E('text',{x:8,y:y+10,'text-anchor':'middle','font-family':'Impact','font-size':sz,fill:OUT,stroke:OUT,'stroke-width':22,'stroke-linejoin':'round','letter-spacing':3},inner);sh.textContent=txt;
    const tx=E('text',{x:0,y,'text-anchor':'middle','font-family':'Impact','font-size':sz,fill,stroke:OUT,'stroke-width':16,'stroke-linejoin':'round','paint-order':'stroke','letter-spacing':3},inner);tx.textContent=txt;return tx;};
  w.main=mk(w.txt,size,58+(size-170)*0.35,w.c);if(w.pre)mk(w.pre,90,-78,w.c);}
let plate,plateBg,plateT,plD1,plD2,curVerse=-1;
function buildPlate(){plate=E('g',{},ui);const pin=E('g',{},plate);
  plateBg=E('rect',{y:-34,height:68,rx:14,fill:'#1d1640',stroke:'#e8b64a','stroke-width':5},pin);
  plateT=E('text',{x:0,y:12,'text-anchor':'middle','font-family':'Bahnschrift, Arial','font-weight':700,'font-size':33,'letter-spacing':2},pin);
  plD1=E('path',{d:'M 0 -10 L 10 0 L 0 10 L -10 0 Z',fill:'#e8b64a'},pin);plD2=E('path',{d:'M 0 -10 L 10 0 L 0 10 L -10 0 Z',fill:'#e8b64a'},pin);}
function setVerse(i){curVerse=i;const v=SC.verses[i];while(plateT.firstChild)plateT.removeChild(plateT.firstChild);
  const a=E('tspan',{fill:'#ffd23f'},plateT);a.textContent=v.first;const b=E('tspan',{fill:'#fff3d6'},plateT);b.textContent=v.rest;
  const w=plateT.getComputedTextLength()+90;plateBg.setAttribute('x',-w/2);plateBg.setAttribute('width',w);
  plD1.setAttribute('transform',`translate(${-w/2},0)`);plD2.setAttribute('transform',`translate(${w/2},0)`);}
/* ---------- beat ---------- */
function sinceBeat(t,mod,which){const B=SC.beats;let last=-1;for(let i=0;i<B.length;i++){if(B[i]<=t)last=i;else break;}
  for(let k=last;k>=0&&k>last-8;k--){if(!which||which.includes(((k-(SC.beatPhase||0))%4+4)%4))return t-B[k];}return 99;}
const beatBob=(t)=>{const B=SC.beats;let i=0;while(i<B.length-1&&B[i+1]<=t)i++;const a=B[i],b=B[i+1]||a+0.44;return Math.cos(seg(t,a,b)*Math.PI*2);};
/* ---------- cząstki (pyłki / smugi wiatru) ---------- */
const PRT=[];
function buildParticles(n,col){for(let i=0;i<n;i++)PRT.push({x:rnd()*1280,y:rnd()*1920,p:i%2?0.5:1.2,e:E('line',{stroke:col||'#ffffff','stroke-opacity':i%2?0.45:0.75,'stroke-width':i%2?4:7,'stroke-linecap':'round'},parts)});}
/* ---------- render ---------- */
function layerT(el,C,p){const zl=Math.pow(C.z,p);el.setAttribute('transform',`translate(540 960) scale(${zl}) translate(${-C.x*p} ${-C.y*p})`);el.style.setProperty('--sw',(6.5/Math.pow(zl,0.6))+'px');}
function render(t){
  const C=SC.cam(t),z=C.z;
  world.setAttribute('transform',`translate(540 960) scale(${z}) translate(${-C.x} ${-C.y})`);
  world.style.setProperty('--sw',(6.5/Math.pow(z,0.6))+'px');
  layerT(far,C,SC.farP||0.25);layerT(mid,C,SC.midP||0.55);
  fg.setAttribute('transform',`translate(540 960) scale(${z*1.12}) translate(${-C.x*1.35} ${-C.y})`);fg.style.setProperty('--sw',(6.5/Math.pow(z,0.6))+'px');
  const sk=SC.sky(t,C);$('sTop').setAttribute('stop-color',sk[0]);$('sMid').setAttribute('stop-color',sk[1]);$('sBot').setAttribute('stop-color',sk[2]);
  const C2=SC.cam(Math.max(0,t-0.02));const vx=(C.x-C2.x)/0.02*z,vy=(C.y-C2.y)/0.02*z;
  PRT.forEach(p=>{const W=1280;const x=((p.x-C.x*z*p.p*0.6+Math.sin(t+p.y)*20)%W+W)%W-100;const y=((p.y-C.y*z*p.p*0.4-t*10*p.p)%1920+1920)%1920;
    const k=0.022*p.p;const lx=clamp(vx*k,-90,90),ly=clamp(vy*k,-90,90);p.e.setAttribute('x1',x);p.e.setAttribute('y1',y);p.e.setAttribute('x2',x+lx+0.1);p.e.setAttribute('y2',y+ly);});
  SC.update(t,C);
  // słowa
  const W=SC.words;let cur=-1;W.forEach((w,i)=>{if(t>=w.t)cur=i;});const bh=hit(sinceBeat(t),8);
  W.forEach((w,i)=>{
    if(i===cur){const u=seg(t,w.t,w.t+0.2);const s=lerp(1.7,1,ease.outBack(u))*(1+0.04*bh);w.g.setAttribute('opacity',clamp((t-w.t)/0.05));
      w.g.setAttribute('transform',`translate(540 ${w.y||WY}) rotate(${w.rot||0}) skewX(-7) scale(${s})`);const mw=w.main.getBBox().width;const fit=mw>1?Math.min(1,900/mw):1;w.inner.setAttribute('transform',`scale(${fit})`);}
    else if(i===cur-1){const u=seg(t,W[cur].t,W[cur].t+0.1);w.g.setAttribute('opacity',1-u);w.g.setAttribute('transform',`translate(540 ${(w.y||WY)-30*u}) rotate(${w.rot||0}) skewX(-7) scale(${1-0.3*u})`);}
    else w.g.setAttribute('opacity',0);});
  // tabliczka
  let vi=0;SC.verses.forEach((v,i)=>{if(t>=v.t)vi=i;});if(vi!==curVerse)setVerse(vi);
  const fl=vi>0?seg(t,SC.verses[vi].t,SC.verses[vi].t+0.134):1;const sY=(vi>0&&fl<1)?Math.abs(Math.cos(Math.PI*fl)):1;
  plate.setAttribute('transform',`translate(540 ${SC.plateY||1470}) scale(1 ${Math.max(0.02,sY)})`);plate.setAttribute('opacity',SC.verses[vi].first?1:0);
  if(MOT)updMotto(t);
}
window.render=render;
/* ---------- końcówka: hasło konwersyjne (jak „Nie siedź w kącie…” we wzorcu) przed kurtyną ----------
   Pomiar „najnowszy 2.mp4”: 4 linijki wchodzą naraz 2,60 s przed startem kotar, tabliczka znika, kamera stoi. */
let MOT=null;
const SLS=[[0,0],[0.033,0.66],[0.10,1.08],[0.167,1.08],[0.233,1.06],[0.30,1.014],[0.367,0.994],[0.433,1.0]];
function pwv(P,r){if(r<=P[0][0])return P[0][1];for(let i=1;i<P.length;i++){if(r<=P[i][0]){const a=P[i-1],b=P[i];return a[1]+(b[1]-a[1])*(r-a[0])/(b[0]-a[0]);}}return P[P.length-1][1];}
function tailSetup(T){const B=SC.beats,Ts=T.T||0.441;let b=B[B.length-1];
  if(T.D>b){while(b+Ts<T.D-0.03){b+=Ts;B.push(+b.toFixed(3));}if(T.D-B[B.length-1]>0.03)B.push(T.D);b=B[B.length-1];}
  while(b+Ts<T.end+0.5){b+=Ts;B.push(+b.toFixed(3));}
  // hasło zastępuje słowa piosenki i tabliczkę od chwili wejścia (jak we wzorcu)
  SC.words=SC.words.filter(w=>w.t<T.D-0.2);SC.words.push({t:T.D,txt:''});
  SC.verses=SC.verses.filter(v=>v.t<T.D-0.3);SC.verses.push({t:T.D,first:'',rest:''});
  const g=E('g',{opacity:0},ui);const Y=[222,360,494,632],R=[-2,1.5,-1.5,2];
  const L=(T.lines||[]).map((s,i)=>{const lg=E('g',{},g);const inner=E('g',{},lg);
    const sh=E('text',{x:8,y:52,'text-anchor':'middle','font-family':'Impact','font-size':138,fill:OUT,stroke:OUT,'stroke-width':22,'stroke-linejoin':'round','letter-spacing':3},inner);sh.textContent=s;
    const tx=E('text',{x:0,y:42,'text-anchor':'middle','font-family':'Impact','font-size':138,fill:'#fed03e',stroke:OUT,'stroke-width':16,'stroke-linejoin':'round','paint-order':'stroke','letter-spacing':3},inner);tx.textContent=s;
    return {lg,inner,tx,y:Y[i],r:R[i]};});
  MOT={g,L,T};}
function updMotto(t){const {g,L,T}=MOT;const r=t-T.D;if(r<0||t>T.Tc+0.5){g.setAttribute('opacity',0);return;}g.setAttribute('opacity',1);
  const s=pwv(SLS,r);L.forEach(o=>{const w=o.tx.getBBox().width;const fit=w>1?Math.min(1,1000/w):1;o.inner.setAttribute('transform',`scale(${fit.toFixed(3)})`);
    o.lg.setAttribute('transform',`translate(540 ${o.y}) rotate(${o.r}) skewX(-7) scale(${Math.max(0.001,s).toFixed(3)})`);});}
function boot(scene){SC=scene;setupLayers();SC.build();if(window.TAIL)tailSetup(window.TAIL);SC.words.forEach(buildWord);buildPlate();buildParticles(SC.particles||46,SC.partCol);
  window.addEventListener('load',()=>document.fonts.ready.then(()=>{setVerse(0);render(0);window.READY=true;}));}
