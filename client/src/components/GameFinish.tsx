import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

/**
 * Design Philosophy: Dinámico y Energético
 * - Pantalla de selección de impostor
 * - Permite a los jugadores acusar y revelar al impostor
 * - Muestra el resultado final con animaciones
 * - Completamente responsivo para móviles
 */
export default function GameFinish() {
  const { gameState, resetGame } = useGame();
  const [selectedImpostor, setSelectedImpostor] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelectImpostor = (playerNumber: number) => {
    setSelectedImpostor(playerNumber);
  };

  const handleRevealImpostor = () => {
    setRevealed(true);
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const isCorrect = selectedImpostor === gameState.impostorIndex + 1;

  if (!revealed) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center animate-in fade-in duration-500 px-2 md:px-0">
        {/* Título */}
        <div className="mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            ¿Quién es el Impostor?
          </h2>
          <p className="text-base md:text-lg text-gray-300 px-2">
            Selecciona al jugador que creen que es el impostor
          </p>
        </div>

        {/* Selector de jugadores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-12">
          {Array.from({ length: gameState.players }).map((_, index) => {
            const playerNumber = index + 1;
            const isSelected = selectedImpostor === playerNumber;

            return (
              <button
                key={index}
                onClick={() => handleSelectImpostor(playerNumber)}
                className={`group relative overflow-hidden rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 transform hover:scale-110 animate-in fade-in ${
                  isSelected
                    ? 'bg-gradient-to-br from-red-600 to-orange-600 border-2 border-yellow-400 shadow-2xl shadow-red-500/50 scale-110'
                    : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-blue-500/30 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/30'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="relative z-10">
                  <div className="text-3xl md:text-5xl mb-2 md:mb-3 group-hover:scale-125 transition-all duration-300">
                    {isSelected ? '🎯' : '👤'}
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white mb-1">#{playerNumber}</p>
                  <p className="text-xs md:text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                    Jugador
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón Revelar */}
        {selectedImpostor !== null && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              onClick={handleRevealImpostor}
              className="w-full md:w-auto py-4 md:py-6 px-6 md:px-8 text-base md:text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
            >
              Revelar Impostor
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Pantalla de resultado
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-700 px-2 md:px-0">
      {/* Resultado principal */}
      <div className="mb-8 md:mb-12">
        <div className="inline-block mb-6 md:mb-8 animate-bounce">
          {isCorrect ? (
            <div className="text-6xl md:text-8xl lg:text-9xl">🎉</div>
          ) : (
            <div className="text-6xl md:text-8xl lg:text-9xl">❌</div>
          )}
        </div>

        <h2
          className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ${
            isCorrect
              ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent'
          }`}
        >
          {isCorrect ? '¡ACERTARON!' : '¡FALLARON!'}
        </h2>

        <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 px-2">
          {isCorrect
            ? `El impostor era el Jugador #${gameState.impostorIndex + 1}`
            : `El impostor era el Jugador #${gameState.impostorIndex + 1}, pero acusaron al Jugador #${selectedImpostor}`}
        </p>
      </div>

      {/* Información del juego */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
        {[
          { label: 'Total de jugadores', value: gameState.players, color: 'blue' },
          {
            label: 'Futbolista',
            value: gameState.selectedFootballer?.name,
            subvalue: gameState.selectedFootballer?.position,
            color: 'orange',
          },
          { label: 'Cartas reveladas', value: gameState.revealedPlayers.length, color: 'yellow' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-slate-800/50 border border-${item.color}-500/20 rounded-lg p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700`}
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <p className="text-gray-400 text-xs md:text-sm mb-2">{item.label}</p>
            <p className={`text-2xl md:text-4xl font-bold text-${item.color}-400 break-words`}>{item.value}</p>
            {item.subvalue && <p className="text-xs md:text-sm text-gray-500 mt-1">{item.subvalue}</p>}
          </div>
        ))}
      </div>

      {/* Botón Siguiente Partida */}
      <div className="flex flex-col gap-3 md:gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        <Button
          onClick={handlePlayAgain}
          className="w-full py-4 md:py-6 text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-105"
        >
          Siguiente Partida
        </Button>
      </div>
    </div>
  );
}
