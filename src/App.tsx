import React, { useEffect, useReducer, useState } from 'react';
import './App.css';

const nombres = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const types = ['S', 'D', 'H', 'C'];

interface State {
  currentCard: string | null;
  error: string | null;      
}

type Action = { type: 'update'; payload: string } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'update':
      return { currentCard: action.payload, error: null }; 
    case 'reset':
      return { currentCard: null, error: 'Vous avez perdu' }; 
    default:
      return state;
  }
}

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
  return shuffle(deck);
};

const creerMain = (deck: string[]) => {
  const moitié = deck.length / 2;
  const hand1 = deck.slice(0, moitié);
  const hand2 = deck.slice(moitié);
  return [hand1, hand2];
};

const getCardValue = (card: string): number => {
  const value = card[0];
  if (value >= '2' && value <= '9') return parseInt(value);
  if (value === 'T') return 10;
  if (value === 'J') return 11;
  if (value === 'Q') return 12;
  if (value === 'K') return 13;
  if (value === 'A') return 14;
  return 0;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, { currentCard: null, error: null });
  const [deck, setDeck] = useState<string[]>(creerDeck());
  const [hand1, setHand1] = useState<string[]>([]);
  const [hand2, setHand2] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    const [main1, main2] = creerMain(deck);
    setHand1(main1);
    setHand2(main2);
  }, [deck]);

  const playCard = (player: number) => {
    if (player === 1 && hand1.length > 0 && turn % 2 === 0) {
      const cardToPlay = hand1[0];
      const cardValue = getCardValue(cardToPlay);

      if (!state.currentCard || cardValue > getCardValue(state.currentCard)) {
        dispatch({ type: 'update', payload: cardToPlay });
      } else {
        dispatch({ type: 'reset' });
      }

      setHand1(hand1.slice(1)); 
      setTurn(turn + 1); 
    } else if (player === 2 && hand2.length > 0 && turn % 2 !== 0) {
      const cardToPlay = hand2[0];
      const cardValue = getCardValue(cardToPlay);

      if (!state.currentCard || cardValue > getCardValue(state.currentCard)) {
        dispatch({ type: 'update', payload: cardToPlay });
      } else {
        dispatch({ type: 'reset' }); 
      }

      setHand2(hand2.slice(1)); 
      setTurn(turn + 1); 
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Card Game</h1>
      <p className="text-xl">
        Valeur actuelle: {state.currentCard || "Aucune"}
      </p>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <div>
        <h2>Joueur 1</h2>
        <p>Nombre de carte restantes: {hand1.length}</p>
        <button
          onClick={() => playCard(1)}
          disabled={turn % 2 !== 0} 
        >
          Jouer carte Joueur 1
        </button>
        {hand1.length > 0 && <p>Carte suivante: {hand1[0]}</p>}
      </div>
      <div>
        <h2>Joueur 2</h2>
        <p>Nombre de carte restantes: {hand2.length}</p>
        <button
          onClick={() => playCard(2)}
          disabled={turn % 2 === 0}
        >
          Jouer carte Joueur 2
        </button>
        {hand2.length > 0 && <p>Carte suivante: {hand2[0]}</p>}
      </div>
    </div>
  );
};

export default App;
