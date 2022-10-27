const express = require('express');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const appRoot = require('app-root-path');
const moment = require("moment");
const { findBoard } = require('../middleware/findBoard');
const { countLike } = require('../middleware/countLike');
const { checkDislike } = require('../middleware/checkDislike');
const { checkLike } = require('../middleware/checkLike');
const { countDisLike } = require('../middleware/countDisLike');


router.post('/post-image', (req, res) => {
    let image = req.files.image
    let now = moment();
    let newName = now.format("YYMMDDHHmmss")+Math.random().toString().substr(2,4) + '.' + image.name.split('.')[1]
    let path1 = appRoot + `/uploads/test/` + newName;

    image.mv(
        path1,
        (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send({success: true, text: `http://localhost:4000/uploads/test/${newName}`});
        }
    )



})


router.post('/get-read-board', (req, res) => {
    let id = parseInt(req.body.id)

    let sql = `SELECT BOARD_TITLE, BOARD_CONT, UID, REGDATE, MENU_CD FROM TB_BOARD WHERE BOARD_CD = ${id} AND DEL_YN=0 ; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({
            success: true,
            boardTitle: result[0]['BOARD_TITLE'],
            boardCont: JSON.parse(result[0]['BOARD_CONT']),
            uid: result[0]['UID'],
            regdate: result[0]['REGDATE'],
            menuCd: result[0]['MENU_CD']
        })

    }) 

})

router.post('/get-update-board', findBoard, (req, res) => {

    res.status(200).json({
        success: true, 
        boardTitle: req.boardTitle, 
        boardCont: req.boardCont, 
        menuCd: req.menuCd
    })
})

router.post('/update-board', async(req, res) => {
    let exText = req.body.text
    let exPhoto = req.body.photo
    let exVideo = req.body.video
    let exYoutube = req.body.youtube
    let exTwitter = req.body.twitter

    let bePhoto = req.body.bePhoto
    let beVideo = req.body.beVideo



    let exImgFileArr = []
    let exVdoFileArr = []

    if(req.files?.imageFiles) {
        exImgFileArr = req.files.imageFiles
    } 
    if(req.files?.videoFiles) {
        exVdoFileArr = req.files.videoFiles
    } 

    let menuCd = parseInt(req.body.menuCd)
    let boardId = parseInt(req.body.boardId)
    let title = req.body.title
    let uid = parseInt(req.body.uid)
    let textArr = []
    let photoArr = []
    let videoArr = []
    let youtubeArr = []
    let twittereArr = []

    let imgFileArr = []
    let vdoFileArr = []
    
    let photoIdx = []
    let videoIdx = []

    let obj = {}

    let now = moment();

    if (typeof(exText) !== 'object') {
        textArr.push(exText)
    } else {
        textArr = exText
    }

    if (typeof(exPhoto) !== 'object') {
        photoIdx.push(exPhoto)
        if(!photoIdx[0]){
            photoIdx = []
        }
    } else {
        photoIdx = exPhoto
    }

    if (typeof(exVideo) !== 'object') {
        videoIdx.push(exVideo)
        if(!videoIdx[0]){
            videoIdx = []
        }
    } else {
        videoIdx = exVideo
    }

    if(!exYoutube) {
        youtubeArr = []
    } else if (typeof(exYoutube) !== 'object') {
        youtubeArr.push(exYoutube)
    } else {
        youtubeArr = exYoutube
    }

    if(!exTwitter) {
        twittereArr = []
    } else if (typeof(exTwitter) !== 'object') {
        twittereArr.push(exTwitter)
    } else {
        twittereArr = exTwitter
    }

    if (exImgFileArr.length >= 0) {
        imgFileArr = exImgFileArr
    } else {
        imgFileArr.push(exImgFileArr)
    }

    if (exVdoFileArr.length >= 0) {
        vdoFileArr = exVdoFileArr
    } else {
        vdoFileArr.push(exVdoFileArr)
    }

    photoArr = bePhoto ? bePhoto : []
    videoArr = beVideo ? beVideo : []

    if (imgFileArr.length > 0) {
        imgFileArr.forEach((itm, idx) => {
            let newName = now.format("YYMMDDHHmmss")+Math.random().toString().substr(2,4) + '.' + itm.name.split('.')[1]
            let path1 = appRoot + `/uploads/${menuCd}/` + newName;
            let arrIdx = parseInt(photoIdx[idx])
            itm.mv(
                path1,
                (err) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                }
            )
            photoArr[arrIdx] = newName

        });
    }

    if (vdoFileArr.length > 0) {
        vdoFileArr.forEach((itm, idx) => {
            let newName = now.format("YYMMDDHHmmss")+Math.random().toString().substr(2,4) + '.' + itm.name.split('.')[1]
            let path1 = appRoot + `/uploads/${menuCd}/` + newName;
            let arrIdx = parseInt(videoIdx[idx])
            itm.mv(
                path1,
                (err) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                }
            )
            videoArr[arrIdx] = newName

        });
    }

    obj.text = textArr
    obj.photo = photoArr
    obj.video = videoArr
    obj.youtube = youtubeArr
    obj.twitter = twittereArr

    let jsonCont = JSON.stringify(obj)

    let sql = `UPDATE TB_BOARD SET BOARD_TITLE='${title}', BOARD_CONT='${jsonCont}', EDTDATE=NOW() WHERE BOARD_CD = ${boardId};`

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({success: true, text: '게시완료'})

    }) 

})


router.post('/write-board', async(req, res) => {
    let exText = req.body.text
    let exPhoto = req.body.photo
    let exVideo = req.body.video
    let exYoutube = req.body.youtube
    let exTwitter = req.body.twitter

    let exImgFileArr = []
    let exVdoFileArr = []

    if(req.files?.imageFiles) {
        exImgFileArr = req.files.imageFiles
    } 
    if(req.files?.videoFiles) {
        exVdoFileArr = req.files.videoFiles
    } 

    let id = parseInt(req.body.id)
    let title = req.body.title
    let uid = parseInt(req.body.uid)
    let textArr = []
    let photoArr = []
    let videoArr = []
    let youtubeArr = []
    let twittereArr = []

    let imgFileArr = []
    let vdoFileArr = []
    
    let photoIdx = []
    let videoIdx = []

    let obj = {}

    let now = moment();

    if (typeof(exText) !== 'object') {
        textArr.push(exText)
    } else {
        textArr = exText
    }

    if (typeof(exPhoto) !== 'object') {
        photoIdx.push(exPhoto)
    } else {
        photoIdx = exPhoto
    }

    if (typeof(exVideo) !== 'object') {
        videoIdx.push(exVideo)
    } else {
        videoIdx = exVideo
    }

    if(!exYoutube) {
        youtubeArr = []
    } else if (typeof(exYoutube) !== 'object') {
        youtubeArr.push(exYoutube)
    } else {
        youtubeArr = exYoutube
    }

    if(!exTwitter) {
        twittereArr = []
    } else if (typeof(exTwitter) !== 'object') {
        twittereArr.push(exTwitter)
    } else {
        twittereArr = exTwitter
    }

    if (exImgFileArr.length >= 0) {
        imgFileArr = exImgFileArr
    } else {
        imgFileArr.push(exImgFileArr)
    }

    if (exVdoFileArr.length >= 0) {
        vdoFileArr = exVdoFileArr
    } else {
        vdoFileArr.push(exVdoFileArr)
    }

    if (textArr.length - 1 > 0){
        for (let i = 0; i < textArr.length - 1; i++) {
            photoArr.push('0')
            videoArr.push('0')
        }
    }

    if (imgFileArr.length > 0) {
        imgFileArr.forEach((itm, idx) => {
            let newName = now.format("YYMMDDHHmmss")+Math.random().toString().substr(2,4) + '.' + itm.name.split('.')[1]
            let path1 = appRoot + `/uploads/${id}/` + newName;
            let arrIdx = parseInt(photoIdx[idx])
            itm.mv(
                path1,
                (err) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                }
            )
            photoArr[arrIdx] = newName

        });
    }
    
    if (vdoFileArr.length > 0) {
        vdoFileArr.forEach((itm, idx) => {
            let newName = now.format("YYMMDDHHmmss")+Math.random().toString().substr(2,4) + '.' + itm.name.split('.')[1]
            let path1 = appRoot + `/uploads/${id}/` + newName;
            let arrIdx = parseInt(videoIdx[idx])
            itm.mv(
                path1,
                (err) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                }
            )
            videoArr[arrIdx] = newName

        });
    }

    obj.text = textArr
    obj.photo = photoArr
    obj.video = videoArr
    obj.youtube = youtubeArr
    obj.twitter = twittereArr

    let jsonCont = JSON.stringify(obj)

    let sql = `INSERT INTO TB_BOARD (MENU_CD, BOARD_TITLE, BOARD_CONT, UID, DEL_YN, VIEW_COUNT, PHOTO_YN, REGDATE) 
                VALUES( ${id}, '${title}', '${jsonCont}', ${uid}, 0, 0, 0, NOW()); `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({success: true, text: '게시완료'})

    }) 

})


router.post('/get-board-list', (req, res) => {
    let id = parseInt(req.body.id)

    let sql = `SELECT BOARD_CD, BOARD_TITLE, UID, REGDATE  FROM TB_BOARD WHERE MENU_CD = ${id} AND DEL_YN = 0; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({
            success: true,
            lists: result
        })

    }) 

})


