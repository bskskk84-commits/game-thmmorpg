import { test, expect } from '@playwright/test';
test('two independent real browsers: replication, authority, collision, rate limit, reconnect',async({browser})=>{
 const a=await browser.newContext(),b=await browser.newContext();
 const one=await a.newPage(),two=await b.newPage();const errors:string[]=[];
 one.on('pageerror',e=>errors.push(e.message));two.on('pageerror',e=>errors.push(e.message));
 const snap=(p:typeof one)=>p.evaluate(()=> (window as any).__m1.snapshot());
 await Promise.all([one.goto('/'),two.goto('/')]);
 await expect.poll(async()=> (await snap(one)).players.length).toBe(2);
 await expect.poll(async()=> (await snap(two)).players.length).toBe(2);
 const first=await snap(one), second=await snap(two);expect(first.mySession).not.toBe(second.mySession);
 const id=first.mySession;const start=first.players.find((p:any)=>p.id===id);
 await one.keyboard.down('d');await one.waitForTimeout(600);await one.keyboard.up('d');
 await expect.poll(async()=> (await snap(two)).players.find((p:any)=>p.id===id).x).toBeGreaterThan(start.x+45);
 // Holding into the temple must stop on the server in BOTH clients.
 await one.keyboard.down('d');await one.waitForTimeout(1700);await one.keyboard.up('d');await one.waitForTimeout(200);
 const wall=(await snap(two)).players.find((p:any)=>p.id===id);expect(wall.x).toBeLessThanOrEqual(406);expect(wall.x).toBeGreaterThan(390);
 await one.evaluate(()=>{const d=(window as any).__m1;d.send('move',{dx:100,dy:0});d.send('move',{dx:1,dy:0,x:99999});d.send('money',{amount:999999});});
 await expect.poll(async()=> (await snap(one)).rejected.length).toBeGreaterThanOrEqual(3);
 // Move away from wall; flooding commands still cannot advance more than fixed ticks.
 await one.keyboard.down('s');await one.waitForTimeout(1100);await one.keyboard.up('s');await one.waitForTimeout(300);
 const before=(await snap(one)).players.find((p:any)=>p.id===id);
 await one.evaluate(()=>{for(let i=0;i<200;i++)(window as any).__m1.send('move',{dx:1,dy:0});});
 await one.waitForTimeout(400);const after=(await snap(two)).players.find((p:any)=>p.id===id);
 expect(after.x-before.x).toBeLessThanOrEqual(54);
 await expect.poll(async()=> (await snap(one)).rejected.includes('ส่งคำสั่งถี่เกินไป')).toBe(true);
 // Close the actual WebSocket, not a fake player or replacement connection.
 await one.click('#disconnect');
 await expect(one.locator('#status')).toContainText('เชื่อมต่อใหม่สำเร็จ');
 await expect.poll(async()=> (await snap(two)).players.length).toBe(2);
 expect((await snap(one)).mySession).toBe(id);
 expect((await snap(two)).players.filter((p:any)=>p.id===id)).toHaveLength(1);
 expect(errors).toEqual([]);
 await one.screenshot({path:'work/m1-two-player.png',fullPage:true});
 await a.close();await b.close();
});
