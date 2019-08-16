
let grid_res = 120;
let grid = [];
let p1;
let nz_idx = 1000;
let ps = new Array(55).fill(0).map(() => ({}));

function setup() {
  // put setup code here
  createCanvas(600,600);
  colorMode(HSB);
  grid = init_grid(grid_res);
  p1 = new Vehicle(300, 210);
  console.log("PS Before:", ps);
  ps = ps.map(function(p,i,a) {
    return new Vehicle(random(width), random(height));
  });
  console.log("PS After:", ps);
}

function draw() {
 //noLoop();
  background(0, 0, 100, .06);

  grid = upd_grid(grid, noise(nz_idx));  
  //loop through new grid
  //get cell index and value
  //grid.map((v, i) => v.map((v2, i2) => console.log(v2 + "\nIndex: " + i + ":" + i2)));

  //display grid
 // grid.map((v, i) => v.map((v2, i2) => draw_fld(i,i2,v2,15)));
  
  //console.log(new_grid[9][0]);
  
  
  //console.log(r,c,f.x,f.y);
  
  p1.add_frc(p1.get_curr_frc(grid, grid_res));
  p1.update();
  p1.display();
  p1.check_edges();

  //ps[0].add_frc(createVector(5,5));
  //ps.map((p, i) => console.log(i + ":\n" + p));
  ps.map((p, i, a) => {p.add_frc(p.get_curr_frc(grid, grid_res))});
  ps.map((p, i, a) => {p.update()});
  ps.map((p, i, a) => {p.display()});
  ps.map((p, i, a) => {p.check_edges()});

  //console.log(p1.loc.x, p1.loc.y, p1.vel.x, p1.vel.y);
  nz_idx += 0.05;
}

//create initial grid
function init_grid(gsize) {
  return Array.from(Array(gsize), _ => Array(gsize).fill(0));
}

//update cell in grid
function upd_cell(x, y, nz) {
  let v = noise(x/5*nz, y/5*nz, nz) * (randomGaussian() * 0.01 + 1) * Math.PI * 2;
  if(random() < 0.02) {
    v = v*-1;
  }
  return v;
}

//update grid
function upd_grid(grid, nz) {
  let new_grid = grid.map((x,r) => x.map((y,c) => upd_cell(r, c, nz)));
  return new_grid
}

function translate_cell_coords(x, y, res) {
  sz = width/res;
  new_x = x * sz;
  new_y = y * sz;
  return {x: new_x, y: new_y};
}

function draw_fld(x, y, v, m){
  //value = radians, magnitude
  let pt = translate_cell_coords(x, y, grid_res);
  push();
    translate(pt.x, pt.y);
    let endx = cos(v) * m;
    let endy = sin(v) * m;
    stroke(100,10,60,.4);
    line(0,0, endx, endy);
  pop();
}

function Vehicle(x,y) {
  this.loc = createVector(x,y);
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  
  this.get_curr_cell = function(grid_res) {
    let c = Math.round(this.loc.x / grid_res);
    let r = Math.round(this.loc.y / grid_res);
    return {col: c, row: r};
  }

  this.add_frc = function(frc) {
    this.acc.add(frc);
     //p5.Vector.add(frc, this.acc); 
  }
  
  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(2)
    this.loc.add(this.vel);
    this.acc.mult(0);
  }

  this.check_edges = function() {
    if(this.loc.x < 0) {
      console.log("w: < 0");
      this.loc.x = width
    }
    if(this.loc.x > width) {
      console.log("w: > w");
      this.loc.x = 0
    }
    if(this.loc.y < 0) {
      console.log("h: < 0");
      this.loc.y = height
    }
    if(this.loc.y > height) {
      console.log("h: < h");
      this.loc.y = 0
    }
  }//check edges

  this.get_curr_frc = function(grid, grid_res) {
    let {row: r, col: c} = this.get_curr_cell(grid_res);
    let f = createVector(cos(grid[r][c])*.5, sin(grid[r][c])*.5);
    return f;
  }

  this.display = function() {
    fill(360,100,100,.4);
    noStroke();
    ellipse(this.loc.x, this.loc.y, 4, 4);
  }

}

// Array(10).fill([...Array(10).keys()]);
// [...Array(10).keys()].map(x => Array(10).fill(0))
// a = Array(5).fill(0).map(x => Array(10).fill(0))

// function make_grid() {
//   Array(10).fill([...Array(10).keys()]);
// }

// function calculateField(cols, rows, nz) {
//   for(let x = 0; x < cols; x++) {
//     for(let y = 0; y < rows; y++) {
//       let angle = noise(x, y, nz) * Math.PI * 2;
//       field[x][y] = angle;
//     }
//   }
// }