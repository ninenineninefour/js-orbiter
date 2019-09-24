var c = document.getElementById("orbiter-canvas");
var ctx = c.getContext("2d");

var bodies = [];

bodies.push({
   name: "Sun",
   color: "FFFF00",
   radius: AU/8,
   mass: SOLAR_MASS,
   pos: [0.0, 0.0],
   vel: [0.0, 0.0]
});
bodies.push({
   name: "Earth",
   color: "0000FF",
   radius: AU/32,
   mass: EARTH_MASS,
   pos: [AU, 0.0],
   vel: [0.0, -29780.0]
});
bodies.push({
   name: "Moon",
   color: "555555",
   radius: AU/64,
   mass: 7.342e22,
   pos: [AU - 385000000.0, 0.0],
   vel: [0.0, -29780.0 + 1022.0]
});

var tickTime = 1000.0/60; // 60fps

var dt = 8192.0;

var cameraPos = [0,0]; // coordinates of the upper left corner of the canvas
var zoomCoef = 512.0/(2.5*AU); // zoom level

function toCanvasCoords(x) {
  return [x[0]*zoomCoef - cameraPos[0] + ctx.canvas.width/2, x[1]*zoomCoef - cameraPos[1] + ctx.canvas.height/2];
}

function updateCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for(var i = 0; i < bodies.length; i++) {
    canvasCoords = toCanvasCoords(bodies[i].pos);
    ctx.beginPath();
    ctx.arc(canvasCoords[0], canvasCoords[1], bodies[i].radius*zoomCoef, 0, 2*Math.PI);
    ctx.fillStyle = "#" + bodies[i].color;
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#000000";
  ctx.font = "15px Arial";
  ctx.fillText("Speed: " + dt/tickTime + "x", 5, 20);
}

function tickSim() {
  for(var i = 0; i < bodies.length; i++) {
    for(var j = i+1; j < bodies.length; j++) {
      gravitate(bodies[i], bodies[j], dt);
    }
  }
  for(var i = 0; i < bodies.length; i++) {
    updateBody(bodies[i], dt);
    updateBodyMenu(bodies[i]);
  }
}

updateCanvas();

var postTickHandler = function() {
  return;
};

var ticker = null;

function startTicker() {
  ticker = setInterval(function() {
    tickSim();
    updateCanvas();
    postTickHandler();
    postTickHandler = function() {
      return;
    }
  }, tickTime);
}

startTicker();
