'use strict';
/* Mastalex – rekwizyty krain.
   Każda sekcja dostaje jeden rekwizyt dobrany do tego, o czym mówi jej tekst: o cenie – skrzynię skarbów, o terminie –
   zegar z kukułką, o Google – latarnię, o domenie i hostingu – domek, o kontakcie – skrzynkę pocztową, o bezpłatnym
   projekcie – prezent, o danych osobowych – sejf, o opiniach i rankingach – puchar, o przebudowie i kodzie – skrzynkę
   z narzędziami, o tekstach i poradach – księgę. Rekwizyt stoi na półeczce przy krawędzi panelu, na wysokości akapitu,
   którego dotyczy (albo na górnej krawędzi karty), więc nie zasłania tekstu.
   Kolejność jak w opowieści: zwój dociera do krainy, postać robi swoje, a gdy dojdziesz do akapitu z rekwizytem,
   postać schodzi z panelu, wieko się otwiera i ona wyskakuje z rekwizytu (smok ze skrzyni, wampir z sejfu…),
   robi swoje, chowa się z powrotem i dopiero wtedy podaje zwój dalej. Na raz dzieje się jedna scena.
   Listy kroków to ścieżka: mały bohater krainy przechodzi z punktu na punkt razem z czytaniem i na ostatnim wbija flagę.
   Pytania to domki: otwierasz pytanie – otwierają się drzwiczki i wyskakuje postać. Tekst nigdy się nie rusza.
   Rekwizyt można kliknąć, żeby scena wróciła. */
window.SCENY=function(api){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const OUTL=3.2,D2R=Math.PI/180;
const qa=(s,r)=>[...(r||document).querySelectorAll(s)];
const gg=(p,a)=>E('g',a||{},p),f1=v=>(+v).toFixed(1);
const setsw=(el,px)=>{el.style.setProperty('--sw',px.toFixed(3)+'px');return el;};
const op=(el,v)=>el.setAttribute('opacity',clamp(v).toFixed(3));
const rot=(el,a,cx,cy)=>el.setAttribute('transform',`rotate(${f1(a)} ${f1(cx)} ${f1(cy)})`);
const tl=(el,x,y,r,s)=>el.setAttribute('transform',`translate(${f1(x)} ${f1(y)})${r?` rotate(${f1(r)})`:''}${s!==undefined?` scale(${(+s).toFixed(3)})`:''}`);
function dR(el){const r=el.getBoundingClientRect();return {l:r.left+scrollX,t:r.top+scrollY,r:r.right+scrollX,b:r.bottom+scrollY,w:r.width,h:r.height,cx:r.left+scrollX+r.width/2,cy:r.top+scrollY+r.height/2,vt:r.top,vb:r.bottom};}
let seed=7;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
const MOT=window.MOTYWY||{};
const TC={kosmos:'#ff4b5c',ksiezyc:'#ffc93c',podniebne:'#ff6b8f',alpinista:'#ff5a4b',roszpunka:'#f5b81e',wampir:'#c0392b',smok:'#ff8a2d',
  tadeusz:'#2f9a5a',swinki:'#f78fae',lalki:'#a77ef0',mecz:'#e8343f',syrenka:'#3aa8f0',morze:'#1fb5a8'};
const kk=()=>clamp(api.DW/1440,.62,1);
const narrow=()=>api.DW<600;

/* ---------- temat sekcji → rekwizyt ---------- */
const L_='[\\p{L}]*',NB='(?<![\\p{L}])',NA='(?![\\p{L}])';
const ZL=/\d[\d\s ]*[\s ]?zł/u;
const TEM=[
  ['skrzynia','\\d[\\d\\s\\u00a0]*[\\s\\u00a0]?zł|'+NB+'(?:cen[aęyi]|cenni'+L_+'|koszt'+L_+'|płac'+L_+'|zapłac'+L_+'|płatnoś'+L_+'|zaliczk'+L_+'|wycen'+L_+'|abonament'+L_+')'],
  ['sejf',NB+'(?:dan'+L_+'[\\s\\u00a0]osobow'+L_+'|RODO|prywatnoś'+L_+'|administrator'+L_+'|przechowuj'+L_+'|przetwarza'+L_+'|bezpieczeńst'+L_+')'],
  ['zegar','\\d+(?:[–-]\\d+)?[\\s\\u00a0](?:dni|dnia|tygodni[ea]?|miesi[ąę]c'+L_+'|godzin'+L_+')'+NA+'|'+NB+'(?:termin'+L_+'|kiedy|efekt'+L_+')'+NA],
  ['wieza',NB+'(?:Google|wyżej|wyszukiwar'+L_+'|pozycj'+L_+'|SEO|Profil'+L_+'[\\s\\u00a0]Firmy|Map(?:ach|y|a|ie)|czat'+L_+'[\\s\\u00a0]AI)'+NA],
  ['domek',NB+'(?:domen'+L_+'|hosting'+L_+'|serwer'+L_+'|podstron'+L_+'|wizytówk'+L_+')'],
  ['poczta',NB+'(?:kontakt'+L_+'|formularz'+L_+'|e-mail'+L_+'|napisz'+L_+'|zadzwo'+L_+'|wiadomoś'+L_+'|zapytani'+L_+')'],
  ['prezent',NB+'(?:bezpłatn'+L_+'|za darmo|gratis)'],
  ['puchar',NB+'(?:ranking'+L_+'|najlepsz'+L_+'|Clutch|nagrod'+L_+'|opini'+L_+'|realizacj'+L_+'|portfolio|zaufani'+L_+')'],
  ['narzedzia',NB+'(?:przebudow'+L_+'|odśwież'+L_+'|kod'+L_+'|technicz'+L_+'|robot'+L_+'|indeks'+L_+'|szybk'+L_+'|popraw'+L_+')'],
  ['ksiega',NB+'(?:tekst'+L_+'|treś'+L_+'|opis'+L_+'|poradnik'+L_+'|artykuł'+L_+'|kryteri'+L_+'|zakres'+L_+')']
].map(([k,s])=>({k,g:new RegExp(s,'giu'),o:new RegExp(s,'iu')}));
const BLK='p,li,dd,td,summary,h2,h3';
const zrodlo=el=>/^\s*Źródł/.test(el.textContent||'');
function wybierz(kr,used){if(kr.matches('.kr-faq,.kr-cta'))return null;const kin=kr.querySelector('.kin');if(!kin)return null;
  const bl=qa(BLK,kin).filter(e=>!zrodlo(e)&&!e.closest('nav,.okr,aside.tylko-duze,.faql,.btn'));
  const sc=TEM.map((t,i)=>{let n=0;for(const e of bl)n+=(e.textContent.match(t.g)||[]).length*(e.matches('h2,h3')?3:1);return {t,i,n:n*Math.pow(.3,used[t.k]||0)};})
    .filter(x=>x.n>0).sort((a,b)=>b.n-a.n||a.i-b.i);
  const ok=sc.filter(x=>(used[x.t.k]||0)<2);
  const pick=(ok.length?ok:sc)[0],k=pick?pick.t.k:'ksiega';used[k]=(used[k]||0)+1;let el=null;
  if(k==='skrzynia'){const c=qa('.cena-duza',kin).find(e=>!e.closest('aside.tylko-duze'));el=c||bl.find(e=>ZL.test(e.textContent))||null;}
  if(!el&&pick)el=bl.find(e=>pick.t.o.test(e.textContent))||null;
  if(!el)el=kin.querySelector('.pan h2,.pan p,h2,.kafel');
  return el?{k,el}:null;}
/* środek pierwszego dopasowania w tekście elementu (bez zmieniania tekstu) */
function textAt(el,re){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){const m=n.data.match(re);if(m){const r=document.createRange();r.setStart(n,m.index);r.setEnd(n,m.index+m[0].length);const b=r.getBoundingClientRect();
    if(b.width)return {x:b.left+scrollX+b.width/2,y:b.top+scrollY+b.height/2,vt:b.top};}}
  return null;}

