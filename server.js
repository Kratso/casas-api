const casasApi = require("./src/api/v1/casas-api/casas-api");
const usersApi = require("./src/api/v1/users-api/users-api");
const votosApi = require("./src/api/v1/votos-api/votos-api")

const { PORT } = require('./src/config');
const bodyParser = require('body-parser');
const express = require('express');
const database = require("./src/DatabaseConnector");

const app = express();

app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Serve static files from the main build directory
app.use('/', express.static(__dirname + '/'));

//Sets the app listening
app.listen(PORT, () => {
    console.log('VotoCasas API Server running at port ' + PORT);
    database.connect();
});

/********* CASAS CALLS **********/

app.get('/api/v1/casas/all',(req, res) => {
    casasApi.getAllCasas(req, res);
});

/********* VOTOS CALLS **********/

app.get('/api/v1/votos/all', (req, res) => {
    votosApi.getAllVotos(req, res);
});

app.post('/api/v1/votos/post', (req, res) => {
    votosApi.postVote(req, res);
});


/********* USERS CALLS **********/

app.post('/api/v1/users/login', (req, res) => {
    console.log(req);
    usersApi.loginUser(req, res);
});

app.get('/api/v1/users/login', (req, res) => {
    usersApi.verifyBearer(req, res);
});

app.post('/api/v1/users/register', (req, res) => {
    usersApi.registerUser(req, res);
});


app.put('/api/v1/users/profilepic', (req, res) => {
    usersApi.updateProfilepic(req, res);
});

app.put('/api/v1/users/trainername', (req, res) => {
    usersApi.updateTrainername(req, res);
});




