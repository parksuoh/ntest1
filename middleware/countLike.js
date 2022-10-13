const db = require('../config/db');

let countLike = (req, res, next) => {
    let id = req.body.id

    let sql = `SELECT COUNT(*) AS CNT FROM TB_BOARD_LIKE WHERE BOARD_CD = ${id}; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        req.count = result[0]['CNT'];

        next()
    }) 

}

module.exports = { countLike }