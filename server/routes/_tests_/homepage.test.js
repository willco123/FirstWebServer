const app = require('../../app');
const request = require('supertest');


describe("GET /", () => {
    test("Should respond status(200) with type json", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.type).toEqual('application/json')
      expect(response.headers["content-type"]).toMatch(/json/);
      
    });
    test("Text should be JSON", async () => {
        const response = await request(app).get("/");
        jsonText = {info: 'Node.js, Express, and Postgres API'}
        expect(response.body).toEqual(jsonText)
        
      });

  });


  