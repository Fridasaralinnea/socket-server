// app.js
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

// const mongo = require("mongodb").MongoClient;
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chatdb";



const app = express();
const port = 8300;

app.use(cors());

const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// io.origins(['https://jsramverk.fridasaralinnea.me:443']);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        // origin: 'https://jsramverk.fridasaralinnea.me',
        // origin: 'http://localhost:4200',
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"]
    }
});



io.on('connection', function (socket) {
    console.info("User connected");

    socket.on('chatMessage',async function (message) {
        io.emit('chatMessage', message);
        await saveToCollection("chat", message);
        console.log(message);
    });
});

app.get('/', async (req, res) => {
    // res.send("Heyyy");
    let chat = await findInCollection("chat", {}, {}, 0);

    res.json(chat);
});


server.listen(port, () => console.log(`Example app listening on port ${port}!`));



/**
 * Save documents in an collection.
 *
 * @async
 *
 * @param {string} colName    Name of collection.
 * @param {object} document   Document to save.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function saveToCollection(colName, document) {
    const client  = await MongoClient.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // tls: true,
        tlsCAFile: "./ca-certificate.crt",
    });
    console.log(client);
    const db = await client.db("chat");
    const col = await db.collection(colName);
    await col.insertOne(document);

    await client.close();
}



/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(colName, criteria, projection, limit) {
    const client  = await MongoClient.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // tls: true,
        tlsCAFile: "./ca-certificate.crt",
    });
    console.log("#### Getting chat data!!!");
    console.log(client);
    const db = await client.db("chat");
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}
