# [Countdown.js][1]

A simple JavaScript API for producing an accurate, intuitive description of the timespan between two Date instances.

----

## The Motivation

While seemingly a trivial problem, the human descriptions for a span of time tend to be fuzzier than a computer naturally computes.
More specifically, months are an inherently messed up unit of time.
For instance, when a human says "in 1 month" how long do they mean? Banks often interpret this as *thirty days* but that is only correct one third of the time.
People casually talk about a month being *four weeks long* but there is only one month in a year which is four weeks long and it is only that long about three quarters of the time.
Even intuitively defining these terms can be problematic. For instance, what is the date one month after January 31st, 2001?
JavaScript will happily call this March 3rd, 2001. Humans will typically debate either February 28th, 2001 or March 1st, 2001.
It seems there isn't a "right" answer, per se.

## The Algorithm

*Countdown.js* emphasizes producing intuitively correct description of timespans which are consistent as time goes on.
To do this, *Countdown.js* uses the concept of "today's date next month" to mean "a month from now".
As the days go by, *Countdown.js* produces consecutively increasing or decreasing counts without inconsistent jumps.
The range of accuracy is only limited by the underlying system clock.

*Countdown.js* approaches finding the difference between two times like an elementary school subtraction problem.
Each unit acts like a base-10 place where any overflow is carried to the next highest unit, and any underflow is borrowed from the next highest unit.
In base-10 subtraction, every column is worth 10 times the previous column.
With time, it is a little more complex since the conversions between the units of time are not the same and months are an inconsistent number of days.
Internally, *Countdown.js* maintains the concept of a "reference month" which determines how many days a given month or year represents.
In the final step of the algorithm, *Countdown.js* then prunes the set of time units down to only those requested, forcing larger units down to smaller.

### Time Zones & Daylight Savings Time

As of v2.4, *Countdown.js* performs all calculations with respect to the **viewer's local time zone**.
Earlier versions performed difference calculations in UTC, which is generally the correct way to do math on time.
In this situation, however, an issue with using UTC happens when either of the two dates being worked with is within one time zone offset of a month boundary.
If the UTC interpretation of that instant in time is in a different month than that of the local time zone, then the viewer's perception is that the calculated time span is incorrect.
This is the heart of the problem that *Countdown.js* attempts to solve: talking about spans of time can be ambiguous.
Nearly all bugs reported for *Countdown.js* have been because the viewer expects something different due to their particular time zone.

JavaScript ([ECMA-262](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.7)) only works with dates as UTC or the local time zone, not arbitrary time zones.
By design, all JS Date objects represent an instant in time (milliseconds since midnight Jan 1, 1970 **in UTC**) interpreted as the user's local time.
Since most humans think about local time not UTC, it the most makes sense to perform this time span algorithm in reference to local time.

Daylight Savings Time further complicates things, creating hours which get repeated and hours which cannot exist.
*Countdown.js* effectively ignores these edge cases and talks about time preferring human intuition about time over surprise exactness.
Example: A viewer asks for the description from noon the day before a daylight savings begins to noon the day after.
A computer would answer "23 hours" whereas a human would confidently answer "1 day" even after being reminded to "Spring Forward".
The computer is technically more accurate but this is not the value that humans actually expect or desire.
Humans pretend that time is simple and makes sense. Unfortunately, humans made time far more complex than it needed to be with time zones and daylight savings.
UTC simplifies time but at the cost of being inconsistent with human experience.

----

## The API

A simple but flexible API is the goal of *Countdown.js*. There is one global function with a set of static constants:

    var timespan = countdown(start|callback, end|callback, units, max, digits);

The parameters are a starting Date, ending Date, an optional set of units, an optional maximum number of units, and an optional maximum number of decimal places on the smallest unit. `units` defaults to `countdown.DEFAULTS`, `max` defaults to `NaN` (all specified units), `digits` defaults to `0`.

	countdown.ALL =
		countdown.MILLENNIA |
		countdown.CENTURIES |
		countdown.DECADES |
		countdown.YEARS |
		countdown.MONTHS |
		countdown.WEEKS |
		countdown.DAYS |
		countdown.HOURS |
		countdown.MINUTES |
		countdown.SECONDS |
		countdown.MILLISECONDS;

	countdown.DEFAULTS =
		countdown.YEARS |
		countdown.MONTHS |
		countdown.DAYS |
		countdown.HOURS |
		countdown.MINUTES |
		countdown.SECONDS;

