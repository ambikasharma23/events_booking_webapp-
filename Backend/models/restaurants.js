module.exports = (sequelize, DataTypes) => {
  const restaurant = sequelize.define("restaurant", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  });
  return restaurant;
};