router.get('/get-board-menu', (req, res) => {

    let sql = 'SELECT * FROM TB_MENU; '

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({
            lists: result
        })

    }) 


})




router.post('/write-comment', (req, res) => {
    let boardCd = req.body.boardCd
    let boardCont = req.body.boardCont
    let uid = req.body.uid
    let prntComtCd = req.body.prntComtCd

    
    let sql = `INSERT INTO TB_COMMENT (BOARD_CD, BOARD_CONT, UID, PRNT_COMT_CD, DEL_YN, REGDATE) 
    VALUES('${boardCd}', '${boardCont}', ${uid}, ${prntComtCd}, 0, NOW()); `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({text: '게시 완료'})

    }) 


})


router.post('/get-comments', (req, res) => {
    let id = parseInt(req.body.id)

    
    let sql = `SELECT COMT_CD, PRNT_COMT_CD, UID, BOARD_CONT, REGDATE FROM TB_COMMENT WHERE BOARD_CD = ${id} AND DEL_YN=0 ; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        res.status(200).json({
            text: '게시 완료',
            lists: result
        })

    }) 


})












router.post('/toggle-like', checkDislike, (req, res) => {
    let id = req.body.id
    let uid = req.body.uid

    let sql = `SELECT * FROM TB_BOARD_LIKE WHERE BOARD_CD = ${id} AND UID = ${uid} ; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        if (result.length === 0) {

            let sqlI = `INSERT INTO TB_BOARD_LIKE (BOARD_CD, UID, REGDATE) VALUES(${id}, ${uid}, NOW()); `
        
            db.query(sqlI, (err, result) => {
                if(err) return res.status(400).json({success: false, err: err})

                res.status(200).json({success: true})
        
            }) 

            

        } else {

            let sqlD = `DELETE FROM TB_BOARD_LIKE WHERE BOARD_CD = ${id} AND UID = ${uid}; `
            db.query(sqlD, (err, result) => {
                if(err) return res.status(400).json({success: false, err: err})
        
                res.status(200).json({success: true})
        
            }) 

            

        }
        

    }) 

})


