const db = require('../config/db');

let checkLike = (req, res, next) => {
    let id = req.body.id
    let uid = req.body.uid

    let sql = `SELECT LIKE_CD FROM TB_BOARD_LIKE WHERE BOARD_CD = ${id} AND UID = ${uid}; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        if (result[0]) {
            let dltSql = `DELETE FROM TB_BOARD_LIKE WHERE LIKE_CD = ${result[0]['LIKE_CD']} ; `

            db.query(dltSql, (err, res) => {
                if(err) return res.status(400).json({success: false, err: err})
                
                next()
            }) 

        } else {
            next()
        }
        
    }) 

}

module.exports = { checkLike }