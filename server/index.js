const keys = require("./keys");

const express = require("express");
const cors = require("cors");

//Express app setup
const app = express();
app.use(cors());
app.use(express.json());

//Postgres app setup
const { Pool }  = require("pg");

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("error", () => {
    console.log("Lost Postgres connection");
});

pgClient
    .query("CREATE TABLE IF NOT EXISTS values(number INT)")
    .catch(error => console.log(error));


//Redis client setup
const redis = require("redis");
const { redisPort } = require("./keys");

const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: redisPort,
        reconnectStrategy: () => 1000
    }
});

(async () => {
    await redisClient.connect();
})();

redisClient.on("connect", async ()=>{
    console.log("Connected to redis-server");
});

const redisPublisher = redisClient.duplicate();

(async () => {
    await redisPublisher.connect();
})();

redisPublisher.on("connect", async ()=>{
    console.log("Publisher connected to redis-server");
});

//Express route handlers
app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/values/all", async (req, res)=>{
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
});

app.get("/values/current", async (req, res)=>{
    const values = await redisClient.hGetAll("values");
    console.log(values);
    res.send(values);
});

app.post("/values", async (req, res)=>{
    const index = req.body.index;
    if(parseInt(index) > 40)
        res.status(422).send("Index too high");
    redisClient.hSet("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({
        working:true
    });
});

app.listen(5000, (error) => {
    console.log("Listening on port 5000");
})