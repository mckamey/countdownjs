try{

module('Timespan.toString()');

test('Default empty label override', function() {

	var input = countdown(0, 0, countdown.ALL);

	countdown.setLabels(null, null, null, null, 'Now.');

	var expected = 'Now.';

	var actual = input.toString();

	countdown.resetLabels();

	same(actual, expected, '');
});

test('Empty label override', function() {

	var input = countdown(0, 0, countdown.ALL);

	var expected = 'Now!';

	var actual = input.toString('Now!');

	same(actual, expected, '');
});

test('Default empty label override, overridden', function() {

	var input = countdown(0, 0, countdown.ALL);

	countdown.setLabels(null, null, null, null, 'Now.');

	var expected = 'Right now!';

	var actual = input.toString('Right now!');

	countdown.resetLabels();

	same(actual, expected, '');
});

test('Zero', function() {

	var input = countdown(0, 0, countdown.ALL);

	var expected = '';

	var actual = input.toString();

	same(actual, expected, '');
});

test('1 ms', function() {

	var input = countdown(0, 1, countdown.ALL);

	var expected = '1 millisecond';

	var actual = input.toString();

	same(actual, expected, '');
});

test('2 ms', function() {

	var input = countdown(0, 2, countdown.ALL);

	var expected = '2 milliseconds';

	var actual = input.toString();

	same(actual, expected, '');
});

test('1 sec, 2 ms', function() {

	var input = countdown(1000, 2002, countdown.ALL);

	var expected = '1 second and 2 milliseconds';

	var actual = input.toString();

	same(actual, expected, '');
});

test('2 sec, 1 ms', function() {

	var input = countdown(10000, 12001, countdown.ALL);

	var expected = '2 seconds and 1 millisecond';

	var actual = input.toString();

	same(actual, expected, '');
});

test('1 day, reversed', function() {

	var start = new Date(1970, 0, 1, 0, 0, 0, 0);
	var end = new Date(1970, 0, 1, 0, 0, 0, 0);
	end.setDate( end.getDate()+1 );
	var input = countdown(end, start, countdown.ALL);

	var expected = '1 day';

	var actual = input.toString();

	same(actual, expected, '');
});

test('15 days', function() {

	var start = new Date(1970, 0, 1, 0, 0, 0, 0);
	var end = new Date(1970, 0, 1, 0, 0, 0, 0);
	end.setDate( end.getDate()+15 );

	var input = countdown(end, start, countdown.ALL);

	var expected = '2 weeks and 1 day';

	var actual = input.toString();

	same(actual, expected, '');
});

test('32 days', function() {

	var start = new Date(1970, 0, 1, 0, 0, 0, 0);
	var end = new Date(1970, 0, 1, 0, 0, 0, 0);
	end.setDate( end.getDate()+32 );

	var input = countdown(end, start, countdown.ALL);

	var expected = '1 month and 1 day';

	var actual = input.toString();

	same(actual, expected, '');
});

test('Millennium, week', function() {

	var start = new Date(0);
	var end = new Date(10 * 100 * 365.25 * 24 * 60 * 60 * 1000);// millennium, week

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '1 millennium and 1 week';

	var actual = input.toString();

	same(actual, expected, '');
});

test('One of each', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '1 millennium, 1 century, 1 year, 1 month, 1 week, 1 day, 1 hour, 1 minute, 1 second and 1 millisecond';

	var actual = input.toString();

	same(actual, expected, '');
});

test('Two of each', function() {

	var start = new Date(0);
	var end = new Date(
		(22 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(2 * 365 * 24 * 60 * 60 * 1000) + // year
		(31 + 29) * (24 * 60 * 60 * 1000) + // month
		(2 * 60 * 60 * 1000) + // hour
		(2 * 60 * 1000) + // min
		(2 * 1000) + // sec
		2); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '2 millennia, 2 centuries, 2 years, 2 months, 2 weeks, 2 days, 2 hours, 2 minutes, 2 seconds and 2 milliseconds';

	var actual = input.toString();

	same(actual, expected, '');
});

module('Timespan.toString(number)');

test('Millennium, week; 1 max', function() {

	var start = new Date(0);
	var end = new Date(10 * 100 * 365.25 * 24 * 60 * 60 * 1000);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL, 1);

	var expected = '1 millennium';

	var actual = input.toString();

	same(actual, expected, '');
});

