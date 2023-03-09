"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
// 6379
const redisClient = (0, redis_1.createClient)();
redisClient.connect();
exports.default = redisClient;
