var HereMaps = require("nativescript-here-maps").HereMaps;
var hereMaps = new HereMaps();

describe("greet function", function() {
    it("exists", function() {
        expect(hereMaps.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(hereMaps.greet()).toEqual("Hello, NS");
    });
});