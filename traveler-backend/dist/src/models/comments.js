"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
});
const commentsModel = mongoose_1.default.model("Comments", commentSchema);
exports.default = commentsModel;
//# sourceMappingURL=comments.js.map