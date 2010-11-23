
window.Game = {
	state: {
		running: false,
		lastTick: 1,
		dTime: 1,
		now: new Date().getTime(),		// current time
		fps: 0,
		lst: 0,
		afp: 300,						// autofire pause - time between autofired shots
		mfp: 100,						// manuel fire pause - lowest possible time between manual shots.
		cfp: 300						// current fire pause - lowest possible time between shots
	},
	dimensions: {
		w: 100,
		h: 100
	},
	keys: {
		left: false,
		right: false,
		up: false,
		down: false,
		fire1: false,
		fire2: false
	},
	viewport: null,
	activeBuf: null,
	visibleBuf: null,
	canvas: null,				// this will always point to the canvas' drawing context where all drawing operations should be performed
	overlay: null
}
Game.vector = { 
	x: 0,
	y: 0
}
Game.initSprites = function() {
	Game.sprites = {}
	Game.sprites.player = new Image();
	Game.sprites.player.src = "img/player-sprite.png";
}
Game.init = function() {
	Game.viewport = document.getElementById("viewport");
	Game.overlay = document.getElementById("overlay");
	
	Game.dimensions.w = Game.viewport.clientWidth;
	Game.dimensions.h = Game.viewport.clientHeight;
	Game.overlay.style.width = Game.dimensions.w + "px";
	
	// setup the two screen buffers
	Game.activeBuf = document.getElementById("buffer1");
	Game.visibleBuf = document.getElementById("buffer2");
	
	// now configure the dimensions of the buffers
	Game.activeBuf.width = Game.visibleBuf.width = Game.dimensions.w;
	Game.activeBuf.height = Game.visibleBuf.height = Game.dimensions.h;
	Game.activeBuf.style.width = Game.visibleBuf.style.width = Game.dimensions.w + "px";
	Game.activeBuf.style.height = Game.visibleBuf.style.height = Game.dimensions.h + "px";
	
	Game.activeBuf._canvas = Game.activeBuf.getContext("2d");
	Game.visibleBuf._canvas = Game.visibleBuf.getContext("2d");
}
Game.start = function () {

    
	if (Game.state.running) return;
	
	// setup state and other important stuff
	Game.state.running = true;
	Game.state.lastTick = new Date().getTime();

	// setup the player
	var player = Game.queue.newObject("player");
	
	// setup keyboard handler
	window.addEventListener("keydown", Game.keydown, false);
	window.addEventListener("keyup", Game.keyup, false);

	// do a one time blit to get everything setup
	Game.blit();
	// now start the game main loop
	Game.tick();
}
Game.stop = function() {
	if (!Game.state.running) return;
	
	Game.state.running = false;
	window.removeEventListener("keydown", Game.keydown, false);
	window.removeEventListener("keyup", Game.keyup, false);
}
Game.keydown = function(e) {
	//console.log("d: " + e.keyCode);
	var retval = true;
	switch (e.keyCode)
	{
		case 37:
			Game.keys.left = true;
			retval = false;
			break;
		case 38:
			Game.keys.up = true;
			retval = false;
			break;
		case 39:
			Game.keys.right = true;
			retval = false;
			break;
		case 40:
			Game.keys.down = true;
			retval = false;
			break;
		case 17:
			Game.keys.fire1 = true;
			retval = false;
			break;
		case 16:
			Game.keys.fire2 = true;
			retval = false;
			break;
	}
	if (!retval) {
		e.stopPropagation();
	}
	return retval;
}
Game.keyup = function(e) {
	//console.log("u: " + e.keyCode);
	var retval = true;
	switch (e.keyCode)
	{
		case 37:
			Game.keys.left = false;
			retval = false;
			break;
		case 38:
			Game.keys.up = false;
			retval = false;
			break;
		case 39:
			Game.keys.right = false;
			retval = false;
			break;
		case 40:
			Game.keys.down = false;
			retval = false;
			break;
		case 17:
			Game.keys.fire1 = false;
			Game.state.cfp = Game.state.mfp;
			retval = false;
			break;
		case 16:
			Game.keys.fire2 = false;
			retval = false;
			break;
	}
	if (!retval) {
		e.stopPropagation();
	}
	return retval;
}
Game.displayFps = function() {
	Game.state.fps = ((Game.state.fps * 40) + 1000 / Game.state.dTime) / 41;
	Game.overlay.innerHTML = Game.state.fps;
}
Game.blit = function() {
	// switch the buffers around
	var tmp = Game.visibleBuf;
	Game.visibleBuf = Game.activeBuf;
	Game.activeBuf = tmp;
	Game.visibleBuf.style.visibility = "visible";
	Game.activeBuf.style.visibility = "hidden";
	// get the new active drawing context
	Game.canvas = Game.activeBuf._canvas;
	// clear the active (drawing) buffer
	//Game.canvas.clearRect(0, 0, 640, 480);
	Game.canvas.fillStyle = "#55f";
	Game.canvas.fillRect(0, 0, Game.dimensions.w, Game.dimensions.h);
}
Game.drawBorder = function() {
	Game.canvas.strokeStyle = "#000";
	Game.canvas.lineWidth = 4;
	Game.canvas.strokeRect(0, 0, Game.dimensions.w, Game.dimensions.h);
}

Game.render = function() {
	//Game.drawPlayer();
	Game.queue.draw();
	Game.drawBorder();
}
Game.tick = function() {
	var now = new Date().getTime();
	Game.state.now = now;
	Game.state.dTime = now - Game.state.lastTick;

	// move all non-player objects
	Game.queue.move(Game.state.dTime);
	
	Game.displayFps();
	
	Game.render();
	
	// switch the buffers around
	Game.blit();
	
	if (Game.state.running) {
		Game.state.lastTick = now;
		window.setTimeout(Game.tick, 10);
	}
}

// load the sprites
window.addEventListener('load', function () {
    Game.init();
    Game.initSprites();
    document.getElementById('btnStart').addEventListener('click', Game.start, false);
    document.getElementById('btnStop').addEventListener('click', Game.stop, false);

    document.getElementById('start').addEventListener('ended', function () {
        document.getElementById('title').play();
    }, false);

    document.getElementById('start').play();
}, false);

