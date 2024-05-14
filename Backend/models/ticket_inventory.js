module.exports = (sequelize, DataTypes) => {
    const ticket_inventory = sequelize.define("ticket_inventory", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        ticket_id:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'tickets',
                key: 'id',
            },
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at',
            defaultValue: DataTypes.NOW 
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at',
            defaultValue: DataTypes.NOW 
          },

    });

    return ticket_inventory;
};
