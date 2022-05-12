const userService = require("../service/userService");
const { validationResult } = require("express-validator");
const APIError = require("../exceptions/APIError");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw APIError.BadRequest("Validation error", errors.array());
            }

            const { username, password } = req.body;
            const userData = await userService.registration(username, password);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            const userData = await userService.login(username, password);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);

            res.clearCookie("refreshToken");
            return res.json(token);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken || null;

            const userData = await userService.refresh(refreshToken);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
