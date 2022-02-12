//just see if username/password is correct/incorrect, if correct expect "mock" token, if not 400
var validateJWT = require('../../validation/validators');
const jwtMock = jest.spyOn(validateJWT, 'generateAuthToken')
jwtMock.mockImplementation(()=> ('Fake JWT'));

const _ = require('lodash');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const router = require('../auth');
const { 
    setupMockApp,
    getMockUsers,
    populateMockUser,
    clearMockDB,
    createMockUsers} = require('../../../tests/test-helpers');



app = setupMockApp();
app.use('/auth', router);

mockUsers = createMockUsers();
var {mockUser1, mockUser2, mockUser3} = mockUsers;
    
beforeEach( async () => {

    await clearMockDB();
    await populateMockUser(mockUser1);
    await populateMockUser(mockUser2);
    //await populateMockUser(mockUser3);
})

afterEach(async () => {
    await clearMockDB();
})

describe('/auth', () => {

    describe('POST', ()=>{

        it('Should return 400 if username does not match', async ()=>{//will more in depth unit test for this
            userInvalidUsername = _.omit(mockUser1, ['username'])
            userInvalidUsername.username = 'notAValidUsername'
            const response = await supertest(app)
                .post('/auth')
                .send(userInvalidUsername)
            expect(response.statusCode).toBe(400);
            expect(response.text).toMatch('Invalid username or password.')
        })

        it('Should return 400 if password does not match', async ()=>{//will more in depth unit test for this
            userInvalidPassword = _.omit(mockUser1, ['password'])
            userInvalidPassword.password = 'notAValidPassword'
            const response = await supertest(app)
                .post('/auth')
                .send(userInvalidPassword)
            expect(response.statusCode).toBe(400);
            expect(response.text).toMatch('Invalid username or password.')
        })


        it('Should return 200', async ()=>{
            const response = await supertest(app)
                .post('/auth')
                .send(mockUser1)
            expect(response.statusCode).toBe(200);
            expect(response.header['x-auth-token']).toMatch('Fake JWT')
        })
        

    });
});