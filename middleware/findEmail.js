const db = require('../config/db');

let findEmail = (req, res, next) => {
    let email = req.body.email

    db.query(`SELECT EMAIL FROM TB_USER WHERE EMAIL = '${email}'; ` , (err, result) => {
        if(err) throw err

        if(result.length === 0 || result[0]['EMAIL'] !== email) {
            res.status(400).json({success: false, code: 1})
        }else {
            next();
        }
    })

}

module.exports = { findEmail }