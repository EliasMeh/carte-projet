import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App'; // Adjust the path as necessary

test('renders card game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Card Game/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders initial state correctly', () => {
  render(<App />);
  const player1Cards = screen.getByText(/Nombre de cartes restantes: 26/i);
  const player2Cards = screen.getByText(/Nombre de cartes restantes: 26/i);
  const currentCard = screen.getByText(/Valeur actuelle: Aucune/i);
  expect(player1Cards).toBeInTheDocument();
  expect(player2Cards).toBeInTheDocument();
  expect(currentCard).toBeInTheDocument();
});

test('player 1 can play a card', () => {
  render(<App />);
  const player1Button = screen.getByText(/Jouer carte Joueur 1/i);
  fireEvent.click(player1Button);
  const player1Cards = screen.getByText(/Nombre de cartes restantes: 25/i);
  expect(player1Cards).toBeInTheDocument();
});

test('player 2 can play a card', () => {
  render(<App />);
  const player1Button = screen.getByText(/Jouer carte Joueur 1/i);
  fireEvent.click(player1Button); // Player 1 plays first
  const player2Button = screen.getByText(/Jouer carte Joueur 2/i);
  fireEvent.click(player2Button); // Player 2 plays next
  const player2Cards = screen.getByText(/Nombre de cartes restantes: 25/i);
  expect(player2Cards).toBeInTheDocument();
});

test('displays error message when player loses', () => {
  render(<App />);
  const player1Button = screen.getByText(/Jouer carte Joueur 1/i);
  fireEvent.click(player1Button); // Player 1 plays first
  const player2Button = screen.getByText(/Jouer carte Joueur 2/i);
  fireEvent.click(player2Button); // Player 2 plays next
  const errorMessage = screen.queryByText(/Vous avez perdu/i);
  expect(errorMessage).toBeInTheDocument();
});