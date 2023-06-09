const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000
    }
});

(async () => {
    await redisClient.connect();
})();

redisClient.on("connect", async ()=>{
    console.log("Connected to redis-server");
});

const sub = redisClient.duplicate();

(async () => {
    await sub.connect();
})();

sub.on("connect", async ()=>{
    console.log("Subscriber connected to redis-server");
});

const fib = (index) =>{
    if(index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}



(async ()=>{

    await sub.subscribe("insert", async (message, channel) => {
        console.log("Adding value to redis server from worker");
        await redisClient.hSet("values", message, fib(parseInt(message)));
    });

})();

