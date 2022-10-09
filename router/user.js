const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkEmail } = require("../middleware/checkEmail");
const { checkNick } = require("../middleware/checkNick");
const { findEmail } = require("../middleware/findEmail");
const { auth } = require("../middleware/auth");
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MY-SECRET-KEY';



router.get('/auth', auth, (req, res) => {

    db.query(`SELECT UID, EMAIL, NICKNAME, NAME, PHONE, LEVEL, EXP, ACC_EXP, ADDRESS FROM TB_USER WHERE UID = ${req.uid}`, (err, result) => {
        if(err) throw err

        let accessToken = jwt.sign({
                                        uid: result[0]['UID'],
                                    }, 
                                    SECRET_KEY, 
                                    {
                                        expiresIn: '1d', 
                                    });

        res
        .cookie("accessToken", accessToken)
        .status(200)
        .json({
            uid: result[0]['UID'],
            email: result[0]['EMAIL'],
            nick: result[0]['NICKNAME'],
            name: result[0]['NAME'],
            phone: result[0]['PHONE'],
            level: result[0]['LEVEL'],
            exp: result[0]['EXP'],
            accExp: result[0]['ACC_EXP'],
            address: result[0]['ADDRESS'],
        })

    })   

})



router.post('/login', findEmail, (req, res) => {
    let email = req.body.email
    let pass = req.body.pass

    let resPass = CryptoJS.SHA256(CryptoJS.SHA1(pass).toString()).toString()

    db.query(`SELECT UID, PASS FROM TB_USER WHERE EMAIL = '${email}'; ` , (err, result) => {
        
        if(err) throw err


        if (!result || result[0]['PASS'] !== resPass) {
            res.status(200).json({success: false, code: 2})
        } else {
            let refreshToken = jwt.sign({
                                            uid: result[0]['UID'],
                                        }, 
                                        SECRET_KEY, 
                                        {
                                            expiresIn: '1d', 
                                        });

            let accessToken = jwt.sign({
                                            uid: result[0]['UID'],
                                        }, 
                                        SECRET_KEY, 
                                        {
                                            expiresIn: '1h', 
                                        });
                                            

            res
            .cookie("refreshToken", refreshToken)
            .cookie("accessToken", accessToken)
            .status(200)
            .json({
                text: '로그인 성공', 
                uid: result[0]['UID'],
            })
        }


    })


})


router.post('/register', checkEmail, checkNick, (req, res) => {
    let email = req.body.email
    let pass = req.body.pass
    let nick = req.body.nick
    let name = req.body.name
    let phone = req.body.phone

    let resPass = CryptoJS.SHA256(CryptoJS.SHA1(pass).toString()).toString()

    let sql = `INSERT INTO TB_USER (EMAIL, PASS, NICKNAME, NAME, PHONE, LEVEL, EXP, ACC_EXP, REGDATE) 
    VALUES('${email}', '${resPass}', '${nick}', '${name}', '${phone}', 1, 0, 0, NOW()); `

    db.query(sql, (err, result) => {
        if(err) throw err

        res.status(200).json({success: true, text: '회원가입완료'})

    })   


})



module.exports = router;