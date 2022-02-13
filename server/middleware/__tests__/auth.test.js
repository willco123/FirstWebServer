const auth = require('../auth');

mockRequest = jest.fn();
mockResponse = {
    json: jest.fn()
};
next = jest.fn();


///pass in nothing
//pass in valid jwt
//pass in invalid jwt

describe('Auth Middleware', ()=>{
    test('No token header provided', ()=>{ 
        mockRequest.header = jest.fn();
        res = auth(mockRequest, mockResponse,next)
        expect(res.statusCode).toBe(401)
    })
})