/* ---------- rekwizyty: y=0 to otwór, z którego wyskakuje postać; korpus w dół do H; panel jest po stronie +x ---------- */
const P={
  skrzynia:{H:52,B:[62,42],build(b,f){E('ellipse',{cx:0,cy:0,rx:56,ry:7,fill:'#2b1a0e'},b);const gl=E('ellipse',{cx:0,cy:-8,rx:46,ry:18,fill:'#fff3a0',opacity:0},b);
      E('rect',{x:-60,y:0,width:120,height:52,rx:6,fill:'#b5804f',class:'o'},f);E('path',{d:'M -60 18 H 60 M -60 36 H 60',stroke:'#7b4f24','stroke-width':4},f);
      E('rect',{x:-60,y:0,width:14,height:52,fill:'#e8b64a',class:'o2'},f);E('rect',{x:46,y:0,width:14,height:52,fill:'#e8b64a',class:'o2'},f);
      E('rect',{x:-11,y:6,width:22,height:22,rx:4,fill:'#ffd23f',class:'o2'},f);E('path',{d:'M 0 12 L 0 21',stroke:OUT,'stroke-width':4,'stroke-linecap':'round'},f);
      const lid=gg(f);E('path',{d:'M -62 0 L -62 -14 Q -62 -40 0 -42 Q 62 -40 62 -14 L 62 0 Z',fill:'#c98a4b',class:'o'},lid);E('path',{d:'M -62 -14 H 62',stroke:'#7b4f24','stroke-width':4},lid);
      E('rect',{x:-48,y:-36,width:12,height:36,fill:'#e8b64a',class:'o2'},lid);E('rect',{x:36,y:-36,width:12,height:36,fill:'#e8b64a',class:'o2'},lid);
      return {set(u){rot(lid,-118*ease.ioS(u),-62,0);op(gl,u*.85);}};}},
  sejf:{H:60,B:[52,12],build(b,f){E('rect',{x:-46,y:-4,width:92,height:10,fill:'#2b2140'},b);
      E('rect',{x:-50,y:0,width:100,height:60,rx:8,fill:'#9aa0b8',class:'o'},f);E('rect',{x:-40,y:8,width:80,height:44,rx:6,fill:'#c8cde0',class:'o2'},f);
      const d=gg(f);E('circle',{cx:14,cy:30,r:12,fill:'#ffd23f',class:'o2'},d);E('path',{d:'M 14 20 L 14 40 M 4 30 L 24 30',stroke:OUT,'stroke-width':3},d);
      E('path',{d:'M -28 22 L -28 38',stroke:OUT,'stroke-width':6,'stroke-linecap':'round'},f);
      const lid=gg(f);E('rect',{x:-52,y:-12,width:104,height:14,rx:5,fill:'#8c8aa3',class:'o'},lid);
      return {set(u){rot(lid,-112*ease.ioS(u),-52,0);d.setAttribute('transform',`rotate(${f1(u*200)} 14 30)`);}};}},
  domek:{H:56,B:[56,40],build(b,f){E('rect',{x:-40,y:-4,width:80,height:8,fill:'#2b1a0e'},b);
      E('rect',{x:-44,y:0,width:88,height:56,fill:'#fff3d6',class:'o'},f);E('rect',{x:-11,y:22,width:22,height:34,rx:3,fill:'#3b2414',class:'o2'},f);
      const door=E('rect',{x:-11,y:22,width:22,height:34,rx:3,fill:'#8a5a3a',class:'o2'},f);
      const w=[E('rect',{x:-36,y:12,width:16,height:14,rx:2,fill:'#7fd0ff',class:'o2'},f),E('rect',{x:20,y:12,width:16,height:14,rx:2,fill:'#7fd0ff',class:'o2'},f)];
      const roof=gg(f);E('rect',{x:20,y:-36,width:12,height:24,fill:'#c0503a',class:'o2'},roof);E('path',{d:'M -56 4 L 0 -40 L 56 4 Z',fill:'#ff6b6b',class:'o'},roof);
      return {set(u){const e=ease.ioS(u);tl(roof,-66*e,-18*e,-32*e);door.setAttribute('transform',`translate(-11 0) scale(${(1-1.7*e).toFixed(3)} 1) translate(11 0)`);
        w.forEach(x=>x.setAttribute('fill',u>.25?'#ffd23f':'#7fd0ff'));}};}},
  poczta:{H:62,B:[62,30],build(b,f){E('ellipse',{cx:0,cy:0,rx:36,ry:6,fill:'#12345a'},b);E('rect',{x:-6,y:34,width:12,height:28,fill:'#6b4a2b',class:'o2'},f);
      E('rect',{x:-40,y:0,width:80,height:34,rx:5,fill:'#3aa8f0',class:'o'},f);E('path',{d:'M -20 16 H 20',stroke:OUT,'stroke-width':4,'stroke-linecap':'round'},f);
      const fl=gg(f);E('path',{d:'M 44 26 L 44 -4',stroke:OUT,'stroke-width':4},fl);E('rect',{x:44,y:-4,width:18,height:12,fill:'#e8343f',class:'o2'},fl);
      const lid=gg(f);E('path',{d:'M -40 0 Q -40 -30 0 -30 Q 40 -30 40 0 Z',fill:'#2f8fd6',class:'o'},lid);
      return {set(u){rot(lid,-116*ease.ioS(u),-40,0);rot(fl,-80*clamp(u*1.4),44,26);}};}},
  prezent:{H:44,B:[44,32],build(b,f){E('rect',{x:-36,y:-4,width:72,height:8,fill:'#5b1030'},b);
      E('rect',{x:-38,y:0,width:76,height:44,fill:'#ff6b8f',class:'o'},f);E('rect',{x:-6,y:0,width:12,height:44,fill:'#ffd23f',class:'o2'},f);
      const lid=gg(f);E('rect',{x:-44,y:-14,width:88,height:16,rx:3,fill:'#ff8fb0',class:'o'},lid);E('rect',{x:-6,y:-14,width:12,height:16,fill:'#ffd23f',class:'o2'},lid);
      E('path',{d:'M 0 -14 q -18 -18 -18 -2 q 8 5 18 2 q 10 3 18 -2 q 0 -16 -18 2 Z',fill:'#ffd23f',class:'o2'},lid);
      return {set(u){const e=ease.ioS(u);tl(lid,-92*e,-56*Math.sin(Math.PI*e)+30*e,-80*e);}};}},
  zegar:{H:64,B:[46,34],build(b,f){E('rect',{x:-30,y:-4,width:60,height:8,fill:'#2b1a0e'},b);
      E('rect',{x:-34,y:0,width:68,height:64,rx:4,fill:'#8a5a3a',class:'o'},f);E('circle',{cx:0,cy:32,r:20,fill:'#fff8e6',class:'o2'},f);
      const hm=E('path',{d:'M 0 32 L 0 17',stroke:OUT,'stroke-width':3.5,'stroke-linecap':'round'},f),hh=E('path',{d:'M 0 32 L 9 32',stroke:'#e8343f','stroke-width':4,'stroke-linecap':'round'},f);
      [[-22,12],[22,12]].forEach(([x,y])=>E('path',{d:`M ${x-6} ${y} q 6 -10 12 0 q -6 6 -12 0 Z`,fill:'#6fd36b',class:'o2'},f));
      const roof=gg(f);E('path',{d:'M -46 4 L 0 -34 L 46 4 Z',fill:'#5b3a22',class:'o'},roof);E('circle',{cx:0,cy:-10,r:7,fill:'#2b1a0e'},roof);
      return {set(u,t){rot(roof,-104*ease.ioS(u),-46,4);hm.setAttribute('transform',`rotate(${f1(u>0?t*900:0)} 0 32)`);hh.setAttribute('transform',`rotate(${f1(u>0?t*75:0)} 0 32)`);}};}},
  wieza:{H:92,B:[26,46],build(b,f){E('rect',{x:-15,y:-3,width:30,height:6,fill:'#2b2140'},b);const beam=E('path',{d:'M 0 -12 L -150 -46 L -150 22 Z',fill:'#fff6b0',opacity:0},b);
      E('path',{d:'M -26 92 L -16 0 L 16 0 L 26 92 Z',fill:'#ffffff',class:'o'},f);E('path',{d:'M -19.5 26 L 19.5 26 L 21.5 44 L -21.5 44 Z M -23.4 62 L 23.4 62 L 25 78 L -25 78 Z',fill:'#ff4b5c',class:'o2'},f);
      E('rect',{x:-6,y:76,width:12,height:16,rx:3,fill:'#2b2140'},f);
      const lid=gg(f);E('rect',{x:-18,y:-24,width:36,height:24,rx:4,fill:'#ffe9a0',class:'o'},lid);E('path',{d:'M -22 -24 Q 0 -46 22 -24 Z',fill:'#ff4b5c',class:'o'},lid);
      return {set(u,t){const e=ease.ioS(u);tl(lid,-44*e,-26*e,-40*e);op(beam,u>.5?.55:0);beam.setAttribute('transform',`rotate(${f1(Math.sin(t*2.4)*30)} 0 -12)`);}};}},
  ksiega:{H:30,B:[68,6],build(b,f){E('path',{d:'M -68 6 Q 0 16 68 6 L 68 30 Q 0 40 -68 30 Z',fill:'#6a3fd6',class:'o'},f);
      E('path',{d:'M 0 4 Q -30 -6 -62 2 L -62 26 Q -30 18 0 28 Z',fill:'#fff8e6',class:'o2'},f);E('path',{d:'M 0 4 Q 30 -6 62 2 L 62 26 Q 30 18 0 28 Z',fill:'#fff8e6',class:'o2'},f);
      E('path',{d:'M -50 8 Q -30 3 -10 9 M -50 15 Q -30 10 -10 16 M 10 9 Q 30 3 50 8 M 10 16 Q 30 10 50 15',fill:'none',stroke:'#c9b6ff','stroke-width':2.5},f);
      const pg=gg(f);E('path',{d:'M 0 4 Q 30 -6 62 2 L 62 26 Q 30 18 0 28 Z',fill:'#ffffff',class:'o2'},pg);
      return {set(u){const a=clamp(u*1.6);pg.setAttribute('transform',`scale(${(1-2*a).toFixed(3)} 1)`);op(pg,a<1?1:0);}};}},
  narzedzia:{H:36,B:[52,10],build(b,f){E('rect',{x:-46,y:-4,width:92,height:8,fill:'#3b0d12'},b);
      E('rect',{x:-50,y:0,width:100,height:36,rx:4,fill:'#e8343f',class:'o'},f);E('rect',{x:-9,y:6,width:18,height:10,rx:2,fill:'#c8cde0',class:'o2'},f);
      const l=gg(f),r=gg(f);E('rect',{x:-52,y:-10,width:52,height:12,rx:3,fill:'#ff5a5f',class:'o'},l);E('rect',{x:0,y:-10,width:52,height:12,rx:3,fill:'#ff5a5f',class:'o'},r);
      return {set(u){const e=ease.ioS(u);rot(l,-110*e,-52,0);rot(r,110*e,52,0);}};}},
  puchar:{H:70,B:[64,0],build(b,f){E('ellipse',{cx:0,cy:0,rx:38,ry:7,fill:'#a07a12'},b);
      E('path',{d:'M -40 6 q -24 0 -18 22 q 4 10 22 10 M 40 6 q 24 0 18 22 q -4 10 -22 10',fill:'none',stroke:OUT,'stroke-width':6},f);
      E('path',{d:'M -40 0 L 40 0 Q 40 46 0 52 Q -40 46 -40 0 Z',fill:'#ffd23f',class:'o'},f);E('path',{d:'M -24 10 q 4 22 18 30',fill:'none',stroke:'#fff6b0','stroke-width':5,'stroke-linecap':'round'},f);
      E('rect',{x:-8,y:50,width:16,height:12,fill:'#e8a72c',class:'o2'},f);E('rect',{x:-26,y:60,width:52,height:10,rx:3,fill:'#b5804f',class:'o2'},f);
      return {set(){}};}}
};
/* półeczka przybita do ramki panelu (gwoździe po stronie panelu) */
const SH=()=>narrow()?56:70;
function shelf(f,H){const w=SH();E('rect',{x:-w,y:H,width:2*w,height:10,rx:4,fill:'#c98a4b',class:'o2'},f);
  [w*.48,w*.8].forEach(x=>E('circle',{cx:x,cy:H+5,r:2.6,fill:OUT},f));}

/* ---------- postać krainy w rekwizycie: przesunięcie środka (cx), skala i połowa szerokości otworu ---------- */
const PO={kosmos:{cx:-196,k:.2,w:150},ksiezyc:{cx:0,k:.22,w:230},podniebne:{cx:0,k:.22,w:200},alpinista:{cx:70,k:.24,w:200},roszpunka:{cx:0,k:.14,w:260},
  wampir:{cx:0,k:.22,w:280},smok:{cx:0,k:.24,w:320},tadeusz:{cx:30,k:.24,w:230},swinki:{cx:110,k:.26,w:150},lalki:{cx:0,k:.24,w:150},
  mecz:{cx:40,k:.24,w:200},syrenka:{cx:0,k:.24,w:220},morze:{cx:40,k:.24,w:170}};

