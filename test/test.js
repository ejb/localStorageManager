QUnit.begin(function(){
    localStorage.clear();
});

QUnit.test( "sets and gets", function( assert ) {
    localStorageManager.setItem('A','B');
    var item = localStorageManager.getItem('A');
    assert.equal( item, 'B' );
    localStorageManager.removeItem('A');
});

QUnit.test( "removes", function( assert ) {
    localStorageManager.setItem('A','B');
    var item = localStorageManager.getItem('A');
    assert.equal( item, 'B' );
    localStorageManager.removeItem('A');
    var item = localStorageManager.getItem('A');
    assert.ok( item === null );
});


QUnit.test( "gets LSM-set items", function( assert ) {
    localStorageManager.setItem('A','B');
    localStorageManager.setItem('j','k');
    localStorageManager.setItem('X','Y');
    assert.equal( localStorageManager.getItem('A'), 'B' );
    var items = localStorageManager.getAll();
    assert.equal( items['A'], 'B' );
    localStorageManager.removeItem('A');
    localStorageManager.removeItem('j');
    localStorageManager.removeItem('X');
});

QUnit.test( "gets LSM-set items as array", function( assert ) {
    localStorageManager.setItem('A5','B');
    localStorageManager.setItem('j5','k');
    localStorageManager.setItem('X5','Y');
    var items = localStorageManager.getAll({
        format: 'array'
    });
    assert.equal( items.length, 3 );
    localStorageManager.removeItem('A5');
    localStorageManager.removeItem('j5');
    localStorageManager.removeItem('X5');
});

QUnit.test( "getArray shortcut", function( assert ) {
    localStorageManager.setItem('A','B');
    localStorageManager.setItem('j','k');
    localStorageManager.setItem('X','Y');
    var items = localStorageManager.getArray();
    assert.equal( items.length, 3 );
    localStorageManager.removeItem('A');
    localStorageManager.removeItem('j');
    localStorageManager.removeItem('X');
});



QUnit.test( "gets all items", function( assert ) {
    localStorageManager.setItem('A','B');
    localStorageManager.setItem('j','k');
    localStorageManager.setItem('X','Y');
    var items = localStorageManager.getAll({ all: true, format: 'array' });
    assert.ok( localStorage.length === items.length );
    localStorageManager.removeItem('A');
    localStorageManager.removeItem('j');
    localStorageManager.removeItem('X');
});


function repeat(string, count) {
  var array = []
  while (count--) {
    array.push(string)
  }
  return array.join('')
}

var n10b = '0123456789'
var n100b = repeat(n10b, 10)
var n1kb = repeat(n100b, 10)
var n10kb = repeat(n1kb, 10)
var n100kb = repeat(n10kb, 10)
var n999kb = repeat(n1kb, 999)
var n2500kb = repeat(n100kb, 25)

QUnit.test( "runs onFull", function( assert ) {
    assert.expect(1);
    var done = assert.async();
    localStorageManager.onFull = function(){
        assert.ok(true);
        done();
    };
    for (var i = 0; i < 1000; i++) {
        localStorageManager.setItem('B'+i,n100kb);
    }
    for (var i = 0; i < 1000; i++) {
        localStorageManager.removeItem('B'+i);
    }
});

QUnit.test( "getFirst gets first", function( assert ) {
    var done = assert.async();
    assert.expect(1);
    setTimeout(function(){
        localStorageManager.setItem('BB1','YY');
    },10);
    setTimeout(function(){
        localStorageManager.setItem('BB2','ZZ');
    },20);
    setTimeout(function(){
        assert.equal(localStorageManager.getFirst().value, 'YY');
        localStorageManager.removeItem('BB1');
        localStorageManager.removeItem('BB2');
        done();
    },30);
});
