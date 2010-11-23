
Game.Player = function() {
	this.vx = 0.0;						// player's horiozontal velocity
	this.vy = 0.0;						// player's vertical velocity
	this.x = 320;							// player's x-coordinate
	this.y = 300;							// player's y-coordinate
	this.w = 46;							// player's width
	this.wh = 23;							// half of player's width
	this.h = 32;							// player's height
	this.hh = 16;							// half of player's height
	this.mvh = 250;						// player's max horizontal speed in px/s
	this.mvv = 250;						// player's max vertical speed in px/s
	this.lst = new Date().getTime();		// last shot timestamp
	/*
	this.afp = 300;						// autofire pause - time between autofired shots
	this.mfp = 100;						// manuel fire pause - lowest possible time between manual shots.
	this.cfp = 300;						// current fire pause - lowest possible time between shots
	*/
}
Game.Player.prototype = new Game.Object();
Game.Player.prototype.constructor = Game.Player;

Game.Player.prototype.updateValid = function() {
	this.valid = true;
	this.type = "player";
}
Game.Player.prototype.move = function(dt) {
	// handle input
	this.vx = 0;
	this.vy = 0;
	if (Game.keys.left) this.vx -= this.mvh;
	if (Game.keys.right) this.vx += this.mvh;
	if (Game.keys.up) this.vy -= this.mvv;
	if (Game.keys.down) this.vy += this.mvv;

	// fire
	if (Game.keys.fire1) {
		// if longer time than the player's current fire pause has passed since last shot fire a new one
		if (Game.state.now - Game.state.lst > Game.state.cfp) {
			// reset the player's current fire pause to the auto fire pause - this can be reset to the manual fire pause by lifting the fire key
			Game.state.cfp = Game.state.afp;
			// record the current time as the last shot timestamp (lst)
			Game.state.lst = Game.state.now;
			
			// now spawn the new shot
			var shot = Game.queue.newObject("playerBullet");
			shot.x = this.x - 10;
			shot.y = this.y - 10;
			
			shot = Game.queue.newObject("playerBullet");
			shot.x = this.x + 10;
			shot.y = this.y - 10;
		}
	}

	
	// move
	this.x += this.vx * (dt / 1000);
	this.y += this.vy * (Game.state.dTime / 1000);
	//console.log(Game.dimensions.w);
	if (this.x + this.wh > Game.dimensions.w) 
		this.x = Game.dimensions.w - this.wh;
	if (this.x - this.wh < 0) 
		this.x = this.wh;
	if (this.y + this.hh > Game.dimensions.h) 
		this.y = Game.dimensions.h - this.hh;
	if (this.y - this.hh < 0) 
		this.y = this.hh;
}
Game.Player.prototype.draw = function() {
	Game.canvas.drawImage(Game.sprites.player, 0, 0, this.w, this.h, Math.round(this.x) - this.wh, Math.round(this.y) - this.hh, this.w, this.h);
}

/*
// RemotePlayer to be updated from network. Apart from that coordinates are reversed
Game.RemotePlayer = function() {

}
Game.RemotePlayer.prototype = new Game.Player();
Game.RemotePlayer.prototype.constructor = Game.RemotePlayer;


*/




