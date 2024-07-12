module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        contact: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
    })
    return Customer;
}