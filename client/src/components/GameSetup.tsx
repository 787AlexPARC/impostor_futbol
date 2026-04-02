import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { footballerCategories, getFootballersByCategory } from '@/data/footballerCategories';
import AdminPanel from './AdminPanel';
import CategorySelector from './CategorySelector';

/**
 * Design Philosophy: Dinámico y Energético
 * - Flujo de setup con selector de categorías y cantidad de jugadores
 * - Animaciones de transición entre pasos
 * - Colores vibrantes y contraste alto
 */
interface GameSetupProps {
  showAdmin: boolean;
}

type SetupStep = 'category' | 'players';

export default function GameSetup({ showAdmin }: GameSetupProps) {
  const { startGame, gameState, setFootballers } = useGame();
  const [setupStep, setSetupStep] = useState<SetupStep>('category');
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);

  const playerOptions = [2, 3, 4, 5, 6, 7, 8];

  const handleCategorySelected = (categoryId: string) => {
    // Cargar futbolistas de la categoría seleccionada
    const footballers = getFootballersByCategory(categoryId);
    setFootballers(footballers);
    setSetupStep('players');
  };

  const handleStartGame = () => {
    if (selectedPlayers) {
      startGame(selectedPlayers);
    }
  };

  const handleBackToCategory = () => {
    setSetupStep('category');
    setSelectedPlayers(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel principal */}
      <div className="lg:col-span-2">
        <div className="max-w-2xl">
          {setupStep === 'category' ? (
            <>
              {/* Hero section */}
              <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="mb-6 inline-block">
                  <div className="relative hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663504919489/B3MVqQr6WXFvZ326vTspWX/hero-impostor-futbol-cn7VgDt7aLNZHt8gsupnSQ.webp"
                      alt="Impostor Futbol"
                      className="rounded-xl shadow-2xl shadow-orange-500/30 max-w-full h-auto"
                    />
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  ¿Quién es el Impostor?
                </h2>

                <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                  Presiona las cartas para revelar futbolistas. Todos ven el mismo jugador, excepto el impostor que ve uno diferente. ¡Descúbrelo!
                </p>
              </div>

              {/* Selector de categorías */}
              <CategorySelector onCategorySelected={handleCategorySelected} />

              {/* Instrucciones */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {[
                  { step: '1', title: 'Categoría', desc: 'Elige los futbolistas con los que quieres jugar' },
                  { step: '2', title: 'Jugadores', desc: 'Selecciona cuántos van a participar' },
                  { step: '3', title: 'Juega', desc: 'Presiona cartas y descubre al impostor' },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6 text-center hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-3xl font-bold text-orange-400 mb-2">{item.step}</div>
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Selector de jugadores */}
              <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-block mb-6">
                  <div className="text-6xl">⚽</div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  {footballerCategories.find((c) => c.id === gameState.selectedCategory)?.name}
                </h2>

                <p className="text-lg text-gray-300 mb-8">
                  Ahora selecciona cuántos jugadores van a participar
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Cantidad de jugadores
                </h3>

                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
                  {playerOptions.map((num, idx) => (
                    <button
                      key={num}
                      onClick={() => setSelectedPlayers(num)}
                      className={`py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-110 animate-in fade-in delay-${idx * 50} ${
                        selectedPlayers === num
                          ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg shadow-orange-500/50 scale-110'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-slate-600/50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleBackToCategory}
                    className="flex-1 py-6 text-lg font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
                  >
                    ← Volver
                  </Button>

                  <Button
                    onClick={handleStartGame}
                    disabled={!selectedPlayers}
                    className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-105"
                  >
                    ¡COMENZAR JUEGO!
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Panel de administración */}
      {showAdmin && (
        <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-700">
          <AdminPanel />
        </div>
      )}
    </div>
  );
}
