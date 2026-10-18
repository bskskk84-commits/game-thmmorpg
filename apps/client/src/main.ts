import Phaser from 'phaser';
import { Client, Room } from 'colyseus.js';
import { WORLD, OBSTACLES, type Avatar } from '@siam/shared';
import './style.css';
const $=(id:string)=>document.getElementById(id)!;
const status=(s:string)=>{ $('status').textContent=s; };
const endpoint=import.meta.env.VITE_GAME_SERVER_URL || `${location.protocol==='https:'?'wss':'ws'}://${location.hostname}:2567`;
const client=new Client(endpoint);
let room:Room|undefined, players:Avatar[]=[], mySession='', active=false, connecting=false;
const rejected:string[]=[];
function attach(next:Room) {
  room=next;mySession=next.sessionId;active=true;
  sessionStorage.setItem('siam.reconnect',next.reconnectionToken);
  status('● เชื่อมต่อแล้ว · นครอรุณ');
  next.onStateChange((state:any)=>{
    players=[];
    state.players.forEach((p:any,key:string)=>players.push({id:key,name:p.name,x:p.x,y:p.y,facing:p.facing,connected:p.connected}));
    $('count').textContent=String(players.filter(p=>p.connected).length);
    $('players').replaceChildren(...players.map(p=>{const li=document.createElement('li');li.textContent=`${p.id===mySession?'◆':'◇'} ${p.name} ${p.connected?'':'(หลุด)'}`;return li;}));
  });
  next.onMessage('rejected',(message:string)=>{rejected.push(message);$('notice').textContent=message;});
  next.onLeave(()=>{ if(room!==next)return;active=false;status('การเชื่อมต่อหลุด · กำลังเชื่อมต่อใหม่…');void reconnect(next.reconnectionToken); });
}
async function reconnect(token:string) {
  if(connecting)return;connecting=true;
  const end=Date.now()+18000;
  while(Date.now()<end) {
    try {attach(await client.reconnect(token));status('● เชื่อมต่อใหม่สำเร็จ · ตัวละครเดิม');connecting=false;return;}
    catch {await new Promise(r=>setTimeout(r,700));}
  }
  connecting=false;sessionStorage.removeItem('siam.reconnect');status('เชื่อมต่อใหม่ไม่สำเร็จ · หมดเวลารอ');$('retry').hidden=false;
}
async function join() {
  $('retry').hidden=true;status('กำลังเชื่อมต่อ…');
  try {attach(await client.joinOrCreate('town'));}
  catch {status('เชื่อมต่อไม่ได้ · ตรวจสอบ game server');$('retry').hidden=false;}
}
$('retry').onclick=()=>void join();
$('disconnect').onclick=()=>room?.connection.close();
window.addEventListener('blur',()=>{if(active)room?.send('move',{dx:0,dy:0});});
class Town extends Phaser.Scene {
  private avatars=new Map<string,Phaser.GameObjects.Container>();
  private keys!:Record<string,Phaser.Input.Keyboard.Key>;
  private sent=0;
  create() {
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as typeof this.keys;
    const g=this.add.graphics();
    g.fillStyle(0x7f965b);g.fillRect(0,0,WORLD.width,WORLD.height);
    // Repeatable ground detail, no external artwork required.
    for(let i=0;i<450;i++){const x=(i*73)%1280,y=(i*131)%800;g.fillStyle(i%3?0x91a66b:0x6e854e,.45);g.fillEllipse(x,y,5+i%7,3);}
    g.fillStyle(0xc4b284);g.fillRect(0,400,1280,96);g.fillRect(700,0,94,800);
    g.lineStyle(1,0xe1cca0,.3);for(let x=0;x<1280;x+=44)g.strokeRect(x,408,42,78);
    OBSTACLES.forEach(o=>{
      g.fillStyle(0x243f30,.35);g.fillRoundedRect(o.x+12,o.y+15,o.w,o.h,12);
      if(o.kind==='pond'){g.fillStyle(0xb7bc83);g.fillRoundedRect(o.x,o.y,o.w,o.h,30);g.fillStyle(0x5d9290);g.fillRoundedRect(o.x+8,o.y+8,o.w-16,o.h-16,25);g.fillStyle(0xaac781);g.fillEllipse(o.x+40,o.y+40,24,13);}
      else if(o.kind==='garden'){g.fillStyle(0x4b7147);g.fillRoundedRect(o.x,o.y,o.w,o.h,20);for(let i=0;i<8;i++){g.fillStyle(0xabc380);g.fillCircle(o.x+25+(i%4)*32,o.y+30+Math.floor(i/4)*48,19);}}
      else {
        g.fillStyle(0xe8d5a6);g.fillRect(o.x,o.y,o.w,o.h);g.fillStyle(0x9a513b);g.fillTriangle(o.x-15,o.y+40,o.x+o.w/2,o.y-40,o.x+o.w+15,o.y+40);
        g.lineStyle(5,0xe4be69);g.lineBetween(o.x-15,o.y+40,o.x+o.w/2,o.y-40);g.lineBetween(o.x+o.w/2,o.y-40,o.x+o.w+15,o.y+40);
        g.fillStyle(0x5c5037);g.fillRect(o.x+o.w/2-20,o.y+65,40,o.h-65);
        for(let x=o.x+20;x<o.x+o.w;x+=65){g.fillStyle(0xc09850);g.fillRect(x,o.y+50,10,o.h-50);}
      }
    });
    this.add.text(540,215,'วัดอรุณรัตน์',{fontFamily:'Tahoma',fontSize:'16px',color:'#fff0c8'}).setOrigin(.5);
    this.add.text(940,160,'เรือนรับรอง',{fontFamily:'Tahoma',fontSize:'14px',color:'#fff0c8'}).setOrigin(.5);
    for(const [x,y] of [[80,170],[1100,400],[500,650],[70,700],[1150,100]]){
      g.fillStyle(0x324e35,.3);g.fillEllipse(x+10,y+15,110,40);g.fillStyle(0x705a37);g.fillRect(x-8,y-30,16,58);g.fillStyle(0x3f6b46);g.fillCircle(x,y-45,42);g.fillStyle(0x537b4b);g.fillCircle(x-15,y-55,28);g.fillStyle(0x6e8c50);g.fillCircle(x-18,y-65,17);
    }
    this.cameras.main.setBounds(0,0,WORLD.width,WORLD.height);
  }
  update(_t:number,delta:number) {
    if(active && Date.now()-this.sent>=50){
      const k=this.keys, down=(a:string,b:string)=>k[a].isDown||k[b].isDown;
      const dx=Number(down('D','RIGHT'))-Number(down('A','LEFT')),dy=Number(down('S','DOWN'))-Number(down('W','UP'));
      room?.send('move',{dx,dy});this.sent=Date.now();
    }
    const ids=new Set(players.map(p=>p.id));
    for(const [id,c] of this.avatars)if(!ids.has(id)){c.destroy();this.avatars.delete(id);}
    for(const p of players){
      let c=this.avatars.get(p.id);
      if(!c){
        c=this.add.container(p.x,p.y);const g=this.add.graphics();
        g.fillStyle(0x1b3024,.3);g.fillEllipse(0,9,36,15);
        g.fillStyle(p.id===mySession?0xd7b968:0x8ec9be);g.fillRoundedRect(-12,-15,24,27,6);
        g.fillStyle(0x413d37);g.fillRect(-10,7,7,10);g.fillRect(3,7,7,10);
        g.fillStyle(0xf4c995);g.fillCircle(0,-27,16);g.fillStyle(0x34322b);g.fillEllipse(0,-37,29,12);
        g.fillStyle(0xf2cf76);g.fillTriangle(-7,-38,0,-49,7,-38);
        g.fillStyle(0xa8c0b6);g.fillRoundedRect(14,-29,5,32,2);g.fillStyle(0xdac38a);g.fillRect(10,-3,13,4);
        g.fillStyle(0x815a38);g.fillEllipse(-16,-3,14,21);g.lineStyle(2,0xd3b36f);g.strokeEllipse(-16,-3,14,21);
        const arrow=this.add.triangle(0,26,0,-5,5,5,-5,5,0xf5e5a6);
        const label=this.add.text(0,-62,p.name+(p.id===mySession?' (คุณ)':''),{fontFamily:'Tahoma',fontSize:'11px',color:'#fff9dc',backgroundColor:'#243d2dcc',padding:{x:5,y:3}}).setOrigin(.5);
        c.add([g,arrow,label]);c.setSize(45,70).setInteractive();c.on('pointerdown',()=>{$('notice').textContent=`เลือก ${p.name} · นักดาบ`});
        this.avatars.set(p.id,c);
      }
      const alpha=1-Math.exp(-delta/65);c.x+=(p.x-c.x)*alpha;c.y+=(p.y-c.y)*alpha;c.setDepth(p.y);c.setAlpha(p.connected?1:.4);
      (c.list[1] as Phaser.GameObjects.Triangle).setRotation((p.facing-2)*Math.PI/2);
      if(p.id===mySession)$('position').textContent=`ตำแหน่ง ${Math.round(p.x)}, ${Math.round(p.y)} · นักดาบ`;
    }
  }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1280,height:800,backgroundColor:'#7f965b',scene:Town,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true}});
if(import.meta.env.DEV){Object.assign(window,{__m1:{snapshot:()=>({mySession,players,active,rejected}),send:(type:string,data:unknown)=>room?.send(type,data),drop:()=>room?.connection.close()}});}
const token=sessionStorage.getItem('siam.reconnect');if(token)void reconnect(token);else void join();