/* ---------- drobne efekty przy rekwizycie (nigdy na tekście) ---------- */
function coin(p){const g=gg(p);E('circle',{r:15,fill:'#ffd23f',class:'o'},g);E('circle',{r:9,fill:'none',stroke:'#e8a72c','stroke-width':4},g);return g;}
function star(p,col){const g=gg(p);E('path',{d:'M 0 -16 L 4.7 -6.5 L 15.2 -4.9 L 7.6 2.5 L 9.4 13 L 0 8 L -9.4 13 L -7.6 2.5 L -15.2 -4.9 L -4.7 -6.5 Z',fill:col||'#ffd23f',class:'o2'},g);return g;}
function envelope(p){const g=gg(p);E('rect',{x:-22,y:-15,width:44,height:30,rx:4,fill:'#fff',class:'o'},g);E('path',{d:'M -22 -15 L 0 3 L 22 -15',fill:'#ffe9b0',class:'o2'},g);E('circle',{cx:0,cy:3,r:5,fill:'#e8343f',class:'o2'},g);return g;}
function wrench(p){const g=gg(p);E('path',{d:'M -4 -20 L 4 -20 L 4 14 L -4 14 Z',fill:'#c8cde0',class:'o2'},g);E('path',{d:'M -12 -26 A 12 12 0 1 0 12 -26 L 6 -26 L 6 -18 L -6 -18 L -6 -26 Z',fill:'#c8cde0',class:'o2'},g);return g;}
function hammer(p){const g=gg(p);E('rect',{x:-3,y:-14,width:6,height:32,rx:2,fill:'#b5804f',class:'o2'},g);E('rect',{x:-14,y:-22,width:28,height:11,rx:2,fill:'#8c8aa3',class:'o2'},g);return g;}
function arc(kind,x0,y0,x1,y1,dur,o){if(RM)return;o=o||{};const s=kk()*(o.s||.9),g=gg(api.L.fx);kind(g,o.col);setsw(g,OUTL/s*.9);const cx=(x0+x1)/2,cy=Math.min(y0,y1)-(o.h||90),hold=o.hold||.25;
  api.addFX(g,dur+hold,(u,t)=>{const v=clamp(t/dur),e=ease.ioS(v);place(g,(1-e)*(1-e)*x0+2*e*(1-e)*cx+e*e*x1,(1-e)*(1-e)*y0+2*e*(1-e)*cy+e*e*y1,Math.max(.001,s*(v>=1?1-clamp((t-dur)/hold):1)),(o.spin||0)*e);});}
function pops(kind,x,y,n,o){if(RM)return;o=o||{};for(let i=0;i<n;i++){const a=(-160+i*(140/Math.max(1,n-1)))*D2R,g=gg(api.L.fx),s=kk()*(o.s||.6);kind(g,o.col);setsw(g,OUTL/s*.9);
    const d=(o.r||60)*(.8+R()*.4),t0=i*.07;
    api.addFX(g,1.1+t0,(u,t)=>{const v=clamp((t-t0)/.5);place(g,x+Math.cos(a)*d*ease.outC(v),y+Math.sin(a)*d*ease.outC(v),Math.max(.001,s*ease.outBack(v)*(t>.8+t0?1-clamp((t-.8-t0)/.3):1)));});}}
function ring(x,y,col,r1){if(RM)return;const g=gg(api.L.fx),c=E('circle',{r:8,fill:'none',stroke:col,'stroke-width':4},g);api.addFX(g,.6,u=>{c.setAttribute('r',f1(8+(r1||40)*ease.outC(u)));op(g,1-u);place(g,x,y,1);});}

/* ---------- mali bohaterowie ścieżek (listy kroków); ziemia y=0, patrzą w prawo ---------- */
function legs2(g){return [0,1].map(()=>E('path',{class:'ln',style:'stroke-width:6px'},g));}
const TOK={
  kosmos(g){const r=gg(g);const fl=E('path',{d:'M -12 30 Q 0 62 12 30 Z',fill:'#ffd23f',class:'o2'},r);E('path',{d:'M -16 18 L -34 38 L -12 30 Z M 16 18 L 34 38 L 12 30 Z',fill:'#ff4b5c',class:'o2'},r);
    E('path',{d:'M 0 -46 Q 24 -26 18 30 L -18 30 Q -24 -26 0 -46 Z',fill:'#f4f1ff',class:'o'},r);E('circle',{cx:0,cy:-6,r:9,fill:'#9fe7ff',class:'o2'},r);
    return (o)=>{tl(r,0,-40);fl.setAttribute('transform',`translate(0 30) scale(1 ${(o.mv?1.3:.7).toFixed(2)}) translate(0 -30)`);};},
  ksiezyc(g){const b=gg(g);[['#2f6b4f',-70],['#c0392b',-56],['#1f4f8a',-44]].forEach(([c,a],i)=>E('path',{d:`M -16 -34 Q ${-46+i*4} ${a-14} ${-38+i*8} ${a+16} Q ${-30+i*4} -40 -12 -26 Z`,fill:c,class:'o2'},b));
    const lg=legs2(b);E('ellipse',{cx:0,cy:-32,rx:26,ry:20,fill:'#fff3e0',class:'o'},b);E('path',{d:'M 12 -66 q 3 -12 9 -4 q 4 -12 9 -2 q 6 -8 7 4 Z',fill:'#e8343f',class:'o2'},b);
    E('circle',{cx:20,cy:-54,r:13,fill:'#fff3e0',class:'o'},b);E('circle',{cx:24,cy:-57,r:2.8,fill:OUT},b);E('path',{d:'M 32 -57 L 44 -53 L 32 -49 Z',fill:'#ffc93c',class:'o2'},b);
    return (o)=>{b.setAttribute('transform',`scale(${o.dir} 1)`);const s=o.mv?Math.sin(o.T*20)*8:0;lg[0].setAttribute('d',`M -6 -14 L ${f1(-8+s)} 0`);lg[1].setAttribute('d',`M 6 -14 L ${f1(6-s)} 0`);};},
  podniebne(g){const b=gg(g);E('path',{d:'M -12 -46 L -8 -18 M 12 -46 L 8 -18',class:'ln'},b);E('circle',{cx:0,cy:-70,r:28,fill:'#ff6b8f',class:'o'},b);
    E('path',{d:'M 0 -98 Q 13 -70 0 -42 Q -13 -70 0 -98 Z',fill:'#ffd23f',class:'o2'},b);E('rect',{x:-11,y:-19,width:22,height:17,rx:4,fill:'#b5804f',class:'o2'},b);
    return (o)=>tl(b,0,0,o.mv?Math.sin(o.T*9)*6:0);},
  alpinista(g){const b=gg(g);const lg=legs2(b);E('rect',{x:-20,y:-50,width:12,height:24,rx:4,fill:'#ff9a3d',class:'o2'},b);E('rect',{x:-11,y:-50,width:22,height:30,rx:7,fill:'#ff4b5c',class:'o'},b);
    E('circle',{cx:0,cy:-62,r:11,fill:'#ffd0a8',class:'o'},b);E('path',{d:'M -12 -64 Q -12 -78 0 -78 Q 12 -78 12 -64 Z',fill:'#2f6fd6',class:'o2'},b);E('circle',{cx:4,cy:-62,r:2.2,fill:OUT},b);
    const ax=gg(b);E('path',{d:'M 0 0 L 0 -24',stroke:'#5b4632','stroke-width':4,'stroke-linecap':'round'},ax);E('path',{d:'M -8 -24 Q 0 -30 10 -22 L 0 -22 Z',fill:'#c8cde0',class:'o2'},ax);
    return (o)=>{b.setAttribute('transform',`scale(${o.dir} 1)`);const s=o.mv?Math.sin(o.T*18)*9:0;lg[0].setAttribute('d',`M -5 -22 L ${f1(-6+s)} 0`);lg[1].setAttribute('d',`M 5 -22 L ${f1(6-s)} 0`);tl(ax,14,-36,o.mv?-20:30);};},
  roszpunka(g){const tip=gg(g);E('path',{d:'M -7 -2 q 7 18 14 0 q -7 7 -14 0 Z',fill:'#ffcf4a',class:'o2'},tip);E('circle',{cy:-8,r:8,fill:'#ff6b8f',class:'o2'},tip);return ()=>{};},
  wampir(g){const bs=[[-18,-40],[18,-52],[2,-24]].map(([x,y],i)=>{const o=gg(g),B=bird(o,'#3b2457');E('circle',{cx:0,cy:-6,r:13,fill:'#3b2457'},o);E('path',{d:'M -7 -15 l -4 -13 l 10 8 Z M 7 -15 l 4 -13 l -10 8 Z',fill:'#3b2457'},o);return {o,B,x,y,ph:i*2.1};});
    return (o)=>bs.forEach(b=>{birdFlap(b.B,o.mv?o.T*26+b.ph:b.ph);tl(b.o,b.x,b.y,0,.4);});},
  smok(g){const b=gg(g);const w=E('path',{d:'M -6 -40 Q -30 -74 -40 -40 Q -26 -46 -6 -30 Z',fill:'#5fcf7a',class:'o2'},b);E('ellipse',{cx:0,cy:-24,rx:22,ry:18,fill:'#6fd36b',class:'o'},b);
    E('path',{d:'M -20 -20 Q -40 -10 -36 4 Q -30 -8 -16 -12 Z',fill:'#6fd36b',class:'o2'},b);E('circle',{cx:18,cy:-44,r:14,fill:'#6fd36b',class:'o'},b);E('circle',{cx:22,cy:-47,r:3,fill:OUT},b);
    E('path',{d:'M 10 -56 l -2 -10 l 8 7 M 20 -57 l 3 -10 l 4 9',fill:'#ffd23f',class:'o2'},b);E('path',{d:'M -10 -6 L -12 2 M 8 -6 L 10 2',class:'ln',style:'stroke-width:6px'},b);
    return (o)=>{b.setAttribute('transform',`scale(${o.dir} 1)`);rot(w,o.mv?Math.sin(o.T*24)*24:0,-6,-36);};},
  tadeusz(g){const b=gg(g);const lg=[-14,-4,10,18].map(x=>E('rect',{x:x-3,y:-14,width:6,height:14,rx:3,fill:'#b5804f',class:'o2'},b));E('path',{d:'M -22 -24 q -12 -8 -10 -18',fill:'none',stroke:OUT,'stroke-width':4,'stroke-linecap':'round'},b);
    E('ellipse',{cx:0,cy:-24,rx:24,ry:12,fill:'#d9a066',class:'o'},b);E('ellipse',{cx:24,cy:-36,rx:12,ry:10,fill:'#d9a066',class:'o'},b);E('path',{d:'M 18 -42 q -6 10 -2 18',fill:'#8a5a3a',class:'o2'},b);
    E('circle',{cx:28,cy:-38,r:2.4,fill:OUT},b);E('circle',{cx:36,cy:-34,r:3,fill:OUT},b);
    return (o)=>{b.setAttribute('transform',`scale(${o.dir} 1)`);const s=o.mv?Math.sin(o.T*24)*4:0;lg.forEach((l,i)=>l.setAttribute('transform',`translate(${f1(i%2?s:-s)} 0)`));};},
  swinki(g){const b=gg(g);const lg=[-12,-4,8,16].map(x=>E('rect',{x:x-3.5,y:-12,width:7,height:12,rx:3,fill:'#f78fae',class:'o2'},b));
    E('ellipse',{cx:0,cy:-26,rx:24,ry:17,fill:'#ffb3c7',class:'o'},b);E('circle',{cx:20,cy:-38,r:14,fill:'#ffb3c7',class:'o'},b);E('path',{d:'M 12 -50 L 10 -60 L 19 -52 Z M 25 -52 L 31 -61 L 32 -49 Z',fill:'#f78fae',class:'o2'},b);
    E('ellipse',{cx:33,cy:-36,rx:6,ry:5,fill:'#f78fae',class:'o2'},b);E('circle',{cx:22,cy:-42,r:2.4,fill:OUT},b);E('rect',{x:-16,y:-54,width:28,height:13,rx:2,fill:'#c0503a',class:'o2'},b);
    return (o)=>{b.setAttribute('transform',`scale(${o.dir} 1)`);const s=o.mv?Math.sin(o.T*24)*3:0;lg.forEach((l,i)=>l.setAttribute('transform',`translate(${f1(i%2?s:-s)} 0)`));};},
  lalki(g){const t=gg(g);E('rect',{x:-50,y:-26,width:34,height:20,rx:4,fill:'#c0303f',class:'o'},t);E('rect',{x:-12,y:-36,width:16,height:30,rx:3,fill:'#c0303f',class:'o'},t);E('rect',{x:-15,y:-40,width:22,height:6,rx:2,fill:'#2b2140',class:'o2'},t);
    E('rect',{x:2,y:-24,width:28,height:18,rx:8,fill:'#2b2140',class:'o'},t);E('path',{d:'M 18 -24 L 16 -36 L 12 -40 L 26 -40 L 22 -36 L 20 -24 Z',fill:'#2b2140',class:'o2'},t);
    const wh=[-42,-24,-4,20].map(x=>{const w=gg(t);E('circle',{r:6,fill:'#e8343f',class:'o2'},w);E('path',{d:'M -4 0 L 4 0',stroke:'#fff','stroke-width':2},w);w._x=x;return w;});
    return (o)=>{t.setAttribute('transform',`scale(${o.dir} 1)`);wh.forEach(w=>tl(w,w._x,-5,o.mv?o.T*600:0));};},
  mecz(g){const b=gg(g);E('circle',{r:14,fill:'#fff',class:'o'},b);E('path',{d:'M 0 -5 L 5 -1.5 L 3 4.5 L -3 4.5 L -5 -1.5 Z',fill:OUT},b);E('path',{d:'M 0 -5 L 0 -14 M 5 -1.5 L 13 -4 M 3 4.5 L 8 11 M -3 4.5 L -8 11 M -5 -1.5 L -13 -4',class:'ln'},b);
    return (o)=>tl(b,0,-14,o.spin||0);},
  syrenka(g){const f=gg(g);const tail=E('path',{d:'M -18 0 L -32 -10 L -30 10 Z',fill:'#2f8fd6',class:'o2'},f);E('ellipse',{cx:0,cy:0,rx:20,ry:12,fill:'#6cc8ff',class:'o'},f);
    E('path',{d:'M -4 -11 Q -1 0 -4 11',fill:'none',stroke:'#fff','stroke-width':4},f);E('circle',{cx:13,cy:-3,r:2.6,fill:OUT},f);
    return (o)=>{f.setAttribute('transform',`translate(0 -14) scale(${o.dir} 1)`);rot(tail,o.mv?Math.sin(o.T*24)*16:0,-18,0);};},
  morze(g){const f=gg(g);const tail=E('path',{d:'M -18 0 L -32 -10 L -30 10 Z',fill:'#ff7a2d',class:'o2'},f);E('ellipse',{cx:0,cy:0,rx:20,ry:12,fill:'#ff9a3d',class:'o'},f);
    E('path',{d:'M -4 -11 Q -1 0 -4 11 M 8 -9 Q 11 0 8 9',fill:'none',stroke:'#fff','stroke-width':4},f);E('circle',{cx:13,cy:-3,r:2.6,fill:OUT},f);
    return (o)=>{f.setAttribute('transform',`translate(0 -14) scale(${o.dir} 1)`);rot(tail,o.mv?Math.sin(o.T*24)*16:0,-18,0);};}
};

