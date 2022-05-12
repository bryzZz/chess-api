const GameModel = require("../models/Game");
const GameDto = require("../dtos/gameDto");
const APIError = require("../exceptions/APIError");

const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class GameService {
    async create(userData, color) {
        const game = await GameModel.create({
            FEN: startFEN,
            players: {
                [color]: userData.id,
            },
        });

        const gameDto = new GameDto(game);

        return gameDto;
    }
}

module.exports = new GameService();
