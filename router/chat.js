const express = require('express');
const router = express.Router();
const db = require('../config/db');



router.get('/get-cont', (req, res) => {

    db.query('SELECT CHAT_TEXT FROM TB_CHAT;' , (err, result) => {
        if(err) throw err

        res.status(200).json({
            lists: result
        })

    })   

})





module.exports = router;