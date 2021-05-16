
const MongoClient = require('mongodb').MongoClient;
const { MONGOURL } = require('./config');

class DatabaseConnector{

    constructor(){
        this.database = null;
    }

    connect(){
        let dbconnector = this;
        console.log("Connecting to database at ..." + MONGOURL);
        MongoClient.connect(MONGOURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            }, function(err, db) {
                if (err) 
                    throw err;
                dbconnector.database = db.db("Pokehub");
                console.log("Connected.");
            });
    }

    getDatabase(){
        return this.database;
    }

}

module.exports = new DatabaseConnector();