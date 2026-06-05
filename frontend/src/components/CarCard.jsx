import React from 'react';

const CarCard = ({ name, type, price, emoji }) => {
  return (
    <div className="car-card glass-panel">
      <div className="car-image-placeholder">
        {emoji}
      </div>
      <div className="car-details">
        <h3>{name}</h3>
        <p className="car-price">${price} / day</p>
        <div className="car-features">
          <span>⚙️ Auto</span>
          <span>💺 4 Seats</span>
          <span>⛽ Petrol</span>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Rent Now</button>
      </div>
    </div>
  );
};

export default CarCard;
