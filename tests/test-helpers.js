//Create mock app and store test data
const express = require('express');
const db = require('../server/startup/db');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');




function setupMockApp(){
    const app = express();
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    //app.use('/api', routes);
    return app;
};

function createMockUsers(){

    var mockUsers = {
    mockUser1: {
        username: "mockUser1",
        password: "mockPass1",
        email: "mockEmail1@gmail.com",
        message: "mock message 1"
    },

    mockUser2: {
        username: "mockUser2",
        password: "mockPass2",
        email: "mockEmail2@gmail.com",
        message: "mock message 2"
    },

    mockUser3:{
        username: "mockUser3",
        password: "mockPass3",
        email: "mockEmail3@gmail.com",
        message: "mock message 3"
    }
    }
    return mockUsers
}

async function populateMockUser(user){
    
    var {username, password, email, message} = user
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt);

    var user = await db.query('INSERT INTO users (username, password, email, created_on)\
    VALUES($1, $2, $3, $4) RETURNING user_id', [username, password, email, new Date()] );

    return user;
}

async function populateMockPosts(user_id, message){
    var post = await db.query('INSERT INTO posts (time_of_post, message)\
                  VALUES($1, $2) RETURNING post_id', [new Date(), message]);
                  
    await db.query('UPDATE users SET number_of_posts = number_of_posts + 1\
                  WHERE user_id = $1', [user_id]);
          
    await db.query('INSERT INTO users_posts (user_id, post_id)\
                  VALUES($1, $2)', [user_id, post.rows[0].post_id]);

    
}

async function clearMockDB(){
    await db.query('DELETE FROM users_posts;')
    await db.query('DELETE FROM users;')
    await db.query('DELETE FROM posts;')
}

async function getMockUsers(){
    return await db.query('SELECT * FROM users')
}

async function getMockPosts(){
    return await db.query('SELECT * FROM posts')
}

async function getMockUsersPosts(){
    return await db.query('SELECT * FROM users_posts')
}

//Build 
//

module.exports = {
    setupMockApp,
    populateMockUser,
    populateMockPosts,
    clearMockDB,
    createMockUsers,
    getMockUsers,
    getMockPosts,
    getMockUsersPosts
}