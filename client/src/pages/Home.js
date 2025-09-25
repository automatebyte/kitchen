import React from 'react';
import backgroundImage from '../assets/landingpage.jpeg';

function Home() {
  return (
    <div>
      <div className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hero-content fade-in-up">
          <h1>Kitchen Hub</h1>
          <p>Experience exceptional culinary delights with our premium catering services. From intimate gatherings to grand celebrations, we bring flavor and elegance to every occasion.</p>
          <div className="hero-cta">
            <a href="/menu" className="btn btn-primary">Explore Menu</a>
            <a href="/register" className="btn btn-accent">Join Today</a>
          </div>
        </div>
      </div>
      
      <div className="page-container">
        <div className="card">
          <h2>Our Services</h2>
          <p>We specialize in creating memorable dining experiences with fresh, locally-sourced ingredients and innovative culinary techniques.</p>
        </div>
        
        <div className="card">
          <h2>Why Choose Kitchen Hub?</h2>
          <ul>
            <li>✨ Premium quality ingredients</li>
            <li>👨‍🍳 Expert culinary team</li>
            <li>🎉 Customizable menu options</li>
            <li>🚚 Reliable delivery service</li>
            <li>💯 100% satisfaction guarantee</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;