// app.js
const express = require('express');
const cors = require('cors');
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chatdb";

const app = express();
const port = 8300;

app.use(cors());

const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// io.origins(['https://jsramverk.fridasaralinnea.me:443']);

const io = require('socket.io')(server, {
    cors: {
        // origin: '*',
        origin: 'https://jsramverk.fridasaralinnea.me',
        // origin: 'http://localhost:4200',
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"]
    }
    // allowRequest: (req, callback) => {
    //     const noOriginHeader = req.headers.origin === undefined;
    //     callback(null, noOriginHeader);
    // }
});



io.on('connection', function (socket) {
    console.info("User connected");
    // Return a JSON object with list of all documents within the collection.
    try {
        let res = await findInCollection(dsn, "crowd", {}, {}, 0);
        io.emit('chat', res)
        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }

    socket.on('chat message', function (message) {
        io.emit('chat message', message);
        await saveToCollection(dsn, "crowd", message);
        console.log(messsage);
    });
});


server.listen(port, () => console.log(`Example app listening on port ${port}!`));



/**
 * Save documents in an collection.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} document   Document to save.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function saveToCollection(dsn, colName, document) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    await col.insertOne(document);

    await client.close();
}



/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}
