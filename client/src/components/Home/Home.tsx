import React from 'react';
import Header from '../Header/Header';
import './home.css';
import Left from './Left';
import Main from './Main';
import Right from './Right';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="home-section">
        <h5>
          <a href="/">Hiring in a hurry? - </a>
        </h5>
        <p>Find talented pros in record time with Upwork and keep business</p>
      </div>

      <div className="home-layout">
        <Left />
        <Main />
        <Right />
      </div>
    </div>
  );
};

export default Home;
