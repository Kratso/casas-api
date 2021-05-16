
const errors = require("../api-errors/api-errors");
var jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../../../config');

class Auth{

    constructor(){
    }

    getUserFromToken(token, res) {
        this.auth.verifyIdToken(token)
            .then(decodedToken => {
                console.log(decodedToken);
                res.status(200).send(decodedToken);
            })
            .catch(error => {
                console.log(error);
            });
    }

    generateBearer(email) { //returns a new bearer if the usermail is correct
        let token = jwt.sign({
            data: email
        }, PRIVATE_KEY, { expiresIn: '1h' });

        let response = {
            api_token:  token,
            expires: '1h'
        };
        return response;
    }

    verifyBearer(token) {
        let res = { code: errors.default_error.code, message: errors.default_error };

        if (token === undefined) { //checks if authorization header is empty
            res = { code: errors.missing_authorization_header.code, message: errors.missing_authorization_header };
        }
        else {
            jwt.verify(token, PRIVATE_KEY, (err, decoded) => { //checks if the bearer is correct
                if (err) {
                    res = { code: errors.invalid_authorization_header.code, message: errors.invalid_authorization_header };
                } else if(decoded == undefined){
                    res = { code: errors.expired_token.code, message: errors.expired_token };
                }else {
                    res = { code: 200, decodedEmail: decoded.data };
                }
            });
        }
        return res;
    }

}

module.exports = new Auth();