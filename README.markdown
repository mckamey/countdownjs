# [Countdown.js][1]

A simple JavaScript API for producing an accurate, intuitive description of the timespan between two Date instances.

----

## Algorithm background

While seemingly a trivial problem, the human descriptions for a span of time tend to be fuzzier than a computer naturally computes.
More specifically, months are an inherently messed up unit of time.
For instance, when a human says "in 1 month" how long do they mean? Banks often interpret this as *thirty days* but that is only correct one third of the time.
People casually talk about a month being *four weeks long* but there is only one month in a year which is four weeks long and it is only that long three quarters of the time.
Even intuitively defining these terms can be problematic. For instance, what is the date one month after January 31st, 2001?
JavaScript will happily call this March 3rd, 2001. Humans will typically debate either February 28th, 2001 or March 1st, 2001. There isn't a "right" answer, per se.

*Countdown.js* emphasizes producing intuitively correct description of timespans which are consistent as time goes on.
To do this, *Countdown.js* uses the concept of "today's date next month" to mean "a month from now".
As the days go by, *Countdown.js* produces consecutively increasing or decreasing counts without inconsistent jumps.
The range of accuracy is only limited by the underlying system clock.

*Countdown.js* approaches finding the difference between two times like an elementary school subtraction problem.
Each unit acts like a base-10 place where any overflow is carried to the next highest unit, and any underflow is borrowed from the next highest unit.
In base-10 subtraction, every column is worth 10 times the previous column. It is a little more complex since the conversions between the units of time are not the same and months are an inconsistent number of days.
In the final step of the algorithm, *Countdown.js* prunes the set of time units down to only those requested, forcing larger units down to smaller.

----

## The API

A simple but flexible API is the goal of *Countdown.js*. There is one global function with a set of static constants:

    countdown(start|callback, end|callback, units);

The parameters are a starting Date, ending Date and an optional set of units. If units is left off, it defaults to `countdown.DEFAULTS`.

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

	countdown( new Date(2000, 0, 1) );

This will toString() something like:

	11 years, 8 months, 4 days, 10 hours, 12 minutes, and 43 seconds

### Timespan result

The return value is a Timespan object which always contains the following fields:

- `Date start`: the starting date object used for the calculation
- `Date end`: the ending date object used for the calculation
- `Number units`: the units specified
- `Number value`: total milliseconds difference (i.e., end - start) if end < start this will be negative

Typically the `end` occurs after `start` but the arguments were reversed, the only difference is `Timespan.value` will be negative. The sign of `value` can be used to determine if the event occurs in the future or in the past. 

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

Finally, Timespan has a few formatting methods:

`toString()`: formats the Timespan object as an English sentence, e.g.,

	ts.toString() => "5 years, 1 month, 19 days, 12 hours, and 17 minutes"

`toString(max)`: formats the Timespan object as an English sentence, but only returns the `max` most significant units. e.g., using the same input:

	toString(2) => "5 years, and 1 month

Negative values of `max` indicates the number of units to leave off. e.g., using the same input:

	toString(-2) => "5 years, 1 month, and 19 days"

`toHTML(tagName)`: formats the Timespan object as an English sentence, with the specified HTML tag wrapped around each unit. If no tag name is provided, "`span`" is used. e.g. using the same input,

	ts.toHTML("em") => "<em>5 years</em>, <em>1 month</em>, <em>19 days</em>, <em>12 hours</em>, and <em>17 minutes</em>"

`toHTML(tagName, max)`: the optional `max` parameter similarly restricts the total number of units returned. e.g., using the same input:

	ts.toHTML("em", 3) => "<em>5 years</em>, <em>1 month</em>, and <em>19 days</em>"
	ts.toHTML("em", -1) => "<em>5 years</em>, <em>1 month</em>, <em>19 days</em>, and <em>12 hours</em>"

If `start` and `end` are exactly the same (for the requested granularity of units), or `max` is zero, then `toString()` and `toHTML()` will return an empty string.

### The `start` / `end` arguments

The parameters `start` and `end` can be one of several values:

1. `null` which indicates "now".
2. a JavaScript `Date` object.
3. a number specifying the number of milliseconds since midnight Jan 1, 1970 UTC (i.e., the "UNIX epoch").
4. a callback function accepting one timespan argument.

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

The static units constants can be combined using standard bitwise operators. For example, to explicitly include "months and years" use bitwise-OR:

	countdown.MONTHS | countdown.DAYS

To explicitly exclude units like "not weeks and not milliseconds" combine bitwise-NOT and bitwise-AND:

	~countdown.WEEKS & ~countdown.MILLISECONDS

Equivalently, to specify everything but "not weeks or milliseconds" wrap bitwise-NOT around bitwise-OR:

	~(countdown.WEEKS | countdown.MILLISECONDS)

## License

Distributed under the terms of [The MIT license][2].

----

Copyright (c) 2006-2011 Stephen M. McKamey

  [1]: http://countdownjs.org
  [2]: https://bitbucket.org/mckamey/countdown.js/raw/tip/LICENSE.txt
