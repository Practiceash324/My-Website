/* ================= Cursor heart trail (+ ambient fallback for touch) ================= */
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

let trail = [];
function drawHeart(x, y, size, opacity, color){
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  const s = size/16;
  ctx.beginPath();
  ctx.moveTo(0, 4*s);
  ctx.bezierCurveTo(0, 0, -8*s, 0, -8*s, -4*s);
  ctx.bezierCurveTo(-8*s, -8*s, 0, -8*s, 0, -2*s);
  ctx.bezierCurveTo(0, -8*s, 8*s, -8*s, 8*s, -4*s);
  ctx.bezierCurveTo(8*s, 0, 0, 0, 0, 4*s);
  ctx.fill();
  ctx.restore();
}

function addHeart(x, y){
  trail.push({ x, y, life: 0, size: 12+Math.random()*8,
    color: Math.random() > 0.5 ? '#E6303B' : '#FFFFFF', driftX: (Math.random()-0.5)*0.6 });
}

window.addEventListener('pointermove', (e)=>{ addHeart(e.clientX, e.clientY); });

function tick(){
  ctx.clearRect(0,0,W,H);
  trail.forEach(p=>{
    p.life++;
    p.y -= 0.6;
    p.x += p.driftX;
    const opacity = Math.max(0, 1 - p.life/50);
    drawHeart(p.x, p.y, p.size, opacity, p.color);
  });
  trail = trail.filter(p => p.life < 50);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function heartBurst(cx, cy, count){
  for(let i=0;i<count;i++){ addHeart(cx + (Math.random()-0.5)*220, cy + (Math.random()-0.5)*80); }
}
document.getElementById('confetti-btn').addEventListener('click', ()=>{
  heartBurst(W/2, H/2, 40);
});
let galleryBurstDone=false;
const galleryIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !galleryBurstDone){
      galleryBurstDone=true;
      heartBurst(W/2, H/2, 40);
    }
  });
},{ threshold:0.3 });
galleryIO.observe(document.getElementById('gallery-section'));
