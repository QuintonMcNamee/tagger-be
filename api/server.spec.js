const request = require("supertest");
const server = require("./server");
const axios = require("axios");

describe("GET /", () => {
  //should return http 200 ok
  it("should return 200 http status code", () => {
    return request(server)
      .get("/")
      .then(response => {
        expect(response.status).toBe(200);
      });
  });

  //should return json
  test("should return JSON", async () => {
    const response = await request(server).get("/");

    //toMatch uses a regula expression to check
    //the value
    expect(response.type).toMatch(/json/i);
  });

  //writing with async whtn a then
  test("should return JSON using .then", () => {
    return request(server)
      .get("/")
      .then(response => {
        expect(response.type).toMatch(/json/i);
      });

    //toMatch uses a regula expression to check
    //the value
  });

  //should return an object
  //with an api property with the value 'up'

  it('should return {api: "up"}', async () => {
    const response = await request(server).get("/");

    expect(response.body).toEqual({ api: "up" });
    expect(response.body.api).toBe("up");
  });
  //object with an api property with the value 'up
});

describe("test Endpoint", () => {
  it("should verify auth", async () => {
    const id = {
      client_id:
        "498525641423-gv4h1poto9mdbdlj7qibo9sf0t4f2231.apps.googleusercontent.com",
      client_secret: "AGBziX-GP5CKEc9vckgr28I8",
      redirect_uri: "http://localhost:3000",
      grant_type: "authorization_code",
    };

    const res = await request(server);

    res.post("/api/postfe").then(
      axios
        .post("https://www.googleapis.com/oauth2/v4/token", id)
        .then(response => {
          console.log(response);
          return response;
        })
    );

    expect(res.status).toBe(200);

    // expect(req.body.code).toHaveProperty('post')
  });
});

it("returns 200 ");

const res = await request(server)
  .post("/postfe")
  .set({ userId: userId, id })
  .send({
    "": "",
    "": "",
  })
  .expect(function(res) {
    console.log(res.body);
    res.status = 409;
    res.body = { message: `Not able to access message body` };
  });