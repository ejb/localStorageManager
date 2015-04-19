(function(){
'use strict';

var localStorageManager = {
    identifier: 'localStorageManager',
    setItem: function(key,value){
        var that = this;
        var now = new Date().getTime();
        var valueWithMetadata = {
            value: value,
            timestamp: now
        };
        try {
            localStorage.setItem(
                this.identifier+'_'+key,
                JSON.stringify(valueWithMetadata)
            );
            this.full = false;
        } catch (err) {
            var error = err.name;
            // Possible error names:
            // NS_ERROR_DOM_QUOTA_REACHED
            // QuotaExceededError
            this.full = true;
        }
        if (this.full) {
            if (
                !this._lastRanOnFull && this.onFull &&
                !((now - this._lastRanOnFull) < 1000)
            ) {
                this.onFull();
                this._lastRanOnFull = now;
            }
            this.clearOldest( function(){
                that.setItem(key, value);
            } );
        }
    },
    getItem: function(key, prefix){
        prefix = prefix || this.identifier+'_';
        var parsed = this.getItemMetadata(key, prefix);
        if (parsed && parsed.value) {
            return parsed.value;
        } else {
            return null;
        }
    },
    getItemMetadata: function(key, prefix){
        if (prefix === undefined) {
            prefix = this.identifier+'_';
        } else 
        var raw = localStorage.getItem(prefix+key);
        if (!raw) {
            return null;
        }
        var parsed = JSON.parse(raw);
        parsed.key = key;
        if (parsed && parsed.value) {
            return parsed;
        }
        return null;
        
    },
    removeItem: function(key){
        localStorage.removeItem(this.identifier+'_'+key);
    },
    getAll: function(opts){
        opts = opts || {};
        var result_obj = {};
        var result_arr = [];
        for (var i = 0; i < localStorage.length; i++) {
            var item = undefined;
            var key = localStorage.key(i);
            if (opts.all === true) {
                item = this.getItemMetadata(key,'');
            } else if (key.indexOf(this.identifier) > -1) {
                item = this.getItemMetadata(key,'');
            }
            key = key.replace(this.identifier+'_','');
            if (item) {
                result_obj[key] = item.value || item;
                result_arr.push({
                    key: key,
                    value: item.value || item,
                    timestamp: item.timestamp || null,
                    index: i
                });
            }
        }
        result_arr.sort(function(a,b){
            if (a.timestamp !== b.timestamp) {
                return a.timestamp - b.timestamp;
            } else {
                return a.index - b.index;
            }
        })
        if (opts.format === 'array') {
            return result_arr;
        } else {
            return result_obj;
        }
    },
    getArray: function(opts){
        opts = opts || {};
        opts.format = 'array';
        return this.getAll(opts);
    },
    getFirst: function(){
        var arr = this.getArray();
        return arr[0];
    },
    clearOldest: function(callback){
        if (this.full !== true) {
            return;
        }
        var array = this.getArray();
        for (var i = 0; i < 3; i++) {
            localStorageManager.removeItem( array[0].key );
        }
        var testKey = this.identifier+'__test_'+new Date().getTime();
        try {
            localStorage.setItem(testKey,'A');
            // assumes test passes...
            this.full = false;
            if (callback) { callback(); }
        } catch (err) {
            this.clearOldest();
        }
        localStorage.removeItem(testKey);
    }
    
}

window.localStorageManager = localStorageManager;

}());