/* ---------- stan ---------- */
const KR=qa('.kr');const SC=[];let T=0,L=null,DEFS=null,cur=null,uid=0,played=0;
function init(){const used={};
  KR.forEach((kr,i)=>{const th=kr.dataset.motyw;const s={i,kr,th,col:TC[th]||'#ffd23f',side:i%2?1:-1,items:[]};
    const w=wybierz(kr,used);if(w)s.items.push({kind:'pop',prop:w.k,el:w.el,done:false,n:0});
    const kin=kr.querySelector('.kin');
    if(kin){const st=kin.querySelector('.siatka');const cards=st?qa(':scope>li',st).filter(li=>li.querySelector(':scope>.knum')):[];
      if(cards.length>=3)s.items.push({kind:'trail',card:cards[0].matches('.kafel,.kafel-link'),it:cards,idx:-1,max:-1,flag:false});
      else{const ol=qa('ol',kin).find(o=>!o.closest('nav,.faql,.okr')&&qa(':scope>li',o).length>=3);if(ol)s.items.push({kind:'trail',card:false,it:qa(':scope>li',ol),idx:-1,max:-1,flag:false});}
      qa('.faql details',kin).slice(0,8).forEach((d,j)=>s.items.push({kind:'pop',prop:'domek',small:true,faq:d,el:d.querySelector('summary'),auto:false,knock:j===0,done:false,n:0}));}
    SC.push(s);});}
function hideNow(A){A.away=true;A.awS=true;A.dirty=true;if(A.root){A.root.style.transition='none';A.root.style.opacity='0';A.root.style.pointerEvents='none';}}
function onBuild(){TXT=null;L=gg(api.FS);api.FS.insertBefore(L,api.L.fx);DEFS=E('defs',{},api.FS);EC=null;ELL=gg(api.FS);api.FS.insertBefore(ELL,api.L.fx);
  for(const s of SC)for(const it of s.items){it.g=null;it.cl=null;it.tg=null;}
  for(const s of SC)for(const it of s.items){
    if(it.kind==='trail'){mkTrail(s,it);continue;}
    mkProp(s,it);if(it.run){const A=api.ACT[s.i];if(A){hideNow(A);it.hid=A;}}}}

/* ---------- rekwizyt: miejsce i rysunek ---------- */
let TXT=null;
function textRects(){if(TXT)return TXT;TXT=[];
  for(const e of qa('main p,main li,main h1,main h2,main h3,main summary,main td,main dd,main .btn,main label')){if(!e.offsetParent)continue;
    const rg=document.createRange();rg.selectNodeContents(e);for(const r of rg.getClientRects())if(r.width>2&&r.height>2)TXT.push({l:r.left+scrollX,t:r.top+scrollY,r:r.right+scrollX,b:r.bottom+scrollY});}
  for(const e of qa('main input:not([type=hidden]),main textarea,main select,main .knum'))if(e.offsetParent){const r=dR(e);TXT.push({l:r.l,t:r.t,r:r.r,b:r.b});}
  return TXT;}
function boxOf(c,PD){const hw=Math.max(PD.B[0],c.shelf?SH():0)*c.ps;return {l:c.x-hw,r:c.x+hw,t:c.base-(PD.H+PD.B[1])*c.ps,b:c.base+(c.shelf?10*c.ps:0)};}
function hitA(bx){let a=0;for(const r of textRects()){const ox=Math.min(bx.r,r.r)-Math.max(bx.l,r.l),oy=Math.min(bx.b,r.b)-Math.max(bx.t,r.t);if(ox>2&&oy>2)a+=ox*oy;}return a;}
function where(s,it){const k=kk(),ps0=k*(it.small?.42:(narrow()?.44:.55)),PD=P[it.prop],el=it.el;if(!el)return null;const er=dR(el);if(!er.w&&!er.h)return null;
  const C=[];
  for(const ps of narrow()?[ps0,ps0*.8]:[ps0]){
    const card=it.faq?null:el.closest('.kafel,.kafel-link');
    if(card){const r=dR(card);const A=api.ACT[s.i];const right=!(A&&Math.abs(A.y-(r.t+3))<8&&A.x>r.cx);
      C.push({x:right?r.r-76*ps:r.l+76*ps,base:r.t+3,ps,mir:right?-1:1,shelf:false});}
    const pan=el.closest('.pan')||el.closest('.kform-wrap')||el.closest('.kin');const pr=dR(pan);
    let sides=[s.side,-s.side];const bo=pan.parentElement&&pan.parentElement.querySelector(':scope>.boczna');
    if(bo){const br=bo.getBoundingClientRect();if(br.width>0&&br.left+scrollX>pr.r-4)sides=[-1];}
    const half=SH()*ps;const base=it.faq?er.cy+PD.H*ps*.5:er.t+Math.min(er.h,60);
    if(it.faq&&er.l-pr.l>(PD.B[0]*2+40)*ps+16)C.push({x:er.l-PD.B[0]*ps-14,base:er.b-3,ps,mir:1,shelf:false});
    for(const sd of sides){const x=clamp(sd>0?pr.r:pr.l,half+2,api.DW-half-2);C.push({x,base,ps,mir:sd>0?-1:1,shelf:true});}
    if(!it.faq&&pan.matches('.pan')){const hs=qa('h2,h3',pan).filter(h=>h.offsetParent&&dR(h).t<=er.t+2);const hd=hs[hs.length-1];
      if(hd){const hr=dR(hd),cs=getComputedStyle(pan),hw=PD.B[0]*ps;for(const sd of sides)C.push({x:sd>0?pr.r-(parseFloat(cs.paddingRight)||20)-hw:pr.l+(parseFloat(cs.paddingLeft)||20)+hw,base:hr.t-3,ps,mir:sd>0?-1:1,shelf:false});}}
    if(!it.faq&&er.w>PD.B[0]*ps*4)for(const sd of sides)C.push({x:sd>0?er.r-PD.B[0]*ps-6:er.l+PD.B[0]*ps+6,base:er.t+2,ps,mir:sd>0?-1:1,shelf:false});}
  let best=null,ba=1e12;for(const c of C){const a=hitA(boxOf(c,PD));if(a<ba){ba=a;best=c;}if(a===0)break;}
  if(best)best.hit=Math.round(ba);return best;}
