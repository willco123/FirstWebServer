jest.mock('../../middleware/auth', () => jest.fn((req,res,next) => next()));
const auth = require('../../middleware/auth')
const supertest = require('supertest');
const router = require('../users');
const { 
        setupMockApp,
        populateMockUser,
        clearMockDB,
        createMockUsers} = require('../../../tests/test-helpers');

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
    it('Should call the middleware using the mock function', async () => {
      const response = await supertest(app).get('/users');
      expect(response.status).toBe(200);
      await expect(auth).toHaveBeenCalled();
    });
  });




});

//How to only mock auth for 1 test