var localStorageManager = {
    identifier: 'localStorageManager',
    setItem: function(key,value){
        try {
            localStorage.setItem(this.identifier+'_'+key,value);
        } catch (err) {
            if (err.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                this.prune();
                this.setItem(this.identifier+'_'+key,value);
            }
        }
    },
    getItem: function(key){
        return localStorage.getItem(this.identifier+'_'+key);
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
                item = localStorage.getItem(key)
            } else if (key.indexOf(this.identifier) > -1) {
                item = localStorage.getItem(key);
            }
            key = key.replace(this.identifier+'_','');
            if (item) {
                result_obj[key] = item;
                result_arr.push({
                    key: key,
                    value: item,
                    index: i
                });
            }
        }
        if (opts.format === 'array') {
            return result_arr;
        } else {
            return result_obj;
        }
    },
    prune: function(){
        // get all, delete oldest
    }
    
}