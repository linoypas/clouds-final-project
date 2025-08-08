import request from 'supertest';
import initApp from '../server';
import mongoose, { SetExpressionOperator } from 'mongoose';
import Comments from '../models/comments';
import { Express } from 'express';
import comments from '../controllers/comments';

var app: Express;
let post_id="";
const test_post = {
    owner: "linoy",
    title: "test title",
    content: "blablabla"
}

beforeAll(async () => {
    console.log('init app');
    app = await initApp();
    await Comments.deleteMany();
    const postResponse = await request(app).post("/posts").send(test_post);
    expect(postResponse.statusCode).toBe(200);
    post_id = postResponse.body._id;
});

afterAll((done) => {
    mongoose.connection.close();
    done();
});

let comment_id = "";
const test_comment = {
    owner: "linoy",
    content: "blablabla",
    postId: "111"
}


describe("Post tests", () => {
    test("Tests get all comments", async () => {
        const response = await request(app).get("/posts/"+post_id+"/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });
    test("Tests create a comment", async () => {
        const response = await request(app).post("/posts/"+post_id+"/comments").send(test_comment);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(test_comment.content);
        expect(response.body.owner).toBe(test_comment.owner);
        comment_id = response.body._id;
    });
    test("Tests get all comments after adding one", async () => {
        const response = await request(app).get("/posts/"+post_id+"/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });
    test("Tests get all comments by id", async () => {
        const response = await request(app).get("/posts/"+post_id+"/comments/"+comment_id);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(comment_id);
    });
    test("Test Delete Comment", async () => {
        const response = await request(app).delete("/posts/" + post_id + "/comments/" + comment_id);
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get("/posts/" + post_id+ "/comments/" + comment_id);
        expect(response2.statusCode).toBe(404);
      });
});