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

		if(row === 5)
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

		this.set_result();
	},

	populate_results_table : function() {
		var table = document.getElementById("results"),
			cell,
			td,
			img,
			i;

		for(i = 0; i < 5; ++i) {
			cell = table.appendChild(document.createElement("tr"));
			for(j = 0; j < 5; ++j) {
				td = document.createElement("td");
				img = document.createElement("img");

				img.src = "images/selector.png";
				td.appendChild(img);
				cell.appendChild(td);
			}
		}
	},

	set_result : function() {
		var bosses = Object.keys(this.bosses),
			boss,
			table = document.getElementById("results"),
			cells = table.getElementsByTagName("td"),
			cell,
			img,
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
			this.populate_results_table();
			cells = table.getElementsByTagName("td");
		}

		for(i = 0; i < 5 ; ++i) {
			for(j = 0; j < 5; ++j) {
				cell = cells[i * 5 + j];
				img = cells[i * 5 + j].getElementsByTagName("img")[0];

				if(this.result[i][j] === true)
					img.style.visibility = "visible";
				else if(img !== undefined)
					img.style.visibility = "hidden";
			}
		}

		document.getElementById("results").style.display = "inline-block";
	},

	adjust_etank_count : function(increment) {
		if(increment === true)
			++this.etanks;
		else
			--this.etanks;

		if(this.etanks <= 0) {
			this.etanks = 0;
			document.getElementById("counter_down").style.visibility = "hidden";
		}
		else
			document.getElementById("counter_down").style.visibility = "visible";

		if(this.etanks >= 4) {
			this.etanks = 4;
			document.getElementById("counter_up").style.visibility = "hidden";
		}
		else
			document.getElementById("counter_up").style.visibility = "visible";

		document.getElementById("etank_count").innerHTML = this.etanks;
		this.set_result();
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

		document.getElementById("counter_up").onclick = function() {
			Mega.adjust_etank_count(true);
		};
		document.getElementById("counter_down").onclick = function() {
			Mega.adjust_etank_count(false);
		};

		Mega.set_result();
	}
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

window.onload = function() {
	Mega.run();

	var bosses = Object.keys(Mega.bosses),
		i;

	for(i = 0; i < bosses.length; ++i)
		new Image().src = "images/" + bosses[i] + "_defeated.png";
}
