(function() {
	function byId(id) {
		return document.getElementById(id);
	}

	// initialize units
	for (var key in countdown) {
		if (countdown.hasOwnProperty(key)) {
			var unit = byId("units-"+key.toLowerCase());
			if (unit) {
				unit.value = countdown[key];
				unit.checked = countdown[key] & countdown.DEFAULTS;
			}
		}
	}

	function update() {
		var units = ~countdown.ALL,
			chx = byId('countdown-units').getElementsByTagName('input'),
			empty = byId('empty-label').value || "";

		for (var i=0, count=chx.length; i<count; i++) {
			if (chx[i].checked) {
				units |= Number(chx[i].value);
			}
		}

		var yyyy = Number(byId('year').value),
			MM = Number(byId('month').value)-1,
			dd = Number(byId('date').value),
			HH = Number(byId('hours').value),
			mm = Number(byId('minutes').value),
			ss = Number(byId('seconds').value),
			fff = Number(byId('milliseconds').value);

		var start = new Date(yyyy, MM, dd, HH, mm, ss, fff),
			ts = countdown.timespan(start, null, units);

		byId('counter').innerHTML = ts.toHTML("strong") || empty;
		byId('timespan').innerHTML = JSON.stringify(ts, null, "  ");
	}
//	update();
	setInterval(update, 1000/30);
})();
