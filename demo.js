(function() {
	function byId(id) {
		return document.getElementById(id);
	}

	// initialize units
	for (var key in countdown) {
		if (countdown.hasOwnProperty(key)) {
			var unit = byId('units-'+key.toLowerCase());
			if (unit) {
				unit.value = countdown[key];
				unit.checked = countdown[key] & countdown.DEFAULTS;
			}
		}
	}

	function update() {
		var units = ~countdown.ALL,
			chx = byId('countdown-units').getElementsByTagName('input'),
			empty = byId('empty-label').value || '',
			max = +(byId('max-units').value),
			digits = +(byId('frac-digits').value);

		for (var i=0, count=chx.length; i<count; i++) {
			if (chx[i].checked) {
				units |= +(chx[i].value);
			}
		}

		var yyyy = +(byId('year').value),
			MM = +(byId('month').value)-1,
			dd = +(byId('date').value),
			HH = +(byId('hours').value),
			mm = +(byId('minutes').value),
			ss = +(byId('seconds').value),
			fff = +(byId('milliseconds').value);

		var start = new Date(yyyy, MM, dd, HH, mm, ss, fff),
			ts = countdown(start, null, units, max);

		var counter = byId('counter'),
			timespan = byId('timespan'),
			msg = ts.toHTML('strong', digits) || empty;

		if (start.getTime() === 1357027199999) {
			msg = (ts.value > 0) ?
				'The world ended '+msg+' ago!?!' :
				'The world ends in '+msg+'!';
		}

		counter.innerHTML = msg;
		timespan.innerHTML = JSON.stringify(ts, null, '  ');

		requestAnimationFrame(update, timespan.parentNode);
	}
	update();
})();
