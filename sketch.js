//Page-3: Avatar Desgin-Online Identity Project//


//variables
let W = 720;
let STAGE_H = 520;
let TRAY_H = 260;
let H = STAGE_H + TRAY_H;

// assests
let bg1, bg2, bg3;
let deco1, deco2, deco3, deco4;
let hair1, hair2;
let currentBG, currentDeco;

// layers
let layers = [];
let selected = null;

// slice
let slicing = false;
let sliceStart = { x: 0, y: 0 };
let sliceEnd   = { x: 0, y: 0 };

// drag
let dragging = false;
let dragOffset = { x: 0, y: 0 };

// UI
let scaleSlider, opacitySlider, rotationSlider;
const PINK = "#ff8ab1";

//images loading//
function preload() {
  // Backgrounds
  bg1 = loadImage("sim-background-1.png");
  bg2 = loadImage("sim-background-2.png");
  bg3 = loadImage("sim-background-3.png");

  // Character decorations
  deco1 = loadImage("character-decoration-1.png");
  deco2 = loadImage("character decoration-2.png");
  deco3 = loadImage("character-decoration-3.png");
  deco4 = loadImage("character-decoration-4.png");

  // Hair designs
  hair1 = loadImage("hair-design-1.png");
  hair2 = loadImage("hair-design-2.png");

  currentBG = bg1;
  currentDeco = deco1;
}

///
function setup() {
  createCanvas(W, H);

  createP("🌸 Dress-UP My Avatar 🌸")
    .style("text-align","center")
    .style("font-size","26px")
    .style("font-weight","800")
    .style("color",PINK);

  // imge- background//
  makeButton("BG 1",()=>currentBG=bg1);
  makeButton("BG 2",()=>currentBG=bg2);
  makeButton("BG 3",()=>currentBG=bg3);
  createP("");
  
//imge-character decoration//
  makeButton("Decor 1",()=>currentDeco=deco1);
  makeButton("Decor 2",()=>currentDeco=deco2);
  makeButton("Decor 3",()=>currentDeco=deco3);
  makeButton("Decor 4",()=>currentDeco=deco4);
  createP("");

//imge-hair//
  makeButton("Hair 1",()=>currentDeco=hair1);
  makeButton("Hair 2",()=>currentDeco=hair2);
  createP("");

//sliders//
  scaleSlider = addSlider("Scale",0.1,5,1,0.01,v=>{
    if(selected) selected.scale=v;
  });

  rotationSlider = addSlider("Rotation",-180,180,0,1,v=>{
    if(selected) selected.rot = radians(v);
  });

  opacitySlider = addSlider("Opacity",0,255,255,1,v=>{
    if(selected) selected.opacity=v;
  });

  createP("");

//actions//
  makeButton("🗑 Delete", deleteSelected);
  makeButton("🔄 Reset", resetAll);
  makeButton("💾 Save PNG", saveAvatar);
}

//draw//
function draw() {
  clear();	
for (let y = 0; y < H; y++) {
  let inter = map(y, 0, H, 0, 1);
  let c = lerpColor(color(70,130,180), color(255,255,255), inter); 
  stroke(c);
  line(0, y, W, y);
}
  imageMode(CORNER);
  image(currentBG,0,0,W,STAGE_H);

  layers.forEach(drawLayer);
  if(selected) drawSelection(selected);

  drawTray();
  if(slicing) drawSlice();
}

//Decoration/hair//
function drawTray() {
  let tw=420, th=220;
  let tx=(W-tw)/2;
  let ty=STAGE_H+20;
  imageMode(CENTER);
  image(currentDeco, tx+tw/2, ty+th/2, tw, th); // CENTER
}

