angular.module("ba.shared.util").factory("Cache", function() {
  function Cache() {
    this._cache = {};
  }

  Cache.prototype.add = function(key, value) {
    this._cache[key] = value;
  };

  Cache.prototype.remove = function(key) {
    delete this._cache[key];
  };

  Cache.prototype.get = function(key) {
    return this._cache[key];
  };

  Cache.prototype.reset = function() {
    this._cache = {};
  };

  return Cache;
});
