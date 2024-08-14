const rateLimit = require('express-rate-limit');
const RateLimitRedis = require('rate-limit-redis');
const Redis = require('redis');
const client = Redis.createClient();

const limiter = rateLimit({
    store: new RateLimitRedis({
        client,
        expiry: 60 * 1000, // 1 minute
        prefix: 'rate-limit:'
    }),
    max: 5, // Limit each IP to 5 requests per windowMs
    windowMs: 1 * 60 * 1000 // 1 minute
});

module.exports = limiter;
