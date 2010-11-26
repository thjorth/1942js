/*global Game*/
Game.Object = function () {
  this.x = -100;
  this.y = -100;
  this.w = 2;				// width
  this.h = 2;				// height
  this.wh = 1;				// half of the width - to save a division
  this.hh = 1;				// half of the height - to save a division
  this.vx = 0;				// velocity x-component
  this.vy = 0;				// velocity y-component
  this.bt = new Date().getTime();	// born time - timestamp of when the object was "born"
  this.gType = "sprite";		// the graphics type - "sprite" or "vector" most likely deprecated
  this.sprite = null;			// a reference to the sprite
  this.valid = true;			// if this is false movement and animation will ignore the object
  this.type = "basic";			// name of the type - most likely unnecessary
};

Game.Object.prototype.reinit = function () {
  this.valid = true;
  this.bt = new Date().getTime();
};

Game.Object.prototype.updateValid = function () {
  // very basic function to invalidate objects that are a certain distance outside the viewport. this 
  // should be overridden in child classes and optermized.
  if (this.x < -100 || this.x > Game.dimensions.w + 100 || this.y < -100 || this.y > Game.dimensions.h + 100) {
    this.valid = false;
  }
};

Game.Object.prototype.move = function (dt) {
  this.x += this.vx * (dt / 1000);
  this.y += this.vy * (dt / 1000);
};

Game.Object.prototype.draw = function () {
  // the basic object is invisible so it has no draw method implementation
};

Game.PlayerBullet = function () {
  this.vy = -500;				
  this.h = 6;
  this.w = 6;
  this.hh = 3;
  this.wh = 3;
  this.type = "playerBullet";
};

Game.PlayerBullet.prototype = new Game.Object();
Game.PlayerBullet.prototype.constructor = Game.PlayerBullet;

Game.PlayerBullet.prototype.init = function () {
};

Game.PlayerBullet.prototype.draw = function () {
  Game.canvas.save();
  Game.canvas.strokeStyle = "#ff0";
  Game.canvas.fillStyle = "#f00";
  //Game.canvas.beginPath();
  //Game.canvas.arc(this.x, this.y, 2, 0, 0, true);
  //Game.canvas.fill();
  try
  {
    Game.canvas.fillRect(this.x - this.wh, this.y - this.hh, this.w, this.h);
  } catch (err) {
    this.valid = false;
  }
  Game.canvas.restore();
};

Game.PlayerBullet.prototype.updateValid = function () {
  // very basic function to invalidate objects that are a certain distance outside the viewport. this 
  // should be overridden in child classes and optermized.
  if (this.y < -10) {
    this.valid = false;
  }
};
