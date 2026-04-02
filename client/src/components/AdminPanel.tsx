import { useState } from 'react';
import { useGame, Footballer } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

/**
 * Design Philosophy: Dinámico y Energético
 * - Panel de administración con interfaz clara
 * - Permite agregar, editar y eliminar futbolistas
 * - Colores vibrantes con efectos de hover
 */
export default function AdminPanel() {
  const { gameState, setFootballers } = useGame();
  const [newFootballer, setNewFootballer] = useState({ name: '', position: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddFootballer = () => {
    if (newFootballer.name.trim() && newFootballer.position.trim()) {
      const footballer: Footballer = {
        id: Date.now().toString(),
        name: newFootballer.name,
        position: newFootballer.position,
      };

      setFootballers([...gameState.footballers, footballer]);
      setNewFootballer({ name: '', position: '' });
    }
  };

  const handleDeleteFootballer = (id: string) => {
    setFootballers(gameState.footballers.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm sticky top-8 hover:border-orange-500/30 transition-all duration-300 animate-in fade-in slide-in-from-right-4 duration-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        Panel de Administración
      </h3>

      {/* Formulario para agregar futbolista */}
      <div className="mb-6 pb-6 border-b border-slate-700">
        <p className="text-sm text-gray-400 mb-3">Agregar nuevo futbolista</p>

        <div className="space-y-2 mb-3">
          <input
            type="text"
            placeholder="Nombre del futbolista"
            value={newFootballer.name}
            onChange={(e) => setNewFootballer({ ...newFootballer, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-sm transition-all duration-300"
          />

          <input
            type="text"
            placeholder="Posición (ej: Delantero)"
            value={newFootballer.position}
            onChange={(e) => setNewFootballer({ ...newFootballer, position: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-sm transition-all duration-300"
          />
        </div>

        <Button
          onClick={handleAddFootballer}
          className="w-full py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
        >
          <Plus size={16} />
          Agregar
        </Button>
      </div>

      {/* Lista de futbolistas */}
      <div>
        <p className="text-sm text-gray-400 mb-3">
          Futbolistas disponibles ({gameState.footballers.length})
        </p>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {gameState.footballers.map((footballer, idx) => (
            <div
              key={footballer.id}
              className="flex items-center justify-between p-2 bg-slate-700/30 border border-slate-600/50 rounded hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 animate-in fade-in"
              style={{
                animationDelay: `${idx * 30}ms`,
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{footballer.name}</p>
                <p className="text-xs text-gray-400 truncate">{footballer.position}</p>
              </div>

              <button
                onClick={() => handleDeleteFootballer(footballer.id)}
                className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all duration-300 hover:scale-110"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Información útil */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-xs text-gray-500 text-center">
          💡 Personaliza la lista de futbolistas antes de comenzar el juego
        </p>
      </div>
    </div>
  );
}
