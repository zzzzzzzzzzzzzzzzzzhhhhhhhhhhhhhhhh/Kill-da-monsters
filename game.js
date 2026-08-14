const game=document.querySelector('#game'),
startScreen=document.querySelector('#startScreen'),
gameOver=document.querySelector('#gameOver'),
start=document.querySelector('#start'),
restart=document.querySelector('#restart');

let health=100, armor=0, ammo=12, kills=0, wave=1, coins=0;
let playing=false, reloading=false, monsters=[], gun=0;

const guns=[
  ['RANGER PISTOL',12,1,0],
  ['MONSTER SMG',30,1,100],
  ['DOOM SHOTGUN',6,3,150],
  ['PHANTOM RIFLE',20,2,200],
  ['THUNDER CANNON',4,6,300],
  ['VOID LASER',18,3,400],
  ['SKULL MINIGUN',60,1,500],
  ['PLASMA BLASTER',10,8,650],
  ['FROST SMG',36,2,750],
  ['INFERNO SHOTGUN',8,5,850],
  ['RAIL RIFLE',5,10,1000],
  ['GRAVITY LAUNCHER',3,12,1200],
  ['ARC CANNON',12,7,1400],
  ['NOVA RIFLE',24,5,1600],
  ['TITAN MINIGUN',80,2,2000],
  ['SINGULARITY GUN',2,25,2500]
];

const gunKeys=[
  '1','2','3','4','5','6','7','8',
  'q','w','e','t','y','u','i','o'
];

let owned=[
  true,false,false,false,
  false,false,false,false,
  false,false,false,false,
  false,false,false,false
];

const keys={};

document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  keys[k]=true;

  if(k==='r') reload();
  if(k==='b') buyArmor();

  const index=gunKeys.indexOf(k);

  if(index>=0){
    switchGun(index);
  }
});

document.addEventListener('keyup',e=>{
  keys[e.key.toLowerCase()]=false;
});

start.onclick=begin;
restart.onclick=begin;

game.addEventListener('mousedown',e=>{
  if(playing && !e.target.closest('button')){
    shoot();
  }
});

function switchGun(i){

  if(!playing || reloading) return;

  if(owned[i]){
    gun=i;
    ammo=guns[gun][1];

    document.querySelector('#message').textContent=
      'EQUIPPED: '+guns[i][0];

    update();
    return;
  }

  const price=guns[i][3];

  if(coins>=price){

    coins-=price;
    owned[i]=true;
    gun=i;
    ammo=guns[gun][1];

    document.querySelector('#message').textContent=
      'PURCHASED: '+guns[i][0];

    update();

  }else{

    document.querySelector('#message').textContent=
      'LOCKED: '+guns[i][0]+' - NEED '+price+' COINS';

    update();
  }
}

function begin(){

  health=100;
  armor=0;
  ammo=12;
  kills=0;
  wave=1;
  coins=0;
  gun=0;

  owned=[
    true,false,false,false,
    false,false,false,false,
    false,false,false,false,
    false,false,false,false
  ];

  playing=true;
  reloading=false;

  startScreen.classList.add('hidden');
  gameOver.classList.add('hidden');

  monsters.forEach(m=>m.el.remove());
  monsters=[];

  spawnWave();
  update();
}

function spawnWave(){

  const count=wave+2;

  for(let i=0;i<count;i++){
    spawnMonster(i===count-1 && wave%5===0);
  }
}

function spawnMonster(boss=false){

  const el=document.createElement('div');

  el.className='monster'+(boss?' boss':'');

  el.innerHTML=
    '<div class="head">'+
      '<i class="eye a"></i>'+
      '<i class="eye b"></i>'+
    '</div>'+
    '<div class="body"></div>'+
    '<div class="arm a"></div>'+
    '<div class="arm b"></div>';

  const x=8+Math.random()*84;
  const y=18+Math.random()*60;

  el.style.left=x+'vw';
  el.style.top=y+'vh';

  game.appendChild(el);

  monsters.push({
    el,
    x,
    y,
    hp:boss?18:2+Math.floor(wave/2),
    speed:boss?.008:.015+Math.random()*.025,
    boss
  });
}

