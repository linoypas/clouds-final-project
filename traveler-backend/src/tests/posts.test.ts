import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import { Express } from 'express';
import Posts from '../models/posts';

var app: Express;

beforeAll(async () => {
    console.log('init app');
    app = await initApp();
    await Posts.deleteMany();
});

afterAll((done) => {
    mongoose.connection.close();
    done();
});

let post_id = "";
const test_post = {
    owner: "linoy",
    title: "test title",
    content: "blablabla"
}

describe("Post tests", () => {
    test("Tests get all posts", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });
    test("Tests create a post", async () => {
        const response = await request(app).post("/posts").send(test_post);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(test_post.title);
        expect(response.body.content).toBe(test_post.content);
        expect(response.body.owner).toBe(test_post.owner);
        post_id = response.body._id;
    });
    test("Tests get all posts after adding one", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });
    test("Tests get all posts by owner", async () => {
        const response = await request(app).get("/posts?owner="+test_post.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(test_post.owner);
    });
    test("Tests get all posts by id", async () => {
        const response = await request(app).get("/posts/"+post_id);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(post_id);
    });
    test("Test Delete Post", async () => {
        const response = await request(app).delete("/posts/" + post_id);
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get("/posts/" + post_id);
        expect(response2.statusCode).toBe(404);
      });
    test("Test Create Post fail", async () => {
        const response = await request(app).post("/posts").send({
          title: "Test Post 2",
          content: "Test Content 2",
        });
        expect(response.statusCode).toBe(400);
      });
});