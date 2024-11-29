import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import Card from './components/Card';

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
  const [usedCards, setUsedCards] = useState<string[]>([]); // Tableau local pour les cartes utilisées
  const [inBattle, setInBattle] = useState(false);
  const [battleCards, setBattleCards] = useState<string[]>([]);

  useEffect(() => {
    const [main1, main2] = creerMain(deck);
    setHand1(main1);
    setHand2(main2);
  }, [deck]);

  useEffect(() => {
    const totalCards = hand1.length + hand2.length + usedCards.length + battleCards.length;
    if (totalCards !== 52) {
      console.error(`Erreur : nombre total de cartes incorrect (${totalCards})`);
      console.log('Main 1:', hand1);
      console.log('Main 2:', hand2);
      console.log('Cartes utilisées:', usedCards);
      console.log('Cartes de bataille:', battleCards);
    }
  }, [hand1, hand2, usedCards, battleCards]);
  
  const transferCards = (winner: number, cardsToTransfer: string[]) => {
    if (cardsToTransfer.length > 0) {
      if (winner === 1) {
        setHand1(prev => [...prev, ...cardsToTransfer]);
      } else if (winner === 2) {
        setHand2(prev => [...prev, ...cardsToTransfer]);
      }
    }
  };

  const playCard = (player: number) => {
    const hand = player === 1 ? hand1 : hand2;
    const setHand = player === 1 ? setHand1 : setHand2;
  
    if (hand.length > 0 && ((player === 1 && turn % 2 === 0) || (player === 2 && turn % 2 !== 0))) {
      const cardToPlay = hand[0];
      const cardValue = getCardValue(cardToPlay);
  
      setHand(prev => prev.slice(1));
      
      if (!state.currentCard || cardValue > getCardValue(state.currentCard)) {
        dispatch({ type: 'update', payload: cardToPlay });
        if (inBattle) {
          transferCards(player, [...battleCards, cardToPlay, ...usedCards]);
          setBattleCards([]);
          setUsedCards([]);
          setInBattle(false);
        } else {
          setUsedCards(prev => [...prev, cardToPlay]);
        }
      } else if (cardValue === getCardValue(state.currentCard)) {
        setInBattle(true);
        setBattleCards(prev => [...prev, cardToPlay, ...usedCards]);
        setUsedCards([]);
      } else {
        dispatch({ type: 'reset' });
        transferCards(player === 1 ? 2 : 1, [...battleCards, cardToPlay, ...usedCards]);
        setBattleCards([]);
        setUsedCards([]);
        setInBattle(false);
      }
  
      setTurn(prev => prev + 1);
    }
  };

  console.log(hand1, hand2);
  console.log(usedCards);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Card Game</h1>
      
      {inBattle && (
        <div className="mb-4">
          <p className="text-xl font-bold">Bataille en cours!</p>
          <p>Cartes en jeu: {battleCards.length}</p>
        </div>
      )}
      
      <p className="text-xl mb-4">
        Valeur actuelle: {state.currentCard || 'Aucune'}
      </p>
      {state.error && <p className="text-red-500 mb-4">{state.error}</p>}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Joueur 1</h2>
          <p className="mb-2">Nombre de cartes restantes: {hand1.length}</p>
          {hand2.length > 0 && (
          <div className="flex justify-center mb-2">
            <Card
              value={hand1[0][0] as 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K'}
              suit={hand1[0][1] as 'S' | 'D' | 'H' | 'C'}
            />
          </div>
          )}
          <button 
            onClick={() => playCard(1)} 
            disabled={turn % 2 !== 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
            Jouer carte Joueur 1
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Joueur 2</h2>
          <p className="mb-2">Nombre de cartes restantes: {hand2.length}</p>
          {hand2.length > 0 && (
            <div className="flex justify-center mb-2">
              <Card
                value={hand2[0][0] as 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K'}
                suit={hand2[0][1] as 'S' | 'D' | 'H' | 'C'}
              />
            </div>
          )}
          <button 
            onClick={() => playCard(2)} 
            disabled={turn % 2 === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
            Jouer carte Joueur 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;