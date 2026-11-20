'use strict';
/* Rekwizyty podniebnego świata — wspólne dla smoka i shortów. */
function limb(p,w,col){const a=E('path',{fill:'none',stroke:OUT,'stroke-width':w+13,'stroke-linecap':'round','stroke-linejoin':'round'},p);
  const b=E('path',{fill:'none',stroke:col,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},p);
  return (S,H,bend)=>{const mx=(S[0]+H[0])/2,my=(S[1]+H[1])/2,dx=H[0]-S[0],dy=H[1]-S[1],l=Math.hypot(dx,dy)||1;
    const cx=mx-dy/l*(bend||0),cy=my+dx/l*(bend||0);const d=`M ${S[0].toFixed(1)} ${S[1].toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${H[0].toFixed(1)} ${H[1].toFixed(1)}`;
    a.setAttribute('d',d);b.setAttribute('d',d);};}
function cloudSoft(p,x,y,s,op,col){const g=E('g',{opacity:op||0.8,fill:col||'#ffffff'},p);
  for(let i=0;i<5;i++){const f=i/4;E('circle',{cx:x+(f-0.5)*230*s,cy:y-Math.sin(f*Math.PI)*36*s,r:(48+30*Math.sin(f*Math.PI))*s},g);}
  E('rect',{x:x-118*s,y:y-10*s,width:236*s,height:52*s,rx:26*s},g);return g;}
function balloon(p,cA,cB){const g=E('g',{},p);
  E('path',{d:'M -62 92 L -38 196 M 62 92 L 38 196 M 0 118 L 0 196',class:'ln'},g);
  E('path',{d:'M 0 120 C -60 110 -150 40 -150 -40 C -150 -130 -80 -180 0 -180 C 80 -180 150 -130 150 -40 C 150 40 60 110 0 120 Z',fill:cA,class:'o'},g);
  E('path',{d:'M 0 -180 C -48 -150 -64 -60 -48 20 C -40 70 -20 104 0 120 C 20 104 40 70 48 20 C 64 -60 48 -150 0 -180 Z',fill:cB,class:'o2'},g);
  E('path',{d:'M -128 -100 Q -120 -140 -80 -160',fill:'none',stroke:'#fff','stroke-width':12,'stroke-linecap':'round',opacity:0.7},g);
  E('rect',{x:-46,y:194,width:92,height:62,rx:10,fill:'#c98a4b',class:'o'},g);E('path',{d:'M -46 214 L 46 214',class:'ln'},g);
  return g;}
function bird(p,col){const g=E('g',{},p);const w=E('path',{fill:'none',stroke:col||OUT,'stroke-width':11,'stroke-linecap':'round','stroke-linejoin':'round'},g);
  E('circle',{r:9,fill:col||OUT},g);return {g,w};}
function birdFlap(b,ph){const a=Math.sin(ph);b.w.setAttribute('d',`M -46 ${(-6-14*a).toFixed(1)} Q -22 ${(-30*a).toFixed(1)} 0 0 Q 22 ${(-30*a).toFixed(1)} 46 ${(-6-14*a).toFixed(1)}`);}
function tree(p,x,y,s,col){const g=E('g',{},p);E('rect',{x:x-12*s,y:y-60*s,width:24*s,height:60*s,fill:'#9a6a46',class:'o2'},g);
  blob(g,[['circle',{cx:x,cy:y-110*s,r:58*s}],['circle',{cx:x-42*s,cy:y-80*s,r:40*s}],['circle',{cx:x+42*s,cy:y-80*s,r:40*s}]],col||'#5fcf7a');return g;}
function house(p,x,y,s,wall,roof){const g=E('g',{},p);E('rect',{x:x-60*s,y:y-90*s,width:120*s,height:90*s,fill:wall||'#fff3d6',class:'o'},g);
  E('path',{d:`M ${x-78*s} ${y-86*s} L ${x} ${y-160*s} L ${x+78*s} ${y-86*s} Z`,fill:roof||'#ff6b6b',class:'o'},g);
  E('rect',{x:x-18*s,y:y-60*s,width:36*s,height:36*s,rx:6*s,fill:'#ffd23f',class:'o2'},g);return g;}
