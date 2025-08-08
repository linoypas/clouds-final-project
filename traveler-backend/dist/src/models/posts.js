"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const post = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    }, likes: { type: [String], default: [] },
    image: { type: String },
});
const Posts = mongoose_1.default.model("posts", post);
exports.default = Posts;
//# sourceMappingURL=posts.js.map