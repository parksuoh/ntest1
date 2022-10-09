const db = require('../config/db');

let checkNick = (req, res, next) => {
    let nick = req.body.nick

    db.query(`SELECT NICKNAME FROM TB_USER WHERE NICKNAME = '${nick}'; ` , (err, result) => {
        if(err) throw err

        if (result.length > 0) {
            res.status(400).json({success: false, code: 2})
        } else {
            next();
        }

    })

}

module.exports = { checkNick }