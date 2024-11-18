var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');

/* GET User Listing */
router.post('/', async function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirectUrl = 'http://127.0.0.1:5000/oauth';

    const oAuth2Client = new OAuth2Client (
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type:'offline',
        // scope:'https://www.googleapis.com/auth/userinfo.profile openid',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'openid'
        ],
        prompt: 'consent'
    });

    res.json({url:authorizeUrl})

});

module.exports = router;