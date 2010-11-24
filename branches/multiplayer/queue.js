Game.queue = {
	objs: [],
	move: function(dt) {
		var obj = null;
		for (var i = 0, ix = Game.queue.objs.length; i < ix; i++) {
			obj = Game.queue.objs[i];
			if (obj.valid) {
				obj.move(dt);
				obj.updateValid();
			}
		}
	},
	draw: function() {
		var obj = null;
		for (var i = 0, ix = Game.queue.objs.length; i < ix; i++) {
			obj = Game.queue.objs[i];
			if (obj.valid) {
				obj.draw();
			}
		}
	},
	newObject: function(type) {
		// first see if there's an old object we could use
		var obj = null;
		for (var i = 0, ix = Game.queue.objs.length; i < ix; i++) {
			obj = Game.queue.objs[i];
			if (!obj.valid && obj.type == type) {
				obj.reinit();
				return obj;
			}
		}
		switch (type) {
			case "playerBullet":
				obj = new Game.PlayerBullet();
				break;
			case "player" :
				obj = new Game.Player();
				break;
			default:
				obj = new Game.Object();
				break;
		}
		Game.queue.objs.push(obj);
		return obj;
	}
}
