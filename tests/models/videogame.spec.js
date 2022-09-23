const { Videogame, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Videogame model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Videogame.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Videogame.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
      it("should work when its a valid name", () => {
        Videogame.create({ name: "Super Mario Bros" });
      });
    });
    describe("description", () => {
      it("should throw an error if description is null", (done) => {
        Videogame.create({})
          .then(() => done(new Error("it requires a valid description")))
          .catch(() => done());
      });
      it("should work when its a valid description", () => {
        Videogame.create({ description: "the game is about a magic world" });
      });
    });
    describe("ID", () => {
      it("should throw an error if ID is null", (done) => {
        Videogame.create({})
          .then(() => done(new Error("it requires a valid description")))
          .catch(() => done());
      });
      it("should work when its a valid ID", () => {
        Videogame.create({ id: "231312324" });
      });
    });
    describe("Platforms", () => {
      it("should throw an error if Platforms is null", (done) => {
        Videogame.create({})
          .then(() => done(new Error("it requires a valid platform")))
          .catch(() => done());
      });
      it("should work when its a valid platform", () => {
        Videogame.create({ platforms: "Xbox one, PlayStation, Nintendo" });
      });
    });
  });
});
