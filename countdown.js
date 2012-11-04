/**
 * @license countdown.js v2.3.0 http://countdownjs.org
 * Copyright (c)2006-2012 Stephen M. McKamey.
 * Licensed under The MIT License.
 */
/*jshint bitwise:false */

/**
 * @public
 * @type {Object|null}
 */
var module;

/**
 * API entry
 * @public
 * @param {function(Object)|Date|number} start the starting date
 * @param {function(Object)|Date|number} end the ending date
 * @param {number} units the units to populate
 * @return {Object|number}
 */
var countdown = (

/**
 * @param {Object} module CommonJS Module
 */
function(module) {
	/*jshint smarttabs:true */

	'use strict';

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS	= 0x001;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS			= 0x002;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES			= 0x004;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS			= 0x008;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS			= 0x010;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var WEEKS			= 0x020;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS			= 0x040;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS			= 0x080;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES			= 0x100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES		= 0x200;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLENNIA		= 0x400;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DEFAULTS		= YEARS|MONTHS|DAYS|HOURS|MINUTES|SECONDS;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_SECOND = 1000;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS_PER_MINUTE = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES_PER_HOUR = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS_PER_DAY = 24;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS_PER_WEEK = 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS_PER_YEAR = 12;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS_PER_DECADE = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES_PER_CENTURY = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES_PER_MILLENNIUM = 10;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var ceil = Math.ceil;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var floor = Math.floor;

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @param {number} shift number of months to shift
	 * @return {number} number of days shifted
	 */
	function borrowMonths(ref, shift) {
		var prevTime = ref.getTime();

		// increment month by shift
		ref.setUTCMonth( ref.getUTCMonth() + shift );

		// this is the trickiest since months vary in length
		return Math.round( (ref.getTime() - prevTime) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerMonth(ref) {
		var a = ref.getTime();

		// increment month by 1
		var b = new Date(a).setUTCMonth( ref.getUTCMonth() + 1 ).getTime();

		// this is the trickiest since months vary in length
		return Math.round( (b - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerYear(ref) {
		var a = ref.getTime();

		// increment year by 1
		var b = new Date(a).setUTCFullYear( ref.getUTCFullYear() + 1 ).getTime();

		// this is the trickiest since years (periodically) vary in length
		return Math.round( (b - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {number} value number to format
	 * @param {number} digits number of digits right of decimal point
	 * @return {number}
	 */
	function maxDigits(value, digits) {
		// ensure does not have more than specified number of digits
		return (+(+value).toFixed(+digits || 0));
	}

	/**
	 * @private
	 * @param {number} value
	 * @param {string} singular
	 * @param {string} plural
	 * @param {number} digits
	 * @return {string}
	 */
	function plurality(value, singular, plural, digits) {
		value = maxDigits(value, digits);
		return value+' '+((value === 1) ? singular : plural);
	}

	/**
	 * Formats the entries as English labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 * @return {Array}
	 */
	var formatList;

	/**
	 * Timespan representation of a duration of time
	 * 
	 * @private
	 * @this {Timespan}
	 * @constructor
	 */
	function Timespan() {}

	/**
	 * Formats the Timespan as a sentance
	 * 
	 * @private
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 * @return {string}
	 */
	Timespan.prototype.toString = function(max, digits) {
		var label = formatList(this, max, digits);

		var count = label.length;
		if (!count) {
			return '';
		}
		if (count > 1) {
			label[count-1] = 'and '+label[count-1];
		}
		return label.join(', ');
	};

	/**
	 * Formats the Timespan as HTML
	 * 
	 * @private
	 * @param {string} tag HTML tag name to wrap each value
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 * @return {string}
	 */
	Timespan.prototype.toHTML = function(tag, max, digits) {
		tag = tag || 'span';
		var label = formatList(this, max, digits);

		var count = label.length;
		if (!count) {
			return '';
		}
		for (var i=0; i<count; i++) {
			// wrap each unit in tag
			label[i] = '<'+tag+'>'+label[i]+'</'+tag+'>';
		}
		if (--count) {
			label[count] = 'and '+label[count];
		}
		return label.join(', ');
	};

	/**
	 * Ripple up partial units
	 * 
	 * @private
	 * @param {Timespan} ts
	 */
	function fraction(ts) {
		var frac = ts.milliseconds / MILLISECONDS_PER_SECOND;
		delete ts.milliseconds;

		if (ts.seconds) {
			ts.seconds += frac;
			return;
		}

		frac /= SECONDS_PER_MINUTE;
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.minutes) {
			ts.minutes += frac;
			return;
		}

		frac /= MINUTES_PER_HOUR;
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.hours) {
			ts.hours += frac;
			return;
		}

		frac /= HOURS_PER_DAY;
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.days) {
			ts.days += frac;
			return;
		}

		if (ts.weeks) {
			// only convert if needed here
			// as months are problematic
			frac /= DAYS_PER_WEEK;
			// no need to shortcut
			ts.weeks += frac;
			return;
		}

		if (ts.months) {
			frac /= daysPerMonth(ts.refMonth);
			// no need to shortcut
			ts.months += frac;
			return;
		}

		frac /= daysPerYear(ts.refMonth);
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.years) {
			ts.years += frac;
			return;
		}

		frac /= YEARS_PER_DECADE;
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.decades) {
			ts.decades += frac;
			return;
		}

		frac /= DECADES_PER_CENTURY;
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.centuries) {
			ts.centuries += frac;
			return;
		}

		frac /= CENTURIES_PER_MILLENNIUM;
		if (frac + 1 <= 1) {
			// shortcut if below epsilon
			return;
		}

		if (ts.millennia) {
			ts.millennia += frac;
			return;
		}
	}

	/**
	 * Formats the entries as English labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 * @return {Array}
	 */
	formatList = function(ts, max, digits) {
		var list = [];

		if (ts.millennia) {
			list.push(plurality(ts.millennia, 'millennium', 'millennia', digits));
			if (list.length === max) { return list; }
		}
		if (ts.centuries) {
			list.push(plurality(ts.centuries, 'century', 'centuries', digits));
			if (list.length === max) { return list; }
		}
		if (ts.decades) {
			list.push(plurality(ts.decades, 'decade', 'decades', digits));
			if (list.length === max) { return list; }
		}
		if (ts.years) {
			list.push(plurality(ts.years, 'year', 'years', digits));
			if (list.length === max) { return list; }
		}
		if (ts.months) {
			list.push(plurality(ts.months, 'month', 'months', digits));
			if (list.length === max) { return list; }
		}
		if (ts.weeks) {
			list.push(plurality(ts.weeks, 'week', 'weeks', digits));
			if (list.length === max) { return list; }
		}
		if (ts.days) {
			list.push(plurality(ts.days, 'day', 'days', digits));
			if (list.length === max) { return list; }
		}
		if (ts.hours) {
			list.push(plurality(ts.hours, 'hour', 'hours', digits));
			if (list.length === max) { return list; }
		}
		if (ts.minutes) {
			list.push(plurality(ts.minutes, 'minute', 'minutes', digits));
			if (list.length === max) { return list; }
		}
		if (ts.seconds) {
			list.push(plurality(ts.seconds, 'second', 'seconds', digits));
			if (list.length === max) { return list; }
		}
		if (ts.milliseconds) {
			list.push(plurality(ts.milliseconds, 'millisecond', 'milliseconds', digits));
			if (list.length === max) { return list; }
		}

		return list;
	};

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 */
	function ripple(ts) {
		var x;

		if (ts.milliseconds < 0) {
			// ripple seconds down to milliseconds
			x = ceil(-ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;

		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple milliseconds up to seconds
			ts.seconds += floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = ceil(-ts.seconds / SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;

		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple seconds up to minutes
			ts.minutes += floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = ceil(-ts.minutes / MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;

		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = ceil(-ts.hours / HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;

		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		while (ts.days < 0) {
			// NOTE: never actually seen this loop more than once

			// ripple months down to days
			ts.months--;
			ts.days += borrowMonths(ts.refMonth, 1);
		}

		// weeks is always zero here

		if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = ceil(-ts.months / MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;

		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}

		// years is always non-negative here
		// decades, centuries and millennia are always zero here

		if (ts.years >= YEARS_PER_DECADE) {
			// ripple years up to decades
			ts.decades += floor(ts.years / YEARS_PER_DECADE);
			ts.years %= YEARS_PER_DECADE;

			if (ts.decades >= DECADES_PER_CENTURY) {
				// ripple decades up to centuries
				ts.centuries += floor(ts.decades / DECADES_PER_CENTURY);
				ts.decades %= DECADES_PER_CENTURY;

				if (ts.centuries >= CENTURIES_PER_MILLENNIUM) {
					// ripple centuries up to millennia
					ts.millennia += floor(ts.centuries / CENTURIES_PER_MILLENNIUM);
					ts.centuries %= CENTURIES_PER_MILLENNIUM;
				}
			}
		}
	}

	/**
	 * Remove any units not requested
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} units the units to populate
	 */
	function pruneUnits(ts, units) {
		// Calc from largest unit to smallest to prevent underflow

		if (!(units & MILLENNIA)) {
			// ripple millennia down to centuries
			ts.centuries += ts.millennia * CENTURIES_PER_MILLENNIUM;
			delete ts.millennia;
		}

		if (!(units & CENTURIES)) {
			// ripple centuries down to decades
			ts.decades += ts.centuries * DECADES_PER_CENTURY;
			delete ts.centuries;
		}

		if (!(units & DECADES)) {
			// ripple decades down to years
			ts.years += ts.decades * YEARS_PER_DECADE;
			delete ts.decades;
		}

		if (!(units & YEARS)) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;
		}

		if (!(units & MONTHS) && ts.months) {
			// ripple months down to days
			ts.days += borrowMonths(ts.refMonth, ts.months);
			delete ts.months;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple day overflow back up to weeks
				ts.weeks += floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}
		}

		if (!(units & WEEKS)) {
			// ripple weeks down to days
			ts.days += ts.weeks * DAYS_PER_WEEK;
			delete ts.weeks;
		}

		if (!(units & DAYS)) {
			//ripple days down to hours
			ts.hours += ts.days * HOURS_PER_DAY;
			delete ts.days;
		}

		if (!(units & HOURS)) {
			// ripple hours down to minutes
			ts.minutes += ts.hours * MINUTES_PER_HOUR;
			delete ts.hours;
		}

		if (!(units & MINUTES)) {
			// ripple minutes down to seconds
			ts.seconds += ts.minutes * SECONDS_PER_MINUTE;
			delete ts.minutes;
		}

		if (!(units & SECONDS)) {
			// ripple seconds down to milliseconds
			ts.milliseconds += ts.seconds * MILLISECONDS_PER_SECOND;
			delete ts.seconds;
		}

		// nothing to ripple milliseconds down to
		// so ripple back up to smallest existing unit as a fractional value
		if (!(units & MILLISECONDS)) {
			fraction(ts);
		}
	}

	/**
	 * Populates the Timespan object
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {Date} start the starting date
	 * @param {Date} end the ending date
	 * @param {number} units the units to populate
	 */
	function populate(ts, start, end, units) {
		ts.start = start;
		ts.end = end;
		ts.units = units;

		ts.value = end.getTime() - start.getTime();
		if (ts.value < 0) {
			// swap if reversed
			var temp = end;
			end = start;
			start = temp;
		}

		// reference month for determining days in month
		ts.refMonth = new Date(start.getFullYear(), start.getMonth(), 15);
		try {
			// reset to initial deltas
			ts.millennia = 0;
			ts.centuries = 0;
			ts.decades = 0;
			ts.years = end.getUTCFullYear() - start.getUTCFullYear();
			ts.months = end.getUTCMonth() - start.getUTCMonth();
			ts.weeks = 0;
			ts.days = end.getUTCDate() - start.getUTCDate();
			ts.hours = end.getUTCHours() - start.getUTCHours();
			ts.minutes = end.getUTCMinutes() - start.getUTCMinutes();
			ts.seconds = end.getUTCSeconds() - start.getUTCSeconds();
			ts.milliseconds = end.getUTCMilliseconds() - start.getUTCMilliseconds();

			ripple(ts);
			pruneUnits(ts, units);

		} finally {
			delete ts.refMonth;
		}

		return ts;
	}

	/**
	 * Determine an appropriate refresh rate based upon units
	 * 
	 * @private
	 * @param {number} units the units to populate
	 * @return {number} milliseconds to delay
	 */
	function getDelay(units) {
		if (units & MILLISECONDS) {
			// refresh very quickly
			return MILLISECONDS_PER_SECOND / 30; //30Hz
		}

		if (units & SECONDS) {
			// refresh every second
			return MILLISECONDS_PER_SECOND; //1Hz
		}

		if (units & MINUTES) {
			// refresh every minute
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
		}

		if (units & HOURS) {
			// refresh hourly
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
		}
		
		if (units & DAYS) {
			// refresh daily
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
		}

		// refresh the rest weekly
		return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
	}

	/**
	 * API entry point
	 * 
	 * @public
	 * @param {Date|number|null|function(Timespan)} start the starting date
	 * @param {Date|number|null|function(Timespan)} end the ending date
	 * @param {number} units the units to populate
	 * @return {Timespan|number}
	 */
	function countdown(start, end, units) {
		var callback;

		// ensure some units or use defaults
		units = units || DEFAULTS;

		// ensure start date
		if ('function' === typeof start) {
			callback = start;
			start = null;

		} else if (!(start instanceof Date)) {
			start = (start !== null && isFinite(start)) ? new Date(start) : null;
		}

		// ensure end date
		if ('function' === typeof end) {
			callback = end;
			end = null;

		} else if (!(end instanceof Date)) {
			end = (end !== null && isFinite(end)) ? new Date(end) : null;
		}

		if (!start && !end) {
			// used for unit testing
			return new Timespan();
		}

		if (!callback) {
			return populate(new Timespan(), /** @type{Date} */(start||new Date()), /** @type{Date} */(end||new Date()), units);
		}

		// base delay off units
		var delay = getDelay(units);
		var fn = function() {
			callback(
				populate(new Timespan(), /** @type{Date} */(start||new Date()), /** @type{Date} */(end||new Date()), units)
			);
		};

		fn();
		return setInterval(fn, delay);
	}

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLISECONDS = MILLISECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.SECONDS = SECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MINUTES = MINUTES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.HOURS = HOURS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DAYS = DAYS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.WEEKS = WEEKS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MONTHS = MONTHS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.YEARS = YEARS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DECADES = DECADES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.CENTURIES = CENTURIES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLENNIA = MILLENNIA;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DEFAULTS = DEFAULTS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.ALL = MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS;

	if (module && module.exports) {
		module.exports = countdown;
	}

	return countdown;

})(module);