/* mała latająca wyspa z dekoracją */
function miniIsland(p,x,y,s,kind){const g=E('g',{},p);island(g,x,y,420*s,300*s,'#7fdc7a','#9d92c9');
  if(kind==='house'){house(g,x-40*s,y-16*s,s);tree(g,x+120*s,y-16*s,s*0.8);}
  else if(kind==='trees'){tree(g,x-90*s,y-16*s,s);tree(g,x+40*s,y-16*s,s*1.2);tree(g,x+140*s,y-16*s,s*0.8);}
  else if(kind==='mill'){E('rect',{x:x-40*s,y:y-200*s,width:80*s,height:184*s,fill:'#fff3d6',class:'o'},g);
    E('path',{d:`M ${x-50*s} ${y-196*s} L ${x} ${y-250*s} L ${x+50*s} ${y-196*s} Z`,fill:'#ff8f6b',class:'o'},g);
    const bl=E('g',{},g);for(let i=0;i<4;i++)E('rect',{x:-14*s,y:-150*s,width:28*s,height:140*s,rx:8*s,fill:'#ffe9c7',class:'o2',transform:`rotate(${i*90})`},bl);
    bl.setAttribute('transform',`translate(${x} ${y-200*s})`);g.blades=bl;g.bx=x;g.by=y-200*s;}
  return g;}
