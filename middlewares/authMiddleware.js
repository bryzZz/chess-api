const APIError = require("../exceptions/APIError");
const tokenService = require("../service/tokenService");

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw APIError.UnauthorizedError();
        }

        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            throw APIError.UnauthorizedError();
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            throw APIError.UnauthorizedError();
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(error);
    }
};
