const admin = require('../admin');


describe('Admin Middleware', () => {
    it('should return 403', () => {
        var res = {
            locals:{
                user:{
                    isAdmin: 'hey'
                }
            },
            statusCode: {},
            sendText:{},
            status: function (arg){//doesn't like arrow notation here
                this.statusCode = (arg)//arrow function doesnt have its own this value
                return this
            },//dont have to mock here, but maybe who knows
            send: jest.fn(function (arg){
                this.sendText = (arg)
                return this
            }) 
        };
        var req = {};
        var next = jest.fn();

        admin(req,res,next);

    })

    it('should call next', () => {
        var res = {
            locals:{
                user:{
                    isAdmin: 'admin'
                }
            }
        };
        var req = {};
        var next = jest.fn();
        admin(req,res,next);
        expect(next).toHaveBeenCalled()
    })
});