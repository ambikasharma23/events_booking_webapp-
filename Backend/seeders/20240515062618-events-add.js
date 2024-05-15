"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sample data for events
    const eventsData = [
      {
        restaurant_id: 1,
        event_name: "Music concert",
        event_image:
          "https://img.freepik.com/free-photo/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space_637285-559.jpg",
        city_id: 1,
        region_id: 6,
        event_description: `Experience the rhythm and soul of music under the starlit skies of Gurugram's vibrant DLF Phase 3. Join us for an electrifying music event that promises to serenade your senses every Saturday, starting from the 11th of each month. Immerse yourself in the melodious tunes and captivating performances of talented artists as they take center stage from 7:00 PM to 9:00 PM, creating an unforgettable ambiance that resonates with the heartbeat of the city. Whether you are a connoisseur of classical melodies, a lover of rock anthems, or a fan of soulful ballads, this event caters to all musical tastes, ensuring a memorable evening filled with harmony, joy, and rhythm. Don't miss the opportunity to be part of this enchanting musical journey in the heart of Gurugram. Come, let the music transport you to a world of pure bliss and euphoria every Saturday in DLF Phase 3.`,
        recurrent_type: "weekly",
        all_day: true,
        category_id: 1,
        start_date: new Date(),
        end_date: new Date(),
        is_Recurrent: false,
        tags: "music",
        created_by: "Ambika",
        updated_by: "Ambika",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        restaurant_id: 2,
        event_name: "Music concert",
        event_image:
          "https://img.freepik.com/free-photo/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space_637285-559.jpg",
        city_id: 2,
        region_id: 6,
        event_description: `Experience the rhythm and soul of music under the starlit skies of Gurugram's vibrant DLF Phase 3. Join us for an electrifying music event that promises to serenade your senses every Saturday, starting from the 11th of each month. Immerse yourself in the melodious tunes and captivating performances of talented artists as they take center stage from 7:00 PM to 9:00 PM, creating an unforgettable ambiance that resonates with the heartbeat of the city. Whether you are a connoisseur of classical melodies, a lover of rock anthems, or a fan of soulful ballads, this event caters to all musical tastes, ensuring a memorable evening filled with harmony, joy, and rhythm. Don't miss the opportunity to be part of this enchanting musical journey in the heart of Gurugram. Come, let the music transport you to a world of pure bliss and euphoria every Saturday in DLF Phase 3.`,
        recurrent_type: "weekly",
        all_day: true,
        category_id: 2,
        start_date: new Date(),
        end_date: new Date(),
        is_Recurrent: false,
        tags: "dj",
        created_by: "Priti",
        updated_by: "Priti",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert sample data into the events table
    await queryInterface.bulkInsert("Events", eventsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all data from the events table
    await queryInterface.bulkDelete("Events", null, {});
  },
};
