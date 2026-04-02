import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import PlayerCard from './PlayerCard';

/**
 * Design Philosophy: Dinámico y Energético
 * - Tablero de juego con tarjetas interactivas
 * - Animaciones de revelación con efecto 3D
 * - Indicador de jugador actual con efecto de spotlight
 * - Botón Finalizar Juego para control manual
 * - El impostor ve "IMPOSTOR" en su carta
 * - Completamente responsivo para móviles
 */
export default function GameBoard() {
  const { gameState, revealCard, finishGame, nextPlayer } = useGame();
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

  const handleFinishGame = () => {
    finishGame();
  };

  const currentRevealedCard = revealedCard !== null ? revealCard(revealedCard) : null;
  const isImpostorRevealed = revealedCard === gameState.impostorIndex;

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500 px-2 md:px-0">
      {/* Información del juego */}
      <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30 rounded-lg md:rounded-xl p-4 md:p-6 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">Jugador actual</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                Jugador #{gameState.currentPlayerIndex + 1} de {gameState.players}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-400 text-xs md:text-sm mb-1">Cartas reveladas</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-400">
                {gameState.revealedPlayers.length} / {gameState.players}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de jugadores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
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
        <div className="mb-6 md:mb-8 text-center animate-in fade-in zoom-in duration-500 px-2">
          <div className="inline-block w-full max-w-sm">
            {isImpostorRevealed ? (
              // Mostrar IMPOSTOR con efecto especial
              <div className="bg-gradient-to-br from-red-600/50 to-orange-600/50 border-4 border-red-500 rounded-lg md:rounded-xl p-8 md:p-12 backdrop-blur-sm shadow-2xl shadow-red-500/50 animate-pulse">
                <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-4 uppercase tracking-widest">¡CUIDADO!</p>
                <p className="text-4xl md:text-6xl lg:text-7xl font-bold text-red-400 mb-2 md:mb-4 animate-bounce">
                  IMPOSTOR
                </p>
                <p className="text-xl md:text-2xl text-red-300">🎭</p>
              </div>
            ) : (
              // Mostrar futbolista normal
              <div className="bg-gradient-to-br from-blue-500/30 to-orange-500/30 border-2 border-yellow-400 rounded-lg md:rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-2xl shadow-yellow-400/30">
                <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-widest">Futbolista revelado:</p>
                <p className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2 break-words">
                  {gameState.selectedFootballer?.name}
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  {gameState.selectedFootballer?.position}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controles del juego */}
      <div className="flex flex-col gap-3 md:gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 mb-4 md:mb-6">
        {revealedCard !== null && (
          <>
            <Button
              onClick={handleNextPlayer}
              className="w-full py-4 md:py-6 text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Siguiente Jugador
            </Button>
          </>
        )}
      </div>

      {/* Botón Finalizar Juego - Siempre visible */}
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <Button
          onClick={handleFinishGame}
          className="w-full py-4 md:py-6 px-4 md:px-8 text-base md:text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 hover:scale-105"
        >
          Finalizar Juego
        </Button>
        <p className="text-xs md:text-sm text-gray-400 mt-2 md:mt-3 px-2">
          Presiona cuando todos hayan visto sus cartas y hayan discutido
        </p>
      </div>
    </div>
  );
}
