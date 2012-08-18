var nativeRandomLCG = function (seed) {
    return function () {
        seed = (214013 * seed + 2531011) % 0x100000000;
        return seed * (1.0 / 4294967296.0);
    };
};

var evalRandomLCG = function (seed) {
    var randomLCG = eval("(" + nativeRandomLCG.toString() + ")");
    return randomLCG(seed);
};

var parseRandomLCG = function (seed) {
    if (typeof(document)!='undefined') {
        var src="var parsedRandomLCG="+nativeRandomLCG.toString()+";";
        var script = document.createElement("script");
        script.innerHTML = src;
        document.getElementsByTagName('head')[0].appendChild(script);
        return parsedRandomLCG(seed);
    } else {
        return evalRandomLCG(seed);
    }
}

var test = function (iteration) {
    for (var i = 1; i < arguments.length; i++) {
        var suite = arguments[i];
        
        var start = new Date();
        
        var target = suite.target;
        for (var j = 0; j < iteration; j++) {
            target();
        }
        
        var timePassed = new Date() - start;
        console.log(suite.name + ": " + timePassed + "ms")
    }
}

var parseSuite = {
    name: "parse",
    target: parseRandomLCG(100)
};

var nativeSuite = {
    name: "native",
    target: nativeRandomLCG(100)
};

var evalSuite = {
    name: "eval",
    target: evalRandomLCG(100)
};

var iterations = [100, 200, 300];

for (var round = 0; round < iterations.length; round++) {
    console.log("Round " + round);
    test(iterations[round] * 1000 * 1000, nativeSuite, evalSuite, parseSuite);
    console.log("");
}