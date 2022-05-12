const gameService = require("../service/gameService");
const { validationResult } = require("express-validator");
const APIError = require("../exceptions/APIError");

class GameController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw APIError.BadRequest("Validation error", errors.array());
            }

            const { color } = req.body;
            const userData = req.user;
            const gameData = await gameService.create(userData, color);

            return res.json(gameData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GameController();