function putProp(it,dx){const w=it.w;[it.g,it.gf].forEach(x=>place(x,w.x+(dx||0),it.top,w.ps*w.mir,0,w.ps));}
function mkProp(s,it){const w=where(s,it);if(!w){it.g=null;return;}it.w=w;const PD=P[it.prop];
  it.top=w.base-PD.H*w.ps;
  const g=gg(L),gc=gg(L),gf=gg(L);[g,gf].forEach(x=>{x.classList.add('rekw');setsw(x,OUTL/w.ps);});
  it.g=g;it.gc=gc;it.gf=gf;if(w.shelf)shelf(gf,PD.H);it.P=PD.build(gg(g),gf);it.P.set(0,0);putProp(it,0);
  const click=e=>{e.preventDefault();if(it.faq){it.faq.open=!it.faq.open;}else replay(s,it);};
  [g,gf].forEach(x=>x.addEventListener('pointerdown',click));
  if(it.run)mkClone(s,it);}
function mkClone(s,it){const th=MOT[s.th],cfg=PO[s.th]||{cx:0,k:.22,w:220};if(!th||!it.gc)return;rmClone(it);
  const cs=kk()*cfg.k*(it.small?.8:1)*(narrow()?.9:1);
  const id='rk'+(++uid);const cp=E('clipPath',{id,clipPathUnits:'userSpaceOnUse'},DEFS);const hw=cfg.w*cs;E('rect',{x:it.w.x-hw,y:it.top-2000,width:hw*2,height:2002},cp);
  const clipG=gg(it.gc,{'clip-path':`url(#${id})`});const root=gg(clipG);setsw(root,OUTL/cs);
  let obj=null;try{obj=th.build(gg(root),{s:cs,defs:DEFS,uid:id});}catch(e){clipG.remove();cp.remove();return;}
  it.cl={root,obj,cs,cfg,clipG,cp,dep:440};}
function rmClone(it){if(it.cl){it.cl.clipG.remove();it.cl.cp.remove();it.cl=null;}}

/* ---------- przebieg sceny ---------- */
const DUR=t=>({open:.35,rise:.55,act:(t&&t.aDur)||1.6,hold:.35,sink:.45});
function replay(s,it){if(RM||(cur&&cur!==it)||it.run)return;if(EC)elEnd();it.done=true;begin(s,it);}
function begin(s,it){if(!it.g)mkProp(s,it);if(!it.g)return;it.run=true;it.t0=api.T;it.fx={};it.n++;played++;cur=it;mkClone(s,it);
  const A=api.ACT[s.i];if(A){A.away=true;A.dirty=true;it.hid=A;}
  api.kick(1);}
function end(s,it){it.run=false;rmClone(it);if(it.P)it.P.set(0,0);if(it.hid){it.hid.away=false;it.hid.dirty=true;it.hid=null;}if(cur===it)cur=null;api.kick(.5);}
function stepPop(s,it){const d=DUR(MOT[s.th]),t=api.T-it.t0;const r0=d.open*.6,a0=r0+d.rise,a1=a0+d.act,s0=a1+d.hold,s1=s0+d.sink;
  if(!it.g){if(t>=s1+.3){end(s,it);return false;}return true;}
  const open=t<s0?clamp(t/d.open):1-clamp((t-s1+.1)/.35);
  it.P.set(Math.max(0,open),t);
  const c=it.cl;if(c){const rise=t<r0?0:t<a0?ease.outBack(clamp((t-r0)/d.rise)):t<s0?1:1-ease.inQ(clamp((t-s0)/d.sink));
    place(c.root,it.w.x-c.cfg.cx*c.cs*it.w.mir,it.top+4*it.w.ps+(1-rise)*c.dep*c.cs,c.cs*it.w.mir,0,c.cs);
    const a=t>=a0&&t<a1?(t-a0)/d.act:-1;c.obj.draw({T:api.T,a,p:-1,th:-1,hold:false,lk:0,done:false});
    if(a>=0)fxAt(s,it,a);}
  if(t>=s1+.3){end(s,it);return false;}return true;}
/* co rekwizyt robi w trakcie akcji postaci */
function fxAt(s,it,a){const w=it.w,top=it.top,fx=it.fx;const once=(k,u,fn)=>{if(a>=u&&!fx[k]){fx[k]=1;fn();}};
  switch(it.prop){
    case 'skrzynia':{const tg=()=>{if(!fx.tg){const p=textAt(it.el,ZL);const r=dR(it.el);fx.tg=p&&p.vt>0&&p.vt<innerHeight?p:{x:r.l+Math.min(r.w,200)*.5,y:r.t+Math.min(r.h,40)*.5};}return fx.tg;};
      once('c',.3,()=>{const p=tg();for(let i=0;i<6;i++)arc(coin,w.x+(R()-.5)*30*w.ps,top-6,p.x+(R()-.5)*36,p.y+(R()-.5)*8,.5+i*.07,{h:110+R()*40,spin:400,s:.62,hold:.18});});
      once('c2',.78,()=>{const p=tg();api.sparkles(p.x,p.y,8,.6);});break;}
    case 'poczta':once('e',.3,()=>{const b=s.kr.querySelector('.kin .btn-primary,.kin a[href^="mailto"]');let tx=w.x+w.mir*160,ty=top-140;
      if(b){const r=dR(b);if(r.vt>0&&r.vb<innerHeight){tx=r.cx;ty=r.t-6;}}arc(envelope,w.x,top-20,tx,ty,.8,{h:120,s:.8,hold:.3});});break;
    case 'prezent':once('k',.2,()=>api.confetti(w.x,top-20,12));break;
    case 'puchar':once('p',.45,()=>pops(star,w.x,top-30,5,{r:70,s:.7}));break;
    case 'narzedzia':once('n',.3,()=>[wrench,hammer,wrench].forEach((f,i)=>arc(f,w.x,top-6,w.x+(i-1)*44*w.ps*2,top+2,.9,{h:110,spin:360*(i%2?1:-1),s:.62,hold:.05})));break;
    case 'zegar':once('z',.05,()=>{ring(w.x,top-10,'#ffd23f',40);});once('z2',.2,()=>{ring(w.x,top-10,'#ffd23f',40);});break;
    case 'ksiega':once('b',.4,()=>api.sparkles(w.x,top-10,9,.6));break;
    case 'sejf':once('s',.9,()=>ring(w.x,top,'#c8cde0',34));break;}}

/* ---------- ścieżka po krokach ---------- */
function trailPts(it){const pts=[];
  for(const li of it.it){const r=dR(li);if(!r.w)return null;
    if(it.card){pts.push([r.l+34*kk(),r.t-3]);continue;}
    const pan=li.closest('.pan')||li.closest('.kin');const pr=dR(pan);const pl=parseFloat(getComputedStyle(pan).paddingLeft)||24;
    pts.push([pr.l+pl*.5,r.t+Math.min(r.h,28)]);}
  return pts;}
function mkTrail(s,it){const pts=trailPts(it);if(!pts){it.tg=null;return;}it.pts=pts;const ts=kk()*(narrow()?.42:.5);
  it.line=E('path',{fill:'none',stroke:s.col,'stroke-width':4,'stroke-linecap':'round','stroke-dasharray':'2 9',opacity:.9},L);
  it.mk=gg(L);it.tg=gg(L);setsw(it.tg,OUTL/ts);it.ts=ts;it.draw=(TOK[s.th]||TOK.mecz)(it.tg);it.mv=null;
  if(it.idx<0){op(it.tg,0);}else{it.x=pts[it.idx][0];it.y=pts[it.idx][1];}
  for(let j=0;j<=it.max&&j<pts.length;j++)if(it.card)mark(s,it,j);
  it.flagG=null;if(it.flag)plantFlag(s,it,true);drawTrail(s,it,false);}
function mark(s,it,j){const p=it.pts[j];E('circle',{cx:f1(p[0]),cy:f1(p[1]-2),r:5,fill:s.col,stroke:OUT,'stroke-width':2},it.mk);}
function drawTrail(s,it,mv){if(!it.tg)return;if(!it.card){const p=it.pts;let d='';for(let j=0;j<=it.max&&j<p.length;j++)d+=(j?'L ':'M ')+f1(p[j][0])+' '+f1(p[j][1]+4)+' ';it.line.setAttribute('d',d);}
  if(it.idx<0)return;const ap=it.apT!==undefined?ease.outBack(clamp((api.T-it.apT)/.4)):1;
  place(it.tg,it.x,it.y,Math.max(.001,it.ts*ap));op(it.tg,1);it.draw({T:api.T,dir:it.dir||1,mv,spin:it.spin});}
function plantFlag(s,it,silent){const p=it.pts[it.pts.length-1],k=kk()*.55;const g=gg(L);setsw(g,OUTL/k);E('path',{d:'M 0 0 L 0 -50',stroke:OUT,'stroke-width':5,'stroke-linecap':'round'},g);
  E('path',{d:'M 0 -50 Q 14 -54 30 -46 Q 22 -38 30 -30 Q 14 -36 0 -32 Z',fill:s.col,class:'o2'},g);place(g,p[0]-(it.card?24:16)*k,p[1],k);it.flagG=g;
  if(!silent){api.sparkles(p[0],p[1]-24,10,.7);const A=api.ACT[s.i];if(A&&!A.away){A.pT=api.T;A.dirty=true;}}}
