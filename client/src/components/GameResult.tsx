import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

/**
 * Design Philosophy: Dinámico y Energético
 * - Pantalla de resultado con animaciones celebratorias
 * - Colores vibrantes según el resultado
 * - Botón para reiniciar el juego
 */
interface GameResultProps {
  onPlayAgain: () => void;
}

export default function GameResult({ onPlayAgain }: GameResultProps) {
  const { gameState } = useGame();

  const isImpostorCaught = gameState.gameResult === 'impostor-caught';
  const impostorIndex = gameState.impostorIndex + 1;

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Resultado principal */}
      <div className="mb-12 animate-in fade-in zoom-in duration-700">
        <div className="inline-block mb-8 animate-bounce">
          {isImpostorCaught ? (
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663504919489/B3MVqQr6WXFvZ326vTspWX/impostor-badge-fC2LNAW5mnNh3Axfpk7MYi.webp"
              alt="Impostor atrapado"
              className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl"
            />
          ) : (
            <div className="text-8xl md:text-9xl">👑</div>
          )}
        </div>

        <h2
          className={`text-5xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ${
            isImpostorCaught
              ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent'
          }`}
        >
          {isImpostorCaught ? '¡IMPOSTOR ATRAPADO!' : '¡IMPOSTOR GANÓ!'}
        </h2>

        <p className="text-xl text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {isImpostorCaught
            ? `El impostor era el Jugador #${impostorIndex}`
            : `El impostor logró engañar a todos. ¡Mejor suerte la próxima!`}
        </p>
      </div>

      {/* Información del juego */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
            className={`bg-slate-800/50 border border-${item.color}-500/20 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-700`}
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <p className="text-gray-400 text-sm mb-2">{item.label}</p>
            <p className={`text-4xl font-bold text-${item.color}-400`}>{item.value}</p>
            {item.subvalue && <p className="text-sm text-gray-500 mt-1">{item.subvalue}</p>}
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        <Button
          onClick={onPlayAgain}
          className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-105"
        >
          Jugar de Nuevo
        </Button>
      </div>

      {/* Imagen de celebración */}
      <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663504919489/B3MVqQr6WXFvZ326vTspWX/victory-celebration-k6Y5m3poNEMcePdzJfrLhA.webp"
          alt="Celebración"
          className="rounded-xl shadow-2xl shadow-orange-500/30 max-w-full h-auto"
        />
      </div>
    </div>
  );
}
