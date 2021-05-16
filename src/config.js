const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 8085,
    MONGOURL: process.env.MONGOURL,
    PRIVATE_KEY: process.env.PRIVATE_KEY
};