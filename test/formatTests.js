try{

module("Timespan.toString()");

test("Zero", function() {

	var input = countdown.timespan(0, 0);

	var expected = "";

	var actual = input.toString();

	same(actual, expected, "");
});

test("1 ms", function() {

	var input = countdown.timespan(0, 1);

	var expected = "1 millisecond";

	var actual = input.toString();

	same(actual, expected, "");
});

test("2 ms", function() {

	var input = countdown.timespan(0, 2);

	var expected = "2 milliseconds";

	var actual = input.toString();

	same(actual, expected, "");
});

test("1 sec, 2 ms", function() {

	var input = countdown.timespan(1000, 2002);

	var expected = "1 second, and 2 milliseconds";

	var actual = input.toString();

	same(actual, expected, "");
});

test("2 sec, 1 ms", function() {

	var input = countdown.timespan(10000, 12001);

	var expected = "2 seconds, and 1 millisecond";

	var actual = input.toString();

	same(actual, expected, "");
});

module("Timespan.toHTML()");

test("Zero", function() {

	var input = countdown.timespan(0, 0);

	var expected = "";

	var actual = input.toHTML();

	same(actual, expected, "");
});

test("1 ms", function() {

	var input = countdown.timespan(0, 1);

	var expected = "<span>1 millisecond</span>";

	var actual = input.toHTML();

	same(actual, expected, "");
});

}catch(ex){alert(ex);}