function stepTrail(s,it){if(!it.tg)return false;const vh=innerHeight;let j=-1;
  for(let q=0;q<it.it.length;q++){if(it.it[q].getBoundingClientRect().top<vh*.62)j=q;else break;}
  if(j>it.idx&&!it.mv){const n=it.idx+1,to=it.pts[n];
    if(it.idx<0){it.x=to[0];it.y=to[1];it.apT=api.T;it.idx=0;it.max=Math.max(it.max,0);if(it.card)mark(s,it,0);drawTrail(s,it,false);return true;}
    const from=[it.x,it.y];it.dir=to[0]>from[0]+1?1:to[0]<from[0]-1?-1:(it.dir||1);
    it.mv={from,to,t0:api.T,d:clamp(Math.hypot(to[0]-from[0],to[1]-from[1])/480,.4,.9)};it.idx=n;}
  if(it.apT!==undefined&&api.T-it.apT<.45){drawTrail(s,it,false);return true;}
  if(it.mv){const m=it.mv,u=clamp((api.T-m.t0)/m.d),e=ease.ioS(u);it.x=lerp(m.from[0],m.to[0],e);it.y=lerp(m.from[1],m.to[1],e)-Math.sin(Math.PI*u)*26;it.spin=(it.spin||0)+8;
    drawTrail(s,it,true);
    if(u>=1){it.mv=null;if(it.idx>it.max){it.max=it.idx;if(it.card)mark(s,it,it.idx);}drawTrail(s,it,false);
      if(it.idx===it.pts.length-1&&!it.flag){it.flag=true;plantFlag(s,it,false);}}
    return true;}
  return false;}

/* ---------- pętla ---------- */
/* scena rusza tylko, gdy na ekranie nic innego się nie dzieje: zwój nie leci, żadna widoczna postać nie gra ani nie rzuca */
function calm(){const PAR=window.POD&&window.POD.PAR;if(PAR&&PAR.fly)return false;
  for(const A of api.ACT){if(!A)continue;if(A.throwing)return false;if(api.T-A.aT<A.aDur&&A.y>scrollY-60&&A.y<scrollY+innerHeight+60)return false;}return true;}
function propIn(it){const y=it.top-scrollY;return y>Math.max(110,innerHeight*.2)&&y<innerHeight*.85;}
function frame(){T=api.T;let mv=false;
  for(const s of SC)for(const it of s.items){
    if(it.kind==='trail'){if(!RM)mv=stepTrail(s,it)||mv;continue;}
    if(it.run){mv=stepPop(s,it)||mv;continue;}
    if(!it.g)continue;
    if(it.knock&&!RM&&propIn(it)){it.knock=false;it.kT=T;}
    if(it.kT!==undefined){const u=(T-it.kT)/.8;if(u<1){putProp(it,Math.sin(u*Math.PI*6)*3*(1-u));mv=true;}else{putProp(it,0);it.kT=undefined;}}
    if(it.want&&!cur){it.want=false;if(it.faq&&it.faq.open){begin(s,it);mv=true;}continue;}
    if(RM||cur||it.done||it.auto===false)continue;
    if(propIn(it)){if(calm()&&!EC){it.done=true;begin(s,it);}mv=true;}}
  mv=elFrame()||mv;return mv;}
/* pytanie otwarte przez czytelnika: z jego domku wyskakuje postać */
function faq(d){if(!d.open||RM)return;if(EC)elEnd();for(const s of SC)for(const it of s.items)if(it.faq===d){if(cur&&cur!==it){it.want=true;return;}if(!it.run)begin(s,it);return;}}
/* ---------- przedmioty z elementów strony ----------
   Najedź (albo stuknij) kartę, punkt listy albo radę: zza jej krawędzi wysuwa się przedmiot z tematu jej tekstu
   i robi to, o czym tekst mówi (cena – monety spadają na stos, termin – dzwoni budzik, Google – rośnie wykres,
   kontakt – z koperty wychodzi list, uruchomienie – startuje rakieta…). Jedna rzecz naraz, tekst stoi w miejscu. */
const ETX=[['medal',NB+'(?:laureat'+L_+'|finalist'+L_+'|półfinalist'+L_+'|mistrzost'+L_+'|olimpiad'+L_+')'],['start',NB+'(?:uruchom'+L_+'|startuj'+L_+'|w[\\s\\u00a0]sieci|online)'],['telefon',NB+'(?:telefon'+L_+'|mobiln'+L_+'|smartfon'+L_+')'],
  ['czat',NB+'czat'+L_+'[\\s\\u00a0]AI'],['zdjecie',NB+'(?:zdjęci'+L_+'|wygląd'+L_+'|kolor'+L_+'|grafik'+L_+')'],['projekt',NB+'projekt'+L_]].map(([k,s])=>({k,o:new RegExp(s,'iu')}));
const ETOP=[...ETX.slice(0,4),...TEM.map(t=>({k:t.k,o:t.o})),...ETX.slice(4)];
const ETARGET='main .kafel,main .kafel-link,main .lista-siatka>li,main .siatka>li,main aside.rada';
let ELL=null,EC=null;const ELT=[];
function topicsOf(el){if(el.matches('aside.rada'))return ['rada'];
  const hd=el.querySelector('h3,h2,strong,b'),ht=(hd?hd.textContent:'')||'',bt=el.textContent||'',out=[];
  for(const [txt,w] of [[ht,0],[bt,1000]])for(const t of ETOP){const m=txt.match(t.o);if(m&&!out.some(o=>o.k===t.k))out.push({k:t.k,p:w+m.index});}
  out.sort((a,b)=>a.p-b.p);const ks=out.map(o=>o.k);
  if(!ks.length&&/^\s*✓/.test(bt))ks.push('odhacz');return ks;}
function elInit(){const seen=new Set();let prevPar=null,prevK=null;
  for(const el of qa(ETARGET)){if(seen.has(el)||el.closest('nav,.boczna,.okr,.faql,.tylko-duze')||[...seen].some(o=>o.contains(el)))continue;seen.add(el);
    const ks=topicsOf(el);if(!ks.length)continue;const par=el.parentElement;if(par!==prevPar)prevK=null;
    const k=ks.find(x=>x!==prevK)||ks[0];prevPar=par;prevK=k;const it={el,k};ELT.push(it);
    const touchy=e=>!!e&&(e.pointerType==='touch'||e.pointerType==='pen'||(e.type==='click'&&!matchMedia('(hover:hover)').matches));
    el.addEventListener('pointerenter',e=>elGo(it,touchy(e)));el.addEventListener('pointerleave',()=>elLeave(it));el.addEventListener('click',e=>{if(touchy(e))elGo(it,true);});}}
/* miejsce: na górnej krawędzi elementu (po prawej, potem bliżej środka), a gdy nad nią jest tekst – przy prawej albo lewej krawędzi */
function elWhere(it){const r=dR(it.el);if(!r.w)return null;const k0=kk()*(narrow()?.95:1.25);
  for(const s of [k0,k0*.82,k0*.66]){
    for(const x of [r.r-42*s,r.r-96*s,r.cx+30*s,r.l+110*s]){const bx={l:x-31*s,r:x+31*s,t:r.t-64*s,b:r.t-1};if(bx.l<4||bx.r>api.DW-4||bx.l<r.l-4)continue;if(!hitA(bx))return {mode:'top',x,y:r.t,s,r};}
    for(const sd of [1,-1]){const x=sd>0?r.r+36*s:r.l-36*s,y=Math.min(r.b-6,r.t+66*s),bx={l:x-31*s,r:x+31*s,t:y-62*s,b:y};if(bx.l<4||bx.r>api.DW-4)continue;if(!hitA(bx))return {mode:'side',sd,x,y,s,r};}}
  return null;}
function elClip(p,x,y,w,h){const id='elc'+(++uid),cp=E('clipPath',{id,clipPathUnits:'userSpaceOnUse'},DEFS);E('rect',{x:f1(x),y:f1(y),width:f1(Math.max(1,w)),height:f1(Math.max(1,h))},cp);return gg(p,{'clip-path':`url(#${id})`});}
const eLn=(p,d,col,w,draw)=>E('path',Object.assign({d,fill:'none',stroke:col||OUT,'stroke-width':w||2,'stroke-linecap':'round','stroke-linejoin':'round'},draw?{pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1}:{}),p);
const eDraw=(el,u)=>el.setAttribute('stroke-dashoffset',(1-clamp(u)).toFixed(3));
const eTxt=(p,x,y,size,txt)=>{const e=E('text',{x,y,'text-anchor':'middle','font-family':'Bahnschrift, Arial, sans-serif','font-weight':700,'font-size':size,fill:OUT},p);e.textContent=txt;return e;};
function eGear(p,r,n,col){let d='';for(let k=0;k<n*2;k++){const a=k/(n*2)*Math.PI*2,a2=(k+1)/(n*2)*Math.PI*2,R2=k%2?r*.78:r;d+=`${k?'L':'M'} ${f1(Math.cos(a)*R2)} ${f1(Math.sin(a)*R2)} L ${f1(Math.cos(a2)*R2)} ${f1(Math.sin(a2)*R2)} `;}
  const g=gg(p);E('path',{d:d+'Z',fill:col,stroke:OUT,'stroke-width':1.8,'stroke-linejoin':'round'},g);E('circle',{r:r*.3,fill:'#fff8e6',stroke:OUT,'stroke-width':1.6},g);return g;}
