function addBodyMenu(body) {
  var newBodyMenu = $("#templates").find(".body-menu").first().clone();

  $(newBodyMenu).find(".name-textbox").val(body.name);
  $(newBodyMenu).find(".color-textbox").val(body.color);
  $(newBodyMenu).find(".radius-textbox").val(body.radius);
  $(newBodyMenu).find(".mass-textbox").val(body.mass);
  $(newBodyMenu).find(".pos-x-textbox").val(body.pos[0]);
  $(newBodyMenu).find(".pos-y-textbox").val(body.pos[1]);
  $(newBodyMenu).find(".vel-x-textbox").val(body.pos[0]);
  $(newBodyMenu).find(".vel-y-textbox").val(body.pos[1]);

  $(newBodyMenu).find(".body-menu-save-edit").click(function(){
    if(ticker != null) {return;}

    var icon = event.target;
    if($(event.target).is("button")) {
      icon = $(event.target).find("i");
    }
    bodyMenu = $(".body-menu").has(icon);
    if($(icon).hasClass("fa-save")) {
      if(inputIsValid($(".body-menu").has(icon))) {
        $(icon).removeClass("fa-save");
        $(icon).addClass("fa-edit");
        $(bodyMenu).find(":text").prop("disabled", true);
        $(bodyMenu).find(".body-delete-button").prop("disabled", true);
        updateBodiesFromInput();
      }
    } else {
      $(icon).removeClass("fa-edit");
      $(icon).addClass("fa-save");
      $(bodyMenu).find(":text").prop("disabled", false);
      $(bodyMenu).has(icon).find(".body-delete-button").prop("disabled", false);
    }
  });

  $(newBodyMenu).find(".body-delete-button").click(function() {
    if(ticker != null) {return;}

    $(".body-menu").has(event.target).remove();
    updateBodiesFromInput();
  });

  $("#body-list").append(newBodyMenu);
}

function inputIsValid(bodyMenu) {
  if(!$(bodyMenu).find(".color-textbox").val().match(/[0-9a-fA-F]{6}/g)) { return false; }
  if(isNaN($(bodyMenu).find(".radius-textbox").val())) { return false; }
  if(isNaN($(bodyMenu).find(".mass-textbox").val())) { return false; }
  if(isNaN($(bodyMenu).find(".pos-x-textbox").val())) { return false; }
  if(isNaN($(bodyMenu).find(".pos-y-textbox").val())) { return false; }
  if(isNaN($(bodyMenu).find(".vel-x-textbox").val())) { return false; }
  if(isNaN($(bodyMenu).find(".vel-y-textbox").val())) { return false; }
  return true;
}

function updateBodyMenu(body) {
  bodyMenu = $(".body-menu").filter(function(i, e) { return $(e).find(".name-textbox").val() == body.name});
  $(bodyMenu).find(".pos-x-textbox").val(body.pos[0]);
  $(bodyMenu).find(".pos-y-textbox").val(body.pos[1]);
  $(bodyMenu).find(".vel-x-textbox").val(body.vel[0]);
  $(bodyMenu).find(".vel-y-textbox").val(body.vel[1]);
}

function updateBodiesFromInput() {
  bodyMenus = $(".body-menu");
  bodies = [];
  for(var i = 0; i < bodyMenus.length; i++) {
    bodies.push({
       name: bodyMenus.eq(i).find(".name-textbox").val(),
       color: bodyMenus.eq(i).find(".color-textbox").val(),
       radius: Number(bodyMenus.eq(i).find(".radius-textbox").val()),
       mass: Number(bodyMenus.eq(i).find(".mass-textbox").val()),
       pos: [Number(bodyMenus.eq(i).find(".pos-x-textbox").val()), Number(bodyMenus.eq(i).find(".pos-y-textbox").val())],
       vel: [Number(bodyMenus.eq(i).find(".vel-x-textbox").val()), Number(bodyMenus.eq(i).find(".vel-y-textbox").val())],
    });
  }
  updateCanvas();
}

