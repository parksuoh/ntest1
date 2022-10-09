const cors = require('cors')
const fs = require('fs');
const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

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



app.listen(PORT, () => console.log(`연결됨 ${PORT}`))