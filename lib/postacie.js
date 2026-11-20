'use strict';
/* Postacie wyciagniete z plikow klipow (kopie 1:1), kazda grupa we wlasnym zakresie. */
/* z: smok_podniebne_krolestwo/animacja/lajkonik.js */
(function(){
let LJ,tag,robot,rbArm,boxes=[],coins=[],dusts=[],qm,eyesL,horseEye,bang,signs=[],counterG,screenG;
function lajkonik(p){const S={};const g=E('g',{},p);S.g=g;const SK='#f5d2b5';
  S.tail=E('path',{fill:'#e8c66a',class:'o'},g);
  S.legB=limb(g,30,'#3b2f66');S.bootB=E('path',{d:'M -20 -18 L 30 -18 L 46 10 L -20 10 Z',fill:'#ffc93c',class:'o2'},g);
  S.legF=limb(g,30,'#4a3d7a');S.bootF=E('path',{d:'M -20 -18 L 30 -18 L 46 10 L -20 10 Z',fill:'#ffc93c',class:'o2'},g);
  let d='M -212 -312 L 212 -312 L 228 -76';for(let i=0;i<8;i++){const x0=228-i*57,x1=x0-57;d+=` Q ${x0-28} -40 ${x1} -76`;}d+=' Z';
  E('path',{d,fill:'#d94b4b',class:'o'},g);E('path',{d:'M -216 -312 L 216 -312 L 218 -280 L -218 -280 Z',fill:'#ffc93c',class:'o2'},g);
  for(let i=0;i<5;i++)E('circle',{cx:-160+i*80,cy:-180+(i%2)*40,r:16,fill:'#ffc93c',class:'o2'},g);
  for(let i=0;i<4;i++)E('path',{d:`M ${-120+i*80} -230 l 20 20 l -20 20 l -20 -20 Z`,fill:'#fff3d6',class:'o2'},g);
  const horse=E('g',{},g);S.horse=horse;
  E('path',{d:'M 110 -300 C 150 -390 196 -450 236 -492 L 304 -446 C 262 -404 236 -346 226 -300 Z',fill:'#ffffff',class:'o'},horse);
  E('path',{d:'M 110 -300 C 140 -380 180 -440 226 -488 C 200 -470 168 -440 150 -400 C 136 -380 124 -340 132 -300 Z',fill:'#ffb347',class:'o2'},horse);
  E('path',{d:'M 238 -520 L 252 -566 L 274 -514 Z',fill:'#ffffff',class:'o2'},horse);
  E('ellipse',{cx:298,cy:-478,rx:74,ry:44,fill:'#ffffff',class:'o',transform:'rotate(24 298 -478)'},horse);
  E('ellipse',{cx:350,cy:-446,rx:9,ry:6,fill:OUT},horse);
  horseEye=E('g',{},horse);E('circle',{cx:282,cy:-500,r:13,fill:'#fff',class:'o2'},horseEye);E('circle',{cx:286,cy:-500,r:7,fill:OUT},horseEye);
  E('path',{d:'M 246 -520 L 330 -420 M 262 -450 Q 300 -480 350 -470',fill:'none',stroke:'#d94b4b','stroke-width':10,'stroke-linecap':'round'},horse);
  for(const [x,y] of [[268,-498],[300,-460],[318,-438]])E('circle',{cx:x,cy:y,r:6,fill:'#ffc93c'},horse);
  E('path',{d:'M 254 -540 C 230 -600 260 -640 290 -650 C 280 -610 290 -580 270 -540 Z',fill:'#ff5d5d',class:'o2'},horse);
  E('path',{d:'M -72 -300 L -80 -500 Q 0 -532 80 -500 L 72 -300 Z',fill:'#ffb347',class:'o'},g);
  E('path',{d:'M -6 -520 L -6 -300',class:'ln'},g);for(let i=0;i<4;i++)E('circle',{cx:-6,cy:-480+i*45,r:7,fill:'#ffc93c',class:'o2'},g);
  E('path',{d:'M -76 -350 L 76 -350 L 74 -318 L -74 -318 Z',fill:'#3cc9b0',class:'o2'},g);
  S.pouch=E('ellipse',{cx:-60,cy:-318,rx:24,ry:28,fill:'#9a6a46',class:'o2'},g);
  E('circle',{cx:4,cy:-576,r:62,fill:SK,class:'o'},g);
  eyesL=E('g',{},g);for(const x of [-12,32]){E('ellipse',{cx:x,cy:-588,rx:10,ry:13,fill:OUT},eyesL);E('circle',{cx:x+3,cy:-592,r:4,fill:'#fff'},eyesL);}
  E('path',{d:'M -26 -608 L 0 -604 M 22 -606 L 46 -610',class:'ln',style:'stroke-width:calc(var(--sw)*0.9)'},g);
  E('path',{d:'M 0 -560 C 40 -548 54 -586 50 -560 C 40 -540 20 -544 10 -548 C 0 -544 -24 -540 -36 -560 C -38 -586 -30 -548 0 -560 Z',fill:'#e8c66a',class:'o2'},g);
  E('path',{d:'M 12 -556 C -20 -562 -54 -542 -64 -508 C -42 -530 -16 -540 12 -546 C 40 -540 66 -530 88 -508 C 78 -542 44 -562 12 -556 Z',fill:'#2a2148',class:'o2'},g);
  E('path',{d:'M 0 -532 L 12 -490 L 26 -532 Z',fill:'#2a2148'},g);
  E('path',{d:'M -62 -612 Q 4 -644 70 -612 L 24 -826 Q 10 -846 -4 -824 Z',fill:'#6a3fd6',class:'o'},g);
  for(let i=0;i<6;i++)E('circle',{cx:-30+i*12+(i%2)*4,cy:-660-i*26,r:6,fill:'#ffffff'},g);
  E('path',{d:'M -70 -598 Q 4 -640 78 -598 L 74 -630 Q 4 -670 -66 -630 Z',fill:'#8a5a3c',class:'o'},g);
  E('path',{d:'M 10 -852 A 18 18 0 1 0 28 -834 A 12 12 0 1 1 10 -852 Z',fill:'#ffc93c',class:'o2'},g);
  S.reins=E('path',{fill:'none',stroke:'#8a5a3c','stroke-width':6},g);
  S.armB=limb(g,28,'#ffb347');S.handB=E('g',{},g);E('circle',{r:20,fill:SK,class:'o2'},S.handB);
  S.vee=E('g',{opacity:0},S.handB);for(const a of [-14,14])E('rect',{x:-7,y:-56,width:14,height:44,rx:7,fill:SK,class:'o2',transform:`rotate(${a})`},S.vee);
  S.armF=limb(g,28,'#ffb347');S.mace=E('g',{},g);
  E('path',{d:'M 0 20 L 0 -200',stroke:OUT,'stroke-width':22,'stroke-linecap':'round'},S.mace);E('path',{d:'M 0 20 L 0 -200',stroke:'#c98a4b','stroke-width':12,'stroke-linecap':'round'},S.mace);
  E('circle',{cy:-226,r:40,fill:'#ffc93c',class:'o'},S.mace);for(let i=0;i<6;i++){const a=i*Math.PI/3;E('circle',{cx:Math.cos(a)*30,cy:-226+Math.sin(a)*30,r:8,fill:'#ff5d5d',class:'o2'},S.mace);}
  S.handF=E('circle',{r:20,fill:SK,class:'o2'},g);
  return S;}
function box(p){const g=E('g',{},p);E('rect',{x:-70,y:-120,width:140,height:120,rx:10,fill:'#6a3fd6',class:'o'},g);
  E('rect',{x:-14,y:-120,width:28,height:120,fill:'#ffd23f',class:'o2'},g);E('rect',{x:-80,y:-140,width:160,height:34,rx:8,fill:'#8a5ef0',class:'o'},g);
  E('path',{d:'M 0 -140 C -40 -190 -70 -150 -30 -140 M 0 -140 C 40 -190 70 -150 30 -140',fill:'#ffd23f',class:'o2'},g);
  E('text',{x:0,y:-38,'text-anchor':'middle','font-family':'Impact','font-size':40,fill:'#fff',stroke:OUT,'stroke-width':4,'paint-order':'stroke'},g).textContent='WWW';return g;}
window.lajkonik=lajkonik;
})();
/* z: smok_podniebne_krolestwo/animacja/syrenka.js */
(function(){
let SY,riverF,riverB,waves=[],fallStripes=[],foam,buoy,TW,pl,trail,dingB,R1,R2,hearts=[],drops=[],ph,bubT,sentT,callG,offG,callR;
function syrenka(p){const S={};const g=E('g',{},p);S.g=g;const SK='#ffd9bd',HR='#ffb347',TL='#2fc4a5';
  E('path',{d:'M -96 -300 C -156 -220 -146 -110 -116 -30 Q -86 -52 -74 -104 Q -62 -52 -34 -44 L 34 -44 Q 62 -52 74 -104 Q 86 -52 116 -30 C 146 -110 156 -220 96 -300 Z',fill:HR,class:'o'},g);
  E('path',{d:'M -60 -10 C -76 110 -44 220 -12 296 L 12 296 C 44 220 76 110 60 -10 Z',fill:TL,class:'o'},g);
  for(let i=0;i<5;i++){const y=30+i*50,w=52-i*8;E('path',{d:`M ${-w} ${y} Q ${-w/2} ${y+20} 0 ${y} Q ${w/2} ${y+20} ${w} ${y}`,class:'ln',style:'stroke:#1f8f78'},g);}
  S.fin=E('path',{d:'M -12 290 C -84 300 -128 362 -96 386 C -54 366 -24 344 0 322 C 24 344 54 366 96 386 C 128 362 84 300 12 290 Z',fill:'#7cf2c8',class:'o'},g);
  E('path',{d:'M -60 0 C -66 -60 -72 -120 -62 -166 Q 0 -192 62 -166 C 72 -120 66 -60 60 0 Z',fill:SK,class:'o'},g);
  for(const s of [-1,1])E('path',{d:`M ${s*4} -112 Q ${s*30} -162 ${s*58} -116 Q ${s*30} -96 ${s*4} -112 Z`,fill:'#c9b6ff',class:'o2'},g);
  E('rect',{x:-18,y:-206,width:36,height:44,fill:SK,class:'o2'},g);
  E('circle',{cx:0,cy:-266,r:84,fill:SK,class:'o'},g);
  S.eo=E('g',{},g);for(const s of [-1,1]){E('ellipse',{cx:s*30,cy:-262,rx:13,ry:18,fill:OUT},S.eo);E('circle',{cx:s*30+4,cy:-268,r:5,fill:'#fff'},S.eo);
    E('path',{d:`M ${s*18} -282 L ${s*12} -291 M ${s*30} -284 L ${s*30} -294 M ${s*42} -282 L ${s*48} -291`,class:'ln'},S.eo);}
  S.ec=E('g',{opacity:0},g);E('path',{d:'M -44 -258 Q -30 -274 -16 -258 M 16 -258 Q 30 -274 44 -258',class:'ln'},S.ec);
  for(const s of [-1,1])E('circle',{cx:s*54,cy:-234,r:14,fill:'#ff9ab8',opacity:0.6},g);
  S.mc=E('path',{d:'M -22 -228 Q 0 -210 22 -228',class:'ln'},g);S.mo=E('path',{d:'M -20 -230 Q 0 -196 20 -230 Z',fill:'#c2405e',class:'o2',opacity:0},g);
  E('path',{d:'M -88 -270 C -94 -352 -22 -376 10 -356 C 42 -376 98 -342 88 -270 C 72 -302 42 -322 10 -314 C -22 -324 -62 -308 -88 -270 Z',fill:HR,class:'o'},g);
  let st='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?10:24;st+=(i?'L':'M')+(62+Math.cos(a)*r).toFixed(1)+' '+(-330+Math.sin(a)*r).toFixed(1);}
  E('path',{d:st+'Z',fill:'#ff9ab8',class:'o2'},g);
  S.armL=limb(g,30,SK);S.phone=E('g',{},g);ph=phoneUI(S.phone,230,380,'#ffc93c','CZAT');
  const b=chatBub(S.phone,6,-30,204,70,'#7cf2c8',true,24);bubT=b.t;S.bub=b.g;
  S.keys=[];for(let r=0;r<3;r++)for(let c=0;c<6;c++)S.keys.push(E('rect',{x:-104+c*36,y:62+r*38,width:30,height:30,rx:7,fill:'#3b2f7a'},S.phone));
  sentT=E('text',{x:60,y:30,'text-anchor':'middle','font-family':'Bahnschrift, Arial','font-weight':700,'font-size':20,fill:'#9fe7ff'},S.phone);sentT.textContent='wysłano ✓';
  callG=E('g',{opacity:0},S.phone);E('rect',{x:-115,y:-190,width:230,height:380,rx:28,fill:'#6a3fd6'},callG);
  callR=ringSet(callG,3,'#ffffff',6);const lgw=E('g',{transform:'translate(0 -40)'},callG);mLogo(lgw,0.8);
  E('text',{x:0,y:80,'text-anchor':'middle','font-family':'Impact','font-size':34,fill:'#fff'},callG).textContent='MASTALEX';
  E('text',{x:0,y:120,'text-anchor':'middle','font-family':'Bahnschrift, Arial','font-weight':700,'font-size':24,fill:'#ffd23f'},callG).textContent='dzwoni...';
  offG=E('rect',{x:-115,y:-190,width:230,height:380,rx:28,fill:'#1a1438'},S.phone);
  S.hL=E('circle',{r:22,fill:SK,class:'o2'},g);
  S.armR=limb(g,30,SK);S.sword=E('g',{},g);
  E('path',{d:'M -15 -12 L -11 -232 L 0 -268 L 11 -232 L 15 -12 Z',fill:'#e6ecf5',class:'o'},S.sword);E('path',{d:'M -3 -30 L -2 -220',stroke:'#ffffff','stroke-width':6,'stroke-linecap':'round'},S.sword);
  E('rect',{x:-46,y:-16,width:92,height:20,rx:8,fill:'#ffc93c',class:'o2'},S.sword);E('rect',{x:-9,y:0,width:18,height:52,rx:6,fill:'#8a5a3c',class:'o2'},S.sword);E('circle',{cy:60,r:12,fill:'#ffc93c',class:'o2'},S.sword);
  S.hR=E('circle',{r:22,fill:SK,class:'o2'},g);
  return S;}
function bez(P,u){const a=1-u;return [a*a*a*P[0][0]+3*a*a*u*P[1][0]+3*a*u*u*P[2][0]+u*u*u*P[3][0],a*a*a*P[0][1]+3*a*a*u*P[1][1]+3*a*u*u*P[2][1]+u*u*u*P[3][1]];}
window.syrenka=syrenka;
})();
/* z: smok_podniebne_krolestwo/animacja/twardowski.js */
(function(){
const MX=0,MY=-1100,MR=560,TX=60,TY=-1660;
let TW,moonEyeC,moonEyeO,moonBlush,moonMouth,spiderT,spider,stars=[],shoot,R,horn,pageG,pageR,pageClip,rollL,rollR,cursor,tumble,watch,watchQ,cyk,sweat,twEyes,twBlink;
function twardowski(p){const S={};const g=E('g',{},p);S.g=g;const SK='#f5d2b5';
  S.legL=limb(g,30,'#7cc4ff');S.legR=limb(g,30,'#7cc4ff');S.bootL=E('path',{d:'M -24 -10 L 24 -10 L 40 26 L -26 26 Z',fill:'#ffc93c',class:'o2'},g);S.bootR=E('path',{d:'M -24 -10 L 24 -10 L 40 26 L -26 26 Z',fill:'#ffc93c',class:'o2'},g);
  E('path',{d:'M -120 -150 Q -150 -60 -140 30 L -100 30 L -96 -150 Z M 120 -150 Q 150 -60 140 30 L 100 30 L 96 -150 Z',fill:'#8e2b22',class:'o'},g);
  E('path',{d:'M -96 -226 L -110 20 Q 0 40 110 20 L 96 -226 Q 0 -250 -96 -226 Z',fill:'#c0392b',class:'o'},g);
  E('path',{d:'M -40 -236 L -34 26 L 34 26 L 40 -236 Z',fill:'#7cc4ff',class:'o2'},g);for(let i=0;i<5;i++)E('circle',{cx:0,cy:-210+i*44,r:6,fill:'#ffc93c'},g);
  E('path',{d:'M -100 -70 L 100 -70 L 100 -30 L -100 -30 Z',fill:'#ffc93c',class:'o2'},g);for(let i=0;i<6;i++)E('path',{d:`M ${-90+i*36} -66 L ${-90+i*36} -34`,stroke:'#c0392b','stroke-width':6},g);
  E('circle',{cx:0,cy:-300,r:66,fill:SK,class:'o'},g);
  twEyes=E('g',{},g);for(const s of [-1,1]){E('ellipse',{cx:s*24,cy:-310,rx:9,ry:12,fill:OUT},twEyes);E('circle',{cx:s*24+3,cy:-314,r:4,fill:'#fff'},twEyes);}
  twBlink=E('path',{d:'M -34 -308 L -14 -308 M 14 -308 L 34 -308',class:'ln',opacity:0},g);
  E('path',{d:'M -42 -332 L -10 -326 M 10 -326 L 42 -332',class:'ln',style:'stroke-width:calc(var(--sw)*1.1)'},g);
  E('path',{d:'M 0 -306 C 6 -296 6 -286 0 -282',class:'ln'},g);
  E('path',{d:'M 0 -278 C -30 -284 -70 -276 -96 -246 C -100 -232 -88 -226 -80 -240 C -60 -262 -30 -266 0 -266 C 30 -266 60 -262 80 -240 C 88 -226 100 -232 96 -246 C 70 -276 30 -284 0 -278 Z',fill:'#5a4a6a',class:'o2'},g);
  E('path',{d:'M -10 -254 L 0 -220 L 10 -254 Z',fill:'#5a4a6a',class:'o2'},g);
  sweat=E('path',{d:'M 70 -340 C 60 -320 62 -306 72 -304 C 82 -306 84 -320 70 -340 Z',fill:'#9fe7ff',class:'o2',opacity:0},g);
  E('path',{d:'M -60 -350 Q 0 -440 60 -350 Z',fill:'#c0392b',class:'o'},g);E('path',{d:'M -76 -330 Q 0 -366 76 -330 L 74 -376 Q 0 -406 -74 -376 Z',fill:'#6b4a3a',class:'o'},g);
  E('circle',{cx:30,cy:-378,r:14,fill:'#ffc93c',class:'o2'},g);E('path',{d:'M 30 -384 C 50 -440 90 -470 120 -476 C 100 -440 70 -410 36 -380 Z',fill:'#ffffff',class:'o2'},g);
  // zwój-strona
  pageG=E('g',{opacity:0},g);pageClip=E('clipPath',{id:'pageC'},defs);pageR=E('rect',{x:0,y:-350,width:0,height:390},pageClip);
  const pc=E('g',{'clip-path':'url(#pageC)'},pageG);
  E('rect',{x:-280,y:-350,width:560,height:390,fill:'#fffaf0',class:'o'},pc);E('rect',{x:-280,y:-350,width:560,height:48,fill:'#e6e0f2',class:'o2'},pc);
  for(let i=0;i<3;i++)E('circle',{cx:-252+i*24,cy:-326,r:8,fill:['#ff5d5d','#ffd23f','#6fd36b'][i]},pc);
  E('rect',{x:-160,y:-340,width:380,height:28,rx:14,fill:'#ffffff',class:'o2'},pc);E('text',{x:-145,y:-319,'font-family':'Bahnschrift, Arial','font-weight':700,'font-size':20,fill:'#6b6f8a'},pc).textContent='twardowski.pl';
  cursor=E('rect',{x:-240,y:-270,width:8,height:46,fill:OUT},pc);
  tumble=E('g',{},pc);E('circle',{r:40,fill:'#e8c66a',class:'o2'},tumble);E('path',{d:'M -30 -10 Q 0 -40 30 -6 Q 0 30 -26 10 Q 0 -16 22 14 M -10 -34 Q 20 0 -6 34',class:'ln'},tumble);
  rollL=E('rect',{x:-24,y:-372,width:48,height:434,rx:24,fill:'#e8c66a',class:'o'},pageG);rollR=E('rect',{x:-24,y:-372,width:48,height:434,rx:24,fill:'#e8c66a',class:'o'},pageG);
  S.armL=limb(g,30,'#c0392b');S.hL=E('circle',{r:22,fill:SK,class:'o2'},g);
  S.armR=limb(g,30,'#c0392b');horn=E('g',{},g);E('path',{d:'M -10 -14 L 150 -80 Q 186 0 150 80 L -10 14 Z',fill:'#ffc93c',class:'o'},horn);E('ellipse',{cx:156,cy:0,rx:20,ry:80,fill:'#f0b043',class:'o'},horn);
  S.hR=E('circle',{r:22,fill:SK,class:'o2'},g);g.appendChild(pageG);
  return S;}
window.twardowski=twardowski;
})();
/* z: smok_podniebne_krolestwo/animacja/turysta.js */
(function(){
const TX0=-1750,KX=1500;
const RP=[[-1700,-70],[-900,-760],[480,-640],[1170,-60]];
let TU,CS,D,ph,l1,l2,bubU,bubA,dots,pin,route,arrows=[],taxi,post,arrowB=[],kwrap,flash,hearts=[],mapG,wrapHand,growl;
function tourist(p){const S={};const g=E('g',{},p);S.g=g;const SK='#ffd3b0';
  E('rect',{x:-110,y:-400,width:110,height:180,rx:30,fill:'#6a3fd6',class:'o'},g);E('rect',{x:-130,y:-430,width:150,height:46,rx:23,fill:'#ff9ab8',class:'o'},g);
  for(const s of [-1,1]){E('rect',{x:s*34-16,y:-150,width:32,height:110,fill:SK,class:'o2'},g);E('rect',{x:s*34-17,y:-90,width:34,height:60,fill:'#ffffff',class:'o2'},g);
    E('path',{d:`M ${s*34-26} -30 L ${s*34+34} -30 L ${s*34+36} 0 L ${s*34-26} 0 Z`,fill:'#9a6a46',class:'o2'},g);E('path',{d:`M ${s*34-10} -30 L ${s*34+10} -50`,class:'ln'},g);}
  E('path',{d:'M -72 -230 L 72 -230 L 80 -140 L -80 -140 Z',fill:'#e8c66a',class:'o'},g);
  E('path',{d:'M -80 -380 Q -100 -300 -78 -226 Q 0 -200 78 -226 Q 100 -300 80 -380 Q 0 -404 -80 -380 Z',fill:'#3cc9b0',class:'o'},g);
  for(const [x,y] of [[-40,-340],[30,-300],[-20,-260],[50,-360]]){for(let k=0;k<5;k++){const a=k*Math.PI*0.4;E('circle',{cx:x+Math.cos(a)*10,cy:y+Math.sin(a)*10,r:7,fill:'#ff9ab8'},g);}E('circle',{cx:x,cy:y,r:5,fill:'#ffd23f'},g);}
  E('path',{d:'M -50 -390 L 0 -300 L 50 -390',class:'ln'},g);E('rect',{x:-36,y:-320,width:72,height:52,rx:10,fill:'#2d2650',class:'o2'},g);E('circle',{cx:0,cy:-294,r:18,fill:'#6b6f8a',class:'o2'},g);
  S.flashPt=[0,-294];
  E('circle',{cx:0,cy:-460,r:62,fill:SK,class:'o'},g);
  E('path',{d:'M -54 -470 L 54 -470 L 50 -440 L 12 -440 L 0 -450 L -12 -440 L -50 -440 Z',fill:'#2d2650',class:'o2'},g);
  E('path',{d:'M -6 -436 L 10 -436',stroke:'#ffffff','stroke-width':8,'stroke-linecap':'round'},g);
  S.mouth=E('path',{d:'M -24 -418 Q 0 -400 24 -418',class:'ln'},g);S.mouthO=E('ellipse',{cx:0,cy:-414,rx:16,ry:13,fill:'#c2405e',class:'o2',opacity:0},g);
  E('path',{d:'M -90 -488 Q 0 -500 90 -488 L 70 -512 Q 60 -580 0 -582 Q -60 -580 -70 -512 Z',fill:'#e8d5a8',class:'o'},g);E('path',{d:'M -70 -512 Q 0 -526 70 -512',class:'ln'},g);
  S.armL=limb(g,26,SK);mapG=E('g',{},g);const mi=E('g',{},mapG);E('path',{d:'M -80 -60 L -26 -46 L 26 -60 L 80 -46 L 80 60 L 26 46 L -26 60 L -80 46 Z',fill:'#fff3d6',class:'o'},mi);
  E('path',{d:'M -26 -46 L -26 60 M 26 -60 L 26 46 M -60 20 Q -20 -20 10 10 T 60 -10',class:'ln'},mi);E('text',{x:0,y:8,'text-anchor':'middle','font-family':'Impact','font-size':40,fill:'#d94b4b'},mi).textContent='?';
  S.map=mi;S.hL=E('circle',{r:20,fill:SK,class:'o2'},g);
  S.armR=limb(g,26,SK);S.phone=E('g',{},g);ph=phoneUI(S.phone,300,470,'#6a3fd6','CZAT AI');
  bubU=chatBub(S.phone,20,-80,250,104,'#7cf2c8',true,26);bubU.t.setAttribute('y',-6);l1=bubU.t;
  l2=E('text',{x:0,y:28,'text-anchor':'middle','font-family':'Bahnschrift, Arial','font-weight':700,'font-size':26,fill:OUT},bubU.inner);
  dots=E('g',{},S.phone);for(let i=0;i<3;i++)E('circle',{cx:-90+i*26,cy:60,r:9,fill:'#ffffff'},dots);
  bubA=chatBub(S.phone,-12,80,250,110,'#ffd23f',false,34);bubA.t.textContent='U SMOKA!';bubA.t.setAttribute('font-family','Impact');bubA.t.setAttribute('x',22);bubA.t.setAttribute('y',2);
  const dh=E('g',{transform:'translate(-82 -6) scale(0.42)'},bubA.inner);E('circle',{r:46,fill:'#3cc9b0',class:'o'},dh);E('path',{d:'M -30 -36 L -40 -70 L -10 -44 Z M 30 -36 L 40 -70 L 10 -44 Z',fill:'#fff1c2',class:'o2'},dh);
  E('circle',{cx:-16,cy:-6,r:7,fill:OUT},dh);E('circle',{cx:16,cy:-6,r:7,fill:OUT},dh);
  E('text',{x:0,y:40,'text-anchor':'middle','font-family':'Bahnschrift, Arial','font-weight':700,'font-size':20,fill:OUT},bubA.inner).textContent='prowadzę →';
  S.hR=E('circle',{r:20,fill:SK,class:'o2'},g);g.insertBefore(S.hR,S.phone);
  return S;}
function bez(P,u){const a=1-u;return [a*a*a*P[0][0]+3*a*a*u*P[1][0]+3*a*u*u*P[2][0]+u*u*u*P[3][0],a*a*a*P[0][1]+3*a*a*u*P[1][1]+3*a*u*u*P[2][1]+u*u*u*P[3][1]];}
window.tourist=tourist;
})();
/* z: smok_podniebne_krolestwo/animacja/babajaga.js */
(function(){
const HX=150,HY=-280;
let hut,hutIn,legL,legR,footL,footR,tufts=[],patches=[],clipC=[],neon,neonGlow,BJ,broom,bjArmL,bjArmR,bjHL,bjHR,handset,cord,dial,shout,drrr,bolts=[],stars=[],crows=[],smk=[],sparks=[],twinkle=[],bjMouth,bjMouthO,hutLights=[];
function babaJaga(p){const S={};const g=E('g',{},p);S.g=g;const SK='#f5d2b5';
  broom=E('g',{},g);E('path',{d:'M 0 -230 L 0 230',stroke:OUT,'stroke-width':26,'stroke-linecap':'round'},broom);E('path',{d:'M 0 -230 L 0 230',stroke:'#9a6a46','stroke-width':14,'stroke-linecap':'round'},broom);
  E('path',{d:'M -16 220 L 16 220 L 60 340 Q 0 356 -60 340 Z',fill:'#e8c66a',class:'o'},broom);E('path',{d:'M -20 232 L 20 232',stroke:'#c0392b','stroke-width':12},broom);
  for(const x of [-30,-10,10,30])E('path',{d:`M ${x*0.5} 250 L ${x*1.6} 336`,class:'ln'},broom);
  E('path',{d:'M -50 -6 L -40 -32 L 10 -30 L 18 -6 Z M 50 -6 L 40 -32 L -2 -30 L -10 -6 Z',fill:'#3b2f66',class:'o2'},g);
  E('path',{d:'M -112 -14 L -76 -236 L 76 -236 L 112 -14 Q 0 6 -112 -14 Z',fill:'#5b3fb0',class:'o'},g);
  E('path',{d:'M -52 -30 L -40 -200 L 44 -200 L 56 -30 Z',fill:'#c9b6ff',class:'o2'},g);
  E('rect',{x:-90,y:-100,width:44,height:40,fill:'#ff9a3d',class:'o2',transform:'rotate(-12 -68 -80)'},g);
  E('path',{d:'M -80 -236 L -66 -330 L 66 -330 L 80 -236 Z',fill:'#ec6a52',class:'o'},g);
  E('path',{d:'M -98 -300 L 0 -352 L 98 -300 L 0 -196 Z',fill:'#3cc9b0',class:'o'},g);
  for(let i=0;i<7;i++)E('path',{d:`M ${-70+i*22} ${-250+Math.abs(i-3)*14} l 0 26`,class:'ln'},g);
  E('circle',{cx:6,cy:-420,r:68,fill:SK,class:'o'},g);
  for(const [x,y] of [[-62,-396],[70,-392]])E('path',{d:`M ${x} ${y} q ${x<0?-24:24} 6 ${x<0?-30:30} 24 q ${x<0?10:-10} -6 ${x<0?14:-14} -24`,fill:'#e6e6ee',class:'o2'},g);
  E('path',{d:'M -64 -430 C -70 -510 80 -514 76 -430 C 60 -470 -50 -472 -64 -430 Z',fill:'#ec4a5a',class:'o'},g);
  for(const [x,y] of [[-30,-470],[10,-480],[44,-466],[-48,-446]])E('circle',{cx:x,cy:y,r:6,fill:'#fff'},g);
  E('path',{d:'M -60 -400 Q -40 -340 0 -352 L -14 -326 L 14 -340 Q 50 -350 70 -398',fill:'none',stroke:OUT,'stroke-width':26,'stroke-linecap':'round'},g);
  E('path',{d:'M -60 -400 Q -40 -340 0 -352 L -14 -326 L 14 -340 Q 50 -350 70 -398',fill:'none',stroke:'#ec4a5a','stroke-width':14,'stroke-linecap':'round'},g);
  for(const s of [-1,1]){E('circle',{cx:6+s*26,cy:-428,r:9,fill:OUT},g);E('path',{d:`M ${6+s*40} -436 l ${s*12} -4 M ${6+s*40} -426 l ${s*12} 4`,class:'ln'},g);
    E('path',{d:`M ${6+s*14} -450 L ${6+s*38} -446`,class:'ln',style:'stroke-width:calc(var(--sw)*0.9)'},g);}
  E('path',{d:'M 0 -432 C 30 -440 70 -420 62 -392 C 56 -374 30 -380 18 -392 C 10 -400 0 -410 0 -432 Z',fill:'#f0b894',class:'o'},g);
  E('circle',{cx:44,cy:-400,r:6,fill:'#7a9a5a'},g);
  bjMouth=E('path',{d:'M -24 -384 Q 0 -370 22 -384',class:'ln'},g);E('rect',{x:-6,y:-381,width:10,height:12,fill:'#fff',class:'o2'},g);
  bjMouthO=E('ellipse',{cx:-2,cy:-378,rx:20,ry:16,fill:'#7a1f3a',class:'o2',opacity:0},g);
  bjArmL=limb(g,30,'#ec6a52');handset=E('g',{},g);
  E('path',{d:'M -16 -70 Q -46 0 -16 70',fill:'none',stroke:OUT,'stroke-width':40,'stroke-linecap':'round'},handset);E('path',{d:'M -16 -70 Q -46 0 -16 70',fill:'none',stroke:'#ec4a5a','stroke-width':26,'stroke-linecap':'round'},handset);
  E('ellipse',{cx:-8,cy:-74,rx:26,ry:18,fill:'#ec4a5a',class:'o2'},handset);E('ellipse',{cx:-8,cy:74,rx:26,ry:18,fill:'#ec4a5a',class:'o2'},handset);
  bjHL=E('circle',{r:20,fill:SK,class:'o2'},g);bjArmR=limb(g,30,'#ec6a52');bjHR=E('circle',{r:20,fill:SK,class:'o2'},g);
  return S;}
function patch(p,kind,x,y,r){const g=E('g',{},p);const inner=E('g',{transform:`translate(${x} ${y}) rotate(${r})`},g);
  if(kind==='plank'){for(const a of [-28,24])E('rect',{x:-110,y:-18,width:220,height:36,rx:6,fill:'#d9a066',class:'o',transform:`rotate(${a})`},inner);
    for(const [a,b] of [[-80,-40],[80,40],[-80,40],[80,-40]])E('circle',{cx:a*0.9,cy:b*0.9,r:6,fill:'#6b6f8a'},inner);}
  else if(kind==='aid'){E('rect',{x:-90,y:-28,width:180,height:56,rx:28,fill:'#ffd9b0',class:'o'},inner);E('rect',{x:-30,y:-22,width:60,height:44,rx:8,fill:'#f2b98a'},inner);
    for(const a of [-60,-45,45,60])E('circle',{cx:a,cy:0,r:4,fill:'#c98a5a'},inner);}
  else if(kind==='cloth'){E('rect',{x:-70,y:-60,width:140,height:120,rx:10,fill:'#6a3fd6',class:'o'},inner);
    E('rect',{x:-58,y:-48,width:116,height:96,rx:6,fill:'none',stroke:'#ffd23f','stroke-width':6,'stroke-dasharray':'12 9'},inner);}
  else if(kind==='tape'){for(const a of [40,-40])E('rect',{x:-80,y:-14,width:160,height:28,fill:'#e8e2c8',class:'o2',transform:`rotate(${a})`},inner);}
  else if(kind==='bucket'){E('path',{d:'M -50 -40 L 50 -40 L 38 40 L -38 40 Z',fill:'#9aa3b8',class:'o'},inner);E('path',{d:'M -50 -40 Q 0 -110 50 -40',class:'ln'},inner);}
  g.x=x;g.y=y;g.r=r;return g;}
window.babaJaga=babaJaga;window.patch=patch;
})();
/* z: filmik_podwodne_krolestwo/animacja/scena.html */
(function(){
function blob(parent,shapes,fill,cls){ // jeden kontur dla kilku kształtów
  const g=E('g',{},parent);
  const go=E('g',{fill:OUT,class:'ob'},g), gf=E('g',{fill},g);
  for(const [tag,a] of shapes){E(tag,a,go);E(tag,a,gf);}
  return g;
}
function buildPrince(p){
  const g=E('g',{},p);
  const body=E('g',{},g);
  const cape=E('path',{fill:'#d63345',class:'o'},body);
  function arm(px,py){const a=E('g',{},body);const inner=E('g',{},a);
    E('rect',{x:-17,y:-6,width:34,height:104,rx:17,fill:'#3949c7',class:'o'},inner);
    E('rect',{x:-18,y:74,width:36,height:14,rx:5,fill:'#f4b63f',class:'o2'},inner);
    E('circle',{cx:0,cy:104,r:20,fill:'#e9a83c',class:'o'},inner);
    return {a,inner,px,py};}
  const armL=arm(-60,-232);
  const legsS=E('g',{},body);
  E('rect',{x:-37,y:-136,width:27,height:104,rx:8,fill:'#2b3aa8',class:'o'},legsS);E('rect',{x:10,y:-136,width:27,height:104,rx:8,fill:'#2b3aa8',class:'o'},legsS);
  E('rect',{x:-44,y:-44,width:38,height:44,rx:10,fill:'#7a4a28',class:'o'},legsS);E('rect',{x:6,y:-44,width:38,height:44,rx:10,fill:'#7a4a28',class:'o'},legsS);
  E('rect',{x:-44,y:-14,width:38,height:14,rx:5,fill:'#e9a83c',class:'o2'},legsS);E('rect',{x:6,y:-14,width:38,height:14,rx:5,fill:'#e9a83c',class:'o2'},legsS);
  const legsSit=E('g',{opacity:0},body);
  E('rect',{x:-30,y:-150,width:96,height:32,rx:14,fill:'#2b3aa8',class:'o'},legsSit);
  E('rect',{x:44,y:-150,width:28,height:84,rx:10,fill:'#2b3aa8',class:'o'},legsSit);
  E('rect',{x:38,y:-80,width:46,height:34,rx:10,fill:'#7a4a28',class:'o'},legsSit);
  E('rect',{x:-6,y:-252,width:12,height:4,fill:'none'},body);
  E('rect',{x:-62,y:-254,width:124,height:136,rx:34,fill:'#3949c7',class:'o'},body);
  E('polygon',{points:'-58,-236 -36,-252 62,-150 40,-128',fill:'#e23b4e'},body);
  E('rect',{x:-62,y:-150,width:124,height:20,fill:'#f4b63f',class:'o2'},body);
  E('rect',{x:-13,y:-155,width:26,height:30,rx:5,fill:'#ffd86b',class:'o2'},body);
  E('ellipse',{cx:-56,cy:-240,rx:24,ry:13,fill:'#f4b63f',class:'o'},body);E('ellipse',{cx:56,cy:-240,rx:24,ry:13,fill:'#f4b63f',class:'o'},body);
  E('ellipse',{cx:0,cy:-254,rx:72,ry:20,fill:'#c98a2e',class:'o'},body);
  // hełm
  const helm=E('g',{},body);
  E('rect',{x:56,y:-402,width:18,height:34,rx:6,fill:'#c98a2e',class:'o2',transform:'rotate(28 65 -385)'},helm);
  E('circle',{cx:0,cy:-322,r:80,fill:'url(#gBrass)',class:'o'},helm);
  E('ellipse',{cx:-71,cy:-326,rx:9,ry:17,fill:'#bfeefc',class:'o2'},helm);E('ellipse',{cx:71,cy:-326,rx:9,ry:17,fill:'#bfeefc',class:'o2'},helm);
  E('circle',{cx:0,cy:-316,r:55,fill:'#f6c25a',class:'o'},helm);
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;E('circle',{cx:Math.cos(a)*49,cy:-316+Math.sin(a)*49,r:4.5,fill:'#ffe29a',class:'o2'},helm);}
  E('circle',{cx:0,cy:-316,r:43,fill:'#bfeefc',class:'o'},helm);
  const face=E('g',{'clip-path':'url(#cpGlass)'},helm);
  E('circle',{cx:0,cy:-304,r:38,fill:'#f8cfa6'},face);
  E('path',{d:'M -42 -318 Q -32 -356 0 -354 Q 34 -356 42 -318 Q 28 -334 14 -324 Q 2 -338 -12 -324 Q -26 -336 -42 -318 Z',fill:'#ffd23f',class:'o2'},face);
  const eyesOpen=E('g',{},face);
  const eL=E('ellipse',{cx:-13,cy:-305,rx:5.5,ry:7.5,fill:OUT},eyesOpen),eR=E('ellipse',{cx:13,cy:-305,rx:5.5,ry:7.5,fill:OUT},eyesOpen);
  E('circle',{cx:-11,cy:-308,r:1.8,fill:'#fff'},eyesOpen);E('circle',{cx:15,cy:-308,r:1.8,fill:'#fff'},eyesOpen);
  const eyesClosed=E('g',{},face);
  E('path',{d:'M -19 -304 Q -13 -298 -7 -304',class:'ln'},eyesClosed);E('path',{d:'M 7 -304 Q 13 -298 19 -304',class:'ln'},eyesClosed);
  E('circle',{cx:-24,cy:-291,r:7,fill:'#ff8fa3',opacity:0.75},face);E('circle',{cx:24,cy:-291,r:7,fill:'#ff8fa3',opacity:0.75},face);
  const mouth=E('path',{d:'M -10 -288 Q 0 -278 10 -288',class:'ln'},face);
  const mouthO=E('ellipse',{cx:2,cy:-284,rx:5,ry:6,fill:OUT,opacity:0},face);
  E('circle',{cx:0,cy:-316,r:43,fill:'#9fe2f5',opacity:0.18},helm);
  E('path',{d:'M -30 -338 A 34 34 0 0 1 -8 -351',fill:'none',stroke:'#fff','stroke-width':7,'stroke-linecap':'round',opacity:0.85},helm);
  E('circle',{cx:22,cy:-292,r:4,fill:'#fff',opacity:0.7},helm);
  // korona przyspawana
  E('path',{d:'M -40 -394 L -46 -444 L -22 -420 L 0 -456 L 22 -420 L 46 -444 L 40 -394 Z',fill:'#ffcf3a',class:'o'},helm);
  E('rect',{x:-42,y:-404,width:84,height:14,rx:4,fill:'#f4a52a',class:'o2'},helm);
  E('circle',{cx:0,cy:-432,r:6.5,fill:'#e23b4e',class:'o2'},helm);E('circle',{cx:-30,cy:-420,r:4.5,fill:'#5f8bff',class:'o2'},helm);E('circle',{cx:30,cy:-420,r:4.5,fill:'#5f8bff',class:'o2'},helm);
  E('path',{d:'M -30 -392 l 6 5 l 6 -5 l 6 5 l 6 -5 l 6 5 l 6 -5 l 6 5 l 6 -5 l 6 5',class:'ln',style:'stroke:#8a5a1a'},helm);
  const armR=arm(60,-232);
  // pantofelek z perłowej muszli
  const slip=E('g',{},armR.inner);
  const slipIn=E('g',{},slip);
  const sglow=E('circle',{cx:0,cy:-6,r:70,fill:'url(#gGlow)',opacity:0},slipIn);
  E('path',{d:'M -44 8 Q -48 -24 -32 -32 L -22 -32 Q -14 -12 8 -10 Q 32 -9 46 2 Q 52 12 42 16 L -36 16 Q -46 16 -44 8 Z',fill:'url(#gPearl)',class:'o'},slipIn);
  E('rect',{x:-42,y:14,width:10,height:16,rx:3,fill:'url(#gPearl)',class:'o2'},slipIn);
  for(let i=0;i<4;i++)E('path',{d:`M ${10+i*8} ${-6+i*2} q 4 8 0 18`,class:'ln',style:'stroke:#c9a8e8'},slipIn);
  E('path',{d:'M -36 -22 q 4 -6 10 -6',fill:'none',stroke:'#fff','stroke-width':4,'stroke-linecap':'round'},slipIn);
  slip.setAttribute('transform','translate(0,128)');
  return {g,body,cape,armL,armR,legsS,legsSit,eyesOpen,eyesClosed,eL,eR,mouth,mouthO,slip,slipIn,sglow};
}
function buildSeahorse(p){
  const g=E('g',{},p);
  const fin=E('g',{},g);
  E('path',{d:'M -74 -60 Q -150 -50 -146 0 Q -142 40 -72 32 Z',fill:'#fff0c4',class:'o',opacity:0.95},fin);
  for(let i=0;i<5;i++)E('path',{d:`M -74 ${-50+i*20} L ${-138+Math.abs(i-2)*6} ${-44+i*20}`,class:'ln'},fin);
  const tail=E('g',{},g);const rings=[];
  for(let i=0;i<24;i++)rings.push(E('circle',{r:10,fill:i%2?'#ffad4d':'#f59a35',class:'o'},tail));
  blob(g,[['path',{d:'M -25 -150 C -58 -120 -80 -80 -80 -30 C -80 30 -60 82 -30 118 L 12 120 C 56 86 80 36 72 -20 C 66 -70 52 -98 54 -126 Z'}],
          ['ellipse',{cx:22,cy:-168,rx:58,ry:50}],
          ['path',{d:'M 60 -190 L 140 -182 Q 160 -180 160 -164 Q 160 -150 140 -150 L 58 -146 Z'}]],'#ffad4d');
  E('path',{d:'M 30 -112 C 62 -70 78 -10 68 40 C 60 80 42 102 16 114 L 2 114 C 32 82 50 30 48 -20 C 46 -60 32 -92 16 -114 Z',fill:'#ffe0a0'},g);
  for(let i=0;i<6;i++){const y=-84+i*32;E('path',{d:`M ${36+Math.sin(i*0.6)*10} ${y} q ${18} 4 ${30-Math.abs(i-2.5)*4} ${-2}`,class:'ln'},g);}
  for(let i=0;i<4;i++)E('path',{d:`M ${-70+i*4} ${-90+i*40} q -10 14 0 26`,class:'ln',style:'stroke:#e07f22'},g);
  E('path',{d:'M -8 -206 L 0 -238 L 14 -212 L 24 -244 L 36 -214 L 48 -236 L 54 -204 Z',fill:'#f08a2b',class:'o2'},g);
  E('path',{d:'M 46 -118 Q 84 -122 78 -92 Q 60 -96 46 -104 Z',fill:'#fff0c4',class:'o2'},g);
  const eye=E('g',{},g);
  E('circle',{cx:42,cy:-176,r:18,fill:'#fff',class:'o2'},eye);E('circle',{cx:47,cy:-175,r:9,fill:OUT},eye);E('circle',{cx:50,cy:-179,r:3.4,fill:'#fff'},eye);
  E('path',{d:'M 26 -198 q 16 -10 32 -4',class:'ln'},g);
  E('circle',{cx:64,cy:-150,r:9,fill:'#ff8fa3',opacity:0.7},g);
  E('path',{d:'M 150 -152 q -6 6 -14 4',class:'ln'},g);
  // derka i siodło
  E('path',{d:'M -50 -134 C -66 -114 -78 -90 -80 -58 L -79 -40 Q -42 -30 -4 -46 L -8 -126 Q -28 -138 -50 -134 Z',fill:'#3b4fd0',class:'o'},g);
  for(let i=0;i<7;i++)E('circle',{cx:-76+i*12,cy:-36-i*1.6,r:5.5,fill:'#ffd23f',class:'o2'},g);
  E('path',{d:'M -72 -96 Q -40 -104 -8 -104',fill:'none',stroke:'#ffd23f','stroke-width':6,'stroke-linecap':'round'},g);
  E('path',{d:'M -88 -132 Q -50 -160 -10 -140 Q -18 -112 -48 -110 Q -78 -112 -88 -132 Z',fill:'#c8283c',class:'o'},g);
  E('path',{d:'M -80 -132 Q -50 -150 -18 -138',fill:'none',stroke:'#ffd23f','stroke-width':5,'stroke-linecap':'round'},g);
  E('circle',{cx:-12,cy:-146,r:9,fill:'#ffd23f',class:'o2'},g);
  return {g,fin,rings};
}
function arm(px,py){const a=E('g',{},body);const inner=E('g',{},a);
    E('rect',{x:-17,y:-6,width:34,height:104,rx:17,fill:'#3949c7',class:'o'},inner);
    E('rect',{x:-18,y:74,width:36,height:14,rx:5,fill:'#f4b63f',class:'o2'},inner);
    E('circle',{cx:0,cy:104,r:20,fill:'#e9a83c',class:'o'},inner);
    return {a,inner,px,py};}
window.buildPrince=buildPrince;window.buildSeahorse=buildSeahorse;
})();
/* z: smok_podniebne_krolestwo/animacja/smok2.js */
(function(){
function person(p,o){const P={};const g=E('g',{},p);P.g=g;const sk=o.skin||'#ffd0a8',sh=o.shirt||'#ff6b6b';
  for(const x of [-42,10])E('rect',{x,y:-100,width:32,height:96,rx:12,fill:o.pants||'#3b4a8a',class:'o2'},g);
  for(const x of [-28,28])E('ellipse',{cx:x,cy:-4,rx:28,ry:14,fill:OUT},g);
  E('path',{d:'M -64 -96 L -60 -200 Q -60 -232 -28 -232 L 28 -232 Q 60 -232 60 -200 L 64 -96 Z',fill:sh,class:'o'},g);
  if(o.helmet){E('path',{d:'M -34 -205 L 34 -205 L 30 -140 Q 0 -118 -30 -140 Z',fill:'#ff4b5c',class:'o2'},g);E('path',{d:'M 0 -195 L 0 -130 M -22 -170 L 22 -170',class:'ln',style:'stroke:#ffd23f;stroke-width:9px'},g);}
  const hd=E('g',{},g);P.hd=hd;E('circle',{cx:0,cy:-286,r:58,fill:sk,class:'o'},hd);
  const face=E('g',{},hd);P.face=face;
  for(const s of [-1,1]){E('ellipse',{cx:s*20,cy:-292,rx:8,ry:10,fill:OUT},face);E('circle',{cx:s*38,cy:-266,r:10,fill:'#ff9ab8',opacity:0.6},face);}
  P.mC=E('path',{d:'M -16 -262 Q 0 -250 16 -262',class:'ln'},face);P.mO=E('ellipse',{cx:0,cy:-258,rx:15,ry:13,fill:'#8a1f3a',class:'o2',opacity:0},face);
  if(o.helmet){E('path',{d:'M -66 -250 L -66 -292 Q -66 -362 0 -364 Q 66 -362 66 -292 L 66 -250 L 48 -250 L 48 -308 L -48 -308 L -48 -250 Z',fill:'#c8cde0',class:'o'},hd);
    E('path',{d:'M 0 -360 Q 30 -430 86 -404 Q 52 -386 42 -352 Z',fill:'#ff4b5c',class:'o2'},hd);}
  else E('path',{d:'M -62 -290 Q -64 -352 0 -354 Q 64 -352 62 -290 Q 32 -322 0 -318 Q -32 -322 -62 -290 Z',fill:o.hair||'#8a5a3c',class:'o2'},hd);
  if(o.cap)E('path',{d:'M -60 -320 Q 0 -380 60 -320 L 100 -316 L 60 -306 L -60 -306 Z',fill:o.cap,class:'o2'},hd);
  const back=E('g',{opacity:0},hd);P.back=back;E('circle',{cx:0,cy:-286,r:58,fill:o.helmet?'#c8cde0':(o.cap||o.hair||'#8a5a3c'),class:'o'},back);
  if(o.helmet)E('path',{d:'M 0 -360 Q 30 -430 86 -404 Q 52 -386 42 -352 Z',fill:'#ff4b5c',class:'o2'},back);
  const aL=limb(g,26,sh),aR=limb(g,26,sh);const hL=E('circle',{r:17,fill:sk,class:'o2'},g),hR=E('circle',{r:17,fill:sk,class:'o2'},g);
  P.set=(s)=>{place(g,s.x,s.y,s.s);const L=s.aL||[-80,-120],R=s.aR||[80,-120];aL([-50,-205],L,-30);aR([50,-205],R,30);
    hL.setAttribute('cx',L[0]);hL.setAttribute('cy',L[1]);hR.setAttribute('cx',R[0]);hR.setAttribute('cy',R[1]);
    P.mO.setAttribute('opacity',s.mo?1:0);P.mC.setAttribute('opacity',s.mo?0:1);face.setAttribute('opacity',s.back?0:1);back.setAttribute('opacity',s.back?1:0);
    hd.setAttribute('transform',`rotate(${(s.hr||0).toFixed(2)} 0 -230)`);};
  return P;}
window.person=person;
})();
