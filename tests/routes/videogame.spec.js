/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Videogame, conn } = require("../../src/db.js");

const agent = session(app);
const videogame = {
  name: "Super Mario Bros",
  image:
    "https://media.gqmagazine.fr/photos/61fa5fd36ec921138030b144/1:1/w_1600%2Cc_limit/GettyImages-1309172130.jpg",
  description: "game to past the time",
  rating: 5,
  released: "12 / 08 / 2020",
  plarforms: "PlayStation, Xbox, Nintendo",
  genres: ["Adventure"],
};

describe("Videogame routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Videogame.sync({ force: true }).then(() => Videogame.create(videogame))
  );
  describe("GET /videogames", () => {
    it("should get 200", () => agent.get("/").expect(200));
    it("should get the videogame obect", () =>
      agent.get("/videogames").expect(videogame));
  });
});

describe("Test de APIS", () => {
  describe("GET /", () => {
    it();
  });
});
