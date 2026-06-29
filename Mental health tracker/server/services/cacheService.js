const NodeCache = require("node-cache");

// Standard cache for professional resources and static data
// Default TTL: 1 hour (3600 seconds)
const appCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Cache Wrapper Utility
 * @param {string} key - Unique key for the cached data
 * @param {function} fetchFn - Async function to fetch data if not in cache
 * @param {number} ttl - Optional TTL in seconds
 */
const getOrSet = async (key, fetchFn, ttl = 3600) => {
  const value = appCache.get(key);
  if (value) {
    console.log(`[Cache] HIT: ${key}`);
    return value;
  }

  console.log(`[Cache] MISS: ${key}. Fetching fresh data...`);
  const result = await fetchFn();
  appCache.set(key, result, ttl);
  return result;
};

const clearCache = (key) => {
  if (key) {
    appCache.del(key);
  } else {
    appCache.flushAll();
  }
};

module.exports = {
  getOrSet,
  clearCache,
  appCache
};
