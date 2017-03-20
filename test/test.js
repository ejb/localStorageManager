QUnit.begin(function(){
    localStorage.clear();
});

QUnit.done(function(){
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


QUnit.test( "gets metadata", function( assert ) {
    var time = new Date().getTime();
    localStorageManager.setItem('A','B');
    assert.equal( localStorageManager.getItem('A'), 'B' );
    var item = localStorageManager.getItemMetadata('A');
    assert.equal( item.value, 'B' );
    assert.equal( item.key, 'A' );
    assert.equal( item.timestamp, time );
    localStorageManager.removeItem('A');
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
var n10kb = repeat(n1kb, 999)
var n2500kb = repeat(n100kb, 25)

QUnit.test( "runs onFull", function( assert ) {
    assert.expect(1);
    var done = assert.async();
    localStorageManager.onFull = function(){
        assert.ok(true);
        done();
    };
    for (var i = 0; i < 100; i++) {
        localStorageManager.setItem('B'+i,n100kb);
    }
    for (var i = 0; i < 100; i++) {
        localStorageManager.removeItem('B'+i);
    }
});

QUnit.test( "always saves, even when full", function( assert ) {
    var saved = 0;
    for (var i = 0; i < 100; i++) {
        localStorageManager.setItem('B'+i,n10kb);
        if ( localStorageManager.getItem('B'+i) === n10kb) {
            saved++;
        }
    }
    for (var i = 0; i < 100; i++) {
        localStorageManager.removeItem('B'+i);
    }
    assert.equal( saved, 100 );
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


QUnit.test( "clearOldest() cleanup", function( assert ) {
    for (var i = 0; i < 100; i++) {
        localStorageManager.setItem('B'+i,n100kb);
    }
    var arr = localStorageManager.getArray();
    assert.equal( arr[arr.length-1].key, 'B99', 'saves latest' );
    for (var i = 0; i < 100; i++) {
        localStorageManager.removeItem('B'+i);
    }
    assert.notOk( localStorageManager.full, '`.full` is not true');
});

QUnit.test( "malformed items", function( assert ) {
    localStorage.setItem('localStorageManager_A','asd;woih;oiq34');
    assert.throws(function() {
        localStorageManager.getItem('A');
    }, /Item in localStorage with key 'localStorageManager_A' is not valid JSON/);
    localStorage.removeItem('A');
});
