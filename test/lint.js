load("lib/jslint/jslint.js");

var src = readFile("countdown.js");

JSLINT(src, { browser: true, undef: true, eqeqeq: true, regexp: true, newcap: true, maxerr: 100 });

var ok = {
	"Use '===' to compare with 'null'.": true,
	"Use '!==' to compare with 'null'.": true
};

var e = JSLINT.errors, found = 0, w;

for (var i = 0; i < e.length; i++) {
	w = e[i];

	if (!ok[ w.reason ]) {
		found++;
		print("\n" + w.evidence + "\n");
		print("    Problem at line " + w.line + " character " + w.character + ": " + w.reason);
	}
}

if (found > 0) {
	print("\n" + found + " Error(s) found.");

} else {
	print("JSLint check passed.");
}
