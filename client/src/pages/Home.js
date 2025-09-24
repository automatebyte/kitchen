import React from 'react';

function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Mvule Catering</h1>
        <p>Experience exceptional culinary delights with our premium catering services. From intimate gatherings to grand celebrations, we bring flavor and elegance to every occasion.</p>
      </div>
      
      <div className="page-container">
        <div className="card">
          <h2>Our Services</h2>
          <p>We specialize in creating memorable dining experiences with fresh, locally-sourced ingredients and innovative culinary techniques.</p>
        </div>
        
        <div className="card">
          <h2>Why Choose Mvule Catering?</h2>
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