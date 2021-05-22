const database = require("../../../DatabaseConnector");
const error = require("../api-errors/api-errors");

class VotosApi {
	constructor(){
		this.collection = "votos";
		this.userCollection = "users";
	}

	// /api/v1/votos/all
	getAllVotos = (res, req) => {
		let query = {};
		database.getDatabase().collection(this.collection).find(query).toArray((err, casas)=>{
            if(err) throw err;
            res.send(casas);
        })
	}
	
	// /api/v1/votos/post
	postVote = (res, req) => {
		let voto = {
			user: req.body.mail,
			casas: req.body.casas
		}

		let query = { _id: req.body.user };
		let user = { $set: false };

		database.getDatabase().collection(this.collection).insertOne(user, function(err, response) {
			if (err) {
				res.status(error.wrong_credentials.code).send(error.wrong_credentials);
				return;
			}
		});

		database.getDatabase().collection(this.userCollection).updateOne(query, user, function(err, response) {
            if (err) {
                res.status(error.wrong_credentials.code).send(error.wrong_credentials.response);
                return;
            }
            res.send("Actualizado");
        });
	}
}

module.exports = new VotosApi();