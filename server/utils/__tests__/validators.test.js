const {validateUser, validateMessage, generateAuthToken} = require('../validators');
const jwt = require('jsonwebtoken');
const _ = require('lodash');



describe('Generate Auth Token', ()=> {
    process.env.SECRET_KEY = 123
    it('Should generate a JWT auth token from a user id', ()=> {
        token = generateAuthToken(id = 123)
        decoded = jwt.verify(token, '123')
        expect(decoded.id).toEqual(123)
        expect(decoded.isAdmin).toMatch('standard')
    })
})

describe('Validate Message', () =>{

    it('Should return message is required', ()=> {
        var myMessage = {'notMessage': 'Mock message'};
        const {error} = validateMessage(myMessage);
        errorMessage = error.details[0].message;
        expect(errorMessage).toEqual('"message" is required')
    })

    test('Message cannot be empty', ()=> {
        var myMessage = {'message': ''};
        const {error} = validateMessage(myMessage);
        errorMessage = error.details[0].message;
        expect(errorMessage).toEqual('"message" is not allowed to be empty')
    })

    test('Message cannot exceed 300 characters', ()=> {
        var longMessage = 'HelloHello'
        for(i=0;i<5;i++){
            longMessage += longMessage
        }
        var myMessage = {'message': longMessage};
        const {error} = validateMessage(myMessage);
        errorMessage = error.details[0].message;
        expect(errorMessage).toEqual('"message" length must be less than or equal to 300 characters long')
    })

    test('Message in correct format', ()=> {
        var myMessage = {'message': 'Valid Message'};
        const {error} = validateMessage(myMessage);
        expect(error).toEqual(undefined)
    })
})

describe('Validate User', ()=> {
    var user = {"username": "ValidUsername",
                'email': 'MockEmail@gmail.com',
                'password': 'MockPassword1'
    }
    
    describe('Username', ()=> {
        test('Short Username', ()=> {
            user.username = 'A'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"username" length must be at least 5 characters long')
        })

        test('Long Username', ()=> {
            var longUser = 'HelloHello'
            for(i=0;i<5;i++){
                longUser += longUser
            }
            user.username = longUser
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"username" length must be less than or equal to 50 characters long')
        })

        test('No Username', ()=> {
            user = _.omit(user, "username");
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"username" is required')
        })

        test('Good Username', ()=> {
            user.username = 'AValidUsername';
            const {error} = validateUser(user);
            expect(error).toEqual(undefined)
        })

    })

    describe('Email', ()=> {
        test('Not an Email', ()=> {
            user.email = 'Helloa'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"email" must be a valid email')
        })

        test('Long Email', ()=> {
            var longEmail = 'HelloHello'
            for(i=0;i<5;i++){
                longEmail += longEmail
            }
            user.email = longEmail + '@gmail.com'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"email" length must be less than or equal to 50 characters long')
        })

        test('No Email', ()=> {
            user = _.omit(user, "email");
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"email" is required')
        })

        test('Bad Email no .com', ()=> {
            user.email = 'notagoodformat@gmail'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"email" must be a valid email')
        })

        test('Bad Email no @', ()=> {
            user.email = 'notagoodformatgmail.com'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"email" must be a valid email')
        })

        test('Bad Email has whitespace', ()=> {
            user.email = 'notagoodformat @gmail.com'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"email" must be a valid email')
        })


        test('Good Email', ()=> {
            user.email = 'AValidEmail@gmail.com'
            const {error} = validateUser(user);
            expect(error).toEqual(undefined)
        })

    })

    describe('Password', ()=> {
        test('Short Password', ()=> {
            user.password = 'A'
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"password" length must be at least 5 characters long')
        })

        test('Long Password', ()=> {
            var longPassword = 'HelloHello'
            for(i=0;i<5;i++){
                longPassword += longPassword
            }
            user.password = longPassword
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"password" length must be less than or equal to 255 characters long')
        })

        test('No Password', ()=> {
            user = _.omit(user, "password");
            const {error} = validateUser(user);
            errorMessage = error.details[0].message;
            expect(errorMessage).toEqual('"password" is required')
        })


        test('Good Password', ()=> {
            user.password = 'AValidPassword';
            const {error} = validateUser(user);
            expect(error).toEqual(undefined)
        })
    })
})