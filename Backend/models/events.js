module.exports = (sequelize, DataTypes) => {
    const events = sequelize.define('events', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        refrences:{
            model: 'restaurants',
            key: 'id'
        }
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_image: {
        type: DataTypes.STRING,
      },
      city_id: {
        type: DataTypes.INTEGER,
        refrences:{
            model:'city',
            key:'id'
        },
      },
      region_id: {
        type: DataTypes.INTEGER,
        refrences:{
            model:'region',
            key:'id'
        },
      },
      event_description: {
        type: DataTypes.TEXT,
      },
      recurrent_type: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      },
      all_day: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        refrences:{
            model:'event_category',
            key:'id'
        }
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_Recurrent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tags: {
        type: DataTypes.ENUM('holi', 'music', 'live', 'DJ'),
        allowNull: true, // Change to false if required
      },
      created_by: {
        type: DataTypes.STRING,
      },
      updated_by: {
        type: DataTypes.STRING,
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
  
    return events;
  };
  