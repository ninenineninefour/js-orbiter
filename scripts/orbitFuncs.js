// example body:
// var exampleBody = {
//  name: "example body",
//  color: "000000",
//  mass: 1.0,
//  pos: [0.0, 0.0],
//  vel: [0.0, 0.0]
// }

const G = 6.67430e-11; // gravitational constant in MKS units
const SOLAR_MASS = 1.98847e30; // mass of sun in kg
const EARTH_MASS = 5.9722e24; // mass of earth in kg
const AU = 149597870700.0; // 1 AU in meters

function gravitate(body1, body2, dt) {
  // get displacement from body1 to body2
  var disp = subVecs(body2.pos, body1.pos);
  // get the distance
  var dist = vecLength(disp);
  // get the common coefficient of both velocity changes
  var coef = dt*G/(dist*dist*dist);
  // now apply the changes to velocity of both bodies
  // it's subtracted from body2 since the displacement for it is opposite of body1
  body1.vel = addVecs(body1.vel, mulVec(disp, coef*body2.mass));
  body2.vel = subVecs(body2.vel, mulVec(disp, coef*body1.mass));
}

function updateBody(body, dt) {
  body.pos = addVecs(body.pos, mulVec(body.vel, dt));
}

// vector math helper functions
function addVecs(a, b) {
  var sum = [];
  for(var i = 0; i < a.length; i++) {
    sum.push(a[i] + b[i]);
  }
  return sum;
}
function subVecs(a, b) {
  var sub = [];
  for(var i = 0; i < a.length; i++) {
    sub.push(a[i] - b[i]);
  }
  return sub;
}
function mulVec(a, k) {
  var prod = [];
  for(var i = 0; i < a.length; i++) {
    prod.push(a[i]*k);
  }
  return prod;
}
function vecLength(a) {
  var length = 0;
  for (var i = 0; i < a.length; i++) {
    length += a[i]*a[i];
  }
  return Math.sqrt(length);
}
