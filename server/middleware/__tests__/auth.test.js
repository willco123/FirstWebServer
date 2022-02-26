const auth = require('../auth');
const {generateAuthToken} = require('../../utils/validators');
const jwt = require('jsonwebtoken');
process.env.SECRET_KEY = 123;

describe('Auth Middleware', () => {
    it('should populate req.ueser with the payload of a valid JWT', () => {
        token = generateAuthToken(123)
        const req = {
            header: jest.fn().mockReturnValue(token)
        }

        var res = {
            locals:{
                user : null
            }
        };
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const next = jest.fn();
        auth(req, res, next);
        expect(res.locals.user).toMatchObject(decoded);
    })

    it('should populate req.ueser with the payload of a valid JWT', () => {
        token = ''
        const req = {
            header: jest.fn().mockReturnValue(token)
        }

        var res = {
            statusCode: {},
            sendText:{},
            status: function (arg){//doesn't like arrow notation here
                this.statusCode = (arg)//arrow function doesnt have its own this value
                return this
            },//dont have to mock here, but maybe who knows, probably will have to for actual test as res will be used by http module
            send: jest.fn(function (arg){
                this.sendText = (arg)
                return this
            }) 
        };
        
        const next = jest.fn();
        auth(req, res, next);
        expect(res.statusCode).toEqual(401)
        expect(res.sendText).toEqual('No token provided, please authorize account at /auth')

    })
})

// describe('Auth Middleware', () => {
//     it('should populate req.ueser with the payload of a valid JWT', () => {
//         token = ''
//         const req = {
//             header: jest.fn().mockReturnValue(token)
//         }

//         var res = {
//     
//             status: jest.fn().mockReturnThis(),
//             send: jest.fn().mockReturnThis(),
//         };
        
//         const next = jest.fn();
//         auth(req, res, next);

//     })
// })

