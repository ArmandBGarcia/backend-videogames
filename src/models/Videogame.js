const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "videogame",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        // defaultValue:
        //   "https://media.gqmagazine.fr/photos/61fa5fd36ec921138030b144/1:1/w_1600%2Cc_limit/GettyImages-1309172130.jpg",
      },
      released: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      platforms: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