test('Millennium, week; 2 max', function() {

	var start = new Date(0);
	var end = new Date(10 * 100 * 365.25 * 24 * 60 * 60 * 1000);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL, 2);

	var expected = '1 millennium and 1 week';

	var actual = input.toString();

	same(actual, expected, '');
});

test('One of each; 3 max', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL, 3);

	var expected = '1 millennium, 1 century and 1 year';

	var actual = input.toString();

	same(actual, expected, '');
});

test('One of each; zero max', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL, 0);

	var expected = '1 millennium, 1 century, 1 year, 1 month, 1 week, 1 day, 1 hour, 1 minute, 1 second and 1 millisecond';

	var actual = input.toString();

	same(actual, expected, '');
});

test('One of each; -2 max', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL, -2);

	var expected = '1 millennium, 1 century, 1 year, 1 month, 1 week, 1 day, 1 hour, 1 minute, 1 second and 1 millisecond';

	var actual = input.toString();

	same(actual, expected, '');
});

test('Almost 2 minutes, full 3 digits', function() {

	var input = countdown(new Date(915220800000), new Date(915220919999), countdown.DEFAULTS, 0, 3);

	var expected = "1 minute and 59.999 seconds";

	var actual = input.toString();

	same(actual, expected, '');
});

test('Almost 2 minutes, rounded 2 digits', function() {

	var input = countdown(new Date(915220800000), new Date(915220919999), countdown.DEFAULTS, 0, 2);

	var expected = "2 minutes";

	var actual = input.toString();

	same(actual, expected, '');
});

module('Timespan.toHTML(tag)');

test('Default empty label override', function() {

	var input = countdown(0, 0, countdown.ALL);

	countdown.setLabels(null, null, null, null, 'Now.');

	var expected = '<span>Now.</span>';

	var actual = input.toHTML();

	countdown.resetLabels();

	same(actual, expected, '<span>Now.</span>');
});

test('Empty label override', function() {

	var input = countdown(0, 0, countdown.ALL);

	var expected = '<span>Now!</span>';

	var actual = input.toHTML(null, 'Now!');

	same(actual, expected, '');
});

test('Default empty label override, overridden', function() {

	var input = countdown(0, 0, countdown.ALL);

	countdown.setLabels(null, null, null, null, 'Now.');

	var expected = '<span>Right now!</span>';

	var actual = input.toHTML(null, 'Right now!');

	countdown.resetLabels();

	same(actual, expected, '');
});

