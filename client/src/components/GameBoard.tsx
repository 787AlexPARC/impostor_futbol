import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import PlayerCard from './PlayerCard';

/**
 * Design Philosophy: Dinámico y Energético
 * - Tablero de juego con tarjetas interactivas
 * - Animaciones de revelación con efecto 3D
 * - Indicador de jugador actual con efecto de spotlight
 */
export default function GameBoard() {
  const { gameState, revealCard, endGame, nextPlayer } = useGame();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealedCard, setRevealedCard] = useState<number | null>(null);

  const handleCardClick = (playerIndex: number) => {
    if (selectedCard !== null || revealedCard !== null) return;

    setSelectedCard(playerIndex);
    const revealed = revealCard(playerIndex);

    setTimeout(() => {
      setRevealedCard(playerIndex);
    }, 500);
  };

  const handleNextPlayer = () => {
    setSelectedCard(null);
    setRevealedCard(null);
    nextPlayer();
  };

  const handleCatchImpostor = () => {
    endGame('impostor-caught');
  };

  const handleImpostorWins = () => {
    endGame('impostor-won');
  };

  const currentPlayerRevealed = gameState.revealedPlayers.includes(gameState.currentPlayerIndex);
  const revealedFootballer = currentPlayerRevealed
    ? gameState.selectedFootballer?.name || 'Futbolista'
    : null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Información del juego */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Jugador actual</p>
              <p className="text-3xl font-bold text-white">
                Jugador #{gameState.currentPlayerIndex + 1} de {gameState.players}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Cartas reveladas</p>
              <p className="text-3xl font-bold text-orange-400">
                {gameState.revealedPlayers.length} / {gameState.players}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de jugadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: gameState.players }).map((_, index) => (
          <div
            key={index}
            className="animate-in fade-in"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <PlayerCard
              playerNumber={index + 1}
              isActive={gameState.currentPlayerIndex === index}
              isRevealed={gameState.revealedPlayers.includes(index)}
              onClick={() => handleCardClick(index)}
              disabled={selectedCard !== null || revealedCard !== null || gameState.revealedPlayers.includes(index)}
            />
          </div>
        ))}
      </div>

      {/* Área de revelación */}
      {revealedCard !== null && (
        <div className="mb-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-block">
            <div className="bg-gradient-to-br from-blue-500/30 to-orange-500/30 border-2 border-yellow-400 rounded-xl p-8 backdrop-blur-sm shadow-2xl shadow-yellow-400/30">
              <p className="text-gray-300 text-sm mb-2 uppercase tracking-widest">Futbolista revelado:</p>
              <p className="text-4xl font-bold text-yellow-400 mb-2">
                {gameState.selectedFootballer?.name}
              </p>
              <p className="text-gray-400 text-sm">
                {gameState.selectedFootballer?.position}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controles del juego */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {revealedCard !== null && (
          <>
            <Button
              onClick={handleNextPlayer}
              className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Siguiente Jugador
            </Button>

            {gameState.revealedPlayers.length === gameState.players && (
              <>
                <Button
                  onClick={handleCatchImpostor}
                  className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
                >
                  ¡Atrapamos al Impostor!
                </Button>
                <Button
                  onClick={handleImpostorWins}
                  className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
                >
                  ¡El Impostor Ganó!
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