/* Wawel — stylizowany zamek: początek układu w środku podstawy (y=0) */
function castle(p){const g=E('g',{},p),S={g};
  const W='#f7e7c6',W2='#efd6a6',RED='#ec6a52',GRN='#5fc9a5',GOLD='#ffc93c',WIN='#3b2f66';
  const win=(x,y,w,h)=>E('path',{d:`M ${x-w/2} ${y+h/2} L ${x-w/2} ${y-h/2+w/2} A ${w/2} ${w/2} 0 0 1 ${x+w/2} ${y-h/2+w/2} L ${x+w/2} ${y+h/2} Z`,fill:WIN,class:'o2'},g);
  // katedra (tył)
  E('rect',{x:-160,y:-440,width:600,height:200,fill:W2,class:'o'},g);
  E('path',{d:'M -175 -436 L -60 -520 L 440 -520 L 455 -436 Z',fill:RED,class:'o'},g);
  for(let i=0;i<5;i++)win(-110+i*120,-360,44,90);
  // wieża zegarowa
  E('rect',{x:300,y:-640,width:120,height:400,fill:W,class:'o'},g);
  E('path',{d:'M 290 -636 L 360 -860 L 430 -636 Z',fill:GRN,class:'o'},g);E('path',{d:'M 360 -860 L 360 -910',class:'ln'},g);
  E('circle',{cx:360,cy:-580,r:36,fill:'#fff',class:'o2'},g);E('path',{d:'M 360 -600 L 360 -580 L 376 -572',class:'ln'},g);
  // wieża zygmuntowska z dzwonem
  E('rect',{x:105,y:-660,width:170,height:420,fill:W,class:'o'},g);
  E('path',{d:'M 92 -656 Q 92 -760 190 -790 Q 288 -760 288 -656 Z',fill:GRN,class:'o'},g);
  E('path',{d:'M 190 -790 L 190 -880',class:'ln'},g);E('circle',{cx:190,cy:-884,r:12,fill:GOLD,class:'o2'},g);
  for(const sx of [96,284]){E('path',{d:`M ${sx-22} -650 L ${sx} -740 L ${sx+22} -650 Z`,fill:GRN,class:'o2'},g);}
  E('path',{d:'M 130 -470 L 130 -560 A 60 60 0 0 1 250 -560 L 250 -470 Z',fill:WIN,class:'o2'},g);
  const bell=E('g',{},g);E('path',{d:'M -36 70 Q -36 10 0 6 Q 36 10 36 70 L 46 84 L -46 84 Z',fill:GOLD,class:'o'},bell);E('circle',{cx:0,cy:92,r:11,fill:GOLD,class:'o2'},bell);
  E('path',{d:'M 0 6 L 0 -16',class:'ln'},bell);S.bell=bell;S.bellX=190;S.bellY=-580;
  // złota kopuła
  E('rect',{x:-150,y:-520,width:150,height:90,fill:W,class:'o'},g);
  E('path',{d:'M -165 -516 Q -165 -640 -75 -650 Q 15 -640 15 -516 Z',fill:GOLD,class:'o'},g);
  E('path',{d:'M -120 -540 Q -118 -610 -80 -628',fill:'none',stroke:'#fff4b8','stroke-width':12,'stroke-linecap':'round'},g);
  E('rect',{x:-95,y:-700,width:40,height:52,fill:W,class:'o2'},g);E('path',{d:'M -102 -698 Q -75 -748 -48 -698 Z',fill:GOLD,class:'o2'},g);
  // zamek z dziedzińcem
  E('rect',{x:-520,y:-400,width:380,height:160,fill:W,class:'o'},g);E('path',{d:'M -535 -396 L -500 -460 L -160 -460 L -125 -396 Z',fill:RED,class:'o'},g);
  for(let i=0;i<4;i++)win(-470+i*95,-320,40,70);
  // mur z blankami
  let d='M -720 0 L -720 -270';for(let i=0;i<18;i++){const x=-720+i*80;d+=` L ${x} -300 L ${x+40} -300 L ${x+40} -270 L ${x+80} -270`;}d+=' L 720 0 Z';
  E('path',{d,fill:'#f2dcb0',class:'o'},g);
  E('path',{d:'M -70 0 L -70 -110 A 70 70 0 0 1 70 -110 L 70 0 Z',fill:'#6b4a3a',class:'o'},g);
  for(let i=0;i<9;i++)E('path',{d:`M ${-62+i*15.5} -2 L ${-62+i*15.5} -150`,class:'ln',style:'stroke:#4a3226'},g);
  for(const x of [-420,-300,280,420])win(x,-150,36,60);
  // narożne wieże
  E('rect',{x:-650,y:-600,width:180,height:600,fill:'#f4dcae',class:'o'},g);
  E('path',{d:'M -672 -596 L -560 -830 L -448 -596 Z',fill:RED,class:'o'},g);win(-560,-470,46,80);win(-560,-300,46,80);
  E('path',{d:'M -560 -830 L -560 -930',class:'ln'},g);
  const flag=E('path',{fill:'#ffffff',class:'o2'},g);const flag2=E('path',{fill:'#ff4b5c',class:'o2'},g);S.flag=[flag,flag2];
  E('rect',{x:550,y:-520,width:140,height:520,fill:'#f4dcae',class:'o'},g);
  E('path',{d:'M 536 -516 Q 536 -600 620 -626 Q 704 -600 704 -516 Z',fill:GRN,class:'o'},g);E('path',{d:'M 620 -626 L 620 -700',class:'ln'},g);
  E('circle',{cx:620,cy:-706,r:14,fill:GOLD,class:'o2'},g);win(620,-400,40,70);win(620,-250,40,70);
  S.update=(t,bh)=>{const sw=Math.sin(t*9)*6;
    let a='M -560 -925',b='';const pts=[];for(let i=0;i<=6;i++){const x=-560+i*30;pts.push([x,-925+Math.sin(t*10-i*0.9)*6*(i/6)]);}
    a='M '+pts.map(q=>q[0]+' '+q[1].toFixed(1)).join(' L ');const low=pts.slice().reverse().map(q=>q[0]+' '+(q[1]+30).toFixed(1));
    flag.setAttribute('d',a+' L '+low.join(' L ')+' Z');
    const low2=pts.slice().reverse().map(q=>q[0]+' '+(q[1]+60).toFixed(1));flag2.setAttribute('d','M '+pts.map(q=>q[0]+' '+(q[1]+30).toFixed(1)).join(' L ')+' L '+low2.join(' L ')+' Z');
    bell.setAttribute('transform',`translate(${S.bellX} ${S.bellY}) rotate(${(bh||0).toFixed(2)})`);};
  return S;}
