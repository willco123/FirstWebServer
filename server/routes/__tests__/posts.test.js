jest.mock('../../middleware/auth', () => jest.fn((req,res,next) => {
    var user123 = {};//can't pass an object through supertest "set" so pass user_id instead of user to mock middleware
    user123.id = req.header('mycustomheader');//and create object here to pass to locals
    res.locals.user = user123;
    next()
}));
jest.mock('../../middleware/admin', () => jest.fn((req,res,next) => next()));
var validateJWT = require('../../utils/validators');
const jwtMock = jest.spyOn(validateJWT, 'generateAuthToken')
jwtMock.mockImplementation(()=> ('Fake JWT'));

const _ = require('lodash');
const auth = require('../../middleware/auth')
const supertest = require('supertest');
const router = require('../posts');
const { 
        setupMockApp,
        getMockUsers,
        populateMockUser,
        populateMockPosts,
        clearMockDB,
        createMockUsers,
        getMockPosts,
        getMockUsersPosts} = require('../../../tests/test-helpers');
// const bcrypt = require('bcrypt');
// const res = require('express/lib/response');
// const { user } = require('pg/lib/defaults');
//console.log(user)
// const db = require('../../startup/db');
// spyCli = jest.spyOn(db, 'cliconnect')

mockUsers = createMockUsers();
var {mockUser1, mockUser2, mockUser3} = mockUsers;

app = setupMockApp();
app.use('/posts', router);

beforeEach( async () => {

    await clearMockDB();
    user1 = await populateMockUser(mockUser1);
    user2 = await populateMockUser(mockUser2);
    user1ID = user1.rows[0].user_id
    user2ID = user2.rows[0].user_id
    await populateMockPosts(user1ID, mockUser1.message)
    await populateMockPosts(user2ID, mockUser2.message)


    //var users = await getMockUsers();
    //await populateMockUser(mockUser3);

})

afterEach(async () => {
    await clearMockDB();

})


describe('/posts', () => {

  describe('GET', () => {

    it('Should call the middleware using the mock function', async () => {

      const response = await supertest(app).get('/posts');
      expect(response.status).toBe(200);
      expect(auth).toHaveBeenCalled();
    });

    it('Should return 2 posts', async () => {//2 posts populated before the test
      const response = await supertest(app).get('/posts');
      expect(response._body.length).toEqual(2);
      expect(response.status).toBe(200);
    });

    it('Should return type json', async () => {
      const response = await supertest(app).get('/posts');
      expect(response.type).toEqual('application/json')
    });

  });


  describe('GET/:id' , () =>{

    it('Should return 404 if no id is found', async ()=>{
      const response = await supertest(app).get('/posts/1')
      expect(response.statusCode).toBe(404);
    })

    it('Should return 200 if the id exists', async ()=>{
      posts = await getMockPosts();
      firstPostid = posts.rows[0].post_id
      const response = await supertest(app).get('/posts/' + firstPostid)
      expect(response.statusCode).toBe(200);
    })

  });

  describe('POST', ()=>{

    it('Should return 400 if no message', async ()=>{
        users = await getMockUsers();
        user1 = users.rows[0]
        user1.id = user1.user_id
        const response = await supertest(app)
            .post('/posts')
            .send({"nomessage": "aa"})
            .set('mycustomheader', user1.id)
        expect(response.statusCode).toBe(400);
    })


    it('Should return 200', async ()=>{
        users = await getMockUsers();
        user1 = users.rows[0]
        user1.id = user1.user_id
        const response = await supertest(app)
            .post('/posts')
            .send({"message": "a random message"})
            .set('mycustomheader', user1.id)
        expect(response.statusCode).toBe(200);
    })
    

  })

  describe('PUT', ()=>{
    
    it('Should return 400 if no message', async ()=>{
        posts = await getMockPosts();
        post1 = post.rows[0]
        post1.id = post1.post_id
        const response = await supertest(app)
            .put('/posts/' + post1.id)
            .send({"nomessage": "aa"})
        expect(response.statusCode).toBe(400);
        expect(response.text).toMatch('"message" is required')
    })

    it('Should return 400 if bad id', async ()=>{
        posts = await getMockPosts();
        post1 = post.rows[0]
        post1.id = post1.post_id
        const response = await supertest(app)
            .put('/posts/' + 1)
            .send({"message": "aa"})
        expect(response.statusCode).toBe(404);
        expect(response.text).toMatch('A message with the given ID was not found')
    })


    it('Should return 200', async ()=>{
        posts = await getMockPosts();
        post1 = posts.rows[0]
        post1.id = post1.post_id
        const response = await supertest(app)
            .put('/posts/' + post1.id)
            .send({"message": "aa"})
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
    })
    
        
  })

  describe('DELETE', ()=>{

    test('404 if no record found', async ()=>{
      response = await supertest(app).delete('/posts/1')
      expect(response.statusCode).toBe(404);
    })

    test('Record Should be deleted', async ()=>{
      var deletedposts = await getMockPosts()
      deletedPost1 = deletedposts.rows[0].post_id
      response = await supertest(app).delete('/posts/' + deletedPost1)
      expect(response.statusCode).toBe(201)
    })

  })
});