This allows a very minimal call to accept the defaults and get the time since/until a single date. For example:

	countdown( new Date(2000, 0, 1) ).toString();

This will produce a human readable description like:

	11 years, 8 months, 4 days, 10 hours, 12 minutes and 43 seconds

### The `start` / `end` arguments

The parameters `start` and `end` can be one of several values:

1. `null` which indicates "now".
2. a JavaScript `Date` object.
3. a `number` specifying the number of milliseconds since midnight Jan 1, 1970 UTC (i.e., the "UNIX epoch").
4. a callback `function` accepting one timespan argument.

To reference a specific instant in time, either use a `number` offset from the epoch, or a JavaScript `Date` object instantiated with the specific offset from the epoch.
In JavaScript, if a `Date` object is instantiated using year/month/date/etc values, then those values are interpreted interpreted in reference to the browser's local time zone and daylight savings settings.

If `start` and `end` are both specified, then repeated calls to `countdown(...)` will always return the same result.
If one date argument is left `null` while the other is provided, then repeated calls will count up if the provided date is in the past, and it will count down if the provided date is in the future.
For example,

	var daysSinceLastWorkplaceAccident = countdown(507314280000, null, countdown.DAYS);

If a callback function is supplied, then an interval timer will be started with a frequency based upon the smallest unit (e.g., if `countdown.SECONDS` is the smallest unit, the callback will be invoked once per second). Rather than returning a Timespan object, the timer's ID will be returned to allow canceling by passing into `window.clearInterval(id)`. For example, to show a timer since the page first loaded:

	var timerId =
	  countdown(
	    new Date(),
	    function(ts) {
	      document.getElementById('pageTimer').innerHTML = ts.toHTML("strong");
	    },
	    countdown.HOURS|countdown.MINUTES|countdown.SECONDS);
	
	// later on this timer may be stopped
	window.clearInterval(timerId);

### The `units` argument

The static units constants can be combined using [standard bitwise operators](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators). For example, to explicitly include "months or days" use bitwise-OR:

	countdown.MONTHS | countdown.DAYS

To explicitly exclude units like "not weeks and not milliseconds" combine bitwise-NOT and bitwise-AND:

	~countdown.WEEKS & ~countdown.MILLISECONDS

