import React, { useEffect } from 'react';
import Card from './components/Card'; 
import './App.css';
import { useState, useReducer } from 'react';

const nombres= ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const types = ['S', 'D', 'H', 'C'];


interface State {
  count : number;
  error : string | null;
}
interface Action {
  type : 'increment' | 'reset';
  payload? : number;
}


function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + (action.payload || 0), error: null }; // Use payload
    case 'reset':
      return { count: 0, error: null };
    default:
      return state;
  }
}
//https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
const shuffle = (array: string[]) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

const creerDeck = () => {
  const deck = [];
  for (const type of types) {
    for (const nombre of nombres) {
      deck.push(`${nombre}${type}`);
    }
  }
  const NewDeck = shuffle(deck);
return NewDeck;
};

const creerMain = (deck: string[]) => {
  const moitié = deck.length / 2;
  const hand1 = deck.slice(0, moitié);
  const hand2 = deck.slice(moitié, deck.length);
  return [hand1, hand2];
}


const getCardValue = (card: string): number => {
  const value = card[0];
  if (value >= '2' && value <= '9') {
    return parseInt(value);
  } else if (value === 'T') {
    return 10; 
  } else if (value === 'J') {
    return 11; 
  } else if (value === 'Q') {
    return 12; 
  } else if (value === 'K') {
    return 13; 
  } else if (value === 'A') {
    return 14;
  }
  return 0;
};

//2-10-J-K-A
const App = () => {
  const [state, dispatch] = useReducer(reducer, { count : 0, error : null });
  const [deck, setDeck] = useState<string[]>(creerDeck());
  console.log(deck);
  const [hand1, setHand1] = useState<string[]>([]);
  const [hand2, setHand2] = useState<string[]>([]);
  
  useEffect(() => {
    const [main1, main2] = creerMain(deck);
    setHand1(main1);
    setHand2(main2);
  }, [deck]);

  console.log(hand1);
  console.log(hand2);




  const playCard = (player: number) => {
    if (player === 1 && hand1.length > 0) {
      const cardToPlay = hand1[0];
      const cardValue = getCardValue(cardToPlay);
      dispatch({ type: 'increment', payload: cardValue });
      setHand1(hand1.slice(1)); 
    } else if (player === 2 && hand2.length > 0) {
      const cardToPlay = hand2[0];
      const cardValue = getCardValue(cardToPlay);
      dispatch({ type: 'increment', payload: cardValue });
      setHand2(hand2.slice(1));
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Card Game</h1>
      <p className="text-xl">Valeur actuelle: {state.count}</p>
      <div>
        <h2>Joueur 1</h2>
        <button onClick={() => playCard(1)}>Jouer carte Joueur 1</button>
        {hand1.length > 0 && <p>Carte jouée: {hand1[0]}</p>}
      </div>
      <div>
        <h2>Joueur 2</h2>
        <button onClick={() => playCard(2)}>Jouer carte Joueur 2</button>
        {hand2.length > 0 && <p>Carte jouée: {hand2[0]}</p>}
      </div>
    </div>
  );
};

export default App;