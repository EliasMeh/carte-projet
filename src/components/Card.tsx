import React from 'react';
import './Card.css';

interface CardProps {
  value: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K';
  suit: 'S' | 'D' | 'H' | 'C';
}

//images importées de https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/

const Card = ({ value, suit }: CardProps) => {
  const cardImage = `/poker-qr/${value}${suit}.svg`;

  return (
    <div className="card">
      <img src={cardImage} alt={`${value} of ${suit}`} className="w-28 h-auto" /> 
    </div>
  );
};

export default Card;