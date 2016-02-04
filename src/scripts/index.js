
var unique = require('uniq');

var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];
console.log(unique(data));

function test_yannick(x) {
    return console.info(x);
}

module.exports = test_yannick;

