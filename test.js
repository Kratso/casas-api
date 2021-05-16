var MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.MONGOURL);

MongoClient.connect(process.env.MONGOURL, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Pokehub");
    var query = { "type": ["Electric", "Flying"] };
    dbo.collection("Pokemon").find(query).toArray(function(err, result) {
      if (err) throw err;
      result.forEach(pokemon => {
          console.log(pokemon.name);
      });
      
      db.close();
    });
    query = { "type": ["Water", "Flying"] };
    dbo.collection("Pokemon").find(query).toArray(function(err, result) {
        if (err) throw err;
        result.forEach(pokemon => {
            console.log(pokemon.name);
        });
        
        db.close();
      });
  })