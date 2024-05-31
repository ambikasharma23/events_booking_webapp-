import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }, (error) => {
      console.error("Error fetching location: ", error);
    });
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      // Fetch all restaurants within 100 km
      axios.get(`http://localhost:3000/restaurants?lat=${latitude}&lon=${longitude}`)
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error("Error fetching restaurants: ", error);
        });

      // Fetch restaurants within 10 km
      axios.get(`http://localhost:3000/restaurants?lat=${latitude}&lon=${longitude}&maxDistance=10`)
        .then(response => {
          setNearbyRestaurants(response.data);
        })
        .catch(error => {
          console.error("Error fetching nearby restaurants: ", error);
        });
    }
  }, [latitude, longitude]);

  return (
    <div className="App">
      <h1>Nearby events</h1>
      {latitude && longitude ? (
        <>
          <h2>All Restaurants (within 100 km)</h2>
          <ul>
            {restaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.name}</li>
            ))}
          </ul>

          <h2>Nearby Restaurants (within 10 km)</h2>
          <ul>
            {nearbyRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default App;
