import { useState } from 'react';

/**
 * Design Philosophy: Dinámico y Energético
 * - Tarjeta con efecto 3D flip al revelar
 * - Colores vibrantes y animaciones fluidas
 * - Indicador visual de estado (activa, revelada, etc)
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
    <div className="perspective h-40 md:h-48">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`relative w-full h-full transition-all duration-500 transform ${
          isFlipping ? 'scale-95' : 'scale-100'
        } ${isActive && !isRevealed ? 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50' : ''} ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Frente de la tarjeta */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-600 rounded-xl border-2 border-yellow-400 flex items-center justify-center shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="text-center">
            <div className="text-5xl mb-2">🎴</div>
            <p className="text-white font-bold text-lg">Jugador #{playerNumber}</p>
          </div>
        </div>

        {/* Reverso de la tarjeta */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl border-2 border-gray-600 flex items-center justify-center shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">✓</div>
            <p className="text-gray-300 font-bold text-sm">Revelada</p>
          </div>
        </div>
      </button>

      {/* Indicador de estado */}
      {isActive && !isRevealed && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
      )}
    </div>
  );
}