test('Zero', function() {

	var input = countdown(0, 0, countdown.ALL);

	var expected = '';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('Empty label and tag override', function() {

	var input = countdown(0, 0, countdown.ALL);

	var expected = '<em>Now!</em>';

	var actual = input.toHTML('em', 'Now!');

	same(actual, expected, '');
});

test('1 ms', function() {

	var start = new Date(0);
	var end = new Date(1);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '<span>1 millisecond</span>';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('2 days, reversed', function() {

	var start = new Date(2 * 24 * 60 * 60 * 1000);
	var end = new Date(0);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '<span>2 days</span>';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('8 days', function() {

	var start = new Date(0);
	var end = new Date(8 * 24 * 60 * 60 * 1000);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '<span>1 week</span> and <span>1 day</span>';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('70 days', function() {

	var start = new Date(0);
	var end = new Date(70 * 24 * 60 * 60 * 1000);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '<span>2 months</span>, <span>1 week</span> and <span>4 days</span>';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('366 days, non-leap year', function() {

	var start = new Date(0);
	var end = new Date(366 * 24 * 60 * 60 * 1000);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '<span>1 year</span> and <span>1 day</span>';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('366 days, leap year', function() {

	var start = new Date(2000, 0, 1);
	var end = new Date(start.getTime() + 366 * 24 * 60 * 60 * 1000);

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected = '<span>1 year</span>';

	var actual = input.toHTML();

	same(actual, expected, '');
});

test('One of each', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	var expected =
		'<em>1 millennium</em>, ' +
		'<em>1 century</em>, ' +
		'<em>1 year</em>, ' +
		'<em>1 month</em>, ' +
		'<em>1 week</em>, ' +
		'<em>1 day</em>, ' +
		'<em>1 hour</em>, ' +
		'<em>1 minute</em>, ' +
		'<em>1 second</em> and ' +
		'<em>1 millisecond</em>';

	var actual = input.toHTML('em');

	same(actual, expected, '');
});

test('Singular overrides', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	countdown.setLabels(' a| b| c| d| e| f| g| h| i| j| k');

	var expected =
		'<em>1 k</em>, ' +
		'<em>1 j</em>, ' +
		'<em>1 h</em>, ' +
		'<em>1 g</em>, ' +
		'<em>1 f</em>, ' +
		'<em>1 e</em>, ' +
		'<em>1 d</em>, ' +
		'<em>1 c</em>, ' +
		'<em>1 b</em> and ' +
		'<em>1 a</em>';

	var actual = input.toHTML('em');

	countdown.resetLabels();

	same(actual, expected, '');
});

test('Plural overrides', function() {

	var start = new Date(0);
	var end = new Date(
		(22 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(2 * 365 * 24 * 60 * 60 * 1000) + // year
		(31 + 29) * (24 * 60 * 60 * 1000) + // month
		(2 * 60 * 60 * 1000) + // hour
		(2 * 60 * 1000) + // min
		(2 * 1000) + // sec
		2); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	countdown.setLabels(null, ' A| B| C| D| E| F| G| H| I| J| K', ' &amp; ', ' &amp; ');

	var expected =
		'<em>2 K</em> &amp; ' +
		'<em>2 J</em> &amp; ' +
		'<em>2 H</em> &amp; ' +
		'<em>2 G</em> &amp; ' +
		'<em>2 F</em> &amp; ' +
		'<em>2 E</em> &amp; ' +
		'<em>2 D</em> &amp; ' +
		'<em>2 C</em> &amp; ' +
		'<em>2 B</em> &amp; ' +
		'<em>2 A</em>';

	var actual = input.toHTML('em');

	countdown.resetLabels();

	same(actual, expected, '');
});

test('Partial singular overrides', function() {

	var start = new Date(0);
	var end = new Date(
		(11 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(365 * 24 * 60 * 60 * 1000) + // year
		(31 * 24 * 60 * 60 * 1000) + // month
		(60 * 60 * 1000) + // hour
		(60 * 1000) + // min
		1000 + // sec
		1); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	countdown.setLabels(' a|| c|| e|| g|| i|| k', '| B|| D|| F|| H|| J|', ' + finally ', ' + ');

	var expected =
		'<em>1 k</em> + ' +
		'<em>1 century</em> + ' +
		'<em>1 year</em> + ' +
		'<em>1 g</em> + ' +
		'<em>1 week</em> + ' +
		'<em>1 e</em> + ' +
		'<em>1 hour</em> + ' +
		'<em>1 c</em> + ' +
		'<em>1 second</em> + finally ' +
		'<em>1 a</em>';

	var actual = input.toHTML('em');

	countdown.resetLabels();

	same(actual, expected, '');
});

test('Partial plural overrides', function() {

	var start = new Date(0);
	var end = new Date(
		(22 * 100) * (365.25 * 24 * 60 * 60 * 1000) + // millennium, century, week, day
		(2 * 365 * 24 * 60 * 60 * 1000) + // year
		(31 + 29) * (24 * 60 * 60 * 1000) + // month
		(2 * 60 * 60 * 1000) + // hour
		(2 * 60 * 1000) + // min
		(2 * 1000) + // sec
		2); // ms

	// account for local timezone
	start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
	end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

	var input = countdown(start, end, countdown.ALL);

	countdown.setLabels(' a|| c|| e|| g|| i|| k', '| B|| D|| F|| H|| J|', ', ');

	var expected =
		'<em>2 millennia</em>, ' +
		'<em>2 J</em>, ' +
		'<em>2 H</em>, ' +
		'<em>2 months</em>, ' +
		'<em>2 F</em>, ' +
		'<em>2 days</em>, ' +
		'<em>2 D</em>, ' +
		'<em>2 minutes</em>, ' +
		'<em>2 B</em>, ' +
		'<em>2 milliseconds</em>';

	var actual = input.toHTML('em');

	countdown.resetLabels();

	same(actual, expected, '');
});

}catch(ex){alert(ex);}