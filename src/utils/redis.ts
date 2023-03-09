import { createClient } from "redis";

// 6379

const redisClient = createClient();

redisClient.connect();

export default redisClient;
