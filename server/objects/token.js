
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class Token {
    constructor(username) {
        this.token =  jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    }
}

export default Token;