/* Smok-kucharz: turkusowy, gogle lotnika, fartuch. Układ: (0,0) = pas (blat lady), głowa ~ -440 */
function dragon(p){const D={};const g=E('g',{},p);D.g=g;const B='#3cc9b0',BD='#23917f',BEL='#dcf7c8';
  const tail=E('g',{},g);E('path',{d:'M 110 10 C 230 0 300 -60 290 -170 C 286 -220 250 -240 230 -230',fill:'none',stroke:OUT,'stroke-width':70,'stroke-linecap':'round'},tail);
  E('path',{d:'M 110 10 C 230 0 300 -60 290 -170 C 286 -220 250 -240 230 -230',fill:'none',stroke:B,'stroke-width':54,'stroke-linecap':'round'},tail);
  E('path',{d:'M 230 -230 L 196 -290 L 262 -268 Z',fill:BD,class:'o'},tail);D.tail=tail;
  // nogi (domyślnie ukryte — w budce zasłania je lada)
  const legG=E('g',{opacity:0},g);D.legG=legG;const lgL=limb(legG,42,B),lgR=limb(legG,42,B);
  const ftL=E('ellipse',{rx:46,ry:22,fill:BD,class:'o'},legG),ftR=E('ellipse',{rx:46,ry:22,fill:BD,class:'o'},legG);
  D.legs=(fL,fR)=>{lgL([-62,10],fL,-14);lgR([62,10],fR,14);ftL.setAttribute('transform',`translate(${(fL[0]-14).toFixed(1)} ${(fL[1]+8).toFixed(1)})`);ftR.setAttribute('transform',`translate(${(fR[0]+14).toFixed(1)} ${(fR[1]+8).toFixed(1)})`);};
  const wing=(s)=>{const w=E('g',{},g);E('path',{d:`M ${s*90} -290 L ${s*330} -480 Q ${s*318} -410 ${s*345} -360 Q ${s*300} -345 ${s*312} -295 Q ${s*262} -296 ${s*232} -246 Q ${s*170} -250 ${s*120} -220 Z`,fill:'#8fe3d2',class:'o'},w);
    E('path',{d:`M ${s*90} -290 L ${s*330} -480 M ${s*120} -270 L ${s*300} -350 M ${s*120} -250 L ${s*240} -260`,class:'ln'},w);return w;};
  D.wL=wing(-1);D.wR=wing(1);
  E('path',{d:'M -150 40 C -162 -120 -142 -262 -96 -322 L 96 -322 C 142 -262 162 -120 150 40 Z',fill:B,class:'o'},g);
  E('path',{d:'M -92 40 C -102 -100 -88 -222 -62 -292 L 62 -292 C 88 -222 102 -100 92 40 Z',fill:BEL,class:'o2'},g);
  E('rect',{x:-104,y:-252,width:208,height:300,rx:18,fill:'#ffffff',class:'o'},g);
  E('path',{d:'M -96 -246 L -58 -330 M 96 -246 L 58 -330',fill:'none',stroke:'#ff6b6b','stroke-width':16,'stroke-linecap':'round'},g);
  E('path',{d:'M -60 -100 L 60 -100 L 60 -40 L -60 -40 Z',fill:'#ffe9a8',class:'o2'},g);
  E('path',{d:'M 0 -200 C 30 -170 26 -140 0 -128 C -26 -140 -30 -170 0 -200 Z',fill:'#ff8a3d',class:'o2'},g);
  const head=E('g',{},g);D.head=head;
  for(const s of [-1,1]){E('path',{d:`M ${s*62} -500 Q ${s*112} -590 ${s*62} -624 Q ${s*58} -556 ${s*24} -510 Z`,fill:'#fff1c2',class:'o'},head);
    E('path',{d:`M ${s*128} -440 L ${s*214} -486 L ${s*184} -430 L ${s*212} -388 Z`,fill:BD,class:'o'},head);}
  E('path',{d:'M -24 -548 L 0 -592 L 24 -548 Z',fill:BD,class:'o2'},head);
  blob(head,[['ellipse',{cx:0,cy:-440,rx:142,ry:112}],['ellipse',{cx:0,cy:-372,rx:124,ry:74}]],B);
  E('ellipse',{cx:0,cy:-360,rx:96,ry:46,fill:'#62dcc4'},head);
  E('ellipse',{cx:-30,cy:-392,rx:9,ry:7,fill:OUT},head);E('ellipse',{cx:30,cy:-392,rx:9,ry:7,fill:OUT},head);
  for(const s of [-1,1])E('circle',{cx:s*96,cy:-384,r:18,fill:'#ff9ab8',opacity:0.65},head);
  D.mouthC=E('path',{d:'M -66 -346 Q 0 -310 66 -346',class:'ln'},head);
  const mo=E('g',{opacity:0},head);E('ellipse',{cx:0,cy:-334,rx:52,ry:32,fill:'#8a1f3a',class:'o2'},mo);E('ellipse',{cx:0,cy:-318,rx:28,ry:12,fill:'#ff7f9a'},mo);D.mouthO=mo;
  const eo=E('g',{},head);for(const s of [-1,1]){E('ellipse',{cx:s*55,cy:-466,rx:30,ry:34,fill:'#fff',class:'o2'},eo);}
  D.pupL=E('circle',{cx:-50,cy:-462,r:14,fill:OUT},eo);D.pupR=E('circle',{cx:60,cy:-462,r:14,fill:OUT},eo);
  E('circle',{cx:-45,cy:-468,r:5,fill:'#fff'},eo);E('circle',{cx:65,cy:-468,r:5,fill:'#fff'},eo);D.eyesO=eo;
  const ec=E('g',{opacity:0},head);E('path',{d:'M -82 -462 Q -55 -444 -28 -462 M 28 -462 Q 55 -444 82 -462',class:'ln'},ec);D.eyesC=ec;
  const eh=E('g',{opacity:0},head);E('path',{d:'M -82 -456 Q -55 -486 -28 -456 M 28 -456 Q 55 -486 82 -456',class:'ln'},eh);D.eyesH=eh;
  E('path',{d:'M -138 -508 Q 0 -548 138 -508',fill:'none',stroke:OUT,'stroke-width':24,'stroke-linecap':'round'},head);
  E('path',{d:'M -138 -508 Q 0 -548 138 -508',fill:'none',stroke:'#8a5a3c','stroke-width':12,'stroke-linecap':'round'},head);
  for(const s of [-1,1]){E('circle',{cx:s*48,cy:-528,r:32,fill:'#8a5a3c',class:'o'},head);E('circle',{cx:s*48,cy:-528,r:21,fill:'#9fe7ff',class:'o2'},head);
    E('path',{d:`M ${s*48-10} -536 Q ${s*48-4} -544 ${s*48+6} -542`,fill:'none',stroke:'#fff','stroke-width':6,'stroke-linecap':'round'},head);}
  // ręce
  const armL=limb(g,46,B),armR=limb(g,46,B);
  const hand=(knife)=>{const h=E('g',{},g);if(knife){E('rect',{x:-8,y:-70,width:16,height:60,rx:6,fill:'#8a5a3c',class:'o2'},h);
      E('path',{d:'M -36 -70 L 30 -70 L 30 -160 Q -10 -168 -36 -150 Z',fill:'#dfe6f2',class:'o'},h);}
    E('circle',{r:28,fill:B,class:'o'},h);for(const a of [-40,0,40])E('path',{d:'M -7 -24 L 0 -42 L 7 -24 Z',fill:'#fff1c2',class:'o2',transform:`rotate(${a})`},h);return h;};
  D.hL=hand(true);D.hR=hand(false);
  D.set=(o)=>{const sl=o.sleep||0,s0=o.s||1;g.setAttribute('transform',`translate(${(+o.x).toFixed(1)} ${(+o.y).toFixed(1)}) rotate(${(o.r||0).toFixed(2)}) scale(${(s0*(o.fx||1)).toFixed(3)} ${s0.toFixed(3)}) translate(0 ${(sl*230+(o.bob||0)).toFixed(1)})`);
    legG.setAttribute('opacity',o.legs?1:0);if(o.legs)D.legs(o.fL||[-70,150],o.fR||[70,150]);
    head.setAttribute('transform',`rotate(${((o.hr||0)+sl*12).toFixed(2)} 0 -330)`);
    D.mouthO.setAttribute('opacity',o.mouth>0.5?1:0);D.mouthC.setAttribute('opacity',o.mouth>0.5?0:1);
    const ey=o.eyes===undefined?1:o.eyes;D.eyesO.setAttribute('opacity',ey>0.5&&!o.happy?1:0);D.eyesC.setAttribute('opacity',ey<=0.5?1:0);D.eyesH.setAttribute('opacity',ey>0.5&&o.happy?1:0);
    const lx=o.look||0;D.pupL.setAttribute('cx',-50+lx*10);D.pupR.setAttribute('cx',60+lx*10);
    const aL=o.aL||[-180,-60],aR=o.aR||[180,-60];armL([-118,-280],aL,-60);armR([118,-280],aR,60);
    D.hL.setAttribute('transform',`translate(${aL[0]} ${aL[1]}) rotate(${o.kn||-20})`);D.hR.setAttribute('transform',`translate(${aR[0]} ${aR[1]})`);
    D.tail.setAttribute('transform',`rotate(${(o.tw||0).toFixed(2)} 110 10)`);
    D.wL.setAttribute('transform',`rotate(${(-(o.wf||0)).toFixed(2)} -90 -290)`);D.wR.setAttribute('transform',`rotate(${(o.wf||0).toFixed(2)} 90 -290)`);};
  return D;}
