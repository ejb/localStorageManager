# localStorageManager

A light wrapper to safeguard the browser's native localStorage from overflowing.

## Methods

### setItem

Works the same way as normal localStorage. Set a key (unique name) and value. Both should be strings.

    localStorageManager.setItem('Item Key','Item Value');

### getItem

Works the same way as normal localStorage. Get an item's value by its key

    var item = localStorageManager.getItem('Item Key');

### removeItem

Works the same way as normal localStorage. Remove an item by its key

    localStorageManager.removeItem('Item Key');

### getAll

Retrieves all items stored by localStorageManager as an array.

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

### prune

COMING SOON


## Settings

identifier;
