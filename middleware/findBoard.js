const db = require('../config/db');

let findBoard = (req, res, next) => {
    let id = parseInt(req.body.id)

    let sql = `SELECT BOARD_TITLE, BOARD_CONT, MENU_CD FROM TB_BOARD WHERE BOARD_CD = ${id}; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        if(result.length === 0) {
            res.status(400).json({success: false, code: 1})
        }else {
            req.menuCd = result[0]['MENU_CD'];
            req.boardTitle = result[0]['BOARD_TITLE'];
            req.boardCont = JSON.parse(result[0]['BOARD_CONT']);

            next();
        }

    }) 

}

module.exports = { findBoard }