/* sterowiec-wyszukiwarka (nos w lewo) */
function blimp(p){const S={};const g=E('g',{},p);S.g=g;
  E('path',{d:'M 250 -40 L 390 -150 L 400 -60 Z',fill:'#ff6b8f',class:'o'},g);E('path',{d:'M 250 40 L 390 150 L 400 60 Z',fill:'#ff6b8f',class:'o'},g);
  E('path',{d:'M 120 110 L 150 150 M -60 118 L -80 150',class:'ln'},g);
  E('rect',{x:-130,y:140,width:250,height:80,rx:22,fill:'#ffd23f',class:'o'},g);
  for(let i=0;i<3;i++)E('rect',{x:-100+i*75,y:158,width:50,height:40,rx:10,fill:'#9fe7ff',class:'o2'},g);
  E('circle',{cx:-75,cy:176,r:14,fill:'#ffb07a',class:'o2'},g);E('path',{d:'M -89 172 Q -75 156 -61 172 Z',fill:'#8a5a3c'},g);
  S.prop=E('ellipse',{cx:140,cy:180,rx:8,ry:44,fill:'#dfe6f2',class:'o2'},g);
  E('ellipse',{cx:0,cy:0,rx:340,ry:126,fill:'#ff9ab8',class:'o'},g);
  E('path',{d:'M -300 -40 Q 0 -150 300 -40',fill:'none',stroke:'#ffd0de','stroke-width':26,'stroke-linecap':'round'},g);
  E('path',{d:'M -334 20 Q 0 70 334 20',class:'ln'},g);
  E('circle',{cx:-345,cy:0,r:22,fill:'#ff6b8f',class:'o2'},g);
  E('rect',{x:-190,y:-56,width:330,height:104,rx:18,fill:'#1d1640',class:'o'},g);
  S.t1=E('text',{x:-25,y:14,'text-anchor':'middle','font-family':'Impact','font-size':48,fill:'#7cf2c8','letter-spacing':2},g);S.t1.textContent='SZUKAM...';
  const lamp=E('g',{},g);E('rect',{x:-26,y:-6,width:52,height:40,rx:10,fill:'#6b6f8a',class:'o2'},lamp);E('ellipse',{cx:0,cy:34,rx:30,ry:10,fill:'#fff6b0',class:'o2'},lamp);S.lamp=lamp;
  return S;}
