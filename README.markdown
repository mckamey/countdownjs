# [Countdown.js][1]
Distributed under the terms of [The MIT license][2].

A simple JavaScript API for producing an accurate, intuitive description of the timespan between two Date instances.

----

## Algorithm background

While seemingly a trivial problem, the human descriptions for a span of time tend to be fuzzier than a computer naturally computes.
More specifically, months are an inherently messed up unit of time.
For instance, when a human says "in 1 month" how long do they mean? Banks often interpret this as *thirty days* but that is only correct one third of the time.
People casually talk about a month being *four weeks long* but there is only one month in a year which is four weeks long and it is only that long three quarters of the time.
Even intuitively defining these terms can be problematic. For instance, what is the date one month after January 31st, 2001?
JavaScript will happily call this March 3rd, 2001. Humans will typically debate either February 28th, 2001 or March 1st, 2001. There isn't a "right" answer per se.

`Countdown.js` emphasizes producing intuitively correct description of timespans which are consistent as time goes on.
To do this, `Countdown.js` uses the concept of "today's date next month" to mean "a month from now".
As the days go by, `Countdown.js` produces consecutively increasing or decreasing counts without inconsistent jumps.
The range of accuracy is only limited by the underlying system clock.

`Countdown.js` approaches finding the difference between two times like an elementary school subtraction problem.
Each unit acts like a base-10 place where any overflow is carried to the next highest unit, and any underflow is borrowed from the next highest unit.
In base-10 subtraction, every column is worth 10 times the previous column. It is a little more complex since the conversions between the units of time are not the same and months are an inconsistent number of days.
In the final step of the algorithm, `Countdown.js` prunes the set of time units down to only those requested, forcing larger units down to smaller.

----

## The API

A simple but flexible API is the goal of `Countdown.js`. There is one global object with only one method and a set of static constants:

    countdown.timespan(start|callback, end|callback, units);

	countdown.ALL = countdown.MILLENNIA | countdown.CENTURIES | countdown.YEARS | countdown.MONTHS | countdown.WEEKS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS | countdown.MILLISECONDS;

The parameters are a starting Date, ending Date and an optional set of units. If units is left off, it defaults to `countdown.ALL`. This allows a very minimal call to accept the defaults and get the time since/until a single date. For example:

	countdown.timespan( new Date(2000, 0, 1) )

This will toString something like:

	11 years, 8 months, 2 weeks, 4 days, 10 hours, 12 minutes, 43 seconds, and 486 milliseconds

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
- `Number years`
- `Number months`
- `Number days`
- `Number hours`
- `Number minutes`
- `Number seconds`
- `Number milliseconds`

Finally, Timespan has a few formatting methods:

- toString(): formats the Timespan object as an English sentence
	(e.g. "5 years, 1 month, 19 days, 12 hours, and 17 minutes")
- toHTML(tagName): formats the Timespan object as an English sentence, with the specified HTML tag wrapped around each unit. If no tag name is provided, "`span`" is used.
	(e.g. `ts.toHTML("em")` => `"<em>5 years</em>, <em>1 month</em>, <em>19 days</em>, <em>12 hours</em>, and <em>17 minutes</em>"`)

If `start` and `end` are exactly the same (for the requested granularity of units), then `toString()` and `toHTML()` will return an empty string.

### The `start` / `end` arguments

The parameters `start` and `end` can be one of several values:

1. `null` which indicates "now".
2. a JavaScript `Date` object.
3. a number specifying the number of milliseconds since midnight Jan 1, 1970 UTC (i.e., the "UNIX epoch").
4. a callback function accepting one timespan argument.

If `start` and `end` are both specified, then repeated calls to `countdown.timespan()` will always return the same result.
If one date argument is left `null` while the other is provided, then repeated calls will count up if the provided date is in the past, and it will count down if the provided date is in the future.
For example,

	var daysSinceLastWorkplaceAccident = countdown.timespan(507314280000, null, countdown.DAYS);

If a callback function is supplied, then an interval timer will be started with a frequency based upon the smallest unit (e.g., if `countdown.SECONDS` is the smallest unit, the callback will be invoked once per second). Rather than returning a Timespan object, the timer's ID will be returned to allow canceling by passing into `window.clearInterval(id)`. For example, to show a timer since the page first loaded:

	var timerId =
		countdown.timespan(
			new Date(),
			function(ts) {
				document.getElementById('pageTimer').innerHTML = ts.toHTML("strong");
			},
			countdown.HOURS|countdown.MINUTES|countdown.SECONDS);
	
	// later on this timer may be stopped
	window.clearInterval(timerId);

### The `units` argument

The static units constants can be combined using standard bitwise operators. For example, to specify just years and months use bitwise-OR:

	countdown.MONTHS | countdown.DAYS

To specify everything but "not weeks and not milliseconds":

	~countdown.WEEKS & ~countdown.MILLISECONDS

Equivalently, specify everything but "not weeks or milliseconds":

	~(countdown.WEEKS | countdown.MILLISECONDS)

----

Copyright (c) 2006-2011 Stephen M. McKamey

  [1]: https://bitbucket.org/mckamey/countdown.js
  [2]: https://bitbucket.org/mckamey/countdown.js/raw/tip/LICENSE.txt
