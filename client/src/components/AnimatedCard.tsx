import { ReactNode } from 'react';

/**
 * Design Philosophy: Dinámico y Energético
 * - Componente reutilizable para tarjetas con animaciones
 * - Efectos de entrada y transiciones fluidas
 */
interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
