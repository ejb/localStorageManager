# localStorageManager

A light wrapper to safeguard the browser's native localStorage from overflowing.

## Methods

### setItem

Works the same way as normal localStorage. Set a key (unique name) and value. Both should be strings.

    localStorageManager.setItem('Item Key','Item Value');

### getItem

Works the same way as normal localStorage. Get an item's value by its key.

    var item = localStorageManager.getItem('Item Key');
    
### getItemMetadata

Returns an object with the item's `key`, `value`, `index` and `timestamp`.

### removeItem

Works the same way as normal localStorage. Remove an item by its key

    localStorageManager.removeItem('Item Key');

### getAll

Retrieves all items stored by localStorageManager as an object.

    localStorageManager.getAll();

Pass in a config object to get different results. Setting `format` to `"array"` will return the results as an array of objects instead of an object:

    var items = localStorageManager.getAll({
        "all": true
    });
    // items[0] would look like:
    // {
    //     key: "Item Key",
    //     value: "Item Value",
    //     index: 4
    // }


Setting `all` to true will return everything in localStorage, not just items stored by localStorageManager.

    localStorageManager.getAll({
        "all": true
    });
    
### getArray

Retrieves all items stored by localStorageManager as an array. Shortcut for `getAll` with 'array' set to true.


### getFirst

Retrieves object form of earliest item recorded.


### clearOldest

Clears the oldest five (tracked) items from localStorage.


## Settings

### onFull

Function run when localStorage is full, but *before* cleanup. Only fires once every 1000 miliseconds.

    localStorageManager.onFull = function(){
        alert("localStorage is full!");
    }

### identifier

String to identify all localStorage items set by localStorageManager. Changing it to something else is not recommended.

## Testing

Download and open `test/test.htm` in your browser to run QUnit tests. No automated testing set up (yet).

## Version history

**v0.1.0**

- First versioned release.
