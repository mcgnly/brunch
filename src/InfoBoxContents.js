import React from 'react';

export function InfoBoxContents({station, destination, error, searchType}) {
    console.log(destination)
    return !error ? (
      <div>
        <h2>
          <span role="img" aria-label="metro">
            🚇
          </span>{" "}
          Head to station: {station}
        </h2>
        <h2>
          <span role="img" aria-label="eggs">
            🍳
          </span>{" "}
          And enjoy {searchType} at: {destination.name}
        </h2>
        <h4>
          rating: {destination.rating}
          <span role="img" aria-label="stars">
            ⭐
          </span>
        </h4>
        {/* <h4>opening hours: {destination.openingHours}</h4> */}
        {/* <h4>see more: {destination.url}</h4> */}
      </div>
    ) : (
      <div>
        <h4>oh no! {error}</h4>
      </div>
    );
  }