import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content animate-fade-in">
        <h1>Experience the Thrill of the Drive.</h1>
        <p>
          Rent premium, sports, and luxury vehicles for your next adventure. 
          Unmatched performance and design, delivered to your door.
        </p>
        <Link to="/signup" className="btn btn-primary" style={{ marginRight: '1rem', padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Explore Fleet
        </Link>
        <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Member Login
        </Link>
      </div>
    </section>
  );
};

export default Hero;
