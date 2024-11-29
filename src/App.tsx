import React from 'react';
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
return deck;
};

//2-10-J-K-A
const App = () => {
  const [state, dispatch] = useReducer(reducer, { count : 0, error : null });
  const [deck, setDeck] = useState<string[]>(creerDeck());
  console.log(deck);


  return (
    <div>
      <h1 className="text-2xl font-bold">Card Game</h1>
      <p className="text-xl">Count: {state.count}</p>
      <button onClick={() => dispatch({ type : 'increment' })}>Increment</button>
      {/*<Card value="5" suit="H" /> 
      <Card value="K" suit="S" />
      <Card value="T" suit="D" /> 
      <Card value="A" suit="C" />  */}
    </div>
  );
};

export default App;