const eStar=(p,r,col)=>E('path',{d:[...Array(10)].map((_,k)=>{const a=-Math.PI/2+k*Math.PI/5,R2=k%2?r*.45:r;return `${k?'L':'M'} ${f1(Math.cos(a)*R2)} ${f1(Math.sin(a)*R2)}`;}).join(' ')+' Z',fill:col||'#ffd23f',class:'o2'},p);
/* rysunki: podstawa na y=0 (krawędź elementu), przedmiot w górę do ok. -60; zwracają act(t) */
const ED={
  skrzynia(m){const cs=[0,1,2].map(()=>{const c=gg(m);E('rect',{x:-14,y:-4,width:28,height:7,rx:2,fill:'#e8a917',stroke:OUT,'stroke-width':1.6},c);E('ellipse',{cx:0,cy:-4,rx:14,ry:4.5,fill:'#ffd23f',stroke:OUT,'stroke-width':1.6},c);op(c,0);return c;});
    return (t,once,sp)=>cs.forEach((c,k)=>{const u=clamp((t-.45-k*.28)/.3),y=-4-k*7;place(c,0,lerp(-70,y,ease.inQ(u)),1);op(c,u>0?1:0);once('c'+k,.75+k*.28,()=>sp(0,y-4,3,['#ffd23f','#fff6b0']));});},
  sejf(m){const sh=eLn(m,'M -9 -24 L -9 -34 A 9 9 0 0 1 9 -34 L 9 -24','#8c8aa3',4.4);E('rect',{x:-15,y:-26,width:30,height:26,rx:4,fill:'#ffd23f',class:'o'},m);
    E('circle',{cx:0,cy:-15,r:3,fill:OUT},m);E('path',{d:'M -1.4 -14 L -2.4 -6 L 2.4 -6 L 1.4 -14 Z',fill:OUT},m);
    return (t,once,sp)=>{const u=ease.inQ(clamp((t-.55)/.25));sh.setAttribute('transform',`translate(0 ${f1(-12*(1-u))}) rotate(${f1(-30*(1-u))} 9 -24)`);once('k',.8,()=>sp(0,-30,7,['#9fe7ff','#ffffff','#ffd23f']));};},
  zegar(m){const b=gg(m);[-11,11].forEach(cx=>E('circle',{cx,cy:-44,r:6,fill:'#ff6b8f',class:'o2'},b));eLn(b,'M -12 -4 L -16 2 M 12 -4 L 16 2',OUT,3);
    E('circle',{cx:0,cy:-26,r:19,fill:'#ffffff',class:'o'},b);const hh=eLn(b,'M 0 -26 L 0 -34',OUT,3),mh=eLn(b,'M 0 -26 L 0 -40',OUT,2.2);E('circle',{cx:0,cy:-26,r:2.2,fill:OUT},b);
    return (t,once,sp)=>{const u=ease.ioS(clamp((t-.45)/1));mh.setAttribute('transform',`rotate(${f1(u*720)} 0 -26)`);hh.setAttribute('transform',`rotate(${f1(u*60)} 0 -26)`);
      b.setAttribute('transform',`rotate(${f1(t>1.45&&t<2?Math.sin(t*60)*7:0)} 0 0)`);once('r',1.5,()=>sp(0,-46,6));};},
  wieza(m){const bs=[[-18,16,'#c9b6ff'],[-4,28,'#7cf2c8'],[10,44,'#ffd23f']].map(([x,h,c])=>({r:E('rect',{x,y:0,width:11,height:0,rx:2,fill:c,class:'o2'},m),h}));
    E('path',{d:'M -24 0 L 26 0',stroke:OUT,'stroke-width':2.4},m);const ar=eLn(m,'M -22 -14 L -8 -26 L 4 -22 L 20 -50',OUT,2.6,true),hd=E('path',{d:'M 20 -50 L 12 -48 M 20 -50 L 21 -42',fill:'none',stroke:OUT,'stroke-width':2.6,'stroke-linecap':'round',opacity:0},m);
    return (t,once,sp)=>{bs.forEach((b,k)=>{const u=ease.outBack(clamp((t-.45-k*.22)/.35));b.r.setAttribute('y',f1(-b.h*u));b.r.setAttribute('height',f1(Math.max(0,b.h*u)));});
      const a=clamp((t-1.15)/.4);eDraw(ar,a);hd.setAttribute('opacity',a>=1?1:0);once('s',1.55,()=>sp(20,-50,7));};},
  domek(m){E('rect',{x:13,y:-50,width:7,height:14,fill:'#b5804f',class:'o2'},m);E('rect',{x:-18,y:-28,width:36,height:28,fill:'#fff3d6',class:'o'},m);E('path',{d:'M -25 -26 L 0 -48 L 25 -26 Z',fill:'#e8343f',class:'o'},m);
    E('rect',{x:-13,y:-16,width:9,height:16,rx:1,fill:'#b5804f',class:'o2'},m);const w=E('rect',{x:4,y:-21,width:10,height:9,fill:'#2b2140',class:'o2'},m);
    const pf=[0,1,2].map(()=>E('circle',{r:3,fill:'#ffffff',stroke:OUT,'stroke-width':1.3,opacity:0},m));
    return (t,once,sp)=>{w.setAttribute('fill',t>.6?'#ffd23f':'#2b2140');once('l',.6,()=>sp(9,-17,5));
      pf.forEach((c,k)=>{const u=clamp((t-.75-k*.3)/.9);c.setAttribute('cx',f1(17+u*6));c.setAttribute('cy',f1(-52-u*22));c.setAttribute('r',f1(3+u*4));c.setAttribute('opacity',(u>0?1-u:0).toFixed(2));});};},
  poczta(m){const lt=gg(m);E('rect',{x:-16,y:-28,width:32,height:26,rx:2,fill:'#ffffff',class:'o2'},lt);[-22,-16,-10].forEach((y,k)=>E('rect',{x:-11,y,width:k===2?14:22,height:3,rx:1.5,fill:'#6a3fd6'},lt));
    E('rect',{x:-22,y:-30,width:44,height:30,rx:3,fill:'#ffffff',class:'o'},m);eLn(m,'M -22 0 L -4 -14 M 22 0 L 4 -14','#c9c3dc',1.6);
    const fl=E('path',{d:'M -22 -30 L 0 -13 L 22 -30 Z',fill:'#ffe9a8',class:'o2'},m);E('circle',{cx:0,cy:-14,r:3.6,fill:'#e8343f'},m);
    return (t,once,sp)=>{const a=ease.ioS(clamp((t-.45)/.3));fl.setAttribute('transform',`translate(0 -30) scale(1 ${f1(1-2*a)}) translate(0 30)`);
      const u=ease.outBack(clamp((t-.8)/.4));lt.setAttribute('transform',`translate(0 ${f1(-u*24)})`);if(t<.8)op(lt,0);else op(lt,1);
      if(a<.5)m.appendChild(fl);else m.insertBefore(fl,lt);once('s',1.2,()=>sp(0,-52,7));};},
  prezent(m){const st=gg(m);eStar(st,9);op(st,0);E('rect',{x:-18,y:-28,width:36,height:28,rx:2,fill:'#6fd36b',class:'o'},m);E('rect',{x:-4,y:-28,width:8,height:28,fill:'#ffd23f'},m);
    const lid=gg(m);E('rect',{x:-21,y:-37,width:42,height:10,rx:2,fill:'#5bc35a',class:'o'},lid);E('rect',{x:-4,y:-37,width:8,height:10,fill:'#ffd23f'},lid);E('path',{d:'M 0 -37 C -10 -48 -18 -38 -8 -36 Z M 0 -37 C 10 -48 18 -38 8 -36 Z',fill:'#ffd23f',class:'o2'},lid);
    return (t,once,sp)=>{const u=clamp((t-.55)/.45);lid.setAttribute('transform',`translate(${f1(u*20)} ${f1(-Math.sin(u*Math.PI)*20+u*24)}) rotate(${f1(u*70)} 21 -32)`);op(lid,1-clamp((u-.6)/.4));
      const k=ease.outBack(clamp((t-.7)/.4));place(st,0,lerp(-24,-50,k),Math.max(.001,k),t*90);op(st,t>.7?1:0);once('s',.95,()=>sp(0,-50,8));};},
  puchar(m){const ss=[[-18,-16],[0,-26],[18,-16]].map(([x,y])=>{const g=gg(m);eStar(g,10);return {g,x,y};});E('path',{d:'M -26 0 L 26 0',stroke:OUT,'stroke-width':2.4},m);
    return (t,once,sp)=>ss.forEach((s2,k)=>{const u=ease.outBack(clamp((t-.45-k*.25)/.3));place(s2.g,s2.x,s2.y,Math.max(.001,u),(1-clamp(u))*-90);once('s'+k,.7+k*.25,()=>sp(s2.x,s2.y,3));});},
  narzedzia(m){const g1=gg(m),g2=gg(m);eGear(g1,16,8,'#c9b6ff');eGear(g2,11,6,'#ffd23f');
    return (t,once,sp)=>{const a=clamp((t-.4)/1.4)*360;place(g1,-8,-20,1,a);place(g2,16,-36,1,-a*1.45+15);once('s',1.8,()=>sp(4,-30,5));};},
  ksiega(m){E('rect',{x:-21,y:-58,width:42,height:58,rx:3,fill:'#ffffff',class:'o'},m);E('rect',{x:-21,y:-58,width:42,height:7,fill:'#c9b6ff'},m);
    const ls=[-44,-35,-26,-17].map((y,k)=>eLn(m,`M -14 ${y} L ${k===3?4:14} ${y}`,'#6a3fd6',2.6,true));
    const pen=gg(m);E('path',{d:'M 0 0 L -4 -7 L -4 -32 L 4 -32 L 4 -7 Z',fill:'#ffd23f',class:'o2'},pen);E('path',{d:'M 0 0 L -1.6 -3 L 1.6 -3 Z',fill:OUT},pen);
    return (t,once,sp)=>{let px=14,py=-44;ls.forEach((l,k)=>{const u=clamp((t-.45-k*.3)/.28);eDraw(l,u);if(t>=.45+k*.3){px=lerp(-14,k===3?4:14,u);py=-44+k*9;}});
      place(pen,px,py-1,1,28+(t>.45&&t<1.7?Math.sin(t*30)*5:0));op(pen,t<1.85?1:0);once('s',1.75,()=>sp(0,-30,5));};},
  start(m){const rk=gg(m);const fl=E('path',{d:'M -7 -1 Q 0 24 7 -1 Z',fill:'#ffd23f',class:'o2'},rk);E('path',{d:'M -13 -14 L -22 4 L -12 -2 Z M 13 -14 L 22 4 L 12 -2 Z',fill:'#ff6b8f',class:'o2'},rk);
    E('path',{d:'M 0 -56 Q 16 -38 13 -2 L -13 -2 Q -16 -38 0 -56 Z',fill:'#ffffff',class:'o'},rk);E('circle',{cx:0,cy:-30,r:6,fill:'#9fe7ff',class:'o2'},rk);
    return (t,once,sp)=>{const ig=clamp((t-.5)/.5),la=clamp((t-1)/.6);place(rk,0,-ease.inQ(la)*56,1,t>.5&&t<1.05?Math.sin(t*60)*2:0);
      fl.setAttribute('transform',`scale(1 ${f1(t>.5?.6+ig*.5+Math.sin(t*40)*.15:0)})`);op(rk,1-clamp((la-.6)/.4));once('s',1.45,()=>sp(0,-80,7));};},
  telefon(m){const ph=gg(m);E('rect',{x:-13,y:-50,width:26,height:50,rx:4,fill:'#2d2650',class:'o'},ph);const sc=E('rect',{x:-10,y:-44,width:20,height:36,rx:1.5,fill:'#3b3366'},ph);
    const ui=gg(ph);E('rect',{x:-10,y:-44,width:20,height:6,fill:'#6a3fd6'},ui);E('rect',{x:-7,y:-35,width:14,height:10,fill:'#6fd36b'},ui);[-22,-18].forEach(y=>E('rect',{x:-7,y,width:14,height:2.4,rx:1,fill:'#3d3358'},ui));E('rect',{x:-7,y:-13,width:9,height:3.4,rx:1.5,fill:'#ffd23f'},ui);
    E('circle',{cx:0,cy:-4,r:1.6,fill:'#8c8aa3'},ph);
    return (t,once,sp)=>{const v=t>.45&&t<.75?Math.sin(t*90)*1.6:0;ph.setAttribute('transform',`translate(${f1(v)} 0)`);sc.setAttribute('fill',t>.75?'#ffffff':'#3b3366');op(ui,t>.75?1:0);once('s',.8,()=>sp(0,-28,6,['#9fe7ff','#ffffff','#ffd23f']));};},
  czat(m){const b=gg(m);E('path',{d:'M -24 -50 L 24 -50 Q 28 -50 28 -46 L 28 -20 Q 28 -16 24 -16 L -4 -16 L -14 -6 L -12 -16 L -24 -16 Q -28 -16 -28 -20 L -28 -46 Q -28 -50 -24 -50 Z',fill:'#ffffff',class:'o'},b);
    const ds=[-10,0,10].map(x=>E('circle',{cx:x,cy:-33,r:3,fill:'#8c8aa3'},b));const hs=gg(b);eStar(hs,9);
    return (t,once,sp)=>{const typing=t>.45&&t<1.45;ds.forEach((d,k)=>{d.setAttribute('cy',f1(-33-(typing?Math.max(0,Math.sin(t*12-k*1.2))*4:0)));op(d,t<1.45?1:0);});
      const k=ease.outBack(clamp((t-1.45)/.35));place(hs,0,-33,Math.max(.001,k));once('s',1.6,()=>sp(0,-33,6));};},
  zdjecie(m){const ph=gg(m);E('rect',{x:-13,y:-50,width:26,height:30,rx:2,fill:'#ffffff',class:'o2'},ph);E('rect',{x:-10,y:-47,width:20,height:18,fill:'#9fe7ff'},ph);E('path',{d:'M -10 -29 L -4 -36 L 2 -31 L 6 -35 L 10 -29 Z',fill:'#6fd36b'},ph);
    E('rect',{x:-22,y:-30,width:44,height:30,rx:4,fill:'#8c8aa3',class:'o'},m);E('rect',{x:-16,y:-35,width:10,height:6,rx:1.5,fill:'#5d5a73',class:'o2'},m);E('circle',{cx:2,cy:-15,r:10,fill:'#2d2650',class:'o2'},m);E('circle',{cx:2,cy:-15,r:5,fill:'#9fe7ff'},m);
    const fl=E('circle',{cx:-11,cy:-38,r:4,fill:'#fff6b0',opacity:0},m);
    return (t,once,sp)=>{const f=clamp((t-.6)/.35);fl.setAttribute('r',f1(4+f*22));fl.setAttribute('opacity',(f>0?1-f:0).toFixed(2));once('f',.6,()=>sp(-11,-38,6,['#ffffff','#fff6b0']));
      const u=ease.outBack(clamp((t-.95)/.45));ph.setAttribute('transform',`translate(0 ${f1(20-u*20)})`);op(ph,t>.95?1:0);};},
  projekt(m){E('rect',{x:-30,y:-56,width:60,height:56,rx:4,fill:'#ffffff',class:'o'},m);E('rect',{x:-30,y:-56,width:60,height:7,fill:'#e6e0f2'},m);
    E('rect',{x:-24,y:-44,width:48,height:9,rx:2,fill:'#cfcadb'},m);const hd=E('rect',{x:-24,y:-44,width:0,height:9,rx:2,fill:'#6a3fd6'},m);
    E('rect',{x:-24,y:-31,width:20,height:20,rx:2,fill:'#9fe7ff'},m);[-29,-23].forEach(y=>E('rect',{x:0,y,width:22,height:3,rx:1.5,fill:'#cfcadb'},m));E('rect',{x:0,y:-15,width:20,height:6,rx:3,fill:'#cfcadb'},m);
    const bt=E('rect',{x:0,y:-15,width:0,height:6,rx:3,fill:'#ffd23f'},m);const br=gg(m);E('path',{d:'M 0 -12 L 0 -34',stroke:'#b5804f','stroke-width':4,'stroke-linecap':'round'},br);const bri=E('path',{d:'M -4 -9 L 4 -9 L 3 0 L -3 0 Z',fill:'#6a3fd6',class:'o2'},br);
    return (t,once,sp)=>{const u1=ease.ioS(clamp((t-.45)/.55)),u2=ease.ioS(clamp((t-1.15)/.4));hd.setAttribute('width',f1(48*u1));bt.setAttribute('width',f1(20*u2));
      let bx=-24,by=-40;if(t>=.45&&t<1.15)bx=lerp(-24,24,u1);else if(t>=1.15){bx=lerp(0,20,u2);by=-12;}bri.setAttribute('fill',t<1.1?'#6a3fd6':'#ffd23f');
      place(br,bx,by,1,t>.4&&t<1.6?Math.sin(t*22)*12:0);op(br,t<1.7?1:0);once('s',1.65,()=>sp(0,-30,7));};},
  odhacz(m){E('rect',{x:-20,y:-56,width:40,height:56,rx:3,fill:'#ffffff',class:'o'},m);E('rect',{x:-8,y:-60,width:16,height:7,rx:2,fill:'#b5804f',class:'o2'},m);
    const cs=[-44,-30,-16].map(y=>{E('rect',{x:-13,y:y-4,width:8,height:8,rx:1.5,fill:'#fff8e6',stroke:OUT,'stroke-width':1.4},m);E('rect',{x:-1,y:y-1.4,width:14,height:2.8,rx:1.4,fill:'#c9c3dc'},m);return eLn(m,`M -12 ${y} L -9 ${y+3} L -4 ${y-5}`,'#2f9e44',2.4,true);});
    return (t,once,sp)=>cs.forEach((c,k)=>{eDraw(c,clamp((t-.5-k*.3)/.2));once('c'+k,.7+k*.3,()=>sp(-9,[-44,-30,-16][k],3,['#6fd36b','#ffffff']));});},
  medal(m){const md=gg(m);E('path',{d:'M -12 -60 L -3 -60 L 3 -26 L -5 -26 Z',fill:'#e8343f',class:'o2'},md);E('path',{d:'M 12 -60 L 3 -60 L -3 -26 L 5 -26 Z',fill:'#2f5fd0',class:'o2'},md);
    E('circle',{cx:0,cy:-16,r:14,fill:'#ffd23f',class:'o'},md);eStar(md,7,'#fff6b0').setAttribute('transform','translate(0 -16)');
    return (t,once,sp)=>{md.setAttribute('transform',`rotate(${f1(t>.4?Math.sin((t-.4)*5.5)*16*Math.exp(-(t-.4)*1.5):0)} 0 -60)`);once('s',.6,()=>sp(0,-16,7));};},
  rada(m){const ry=gg(m);for(let k=0;k<8;k++){const a=k*Math.PI/4;eLn(ry,`M ${f1(Math.cos(a)*19)} ${f1(-32+Math.sin(a)*19)} L ${f1(Math.cos(a)*25)} ${f1(-32+Math.sin(a)*25)}`,'#f5a623',2.6);}op(ry,0);
    const bl=E('circle',{cx:0,cy:-32,r:14,fill:'#fff6dc',class:'o'},m);E('rect',{x:-7,y:-17,width:14,height:12,rx:2,fill:'#b9b3cc',class:'o2'},m);eLn(m,'M -4 -30 Q 0 -38 4 -30',OUT,1.8);
    return (t,once,sp)=>{const on=t>.6;bl.setAttribute('fill',on?'#ffd23f':'#fff6dc');op(ry,on?.6+.4*Math.abs(Math.sin(t*5)):0);once('s',.6,()=>sp(0,-32,7));};}
};
function elGo(it,auto){if(RM||!ELL)return;if(cur)return;                         /* scena z rekwizytem trwa – nie wchodzimy jej w drogę */
  if(EC&&EC.it===it){EC.leaveT=auto?api.T:0;api.kick(auto?3.5:.3);return;}
  if(EC)elEnd();const w=elWhere(it);if(!w)return;const s=w.s,g=gg(ELL);let cg;
  if(w.mode==='top')cg=elClip(g,w.r.l-60,w.y-320,w.r.w+120,320);else cg=w.sd>0?elClip(g,w.r.r+1,w.y-200,320,260):elClip(g,w.r.l-321,w.y-200,320,260);
  const m=gg(cg);setsw(m,OUTL/s);const act=ED[it.k](m);
  EC={it,g,m,act,w,t0:api.T,leaveT:auto?api.T:0,fx:{}};place(m,w.x,w.y+400,s);api.kick(auto?3.5:2.4);}
