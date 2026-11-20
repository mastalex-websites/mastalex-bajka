'use strict';
/* Mastalex – postacie krain na podstronach. Każdy motyw (z filmików Mastalexa) to jedna postać lub grupa,
   która stoi na górnej krawędzi panelu swojej krainy. Silnik (pod.js) podaje stan:
   st = {T, a: akcja 0..1 (-1 brak), p: reakcja na stronę 0..1, th: rzut zwoju 0..1, hold: trzyma zwój, lk: patrzy -1..1}
   Jednostki lokalne: ziemia y=0, postać patrzy w prawo (+x), ok. 380 j. wysokości. */
(function(){
const OUTL=3.2;
const gg=(p,a)=>E('g',a||{},p),f1=v=>(+v).toFixed(1);
const tl=(el,x,y,r)=>el.setAttribute('transform',`translate(${f1(x)} ${f1(y)})${r?` rotate(${f1(r)})`:''}`);
const opa=(el,v)=>el.setAttribute('opacity',clamp(v).toFixed(3));
const setsw=(el,px)=>{el.style.setProperty('--sw',px.toFixed(3)+'px');return el;};
const on=u=>u>=0&&u<1;
const bump=u=>on(u)?Math.sin(Math.PI*u):0;
const hideK=(o,k)=>{const v=o&&o[k];if(v&&v.setAttribute)v.setAttribute('opacity',0);else if(v&&v.g&&v.g.setAttribute)v.g.setAttribute('opacity',0);};

/* wspólne pozy rąk dla postaci z biblioteki person() */
function pose(st){let aL=[-70,-115],aR=[72,-118],mo=false,hr=st.lk*7;
  if(st.hold)aR=[84,-246];
  if(on(st.p)){const w=Math.sin(st.p*Math.PI*4);aL=[-98,-300+w*26];mo=true;}
  if(on(st.a)){const u=bump(st.a);aL=[-70-34*u,-115-220*u];if(!st.hold)aR=[72+26*u,-118-216*u];mo=true;}
  if(on(st.th)){const u=st.th;aR=u<.45?[lerp(84,-34,ease.ioS(u/.45)),lerp(-246,-334,u/.45)]:[lerp(-34,124,ease.outC((u-.45)/.55)),lerp(-334,-262,(u-.45)/.55)];mo=true;}
  return {aL,aR,mo,hr};}
const handOf=ps=>[ps.aR[0]+8,ps.aR[1]-14];
/* fala wody na krawędzi panelu */
function water(p,x0,x1){const g=gg(p),n=Math.max(4,Math.round((x1-x0)/52)),st=(x1-x0)/n;let d=`M ${f1(x0)} 6 L ${f1(x0)} -16`;
  for(let i=0;i<n;i++)d+=` q ${f1(st/4)} -12 ${f1(st/2)} 0 q ${f1(st/4)} 12 ${f1(st/2)} 0`;
  E('path',{d:d+` L ${f1(x1)} 6 Z`,fill:'#6cc8ff',class:'o'},g);
  for(let x=x0+30;x<x1-30;x+=90)E('path',{d:`M ${f1(x)} -4 q 12 -7 24 0`,fill:'none',stroke:'#fff','stroke-width':5,'stroke-linecap':'round'},g);return g;}
function clipAbove(c,p,y){const id=c.uid+'w';const cp=E('clipPath',{id,clipPathUnits:'userSpaceOnUse'},c.defs);E('rect',{x:-2000,y:-3000,width:4000,height:3000+y},cp);return gg(p,{'clip-path':`url(#${id})`});}
function rings(p,col){const o=gg(p);const r=[0,1,2].map(i=>E('path',{d:'',fill:'none',stroke:col||'#ffd23f','stroke-width':9,'stroke-linecap':'round'},o));
  return (x,y,u,ang)=>{r.forEach((el,i)=>{const k=clamp(u*1.6-i*.25),R=30+k*110;const a0=(ang||0)-40,a1=(ang||0)+40,c=Math.PI/180;
    el.setAttribute('d',`M ${f1(x+R*Math.cos(a0*c))} ${f1(y+R*Math.sin(a0*c))} A ${f1(R)} ${f1(R)} 0 0 1 ${f1(x+R*Math.cos(a1*c))} ${f1(y+R*Math.sin(a1*c))}`);opa(el,k>0&&k<1?(1-k)*1.2:0);});};}

const M={};
/* 1. KOSMOS – astronauta i rakieta: rakieta podskakuje na płomieniu */
M.kosmos={bs:.3,ext:[300,120],aDur:1.6,build(g,c){
  const rk=gg(g);const fl=gg(rk);E('path',{d:'M -30 -36 Q 0 70 30 -36 Z',fill:'#ffd23f',class:'o2'},fl);E('path',{d:'M -15 -36 Q 0 28 15 -36 Z',fill:'#ff7a3d'},fl);
  E('path',{d:'M -50 -96 L -96 -14 L -46 -34 Z M 50 -96 L 96 -14 L 46 -34 Z',fill:'#ff4b5c',class:'o'},rk);
  E('path',{d:'M 0 -340 Q 78 -256 58 -40 L -58 -40 Q -78 -256 0 -340 Z',fill:'#f4f1ff',class:'o'},rk);
  E('path',{d:'M 0 -340 Q 32 -314 46 -276 L -46 -276 Q -32 -314 0 -340 Z',fill:'#ff4b5c',class:'o2'},rk);
  E('circle',{cx:0,cy:-196,r:32,fill:'#9fe7ff',class:'o'},rk);E('path',{d:'M -14 -210 q 9 -11 22 -6',fill:'none',stroke:'#fff','stroke-width':7,'stroke-linecap':'round'},rk);
  E('path',{d:'M -24 -40 L 24 -40 L 16 -20 L -16 -20 Z',fill:'#8c8aa3',class:'o2'},rk);
  const P=person(gg(g),{helmet:true,shirt:'#eef0fb',pants:'#c8cde0'});
  return {draw(st){const u=bump(st.a),hop=ease.outQ(u)*320;place(rk,-196,-hop,1,on(st.a)?Math.sin(st.a*26)*2.5:0);
      const fs=on(st.a)?.4+u*1.3:on(st.p)?.35:.001;fl.setAttribute('transform',`translate(0 -36) scale(1 ${fs.toFixed(3)}) translate(0 36)`);
      const ps=pose(st);P.set(Object.assign({x:0,y:0,s:1},ps));},
    hand(st){return handOf(pose(st));}};}};

/* 2. KSIĘŻYC – Pan Twardowski i kogut: kogut pieje, Twardowski unosi ręce */
M.ksiezyc={bs:.3,ext:[150,250],aDur:1.5,build(g,c){const k=.62;
  const w=gg(g);const TW=twardowski(w);setsw(w,OUTL/(c.s*k));
  TW.legL([-30,-10],[-50,170],-20);TW.legR([30,-10],[50,170],20);TW.bootL.setAttribute('transform','translate(-50 180)');TW.bootR.setAttribute('transform','translate(50 180) scale(-1 1)');
  place(w,0,-206*k,k);
  const r=gg(g);const tail=gg(r);[['#2f6b4f',-150],['#c0392b',-120],['#1f4f8a',-95]].forEach(([col,a],i)=>E('path',{d:`M -40 -86 Q ${-120+i*10} ${a-60} ${-96+i*18} ${a+10} Q ${-70+i*10} -90 -30 -70 Z`,fill:col,class:'o'},tail));
  E('path',{d:'M -16 -10 L -16 -46 M 16 -10 L 16 -46',class:'ln',style:'stroke-width:9px'},r);E('path',{d:'M -30 -8 L -2 -8 M 2 -8 L 30 -8',class:'ln',style:'stroke-width:8px;stroke:#e8a72c'},r);
  E('ellipse',{cx:0,cy:-86,rx:60,ry:48,fill:'#fff3e0',class:'o'},r);E('path',{d:'M -30 -94 Q 0 -70 26 -96',class:'ln'},r);
  const hd=gg(r);E('path',{d:'M 22 -112 L 30 -150 L 56 -150 L 50 -104 Z',fill:'#fff3e0',class:'o2'},hd);
  E('path',{d:'M 22 -176 q 6 -26 18 -10 q 8 -24 18 -4 q 12 -18 16 6 Z',fill:'#e8343f',class:'o2'},hd);
  E('circle',{cx:44,cy:-158,r:26,fill:'#fff3e0',class:'o'},hd);E('circle',{cx:52,cy:-164,r:5,fill:OUT},hd);
  const bU=E('path',{d:'M 66 -162 L 92 -154 L 68 -148 Z',fill:'#ffc93c',class:'o2'},hd),bD=E('path',{d:'M 68 -150 L 90 -146 L 66 -140 Z',fill:'#ffc93c',class:'o2'},hd);
  E('path',{d:'M 60 -142 q 6 18 -6 22 q -8 -10 0 -22 Z',fill:'#e8343f',class:'o2'},hd);
  place(r,170,0,1);const rg=rings(g,'#fff6b0');
  const arms=st=>{let hR=[120,-60],hL=[-110,-60];if(st.hold)hR=[160,-330];
    if(on(st.p)){hL=[-150,-330+Math.sin(st.p*Math.PI*4)*30];}
    if(on(st.a)){const u=bump(st.a);hL=[-110-40*u,-60-370*u];if(!st.hold)hR=[120+40*u,-60-370*u];}
    if(on(st.th)){const u=st.th;hR=u<.45?[lerp(160,-40,u/.45),lerp(-330,-420,u/.45)]:[lerp(-40,190,ease.outC((u-.45)/.55)),lerp(-420,-320,(u-.45)/.55)];}
    return {hR,hL};};
  return {draw(st){const {hR,hL}=arms(st);TW.armR([80,-200],hR,30);TW.hR.setAttribute('transform',`translate(${hR[0]} ${hR[1]})`);TW.armL([-80,-200],hL,-30);TW.hL.setAttribute('transform',`translate(${hL[0]} ${hL[1]})`);
      const u=bump(st.a),cr=on(st.a)?clamp(st.a*1.6):0;hd.setAttribute('transform',`rotate(${f1(-22*u)} 30 -110)`);bD.setAttribute('transform',`rotate(${f1(24*u)} 68 -148)`);
      rg(170+96,-176-30*u,on(st.a)?cr:-1,-30);},
    hand(st){const {hR}=arms(st);return [hR[0]*k+6,-206*k+hR[1]*k-10];}};}};

/* 3. PODNIEBNE KRÓLESTWO – balon na uwięzi: unosi się i wraca, zwój wisi pod koszem */
M.podniebne={bs:.3,ext:[150,150],aDur:1.8,build(g,c){const k=.78;
  const rope=E('path',{class:'ln',style:'stroke-width:6px'},g);E('path',{d:'M -14 0 L -10 -40 L 10 -40 L 14 0 Z',fill:'#b5804f',class:'o2'},g);
  const bw=gg(g);const bi=gg(bw);const B=balloon(bi,'#ff6b8f','#ffd23f');setsw(bi,OUTL/(c.s*k));
  const head=gg(B);E('circle',{cx:0,cy:176,r:28,fill:'#ffd0a8',class:'o2'},head);E('path',{d:'M -28 172 Q -28 140 0 140 Q 28 140 28 172 Q 14 158 0 160 Q -14 158 -28 172 Z',fill:'#3b2f22',class:'o2'},head);
  E('circle',{cx:-9,cy:178,r:4,fill:OUT},head);E('circle',{cx:9,cy:178,r:4,fill:OUT},head);B.insertBefore(head,B.children[4]);
  const by0=-170-256*k;
  const geo=st=>{const up=ease.ioS(bump(st.a))*-240,dip=on(st.th)?Math.sin(st.th*Math.PI)*40:0,sw=on(st.p)?Math.sin(st.p*Math.PI*3)*6:0;return {y:by0+up+dip,r:sw+(on(st.a)?Math.sin(st.a*Math.PI*2)*5:0)};};
  return {draw(st){const o=geo(st);place(bw,0,o.y,k,o.r);const bx=0,bb=o.y+256*k;rope.setAttribute('d',`M ${f1(bx)} ${f1(bb)} Q ${f1(26)} ${f1((bb-40)/2)} 0 -40`);},
    hand(st){const o=geo(st);return [0,o.y+256*k+40];}};}};

/* 4. ALPINISTA – wspinacz z plecakiem; akcja: flaga wjeżdża na szczyt masztu */
M.alpinista={bs:.3,ext:[140,200],aDur:1.6,build(g,c){
  const pole=gg(g);E('path',{d:'M 160 0 L 160 -470',stroke:OUT,'stroke-width':16,'stroke-linecap':'round'},pole);E('path',{d:'M 160 0 L 160 -470',stroke:'#c8cde0','stroke-width':8,'stroke-linecap':'round'},pole);
  E('path',{d:'M 140 6 L 180 6 L 172 -26 L 148 -26 Z',fill:'#8c8aa3',class:'o2'},pole);const flag=gg(pole);const cloth=E('path',{fill:'#ff4b5c',class:'o'},flag);
  const bp=gg(g);E('rect',{x:-104,y:-236,width:58,height:130,rx:16,fill:'#ff9a3d',class:'o'},bp);E('circle',{cx:-76,cy:-250,r:30,fill:'none',stroke:OUT,'stroke-width':16},bp);E('circle',{cx:-76,cy:-250,r:30,fill:'none',stroke:'#ffd23f','stroke-width':8},bp);
  const P=person(gg(g),{shirt:'#ff4b5c',cap:'#2f6fd6',hair:'#5b4632',pants:'#3b4a8a'});
  return {draw(st){const ps=pose(st);P.set(Object.assign({x:0,y:0,s:1},ps));
      const u=on(st.a)?st.a:1,fy=on(st.a)?lerp(-80,-466,ease.outBack(clamp((u-.2)/.8))):-466,wv=on(st.a)||on(st.p)?Math.sin((st.T||0)*14)*12:4;
      cloth.setAttribute('d',`M 166 ${f1(fy)} Q ${f1(220)} ${f1(fy-14+wv)} ${f1(270)} ${f1(fy+4)} Q ${f1(244)} ${f1(fy+40)} ${f1(270)} ${f1(fy+76)} Q ${f1(220)} ${f1(fy+64-wv)} 166 ${f1(fy+70)} Z`);},
    hand(st){return handOf(pose(st));}};}};

/* 5. ROSZPUNKA – wieża i złoty warkocz: warkocz zjeżdża aż do panelu, na końcu wisi zwój */
M.roszpunka={bs:.24,ext:[120,170],aDur:2,build(g,c){
  const tw=gg(g);E('path',{d:'M -84 0 L -76 -560 L 76 -560 L 84 0 Z',fill:'#b9b3cc',class:'o'},tw);
  for(let y=-60;y>-540;y-=60)for(let x=-60+((y/60)%2?30:0);x<60;x+=60)E('path',{d:`M ${x} ${y} h 34`,stroke:'#8c87a3','stroke-width':6,'stroke-linecap':'round'},tw);
  E('path',{d:'M -110 -556 L 0 -800 L 110 -556 Z',fill:'#d63345',class:'o'},tw);E('path',{d:'M 0 -800 L 0 -850',class:'ln'},tw);E('path',{d:'M 0 -850 L 34 -838 L 0 -826 Z',fill:'#ffd23f',class:'o2'},tw);
  E('path',{d:'M -40 -390 L -40 -450 Q 0 -500 40 -450 L 40 -390 Z',fill:'#2b2140',class:'o'},tw);
  E('path',{d:'M -30 -420 Q -34 -470 0 -472 Q 34 -470 30 -420 Z',fill:'#ffcf4a',class:'o2'},tw);E('circle',{cx:0,cy:-436,r:21,fill:'#ffd9bd',class:'o2'},tw);
  E('circle',{cx:-7,cy:-438,r:3.5,fill:OUT},tw);E('circle',{cx:7,cy:-438,r:3.5,fill:OUT},tw);E('path',{d:'M -48 -388 L 48 -388',class:'ln',style:'stroke-width:12px'},tw);
  [[-64,-120],[-70,-260],[66,-190],[60,-320]].forEach(([x,y])=>{E('path',{d:`M ${x} ${y} q -16 -10 -6 -24`,fill:'#3f8f3a',class:'o2'},tw);E('circle',{cx:x,cy:y,r:13,fill:'#ff4b6e',class:'o2'},tw);});
  const br=gg(g);const bo=E('path',{fill:'none',stroke:OUT,'stroke-width':40,'stroke-linecap':'round'},br),bi=E('path',{fill:'none',stroke:'#ffcf4a','stroke-width':26,'stroke-linecap':'round'},br),bx=E('path',{fill:'none',stroke:'#e8a72c','stroke-width':6,'stroke-dasharray':'10 16'},br);
  const bow=E('circle',{r:16,fill:'#ff6b8f',class:'o2'},br);
  const geo=st=>{const L=on(st.a)?lerp(170,560,bump(st.a)):(st.hold?250:170),sw=(on(st.th)?Math.sin(st.th*Math.PI)*120:0)+(on(st.p)?Math.sin(st.p*Math.PI*3)*24:0);return {ex:120+sw,ey:-392+L};};
  return {draw(st){const o=geo(st),d=`M 40 -392 Q 130 -380 ${f1(o.ex)} ${f1(o.ey)}`;[bo,bi,bx].forEach(e=>e.setAttribute('d',d));tl(bow,o.ex,o.ey-6);},
    hand(st){const o=geo(st);return [o.ex,o.ey+30];}};}};

/* 6. WAMPIRZY BAL – wampir w pelerynie i nietoperze: peleryna się rozkłada, nietoperze krążą */
M.wampir={bs:.3,ext:[170,170],aDur:1.7,build(g,c){
  const cape=gg(g);E('path',{d:'M -60 -226 Q -130 -120 -140 -10 Q -70 -30 0 -20 Q 70 -30 140 -10 Q 130 -120 60 -226 Z',fill:'#8e1b3a',class:'o'},cape);
  E('path',{d:'M -40 -220 Q -90 -130 -96 -30 Q -50 -40 0 -36 Q 50 -40 96 -30 Q 90 -130 40 -220 Z',fill:'#c0392b'},cape);
  const P=person(gg(g),{shirt:'#2b2140',skin:'#efe9f7',hair:'#1c1336',pants:'#1c1336'});
  const col=gg(g);E('path',{d:'M -60 -232 L -90 -300 L -30 -240 Z M 60 -232 L 90 -300 L 30 -240 Z',fill:'#8e1b3a',class:'o2'},col);
  E('path',{d:'M -9 -258 l 4 12 l 4 -12 Z M 1 -258 l 4 12 l 4 -12 Z',fill:'#fff',class:'o2'},P.face);
  const bats=[0,1,2].map(i=>{const o=gg(g);const B=bird(o,'#3b2457');E('circle',{cx:0,cy:-6,r:14,fill:'#3b2457'},o);E('path',{d:'M -8 -16 l -4 -14 l 10 8 Z M 8 -16 l 4 -14 l -10 8 Z',fill:'#3b2457'},o);return {o,B,ph:i*2.1};});
  const home=[[-150,-380],[160,-430],[40,-500]];
  return {draw(st){const ps=pose(st);P.set(Object.assign({x:0,y:0,s:1},ps));const u=bump(st.a);place(cape,0,0,1+u*.5,0,1);
      bats.forEach((b,i)=>{let x=home[i][0],y=home[i][1];if(on(st.a)){const a=st.a*Math.PI*2+i*2.1;x=Math.cos(a)*(170+i*30);y=-300+Math.sin(a)*120-i*40;}
        else if(on(st.p)){y+=Math.sin(st.p*Math.PI*2+i)*20;}
        birdFlap(b.B,on(st.a)||on(st.p)?(st.T||0)*22+b.ph:1.2);place(b.o,x,y,.55);});},
    hand(st){return handOf(pose(st));}};}};

/* 7. SMOK WAWELSKI – smok zieje ogniem, skrzydła trzepoczą */
M.smok={bs:.3,ext:[170,190],aDur:1.5,build(g,c){const k=.5;
  const w=gg(g);const D=dragon(w);setsw(w,OUTL/(c.s*k));
  const fire=gg(g);[['#ffd23f',0],['#ff9a3d',30],['#ff4b3d',60]].forEach(([col,dx],i)=>E('path',{d:`M ${dx} 0 Q ${dx+60} -40 ${dx+130} -6 Q ${dx+60} 34 ${dx} 0 Z`,fill:col,class:i?'o2':'o'},fire));
  const arms=st=>{let aL=[-180,-60],aR=[180,-60];if(st.hold)aR=[210,-280];if(on(st.p))aL=[-230,-300+Math.sin(st.p*Math.PI*4)*40];
    if(on(st.th)){const u=st.th;aR=u<.45?[lerp(210,40,u/.45),lerp(-280,-420,u/.45)]:[lerp(40,260,ease.outC((u-.45)/.55)),lerp(-420,-300,(u-.45)/.55)];}return {aL,aR};};
  return {draw(st){const {aL,aR}=arms(st),u=bump(st.a);
      D.set({x:0,y:-180*k,s:k,legs:true,fL:[-70,150],fR:[70,150],look:st.lk,eyes:1,happy:on(st.a)||on(st.p),mouth:u>.15?1:0,aL,aR,wf:on(st.a)||on(st.p)?Math.sin((st.T||0)*16)*22:0,tw:on(st.a)?Math.sin(st.a*Math.PI*4)*8:0});
      const fs=u>.15?clamp((u-.15)*1.6):0;place(fire,60*k,-520*k+40,Math.max(.001,fs*1.1),-8);opa(fire,fs>0?1:0);},
    hand(st){const {aR}=arms(st);return [aR[0]*k,-180*k+aR[1]*k];}};}};

/* 8. PAN TADEUSZ – Wojski z rogiem: róg przy ustach i fala dźwięku */
M.tadeusz={bs:.3,ext:[150,220],aDur:1.8,build(g,c){
  const P=person(gg(g),{shirt:'#2f7a4a',cap:'#8b2f2f',hair:'#e8e0cc',pants:'#5b3a22'});
  E('path',{d:'M -30 -270 Q -16 -256 0 -268 Q 16 -256 30 -270 Q 20 -246 0 -256 Q -20 -246 -30 -270 Z',fill:'#e8e0cc',class:'o2'},P.face);
  const sash=gg(g);E('rect',{x:-64,y:-128,width:128,height:20,rx:6,fill:'#e8b64a',class:'o2'},sash);
  const horn=gg(g);E('path',{d:'M 0 6 C 50 0 92 -34 112 -92 L 136 -82 C 112 -12 60 26 0 18 Z',fill:'#f0b043',class:'o'},horn);E('ellipse',{cx:124,cy:-88,rx:22,ry:30,fill:'#ffe29a',class:'o2',transform:'rotate(20 124 -88)'},horn);
  E('path',{d:'M 30 4 l 0 14 M 70 -12 l 6 12',class:'ln'},horn);const rg=rings(g,'#fff6b0');
  return {draw(st){const ps=pose(st),u=bump(st.a);if(on(st.a)){ps.aL=[18,-262];ps.mo=false;}P.set(Object.assign({x:0,y:0,s:1},ps));
      if(on(st.a)){const r=-28-10*u;horn.setAttribute('transform',`translate(14 -262) rotate(${f1(r)})`);rg(14+130*Math.cos(r*Math.PI/180)-80*Math.sin(r*Math.PI/180)*.5,-262-110,clamp(st.a*1.4),-40);}
      else{horn.setAttribute('transform','translate(-86 -126) rotate(70) scale(.8)');rg(0,0,-1);}},
    hand(st){return handOf(pose(st));}};}};

/* 9. TRZY ŚWINKI – trzy prosiaczki i murowany domek: podskakują po kolei, z komina leci dym */
function pig(p,col){const g=gg(p);[[-40,0],[-14,0],[20,0],[44,0]].forEach(([x])=>E('rect',{x:x-9,y:-34,width:18,height:34,rx:7,fill:'#f78fae',class:'o2'},g));
  E('path',{d:'M -64 -86 q -26 -6 -18 -24 q 10 -8 12 6',fill:'none',stroke:OUT,'stroke-width':6,'stroke-linecap':'round'},g);
  E('ellipse',{cx:0,cy:-74,rx:66,ry:50,fill:'#ffb3c7',class:'o'},g);E('circle',{cx:56,cy:-116,r:42,fill:'#ffb3c7',class:'o'},g);
  E('path',{d:'M 30 -150 L 26 -182 L 52 -156 Z M 66 -156 L 82 -184 L 86 -148 Z',fill:'#f78fae',class:'o2'},g);
  E('ellipse',{cx:92,cy:-108,rx:17,ry:14,fill:'#f78fae',class:'o2'},g);E('circle',{cx:87,cy:-108,r:3.5,fill:OUT},g);E('circle',{cx:97,cy:-108,r:3.5,fill:OUT},g);
  E('circle',{cx:62,cy:-128,r:5.5,fill:OUT},g);E('path',{d:'M 58 -96 q 10 8 20 0',class:'ln'},g);if(col)E('path',{d:'M 18 -150 Q 54 -186 92 -150 L 110 -150 L 0 -146 Z',fill:col,class:'o2'},g);return g;}
M.swinki={bs:.33,ext:[420,200],aDur:1.8,build(g,c){
  const hs=gg(g);E('rect',{x:-72,y:-150,width:144,height:150,fill:'#c0503a',class:'o'},hs);for(let y=-130;y<0;y+=26)for(let x=-72+((y/26)%2?18:0);x<72;x+=36)E('rect',{x,y,width:36,height:26,fill:'none',stroke:'#8a3324','stroke-width':3},hs);
  E('path',{d:'M -96 -146 L 0 -236 L 96 -146 Z',fill:'#7b2f22',class:'o'},hs);E('rect',{x:34,y:-236,width:28,height:56,fill:'#c0503a',class:'o2'},hs);E('rect',{x:-22,y:-74,width:44,height:74,rx:8,fill:'#6b4a2b',class:'o2'},hs);
  E('rect',{x:-58,y:-118,width:30,height:30,fill:'#fff3a0',class:'o2'},hs);place(hs,-320,0,1);
  const smoke=[0,1,2].map(()=>{const o=gg(g);cloud(o,0,0,1,'#ffffff',3);return o;});
  const pigs=[[-160,.74,'#ffd23f'],[-30,.86,'#b5804f'],[110,1,'#c0503a']].map(([x,s,col])=>({g:pig(gg(g),col),x,s}));
  const jy=(st,i)=>{let j=0;if(on(st.a))j=bump(clamp((st.a-i*.16)/.5))*110;if(on(st.p)&&i===2)j=bump(st.p)*40;if(on(st.th)&&i===2)j=bump(st.th)*70;return j;};
  return {draw(st){pigs.forEach((p,i)=>place(p.g,p.x,-jy(st,i),p.s));
      smoke.forEach((o,i)=>{const u=on(st.a)?clamp(st.a*1.4-i*.2):-1;if(u<0||u>=1){opa(o,0);return;}opa(o,(1-u)*.95);place(o,-320+48+u*40,-260-u*170,.12+u*.18);});},
    hand(st){return [104,-170-jy(st,2)];}};}};

/* 10. LALKA (Prus) – panna Izabela z balu i pociąg Wokulskiego: parowóz z wagonem jedzie po torze, Izabela wachluje się */
M.lalki={bs:.3,ext:[480,120],aDur:1.9,build(g,c){
  const tr=gg(g);E('path',{d:'M -500 -4 L -130 -4',stroke:OUT,'stroke-width':10,'stroke-linecap':'round'},tr);for(let x=-490;x<-130;x+=36)E('rect',{x,y:-8,width:20,height:10,fill:'#b5804f',class:'o2'},tr);
  const train=gg(g);const wh=[];
  const loco=gg(train);
  E('rect',{x:-70,y:-190,width:62,height:150,rx:8,fill:'#c0303f',class:'o'},loco);E('rect',{x:-78,y:-204,width:78,height:20,rx:6,fill:'#2b2140',class:'o2'},loco);
  E('rect',{x:-58,y:-174,width:36,height:34,rx:5,fill:'#fff6dc',class:'o2'},loco);
  E('rect',{x:-14,y:-124,width:78,height:82,rx:34,fill:'#2b2140',class:'o'},loco);
  E('path',{d:'M 12 -124 L 12 -40 M 40 -124 L 40 -40',stroke:'#ffd23f','stroke-width':6},loco);
  E('path',{d:'M 32 -124 L 28 -168 L 16 -184 L 64 -184 L 52 -168 L 48 -124 Z',fill:'#2b2140',class:'o2'},loco);
  E('circle',{cx:4,cy:-126,r:13,fill:'#ffd23f',class:'o2'},loco);
  E('path',{d:'M 62 -50 L 92 -30 L 62 -30 Z',fill:'#c0303f',class:'o2'},loco);
  const wag=gg(train);E('rect',{x:-286,y:-138,width:152,height:20,rx:8,fill:'#2b2140',class:'o2'},wag);
  E('rect',{x:-280,y:-122,width:140,height:86,rx:10,fill:'#c0303f',class:'o'},wag);
  [-264,-224,-184].forEach(x=>E('rect',{x,y:-108,width:28,height:30,rx:6,fill:'#fff6dc',class:'o2'},wag));
  E('path',{d:'M -140 -56 L -70 -56',class:'ln',style:'stroke-width:8px'},wag);
  [[-40,-30],[22,-30],[-250,-30],[-170,-30]].forEach(([x,y])=>{const o=gg(train);E('circle',{r:24,fill:'#e8343f',class:'o'},o);E('path',{d:'M -14 0 L 14 0 M 0 -14 L 0 14',class:'ln',style:'stroke:#fff'},o);tl(o,x,y);wh.push({o,x,y});});
  const puffs=[0,1].map(()=>{const o=gg(g);cloud(o,0,0,1,'#ffffff',2);return o;});
  /* panna Izabela: liliowa krynolina, jasny kok, fioletowy kapelusik z różowym piórem, wachlarz */
  const P=person(gg(g),{shirt:'#b48cf0',hair:'#ffd23f',pants:'#b48cf0',skin:'#ffe0c4'});
  E('path',{d:'M -62 -112 Q -92 -44 -114 -6 L 114 -6 Q 92 -44 62 -112 Z',fill:'#b48cf0',class:'o'},P.g);
  E('path',{d:'M -104 -28 Q -52 -12 0 -28 Q 52 -12 104 -28',fill:'none',stroke:'#ff8fc8','stroke-width':12,'stroke-linecap':'round'},P.g);
  E('path',{d:'M -40 -228 Q 0 -206 40 -228',fill:'none',stroke:'#fff6dc','stroke-width':10,'stroke-linecap':'round'},P.g);
  E('circle',{cx:-30,cy:-350,r:24,fill:'#ffd23f',class:'o2'},P.hd);
  E('ellipse',{cx:12,cy:-346,rx:50,ry:12,fill:'#6a3fd6',class:'o2'},P.hd);
  E('path',{d:'M -16 -348 Q -12 -388 18 -390 Q 44 -386 40 -348 Z',fill:'#6a3fd6',class:'o2'},P.hd);
  E('path',{d:'M 30 -376 Q 74 -428 112 -396 Q 76 -398 44 -360 Z',fill:'#ff4b8f',class:'o2'},P.hd);
  const fan=gg(P.g);E('path',{d:'M 0 0 L -42 -52 A 66 66 0 0 1 42 -52 Z',fill:'#ff8fc8',class:'o2'},fan);
  E('path',{d:'M 0 0 L -21 -62 M 0 0 L 0 -66 M 0 0 L 21 -62',stroke:OUT,'stroke-width':3.5,'stroke-linecap':'round'},fan);
  const dx=st=>(on(st.a)?Math.sin(st.a*Math.PI*2)*-90:0)+(on(st.th)?bump(st.th)*40:0);
  return {draw(st){const x=dx(st);place(train,-250+x,0,1);wh.forEach(w=>tl(w.o,w.x,w.y,x*2.4));
      puffs.forEach((o,i)=>{const u=on(st.a)?clamp(st.a*1.3-i*.3):-1;if(u<0||u>=1){opa(o,0);return;}opa(o,(1-u));place(o,-250+x+50+u*-30,-200-u*120,.1+u*.14);});
      const ps=pose(st);P.set(Object.assign({x:0,y:0,s:1},ps));
      const fa=on(st.a)?-20+Math.sin(st.a*Math.PI*8)*28:on(st.p)?-30+Math.sin(st.p*Math.PI*6)*20:-12;
      tl(fan,ps.aL[0]-4,ps.aL[1]-6,fa);},
    hand(st){return [-250+dx(st)-210,-140];}};}};

/* 11. MECZ – piłkarz żongluje piłką */
M.mecz={bs:.3,ext:[360,170],aDur:1.7,build(g,c){
  const goal=gg(g);E('path',{d:'M -340 0 L -340 -230 L -190 -230 L -190 0',fill:'none',stroke:OUT,'stroke-width':18,'stroke-linejoin':'round'},goal);E('path',{d:'M -340 0 L -340 -230 L -190 -230 L -190 0',fill:'none',stroke:'#fff','stroke-width':9,'stroke-linejoin':'round'},goal);
  for(let x=-320;x<-200;x+=26)E('path',{d:`M ${x} -220 L ${x} -6`,stroke:'#d9d2f2','stroke-width':3},goal);for(let y=-200;y<0;y+=26)E('path',{d:`M -334 ${y} L -196 ${y}`,stroke:'#d9d2f2','stroke-width':3},goal);
  const P=person(gg(g),{shirt:'#e8343f',hair:'#3b2f22',pants:'#ffffff'});E('path',{d:'M -20 -228 L -20 -100 M 20 -228 L 20 -100',stroke:'#fff','stroke-width':12},P.g);
  const ball=gg(g);E('circle',{r:34,fill:'#fff',class:'o'},ball);E('path',{d:'M 0 -12 L 11 -4 L 7 10 L -7 10 L -11 -4 Z',fill:OUT},ball);E('path',{d:'M 0 -12 L 0 -34 M 11 -4 L 32 -10 M 7 10 L 20 28 M -7 10 L -20 28 M -11 -4 L -32 -10',class:'ln'},ball);
  const bxy=st=>{if(on(st.a)){const k=(st.a*2)%1,h=bump(k)*300;return [110-k*40,-34-h,st.a*900];}if(on(st.p))return [110,-34-bump(st.p)*90,st.p*300];return [110,-34,0];};
  return {draw(st){const ps=pose(st);if(on(st.a)){const k=(st.a*2)%1;if(k>.3&&k<.7){ps.aL=[-110,-300];ps.aR=st.hold?ps.aR:[110,-300];}}P.set(Object.assign({x:0,y:0,s:1},ps));const [x,y,r]=bxy(st);place(ball,x,y,1,r);},
    hand(st){return handOf(pose(st));}};}};

/* 12. SYRENKA WARSZAWSKA – wynurza się z wody, unosi ręce */
M.syrenka={bs:.3,ext:[200,200],aDur:1.6,build(g,c){const k=.82;
  const w=clipAbove(c,g,-8);const SY=syrenka(w);setsw(SY.g,OUTL/(c.s*k));['phone','bub','keys','ec','mo','sword'].forEach(kk=>hideK(SY,kk));
  water(g,-200,200);
  const geo=st=>{let hL=[-118,-60],hR=[118,-60],y=70*k;if(st.hold)hR=[96,-372];
    if(on(st.p))hL=[-130,-330+Math.sin(st.p*Math.PI*4)*30];
    if(on(st.a)){const u=bump(st.a);y-=150*k*u;hL=[-92-40*u,-60-312*u];if(!st.hold)hR=[92+40*u,-60-312*u];}
    if(on(st.th)){const u=st.th;y-=60*k*bump(u);hR=u<.45?[lerp(96,-20,u/.45),lerp(-372,-420,u/.45)]:[lerp(-20,150,ease.outC((u-.45)/.55)),lerp(-420,-340,(u-.45)/.55)];}
    return {hL,hR,y};};
  return {draw(st){const o=geo(st);SY.armL([-58,-160],o.hL,-30);SY.armR([58,-160],o.hR,40);tl(SY.hL,o.hL[0],o.hL[1]);tl(SY.hR,o.hR[0],o.hR[1]);place(SY.g,0,o.y,k);},
    hand(st){const o=geo(st);return [o.hR[0]*k,o.y+o.hR[1]*k-10];}};}};

/* 13. MORSKIE KRÓLESTWO – konik morski wyskakuje z wody, skrzynia skarbów się otwiera */
M.morze={bs:.32,ext:[320,150],aDur:1.7,build(g,c){const k=.8;
  const ch=gg(g);E('rect',{x:-70,y:-70,width:140,height:70,rx:10,fill:'#b5804f',class:'o'},ch);E('path',{d:'M -70 -40 L 70 -40 M -30 -70 L -30 0 M 30 -70 L 30 0',stroke:'#7b4f24','stroke-width':6},ch);
  const glow=E('ellipse',{cx:0,cy:-80,rx:80,ry:50,fill:'#fff3a0',opacity:0},ch);[[-30,-74],[0,-80],[28,-72]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:16,fill:'#ffd23f',class:'o2'},ch));
  const lid=gg(ch);E('path',{d:'M -74 -70 Q -74 -120 0 -124 Q 74 -120 74 -70 Z',fill:'#c98a4b',class:'o'},lid);E('rect',{x:-12,y:-84,width:24,height:24,rx:5,fill:'#ffd23f',class:'o2'},lid);
  place(ch,-230,0,1);
  const w=clipAbove(c,g,-8);const H=buildSeahorse(w);setsw(H.g,OUTL/(c.s*k));
  H.rings.forEach((r,i)=>{let x,y;if(i<12){const u=i/11;x=-6+u*26;y=118+u*110;}else{const u=(i-12)/11,a=-Math.PI/2+u*Math.PI*1.7,R=34*(1-u*.6);x=46+Math.cos(a)*R*-1;y=262+Math.sin(a)*R;}r.setAttribute('cx',f1(x));r.setAttribute('cy',f1(y));r.setAttribute('r',f1(15-i*.35));});
  water(g,-320,170);
  const geo=st=>{let y=40*k,r=0,x=40;if(on(st.a)){const u=bump(st.a);y-=280*k*u;r=-16*Math.sin(st.a*Math.PI*2);}if(on(st.p))r=Math.sin(st.p*Math.PI*3)*6;if(on(st.th)){y-=120*k*bump(st.th);r=-14*bump(st.th);}return {x,y,r};};
  return {draw(st){const o=geo(st);place(H.g,o.x,o.y,k,o.r);const u=on(st.a)?bump(clamp(st.a*1.3)):0,lo=Math.max(u,st.done?1:0);lid.setAttribute('transform',`rotate(${f1(-62*lo)} -74 -70)`);opa(glow,lo*.8);},
    hand(st){const o=geo(st),c0=Math.cos(o.r*Math.PI/180),s0=Math.sin(o.r*Math.PI/180),hx=158*k,hy=-166*k;return [o.x+hx*c0-hy*s0,o.y+hx*s0+hy*c0];}};}};

window.MOTYWY=M;
})();
