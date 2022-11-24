const cors = require('cors')
const fs = require('fs');
const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const http = require("http").createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    }
  });

const db = require('./config/db');

const PORT = 4000
app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(__dirname));
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use('/uploads', express.static('uploads'));

app.use('/api/user', require('./router/user'));
app.use('/api/board', require('./router/board'));
app.use('/api/chat', require('./router/chat'));



http.listen(PORT, () => console.log(`연결됨 ${PORT}`))


io.on('connection', (socket) => {
    console.log(socket.id, 'Connected');
    
    socket.on('message', (data) => {
      
    let sql = `INSERT INTO TB_CHAT (CHAT_TEXT) VALUES('${data}'); `

    db.query(sql, (err, result) => {
        if(err) return 

        socket.broadcast.emit('message', data);
    }) 

    });
});