const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const APIError = require("../exceptions/APIError");

class UserService {
    async registration(username, password) {
        const candidate = await UserModel.findOne({ username });
        if (candidate) {
            throw APIError.BadRequest(
                `User with username ${username} already exist`
            );
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({
            username,
            password: hashPassword,
        });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async login(username, password) {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw APIError.BadRequest(
                `User with username ${username} not found`
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw APIError.BadRequest(`Incorrect password`);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw APIError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw APIError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }
}

module.exports = new UserService();