[Equivalently](http://en.wikipedia.org/wiki/De_Morgan's_laws), to specify everything but "not weeks or milliseconds" wrap bitwise-NOT around bitwise-OR:

	~(countdown.WEEKS | countdown.MILLISECONDS)

### The `max` argument

The next optional argument `max` specifies a maximum number of unit labels to display. This allows specifying which units are interesting but only displaying the `max` most significant units.

	countdown(start, end, units).toString() => "5 years, 1 month, 19 days, 12 hours and 17 minutes"

Specifying `max` as `2` ensures that only the two most significant units are displayed **(note the rounding of the least significant unit)**:

	countdown(start, end, units, 2).toString() => "5 years and 2 months"

Negative or zero values of `max` are ignored.

----
#### Breaking change in v2.3.0!
Previously, the `max` number of unit labels argument used to be specified when formatting in `timespan.toString(...)` and `timespan.toHTML(...)`. v2.3.0 moves it to `countdown(...)`, which improves efficiency as well as enabling fractional units (see below).

----

### The `digits` argument

The final optional argument `digits` allows fractional values on the smallest unit.

	countdown(start, end, units, max).toString() => "5 years and 2 months"

Specifying `digits` as `2` allows up to 2 digits beyond the decimal point to be displayed **(note the rounding of the least significant unit)**:

	countdown(start, end, units, max, 2).toString() => "5 years and 1.65 months"

`digits` must be between `0` and `20`, inclusive.

----
#### Rounding

With the calculations of fractional units in v2.3.0, the smallest displayed unit now properly rounds. Previously, the equivalent of `"1.99 years"` would be truncated to `"1 year"`, as of v2.3.0 it will display as `"2 years"`.

Typically, this is the intended interpretation but there are a few circumstances where people expect the truncated behavior. For example, people often talk about their age as the lowest possible interpretation. e.g., they claim "39-years-old" right up until the morning of their 40th birthday (some people do even for years after!). In these cases, after calling <code>countdown(start,end,units,max,20)</code> with the largest possible number of `digits`, you might want to set `ts.years = Math.floor(ts.years)` before calling `ts.toString()`. The vain might want you to set `ts.years = Math.min(ts.years, 39)`!

----

### Timespan result

The return value is a Timespan object which always contains the following fields:

- `Date start`: the starting date object used for the calculation
- `Date end`: the ending date object used for the calculation
- `Number units`: the units specified
- `Number value`: total milliseconds difference (i.e., `end` - `start`). If `end < start` then `value` will be negative.

Typically the `end` occurs after `start`, but if the arguments were reversed, the only difference is `Timespan.value` will be negative. The sign of `value` can be used to determine if the event occurs in the future or in the past.

The following time unit fields are only present if their corresponding units were requested:

- `Number millennia`
- `Number centuries`
- `Number decades`
- `Number years`
- `Number months`
- `Number days`
- `Number hours`
- `Number minutes`
- `Number seconds`
- `Number milliseconds`

Finally, Timespan has two formatting methods each with some optional parameters. If the difference between `start` and `end` is less than the requested granularity of units, then `toString(...)` and `toHTML(...)` will return the empty label (defaults to an empty string).

`String toString(emptyLabel)`: formats the Timespan object as an English sentence. e.g., using the same input:

	ts.toString() => "5 years, 1 month, 19 days, 12 hours and 17 minutes"

`String toHTML(tagName, emptyLabel)`: formats the Timespan object as an English sentence, with the specified HTML tag wrapped around each unit. If no tag name is provided, "`span`" is used. e.g., using the same input:

	ts.toHTML() => "<span>5 years</span>, <span>1 month</span>, <span>19 days</span>, <span>12 hours</span> and <span>17 minutes</span>"

	ts.toHTML("em") => "<em>5 years</em>, <em>1 month</em>, <em>19 days</em>, <em>12 hours</em> and <em>17 minutes</em>"

----

### Localization

Very basic localization is supported via the static `setLabels` and `resetLabels` methods. These change the functionality for all timespans on the page.

	countdown.resetLabels();

	countdown.setLabels(singular, plural, last, delim, empty, formatter);

The arugments:

- `singular` is a pipe (`'|'`) delimited ascending list of singular unit name overrides
- `plural` is a pipe (`'|'`) delimited ascending list of plural unit name overrides
- `last` is a delimiter before the last unit (default: `' and '`)
- `delim` is a delimiter to use between all other units (default: `', '`),
- `empty` is a label to use when all units are zero (default: `''`)
- `formatter` is a function which takes a `number` and returns a `string` (default uses `Number.toString()`),  
  allowing customization of the way numbers are formatted, e.g., commas every 3 digits or some unique style that is specific to your locale.

Notice that the spacing is part of the labels.

The following examples would translate the output into Brazilian Portuguese and French, respectively:

	countdown.setLabels(
		' milissegundo| segundo| minuto| hora| dia| semana| mês| ano| década| século| milênio',
		' milissegundos| segundos| minutos| horas| dias| semanas| meses| anos| décadas| séculos| milênios',
		' e ',
		' + ',
		'agora');

	countdown.setLabels(
		' milliseconde| seconde| minute| heure| jour| semaine| mois| année| décennie| siècle| millénaire',
		' millisecondes| secondes| minutes| heures| jours| semaines| mois| années| décennies| siècles| millénaires',
		' et ',
		', ',
		'maintenant');

If you only wanted to override some of the labels just leave the other pipe-delimited places empty. Similarly, leave off any of the delimiter arguments which do not need overriding.

	countdown.setLabels(
		'||| hr| d',
		'ms| sec|||| wks|| yrs',
		', and finally ');

	ts.toString() => "1 millennium, 2 centuries, 5 yrs, 1 month, 7 wks, 19 days, 1 hr, 2 minutes, 17 sec, and finally 1 millisecond"

If you only wanted to override the empty label:

	countdown.setLabels(
		null,
		null,
		null,
		null,
		'Now.');

	ts.toString() => "Now."

The following would be effectively the same as calling `countdown.resetLabels()`:

	countdown.setLabels(
		' millisecond| second| minute| hour| day| week| month| year| decade| century| millennium',
		' milliseconds| seconds| minutes| hours| days| weeks| months| years| decades| centuries| millennia',
		' and ',
		', ',
		'',
		function(n){ return n.toString(); });

----

## License

Distributed under the terms of [The MIT license][2].

----

Copyright (c) 2006-2014 [Stephen M. McKamey][3]

  [1]: http://countdownjs.org
  [2]: https://raw.githubusercontent.com/mckamey/countdownjs/master/LICENSE.txt
  [3]: http://mck.me