function shoot(){

  if(reloading || ammo<=0) return;

  ammo--;

  const muzzle=document.createElement('div');

  muzzle.className='muzzle';

  game.appendChild(muzzle);

  setTimeout(()=>{
    muzzle.remove();
  },90);

  const alive=monsters.filter(m=>m.hp>0);

  if(alive.length){

    const target=
      alive[Math.floor(Math.random()*alive.length)];

    target.hp-=guns[gun][2];

    target.el.classList.add('hit');

    setTimeout(()=>{
      target.el.classList.remove('hit');
    },100);

    if(target.hp<=0){

      target.el.remove();

      monsters=monsters.filter(m=>m!==target);

      kills++;

      // Normal monster = 5 coins
      // Boss = 50 coins
      coins+=target.boss?50:5;
    }
  }

  if(ammo===0){
    reload();
  }

  update();
}

function reload(){

  if(reloading || ammo===guns[gun][1]) return;

  reloading=true;

  document.querySelector('#message').textContent=
    'RELOADING...';

  setTimeout(()=>{

    ammo=guns[gun][1];

    reloading=false;

    update();

  },900);
}

function buyArmor(){

  if(!playing || coins<50) return;

  coins-=50;

  armor=Math.min(100,armor+25);

  document.querySelector('#message').textContent=
    'ARMOR PURCHASED!';

  update();
}

function update(){

  const healthEl=document.querySelector('#health');
  const healthBar=document.querySelector('#healthBar');
  const armorBar=document.querySelector('#armorBar');
  const weaponName=document.querySelector('#weaponName');
  const reserve=document.querySelector('#reserve');
  const streak=document.querySelector('#streakCount');
  const coinEl=document.querySelector('#coins');

  if(healthEl)
    healthEl.textContent=Math.max(0,health);

  if(healthBar)
    healthBar.style.width=Math.max(0,health)+'%';

  if(armorBar)
    armorBar.style.width=armor+'%';

  if(document.querySelector('#armor'))
    document.querySelector('#armor').textContent=armor;

  if(document.querySelector('#ammo'))
    document.querySelector('#ammo').textContent=ammo;

  if(document.querySelector('#kills'))
    document.querySelector('#kills').textContent=kills;

  if(document.querySelector('#wave'))
    document.querySelector('#wave').textContent=wave;

  if(coinEl)
    coinEl.textContent=coins;

  if(weaponName)
    weaponName.textContent=guns[gun][0];

  if(reserve)
    reserve.textContent=guns[gun][1]*5;

  if(streak)
    streak.textContent=kills;

  if(!playing) return;

  if(monsters.length===0){
    wave++;
    spawnWave();
  }

  monsters.forEach(m=>{

    const dx=50-m.x;
    const dy=50-m.y;
    const dist=Math.hypot(dx,dy);

    if(dist>8){

      m.x+=dx/dist*m.speed;
      m.y+=dy/dist*m.speed;

      m.el.style.left=m.x+'vw';
      m.el.style.top=m.y+'vh';

    }else if(Math.random()<.025){

      const damage=m.boss?10:5;

      if(armor>0)
        armor=Math.max(0,armor-damage);
      else
        health-=damage;

      if(health<=0)
        endGame();
    }
  });

  if(reloading){

    document.querySelector('#message').textContent=
      'RELOADING...';

  }else{

    document.querySelector('#message').textContent=
      guns[gun][0];
  }
}

function endGame(){

  playing=false;

  document.querySelector('#finalKills').textContent=kills;

  gameOver.classList.remove('hidden');
}

setInterval(()=>{
  if(playing)
    update();
},40);