$(document).ready(function() {
  for(var i = 0; i < bodies.length; i++) {
    addBodyMenu(bodies[i]);
  }

  $("#new-body-button").click(function() {
    if(ticker != null) {return;}

    var newBody = {
      name: "new body",
      color: "555555",
      radius: 10,
      mass: 1.0,
      pos: [0.0, 0.0],
      vel: [0.0, 0.0]
     }
     bodies.push(newBody);
     addBodyMenu(newBody);
     updateCanvas();
  });

  $("#pause-play-button").click(function() {
    var icon = event.target;
    if($(event.target).is("button")) {
      icon = $(event.target).find("i");
    }
    if($(icon).hasClass("fa-pause")) {
      postTickHandler = function() {
        clearInterval(ticker);
        ticker = null;
        $(icon).removeClass("fa-pause");
        $(icon).addClass("fa-play");
      };
    } else {
      if(!$(".body-menu-save-edit").find(".fa-save").length) {
        $(icon).removeClass("fa-play");
        $(icon).addClass("fa-pause");
        startTicker();
      }
    }
  });

  $("#zoom-out-button").click(function() {
    postTickHandler = function() {
      zoomCoef *= 0.5;
    };
  });

  $("#zoom-in-button").click(function() {
    postTickHandler = function() {
      zoomCoef *= 2;
    };
  });

  $("#fast-button").click(function() {
    postTickHandler = function() {
      dt *= 2;
    };
  });

  $("#slow-button").click(function() {
    postTickHandler = function() {
      dt *= 0.5;
    };
  });

  $(".preset-button").click(function() {
    var preset = $(event.target).data("preset");
    var newBodies = [];
    var newDt = 1.0;
    var newCameraPos = [0.0, 0.0];
    var newZoomCoef = 1.0;
    if(preset === "sun-earth-moon") {
      newBodies.push({
         name: "Sun",
         color: "FFFF00",
         radius: AU/8,
         mass: SOLAR_MASS,
         pos: [0.0, 0.0],
         vel: [0.0, 0.0]
      });
      newBodies.push({
         name: "Earth",
         color: "0000FF",
         radius: AU/32,
         mass: EARTH_MASS,
         pos: [AU, 0.0],
         vel: [0.0, -29780.0]
      });
      newBodies.push({
         name: "Moon",
         color: "555555",
         radius: AU/64,
         mass: 7.342e22,
         pos: [AU - 385000000.0, 0.0],
         vel: [0.0, -29780.0 + 1022.0]
      });
      newZoomCoef = 512.0/(2.5*AU);
      newDt = 8192.0;
    } else if(preset === "4-body-tango") {
      newBodies.push({
         name: "A",
         color: "FF0000",
         radius: 4,
         mass: 250/G,
         pos: [0.0, -100.0],
         vel: [-1.25, 0.0]
      });
      newBodies.push({
         name: "B",
         color: "0000FF",
         radius: 4,
         mass: 250/G,
         pos: [0.0, 100.0],
         vel: [1.25, 0.0]
      });
      newBodies.push({
         name: "C",
         color: "00FF00",
         radius: 4,
         mass: 250/G,
         pos: [100.0, 0.0],
         vel: [0.0, -1.25]
      });
      newBodies.push({
         name: "D",
         color: "FFFF00",
         radius: 4,
         mass: 250/G,
         pos: [-100.0, 0.0],
         vel: [0.0, 1.25]
      });
      newZoomCoef = 2.0;
    } else if(preset === "double-sun") {
      newBodies.push({
         name: "Sun A",
         color: "FF0000",
         radius: 8,
         mass: 500/G,
         pos: [0.0, 30.0],
         vel: [2.0, 0.0]
      });
      newBodies.push({
         name: "Sun B",
         color: "FFFF00",
         radius: 8,
         mass: 500/G,
         pos: [0.0, -30.0],
         vel: [-2.0, 0.0]
      });
      newBodies.push({
         name: "Planet",
         color: "00FF00",
         radius: 2,
         mass: 0.01/G,
         pos: [200.0, 0.0],
         vel: [0.0, -2.25]
      });
    } else if(preset === "figure-eight") {
      newBodies.push({
         name: "A",
         color: "FF0000",
         radius: 4,
         mass: 100/G,
         pos: [-97.000436, 24.308753],
         vel: [-0.466203685, -0.43236573]
      });
      newBodies.push({
         name: "B",
         color: "00FF00",
         radius: 4,
         mass: 100/G,
         pos: [97.000436, -24.308753],
         vel: [-0.466203685, -0.43236573]
      });
      newBodies.push({
         name: "C",
         color: "0000FF",
         radius: 4,
         mass: 100/G,
         pos: [0.0, 0.0],
         vel: [0.93240737, 0.86473146]
      });
      newZoomCoef = 2.0;
    }
    postTickHandler = function() {
      bodies = newBodies;
      dt = newDt;
      cameraPos = newCameraPos;
      zoomCoef = newZoomCoef;
      $("#body-list").empty();
      for(var i = 0; i < bodies.length; i++) {
        addBodyMenu(bodies[i]);
      }
      updateCanvas();
    };
  });

  $("#bodies-tab-link").click(function() {
    $("#bodies-tab-link").addClass("active");
    $("#presets-tab-link").removeClass("active");
    $("#bodies-tab").show();
    $("#presets-tab").hide();
  });
  $("#presets-tab-link").click(function() {
    $("#presets-tab-link").addClass("active");
    $("#bodies-tab-link").removeClass("active");
    $("#presets-tab").show();
    $("#bodies-tab").hide();
  });
});
