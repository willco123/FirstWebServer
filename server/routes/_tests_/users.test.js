jest.mock('../../middleware/auth', () => jest.fn((req,res,next) => next()));
const auth = require('../../middleware/auth')
const supertest = require('supertest');
const router = require('../users');
const db = require('../../startup/db');
const { 
        setupMockApp,
        populateMockUser,
        clearMockDB,
        createMockUsers} = require('../../../tests/test-helpers');
const { poolConn } = require('../../startup/db');

app = setupMockApp();
app.use('/users', router);

beforeEach( async () => {

    await clearMockDB();
    mockUsers = createMockUsers();
    var {mockUser1, mockUser2, mockUser3} = mockUsers;
    await populateMockUser(mockUser1);
    await populateMockUser(mockUser2);
    await populateMockUser(mockUser3);
})

afterEach(async () => {
    await clearMockDB();

})


describe('/users', () => {

  describe('get', () => {

    // it('Error if no DB connect', async () => {
    //   for(i=0;i>10;i++){
    //     await poolConn();
    //   }
    //   console.log(db.poolMAX())
    //   const response = await supertest(app).get('/users');
    //   expect(response.status).toBe(200);
    // });    

    it('Should call the middleware using the mock function', async () => {
      const response = await supertest(app).get('/users');
      expect(response.status).toBe(200);
      expect(auth).toHaveBeenCalled();
    });

    it('Should return 3 users', async () => {//3 users populated before the test
      const response = await supertest(app).get('/users');
      expect(response._body.length).toEqual(3);
      expect(response.status).toBe(200);
    });

    it('Should return type json', async () => {
      const response = await supertest(app).get('/users');
      expect(response.type).toEqual('application/json')
    });

  });




});

//How to only mock auth for 1 test
//Want tests where auth is mocked & auth is not
//Probably have seperate suite for auth testing, just mock here always
