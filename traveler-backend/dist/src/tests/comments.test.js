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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = __importDefault(require("../models/comments"));
var app;
let post_id = "";
const test_post = {
    owner: "linoy",
    title: "test title",
    content: "blablabla"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('init app');
    app = yield (0, server_1.default)();
    yield comments_1.default.deleteMany();
    const postResponse = yield (0, supertest_1.default)(app).post("/posts").send(test_post);
    expect(postResponse.statusCode).toBe(200);
    post_id = postResponse.body._id;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
let comment_id = "";
const test_comment = {
    owner: "linoy",
    content: "blablabla",
    postId: "111"
};
describe("Post tests", () => {
    test("Tests get all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + post_id + "/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Tests create a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts/" + post_id + "/comments").send(test_comment);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(test_comment.content);
        expect(response.body.owner).toBe(test_comment.owner);
        comment_id = response.body._id;
    }));
    test("Tests get all comments after adding one", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + post_id + "/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Tests get all comments by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + post_id + "/comments/" + comment_id);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(comment_id);
    }));
    test("Test Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + post_id + "/comments/" + comment_id);
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).get("/posts/" + post_id + "/comments/" + comment_id);
        expect(response2.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map