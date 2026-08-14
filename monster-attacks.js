(()=>{
'use strict';
const style=document.createElement('style');style.textContent='.monster-attacking{animation:monsterAttack .18s ease-in-out}.monster.boss.monster-attacking{filter:brightness(1.35) drop-shadow(0 0 10px #ff7b4d)}@keyframes monsterAttack{50%{transform:scale(1.12) translateY(-4px)}}';document.head.appendChild(style);
let lastAttack=0;
function attackTick(){
  if(typeof playing==='undefined'||!playing||typeof monsters==='undefined')return;
  const now=Date.now();
  if(now-lastAttack<250)return;
  for(const m of monsters.slice()){
    if(!m||!m.el||!m.el.isConnected)continue;
    const dx=50-m.x,dy=55-m.y,d=Math.hypot(dx,dy)||1;
    if(d<=10){
      if(m.attackReady&&now<m.attackReady)continue;
      const dmg=m.damage||(m.boss?12:5);
      if(typeof armor!=='undefined'&&armor>0)armor=Math.max(0,armor-dmg);
      else if(typeof health!=='undefined')health=Math.max(0,health-dmg);
      m.attackReady=now+(m.boss?800:1250+Math.random()*700);
      m.el.classList.add('monster-attacking');
      setTimeout(()=>m.el&&m.el.classList.remove('monster-attacking'),180);
      if(typeof beep==='function')beep('hit');
      if(typeof hud==='function')hud();
      if(typeof health!=='undefined'&&health<=0&&typeof end==='function')end();
      lastAttack=now;
      break;
    }
  }
}
setInterval(attackTick,100);
})();