
window.Game = {
	state: {
		running: false,
		lastTick: 1,
		dTime: 1,
		fps: 0
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
		vx: 0.0,				// player's horiozontal velocity
		vy: 0.0,				// player's vertical velocity
		x: 320,					// player's x-coordinate
		y: 300,					// player's y-coordinate
		w: 46,					// player's width
		wh: 23,					// half of player's width
		h: 32,					// player's height
		hh: 16,					// half of player's height
		mvh: 250,				// player's max horizontal speed in px/s
		mvv: 250				// player's max vertical speed in px/s
	},
	viewport: null,
	activeBuf: null,
	visibleBuf: null,
	canvas: null,				// this will always point to the canvas' drawing context where all drawing operations should be performed
	overlay: null
};
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
	
	// setup the two screen buffers
	Game.activeBuf = document.getElementById("buffer1");
	Game.visibleBuf = document.getElementById("buffer2");
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
	switch (e.keyCode)
	{
		case 37:
			Game.keys.left = true;
			break;
		case 38:
			Game.keys.up = true;
			break;
		case 39:
			Game.keys.right = true;
			break;
		case 40:
			Game.keys.down = true;
			break;
		case 17:
			Game.keys.fire1 = true;
			break;
		case 16:
			Game.keys.fire2 = true;
			break;
	}
}
Game.keyup = function(e) {
	//console.log("u: " + e.keyCode);
	switch (e.keyCode)
	{
		case 37:
			Game.keys.left = false;
			break;
		case 38:
			Game.keys.up = false;
			break;
		case 39:
			Game.keys.right = false;
			break;
		case 40:
			Game.keys.down = false;
			break;
		case 17:
			Game.keys.fire1 = false;
			break;
		case 16:
			Game.keys.fire2 = false;
			break;
	}
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
	if (Game.player.vx != 0 || Game.player.vy != 0)
	{
		//console.log("x = " + Game.player.x + ", y = " + Game.player.y);
	}
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
	Game.canvas.fillRect(0, 0, 640, 480);
}
Game.drawBorder = function() {
	Game.canvas.strokeStyle = "#000";
	Game.canvas.lineWidth = 4;
	Game.canvas.strokeRect(0, 0, 640, 480);
}
Game.drawPlayer = function() {
	Game.canvas.drawImage(Game.sprites.player, 0, 0, Game.player.w, Game.player.h, Math.round(Game.player.x) - Game.player.wh, Math.round(Game.player.y) - Game.player.hh, Game.player.w, Game.player.h);
}
Game.tick = function() {
	var now = new Date().getTime();
	Game.state.dTime = now - Game.state.lastTick;

	Game.handleInput();
	Game.movePlayer();
	
	Game.displayFps();
	
	Game.drawBorder();
	Game.drawPlayer();
	
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

