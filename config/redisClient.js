import redis from "redis";
import { promisify } from "util";

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

client.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});

// Promisify Redis commands
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);

const initializeRedis = () => {
  // Lakukan inisialisasi Redis lainnya (jika ada)
};

export { client, getAsync, setAsync, expireAsync, initializeRedis };