function elLeave(it){if(EC&&EC.it===it&&!EC.leaveT){EC.leaveT=api.T;api.kick(3);}}
function elEnd(){if(EC){EC.g.remove();EC=null;}}
function elFrame(){if(!EC)return false;const c=EC,w=c.w,t=api.T-c.t0,s=w.s,fs=c.leaveT?Math.max(c.leaveT+1,c.t0+2.4):1e9,fade=clamp((t+c.t0-fs)/.35);
  const hid=(w.mode==='top'?70:-w.sd*72)*s,k=hid*(1-ease.outBack(clamp(t/.4)))+hid*ease.inQ(fade);
  if(w.mode==='top')place(c.m,w.x,w.y+k,s);else place(c.m,w.x+k,w.y,s);
  const once=(key,u,fn)=>{if(t>=u&&!c.fx[key]){c.fx[key]=1;fn();}};
  c.act(t,once,(lx,ly,n,cols)=>api.sparkles(w.x+lx*s+(w.mode==='top'?0:k),w.y+ly*s+(w.mode==='top'?k:0),n,.4*s,cols));
  if(fade>=1){elEnd();return false;}return t<2.2||!!c.leaveT;}
init();elInit();
return {frame,onBuild,faq,hover(){},ticked(){},get SC(){return SC;},get played(){return played;},get cur(){return cur;},get EC(){return EC;},busy(){return !!cur||!!EC;}};};
