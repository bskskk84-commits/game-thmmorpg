export const WORLD = { width: 1280, height: 800, radius: 14, speed: 180, tickMs: 50, reconnectSeconds: 20 };
export const OBSTACLES = [
  { x: 420, y: 240, w: 240, h: 150, kind: 'temple' },
  { x: 850, y: 190, w: 180, h: 110, kind: 'house' },
  { x: 180, y: 520, w: 180, h: 100, kind: 'pond' },
  { x: 850, y: 520, w: 150, h: 110, kind: 'garden' }
] as const;
export interface Intent { dx: number; dy: number }
export interface Avatar { id: string; name: string; x: number; y: number; facing: number; connected: boolean }
export function validIntent(value: unknown): value is Intent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return Object.keys(v).length === 2 && typeof v.dx === 'number' && typeof v.dy === 'number' && Number.isFinite(v.dx) && Number.isFinite(v.dy) && Math.abs(v.dx) <= 1 && Math.abs(v.dy) <= 1;
}
export function blocked(x: number, y: number) {
  const r = WORLD.radius;
  return x < r || y < r || x > WORLD.width-r || y > WORLD.height-r || OBSTACLES.some(o => x+r>o.x && x-r<o.x+o.w && y+r>o.y && y-r<o.y+o.h);
}
export function step(p: { x:number; y:number; facing:number }, input:Intent, dt = WORLD.tickMs) {
  const length = Math.hypot(input.dx,input.dy);
  if (!length) return;
  const distance = WORLD.speed * Math.min(dt, WORLD.tickMs)/1000;
  const dx = input.dx / Math.max(1,length), dy = input.dy / Math.max(1,length);
  const x = p.x + dx*distance, y = p.y + dy*distance;
  if (!blocked(x,p.y)) p.x = x;
  if (!blocked(p.x,y)) p.y = y;
  p.facing = Math.abs(dx)>Math.abs(dy) ? (dx>0?1:3) : (dy>0?2:0);
}
export const CLASSES = [
  ['swordsman','นักดาบ','ดาบและโล่'],['knight','อัศวิน','หอก'],['archer','นักธนู','ธนู'],['healer','ฮีลเลอร์','คทาดอกบัวและกระดิ่ง'],['mage','จอมเวท','คทาคริสตัล'],['rogue','โร้ก','มีดคู่'],['muaythai','นักสู้มวยไทย','ผ้าพันมือและสนับมือ'],['merchant','แม่ค้า','คัมภีร์เวทและเป้สาน']
] as const;
