import { Room, Client } from '@colyseus/core';
import { Schema, MapSchema, defineTypes } from '@colyseus/schema';
import { randomUUID } from 'node:crypto';
import { WORLD, validIntent, step, type Intent } from '@siam/shared';
class Player extends Schema {
  id = ''; name = ''; x = 240; y = 350; facing = 2; connected = true;
}
defineTypes(Player,{id:'string',name:'string',x:'number',y:'number',facing:'number',connected:'boolean'});
class WorldState extends Schema { players = new MapSchema<Player>(); }
defineTypes(WorldState,{players:{map:Player}});
export class WorldRoom extends Room<WorldState> {
  maxClients = 20;
  private inputs = new Map<string,{intent:Intent; at:number}>();
  private limits = new Map<string,{at:number; count:number}>();
  onCreate() {
    this.setState(new WorldState()); this.setPatchRate(50);
    this.onMessage('move',(client,payload:unknown)=>{
      if (!this.permit(client)) return;
      if (!validIntent(payload)) { client.send('rejected','คำสั่งเดินไม่ถูกต้อง'); return; }
      if (!this.state.players.get(client.sessionId)?.connected) return;
      this.inputs.set(client.sessionId,{intent:payload,at:Date.now()});
    });
    this.onMessage('*',(client)=>{if(this.permit(client)) client.send('rejected','ไม่อนุญาตคำสั่งนี้');});
    // Fixed server step: message frequency and client time never determine distance.
    this.setSimulationInterval(()=>{
      const now=Date.now();
      this.state.players.forEach((p,id)=>{
        const input=this.inputs.get(id);
        if(p.connected && input && now-input.at<250) step(p,input.intent);
      });
    },WORLD.tickMs);
  }
  private permit(client:Client) {
    const now=Date.now(); let bucket=this.limits.get(client.sessionId);
    if(!bucket || now-bucket.at>=1000) { bucket={at:now,count:0}; this.limits.set(client.sessionId,bucket); }
    if(++bucket.count>40) { if(bucket.count===41) client.send('rejected','ส่งคำสั่งถี่เกินไป'); return false; }
    return true;
  }
  onJoin(client:Client) {
    const player=new Player(); player.id=randomUUID();
    player.name='นักดาบ '+player.id.slice(0,4);
    player.x=180+(this.state.players.size%6)*32;
    // Identity is issued by the server; supplied IDs/names/positions are ignored.
    this.state.players.set(client.sessionId,player);
  }
  async onLeave(client:Client,consented:boolean) {
    const p=this.state.players.get(client.sessionId); if(!p) return;
    p.connected=false; this.inputs.delete(client.sessionId);
    try {
      if(consented) throw new Error('left');
      await this.allowReconnection(client,WORLD.reconnectSeconds);
      p.connected=true; this.limits.delete(client.sessionId);
    } catch {
      this.state.players.delete(client.sessionId); this.limits.delete(client.sessionId);
    }
  }
}
