import React from 'react';
import Card from './components/Card'; // Adjust the path as necessary
import './App.css';

const App = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Card Game</h1>
      <Card value="5" suit="H" /> {/* 5 of Hearts */}
      <Card value="K" suit="S" /> {/* King of Spades */}
      <Card value="T" suit="D" /> {/* 10 of Diamonds */}
      <Card value="A" suit="C" /> {/* Ace of Clubs */}
    </div>
  );
};

export default App;