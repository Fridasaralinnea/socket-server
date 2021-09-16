// app.js
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongodb = require("mongodb");
// const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb").MongoClient;

// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/chatdb";

// const connectionStriong = "mongodb+srv://doadmin:8q10ow59L47ku2bd@db-mongodb-fra1-56535-961de8c6.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-fra1-56535&tls=true&tlsCAFile=<replace-with-path-to-CA-cert>";

// const caPath = ./ca-certificate.crt

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
    // allowRequest: (req, callback) => {
    //     const noOriginHeader = req.headers.origin === undefined;
    //     callback(null, noOriginHeader);
    // }
});



io.on('connection', function (socket) {
    console.info("User connected");

    socket.on('oldMessages', async function () {
        console.log("#########YYYAAAYYY!!!");
        let res = await findInCollection("chat", {}, {}, 0);
        io.emit('old messages', res);
        console.log(res);

        // const db = await connectToDatabase().collection("chat");
        // console.log("##########################33");
        // console.log(db);
        // console.log("##########################33");
        //
        // // const chat = await db.collection("chat").find({}).toArray();
        // const chat = await db.find({}).toArray();
        //
        // // try {
        // //     const chat = await db.collection("chat").find({}).toArray();
        // // } catch (e) {
        // //     console.log(e);
        // // }
        //
        // console.log("####### old messages!!!!!");
        //
        // io.emit('oldMessages', chat);
        // // console.log("YAAAAYYYY!!!");
        // console.log(chat);

        // return chat;
        // res.json({ chat });
    })

    // Return a JSON object with list of all documents within the collection.
    // try {
    //     let res = await findInCollection(dsn, "crowd", {}, {}, 0);
    //     io.emit('old messages', res);
    //     console.log(res);
    //     response.json(res);
    // } catch (err) {
    //     console.log(err);
    //     response.json(err);
    // }

    socket.on('chatMessage',async function (message) {
        io.emit('chatMessage', message);
        // const db = await connectToDatabase().collection("chat");
        // console.log("##########################33");
        // console.log(db);
        // console.log("##########################33");
        // // var chat = await db.collection("chat");
        //
        // // try {
        // //     const chat = await db.collection("chat");
        // // } catch (e) {
        // //     console.log(e);
        // // }
        //
        // console.log("####Adding massage to db");
        //
        // await db.insertOne(message);
        await saveToCollection("chat", message);
        console.log(message);
    });
});

app.get('/', (req, res) => {
  res.send("Heyyy");
});


server.listen(port, () => console.log(`Example app listening on port ${port}!`));


// // connect to MongoDB database
// async function connectToDatabase() {
//     const client = await MongoClient.connect(process.env.DATABASE_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         // tls: true,
//         tlsCAFile: "./ca-certificate.crt",
//     });
//
//     const db = client.db('chat');
//
//     return db;
// }



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
    const client  = await mongo.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // tls: true,
        tlsCAFile: "./ca-certificate.crt",
    });
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
    const client  = await mongo.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // tls: true,
        tlsCAFile: "./ca-certificate.crt",
    });
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}
