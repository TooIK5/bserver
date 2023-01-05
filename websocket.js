// const ws = require("ws");
// const { Message } = require("./models/models");
// const WSPORT = process.env.WSPORT || 5050;

// const wss = new ws.Server({
//     port: 5050
// }, () => console.log(`WS server started on port ${WSPORT}`));

// wss.on("connection", function connection(ws) {
//     ws.on("message", function (message) {
//         message = JSON.parse(message);
//         switch (message.event) {
//             case "message":
//                 ws.send();
//                 sendMessage(message)
//                 break;

//             case "close":
//                 disconnectHandler(message);
//                 break;

//             case "connection":
//                 connectionHandler(ws, message);
//                 sendMessage(message)
//                 break;
//         }
//     })
// });

// function connectionHandler(ws, msg) {
//     ws.did = msg.did;
//     console.log("CONNECTION: ", wss.clients.size)
// }

// async function sendMessage(message) {
//     let messageFromDB = null;
//     if (message.event !== "connection" && message.event !== "close") {
//         messageFromDB = await Message.create({
//             text: message.text,
//             uid: message.uid,
//             DialogId: message.did
//         });
//     }
  
//     wss.clients.forEach(client => {
//         if (client.did === message.did) {
//             messageFromDB ? client.send(JSON.stringify(messageFromDB)) : client.send(JSON.stringify(message));
//         }
//     })
// }