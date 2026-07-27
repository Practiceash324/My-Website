/* ================= Rising lanterns ================= */
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

let lanterns = [];
function makeLantern(){
  return {
    x: Math.random()*W,
    y: H + 40,
    w: 22 + Math.random()*14,
    h: 30 + Math.random()*18,
    speedY: 0.4 + Math.random()*0.5,
    sway: Math.random()*Math.PI*2,
    swaySpeed: 0.3 + Math.random()*0.3,
    flicker: Math.random()*Math.PI*2,
    color: Math.random() > 0.5 ? '#E6303B' : '#C41230'
  };
}
for(let i=0;i<10;i++){ lanterns.push(makeLantern()); }

function drawLantern(l){
  ctx.save();
  ctx.translate(l.x, l.y);
  ctx.globalAlpha = 0.85;
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, l.w*2.2);
  glow.addColorStop(0, 'rgba(255,200,150,0.5)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, l.w*2.2, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = l.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, l.w/2, l.h/2, 0, 0, Math.PI*2);
  ctx.fill();
  const flick = 0.5 + Math.sin(l.flicker)*0.3;
  ctx.globalAlpha = flick;
  ctx.fillStyle = '#FFD9A0';
  ctx.beginPath();
  ctx.ellipse(0, l.h*0.35, 4, 6, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);
  lanterns.forEach(l=>{
    l.y -= l.speedY;
    l.sway += l.swaySpeed*0.02;
    l.x += Math.sin(l.sway)*0.4;
    l.flicker += 0.15;
    drawLantern(l);
  });
  lanterns = lanterns.filter(l => l.y > -80);
  if(lanterns.length < 10 && Math.random() < 0.02){ lanterns.push(makeLantern()); }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function lanternBurst(cx, cy, count){
  for(let i=0;i<count;i++){
    const l = makeLantern();
    l.x = cx + (Math.random()-0.5)*200;
    l.y = cy + 40;
    lanterns.push(l);
  }
}
document.getElementById('confetti-btn').addEventListener('click', ()=>{
  lanternBurst(W/2, H, 6);
});
let galleryBurstDone=false;
const galleryIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !galleryBurstDone){
      galleryBurstDone=true;
      lanternBurst(W/2, H, 6);
    }
  });
},{ threshold:0.3 });
galleryIO.observe(document.getElementById('gallery-section'));
