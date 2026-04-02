import { useState } from 'react';

/**
 * Design Philosophy: Dinámico y Energético
 * - Tarjeta con efecto 3D flip al revelar
 * - Colores vibrantes y animaciones fluidas
 * - Indicador visual de estado (activa, revelada, etc)
 * - Completamente responsivo para móviles
 */
interface PlayerCardProps {
  playerNumber: number;
  isActive: boolean;
  isRevealed: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function PlayerCard({
  playerNumber,
  isActive,
  isRevealed,
  onClick,
  disabled,
}: PlayerCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsFlipping(true);
      setTimeout(() => {
        onClick();
      }, 300);
    }
  };

  return (
    <div className="perspective w-full aspect-square">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`relative w-full h-full transition-all duration-500 transform ${
          isFlipping ? 'scale-95' : 'scale-100'
        } ${isActive && !isRevealed ? 'ring-2 md:ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50' : ''} ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Frente de la tarjeta */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-600 rounded-lg md:rounded-xl border-2 flex items-center justify-center shadow-lg md:shadow-xl border-yellow-400"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="text-center">
            <div className="text-3xl md:text-5xl mb-1 md:mb-2">🎴</div>
            <p className="text-white font-bold text-xs md:text-lg">Jugador #{playerNumber}</p>
          </div>
        </div>

        {/* Reverso de la tarjeta */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg md:rounded-xl border-2 border-gray-600 flex items-center justify-center shadow-lg md:shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <div className="text-2xl md:text-4xl mb-1 md:mb-2">✓</div>
            <p className="text-gray-300 font-bold text-xs md:text-sm">Revelada</p>
          </div>
        </div>
      </button>

      {/* Indicador de estado */}
      {isActive && !isRevealed && (
        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 md:w-6 h-4 md:h-6 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
      )}
    </div>
  );
}
