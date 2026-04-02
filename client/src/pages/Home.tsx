import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import GameSetup from '@/components/GameSetup';
import GameBoard from '@/components/GameBoard';
import GameFinish from '@/components/GameFinish';

/**
 * Design Philosophy: Dinámico y Energético
 * - Colores vibrantes: azul eléctrico (#0066FF), naranja quemado (#FF6B00), dorado (#FFD700)
 * - Animaciones fluidas y transiciones dinámicas
 * - Tipografía audaz (Bebas Neue) para títulos
 * - Elementos asimétricos que crean tensión visual
 */
export default function Home() {
  const { gameState, resetGame } = useGame();
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Fondo decorativo con patrón de movimiento */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><line x1=%220%22 y1=%220%22 x2=%22100%22 y2=%22100%22 stroke=%22white%22 stroke-width=%220.5%22/><line x1=%22100%22 y1=%220%22 x2=%220%22 y2=%22100%22 stroke=%22white%22 stroke-width=%220.5%22/></svg>')] bg-repeat"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-blue-500/20 bg-black/30 backdrop-blur-sm">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚽</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                IMPOSTOR FUTBOL
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdmin(!showAdmin)}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              {showAdmin ? 'Cerrar' : 'Admin'}
            </Button>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="container py-8">
          {!gameState.gameStarted ? (
            <GameSetup showAdmin={showAdmin} />
          ) : gameState.gamePhase === 'playing' ? (
            <GameBoard />
          ) : (
            <GameFinish />
          )}
        </main>
      </div>
    </div>
  );
}
