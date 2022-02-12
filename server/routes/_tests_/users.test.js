jest.mock('../../middleware/auth', () => jest.fn((req,res,next) => next()));
jest.mock('../../middleware/admin', () => jest.fn((req,res,next) => next()));
var validateJWT = require('../../validation/validators');
const jwtMock = jest.spyOn(validateJWT, 'generateAuthToken')
jwtMock.mockImplementation(()=> ('Fake JWT'));

const _ = require('lodash');
const auth = require('../../middleware/auth')
const supertest = require('supertest');
const router = require('../users');
const { 
        setupMockApp,
        getMockUsers,
        populateMockUser,
        clearMockDB,
        createMockUsers} = require('../../../tests/test-helpers');
const bcrypt = require('bcrypt');
// const db = require('../../startup/db');
// spyCli = jest.spyOn(db, 'cliconnect')

mockUsers = createMockUsers();
var {mockUser1, mockUser2, mockUser3} = mockUsers;

app = setupMockApp();
app.use('/users', router);

beforeEach( async () => {

    await clearMockDB();
    await populateMockUser(mockUser1);
    await populateMockUser(mockUser2);
    //await populateMockUser(mockUser3);
})

afterEach(async () => {
    await clearMockDB();

})


describe('/users', () => {

  describe('get', () => {

    it('Should call the middleware using the mock function', async () => {
      const response = await supertest(app).get('/users');
      expect(response.status).toBe(200);
      expect(auth).toHaveBeenCalled();
    });

    it('Should return 2 users', async () => {//2 users populated before the test
      const response = await supertest(app).get('/users');
      expect(response._body.length).toEqual(2);
      expect(response.status).toBe(200);
    });

    it('Should return type json', async () => {
      const response = await supertest(app).get('/users');
      expect(response.type).toEqual('application/json')
    });

  });


  describe('get/:id' , () =>{

    it('Should return 404 if no id is found', async ()=>{
      const response = await supertest(app).get('/users/1')
      expect(response.statusCode).toBe(404);
    })

    it('Should return 200 if the id exists', async ()=>{
      users = await getMockUsers();
      firstUserid = users.rows[0].user_id
      const response = await supertest(app).get('/users/' + firstUserid)
      expect(response.statusCode).toBe(200);
    })

  });

  describe('post', ()=>{

    it('Should return 400 if format is incorrect', async ()=>{
      const response = await supertest(app)
        .post('/users')
        .send({"username": "hey"})//Will have a more indepth test for the validators unit test
      expect(response.statusCode).toBe(400);
    })
    
    it('Should return 400 if username already exists', async ()=>{
      const response = await supertest(app)
        .post('/users')
        .send({
          "username": "mockUser2",
          "password": "arandompass123",
          "email": "legitemail@gmail.com"
      })
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual('Username Is already Taken')
    })

    it('Should return 400 if email already exists', async ()=>{
      const response = await supertest(app)
        .post('/users')
        .send({
          "username": "newUser123",
          "password": "arandompass123",
          "email": "mockEmail1@gmail.com"
      })
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual('Email Is already Taken')
    })

    it('Should return 201 if record successfully added', async ()=>{
      const response = await supertest(app)
        .post('/users')
        .send(_.omit(mockUser3, ['message']))
      expect(response.statusCode).toBe(201)
      expect(response.text).toEqual('Successfully added new user')
      postUsers = await getMockUsers();
      postUser3 = _.find(postUsers.rows, {'username': 'mockUser3'})
      expect(postUser3.username).toMatch('mockUser3')

    })

    test('Check if x-auth-token is set in header, jwt func is mocked here', async ()=>{//maybe save this for a seperate testing suite
      const response = await supertest(app)
        .post('/users')
        .send(_.omit(mockUser3, ['message']))
      expect(jwtMock).toHaveBeenCalled()
      expect(response.headers['x-auth-token']).toMatch('Fake JWT')
    })
    
    test('Check if password is successfully stored as hashed item in DB', async ()=>{
      const response = await supertest(app)
        .post('/users')
        .send(_.omit(mockUser3, ['message']))
      postUsers = await getMockUsers();
      postUser3 = _.find(postUsers.rows, {'username': 'mockUser3'})
      const validPassword = await bcrypt.compare(mockUser3.password, postUser3.password);
      expect(validPassword).toBe(true);
    
    })

  })

  describe('put', ()=>{
    
    it('Should return 400 if body is not proper format', async ()=>{
      putUsers = await getMockUsers()
      putUser1 = putUsers.rows[0].user_id
      const response =await supertest(app)
        .put('/users/' + putUser1)
        .send({"username": "hey"})//Will have a more indepth test for the validators unit test
      expect(response.statusCode).toBe(400);
    })
    it('Should return 400 if new username belongs to another record', async ()=>{
      putUsers = await getMockUsers()
      putUser1 = putUsers.rows[0].user_id
      const response =await supertest(app)
        .put('/users/' + putUser1)
        .send({
          "username": "mockUser2",
          "email": "newEmail@gmail.com",
          "password": "testpassword"
        })
      expect(response.statusCode).toBe(400);
    })
    it('Should return 400 if new email belongs to another record', async ()=>{//this broke for no reason then fixed itself
      putUsers = await getMockUsers()
      putUser1 = putUsers.rows[0].user_id
      const response =await supertest(app)
        .put('/users/' + putUser1)
        .send({
          "username": "newUser123",
          "email": "mockEmail2@gmail.com",
          "password": "testpassword"
        })
      expect(response.statusCode).toBe(400);
    })

    it('Should return 404 if no id found', async ()=>{

      const response =await supertest(app)
        .put('/users/' + 1)
        .send({
          "username": "newUser123",
          "email": "noIdhere@gmail.com",
          "password": "testpassword"
        })
      expect(response.statusCode).toBe(404);
    })

    test('Target user id should have its record updated', async ()=>{
      putUsers = await getMockUsers()
      putUser1 = putUsers.rows[0]
      putUser1ID = putUser1.user_id
      const response =await supertest(app)
        .put('/users/' + putUser1ID)
        .send(_.omit(mockUser1, ['message']))//same details as the user its editing here, so its allowed for them to match
      expect(response.statusCode).toBe(200);
      expect(response.text).toEqual('Record Successfully Updated')
    })

    test('Check if password is successfully stored as hashed item in DB', async ()=>{
      putUsers = await getMockUsers();
      putUser1 = (putUsers.rows[0]).user_id

      await supertest(app)
        .put('/users/' + putUser1)
        .send(_.omit(mockUser3, ['message']))

      users = await getMockUsers();
      user1 = _.find(users.rows, {'username': 'mockUser3'})

      const validPassword = await bcrypt.compare(mockUser3.password, user1.password);
      expect(validPassword).toBe(true);
    
    })
        
  })

  describe('DELETE', ()=>{

    test('404 is no record found', async ()=>{
      response = await supertest(app).delete('/users/1')
      expect(response.statusCode).toBe(404)//Could check DB but won't
    })

    test('Record Should be deleted', async ()=>{
      var deletedUsers = await getMockUsers()
      deletedUser1 = deletedUsers.rows[0].user_id
      response = await supertest(app).delete('/users/' + deletedUser1)
      expect(response.statusCode).toBe(201)//Could check DB but won't
    })

  })
});

//How to only mock auth for 1 test
//Want tests where auth is mocked & auth is not
//Probably have seperate suite for auth testing, just mock here always
//Delete will require some form of transaction testing :/