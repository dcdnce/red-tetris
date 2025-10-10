import jwt from "jsonwebtoken";

class Token {
    static sign(username, roomName) {
        return jwt.sign({ username, roomName }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });
    }

    static verify(token, player) {
        jwt.verify(token, process.env.TOKEN_SECRET);

        if (token !== player.token) {
            throw new Error("Token is valid but not bind to this player.");
        }
    }
}

export default Token;