//
function mousePressed() {
  // Slice from tray
  if (mouseY > STAGE_H) {
    slicing = true;
    sliceStart = { x: mouseX, y: mouseY };
    sliceEnd   = { x: mouseX, y: mouseY };
    return;
  }

  // Select existing layers
  selected = null;
  for (let i = layers.length - 1; i >= 0; i--) {
    if (hit(layers[i], mouseX, mouseY)) {
      selected = layers[i];
      dragging = true;
      dragOffset.x = mouseX - selected.x;
      dragOffset.y = mouseY - selected.y;

      scaleSlider.value(selected.scale);
      opacitySlider.value(selected.opacity);
      rotationSlider.value(degrees(selected.rot));
      return;
    }
  }
}

function mouseDragged() {
  if (slicing) {
    sliceEnd = { x: mouseX, y: mouseY };
    return;
  }

  if (selected && dragging) {
    selected.x = mouseX - dragOffset.x;
    selected.y = mouseY - dragOffset.y;
  }
}

function mouseReleased() {
  dragging = false;
  if (slicing) {
    slicing = false;
    createSlice();
  }
}

//slicing//
function drawSlice() {
  push();
  noFill();
  stroke(PINK);
  strokeWeight(2);
  rectMode(CORNERS);
  rect(sliceStart.x,sliceStart.y,sliceEnd.x,sliceEnd.y);
  pop();
}

function createSlice() {
  let tw=420, th=220;
  let tx=(W-tw)/2;
  let ty=STAGE_H+20;

  let x=min(sliceStart.x,sliceEnd.x);
  let y=min(sliceStart.y,sliceEnd.y);
  let w=abs(sliceEnd.x-sliceStart.x);
  let h=abs(sliceEnd.y-sliceStart.y);
  if(w<10||h<10) return;

  let sx=map(x,tx,tx+tw,0,currentDeco.width);
  let sy=map(y,ty,ty+th,0,currentDeco.height);
  let sw=map(w,0,tw,0,currentDeco.width);
  let sh=map(h,0,th,0,currentDeco.height);

  let img=currentDeco.get(sx,sy,sw,sh);
  makeLayer(img);
}

//Layers//
function makeLayer(img) {
  img.loadPixels();
  for(let i=0;i<img.pixels.length;i+=4){
    let r=img.pixels[i],g=img.pixels[i+1],b=img.pixels[i+2];
    if(r>230 && g>230 && b>230) img.pixels[i+3]=0; // WHITE CUT
  }
  img.updatePixels();

  let L={
    img:img,
    x:W/2,          // CENTER
    y:STAGE_H/2,    // CENTER
    w:img.width,
    h:img.height,
    scale:1,
    rot:0,
    opacity:255
  };

  layers.push(L);
  selected=L;
}

//Drawlayer//
function drawLayer(L) {
  push();
  translate(L.x,L.y);
  rotate(L.rot);
  tint(255,L.opacity);
  imageMode(CENTER);
  image(L.img,0,0,L.w*L.scale,L.h*L.scale);
  noTint();
  pop();
}

function drawSelection(L){
  push();
  translate(L.x,L.y);
  rotate(L.rot);
  noFill();
  stroke(PINK);
  rectMode(CENTER);
  rect(0,0,L.w*L.scale+8,L.h*L.scale+8);
  pop();
}

function hit(L,x,y){
  let dx=x-L.x, dy=y-L.y;
  let s=sin(-L.rot), c=cos(-L.rot);
  let lx=c*dx - s*dy;
  let ly=s*dx + c*dy;
  return abs(lx)<L.w*L.scale/2 &&
         abs(ly)<L.h*L.scale/2;
}

//actions//
function deleteSelected(){
  if(!selected) return;
  layers = layers.filter(l => l !== selected);
  selected = null;
}

function resetAll(){
  layers = [];
  selected = null;
}

function saveAvatar(){
  saveCanvas("my-avatar","png");
}

//UI//
function makeButton(t,f){
  let b=createButton(t);
  b.mousePressed(f);
  b.style("margin","4px");
  b.style("background",PINK);
  b.style("color","#fff");
  b.style("border","none");
  b.style("padding","6px 12px");
  b.style("border-radius","8px");
}

function addSlider(t,min,max,val,step,f){
  createSpan(t+" ");
  let s=createSlider(min,max,val,step);
  s.input(()=>f(s.value()));
  return s;
}












