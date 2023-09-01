import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
const RedisStore = connectRedis(session);



const redisClient = redis.createClient({
    url: "redis://127.0.0.1:6379"
}) as any;
export { RedisStore, redisClient };
