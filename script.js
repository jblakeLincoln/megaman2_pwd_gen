/*
 * In the original game, the password is represented as a set of 25 bits, where
 * eight of the first 20 bits are set to represent boss state, and one of the
 * remaining five represents the number of available E Tanks. The E Tank bit
 * shifts the boss state bits. This is emulated here by specifying the grid
 * coordinate for each boss state at 0 E Tanks, and pushing it right on the
 * grid per E Tank. Getting pushed off row E rolls over to row B - row A
 * always represents the E Tanks.
 */

function Boss(alive, dead) {
	this.alive = alive;
	this.dead = dead;
	this.state = true;
}

var Mega = {
	bosses : {
		"bubble_man" : new Boss("C3", "D1"),
		"air_man"    : new Boss("D2", "E3"),
		"quick_man"  : new Boss("C4", "B4"),
		"heat_man"   : new Boss("D5", "B2"),
		"wood_man"   : new Boss("B5", "D3"),
		"metal_man"  : new Boss("E1", "E5"),
		"flash_man"  : new Boss("E4", "C1"),
		"crash_man"  : new Boss("E2", "C5"),
	},
	etanks : 0,
	result : [[]],

	set_cell : function(str) {
		var row = str.charCodeAt(0) - 65,
			col = parseInt(str[1]) - 1,
			index = row * 5 + col + this.etanks;

		row = parseInt(index / 5);
		col = parseInt(index % 5);

		if(row == 5)
			row = 1;

		this.result[row][col] = true;
	},

	set_boss_state : function(elm) {
		var name = elm.getAttribute("data-name"),
			img = elm.getElementsByTagName("img")[0];

		this.bosses[name].state = !this.bosses[name].state;

		if(this.bosses[name].state === true)
			img.src = "images/" + name + ".png";
		else
			img.src = "images/" + name + "_defeated.png";
	},

	set_result : function() {
		var bosses = Object.keys(this.bosses),
			boss,
			table = document.getElementById("results"),
			cells = table.getElementsByTagName("td"),
			temp_cell,
			i,
			j;

		this.result = new Array(5);
		for(i = 0; i < 5; ++i)
			this.result[i] = new Array(5);

		for(i = 0; i < bosses.length; ++i) {
			boss = this.bosses[bosses[i]];
			this.set_cell(boss.state ? boss.alive : boss.dead);
		}

		this.set_cell("A1"); // E Tanks.

		if(cells.length === 0)
		{
			for(i = 0; i < 5; ++i) {
				temp_cell = table.appendChild(document.createElement("tr"));
				for(j = 0; j < 5; ++j) {
					temp_cell.appendChild(document.createElement("td"));
				}
			}

			cells = table.getElementsByTagName("td");
		}

		console.log(cells);

		for(i = 0; i < 5 ; ++i) {
			for(j = 0; j < 5; ++j) {
				var cell = cells[i * 5 + j];
				var img = cells[i * 5 + j].getElementsByTagName("img")[0];

				if(this.result[i][j] === true) {
					if(img === undefined)
						img = cell.appendChild(document.createElement("img"));
					img.src = "images/selector.png";
				}
				else if(img !== undefined)
						img.remove();
			}
		}

		document.getElementById("results").style.display = "inline-block";
	},

	run : function() {
		var table = document.getElementById("bosses"),
				cells = table.getElementsByTagName("td"),
				i;

		for(i = 0; i < cells.length; ++i) {
			cells[i].onclick = function() {
				if(this.getAttribute("data-name") !== null)
					Mega.set_boss_state(this);
			};
		}

		document.getElementById("btn_generate").onclick = function() {
			Mega.set_result();
		};
	}
}

window.onload = function() {
	Mega.run();
}
