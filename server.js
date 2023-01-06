require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const PORT = process.env.PORT || 5000;
//const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorhandlingmiddleware");
 
const path = require('path');

function corss(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, UPDATE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next()
}

const app = express();
app.use(fileUpload({}));
app.use(corss)
app.use(express.static(path.resolve(__dirname, "static")))
app.use('/api', router);

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

            case "close":
                disconnectHandler(message);
                break;

            case "connection":
                connectionHandler(ws, message);
                sendMessage(message)
                break;
        }
    })
});

function connectionHandler(ws, msg) {
    ws.did = msg.did;
    console.log("CONNECTION: ", wss.clients.size)
}

async function sendMessage(message) {
    let messageFromDB = null;
    if (message.event !== "connection" && message.event !== "close") {
        messageFromDB = await Message.create({
            text: message.text,
            uid: message.uid,
            DialogId: message.did
        });
    }
  
    wss.clients.forEach(client => {
        if (client.did === message.did) {
            messageFromDB ? client.send(JSON.stringify(messageFromDB)) : client.send(JSON.stringify(message));
        }
    })
}


