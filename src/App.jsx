import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [dogData, setDogData] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchDogData = async () => {
    try {
      let response;
      do {
        response = await axios.get('https://api.thedogapi.com/v1/images/search?size=small', {
          headers: {
            'x-api-key': 'live_KchBHTk8cOO6eHcn32UAadQjLkPWJy6G5MiiZIgqLr42kSDzhkl57XStSZhLVsBv'
          }
        });
        const { url, breeds } = response.data[0];
        const breedData = { name: breeds[0]?.name, lifeSpan: breeds[0]?.life_span, temperament: breeds[0]?.temperament };
        if (!banList.some(banned => Object.values(banned).some(val => Object.values(breedData).includes(val)))) {
          if (breedData.name && breedData.temperament && breedData.lifeSpan) {
            setDogData({ url, breedData });
            break;
          }
        }
      } while (true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanClick = (attribute, value) => {
    setBanList([...banList, { attribute, value }]);
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Dog API Viewer</h1>
      </header>
      <main>
        <section className="dog-section">
          <h2>Click for a touch of happiness!</h2>
          <button onClick={fetchDogData}>Discover</button>
          {dogData && (
            <div className="dog-data">
              <img src={dogData.url} alt="Random Dog" />
              <ul>
                {Object.entries(dogData.breedData).map(([key, value]) => (
                  <li key={key}>
                    <button onClick={() => handleBanClick(key, value)}>Ban {key}</button>: {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <section className="ban-section">
          <h2>Ban List</h2>
          <ul>
            {banList.map((bannedAttribute, index) => (
              <li key={index}>Banned {bannedAttribute.attribute}: {bannedAttribute.value}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
