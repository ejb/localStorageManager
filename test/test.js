QUnit.test( "sets and gets", function( assert ) {
    localStorageManager.setItem('A','B');
    var item = localStorageManager.getItem('A');
    assert.ok( item === 'B' );
    localStorageManager.removeItem('A');
});

QUnit.test( "removes", function( assert ) {
    localStorageManager.setItem('A','B');
    var item = localStorageManager.getItem('A');
    assert.ok( item === 'B' );
    localStorageManager.removeItem('A');
    var item = localStorageManager.getItem('A');
    assert.ok( item === null );
});


QUnit.test( "gets LSM-set items", function( assert ) {
    localStorageManager.setItem('A','B');
    localStorageManager.setItem('j','k');
    localStorageManager.setItem('X','Y');
    var items = localStorageManager.getAll();
    assert.ok( items['A'] === 'B' );
    localStorageManager.removeItem('A');
    localStorageManager.removeItem('j');
    localStorageManager.removeItem('X');
});

QUnit.test( "gets LSM-set items as array", function( assert ) {
    localStorageManager.setItem('A','B');
    localStorageManager.setItem('j','k');
    localStorageManager.setItem('X','Y');
    var items = localStorageManager.getAll({
        format: 'array'
    });
    console.log(items)
    assert.ok( items[0]['key'] === 'X' );
    assert.ok( items.length === 3 );
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
