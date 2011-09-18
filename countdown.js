/**
 * @fileoverview countdown.js v2.0.0
 * 
 * Copyright (c)2006-2011 Stephen M. McKamey
 * Licensed under the MIT License (http://bitbucket.org/mckamey/countdown.js/LICENSE.txt)
 */

/**
 * @public
 */
var countdown = (
	function() {

	"use strict";

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
	var CENTURIES		= 0x100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLENNIA		= 0x200;

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
	var DAYS_PER_WEEK = 7;

	/**
	 * @private
	 * @const
	 * @type {Array}
	 */
	var DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MAX_WEEKS_PER_MONTH = 5;

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
	var YEARS_PER_CENTURY = 100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES_PER_MILLENNIUM = 10;

	/**
	 * @private
	 * @param {number} year
	 */
	function isLeapYear(year) {
		if (year % 4 !== 0) {
			return false;
		}
	
		if ((year % 100) === 0) {
			return ((year % 400) === 0);
		}
	
		return true;
	}

	/**
	 * @private
	 * @param {number} year
	 * @param {number} month
	 */
	function daysPerMonth(year, month) {
		var days = DAYS_PER_MONTH[month];
		if (month === 1 && isLeapYear(year)) {
			days++; 
		}
		return days;
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @param {number} dir
	 */
	function daysInRefMonth(ref, dir) {
		// this is the trickiest since months vary in length
		var year = ref.getUTCFullYear(),
			month = ref.getUTCMonth(),
			days = daysPerMonth(year, month);

		if (dir) {
			// increment or decrement month by one
			ref.setUTCMonth(dir < 0 ? month-1 : month+1);
		}

		return days;
	}

	/**
	 * @private
	 * @param {number} value
	 * @param {number} conversion
	 */
	function borrow(value, conversion) {
		return Math.floor(-(value+1)/conversion)+1;
	}

	/**
	 * @private
	 * @param {number} value
	 * @param {string} singular
	 * @param {string} plural
	 * @return {string}
	 */
	function plurality(value, singular, plural) {
		return (value === 1) ? singular : value+" "+plural;
	}

	var ripple, pruneUnits;

	/**
	 * TimeSpan representation of a duration of time
	 * 
	 * @private
	 * @this {TimeSpan}
	 * @param {Date|number} start the starting date
	 * @param {Date|number} end the ending date
	 * @param {number} units the units to populate
	 * @constructor
	 */
	function TimeSpan (start, end, units) {
		start = (start instanceof Date) ? start : new Date(start);
		end = (end instanceof Date) ? end : new Date(end);
		units = (units > 0) ? units : (MILLENNIA|CENTURIES|YEARS|MONTHS|DAYS|HOURS|MINUTES|SECONDS);

		this.value = end.getTime() - start.getTime();
		if (this.value < 0) {
			// swap if reversed
			var temp = end;
			end = start;
			start = temp;
		}

		// reference month for determining days in month
		this.refMonth = new Date(start.getUTCFullYear(), start.getUTCMonth(), 15);

		// reset to initial deltas
		this.millennia = 0;
		this.centuries = 0;
		this.years = end.getUTCFullYear() - start.getUTCFullYear();
		this.months = end.getUTCMonth() - start.getUTCMonth();
		this.weeks = 0;
		this.days = end.getUTCDate() - start.getUTCDate();
		this.hours = end.getUTCHours() - start.getUTCHours();
		this.minutes = end.getUTCMinutes() - start.getUTCMinutes();
		this.seconds = end.getUTCSeconds() - start.getUTCSeconds();
		this.milliseconds = end.getUTCMilliseconds() - start.getUTCMilliseconds();

		ripple(this);
		pruneUnits(this, units);

		delete this.refMonth;		
	}

	TimeSpan.prototype.toString = function() {
		var label = [];

		if (this.millennia) {
			label.push(plurality(this.millennia, "1 millennium", "millennia"));
		}
		if (this.centuries) {
			label.push(plurality(this.centuries, "1 century", "centuries"));
		}
		if (this.years) {
			label.push(plurality(this.years, "1 year", "years"));
		}
		if (this.months) {
			label.push(plurality(this.months, "1 month", "months"));
		}
		if (this.weeks) {
			label.push(plurality(this.weeks, "1 week", "weeks"));
		}
		if (this.days) {
			label.push(plurality(this.days, "1 day", "days"));
		}
		if (this.hours) {
			label.push(plurality(this.hours, "1 hour", "hours"));
		}
		if (this.minutes) {
			label.push(plurality(this.minutes, "1 minute", "minutes"));
		}
		if (this.seconds) {
			label.push(plurality(this.seconds, "1 second", "seconds"));
		}
		if (this.milliseconds) {
			label.push(plurality(this.milliseconds, "1 millisecond", "milliseconds"));
		}

		var count = label.length;
		if (count < 1) {
			return "now";
		}
		if (count > 1) {
			label[count-1] = "and "+label[count-1];
		}
		return label.join(", ");
	};

	/**
	 * Borrow any underflow units
	 * 
	 * @private
	 * @param {TimeSpan} ts
	 */
	ripple = function(ts) {
		var x;

		if (ts.milliseconds < 0) {
			// ripple minutes down to seconds
			x = borrow(ts.milliseconds, MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;

		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple minutes up to hours
			ts.seconds += Math.floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = borrow(ts.seconds, SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;

		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple minutes up to hours
			ts.minutes += Math.floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = borrow(ts.minutes, MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;

		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += Math.floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = borrow(ts.hours, HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;

		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += Math.floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		if (ts.days < 0) {
			// ripple weeks down to days
			x = borrow(ts.days, DAYS_PER_WEEK);
			ts.weeks -= x;
			ts.days += x * DAYS_PER_WEEK;

		} else if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		while (ts.weeks < 0) {
			// ripple months down to weeks and days
			x = daysInRefMonth(ts.refMonth, -1);
			ts.months--;
			ts.weeks += Math.floor(x / DAYS_PER_WEEK);
			ts.days += x % DAYS_PER_WEEK;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple days back up to weeks
				ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}
		}

		while (ts.weeks >= MAX_WEEKS_PER_MONTH) {
			// ripple weeks up to months and ripple remainder down to days
			ts.months++;
			ts.weeks -= MAX_WEEKS_PER_MONTH;
			ts.days += (MAX_WEEKS_PER_MONTH * DAYS_PER_WEEK) - daysInRefMonth(ts.refMonth, +1);

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple days back up to weeks
				ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = borrow(ts.months, MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;

		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += Math.floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}

		if (ts.years < 0) {
			// ripple centuries down to years
			x = borrow(ts.years, YEARS_PER_CENTURY);
			ts.centuries -= x;
			ts.years += x * YEARS_PER_CENTURY;

		} else if (ts.years >= YEARS_PER_CENTURY) {
			// ripple years up to centuries
			ts.centuries += Math.floor(ts.years / YEARS_PER_CENTURY);
			ts.years %= YEARS_PER_CENTURY;
		}

		if (ts.centuries < 0) {
			// ripple millennia down to centuries
			x = borrow(ts.centuries, CENTURIES_PER_MILLENNIUM);
			ts.millennia -= x;
			ts.centuries += x * CENTURIES_PER_MILLENNIUM;

		} else if (ts.centuries >= CENTURIES_PER_MILLENNIUM) {
			// ripple centuries up to millennia
			ts.millennia += Math.floor(ts.centuries / CENTURIES_PER_MILLENNIUM);
			ts.centuries %= CENTURIES_PER_MILLENNIUM;
		}

		if (ts.millennia < 0) {
			throw new Error("Ripple underflow");
		}
	};

	/**
	 * Remove any units not requested
	 * 
	 * @private
	 * @param {TimeSpan} ts
	 * @param {number} units the units to populate
	 */
	pruneUnits = function(ts, units) {
		// Calc from largest unit to smallest to prevent underflow

		if (!(units & MILLENNIA)) {
			// ripple millennia down to centuries
			ts.centuries += ts.millennia * CENTURIES_PER_MILLENNIUM;
			delete ts.millennia;
		}

		if (!(units & CENTURIES)) {
			// ripple centuries down to years
			ts.years += ts.centuries * YEARS_PER_CENTURY;
			delete ts.centuries;
		}

		if (!(units & YEARS)) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;
		}

		if (!(units & MONTHS)) {
			while (ts.months) {
				// ripple months down to days
				var daysInMonth = daysInRefMonth(ts.refMonth, -1);
				ts.months--;
				ts.weeks += Math.floor(daysInMonth / DAYS_PER_WEEK);
				ts.days += daysInMonth % DAYS_PER_WEEK;

				if (ts.days >= DAYS_PER_WEEK) {
					// ripple days back up to weeks
					ts.weeks += Math.floor(ts.days / DAYS_PER_WEEK);
					ts.days %= DAYS_PER_WEEK;
				}
			}
			delete ts.months;
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

		if (!(units & MILLISECONDS)) {
			// nothing to ripple down to, so just remove
			delete ts.milliseconds;
		}
	};

	var countdown = {
		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MILLISECONDS: MILLISECONDS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		SECONDS: SECONDS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MINUTES: MINUTES,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		HOURS: HOURS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		DAYS: DAYS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		WEEKS: WEEKS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MONTHS: MONTHS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		YEARS: YEARS,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		CENTURIES: CENTURIES,

		/**
		 * @public
		 * @const
		 * @type {number}
		 */
		MILLENNIA: MILLENNIA,

		/**
		 * @public
		 * @param {Date|number} start the starting date
		 * @param {Date|number} end the ending date
		 * @param {number} units the units to populate
		 * @return {TimeSpan}
		 */
		delta : function(start, end, units) {
			return new TimeSpan(start, end, units);
		}
	};

	return countdown;	

})();
