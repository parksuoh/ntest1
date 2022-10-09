const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MY-SECRET-KEY';

let auth = (req, res, next) => {
    let refreshToken = req.cookies.refreshToken;
    let accessToken = req.cookies.accessToken;

    jwt.verify(refreshToken, SECRET_KEY, (err, refDeco) => {
        if(err) return res.status(400).json({success: false, code: 1, test: '리프레시 만료'})

        jwt.verify(accessToken, SECRET_KEY, (err, accDeco) => {
            if(err) return res.status(400).json({success: false, code: 2, test: '엑세스 만료'})

            req.uid = accDeco.uid;
            next();
        })

    } )


}

module.exports = { auth }