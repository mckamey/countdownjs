try{

/**
 * Mocks up a Timespan object for unit tests
 * 
 * @private
 * @param {Timespan|Object} map properties to convert to a Timespan
 * @return {Timespan}
 */
countdown.clone = function(map) {
	var ts = countdown();
	for (var key in map) {
		if (map.hasOwnProperty(key)) {
			ts[key] = map[key];
		}
	}
	return ts;
};

var formatTZ = function(date) {
	var tz = -(date instanceof Date ? date : new Date()).getTimezoneOffset();
	if (!tz) {
		return 'UTC';
	}

	var tzStr = ''+Math.abs(tz % 60);
	if (tzStr.length < 2) {
		tzStr = '0'+tzStr;
	}
	tzStr = Math.abs(tz / 60) + tzStr;
	if (tzStr.length < 4) {
		tzStr = '0'+tzStr;
	}

	return 'UTC'+((tz < 0) ? '-' : '+') +tzStr;
};

module('countdown(...)');

test('Zero', function() {

	var start = 0;
	var end = 0;

	var expected = countdown.clone({
		start: new Date(0),
		end: new Date(0),
		units: countdown.ALL,
		value: 0,
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, '');
});

test('1 ms', function() {

	var start = 0;
	var end = 1;

	var expected = countdown.clone({
		start: new Date(0),
		end: new Date(1),
		units: countdown.ALL,
		value: 1,
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 1
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, '');
});

test('1 sec', function() {

	var start = 10000;
	var end = 11000;

	var expected = countdown.clone({
		start: new Date(10000),
		end: new Date(11000),
		units: countdown.ALL,
		value: 1000,
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 1,
		milliseconds: 0
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, '');
});

test('5 min, reversed', function() {

	var start = (5 * 60 * 1000);
	var end = 0;

	var expected = countdown.clone({
		start: new Date(5 * 60 * 1000),
		end: new Date(0),
		units: countdown.ALL,
		value: -(5 * 60 * 1000),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, '');
});

test('Constant 1 month span, daily over 5 years', function() {

	var start = new Date(1999, 10, 1, 12, 0, 0);

	var expected = countdown.clone({
		start: start,
		end: start,
		value: 0,
		units: countdown.ALL,
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 1,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

	for (var t=0, range=5*365.2425; t<range; t++) {
		// end should always be one month away
		var end = new Date(start.getTime());
		end.setMonth( end.getMonth()+1 );

		// skip situations like 'Jan 31st + month'
		if (end.getMonth() === start.getMonth()+1) {
			expected.start = start;
			expected.end = end;
			expected.value = end.getTime() - start.getTime();
	
			var actual = countdown(start, end, countdown.ALL);
	
			same(actual, expected, '');
		}

		// add a day
		start.setDate( start.getDate()+1 );
	}
});

test('Contiguous daily countdown over 83 weeks', function() {

	var UNITS = countdown.WEEKS | countdown.DAYS | countdown.HOURS;
	var start = new Date(2007, 10, 10, 5, 30, 0);
	var end = new Date(2009, 5, 14, 16, 0, 0);

	var expected = { weeks: 83, days: 1, hours: 10.5 };

	while (start.getTime() < end.getTime()) {

		var actual = countdown(start, end, UNITS, 0, 20);
		actual = {
			weeks: actual.weeks,
			days: actual.days,
			hours: actual.hours
		};

		same(actual, expected, '');

		// add a day
		start.setDate( start.getDate()+1 );

		// store
		if (actual.days) {
			expected = {
				weeks: actual.weeks,
				days: actual.days-1,
				hours: actual.hours
			};
		} else {
			expected = {
				weeks: actual.weeks-1,
				days: 6,
				hours: actual.hours
			};
		}
	}
});

test('Contiguous daily countdown over 1 year 7 months', function() {

	var DAY_IN_MS = 24 * 60 * 60 * 1000;
	var UNITS = countdown.MONTHS | countdown.DAYS | countdown.HOURS;
	var start = new Date(2006, 10, 10, 5, 30, 0);
	var end = new Date(2008, 5, 14, 16, 0, 0);

	var expected = { months: 19, days: 4, hours: 10.5 };

	while (start.getTime() < end.getTime()) {

		var actual = countdown(start, end, UNITS, 0, 1);
		actual = {
			months: actual.months,
			days: actual.days,
			hours: actual.hours
		};

		same(actual, expected, '');

		// add a day
		start.setDate( start.getDate()+1 );

		// set up next iteration
		if (actual.days) {
			expected = {
				months: actual.months,
				days: actual.days-1,
				hours: actual.hours
			};
		} else {
			var daysInStart = Math.round((new Date(start.getFullYear(), start.getMonth()+1, 15).getTime() - new Date(start.getFullYear(), start.getMonth(), 15).getTime()) / DAY_IN_MS);
			expected = {
				months: actual.months-1,
				// the number of days in start month minus one
				days: daysInStart-1,
				hours: actual.hours
			};
		}
	}
});

test('Contiguous weekly countdown over 7 months, out of bounds max & digits', function() {

	var DAY_IN_MS = 24 * 60 * 60 * 1000;
	var UNITS = countdown.MONTHS | countdown.WEEKS | countdown.DAYS | countdown.HOURS;
	var start = new Date(1999, 10, 10, 5, 30, 0);
	var end = new Date(2001, 5, 14, 16, 0, 0);

	// calc by days since easier
	var prev = { months: 19, days: 4, hours: 10.5 };

	while (start.getTime() < end.getTime()) {

		var actual = countdown(start, end, UNITS, -1, 100);
		actual = {
			months: actual.months,
			weeks: actual.weeks,
			days: actual.days,
			hours: actual.hours
		};

		// convert to weeks just before compare
		var expected = {
			months: prev.months,
			weeks: Math.floor(prev.days/7),
			days: prev.days % 7,
			hours: prev.hours
		};

		same(actual, expected, '');

		// add a day
		start.setDate( start.getDate()+1 );

		// set up next iteration
		if (prev.days) {
			prev = {
				months: prev.months,
				days: prev.days-1,
				hours: prev.hours
			};
		} else {
			var daysInStart = Math.round((new Date(start.getFullYear(), start.getMonth()+1, 15).getTime() - new Date(start.getFullYear(), start.getMonth(), 15).getTime()) / DAY_IN_MS);
			prev = {
				months: prev.months-1,
				// the number of days in start month minus one
				days: daysInStart-1,
				hours: prev.hours
			};
		}
	}
});

test('Contiguous daily count up over 10 years', function() {

	var DAY_IN_MS = 24 * 60 * 60 * 1000;
	var UNITS = countdown.MONTHS | countdown.DAYS;
	var start = new Date(1995, 0, 1, 12, 0, 0);
	var end = new Date(start.getTime());
	var goalTime = new Date(2005, 0, 1, 12, 0, 0).getTime();

	var expected = { months: 0, days: 0 };

	while (end.getTime() < goalTime) {

		var actual = countdown(start, end, UNITS);
		actual = {
			months: actual.months,
			days: actual.days
		};

		same(actual, expected, '');

		var daysInEnd = Math.round((new Date(end.getFullYear(), end.getMonth()+1, 15).getTime() - new Date(end.getFullYear(), end.getMonth(), 15).getTime()) / DAY_IN_MS);

		// add a day
		end.setDate( end.getDate + 1 );

		// set up next iteration
		// compare to the number of days in before month end
		if (actual.days < daysInEnd-1) {
			expected = {
				months: actual.months,
				days: actual.days+1
			};
		} else {
			expected = {
				months: actual.months+1,
				days: 0
			};
		}
	}
});

test('Underflow bug ('+formatTZ(2011, 11, 1)+')', function() {

	var start = new Date(2011, 11, 1, 0, 0, 0, 0);
	var end = new Date(2011, 11, 31, 23, 59, 59, 999);

	var expected = countdown.clone({
		start: new Date(start.getTime()),
		end: new Date(end.getTime()),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 4,
		days: 2,
		hours: 23,
		minutes: 59,
		seconds: 59,
		milliseconds: 999
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('Extra day bug ('+formatTZ(2014, 6, 3)+')', function() {

	var start = new Date(2014, 6, 1, 0, 0, 0, 0);
	var end = new Date(2014, 6, 3, 17, 52, 49, 209);

	var expected = countdown.clone({
		start: new Date(start.getTime()),
		end: new Date(end.getTime()),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 2,
		hours: 17,
		minutes: 52,
		seconds: 49,
		milliseconds: 209
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('Daylight Savings Time ('+formatTZ(1318451880000)+')', function() {

	var start = new Date(2011, 9, 12, 13, 38, 0);
	var end = new Date(2013, 11, 2, 14, 0, 0);

	var expected = countdown.clone({
		start: new Date(start.getTime()),
		end: new Date(end.getTime()),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 2,
		months: 1,
		weeks: 3,
		days: 0,
		hours: 0,
		minutes: 22,
		seconds: 0,
		milliseconds: 0
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('Reference month ordering', function() {

	var start = new Date(2015, 1, 1, 0, 0, 0);
	var end = new Date(2014, 9, 27, 12, 00, 0);

	var expected = countdown.clone({
		start: new Date(start.getTime()),
		end: new Date(end.getTime()),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 3,
		weeks: 0,
		days: 4,
		hours: 12,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('Before leap day', function() {

	var start = new Date(2012, 1, 28, 13, 14, 30, 109);
	var end = new Date(2012, 1, 29, 17, 46, 22, 111); // Leap day 2012

	var expected = countdown.clone({
		start: new Date(2012, 1, 28, 13, 14, 30, 109),
		end: new Date(2012, 1, 29, 17, 46, 22, 111),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 1,
		hours: 4,
		minutes: 31,
		seconds: 52,
		milliseconds: 2
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('After leap day (local)', function() {

	var start = new Date(2012, 1, 29, 17, 46, 22, 111); // Leap day 2012
	var end = new Date(2012, 2, 1, 13, 14, 30, 109);

	var expected = countdown.clone({
		start: new Date(2012, 1, 29, 17, 46, 22, 111),
		end: new Date(2012, 2, 1, 13, 14, 30, 109),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 19,
		minutes: 28,
		seconds: 7,
		milliseconds: 998
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('After leap day (UTC)', function() {

	var start = new Date(1330537582111); // 2012-02-29T17:46:22.111Z, Leap day 2012
	var end = new Date(1330607670109);   // 2012-03-01T13:14:30.109Z

	var expected = countdown.clone({
		start: new Date(1330537582111),
		end: new Date(1330607670109),
		units: countdown.ALL,
		value: end.getTime() - start.getTime(),
		millennia: 0,
		centuries: 0,
		decades: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 19,
		minutes: 28,
		seconds: 7,
		milliseconds: 998
	});

	var actual = countdown(start, end, countdown.ALL);

	same(actual, expected, ''+start+' => '+end);
});

test('Almost 2 minutes, rounded', function() {

	var start = new Date(915220800000); // 1999-01-01T20:00:00.000Z
	var end = new Date(915220919999);   // 1999-01-01T20:01:59.999Z

	var expected = countdown.clone({
		start: new Date(915220800000),
		end: new Date(915220919999),
		units: countdown.DEFAULTS,
		value: 119999,
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 2,
		seconds: 0
	});

	var actual = countdown(start, end, countdown.DEFAULTS);

	same(actual, expected, ''+start+' => '+end);
});

test('Almost 2 minutes, rounded 2 digits', function() {

	var start = new Date(915220800000); // 1999-01-01T20:00:00.000Z
	var end = new Date(915220919999);   // 1999-01-01T20:01:59.999Z

	var expected = countdown.clone({
		start: new Date(915220800000),
		end: new Date(915220919999),
		units: countdown.DEFAULTS,
		value: 119999,
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 2,
		seconds: 0
	});

	var actual = countdown(start, end, countdown.DEFAULTS, NaN, 2);

	same(actual, expected, ''+start+' => '+end);
});

test('Almost 2 minutes, full 3 digits', function() {

	var start = new Date(915220800000); // 1999-01-01T20:00:00.000Z
	var end = new Date(915220919999);   // 1999-01-01T20:01:59.999Z

	var expected = countdown.clone({
		start: new Date(915220800000),
		end: new Date(915220919999),
		units: countdown.DEFAULTS,
		value: 119999,
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 59.999
	});

	var actual = countdown(start, end, countdown.DEFAULTS, 0, 3);

	same(actual, expected, ''+start+' => '+end);
});

}catch(ex){alert(ex);}