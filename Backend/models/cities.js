module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define("City", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "createdat",
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updatedat",
        defaultValue: DataTypes.NOW,
      },
    });
  
    City.associate = (models) => {
      City.hasMany(models.restaurant, {
        foreignKey: "city_id",
        as: "restaurants",
      });
    };
  
    return City;
  };
  