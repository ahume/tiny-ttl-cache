/**
  * TTL cache implementation
  * Items cached in object hash and ordered in array.
  * All async operations are O(1), 'put' schedules a cleanup O(n) if required.
  */


function TTLCache(maxItems, ttl) {
	this._setup();
	this.maxItems = maxItems;
	this.ttl = ttl || 1000;
}

TTLCache.prototype = {

	put: function (key, value) {

		var node = this.cache[key];

		if (!node) {
        	// Check the cache size and prune if neccessary.
            if (this.cacheSize >= this.maxItems) {
            	var keyToDelete = this.itemList.pop();
            	delete this.cache[keyToDelete];
            }
            node = {};
            this.cacheSize = this.cacheSize + 1;
        }

        // Set node's new values.
        node.ttl = Date.now() + this.ttl;
        node.value = value;
        node.key = key;

        this.itemList.unshift(key);
		this.cache[key] = {
			ttl: Date.now() + this.ttl,
			value: value,
			key: key
		};

        // Schedule a flush of expired keys at the next time we know this is required.
        this.scheduleExpiryFlush(Date.now() + this.ttl);
	},

    scheduleExpiryFlush: function (expiryTime) {
        var now = Date.now();
        var timeUntilExpiry = expiryTime - now;

        setTimeout(function () {
            for (var i = this.itemList.length - 1; this.itemList[i]; i--) {
                var key = this.itemList[i];
                if (this.cache[key].ttl > now) {
                    this.itemList.pop();
                    delete this.cache[key];
                } else {
                    // We've hit the first one that hasn't expired. Stop.
                    break;
                }
            }
        }.bind(this), timeUntilExpiry);
    },

	get: function (key) {
		var node = this.cache[key];
		if (!node || node.expiry > Date.now()) {
			return null;
		}

		return node.value;
	},

	flush: function () {
		this._setup();
	},

	_setup: function () {
		this.cache = {};
		this.itemList = [];
		this.cacheSize = 0;
	}
};

module.exports = TTLCache;