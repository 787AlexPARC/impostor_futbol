import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Footballer {
  id: string;
  name: string;
  position: string;
}

export interface GameState {
  players: number;
  currentPlayerIndex: number;
  gameStarted: boolean;
  gameEnded: boolean;
  revealedPlayers: number[];
  impostorIndex: number;
  selectedFootballer: Footballer | null;
  footballers: Footballer[];
  gameResult: 'impostor-caught' | 'impostor-won' | null;
}

interface GameContextType {
  gameState: GameState;
  startGame: (playerCount: number) => void;
  revealCard: (playerIndex: number) => Footballer;
  endGame: (result: 'impostor-caught' | 'impostor-won') => void;
  resetGame: () => void;
  setFootballers: (footballers: Footballer[]) => void;
  nextPlayer: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultFootballers: Footballer[] = [
    { id: '1', name: 'Cristiano Ronaldo', position: 'Delantero' },
    { id: '2', name: 'Lionel Messi', position: 'Delantero' },
    { id: '3', name: 'Neymar Jr', position: 'Extremo' },
    { id: '4', name: 'Kylian Mbappé', position: 'Delantero' },
    { id: '5', name: 'Luka Modrić', position: 'Centrocampista' },
    { id: '6', name: 'Mohamed Salah', position: 'Extremo' },
    { id: '7', name: 'Vinícius Júnior', position: 'Extremo' },
    { id: '8', name: 'Erling Haaland', position: 'Delantero' },
    { id: '9', name: 'Jude Bellingham', position: 'Centrocampista' },
    { id: '10', name: 'Gianluigi Donnarumma', position: 'Portero' },
  ];

  const [gameState, setGameState] = useState<GameState>({
    players: 0,
    currentPlayerIndex: 0,
    gameStarted: false,
    gameEnded: false,
    revealedPlayers: [],
    impostorIndex: -1,
    selectedFootballer: null,
    footballers: defaultFootballers,
    gameResult: null,
  });

  const startGame = useCallback((playerCount: number) => {
    const impostorIdx = Math.floor(Math.random() * playerCount);
    const randomFootballer = gameState.footballers[
      Math.floor(Math.random() * gameState.footballers.length)
    ];

    setGameState((prev) => ({
      ...prev,
      players: playerCount,
      currentPlayerIndex: 0,
      gameStarted: true,
      gameEnded: false,
      revealedPlayers: [],
      impostorIndex: impostorIdx,
      selectedFootballer: randomFootballer,
      gameResult: null,
    }));
  }, [gameState.footballers]);

  const revealCard = useCallback((playerIndex: number): Footballer => {
    const isImpostor = playerIndex === gameState.impostorIndex;
    const footballer = isImpostor
      ? gameState.footballers[Math.floor(Math.random() * gameState.footballers.length)]
      : gameState.selectedFootballer!;

    setGameState((prev) => ({
      ...prev,
      revealedPlayers: [...prev.revealedPlayers, playerIndex],
    }));

    return footballer;
  }, [gameState.impostorIndex, gameState.selectedFootballer, gameState.footballers]);

  const endGame = useCallback((result: 'impostor-caught' | 'impostor-won') => {
    setGameState((prev) => ({
      ...prev,
      gameEnded: true,
      gameResult: result,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      players: 0,
      currentPlayerIndex: 0,
      gameStarted: false,
      gameEnded: false,
      revealedPlayers: [],
      impostorIndex: -1,
      selectedFootballer: null,
      gameResult: null,
    }));
  }, []);

  const setFootballers = useCallback((footballers: Footballer[]) => {
    setGameState((prev) => ({
      ...prev,
      footballers,
    }));
  }, []);

  const nextPlayer = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players,
    }));
  }, []);

  const value: GameContextType = {
    gameState,
    startGame,
    revealCard,
    endGame,
    resetGame,
    setFootballers,
    nextPlayer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
