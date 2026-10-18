import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
config({path:fileURLToPath(new URL('../../../.env',import.meta.url))});
import { createServer } from 'node:http';
import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { WorldRoom } from './WorldRoom.js';
const port=Number(process.env.PORT ?? 2567);
const http=createServer((req,res)=>{
  if(req.url==='/health') {res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,milestone:'M1'}));}
  else {res.writeHead(404);res.end();}
});
const game=new Server({transport:new WebSocketTransport({server:http,maxPayload:2048})});
game.define('town',WorldRoom);
await game.listen(port,'0.0.0.0');
console.log(`Game server http://localhost:${port}`);
