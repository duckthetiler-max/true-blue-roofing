(function(){
"use strict";

if(!document.getElementById('tb3d-scene')) return;

/* ============================================================
   Tiny 3D engine: painter's algorithm over canvas 2D.
   No libraries — the artifact CSP blocks external scripts.
   ============================================================ */

var D2R = Math.PI/180;
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function norm(v){var l=Math.hypot(v[0],v[1],v[2])||1;return [v[0]/l,v[1]/l,v[2]/l];}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function lerp(a,b,t){return a+(b-a)*t;}
function mix(a,b,t){return [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];}
function sstep(a,b,t){t=clamp((t-a)/(b-a||1e-6),0,1);return t*t*(3-2*t);}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}

/* ---------- roof geometry constants (metres) ---------- */
var PITCH = 22.5*D2R, SN = Math.sin(PITCH), CS = Math.cos(PITCH), TAN = SN/CS;
var COLS = 8, COURSES = 5;
var TW = 0.33, GAUGE = 0.33;
var S0 = 0.085;                       // first course starts this far down from the ridge line
var HALFW = COLS*TW/2;                // 1.32
var RIDGE_Y = 0.70;
var EAVE_S = S0 + COURSES*GAUGE;      // 1.735
var EAVE_Z = EAVE_S*CS, EAVE_Y = RIDGE_Y - EAVE_S*SN;

// surface point: u along the ridge, s down the slope from the ridge, h out along the roof normal
function surf(side,u,s,h){ return [u, RIDGE_Y - s*SN + h*CS, side*(s*CS + h*SN)]; }
function dnA(side){ return [0,-SN,side*CS]; }   // down-slope unit vector
function nrm(side){ return [0,CS,side*SN]; }    // outward normal

/* tile cross-section profile: x across the width, h above the roof plane */
var PROF = [[0.000,0.010],[0.062,0.032],[0.165,0.015],[0.268,0.032],[0.330,0.010]];

/* ---------- parts ---------- */
var parts = [];
function part(o){
  o.alpha = (o.alpha===undefined)?1:o.alpha;
  o.visible = (o.visible===undefined)?true:o.visible;
  o.gloss = o.gloss||0;
  o.tf = o.tf||null;
  o._w = []; o._s = [];
  parts.push(o); return o;
}
/* faces reference vertex indices; colour comes from the part unless the face overrides */
function quads(list){ return list.map(function(v){return {v:v};}); }

/* ---------- materials ---------- */
var MAT = {
  tileNew:   [186, 92, 52],
  tileFaded: [140,130,116],
  moss:      [ 98,110, 82],
  bedOld:    [148,140,127],
  bedNew:    [201,194,180],
  point:     [222,216,204],
  batten:    [172,136, 90],
  rafter:    [156,124, 82],
  sarking:   [176,183,190],
  wall:      [226,218,204],
  gable:     [236,230,218],
  fascia:    [244,240,232],
  ground:    [200,190,175]
};
var COATS = [
  {name:"Terracotta", rgb:[186, 92, 52]},
  {name:"Charcoal",   rgb:[ 62, 67, 74]},
  {name:"Monument",   rgb:[ 96,105,113]},
  {name:"Heritage red",rgb:[142, 50, 44]}
];
var coatIdx = 0;

/* ============================================================
   Build the model
   ============================================================ */

/* --- ground + house body --- */
var ground = {verts:[[-9,-1.05,-9],[9,-1.05,-9],[9,-1.05,9],[-9,-1.05,9]], color:MAT.ground};

var WALL_X = 1.20, WALL_Z = 1.45, WALL_TOP = 0.055, WALL_BOT = -1.05;
function roofYatZ(z){ return RIDGE_Y - Math.abs(z)*TAN; }
(function house(){
  var yz = roofYatZ(WALL_Z);
  var V=[
    [-WALL_X,WALL_BOT, WALL_Z],[ WALL_X,WALL_BOT, WALL_Z],[ WALL_X,WALL_TOP, WALL_Z],[-WALL_X,WALL_TOP, WALL_Z], //0-3 front
    [-WALL_X,WALL_BOT,-WALL_Z],[ WALL_X,WALL_BOT,-WALL_Z],[ WALL_X,WALL_TOP,-WALL_Z],[-WALL_X,WALL_TOP,-WALL_Z], //4-7 back
    [-WALL_X,yz, WALL_Z],[-WALL_X,RIDGE_Y,0],[-WALL_X,yz,-WALL_Z],   //8-10 left gable
    [ WALL_X,yz, WALL_Z],[ WALL_X,RIDGE_Y,0],[ WALL_X,yz,-WALL_Z]    //11-13 right gable
  ];
  part({verts:V, color:MAT.wall, faces:[{v:[0,1,2,3]},{v:[5,4,7,6]},{v:[4,0,3,7]},{v:[1,5,6,2]}]});
  part({verts:V, color:MAT.gable, faces:[
    {v:[3,8,9,10,7]}, {v:[6,13,12,11,2]}
  ]});
})();

/* --- fascia along both eaves --- */
[1,-1].forEach(function(side){
  var z0 = side*EAVE_Z, z1 = side*(EAVE_Z+0.022);
  var y0 = EAVE_Y-0.005, y1 = y0-0.115;
  var V=[[-HALFW,y0,z0],[HALFW,y0,z0],[HALFW,y1,z0],[-HALFW,y1,z0],
         [-HALFW,y0,z1],[HALFW,y0,z1],[HALFW,y1,z1],[-HALFW,y1,z1]];
  part({verts:V, color:MAT.fascia, faces:[{v:[0,1,2,3]},{v:[4,5,6,7]},{v:[0,4,7,3]},{v:[1,5,6,2]},{v:[0,1,5,4]}]});
});

/* --- sarking (roof blanket) --- */
var sarking = [1,-1].map(function(side){
  return part({verts:[surf(side,-HALFW,S0-0.05,-0.055),surf(side,HALFW,S0-0.05,-0.055),
                      surf(side,HALFW,EAVE_S,-0.055),surf(side,-HALFW,EAVE_S,-0.055)],
    color:MAT.sarking, gloss:0.35, faces:[{v:[0,1,2,3]}], visible:false});
});

/* --- rafters (front slope only; the cutaway looks at that face) --- */
var rafters = [];
for(var rk=0; rk<5; rk++){
  var rx = -HALFW + 0.16 + rk*0.62;
  var V=[], F=[];
  [[-0.024,-0.060],[0.024,-0.060],[0.024,-0.215],[-0.024,-0.215]].forEach(function(o){
    V.push(surf(1,rx+o[0],S0-0.06,o[1]));
    V.push(surf(1,rx+o[0],EAVE_S,o[1]));
  });
  F=[{v:[0,2,3,1]},{v:[4,6,7,5]},{v:[0,1,7,6]},{v:[2,4,5,3]},{v:[0,6,4,2]},{v:[1,3,5,7]}];
  rafters.push(part({verts:V, color:MAT.rafter, faces:F, visible:false}));
}

/* --- battens --- */
var battens = [];
[1,-1].forEach(function(side){
  for(var c=0;c<COURSES;c++){
    var sb = S0 + c*GAUGE + 0.021;
    var V=[];
    [[-0.021,-0.006],[0.021,-0.006],[0.021,-0.025],[-0.021,-0.025]].forEach(function(o){
      V.push(surf(side,-HALFW,sb+o[0],o[1]));
      V.push(surf(side, HALFW,sb+o[0],o[1]));
    });
    battens.push(part({verts:V, color:MAT.batten, visible:false, faces:[
      {v:[0,1,3,2]},{v:[4,5,7,6]},{v:[0,2,6,4]},{v:[1,3,7,5]},{v:[0,1,5,4]},{v:[2,3,7,6]}
    ]}));
  }
});

/* --- tiles --- */
function tileGeom(side,course,col,lenMul){
  var inset=0.004, sx=(TW-2*inset)/TW;
  var u0 = -HALFW + col*TW + inset;
  var sTop = S0 + course*GAUGE;
  var sBot = sTop + GAUGE*(lenMul||1);
  var hb = (COURSES-1-course)*0.0022;      // each course laps over the one below it
  var V=[], F=[], n=PROF.length, j;
  for(j=0;j<n;j++) V.push(surf(side,u0+PROF[j][0]*sx,sTop,hb+PROF[j][1]));
  for(j=0;j<n;j++) V.push(surf(side,u0+PROF[j][0]*sx,sBot,hb+PROF[j][1]));
  for(j=0;j<n;j++) V.push(surf(side,u0+PROF[j][0]*sx,sBot,hb+PROF[j][1]-0.027));
  for(j=0;j<n-1;j++) F.push({v:[j,n+j,n+j+1,j+1]});            // weather face
  for(j=0;j<n-1;j++) F.push({v:[n+j,2*n+j,2*n+j+1,n+j+1]});    // nose
  return {V:V,F:F,sTop:sTop,sBot:sBot,u0:u0,hb:hb};
}
var rnd = rng(20260820);
var tiles = {"1":[], "-1":[]};
[1,-1].forEach(function(side){
  for(var c=0;c<COURSES;c++){
    var row=[];
    for(var i=0;i<COLS;i++){
      var g = tileGeom(side,c,i);
      var p = part({verts:g.V, faces:g.F, color:MAT.tileFaded});
      p.meta = {side:side, course:c, col:i, tone:0.90+rnd()*0.20, mossy:rnd(),
                cx:g.u0+TW/2, sTop:g.sTop, sBot:g.sBot};
      row.push(p);
    }
    tiles[String(side)].push(row);
  }
});
var BR_C = 2, BR_I = 3;                                   // the broken tile
var brokenTile = tiles["1"][BR_C][BR_I];
var aboveTile  = tiles["1"][BR_C-1][BR_I];

/* replacement tile — same geometry, fresh colour, slides in from below */
var newTile = (function(){
  var g = tileGeom(1,BR_C,BR_I);
  var p = part({verts:g.V, faces:g.F, color:MAT.tileNew, visible:false});
  p.meta = {tone:1.0};
  return p;
})();

/* demo tile for the anatomy step — full length so the head lap is visible */
var demoTile = (function(){
  var g = tileGeom(1,2,6,1.227);
  var p = part({verts:g.V, faces:g.F, color:MAT.tileNew, visible:false});
  p.meta = {tone:1.0};
  p.anchorHead = surf(1,-HALFW+6*TW+TW/2, g.sTop, 0.05);
  p.anchorLapA = surf(1,-HALFW+6*TW+0.03, g.sTop+GAUGE, 0.05);
  p.anchorLapB = surf(1,-HALFW+6*TW+0.03, g.sBot, 0.05);
  return p;
})();

/* --- ridge caps + bedding + pointing --- */
var CAP_N = 8, CAP_LEN = 0.40, CAP_STEP = 0.325, CAP_R = 0.118, CAP_CY = 0.760, CAP_A = 115*D2R, CAP_SEG = 9;
function capX0(i){ return -HALFW - 0.01 + i*CAP_STEP; }
var caps = [];
for(var ci=0; ci<CAP_N; ci++){
  var x0 = capX0(ci), x1 = x0 + CAP_LEN, V=[], F=[], k;
  for(k=0;k<=CAP_SEG;k++){
    var a = -CAP_A + (2*CAP_A)*k/CAP_SEG;
    var y = CAP_CY + CAP_R*Math.cos(a), z = CAP_R*Math.sin(a);
    var yi = CAP_CY + (CAP_R-0.016)*Math.cos(a), zi = (CAP_R-0.016)*Math.sin(a);
    V.push([x0,y,z]); V.push([x1,y,z]); V.push([x1,yi,zi]); V.push([x0,yi,zi]);
  }
  for(k=0;k<CAP_SEG;k++){
    var b=k*4, nx=(k+1)*4;
    F.push({v:[b,b+1,nx+1,nx]});          // outer shell
    F.push({v:[b+1,b+2,nx+2,nx+1]});      // rim at the exposed end
    F.push({v:[b+3,b,nx,nx+3]});          // rim at the far end
  }
  caps.push(part({verts:V, faces:F, color:[176,168,154], gloss:0.10}));
}

/* bedding wedge — cross-section in the (z,y) plane, extruded along the ridge */
function bedSection(side){
  // U inner-top (up under the cap) · T outer-top (at the cap edge) · O toe on the tile · I inner-bottom
  return [[side*0.052,0.778],[side*0.110,0.714],[side*0.150,0.668],[side*0.070,0.700]];
}
function ridgePrism(side,i,sec,faces,color,gloss){
  var x0 = capX0(i), x1 = x0 + CAP_STEP + 0.006, V=[];
  for(var k=0;k<sec.length;k++){ V.push([x0,sec[k][1],sec[k][0]]); V.push([x1,sec[k][1],sec[k][0]]); }
  var p = part({verts:V, faces:faces, color:color, gloss:gloss||0});
  p.pivotX = x0;
  return p;
}
var bedNewP=[], bedOldP=[], pointP=[];
[1,-1].forEach(function(side){
  for(var i=0;i<CAP_N;i++){
    var sec = bedSection(side);
    // faces: U-T (top slope), T-O (the visible mortar face), plus both ends
    var f = [{v:[0,1,3,2]},{v:[2,3,5,4]},{v:[0,2,4,6]},{v:[1,3,5,7]}];
    bedNewP.push(ridgePrism(side,i,sec,f,MAT.bedNew,0.04));
    var old = ridgePrism(side,i,sec,f,MAT.bedOld,0);
    old.meta = {crumble:rnd()};
    bedOldP.push(old);
    // pointing: a thin fillet sitting proud of the mortar face
    var ps = [[side*0.104,0.719],[side*0.129,0.699],[side*0.152,0.673]];
    var pf = [{v:[0,1,3,2]},{v:[2,3,5,4]},{v:[0,2,4]},{v:[1,3,5]}];
    pointP.push(ridgePrism(side,i,ps,pf,MAT.point,0.22));
  }
});

/* ============================================================
   The job sequence
   ============================================================ */
var STEPS = [
 {t:"Pull it apart", d:"Rafters, sarking, battens, tiles", dur:8500,
  cam:{yaw:-0.62,pitch:0.30,dist:4.5,target:[0.35,0.22,0.25]},
  body:"Peel the tiles off the right hand side and you get the whole system: rafters, sarking, battens, then the tiles hung on top. Nothing is glued or sealed — the tiles hook over the battens and water is beaten by overlap alone.",
  why:["Why it matters","the 75 mm head lap is the waterproofing. The tile is just the thing holding that lap in place."]},

 {t:"Inspect &amp; wash", d:"Mark the damage, wash it back", dur:7000,
  cam:{yaw:-0.34,pitch:0.32,dist:4.1,target:[0,0.18,0]},
  body:"Walk the roof, mark every cracked and slipped tile, then high-pressure clean the lot. Moss and lichen hold water against the tile and creep up under the laps.",
  why:["Order matters","you wash before you price the repairs, because half the damage is invisible under fifteen years of growth."]},

 {t:"Tile replacement", d:"Lift the lap, swap the tile", dur:11000,
  cam:{yaw:-0.50,pitch:0.26,dist:1.95,target:[-0.16,0.44,0.60]},
  body:"Lift the tile above to free the lap, unhook the broken tile off the batten, slide it down and out. The new one goes back the same way — slide up, hook the nib, lay the lap back over it.",
  why:["No mortar","a field tile repair is mechanical. Anyone sealing a cracked tile in with silicone is hiding the problem, not fixing it."]},

 {t:"Strip the ridge", d:"Caps off, old bed chipped out", dur:8000,
  cam:{yaw:-0.58,pitch:0.44,dist:3.1,target:[0,0.52,0]},
  body:"Every cap comes off. The old sand-and-cement bed underneath gets chipped right back to the tile — bed on top of perished mortar and you have just bought the same failure again in two years.",
  why:["The real leak","a rotten ridge bed lets water straight into the roof space. It is the most common failure on an old tile roof, and it is invisible from the ground."]},

 {t:"Re-bed the caps", d:"Fresh mortar, caps to a line", dur:9000,
  cam:{yaw:-0.66,pitch:0.34,dist:2.7,target:[0,0.58,0]},
  body:"Fresh mortar laid both sides of the ridge, then every cap set back down into it and pulled to a string line so the ridge runs dead straight from end to end.",
  why:["The bed carries the cap","it holds the cap down and holds the line. It is not the waterproofing — that is the next step."]},

 {t:"Re-point", d:"Flexible compound over the joint", dur:7500,
  cam:{yaw:-0.78,pitch:0.32,dist:2.05,target:[0.15,0.70,0.10]},
  body:"Flexible pointing compound over the bed joint, both sides, the full length of the ridge. This is the part that keeps the water out and stays put while the roof moves underneath it.",
  why:["Not mortar","rigid pointing cracks out because the roof expands and contracts and the mortar cannot. Flexible pointing moves with it."]},

 {t:"Seal &amp; coat", d:"Primer, then two coats", dur:8000,
  cam:{yaw:-0.40,pitch:0.32,dist:4.3,target:[0,0.22,0]},
  body:"Primer soaks into the porous tile first, then two coats of membrane over the top. Watch the replacement tile disappear into the roof as the colour rolls across it.",
  why:["Last, not first","colour is the finish. If the tiles and the ridge are not right underneath, all you have bought is a good-looking roof that still leaks."]},

 {t:"Restored", d:"Straight ridge, sound tiles", dur:9000,
  cam:{yaw:0.10,pitch:0.28,dist:4.6,target:[0,0.20,0]},
  body:"Sound tiles, a ridge bedded and pointed properly, and a sealed, coated surface. Drag it around and have a look at it.",
  why:["What you are paying for","the two days spent on the ridge — not the afternoon spent spraying it."]}
];

/* ---------- scene state driven purely by (step, progress) ---------- */
var ST = {};
function applyState(step, p){
  ST.grime   = step<=0 ? 1 : (step===1 ? 1-sstep(0.22,0.80,p) : 0);
  ST.cut     = step===0 ? sstep(0.04,0.55,p) : 0;
  ST.lift    = step===2 ? (sstep(0.03,0.20,p) - sstep(0.74,0.92,p)) : 0;
  ST.out     = step<2 ? 0 : (step===2 ? sstep(0.20,0.50,p) : 1);
  ST.into    = step<2 ? 0 : (step===2 ? sstep(0.50,0.78,p) : 1);
  ST.capsOff = step<3 ? 0 : (step===3 ? sstep(0.05,0.58,p) : (step===4 ? 1-sstep(0.46,0.92,p) : 0));
  ST.oldBed  = step<3 ? 1 : (step===3 ? 1-sstep(0.58,0.96,p) : 0);
  ST.newBed  = step<4 ? 0 : (step===4 ? sstep(0.04,0.44,p) : 1);
  ST.point   = step<5 ? 0 : (step===5 ? sstep(0.06,0.88,p) : 1);
  ST.coatX   = step<6 ? -99 : (step===6 ? (-HALFW-0.35 + sstep(0.03,0.97,p)*(2*HALFW+0.95)) : 99);
  ST.gloss   = step<6 ? 0 : (step===6 ? sstep(0.25,1,p) : 1);
  ST.line    = step===4 ? (sstep(0.40,0.50,p) - sstep(0.93,1,p)) : 0;
  ST.crack   = (step<2) ? 1 : (step===2 ? 1-sstep(0.16,0.26,p) : 0);
  ST.mark    = step===1 ? sstep(0.02,0.14,p) : 0;

  var coatRGB = COATS[coatIdx].rgb, i, k, q, m, p2, base;
  var DF = dnA(1), NF = nrm(1);

  /* --- tiles --- */
  [1,-1].forEach(function(side){
    var rows = tiles[String(side)];
    for(var c=0;c<COURSES;c++) for(var i2=0;i2<COLS;i2++){
      p2 = rows[c][i2]; m = p2.meta;
      base = mix([150,141,127], MAT.moss, m.mossy*ST.grime*0.72);
      base = [base[0]*(1-0.16*ST.grime), base[1]*(1-0.13*ST.grime), base[2]*(1-0.17*ST.grime)];
      k = clamp((ST.coatX - m.cx)/0.24, 0, 1);
      var col = mix(base, coatRGB, k);
      p2.color = [col[0]*m.tone, col[1]*m.tone, col[2]*m.tone];
      p2.gloss = ST.gloss*k*0.5;
      p2.visible = true; p2.alpha = 1; p2.tf = null;

      if(side===1 && i2>=4 && ST.cut>0){                 // the peel-back cutaway
        q = clamp((ST.cut - (COLS-1-i2)*0.13)*3.2, 0, 1);
        if(q>0){ p2.tf = {t:[NF[0]*q*0.42, NF[1]*q*0.42, NF[2]*q*0.42]}; p2.alpha = 1-q; }
      }
    }
  });

  /* broken tile: slides down-slope, then drops away */
  var o = ST.out;
  if(o<=0){ brokenTile.tf=null; brokenTile.alpha=1; brokenTile.visible=true; }
  else{
    var fall = Math.max(0, o-0.60)*2.5;
    brokenTile.visible = o<1 || ST.into<1;
    brokenTile.alpha = 1-sstep(0.62,0.98,o);
    brokenTile.tf = {t:[DF[0]*o*0.36, DF[1]*o*0.36 - fall*fall*0.9, DF[2]*o*0.36],
                     rot:{axis:[0.3,0.2,0.9], ang:fall*1.3, pivot:[brokenTile.meta.cx, 0.42, 0.70]}};
    if(brokenTile.alpha<=0.02) brokenTile.visible=false;
  }
  /* the tile above hinges up on its head edge to free the lap */
  if(ST.lift>0.001){
    aboveTile.tf = {rot:{axis:[1,0,0], ang:-ST.lift*0.23, pivot:surf(1,0,aboveTile.meta.sTop,0)},
                    t:[NF[0]*ST.lift*0.012, NF[1]*ST.lift*0.012, NF[2]*ST.lift*0.012]};
  }
  /* replacement tile slides up the slope and hooks on */
  newTile.visible = ST.into>0.001;
  if(newTile.visible){
    var n1 = 1-ST.into;
    newTile.tf = {t:[DF[0]*n1*0.46 + NF[0]*n1*0.05, DF[1]*n1*0.46 + NF[1]*n1*0.05, DF[2]*n1*0.46 + NF[2]*n1*0.05]};
    k = clamp((ST.coatX - brokenTile.meta.cx)/0.24, 0, 1);
    newTile.color = mix([163,156,146], coatRGB, k);      // a new tile never matches until it is coated
    newTile.gloss = ST.gloss*k*0.5;
  }
  /* the demo tile hovering out front, showing the head lap */
  demoTile.visible = ST.cut>0.30;
  if(demoTile.visible){
    demoTile.alpha = sstep(0.30,0.55,ST.cut);
    demoTile.color = [163,156,146];
    demoTile.tf = {t:[0.34,0.44,0.30], rot:{axis:[1,0,0], ang:-0.20, pivot:[0.8,0.42,0.70]}};
  }

  /* --- substrate, only while the roof is peeled open --- */
  var open = ST.cut>0.02;
  sarking[0].visible = open;
  for(i=0;i<rafters.length;i++) rafters[i].visible = open;
  for(i=0;i<battens.length;i++) battens[i].visible = open && i<COURSES;

  /* --- ridge caps --- */
  for(i=0;i<CAP_N;i++){
    q = clamp((ST.capsOff*(CAP_N+1.6) - i)/1.5, 0, 1);
    var cp = caps[i];
    cp.visible = q<0.99;
    cp.alpha = 1-sstep(0.55,0.99,q);
    cp.tf = q>0 ? {t:[q*0.44, q*0.90, q*0.16],
                   rot:{axis:[0,0,1], ang:q*0.5, pivot:[capX0(i),CAP_CY,0]}} : null;
    cp.color = mix([176,168,154], mix([176,168,154], coatRGB, 1), clamp((ST.coatX - capX0(i)-0.2)/0.24,0,1));
    cp.gloss = 0.10 + ST.gloss*clamp((ST.coatX - capX0(i)-0.2)/0.24,0,1)*0.4;
  }

  /* --- bedding: old crumbles away, new grows along the ridge --- */
  for(i=0;i<bedOldP.length;i++){
    var ob = bedOldP[i], cr = clamp((1-ST.oldBed)*2.2 - ob.meta.crumble*1.1, 0, 1);
    ob.visible = ST.oldBed>0.01 && cr<0.99;
    ob.alpha = 1-cr;
    ob.tf = cr>0 ? {sc:[1,1-cr*0.85,1], org:[0,0.668,0]} : null;
  }
  for(i=0;i<bedNewP.length;i++){
    var bn = bedNewP[i], si = i % CAP_N;
    q = clamp(ST.newBed*(CAP_N+1.2) - si, 0, 1);
    bn.visible = q>0.01;
    bn.tf = {sc:[q,1,1], org:[bn.pivotX,0,0]};
    k = clamp((ST.coatX - bn.pivotX-0.2)/0.24,0,1);
    bn.color = mix(MAT.bedNew, coatRGB, k*0.85);
  }
  for(i=0;i<pointP.length;i++){
    var pp = pointP[i], si2 = i % CAP_N;
    q = clamp(ST.point*(CAP_N+1.2) - si2, 0, 1);
    pp.visible = q>0.01;
    pp.tf = {sc:[q,1,1], org:[pp.pivotX,0,0]};
    k = clamp((ST.coatX - pp.pivotX-0.2)/0.24,0,1);
    pp.color = mix(MAT.point, mix(coatRGB,[255,255,255],0.18), k);   // pointing gets colour-matched
    pp.gloss = 0.22 + ST.gloss*k*0.3;
  }
}

/* ============================================================
   Renderer
   ============================================================ */
var cv = document.getElementById('tb3d-scene'), ctx = cv.getContext('2d');
var layer = document.getElementById('tb3d-layer');
var VW=0, VH=0, DPR=1;
function resize(){
  var r = cv.getBoundingClientRect();
  DPR = Math.min(window.devicePixelRatio||1, 2);
  var w = Math.max(1,Math.round(r.width)), h = Math.max(1,Math.round(r.height));
  if(w!==VW || h!==VH){ VW=w; VH=h; cv.width=Math.round(w*DPR); cv.height=Math.round(h*DPR); }
}
function hex2rgb(s){
  s=(s||'').trim().replace('#','');
  if(s.length===3) s=s[0]+s[0]+s[1]+s[1]+s[2]+s[2];
  var n=parseInt(s,16); if(isNaN(n)) return [200,200,200];
  return [(n>>16)&255,(n>>8)&255,n&255];
}
/* Scene palette is locked to the site's night navy so the roof materials read as materials. */
var skyA='#16293f', skyB='#050a12', groundRGB=[16,28,45], accentCol='#4dd8ff';

var LIGHT = norm([-0.44,0.80,0.52]);
var cam = {yaw:-0.62, pitch:0.30, dist:4.5, target:[0.35,0.22,0.25]};
var camGoal = {yaw:-0.62, pitch:0.30, dist:4.5, target:[0.35,0.22,0.25]};
var userCam = false;

function xf(v, tf){
  var x=v[0], y=v[1], z=v[2], o, r, u, a, c, s, kk, dx, dy, dz, nx, ny, nz;
  if(tf.sc){ o = tf.org||[0,0,0];
    x=o[0]+(x-o[0])*tf.sc[0]; y=o[1]+(y-o[1])*tf.sc[1]; z=o[2]+(z-o[2])*tf.sc[2]; }
  if(tf.rot){ r=tf.rot; u=norm(r.axis); a=r.ang; c=Math.cos(a); s=Math.sin(a); kk=1-c;
    dx=x-r.pivot[0]; dy=y-r.pivot[1]; dz=z-r.pivot[2];
    nx=(c+u[0]*u[0]*kk)*dx + (u[0]*u[1]*kk-u[2]*s)*dy + (u[0]*u[2]*kk+u[1]*s)*dz;
    ny=(u[1]*u[0]*kk+u[2]*s)*dx + (c+u[1]*u[1]*kk)*dy + (u[1]*u[2]*kk-u[0]*s)*dz;
    nz=(u[2]*u[0]*kk-u[1]*s)*dx + (u[2]*u[1]*kk+u[0]*s)*dy + (c+u[2]*u[2]*kk)*dz;
    x=nx+r.pivot[0]; y=ny+r.pivot[1]; z=nz+r.pivot[2]; }
  if(tf.t){ x+=tf.t[0]; y+=tf.t[1]; z+=tf.t[2]; }
  return [x,y,z];
}

var pool=[], act=[];
function slot(i){
  if(!pool[i]) pool[i]={x:new Float64Array(6), y:new Float64Array(6), np:0, d:0, fill:'', a:1};
  return pool[i];
}

var PX, PY, PD, PDRAW, camPos;
var NEAR = 0.08;
/* Clip a big world polygon (the ground) against the near plane before projecting,
   otherwise a single corner behind the camera drops the whole plane out of the frame. */
function clipToScreen(proj, pts){
  var n = pts.length, ds = [], poly = [], out = [], i, j, A, B, dA, dB, t;
  for(i=0;i<n;i++){ proj(pts[i]); ds.push(PDRAW); }
  for(i=0;i<n;i++){
    j = (i+1)%n; A = pts[i]; B = pts[j]; dA = ds[i]; dB = ds[j];
    if(dA >= NEAR) poly.push(A);
    if((dA >= NEAR) !== (dB >= NEAR)){
      t = (dA-NEAR)/(dA-dB);
      poly.push([A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t]);
    }
  }
  if(poly.length < 3) return null;
  for(i=0;i<poly.length;i++){ proj(poly[i]); if(PD<0) return null; out.push(PX, PY); }
  return out;
}
function tracePoly(flat){
  ctx.beginPath(); ctx.moveTo(flat[0], flat[1]);
  for(var i=2;i<flat.length;i+=2) ctx.lineTo(flat[i], flat[i+1]);
  ctx.closePath();
}
function makeProj(){
  var ky=Math.cos(cam.yaw), sy=Math.sin(cam.yaw), kp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
  var T=cam.target, dist=cam.dist, f=(VH/2)/Math.tan(21*D2R), ox=VW/2, oy=VH/2;
  camPos=[T[0]+dist*kp*sy, T[1]+dist*sp, T[2]+dist*kp*ky];
  return function(v){
    var x=v[0]-T[0], y=v[1]-T[1], z=v[2]-T[2];
    var x1=x*ky - z*sy, z1=x*sy + z*ky;
    var y1=y*kp - z1*sp, z2=y*sp + z1*kp;
    var d=dist - z2;
    PDRAW = d;
    if(d<0.06){ PD=-1; return; }
    PX = ox + f*x1/d; PY = oy - f*y1/d; PD = d;
  };
}
function shadeCol(n, base, gloss, vx, vy, vz){
  var nx=n[0], ny=n[1], nz=n[2];
  if(nx*vx+ny*vy+nz*vz < 0){ nx=-nx; ny=-ny; nz=-nz; }
  var lam = nx*LIGHT[0]+ny*LIGHT[1]+nz*LIGHT[2]; if(lam<0) lam=0;
  var k = 0.30 + 0.17*(0.5+0.5*ny) + 0.60*lam;
  var r=base[0]*k, g=base[1]*k, b=base[2]*k;
  if(gloss>0.01){
    var hx=LIGHT[0]+vx, hy=LIGHT[1]+vy, hz=LIGHT[2]+vz;
    var hl=Math.hypot(hx,hy,hz)||1; hx/=hl; hy/=hl; hz/=hl;
    var sd=nx*hx+ny*hy+nz*hz; if(sd<0) sd=0;
    var sp2 = Math.pow(sd,34)*gloss*165;
    r+=sp2; g+=sp2; b+=sp2;
  }
  return 'rgb('+(r>255?255:r<0?0:r|0)+','+(g>255?255:g<0?0:g|0)+','+(b>255?255:b<0?0:b|0)+')';
}

function paint(){
  resize();
  ctx.setTransform(DPR,0,0,DPR,0,0);
  var grad = ctx.createLinearGradient(0,0,0,VH);
  grad.addColorStop(0, skyA); grad.addColorStop(1, skyB);
  ctx.fillStyle = grad; ctx.fillRect(0,0,VW,VH);

  var proj = makeProj();
  var i, j, k, p, fce, nv;

  /* ground plane + contact shadow, drawn under everything */
  (function(){
    var flat = clipToScreen(proj, ground.verts);
    if(flat){
      tracePoly(flat);
      var gg = ctx.createLinearGradient(0,VH*0.35,0,VH);
      gg.addColorStop(0,'rgb('+(groundRGB[0]*0.82|0)+','+(groundRGB[1]*0.82|0)+','+(groundRGB[2]*0.82|0)+')');
      gg.addColorStop(1,'rgb('+groundRGB[0]+','+groundRGB[1]+','+groundRGB[2]+')');
      ctx.fillStyle = gg; ctx.fill();
    }
    for(var pass=0; pass<2; pass++){
      var e = pass? 0.10 : 0.42, al = pass? 0.20 : 0.09;
      var sh = clipToScreen(proj, [[-WALL_X-e,-1.049,-WALL_Z-e],[WALL_X+e,-1.049,-WALL_Z-e],
                                   [WALL_X+e,-1.049,WALL_Z+e],[-WALL_X-e,-1.049,WALL_Z+e]]);
      if(sh){ tracePoly(sh); ctx.fillStyle='rgba(30,18,8,'+al+')'; ctx.fill(); }
    }
  })();

  /* transform, project, shade, collect */
  var n = 0;
  for(var pi=0; pi<parts.length; pi++){
    p = parts[pi];
    if(!p.visible || p.alpha<=0.015) continue;
    var V=p.verts, Wv=p._w, Sv=p._s, tf=p.tf, behind=false;
    for(i=0;i<V.length;i++){
      Wv[i] = tf ? xf(V[i], tf) : V[i];
      proj(Wv[i]);
      if(PD<0){ behind=true; break; }
      Sv[i*3]=PX; Sv[i*3+1]=PY; Sv[i*3+2]=PD;
    }
    if(behind) continue;
    for(j=0;j<p.faces.length;j++){
      fce = p.faces[j]; nv = fce.v;
      var a=Wv[nv[0]], b=Wv[nv[1]], c=Wv[nv[2]];
      var e1x=b[0]-a[0], e1y=b[1]-a[1], e1z=b[2]-a[2];
      var e2x=c[0]-a[0], e2y=c[1]-a[1], e2z=c[2]-a[2];
      var nx=e1y*e2z-e1z*e2y, ny=e1z*e2x-e1x*e2z, nz=e1x*e2y-e1y*e2x;
      var nl=Math.hypot(nx,ny,nz)||1; nx/=nl; ny/=nl; nz/=nl;
      var cxw=0, cyw=0, czw=0, dsum=0;
      var e = slot(n); e.np = nv.length;
      for(k=0;k<nv.length;k++){
        var w=Wv[nv[k]];
        cxw+=w[0]; cyw+=w[1]; czw+=w[2];
        e.x[k]=Sv[nv[k]*3]; e.y[k]=Sv[nv[k]*3+1]; dsum+=Sv[nv[k]*3+2];
      }
      cxw/=nv.length; cyw/=nv.length; czw/=nv.length;
      var vx=camPos[0]-cxw, vy=camPos[1]-cyw, vz=camPos[2]-czw;
      var vl=Math.hypot(vx,vy,vz)||1; vx/=vl; vy/=vl; vz/=vl;
      e.d = dsum/nv.length;
      e.a = p.alpha;
      e.fill = shadeCol([nx,ny,nz], fce.c||p.color, (fce.gloss===undefined?p.gloss:fce.gloss), vx,vy,vz);
      act[n] = e; n++;
    }
  }
  act.length = n;
  act.sort(function(a,b){ return b.d - a.d; });

  ctx.lineJoin='round'; ctx.lineWidth=1;
  var lastA = 1; ctx.globalAlpha = 1;
  for(i=0;i<n;i++){
    var f2 = act[i];
    if(f2.a !== lastA){ ctx.globalAlpha = f2.a; lastA = f2.a; }
    ctx.beginPath(); ctx.moveTo(f2.x[0], f2.y[0]);
    for(k=1;k<f2.np;k++) ctx.lineTo(f2.x[k], f2.y[k]);
    ctx.closePath();
    ctx.fillStyle = f2.fill; ctx.strokeStyle = f2.fill;
    ctx.fill(); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  drawOverlays(proj);
  return proj;
}

/* ---------- 3D overlays drawn on top: crack, marker ring, string line, dimensions ---------- */
var crackPts = (function(){
  var u0 = brokenTile.meta.cx - 0.11, s0 = brokenTile.meta.sTop;
  return [[u0-0.02,s0+0.03],[u0+0.05,s0+0.12],[u0+0.03,s0+0.19],[u0+0.11,s0+0.27],[u0+0.09,s0+0.33]]
    .map(function(q){ return surf(1,q[0],q[1],0.030); });
})();
var ringPts = (function(){
  var m=brokenTile.meta, o=[];
  o.push(surf(1,m.cx-0.16,m.sTop+0.01,0.038));
  o.push(surf(1,m.cx+0.16,m.sTop+0.01,0.038));
  o.push(surf(1,m.cx+0.16,m.sBot-0.005,0.038));
  o.push(surf(1,m.cx-0.16,m.sBot-0.005,0.038));
  return o;
})();
function polyPath(proj, pts, tf){
  var ok=true;
  ctx.beginPath();
  for(var i=0;i<pts.length;i++){
    proj(tf ? xf(pts[i],tf) : pts[i]);
    if(PD<0){ ok=false; break; }
    i?ctx.lineTo(PX,PY):ctx.moveTo(PX,PY);
  }
  return ok;
}
function drawOverlays(proj){
  ctx.save();
  /* crack in the broken tile */
  if(ST.crack>0.01 && brokenTile.visible){
    ctx.globalAlpha = ST.crack;
    if(polyPath(proj, crackPts, brokenTile.tf)){
      ctx.strokeStyle='rgba(28,18,10,.72)'; ctx.lineWidth=2.4; ctx.lineCap='round'; ctx.stroke();
      ctx.strokeStyle='rgba(255,250,240,.32)'; ctx.lineWidth=0.9; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  /* marker ring while inspecting */
  if(ST.mark>0.01){
    var pulse = 0.55 + 0.45*Math.sin(perf/380);
    ctx.globalAlpha = ST.mark*(0.5+0.5*pulse);
    if(polyPath(proj, ringPts, null)){
      ctx.closePath(); ctx.strokeStyle=accentCol; ctx.lineWidth=2.2; ctx.setLineDash([6,4]); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }
  /* string line across the ridge while setting caps */
  if(ST.line>0.01){
    ctx.globalAlpha = ST.line;
    var y = CAP_CY + CAP_R + 0.055;
    if(polyPath(proj, [[-HALFW-0.22,y,0],[HALFW+0.22,y,0]], null)){
      ctx.strokeStyle=accentCol; ctx.lineWidth=1.6; ctx.stroke();
    }
    [[-HALFW-0.22,y,0],[HALFW+0.22,y,0]].forEach(function(pt){
      proj(pt); if(PD<0) return;
      ctx.beginPath(); ctx.arc(PX,PY,3.2,0,6.284); ctx.fillStyle=accentCol; ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  /* dimension lines in the anatomy step */
  if(ST.cut>0.55){
    ctx.globalAlpha = sstep(0.55,0.9,ST.cut);
    ctx.strokeStyle = accentCol; ctx.lineWidth=1.3;
    dimLine(proj, surf(1,1.16,S0+1*GAUGE+0.021,0.10), surf(1,1.16,S0+2*GAUGE+0.021,0.10));
    var tfD = demoTile.tf;
    if(tfD) dimLine(proj, xf(demoTile.anchorLapA,tfD), xf(demoTile.anchorLapB,tfD));
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function dimLine(proj, a, b){
  proj(a); if(PD<0) return; var ax=PX, ay=PY;
  proj(b); if(PD<0) return; var bx=PX, by=PY;
  var dx=bx-ax, dy=by-ay, l=Math.hypot(dx,dy)||1, px=-dy/l*4.5, py=dx/l*4.5;
  ctx.beginPath();
  ctx.moveTo(ax,ay); ctx.lineTo(bx,by);
  ctx.moveTo(ax+px,ay+py); ctx.lineTo(ax-px,ay-py);
  ctx.moveTo(bx+px,by+py); ctx.lineTo(bx-px,by-py);
  ctx.stroke();
}

/* ============================================================
   Callouts
   ============================================================ */
function ridgeAt(x){ return [x, CAP_CY+CAP_R+0.07, 0.05]; }
function brokenAnchor(){ var m=brokenTile.meta; return surf(1,m.cx,m.sTop-0.13,0.19); }
function lapMid(){
  var tf = demoTile.tf; if(!tf) return [0,0,0];
  var a=xf(demoTile.anchorLapA,tf), b=xf(demoTile.anchorLapB,tf);
  return [(a[0]+b[0])/2+0.06,(a[1]+b[1])/2,(a[2]+b[2])/2];
}
var LABELS = [
 [ {t:"Rafter",       c:"dim", f:0.34, a:function(){return surf(1,-HALFW+0.16+3*0.62,1.30,-0.21);}},
   {t:"Sarking",      c:"dim", f:0.37, a:function(){return surf(1,0.86,1.44,-0.06);}},
   {t:"Batten",       c:"dim", f:0.30, a:function(){return surf(1,0.72,S0+3*GAUGE+0.021,-0.03);}},
   {t:"330 gauge",    c:"",    f:0.52, a:function(){return surf(1,1.20,S0+1.5*GAUGE+0.021,0.11);}},
   {t:"75 head lap",  c:"hot", f:0.54, a:lapMid},
   {t:"Ridge cap",    c:"dim", f:0.06, a:function(){return ridgeAt(-0.55);}} ],

 [ {t:"Cracked tile", c:"hot", f:0.10, a:brokenAnchor},
   {t:"Moss sits in the laps", c:"dim", f:0.02, to:0.52, a:function(){return surf(1,0.75,1.20,0.12);}},
   {t:"Wash it back first",    c:"dim", f:0.30, to:0.96, a:function(){return surf(1,-0.80,1.35,0.12);}} ],

 [ {t:"1 · lift the tile above",        c:"", f:0.01, to:0.24, a:brokenAnchor},
   {t:"2 · unhook the nib, slide it out",c:"", f:0.22, to:0.52, a:brokenAnchor},
   {t:"3 · hook the new tile on",        c:"", f:0.50, to:0.80, a:brokenAnchor},
   {t:"4 · lay the lap back down",       c:"", f:0.78, to:1.01, a:brokenAnchor},
   {t:"New tile won't match yet",  c:"dim", f:0.62, to:1.01, a:function(){return surf(1,brokenTile.meta.cx+0.30,brokenTile.meta.sTop+0.5,0.12);}} ],

 [ {t:"Every cap comes off",             c:"", f:0.04, to:0.60, a:function(){return ridgeAt(0.15);}},
   {t:"Old bed chipped back to the tile",c:"hot", f:0.56, to:1.01, a:function(){return [0.15,0.70,0.30];}} ],

 [ {t:"Fresh bed, both sides",  c:"", f:0.03, to:0.48, a:function(){return [-0.40,0.72,0.26];}},
   {t:"Set to a string line",   c:"hot", f:0.44, to:1.01, a:function(){return ridgeAt(0.30);}} ],

 [ {t:"Flexible pointing over the bed", c:"hot", f:0.04, to:1.01, a:function(){return [0.55,0.70,0.28];}},
   {t:"Both sides, full length",        c:"dim", f:0.35, to:1.01, a:function(){return [-0.30,0.66,0.34];}} ],

 [ {t:"Primer, then two coats", c:"", f:0.04, to:1.01,
    a:function(){ return surf(1, clamp(ST.coatX,-HALFW+0.15,HALFW-0.15), 0.75, 0.22); }} ],

 [ ]
];
var tagPool = [];
function tagAt(i){
  if(!tagPool[i]){ var d=document.createElement('div'); d.className='r3-tag'; layer.appendChild(d); tagPool[i]=d; }
  return tagPool[i];
}
function updateLabels(proj){
  var list = LABELS[step] || [], used = 0;
  for(var i=0;i<list.length;i++){
    var L = list[i];
    var on = prog >= L.f && prog < (L.to===undefined ? 1.01 : L.to);
    var el = tagAt(used); used++;
    if(!on){ el.classList.remove('r3-on'); continue; }
    var pt = L.a(); proj(pt);
    if(PD<0 || PX<-140 || PX>VW+140 || PY<-60 || PY>VH+60){ el.classList.remove('r3-on'); continue; }
    if(el._t !== L.t){ el.textContent = L.t; el._t = L.t; }
    var cls = 'r3-tag r3-on' + (L.c ? ' r3-'+L.c : '');
    if(el.className !== cls) el.className = cls;
    el.style.left = PX.toFixed(1)+'px';
    el.style.top  = PY.toFixed(1)+'px';
  }
  for(var j=used;j<tagPool.length;j++) tagPool[j].classList.remove('r3-on');
}

/* ============================================================
   Chrome: rail, caption, transport, swatches
   ============================================================ */
var rail = document.getElementById('tb3d-rail');
var railBtns = [];
STEPS.forEach(function(s, i){
  var b = document.createElement('button');
  b.className = 'r3-stepbtn'; b.type = 'button';
  b.innerHTML = '<span class="r3-n">'+String(i+1).padStart(2,'0')+'</span>' +
                '<span><span class="r3-t">'+s.t+'</span><span class="r3-d">'+s.d+'</span></span>' +
                '<span class="r3-bar"><i></i></span>';
  b.addEventListener('click', function(){ setStep(i); playing = true; updatePlay(); });
  rail.appendChild(b); railBtns.push(b);
});
var sw = document.getElementById('tb3d-swatches');
COATS.forEach(function(c, i){
  var b = document.createElement('button');
  b.className = 'r3-sw'; b.type = 'button'; b.title = c.name;
  b.setAttribute('aria-label', 'Finish colour: '+c.name);
  b.setAttribute('aria-pressed', i===0 ? 'true':'false');
  b.style.background = 'rgb('+c.rgb[0]+','+c.rgb[1]+','+c.rgb[2]+')';
  b.addEventListener('click', function(){
    coatIdx = i;
    Array.prototype.forEach.call(sw.querySelectorAll('.r3-sw'), function(e,j){ e.setAttribute('aria-pressed', j===i?'true':'false'); });
    if(step < 6){ setStep(6); prog = 1; playing = false; updatePlay(); }
  });
  sw.appendChild(b);
});

var capTitle=document.getElementById('tb3d-capTitle'), capBody=document.getElementById('tb3d-capBody'), capWhy=document.getElementById('tb3d-capWhy');
var playBtn=document.getElementById('tb3d-play'), playTxt=document.getElementById('tb3d-playTxt'), playIcon=document.getElementById('tb3d-playIcon');
var scrub=document.getElementById('tb3d-scrub'), scrubFill=document.getElementById('tb3d-scrubFill'), clock=document.getElementById('tb3d-clock');
var hint=document.getElementById('tb3d-hint'), hintGone=false;
function hideHint(){ if(hintGone) return; hintGone=true; hint.style.opacity='0'; }
setTimeout(hideHint, 6000);

var step=0, prog=0, playing=false, perf=0, lastT=0;
var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setStep(i){
  step = clamp(i, 0, STEPS.length-1);
  prog = 0; userCam = false;
  for(var k=0;k<railBtns.length;k++) railBtns[k].setAttribute('aria-current', k===step ? 'true':'false');
  var s = STEPS[step];
  capTitle.innerHTML = s.t;
  capBody.textContent = s.body;
  capWhy.innerHTML = '<b>'+s.why[0]+'</b>'+s.why[1];
  clock.textContent = (step+1)+' / '+STEPS.length;
  for(var j=0;j<tagPool.length;j++) tagPool[j].classList.remove('r3-on');
}
function updatePlay(){
  playTxt.textContent = playing ? 'Pause' : (step===STEPS.length-1 && prog>=1 ? 'Replay' : 'Play');
  playIcon.innerHTML = playing ? '<path d="M2 1h3v10H2zM7 1h3v10H7z"/>' : '<path d="M2 1l8 5-8 5z"/>';
  playBtn.setAttribute('aria-label', playing ? 'Pause sequence' : 'Play sequence');
}
playBtn.addEventListener('click', function(){
  if(!playing && step===STEPS.length-1 && prog>=1){ setStep(0); }
  playing = !playing; updatePlay();
});
document.getElementById('tb3d-prev').addEventListener('click', function(){
  if(prog>0.12 && playing) prog = 0; else setStep(step-1);
});
document.getElementById('tb3d-next').addEventListener('click', function(){ setStep(step+1); });
document.getElementById('tb3d-reset').addEventListener('click', function(){
  userCam = false;
  var g = STEPS[step].cam;
  cam.yaw=g.yaw; cam.pitch=g.pitch; cam.dist=g.dist;
  cam.target=[g.target[0],g.target[1],g.target[2]];
});

function scrubTo(e){
  var r = scrub.getBoundingClientRect();
  prog = clamp((e.clientX - r.left)/r.width, 0, 1);
  scrub.setAttribute('aria-valuenow', Math.round(prog*100));
}
var scrubbing = false;
scrub.addEventListener('pointerdown', function(e){ scrubbing=true; scrub.setPointerCapture(e.pointerId); scrubTo(e); });
scrub.addEventListener('pointermove', function(e){ if(scrubbing) scrubTo(e); });
scrub.addEventListener('pointerup', function(){ scrubbing=false; });
scrub.addEventListener('keydown', function(e){
  if(e.key==='ArrowRight'){ prog=clamp(prog+0.05,0,1); e.preventDefault(); }
  else if(e.key==='ArrowLeft'){ prog=clamp(prog-0.05,0,1); e.preventDefault(); }
  else if(e.key==='Home'){ prog=0; e.preventDefault(); }
  else if(e.key==='End'){ prog=1; e.preventDefault(); }
});

/* ---------- orbit / zoom ---------- */
var ptrs = {}, pinch0 = 0, dist0 = 0;
cv.addEventListener('pointerdown', function(e){
  cv.setPointerCapture(e.pointerId);
  ptrs[e.pointerId] = {x:e.clientX, y:e.clientY};
  userCam = true; hideHint();
  var ids = Object.keys(ptrs);
  if(ids.length===2){ pinch0 = pdist(ids); dist0 = cam.dist; }
});
function pdist(ids){
  var a=ptrs[ids[0]], b=ptrs[ids[1]];
  return Math.hypot(a.x-b.x, a.y-b.y) || 1;
}
cv.addEventListener('pointermove', function(e){
  var p0 = ptrs[e.pointerId]; if(!p0) return;
  var dx = e.clientX-p0.x, dy = e.clientY-p0.y;
  p0.x = e.clientX; p0.y = e.clientY;
  var ids = Object.keys(ptrs);
  if(ids.length>=2){
    var d = pdist(ids);
    if(pinch0) cam.dist = clamp(dist0 * (pinch0/d), 0.75, 9.5);
    return;
  }
  cam.yaw   -= dx*0.0082;
  cam.pitch  = clamp(cam.pitch - dy*0.0062, -0.12, 1.30);
});
function drop(e){ delete ptrs[e.pointerId]; pinch0 = 0; }
cv.addEventListener('pointerup', drop);
cv.addEventListener('pointercancel', drop);
cv.addEventListener('wheel', function(e){
  e.preventDefault(); userCam = true; hideHint();
  cam.dist = clamp(cam.dist * (1 + (e.deltaY>0 ? 0.10 : -0.10)), 0.75, 9.5);
}, {passive:false});

/* ============================================================
   Loop
   ============================================================ */
function frame(t){
  var dt = lastT ? Math.min(70, t-lastT) : 16;
  lastT = t; perf = t;
  if(!inView){ requestAnimationFrame(frame); return; }

  if(playing && !scrubbing){
    prog += dt / STEPS[step].dur;
    if(prog >= 1){
      if(step < STEPS.length-1){ setStep(step+1); }
      else { prog = 1; playing = false; updatePlay(); }
    }
  }
  var g = STEPS[step].cam;
  if(!userCam){
    var goalYaw = g.yaw + (step===STEPS.length-1 ? prog*1.55 : 0);
    var r = REDUCED ? 1 : (1 - Math.pow(0.0022, dt/1000));
    cam.yaw   = lerp(cam.yaw, goalYaw, r);
    cam.pitch = lerp(cam.pitch, g.pitch, r);
    cam.dist  = lerp(cam.dist, g.dist, r);
    cam.target[0] = lerp(cam.target[0], g.target[0], r);
    cam.target[1] = lerp(cam.target[1], g.target[1], r);
    cam.target[2] = lerp(cam.target[2], g.target[2], r);
  }

  applyState(step, clamp(prog,0,1));
  var proj = paint();
  updateLabels(proj);

  var pc = clamp(prog,0,1)*100;
  scrubFill.style.width = pc.toFixed(1)+'%';
  var activeBar = railBtns[step].querySelector('.r3-bar i');
  if(activeBar) activeBar.style.width = pc.toFixed(1)+'%';

  requestAnimationFrame(frame);
}

setStep(0);
cam.yaw = STEPS[0].cam.yaw; cam.pitch = STEPS[0].cam.pitch;
cam.dist = STEPS[0].cam.dist + 1.6;
cam.target = [STEPS[0].cam.target[0], STEPS[0].cam.target[1], STEPS[0].cam.target[2]];
var inView = true, started = false;
if('IntersectionObserver' in window){
  inView = false;
  new IntersectionObserver(function(es){
    for(var q=0;q<es.length;q++){
      inView = es[q].isIntersecting;
      if(inView && !started){ started = true; playing = !REDUCED; updatePlay(); }
    }
  }, {threshold:0.15}).observe(cv);
} else { playing = !REDUCED; }
updatePlay();
window.addEventListener('resize', resize);
requestAnimationFrame(frame);

})();
