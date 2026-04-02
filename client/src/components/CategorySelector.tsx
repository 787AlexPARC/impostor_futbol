import { useGame } from '@/contexts/GameContext';
import { footballerCategories } from '@/data/footballerCategories';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

/**
 * Design Philosophy: Dinámico y Energético
 * - Selector de categorías con tarjetas interactivas
 * - Animaciones de entrada y transiciones fluidas
 * - Colores vibrantes y efectos de hover dinámicos
 * - Efectos visuales que reflejan la energía del fútbol
 */
interface CategorySelectorProps {
  onCategorySelected: (categoryId: string) => void;
}

export default function CategorySelector({ onCategorySelected }: CategorySelectorProps) {
  const { gameState, setSelectedCategory } = useGame();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategorySelected(categoryId);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Elige tu Categoría
        </h2>
        <p className="text-lg text-gray-300">
          Selecciona los futbolistas con los que quieres jugar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {footballerCategories.map((category, idx) => (
          <button
            key={category.id}
            onClick={() => handleSelectCategory(category.id)}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 animate-in fade-in ${
              gameState.selectedCategory === category.id
                ? 'bg-gradient-to-br from-blue-600 to-orange-600 border-2 border-yellow-400 shadow-2xl shadow-orange-500/50'
                : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-blue-500/30 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/30'
            }`}
            style={{
              animationDelay: `${idx * 50}ms`,
            }}
          >
            {/* Fondo animado con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-orange-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-orange-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>

            {/* Líneas de movimiento decorativas */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent"></div>
            </div>

            {/* Contenido */}
            <div className="relative z-10 p-6">
              <div className="text-6xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 inline-block">
                {category.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                {category.name}
              </h3>

              <p className="text-sm text-gray-300 mb-4 group-hover:text-gray-100 transition-colors duration-300 text-left">
                {category.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 group-hover:border-yellow-400/30 transition-colors duration-300">
                <span className="text-xs font-semibold text-orange-400 group-hover:text-yellow-400 transition-colors duration-300">
                  {category.footballers.length} jugadores
                </span>

                {gameState.selectedCategory === category.id ? (
                  <span className="text-sm font-bold text-yellow-300 flex items-center gap-1 animate-pulse">
                    ✓ Seleccionado
                  </span>
                ) : (
                  <ChevronRight
                    size={18}
                    className="text-orange-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300"
                  />
                )}
              </div>
            </div>

            {/* Borde brillante en hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-xl transition-all duration-300 pointer-events-none"></div>
          </button>
        ))}
      </div>

      {/* Botón para continuar */}
      {gameState.selectedCategory && (
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-block">
            <Button
              onClick={() => {
                /* El componente padre manejará esto */
              }}
              className="py-6 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-105 flex items-center gap-2"
            >
              Continuar con {footballerCategories.find((c) => c.id === gameState.selectedCategory)?.name}
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-12 text-center text-sm text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <p>💡 Cada categoría tiene diferentes futbolistas. ¡Prueba todas!</p>
      </div>
    </div>
  );
}
