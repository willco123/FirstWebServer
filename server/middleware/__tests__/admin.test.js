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
            status: function (arg){
                this.statusCode = (arg)
                return this
            },
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