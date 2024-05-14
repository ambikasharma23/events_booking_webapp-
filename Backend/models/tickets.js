module.exports = (sequelize, DataTypes) => {
    const ticket = sequelize.define("ticket", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sessions",
          key: "id",
        },
      },
      ticket_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      actual_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      display_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: DataTypes.NOW,
      },
    });
  
    return ticket;
  };
  