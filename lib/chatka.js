'use strict';
/* Chatka na kurzej stopce z klipu „Baba Jaga” — rysunek przepisany 1:1 z babajaga.js (bez neonu).
   Stara chatka z łatami (patch) + nowa chatka odsłaniana kołami w clipPath. Układ: (0,0) = spód chatki. */
function chatka(p,defs,id){const H={};const g=E('g',{},p);H.g=g;
  H.legL=limb(g,30,'#ffc93c');H.legR=limb(g,30,'#ffc93c');
  H.footL=E('path',{class:'ln',style:'stroke:#ffc93c;stroke-width:14px'},g);H.footR=E('path',{class:'ln',style:'stroke:#ffc93c;stroke-width:14px'},g);
  const hut=E('g',{},g);H.hut=hut;H.smk=[];for(let i=0;i<3;i++)H.smk.push(puff(hut,'#d9cdea'));
  E('rect',{x:110,y:-640,width:70,height:170,fill:'#8a6a5a',class:'o',transform:'rotate(6 145 -560)'},hut);
  E('rect',{x:-240,y:-420,width:480,height:420,fill:'#b07a52',class:'o'},hut);
  for(let i=1;i<8;i++)E('path',{d:`M -240 ${-i*52} L 240 ${-i*52}`,class:'ln',style:'stroke:#7a5236'},hut);
  for(let i=0;i<8;i++)for(const s of [-1,1])E('circle',{cx:s*248,cy:-26-i*52,r:20,fill:'#d9a066',class:'o2'},hut);
  E('path',{d:'M -310 -396 L 0 -650 L 310 -396 Z',fill:'#8a6a48',class:'o'},hut);
  for(let i=1;i<4;i++)E('path',{d:`M ${-310+i*62} ${-396-i*50} L ${310-i*62} ${-396-i*50}`,class:'ln'},hut);
  E('rect',{x:-180,y:-310,width:130,height:120,fill:'#ffd36b',class:'o'},hut);E('path',{d:'M -115 -310 L -115 -190 M -180 -250 L -50 -250',class:'ln'},hut);
  E('rect',{x:-250,y:-300,width:60,height:110,fill:'#6b8a5a',class:'o',transform:'rotate(-14 -220 -300)'},hut);
  E('path',{d:'M 40 0 L 40 -180 Q 95 -240 150 -180 L 150 0 Z',fill:'#6b4a3a',class:'o'},hut);E('circle',{cx:130,cy:-90,r:8,fill:'#ffd23f'},hut);
  E('path',{d:'M 80 -40 L 96 -90 L 84 -130',class:'ln'},hut);
  const cp=E('clipPath',{id},defs);H.clipC=[];for(let i=0;i<3;i++)H.clipC.push(E('circle',{r:0},cp));
  const hutIn=E('g',{'clip-path':`url(#${id})`},hut);H.hutIn=hutIn;
  E('rect',{x:-252,y:-424,width:504,height:428,rx:8,fill:'#f2ecff',class:'o'},hutIn);
  for(let i=1;i<5;i++)E('path',{d:`M ${-252+i*100.8} -420 L ${-252+i*100.8} 0`,class:'ln',style:'stroke:#c9b6ff'},hutIn);
  E('path',{d:'M -322 -392 L 0 -662 L 322 -392 Z',fill:'#6a3fd6',class:'o'},hutIn);
  E('rect',{x:-200,y:-330,width:190,height:170,rx:16,fill:'#9fe7ff',class:'o'},hutIn);E('path',{d:'M -180 -200 L -110 -310 M -150 -180 L -60 -320',stroke:'#ffffff','stroke-width':12,'stroke-linecap':'round'},hutIn);
  E('rect',{x:40,y:-210,width:120,height:210,rx:14,fill:'#ff9ab8',class:'o'},hutIn);E('circle',{cx:138,cy:-100,r:9,fill:'#ffd23f',class:'o2'},hutIn);
  H.lights=[];for(let i=0;i<9;i++)H.lights.push(E('circle',{cx:-230+i*57,cy:-412+Math.sin(i/8*Math.PI)*16,r:11,fill:'#fff3a0',class:'o2'},hutIn));
  H.patches=[];for(const [k,x,y,r] of [['plank',-110,-110,0],['aid',-130,-520,28],['cloth',170,-330,8],['tape',-115,-250,0],['bucket',150,-660,180],['aid',90,-470,-18]])H.patches.push(patch(hut,k,x,y,r));
  H.legL([-90,-6],[-130,150],-30);H.legR([90,-6],[130,150],30);
  H.footL.setAttribute('d','M -130 150 l -44 16 M -130 150 l 0 32 M -130 150 l 44 16');H.footR.setAttribute('d','M 130 150 l -44 16 M 130 150 l 0 32 M 130 150 l 44 16');
  return H;}
