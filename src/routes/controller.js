require("dotenv").config();
const axios = require("axios");
const { Videogame, Genre } = require("../db");
const API_KEY = process.env.API_KEY;
let containerMaster = [];
let arrayGenres = [];

const getVideogamesApi = async () => {
  if (!containerMaster.length) {
    const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;
    const response = await axios.get(url);
    const response2 = await axios.get(response.data.next);
    const response3 = await axios.get(response2.data.next);

    const result1 = response.data.results.map((data) => {
      return {
        id: data.id,
        name: data.name,
        image: data.background_image,
        rating: data.rating,
        genres: data.genres.map((g) => g.name.toLowerCase()),
        platforms: data.platforms.map((d) => d.platform.name).join(", "),
      };
    });
    // console.log(result1);

    const result2 = response2.data.results.map((data) => {
      return {
        id: data.id,
        name: data.name,
        image: data.background_image,
        rating: data.rating,
        genres: data.genres.map((g) => g.name.toLowerCase()),
        platforms: data.platforms.map((d) => d.platform.name).join(", "),
      };
    });

    const result3 = response3.data.results.map((data) => {
      return {
        id: data.id,
        name: data.name,
        image: data.background_image,
        rating: data.rating,
        genres: data.genres.map((g) => g.name.toLowerCase()),
        platforms: data.platforms.map((d) => d.platform.name).join(", "),
      };
    });

    containerMaster = [...result1, ...result2, ...result3];
    return containerMaster;
  } else {
    return containerMaster;
  }
};

const getVideogamesDb = async () => {
  const game = await Videogame.findAll({
    include: {
      model: Genre,
      attribute: ["name"],
      through: {
        attributes: [],
      },
    },
  });
  // return game.length ? game : game;
  const infoGame = game.map((data) => {
    return {
      id: data.id,
      name: data.name,
      image: data.image,
      rating: data.rating,
      genres: data.genres.map((g) => g.name),
    };
  });
  // return game;
  return infoGame;
};

const getAllGames = async () => {
  const apiGames = await getVideogamesApi();
  const dbGames = await getVideogamesDb();
  const allGames = [...dbGames, ...apiGames];
  return allGames;
};

function getVideogameByName(game) {
  const url = `https://api.rawg.io/api/games?search=${game}&key=${API_KEY}&page_size=15`;
  const response = axios
    .get(url)
    .then((resp) => {
      // const games = resp.data.results.slplice(0,15).map
      const games = resp.data.results.map((d) => {
        return {
          id: d.id,
          name: d.name,
          image: d.background_image,
          genres: d.genres.map((d) => d.name),
        };
      });
      // easy to read this line
      // console.log(games.length);
      //  games.length ? games : "the game was not found";
      if (games) {
        return games;
      } else {
        throw "the game was not found";
      }
    })
    .catch((error) => console.log(error));

  return response;
}

const getGameById = async (id) => {
  if (id.length > 10) {
    const game = await Videogame.findAll({
      where: {
        id,
      },
      include: {
        model: Genre,
        attribute: ["name"],
        through: {
          attributes: [],
        },
      },
    });
    return game;
  } else {
    const url = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`;
    try {
      const response = await axios.get(url);
      const game = {
        id: response.data.id,
        name: response.data.name,
        image: response.data.background_image,
        genres: response.data.genres.map((d) => d.name),
        released: response.data.released,
        rating: response.data.rating,
        platforms: response.data.platforms
          .map((d) => d.platform.name)
          .join(", "),
        description: response.data.description_raw,
      };
      // return response.data;
      return game;
    } catch (error) {
      throw "check your code, something went wrong";
    }
  }
};

function getGenres() {
  if (!arrayGenres.length) {
    const url = `https://api.rawg.io/api/genres?key=${API_KEY}`;
    const result = axios
      .get(url)
      .then((resp) => {
        const genres = resp.data.results.map((data) => data.name.toLowerCase());
        // console.log(genres);
        return genres;
      })
      .then((resp) => {
        resp.map((data) => {
          Genre.findOrCreate({
            where: {
              name: data,
            },
          });
        });
        return Genre.findAll().then((data) => {
          arrayGenres = [...data];
          return arrayGenres;
        });
      })
      .catch((error) => console.log(error));
    // console.log("trido de la API");
    return result;
  } else {
    // console.log("traido de la  DB");
    return arrayGenres;
  }
}

const createGame = async (obj) => {
  const { genres, name, image, description, platforms, released, rating } = obj;
  if (
    !name ||
    !image ||
    !description ||
    !rating ||
    !released ||
    !platforms ||
    !genres.length
  ) {
    throw "Missing data required to crate a new game";
  }

  // I map the array of genres and i search in the DB each one of the names and I save the result in a variable
  let genresDb = genres.map((genre) => {
    genre = genre.toLowerCase();
    return Genre.findAll({
      where: {
        name: genre,
      },
    });
  });
  // I reassign the value of genresDb to the result of waitting for the resolution of all the promise of the before map
  genresDb = await Promise.all(genresDb);
  //Promise.all return an array for each promise and I need the data together so I use the default function .flat() of the arrays that returnme an only array without depth
  genresDb = genresDb.flat();
  /// I map the array of genres and extract the id that I need for relation the genres to the videogames created - I reassign the variable again

  const idGenres = genresDb.map((g) => g.id);
  const newGame = await Videogame.create(obj);
  console.log(idGenres);

  newGame.addGenre(idGenres);

  return "Videogame created succesfully!!";
};

const updateGame = async (id, obj) => {
  const { name, image, description, rating, released, platforms, genres } = obj;
  if (
    !name ||
    !image ||
    !description ||
    !rating ||
    !released ||
    !platforms ||
    !genres.length
  ) {
    throw "It is not allowed to update fields without information";
  }

  if (id.length > 10) {
    const gToUpdate = await Videogame.findByPk(id);
    if (gToUpdate) {
      let newValues = {
        name,
        image,
        description,
        rating,
        released,
        platforms,
        genres,
      };
      Videogame.update(newValues, {
        where: { id },
      });
      return "Successfully update videogame";
    } else {
      throw "Videogame not found";
    }
  }
};

module.exports = {
  getVideogamesApi,
  getVideogameByName,
  getGameById,
  getGenres,
  createGame,
  getVideogamesDb,
  getAllGames,
  updateGame,
};