/* kłąb dymu */
function puff(p,col){const g=E('g',{},p);blob(g,[['circle',{cx:0,cy:0,r:60}],['circle',{cx:-50,cy:18,r:42}],['circle',{cx:52,cy:16,r:44}],['circle',{cx:10,cy:-40,r:40}]],col||'#f4f0fb');return g;}
/* ---------- wspólne dla shortów ---------- */
function phoneUI(p,w,h,frame,title){const g=E('g',{},p);
  E('rect',{x:-w/2-16,y:-h/2-16,width:w+32,height:h+32,rx:42,fill:frame||'#ffc93c',class:'o'},g);
  const scr=E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:28,fill:'#241c4d'},g);
  E('rect',{x:-w/2,y:-h/2,width:w,height:70,rx:28,fill:'#6a3fd6'},g);E('rect',{x:-w/2,y:-h/2+40,width:w,height:30,fill:'#6a3fd6'},g);
  E('circle',{cx:-w/2+44,cy:-h/2+35,r:20,fill:'#7cf2c8',class:'o2'},g);
  E('text',{x:-w/2+76,y:-h/2+46,'font-family':'Impact','font-size':32,fill:'#fff','letter-spacing':1},g).textContent=title||'CZAT';
  return {g,scr};}
function chatBub(p,x,y,w,h,col,right,fs){const g=E('g',{transform:`translate(${x} ${y})`},p);const inner=E('g',{},g);
  E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:24,fill:col,class:'o2'},inner);
  E('path',{d:right?`M ${w/2-34} ${h/2-6} L ${w/2+8} ${h/2+20} L ${w/2-8} ${h/2-14} Z`:`M ${-w/2+34} ${h/2-6} L ${-w/2-8} ${h/2+20} L ${-w/2+8} ${h/2-14} Z`,fill:col,class:'o2'},inner);
  E('rect',{x:-w/2+3,y:h/2-30,width:w-6,height:26,fill:col},inner);
  const t=E('text',{x:0,y:(fs||30)*0.36,'text-anchor':'middle','font-family':'Bahnschrift, Arial','font-weight':700,'font-size':fs||30,fill:OUT},inner);return {g,inner,t};}
