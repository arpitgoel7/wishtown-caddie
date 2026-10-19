const fs=require('fs');
eval(fs.readFileSync(__dirname+'/../src/holes/h04-osm.js','utf8')+fs.readFileSync(__dirname+'/../src/holes/h04.js','utf8')+';globalThis.HOLE4=HOLE4;');
const E=require('../src/engine.js');
const H=HOLE4; H.raster=E.buildRaster(H);
function bag(h,gender){
  const men=[['Driver',215,235],['3 Wood',195,210],['5 Wood',180,192],['4 Hybrid',172,180],['5 Iron',160,167],['6 Iron',150,156],['7 Iron',140,145],['8 Iron',130,134],['9 Iron',120,123],['PW',108,110],['GW',96,97],['SW',82,83],['LW',65,65]];
  const lad=[['Driver',165,180],['3 Wood',145,155],['5 Wood',135,143],['4 Hybrid',128,134],['5 Hybrid',120,126],['6 Iron',112,117],['7 Iron',105,109],['8 Iron',97,100],['9 Iron',88,91],['PW',78,80],['SW',60,61]];
  const f=1+(18-h)*0.008;
  return (gender=='F'?lad:men).map(([n,c,t])=>({name:n,carry:Math.round(c*f),total:Math.round(t*f),acc:'',conf:3,on:true}));
}
for (const [h,g,tee] of [[0,'M','Blue'],[9,'M','Blue'],[18,'M','Blue'],[27,'M','Blue'],[18,'F','Red'],[30,'F','Red']]){
  const t0=Date.now();
  const P=E.makePlayer({hcp:h,clubs:bag(h,g),bias:'S'});
  const sol=E.solve(H,P,H.pins.Middle);
  const t1=Date.now();
  const opts=E.teeOptions(sol,H.tees[tee]);
  const t2=Date.now();
  const res=opts.slice(0,5).map(o=>{const r=E.playouts(sol,H.tees[tee],o,1500,5);const m=r.scores.reduce((a,b)=>a+b,0)/r.scores.length;return `${o.shot.name}@${o.aimDeg}° EV=${o.ev.toFixed(2)} sim=${m.toFixed(2)} water=${(r.water*100).toFixed(0)}% dbl+=${(r.scores.filter(s=>s>=6).length/r.scores.length*100).toFixed(0)}%`});
  console.log(`h=${h}${g} ${tee} solve ${t1-t0}ms states ${sol.nStates} opts ${t2-t1}ms`); res.forEach(r=>console.log('   ',r));
  const drv=opts.find(o=>o.shot.kind=='driver'); if(drv) console.log('    driver:',drv.ev.toFixed(2),drv.aimDeg);
}
