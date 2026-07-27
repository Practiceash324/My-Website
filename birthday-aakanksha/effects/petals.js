/* ================= Falling rose petals ================= */
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const petalColors = ['#E6303B','#8E0B14','#FFFFFF','#C41230'];
let petals = [];

function makePetal(){
  return {
    x: Math.random()*W,
    y: -20 - Math.random()*100,
    size: 14 + Math.random()*10,
    speedY: 0.6 + Math.random()*1.2,
    swayAmp: 20 + Math.random()*30,
    swaySpeed: 0.4 + Math.random()*0.6,
    swayOffset: Math.random()*Math.PI*2,
    angle: Math.random()*Math.PI*2,
    spin: (Math.random()-0.5)*0.03,
    color: petalColors[Math.floor(Math.random()*petalColors.length)],
    opacity: 0.6 + Math.random()*0.35,
    t: 0
  };
}
function drawPetal(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  const s = p.size/14;
  ctx.beginPath();
  ctx.moveTo(0, -8*s);
  ctx.bezierCurveTo(6*s, -6*s, 6*s, 4*s, 0, 8*s);
  ctx.bezierCurveTo(-6*s, 4*s, -6*s, -6*s, 0, -8*s);
  ctx.fill();
  ctx.restore();
}
function petalBurst(cx, cy, count){
  for(let i=0;i<count;i++){
    const p = makePetal();
    p.x = cx + (Math.random()-0.5)*220;
    p.y = cy - 20;
    petals.push(p);
  }
}

for(let i=0;i<30;i++){ petals.push(makePetal()); }
let ambientTimer=0;
function tick(){
  ctx.clearRect(0,0,W,H);
  if(!reduceMotion){
    ambientTimer++;
    if(ambientTimer%40===0 && petals.length<60){ petals.push(makePetal()); }
  }
  petals.forEach(p=>{
    p.t += 0.016;
    p.y += p.speedY;
    p.x += Math.sin(p.t*p.swaySpeed + p.swayOffset) * (p.swayAmp*0.02);
    p.angle += p.spin;
    drawPetal(p);
  });
  petals = petals.filter(p=> p.y < H + 40);
  requestAnimationFrame(tick);
}
if(!reduceMotion){ requestAnimationFrame(tick); } else { ctx.clearRect(0,0,W,H); }

document.getElementById('confetti-btn').addEventListener('click', ()=>{
  petalBurst(W/2, 0, 40);
});

let galleryBurstDone=false;
const galleryIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !galleryBurstDone){
      galleryBurstDone=true;
      petalBurst(W/2, 0, 40);
    }
  });
},{ threshold:0.3 });
galleryIO.observe(document.getElementById('gallery-section'));
