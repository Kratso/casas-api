const database = require("../../../DatabaseConnector");
const error = require("../api-errors/api-errors");

var ObjectId = require('mongodb').ObjectID;

class VotosApi {
	constructor(){
		this.collection = "votos";
		this.userCollection = "users";
		this.casasCollection = "casas"
	}

	// /api/v1/votos/getGanador

	getGanador = (req, res) => {
		let query = {};

		let votos;
		database.getDatabase().collection(this.collection).find(query).toArray((err, _votos)=>{
            if(err) throw err;
			votos = _votos;
			database.getDatabase().collection(this.userCollection).find(query).toArray((err, users)=>{
				if(err) throw err;
				if(votos.length < users.length) res.send({ganador: null});
				else {
					let casas;
					database.getDatabase().collection(this.casasCollection).find(query).toArray((err, _casas)=>{
						if(err) throw err;
						casas = _casas

						let arr_puntuaciones = {};
			
						casas.forEach(casa => {
							arr_puntuaciones[casa._id] = 0;
						})
				
						votos.forEach(voto => {
							voto.casas.forEach((casa, i, array) => {
								arr_puntuaciones[casa._id] += (array.length - i) * 3;
							})
						})
				
						console.log(arr_puntuaciones)
				
						let array_par_puntuaciones = Object.entries(arr_puntuaciones);
				
						array_par_puntuaciones.sort((a,b)=>a[1]-b[1])
						query = {_id: ObjectId(array_par_puntuaciones[0][0])}
				
						database.getDatabase().collection(this.casasCollection).find(query).toArray((err, ganador)=>{
							if(err) throw err;
							console.log(ganador, query)
							res.send({ganador: ganador, puntuacion: array_par_puntuaciones[0][1]});
						})
				
					})
				}
			})
        })


	}

	// /api/v1/votos/all
	getAllVotos = (req, res) => {
		let query = {};
		database.getDatabase().collection(this.collection).find(query).toArray((err, casas)=>{
            if(err) throw err;
            res.send(casas);
        })
	}
	
	// /api/v1/votos/post
	postVote = (req, res) => {

		let voto = {
			user: req.body.user,
			casas: req.body.casas
		}
		console.log(req, voto)

		let query = { _id: req.body.user };
		let user = { $set: {canVote: false} };
		database.getDatabase().collection(this.collection).insertOne(voto, function(err, response) {
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