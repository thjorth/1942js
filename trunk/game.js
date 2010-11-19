
window.Game = {
	state: {
		running: false,
		lastTick: 1,
		dTime: 1,
		now: new Date().getTime(),		// current time
		fps: 0
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
	player: {
		vx: 0.0,						// player's horiozontal velocity
		vy: 0.0,						// player's vertical velocity
		x: 320,							// player's x-coordinate
		y: 300,							// player's y-coordinate
		w: 46,							// player's width
		wh: 23,							// half of player's width
		h: 32,							// player's height
		hh: 16,							// half of player's height
		mvh: 250,						// player's max horizontal speed in px/s
		mvv: 250,						// player's max vertical speed in px/s
		lst: new Date().getTime(),		// last shot timestamp
		afp: 300,						// autofire pause - time between autofired shots
		mfp: 100,						// manuel fire pause - lowest possible time between manual shots.
		cfp: 300						// current fire pause - lowest possible time between shots
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
Game.start = function() {
	if (Game.state.running) return;
	
	// setup state and other important stuff
	Game.state.running = true;
	Game.state.lastTick = new Date().getTime();

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
			Game.player.cfp = Game.player.mfp;
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
Game.handleInput = function() {
	Game.player.vx = 0;
	Game.player.vy = 0;
	if (Game.keys.left) Game.player.vx -= Game.player.mvh;
	if (Game.keys.right) Game.player.vx += Game.player.mvh;
	if (Game.keys.up) Game.player.vy -= Game.player.mvv;
	if (Game.keys.down) Game.player.vy += Game.player.mvv;
}
Game.movePlayer = function() {
	Game.player.x += Game.player.vx * (Game.state.dTime / 1000);
	Game.player.y += Game.player.vy * (Game.state.dTime / 1000);
	//console.log(Game.dimensions.w);
	if (Game.player.x + Game.player.wh > Game.dimensions.w) 
		Game.player.x = Game.dimensions.w - Game.player.wh;
	if (Game.player.x - Game.player.wh < 0) 
		Game.player.x = Game.player.wh;
	if (Game.player.y + Game.player.hh > Game.dimensions.h) 
		Game.player.y = Game.dimensions.h - Game.player.hh;
	if (Game.player.y - Game.player.hh < 0) 
		Game.player.y = Game.player.hh;
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
Game.drawPlayer = function() {
	Game.canvas.drawImage(Game.sprites.player, 0, 0, Game.player.w, Game.player.h, Math.round(Game.player.x) - Game.player.wh, Math.round(Game.player.y) - Game.player.hh, Game.player.w, Game.player.h);
}
Game.firePlayer = function() {
	if (Game.keys.fire1) {
		// if longer time than the player's current fire pause has passed since last shot fire a new one
		if (Game.state.now - Game.player.lst > Game.player.cfp) {
			// reset the player's current fire pause to the auto fire pause - this can be reset to the manual fire pause by lifting the fire key
			Game.player.cfp = Game.player.afp;
			// record the current time as the last shot timestamp (lst)
			Game.player.lst = Game.state.now;
			
			// now spawn the new shot
			var shot = Game.queue.newObject("playerBullet");
			shot.x = Game.player.x - 10;
			shot.y = Game.player.y - 10;
			
			shot = Game.queue.newObject("playerBullet");
			shot.x = Game.player.x + 10;
			shot.y = Game.player.y - 10;
		}
	}
}
Game.render = function() {
	Game.drawPlayer();
	Game.queue.draw();
	Game.drawBorder();
}
Game.tick = function() {
	var now = new Date().getTime();
	Game.state.now = now;
	Game.state.dTime = now - Game.state.lastTick;

	Game.handleInput();
	Game.movePlayer();
	Game.firePlayer();
	
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
window.addEventListener('load', function() {
	Game.init();
	Game.initSprites();
	document.getElementById('btnStart').addEventListener('click', Game.start, false);
	document.getElementById('btnStop').addEventListener('click', Game.stop, false);
	
}, false);

