'use strict';
var assert = require('assert');
var TTLCache = require('../');

describe('TTLCache', function () {

    it('should return cached value', function () {
        var cache = new TTLCache(2);
        cache.put('a', '1');
        assert.equal(cache.get('a'), '1');
    });

    it('should not keep more than maxSize items', function () {
        var cache = new TTLCache(2, 5);
        cache.put('a', '1');
        cache.put('b', '2');
        cache.put('c', '3');
        assert.equal(cache.get('c'), '3');
        assert.equal(cache.get('b'), '2');
        assert.equal(cache.get('a'), null);
    });

    it('should prune item with shortest TTL', function (done) {
        var cache1 = new TTLCache(2, 5);
        var cache2 = new TTLCache(2, 10);

        cache1.put('a', '1');
        assert.equal(cache1.get('a'), '1');

        cache2.put('b', '2');
        assert.equal(cache2.get('b'), '2');

        // After 10ms, cache1:a should be expired
        setTimeout(function () {
            assert.equal(cache1.get('a'), null);
        }, 10);

        // After 5ms, cache2:b should still be available
        setTimeout(function () {
            assert.equal(cache2.get('b'), '2');

            // After a further 10ms, cache2:b should be expired.
            setTimeout(function () {
                assert.equal(cache2.get('b'), null);
                done();
            }, 10);

        }, 5);
    });

    it('should empty cache on clear', function () {
        var cache = new TTLCache(2);
        cache.put('a', '1');
        cache.put('b', '2');
        cache.flush();
        assert.equal(cache.get('a'), null);
        assert.equal(cache.get('b'), null);

        // Then behaves normally.
        cache.put('a', '1');
        cache.put('b', '2');
        cache.put('c', '3');
        assert.equal(cache.get('c'), '3');
        assert.equal(cache.get('b'), '2');
        assert.equal(cache.get('a'), null);
    });
});
