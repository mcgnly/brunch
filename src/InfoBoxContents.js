import React from "react";

const today = new Date();
const weekday = today.getDay()-1
export function InfoBoxContents({ station, destination, error, searchType }) {
  console.log(destination);
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
      {destination.opening_hours && (
        <>
          <h4>
            {destination.opening_hours.open_now
              ? "Open now!"
              : "not open currently"}
          </h4>
          <h4>opening hours: {destination.opening_hours.weekday_text[weekday]}</h4>
        </>
      )}
      <h4>address: {destination.formatted_address}</h4>
      <h4>see more: <a href={destination.url}>{destination.url}</a></h4>
    </div>
  ) : (
    <div>
      <h4>oh no! {error}</h4>
    </div>
  );
}
