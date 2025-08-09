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
const posts_1 = __importDefault(require("../models/posts"));
var app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('init app');
    app = yield (0, server_1.default)();
    yield posts_1.default.deleteMany();
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
let post_id = "";
const test_post = {
    owner: "linoy",
    title: "test title",
    content: "blablabla"
};
describe("Post tests", () => {
    test("Tests get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Tests create a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send(test_post);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(test_post.title);
        expect(response.body.content).toBe(test_post.content);
        expect(response.body.owner).toBe(test_post.owner);
        post_id = response.body.id;
    }));
    test("Tests get all posts after adding one", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("Tests get all posts by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?owner=" + test_post.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(test_post.owner);
    }));
    test("Tests get all posts by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + post_id);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(post_id);
    }));
    test("Test Delete Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + post_id);
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).get("/posts/" + post_id);
        expect(response2.statusCode).toBe(404);
    }));
    test("Test Create Post fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test Post 2",
            content: "Test Content 2",
        });
        expect(response.statusCode).toBe(400);
    }));
});
//# sourceMappingURL=posts.test.js.map