import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blocked, step, validIntent, WORLD } from '@siam/shared';
test('rejects forged position, speed, non-finite and oversized direction',()=>{
 for(const bad of [{dx:2,dy:0},{dx:0,dy:NaN},{dx:1,dy:0,x:10000},{dx:1,dy:0,speed:999},null])assert.equal(validIntent(bad),false);
});
test('diagonal speed capped and elapsed time cannot accelerate',()=>{
 const p={x:100,y:100,facing:2};step(p,{dx:1,dy:1},999999);assert.ok(Math.hypot(p.x-100,p.y-100)<=WORLD.speed*.05+1e-6);
});
test('server-only collision stops at temple and world border',()=>{
 const p={x:240,y:350,facing:2};for(let i=0;i<1000;i++)step(p,{dx:1,dy:0});assert.equal(blocked(p.x,p.y),false);assert.ok(p.x<=420-WORLD.radius);
 const edge={x:20,y:20,facing:2};for(let i=0;i<100;i++)step(edge,{dx:-1,dy:-1});assert.ok(edge.x>=WORLD.radius && edge.y>=WORLD.radius);
});