function typeTo(el,full,t,t0,t1){const n=Math.round(full.length*clamp((t-t0)/(t1-t0)));const cur=(t>=t0-0.2&&t<t1+0.25&&Math.floor(t*7)%2===0)?'|':'';el.textContent=(t<t0-0.2?'':full.slice(0,n))+cur;}
function plane(p){const g=E('g',{},p);E('path',{d:'M -70 -26 L 80 0 L -70 30 L -42 0 Z',fill:'#ffffff',class:'o'},g);E('path',{d:'M -42 0 L 80 0 L -56 46 Z',fill:'#e6e0f2',class:'o'},g);return g;}
function ringSet(p,n,col,w){const a=[];for(let i=0;i<n;i++)a.push(E('circle',{r:10,fill:'none',stroke:col||'#ffffff','stroke-width':w||14,opacity:0},p));return a;}
function ringsAt(R,t,t0,x,y,maxR,dur,gap){R.forEach((r,i)=>{const u=seg(t,t0+i*(gap||0.12),t0+i*(gap||0.12)+(dur||0.6));r.setAttribute('cx',x);r.setAttribute('cy',y);r.setAttribute('r',10+maxR*ease.outQ(u));r.setAttribute('opacity',(u>0&&u<1)?(1-u).toFixed(3):0);});}
function mTower(p,x,y,s){const g=E('g',{},p);island(g,x,y,640*s,380*s,'#7fdc7a','#9d92c9');
  const L=`M ${x-95*s} ${y-12*s} L ${x-22*s} ${y-520*s} L ${x+22*s} ${y-520*s} L ${x+95*s} ${y-12*s}`;
  E('path',{d:L,fill:'none',stroke:OUT,'stroke-width':26*s,'stroke-linejoin':'round'},g);E('path',{d:L,fill:'none',stroke:'#e6e0f2','stroke-width':12*s,'stroke-linejoin':'round'},g);
  for(let i=1;i<5;i++){const yy=y-12*s-i*102*s,w=95*s-i*15*s;E('path',{d:`M ${x-w} ${yy} L ${x+w-15*s} ${yy-102*s} M ${x+w} ${yy} L ${x-w+15*s} ${yy-102*s}`,class:'ln'},g);}
  const lg=E('g',{transform:`translate(${x} ${y-600*s})`},g);const lgi=E('g',{},lg);mLogo(lgi,1.5*s);g.logo=lgi;g.lx=x;g.ly=y-600*s;return g;}
function sky3(a,b,c){return ()=>[a,b,c];}
