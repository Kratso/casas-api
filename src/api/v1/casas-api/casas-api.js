const database = require("../../../DatabaseConnector");
const error = require("../api-errors/api-errors");

class CasasApi{

    constructor(){
        this.collection = "casas";
    }

    // /api/v1/casas/all

    getAllCasas = (req, res) => {
        let query = {};

        database.getDatabase().collection(this.collection).find(query).toArray((err, casas)=>{
            if(err) throw err;
            res.send(casas);
        })
    }

    // /api/v1/pokemon/id
    getPokemonByPokedexIndex(req, res){
        let id = parseInt( req.url.split("/")[req.url.split("/").length -1] );
        let query = { "_id": id };
        database.getDatabase().collection(this.collection).findOne(query, function(err, pokemon) {
            if (err) 
                throw err;
            if(pokemon == null){
                res.status(error.wrong_pokedex_index.code).send(error.wrong_pokedex_index.response);
                return;
            }
            res.send(pokemon);
        });
    }

    // /api/v1/pokemon/id
    getPokemonByIndexRange(req, res){
        let from = parseInt(req.query.from );
        let to = parseInt(req.query.to );
        let query = { "_id" : {$gte: from, $lte: to}};
        console.log(query);
        database.getDatabase().collection(this.collection).find(query).toArray(function(err, pokemonarray) {
            if (err) 
                throw err;
            console.log(pokemonarray);
            if(pokemonarray == null){
                res.status(error.wrong_query_range.code).send(error.wrong_query_range.response);
                return;
            }
            res.send(pokemonarray);
        });
    }

}

module.exports = new CasasApi();