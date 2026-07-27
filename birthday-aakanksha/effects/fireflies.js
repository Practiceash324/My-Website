/* ================= Glowing fireflies ================= */
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

let fireflies = [];
function makeFirefly(){
  return {
    x: Math.random()*W,
    y: Math.random()*H,
    size: 2 + Math.random()*2.5,
    angle: Math.random()*Math.PI*2,
    speed: 0.3 + Math.random()*0.5,
    t: Math.random()*Math.PI*2,
    twinkleSpeed: 0.02 + Math.random()*0.03,
    color: Math.random() > 0.5 ? '#FFD9A0' : '#E6303B'
  };
}
for(let i=0;i<40;i++){ fireflies.push(makeFirefly()); }

function drawFirefly(f){
  const glow = 0.4 + Math.sin(f.t)*0.4;
  ctx.save();
  ctx.globalAlpha = Math.max(0.1, glow);
  const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size*5);
  grad.addColorStop(0, f.color);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.size*5, 0, Math.PI*2);
  ctx.fill();
  ctx.globalAlpha = Math.max(0.3, glow);
  ctx.fillStyle = f.color;
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.size, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);
  fireflies.forEach(f=>{
    f.angle += (Math.random()-0.5)*0.05;
    f.x += Math.cos(f.angle)*f.speed;
    f.y += Math.sin(f.angle)*f.speed - 0.15;
    f.t += f.twinkleSpeed;
    if(f.x < -20) f.x = W+20;
    if(f.x > W+20) f.x = -20;
    if(f.y < -20){ f.y = H+20; f.x = Math.random()*W; }
    drawFirefly(f);
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* keep buttons/scroll-in working: gentle extra sparkle burst */
function fireflyBurst(cx, cy, count){
  for(let i=0;i<count;i++){
    const f = makeFirefly();
    f.x = cx + (Math.random()-0.5)*200;
    f.y = cy;
    fireflies.push(f);
  }
}
document.getElementById('confetti-btn').addEventListener('click', ()=>{
  fireflyBurst(W/2, H/2, 20);
});
let galleryBurstDone=false;
const galleryIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !galleryBurstDone){
      galleryBurstDone=true;
      fireflyBurst(W/2, H/2, 20);
    }
  });
},{ threshold:0.3 });
galleryIO.observe(document.getElementById('gallery-section'));
