"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
const uploadDir = path_1.default.resolve(process.cwd(), 'public/profile-pictures');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const image = req.file ? `/public/profile-pictures/${req.file.filename}` : "/public/profile-pictures/default.png";
        const user = yield users_1.default.create({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            profilePicture: image,
        });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const verifyGoogleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    }
    catch (error) {
        throw new Error('Invalid Google token');
    }
});
const generateToken = (userId) => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jsonwebtoken_1.default.sign({
        _id: userId,
        random: random,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES });
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: userId,
        random: random,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findOne({ where: { email: req.body.email } });
        if (!user) {
            res.status(403).send("wrong username or password");
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password || "");
        if (!validPassword) {
            res.status(403).send("wrong username or password");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send("Server Error");
            return;
        }
        const tokens = generateToken(user.id.toString());
        if (!tokens) {
            res.status(500).send("Server Error");
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        const currentTokens = user.refreshToken || [];
        user.refreshToken = [...currentTokens, tokens.refreshToken];
        yield user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            id: user.id,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (!refreshToken) {
            reject("fail");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject("fail");
                return;
            }
            const userId = payload.id;
            try {
                const user = yield users_1.default.findByPk(userId);
                if (!user) {
                    reject("fail");
                    return;
                }
                const tokens = user.refreshToken || [];
                if (!tokens.includes(refreshToken)) {
                    user.refreshToken = [];
                    yield user.save();
                    reject("fail");
                    return;
                }
                // Remove used token from refreshToken list
                user.refreshToken = tokens.filter((t) => t !== refreshToken);
                yield user.save();
                resolve(user);
            }
            catch (err) {
                reject(err);
            }
        }));
    }));
};
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyRefreshToken(req.body.refreshToken);
        yield user.save();
        res.status(200).send("success");
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user.id.toString());
        if (!tokens) {
            res.status(500).send("Server Error");
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user.id,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const checkUsernameInDb = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ where: { username } });
    return user !== null;
});
const generateUsernameWithSuffix = (baseUsername) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield checkUsernameInDb(baseUsername)) {
        let suffix = 1;
        let newUsername = `${baseUsername}${suffix}`;
        while (yield checkUsernameInDb(newUsername)) {
            suffix += 1;
            newUsername = `${baseUsername}${suffix}`;
        }
        return newUsername;
    }
    else {
        return baseUsername;
    }
});
const googleSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credential = req.body.token;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        const image = payload === null || payload === void 0 ? void 0 : payload.picture;
        if (email != null) {
            let user = yield users_1.default.findOne({ where: { email } });
            if (user == null) {
                let username = ((payload === null || payload === void 0 ? void 0 : payload.given_name) + "_" + (payload === null || payload === void 0 ? void 0 : payload.family_name)).toLowerCase();
                const uniqueUsername = yield generateUsernameWithSuffix(username);
                user = yield users_1.default.create({
                    'email': email,
                    'profilePicture': image,
                    'username': uniqueUsername,
                    'password': '*'
                });
            }
            const tokens = generateToken(user.id.toString());
            if (!tokens) {
                res.status(500).send('Server Error');
                return;
            }
            if (!user.refreshToken) {
                user.refreshToken = [];
            }
            user.refreshToken.push(tokens.refreshToken);
            yield user.save();
            res.status(200).send({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user.id
            });
        }
    }
    catch (err) {
        console.error('Error during Google OAuth:', err);
        res.status(400).send(err);
    }
});
exports.default = {
    register,
    login,
    refresh,
    logout,
    googleSignin
};
//# sourceMappingURL=auth.js.map