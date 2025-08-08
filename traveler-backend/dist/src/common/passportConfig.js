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
const users_1 = __importDefault(require("../models/users"));
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose for ObjectId validation
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(profile); // Debugging the profile object to check its content
        // Check if the user already exists by their Google ID (not the email or _id)
        const existingUser = yield users_1.default.findOne({ provider: "google" });
        if (existingUser) {
            // If the user exists, return the existing user
            return done(null, existingUser);
        }
        // If the user doesn't exist, create a new user with automatic ObjectId from MongoDB
        const newUser = yield users_1.default.create({
            email: profile.emails[0].value,
            username: profile.displayName, // Google's display name
            image: ((_a = profile.photos[0]) === null || _a === void 0 ? void 0 : _a.value) || "", // Profile picture URL from Google
            googleId: profile.id, // Store Google ID
        });
        // Return the newly created user
        return done(null, newUser);
    }
    catch (err) {
        console.error("Error during Google OAuth:", err);
        return done(err, false); // Handle errors
    }
})));
passport_1.default.serializeUser((user, done) => {
    // Serialize using MongoDB's ObjectId (user._id)
    done(null, user._id.toString());
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate if the id passed is a valid MongoDB ObjectId string
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return done(new Error('Invalid ObjectId'), null); // Handle invalid ObjectId
        }
        // Find the user by MongoDB _id (not googleId)
        const user = yield users_1.default.findById(id);
        if (!user) {
            return done(new Error('User not found'), null); // Handle user not found
        }
        done(null, user); // Pass the user object back to the session
    }
    catch (err) {
        done(err, null); // Handle other errors
    }
}));
//# sourceMappingURL=passportConfig.js.map