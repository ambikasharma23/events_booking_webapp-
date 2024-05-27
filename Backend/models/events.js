module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define("events", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      refrences: {
        model: "restaurant",
        key: "id",
      },
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
      refrences: {
        model: "city",
        key: "id",
      },
    },
    region_id: {
      type: DataTypes.INTEGER,
      refrences: {
        model: "region",
        key: "id",
      },
    },
    event_description: {
      type: DataTypes.TEXT,
    },
    recurrent_type: {
      type: DataTypes.ENUM("daily", "weekly", "monthly", "yearly"),
      allowNull: true,
    },
    recurrent_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    custom_day: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    all_day: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      refrences: {
        model: "event_category",
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    is_Recurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
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
  Event.associate = (models) => {
    Event.hasMany(models.sessions, {
      foreignKey: "session_id",
      as: "sessions",
    });

    events.belongsTo(models.restaurant, {
      foreignKey: "restaurant_id", // Check if the foreign key is correct
      as: "restaurant", // Singularize the alias
    });
  };
  return events;
};
