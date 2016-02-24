#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Simple TTL cache. put and get.

Suitable for use in browsers and Node.js.

## Install

```sh
$ npm install --save tiny-ttl-cache
```

## Usage

```js
var TTLCache = require('tiny-ttl-cache');

var maxSize = 100;
var timeToLive = 10 * 1000; // 10s in ms

var cache = new TTLCache(maxSize, timeToLive);
cache.put('key', 'value');
cache.get('key'); // returns 'value'

// 10 seconds later
cache.get('key'); // returns null

cache.flush(); // Empties the cache
```

### TTL Eviction Policy

Once the cache reaches its maximum size, the item with the shortest TTL is removed.

## Development

```sh
npm install
npm test
```

## License

MIT © [Andy Hume](2016)

[npm-image]: https://badge.fury.io/js/tiny-ttl-cache.svg
[npm-url]: https://npmjs.org/package/tiny-ttl-cache
[travis-image]: https://travis-ci.org/ahume/tiny-ttl-cache.svg?branch=master
[travis-url]: https://travis-ci.org/ahume/tiny-ttl-cache
[daviddm-image]: https://david-dm.org/ahume/tiny-ttl-cache.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ahume/tiny-ttl-cache