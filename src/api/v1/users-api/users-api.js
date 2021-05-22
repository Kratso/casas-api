const database = require("../../../DatabaseConnector");
const error = require("../api-errors/api-errors");
const passwordHash = require('password-hash');
const auth = require('../auth-api/auth');

class UsersApi{

    constructor(){
        this.collection = "users";
    }

    hashPassword(password){
        return passwordHash.generate(password);
    }

    // /api/v1/users/login
    loginUser(req, res){
        console.log(req.body);

        let user = req.body.user;
        let password = req.body.password;
        let query = { $or: [{_id: user}, {username: user}]};
        console.log(query);
        database.getDatabase().collection(this.collection).findOne(query, function(err, user) {
            if (err) {
                res.status(error.wrong_credentials.code).send(error.wrong_credentials);
                return;
            }
            if(user && passwordHash.verify(password, user.password))
                res.send({
                    mail: user._id,
                    username: user.username,
                    canVote: user.canVote
                });
            else res.status(error.wrong_credentials.code).send(error.wrong_credentials);
        });
    }

    verifyBearer(req, res){
        console.log(req.query);
        res.send(auth.verifyBearer(req.query.bearer));
    }

    // /api/v1/users/register
    async registerUser(req, res){
        let user = {
            _id: req.body.mail,
            username: "",
            password: this.hashPassword(req.body.password),
            canVote: true,
        }
        let thisobj = this;
        if(!await this.checkUserMail(req))
            database.getDatabase().collection(this.collection).insertOne(user, function(err, response) {
                if (err) {
                    res.status(error.wrong_credentials.code).send(error.wrong_credentials);
                    return;
                }
                req.body.user = req.body.mail;
                thisobj.loginUser(req, res);
            });
        else res.status(error.email_already_exists.code).send(error.email_already_exists);
        
    }

    async checkUserMail(req){
        let query = { _id: req.body.mail };
        return await database.getDatabase().collection(this.collection).find(query, {_id: 1}).limit(1).count() > 0;
    }

    async checkusername(req){
        let query = { username: req.body.username };
        return await database.getDatabase().collection(this.collection).find(query, {username: 1}).limit(1).count() > 0;
    }

    // /api/v1/users/profilepic
    updateProfilepic(req, res){
        let query = { _id: req.body.mail }
        let user = { $set: { profilepic: req.body.profilepic } };
        console.log(query);
        database.getDatabase().collection(this.collection).updateOne(query, user, function(err, response) {
            if (err) {
                res.status(error.wrong_credentials.code).send(error.wrong_credentials.response);
                return;
            }
            res.send("Actualizado");
            
        });
    }

    // /api/v1/users/username
    async updateusername(req, res){
        let query = { _id: req.body.mail }
        let user = { $set: { username: req.body.username } };
        console.log(query);
        if(!await this.checkusername(req))
            database.getDatabase().collection(this.collection).updateOne(query, user, function(err, response) {
                if (err) {
                    res.status(error.wrong_credentials.code).send(error.wrong_credentials);
                    return;
                }
                res.send({username: req.body.mail});
            });
        else res.status(error.username_already_exists.code).send(error.username_already_exists.response);
    }

}

module.exports = new UsersApi();