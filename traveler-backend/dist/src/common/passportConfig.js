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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const users_1 = __importDefault(require("../models/users")); // Sequelize User model import
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        console.log(profile); // Debug the profile
        // Find user by Google ID
        const existingUser = yield users_1.default.findOne({ where: { googleId: profile.id } });
        if (existingUser) {
            return done(null, existingUser);
        }
        // Create new user
        const newUser = yield users_1.default.create({
            email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '',
            username: profile.displayName || '',
            profilePicture: ((_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || '',
            googleId: profile.id,
        });
        return done(null, newUser);
    }
    catch (err) {
        console.error("Error during Google OAuth:", err);
        return done(err, false);
    }
})));
passport_1.default.serializeUser((user, done) => {
    // Serialize using user.id (primary key in Sequelize)
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findByPk(id);
        if (!user) {
            return done(new Error('User not found'), null);
        }
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
//# sourceMappingURL=passportConfig.js.map