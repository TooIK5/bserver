require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const PORT = process.env.PORT || 5000;
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorhandlingmiddleware");
const bodyParser = require('body-parser');
const client = require("./httpclient");
const path = require('path');
const events = require("events");
const chatController = require("./routes/controllers/chatController");
const emmiter = new events.EventEmitter();

function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, UPDATE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, uid");
    next();
}

const app = express();
app.use(fileUpload({}));
app.use(cors);
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use('/api', router);
app.engine('html', require('ejs').renderFile);
//Обработка ошибок идет последней
app.use(errorHandler);

const start = async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {

    }
}

start();

//wss 

const ws = require("ws");
const { Message } = require("./models/models");

const WSPORT = process.env.WSPORT || 5050;

const wss = new ws.Server({
    port: 5050
}, () => console.log(`WS server started on port ${WSPORT}`));

wss.on("connection", function connection(ws) {
    ws.on("message", function (message) {
        message = JSON.parse(message);
        switch (message.event) {
            case "message":
                ws.send();
                sendMessage(message)
                break;

            case "connection":
                    connectionHandler(ws, message);
                    break;

            case "close":
                disconnectionHandler(message.uid);
                break;
        }
    })
});

let onliners = new Map();

function connectionHandler(ws, msg) {
    ws.uid = msg.uid;
    onliners.set(msg.uid, ws);
    sendMessage(msg);
    console.log("CONNECTION: ", wss.clients.size)
}

function disconnectionHandler(id) {
    onliners.delete(id);
    console.log("DISCONNECT: ", wss.clients.size)
}

async function sendMessage(message) {
    let messageFromDB = null;

    if (message.event === "message") {
        messageFromDB = await Message.create({
            text: message.text,
            uid: message.uid,
            DialogId: message.did
        });
    }

        let rec = onliners.get(message.rid);
        let self = onliners.get(message.uid);
        if (messageFromDB) {
            message.createdAt = messageFromDB.createdAt;
        }
       
        if (rec) {
            rec.send(JSON.stringify(message));
        } else {
            console.log("rec:",  rec);
            if (message.did) {
                chatController.setUnreadebale(message.rid, message.did)
            }
        }

        self.send(JSON.stringify(message));
}

const cport = process.env.CPORT || 4000;
  client.listen(cport, function () {
    console.log("Listening on " + cport);
});