router.post('/get-likes', countLike ,(req, res) => {
    let id = req.body.id
    let uid = req.body.uid

    let sql = `SELECT LIKE_CD FROM TB_BOARD_LIKE WHERE BOARD_CD = ${id} AND UID = ${uid}; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})
        
        res.status(200).json({
            success: true,
            count: req.count,
            include: result[0] ? true : false
        })
    }) 


})

router.post('/get-likes-noinfo', countLike ,(req, res) => {

    res.status(200).json({
        success: true,
        count: req.count,
        include: false
    })

})



router.post('/toggle-dislike', checkLike, (req, res) => {
    let id = req.body.id
    let uid = req.body.uid

    let sql = `SELECT * FROM TB_BOARD_DISLIKE WHERE BOARD_CD = ${id} AND UID = ${uid} ; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})

        if (result.length === 0) {

            let sqlI = `INSERT INTO TB_BOARD_DISLIKE (BOARD_CD, UID, REGDATE) VALUES(${id}, ${uid}, NOW()); `
        
            db.query(sqlI, (err, result) => {
                if(err) return res.status(400).json({success: false, err: err})
        
                res.status(200).json({success: true})
        
            }) 

            

        } else {

            let sqlD = `DELETE FROM TB_BOARD_DISLIKE WHERE BOARD_CD = ${id} AND UID = ${uid}; `
            db.query(sqlD, (err, result) => {
                if(err) return res.status(400).json({success: false, err: err})
        
                res.status(200).json({success: true})
        
            }) 

            

        }
        

    }) 

})

router.post('/get-dislikes', countDisLike, (req, res) => {
    let id = req.body.id
    let uid = req.body.uid
    

    let sql = `SELECT DISLIKE_CD FROM TB_BOARD_DISLIKE WHERE BOARD_CD = ${id} AND UID = ${uid}; `

    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({success: false, err: err})
        
        res.status(200).json({
            success: true,
            count: req.count,
            include: result[0] ? true : false
        })
    }) 


})

router.post('/get-dislikes-noinfo', countDisLike ,(req, res) => {

    res.status(200).json({
        success: true,
        count: req.count,
        include: false
    })

})

module.exports = router;