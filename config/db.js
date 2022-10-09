const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e$R',
    port: 3306,
    database: 'test1'
})


db.connect(function(err) {
    if (err) throw err
    console.log('MYSQL 연결됨')
})

module.exports = db